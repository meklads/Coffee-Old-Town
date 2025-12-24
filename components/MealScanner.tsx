
import React, { useRef } from 'react';
import { 
  History, 
  Cloud, 
  Download, 
  Trash, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  ArrowUpRight,
  Fingerprint
} from 'lucide-react';
import { SectionId } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

export default function MealScanner() {
  const { history, clearHistory, isCloudConnected, scrollTo, language } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollToPos = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollContainerRef.current.scrollTo({ left: scrollToPos, behavior: 'smooth' });
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "metabolic_archive.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <section id={SectionId.PHASE_04_ARCHIVE} className="py-24 bg-zinc-50 dark:bg-[#080808] border-y border-brand-dark/5 dark:border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
           <div className="flex items-center gap-6">
              <div className="p-3 bg-brand-dark dark:bg-brand-primary/10 rounded-2xl text-brand-primary">
                 <History size={20} />
              </div>
              <div className="space-y-1">
                 <h2 className="text-2xl font-serif font-bold text-brand-dark dark:text-white">Diagnostic <span className="text-brand-primary italic">Ledger.</span></h2>
                 <p className="text-[9px] font-black text-brand-dark/30 dark:text-white/20 uppercase tracking-[0.4em]">Chronological Metabolic Archive</p>
              </div>
           </div>

           <div className="flex items-center gap-2">
              <button onClick={exportData} disabled={history.length === 0} className="p-3 text-brand-dark/40 dark:text-white/40 hover:text-brand-primary transition-colors disabled:opacity-10"><Download size={18} /></button>
              <button onClick={clearHistory} disabled={history.length === 0} className="p-3 text-brand-dark/40 dark:text-white/40 hover:text-red-500 transition-colors disabled:opacity-10"><Trash size={18} /></button>
              <div className="h-4 w-px bg-brand-dark/10 dark:bg-white/10 mx-2" />
              <button onClick={() => scroll('left')} className="p-3 hover:bg-brand-primary/10 rounded-full transition-all"><ChevronLeft size={20} /></button>
              <button onClick={() => scroll('right')} className="p-3 hover:bg-brand-primary/10 rounded-full transition-all"><ChevronRight size={20} /></button>
           </div>
        </div>

        {/* Minimalist Grid / Slider */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4"
        >
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 w-[240px] snap-center">
                 <div className="group bg-white dark:bg-zinc-900/40 border border-brand-dark/5 dark:border-white/5 rounded-[32px] p-5 hover:border-brand-primary/30 transition-all duration-500 hover:shadow-xl">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-800 relative">
                       <img src={item.imageUrl} className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" alt="Meal" />
                       <div className="absolute top-3 right-3 px-2 py-1 bg-brand-dark/80 backdrop-blur-md rounded-lg border border-brand-primary/20 text-[8px] font-black text-brand-primary tracking-widest">
                          {item.healthScore}%
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex items-center gap-2 text-[7px] font-black text-brand-dark/30 dark:text-white/20 uppercase tracking-widest">
                          <Clock size={10} /> {item.timestamp?.split(',')[0]}
                       </div>
                       <h4 className="text-sm font-serif font-bold text-brand-dark dark:text-white truncate">{item.summary}</h4>
                       <div className="flex justify-between items-center pt-3 border-t border-brand-dark/5 dark:border-white/5">
                          <span className="text-xs font-serif font-bold text-brand-primary">{item.totalCalories} KCAL</span>
                          <button className="text-brand-dark/20 dark:text-white/20 hover:text-brand-primary transition-colors"><ArrowUpRight size={14} /></button>
                       </div>
                    </div>
                 </div>
              </div>
            ))
          ) : (
            <div className="w-full h-40 flex items-center justify-center border border-dashed border-brand-dark/10 dark:border-white/10 rounded-[40px]">
               <div className="flex items-center gap-4 text-brand-dark/20 dark:text-white/20">
                  <Fingerprint size={24} strokeWidth={1} />
                  <span className="text-[10px] font-black uppercase tracking-[0.6em]">System history currently void</span>
               </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
