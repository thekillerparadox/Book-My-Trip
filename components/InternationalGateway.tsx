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
  const [customTripTitle, setCustomTripTitle] = useState('');
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const regions = ['All', ...Array.from(new Set(INTERNATIONAL_DESTINATIONS.map((d) => d.region))).filter(Boolean) as string[]];

  const filteredDestinations = [...INTERNATIONAL_DESTINATIONS]
    .filter(d => activeRegion === 'All' || d.region === activeRegion)
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      return 0; 
    });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 480;
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
        setCustomTripTitle('');
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
      tripTitle: customTripTitle || selectedDest.name,
      image: editedImage || selectedDest.image,
      dates: 'Flexible dates chosen',
      travelers: '2 Adults',
      price: selectedDest.price,
      type: 'Vacation Package',
      bookedAt: Date.now()
    };
    onBook(newTrip);
    alert(`${newTrip.tripTitle} has been added to your trips!`);
    setSelectedDest(null);
    setCustomTripTitle('');
  };

  const handleReadAloud = async () => {
    if (!selectedDest || isPlayingTTS) return;
    setIsPlayingTTS(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const textToRead = `${selectedDest.name}. ${selectedDest.description}. Located in ${selectedDest.region}. The best time to visit is ${selectedDest.bestTimeToVisit}.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: textToRead }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
        },
      });

      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
         const binaryString = atob(audioData);
         const bytes = new Uint8Array(binaryString.length);
         for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
         
         const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
         
         const data16 = new Int16Array(bytes.buffer);
         const float32 = new Float32Array(data16.length);
         for (let i=0; i<data16.length; i++) float32[i] = data16[i] / 32768;
         
         const buffer = ctx.createBuffer(1, float32.length, 24000);
         buffer.copyToChannel(float32, 0);

         const source = ctx.createBufferSource();
         source.buffer = buffer;
         source.connect(ctx.destination);
         source.start(0);
         source.onended = () => setIsPlayingTTS(false);
      } else {
        setIsPlayingTTS(false);
      }

    } catch (e) {
      console.error("TTS Failed", e);
      setIsPlayingTTS(false);
    }
  };

  const handleAISearch = async () => {
    if (!selectedDest) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Provide the latest travel requirements, news, and trending cultural tips for visiting ${selectedDest.name} in 2025. Include current weather conditions and event highlights.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });
      setAiResponse({ 
        text: response.text || "No specific tips found.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      });
    } catch (e) {
      console.error(e);
      setAiResponse({ text: "Search assist failed." });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIMaps = async () => {
    if (!selectedDest) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let toolConfig = undefined;
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }
        };
      } catch (geoError) {
        console.debug("Proceeding without geolocation context.");
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Locate the top 5 highly-rated local restaurants and popular tourist hotspots near ${selectedDest.name}. Provide direct Google Maps links and summarize why they are unique.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig
        }
      });
      setAiResponse({ 
        text: response.text || "Could not find map data.",
        sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
      });
    } catch (e) {
      console.error(e);
      setAiResponse({ text: "Maps assist failed." });
    } finally {
      setAiLoading(false);
    }
  };

  const handleAITinerary = async () => {
    if (!selectedDest) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Create a professional 7-day high-end itinerary for ${selectedDest.name}. Focus on unique cultural experiences, hidden culinary spots, and luxury logistics. Plan for a diverse range of activities.`,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });
      setAiResponse({ text: response.text || "Failed to generate itinerary." });
    } catch (e) {
      console.error(e);
      setAiResponse({ text: "Complex AI assistant failed." });
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
            { text: `Enhance and edit this travel photo of ${selectedDest.name} according to this request: ${editPrompt}. Maintain natural lighting and architectural integrity.` }
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
      console.error(e);
      alert("AI Magic Edit failed.");
    } finally {
      setAiLoading(false);
      setEditPrompt('');
    }
  };

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 md:px-6 py-8 border border-gray-100 dark:border-white/5 rounded-[2.5rem] glass-panel shadow-2xl relative">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="material-symbols-outlined text-primary text-4xl">public</span>
               <h2 className="text-3xl md:text-4xl font-bold tracking-tight font-display">International Gateway</h2>
            </div>
            <p className="text-text-sec-light dark:text-text-sec-dark max-w-2xl text-sm md:text-base leading-relaxed font-medium">
              Explore 20 global hotspots curated by our AI travel concierge. From Balinese rice terraces to Parisian boulevards.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              className="size-12 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 flex items-center justify-center transition-all shadow-sm group active:scale-95"
            >
              <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            </button>
            <button
              onClick={() => scroll('right')}
              className="size-12 rounded-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-all shadow-xl shadow-primary/30 group active:scale-95"
            >
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className={`px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border active:scale-95 ${
                  activeRegion === region
                    ? 'bg-primary text-white border-primary shadow-primary/20'
                    : 'bg-white dark:bg-white/5 text-text-sec-light border-gray-100 dark:border-white/10 hover:border-primary/40'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-1 rounded-xl border border-gray-100 dark:border-white/10 shadow-inner self-start md:self-auto">
             <button 
                onClick={() => setSortBy('default')}
                className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${sortBy === 'default' ? 'bg-white dark:bg-gray-700 shadow-md text-primary' : 'text-text-sec-light/60'}`}
             >
                Top Picks
             </button>
             <button 
                onClick={() => setSortBy('rating')}
                className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${sortBy === 'rating' ? 'bg-white dark:bg-gray-700 shadow-md text-primary' : 'text-text-sec-light/60'}`}
             >
                Highest Rated
             </button>
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
        >
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => setSelectedDest(dest)}
              className="relative min-w-[280px] md:min-w-[400px] h-[480px] rounded-[2rem] overflow-hidden snap-center group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700 border border-transparent hover:border-primary/20 active:scale-[0.98]"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-500"></div>
              
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-lg border border-white/20 flex items-center gap-1.5 group-hover:bg-white group-hover:text-black transition-all">
                 <span className="material-symbols-outlined text-yellow-400 text-sm filled">star</span>
                 <span className="text-xs font-bold">{dest.rating}</span>
              </div>

              {dest.isTopChoice && (
                <div className="absolute top-4 left-4 bg-primary text-white text-[8px] font-bold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                  Top Choice
                </div>
              )}

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 text-white transform group-hover:-translate-y-2 transition-transform duration-700">
                <span className="text-[9px] font-bold tracking-widest opacity-60 uppercase mb-2 block">{dest.region}</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight font-display">{dest.name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   {dest.suggestedActivities?.slice(0, 2).map(a => (
                     <span key={a} className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/10">{a}</span>
                   ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                   <div>
                      <p className="text-[9px] font-bold uppercase opacity-60 tracking-wider mb-0.5">Package Starts At</p>
                      <p className="text-xl font-bold text-white">{dest.price}</p>
                   </div>
                   <div className="size-10 rounded-xl bg-white text-black flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12 shadow-xl">
                     <span className="material-symbols-outlined text-xl">arrow_forward</span>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedDest && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4 lg:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => { setSelectedDest(null); setAiResponse(null); setEditedImage(null); setCustomTripTitle(''); }} />
          
          <div className="relative w-full max-w-[1300px] h-full max-h-[100vh] md:max-h-[90vh] bg-white dark:bg-[#12181F] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 p-0 flex flex-col lg:flex-row">
            <button 
              onClick={() => { setSelectedDest(null); setAiResponse(null); setEditedImage(null); setCustomTripTitle(''); }}
              className="absolute top-6 right-6 z-50 size-12 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-primary transition-all flex items-center justify-center group active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform">close</span>
            </button>

            <div className="w-full lg:w-[40%] h-64 lg:h-auto relative flex-shrink-0">
               <img 
                 src={editedImage || selectedDest.image} 
                 alt={selectedDest.name}
                 className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#12181F] via-transparent to-black/30" />
               <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 text-white">
                  <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 lg:mb-6 font-display">{selectedDest.name}</h2>
                  <div className="bg-black/30 backdrop-blur-xl border border-white/10 p-4 lg:p-6 rounded-2xl hidden md:block">
                     <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-lg">auto_fix_high</span>
                        <label className="text-[9px] font-bold uppercase text-white/50 tracking-widest">Nano Magic Edit</label>
                     </div>
                     <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={editPrompt}
                         onChange={(e) => setEditPrompt(e.target.value)}
                         placeholder="Describe a change..."
                         className="flex-1 bg-white/5 border-none rounded-lg text-xs py-3 px-4 text-white focus:ring-1 focus:ring-primary placeholder:text-white/20"
                       />
                       <button 
                         onClick={handleEditImage}
                         disabled={aiLoading}
                         className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all"
                       >
                         {aiLoading ? '...' : 'Go'}
                       </button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="w-full lg:w-[60%] p-6 lg:p-16 overflow-y-auto hide-scrollbar flex flex-col bg-white dark:bg-[#12181F]">
               <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 lg:mb-12">
                  <button 
                    onClick={handleAISearch}
                    className="w-full sm:flex-1 min-w-[140px] flex items-center justify-center gap-3 h-14 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-gray-100 dark:border-white/5 active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-2xl">travel_explore</span>
                    AI Search
                  </button>
                  <button 
                    onClick={handleAIMaps}
                    className="w-full sm:flex-1 min-w-[140px] flex items-center justify-center gap-3 h-14 bg-gray-50 dark:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all border border-gray-100 dark:border-white/5 active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-2xl">pin_drop</span>
                    Maps
                  </button>
                  <button 
                    onClick={handleAITinerary}
                    className="w-full sm:flex-1 min-w-[140px] flex items-center justify-center gap-3 h-14 bg-primary/10 text-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/20 active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-2xl">lightbulb_circle</span>
                    Itinerary
                  </button>
               </div>

               <div className="flex-1 min-h-0">
                  {aiLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
                      <h4 className="text-xl font-bold tracking-tight mb-2 font-display">Generating Insights</h4>
                      <p className="text-sm opacity-40 font-medium">Please wait while our AI synthesizes real-time travel data.</p>
                    </div>
                  ) : aiResponse ? (
                    <div className="bg-gray-50 dark:bg-white/5 p-6 lg:p-8 rounded-3xl border border-gray-100 dark:border-white/5 animate-in slide-in-from-bottom-6 duration-700">
                      <div className="flex items-center justify-between mb-8">
                         <h4 className="text-lg font-bold tracking-tight font-display">Concierge Insights</h4>
                         <button onClick={() => setAiResponse(null)} className="text-[10px] font-bold uppercase tracking-widest text-primary opacity-60 hover:opacity-100">Clear</button>
                      </div>
                      <div className="text-sm leading-relaxed text-text-main-light/80 dark:text-text-main-dark/80 whitespace-pre-wrap mb-10">
                        {aiResponse.text}
                      </div>
                      {aiResponse.sources && aiResponse.sources.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                           {aiResponse.sources.map((src, i) => (
                             (src.maps || src.web) && (
                               <a 
                                 key={i} 
                                 href={src.maps?.uri || src.web?.uri} 
                                 target="_blank" 
                                 className="px-4 py-2 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:text-primary transition-all flex items-center gap-2"
                               >
                                 <span className="material-symbols-outlined text-sm">{src.maps ? 'pin_drop' : 'language'}</span>
                                 {src.maps?.title || src.web?.title || 'External Source'}
                               </a>
                             )
                           ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-8 lg:space-y-12">
                       <div className="relative">
                          <button 
                            onClick={handleReadAloud}
                            disabled={isPlayingTTS}
                            className={`absolute -top-1 right-0 p-2 rounded-full border transition-all ${isPlayingTTS ? 'bg-primary text-white animate-pulse' : 'border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'}`}
                            title="Read Description Aloud"
                          >
                            <span className="material-symbols-outlined">{isPlayingTTS ? 'volume_up' : 'text_to_speech'}</span>
                          </button>
                          <h4 className="text-[10px] font-bold uppercase text-primary tracking-widest mb-4">The Experience</h4>
                          <p className="text-xl md:text-2xl font-bold leading-relaxed tracking-tight font-display">
                             "{selectedDest.description}"
                          </p>
                       </div>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Best Time</h4>
                             <p className="font-bold text-lg text-primary">{selectedDest.bestTimeToVisit}</p>
                          </div>
                          <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-2xl border border-gray-100 dark:border-white/5">
                             <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">Rating</h4>
                             <div className="flex items-center gap-2">
                               <span className="text-lg font-bold">{selectedDest.rating}</span>
                               <span className="material-symbols-outlined text-yellow-400 text-base filled">star</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  )}
               </div>

               <div className="mt-8 lg:mt-12 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col gap-6">
                  {/* Custom Trip Title Input */}
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 ml-1">Name Your Trip (Optional)</label>
                     <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light opacity-40">edit</span>
                        <input 
                           type="text"
                           value={customTripTitle}
                           onChange={(e) => setCustomTripTitle(e.target.value)}
                           placeholder={`${selectedDest.name} Adventure`}
                           className="w-full h-12 pl-11 pr-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 focus:ring-1 focus:ring-primary outline-none text-sm font-semibold transition-all"
                        />
                     </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Total Package</p>
                      <p className="text-3xl md:text-4xl font-bold text-primary leading-none tracking-tight">{selectedDest.price}</p>
                    </div>
                    <button 
                      onClick={handleBooking}
                      className="flex-1 h-14 md:h-16 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      Confirm Booking
                      <span className="material-symbols-outlined text-2xl">verified</span>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};