
import React, { useState, useRef, useEffect } from 'react';
import { Plus, Cpu, Microscope, Terminal } from 'lucide-react';
import { SectionId } from '../types.ts';
import { analyzeMealImage } from '../services/geminiService.ts';
import { useApp } from '../context/AppContext.tsx';
import { translations } from '../translations.ts';

const Hero: React.FC = () => {
  const { incrementScans, setLastAnalysisResult, language } = useApp();
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [telemetry, setTelemetry] = useState({ temp: 36.7, load: 15, latency: 4 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const galleryItems = [
    { img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1000&q=80", tag: "BIO", label: "Biological Specimen", sub: "NODE_01_ALPHA" },
    { img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80", tag: "NEURO", label: "Cognitive Substrate", sub: "NODE_02_BETA" },
    { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80", tag: "CELL", label: "Cellular Integrity", sub: "NODE_03_GAMMA" },
    { img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=80", tag: "KINETIC", label: "Kinetic Velocity", sub: "NODE_04_DELTA" }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 6,
        y: (e.clientY / window.innerHeight - 0.5) * 6
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const telemetryInterval = setInterval(() => {
      setTelemetry({
        temp: +(36.5 + Math.random() * 0.4).toFixed(1),
        load: Math.floor(12 + Math.random() * 8),
        latency: Math.floor(3 + Math.random() * 4)
      });
    }, 4000);

    const galleryTimer = setInterval(() => setCurrentGalleryIdx((prev) => (prev + 1) % galleryItems.length), 7000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(telemetryInterval);
      clearInterval(galleryTimer);
    };
  }, []);

  const handleAnalyze = async () => {
    if (!image || status === 'loading') return;
    setStatus('loading');
    try {
      const result: any = await analyzeMealImage(image, { chronicDiseases: '', dietProgram: '', activityLevel: 'moderate' });
      if (result) {
        setLastAnalysisResult({ ...result, timestamp: new Date().toLocaleString(), imageUrl: image });
        incrementScans(result);
        setStatus('idle');
      }
    } catch (err: any) { setStatus('error'); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setImage(reader.result as string); setStatus('idle'); };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id={SectionId.PHASE_01_SCAN} className="relative h-screen min-h-[750px] bg-brand-light flex flex-col items-center justify-center overflow-hidden select-none">
      
      {/* Background HUD Micro-Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.012]" style={{ backgroundImage: 'radial-gradient(#0A0A0A 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(194,163,107,0.08)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-6 z-10">
        
        {/* CONCENTRATED CENTRAL BLOCK */}
        <div className="flex flex-col items-center justify-center gap-10 md:gap-14">
          
          {/* 1. HEADING: Lowered to meet the modules in the center */}
          <div className="w-full flex flex-col items-center lg:items-start space-y-4 translate-y-4">
             <div className="flex items-center gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-brand-dark/[0.04] rounded-full shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                  <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-dark/40">DIAGNOSTIC AXIS ACTIVE</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 border border-brand-primary/10 rounded-full">
                   <Terminal size={8} className="text-brand-primary" />
                   <span className="text-[7px] font-bold text-brand-primary uppercase tracking-widest">LAB_NODE_01</span>
                </div>
             </div>
             
             <div className="text-center lg:text-left space-y-2">
               <h1 className="text-6xl md:text-8xl lg:text-[110px] font-serif font-bold text-brand-dark leading-[0.8] tracking-tighter">
                 Metabolic <br /><span className="text-brand-primary italic font-normal">Diagnostic.</span>
               </h1>
               <p className="text-brand-dark/40 text-[10px] md:text-[12px] font-bold tracking-tight ml-1 max-w-lg">
                  {language === 'ar' ? 'أدوات سريرية دقيقة للتحليل البيولوجي والتمثيل الغذائي المتطور.' : 'Precision clinical instrumentation for biological synthesis and metabolic analysis.'}
               </p>
             </div>
          </div>

          {/* 2. MODULES: Elevated and bottom-aligned */}
          <div className="grid lg:grid-cols-12 w-full gap-8 lg:gap-0 items-end">
            
            {/* LEFT: ARCHIVE (Elevated higher into the center) */}
            <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col items-start w-full hidden md:flex">
              <div className="relative group w-full max-w-[440px] mx-auto lg:mx-0">
                  <div className="flex gap-6 mb-4 opacity-40 px-4">
                     <div className="flex flex-col">
                        <span className="text-[5px] font-black tracking-widest text-brand-dark uppercase">CORE_T</span>
                        <span className="text-[9px] font-bold text-brand-dark tracking-tight">{telemetry.temp}°C</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[5px] font-black tracking-widest text-brand-dark uppercase">SYSTEM_LOAD</span>
                        <span className="text-[9px] font-bold text-brand-dark tracking-tight">{telemetry.load}%</span>
                     </div>
                  </div>

                  <div className="relative aspect-[16/11] overflow-hidden rounded-[40px] bg-brand-sand/5 border border-brand-dark/[0.04] shadow-sm">
                      {galleryItems.map((item, idx) => (
                        <div 
                          key={idx}
                          className={`absolute inset-0 transition-all duration-[2400ms] ease-in-out ${currentGalleryIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                        >
                          <img src={item.img} className="w-full h-full object-cover saturate-[0.5] contrast-[1.1] hover:saturate-100 transition-all duration-1000" alt="Specimen Archive" />
                          <div className="absolute bottom-8 left-10 space-y-0.5">
                             <span className="block text-[6px] font-black text-white/40 uppercase tracking-[0.5em]">{item.sub}</span>
                             <h4 className="text-2xl font-serif font-bold text-white tracking-tight">{item.label}</h4>
                          </div>
                        </div>
                      ))}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2800ms] pointer-events-none" />
                  </div>
              </div>
            </div>

            {/* CENTER: NEURAL BRIDGE (Visually linking the two) */}
            <div className="order-3 lg:order-2 lg:col-span-2 hidden lg:flex flex-col items-center justify-center h-full translate-y-8">
              <div className="w-[1px] h-48 bg-gradient-to-t from-brand-dark/[0.12] via-brand-dark/[0.04] to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-10">
                  <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-primary border border-white/5 shadow-2xl">
                    <Cpu size={14} className="animate-pulse" />
                  </div>
                  <span className="text-[5px] font-black text-brand-primary tracking-widest rotate-90 uppercase opacity-30">BRIDGE_LINK</span>
                </div>
              </div>
            </div>

            {/* RIGHT: SCANNER (Elevated and bottom-aligned with Archive) */}
            <div className="order-1 lg:order-3 lg:col-span-5 flex justify-center lg:justify-end w-full">
              <div 
                className="relative w-full max-w-[300px] md:max-w-[340px] lg:max-w-[380px] transition-all duration-700"
                style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
              >
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="relative aspect-[3/4.1] rounded-[60px] border border-brand-dark/[0.08] bg-white overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-all group shadow-sm hover:shadow-2xl"
                >
                  {/* Visual Interface Brackets */}
                  <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-brand-primary/20 rounded-tl-[60px] pointer-events-none" />
                  <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-brand-primary/20 rounded-tr-[60px] pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-brand-primary/20 rounded-bl-[60px] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-brand-primary/20 rounded-br-[60px] pointer-events-none" />

                  {image ? (
                    <div className="absolute inset-0">
                      <img src={image} className="w-full h-full object-cover" alt="Selected Specimen" />
                      <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-[8px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-10">
                        <div className="relative">
                          <div className="absolute -inset-8 border border-brand-primary/10 rounded-full animate-ping" />
                          <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="relative bg-brand-primary text-white p-7 rounded-full shadow-3xl hover:scale-110 active:scale-95 transition-all">
                            {status === 'loading' ? <div className="w-7 h-7 border-2 border-white/20 border-t-white animate-spin rounded-full" /> : <Microscope size={28} />}
                          </button>
                        </div>
                        <span className="text-[9px] font-black text-white uppercase tracking-[0.5em] animate-pulse">INIT_SCAN</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-10 group-hover:scale-105 transition-transform duration-1000">
                      <div className="relative">
                         <div className="absolute -inset-10 border border-brand-primary/5 rounded-full animate-pulse-slow" />
                         <div className="w-16 h-16 rounded-[28px] bg-brand-light flex items-center justify-center border border-brand-dark/[0.02]">
                          <Plus size={24} strokeWidth={1} className="text-brand-primary" />
                         </div>
                      </div>
                      <div className="text-center space-y-2">
                        <span className="block text-[6px] font-black text-brand-dark/20 uppercase tracking-[0.6em]">SCANNER_IDLE</span>
                        <span className="block text-[11px] font-bold text-brand-dark/40 uppercase tracking-tight">Insert Specimen</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Visual Laser Line */}
                  <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary/40 shadow-[0_0_20px_#C2A36B] animate-scan z-40 opacity-40" />
                  
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
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
