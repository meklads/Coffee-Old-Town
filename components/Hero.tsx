
import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Baby, HeartPulse, Zap, Camera, Utensils, Share2, AlertTriangle, Info, Download, FileText } from 'lucide-react';
import { SectionId, BioPersona } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { analyzeMealImage } from '../services/geminiService.ts';

const Hero: React.FC = () => {
  const { incrementScans, setLastAnalysisResult, lastAnalysisResult, currentPersona, setCurrentPersona, language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [progress, setProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  
  const isAr = language === 'ar';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stationRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const personaData = [
    { id: 'GENERAL' as BioPersona, label: isAr ? 'عام' : 'GENERAL', icon: <Utensils size={14} />, slogan: isAr ? 'يومي' : 'Daily' },
    { id: 'PREGNANCY' as BioPersona, label: isAr ? 'حمل' : 'PREGNANCY', icon: <Baby size={14} />, slogan: isAr ? 'نمو' : 'Growth' },
    { id: 'DIABETIC' as BioPersona, label: isAr ? 'سكري' : 'DIABETIC', icon: <HeartPulse size={14} />, slogan: isAr ? 'توازن' : 'Sync' },
    { id: 'ATHLETE' as BioPersona, label: isAr ? 'رياضي' : 'ATHLETE', icon: <Zap size={14} />, slogan: isAr ? 'أداء' : 'Power' }
  ];

  const handlePersonaSelect = (id: BioPersona) => {
    setCurrentPersona(id);
    if (window.innerWidth < 1024) {
      stationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAnalyze = async () => {
    if (!image || status === 'loading') return;
    setStatus('loading');
    setProgress(0);
    
    const steps = isAr 
      ? ['تنشيط...', 'تحليل جزيئي...', 'فحص المكونات...', 'توليد التقرير...'] 
      : ['Activating...', 'Molecular Scan...', 'Checking...', 'Reporting...'];
    
    let currentStepIdx = 0;
    setLoadingStep(steps[0]);

    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 5) + 2;
        if (next >= 99) return 99;
        const stepIdx = Math.floor((next / 100) * steps.length);
        if (stepIdx !== currentStepIdx && stepIdx < steps.length) {
          currentStepIdx = stepIdx;
          setLoadingStep(steps[stepIdx]);
        }
        return next;
      });
    }, 100);

    try {
      const result = await analyzeMealImage(image, {
        chronicDiseases: "none",
        dietProgram: "general",
        activityLevel: "moderate",
        persona: currentPersona
      }, language); 
      
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);
      
      if (result) {
        setLastAnalysisResult({ ...result, timestamp: new Date().toLocaleString(), imageUrl: image });
        incrementScans(result);
        setStatus('success');
      }
    } catch (err: any) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setStatus('error');
    }
  };

  const handleDownload = () => {
    if (!lastAnalysisResult) return;
    const text = `BIO-REPORT: ${lastAnalysisResult.summary}\nCalories: ${lastAnalysisResult.totalCalories}\nScore: ${lastAnalysisResult.healthScore}%`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'otl-report.txt';
    a.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { 
        setImage(reader.result as string);
        setStatus('idle'); 
        setProgress(0);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id={SectionId.PHASE_01_SCAN} className="relative h-screen bg-brand-dark flex items-center justify-center overflow-hidden pt-16">
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col lg:flex-row lg:items-center lg:gap-20">
        
        {/* اليسار: المحتوى النصي والبروتوكولات */}
        <div className="lg:w-[45%] flex flex-col justify-center py-6 animate-fade-in z-20 space-y-12">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-brand-primary/10 rounded-full border border-brand-primary/20">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-primary">Module v5.0 Activated</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-serif font-bold text-white leading-[0.85] tracking-tighter">
                Precision <br /><span className="text-brand-primary italic font-normal">Biometrics.</span>
              </h1>
              <p className="text-white/30 text-base md:text-lg italic max-w-sm leading-relaxed">
                {isAr ? 'اختر البروتوكول لبدء التحليل الجزيئي للعينة.' : 'Select protocol to initiate molecular sample scanning.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {personaData.map((p) => {
              const isActive = currentPersona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => handlePersonaSelect(p.id)}
                  className={`group p-5 md:p-6 rounded-[35px] border transition-all duration-500 text-left relative overflow-hidden flex flex-col justify-between h-[120px] md:h-[140px]
                    ${isActive 
                      ? 'bg-brand-primary border-brand-primary text-brand-dark shadow-glow-sm scale-[1.02]' 
                      : 'bg-white/5 border-white/5 text-white/40 hover:bg-brand-primary/80 hover:text-brand-dark'}`}
                >
                  <div className="flex justify-between items-start">
                     <span className={`text-[7px] font-black uppercase tracking-widest block transition-colors duration-500 ${isActive ? 'text-brand-dark/60' : 'opacity-50 group-hover:text-brand-dark/60'}`}>PROTO</span>
                     <div className={`transition-all duration-500 ${isActive ? 'opacity-100 text-brand-dark' : 'opacity-20 group-hover:opacity-100 group-hover:text-brand-dark'}`}>
                        {p.icon}
                     </div>
                  </div>
                  <div className="mt-auto">
                    <span className={`text-base md:text-lg font-sans font-bold block leading-none mb-1 transition-colors duration-500 ${isActive ? 'text-brand-dark' : 'group-hover:text-brand-dark'}`}>{p.label}</span>
                    <span className={`text-[9px] italic font-medium block transition-colors duration-500 ${isActive ? 'text-brand-dark/50' : 'opacity-30 group-hover:text-brand-dark/50'}`}>{p.slogan}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        
        {/* اليمين: السكانر الاحترافي */}
        <div ref={stationRef} className="lg:w-[55%] w-full mt-10 lg:mt-0 flex flex-col items-center lg:items-end justify-center relative z-10">
           <div className="w-full max-w-[480px] aspect-[4/5] bg-[#0A0908] rounded-[60px] border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden group">
              
              <div className="flex-1 m-4 rounded-[45px] bg-[#050505] overflow-hidden flex flex-col border border-white/5">
                 
                 <div className="p-6 flex justify-between items-center bg-white/[0.02] border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-2">
                       <div className="w-1 h-1 rounded-full bg-brand-primary animate-pulse" />
                       <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em]">Live_Stream_Diagnostic</span>
                    </div>
                    {image && (
                      <button onClick={() => { setImage(null); setStatus('idle'); }} className="text-white/10 hover:text-brand-primary transition-all">
                         <RotateCcw size={12} />
                      </button>
                    )}
                 </div>

                 <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth p-6 md:p-8">
                    {status === 'idle' && !image ? (
                      <div onClick={() => fileInputRef.current?.click()} className="h-full flex flex-col items-center justify-center text-center space-y-8 cursor-pointer group/up py-10">
                         <div className="w-20 h-20 bg-brand-primary/5 border border-dashed border-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary group-hover/up:bg-brand-primary group-hover/up:text-brand-dark transition-all duration-700 shadow-glow">
                            <Camera size={32} strokeWidth={1} />
                         </div>
                         <div className="space-y-2">
                            <h4 className="text-2xl font-serif font-bold italic text-white/60 tracking-tight">{isAr ? 'تلقيم الرؤية' : 'Feed Vision'}</h4>
                            <p className="text-[9px] font-black text-brand-primary uppercase tracking-[0.6em]">{isAr ? 'اضغط للبدء' : 'SCAN SAMPLE'}</p>
                         </div>
                      </div>
                    ) : status === 'idle' && image ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-8 animate-fade-in">
                         <div className="relative aspect-square w-full max-w-[240px] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
                            <img src={image} className="w-full h-full object-cover grayscale-[0.2]" alt="Sample" />
                            <div className="absolute inset-0 bg-brand-primary/5 shadow-inner" />
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-brand-primary/50 shadow-glow animate-scan" />
                         </div>
                         <button onClick={handleAnalyze} className="w-full py-5 bg-brand-primary text-brand-dark rounded-full font-black text-[10px] uppercase tracking-[0.5em] shadow-glow hover:scale-[1.02] transition-all">
                            {isAr ? 'بدء الفحص' : 'INITIATE ANALYSIS'}
                         </button>
                      </div>
                    ) : status === 'loading' ? (
                      <div className="h-full flex flex-col items-center justify-center space-y-10 animate-fade-in py-6">
                         <div className="relative w-40 h-40">
                            <svg className="w-full h-full -rotate-90">
                               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="1" fill="transparent" className="text-white/5" />
                               <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="283" strokeDashoffset={283 - (283 * progress / 100)} className="text-brand-primary transition-all duration-500" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center font-sans font-bold text-4xl text-white">{progress}%</div>
                         </div>
                         <div className="text-center space-y-1">
                           <h3 className="text-brand-primary font-black uppercase tracking-[0.5em] animate-pulse text-[9px]">{loadingStep}</h3>
                         </div>
                      </div>
                    ) : status === 'success' && lastAnalysisResult ? (
                      <div className="w-full space-y-8 animate-fade-in py-2">
                         <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <FileText size={12} className="text-brand-primary" />
                              <span className="text-[8px] font-black text-brand-primary uppercase tracking-widest">{isAr ? 'التقرير الأيضي' : 'BIO-REPORT'}</span>
                            </div>
                            <h2 className="text-xl font-sans font-bold text-white tracking-tight leading-relaxed">{lastAnalysisResult.summary}</h2>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-5 rounded-[30px] border border-white/5">
                               <span className="text-[7px] font-black uppercase text-white/30 block mb-2 tracking-widest">ENERGY</span>
                               <div className="text-3xl font-sans font-bold text-white tracking-tighter">{lastAnalysisResult.totalCalories}<span className="text-[8px] ml-1 opacity-20 font-sans tracking-normal">KCAL</span></div>
                            </div>
                            <div className="bg-white/5 p-5 rounded-[30px] border border-white/5">
                               <span className="text-[7px] font-black uppercase text-white/30 block mb-2 tracking-widest">VITALITY</span>
                               <div className="text-3xl font-sans font-bold text-white tracking-tighter">{lastAnalysisResult.healthScore}%</div>
                            </div>
                         </div>

                         <div className="flex gap-3">
                            {['protein', 'carbs', 'fat'].map((macro) => (
                              <div key={macro} className="flex-1 bg-white/5 py-3 rounded-[20px] border border-white/5 text-center">
                                <span className="text-[7px] font-black text-white/20 uppercase block mb-1 tracking-widest">{macro}</span>
                                <span className="text-base font-sans font-bold text-white">{(lastAnalysisResult.macros as any)[macro]}g</span>
                              </div>
                            ))}
                         </div>

                         {lastAnalysisResult.warnings && lastAnalysisResult.warnings.length > 0 && (
                           <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-[30px] flex gap-4 items-start">
                              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                              <div className="space-y-1">
                                 <span className="text-[7px] font-black text-red-500 uppercase tracking-widest">ALERT</span>
                                 <p className="text-[10px] font-sans text-white/60 leading-relaxed">
                                   {typeof lastAnalysisResult.warnings[0] === 'object' ? (lastAnalysisResult.warnings[0] as any).text : lastAnalysisResult.warnings[0]}
                                 </p>
                              </div>
                           </div>
                         )}

                         <div className="p-6 bg-brand-primary/5 border border-brand-primary/20 rounded-[35px] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 text-brand-primary/10"><Info size={16} /></div>
                            <p className="text-white/70 text-xs font-sans italic leading-relaxed">"{lastAnalysisResult.personalizedAdvice}"</p>
                         </div>

                         <div className="flex gap-4 pt-4">
                            <button className="flex-1 py-5 bg-white/5 hover:bg-brand-primary hover:text-brand-dark transition-all rounded-[25px] flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-widest text-white border border-white/5">
                               <Share2 size={14} /> SHARE
                            </button>
                            <button onClick={handleDownload} className="w-16 py-5 bg-white/5 hover:bg-white hover:text-brand-dark transition-all rounded-[25px] flex items-center justify-center text-white border border-white/5">
                               <Download size={16} />
                            </button>
                         </div>
                      </div>
                    ) : null}
                 </div>

                 <div className="p-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01] shrink-0">
                    <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em]">System_Secure</span>
                    <div className="flex gap-1">
                       <div className="w-1 h-1 rounded-full bg-brand-primary/40" />
                       <div className="w-1 h-1 rounded-full bg-brand-primary" />
                    </div>
                 </div>
              </div>

              <div className="absolute right-0 top-1/3 bottom-1/3 w-[2px] bg-brand-primary/20 rounded-l-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-16 w-1 bg-brand-primary/40 rounded-r-full shadow-glow" />
           </div>

           <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

      </div>
    </section>
  );
};

export default Hero;
