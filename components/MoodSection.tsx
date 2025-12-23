import React from 'react';
import { MOODS } from '../constants';

export const MoodSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1200px] px-6 py-4">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight font-display">How are you feeling today?</h2>
        <p className="text-text-sec-light dark:text-text-sec-dark text-sm max-w-2xl">
          Personalize your travel discovery. Select a mood to find destinations that match your current vibe.
        </p>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            className="flex flex-col items-center gap-4 p-5 w-24 md:w-32 rounded-2xl bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl hover:border-primary/40 border border-gray-100 dark:border-white/5 transition-all group active:scale-95"
          >
            <div
              className={`size-12 rounded-full ${mood.colorClass} flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner`}
            >
              <span className="material-symbols-outlined text-2xl">{mood.icon}</span>
            </div>
            <span className="font-bold text-[11px] tracking-wide uppercase text-text-sec-light dark:text-text-sec-dark group-hover:text-primary transition-colors">{mood.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};