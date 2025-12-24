
import React, { useEffect } from 'react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { ChevronLeft, ShoppingBag, Clock, Flame, ShieldCheck, Share2, Printer, Activity, ArrowUpRight, CheckCircle2, Info } from 'lucide-react';
import { SectionId } from '../types.ts';

const RecipeDetail: React.FC = () => {
  const { setView, selectedRecipe, scrollTo } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!selectedRecipe) setView('home');
  }, [selectedRecipe, setView]);

  if (!selectedRecipe) return null;

  const renderContentWithLinks = (text: string) => {
    const parts = text.split(/(\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const label = part.slice(1, -1);
        let targetId = SectionId.PHASE_01_SCAN;
        if (label.includes('Synthesis') || label.includes('Nutrition')) targetId = SectionId.PHASE_03_SYNTHESIS;
        if (label.includes('Acceleration')) targetId = SectionId.PHASE_02_PROTOCOLS;
        
        return (
          <button 
            key={i} 
            onClick={() => { setView('home'); setTimeout(() => scrollTo(targetId), 300); }}
            className="text-brand-primary font-black hover:underline decoration-brand-primary/30 mx-1"
          >
            {label}
          </button>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-brand-light min-h-screen pt-32 pb-40">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-20 items-start">
          
          <article className="lg:col-span-8 flex-grow space-y-20 max-w-5xl">
             <button 
              onClick={() => setView('vaults')}
              className="group inline-flex items-center gap-4 text-brand-dark/40 text-[11px] font-black uppercase tracking-[0.6em] hover:text-brand-primary transition-colors"
             >
                <ChevronLeft size={18} className="group-hover:-translate-x-2 transition-transform" /> 
                BACK TO CENTRAL ARCHIVE
             </button>

             <div className="space-y-10">
                <div className="flex items-center gap-4 text-brand-primary text-[12px] font-black uppercase tracking-[0.7em]">
                   <ShieldCheck size={18} />
                   <span>{selectedRecipe.category}</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/10" />
                   <span className="text-brand-dark/30">D001-PROTO</span>
                </div>
                <h1 className="text-6xl md:text-[100px] font-serif font-bold text-brand-dark leading-[0.85] tracking-tighter">
                  {selectedRecipe.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-12 pt-10 border-t border-brand-dark/5 py-10">
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl text-brand-primary">
                         <Clock size={24} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30">DURATION</span>
                         <span className="text-2xl font-serif font-bold text-brand-dark">{selectedRecipe.time}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center shadow-xl text-brand-primary">
                         <Flame size={24} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-black uppercase tracking-widest text-brand-dark/30">ENERGY INDEX</span>
                         <span className="text-2xl font-serif font-bold text-brand-dark">{selectedRecipe.calories} KCAL</span>
                      </div>
                   </div>
                </div>
             </div>

             <div className="relative aspect-video rounded-[80px] overflow-hidden shadow-3xl border border-white group">
                <img src={selectedRecipe.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[3000ms]" alt={selectedRecipe.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
             </div>

             <div className="space-y-20">
                <div className="bg-white p-12 md:p-20 rounded-[64px] shadow-2xl border border-brand-dark/[0.03] relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/[0.02] -skew-x-12" />
                   <div className="relative z-10 space-y-10">
                      <div className="flex items-center gap-6">
                         <Activity className="text-brand-primary" size={32} />
                         <h3 className="text-4xl font-serif font-bold text-brand-dark tracking-tight">Biometric Introduction</h3>
                      </div>
                      <div className="text-2xl font-medium text-brand-dark/70 italic leading-relaxed">
                        {renderContentWithLinks(selectedRecipe.description || "")}
                      </div>
                      <div className="text-xl leading-relaxed text-brand-dark/60 font-medium space-y-6">
                        {renderContentWithLinks(selectedRecipe.fullContent || "")}
                      </div>
                   </div>
                </div>

                {selectedRecipe.steps && (
                  <div className="space-y-12">
                     <div className="flex items-center gap-4 border-b border-brand-dark/5 pb-8">
                        <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center text-brand-primary">
                           <Activity size={24} />
                        </div>
                        <h3 className="text-5xl font-serif font-bold text-brand-dark">The Procedure.</h3>
                     </div>
                     <div className="grid gap-12">
                        {selectedRecipe.steps.map((step, i) => (
                           <div key={i} className="group flex flex-col md:flex-row gap-12 items-start bg-white p-10 rounded-[48px] border border-brand-dark/[0.03] hover:shadow-2xl transition-all duration-700">
                              <div className="shrink-0 w-20 h-20 bg-brand-light rounded-2xl flex items-center justify-center text-3xl font-serif font-bold text-brand-primary border border-brand-primary/10">
                                 0{i+1}
                              </div>
                              <div className="space-y-4 flex-grow">
                                 <h4 className="text-3xl font-serif font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{step.title}</h4>
                                 <p className="text-lg text-brand-dark/50 font-medium italic leading-relaxed">{step.desc}</p>
                              </div>
                              <div className="shrink-0 w-full md:w-64 h-48 bg-brand-light rounded-3xl border border-dashed border-brand-dark/10 flex items-center justify-center text-[10px] font-black text-brand-dark/20 uppercase tracking-widest">
                                 Step Visual Input
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

                <div className="grid lg:grid-cols-2 gap-12">
                   <div className="bg-brand-dark rounded-[56px] p-12 text-white shadow-3xl space-y-10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-brand-primary/20 rounded-lg flex items-center justify-center text-brand-primary">
                            <Activity size={20} />
                         </div>
                         <h4 className="text-2xl font-serif font-bold">The Substrates</h4>
                      </div>
                      <ul className="space-y-6">
                         {selectedRecipe.ingredients?.map((ing, i) => (
                           <li key={i} className="flex items-center gap-4 text-white/60 font-medium text-lg border-b border-white/5 pb-4">
                              <CheckCircle2 size={16} className="text-brand-primary" />
                              {ing}
                           </li>
                        ))}
                      </ul>
                   </div>

                   <div className="bg-white rounded-[56px] p-12 shadow-2xl border border-brand-dark/[0.03] space-y-10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center text-brand-primary">
                            <Info size={20} />
                         </div>
                         <h4 className="text-2xl font-serif font-bold">Nutritional Data</h4>
                      </div>
                      <div className="grid gap-6">
                         {selectedRecipe.nutritionalFacts?.map((fact, i) => (
                           <div key={i} className="flex justify-between items-end border-b border-brand-dark/5 pb-4">
                              <div className="space-y-1">
                                 <span className="text-[10px] font-black text-brand-dark/30 uppercase tracking-widest">{fact.label}</span>
                                 <p className="text-2xl font-serif font-bold text-brand-dark">{fact.value}</p>
                              </div>
                              {fact.percentage && (
                                 <span className="bg-brand-primary/10 text-brand-primary px-4 py-1.5 rounded-full text-[10px] font-black">{fact.percentage}</span>
                              )}
                           </div>
                        ))}
                      </div>
                   </div>
                </div>
             </div>
          </article>

          <aside className="lg:w-[450px] shrink-0 space-y-12 lg:sticky lg:top-32 h-fit">
             <div className="bg-white rounded-[48px] border border-brand-dark/[0.05] p-12 text-center space-y-8 shadow-xl">
                <div className="text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.5em]">SPONSORED DATA NODE</div>
                <div className="aspect-square bg-brand-light border-2 border-dashed border-brand-dark/10 rounded-[32px] flex items-center justify-center text-brand-dark/10 italic">
                   [METABOLIC AD-SYSTEMS]
                </div>
             </div>

             {selectedRecipe.affiliateLinks && (
               <div className="bg-brand-primary rounded-[56px] p-12 text-white shadow-3xl space-y-12 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 -rotate-45 translate-x-12 -translate-y-12" />
                  <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <ShoppingBag size={24} />
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] opacity-60">PRECISION EQUIPMENT</span>
                     </div>
                     <h4 className="text-4xl font-serif font-bold tracking-tight">Source The Tooling.</h4>
                  </div>

                  <div className="space-y-4">
                     {selectedRecipe.affiliateLinks.map((link, i) => (
                        <a 
                          key={i} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-full group flex items-center justify-between p-8 bg-white text-brand-dark rounded-[32px] hover:bg-brand-dark hover:text-white transition-all duration-700 shadow-xl"
                        >
                           <span className="font-black text-[12px] uppercase tracking-widest">{link.name}</span>
                           <ArrowUpRight size={22} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
                        </a>
                     ))}
                  </div>

                  <p className="text-white/30 text-[9px] font-black uppercase tracking-widest text-center italic">
                     * Molecular Lab may receive a biometric referral credit.
                  </p>
               </div>
             )}

             <div className="p-12 bg-white rounded-[56px] border border-brand-dark/[0.03] text-center space-y-8 shadow-lg">
                <div className="relative inline-block">
                   <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80" className="w-28 h-28 rounded-full mx-auto border-4 border-brand-light shadow-2xl grayscale" alt="Analyst" />
                   <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-white border-4 border-white">
                      <CheckCircle2 size={16} />
                   </div>
                </div>
                <div className="space-y-2">
                   <h5 className="font-serif font-bold text-2xl uppercase tracking-tighter">METABOLIC EXPERT</h5>
                   <p className="text-sm font-medium text-brand-dark/40 italic leading-relaxed">"Verified and calibrated for Phase 05 integration."</p>
                </div>
                <button className="w-full py-5 rounded-2xl bg-brand-dark text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-primary transition-all">
                   CONTACT ANALYST
                </button>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
