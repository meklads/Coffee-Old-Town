
import React, { useEffect } from 'react';
import { ShoppingBag, Plus, Sparkles, Coffee, ChevronDown, ShieldCheck, ArrowUpRight } from 'lucide-react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';

const CoffeeCorner: React.FC = () => {
  const { language } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const products = [
    { 
      t: 'Old Town Blend', 
      desc: 'Dark roast, high antioxidant profile. Engineered for morning focus.', 
      price: '$28', 
      img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&auto=format&fit=crop',
      tag: 'Best Seller'
    },
    { 
      t: 'Zen Ethos (Light)', 
      desc: 'Ethically sourced, low-acidity beans for gut sensitivity.', 
      price: '$34', 
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop',
      tag: 'New'
    },
    { 
      t: 'Barista Kit Pro', 
      desc: 'Clinical-grade pour-over kit with thermal stability control.', 
      price: '$120', 
      img: 'https://images.unsplash.com/photo-1544787210-2211dca2106e?w=800&auto=format&fit=crop',
      tag: 'Tools'
    },
    { 
      t: 'Bio-Neutralizer Filter', 
      desc: 'Molecular water structuring system for perfect extraction.', 
      price: '$45', 
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop',
      tag: 'Advanced'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-40">
      {/* Cinematic Store Header */}
      <div className="relative h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-brand-dark">
        <div className="absolute inset-0">
           <img 
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=2000&q=80" 
            className="w-full h-full object-cover opacity-20 grayscale" 
            alt="Store Hero"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-brand-dark/40" />
        </div>
        
        <div className="relative z-10 space-y-8 animate-fade-in-up">
           <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto text-brand-primary border border-brand-primary/20 backdrop-blur-xl">
              <Coffee size={40} strokeWidth={1} />
           </div>
           <div className="space-y-4">
              <h1 className="text-6xl md:text-[120px] font-serif font-bold text-brand-dark tracking-tighter leading-none">
                Lab <span className="text-brand-primary italic font-normal">Store.</span>
              </h1>
              <p className="text-brand-dark/40 text-xl font-medium uppercase tracking-[0.5em] italic">
                Bio-Optimized Equipment
              </p>
           </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-dark/10 animate-bounce">
           <ChevronDown size={32} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div className="max-w-xl space-y-4">
            <div className="inline-flex items-center gap-3 text-brand-gold bg-brand-cream px-4 py-2 rounded-full border border-brand-gold/10">
               <ShieldCheck size={14} />
               <span className="font-black text-[9px] uppercase tracking-[0.4em]">Official Clinical Source</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark leading-none tracking-tighter">Precision <br /> Extraction <span className="text-brand-gold">Nodes.</span></h2>
          </div>
          <div className="flex gap-4">
             <button className="bg-brand-dark text-white px-10 py-5 rounded-[20px] font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all shadow-2xl flex items-center gap-4">
                SECURE CHECKOUT <ShoppingBag size={18} />
             </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {products.map((item, idx) => (
             <div key={idx} className="group relative bg-brand-cream/20 rounded-[48px] overflow-hidden border border-brand-dark/[0.04] hover:shadow-3xl transition-all duration-700 flex flex-col h-full">
                <div className="aspect-[4/5] overflow-hidden relative bg-brand-sand/10">
                   <img 
                    src={item.img} 
                    className="w-full h-full object-cover transition-all duration-[2000ms] group-hover:scale-110 saturate-[0.8] group-hover:saturate-100" 
                    alt={item.t} 
                   />
                   <div className="absolute top-6 left-6 bg-brand-dark text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-xl">
                      {item.tag}
                   </div>
                   <button className="absolute bottom-6 right-6 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-brand-dark shadow-2xl translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-brand-gold hover:text-white">
                      <Plus size={24} />
                   </button>
                </div>
                <div className="p-8 space-y-6 flex-grow flex flex-col">
                   <div className="flex justify-between items-start">
                      <h3 className="text-2xl font-serif font-bold text-brand-dark tracking-tight leading-tight">{item.t}</h3>
                      <span className="text-brand-gold font-bold text-xl font-serif">{item.price}</span>
                   </div>
                   <p className="text-brand-dark/40 text-sm leading-relaxed font-medium italic flex-grow">
                      {item.desc}
                   </p>
                   <button className="w-full py-5 bg-brand-dark text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brand-primary transition-all shadow-lg flex items-center justify-center gap-3">
                      Add to Protocol <Plus size={14} />
                   </button>
                </div>
             </div>
           ))}
        </div>

        {/* Brand Promise Banner */}
        <div className="mt-40 bg-brand-dark rounded-[64px] p-12 lg:p-24 relative overflow-hidden text-center">
           <div className="absolute top-0 left-0 w-full h-full bg-brand-primary/5 opacity-40 pointer-events-none" />
           <div className="relative z-10 space-y-12">
              <div className="max-w-3xl mx-auto space-y-6">
                 <h3 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter">Clinical Grade <br /><span className="text-brand-primary italic">Distribution.</span></h3>
                 <p className="text-white/30 text-lg font-medium italic">All equipment is verified for temperature precision and molecular preservation standards.</p>
              </div>
              <button className="inline-flex items-center gap-4 text-brand-primary font-black text-[11px] uppercase tracking-[0.6em] border-b border-brand-primary/20 pb-2 hover:border-brand-primary transition-all">
                Learn about our standards <ArrowUpRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CoffeeCorner;
