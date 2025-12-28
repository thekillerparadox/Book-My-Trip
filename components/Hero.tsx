
import React, { useState, useEffect, useCallback } from 'react';
import { HERO_SLIDES } from '../constants';
import { BookingWidget } from './BookingWidget';
import { Trip } from '../types';

interface HeroProps {
  onBook: (trip: Trip) => void;
}

export const Hero: React.FC<HeroProps> = ({ onBook }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const SLIDE_DURATION = 8000;

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      setProgress(0);
    }, SLIDE_DURATION);

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / (SLIDE_DURATION / 16)), 100));
    }, 16);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [currentSlide, isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 2, // Standardized range -1 to 1
      y: (clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
    setProgress(0);
  };

  const getNextSlideIndex = (offset: number) => (currentSlide + offset) % HERO_SLIDES.length;

  return (
    <div 
      id="flights"
      className="relative w-full select-none h-[600px] md:h-[700px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      {/* Background & Content Container - Clipped */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-background-dark perspective-[2000px]">
        
        {/* Cinematic Background Layer */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Parallax Image Container */}
            <div 
              className="w-[110%] h-[110%] -left-[5%] -top-[5%] relative transition-transform duration-300 ease-out"
              style={{ 
                transform: index === currentSlide 
                  ? `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px) scale(1.05)` 
                  : 'none'
              }}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover brightness-[0.6] contrast-[1.15]"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Complex Gradients for Depth */}
              <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 via-transparent to-background-dark/90"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background-dark/60 via-transparent to-transparent"></div>
              {/* Radial Vignette */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]"></div>
            </div>
          </div>
        ))}

        {/* Main Content Layer */}
        <div className="relative z-30 h-full max-w-[1440px] mx-auto px-6 flex flex-col justify-start pt-[12vh] md:pt-[18vh]">
          
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-[40%] left-6 md:left-20 transform -translate-y-1/2 w-full max-w-4xl transition-all duration-1000 ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0 blur-0'
                  : 'opacity-0 -translate-x-20 blur-sm pointer-events-none'
              }`}
            >
              {/* Interactive Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                 <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-white shadow-xl animate-in fade-in slide-in-from-left-4 duration-700">
                    <span className="material-symbols-outlined text-accent text-xs filled">local_fire_department</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{slide.tag}</span>
                 </div>
                 
                 <div className="bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 text-white shadow-xl shadow-primary/20 animate-in fade-in slide-in-from-left-4 duration-700 delay-100">
                    <span className="material-symbols-outlined text-xs">trending_up</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Trending Now</span>
                 </div>
              </div>

              {/* Parallax Typography */}
              <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${mousePos.x * 10}px)` }}
              >
                {slide.title}
              </h1>

              <p 
                className="text-lg md:text-xl text-white/80 font-medium max-w-2xl leading-relaxed mb-8 drop-shadow-lg transition-transform duration-100 ease-out"
                style={{ transform: `translateX(${mousePos.x * 5}px)` }}
              >
                {slide.subtitle}
              </p>

              {/* Data Widgets */}
              <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                 {/* Weather Widget */}
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors group cursor-default">
                    <div className="size-8 rounded-full bg-yellow-400/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-lg">wb_sunny</span>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Weather</p>
                       <p className="text-lg font-bold text-white">{slide.stats.temp}</p>
                    </div>
                 </div>

                 {/* Activity Widget */}
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors group cursor-default">
                    <div className="size-8 rounded-full bg-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-lg">directions_run</span>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Top Activity</p>
                       <p className="text-lg font-bold text-white">{slide.stats.activity}</p>
                    </div>
                 </div>

                 {/* Popularity Widget */}
                 <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-colors group cursor-default">
                    <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-lg">equalizer</span>
                    </div>
                    <div>
                       <p className="text-[9px] font-bold uppercase text-white/40 tracking-widest">Demand</p>
                       <p className="text-lg font-bold text-white">{slide.stats.popularity}</p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
        
      </div>

      {/* Alternative Navigation - Side Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 size-12 md:size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95 group shadow-2xl"
        aria-label="Previous Slide"
      >
         <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 size-12 md:size-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95 group shadow-2xl"
        aria-label="Next Slide"
      >
         <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">chevron_right</span>
      </button>

      {/* Bottom Booking Widget Container - Absolute Positioned */}
      <div className="absolute bottom-0 left-0 right-0 z-[60] px-4 translate-y-[30%]">
         {/* Reduced max-width for a more compact card */}
         <div className="max-w-[950px] mx-auto">
           <div className="relative group/booking perspective-[1000px]">
              <BookingWidget onBook={onBook} />
           </div>
         </div>
      </div>
    </div>
  );
};
