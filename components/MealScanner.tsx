
import React from 'react';
import { 
  Database, 
  ArrowUpRight, 
  Activity, 
  Fingerprint, 
  Download, 
  Trash, 
  Cloud, 
  ShieldAlert, 
  Sparkles,
  Zap,
  TrendingUp,
  History,
  Maximize2,
  // Fix: Added missing Clock import
  Clock
} from 'lucide-react';
import { SectionId } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

export default function MealScanner() {
  const { history, clearHistory, isCloudConnected, setView, scrollTo } = useApp();

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "coffee_old_town_biometrics.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.healthScore, 0) / history.length) 
    : 0;

  return (
    <section id={SectionId.PHASE_04_ARCHIVE} className="py-48 bg-[#F9F8F6] relative overflow-hidden border-y border-brand-dark/5">
      {/* Ambience Layers */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-primary/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-40 -left-20 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-24 gap-12">
           <div className="max-w-4xl space-y-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-dark text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                  <History size={14} />
                  <span>PHASE 04: PERSISTENT ARCHIVE</span>
                </div>
                {isCloudConnected && (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full text-[9px] font-bold uppercase tracking-widest border border-brand-primary/20">
                    <Cloud size={14} className="animate-pulse" />
                    <span>ENCRYPTED CLOUD SYNC ACTIVE</span>
                  </div>
                )}
              </div>
              <h2 className="text-5xl md:text-[90px] font-serif font-bold text-brand-dark leading-[0.85] tracking-tighter">
                Metabolic <br /> <span className="text-brand-primary italic font-normal">History.</span>
              </h2>
              <p className="text-brand-dark/50 text-xl font-medium max-w-xl italic border-l-4 border-brand-primary/20 pl-10 leading-relaxed">
                Your biological journey mapped in high-fidelity. Review every nutritional node to identify patterns of peak performance.
              </p>
           </div>
           
           <div className="flex items-center gap-4 bg-white p-5 rounded-[32px] border border-brand-dark/[0.04] shadow-2xl">
              <button 
                onClick={exportData}
                disabled={history.length === 0}
                className="p-5 bg-brand-dark text-brand-primary rounded-2xl shadow-xl hover:bg-brand-primary hover:text-white transition-all disabled:opacity-20 flex items-center gap-4 group/btn"
              >
                <Download size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest hidden md:block group-hover:tracking-[0.2em] transition-all">EXTRACT BIO-DATA</span>
              </button>
              <button 
                onClick={clearHistory}
                disabled={history.length === 0}
                className="p-5 text-red-400/50 hover:text-red-600 transition-all hover:scale-110 disabled:opacity-20"
                title="Purge Timeline"
              >
                <Trash size={20} />
              </button>
           </div>
        </div>

        {/* Metabolic Dashboard Summary */}
        {history.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 animate-fade-in-up">
            <div className="bg-white p-8 rounded-[40px] border border-brand-dark/5 shadow-sm">
               <p className="text-[9px] font-black text-brand-dark/30 uppercase tracking-[0.4em] mb-4">Total Scans</p>
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-serif font-bold text-brand-dark">{history.length}</span>
                  <span className="text-brand-primary mb-1"><Activity size={16} /></span>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-brand-dark/5 shadow-sm">
               <p className="text-[9px] font-black text-brand-dark/30 uppercase tracking-[0.4em] mb-4">Avg Vitality</p>
               <div className="flex items-end gap-3">
                  <span className="text-4xl font-serif font-bold text-brand-primary">{avgScore}</span>
                  <span className="text-brand-dark/20 text-xs mb-1 font-bold">/ 100</span>
               </div>
            </div>
            <div className="bg-white p-8 rounded-[40px] border border-brand-dark/5 shadow-sm">
               <p className="text-[9px] font-black text-brand-dark/30 uppercase tracking-[0.4em] mb-4">Efficiency</p>
               <div className="flex items-end gap-3 text-green-500">
                  <span className="text-4xl font-serif font-bold">Optimal</span>
                  <TrendingUp size={16} className="mb-2" />
               </div>
            </div>
            <div className="bg-brand-dark p-8 rounded-[40px] shadow-2xl flex flex-col justify-center">
               <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                  <span className="text-[9px] font-black text-white uppercase tracking-[0.4em]">Node Status</span>
               </div>
               <p className="text-white/40 text-xs mt-2 italic">Timeline active & encrypted.</p>
            </div>
          </div>
        )}

        {/* History Grid */}
        <div className="relative">
          {history.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {history.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white rounded-[48px] border border-brand-dark/[0.04] overflow-hidden hover:shadow-[0_80px_100px_-30px_rgba(194,163,107,0.2)] transition-all duration-700 cursor-pointer flex flex-col h-full relative"
                >
                  {/* Vitality Badge */}
                  <div className="absolute top-8 right-8 z-20">
                    <div className="bg-brand-dark text-white w-14 h-14 rounded-2xl shadow-2xl flex flex-col items-center justify-center border border-brand-primary/20 backdrop-blur-xl group-hover:border-brand-primary transition-colors duration-500">
                      <span className="text-[7px] font-black opacity-40 leading-none mb-1">SCORE</span>
                      <span className="text-2xl font-serif font-bold leading-none text-brand-primary">{item.healthScore}</span>
                    </div>
                  </div>

                  {/* Image Container */}
                  <div className="aspect-[4/5] overflow-hidden relative bg-brand-cream/20">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1.5s]" alt="Node" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-brand-dark/10">
                        <Activity size={48} strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    
                    {/* Hover Interaction Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                       <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform">
                          <Maximize2 size={24} />
                       </div>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 text-white">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">
                          <Clock size={12} />
                          <span>{item.timestamp?.split(',')[0]}</span>
                        </div>
                        <h4 className="text-2xl font-serif font-bold leading-tight line-clamp-2">
                          {item.summary}
                        </h4>
                    </div>
                  </div>

                  {/* Macro Footer */}
                  <div className="p-8 space-y-6 bg-white border-t border-brand-dark/5">
                    <div className="grid grid-cols-3 gap-4">
                       <div className="text-center space-y-1">
                          <span className="text-[7px] font-black text-brand-dark/30 uppercase tracking-widest block">PRO</span>
                          <p className="text-xs font-bold text-brand-dark">{item.macros?.protein || 0}g</p>
                       </div>
                       <div className="text-center space-y-1 border-x border-brand-dark/5">
                          <span className="text-[7px] font-black text-brand-dark/30 uppercase tracking-widest block">CARB</span>
                          <p className="text-xs font-bold text-brand-dark">{item.macros?.carbs || 0}g</p>
                       </div>
                       <div className="text-center space-y-1">
                          <span className="text-[7px] font-black text-brand-dark/30 uppercase tracking-widest block">FAT</span>
                          <p className="text-xs font-bold text-brand-dark">{item.macros?.fat || 0}g</p>
                       </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-brand-dark/5">
                       <span className="text-brand-primary font-serif font-bold text-xl">{item.totalCalories} KCAL</span>
                       <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand-dark/20 group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-all">
                          <ArrowUpRight size={14} />
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Enhanced Empty Vault State */
            <div className="w-full bg-white rounded-[80px] border border-dashed border-brand-dark/10 p-20 md:p-32 flex flex-col items-center justify-center text-center space-y-12 shadow-3xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-brand-primary/[0.01] group-hover:bg-brand-primary/[0.03] transition-colors duration-1000" />
               
               <div className="relative">
                 {/* Decorative Pulse Rings */}
                 <div className="absolute inset-0 -m-8 border border-brand-primary/10 rounded-full animate-ping opacity-20" />
                 <div className="absolute inset-0 -m-16 border border-brand-primary/5 rounded-full animate-pulse opacity-20" />
                 
                 <div className="w-48 h-48 rounded-full bg-brand-light flex items-center justify-center relative z-10 border border-brand-dark/5 shadow-inner">
                   <Fingerprint size={80} className="text-brand-dark/10 group-hover:text-brand-primary/30 transition-colors duration-1000" />
                 </div>
               </div>
               
               <div className="max-w-xl space-y-6 relative z-10">
                  <h4 className="text-4xl md:text-5xl font-serif font-bold text-brand-dark tracking-tighter">Vault Empty. <br /> <span className="text-brand-primary">Awaken the Neural Link.</span></h4>
                  <p className="text-brand-dark/40 text-lg font-medium italic leading-relaxed">
                    Your biological data stream is currently inactive. Launch a diagnostic scan to start mapping your path to metabolic excellence.
                  </p>
               </div>

               <button 
                onClick={() => scrollTo(SectionId.PHASE_01_SCAN)}
                className="relative z-10 px-16 py-7 bg-brand-dark text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.5em] hover:bg-brand-primary hover:scale-105 active:scale-95 transition-all shadow-3xl flex items-center gap-6 group/btn"
               >
                 Initialize First Scan <Zap size={18} className="text-brand-primary group-hover/btn:animate-pulse" />
               </button>

               <div className="absolute bottom-10 flex items-center gap-4 text-brand-dark/10">
                  <div className="w-2 h-2 rounded-full bg-current" />
                  <span className="text-[8px] font-black uppercase tracking-[1em]">Awaiting Biometric Transmission</span>
                  <div className="w-2 h-2 rounded-full bg-current" />
               </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
