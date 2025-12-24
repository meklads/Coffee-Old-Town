
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Activity, Sun, CloudSun, Moon, CheckCircle2, Lock, ShieldCheck, Waves, Key, Link as LinkIcon } from 'lucide-react';
import { SectionId, MealPlanRequest, DayPlan, FeedbackSignal } from '../types.ts';
import { generateMealPlan, isSystemKeyAvailable } from '../services/geminiService.ts';
import { useApp } from '../context/AppContext.tsx';

const SmartNutritionTool: React.FC = () => {
  const { selectedGoal, setSelectedGoal, feedbackHistory, submitFeedback, tier } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DayPlan | null>(null);
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);
  const [isLinked, setIsLinked] = useState<boolean>(false);
  const [request, setRequest] = useState<MealPlanRequest>({
    goal: 'general_health',
    diet: 'balanced',
  });

  const checkLinkStatus = async () => {
    if (isSystemKeyAvailable()) {
      setIsLinked(true);
      return;
    }
    const win = window as any;
    const studio = win.aistudio || win.parent?.aistudio || win.top?.aistudio;
    const hasLocal = studio && typeof studio.hasSelectedApiKey === 'function' && await studio.hasSelectedApiKey();
    setIsLinked(!!hasLocal);
  };

  useEffect(() => {
    checkLinkStatus();
    const inv = setInterval(checkLinkStatus, 5000);
    return () => clearInterval(inv);
  }, []);

  useEffect(() => {
    if (selectedGoal && !loading && isLinked) {
      handleGenerate(selectedGoal);
    }
  }, [selectedGoal, isLinked]);

  const handleConnectAI = async () => {
    const win = window as any;
    const studio = win.aistudio || win.parent?.aistudio || win.top?.aistudio;
    if (studio && typeof studio.openSelectKey === 'function') {
      await studio.openSelectKey();
      setIsLinked(true);
    }
  };

  const handleGenerate = async (targetGoal?: string) => {
    if (!isLinked) return;
    setLoading(true);
    setResult(null);
    setHasSubmittedFeedback(false);
    try {
      const effectiveGoal = targetGoal || selectedGoal || request.goal;
      const plan = await generateMealPlan({ ...request, goal: effectiveGoal }, 'en', feedbackHistory);
      if (plan) setResult(plan);
    } catch (error) {
      console.error("Synthesis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (signal: FeedbackSignal) => {
    submitFeedback(signal);
    setHasSubmittedFeedback(true);
  };

  return (
    <section id={SectionId.PHASE_03_SYNTHESIS} className="py-32 md:py-48 bg-brand-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-20 space-y-6">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-dark text-brand-primary rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-lg">
              <Activity size={14} />
              <span>PHASE 03: SYNTHESIS LAB</span>
           </div>
           <h2 className="text-4xl md:text-7xl font-serif font-bold text-brand-dark tracking-tighter leading-none">
             Your system for <span className="text-brand-primary italic font-normal">Today.</span>
           </h2>
        </div>

        <div className="bg-white rounded-[64px] border border-brand-dark/[0.02] p-8 lg:p-16 shadow-3xl relative flex flex-col min-h-[600px]">
          {!isLinked ? (
             <div className="flex-grow flex flex-col items-center justify-center text-center space-y-10 p-12">
               <div className="w-24 h-24 bg-brand-primary/5 rounded-full flex items-center justify-center text-brand-primary border border-brand-primary/10 animate-pulse">
                 <Lock size={40} />
               </div>
               <div className="space-y-6 max-w-md">
                 <h4 className="text-3xl font-serif font-bold text-brand-dark tracking-tighter">Connection Required.</h4>
                 <p className="text-brand-dark/40 text-sm font-medium italic">
                   يرجى ربط مفتاح API لتفعيل نظام التحليل الحيوي وتوليد الخطط الغذائية الذكية.
                 </p>
                 <button 
                  onClick={handleConnectAI}
                  className="px-10 py-5 bg-brand-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl flex items-center gap-4 mx-auto hover:bg-brand-dark transition-all"
                 >
                   <LinkIcon size={18} />
                   Establish Cloud Bridge
                 </button>
               </div>
             </div>
          ) : loading ? (
            <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12 space-y-10">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-brand-primary/10 border-t-brand-primary animate-spin" />
                  <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary" size={24} />
               </div>
               <div className="space-y-2">
                  <h4 className="text-2xl font-serif font-bold text-brand-dark tracking-tighter uppercase">Mapping Biometrics</h4>
                  <p className="text-brand-dark/30 text-sm font-medium italic">Synchronizing cloud data...</p>
               </div>
            </div>
          ) : result ? (
            <div className="w-full animate-fade-in-up flex-grow flex flex-col space-y-16">
              <div className="grid md:grid-cols-3 gap-8">
                 {[
                   { l: 'Morning', icon: <Sun size={20} />, d: result.breakfast },
                   { l: 'Midday', icon: <CloudSun size={20} />, d: result.lunch },
                   { l: 'Evening', icon: <Moon size={20} />, d: result.dinner }
                 ].map((meal, idx) => (
                   <div key={idx} className="bg-brand-light/50 p-8 rounded-[40px] border border-brand-dark/[0.02] flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-8 text-brand-primary">
                         {meal.icon}
                         <span className="text-[9px] font-black uppercase tracking-[0.3em]">{meal.l}</span>
                      </div>
                      <h4 className="text-xl font-serif font-bold text-brand-dark mb-3 leading-tight">{meal.d?.name}</h4>
                      <p className="text-xs text-brand-dark/40 font-medium italic leading-relaxed flex-grow line-clamp-3">
                         {meal.d?.description}
                      </p>
                      <div className="pt-6 border-t border-brand-dark/5 mt-6">
                         <span className="text-lg font-serif font-bold text-brand-primary">{meal.d?.calories} KCAL</span>
                      </div>
                   </div>
                 ))}
              </div>
              
              <div className="bg-brand-dark rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10">
                 <div className="space-y-3">
                    <h4 className="text-2xl font-serif font-bold text-brand-primary tracking-tight">System Insight</h4>
                    <p className="text-white/40 italic font-medium max-w-lg leading-relaxed text-base">"{result.advice}"</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center min-w-[180px]">
                    <p className="text-[8px] font-black text-brand-primary uppercase tracking-[0.4em] mb-1">TOTAL LOAD</p>
                    <p className="text-4xl font-serif font-bold">{result.totalCalories}</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-10">
              <Waves className="text-brand-primary/10" size={64} />
              <div className="space-y-2">
                <h4 className="text-2xl font-serif font-bold text-brand-dark/10 tracking-tighter uppercase">Synthesis Matrix Idle</h4>
                <p className="text-brand-dark/30 text-sm font-medium italic">Go back to Phase 02 to choose your intent.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SmartNutritionTool;
