
import React, { useState, useRef, useEffect } from 'react';
import { Zap, Image as ImageIcon, RefreshCw, AlertCircle, Activity, ChevronRight, Fingerprint } from 'lucide-react';
import { SectionId } from '../types.ts';
import { analyzeMealImage } from '../services/geminiService.ts';
import { useApp } from '../context/AppContext.tsx';
import { translations } from '../translations.ts';

const Hero: React.FC = () => {
  const { incrementScans, setLastAnalysisResult, lastAnalysisResult, language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [progress, setProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].hero;

  useEffect(() => {
    let interval: any;
    if (status === 'loading') {
      setProgress(0);
      interval = setInterval(() => {
        setProgress(p => (p >= 98 ? p : p + (p < 85 ? 12 : 1)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 512; 
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) { height *= MAX_SIZE / width; width = MAX_SIZE; }
        } else {
          if (height > MAX_SIZE) { width *= MAX_SIZE / height; height = MAX_SIZE; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6));
      };
    });
  };

  const handleAnalyze = async () => {
    if (!image || status === 'loading') return;
    setStatus('loading');
    setErrorMessage('');
    setLastAnalysisResult(null);
    try {
      const compressedImage = await compressImage(image);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), 25000));
      const resultPromise = analyzeMealImage(compressedImage, { chronicDiseases: '', dietProgram: '', activityLevel: 'moderate' });
      const result: any = await Promise.race([resultPromise, timeoutPromise]);
      if (result) {
        const enriched = { ...result, timestamp: new Date().toLocaleString(), imageUrl: compressedImage };
        setProgress(100);
        setTimeout(() => {
          setLastAnalysisResult(enriched);
          incrementScans(enriched);
          setStatus('idle');
        }, 800);
      } else { throw new Error("EMPTY"); }
    } catch (err: any) {
      setErrorMessage(language === 'ar' ? 'فشل الاتصال: يرجى المحاولة لاحقاً.' : 'Sync Failed: Please retry.');
      setStatus('error');
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
    <section id={SectionId.PHASE_01_SCAN} className="relative min-h-screen bg-brand-light dark:bg-brand-dark pt-32 pb-20 flex items-center transition-colors duration-500 overflow-hidden">
      
      {/* Bio-Digital Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C2A36B 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      
      <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
        
        {/* Unified Diagnostic Master Frame */}
        <div className="relative aspect-[4/5] md:aspect-[1.1/1] bg-white dark:bg-zinc-950 border border-brand-dark/10 dark:border-white/5 rounded-[64px] overflow-hidden shadow-2xl group/scanner flex flex-col">
            
            {/* Precision Corner Brackets */}
            <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-brand-primary/60 rounded-tl-xl z-20 group-hover/scanner:scale-110 group-hover/scanner:border-brand-primary transition-all duration-700" />
            <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-brand-primary/60 rounded-tr-xl z-20 group-hover/scanner:scale-110 group-hover/scanner:border-brand-primary transition-all duration-700" />
            <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-brand-primary/60 rounded-bl-xl z-20 group-hover/scanner:scale-110 group-hover/scanner:border-brand-primary transition-all duration-700" />
            <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-brand-primary/60 rounded-br-xl z-20 group-hover/scanner:scale-110 group-hover/scanner:border-brand-primary transition-all duration-700" />

            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

            {/* Content Logic based on State */}
            {status === 'loading' ? (
              <div className="flex-grow flex flex-col items-center justify-center space-y-12 animate-fade-in p-12">
                 <div className="relative">
                    <div className="w-28 h-28 rounded-full border-2 border-brand-primary/5 border-t-brand-primary animate-spin" />
                    <Fingerprint size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-primary animate-pulse" />
                 </div>
                 <div className="w-full max-w-sm space-y-6 text-center">
                    <div className="space-y-2">
                       <h3 className="text-3xl font-serif font-bold tracking-tight text-brand-dark dark:text-white uppercase">{language === 'ar' ? 'جاري التحليل' : 'SYNCING BIOMETRICS'}</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brand-primary">{progress}% COMPLETION</p>
                    </div>
                    <div className="h-1 bg-brand-dark/5 dark:bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-brand-primary transition-all duration-500 shadow-glow" style={{ width: `${progress}%` }} />
                    </div>
                 </div>
              </div>
            ) : status === 'error' ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-12 space-y-10 animate-fade-in">
                 <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                    <AlertCircle size={40} className="text-red-500" />
                 </div>
                 <div className="space-y-4">
                    <h3 className="text-4xl font-serif font-bold text-brand-dark dark:text-white">{language === 'ar' ? 'فشل الاتصال' : 'CONNECTION LOST'}</h3>
                    <p className="text-brand-dark/40 dark:text-white/40 font-medium italic">{errorMessage}</p>
                 </div>
                 <button onClick={() => setStatus('idle')} className="px-12 py-6 bg-brand-dark text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all">
                    {language === 'ar' ? 'إعادة المحاولة' : 'RE-INITIALIZE'}
                 </button>
              </div>
            ) : lastAnalysisResult ? (
              <div className="flex-grow flex flex-col animate-fade-in bg-white dark:bg-zinc-950 overflow-hidden">
                 <div className="p-8 border-b border-brand-dark/5 dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
                    <div className="flex items-center gap-4">
                       <Activity size={14} className="text-brand-primary" />
                       <h3 className="text-sm font-serif font-bold uppercase text-brand-dark dark:text-white tracking-tight">{lastAnalysisResult.summary}</h3>
                    </div>
                    <button onClick={() => { setImage(null); setLastAnalysisResult(null); }} className="p-3 bg-brand-dark/5 dark:bg-white/5 rounded-2xl hover:text-brand-primary transition-all">
                       <RefreshCw size={14} />
                    </button>
                 </div>
                 <div className="flex-grow flex flex-col md:flex-row p-10 gap-12 overflow-y-auto no-scrollbar">
                    <div className="md:w-1/2 relative aspect-square rounded-[40px] overflow-hidden border border-brand-dark/5 dark:border-white/5">
                       <img src={lastAnalysisResult.imageUrl} className="w-full h-full object-cover" alt="Scan" />
                    </div>
                    <div className="md:w-1/2 space-y-8 flex flex-col justify-center">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-6 bg-brand-primary/5 rounded-3xl border border-brand-primary/10">
                             <span className="text-[7px] font-black uppercase tracking-widest block opacity-40 mb-2">VITALITY INDEX</span>
                             <span className="text-4xl font-serif font-bold text-brand-primary">{lastAnalysisResult.healthScore}%</span>
                          </div>
                          <div className="p-6 bg-brand-dark/5 dark:bg-white/5 rounded-3xl border border-brand-dark/5 dark:border-white/5">
                             <span className="text-[7px] font-black uppercase tracking-widest block opacity-40 mb-2">ENERGY LOAD</span>
                             <span className="text-4xl font-serif font-bold text-brand-dark dark:text-white">{lastAnalysisResult.totalCalories}</span>
                          </div>
                       </div>
                       <p className="p-8 rounded-[40px] border border-brand-primary/20 bg-brand-primary/[0.03] italic text-sm leading-relaxed text-brand-dark/70 dark:text-white/60">
                          "{lastAnalysisResult.personalizedAdvice}"
                       </p>
                    </div>
                 </div>
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-12">
                 
                 {/* Internal Interface Elements */}
                 <div className="space-y-8 max-w-lg mx-auto">
                    <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/10 mx-auto">
                       <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                       <span className="text-[9px] font-black uppercase tracking-[0.6em]">{t.badge}</span>
                    </div>

                    <div className="space-y-6">
                       <h1 className="text-5xl md:text-7xl font-serif font-bold text-brand-dark dark:text-white leading-[0.9] tracking-tighter">
                          {t.title} <br />
                          <span className="text-brand-primary italic font-normal">{t.subtitle}</span>
                       </h1>
                       <p className="text-brand-dark/50 dark:text-white/30 text-lg md:text-xl font-medium italic max-w-sm mx-auto leading-relaxed px-6">
                          {t.desc}
                       </p>
                    </div>
                 </div>

                 {/* Interaction Zone */}
                 <div className="relative w-full max-w-xs mx-auto">
                    {image ? (
                       <div className="animate-fade-in space-y-6">
                          <div className="relative aspect-square rounded-[32px] overflow-hidden border-2 border-brand-primary/40 shadow-glow">
                             <img src={image} className="w-full h-full object-cover" alt="Preview" />
                             <div className="absolute inset-0 bg-brand-dark/40 flex items-center justify-center">
                                <button onClick={handleAnalyze} className="p-6 bg-brand-primary text-white rounded-full shadow-2xl hover:scale-110 transition-all">
                                   <Zap size={24} className="animate-pulse" />
                                </button>
                             </div>
                          </div>
                          <button onClick={() => setImage(null)} className="text-[9px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">
                             {language === 'ar' ? 'إعادة اختيار الصورة' : 'CHOOSE DIFFERENT IMAGE'}
                          </button>
                       </div>
                    ) : (
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         className="group relative w-full py-8 bg-brand-dark dark:bg-brand-primary text-white dark:text-brand-dark rounded-full font-black text-[11px] uppercase tracking-[0.5em] transition-all duration-700 hover:scale-105 active:scale-95 shadow-3xl overflow-hidden"
                       >
                          <span className="relative z-10 flex items-center justify-center gap-4">
                             {t.cta} <ImageIcon size={18} />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-primary/80 opacity-0 group-hover:opacity-100 transition-opacity dark:from-white dark:to-white/90" />
                       </button>
                    )}
                 </div>

                 <div className="flex items-center gap-6 pt-4 text-brand-dark/10 dark:text-white/5">
                    <div className="h-px w-12 bg-current" />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">Hardware V.4.0.2</span>
                    <div className="h-px w-12 bg-current" />
                 </div>
              </div>
            )}
        </div>
      </div>

      {/* Atmospheric Background Accents */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-40" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-30" />
    </section>
  );
};

export default Hero;
