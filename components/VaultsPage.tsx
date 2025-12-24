
import React, { useEffect, useState } from 'react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight, Search, Clock, ShieldCheck, Beaker, ChevronRight, ChevronLeft, Globe } from 'lucide-react';
import { Recipe } from '../types.ts';

const VaultsPage: React.FC = () => {
  const { setView, setSelectedRecipe } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const articles: Recipe[] = [
    { 
      id: 1,
      title: 'Bulletproof Coffee Protocol',
      category: 'BIO-HACKING',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&q=80',
      time: '7 min',
      calories: 220,
      description: 'Programming mitochondria via clean fats.',
      ingredients: ['Organic Beans', 'MCT Oil', 'Grass-fed Ghee'],
      fullContent: 'Combining high-quality lipids with organic caffeine optimizes cognitive throughput.'
    },
    { 
      id: 2,
      title: 'Molecular Avocado Toast',
      category: 'NUTRITION',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1000&q=80',
      time: '12 min',
      calories: 340,
      description: 'The morning brain-fuel blueprint.',
      ingredients: ['Sourdough', 'Ripe Avocado', 'Hemp Seeds']
    },
    { 
      id: 3,
      title: 'Circadian Fasting Protocol',
      category: 'LONGEVITY',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&q=80',
      time: 'Daily',
      calories: 0,
      description: 'Aligning biological clock with light cycles.'
    },
    { 
      id: 4,
      title: 'Cellular Hydration Solution',
      category: 'HYDRATION',
      image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=1000&q=80',
      time: '3 min',
      calories: 5,
      description: 'Mineral balance for optimized signaling.'
    },
    { 
      id: 5,
      title: 'Nootropic Stacking for Coffee',
      category: 'COGNITION',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&q=80',
      time: '5 min',
      calories: 10,
      description: 'Integrating functional mushrooms with caffeine.'
    },
    { 
      id: 6,
      title: 'Magnesium Recovery Protocol',
      category: 'RECOVERY',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?w=1000&q=80',
      time: 'Sleep Prep',
      calories: 0,
      description: 'Optimizing deep sleep quality.'
    }
  ];

  const handleArticleClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('recipe_detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-white min-h-screen pb-40 animate-fade-in">
      <section className="bg-brand-dark min-h-[50vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1600&q=80" className="w-full h-full object-cover grayscale" alt="Vault BG" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-brand-dark" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-primary/10 text-brand-primary rounded-full border border-brand-primary/20 text-[9px] font-black uppercase tracking-[0.4em]">
            <Globe size={12} />
            <span>GLOBAL ARCHIVE ACCESS</span>
          </div>
          <h1 className="text-6xl md:text-[100px] font-serif font-bold text-white tracking-tighter leading-none">
            Clinical <span className="text-brand-primary italic">Vault.</span>
          </h1>
          <p className="text-white/30 text-xl font-medium tracking-[0.5em] uppercase italic">The Metabolic Blog & Knowledge Hub</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <button 
          onClick={() => setView('home')}
          className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark/30 hover:text-brand-primary transition-colors mb-12"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Diagnostic Hub
        </button>

        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
           <h2 className="text-4xl font-serif font-bold text-brand-dark">Archive Nodes ({articles.length})</h2>
           <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="Search protocols..." 
                className="w-full bg-brand-light border border-brand-dark/5 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-brand-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-dark/20" size={18} />
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
           {articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
             <article 
                key={item.id} 
                onClick={() => handleArticleClick(item)}
                className="group bg-white rounded-[48px] border border-brand-dark/[0.05] overflow-hidden hover:shadow-3xl transition-all duration-700 cursor-pointer flex flex-col h-full"
             >
                <div className="aspect-[4/5] overflow-hidden relative">
                   <img src={item.image} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" alt={item.title} />
                   <div className="absolute top-8 left-8 bg-brand-dark text-brand-primary text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-2xl">
                      {item.category}
                   </div>
                </div>
                <div className="p-10 space-y-6 flex-grow flex flex-col">
                   <h3 className="text-3xl font-serif font-bold text-brand-dark leading-tight group-hover:text-brand-primary transition-colors">{item.title}</h3>
                   <p className="text-brand-dark/40 text-sm font-medium italic line-clamp-2 flex-grow">{item.description}</p>
                   <div className="pt-6 border-t border-brand-dark/5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-brand-dark/20 text-[10px] font-black uppercase tracking-widest">
                         <Clock size={14} /> {item.time}
                      </div>
                      <ArrowUpRight size={20} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-all" />
                   </div>
                </div>
             </article>
           ))}
        </div>
      </div>
    </div>
  );
};

export default VaultsPage;
