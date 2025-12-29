
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { TRENDING_DESTINATIONS } from '../constants';
import { GoogleGenAI, Type } from "@google/genai";

interface PulseData {
  matchScore: number;
  vibeAnalysis: string;
  insiderSecret: string;
}

export const TrendingSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeState, setActiveState] = useState('All');
  
  // AI Pulse State
  const [activeDestId, setActiveDestId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [thoughtStep, setThoughtStep] = useState(0);

  const thoughts = [
    "Analyzing seasonal weather patterns...",
    "Checking real-time crowd density...",
    "Scanning local forums for hidden gems...",
    "Calculating uniqueness score...",
    "Synthesizing final vibe check..."
  ];

  useEffect(() => {
    let interval: any;
    if (isThinking) {
      setThoughtStep(0);
      interval = setInterval(() => {
        setThoughtStep((prev) => (prev + 1) % thoughts.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isThinking]);

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

  const handleAIPulse = async (destId: string, destName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDestId(destId);
    setPulseData(null);
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Using Gemini 3 Pro with Thinking Mode
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze ${destName} as a travel destination for the current season. 
        1. Calculate a 'Travel Score' (0-100) based on weather, crowds, and uniqueness. 
        2. Provide a short, catchy 'Vibe Analysis'. 
        3. Reveal one exclusive 'Insider Secret' or hidden gem location nearby that tourists often miss.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              vibeAnalysis: { type: Type.STRING },
              insiderSecret: { type: Type.STRING }
            },
            required: ["matchScore", "vibeAnalysis", "insiderSecret"]
          }
        }
      });

      if (response.text) {
        setPulseData(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("AI Pulse Failed", error);
      setPulseData({
        matchScore: 85,
        vibeAnalysis: "AI is currently offline, but this place is always magical.",
        insiderSecret: "Ask a local for their favorite food spot!"
      });
    } finally {
      setIsThinking(false);
    }
  };

  const closePulse = () => {
    setActiveDestId(null);
    setPulseData(null);
    setIsThinking(false);
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePulse();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section id="destinations" className="w-full max-w-[1200px] px-4 md:px-6 py-4 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl filled">trending_up</span>
             </div>
             <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display">Trending in India</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-xl text-sm md:text-base opacity-70 leading-relaxed font-medium">
            Verified escapes and hidden gems across the subcontinent. Explore destinations curated for peak seasonal travel.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => scroll('left')}
            className="size-12 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center transition-all active:scale-95 group shadow-sm bg-white dark:bg-surface-dark"
          >
            <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          <button
            onClick={() => scroll('right')}
            className="size-12 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-all shadow-xl shadow-primary/30 active:scale-95 group"
          >
            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* States Filter Bar */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-6 mb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {states.map((state) => (
          <button
            key={state}
            onClick={() => setActiveState(state)}
            className={`px-5 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-[0.15em] transition-all border whitespace-nowrap shadow-sm active:scale-95 ${
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
        className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
      >
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="min-w-[280px] w-[320px] snap-center bg-white dark:bg-surface-dark rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 group cursor-pointer border border-gray-100 dark:border-white/5 flex flex-col hover:-translate-y-2 relative"
          >
            <div className="h-64 overflow-hidden relative">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              <button 
                onClick={(e) => toggleFavorite(dest.id, e)}
                className={`absolute top-4 right-4 size-10 rounded-xl backdrop-blur-2xl flex items-center justify-center transition-all duration-300 z-20 active:scale-75 ${
                  favorites.has(dest.id) 
                  ? 'bg-red-500 text-white shadow-xl scale-110' 
                  : 'bg-white/10 text-white hover:bg-white/30 border border-white/20'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${favorites.has(dest.id) ? 'filled' : ''}`}>favorite</span>
              </button>

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <div className="bg-primary text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg shadow-primary/20">
                    {dest.state}
                 </div>
              </div>
              
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                 <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-2 py-0.5 rounded-md w-fit text-[9px] font-bold shadow-lg">
                    <span className="material-symbols-outlined text-xs filled">star</span>
                    {dest.rating}
                 </div>
                 
                 {/* AI Pulse Button */}
                 <button 
                   onClick={(e) => handleAIPulse(dest.id, dest.name, e)}
                   className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-1.5 shadow-lg group/ai active:scale-95"
                 >
                    <span className="material-symbols-outlined text-sm group-hover/ai:text-primary transition-colors">auto_awesome</span>
                    AI Pulse
                 </button>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <h3 className="font-extrabold text-xl group-hover:text-primary transition-colors leading-tight mb-0.5 font-display">{dest.name}</h3>
                   <span className="text-[9px] font-bold text-text-sec-light dark:text-text-sec-dark uppercase tracking-widest opacity-60">
                      {dest.reviewCount.toLocaleString()} Verified Reviews
                   </span>
                </div>
              </div>

              <p className="text-xs text-text-sec-light dark:text-text-sec-dark mb-6 line-clamp-2 leading-relaxed opacity-80 font-medium italic">
                "{dest.description}"
              </p>
              
              <div className="mt-auto flex items-center justify-between gap-4">
                 <div>
                    <p className="text-[8px] opacity-40 font-bold uppercase tracking-wider mb-0.5">Packages from</p>
                    <span className="text-primary font-extrabold text-xl leading-none">{dest.price}</span>
                 </div>
                 <button className="h-10 px-4 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-primary hover:text-white transition-all group/btn shadow-sm border border-gray-100 dark:border-white/5 flex items-center gap-2 active:scale-95">
                    <span className="font-extrabold text-[9px] uppercase tracking-widest">Explore</span>
                    <span className="material-symbols-outlined text-base group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                 </button>
              </div>
            </div>
          </div>
        ))}
        {filteredDestinations.length === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-center opacity-30">
            <span className="material-symbols-outlined text-6xl mb-4">explore_off</span>
            <p className="font-extrabold text-lg font-display">No trending destinations in {activeState} yet.</p>
            <p className="text-xs">Check back soon for seasonal updates!</p>
          </div>
        )}
      </div>

      {/* AI Pulse Modal Overlay */}
      {activeDestId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={closePulse}></div>
          
          <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

            <button onClick={closePulse} className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 z-10 transition-colors active:scale-90">
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <div className="p-8 text-center min-h-[400px] flex flex-col justify-center">
              {isThinking ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative size-24 mb-8">
                      {/* Outer Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-[spin_3s_linear_infinite]"></div>
                      {/* Inner Ring */}
                      <div className="absolute inset-2 rounded-full border-2 border-t-primary border-r-primary border-b-transparent border-l-transparent animate-[spin_1.5s_linear_infinite]"></div>
                      {/* Pulse */}
                      <div className="absolute inset-6 bg-primary/10 rounded-full animate-pulse"></div>
                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="material-symbols-outlined text-3xl text-primary animate-pulse">psychology_alt</span>
                      </div>
                  </div>
                  
                  <h3 className="text-2xl font-black font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent animate-pulse mb-4">
                      Gemini is Thinking
                  </h3>
                  
                  <div className="h-6 relative w-full overflow-hidden">
                     {thoughts.map((thought, index) => (
                        <p 
                           key={index}
                           className={`absolute inset-0 w-full text-xs font-bold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark transition-all duration-500 transform ${
                              index === thoughtStep 
                              ? 'opacity-100 translate-y-0' 
                              : index < thoughtStep 
                                ? 'opacity-0 -translate-y-full' 
                                : 'opacity-0 translate-y-full'
                           }`}
                        >
                           {thought}
                        </p>
                     ))}
                  </div>
                </div>
              ) : pulseData && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-500">
                   <div className="flex flex-col items-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-extrabold uppercase tracking-widest border border-primary/20 mb-4">
                        <span className="material-symbols-outlined text-xs filled">auto_awesome</span>
                        <span>AI Pulse Check</span>
                      </div>
                      <h3 className="text-2xl font-black font-display text-text-main-light dark:text-text-main-dark leading-tight">
                         {TRENDING_DESTINATIONS.find(d => d.id === activeDestId)?.name}
                      </h3>
                   </div>

                   {/* Score Card */}
                   <div className="bg-gradient-to-br from-primary to-secondary p-1 rounded-2xl shadow-lg shadow-primary/20">
                      <div className="bg-white dark:bg-[#0F172A] rounded-xl p-4 flex items-center justify-between">
                         <div className="text-left">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">Seasonal Score</p>
                            <p className="text-xs font-medium opacity-80">Based on current conditions</p>
                         </div>
                         <div className="flex items-center gap-1">
                            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                               {pulseData.matchScore}
                            </span>
                            <span className="text-sm font-bold opacity-40">/100</span>
                         </div>
                      </div>
                   </div>

                   {/* Analysis Grid */}
                   <div className="space-y-4 text-left">
                      <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                         <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary text-lg">graphic_eq</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Current Vibe</span>
                         </div>
                         <p className="text-sm font-medium leading-relaxed italic opacity-90">"{pulseData.vibeAnalysis}"</p>
                      </div>

                      <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-2xl border border-yellow-100 dark:border-yellow-500/10">
                         <div className="flex items-center gap-2 mb-2 text-yellow-600 dark:text-yellow-400">
                            <span className="material-symbols-outlined text-lg filled">lock_open</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">Insider Secret</span>
                         </div>
                         <p className="text-sm font-medium leading-relaxed opacity-90 text-yellow-900 dark:text-yellow-100/80">{pulseData.insiderSecret}</p>
                      </div>
                   </div>

                   <button 
                     onClick={closePulse}
                     className="w-full py-4 bg-text-main-light dark:bg-white text-white dark:text-black rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                   >
                     Got it
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
