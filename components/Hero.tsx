
import React, { useState, useRef, useEffect } from 'react';
import { Zap, Fingerprint, Plus, Activity, Cpu, ArrowDown } from 'lucide-react';
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
  const [counters, setCounters] = useState({ bio: 98.2, neuro: 442 });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language].hero;

  const galleryItems = [
    { img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1000&q=80", label: "PHASE_01" },
    { img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80", label: "PHASE_02" },
    { img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&q=80", label: "PHASE_03" },
    { img: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=1000&q=80", label: "PHASE_04" }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    
    const interval = setInterval(() => {
      setCounters({
        bio: +(98.2 + Math.random() * 0.5).toFixed(1),
        neuro: Math.floor(440 + Math.random() * 10)
      });
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentGalleryIdx((prev) => (prev + 1) % galleryItems.length);
    }, 4500);
    return () => clearInterval(timer);
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
    } catch (err: any) {
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
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id={SectionId.PHASE_01_SCAN} className="relative h-screen bg-brand-light flex flex-col items-center overflow-hidden lg:pt-24 pt-20">
      
      {/* Precision Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(#0A0A0A 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-primary/5 via-transparent to-transparent opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full h-full relative z-10 flex flex-col lg:justify-center">
        
        <div className="flex flex-col lg:grid lg:grid-cols-12 items-center gap-0 lg:gap-8 h-full">
          
          {/* LEFT: COMMAND STACK */}
          <div className="order-2 lg:order-1 lg:col-span-5 flex flex-col justify-center space-y-10 lg:space-y-14 w-full mt-10 lg:mt-0">
             
             {/* Title & Desc */}
             <div className="space-y-6">
                <div className="inline-flex items-center gap-3 px-3 py-1 bg-white border border-brand-primary/20 text-brand-primary rounded-full">
                   <Activity size={10} className="animate-pulse" />
                   <span className="text-[7px] font-black uppercase tracking-[0.5em]">{t.badge}</span>
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-[80px] font-serif font-bold text-brand-dark leading-[0.9] tracking-tighter">
                  Metabolic <span className="text-brand-primary italic font-normal">Diagnostic.</span>
                </h1>
                <p className="text-brand-dark/40 text-sm lg:text-base font-medium italic max-w-sm leading-relaxed border-l-2 border-brand-primary/20 pl-6">
                  Precision decryption of biological substrates. Deciphering ingredients through high-fidelity neural imaging.
                </p>
             </div>

             {/* Scanner Box */}
             <div className="w-full max-w-[380px]">
                <div className="relative group bg-white border border-brand-dark/5 rounded-[32px] p-1 overflow-hidden transition-all duration-700 hover:border-brand-primary/30">
                   <div 
                     onClick={() => fileInputRef.current?.click()}
                     className="relative aspect-[16/8] rounded-[28px] border border-dashed border-brand-dark/5 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all bg-brand-light/20 hover:bg-white"
                   >
                      {image ? (
                         <div className="absolute inset-0">
                            <img src={image} className="w-full h-full object-cover" alt="Specimen" />
                            <div className="absolute inset-0 bg-brand-dark/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                               <button onClick={(e) => { e.stopPropagation(); handleAnalyze(); }} className="bg-brand-primary text-white p-5 rounded-full shadow-2xl scale-110 active:scale-95 transition-transform">
                                  <Zap size={20} />
                                </button>
                            </div>
                         </div>
                      ) : (
                         <div className="flex items-center gap-5 px-6 group-hover:scale-105 transition-transform duration-700">
                            <div className="w-12 h-12 rounded-xl border border-brand-dark/5 bg-white flex items-center justify-center shadow-sm">
                               <Plus size={20} strokeWidth={1} className="text-brand-primary" />
                            </div>
                            <div className="text-left">
                               <span className="block text-[8px] font-black uppercase tracking-[0.4em] text-brand-dark/30">INITIALIZE</span>
                               <span className="block text-[10px] font-bold text-brand-dark/60 uppercase tracking-widest mt-0.5">UPLOAD SPECIMEN</span>
                            </div>
                         </div>
                      )}
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                   </div>
                </div>
             </div>
          </div>

          {/* CENTER: THE NEURAL PULSE (Vertical Bridge) */}
          <div className="order-3 lg:order-2 lg:col-span-2 flex flex-col items-center justify-center relative min-h-[100px] lg:min-h-full">
             <div className="w-[1px] h-[60px] lg:h-[400px] bg-gradient-to-b from-transparent via-brand-primary/20 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-12">
                   
                   {/* Sync Node 1 */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
                      <div className="bg-white/80 border border-brand-dark/5 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                         <span className="text-[7px] font-black text-brand-primary uppercase tracking-widest">{counters.bio}%</span>
                      </div>
                   </div>

                   <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-primary shadow-xl border border-white/10">
                      <Cpu size={14} className="animate-spin-slow" />
                   </div>

                   {/* Sync Node 2 */}
                   <div className="flex flex-col items-center gap-2">
                      <div className="bg-white/80 border border-brand-dark/5 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-sm">
                         <span className="text-[7px] font-black text-brand-primary uppercase tracking-widest">{counters.neuro}HZ</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping delay-500" />
                   </div>

                </div>
             </div>
          </div>

          {/* RIGHT: SPECIMEN GALLERY (Vertical) */}
          <div className="order-1 lg:order-3 lg:col-span-5 flex justify-center lg:justify-end w-full">
             <div 
               className="relative w-full max-w-[320px] lg:max-w-[440px] aspect-[4/5.5] rounded-[50px] overflow-hidden bg-brand-dark border-[8px] border-white shadow-3xl group"
               style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
             >
                {galleryItems.map((item, idx) => (
                   <div 
                     key={idx}
                     className={`absolute inset-0 transition-all duration-[2000ms] ease-in-out ${currentGalleryIdx === idx ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-full scale-110 pointer-events-none'}`}
                   >
                      <img src={item.img} className="w-full h-full object-cover saturate-[0.8]" alt="Protocol" />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent" />
                      
                      <div className="absolute bottom-10 left-10 right-10">
                         <div className="flex items-center gap-3 mb-3">
                            <div className="h-[1px] w-8 bg-brand-primary" />
                            <span className="text-[8px] font-black text-brand-primary uppercase tracking-[0.5em]">SYSTEM_CALIBRATED</span>
                         </div>
                         <h3 className="text-4xl lg:text-5xl font-black text-white leading-[0.85] tracking-tighter drop-shadow-2xl">
                           {item.label}
                         </h3>
                      </div>
                   </div>
                ))}

                {/* Vertical Navigator */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2.5 z-30">
                   {galleryItems.map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-1 rounded-full transition-all duration-700 ${currentGalleryIdx === i ? 'h-8 bg-brand-primary shadow-[0_0_10px_#C2A36B]' : 'h-1.5 bg-white/10'}`} 
                      />
                   ))}
                </div>

                {/* ID Tag */}
                <div className="absolute top-8 left-8 z-30">
                   <div className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
                      <Fingerprint size={12} className="text-brand-primary" />
                      <span className="text-[7px] font-black text-white uppercase tracking-widest">ENCRYPTED_ID</span>
                   </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-primary/30 shadow-[0_0_15px_#C2A36B] animate-scan z-40 opacity-40" />
             </div>
          </div>

        </div>

        {/* Minimal Scroll Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 opacity-10">
           <ArrowDown size={12} className="animate-bounce" />
        </div>

      </div>
    </section>
  );
};

export default Hero;
