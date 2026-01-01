
import React from 'react';

const PARTNERS = [
  { name: 'Emirates', icon: 'flight_takeoff', type: 'Airline' },
  { name: 'Marriott', icon: 'apartment', type: 'Hotel' },
  { name: 'Sequoia', icon: 'trending_up', type: 'Investor' },
  { name: 'Allianz', icon: 'health_and_safety', type: 'Insurance' },
  { name: 'Qatar Airways', icon: 'airlines', type: 'Airline' },
  { name: 'Hilton', icon: 'hotel', type: 'Hotel' },
  { name: 'Y Combinator', icon: 'rocket_launch', type: 'Investor' },
  { name: 'AXA', icon: 'verified_user', type: 'Insurance' },
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="w-full py-16 overflow-hidden bg-white dark:bg-[#0A0C10] border-y border-gray-100 dark:border-white/5">
      <div className="max-w-[1200px] mx-auto px-6 text-center mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-sec-light dark:text-text-sec-dark opacity-60">Trusted by Global Leaders</p>
      </div>
      
      <div className="relative w-full">
         <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-[#0A0C10] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-[#0A0C10] to-transparent z-10 pointer-events-none"></div>

         <div className="flex gap-12 w-max animate-[scroll_40s_linear_infinite] px-6">
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
                <div key={i} className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
                    <span className="material-symbols-outlined text-3xl">{partner.icon}</span>
                    <span className="text-lg font-bold font-display">{partner.name}</span>
                </div>
            ))}
         </div>
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
      `}</style>
    </section>
  );
};
