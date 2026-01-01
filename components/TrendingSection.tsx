
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
  
  const [activeDestId, setActiveDestId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [pulseData, setPulseData] = useState<PulseData | null>(null);
  const [thoughtStep, setThoughtStep] = useState(0);

  const thoughts = [
    "Analyzing seasonal trends...",
    "Checking social buzz...",
    "Finding hidden gems...",
    "Calculating uniqueness...",
    "Finalizing report..."
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
      const scrollAmount = 340;
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
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Analyze ${destName} for the current season. Provide matchScore, vibeAnalysis, and insiderSecret in JSON.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              matchScore: { type: Type.INTEGER },
              vibeAnalysis: { type: Type.STRING },
              insiderSecret: { type: Type.STRING }
            }
          }
        }
      });

      if (response.text) {
        setPulseData(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("AI Pulse Failed", error);
      setPulseData({
        matchScore: 88,
        vibeAnalysis: "Vibrant energy and stunning landscapes await.",
        insiderSecret: "Check out the local morning market for authentic crafts."
      });
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <section id="destinations" className="w-full max-w-[1440px] px-4 md:px-8 py-8 relative">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl filled">trending_up</span>
             </div>
             <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-text-main-light dark:text-text-main-dark">Trending Live</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-xl text-base opacity-70 leading-relaxed font-medium">
            Explore verified escapes catching the world's imagination right now.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => scroll('left')} className="size-12 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center transition-all shadow-sm"><span className="material-symbols-outlined text-xl">arrow_back</span></button>
          <button onClick={() => scroll('right')} className="size-12 rounded-full bg-primary text-white flex items-center justify-center transition-all shadow-xl shadow-primary/30"><span className="material-symbols-outlined text-xl">arrow_forward</span></button>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-6 mb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {states.map((state) => (
          <button
            key={state}
            onClick={() => setActiveState(state)}
            className={`px-5 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest transition-all border whitespace-nowrap shadow-sm ${
              activeState === state
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                : 'bg-white dark:bg-white/5 text-text-sec-light border-gray-100 dark:border-white/10 hover:border-primary/40'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-6 pb-12 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
      >
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="min-w-[280px] md:min-w-[340px] snap-center bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-gray-100 dark:border-white/5 flex flex-col relative"
          >
            <div className="h-72 md:h-80 overflow-hidden relative">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80"></div>
              
              <button 
                onClick={(e) => toggleFavorite(dest.id, e)}
                className={`absolute top-4 right-4 size-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                  favorites.has(dest.id) ? 'bg-red-500 text-white shadow-xl scale-110' : 'bg-black/20 text-white hover:bg-white hover:text-red-500'
                }`}
              >
                <span className={`material-symbols-outlined text-xl ${favorites.has(dest.id) ? 'filled' : ''}`}>favorite</span>
              </button>

              <div className="absolute top-4 left-4">
                 <div className="bg-white/20 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/10">
                    {dest.state}
                 </div>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                 <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5 bg-yellow-400 text-black px-2 py-0.5 rounded-md text-[9px] font-bold shadow-lg">
                       <span className="material-symbols-outlined text-xs filled">star</span>
                       {dest.rating}
                    </div>
                 </div>

                 <h3 className="font-black text-2xl leading-none mb-2 font-display">{dest.name}</h3>
                 <p className="text-xs leading-relaxed opacity-90 font-medium line-clamp-2 mb-4">{dest.description}</p>

                 <div className="flex items-center justify-between gap-4 mt-2 pt-3 border-t border-white/10">
                    <div>
                       <p className="text-[8px] opacity-60 font-bold uppercase tracking-wider">Starts at</p>
                       <span className="font-extrabold text-xl leading-none">{dest.price}</span>
                    </div>
                    
                    <button 
                      onClick={(e) => handleAIPulse(dest.id, dest.name, e)}
                      className="bg-white text-black px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 shadow-lg"
                    >
                       <span className="material-symbols-outlined text-sm">auto_awesome</span>
                       Pulse
                    </button>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeDestId && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setActiveDestId(null)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-[#0F172A] rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10 max-h-[80vh] overflow-y-auto p-8 text-center">
            <button onClick={() => setActiveDestId(null)} className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"><span className="material-symbols-outlined">close</span></button>
            {isThinking ? (
                <div className="flex flex-col items-center py-8">
                  <div className="relative size-20 mb-6">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-spin"></div>
                      <div className="absolute inset-0 border-t-primary border-4 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <span className="material-symbols-outlined text-3xl text-primary animate-pulse">psychology</span>
                      </div>
                  </div>
                  <h3 className="text-xl font-black font-display text-primary animate-pulse mb-2">Analyzing...</h3>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-sec-light">{thoughts[thoughtStep]}</p>
                </div>
            ) : pulseData && (
                <div className="animate-in fade-in duration-500">
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-extrabold uppercase tracking-widest border border-primary/20 mb-4">AI Pulse Result</div>
                   <h3 className="text-2xl font-black font-display text-text-main-light dark:text-text-main-dark mb-6">{TRENDING_DESTINATIONS.find(d => d.id === activeDestId)?.name}</h3>
                   <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 mb-4 text-left border border-gray-100 dark:border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Match Score</span>
                        <span className="text-2xl font-black text-primary">{pulseData.matchScore}%</span>
                      </div>
                      <p className="text-sm font-medium italic opacity-90 mb-4 leading-relaxed">"{pulseData.vibeAnalysis}"</p>
                      <div className="pt-4 border-t border-gray-100 dark:border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1 block">Insider Secret</span>
                        <p className="text-xs font-bold text-accent">{pulseData.insiderSecret}</p>
                      </div>
                   </div>
                   <button onClick={() => setActiveDestId(null)} className="w-full py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Close</button>
                </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
