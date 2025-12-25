
import React from 'react';

export const MobileAppPromo: React.FC = () => {
  return (
    <section className="w-full px-6 mb-20">
      <div className="max-w-[1200px] mx-auto bg-[#0F172A] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden text-white shadow-2xl shadow-primary/20">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/3"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

        <div className="relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
             <span className="material-symbols-outlined text-sm text-primary filled">phone_iphone</span>
             <span className="text-[10px] font-bold uppercase tracking-widest">Mobile Exclusive</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-display tracking-tight mb-6 leading-[1.1]">
            Your concierge, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent">now in your pocket.</span>
          </h2>
          
          <p className="text-white/60 text-sm md:text-base mb-10 leading-relaxed font-medium max-w-md">
             Experience the future of travel. Get real-time flight updates, exclusive mobile-only deals, and chat with Maya 24/7—even offline.
          </p>
          
          <div className="flex flex-wrap gap-4">
             <button className="h-14 px-6 rounded-xl bg-white text-black font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-white/20">
                <span className="material-symbols-outlined text-3xl">token</span>
                <div className="text-left">
                   <p className="text-[9px] uppercase tracking-wider opacity-60 leading-none mb-0.5 font-bold">Download on the</p>
                   <p className="text-sm font-black leading-none">App Store</p>
                </div>
             </button>
             <button className="h-14 px-6 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white font-bold flex items-center gap-3 hover:bg-white/20 active:scale-95 transition-all shadow-xl">
                <span className="material-symbols-outlined text-3xl">android</span>
                <div className="text-left">
                   <p className="text-[9px] uppercase tracking-wider opacity-60 leading-none mb-0.5 font-bold">Get it on</p>
                   <p className="text-sm font-black leading-none">Google Play</p>
                </div>
             </button>
          </div>
          
          <div className="flex items-center gap-4 mt-8">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                    <div key={i} className="size-8 rounded-full border-2 border-[#0F172A] bg-gray-600">
                       <img src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-full h-full rounded-full" alt="user" />
                    </div>
                ))}
             </div>
             <div className="text-xs font-bold text-white/40">
                <span className="text-white">5M+</span> Downloads
             </div>
          </div>
        </div>
        
        <div className="relative z-10 w-full md:w-[400px] aspect-[9/16] md:aspect-square flex items-center justify-center mt-10 md:mt-0">
            {/* Abstract Phone Mockup */}
            <div className="relative w-[280px] h-[550px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden rotate-[-6deg] hover:rotate-0 transition-transform duration-700 group">
               {/* Dynamic Island */}
               <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2 px-3">
                  <div className="size-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="size-1 rounded-full bg-gray-600"></div>
               </div>
               
               <div className="w-full h-full bg-white dark:bg-surface-dark flex flex-col relative">
                  {/* Status Bar Mock */}
                  <div className="h-14 bg-white dark:bg-[#0F172A] w-full z-10"></div>
                  
                  {/* Mock App UI */}
                  <div className="flex-1 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gray-50 dark:bg-[#0F172A]">
                         {/* Map bg */}
                         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#6366F1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                         
                         {/* Header */}
                         <div className="p-6">
                            <h3 className="text-2xl font-black font-display mb-1 text-text-main-light dark:text-white">Hello, Alex!</h3>
                            <p className="text-xs text-gray-500">Ready for Paris?</p>
                         </div>

                         {/* Cards */}
                         <div className="px-4 space-y-3">
                            <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 flex gap-3 items-center">
                               <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                  <span className="material-symbols-outlined text-lg">flight</span>
                               </div>
                               <div>
                                  <p className="text-xs font-bold dark:text-white">Flight to CDG</p>
                                  <p className="text-[9px] text-green-500 font-bold uppercase">On Time • Gate A4</p>
                               </div>
                            </div>
                            
                            <div className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/30 relative overflow-hidden">
                               <div className="absolute right-0 top-0 size-20 bg-white/10 rounded-full -mr-4 -mt-4"></div>
                               <p className="text-[9px] font-bold uppercase opacity-60 mb-1">Boarding Pass</p>
                               <div className="flex justify-between items-end">
                                  <p className="text-2xl font-black tracking-widest">NYC <span className="opacity-40">✈</span> PAR</p>
                               </div>
                            </div>

                            <div className="bg-white dark:bg-white/5 p-4 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5">
                               <p className="text-[9px] font-bold uppercase opacity-40 mb-2 dark:text-white/60">Itinerary</p>
                               <div className="space-y-2">
                                  {[1,2].map(i => (
                                     <div key={i} className="flex gap-2 items-center">
                                        <div className="size-2 rounded-full bg-accent"></div>
                                        <div className="h-2 w-24 bg-gray-200 dark:bg-white/10 rounded-full"></div>
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                  </div>

                  {/* Tab Bar */}
                  <div className="h-16 bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-white/5 flex justify-around items-center px-2">
                     {['home', 'explore', 'airplane_ticket', 'person'].map((icon, i) => (
                        <div key={icon} className={`size-10 rounded-full flex items-center justify-center ${i === 0 ? 'bg-primary/10 text-primary' : 'text-gray-300 dark:text-gray-600'}`}>
                           <span className="material-symbols-outlined text-xl filled">{icon}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-32 -right-8 bg-white dark:bg-[#1E293B] p-3 rounded-2xl shadow-xl animate-[bounce_3s_infinite] delay-700 flex items-center gap-2 pr-4 border border-gray-100 dark:border-white/5">
               <span className="material-symbols-outlined text-red-500 filled">favorite</span>
               <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">Status</p>
                  <p className="text-xs font-bold dark:text-white">Checked In</p>
               </div>
            </div>
            <div className="absolute bottom-40 -left-12 bg-white dark:bg-[#1E293B] p-3 rounded-2xl shadow-xl animate-[bounce_4s_infinite] delay-300 flex items-center gap-2 pr-4 border border-gray-100 dark:border-white/5">
               <div className="size-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                 <span className="material-symbols-outlined text-sm filled">savings</span>
               </div>
               <div>
                  <p className="text-[8px] font-bold uppercase text-gray-400">Saved</p>
                  <p className="text-xs font-bold dark:text-white">$120.00</p>
               </div>
            </div>
        </div>
      </div>
    </section>
  );
};
