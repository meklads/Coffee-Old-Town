
import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint, Plus, Activity, Cpu, MoveVertical, Microscope, Info, Boxes } from 'lucide-react';
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
  const [pulseData, setPulseData] = useState(98.6);
  
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
    const interval = setInterval(() => setPulseData(+(98.4 + Math.random() * 0.4).toFixed(1)), 2500);
    const galleryTimer = setInterval(() => setCurrentGalleryIdx((prev) => (prev + 1) % galleryItems.length), 7500);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
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
    <section id={SectionId.PHASE_01_SCAN} className="relative h-screen bg-brand-light flex items-center justify-center overflow-hidden select-none">
      
      {/* Background Micro-Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.012]" style={{ backgroundImage: 'radial-gradient(#0A0A0A 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      {/* Metabolic Waveform (Creative Touch) */}
      <div className="absolute top-1/4 left-0 w-full opacity-[0.04] pointer-events-none">
        <svg viewBox="0 0 1000 100" className="w-full h-32">
          <path d="M0,50 Q125,10 250,50 T500,50 T750,50 T1000,50" fill="none" stroke="#C2A36B" strokeWidth="0.5" className="animate-[dash_12s_linear_infinite]" />
          <style>{`@keyframes dash { from { stroke-dasharray: 0, 1000; } to { stroke-dasharray: 1000, 0; } }`}</style>
        </svg>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 h-full flex items-center">
        <div className="flex flex-col lg:grid lg:grid-cols-12 w-full gap-16 lg:gap-0 items-center">
          
          {/* LEFT COLUMN: TITLE & SPECIMEN VIEW */}
          <div className="order-1 lg:col-span-5 flex flex-col items-start space-y-12 w-full">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-white border border-brand-dark/[0.04] rounded-full shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
                <span className="text-[7px] font-black uppercase tracking-[0.5em] text-brand-dark/40">INSTRUMENT_SYNC_ACTIVE</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-[88px] font-serif font-bold text-brand-dark leading-[0.82] tracking-tighter">
                Metabolic <br /><span className="text-brand-primary italic font-normal">Diagnostic.</span>
              </h1>
            </div>

            {/* Gallery (Aligned top with Scanner) */}
            <div className="relative group w-full max-w-[420px]">
                {/* Floating Technical Tags */}
                <div className="absolute -top-8 right-0 flex items-center gap-4 opacity-30 group-hover:opacity-100 transition-opacity">
                   <span className="text-[6px] font-black tracking-widest text-brand-primary uppercase">OXY_SAT: 98%</span>
                   <span className="text-[6px] font-black tracking-widest text-brand-dark/40 uppercase">PH: 7.35</span>
                </div>

                <div className="relative aspect-[16/10] overflow-hidden rounded-[40px] bg-brand-sand/10 border border-brand-dark/[0.03]">
                    {galleryItems.map((item, idx) => (
                      <div 
                        key={idx}
                        className={`absolute inset-0 transition-all duration-[2400ms] ease-in-out ${currentGalleryIdx === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                      >
                        <img src={item.img} className="w-full h-full object-cover saturate-[0.7] contrast-[1.05]" alt="Specimen" />
                        <div className="absolute bottom-8 left-8 space-y-1.5">
                           <span className="block text-[7px] font-black text-white/40 uppercase tracking-[0.5em]">{item.sub}</span>
                           <h4 className="text-2xl font-serif font-bold text-white tracking-tight">{item.label}</h4>
                        </div>
                      </div>
                    ))}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none" />
                </div>
            </div>
          </div>

          {/* CENTER COLUMN: THE NEURAL BRIDGE */}
          <div className="order-2 lg:col-span-2 flex flex-col items-center justify-center relative h-full">
            <div className="w-px h-[100px] lg:h-[400px] bg-gradient-to-b from-transparent via-brand-dark/[0.05] to-transparent relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-12">
                <div className="bg-white px-2 py-0.5 rounded-full border border-brand-dark/[0.05] shadow-sm">
                  <span className="text-[6px] font-black text-brand-primary tracking-widest uppercase">{pulseData}%</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center text-brand-primary">
                  <Cpu size={12} className="animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: THE SCANNER (Aligned Top with Gallery) */}
          <div className="order-3 lg:col-span-5 flex justify-end w-full">
            <div 
              className="relative w-full max-w-[320px] lg:max-w-[370px] transition-all duration-700 p-4"
              style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative aspect-[3/4.2] rounded-[70px] border border-brand-dark/[0.05] bg-white overflow-hidden cursor-pointer flex flex-col items-center justify-center transition-all group shadow-none"
              >
                {/* Pulsing Gold Corner Accents */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-brand-primary/50 rounded-tl-[70px] pointer-events-none animate-pulse-slow" style={{ maskImage: 'radial-gradient(circle at top left, black 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at top left, black 30%, transparent 85%)' }} />
                <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-brand-primary/50 rounded-tr-[70px] pointer-events-none animate-pulse-slow" style={{ maskImage: 'radial-gradient(circle at top right, black 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at top right, black 30%, transparent 85%)' }} />
                <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-brand-primary/50 rounded-bl-[70px] pointer-events-none animate-pulse-slow" style={{ maskImage: 'radial-gradient(circle at bottom left, black 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at bottom left, black 30%, transparent 85%)' }} />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-brand-primary/50 rounded-br-[70px] pointer-events-none animate-pulse-slow" style={{ maskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 85%)', WebkitMaskImage: 'radial-gradient(circle at bottom right, black 30%, transparent 85%)' }} />

                {image ? (
                  <div className="absolute inset-0">
                    <img src={image} className="w-full h-full object-cover" alt="Specimen" />
                    <div className="absolute inset-0 bg-brand-dark/90 backdrop-blur-[3px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-8">
                      <div className="relative">
                        <div className="absolute -inset-6 border border-brand-primary/15 rounded-full animate-ping" />
                        <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="relative bg-brand-primary text-white p-6 rounded-full transform transition-all active:scale-90 shadow-2xl">
                          {status === 'loading' ? <div className="w-6 h-6 border-2 border-white/20 border-t-white animate-spin rounded-full" /> : <Microscope size={24} />}
                        </button>
                      </div>
                      <div className="text-center space-y-1">
                        <span className="block text-[8px] font-black text-white uppercase tracking-[0.5em]">INITIALIZE ANALYSIS</span>
                        <span className="block text-[6px] font-black text-brand-primary uppercase tracking-[0.6em]">SECURE_LINK_V2</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-12 group-hover:scale-105 transition-transform duration-1000">
                    <div className="relative">
                       <div className="absolute -inset-10 border border-brand-primary/5 rounded-full animate-pulse-slow" />
                       <div className="w-24 h-24 rounded-[36px] bg-brand-light flex items-center justify-center border border-brand-dark/[0.02]">
                        <Plus size={28} strokeWidth={1} className="text-brand-primary" />
                       </div>
                    </div>
                    <div className="text-center space-y-2">
                      <span className="block text-[7px] font-black text-brand-dark/20 uppercase tracking-[0.7em]">INPUT_FEED_01</span>
                      <span className="block text-[11px] font-bold text-brand-dark/40 uppercase tracking-[0.2em]">Ready for diagnostic</span>
                    </div>
                  </div>
                )}
                
                {/* Visual Laser Line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-primary/30 shadow-[0_0_15px_#C2A36B] animate-scan z-40 opacity-30" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/[0.02] via-transparent to-brand-primary/[0.04] pointer-events-none" />
                
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              
              {/* External Floating Tags */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
                 <div className="flex items-center gap-4 px-6 py-2.5 bg-brand-dark rounded-2xl border border-white/5 shadow-2xl">
                    <Fingerprint size={12} className="text-brand-primary" />
                    <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.4em]">AUTH_KEY_READY</span>
                 </div>
                 <div className="flex items-center gap-3 px-4 py-2 bg-white border border-brand-dark/[0.05] rounded-2xl">
                    <Boxes size={12} className="text-brand-dark/20" />
                    <span className="text-[7px] font-black text-brand-dark/30 uppercase tracking-[0.2em]">NODE_{pulseData}</span>
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
