
import React, { useState, useEffect } from 'react';
import { Sparkles, Activity, Sun, CloudSun, Moon, ShieldPlus, Zap, FlaskConical, Beaker, Waves, ChevronRight } from 'lucide-react';
import { SectionId, DayPlan } from '../types.ts';
import { generateMealPlan } from '../services/geminiService.ts';
import { useApp } from '../context/AppContext.tsx';

const SmartNutritionTool: React.FC = () => {
  const { selectedGoal, setSelectedGoal, feedbackHistory, language } = useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DayPlan | null>(null);

  const protocols = [
    { 
      id: 'immunity', 
      label: language === 'ar' ? 'تعزيز المناعة' : 'Immunity Boost', 
      icon: <ShieldPlus size={18} />, 
      tag: 'RESILIENCE',
      desc: language === 'ar' ? 'تحسين الدفاع الخلوي.' : 'Cellular defense optimization.'
    },
    { 
      id: 'recovery', 
      label: language === 'ar' ? 'الاستشفاء الحيوي' : 'Bio-Recovery', 
      icon: <Activity size={18} />, 
      tag: 'REPAIR',
      desc: language === 'ar' ? 'تنظيف المخلفات الأيضية.' : 'Metabolic waste clearance.'
    },
    { 
      id: 'focus', 
      label: language === 'ar' ? 'التركيز الذهني' : 'Neural Focus', 
      icon: <Zap size={18} />, 
      tag: 'COGNITION',
      desc: language === 'ar' ? 'تعزيز القدرة المشبكية.' : 'Synaptic throughput enhancement.'
    }
  ];

  const handleGenerate = async (goalLabel: string) => {
    setSelectedGoal(goalLabel);
    setLoading(true);
    setResult(null);
    try {
      const plan = await generateMealPlan({ goal: goalLabel, diet: 'balanced' }, language, feedbackHistory);
      if (plan) setResult(plan);
    } catch (error) {
      console.error("Synthesis Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id={SectionId.PHASE_03_SYNTHESIS} className="py-32 md:py-48 bg-zinc-50 dark:bg-zinc-950 relative overflow-hidden transition-colors duration-1000 border-y border-brand-dark/5 dark:border-white/5">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C2A36B 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-24 space-y-6">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-dark dark:bg-brand-primary/10 text-brand-primary rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-lg border border-brand-primary/20">
              <FlaskConical size={14} className="animate-pulse" />
              <span>{language === 'ar' ? 'المرحلة 03: التخليق الذكي' : 'PHASE 03: INTELLIGENT SYNTHESIS'}</span>
           </div>
           <h2 className="text-4xl md:text-7xl font-serif font-bold text-brand-dark dark:text-white tracking-tighter leading-none">
             Protocol <span className="text-brand-primary italic font-normal">Synthesis.</span>
           </h2>
           <p className="text-brand-dark/40 dark:text-white/30 text-lg font-medium italic max-w-xl mx-auto">
             {language === 'ar' ? 'اختر هدفك وسيقوم المختبر بمعالجة بياناتك لتوليد بروتوكول غذائي دقيق.' : 'Select your intent and let the lab process your biometric data to synthesize a precision plan.'}
           </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            {protocols.map((item) => (
              <button 
                key={item.id}
                onClick={() => handleGenerate(item.label)}
                disabled={loading}
                className={`w-full group relative p-8 rounded-[40px] border transition-all duration-700 text-left overflow-hidden
                  ${selectedGoal === item.label 
                    ? 'bg-brand-primary/20 border-brand-primary/40 shadow-2xl' 
                    : 'bg-white dark:bg-white/[0.02] border-brand-dark/10 dark:border-white/5 hover:border-brand-primary/30'}`}
              >
                <div className="relative z-10 flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700
                    ${selectedGoal === item.label ? 'bg-brand-primary text-brand-dark' : 'bg-brand-dark/5 dark:bg-white/5 text-brand-primary/50'}`}>
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[7px] font-black text-brand-primary uppercase tracking-[0.4em] block">{item.tag}</span>
                    <h3 className={`text-xl font-serif font-bold transition-colors ${selectedGoal === item.label ? 'text-brand-dark dark:text-white' : 'text-brand-dark/40 dark:text-white/30'}`}>
                      {item.label}
                    </h3>
                  </div>
                </div>
                <ChevronRight className={`absolute right-8 top-1/2 -translate-y-1/2 transition-all duration-700 ${selectedGoal === item.label ? 'opacity-100 text-brand-primary translate-x-0' : 'opacity-0 translate-x-4'}`} size={20} />
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-zinc-900/60 rounded-[64px] border border-brand-dark/[0.05] dark:border-white/5 p-8 lg:p-16 shadow-3xl relative flex flex-col min-h-[580px] backdrop-blur-3xl">
              {loading ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-10">
                   <div className="relative">
                      <div className="w-24 h-24 rounded-full border-2 border-brand-primary/10 border-t-brand-primary animate-spin" />
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary" size={24} />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-2xl font-serif font-bold text-brand-dark dark:text-white tracking-tighter uppercase">{language === 'ar' ? 'جاري التحليل والربط...' : 'ANALYZING & LINKING...'}</h4>
                      <p className="text-brand-dark/30 dark:text-white/20 text-sm font-medium italic">Calculating molecular outcomes based on your archive...</p>
                   </div>
                </div>
              ) : result ? (
                <div className="w-full animate-fade-in-up space-y-16">
                  <div className="grid md:grid-cols-3 gap-6">
                     {[
                       { l: 'Morning', icon: <Sun size={20} />, d: result.breakfast },
                       { l: 'Midday', icon: <CloudSun size={20} />, d: result.lunch },
                       { l: 'Evening', icon: <Moon size={20} />, d: result.dinner }
                     ].map((meal, idx) => (
                       <div key={idx} className="bg-zinc-50 dark:bg-white/[0.02] p-8 rounded-[40px] border border-brand-dark/[0.02] dark:border-white/5 flex flex-col h-full hover:bg-white dark:hover:bg-white/[0.05] transition-all">
                          <div className="flex items-center gap-3 mb-6 text-brand-primary">
                             {meal.icon}
                             <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-60">{meal.l}</span>
                          </div>
                          <h4 className="text-xl font-serif font-bold text-brand-dark dark:text-white mb-3 leading-tight">{meal.d?.name}</h4>
                          <p className="text-[11px] text-brand-dark/40 dark:text-white/30 font-medium italic leading-relaxed flex-grow line-clamp-3">
                             {meal.d?.description}
                          </p>
                       </div>
                     ))}
                  </div>
                  
                  <div className="bg-brand-dark dark:bg-brand-primary/10 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 border border-white/5">
                     <div className="space-y-3">
                        <h4 className="text-2xl font-serif font-bold text-brand-primary tracking-tight">System Feedback</h4>
                        <p className="text-white/50 italic font-medium max-w-lg leading-relaxed text-sm">"{result.advice}"</p>
                     </div>
                     <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center min-w-[160px] backdrop-blur-xl">
                        <p className="text-[8px] font-black text-brand-primary uppercase tracking-[0.4em] mb-1">TOTAL LOAD</p>
                        <p className="text-4xl font-serif font-bold text-white">{result.totalCalories}</p>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center text-center space-y-10">
                  <Waves className="text-brand-primary/10" size={100} strokeWidth={1} />
                  <div className="space-y-2">
                    <h4 className="text-2xl font-serif font-bold text-brand-dark/10 dark:text-white/10 tracking-tighter uppercase">Protocol Processor Idle</h4>
                    <p className="text-brand-dark/30 dark:text-white/20 text-sm font-medium italic">Select a goal to generate your optimized timeline.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartNutritionTool;
