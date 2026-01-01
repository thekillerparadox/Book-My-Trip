
import React, { useRef, useState, useEffect } from 'react';
import { INTERNATIONAL_DESTINATIONS } from '../constants';
import { FeaturedDestination, Trip } from '../types';
import { GoogleGenAI, Modality } from "@google/genai";

interface InternationalGatewayProps {
  onBook: (trip: Trip) => void;
}

export const InternationalGateway: React.FC<InternationalGatewayProps> = ({ onBook }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState('All');
  const [selectedDest, setSelectedDest] = useState<FeaturedDestination | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ text: string } | null>(null);
  const [tilt, setTilt] = useState<{ id: string; x: number; y: number }>({ id: '', x: 0, y: 0 });

  const regions = ['All', ...Array.from(new Set(INTERNATIONAL_DESTINATIONS.map((d) => d.region))).filter(Boolean) as string[]];

  const filteredDestinations = INTERNATIONAL_DESTINATIONS.filter(d => activeRegion === 'All' || d.region === activeRegion);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent, id: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ id, x: rotateY, y: rotateX });
  };

  const handleAISearch = async () => {
    if (!selectedDest) return;
    setAiLoading(true); setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Latest travel info for ${selectedDest.name}.`,
        config: { tools: [{ googleSearch: {} }] }
      });
      setAiResponse({ text: response.text || "No results found." });
    } catch (e) { console.error(e); setAiResponse({ text: "Error loading search info." }); } finally { setAiLoading(false); }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-12 py-8 border border-gray-100 dark:border-white/5 rounded-[2.5rem] glass-panel shadow-2xl relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="material-symbols-outlined text-primary text-3xl animate-spin-slow">public</span>
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display">International Gateway</h2>
            </div>
            <p className="text-text-sec-light dark:text-text-sec-dark text-sm leading-relaxed max-w-xl">
              Immerse yourself in global hotspots via our 3D portals.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button onClick={() => scroll('left')} className="size-11 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center transition-all"><span className="material-symbols-outlined text-lg">arrow_back</span></button>
            <button onClick={() => scroll('right')} className="size-11 rounded-full bg-primary text-white flex items-center justify-center transition-all shadow-lg"><span className="material-symbols-outlined text-lg">arrow_forward</span></button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-6 mb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {regions.map((region) => (
            <button key={region} onClick={() => setActiveRegion(region)} className={`px-5 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border whitespace-nowrap ${activeRegion === region ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 text-text-sec-light border-gray-100 dark:border-white/10 hover:border-primary/40'}`}>{region}</button>
          ))}
        </div>

        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-8 pb-12 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth perspective-[2000px]">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setSelectedDest(dest)}
              onMouseMove={(e) => handleMouseMove(e, dest.id)}
              onMouseLeave={() => setTilt({ id: '', x: 0, y: 0 })}
              style={{
                transform: tilt.id === dest.id ? `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale(1.02)` : 'rotateY(0deg) rotateX(0deg) scale(1)',
                transition: tilt.id === dest.id ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
              }}
              className="relative min-w-[300px] md:min-w-[400px] h-[480px] md:h-[520px] rounded-[2.5rem] overflow-hidden snap-center group cursor-pointer shadow-2xl bg-black transform-style-3d"
            >
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-90"></div>
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-bold flex items-center gap-1"><span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>{dest.rating}</div>
              <div className="absolute bottom-0 left-0 w-full p-8 text-white transform-style-3d translate-z-10">
                <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase mb-1 block text-primary">{dest.region}</span>
                <h3 className="text-3xl md:text-4xl font-black mb-4 tracking-tighter font-display leading-none">{dest.name}</h3>
                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                   <div>
                      <p className="text-[8px] font-bold uppercase opacity-60 tracking-wider">Starting at</p>
                      <p className="text-xl md:text-2xl font-bold">{dest.price}</p>
                   </div>
                   <div className="size-10 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-lg">arrow_forward</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDest && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedDest(null)} />
          <div className="relative w-full max-w-4xl h-full max-h-[80vh] bg-white dark:bg-[#12181F] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row">
             <div className="w-full md:w-1/2 h-56 md:h-auto relative shrink-0">
               <img src={selectedDest.image} alt={selectedDest.name} className="w-full h-full object-cover" />
               <div className="absolute bottom-6 left-6 text-white"><h2 className="text-3xl md:text-5xl font-black font-display">{selectedDest.name}</h2></div>
               <button onClick={() => setSelectedDest(null)} className="absolute top-4 right-4 z-50 size-10 bg-black/20 backdrop-blur-md rounded-full text-white"><span className="material-symbols-outlined">close</span></button>
             </div>
             <div className="flex-1 p-8 md:p-10 bg-white dark:bg-[#12181F] overflow-y-auto">
                <div className="flex gap-4 mb-8">
                   <button onClick={handleAISearch} className="flex-1 h-14 bg-gray-100 dark:bg-white/5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all">AI Assist</button>
                   <button onClick={() => { onBook({ id: Date.now().toString(), destinationName: selectedDest.name, tripTitle: selectedDest.name, image: selectedDest.image, dates: 'Upcoming', travelers: '2 Adults', price: selectedDest.price, type: 'Portals', bookedAt: Date.now() }); setSelectedDest(null); }} className="flex-1 h-14 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">Book Now</button>
                </div>
                {aiLoading ? (
                   <div className="py-20 text-center"><div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div><p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Consulting Gemini...</p></div>
                ) : aiResponse ? (
                   <div className="bg-gray-50 dark:bg-white/5 p-5 rounded-2xl border border-gray-100 dark:border-white/5 mb-8 text-sm leading-relaxed whitespace-pre-wrap">{aiResponse.text}</div>
                ) : (
                   <p className="text-lg leading-relaxed opacity-80 mb-8">{selectedDest.description}</p>
                )}
             </div>
          </div>
        </div>
      )}
    </section>
  );
};
