
import React, { useState, useEffect } from 'react';
import { generateMascot } from '../services/geminiService.ts';

interface MascotIconProps {
  prompt: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MascotIcon: React.FC<MascotIconProps> = ({ prompt, size = 'md', className = '' }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadMascot = async () => {
      const cacheKey = `logo_${prompt.substring(0, 20)}`;
      
      try {
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setImgUrl(cached);
          setLoading(false);
          return;
        }
      } catch (e) {}

      const url = await generateMascot(prompt);
      if (url && isMounted) {
        setImgUrl(url);
        
        try {
          sessionStorage.setItem(cacheKey, url);
        } catch (e) {
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
             // Purge only logos if space is needed for logos
             Object.keys(sessionStorage).forEach(key => {
               if (key.startsWith('logo_')) sessionStorage.removeItem(key);
             });
             try { sessionStorage.setItem(cacheKey, url); } catch (e2) {}
          }
        }
        setLoading(false);
      }
    };
    loadMascot();
    return () => { isMounted = false; };
  }, [prompt]);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 md:w-24 md:h-24',
    lg: 'w-32 h-32 md:w-40 md:h-40'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className} shrink-0`}>
      {loading ? (
        <div className="absolute inset-0 rounded-2xl bg-brand-primary/5 animate-pulse border border-brand-primary/10 flex items-center justify-center">
          <div className="w-1/3 h-1/3 rounded-full bg-brand-primary/10 animate-ping" />
        </div>
      ) : imgUrl ? (
        <div className="relative group p-2">
           <img 
            src={imgUrl} 
            className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110 drop-shadow-sm" 
            alt="Logo Brand" 
           />
        </div>
      ) : null}
    </div>
  );
};

export default MascotIcon;
