
import React from 'react';
import { ArrowUpRight, Database, Beaker, ChevronRight } from 'lucide-react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { SectionId } from '../types.ts';

const RecipeGrid: React.FC = () => {
  const { language, setView } = useApp();

  const featuredProtocols = [
    { 
      id: '01',
      title: language === 'ar' ? 'القهوة المضادة للرصاص' : 'Bulletproof Protocol',
      category: 'BIO-HACKING',
      img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80',
    },
    { 
      id: '02',
      title: language === 'ar' ? 'الترطيب الخلوي' : 'Cellular Hydration',
      category: 'HYDRATION',
      img: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=1000&q=80',
    },
    { 
      id: '03',
      title: language === 'ar' ? 'الصيام الدوري' : 'Circadian Sync',
      category: 'LONGEVITY',
      img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&q=80',
    },
    { 
      id: '04',
      title: language === 'ar' ? 'التخمير الحيوي' : 'Gut Ecosystem',
      category: 'GUT-HEALTH',
      img: 'https://images.unsplash.com/photo-1555448248-2571daf6344b?w=1000&q=80',
    }
  ];

  return (
    <section id={SectionId.RECIPE_VAULT} className="py-0 bg-brand-dark overflow-hidden relative group/section">
      <div className="absolute inset-0 bg-brand-primary/5 opacity-0 group-hover/section:opacity-100 transition-opacity duration-1000 pointer-events-none" />
      
      <div className="max-w-[1800px] mx-auto px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 h-auto lg:h-[80vh]">
          {featuredProtocols.map((item, idx) => (
            <div 
              key={item.id} 
              onClick={() => { setView('vaults'); window.scrollTo(0,0); }}
              className="group relative h-[500px] lg:h-full border-b lg:border-b-0 lg:border-r border-white/5 overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0">
                <img 
                  src={item.img} 
                  className="w-full h-full object-cover grayscale transition-all duration-[3000ms] group-hover:scale-110 group-hover:grayscale-0 opacity-40 group-hover:opacity-100" 
                  alt={item.title} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

              <div className="absolute top-10 right-10 text-white/[0.03] font-serif text-[180px] font-bold select-none leading-none group-hover:text-brand-primary/10 transition-colors duration-1000">
                {item.id}
              </div>

              <div className="absolute inset-0 p-12 flex flex-col justify-end">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-px bg-brand-primary group-hover:w-16 transition-all duration-700" />
                    <span className="text-brand-primary font-black text-[10px] uppercase tracking-[0.5em]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-white text-5xl font-serif font-bold leading-[0.85] tracking-tighter group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-white/40 text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-700">
                     <span>Explore 10 Protocols</span>
                     <ChevronRight size={14} className="animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="absolute top-12 left-12 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity">
                 <Beaker size={14} className="text-brand-primary" />
                 <span className="text-[9px] font-black text-white uppercase tracking-[0.3em]">SECURE ACCESS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeGrid;
