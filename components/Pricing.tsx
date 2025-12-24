
import React, { useState } from 'react';
import { Check, Zap, Crown, Loader2, ArrowRight } from 'lucide-react';
import { SectionId } from '../types.ts';
// Fix: Import useApp and UserTier from its source context file
import { useApp, UserTier } from '../context/AppContext.tsx';

const Pricing: React.FC = () => {
  const { tier, setTier, language } = useApp();
  const [loadingTier, setLoadingTier] = useState<UserTier | null>(null);

  const handleUpgrade = (newTier: UserTier) => {
    setLoadingTier(newTier);
    setTimeout(() => {
      setTier(newTier);
      setLoadingTier(null);
      document.getElementById(SectionId.PHASE_04_ARCHIVE)?.scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  };

  const plans = [
    {
      id: 'free' as UserTier,
      name: language === 'en' ? 'Transient Basic' : 'الأساس المؤقت',
      price: 'Free',
      desc: language === 'en' ? 'Daily snapshots without longitudinal memory.' : 'لقطات يومية بدون ذاكرة طويلة الأمد.',
      features: ['1 Bio-Scan per day', 'Transient System Memory', 'Standard Protocol Access'],
      cta: 'Start Exploration',
      highlight: false
    },
    {
      id: 'pro' as UserTier,
      name: language === 'en' ? 'Clinical Persistence' : 'الاستمرارية السريرية',
      price: '$19',
      desc: language === 'en' ? 'The system evolves with every feedback pulse.' : 'نظام يتطور مع كل نبضة تغذية راجعة.',
      features: [
        'Unlimited Bio-Scans', 
        'Permanent Feedback Synchronization', 
        'Metabolic Drift Analysis', 
        '24/7 AI Protocol Support'
      ],
      cta: 'Activate Persistence',
      highlight: true,
      icon: <Zap size={20} />
    },
    {
      id: 'elite' as UserTier,
      name: language === 'en' ? 'Predictive Elite' : 'النخبة التنبؤية',
      price: '$99',
      desc: language === 'en' ? 'The ultimate outcome-driven bio-vault.' : 'خزانة التحسين الحيوي القصوى للنتائج.',
      features: [
        'Predictive Success Mapping',
        'Custom Molecular Archives',
        'API Integration for Devices',
        'Direct Access to Senior Analysts'
      ],
      cta: 'Establish Elite Link',
      highlight: false
    }
  ];

  return (
    <section id={SectionId.PHASE_05_UPGRADE} className="py-32 bg-brand-light relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-28 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-brand-dark text-brand-primary rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-xl">
            <Crown size={14} />
            <span>VALUE PERSPECTIVE</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-serif font-bold text-brand-dark tracking-tighter leading-none">
            Invest in your <br /> <span className="text-brand-primary italic">Permanence.</span>
          </h2>
          <p className="text-brand-dark/40 text-xl font-medium italic max-w-2xl mx-auto">
            Shift from one-time snapshots to a lifelong metabolic evolution.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 items-stretch">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative p-12 rounded-[56px] border transition-all duration-700 flex flex-col h-full
                ${plan.highlight 
                  ? 'bg-brand-dark text-white border-brand-primary shadow-[0_80px_100px_-40px_rgba(175,139,69,0.3)] scale-105 z-20' 
                  : 'bg-white text-brand-dark border-brand-dark/5 shadow-sm hover:shadow-2xl z-10'} 
                ${tier === plan.id ? 'ring-2 ring-brand-primary' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-primary text-white text-[9px] font-black px-6 py-2.5 rounded-full uppercase tracking-[0.4em] shadow-xl">
                  OPTIMAL OUTCOME
                </div>
              )}
              
              <div className="mb-12 space-y-4">
                <div className="flex items-center gap-3">
                   {plan.icon && <span className="text-brand-primary">{plan.icon}</span>}
                   <h3 className={`text-xl font-serif font-bold tracking-tight ${plan.highlight ? 'text-brand-primary' : 'text-brand-dark'}`}>
                     {plan.name}
                   </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-serif font-bold">{plan.price}</span>
                  {plan.price !== 'Free' && <span className="text-xs opacity-40 uppercase tracking-widest">USD / Mo</span>}
                </div>
                <p className={`text-sm font-medium italic ${plan.highlight ? 'text-white/40' : 'text-brand-dark/40'}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="space-y-6 mb-16 flex-grow">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-4">
                    <div className={`mt-1 p-0.5 rounded-full ${plan.highlight ? 'text-brand-primary' : 'text-brand-dark/20'}`}>
                      <Check size={16} />
                    </div>
                    <span className={`text-[11px] font-black uppercase tracking-widest ${plan.highlight ? 'text-white/80' : 'text-brand-dark/60'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={tier === plan.id || !!loadingTier}
                className={`w-full py-7 rounded-[28px] font-black text-[10px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 group/btn
                  ${tier === plan.id 
                    ? 'bg-brand-primary/20 text-brand-primary cursor-default' 
                    : plan.highlight 
                      ? 'bg-brand-primary text-white hover:bg-white hover:text-brand-dark shadow-2xl' 
                      : 'bg-brand-dark text-white hover:bg-brand-primary shadow-xl'}`}
              >
                {loadingTier === plan.id ? <Loader2 className="animate-spin" size={16} /> : null}
                {tier === plan.id ? 'ACTIVE PROTOCOL' : plan.cta}
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
