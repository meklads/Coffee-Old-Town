
import { GoogleGenAI, Type } from "@google/genai";
import { UserHealthProfile, MealAnalysisResult, MealPlanRequest, DayPlan, FeedbackEntry } from '../types.ts';

// Initialize the AI client using the environment variable injected by Vercel
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const MEAL_ANALYSIS_SCHEMA = {
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
    personalizedAdvice: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    warnings: {
      type: Type.ARRAY,
      items: { 
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING },
          riskLevel: { type: Type.STRING, description: "low, medium, or high" },
          type: { type: Type.STRING, description: "sugar, sodium, pregnancy, allergy, or general" }
        },
        required: ["text", "riskLevel", "type"]
      },
    },
    scientificSource: { type: Type.STRING }
  },
  required: ["ingredients", "totalCalories", "healthScore", "macros", "summary", "personalizedAdvice", "warnings"]
};

const MEAL_PLAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    breakfast: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["name", "description"]
    },
    lunch: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["name", "description"]
    },
    dinner: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["name", "description"]
    },
    snack: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        description: { type: Type.STRING }
      },
      required: ["name", "description"]
    },
    totalCalories: { type: Type.STRING },
    advice: { type: Type.STRING }
  },
  required: ["breakfast", "lunch", "dinner", "snack", "totalCalories", "advice"]
};

export const analyzeMealImage = async (base64Image: string, profile: UserHealthProfile): Promise<MealAnalysisResult | null> => {
  try {
    const ai = getAI();
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const persona = profile.persona || 'GENERAL';

    let personaContext = "";
    if (persona === 'PREGNANCY') {
      personaContext = "User: PREGNANT. Focus: Folic Acid, Iron, Vitamin D. Warning markers: Unpasteurized dairy, high mercury, caffeine limits.";
    } else if (persona === 'DIABETIC') {
      personaContext = "User: DIABETIC. Focus: Glycemic Load, fiber balance. Warning markers: Hidden sugars, refined carbs.";
    } else if (persona === 'ATHLETE') {
      personaContext = "User: ATHLETE. Focus: Protein synthesis, electrolytes, glycogen replenishment.";
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
          { text: `Scientific metabolic analysis for ${persona} protocol. ${personaContext} Analyze the meal in this image and return precise JSON data.` }
        ]
      },
      config: { 
        responseMimeType: "application/json", 
        responseSchema: MEAL_ANALYSIS_SCHEMA,
        temperature: 0.1
      }
    });

    if (!response.text) throw new Error("Empty response from AI");
    return JSON.parse(response.text.trim()) as MealAnalysisResult;
  } catch (error) {
    console.error("Meal Analysis Error:", error);
    throw error;
  }
};

export const generateMealPlan = async (request: MealPlanRequest, lang: string, feedback: FeedbackEntry[] = []): Promise<DayPlan | null> => {
  try {
    const ai = getAI();
    const prompt = `Synthesize a metabolic daily meal plan for goal: ${request.goal}. Language: ${lang}. 
    User Feedback History: ${JSON.stringify(feedback.slice(0, 3))}. 
    Return a structured day plan including breakfast, lunch, dinner, snack, and general advice.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: MEAL_PLAN_SCHEMA,
        temperature: 0.7
      }
    });

    if (!response.text) return null;
    return JSON.parse(response.text.trim()) as DayPlan;
  } catch (error) {
    console.error("Plan Generation Error:", error);
    return null;
  }
};

export const generateMascot = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High-end laboratory icon, minimalist vector style for: ${prompt}. Pure white background, golden accents, premium feel.` }]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Mascot Generation Error:", error);
    return null;
  }
};

export const isSystemKeyAvailable = async (): Promise<boolean> => {
  return !!process.env.API_KEY;
};
