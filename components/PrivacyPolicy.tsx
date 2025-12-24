
import React, { useEffect } from 'react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { Sparkles, ShieldCheck, ChevronDown } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { language } = useApp();
  const isAr = language === 'ar';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* TEXTURED HEADER AREA */}
      <div className="relative h-[600px] flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1600&q=80" 
            className="w-full h-full object-cover grayscale opacity-30"
            alt="Macro Texture"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/40 via-white to-white" />
        </div>
        
        <div className="relative z-10 space-y-8 animate-fade-in-up">
           <div className="w-12 h-12 bg-brand-dark rounded-2xl flex items-center justify-center mx-auto text-brand-primary shadow-2xl">
              <ShieldCheck size={28} />
           </div>
           
           <h1 className="text-5xl md:text-8xl font-serif font-bold text-brand-dark tracking-tighter leading-none">
             Privacy Policy <br /> <span className="text-brand-primary italic">for Coffee Old Town</span>
           </h1>
           
           <div className="flex items-center justify-center gap-4 text-brand-gold">
             <div className="h-px w-12 bg-brand-gold/30" />
             <Sparkles size={16} className="animate-pulse" />
             <span className="text-[10px] font-black uppercase tracking-[0.5em]">Discover</span>
             <div className="h-px w-12 bg-brand-gold/30" />
           </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-brand-dark/10 animate-bounce">
           <ChevronDown size={32} strokeWidth={1} />
        </div>
      </div>

      {/* POLICY CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-32 space-y-20 animate-fade-in-up delay-200">
        
        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-dark border-b border-brand-dark/5 pb-4">1. INTRODUCTION</h2>
          <p className="text-brand-dark/60 leading-relaxed font-medium">
            Welcome to <span className="font-bold text-brand-dark">Coffee Old Town</span>! Your privacy is important to us, and this Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website. By using our site, you agree to the terms outlined in this policy.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-dark border-b border-brand-dark/5 pb-4">2. INFORMATION WE COLLECT</h2>
          <p className="text-brand-dark/60 leading-relaxed font-medium">
            We collect personal information that you voluntarily provide to us, as well as data automatically collected through cookies and similar technologies. This includes:
          </p>
          <ul className="space-y-4 text-brand-dark/60 pl-6 list-disc marker:text-brand-primary">
            <li><span className="text-brand-dark font-bold">Personal Information:</span> Name, email address, phone number, billing details, and any other information you provide when placing an order or contacting us.</li>
            <li><span className="text-brand-dark font-bold">Automatically Collected Data:</span> IP addresses, browser type, device information, and browsing activity on our site.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-dark border-b border-brand-dark/5 pb-4">3. WHY WE COLLECT YOUR INFORMATION</h2>
          <p className="text-brand-dark/60 leading-relaxed font-medium">The information we collect is used to:</p>
          <ul className="space-y-4 text-brand-dark/60 pl-6 list-disc marker:text-brand-primary">
            <li>Process and fulfill orders placed on our website.</li>
            <li>Communicate with you about your orders, inquiries, or promotions.</li>
            <li>Improve our website’s functionality and user experience.</li>
            <li>Comply with legal obligations and protect against fraud.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-dark border-b border-brand-dark/5 pb-4">4. HOW WE USE YOUR INFORMATION</h2>
          <p className="text-brand-dark/60 leading-relaxed font-medium">Your personal information may be used for the following purposes:</p>
          <ul className="space-y-4 text-brand-dark/60 pl-6 list-disc marker:text-brand-primary">
            <li>To personalize your experience on our site.</li>
            <li>To send periodic emails or newsletters (if you opt-in).</li>
            <li>To analyze site usage and improve our services.</li>
            <li>To share with trusted third parties (e.g., payment processors, shipping providers) who assist us in operating our business.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-dark border-b border-brand-dark/5 pb-4">5. SHARING YOUR INFORMATION</h2>
          <p className="text-brand-dark/60 leading-relaxed font-medium">
            We do not sell, trade, or otherwise transfer your personal information to outside parties unless we provide you with advance notice. Exceptions include:
          </p>
          <ul className="space-y-4 text-brand-dark/60 pl-6 list-disc marker:text-brand-primary">
            <li><span className="text-brand-dark font-bold">Third-Party Service Providers:</span> Companies that help us process payments, deliver orders, or manage marketing campaigns.</li>
            <li><span className="text-brand-dark font-bold">Legal Requirements:</span> When required by law or to protect our rights.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-brand-dark border-b border-brand-dark/5 pb-4">11. CONTACT US</h2>
          <p className="text-brand-dark/60 leading-relaxed font-medium">
            If you have any questions or concerns about this Privacy Policy, please contact us:
          </p>
          <div className="bg-brand-cream/50 p-8 rounded-3xl border border-brand-dark/[0.03] space-y-2">
            <p className="text-brand-dark/60 font-medium">Email: <span className="text-brand-primary font-bold">coffeeoldtownhome@gmail.com</span></p>
          </div>
        </section>

        <div className="pt-20 border-t border-brand-dark/5 text-center">
          <p className="text-[10px] font-black text-brand-dark/20 uppercase tracking-[0.5em]">End of Dossier - Privacy Protocol v4.0</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
