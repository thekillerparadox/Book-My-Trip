import React, { useRef, useState } from 'react';
import { INTERNATIONAL_DESTINATIONS } from '../constants';

export const InternationalGateway: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState('All');

  const regions = ['All', ...Array.from(new Set(INTERNATIONAL_DESTINATIONS.map((d) => d.region))).filter(Boolean) as string[]];

  const filteredDestinations = activeRegion === 'All'
    ? INTERNATIONAL_DESTINATIONS
    : INTERNATIONAL_DESTINATIONS.filter(d => d.region === activeRegion);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 py-16 bg-white dark:bg-[#1a130c] md:rounded-3xl mb-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="material-symbols-outlined text-primary text-3xl">public</span>
               <h2 className="text-3xl md:text-4xl font-black tracking-tight">International Gateway</h2>
            </div>
            <p className="text-text-sec-light dark:text-text-sec-dark max-w-lg text-lg">
              Explore our curated selection of top-rated destinations around the globe.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="size-12 rounded-full border-2 border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition-colors text-text-main-light dark:text-text-main-dark"
              aria-label="Scroll left"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              onClick={() => scroll('right')}
              className="size-12 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center justify-center transition-colors shadow-lg"
              aria-label="Scroll right"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 overflow-x-auto hide-scrollbar pb-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setActiveRegion(region)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeRegion === region
                  ? 'bg-primary text-white shadow-lg shadow-primary/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-text-sec-light dark:text-text-sec-dark hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-12 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0"
        >
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="relative min-w-[300px] md:min-w-[340px] h-[480px] rounded-2xl overflow-hidden snap-center group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
            >
              {/* Image */}
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              {/* Content */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 flex items-center gap-1">
                 <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
                 <span className="text-white text-sm font-bold">{dest.rating}</span>
              </div>

              {dest.isTopChoice && (
                <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Top Choice
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-xs font-bold tracking-wider opacity-80 uppercase mb-1 block">{dest.region}</span>
                <h3 className="text-2xl font-bold mb-2 leading-tight">{dest.name}</h3>
                <p className="text-white/80 text-sm mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {dest.description}
                </p>
                
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-white/20">
                   <div>
                      <p className="text-xs opacity-70">Starting from</p>
                      <p className="text-lg font-bold text-primary">{dest.price}</p>
                   </div>
                   <button className="size-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                     <span className="material-symbols-outlined">arrow_outward</span>
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};