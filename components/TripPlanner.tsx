import React, { useState } from 'react';
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Trip } from '../types';
import { TRENDING_DESTINATIONS, INTERNATIONAL_DESTINATIONS } from '../constants';

interface TripPlannerProps {
  onBook: (trip: Trip) => void;
}

interface PlannerResult {
  destination: string;
  location: string;
  tagline: string;
  vibe_match: string;
  highlight_activity: string;
  estimated_cost: string;
  match_score: number;
}

export const TripPlanner: React.FC<TripPlannerProps> = ({ onBook }) => {
  // Inputs
  const [groupType, setGroupType] = useState<'Couple' | 'Family' | 'Friends' | 'Solo'>('Couple');
  const [scope, setScope] = useState<'Global' | 'India' | 'International'>('Global');
  const [budget, setBudget] = useState<'Budget' | 'Standard' | 'Luxury'>('Standard');
  const [duration, setDuration] = useState(5);

  // AI State
  const [isThinking, setIsThinking] = useState(false);
  const [result, setResult] = useState<PlannerResult | null>(null);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);

  const groupOptions = [
    { id: 'Couple', icon: 'favorite', label: 'Couple' },
    { id: 'Family', icon: 'family_restroom', label: 'Family' },
    { id: 'Friends', icon: 'groups', label: 'Friends' },
    { id: 'Solo', icon: 'hiking', label: 'Solo' },
  ];

  const scopeOptions = [
    { id: 'Global', label: 'Anywhere 🌍' },
    { id: 'India', label: 'India 🇮🇳' },
    { id: 'International', label: 'Abroad ✈️' },
  ];

  // Helper to find a relevant image
  const getDestinationImage = (destName: string) => {
    const allDestinations = [...TRENDING_DESTINATIONS, ...INTERNATIONAL_DESTINATIONS];
    const match = allDestinations.find(d => 
      destName.toLowerCase().includes(d.name.toLowerCase()) || 
      d.name.toLowerCase().includes(destName.toLowerCase())
    );
    if (match) return match.image;
    // Fallbacks
    if (scope === 'India') return 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1200';
    return 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200';
  };

  const handlePlan = async () => {
    setIsThinking(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Plan a perfect trip for a ${groupType} group.
      Preference: ${scope === 'Global' ? 'Anywhere in the world' : scope === 'India' ? 'Domestic travel within India' : 'International travel outside India'}.
      Budget Level: ${budget}.
      Duration: ${duration} days.
      
      Think deeply about the psychology of this specific group type (e.g., couples need romance but also bonding activities, families need safety and engagement for all ages).
      Select ONE specific destination that perfectly balances weather, crowd factors, and unique experiences.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              destination: { type: Type.STRING },
              location: { type: Type.STRING },
              tagline: { type: Type.STRING },
              vibe_match: { type: Type.STRING, description: "Why this fits the group type perfectly" },
              highlight_activity: { type: Type.STRING, description: "One unmissable activity" },
              estimated_cost: { type: Type.STRING },
              match_score: { type: Type.INTEGER, description: "A number between 90 and 100" }
            },
            required: ["destination", "location", "tagline", "vibe_match", "highlight_activity", "estimated_cost", "match_score"]
          }
        }
      });

      if (response.text) {
        setResult(JSON.parse(response.text));
      }
    } catch (error) {
      console.error("Planning failed", error);
      setResult({
        destination: "Udaipur",
        location: "Rajasthan, India",
        tagline: "The City of Lakes",
        vibe_match: "Perfect for couples seeking royal romance.",
        highlight_activity: "Sunset boat ride on Lake Pichola",
        estimated_cost: "₹45,000",
        match_score: 95
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleReadResult = async () => {
    if (!result || isPlayingTTS) return;
    setIsPlayingTTS(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const textToRead = `We recommend ${result.destination} in ${result.location}. ${result.vibe_match} The highlight is ${result.highlight_activity}. Estimated cost is ${result.estimated_cost}.`;
      
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
         // Decode Base64 to ArrayBuffer
         const binaryString = atob(audioData);
         const bytes = new Uint8Array(binaryString.length);
         for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
         
         const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
         
         // Manually decode PCM
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

  const handleBookClick = () => {
    if (result) {
      onBook({
        id: Math.random().toString(36).substr(2, 9),
        destinationName: result.destination,
        tripTitle: `${result.destination} ${groupType} Trip`,
        image: getDestinationImage(result.destination),
        dates: `${duration} Days`,
        travelers: groupType,
        price: result.estimated_cost,
        type: 'Planned Trip',
        bookedAt: Date.now()
      });
      alert(`Trip to ${result.destination} added to your itinerary!`);
    }
  };

  return (
    <section className="w-full max-w-[1200px] px-4 md:px-6 py-4">
      <div className="bg-white dark:bg-surface-dark rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden relative">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-secondary"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Input Panel */}
          <div className="lg:col-span-5 p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-white/5 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-4">
                <div className="size-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                   <span className="material-symbols-outlined text-2xl filled">explore</span>
                </div>
                <h2 className="text-3xl font-black font-display tracking-tight text-text-main-light dark:text-text-main-dark">
                   Trip Planner
                </h2>
             </div>
             <p className="text-text-sec-light dark:text-text-sec-dark text-sm mb-8 leading-relaxed font-medium opacity-80">
                Not sure where to go? Tell us who you're with and what you need. Our Gemini AI will think deeply to find your perfect match.
             </p>

             <div className="space-y-6">
                {/* Scope Filter (Global/India/International) */}
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block ml-1">Where to?</label>
                   <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-xl overflow-x-auto hide-scrollbar">
                      {scopeOptions.map((opt) => (
                        <button
                           key={opt.id}
                           onClick={() => setScope(opt.id as any)}
                           className={`flex-1 py-3 px-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap active:scale-95 ${
                              scope === opt.id 
                              ? 'bg-white dark:bg-gray-700 shadow-md text-primary' 
                              : 'text-text-sec-light dark:text-text-sec-dark opacity-60 hover:opacity-100'
                           }`}
                        >
                           {opt.label}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Group Type */}
                <div>
                   <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block ml-1">Who is traveling?</label>
                   <div className="grid grid-cols-2 gap-3">
                      {groupOptions.map((opt) => (
                         <button
                            key={opt.id}
                            onClick={() => setGroupType(opt.id as any)}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left active:scale-[0.98] ${
                               groupType === opt.id
                               ? 'border-primary bg-primary/5 text-primary'
                               : 'border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 text-text-sec-light'
                            }`}
                         >
                            <span className="material-symbols-outlined text-lg">{opt.icon}</span>
                            <span className="text-xs font-bold">{opt.label}</span>
                         </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   {/* Budget */}
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block ml-1">Budget</label>
                      <select 
                         value={budget}
                         onChange={(e) => setBudget(e.target.value as any)}
                         className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                      >
                         <option value="Budget">💰 Budget Friendly</option>
                         <option value="Standard">⚖️ Balanced</option>
                         <option value="Luxury">💎 Luxury</option>
                      </select>
                   </div>
                   {/* Duration */}
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block ml-1">Days</label>
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 rounded-xl px-4 h-[42px] border border-gray-100 dark:border-white/10">
                         <button onClick={() => setDuration(d => Math.max(1, d - 1))} className="text-primary hover:scale-125 transition-transform active:scale-90">
                            <span className="material-symbols-outlined text-sm">remove</span>
                         </button>
                         <span className="flex-1 text-center text-xs font-bold">{duration}</span>
                         <button onClick={() => setDuration(d => Math.min(30, d + 1))} className="text-primary hover:scale-125 transition-transform active:scale-90">
                            <span className="material-symbols-outlined text-sm">add</span>
                         </button>
                      </div>
                   </div>
                </div>

                <button 
                  onClick={handlePlan}
                  disabled={isThinking}
                  className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl flex items-center justify-center gap-2 transition-all ${
                     isThinking 
                     ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed'
                     : 'bg-text-main-light dark:bg-white text-white dark:text-black hover:scale-[1.01] active:scale-95 hover:shadow-2xl'
                  }`}
                >
                   {isThinking ? (
                      <>
                         <div className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                         <span>Consulting AI...</span>
                      </>
                   ) : (
                      <>
                         <span className="material-symbols-outlined text-lg">auto_awesome</span>
                         Plan My Trip
                      </>
                   )}
                </button>
             </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 bg-gray-50 dark:bg-[#0A0C10] p-0 relative overflow-hidden flex flex-col min-h-[500px] lg:min-h-auto">
             {/* Background Pattern */}
             <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366F1 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

             {result ? (
                <div className="relative z-10 animate-in fade-in slide-in-from-right-8 duration-700 h-full flex flex-col">
                   {/* Destination Image Banner */}
                   <div className="relative h-48 md:h-64 w-full overflow-hidden">
                      <img 
                        src={getDestinationImage(result.destination)} 
                        alt={result.destination}
                        className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0A0C10] to-transparent"></div>
                      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-lg animate-in fade-in zoom-in delay-300">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-sm filled">check_circle</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">{result.match_score}% Match</span>
                        </div>
                      </div>
                   </div>

                   <div className="p-6 md:p-10 pt-4 flex-1 flex flex-col">
                     <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block">{groupType} • {duration} Days</span>

                     <h3 className="text-3xl md:text-5xl font-black font-display tracking-tight mb-2 text-text-main-light dark:text-text-main-dark leading-none">
                        {result.destination}
                     </h3>
                     <p className="text-base md:text-lg font-medium text-primary mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined">location_on</span>
                        {result.location}
                        <button 
                          onClick={handleReadResult}
                          disabled={isPlayingTTS}
                          className={`ml-2 size-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 transition-all active:scale-95 ${isPlayingTTS ? 'text-primary animate-pulse' : 'text-text-sec-light'}`}
                        >
                          <span className="material-symbols-outlined text-lg">{isPlayingTTS ? 'volume_up' : 'text_to_speech'}</span>
                        </button>
                     </p>

                     <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5 mb-6">
                        <div className="flex items-start gap-4 mb-4">
                           <div className="size-10 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                              <span className="material-symbols-outlined filled">psychology</span>
                           </div>
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Why this fits</h4>
                              <p className="text-sm font-medium leading-relaxed italic">"{result.vibe_match}"</p>
                           </div>
                        </div>
                        <div className="h-px w-full bg-gray-100 dark:bg-white/5 my-4"></div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Highlight</h4>
                              <p className="text-xs font-bold">{result.highlight_activity}</p>
                           </div>
                           <div>
                              <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Est. Cost</h4>
                              <p className="text-xs font-bold text-primary">{result.estimated_cost}</p>
                           </div>
                        </div>
                     </div>

                     <button 
                       onClick={handleBookClick}
                       className="w-full h-14 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 mt-auto"
                     >
                        Book This Plan
                        <span className="material-symbols-outlined">arrow_forward</span>
                     </button>
                   </div>
                </div>
             ) : (
                <div className="h-full flex flex-col items-center justify-center text-center relative z-10 opacity-40 p-10 min-h-[400px]">
                   {isThinking ? (
                      <div className="animate-pulse flex flex-col items-center">
                         <span className="material-symbols-outlined text-6xl mb-4 text-primary">cloud_sync</span>
                         <h4 className="text-lg font-bold font-display">Thinking Deeply...</h4>
                         <p className="text-xs max-w-xs mt-2">Analyzing weather patterns, local events, and {groupType.toLowerCase()} dynamics for {scope} destinations.</p>
                      </div>
                   ) : (
                      <>
                         <span className="material-symbols-outlined text-6xl mb-4">map</span>
                         <h4 className="text-lg font-bold font-display">Your Adventure Awaits</h4>
                         <p className="text-xs max-w-xs mt-2">Configure your preferences on the left to generate a bespoke itinerary.</p>
                      </>
                   )}
                </div>
             )}
          </div>
        </div>
      </div>
    </section>
  );
};