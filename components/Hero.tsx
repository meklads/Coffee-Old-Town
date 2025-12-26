
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Microscope, Fingerprint, AlertCircle, CheckCircle2, RefreshCw, X, Flame, Activity, Zap, ShieldAlert, Link as LinkIcon, RotateCcw } from 'lucide-react';
import { SectionId } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { GoogleGenAI } from "@google/genai";

const Hero: React.FC = () => {
  const { incrementScans, setLastAnalysisResult, scrollTo, lastAnalysisResult } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleAnalyze = async () => {
    if (!image || status === 'loading') return;

    setStatus('loading');
    setProgress(0);
    setErrorMessage('');

    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => (prev >= 92 ? 92 : prev + Math.floor(Math.random() * 4) + 1));
    }, 180);

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API_KEY_MISSING");

      const ai = new GoogleGenAI({ apiKey });
      const mimeType = image.match(/data:(.*?);/)?.[1] || 'image/jpeg';
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-flash-lite-latest',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: mimeType } },
            { text: "Analyze this meal. Return JSON: {ingredients: [], totalCalories: number, healthScore: number, macros: {protein, carbs, fat}, summary: string, personalizedAdvice: string}." }
          ]
        },
        config: { responseMimeType: "application/json", temperature: 0.1 }
      });

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);

      const result = JSON.parse(response.text || '{}');
      
      if (result && result.totalCalories) {
        setLastAnalysisResult({ ...result, timestamp: new Date().toLocaleString(), imageUrl: image });
        incrementScans(result);
        setStatus('success');
      } else {
        throw new Error("DATA_INCONSISTENCY_DETECTED");
      }
    } catch (err: any) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setStatus('error');
      setErrorMessage(err.message || "Connection fault during extraction.");
    }
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

  const resetScanner = () => {
    setImage(null);
    setStatus('idle');
    setProgress(0);
    setErrorMessage('');
  };

  return (
    <section id={SectionId.PHASE_01_SCAN} className="relative min-h-screen bg-brand-light flex items-center overflow-hidden pt-24 pb-12">
      <div className="absolute inset-0 pointer-events-none opacity-[0.012] z-0" style={{ backgroundImage: 'radial-gradient(#0A0A0A 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl w-full mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="flex flex-col space-y-10 animate-fade-in">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-brand-dark/[0.03] rounded-full shadow-sm">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === 'loading' ? 'bg-orange-400 animate-spin' : 'bg-brand-primary animate-pulse'}`} />
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-dark/40">
                    {status === 'loading' ? 'ANALYSIS_IN_PROGRESS' : 'BIO_DIAGNOSTIC_READY'}
                  </span>
               </div>
               
               <div className="text-left">
                 <h1 className="text-6xl md:text-8xl lg:text-[110px] font-serif font-bold text-brand-dark leading-[0.75] tracking-tighter">
                   Metabolic <br /><span className="text-brand-primary italic font-normal">Diagnostic.</span>
                 </h1>
                 <p className="text-brand-dark/40 text-[11px] font-bold tracking-tight mt-10 ml-1 max-w-sm leading-relaxed">
                    PRECISION INSTRUMENTATION FOR REAL-TIME MOLECULAR DATA EXTRACTION AND CELLULAR CALIBRATION.
                 </p>
               </div>
            </div>

            <div className="flex items-center gap-8 pt-8">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-brand-dark/20 uppercase tracking-widest">System Latency</span>
                  <span className="text-xl font-serif font-bold">0.12ms</span>
               </div>
               <div className="w-px h-8 bg-brand-dark/10" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black text-brand-dark/20 uppercase tracking-widest">Data Confidence</span>
                  <span className="text-xl font-serif font-bold">99.8%</span>
               </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end items-center relative">
             <div 
               className="relative w-full max-w-[360px] md:max-w-[440px] transition-all duration-1000 z-20"
               style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
             >
               {/* Scanner Main Body */}
               <div className="relative aspect-[3/4.2] rounded-[80px] border-[1.5px] border-brand-dark/[0.08] bg-white overflow-hidden shadow-4xl z-20 group">
                  
                  {image ? (
                    <div className="absolute inset-0">
                      <img src={image} className="w-full h-full object-cover grayscale-[0.3] transition-all duration-700" alt="Specimen" />
                      
                      {status === 'loading' && (
                        <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
                           <div className="relative w-36 h-36 mb-8">
                              <svg className="w-full h-full -rotate-90">
                                <circle cx="72" cy="72" r="68" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                                <circle cx="72" cy="72" r="68" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                  strokeDasharray={427} 
                                  strokeDashoffset={427 - (427 * progress) / 100}
                                  className="text-brand-primary transition-all duration-300 ease-out" 
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-serif font-bold text-white">{progress}%</span>
                              </div>
                           </div>
                           <span className="text-[9px] font-black text-brand-primary uppercase tracking-[0.6em] animate-pulse">EXTRACTING_CORE_DATA</span>
                        </div>
                      )}

                      {status === 'success' && lastAnalysisResult && (
                        <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl flex flex-col p-10 z-50 text-white animate-fade-in">
                           <div className="flex justify-between items-start mb-8">
                              <div className="bg-brand-primary/20 p-3 rounded-2xl border border-brand-primary/30">
                                 <CheckCircle2 className="text-brand-primary" size={24} />
                              </div>
                              <button onClick={resetScanner} className="p-2 text-white/20 hover:text-white transition-colors">
                                 <RotateCcw size={20} />
                              </button>
                           </div>

                           <div className="space-y-1 mb-8">
                              <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.5em]">Diagnostic_Report</span>
                              <h3 className="text-3xl font-serif font-bold leading-tight line-clamp-2">{lastAnalysisResult.summary}</h3>
                           </div>

                           <div className="grid grid-cols-2 gap-4 mb-10">
                              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-2">
                                 <div className="flex items-center gap-2 opacity-40">
                                    <Flame size={12} /> <span className="text-[8px] font-black uppercase tracking-widest">Energy</span>
                                 </div>
                                 <p className="text-2xl font-serif font-bold">{lastAnalysisResult.totalCalories}<span className="text-[10px] ml-1 opacity-40">kcal</span></p>
                              </div>
                              <div className="bg-white/5 p-5 rounded-3xl border border-white/5 space-y-2">
                                 <div className="flex items-center gap-2 opacity-40">
                                    <Activity size={12} /> <span className="text-[8px] font-black uppercase tracking-widest">Health</span>
                                 </div>
                                 <p className="text-2xl font-serif font-bold text-brand-primary">{lastAnalysisResult.healthScore}%</p>
                              </div>
                           </div>

                           <div className="space-y-4 mb-10">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                                 <span>Protein</span>
                                 <span>{lastAnalysisResult.macros.protein}g</span>
                              </div>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className="h-full bg-brand-primary w-2/3" />
                              </div>
                           </div>

                           <button 
                             onClick={() => scrollTo(SectionId.PHASE_03_SYNTHESIS)}
                             className="w-full mt-auto py-6 bg-brand-primary text-brand-dark rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-glow"
                           >
                             SYNC PROTOCOL HUB
                           </button>
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="absolute inset-0 bg-red-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-50 text-white p-12 text-center animate-fade-in">
                           <AlertCircle size={56} className="mb-6 text-red-500" />
                           <span className="text-[12px] font-black uppercase tracking-widest mb-3 text-red-400">Scanner Fault</span>
                           <p className="text-[10px] opacity-70 leading-relaxed mb-10">{errorMessage}</p>
                           <button onClick={handleAnalyze} className="w-full py-5 bg-brand-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all">
                             Force Re-Scan
                           </button>
                           <button onClick={resetScanner} className="mt-6 text-[9px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Clear Data</button>
                        </div>
                      )}

                      {status === 'idle' && (
                        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-6 z-40 backdrop-blur-sm">
                           <button 
                             onClick={handleAnalyze} 
                             className="bg-brand-primary text-brand-dark p-10 rounded-full shadow-glow hover:scale-110 active:scale-95 transition-all"
                           >
                              <Microscope size={40} />
                           </button>
                           <span className="text-[10px] font-black text-white uppercase tracking-[0.6em]">Run_Analysis_Cycle</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-sand/10 transition-all group"
                    >
                      <div className="relative mb-10">
                         <div className="absolute -inset-16 border border-brand-primary/5 rounded-full animate-pulse-slow" />
                         <div className="w-24 h-24 rounded-[40px] bg-brand-light flex items-center justify-center border border-brand-dark/[0.04] shadow-sm transition-transform group-hover:scale-110">
                          <Plus size={40} strokeWidth={1} className="text-brand-primary" />
                         </div>
                      </div>
                      <div className="text-center space-y-3">
                        <h4 className="text-[22px] font-serif font-bold text-brand-dark/50 tracking-tight italic">Insert Sample</h4>
                        <div className="flex flex-col items-center">
                           <span className="text-[7px] font-black text-brand-dark/20 uppercase tracking-[0.8em]">AWAITING_INPUT</span>
                           <div className="w-24 h-px bg-brand-dark/5 mt-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               </div>

               {/* Design Elements for the "Machine" Look */}
               <div className="absolute -bottom-12 right-12 flex items-center gap-4 opacity-10">
                  <Fingerprint size={16} />
                  <p className="text-[8px] font-black uppercase tracking-[0.6em]">BIO_X_SCANNER_V6.1</p>
               </div>
               <div className="absolute -top-12 left-10 opacity-10 rotate-90">
                  <p className="text-[8px] font-black uppercase tracking-[0.8em]">CALIBRATED_STABLE</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
