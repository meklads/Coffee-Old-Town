import { UserHealthProfile, MealAnalysisResult, MealPlanRequest, DayPlan, FeedbackEntry } from '../types.ts';

export async function analyzeMealImage(base64Image: string, profile: UserHealthProfile, lang: string = 'en'): Promise<MealAnalysisResult | null> {
  const response = await fetch("/api/analyze-meal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ base64Image, profile, lang })
  });

  if (!response.ok) {
    throw new Error("Meal analysis failed");
  }

  return response.json();
}

export async function generateMealPlan(request: MealPlanRequest, lang: string, feedback: FeedbackEntry[] = []): Promise<DayPlan | null> {
  const response = await fetch("/api/generate-meal-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ request, lang, feedback })
  });

  if (!response.ok) {
    throw new Error("Meal plan generation failed");
  }

  return response.json();
}

export async function generateMascot(prompt: string): Promise<string | null> {
  const response = await fetch("/api/generate-mascot", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });

  if (!response.ok) {
    throw new Error("Mascot generation failed");
  }

  const data = await response.json();
  return data.result || null;
}
