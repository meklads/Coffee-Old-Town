
import React from 'react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { Send, CheckCircle2 } from 'lucide-react';

const Newsletter: React.FC = () => {
  const { language } = useApp();

  return (
    <section className="bg-brand-dark relative py-32 overflow-hidden">
       {/* High-end background visualization */}
       <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548907040-4baa42d10919?w=1600&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-20 scale-105" 
            alt="Bio-chemistry visualization"
          />
          <div className="absolute inset-0 bg-brand-dark/80 backdrop-blur-[2px]" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-brand-dark via-transparent to-brand-dark" />
       </div>

       {/* Decorative glows */}
       <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[140px]" />

       <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[64px] p-12 lg:p-24 shadow-3xl text-center">
             <div className="max-w-3xl mx-auto space-y-10">
                <div className="space-y-4">
                   <div className="inline-flex items-center gap-2 text-brand-primary px-4 py-2 bg-brand-primary/10 rounded-full text-[9px] font-black uppercase tracking-[0.4em] mb-4">
                      <Send size={12} />
                      {language === 'ar' ? 'البث المشفر' : 'Encrypted Broadcast'}
                   </div>
                   <h2 className="text-4xl md:text-7xl font-serif font-bold text-white leading-[0.95] tracking-tighter">
                      {language === 'en' ? 'Join the Bio-Hacking Intelligence Network.' : 'انضم لشبكة استخبارات التحسين الحيوي.'}
                   </h2>
                   <p className="text-white/40 text-lg md:text-xl font-light italic">
                      {language === 'en' 
                        ? 'Receive weekly clinical updates on nutrition, metabolic protocols, and elite coffee roasting science.' 
                        : 'استلم تحديثات سريرية أسبوعية حول التغذية، بروتوكولات الأيض، وعلوم تحميص القهوة للنخبة.'}
                   </p>
                </div>

                <div className="relative max-w-xl mx-auto">
                   <div className="flex flex-col sm:flex-row gap-4">
                      <input 
                        type="email" 
                        placeholder={language === 'en' ? 'Secure mail address...' : 'عنوان البريد الإلكتروني...'}
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary transition-all text-sm"
                      />
                      <button className="bg-brand-primary text-white px-10 py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white hover:text-brand-dark transition-all shadow-2xl">
                         {language === 'en' ? 'Establish Link' : 'إنشاء الاتصال'}
                      </button>
                   </div>
                </div>

                <div className="flex flex-wrap justify-center gap-8 pt-6">
                   {[
                     language === 'ar' ? '12 ألف خبير' : '12k+ Experts',
                     language === 'ar' ? 'تحديثات أسبوعية' : 'Weekly Briefs',
                     language === 'ar' ? 'وصول حصري' : 'Elite Access'
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                        <CheckCircle2 size={14} className="text-brand-primary/40" />
                        {item}
                     </div>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </section>
  );
};

export default Newsletter;
