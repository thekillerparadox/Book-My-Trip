
import React, { useState, useRef } from 'react';
import { REVIEWS } from '../constants';
import { Review } from '../types';

const GALLERY_ITEMS = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=800', title: 'Swiss Alps', user: 'Alex', likes: 245 },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800', title: 'Yosemite', user: 'Sarah', likes: 189 },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800', title: 'Iceland', user: 'Mike', likes: 312 },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800', title: 'Canada Fog', user: 'Emma', likes: 156 },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800', title: 'Lake Louise', user: 'Chris', likes: 420 },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=800', title: 'Kyoto Autumn', user: 'Yuki', likes: 278 },
];

export const ReviewsSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'reviews'>('gallery');
  const [activeVideo, setActiveVideo] = useState<Review | null>(null);

  return (
    <section className="w-full max-w-[1200px] px-6 py-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight font-display mb-2 text-text-main-light dark:text-text-main-dark">
            Traveler Stories
          </h2>
          <p className="text-text-sec-light dark:text-text-sec-dark opacity-80 max-w-xl">
            Real moments from real travelers. Explore the world through their lens.
          </p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
           <button 
             onClick={() => setViewMode('gallery')}
             className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'gallery' ? 'bg-white dark:bg-surface-dark shadow-md text-primary' : 'text-text-sec-light opacity-60'}`}
           >
             Gallery
           </button>
           <button 
             onClick={() => setViewMode('reviews')}
             className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'reviews' ? 'bg-white dark:bg-surface-dark shadow-md text-primary' : 'text-text-sec-light opacity-60'}`}
           >
             Reviews
           </button>
        </div>
      </div>

      {viewMode === 'gallery' ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
           {GALLERY_ITEMS.map((item) => (
             <div key={item.id} className="break-inside-avoid relative group rounded-3xl overflow-hidden cursor-pointer">
                <img src={item.image} alt={item.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-6 left-6 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                   <h3 className="text-lg font-bold font-display">{item.title}</h3>
                   <p className="text-xs opacity-80">by {item.user}</p>
                </div>
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                   <span className="material-symbols-outlined text-sm filled">favorite</span> {item.likes}
                </div>
             </div>
           ))}
        </div>
      ) : (
        <div>
           {/* Video Stories */}
           <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 -mx-6 px-6 mb-8">
              {REVIEWS.filter(r => r.thumbnail).map((r) => (
                 <div key={r.id} onClick={() => setActiveVideo(r)} className="flex-shrink-0 w-32 aspect-[9/16] rounded-2xl overflow-hidden relative cursor-pointer group border-2 border-primary/20 hover:border-primary transition-colors shadow-lg">
                    <img src={r.thumbnail} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="story" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                       <span className="material-symbols-outlined text-white text-3xl opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">play_circle</span>
                    </div>
                    <p className="absolute bottom-2 left-2 text-[9px] font-bold text-white truncate w-24">{r.user}</p>
                 </div>
              ))}
           </div>

           {/* Review Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {REVIEWS.map((review) => (
                 <div key={review.id} className="bg-white dark:bg-surface-dark p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                       <img src={review.avatar} className="size-10 rounded-full object-cover" alt={review.user} />
                       <div>
                          <h4 className="text-sm font-bold">{review.user}</h4>
                          <div className="flex text-yellow-400 text-[10px]">
                             {[...Array(5)].map((_, i) => <span key={i} className={`material-symbols-outlined filled ${i < review.rating ? '' : 'text-gray-300'}`}>star</span>)}
                          </div>
                       </div>
                    </div>
                    <p className="text-xs text-text-sec-light dark:text-text-sec-dark leading-relaxed mb-4 italic">"{review.comment}"</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-text-sec-light">
                       <span>{review.trip}</span>
                       <span>{review.date}</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideo && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-300">
            <button onClick={() => setActiveVideo(null)} className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
               <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-2xl">
               <img src={activeVideo.thumbnail} className="w-full h-full object-cover opacity-50" alt="video-placeholder" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-white">play_circle</span>
               </div>
               <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h3 className="font-bold text-lg">{activeVideo.user}'s Story</h3>
                  <p className="text-sm opacity-80">{activeVideo.trip}</p>
               </div>
            </div>
         </div>
      )}
    </section>
  );
};
