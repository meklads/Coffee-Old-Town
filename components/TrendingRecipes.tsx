
import React from 'react';
// Added ArrowUpRight to imports
import { Activity, Clock, Flame, ChevronRight, Share2, Globe, ArrowUpRight } from 'lucide-react';
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
    <section id={SectionId.PHASE_04_ARCHIVE} className="py-48 bg-brand-light relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-32 space-y-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-4 px-6 py-2 bg-brand-dark text-brand-primary rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl">
                 <Globe size={14} />
                 <span>PHASE 04: GLOBAL SYNCHRONIZATION</span>
              </div>
              <h2 className="text-5xl md:text-[100px] font-serif font-bold text-brand-dark leading-[0.8] tracking-tighter">
                Trending <br /> <span className="text-brand-primary italic font-normal">Systems.</span>
              </h2>
           </div>
           <p className="text-brand-dark/40 text-2xl font-medium max-w-2xl italic leading-relaxed">
             Live biometric data reveals the most effective protocols currently adopted by our global network of elite performers.
           </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {recipes.map((recipe, idx) => (
            <div key={recipe.id} className={`group cursor-pointer relative ${idx === 1 ? 'md:translate-y-20' : ''}`}>
               <div className="relative aspect-[4/5] rounded-[64px] overflow-hidden mb-10 bg-brand-sand/20 shadow-2xl group-hover:shadow-[0_80px_100px_-30px_rgba(194,163,107,0.25)] transition-all duration-1000">
                  <img src={recipe.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" alt={recipe.title} />
                  
                  <div className="absolute top-10 right-10 flex flex-col items-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700">
                     <button className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 hover:bg-brand-primary transition-colors">
                        <Share2 size={18} />
                     </button>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute bottom-12 left-12 right-12">
                     <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-primary text-white rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-4">
                        {recipe.category}
                     </div>
                     <h3 className="text-4xl font-serif font-bold text-white leading-tight tracking-tight group-hover:text-brand-primary transition-colors">{recipe.title}</h3>
                  </div>
               </div>

               <div className="px-6 space-y-6">
                  <div className="flex items-center justify-between text-[11px] font-black text-brand-dark/20 uppercase tracking-[0.4em] border-b border-brand-dark/5 pb-6">
                     <span className="flex items-center gap-3"><Clock size={16} className="text-brand-primary/40" /> {recipe.time}</span>
                     <span className="flex items-center gap-3"><Flame size={16} className="text-brand-primary/40" /> {recipe.calories} LOAD</span>
                  </div>
                  <button onClick={() => setView('vaults')} className="inline-flex items-center gap-4 text-brand-dark font-black text-[10px] uppercase tracking-[0.6em] group-hover:text-brand-primary transition-colors">
                    Access Protocol <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          ))}
        </div>

        <div className="mt-64 text-center">
           <button 
             onClick={() => setView('vaults')}
             className="px-20 py-8 bg-brand-dark text-white rounded-[40px] font-black text-[11px] uppercase tracking-[0.6em] hover:bg-brand-primary transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex items-center gap-6 mx-auto group"
           >
             Enter The Global Archive <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
           </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingRecipes;
