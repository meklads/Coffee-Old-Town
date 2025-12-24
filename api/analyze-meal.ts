
import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  maxDuration: 60, // Only effective on Pro/Enterprise, but good practice
  api: {
    bodyParser: {
      sizeLimit: '4mb', // Reduced limit to prevent large payloads from slowing down the gateway
    },
  },
};

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

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { image } = req.body;
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY is not configured in environment variables.' });
  }

  if (!image) {
    return res.status(400).json({ error: 'Payload missing image data.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Clean base64 data
    const base64Data = image.includes(',') ? image.split(',')[1] : image;

    // Use gemini-3-flash-preview for fastest multimodal response
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: 'image/jpeg'
            }
          },
          {
            text: "Identify food, calculate calories and health score (0-100). Return ONLY JSON."
          }
        ]
      },
      config: { 
        responseMimeType: "application/json", 
        responseSchema: mealAnalysisSchema,
        temperature: 0.1,
        // Using a smaller thinking budget or disabling it for faster image analysis
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    if (!response.text) {
      throw new Error("No analysis data returned from model.");
    }

    const result = JSON.parse(response.text.trim());
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Critical API Error:", error);
    return res.status(500).json({ 
      error: 'Bio-Bridge Desync', 
      details: error.message,
      suggestion: "Check image clarity and API Key billing status."
    });
  }
}
