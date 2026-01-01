
import React from 'react';

export const MobileAppPromo: React.FC = () => {
  return (
    <section className="w-full px-6 mb-20">
      <div className="max-w-[1200px] mx-auto bg-[#0F172A] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden text-white shadow-2xl shadow-primary/20">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
             <span className="material-symbols-outlined text-sm text-primary filled">phone_iphone</span>
             <span className="text-[10px] font-bold uppercase tracking-widest">Mobile Exclusive</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black font-display tracking-tight mb-6 leading-[1.1]">
            Your concierge, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">now in your pocket.</span>
          </h2>
          
          <p className="text-white/60 text-sm md:text-base mb-10 leading-relaxed font-medium">
             Get real-time flight updates, exclusive mobile-only deals, and chat with Maya 24/7—even offline.
          </p>
          
          <div className="flex gap-4">
             <button className="h-14 px-6 rounded-xl bg-white text-black font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
                <span className="material-symbols-outlined text-3xl">token</span>
                <div className="text-left">
                   <p className="text-[9px] uppercase tracking-wider opacity-60 leading-none mb-0.5 font-bold">Download on the</p>
                   <p className="text-sm font-black leading-none">App Store</p>
                </div>
             </button>
             <button className="h-14 px-6 rounded-xl bg-white/10 border border-white/10 text-white font-bold flex items-center gap-3 hover:bg-white/20 active:scale-95 transition-all shadow-xl">
                <span className="material-symbols-outlined text-3xl">android</span>
                <div className="text-left">
                   <p className="text-[9px] uppercase tracking-wider opacity-60 leading-none mb-0.5 font-bold">Get it on</p>
                   <p className="text-sm font-black leading-none">Google Play</p>
                </div>
             </button>
          </div>
        </div>
        
        {/* Abstract Phone Mockup */}
        <div className="relative z-10 w-[280px] h-[550px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden rotate-[-6deg] hover:rotate-0 transition-transform duration-700">
           <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-20"></div>
           <div className="w-full h-full bg-white dark:bg-surface-dark flex flex-col relative pt-12 p-4">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <p className="text-xs text-gray-400">Good Morning,</p>
                    <h4 className="text-xl font-black text-black dark:text-white">Alex</h4>
                 </div>
                 <div className="size-10 rounded-full bg-gray-200"></div>
              </div>
              <div className="bg-primary p-4 rounded-2xl text-white mb-4 shadow-lg shadow-primary/30">
                 <p className="text-[10px] font-bold uppercase opacity-60 mb-1">Upcoming Flight</p>
                 <div className="flex justify-between items-end">
                    <span className="text-2xl font-black">JFK</span>
                    <span className="material-symbols-outlined animate-pulse">flight_takeoff</span>
                    <span className="text-2xl font-black">LHR</span>
                 </div>
              </div>
              <div className="space-y-3">
                 {[1,2,3].map(i => (
                    <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl"></div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};
