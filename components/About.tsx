
import React from 'react';
import { SectionId } from '../types.ts';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { translations } from '../translations.ts';

const About: React.FC = () => {
  const { language } = useApp();
  const t = translations[language].about;
  
  return (
    <section id={SectionId.ABOUT} className="bg-white overflow-hidden">
      
      <div className="relative h-[400px] flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80" 
            className="w-full h-full object-cover opacity-20 grayscale"
            alt="Atmospheric Background"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-cream/80 via-white to-white" />
        </div>
        
        <div className="relative z-10 space-y-4 animate-fade-in-up">
           <h1 className="text-7xl md:text-9xl font-serif font-bold text-brand-dark tracking-tighter opacity-90">
             {t.header}
           </h1>
           <p className="text-lg md:text-xl text-brand-dark/40 font-medium italic tracking-wide">
             {t.tagline}
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          
          <div className="grid grid-cols-1 gap-8 animate-fade-in-up delay-100">
             <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1556210331-09bb3fe8679c?w=1000&q=80" 
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" 
                  alt="Crafting delicacies"
                />
                <div className="absolute inset-0 bg-brand-dark/5 group-hover:bg-transparent transition-colors" />
             </div>
             <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=1000&q=80" 
                  className="w-full h-full object-cover transition-transform duration-[3000ms] group-hover:scale-105" 
                  alt="Brewing perfection"
                />
                <div className="absolute inset-0 bg-brand-dark/5 group-hover:bg-transparent transition-colors" />
             </div>
          </div>

          <div className="space-y-12 animate-fade-in-up delay-200">
             <div className="w-16 h-1 bg-brand-primary/40 rounded-full" />
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark tracking-tight leading-tight">
               {t.title}
             </h2>
             
             <div className="space-y-8 text-lg text-brand-dark/60 leading-relaxed font-medium">
                <p>{t.p1}</p>
                <p>{t.p2}</p>
                <p>{t.p3}</p>
             </div>

             <div className="pt-10">
                <div className="font-serif italic text-4xl text-brand-dark/80 opacity-60 select-none">
                  {language === 'ar' ? 'توقيعك الخاص' : 'Your Signature'}
                </div>
                <div className="mt-2 h-px w-48 bg-brand-dark/10" />
             </div>
          </div>
        </div>
      </div>

      <div className="bg-brand-cream/60 py-24 border-y border-brand-dark/[0.03]">
        <div className={`max-w-4xl mx-auto px-6 ${language === 'ar' ? 'border-r-4 pr-12' : 'border-l-4 pl-12'} border-brand-primary py-4`}>
           <blockquote className="space-y-8">
              <p className="text-2xl md:text-3xl font-serif text-brand-dark/70 leading-relaxed italic">
                "{t.quote}"
              </p>
              <footer className="text-xl font-bold text-brand-dark uppercase tracking-[0.2em] opacity-80">
                — {t.author}
              </footer>
           </blockquote>
        </div>
      </div>

      <div className="py-20 flex justify-center opacity-10 grayscale">
         <div className="flex flex-col items-center">
            <span className="text-3xl font-serif font-bold tracking-tighter uppercase text-brand-dark">Coffee</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark/30">Old Town Lab</span>
         </div>
      </div>
    </section>
  );
};

export default About;
