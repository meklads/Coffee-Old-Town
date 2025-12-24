
import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight, Search, Clock, ShieldCheck, Beaker, ChevronRight, ChevronLeft, Globe, Filter, Sparkles } from 'lucide-react';
import { Recipe } from '../types.ts';

const VaultsPage: React.FC = () => {
  const { setView, setSelectedRecipe, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

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
      description: 'Programming mitochondria via clean fats. A deep dive into the molecular structure of MCTs and their role in cognitive clarity.',
      ingredients: ['Organic Beans', 'MCT Oil', 'Grass-fed Ghee'],
      fullContent: 'Combining high-quality lipids with organic caffeine optimizes cognitive throughput. The synergy between the stimulant and the fatty acid chain creates a sustained release profile, preventing the dreaded insulin-driven crash.'
    },
    { 
      id: 2,
      title: 'Molecular Avocado Toast',
      category: 'NUTRITION',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1000&q=80',
      time: '12 min',
      calories: 340,
      description: 'The morning brain-fuel blueprint. Focusing on monounsaturated fats and essential minerals to ignite your metabolic engine.',
      ingredients: ['Sourdough', 'Ripe Avocado', 'Hemp Seeds']
    },
    { 
      id: 3,
      title: 'Circadian Fasting Protocol',
      category: 'LONGEVITY',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&q=80',
      time: 'Daily',
      calories: 0,
      description: 'Aligning biological clock with light cycles to maximize autophagy and cellular regeneration cycles.',
    },
    { 
      id: 4,
      title: 'Cellular Hydration Solution',
      category: 'HYDRATION',
      image: 'https://images.unsplash.com/photo-1513415277900-a62401e19be4?w=1000&q=80',
      time: '3 min',
      calories: 5,
      description: 'Mineral balance for optimized signaling. Why water alone is not enough for cellular saturation.',
    },
    { 
      id: 5,
      title: 'Nootropic Stacking for Coffee',
      category: 'BIO-HACKING',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&q=80',
      time: '5 min',
      calories: 10,
      description: 'Integrating functional mushrooms like Lions Mane and Cordyceps with premium caffeine for neuro-protection.',
    },
    { 
      id: 6,
      title: 'Magnesium Recovery Protocol',
      category: 'LONGEVITY',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecee?w=1000&q=80',
      time: 'Sleep Prep',
      calories: 0,
      description: 'Optimizing deep sleep quality through molecular relaxation and nervous system down-regulation.',
    }
  ];

  const categories = useMemo(() => {
    const cats = new Set(articles.map(a => a.category));
    return ['ALL', ...Array.from(cats)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(a => {
      const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'ALL' || a.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [articles, searchQuery, activeCategory]);

  const featured = articles[0];

  const handleArticleClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('recipe_detail');
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-brand-light dark:bg-brand-dark min-h-screen pb-40 animate-fade-in transition-colors duration-500">
      
      {/* Cinematic Blog Hero */}
      <section className="relative h-[80vh] flex flex-col justify-end px-6 pb-20 overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <img 
            src={featured.image} 
            className="w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[3s]" 
            alt="Featured Hero" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto w-full relative z-10 space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-brand-primary text-white rounded-full text-[9px] font-black uppercase tracking-[0.4em] shadow-2xl">
            <Sparkles size={12} />
            <span>{language === 'ar' ? 'المقال المختار' : 'FEATURED PROTOCOL'}</span>
          </div>
          
          <div className="max-w-4xl space-y-6">
            <h1 className="text-6xl md:text-[120px] font-serif font-bold text-white tracking-tighter leading-[0.85]">
              {featured.title}
            </h1>
            <p className="text-white/60 text-xl font-medium italic max-w-2xl leading-relaxed">
              {featured.description}
            </p>
            <button 
              onClick={() => handleArticleClick(featured)}
              className="px-12 py-6 bg-white text-brand-dark rounded-2xl font-black text-[11px] uppercase tracking-[0.6em] hover:bg-brand-primary hover:text-white transition-all shadow-3xl flex items-center gap-4 group/btn"
            >
              READ FULL DOSSIER <ArrowUpRight size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pt-24">
        
        {/* Navigation & Search Bar */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-24 gap-12">
           <div className="space-y-10 w-full">
              <button 
                onClick={() => setView('home')}
                className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-brand-dark/30 dark:text-white/20 hover:text-brand-primary transition-colors"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {language === 'ar' ? 'العودة للمختبر' : 'BACK TO LAB'}
              </button>
              
              <div className="space-y-4">
                 <h2 className="text-5xl font-serif font-bold text-brand-dark dark:text-white tracking-tighter leading-none">
                    The <span className="text-brand-primary italic">Journal.</span>
                 </h2>
                 <p className="text-brand-dark/40 dark:text-white/20 text-sm font-medium tracking-[0.3em] uppercase">Metabolic Research & Clinical Protocols</p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-3">
                 {categories.map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all border
                      ${activeCategory === cat 
                        ? 'bg-brand-primary border-brand-primary text-white shadow-xl' 
                        : 'bg-transparent border-brand-dark/10 dark:border-white/10 text-brand-dark/40 dark:text-white/30 hover:border-brand-primary'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           <div className="relative w-full xl:w-96 group">
              <input 
                type="text" 
                placeholder={language === 'ar' ? 'بحث في الأرشيف...' : 'Search protocols...'}
                className="w-full bg-white dark:bg-zinc-900 border border-brand-dark/10 dark:border-white/5 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-brand-primary transition-all shadow-xl dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-dark/20 dark:text-white/20 group-hover:text-brand-primary transition-colors" size={18} />
           </div>
        </div>

        {/* Article Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
             {filteredArticles.map((item) => (
               <article 
                  key={item.id} 
                  onClick={() => handleArticleClick(item)}
                  className="group bg-white dark:bg-zinc-900 rounded-[56px] border border-brand-dark/[0.04] dark:border-white/[0.03] overflow-hidden hover:shadow-[0_80px_100px_-30px_rgba(194,163,107,0.15)] transition-all duration-1000 cursor-pointer flex flex-col h-full"
               >
                  <div className="aspect-[4/5] overflow-hidden relative bg-brand-sand/10">
                     <img 
                        src={item.image} 
                        className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[2s] group-hover:scale-110" 
                        alt={item.title} 
                     />
                     <div className="absolute top-10 left-10 bg-brand-dark/90 backdrop-blur-xl text-brand-primary text-[8px] font-black px-5 py-2 rounded-full uppercase tracking-[0.3em] shadow-2xl border border-white/5">
                        {item.category}
                     </div>
                  </div>
                  <div className="p-12 space-y-6 flex-grow flex flex-col">
                     <h3 className="text-3xl font-serif font-bold text-brand-dark dark:text-white leading-tight group-hover:text-brand-primary transition-colors duration-500">{item.title}</h3>
                     <p className="text-brand-dark/40 dark:text-white/30 text-sm font-medium italic line-clamp-3 leading-relaxed flex-grow">
                        {item.description}
                     </p>
                     <div className="pt-8 border-t border-brand-dark/5 dark:border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-brand-dark/20 dark:text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">
                           <Clock size={14} /> {item.time}
                        </div>
                        <div className="p-4 bg-brand-primary/5 rounded-full text-brand-primary opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-700">
                           <ArrowUpRight size={18} />
                        </div>
                     </div>
                  </div>
               </article>
             ))}
          </div>
        ) : (
          <div className="py-40 text-center space-y-6">
             <Search size={64} className="mx-auto text-brand-dark/5 dark:text-white/5" />
             <p className="text-brand-dark/40 dark:text-white/20 font-serif text-2xl italic">No protocols found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VaultsPage;
