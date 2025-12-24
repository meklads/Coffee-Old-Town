
import React, { useState, useEffect } from 'react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { translations } from '../translations.ts';
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Send, Loader2, Navigation } from 'lucide-react';

const ContactUs: React.FC = () => {
  const t = translations.en.contact;
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      
      <div className="relative h-[600px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 scale-105">
          <img 
            src="https://images.unsplash.com/photo-1533230408701-a29bf2c746b1?w=1600&q=80" 
            className="w-full h-full object-cover"
            alt="Camping Under Stars"
          />
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-dark/20 to-white" />
        </div>
        
        <div className="relative z-10 space-y-6 animate-fade-in-up">
           <div className="flex justify-center mb-4">
             <Navigation className="text-white/80 rotate-45" size={32} />
           </div>
           <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter drop-shadow-2xl">
             {t.title}
           </h1>
           <p className="text-xl md:text-2xl text-white/90 font-medium italic opacity-80">
             {t.subtitle}
           </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-12 gap-20">
          
          <div className="lg:col-span-5 space-y-12 animate-fade-in-up">
            <div className="space-y-6">
              <h2 className="text-4xl font-serif font-bold text-brand-dark leading-tight">
                {t.heading}
              </h2>
              <p className="text-brand-dark/50 text-lg leading-relaxed font-medium">
                {t.desc}
              </p>
            </div>

            <div className="space-y-4">
               <div className="flex items-center gap-2">
                 <span className="font-bold text-brand-dark">{t.emailLabel}</span>
                 <a href="mailto:info@coffeeoldtown.com" className="text-brand-primary font-bold hover:underline transition-all">info@coffeeoldtown.com</a>
               </div>
            </div>

            <div className="flex gap-6 pt-6">
               {[Twitter, Facebook, Youtube, Instagram].map((Icon, idx) => (
                 <a key={idx} href="#" className="text-brand-dark/30 hover:text-brand-primary transition-all transform hover:scale-110">
                   <Icon size={24} strokeWidth={1.5} />
                 </a>
               ))}
            </div>
          </div>

          <div className="lg:col-span-7 animate-fade-in-up delay-100">
             <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-[40px] border border-brand-dark/[0.03] p-2 md:p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      required
                      placeholder={`${t.form.name} *`} 
                      className="w-full bg-brand-cream/30 border border-brand-dark/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-dark/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="email" 
                      required
                      placeholder={`${t.form.email} *`}
                      className="w-full bg-brand-cream/30 border border-brand-dark/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-dark/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      required
                      placeholder={`${t.form.subject} *`}
                      className="w-full bg-brand-cream/30 border border-brand-dark/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-dark/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <textarea 
                     rows={8}
                     required
                     placeholder={t.form.message}
                     className="w-full bg-brand-cream/30 border border-brand-dark/10 rounded-[32px] px-8 py-6 text-sm focus:outline-none focus:border-brand-primary transition-all placeholder:text-brand-dark/20 resize-none"
                   ></textarea>
                </div>

                <div className="flex justify-start md:justify-end">
                  <button 
                    disabled={loading || success}
                    className={`px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center gap-4 shadow-xl
                      ${success 
                        ? 'bg-brand-success text-white' 
                        : 'bg-brand-gold/60 text-white hover:bg-brand-dark hover:scale-105 active:scale-95 disabled:opacity-50'
                      }`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : success ? <Send size={16} /> : null}
                    {success ? t.form.success : t.form.send}
                  </button>
                </div>
             </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
