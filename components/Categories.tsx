
import React from 'react';
import { SectionId } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight, Sparkles, BookOpen, ChevronRight, Activity } from 'lucide-react';

const Categories: React.FC = () => {
  const { language, setView } = useApp();

  return (
    <section id={SectionId.PHASE_05_UPGRADE} className="bg-brand-dark py-48 overflow-hidden relative border-t border-white/5">
      {/* Cinematic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none grayscale" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&q=80')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-dark via-brand-dark/95 to-brand-dark" />
      
      {/* Atmospheric Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
         <div className="grid lg:grid-cols-2 gap-24 items-center">
            
            <div className="space-y-12 text-center lg:text-left">
               <div className="space-y-8">
                  <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20 backdrop-blur-xl mx-auto lg:mx-0">
                    <Sparkles size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.6em]">PHASE 05: KNOWLEDGE HUB</span>
                  </div>
                  <h2 className="text-6xl md:text-[110px] font-serif font-bold text-white tracking-tighter leading-[0.8] transition-all">
                    Learn & <br /> <span className="text-brand-primary italic font-normal">Upgrade.</span>
                  </h2>
                  <p className="text-white/40 text-xl font-medium max-w-xl italic leading-relaxed border-l-2 border-brand-primary/20 pl-10 mx-auto lg:mx-0">
                    {language === 'ar' 
                      ? 'تعمق في البروتوكولات العلمية التي تطور أدائك الأيضي والذهني من خلال أرشيفنا المركزي.' 
                      : 'Deepen your bio-optimization knowledge and upgrade your skills via our central archive.'}
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <button 
                    onClick={() => { setView('vaults'); window.scrollTo(0,0); }}
                    className="group relative inline-flex items-center gap-6 bg-brand-primary text-white px-12 py-7 rounded-full font-black text-[12px] uppercase tracking-[0.5em] hover:bg-white hover:text-brand-dark transition-all duration-700 shadow-[0_30px_60px_-15px_rgba(175,139,69,0.3)]"
                  >
                    {language === 'ar' ? 'دخول الأرشيف' : 'ENTER THE ARCHIVE'}
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
               </div>
            </div>

            {/* Visual Feature Card */}
            <div className="relative group/card cursor-pointer hidden lg:block" onClick={() => { setView('vaults'); window.scrollTo(0,0); }}>
               <div className="absolute -inset-4 bg-brand-primary/20 blur-[100px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-1000" />
               <div className="relative bg-[#111111] border border-white/5 rounded-[80px] p-4 overflow-hidden shadow-3xl">
                  <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80" className="w-full h-full object-cover grayscale opacity-40 group-hover/card:grayscale-0 group-hover/card:opacity-100 group-hover/card:scale-110 transition-all duration-[2s]" alt="Article Preview" />
                     <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent" />
                     
                     <div className="absolute top-10 left-10 flex items-center gap-3">
                        <div className="bg-brand-primary/90 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
                           <BookOpen size={24} className="text-white" />
                        </div>
                     </div>

                     <div className="absolute bottom-12 left-12 right-12 space-y-4">
                        <div className="flex items-center gap-3 text-brand-primary">
                           <Activity size={14} />
                           <span className="text-[9px] font-black uppercase tracking-[0.6em]">BIO-HACKING SYSTEM</span>
                        </div>
                        <h3 className="text-4xl font-serif font-bold text-white tracking-tighter leading-none">
                          Advanced Metabolic <br /> <span className="text-brand-primary italic">Protocols.</span>
                        </h3>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </section>
  );
};

export default Categories;
