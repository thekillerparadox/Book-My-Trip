import React, { useRef, useState, useEffect } from 'react';
import { INTERNATIONAL_DESTINATIONS } from '../constants';
import { FeaturedDestination, Trip } from '../types';
import { GoogleGenAI, Modality, Type } from "@google/genai";

interface InternationalGatewayProps {
  onBook: (trip: Trip) => void;
}

type SortOption = 'default' | 'rating';

export const InternationalGateway: React.FC<InternationalGatewayProps> = ({ onBook }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeRegion, setActiveRegion] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedDest, setSelectedDest] = useState<FeaturedDestination | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<{ text: string; sources?: any[] } | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const regions = ['All', ...Array.from(new Set(INTERNATIONAL_DESTINATIONS.map((d) => d.region))).filter(Boolean) as string[]];

  const filteredDestinations = [...INTERNATIONAL_DESTINATIONS]
    .filter(d => activeRegion === 'All' || d.region === activeRegion)
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0; // maintain original order for 'default'
    });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedDest(null);
        setAiResponse(null);
        setEditedImage(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleBooking = () => {
    if (!selectedDest) return;
    const newTrip: Trip = {
      id: Math.random().toString(36).substr(2, 9),
      destinationName: selectedDest.name,
      image: editedImage || selectedDest.image,
      dates: 'Flexible dates chosen',
      travelers: '2 Adults',
      price: selectedDest.price,
      type: 'Vacation Package',
      bookedAt: Date.now()
    };
    onBook(newTrip);
    alert(`${selectedDest.name} has been added to your trips!`);
    setSelectedDest(null);
  };

  const handleAIAssist = async (mode: 'itinerary' | 'nearby') => {
    if (!selectedDest) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'itinerary') {
        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: `Create a detailed 5-day luxury travel itinerary for ${selectedDest.name}. Include morning, afternoon, and evening activities.`,
          config: {
            thinkingConfig: { thinkingBudget: 32768 }
          }
        });
        setAiResponse({ text: response.text || "Sorry, I couldn't generate an itinerary right now." });
      } else {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `What are the top 5 highly-rated local restaurants and hidden gems near ${selectedDest.name}?`,
          config: {
            tools: [{ googleMaps: {} }]
          }
        });
        setAiResponse({ 
          text: response.text || "Looking up nearby places...",
          sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
        });
      }
    } catch (error) {
      console.error(error);
      setAiResponse({ text: "Error connecting to AI assistant." });
    } finally {
      setAiLoading(false);
    }
  };

  const handleEditImage = async () => {
    if (!selectedDest || !editPrompt) return;
    setAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const imgRes = await fetch(selectedDest.image);
      const blob = await imgRes.blob();
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(blob);
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
            { text: `Modify this image of ${selectedDest.name}: ${editPrompt}. Maintain the core landmark structure.` }
          ]
        }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setEditedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error("Image edit error", e);
      alert("Could not process image edit.");
    } finally {
      setAiLoading(false);
      setEditPrompt('');
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-6 py-16 bg-white dark:bg-[#1a130c] md:rounded-3xl mb-16 overflow-hidden relative">
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
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <button
              onClick={() => scroll('right')}
              className="size-12 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 flex items-center justify-center transition-colors shadow-lg"
            >
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 md:pb-0">
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

          <div className="flex items-center gap-3">
             <span className="text-xs font-black uppercase tracking-widest opacity-40">Sort By:</span>
             <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                <button 
                  onClick={() => setSortBy('default')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sortBy === 'default' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-text-sec-light'}`}
                >
                  Featured
                </button>
                <button 
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sortBy === 'rating' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary' : 'text-text-sec-light'}`}
                >
                  Top Rated
                </button>
             </div>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-12 hide-scrollbar snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0"
        >
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setSelectedDest(dest)}
              className="relative min-w-[300px] md:min-w-[340px] h-[480px] rounded-2xl overflow-hidden snap-center group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
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
                   <div className="size-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                     <span className="material-symbols-outlined">arrow_outward</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedDest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-md" 
            onClick={() => { setSelectedDest(null); setEditedImage(null); }}
          />
          
          <div className="relative w-full max-w-6xl h-[90vh] bg-surface-light dark:bg-surface-dark rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => { setSelectedDest(null); setEditedImage(null); }}
              className="absolute top-6 right-6 z-50 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>

            <div className="w-full md:w-5/12 h-64 md:h-auto relative group">
               <img 
                 src={editedImage || selectedDest.image} 
                 alt={selectedDest.name}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
               <div className="absolute bottom-10 left-10 text-white">
                  <span className="text-xs font-black text-primary bg-white/10 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-[0.2em] mb-3 inline-block">Destination</span>
                  <h2 className="text-5xl font-black tracking-tighter leading-none mb-2">{selectedDest.name}</h2>
                  <div className="flex items-center gap-4 text-sm font-bold opacity-80">
                     <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg filled text-yellow-400">star</span> {selectedDest.rating}</span>
                     <span className="flex items-center gap-1"><span className="material-symbols-outlined text-lg">location_on</span> {selectedDest.region}</span>
                  </div>
               </div>

               <div className="absolute top-24 left-10 right-10 bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <label className="text-[10px] font-black uppercase text-white/60 mb-2 block tracking-widest">Magic Image Editor</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="Add a retro filter..."
                      className="flex-1 bg-white/10 border-none rounded-lg text-white text-xs py-2 focus:ring-1 focus:ring-primary outline-none placeholder:text-white/30"
                    />
                    <button 
                      onClick={handleEditImage}
                      disabled={aiLoading}
                      className="bg-primary text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase"
                    >
                      {aiLoading ? '...' : 'Edit'}
                    </button>
                  </div>
               </div>
            </div>

            <div className="w-full md:w-7/12 p-8 md:p-14 overflow-y-auto custom-scrollbar flex flex-col">
               <div className="flex items-center gap-8 mb-12">
                  <button 
                    onClick={() => handleAIAssist('itinerary')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/10">
                       <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Plan Trip</span>
                  </button>
                  <button 
                    onClick={() => handleAIAssist('nearby')}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="size-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all shadow-lg shadow-green-500/10">
                       <span className="material-symbols-outlined text-3xl">map</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Nearby</span>
                  </button>
               </div>

               <div className="flex-1">
                  {aiLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center animate-pulse">
                      <div className="size-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6"></div>
                      <h4 className="text-xl font-bold">Consulting our AI Concierge...</h4>
                      <p className="text-sm opacity-60 mt-2">Thinking hard to craft your perfect experience</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-3xl border border-gray-100 dark:border-white/5 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-xl font-bold">AI Recommendations</h4>
                        <button onClick={() => setAiResponse(null)} className="text-xs font-bold text-primary">Clear</button>
                      </div>
                      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                        {aiResponse.text}
                      </div>
                      {aiResponse.sources && (
                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5">
                          <h5 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-50">Verified Places</h5>
                          <div className="flex flex-wrap gap-2">
                             {aiResponse.sources.map((src, i) => (
                               src.maps && (
                                 <a key={i} href={src.maps.uri} target="_blank" className="text-[10px] bg-primary/10 text-primary px-3 py-1.5 rounded-full font-bold hover:bg-primary hover:text-white transition-colors">
                                   {src.maps.title || 'View on Maps'}
                                 </a>
                               )
                             ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-8">
                       <div>
                          <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.3em] mb-4">The Experience</h4>
                          <p className="text-2xl font-medium leading-tight text-text-main-light/90 dark:text-text-main-dark/90 italic">
                             "{selectedDest.description}"
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Best Visited In</h4>
                             <p className="font-bold text-lg">{selectedDest.bestTimeToVisit}</p>
                          </div>
                          <div>
                             <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-3">Expected Rating</h4>
                             <div className="flex items-center gap-1">
                               <span className="text-2xl font-black">{selectedDest.rating}</span>
                               <span className="material-symbols-outlined text-yellow-400 filled">star</span>
                             </div>
                          </div>
                       </div>

                       <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-4">Curated Highlights</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedDest.suggestedActivities?.map(act => (
                              <div key={act} className="px-5 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-xs font-bold border border-gray-100 dark:border-white/5">
                                {act}
                              </div>
                            ))}
                          </div>
                       </div>
                    </div>
                  )}
               </div>

               <div className="mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex items-center gap-6">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Total Package</p>
                    <p className="text-3xl font-black text-primary">{selectedDest.price}</p>
                  </div>
                  <button 
                    onClick={handleBooking}
                    className="px-12 h-16 bg-primary text-white dark:text-background-dark rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.03] active:scale-[0.98] transition-all"
                  >
                    Confirm Booking
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};