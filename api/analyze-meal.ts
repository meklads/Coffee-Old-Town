// /pages/api/analyze-meal.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenAI, Type } from '@google/genai';
import sharp from 'sharp';

interface AnalyzeMealRequest {
  base64Image: string;
  profile?: any;
  lang?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { base64Image, profile, lang }: AnalyzeMealRequest = req.body;
    if (!base64Image) return res.status(400).json({ error: 'No image provided' });

    // تحويل Base64 إلى Buffer والتحقق من الأبعاد
    const matches = base64Image.match(/^data:image\/\w+;base64,(.+)$/);
    const data = matches ? matches[1] : base64Image;
    const imageBuffer = Buffer.from(data, 'base64');
    const metadata = await sharp(imageBuffer).metadata();

    if (!metadata.width || !metadata.height || metadata.width < 200 || metadata.height < 200) {
      return res.status(400).json({ error: 'Image too small or unclear. Please provide a clearer photo of the meal.' });
    }

    if (!process.env.API_KEY) return res.status(500).json({ error: 'SYSTEM_FAULT: API key missing.' });

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const persona = profile?.persona || 'GENERAL';
    const languageInstruction = lang === 'ar'
      ? 'يجب أن تكون الاستجابة باللغة العربية الفصحى فقط.'
      : 'Response must be entirely in English.';

    const mealAnalysisSchema = {
      type: Type.OBJECT,
      properties: {
        ingredients: {
          type: Type.ARRAY,
          items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, calories: { type: Type.NUMBER } }, required: ['name','calories'] }
        },
        totalCalories: { type: Type.NUMBER },
        healthScore: { type: Type.NUMBER },
        macros: { type: Type.OBJECT, properties: { protein: { type: Type.NUMBER }, carbs: { type: Type.NUMBER }, fat: { type: Type.NUMBER } }, required: ['protein','carbs','fat'] },
        summary: { type: Type.STRING },
        personalizedAdvice: { type: Type.STRING }
      },
      required: ['ingredients','totalCalories','healthScore','macros','summary','personalizedAdvice']
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data, mimeType: 'image/jpeg' } },
          { text: `تحليل الطبق بناءً على بروتوكول: ${persona}. ${languageInstruction} أعد النتيجة بصيغة JSON.` }
        ]
      },
      config: { responseMimeType: 'application/json', responseSchema: mealAnalysisSchema, temperature: 0.1 }
    });

    if (!response.text) return res.status(500).json({ error: 'Failed to analyze meal' });

    const result = JSON.parse(response.text.trim());
    res.status(200).json(result);

  } catch (error: any) {
    console.error('Analyze Meal Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze meal' });
  }
}
