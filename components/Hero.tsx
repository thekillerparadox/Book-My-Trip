import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  const videoRef = useRef<HTMLDivElement>(null);

  const SLIDE_DURATION = 7000;

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
      x: (clientX / window.innerWidth - 0.5) * 30,
      y: (clientY / window.innerHeight - 0.5) * 30,
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

  return (
    <div 
      className="relative w-full select-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      }}
    >
      <div className="relative w-full h-[700px] md:h-[900px] overflow-hidden bg-background-dark">
        {/* Cinematic Multi-layered Background */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full transition-all duration-[1500ms] ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
            }`}
          >
            <div 
              className="w-full h-full relative transition-transform duration-1000 ease-out"
              style={{ transform: `translate(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px)` }}
            >
              <img 
                src={slide.image} 
                alt={slide.title} 
                className="w-full h-full object-cover brightness-[0.75] contrast-[1.05]"
                loading={index === 0 ? "eager" : "lazy"}
              />
              {/* Dynamic Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-black/30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-background-dark/60 via-transparent to-transparent"></div>
            </div>
          </div>
        ))}

        {/* HUD Layer (Interactive Data) */}
        <div className="relative z-30 h-full flex flex-col items-center justify-center text-center px-6 max-w-[1440px] mx-auto pb-40">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 transition-all duration-1000 ease-out flex flex-col items-center ${
                index === currentSlide
                  ? 'opacity-100 translate-y-[-55%]'
                  : 'opacity-0 translate-y-[-40%] pointer-events-none'
              }`}
            >
              {/* Animated Destination HUD */}
              <div className="flex items-center gap-4 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-primary filled">verified</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{slide.tag}</span>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-primary text-white flex items-center gap-2 shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-sm filled">trending_up</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">{slide.stats.popularity} Demand</span>
                </div>
              </div>

              <h1 className="text-white text-5xl md:text-8xl lg:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 font-display drop-shadow-2xl max-w-6xl">
                {slide.title}
              </h1>

              <p className="text-white/90 text-lg md:text-2xl font-medium max-w-3xl mb-12 drop-shadow-md leading-relaxed opacity-80">
                {slide.subtitle}
              </p>

              {/* Data Strip HUD - Fully Translucent Polish */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                <div className="bg-white/10 backdrop-blur-2xl px-8 py-4 rounded-3xl flex flex-col items-start gap-1 border border-white/20 hover:bg-white/20 transition-all group cursor-help shadow-lg shadow-black/20">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-xl">thermostat</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Current Temp</span>
                   </div>
                   <span className="text-xl font-bold text-white tracking-tight">{slide.stats.temp}</span>
                </div>
                
                <div className="bg-primary/10 backdrop-blur-2xl px-8 py-4 rounded-3xl flex flex-col items-start gap-1 border border-primary/30 hover:bg-primary/20 transition-all shadow-lg shadow-primary/10">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-xl">local_activity</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-primary/80">Must Experience</span>
                   </div>
                   <span className="text-xl font-bold text-white tracking-tight">{slide.stats.activity}</span>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl px-8 py-4 rounded-3xl flex flex-col items-start gap-1 border border-white/20 hover:bg-white/20 transition-all shadow-lg shadow-black/20">
                   <div className="flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-white/60">Best Status</span>
                   </div>
                   <span className="text-xl font-bold text-white tracking-tight">Available Now</span>
                </div>
              </div>
            </div>
          ))}

          {/* New Interactive Progress HUD */}
          <div className="absolute inset-x-0 bottom-48 flex justify-center items-center gap-12 z-40">
             <button 
               onClick={prevSlide}
               className="size-16 rounded-full border border-white/10 text-white/40 hover:bg-white hover:text-background-dark hover:border-white transition-all backdrop-blur-md flex items-center justify-center group active:scale-90"
             >
               <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">chevron_left</span>
             </button>
             
             <div className="flex gap-4 items-end h-12">
              {HERO_SLIDES.map((slide, index) => (
                <div key={slide.id} className="relative flex flex-col items-center">
                   {index === currentSlide && (
                     <div className="absolute -top-8 text-[10px] font-bold text-primary animate-pulse whitespace-nowrap uppercase tracking-widest">
                       {index + 1} / {HERO_SLIDES.length}
                     </div>
                   )}
                   <button
                    onClick={() => goToSlide(index)}
                    className="relative group h-12 w-1.5"
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <div className={`w-full h-full rounded-full transition-all duration-500 overflow-hidden ${
                      index === currentSlide ? 'bg-white/20' : 'bg-white/10 hover:bg-white/30'
                    }`}>
                      {index === currentSlide && (
                        <div 
                          className="w-full bg-primary shadow-[0_0_20px_#359EFF] absolute bottom-0 transition-all duration-[100ms]"
                          style={{ height: `${progress}%` }}
                        ></div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>

            <button 
               onClick={nextSlide}
               className="size-16 rounded-full border border-white/10 text-white/40 hover:bg-white hover:text-background-dark hover:border-white transition-all backdrop-blur-md flex items-center justify-center group active:scale-90"
             >
               <span className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">chevron_right</span>
             </button>
          </div>
        </div>

        {/* Ambient Foreground Layer */}
        <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-30 opacity-20 animate-bounce">
           <span className="material-symbols-outlined text-white text-4xl">keyboard_double_arrow_down</span>
        </div>
      </div>
      
      {/* Dynamic Booking HUD Bridge */}
      <div className="w-full flex justify-center -translate-y-24 relative z-50 px-4">
        <div 
          className="w-full max-w-[1200px] transition-all duration-700"
          style={{ 
            transform: `perspective(2000px) rotateX(${mousePos.y * 0.05}deg) rotateY(${mousePos.x * -0.05}deg)`,
            filter: isHovered ? 'drop-shadow(0 30px 60px rgba(53, 158, 255, 0.15))' : 'none'
          }}
        >
          <div className="relative group/booking">
             <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[2.5rem] blur opacity-0 group-hover/booking:opacity-100 transition duration-1000"></div>
             <BookingWidget onBook={onBook} />
          </div>
        </div>
      </div>
    </div>
  );
};