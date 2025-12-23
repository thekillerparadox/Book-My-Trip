import React, { useRef, useState, useMemo } from 'react';
import { TRENDING_DESTINATIONS } from '../constants';

export const TrendingSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeState, setActiveState] = useState('All');

  const states = useMemo(() => {
    const s = new Set<string>();
    s.add('All');
    TRENDING_DESTINATIONS.forEach(dest => {
      if (dest.state) s.add(dest.state);
    });
    return Array.from(s);
  }, []);

  const filteredDestinations = useMemo(() => {
    if (activeState === 'All') return TRENDING_DESTINATIONS;
    return TRENDING_DESTINATIONS.filter(d => d.state === activeState);
  }, [activeState]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 360; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="w-full max-w-[1200px] px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl filled">trending_up</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display">Trending in India</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-xl text-lg opacity-70 leading-relaxed font-medium">
            Verified escapes and hidden gems across the subcontinent. Explore destinations curated for peak seasonal travel.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => scroll('left')}
            className="size-14 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center transition-all active:scale-95 group shadow-sm bg-white dark:bg-surface-dark"
          >
            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="size-14 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-all shadow-xl shadow-primary/30 active:scale-95 group"
          >
            <span className="material-symbols-outlined text-2xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* States Filter Bar - Premium Pill Styling */}
      <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-8 mb-4">
        {states.map((state) => (
          <button
            key={state}
            onClick={() => setActiveState(state)}
            className={`px-6 py-2.5 rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.15em] transition-all border whitespace-nowrap shadow-sm ${
              activeState === state
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white dark:bg-white/5 text-text-sec-light dark:text-text-sec-dark border-gray-100 dark:border-white/10 hover:border-primary/40 hover:bg-gray-50'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-8 pb-10 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth"
      >
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="min-w-[300px] w-[340px] snap-center bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group cursor-pointer border border-gray-100 dark:border-white/5 flex flex-col hover:-translate-y-2"
          >
            <div className="h-72 overflow-hidden relative">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <button 
                onClick={(e) => toggleFavorite(dest.id, e)}
                className={`absolute top-6 right-6 size-12 rounded-2xl backdrop-blur-2xl flex items-center justify-center transition-all duration-300 ${
                  favorites.has(dest.id) 
                  ? 'bg-red-500 text-white shadow-xl scale-110' 
                  : 'bg-white/10 text-white hover:bg-white/30 border border-white/20'
                }`}
              >
                <span className={`material-symbols-outlined text-2xl ${favorites.has(dest.id) ? 'filled' : ''}`}>favorite</span>
              </button>

              <div className="absolute top-6 left-6 flex flex-col gap-2">
                 <div className="bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-xl shadow-lg shadow-primary/20">
                    {dest.state}
                 </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6">
                 <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-2.5 py-1 rounded-lg w-fit text-[10px] font-bold shadow-lg">
                    <span className="material-symbols-outlined text-sm filled">star</span>
                    {dest.rating}
                 </div>
              </div>
            </div>

            <div className="p-8 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="font-extrabold text-2xl group-hover:text-primary transition-colors leading-tight mb-1 font-display">{dest.name}</h3>
                   <span className="text-[10px] font-bold text-text-sec-light dark:text-text-sec-dark uppercase tracking-widest opacity-60">
                      {dest.reviewCount.toLocaleString()} Verified Reviews
                   </span>
                </div>
              </div>

              <p className="text-[14px] text-text-sec-light dark:text-text-sec-dark mb-8 line-clamp-2 leading-relaxed opacity-80 font-medium italic">
                "{dest.description}"
              </p>
              
              <div className="mt-auto flex items-center justify-between gap-4">
                 <div>
                    <p className="text-[9px] opacity-40 font-bold uppercase tracking-wider mb-0.5">Packages from</p>
                    <span className="text-primary font-extrabold text-2xl leading-none">{dest.price}</span>
                 </div>
                 <button className="h-14 px-6 rounded-2xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white transition-all group/btn shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-3">
                    <span className="font-extrabold text-[11px] uppercase tracking-widest">Explore</span>
                    <span className="material-symbols-outlined text-lg group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                 </button>
              </div>
            </div>
          </div>
        ))}
        {filteredDestinations.length === 0 && (
          <div className="w-full py-28 flex flex-col items-center justify-center text-center opacity-30">
            <span className="material-symbols-outlined text-7xl mb-6">explore_off</span>
            <p className="font-extrabold text-xl font-display">No trending destinations in {activeState} yet.</p>
            <p className="text-sm">Check back soon for seasonal updates!</p>
          </div>
        )}
      </div>
    </section>
  );
};