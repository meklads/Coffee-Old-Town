
import { UserHealthProfile, MealAnalysisResult, MealPlanRequest, DayPlan, FeedbackEntry } from '../types.ts';

export const analyzeMealImage = async (base64Image: string, profile: UserHealthProfile, lang: string = 'en'): Promise<MealAnalysisResult | null> => {
  try {
    const response = await fetch('/api/analyze-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, profile, lang })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error === 'SYSTEM_FAULT: API key missing.') throw new Error("MISSING_KEY");
      throw new Error(errorData.details || "SERVER_ERROR");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Analysis Error:", error);
    if (error.message === "MISSING_KEY") throw new Error("MISSING_KEY");
    throw error;
  }
};

export const generateMealPlan = async (request: MealPlanRequest, lang: string, feedback: FeedbackEntry[] = []): Promise<DayPlan | null> => {
  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ request, lang, feedback })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || "GENERATION_FAULT");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Plan Generation Error:", error);
    throw error;
  }
};

export const generateMascot = async (prompt: string): Promise<string | null> => {
  try {
    const response = await fetch('/api/generate-mascot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Mascot Generation Error:", error);
    return null;
  }
};

export const isSystemKeyAvailable = async (): Promise<boolean> => {
  return true; 
};
