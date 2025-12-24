
import React, { useState } from 'react';
// Fix: Import useApp from its source context file
import { useApp } from '../context/AppContext.tsx';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the AI food analyzer work?',
      a: 'We utilize advanced computer vision models from Google Gemini to identify ingredients and estimate portion sizes with high precision.'
    },
    {
      q: 'Is the nutritional information 100% accurate?',
      a: 'The AI provides very accurate estimates based on millions of data points, but these are scientific estimates, not chemical laboratory results.'
    },
    {
      q: 'How do I get an API key?',
      a: 'You can click the connect button in the header, and an official Google AI Studio dialog will open for you to select your secure key.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-brand-dark py-40 text-center">
         <div className="max-w-7xl mx-auto px-6 space-y-6">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto text-brand-primary">
               <HelpCircle size={32} />
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold text-white tracking-tighter">
              Common Queries
            </h1>
         </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 -translate-y-20">
        <div className="space-y-4">
           {faqs.map((faq, idx) => (
             <div key={idx} className="bg-white border border-brand-dark/5 rounded-3xl overflow-hidden shadow-xl">
                <button 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full p-8 flex justify-between items-center text-left hover:bg-brand-cream/30 transition-colors"
                >
                   <span className="text-xl font-serif font-bold text-brand-dark">{faq.q}</span>
                   <ChevronDown className={`transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`transition-all duration-500 overflow-hidden ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-8 pt-0 text-brand-dark/60 leading-relaxed border-t border-brand-dark/5">
                      {faq.a}
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
