
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { MealAnalysisResult } from '../types.ts';

const SUPABASE_URL = 'https://jripcmjmaqkniciidiqv.supabase.co'; 
const SUPABASE_ANON_KEY: string = 'sb_publishable_cPQBX--YPJZY05S98Tg9TA_qCGBVo8H'; 

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const testConnection = async (): Promise<boolean> => {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from('meals_history').select('id').limit(1);
    return !error || error.code === 'PGRST116';
  } catch (e) {
    return false;
  }
};

export const syncMealToCloud = async (meal: MealAnalysisResult) => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('meals_history')
      .insert([
        {
          summary: meal.summary,
          calories: meal.totalCalories,
          health_score: meal.healthScore,
          protein: meal.macros.protein,
          carbs: meal.macros.carbs,
          fat: meal.macros.fat,
          image_url: meal.imageUrl,
          advice: meal.personalizedAdvice
        }
      ]);
    return data;
  } catch (err) {
    return null;
  }
};

export const fetchCloudHistory = async () => {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('meals_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];
    
    return (data || []).map(item => ({
      summary: item.summary || 'Untitled Meal',
      totalCalories: Number(item.calories) || 0,
      healthScore: Number(item.health_score) || 0,
      macros: {
        protein: Number(item.protein) || 0,
        carbs: Number(item.carbs) || 0,
        fat: Number(item.fat) || 0
      },
      personalizedAdvice: item.advice || '',
      imageUrl: item.image_url || '',
      timestamp: item.created_at ? new Date(item.created_at).toLocaleString() : new Date().toLocaleString()
    }));
  } catch (err) {
    // معالجة خطأ "Failed to fetch" بصمت
    return [];
  }
};
