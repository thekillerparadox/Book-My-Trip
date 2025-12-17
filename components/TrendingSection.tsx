import React, { useRef } from 'react';
import { TRENDING_DESTINATIONS } from '../constants';

export const TrendingSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // Approximately card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full max-w-[1200px] px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Trending in India</h2>
          <p className="text-text-sec-light dark:text-text-sec-dark mt-1">
            Most visited domestic destinations this month
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => scroll('left')}
            className="size-10 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="size-10 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-colors shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory"
      >
        {TRENDING_DESTINATIONS.map((dest) => (
          <div
            key={dest.id}
            className="min-w-[280px] w-[300px] snap-center bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-yellow-500 filled">
                  star
                </span>{' '}
                {dest.rating}
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{dest.name}</h3>
                <span className="text-primary font-bold">{dest.price}</span>
              </div>
              <p className="text-sm text-text-sec-light dark:text-text-sec-dark mb-4 line-clamp-2">
                {dest.description}
              </p>
              <button className="w-full py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-primary hover:text-white hover:border-primary dark:hover:text-background-dark font-semibold text-sm transition-colors">
                View Packages
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};