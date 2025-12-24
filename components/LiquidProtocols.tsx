
import React, { useState } from 'react';
import { SectionId } from '../types.ts';
import { ShieldPlus, Zap, Activity, ArrowUpRight, FlaskConical, Loader2, PlayCircle, Fingerprint } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

const LiquidProtocols: React.FC = () => {
  const { setSelectedGoal, scrollTo } = useApp();
  const [activeId, setActiveId] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const protocols = [
    {
      id: 0,
      label: 'Immunity Boost',
      desc: 'BIO-ACTIVE GINGER & MANUKA CONCENTRATE',
      icon: <ShieldPlus size={24} />,
      img: 'https://images.unsplash.com/photo-1584017947486-591494884242?w=1200&q=90&fit=crop', // Bio-science ginger
      efficiency: '+12.4%',
      tag: 'RESILIENCE',
      color: 'from-orange-500/20',
      accent: 'text-orange-500'
    },
    {
      id: 1,
      label: 'Bio-Recovery',
      desc: 'ANTHOCYANIN & PEPTIDE INFUSION',
      icon: <Activity size={24} />,
      img: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?w=1200&q=90&fit=crop', // Medical Blue science
      efficiency: '+14.2%',
      tag: 'REPAIR',
      color: 'from-blue-500/20',
      accent: 'text-blue-500'
    },
    {
      id: 2,
      label: 'Neural Focus',
      desc: 'MATCHA L-THEANINE NOOTROPIC STACK',
      icon: <Zap size={24} />,
      img: 'https://images.unsplash.com/photo-1582733315333-6a42f063e05a?w=1200&q=90&fit=crop', // High-end Matcha Powder
      efficiency: '+18.1%',
      tag: 'COGNITION',
      color: 'from-green-500/20',
      accent: 'text-green-500'
    }
  ];

  const handleProtocolClick = (item: typeof protocols[0]) => {
    setSelectedGoal(item.label);
    scrollTo(SectionId.PHASE_03_SYNTHESIS);
  };

  return (
    <section id={SectionId.PHASE_02_PROTOCOLS} className="bg-[#080808] py-48 overflow-hidden relative border-y border-white/5 transition-colors duration-700">
      {/* Subtle Lab Grid Background */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: `radial-gradient(circle, #C2A36B 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <div className="lg:col-span-5 space-y-16 animate-fade-in">
            <div className="space-y-10">
               <div className="flex flex-col gap-6">
                  <div className="inline-flex items-center gap-4 text-brand-primary">
                    <FlaskConical size={18} className="animate-pulse" />
                    <span className="text-[11px] font-black uppercase tracking-[0.7em]">PHASE 02: LIQUID SYNTHESIS</span>
                  </div>
                  <h2 className="text-5xl md:text-7xl xl:text-8xl font-serif font-bold text-white tracking-tighter leading-[0.8] mb-4">
                    Substrate <br /> <span className="text-brand-primary italic font-normal">Protocols.</span>
                  </h2>
               </div>
               <p className="text-white/30 text-xl font-medium italic max-w-md leading-relaxed border-l-4 border-brand-primary pl-10">
                 Precision liquid formulations engineered for rapid cellular synchronization.
               </p>
            </div>

            <div className="space-y-4">
              {protocols.map((item) => (
                <button 
                  key={item.id}
                  onMouseEnter={() => setActiveId(item.id)}
                  onClick={() => handleProtocolClick(item)}
                  className={`w-full group relative flex items-center justify-between p-8 rounded-[40px] transition-all duration-700 border text-left
                    ${activeId === item.id 
                      ? 'bg-brand-primary/10 border-brand-primary/50 shadow-2xl shadow-brand-primary/10 translate-x-4' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-700
                      ${activeId === item.id ? 'bg-brand-primary text-white shadow-glow scale-110' : 'bg-white/5 text-brand-primary/40'}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className={`text-2xl font-serif font-bold transition-colors duration-700 ${activeId === item.id ? 'text-white' : 'text-white/20'}`}>
                        {item.label}
                      </h4>
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-primary/60 mt-2">
                        {item.tag} FORMULA
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={24} className={`transition-all duration-700 ${activeId === item.id ? 'text-brand-primary translate-x-0' : 'text-white/5 translate-x-2'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="relative aspect-[16/11] w-full">
              {/* Dynamic Glow Aura */}
              <div className={`absolute -inset-20 bg-gradient-to-br ${protocols[activeId].color} to-transparent blur-[120px] transition-all duration-1000 opacity-60`} />
              
              <div className="relative h-full w-full bg-[#0D0D0D] rounded-[80px] p-6 shadow-3xl border border-white/5 overflow-hidden group">
                {protocols.map((p, idx) => (
                  <div 
                    key={p.id}
                    className={`absolute inset-6 rounded-[60px] overflow-hidden transition-all duration-1000 transform
                      ${activeId === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                  >
                    {!loadedImages[idx] && (
                      <div className="absolute inset-0 bg-white/5 flex items-center justify-center z-20">
                        <Loader2 className="animate-spin text-brand-primary/30" size={40} />
                      </div>
                    )}
                    <img 
                      src={p.img} 
                      className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110 saturate-[0.8] grayscale-[0.2]"
                      alt={p.label}
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [idx]: true }))}
                    />
                    {/* Visual Overlay for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    
                    {/* Laboratory Floating Labels */}
                    <div className="absolute top-10 right-10 flex flex-col items-end gap-3">
                      <div className="bg-brand-primary/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl font-serif font-bold text-xl shadow-2xl border border-white/20">
                        {p.efficiency}
                      </div>
                      <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2">
                        <Fingerprint size={12} className="text-brand-primary" />
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">Digital Verified</span>
                      </div>
                    </div>

                    <div className="absolute bottom-12 left-12 right-12">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="h-px w-12 bg-brand-primary" />
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.8em]">SYSTEM CALIBRATED</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tighter leading-none">
                        Protocol: <br /> <span className="text-brand-primary italic font-normal">{p.label}</span>
                      </h3>
                      <p className="text-white/40 text-xs font-medium uppercase tracking-[0.3em] mt-6">
                        {p.desc}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Central Focus Effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                   <div className="w-24 h-24 bg-brand-primary/5 backdrop-blur-2xl rounded-full border border-brand-primary/20 flex items-center justify-center shadow-glow animate-pulse">
                      <PlayCircle size={40} className="text-brand-primary" />
                   </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LiquidProtocols;
