
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
  { name: 'Lufthansa', icon: 'flight', type: 'Airline' },
  { name: 'Hyatt', icon: 'domain', type: 'Hotel' },
  { name: 'SoftBank', icon: 'account_balance', type: 'Investor' },
  { name: 'AIG', icon: 'security', type: 'Insurance' },
  { name: 'Delta', icon: 'travel', type: 'Airline' },
  { name: 'Accor', icon: 'location_city', type: 'Hotel' },
  { name: 'Google Ventures', icon: 'travel_explore', type: 'Investor' },
  { name: 'Zurich', icon: 'shield', type: 'Insurance' },
  { name: 'Singapore Air', icon: 'flight_class', type: 'Airline' },
  { name: 'Four Seasons', icon: 'deck', type: 'Hotel' },
  { name: 'Andreessen', icon: 'attach_money', type: 'Investor' },
  { name: 'British Airways', icon: 'flight_land', type: 'Airline' },
  { name: 'IHG Hotels', icon: 'bed', type: 'Hotel' },
  { name: 'Expedia Group', icon: 'public', type: 'Partner' },
  { name: 'Booking.com', icon: 'book_online', type: 'Partner' },
  { name: 'ANA', icon: 'airplane_ticket', type: 'Airline' },
];

export const PartnersSection: React.FC = () => {
  return (
    <section className="w-full max-w-[100vw] py-16 mb-10 overflow-hidden bg-white dark:bg-[#0A0C10] border-y border-gray-100 dark:border-white/5">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      
      <div className="max-w-[1200px] mx-auto px-6 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/20 mb-4">
            <span className="material-symbols-outlined text-sm filled">handshake</span>
            <span>World Class Network</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black font-display tracking-tight mb-4 text-text-main-light dark:text-text-main-dark">
            Backed by the Best
        </h2>
        <p className="text-sm opacity-60 font-medium max-w-2xl mx-auto leading-relaxed">
            We collaborate with industry giants and visionary investors to deliver a travel experience that is secure, luxurious, and boundless.
        </p>
      </div>
      
      {/* Infinite Scroll Container */}
      <div className="relative w-full overflow-hidden">
         {/* Gradient Masks for fade effect on edges */}
         <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-[#0A0C10] to-transparent z-10 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-[#0A0C10] to-transparent z-10 pointer-events-none"></div>

         <div className="flex gap-6 animate-scroll w-max px-6">
            {/* Original Set */}
            {PARTNERS.map((partner, i) => (
                <PartnerCard key={`p1-${i}`} partner={partner} />
            ))}
            {/* Duplicate Set for Loop */}
            {PARTNERS.map((partner, i) => (
                <PartnerCard key={`p2-${i}`} partner={partner} />
            ))}
         </div>
      </div>
    </section>
  );
};

const PartnerCard = ({ partner }: { partner: { name: string, icon: string, type: string } }) => (
    <div className="w-[200px] h-[110px] flex-shrink-0 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-xl hover:bg-white dark:hover:bg-white/10 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group cursor-default select-none">
        <div className="size-10 rounded-full bg-white dark:bg-white/5 shadow-inner flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors text-text-sec-light dark:text-text-sec-dark">
            <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">{partner.icon}</span>
        </div>
        <div className="text-center">
            <p className="font-bold text-sm text-text-main-light dark:text-text-main-dark group-hover:text-primary transition-colors">{partner.name}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-60">{partner.type}</p>
        </div>
    </div>
);
