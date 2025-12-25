
import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, Plus, Activity, Cpu, MoveVertical, Microscope, Info, Boxes, Terminal, Shield } from 'lucide-react';
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
  const t = translations[language].hero;

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

    const galleryTimer = setInterval(() => setCurrentGalleryIdx((prev) => (prev + 1) % galleryItems.length), 9000);

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
    <section id={SectionId.PHASE_01_SCAN} className="relative min-h-screen bg-brand-light flex items-center justify-center overflow-hidden select-none pt-40 lg:pt-24">
      
      {/* Background Micro-HUD Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0A0A0A 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[160px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      {/* Persistent System Status (Bottom Corner) */}
      <div className="absolute bottom-10 left-10 hidden xl:flex flex-col gap-1 opacity-20">
        <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-dark">SYS_KERNEL_STABLE</span>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 h-full flex flex-col justify-center">
        
        {/* MOBILE HEADER: Floating Priority */}
        <div className="lg:hidden mb-16 flex flex-col items-center text-center space-y-4 order-2 mt-8">
           <h1 className="text-6xl font-serif font-bold text-brand-dark leading-[0.85] tracking-tighter">
             Metabolic <br /><span className="text-brand-primary italic font-normal">Diagnostic.</span>
           </h1>
           <p className="text-brand-dark/20 text-[9px] font-black uppercase tracking-[0.6em]">Awaiting specimen intake</p>
        </div>

        {/* DESKTOP HEADER: Main Anchor */}
        <div className="hidden lg:block mb-12 space-y-4">
           <div className="flex items-center gap-6">
              <div className="inline-flex items-center gap-4 px-4 py-1.5 bg-white border border-brand-dark/[0.04] rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.6em] text-brand-dark/40">DIAGNOSTIC AXIS ACTIVE</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 border border-brand-primary/10 rounded-full">
                 <Terminal size={8} className="text-brand-primary" />
                 <span className="text-[7px] font-bold text-brand-primary uppercase tracking-widest">BRIDGE ACTIVE</span>
              </div>
           </div>
           <h1 className="text-6xl md:text-8xl lg:text-[115px] font-serif font-bold text-brand-dark leading-[0.8] tracking-tighter">
             Metabolic <br /><span className="text-brand-primary italic font-normal">Diagnostic.</span>
           </h1>
           <p className="text-brand-dark/20 text-[10px] font-black uppercase tracking-[0.6em] ml-1">Precision instrumentation for clinical synthesis.</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 w-full gap-20 lg:gap-0 items-start">
          
          {/* LEFT: THE ARCHIVE MODULE (Lowered Positioning) */}
          <div className="order-3 lg:order-1 lg:col-span-5 flex flex-col items-start lg:pt-40 w-full hidden md:flex">
            <div className="relative group w-full max-w-[460px] mx-auto lg:mx-0">
                {/* Telemetry Stats Above Gallery */}
                <div className="flex gap-10 mb-8 opacity-25 group-hover:opacity-100 transition-opacity duration-700 px-4">
                   <div className="flex flex-col">
                      <span className="text-[5px] font-black tracking-widest text-brand-dark uppercase">CORE_T</span>
                      <span className="text-[9px] font-bold text-brand-dark tracking-tight">{telemetry.temp}°C</span>
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[5px] font-black tracking-widest text-brand-dark uppercase">LOAD</span>
                      <span className="text-[9px] font-bold text-brand-dark tracking-tight">{telemetry.load}%</span>
                   </div>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[50px] bg-brand-sand/5 border border-brand-dark/[0.03] shadow-none">
                    {galleryItems.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`absolute inset-0 transition-all duration-[2400ms] ease-in-out ${currentGalleryIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                      >
                        <img src={item.img} className="w-full h-full object-cover saturate-[0.5] contrast-[1.1] hover:saturate-100 transition-all duration-1000" alt="Specimen Archive" />
                        <div className="absolute bottom-10 left-12 space-y-1.5">
                           <span className="block text-[7px] font-black text-white/40 uppercase tracking-[0.5em]">{item.sub}</span>
                           <h4 className="text-3xl font-serif font-bold text-white tracking-tight">{item.label}</h4>
                        </div>
                      </div>
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[2800ms] pointer-events-none" />
                </div>
                
                <p className="mt-8 px-4 text-brand-dark/20 text-[9px] font-black uppercase tracking-[0.6em] leading-relaxed max-w-sm hidden lg:block">
                  ARCHIVAL DATA STREAMS VERIFIED VIA NEURAL LINK.
                </p>
            </div>
          </div>

          {/* CENTER: THE NEURAL AXIS (Visual Anchor) */}
          <div className="order-2 lg:col-span-2 hidden lg:flex flex-col items-center justify-start relative h-[450px] pt-4">
            <div className="w-[1px] h-full bg-gradient-to-b from-brand-dark/[0.08] via-brand-dark/[0.04] to-transparent relative">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-14">
                <div className="w-11 h-11 rounded-full bg-brand-dark flex items-center justify-center text-brand-primary border border-white/5 shadow-3xl">
                  <Cpu size={16} className="animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[6px] font-black text-brand-primary tracking-widest rotate-90 uppercase opacity-40">STREAMING</span>
                </div>
              </div>
              {/* Animated Axis Pulse */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-brand-primary rounded-full blur-[1px] animate-[axis-pulse_5s_linear_infinite]" />
            </div>
          </div>

          {/* RIGHT: THE SCANNER POD (Raised Positioning) */}
          <div className="order-1 lg:order-3 lg:col-span-5 flex justify-center lg:justify-end w-full lg:-mt-16">
            <div 
              className="relative w-full max-w-[320px] md:max-w-[360px] lg:max-w-[420px] transition-all duration-700"
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[3/4.2] rounded-[80px] border border-brand-dark/[0.08] bg-white overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-all group shadow-none"
              >
                {/* Circuit Corner Elements */}
                <div className="absolute top-0 left-0 w-28 h-28 border-t-2 border-l-2 border-brand-primary/20 rounded-tl-[80px] pointer-events-none" />
                <div className="absolute top-0 right-0 w-28 h-28 border-t-2 border-r-2 border-brand-primary/20 rounded-tr-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-28 h-28 border-b-2 border-l-2 border-brand-primary/20 rounded-bl-[80px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-28 h-28 border-b-2 border-r-2 border-brand-primary/20 rounded-br-[80px] pointer-events-none" />

                {image ? (
                  <div className="absolute inset-0">
                    <img src={image} className="w-full h-full object-cover" alt="Selected Specimen" />
                    <div className="absolute inset-0 bg-brand-dark/95 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-12">
                      <div className="relative">
                        <div className="absolute -inset-10 border border-brand-primary/10 rounded-full animate-ping" />
                        <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="relative bg-brand-primary text-white p-8 rounded-full shadow-3xl hover:scale-110 active:scale-95 transition-all">
                          {status === 'loading' ? <div className="w-8 h-8 border-2 border-white/20 border-t-white animate-spin rounded-full" /> : <Microscope size={34} />}
                        </button>
                      </div>
                      <span className="text-[11px] font-black text-white uppercase tracking-[0.7em] animate-pulse">INIT_BIOMETRICS</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-14 group-hover:scale-105 transition-transform duration-1000">
                    <div className="relative">
                       <div className="absolute -inset-12 border border-brand-primary/5 rounded-full animate-pulse-slow" />
                       <div className="w-24 h-24 rounded-[42px] bg-brand-light flex items-center justify-center border border-brand-dark/[0.02] shadow-sm">
                        <Plus size={32} strokeWidth={1} className="text-brand-primary" />
                       </div>
                    </div>
                    <div className="text-center space-y-3">
                      <span className="block text-[8px] font-black text-brand-dark/20 uppercase tracking-[0.9em]">SCANNER_IDLE</span>
                      <span className="block text-sm font-bold text-brand-dark/40 uppercase tracking-[0.25em]">Awaiting Specimen</span>
                    </div>
                  </div>
                )}
                
                {/* Visual Scanner Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-[1.5px] bg-brand-primary/40 shadow-[0_0_25px_#C2A36B] animate-scan z-40 opacity-50" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-brand-primary/[0.02] via-transparent to-white/[0.04] pointer-events-none" />
                
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes axis-pulse {
          0% { top: 0%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;
