
import React from 'react';
import { Clock, Flame, ChevronRight, Share2, Globe, ArrowUpRight } from 'lucide-react';
import { Recipe, SectionId } from '../types.ts';
import { useApp } from '../context/AppContext.tsx';

const TrendingRecipes: React.FC = () => {
  const { setView } = useApp();
  
  const recipes: Recipe[] = [
    {
      id: 1,
      title: 'Anti-Inflammatory Broth',
      category: 'RECOVERY',
      time: '20 min',
      calories: 180,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=2071',
    },
    {
      id: 2,
      title: 'Ketogenic Lipid-Fuel',
      category: 'KETO-OS',
      time: '15 min',
      calories: 420,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070',
    },
    {
      id: 3,
      title: 'Precision Grilled Salmon',
      category: 'PROTEIN+',
      time: '25 min',
      calories: 320,
      image: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?q=80&w=1964',
    }
  ];

  return (
    <section id={SectionId.PHASE_04_ARCHIVE} className="py-32 bg-brand-light dark:bg-brand-dark relative overflow-hidden transition-colors duration-1000">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-10">
           <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2 bg-brand-dark dark:bg-brand-primary/10 text-brand-primary rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-lg border border-brand-primary/10">
                 <Globe size={14} />
                 <span>GLOBAL SYNCHRONIZATION</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-brand-dark dark:text-white leading-none tracking-tighter">
                Trending <span className="text-brand-primary italic font-normal">Systems.</span>
              </h2>
           </div>
           <button 
             onClick={() => { setView('vaults'); window.scrollTo(0,0); }}
             className="hidden md:flex items-center gap-4 text-brand-dark/40 dark:text-white/40 hover:text-brand-primary transition-colors text-[10px] font-black uppercase tracking-[0.4em] border-b border-brand-dark/5 pb-2"
           >
             View Complete Archive <ChevronRight size={16} />
           </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="group cursor-pointer relative">
               <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden mb-6 bg-brand-sand/10 shadow-xl transition-all duration-700 hover:shadow-2xl">
                  <img src={recipe.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" alt={recipe.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-8 left-8 right-8 space-y-3">
                     <span className="text-[7px] font-black uppercase tracking-[0.4em] text-brand-primary">{recipe.category}</span>
                     <h3 className="text-2xl font-serif font-bold text-white leading-tight tracking-tight">{recipe.title}</h3>
                  </div>
               </div>

               <div className="px-4 flex items-center justify-between">
                  <div className="flex gap-4 text-[9px] font-black text-brand-dark/20 dark:text-white/20 uppercase tracking-widest">
                     <span className="flex items-center gap-2"><Clock size={12} /> {recipe.time}</span>
                     <span className="flex items-center gap-2"><Flame size={12} /> {recipe.calories}</span>
                  </div>
                  <div className="p-2 rounded-full border border-brand-dark/5 dark:border-white/5 opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight size={14} className="text-brand-primary" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingRecipes;
