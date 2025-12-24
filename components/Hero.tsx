
import React, { useState, useRef, useEffect } from 'react';
import { Zap, Image as ImageIcon, RefreshCw, AlertCircle, Activity } from 'lucide-react';
import { SectionId } from '../types.ts';
import { analyzeMealImage } from '../services/geminiService.ts';
import { useApp } from '../context/AppContext.tsx';
import { translations } from '../translations.ts';

const Hero: React.FC = () => {
  const { incrementScans, setLastAnalysisResult, lastAnalysisResult, language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);
  
  const t = translations[language].hero;

  useEffect(() => {
    let interval: any;
    if (status === 'loading') {
      setProgress(0);
      setTimeLeft(15);
      interval = setInterval(() => {
        setProgress(p => (p >= 98 ? p : p + (p < 80 ? 5 : 1)));
        setTimeLeft(t => (t > 1 ? t - 1 : 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleAnalyze = async () => {
    if (isProcessingRef.current || !image) return;

    isProcessingRef.current = true;
    setStatus('loading');
    setLastAnalysisResult(null);

    try {
      const result = await analyzeMealImage(image, { chronicDiseases: '', dietProgram: '', activityLevel: 'moderate' });
      
      if (result && isProcessingRef.current) {
        const enriched = { 
          ...result, 
          timestamp: new Date().toLocaleString(), 
          imageUrl: image 
        };
        setProgress(100);
        setTimeout(() => {
          setLastAnalysisResult(enriched);
          incrementScans(enriched);
          setStatus('idle');
        }, 500);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Scanner error:", err);
      setStatus('error');
    } finally {
      isProcessingRef.current = false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setStatus('idle');
        setLastAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id={SectionId.PHASE_01_SCAN} className="relative min-h-[85vh] bg-brand-light dark:bg-brand-dark pt-24 pb-12 flex items-center transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-brand-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.4em]">{t.badge}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark dark:text-white leading-[0.9] tracking-tighter">
                {language === 'ar' ? 'التشخيص' : 'Metabolic'} <span className="text-brand-primary italic">{language === 'ar' ? 'الأيضي' : 'Diagnostic.'}</span>
              </h1>
              <p className="text-brand-dark/40 dark:text-white/30 text-[10px] font-medium max-w-sm mx-auto lg:mx-0 leading-relaxed border-l border-brand-primary/20 pl-4">
                {t.desc}
              </p>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={status === 'loading'}
              className="px-8 py-4 bg-brand-dark text-white rounded-full font-black text-[9px] uppercase tracking-[0.4em] transition-all duration-300 hover:bg-brand-primary hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/20 active:bg-gradient-to-r active:from-brand-primary active:to-brand-success active:scale-95 disabled:opacity-50"
            >
              {t.cta}
            </button>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 w-full">
            <div className="relative aspect-[16/10] bg-white dark:bg-zinc-950 border border-brand-dark/[0.08] dark:border-white/5 rounded-[40px] overflow-hidden shadow-2xl">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                {status === 'loading' && (
                  <div className="absolute inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-6 p-8 text-white">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 rounded-full border-2 border-brand-primary/10 border-t-brand-primary animate-spin" />
                      <Activity size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
                    </div>
                    <div className="w-full max-w-xs space-y-3">
                      <p className="text-[9px] text-center font-black uppercase tracking-widest text-brand-primary">
                        {language === 'ar' ? `المتبقي ~${timeLeft} ثانية` : `ESTIMATED: ~${timeLeft}S`}
                      </p>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-primary transition-all duration-500" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="absolute inset-0 z-50 bg-brand-dark/98 flex flex-col items-center justify-center space-y-4 p-8 text-white text-center">
                    <AlertCircle size={32} className="text-red-500" />
                    <h3 className="text-xl font-serif font-bold">Analysis Fault</h3>
                    <button onClick={handleAnalyze} className="px-8 py-3 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-brand-primary transition-colors">
                      RETRY SCAN
                    </button>
                  </div>
                )}

                {lastAnalysisResult ? (
                  <div className="absolute inset-0 flex flex-col animate-fade-in bg-white dark:bg-zinc-950">
                    <div className="p-4 border-b border-brand-dark/[0.04] dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                       <h3 className="text-[10px] font-serif font-bold uppercase truncate pr-4">{lastAnalysisResult.summary}</h3>
                       <button onClick={() => { setImage(null); setLastAnalysisResult(null); setStatus('idle'); }} className="p-2 opacity-30 hover:opacity-100 transition-opacity">
                        <RefreshCw size={12} />
                       </button>
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row p-6 gap-6 overflow-y-auto no-scrollbar">
                       <div className="md:w-1/2 rounded-3xl overflow-hidden h-40 md:h-auto border border-black/5 dark:border-white/5">
                          <img src={lastAnalysisResult.imageUrl} className="w-full h-full object-cover" alt="Meal" />
                       </div>
                       <div className="md:w-1/2 space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                             <div className="p-3 bg-brand-primary/5 rounded-2xl border border-brand-primary/10">
                                <span className="text-[6px] font-black uppercase block opacity-40 mb-1">HEALTH SCORE</span>
                                <span className="text-lg font-serif font-bold text-brand-primary">{lastAnalysisResult.healthScore}</span>
                             </div>
                             <div className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-black/5 dark:border-white/5">
                                <span className="text-[6px] font-black uppercase block opacity-40 mb-1">TOTAL KCAL</span>
                                <span className="text-lg font-serif font-bold">{lastAnalysisResult.totalCalories}</span>
                             </div>
                          </div>
                          <p className="text-[10px] leading-relaxed italic opacity-70">"{lastAnalysisResult.personalizedAdvice}"</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  status !== 'error' && (
                    <div onClick={() => status === 'idle' && fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-zinc-50 dark:bg-zinc-900/20 group">
                      {image ? (
                        <div className="absolute inset-0">
                           <img src={image} className="w-full h-full object-cover opacity-30 blur-[2px] transition-all group-hover:blur-0" alt="Preview" />
                           <div className="absolute inset-0 flex items-center justify-center">
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} 
                                className="px-10 py-4 bg-brand-dark text-white rounded-full font-black text-[9px] uppercase tracking-[0.5em] border border-white/10 transition-all duration-300 shadow-2xl scale-100 hover:scale-105 hover:bg-brand-primary hover:tracking-[0.6em] active:bg-gradient-to-r active:from-brand-primary active:to-brand-success active:scale-95"
                              >
                                <Zap size={14} className="inline mr-2 text-brand-primary" /> START SCAN
                              </button>
                           </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 opacity-20 group-hover:opacity-40 transition-opacity">
                          <ImageIcon size={32} strokeWidth={1} />
                          <span className="text-[7px] font-black uppercase tracking-[0.5em]">CLICK TO UPLOAD MEAL</span>
                        </div>
                      )}
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
