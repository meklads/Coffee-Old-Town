
import { GoogleGenAI, Type } from "@google/genai";
import { UserHealthProfile, MealAnalysisResult, MealPlanRequest, DayPlan, FeedbackEntry } from '../types.ts';

// Initialize the AI client using the mandatory environment variable
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const mealAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          calories: { type: Type.NUMBER }
        },
        required: ["name", "calories"]
      }
    },
    totalCalories: { type: Type.NUMBER },
    healthScore: { type: Type.NUMBER },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fat: { type: Type.NUMBER }
      },
      required: ["protein", "carbs", "fat"]
    },
    summary: { type: Type.STRING },
    personalizedAdvice: { type: Type.STRING }
  },
  required: ["ingredients", "totalCalories", "healthScore", "macros", "summary", "personalizedAdvice"]
};

export const analyzeMealImage = async (base64Image: string, profile: UserHealthProfile): Promise<MealAnalysisResult | null> => {
  try {
    const ai = getAI();
    // Ensure we only send the raw base64 data without the data:image/jpeg;base64, prefix
    const cleanBase64 = base64Image.includes('base64,') ? base64Image.split('base64,')[1] : base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { 
            inlineData: { 
              data: cleanBase64, 
              mimeType: 'image/jpeg' 
            } 
          },
          { 
            text: "Conduct a precise metabolic and nutritional analysis of this meal. Provide a health score (0-100), detailed macro breakdown, and specific biological advice based on the ingredients identified. Output ONLY valid JSON." 
          }
        ]
      },
      config: { 
        responseMimeType: "application/json", 
        responseSchema: mealAnalysisSchema,
        temperature: 0.1 // Keep it precise for nutritional data
      }
    });

    if (!response || !response.text) {
      throw new Error("Empty response from Gemini API");
    }

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Critical Analysis Error:", error);
    return null;
  }
};

export const generateMealPlan = async (request: MealPlanRequest, lang: string, feedback: FeedbackEntry[] = []): Promise<DayPlan | null> => {
  try {
    const ai = getAI();
    const prompt = `Generate a 1-day metabolic nutrition plan for goal: ${request.goal}. Diet: ${request.diet}. Context: ${JSON.stringify(feedback.slice(0, 3))}. Language: ${lang}. Output JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Plan Generation Error:", error);
    return null;
  }
};

export const isSystemKeyAvailable = async (): Promise<boolean> => {
  return !!process.env.API_KEY;
};

export const generateMascot = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional minimalist health icon for: ${prompt}` }] }
    });
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch { return null; }
};
