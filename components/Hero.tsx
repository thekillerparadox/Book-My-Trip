
import React, { useState, useEffect, useCallback } from 'react';
import { HERO_SLIDES } from '../constants';
import { BookingWidget } from './BookingWidget';
import { Trip } from '../types';

interface HeroProps {
  onBook: (trip: Trip) => void;
}

export const Hero: React.FC<HeroProps> = ({ onBook }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  
  const SLIDE_DURATION = 8000;

  useEffect(() => {
    if (isHovered) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_DURATION);

    return () => {
      clearInterval(timer);
    };
  }, [currentSlide, isHovered]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 2,
      y: (clientY / window.innerHeight - 0.5) * 2,
    });
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <div 
      id="flights"
      className="relative w-full select-none h-[850px] md:h-[900px] group"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-b-[3rem] md:rounded-b-[5rem] shadow-2xl">
          <div className="absolute inset-0 z-20 opacity-[0.07] pointer-events-none mix-blend-overlay animate-grain" 
               style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

          <div className="absolute inset-0 w-full h-full bg-background-dark">
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <div className={`w-full h-full relative overflow-hidden ${index === currentSlide ? 'animate-ken-burns' : ''}`}>
                  <img 
                    src={slide.image} 
                    alt={slide.title} 
                    className="w-full h-full object-cover brightness-[0.5] contrast-[1.15]"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>
                </div>
              </div>
            ))}

            <div className="relative z-30 h-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-center pb-20">
              {HERO_SLIDES.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`absolute left-6 md:left-12 lg:left-20 top-1/2 -translate-y-[60%] w-full max-w-5xl transition-all duration-[1200ms] cubic-bezier(0.22, 1, 0.36, 1) ${
                    index === currentSlide
                      ? 'opacity-100 translate-x-0 blur-0'
                      : 'opacity-0 -translate-x-20 blur-lg pointer-events-none'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                     <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-1.5 rounded-full flex items-center gap-2 text-white shadow-xl shadow-black/20">
                        <span className="material-symbols-outlined text-accent text-lg filled animate-pulse">videocam</span>
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{slide.tag}</span>
                     </div>
                     {slide.topics.slice(0, 2).map((topic, i) => (
                        <span key={i} className="text-white/60 text-xs font-bold uppercase tracking-widest hidden md:inline-block border border-white/10 px-3 py-1 rounded-full">{topic}</span>
                     ))}
                  </div>

                  <h1 
                    className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl mix-blend-overlay"
                    style={{ transform: `translateX(${mousePos.x * 15}px)` }}
                  >
                    {slide.title}
                  </h1>

                  <p 
                    className="text-lg md:text-xl lg:text-2xl text-white/90 font-medium max-w-2xl leading-relaxed mb-10 drop-shadow-lg"
                    style={{ transform: `translateX(${mousePos.x * 8}px)` }}
                  >
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-4">
                     <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-4 min-w-[140px]">
                        <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-yellow-400">
                           <span className="material-symbols-outlined text-xl">wb_sunny</span>
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-white/40 tracking-widest leading-tight">Temp</p>
                           <p className="text-lg font-bold text-white leading-none">{slide.stats.temp}</p>
                        </div>
                     </div>

                     <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex items-center gap-4 min-w-[140px]">
                        <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center text-accent">
                           <span className="material-symbols-outlined text-xl">local_activity</span>
                        </div>
                        <div>
                           <p className="text-[9px] font-black uppercase text-white/40 tracking-widest leading-tight">Activity</p>
                           <p className="text-lg font-bold text-white leading-none">{slide.stats.activity}</p>
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
      </div>

      {/* Navigation Controls */}
      <div className="hidden md:flex absolute bottom-[20%] right-12 lg:right-20 z-40 gap-4">
        <button 
          onClick={prevSlide}
          className="size-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95 group"
        >
           <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
        </button>
        <button 
          onClick={nextSlide}
          className="size-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all active:scale-95 group"
        >
           <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      </div>

      <div className="absolute bottom-[20%] md:top-1/2 left-6 md:left-auto md:right-10 z-40 flex md:flex-col gap-3">
        {HERO_SLIDES.map((_, idx) => (
          <div 
            key={idx} 
            className={`transition-all duration-500 rounded-full cursor-pointer hover:bg-white/50 ${
              currentSlide === idx 
              ? 'w-10 h-1.5 md:w-1.5 md:h-10 bg-white shadow-[0_0_10px_white]' 
              : 'w-1.5 h-1.5 bg-white/20'
            }`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-[60] px-4 translate-y-[50%] w-full flex justify-center pointer-events-none">
         <div className="w-full max-w-[1100px] pointer-events-auto">
            <BookingWidget onBook={onBook} />
         </div>
      </div>
    </div>
  );
};
