
import React from 'react';
import { SectionId } from '../types.ts';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight, Sparkles, Database } from 'lucide-react';

const Categories: React.FC = () => {
  const { language, setView } = useApp();

  return (
    // Fixed: Property 'CATEGORIES' does not exist on type 'typeof SectionId'. 
    // Mapped to PHASE_05_UPGRADE based on 'PHASE 05' context.
    <section id={SectionId.PHASE_05_UPGRADE} className="bg-brand-dark py-40 overflow-hidden relative border-t border-white/5">
      <div className="absolute inset-0 opacity-10 pointer-events-none grayscale" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1600&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
         <div className="space-y-12">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary border border-brand-primary/20 animate-pulse">
                <Database size={32} />
              </div>
              <div className="inline-flex items-center gap-3 text-brand-primary">
                <Sparkles size={16} />
                <span className="font-black text-[11px] uppercase tracking-[0.6em] opacity-60">
                  PHASE 05: KNOWLEDGE HUB
                </span>
              </div>
            </div>

            <div className="space-y-6">
               <h2 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter leading-[0.85]">
                  Learn & <br /> <span className="text-brand-primary italic font-normal">Upgrade.</span>
               </h2>
               <p className="text-white/30 text-xl font-medium max-w-xl mx-auto italic leading-relaxed">
                  {language === 'ar' 
                    ? 'تعمق في علوم التحسين الحيوي وطور مهاراتك من خلال أرشيفنا المركزي.' 
                    : 'Deepen your bio-optimization knowledge and upgrade your skills via our central archive.'}
               </p>
            </div>

            <button 
              onClick={() => { setView('vaults'); window.scrollTo(0,0); }}
              className="group relative inline-flex items-center gap-6 bg-brand-primary text-white px-12 py-7 rounded-[32px] font-black text-[12px] uppercase tracking-[0.5em] hover:bg-white hover:text-brand-dark transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(175,139,69,0.3)]"
            >
               {language === 'ar' ? 'دخول الأرشيف' : 'ENTER THE ARCHIVE'}
               <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
         </div>
      </div>
    </section>
  );
};

export default Categories;
