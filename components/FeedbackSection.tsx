
import React, { useState, useEffect, useRef } from 'react';
import { Trip } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface FeedbackSectionProps {
  trips: Trip[];
}

interface FeedbackAnalysis {
  sentimentScore: number;
  emotionalTone: string;
  keyHighlights: string[];
  personalizedResponse: string;
  rewardSuggestion: string;
  postcardTitle: string; 
}

const MOCK_CURATED_FEEDBACK = [
  { id: 'c1', user: 'Isabella Chen', avatar: 'https://i.pravatar.cc/150?u=isabella', destination: 'Kyoto, Japan', rating: 5, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', analysis: { sentimentScore: 88, emotionalTone: "Zen", postcardTitle: "Peaceful Kyoto Moments" } },
  { id: 'c2', user: 'Marcus Thorne', avatar: 'https://i.pravatar.cc/150?u=marcus', destination: 'Swiss Alps', rating: 4, image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?q=80&w=800', analysis: { sentimentScore: 78, emotionalTone: "Invigorated", postcardTitle: "Alpine Adventures" } },
];

export const FeedbackSection: React.FC<FeedbackSectionProps> = ({ trips }) => {
  const availableTrips = trips.length > 0 ? trips : [{ id: 'm1', destinationName: 'General Trip', tripTitle: 'Recent Adventure', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800' }];
  const [selectedTripId, setSelectedTripId] = useState(availableTrips[0]?.id || '');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [analysis, setAnalysis] = useState<FeedbackAnalysis | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const thoughts = ["Analyzing vibe...", "Generating memory...", "Minting postcard..."];
  const [thoughtIdx, setThoughtIdx] = useState(0);

  useEffect(() => {
    if (isThinking) {
      const interval = setInterval(() => setThoughtIdx(i => (i + 1) % thoughts.length), 1500);
      return () => clearInterval(interval);
    }
  }, [isThinking]);

  const handleSubmit = async () => {
    if (!comment || rating === 0) return;
    setIsThinking(true); setAnalysis(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Feedback Analysis: Rating ${rating}, Comment "${comment}". Return JSON with sentimentScore, emotionalTone, keyHighlights, personalizedResponse, rewardSuggestion, postcardTitle.`,
        config: { thinkingConfig: { thinkingBudget: 32768 }, responseMimeType: "application/json" }
      });
      if (response.text) setAnalysis(JSON.parse(response.text));
    } catch (e) {
      setAnalysis({ sentimentScore: 85, emotionalTone: "Grateful", keyHighlights: ["Great Vibe"], personalizedResponse: "Thanks for sharing!", rewardSuggestion: "Premium Badge", postcardTitle: "A Trip to Remember" });
    } finally { setIsThinking(false); }
  };

  return (
    <section className="w-full max-w-[1200px] px-6 py-12 md:py-20 flex flex-col gap-12 md:gap-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        <div className="w-full max-w-xl mx-auto lg:mx-0">
           <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20 mb-4">Feedback & Rewards</div>
              <h2 className="text-3xl md:text-5xl font-black font-display tracking-tight text-text-main-light dark:text-text-main-dark mb-4 leading-tight">Mint your <span className="text-primary">Memory</span></h2>
              <p className="text-text-sec-light text-sm opacity-80 font-medium">Share your story to unlock personalized perks and a digital postcard.</p>
           </div>

           <div className="bg-white dark:bg-surface-dark p-6 md:p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/5 space-y-6">
              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block">Trip Experience</label>
                 <select value={selectedTripId} onChange={(e) => setSelectedTripId(e.target.value)} className="w-full h-12 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer">
                    {availableTrips.map(t => <option key={t.id} value={t.id}>{t.tripTitle || t.destinationName}</option>)}
                 </select>
              </div>

              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block">Rating</label>
                 <div className="flex justify-between max-w-[240px]">
                    {[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setRating(s)} className={`text-2xl transition-all ${rating >= s ? 'grayscale-0 scale-110' : 'grayscale opacity-30'}`}>{['😡', '🙁', '😐', '🙂', '🤩'][s-1]}</button>)}
                 </div>
              </div>

              <div>
                 <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2 block">Tell your story</label>
                 <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What made this trip special?" className="w-full h-28 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl p-4 text-xs font-medium focus:ring-2 focus:ring-primary outline-none resize-none" />
              </div>

              <button onClick={handleSubmit} disabled={isThinking || !comment} className={`w-full h-14 bg-text-main-light dark:bg-white text-white dark:text-black rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-2 ${isThinking ? 'opacity-50' : 'active:scale-95 transition-all'}`}>
                 {isThinking ? thoughts[thoughtIdx] : 'Mint Digital Postcard'}<span className="material-symbols-outlined text-lg">auto_awesome</span>
              </button>
           </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
           {isThinking ? (
              <div className="flex flex-col items-center text-center animate-pulse"><div className="size-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6"></div><h3 className="text-lg font-black font-display text-primary">Refining Memory...</h3></div>
           ) : analysis ? (
              <div className="w-full max-w-sm bg-white dark:bg-[#1E293B] rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-500">
                 <div className="h-56 relative overflow-hidden">
                    <img src={availableTrips.find(t => t.id === selectedTripId)?.image} className="w-full h-full object-cover" alt="postcard" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                       <p className="text-[9px] font-bold uppercase tracking-widest opacity-80 mb-1">{analysis.emotionalTone} Vibes</p>
                       <h3 className="text-xl font-black font-display leading-tight">{analysis.postcardTitle}</h3>
                    </div>
                 </div>
                 <div className="p-6">
                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border-l-4 border-primary mb-6">
                       <p className="text-[10px] font-bold uppercase opacity-40 mb-1 flex items-center gap-1"><span className="material-symbols-outlined text-sm">support_agent</span>Concierge Note</p>
                       <p className="text-xs italic font-medium opacity-80 leading-relaxed">"{analysis.personalizedResponse}"</p>
                    </div>
                    <div className="border-t-2 border-dashed border-gray-200 dark:border-white/10 pt-4 flex items-center justify-between">
                       <div><p className="text-[8px] font-bold uppercase opacity-50">Locked Reward</p><p className="text-xs font-black text-primary">{analysis.rewardSuggestion}</p></div>
                       <button className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-base">download</span></button>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="text-center opacity-40 max-w-[280px]"><div className="size-20 rounded-full bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 mx-auto mb-6 flex items-center justify-center"><span className="material-symbols-outlined text-3xl">filter_hdr</span></div><p className="text-xs font-bold uppercase tracking-widest">Postcard Empty</p></div>
           )}
        </div>
      </div>
      
      <div className="pt-12 border-t border-gray-100 dark:border-white/5">
        <h3 className="text-2xl font-black font-display text-text-main-light dark:text-text-main-dark mb-8">Community Stories</h3>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-10 -mx-6 px-6 snap-x">
          {MOCK_CURATED_FEEDBACK.map(item => (
            <div key={item.id} className="min-w-[300px] w-[300px] snap-center bg-white dark:bg-surface-dark rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 dark:border-white/5 hover:-translate-y-1 transition-all duration-300">
               <div className="h-44 relative">
                  <img src={item.image} className="w-full h-full object-cover" alt="trip" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full text-white text-[9px] font-bold"><img src={item.avatar} className="size-5 rounded-full border border-white" />{item.user}</div>
                  <div className="absolute bottom-4 left-4 text-white"><h4 className="text-lg font-black font-display leading-tight">{item.analysis.postcardTitle}</h4></div>
               </div>
               <div className="p-5 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">{item.destination}</span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-bold"><span>Score {item.analysis.sentimentScore}</span></div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
