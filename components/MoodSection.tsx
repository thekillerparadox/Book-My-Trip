import React, { useState } from 'react';
import { MOODS } from '../constants';

export const MoodSection: React.FC = () => {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  return (
    <section className="w-full max-w-[1200px] px-6 py-2">
      {/* Unified Card Container */}
      <div className="relative w-full bg-white dark:bg-surface-dark rounded-[2.5rem] p-6 md:p-8 lg:p-10 shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden group">
        
        {/* Decorative Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-[35%] text-center lg:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-extrabold uppercase tracking-widest border border-primary/20">
              <span className="material-symbols-outlined text-xs filled">sentiment_satisfied</span>
              <span>Vibe Check</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-text-main-light dark:text-text-main-dark leading-[1.1]">
              What's your <span className="text-primary">travel mood?</span>
            </h2>
            
            <p className="text-text-sec-light dark:text-text-sec-dark text-sm leading-relaxed font-medium opacity-80 max-w-md mx-auto lg:mx-0">
              Don't know where to go? Select how you want to feel, and we'll curate the perfect destinations for you.
            </p>

            <div className="hidden lg:flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-primary opacity-60">
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
              <span>AI Powered Curation</span>
            </div>
          </div>

          {/* Right Side: Mood Grid */}
          <div className="w-full lg:w-[65%] grid grid-cols-2 sm:grid-cols-3 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setActiveMood(mood.id === activeMood ? null : mood.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-5 rounded-3xl border transition-all duration-300 group/btn overflow-hidden ${
                  activeMood === mood.id 
                  ? 'bg-primary border-primary shadow-xl shadow-primary/30 scale-[1.02]' 
                  : 'bg-gray-50/50 dark:bg-white/5 border-transparent hover:bg-white dark:hover:bg-white/10 hover:border-gray-100 dark:hover:border-white/10 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Icon Container */}
                <div className={`size-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeMood === mood.id 
                  ? 'bg-white text-primary shadow-sm' 
                  : `${mood.colorClass} group-hover/btn:scale-110`
                }`}>
                  <span className={`material-symbols-outlined text-2xl ${activeMood === mood.id ? 'filled' : ''}`}>
                    {mood.icon}
                  </span>
                </div>

                {/* Text Label */}
                <div className="flex flex-col items-center gap-0.5 z-10">
                  <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                    activeMood === mood.id ? 'text-white' : 'text-text-main-light dark:text-text-main-dark'
                  }`}>
                    {mood.name}
                  </span>
                  
                  {/* Selection Indicator */}
                  <div className={`h-1 w-1 rounded-full bg-white transition-all duration-300 ${activeMood === mood.id ? 'w-6 opacity-100' : 'opacity-0'}`}></div>
                </div>

                {/* Subtle Hover Gradient Background for inactive state */}
                {activeMood !== mood.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover/btn:from-white/0 group-hover/btn:to-primary/5 transition-all duration-300"></div>
                )}
              </button>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};