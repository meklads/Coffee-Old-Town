
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Microscope, Fingerprint, AlertCircle, CheckCircle2, RotateCcw, Database, Sparkles, Flame, Activity } from 'lucide-react';
import { SectionId } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';
import { analyzeMealImage } from '../services/geminiService.ts';

const Hero: React.FC = () => {
  const { incrementScans, setLastAnalysisResult, scrollTo, lastAnalysisResult } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [archiveIdx, setArchiveIdx] = useState(0);
  const [isArchiveVisible, setIsArchiveVisible] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  // Updated stable High-Res Unsplash IDs
  const archiveSamples = [
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1200&q=80",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=1200&q=80",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=1200&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth > 1024) {
        setMousePos({
          x: (e.clientX / window.innerWidth - 0.5) * 12,
          y: (e.clientY / window.innerHeight - 0.5) * 12
        });
      }
    };
    
    const archiveTimer = setInterval(() => {
      setIsArchiveVisible(false);
      setTimeout(() => {
        setArchiveIdx(prev => (prev + 1) % archiveSamples.length);
        setIsArchiveVisible(true);
      }, 800); // Faster cross-fade for better UI
    }, 6000);

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(archiveTimer);
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
    }, 150);

    try {
      const result = await analyzeMealImage(image, {
        chronicDiseases: "none",
        dietProgram: "general",
        activityLevel: "moderate"
      });

      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setProgress(100);

      if (result && result.totalCalories) {
        setLastAnalysisResult({ ...result, timestamp: new Date().toLocaleString(), imageUrl: image });
        incrementScans(result);
        setStatus('success');
      } else {
        throw new Error("Could not parse biological data from image.");
      }
    } catch (err: any) {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setStatus('error');
      setErrorMessage(err.message || "Diagnostic connection failure.");
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
    <section id={SectionId.PHASE_01_SCAN} className="relative min-h-screen bg-brand-light flex items-center overflow-hidden pt-32 pb-12 lg:pt-24">
      <div className="absolute inset-0 pointer-events-none opacity-[0.012] z-0" style={{ backgroundImage: 'radial-gradient(#0A0A0A 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl w-full mx-auto px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-32 items-center">
          
          {/* Column 2 (Scanner) - Order 1 on Mobile */}
          <div className="flex justify-center lg:justify-end items-center relative order-1 lg:order-2">
             <div 
               className="relative w-full max-w-full md:max-w-[440px] transition-all duration-1000 z-20 px-4 lg:px-0"
               style={{ transform: window.innerWidth > 1024 ? `translate(${mousePos.x}px, ${mousePos.y}px)` : 'none' }}
             >
               <div className="relative aspect-[3/4] md:aspect-[3/4.2] rounded-[40px] md:rounded-[80px] border-[1.5px] border-brand-dark/[0.08] bg-white overflow-hidden shadow-4xl z-20 group">
                  
                  {image ? (
                    <div className="absolute inset-0">
                      <img src={image} className="w-full h-full object-cover transition-all duration-700" alt="Specimen" />
                      
                      {status === 'loading' && (
                        <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fade-in">
                           <div className="relative w-28 h-28 md:w-36 md:h-36 mb-8">
                              <svg className="w-full h-full -rotate-90">
                                <circle cx="50%" cy="50%" r="44%" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                                <circle cx="50%" cy="50%" r="44%" stroke="currentColor" strokeWidth="4" fill="transparent" 
                                  strokeDasharray={427} 
                                  strokeDashoffset={427 - (427 * progress) / 100}
                                  className="text-brand-primary transition-all duration-300 ease-out" 
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-3xl md:text-4xl font-serif font-bold text-white">{progress}%</span>
                              </div>
                           </div>
                           <span className="text-[8px] md:text-[9px] font-black text-brand-primary uppercase tracking-[0.6em] animate-pulse text-center px-4">ENCRYPTED_DATA_EXTRACTION</span>
                        </div>
                      )}

                      {status === 'success' && lastAnalysisResult && (
                        <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-xl flex flex-col p-8 md:p-10 z-50 text-white animate-fade-in">
                           <div className="flex justify-between items-start mb-6 md:mb-8">
                              <div className="bg-brand-primary/20 p-2.5 md:p-3 rounded-2xl border border-brand-primary/30">
                                 <CheckCircle2 className="text-brand-primary" size={20} />
                              </div>
                              <button onClick={resetScanner} className="p-2 text-white/20 hover:text-white transition-colors">
                                 <RotateCcw size={18} />
                              </button>
                           </div>

                           <div className="space-y-1 mb-6 md:mb-8">
                              <span className="text-[7px] md:text-[8px] font-black text-brand-primary uppercase tracking-[0.5em]">Diagnostic_Report</span>
                              <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight line-clamp-2">{lastAnalysisResult.summary}</h3>
                           </div>

                           <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                              <div className="bg-white/5 p-4 md:p-5 rounded-3xl border border-white/5 space-y-1 md:space-y-2">
                                 <div className="flex items-center gap-2 opacity-40">
                                    <Flame size={10} /> <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Energy</span>
                                 </div>
                                 <p className="text-xl md:text-2xl font-serif font-bold">{lastAnalysisResult.totalCalories}<span className="text-[8px] md:text-[10px] ml-1 opacity-40">kcal</span></p>
                              </div>
                              <div className="bg-white/5 p-4 md:p-5 rounded-3xl border border-white/5 space-y-1 md:space-y-2">
                                 <div className="flex items-center gap-2 opacity-40">
                                    <Activity size={10} /> <span className="text-[7px] md:text-[8px] font-black uppercase tracking-widest">Health</span>
                                 </div>
                                 <p className="text-xl md:text-2xl font-serif font-bold text-brand-primary">{lastAnalysisResult.healthScore}%</p>
                              </div>
                           </div>

                           <button 
                             onClick={() => scrollTo(SectionId.PHASE_03_SYNTHESIS)}
                             className="w-full mt-auto py-5 md:py-6 bg-brand-primary text-brand-dark rounded-2xl md:rounded-3xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-glow"
                           >
                             SYNC PROTOCOL HUB
                           </button>
                        </div>
                      )}

                      {status === 'error' && (
                        <div className="absolute inset-0 bg-red-950/95 backdrop-blur-xl flex flex-col items-center justify-center z-50 text-white p-10 text-center animate-fade-in">
                           <AlertCircle size={48} className="mb-6 text-red-500" />
                           <span className="text-[10px] md:text-[12px] font-black uppercase tracking-widest mb-3 text-red-400">Scanner Fault</span>
                           <p className="text-[9px] opacity-70 leading-relaxed mb-8">{errorMessage}</p>
                           <button onClick={handleAnalyze} className="w-full py-4 bg-brand-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all">
                             Force Re-Scan
                           </button>
                           <button onClick={resetScanner} className="mt-6 text-[8px] font-bold uppercase tracking-widest opacity-40 hover:opacity-100">Clear Data</button>
                        </div>
                      )}

                      {status === 'idle' && (
                        <div className="absolute inset-0 bg-brand-dark/40 lg:opacity-0 lg:group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-6 z-40 backdrop-blur-sm">
                           <button 
                             onClick={handleAnalyze} 
                             className="bg-brand-primary text-brand-dark p-8 md:p-10 rounded-full shadow-glow hover:scale-110 active:scale-95 transition-all"
                           >
                              <Microscope size={32} md:size={40} />
                           </button>
                           <span className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.6em]">Run_Analysis_Cycle</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-sand/10 transition-all group p-6"
                    >
                      <div className="relative mb-8 md:mb-10">
                         <div className="absolute -inset-12 md:-inset-16 border border-brand-primary/5 rounded-full animate-pulse-slow" />
                         <div className="w-20 h-20 md:w-24 md:h-24 rounded-[30px] md:rounded-[40px] bg-brand-light flex items-center justify-center border border-brand-dark/[0.04] shadow-sm transition-transform group-hover:scale-110">
                          <Plus size={32} md:size={40} strokeWidth={1} className="text-brand-primary" />
                         </div>
                      </div>
                      <div className="text-center space-y-2 md:space-y-3">
                        <h4 className="text-xl md:text-[22px] font-serif font-bold text-brand-dark/50 tracking-tight italic">Insert Sample</h4>
                        <div className="flex flex-col items-center">
                           <span className="text-[7px] font-black text-brand-dark/20 uppercase tracking-[0.8em]">AWAITING_INPUT</span>
                           <div className="w-20 md:w-24 h-px bg-brand-dark/5 mt-4" />
                        </div>
                      </div>
                    </div>
                  )}

                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
               </div>

               <div className="absolute -bottom-10 right-10 lg:-bottom-12 lg:right-12 flex items-center gap-4 opacity-10">
                  <Fingerprint size={14} md:size={16} />
                  <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.6em]">BIO_X_SCANNER_V6.1</p>
               </div>
             </div>
          </div>

          {/* Column 1 (Headline) - Order 2 on Mobile */}
          <div className="flex flex-col space-y-10 md:space-y-12 animate-fade-in order-2 lg:order-1 px-4 lg:px-0">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-brand-dark/[0.05] rounded-full shadow-sm mx-auto lg:mx-0">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === 'loading' ? 'bg-orange-400 animate-spin' : 'bg-brand-primary animate-pulse'}`} />
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-dark/50">
                    {status === 'loading' ? 'ANALYSIS_IN_PROGRESS' : 'BIO_DIAGNOSTIC_READY'}
                  </span>
               </div>
               
               <div className="text-center lg:text-left">
                 <h1 className="text-5xl md:text-8xl lg:text-[110px] font-serif font-bold text-brand-dark leading-[0.8] tracking-tighter">
                   Metabolic <br /><span className="text-brand-primary italic font-normal">Diagnostic.</span>
                 </h1>
                 <p className="text-brand-dark/40 text-[10px] md:text-[11px] font-bold tracking-tight mt-6 md:mt-10 mx-auto lg:mx-0 max-w-sm leading-relaxed uppercase">
                    PRECISION INSTRUMENTATION FOR REAL-TIME MOLECULAR DATA EXTRACTION AND CELLULAR CALIBRATION.
                 </p>
               </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 border-t border-brand-dark/5 pt-10">
               <div className="flex flex-col">
                  <span className="text-[7px] font-black text-brand-dark/20 uppercase tracking-widest">System Latency</span>
                  <span className="text-lg md:text-xl font-serif font-bold">0.12ms</span>
               </div>
               <div className="w-px h-8 bg-brand-dark/10" />
               <div className="flex flex-col">
                  <span className="text-[7px] font-black text-brand-dark/20 uppercase tracking-widest">Data Confidence</span>
                  <span className="text-lg md:text-xl font-serif font-bold">99.8%</span>
               </div>
            </div>
            
            {/* Archive Viewport (Hidden on Mobile) */}
            <div className="hidden lg:block relative group w-full max-w-lg aspect-[16/9] overflow-hidden rounded-[48px] bg-white border border-brand-dark/[0.08] shadow-2xl">
               <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isArchiveVisible ? 'opacity-100' : 'opacity-0'}`}>
                  <img 
                    src={archiveSamples[archiveIdx]} 
                    className="w-full h-full object-cover transition-transform duration-[8000ms] ease-linear scale-100 group-hover:scale-110" 
                    alt="Archive Specimen" 
                  />
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none" />
               <div className="absolute bottom-8 left-8 flex items-center gap-4">
                  <div className="p-3 bg-brand-dark shadow-2xl rounded-2xl border border-white/10">
                    <Database size={16} className="text-brand-primary" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.5em] drop-shadow-md">SPECIMEN_ARCHIVE</span>
                     <span className="text-sm font-serif font-bold text-white tracking-tight italic drop-shadow-md">Archive Record #{archiveIdx + 7045}</span>
                  </div>
               </div>
               <div className="absolute top-8 right-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-brand-primary/90 backdrop-blur-md rounded-full shadow-xl">
                     <Sparkles size={10} className="text-brand-dark" />
                     <span className="text-[8px] font-black text-brand-dark uppercase tracking-widest">High Res Display</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
