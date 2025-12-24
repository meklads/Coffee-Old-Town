
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
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isProcessingRef = useRef(false);
  const watchdogRef = useRef<any>(null);
  
  const t = translations[language].hero;
  const phases = language === 'ar' 
    ? ['جاري المسح الضوئي...', 'فك الشفرة...', 'تحليل البيانات...', 'إتمام التقرير...']
    : ['SCANNING...', 'DECODING...', 'ANALYZING...', 'FINALIZING...'];

  useEffect(() => {
    let phaseInterval: any;
    let progressInterval: any;

    if (status === 'loading') {
      setProgress(0);
      setTimeLeft(15);
      
      phaseInterval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % phases.length);
      }, 2000);

      progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 98) return prev;
          const increment = prev < 70 ? 5 : (prev < 90 ? 2 : 0.5);
          return Math.min(prev + increment, 98);
        });
        setTimeLeft(prev => (prev > 1 ? prev - 1 : 1));
      }, 1000);
    } else {
      setProgress(0);
      setTimeLeft(15);
    }

    return () => {
      clearInterval(phaseInterval);
      clearInterval(progressInterval);
    };
  }, [status, phases.length]);

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800; 
        let w = img.width, h = img.height;
        if (w > h) { if (w > maxDim) { h *= maxDim / w; w = maxDim; } }
        else { if (h > maxDim) { w *= maxDim / h; h = maxDim; } }
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
    });
  };

  const handleAnalyze = async () => {
    if (isProcessingRef.current || !image) return;

    isProcessingRef.current = true;
    setStatus('loading');
    setLastAnalysisResult(null);

    // Timeout safety
    if (watchdogRef.current) clearTimeout(watchdogRef.current);
    watchdogRef.current = setTimeout(() => {
      if (isProcessingRef.current) {
        setStatus('error');
        isProcessingRef.current = false;
      }
    }, 45000);

    try {
      const result = await analyzeMealImage(
        image, 
        { chronicDiseases: '', dietProgram: '', activityLevel: 'moderate' }
      );
      
      if (result && isProcessingRef.current) {
        const enrichedResult = {
          ...result, 
          timestamp: new Date().toLocaleString(), 
          imageUrl: image
        };
        setProgress(100);
        setTimeout(() => {
          setLastAnalysisResult(enrichedResult);
          incrementScans(enrichedResult);
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
      if (watchdogRef.current) clearTimeout(watchdogRef.current);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onloadend = async () => { 
        const compressed = await compressImage(r.result as string);
        setImage(compressed); 
        setStatus('idle');
        setLastAnalysisResult(null); 
      };
      r.readAsDataURL(file);
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
              className="px-8 py-4 bg-brand-dark text-white dark:border dark:border-white/10 rounded-full font-black text-[9px] uppercase tracking-[0.4em] hover:bg-brand-primary transition-all disabled:opacity-50"
            >
              {t.cta}
            </button>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 w-full">
            <div className="relative aspect-[16/10] bg-white dark:bg-zinc-950 border border-brand-dark/[0.08] dark:border-white/5 rounded-[40px] overflow-hidden shadow-2xl dark:shadow-none">
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                {status === 'loading' && (
                  <div className="absolute inset-0 z-50 bg-brand-dark/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 p-12 text-white">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 rounded-full border-[3px] border-brand-primary/10 border-t-brand-primary animate-spin" />
                      <Activity size={28} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
                    </div>
                    
                    <div className="w-full max-w-xs space-y-4">
                      <div className="space-y-2 text-center">
                        <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.6em] animate-pulse">
                          {phases[loadingPhase]}
                        </p>
                        <p className="text-[8px] font-medium text-white/40 uppercase tracking-widest">
                          {language === 'ar' ? `متبقي حوالي ${timeLeft} ثوانٍ` : `Estimated remaining: ~${timeLeft}s`}
                        </p>
                      </div>

                      <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="absolute top-0 left-0 h-full bg-brand-primary transition-all duration-1000 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-[7px] font-black text-white/20 uppercase tracking-widest">
                        <span>{Math.round(progress)}%</span>
                        <span>{language === 'ar' ? 'معالجة حيوية' : 'BIOMETRIC PROC'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {status === 'error' && (
                  <div className="absolute inset-0 z-50 bg-brand-dark/98 backdrop-blur-2xl flex flex-col items-center justify-center space-y-8 p-12 text-center text-white">
                    <AlertCircle size={32} className="text-red-500 animate-pulse" />
                    <h3 className="text-xl font-serif font-bold tracking-tight">System Fault</h3>
                    <button onClick={handleAnalyze} className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-full font-black text-[9px] uppercase tracking-[0.5em] hover:bg-brand-primary transition-all">
                      <RefreshCw size={12} className="inline mr-2" /> RESYNC
                    </button>
                  </div>
                )}

                {lastAnalysisResult ? (
                  <div className="absolute inset-0 flex flex-col animate-fade-in bg-white dark:bg-zinc-950">
                    <div className="p-4 border-b border-brand-dark/[0.04] dark:border-white/5 flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/50">
                       <h3 className="text-[10px] font-serif font-bold uppercase tracking-tight truncate">{lastAnalysisResult.summary}</h3>
                       <button onClick={() => { setImage(null); setLastAnalysisResult(null); setStatus('idle'); }} className="p-2 opacity-20 hover:opacity-100"><RefreshCw size={10} /></button>
                    </div>
                    <div className="flex-grow flex flex-col md:flex-row p-6 gap-6 overflow-y-auto no-scrollbar">
                       <div className="md:w-1/2 rounded-3xl overflow-hidden border border-black/[0.05] dark:border-white/5 h-40 md:h-auto">
                          <img src={lastAnalysisResult.imageUrl} className="w-full h-full object-cover" alt="Meal" />
                       </div>
                       <div className="md:w-1/2 space-y-5">
                          <div className="grid grid-cols-2 gap-3">
                             <div className="p-3 bg-brand-primary/[0.03] rounded-2xl border border-brand-primary/10">
                                <span className="text-[5px] font-black uppercase block opacity-40 mb-1">SCORE</span>
                                <span className="text-lg font-serif font-bold text-brand-primary">{lastAnalysisResult.healthScore}</span>
                             </div>
                             <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-black/[0.03] dark:border-white/5">
                                <span className="text-[5px] font-black uppercase block opacity-40 mb-1">CALORIES</span>
                                <span className="text-lg font-serif font-bold">{lastAnalysisResult.totalCalories}</span>
                             </div>
                          </div>
                          <p className="text-[10px] leading-relaxed italic opacity-70">"{lastAnalysisResult.personalizedAdvice}"</p>
                       </div>
                    </div>
                  </div>
                ) : (
                  status !== 'error' && (
                    <div onClick={() => status === 'idle' && fileInputRef.current?.click()} className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer bg-zinc-50 dark:bg-zinc-900/20">
                      {image ? (
                        <div className="absolute inset-0">
                           <img src={image} className="w-full h-full object-cover opacity-30 blur-[2px]" alt="Preview" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 opacity-20">
                          <ImageIcon size={32} />
                          <span className="text-[7px] font-black uppercase tracking-[0.5em]">UPLOAD IMAGE</span>
                        </div>
                      )}
                      {image && status === 'idle' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} 
                          className="relative z-10 px-10 py-4 bg-brand-dark text-white rounded-full font-black text-[9px] uppercase tracking-[0.5em] flex items-center gap-3 border border-white/10 hover:bg-brand-primary transition-all shadow-xl"
                        >
                          <Zap size={14} className="text-brand-primary" /> START SCAN
                        </button>
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
