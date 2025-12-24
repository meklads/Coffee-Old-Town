
import React, { createContext, useContext, useState } from 'react';
import { Language } from '../translations.ts';
import { MealAnalysisResult, ViewType, Recipe, FeedbackEntry, FeedbackSignal, Theme } from '../types.ts';

export type UserTier = 'free' | 'pro' | 'elite';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  tier: UserTier;
  setTier: (tier: UserTier) => void;
  theme: Theme;
  toggleTheme: () => void;
  scansCount: number;
  incrementScans: (result: MealAnalysisResult) => void;
  history: MealAnalysisResult[];
  clearHistory: () => void;
  lastAnalysisResult: MealAnalysisResult | null;
  setLastAnalysisResult: (result: MealAnalysisResult | null) => void;
  setView: (view: ViewType) => void;
  view: ViewType;
  scrollTo: (id: string) => void;
  selectedRecipe: Recipe | null;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  selectedGoal: string | null;
  setSelectedGoal: (goal: string | null) => void;
  feedbackHistory: FeedbackEntry[];
  submitFeedback: (signal: FeedbackSignal) => void;
  isCloudConnected: boolean;
  setIsCloudConnected: (connected: boolean) => void;
  // الحالة العالمية الجديدة للمفتاح
  isApiKeyLinked: boolean;
  setIsApiKeyLinked: (status: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
