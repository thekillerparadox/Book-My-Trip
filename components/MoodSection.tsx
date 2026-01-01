
import React, { useState } from 'react';
import { MOODS } from '../constants';

export const MoodSection: React.FC = () => {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  const handleMoodSelect = (moodId: string) => {
    if (activeMood === moodId) {
        setActiveMood(null);
    } else {
        setActiveMood(moodId);
    }
  };

  return (
    <section className="w-full max-w-[1200px] px-4 md:px-6 py-2">
      {/* Unified Card Container */}
      <div className="relative w-full bg-white dark:bg-surface-dark rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden group transition-all duration-500 hover:shadow-primary/5">
        
        {/* Decorative Background Gradients */}
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${activeMood ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-50'}`}></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center gap-8 xl:gap-16">
          
          {/* Left Side: Text Content */}
          <div className="w-full xl:w-[30%] space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest border border-primary/20">
              <span className="material-symbols-outlined text-sm filled">sentiment_satisfied</span>
              <span>Vibe Check</span>
            </div>
            
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black font-display tracking-tight text-text-main-light dark:text-text-main-dark leading-[1.1] mb-3">
                How do you <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">want to feel?</span>
              </h2>
              <p className="text-text-sec-light dark:text-text-sec-dark text-sm md:text-base leading-relaxed font-medium opacity-80">
                Select a mood to instantly filter destinations that match your current energy.
              </p>
            </div>

            {/* Dynamic CTA */}
            <div className={`transition-all duration-500 overflow-hidden ${activeMood ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
               <button className="flex items-center gap-2 px-6 py-3 bg-text-main-light dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">
                  <span>Explore {MOODS.find(m => m.id === activeMood)?.name} Trips</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
               </button>
            </div>
          </div>

          {/* Right Side: Mood Grid */}
          <div className="w-full xl:w-[70%] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => handleMoodSelect(mood.id)}
                className={`relative flex flex-col items-center justify-center gap-3 p-4 h-32 md:h-40 rounded-[1.5rem] border transition-all duration-300 group/btn overflow-hidden ${
                  activeMood === mood.id 
                  ? 'bg-primary border-primary shadow-xl shadow-primary/30 scale-105 z-10' 
                  : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-white dark:hover:bg-white/10 hover:border-gray-100 dark:hover:border-white/10 hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Icon Container */}
                <div className={`size-10 md:size-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                  activeMood === mood.id 
                  ? 'bg-white text-primary shadow-sm scale-110 rotate-12' 
                  : `${mood.colorClass} group-hover/btn:scale-110 group-hover/btn:rotate-6`
                }`}>
                  <span className={`material-symbols-outlined text-xl md:text-2xl ${activeMood === mood.id ? 'filled' : ''}`}>
                    {mood.icon}
                  </span>
                </div>

                {/* Text Label */}
                <div className="flex flex-col items-center gap-1 z-10">
                  <span className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors ${
                    activeMood === mood.id ? 'text-white' : 'text-text-main-light dark:text-text-main-dark'
                  }`}>
                    {mood.name}
                  </span>
                  
                  {/* Selection Indicator */}
                  <div className={`h-1 rounded-full bg-white transition-all duration-300 ease-out ${activeMood === mood.id ? 'w-4 opacity-100' : 'w-0 opacity-0'}`}></div>
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
