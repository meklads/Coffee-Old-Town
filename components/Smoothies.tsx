
import React, { useState } from 'react';
import { SectionId } from '../types.ts';
import { Zap, Activity, ShieldPlus, ArrowUpRight, FlaskConical, CheckCircle2 } from 'lucide-react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';

const Smoothies: React.FC = () => {
  const { scrollTo, setSelectedGoal, language } = useApp();
  const [activeProtocol, setActiveProtocol] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const items = [
    { 
      id: 0,
      t: language === 'ar' ? 'تقوية المناعة' : 'Immunity Boost', 
      desc: language === 'ar' ? 'ادعم جهازك المناعي اليوم.' : 'Support your immune system today.', 
      icon: <ShieldPlus size={20} />, 
      img: "https://images.unsplash.com/photo-1610970882799-64a3ca62bad9?w=1000&q=80"
    },
    { 
      id: 1,
      t: language === 'ar' ? 'التركيز الذهني' : 'Neural Focus', 
      desc: language === 'ar' ? 'ابق متيقظاً لساعات القادمة.' : 'Stay mentally sharp for the next hours.', 
      icon: <Zap size={20} />, 
      img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=1000&q=80"
    },
    { 
      id: 2,
      t: language === 'ar' ? 'الاستشفاء الحيوي' : 'Bio-Recovery', 
      desc: language === 'ar' ? 'ساعد جسمك على التعافي أسرع.' : 'Help your body recover faster.', 
      icon: <Activity size={20} />, 
      img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=80"
    }
  ];

  const handleGoalSelect = (item: typeof items[0]) => {
    setIsSyncing(true);
    setSelectedGoal(item.t);
    // Smooth transition logic to next section
    // Fixed: Property 'AI_TOOL' does not exist on type 'typeof SectionId'. 
    // Mapped to PHASE_03_SYNTHESIS.
    setTimeout(() => {
      scrollTo(SectionId.PHASE_03_SYNTHESIS);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    // Fixed: Property 'SMOOTHIES' does not exist on type 'typeof SectionId'. 
    // Mapped to PHASE_02_PROTOCOLS based on 'PHASE 02' context.
    <section id={SectionId.PHASE_02_PROTOCOLS} className="py-32 md:py-48 relative overflow-hidden bg-[#0D0B0A]">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle, #AF8B45 0.5px, transparent 0.5px)`, backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/4 -left-40 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px] animate-pulse-slow opacity-60" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-32 items-center">
           
           <div className="lg:col-span-6 space-y-16">
              <div className="space-y-8">
                 <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20 backdrop-blur-xl">
                    <FlaskConical size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em]">PHASE 02: GOAL SELECTION</span>
                 </div>
                 
                 <div className="space-y-6">
                    <h2 className="text-5xl md:text-[80px] font-serif font-bold tracking-tighter text-white leading-[0.85]">
                       {language === 'ar' ? 'ماذا تريد أن' : 'What do you want to'} <br />
                       <span className="italic text-brand-primary font-normal">{language === 'ar' ? 'تحسن الآن؟' : 'improve right now?'}</span>
                    </h2>
                    <p className="text-white/40 text-xl leading-relaxed max-w-lg font-medium italic border-l-2 border-brand-primary/20 pl-8">
                       {language === 'ar' ? 'اختر هدفاً واحداً. سيقوم النظام بالتكيف تلقائياً.' : 'Choose one goal. The system will adapt automatically.'}
                    </p>
                 </div>
              </div>

              <div className="grid gap-5">
                 {items.map((item) => (
                   <div 
                    key={item.id} 
                    onMouseEnter={() => setActiveProtocol(item.id)}
                    onClick={() => handleGoalSelect(item)}
                    className={`group relative flex items-center gap-8 p-10 rounded-[50px] transition-all duration-700 cursor-pointer border
                      ${activeProtocol === item.id 
                        ? 'bg-brand-primary/10 border-brand-primary/50 shadow-[0_30px_100px_-20px_rgba(175,139,69,0.3)] translate-x-6' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                   >
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 shadow-lg transition-all duration-700
                        ${activeProtocol === item.id ? 'bg-brand-primary text-white scale-110 shadow-brand-primary/40' : 'bg-white/5 text-brand-primary/40'}`}>
                         {item.icon}
                      </div>
                      <div className="space-y-2">
                         <h4 className={`text-3xl font-serif font-bold transition-colors duration-500 ${activeProtocol === item.id ? 'text-white' : 'text-white/50'}`}>
                           {item.t}
                         </h4>
                         <p className="text-[11px] text-brand-primary/60 font-medium italic">{item.desc}</p>
                      </div>
                      
                      {activeProtocol === item.id && (
                        <div className="ml-auto animate-fade-in flex items-center gap-3">
                           <ArrowUpRight size={24} className="text-brand-primary animate-bounce-horizontal" />
                        </div>
                      )}
                   </div>
                 ))}
              </div>

              {isSyncing && (
                <div className="flex items-center gap-4 animate-fade-in-up">
                   <div className="w-6 h-6 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
                   <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.5em]">
                        {items[activeProtocol].t} SELECTED ✓
                      </span>
                      <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Generating your daily system...</span>
                   </div>
                </div>
              )}
           </div>
           
           <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative w-full max-w-[500px]">
                <div className="absolute -inset-12 border border-brand-primary/5 rounded-full animate-[spin_30s_linear_infinite] opacity-40 pointer-events-none" />
                
                <div className="relative p-8 bg-[#1A1816] rounded-[90px] border border-white/10 shadow-[0_120px_100px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
                   <div className="absolute inset-0 bg-scan-line pointer-events-none opacity-[0.05] animate-scan" />
                   
                   <div className="relative aspect-[4/5] rounded-[70px] overflow-hidden border border-white/5 bg-brand-dark">
                      <img 
                        src={items[activeProtocol].img} 
                        className="w-full h-full object-cover transition-all duration-[1200ms] scale-100 saturate-[0.9]" 
                        alt="Protocol"
                        key={items[activeProtocol].img}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                      
                      <div className="absolute top-10 left-10 flex items-center gap-4">
                         <div className="bg-black/60 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                            <CheckCircle2 size={12} className="text-brand-primary" />
                            <span className="text-[9px] font-black text-white uppercase tracking-[0.5em] opacity-80">ACTIVE INTENT</span>
                         </div>
                      </div>

                      <div className="absolute bottom-12 left-12 right-12">
                         <div className="space-y-2">
                            <p className="text-[9px] font-black uppercase tracking-[0.8em] text-brand-primary/80">TARGET REACHED</p>
                            <h3 className="text-5xl font-serif font-bold text-white tracking-tighter leading-none">
                               {items[activeProtocol].t}
                            </h3>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Smoothies;
