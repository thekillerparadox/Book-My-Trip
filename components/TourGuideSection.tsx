import React, { useState } from 'react';
import { Guide, Trip } from '../types';
import { GoogleGenAI, Type } from "@google/genai";

interface TourGuideSectionProps {
  onBook: (trip: Trip) => void;
}

const MOCK_GUIDES: Guide[] = [
  {
    id: 'g1',
    name: 'Hiroshi Tanaka',
    location: 'Tokyo, Japan',
    specialties: ['Food & Drink', 'History', 'Anime Culture'],
    languages: ['English', 'Japanese'],
    rating: 4.9,
    reviewCount: 142,
    pricePerDay: '₹12,000',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800&auto=format&fit=crop',
    bio: 'Local historian by day, izakaya expert by night. I show you the real Tokyo.',
    verified: true
  },
  {
    id: 'g2',
    name: 'Elena Rossi',
    location: 'Rome, Italy',
    specialties: ['Art History', 'Architecture', 'Wine'],
    languages: ['English', 'Italian', 'French'],
    rating: 5.0,
    reviewCount: 210,
    pricePerDay: '₹18,500',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    bio: 'Licensed art historian. I have keys to secret chapels you cannot visit otherwise.',
    verified: true
  },
  {
    id: 'g3',
    name: 'Rajesh Kumar',
    location: 'Jaipur, India',
    specialties: ['Royal Heritage', 'Photography', 'Textiles'],
    languages: ['English', 'Hindi', 'Spanish'],
    rating: 4.8,
    reviewCount: 350,
    pricePerDay: '₹4,500',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop',
    bio: 'My family has served the royals for generations. Let me tell you their stories.',
    verified: true
  },
  {
    id: 'g4',
    name: 'Sarah Miller',
    location: 'New York, USA',
    specialties: ['Urban Exploration', 'Street Art', 'Pizza'],
    languages: ['English'],
    rating: 4.7,
    reviewCount: 88,
    pricePerDay: '₹22,000',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop',
    bio: 'I know every rooftop bar and speakeasy in Brooklyn. Experience NYC like a local.',
    verified: false
  },
  {
    id: 'g5',
    name: 'Arief Wijaya',
    location: 'Bali, Indonesia',
    specialties: ['Spirituality', 'Nature Treks', 'Meditation'],
    languages: ['English', 'Indonesian'],
    rating: 4.9,
    reviewCount: 175,
    pricePerDay: '₹6,000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    bio: 'Guiding you to the spiritual heart of Bali. Water temples, rice terraces, and peace.',
    verified: true
  },
  {
    id: 'g6',
    name: 'Chloe Dubois',
    location: 'Paris, France',
    specialties: ['Fashion', 'Gastronomy', 'Shopping'],
    languages: ['English', 'French'],
    rating: 4.8,
    reviewCount: 130,
    pricePerDay: '₹25,000',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=800&auto=format&fit=crop',
    bio: 'Personal shopper and food critic. I will get you into the places that are fully booked.',
    verified: true
  }
];

export const TourGuideSection: React.FC<TourGuideSectionProps> = ({ onBook }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [aiMatchLoading, setAiMatchLoading] = useState(false);
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<{
    bestMatchId: string;
    reason: string;
    suggestedItinerary: string;
  } | null>(null);

  const filteredGuides = MOCK_GUIDES.filter(g => 
    g.location.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookGuide = (guide: Guide) => {
    onBook({
      id: Math.random().toString(36).substr(2, 9),
      destinationName: guide.location,
      tripTitle: `Guided Tour with ${guide.name}`,
      image: guide.image,
      dates: 'Date TBD',
      travelers: 'Private Group',
      price: guide.pricePerDay,
      type: 'Tour Guide',
      bookedAt: Date.now()
    });
    alert(`Request sent to ${guide.name}! They will contact you shortly.`);
    setActiveGuide(null);
  };

  const handleAiMatch = async () => {
    if (!searchTerm) {
      alert("Please enter a location or interest in the search bar first!");
      return;
    }
    setAiMatchLoading(true);
    setAiRecommendation(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const guidesJson = JSON.stringify(MOCK_GUIDES.map(g => ({
        id: g.id,
        name: g.name,
        location: g.location,
        specialties: g.specialties,
        bio: g.bio
      })));

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `I have a user searching for: "${searchTerm}".
        Here is my list of available guides: ${guidesJson}.
        
        Task:
        1. Select the BEST matching guide ID from the list. If none match well, pick the most versatile one.
        2. Write a short reason why (2 sentences).
        3. Suggest a 1-day mini itinerary (3 bullet points) that this guide would be perfect for based on the user's search.

        Think deeply about the user's intent (e.g. "food" means they want culinary spots, "history" means museums/ruins).
        `,
        config: {
          thinkingConfig: { thinkingBudget: 4096 }, // Moderate thinking for matching
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              bestMatchId: { type: Type.STRING },
              reason: { type: Type.STRING },
              suggestedItinerary: { type: Type.STRING }
            },
            required: ["bestMatchId", "reason", "suggestedItinerary"]
          }
        }
      });

      if (response.text) {
        const result = JSON.parse(response.text);
        setAiRecommendation(result);
        const match = MOCK_GUIDES.find(g => g.id === result.bestMatchId);
        if (match) {
          // Scroll to match or highlight? We'll just show the recommendation card at top.
        }
      }
    } catch (e) {
      console.error(e);
      alert("AI Match failed. Please try again.");
    } finally {
      setAiMatchLoading(false);
    }
  };

  return (
    <section className="w-full pt-28 pb-16 px-6 min-h-screen flex flex-col items-center">
      <div className="max-w-[1200px] w-full">
        
        {/* Hero Header */}
        <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-lg filled">person_pin_circle</span>
              <span className="text-xs font-bold uppercase tracking-widest">Global Local Experts</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight text-text-main-light dark:text-text-main-dark mb-4">
              Find your <span className="text-primary">perfect guide</span> anywhere.
           </h1>
           <p className="text-lg text-text-sec-light dark:text-text-sec-dark max-w-2xl mx-auto">
              Connect with verified locals who know the hidden gems, history, and culture of your next destination.
           </p>
        </div>

        {/* Search & AI Match Bar */}
        <div className="relative max-w-2xl mx-auto mb-16">
           <div className="bg-white dark:bg-surface-dark p-2 rounded-[1.5rem] shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row gap-2">
              <div className="flex-1 relative">
                 <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">search</span>
                 <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Where are you going? (e.g. Tokyo Food Tour)" 
                    className="w-full h-14 pl-12 pr-4 bg-transparent border-none focus:ring-0 text-text-main-light dark:text-text-main-dark font-medium placeholder:opacity-50"
                 />
              </div>
              <button 
                 onClick={handleAiMatch}
                 disabled={aiMatchLoading}
                 className="h-14 px-8 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                 {aiMatchLoading ? (
                   <>
                     <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     <span>Matching...</span>
                   </>
                 ) : (
                   <>
                     <span className="material-symbols-outlined text-lg">smart_toy</span>
                     <span>AI Match</span>
                   </>
                 )}
              </button>
           </div>
           
           {/* AI Recommendation Result */}
           {aiRecommendation && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white dark:bg-[#0F172A] rounded-2xl p-6 shadow-2xl border-2 border-primary/20 animate-in fade-in slide-in-from-top-4 z-20">
                 <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                       <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <div>
                       <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-1">Top Recommendation</h4>
                       <p className="font-bold text-lg mb-2">
                          We recommend {MOCK_GUIDES.find(g => g.id === aiRecommendation.bestMatchId)?.name}
                       </p>
                       <p className="text-sm text-text-sec-light dark:text-text-sec-dark mb-4 italic">
                          "{aiRecommendation.reason}"
                       </p>
                       <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-100 dark:border-white/5">
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">Suggested Mini-Itinerary</p>
                          <div className="text-sm leading-relaxed whitespace-pre-wrap">
                            {aiRecommendation.suggestedItinerary}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           )}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredGuides.map((guide) => (
              <div 
                 key={guide.id}
                 className={`bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden border transition-all duration-300 group flex flex-col h-full ${
                    aiRecommendation?.bestMatchId === guide.id 
                    ? 'border-primary ring-4 ring-primary/10 shadow-2xl scale-[1.02]' 
                    : 'border-gray-100 dark:border-white/5 shadow-lg hover:shadow-xl hover:-translate-y-1'
                 }`}
              >
                 {/* Image Header */}
                 <div className="h-64 relative overflow-hidden">
                    <img 
                       src={guide.image} 
                       alt={guide.name} 
                       className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    {guide.verified && (
                       <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5 text-white">
                          <span className="material-symbols-outlined text-base filled">verified</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
                       </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 text-white">
                       <h3 className="text-2xl font-bold font-display">{guide.name}</h3>
                       <p className="text-sm opacity-80 flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">location_on</span>
                          {guide.location}
                       </p>
                    </div>
                 </div>

                 {/* Content */}
                 <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-4">
                       <span className="flex items-center gap-1 bg-yellow-400 text-black px-2 py-0.5 rounded-md text-xs font-bold">
                          {guide.rating} <span className="material-symbols-outlined text-[10px] filled">star</span>
                       </span>
                       <span className="text-xs text-text-sec-light dark:text-text-sec-dark font-medium">({guide.reviewCount} reviews)</span>
                    </div>

                    <p className="text-sm text-text-main-light dark:text-text-main-dark mb-4 line-clamp-2">
                       "{guide.bio}"
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                       {guide.specialties.map(tag => (
                          <span key={tag} className="px-2 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-[10px] font-bold uppercase tracking-wide text-text-sec-light">
                             {tag}
                          </span>
                       ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
                       <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">Daily Rate</p>
                          <p className="text-lg font-black text-primary">{guide.pricePerDay}</p>
                       </div>
                       <button 
                          onClick={() => handleBookGuide(guide)}
                          className="px-6 py-3 bg-text-main-light dark:bg-white text-white dark:text-black rounded-xl font-bold text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg"
                       >
                          Book Now
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {filteredGuides.length === 0 && (
           <div className="text-center py-20 opacity-40">
              <span className="material-symbols-outlined text-6xl mb-4">person_search</span>
              <h3 className="text-2xl font-bold">No guides found</h3>
              <p>Try searching for a different location or interest.</p>
           </div>
        )}

      </div>
    </section>
  );
};