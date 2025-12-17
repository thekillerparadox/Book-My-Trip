import React, { useState, useEffect } from 'react';
import { HERO_SLIDES } from '../constants';
import { BookingWidget } from './BookingWidget';

export const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  return (
    <>
      <div className="relative w-full h-[650px] md:h-[750px] overflow-hidden bg-black">
        {/* Carousel Backgrounds */}
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('${slide.image}')`,
            }}
            role="img"
            aria-label={slide.title}
          />
        ))}

        {/* Carousel Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 max-w-[960px] mx-auto pt-10 pb-32">
          {HERO_SLIDES.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-4 transition-all duration-1000 ease-in-out flex flex-col items-center ${
                index === currentSlide
                  ? 'opacity-100 translate-y-[-50%]'
                  : 'opacity-0 translate-y-[-40%] pointer-events-none'
              }`}
            >
              <h1 className="text-white text-4xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-lg mb-6">
                {slide.title}
              </h1>
              <p className="text-white/90 text-lg md:text-2xl font-medium max-w-2xl drop-shadow-md">
                {slide.subtitle}
              </p>
            </div>
          ))}
          
          {/* Navigation Controls */}
          <div className="absolute inset-x-0 bottom-40 md:bottom-48 flex justify-center items-center gap-8 z-20">
             <button 
               onClick={prevSlide}
               className="p-2 rounded-full border border-white/30 text-white/70 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm group"
               aria-label="Previous slide"
             >
               <span className="material-symbols-outlined text-3xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
             </button>
             
             <div className="flex gap-3">
              {HERO_SLIDES.map((slide, index) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button 
               onClick={nextSlide}
               className="p-2 rounded-full border border-white/30 text-white/70 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm group"
               aria-label="Next slide"
             >
               <span className="material-symbols-outlined text-3xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
             </button>
          </div>
        </div>
      </div>
      <BookingWidget />
    </>
  );
};