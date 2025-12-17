import React from 'react';
import { MOODS } from '../constants';

export const MoodSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1200px] px-6 py-10">
      <div className="mb-8 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">How are you feeling today?</h2>
        <p className="text-text-sec-light dark:text-text-sec-dark">Find destinations that match your vibe.</p>
      </div>
      <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            className="flex flex-col items-center gap-3 p-4 w-28 md:w-32 rounded-xl bg-surface-light dark:bg-surface-dark shadow-sm hover:shadow-md hover:bg-primary/5 dark:hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all group"
          >
            <div
              className={`size-12 rounded-full ${mood.colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <span className="material-symbols-outlined text-2xl">{mood.icon}</span>
            </div>
            <span className="font-bold text-sm">{mood.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};