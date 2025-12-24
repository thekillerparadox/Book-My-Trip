import React, { useState } from 'react';
import { REVIEWS } from '../constants';
import { Review } from '../types';

export const ReviewsSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'verified'>('all');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'text' | 'video'>('text');
  const [activeVideo, setActiveVideo] = useState<Review | null>(null);

  const filteredReviews = REVIEWS.filter(r => {
    if (activeFilter === 'video') return !!r.thumbnail;
    if (activeFilter === 'verified') return r.isVerified;
    return true;
  });

  return (
    <section className="w-full max-w-[1200px] px-6 py-10">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl filled">reviews</span>
             </div>
             <h2 className="text-3xl font-bold tracking-tight font-display">Traveler Insights</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-2xl text-base opacity-80 leading-relaxed">
            Real stories, verified stays, and AI-curated experiences. Discover the world through the eyes of our community.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner self-start">
           <div className="flex flex-col px-4 border-r border-gray-200 dark:border-white/10">
              <span className="text-lg font-bold font-display">4.9</span>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Avg Rating</span>
           </div>
           <button 
             onClick={() => setShowFeedbackModal(true)}
             className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
           >
             Share Your Experience
           </button>
        </div>
      </div>

      {/* Video Stories Row (Instagram Style) */}
      <div className="mb-10">
         <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-4">Featured Video Stories</h4>
         <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-2 px-2">
            {REVIEWS.filter(r => r.thumbnail).map((r) => (
              <button 
                key={r.id}
                onClick={() => setActiveVideo(r)}
                className="flex-shrink-0 group relative w-28 md:w-36 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all shadow-md active:scale-95"
              >
                <img src={r.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={r.user} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                   <span className="material-symbols-outlined text-3xl filled">play_circle</span>
                </div>
                <div className="absolute bottom-3 left-3 text-left">
                   <p className="text-[9px] font-bold text-white truncate w-20">{r.user}</p>
                   <p className="text-[7px] text-white/60 font-medium">{r.trip}</p>
                </div>
              </button>
            ))}
            {/* CTA to record video feedback */}
            <button 
              onClick={() => { setFeedbackType('video'); setShowFeedbackModal(true); }}
              className="flex-shrink-0 w-28 md:w-36 aspect-[9/16] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-white/5 hover:bg-primary/5 hover:border-primary/40 transition-all group"
            >
               <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-xl">video_call</span>
               </div>
               <span className="text-[8px] font-bold uppercase tracking-widest text-center px-2 opacity-60 group-hover:opacity-100">Add Video Review</span>
            </button>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-6 mb-8 border-b border-gray-100 dark:border-white/5 overflow-x-auto hide-scrollbar">
         {[
           { id: 'all', label: 'All Reviews', icon: 'sort' },
           { id: 'video', label: 'With Video', icon: 'videocam' },
           { id: 'verified', label: 'Verified Stays', icon: 'verified' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveFilter(tab.id as any)}
             className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-all whitespace-nowrap text-[10px] font-bold uppercase tracking-widest ${
               activeFilter === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-sec-light opacity-50 hover:opacity-100'
             }`}
           >
             <span className="material-symbols-outlined text-base">{tab.icon}</span>
             {tab.label}
           </button>
         ))}
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReviews.map((review) => (
          <div 
            key={review.id}
            className="bg-white dark:bg-surface-dark rounded-[2rem] p-6 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group relative"
          >
            {/* Header: User & Meta */}
            <div className="flex items-center justify-between mb-4">
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={review.avatar} className="size-10 rounded-xl object-cover border-2 border-primary/10 shadow-sm" alt={review.user} />
                    {review.isVerified && (
                      <div className="absolute -bottom-1 -right-1 size-4 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white dark:border-surface-dark shadow-md" title="Verified Traveler">
                        <span className="material-symbols-outlined text-[8px] font-black">check</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">{review.user}</h4>
                    <p className="text-[9px] font-bold text-primary tracking-wide uppercase">{review.travelType} Traveler</p>
                  </div>
               </div>
               <span className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{review.date}</span>
            </div>

            {/* Content: Rating & Text */}
            <div className="flex items-center gap-0.5 mb-3">
               {[...Array(5)].map((_, i) => (
                 <span key={i} className={`material-symbols-outlined text-sm ${i < review.rating ? 'text-yellow-400 filled' : 'text-gray-200'}`}>star</span>
               ))}
            </div>

            <p className="text-xs leading-relaxed text-text-sec-light dark:text-text-sec-dark font-medium italic mb-4">
              "{review.comment}"
            </p>

            {/* Travel Context Badge */}
            <div className="flex items-center gap-2 mb-6 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-lg w-fit border border-gray-100 dark:border-white/5">
               <span className="material-symbols-outlined text-sm opacity-40">location_on</span>
               <span className="text-[9px] font-bold opacity-60 tracking-tight">Visted {review.trip}</span>
            </div>

            {/* Official Response */}
            {review.response && (
              <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                 <div className="flex items-start gap-3 bg-primary/5 p-3 rounded-xl border border-primary/10">
                    <img src={review.response.responderAvatar} className="size-6 rounded-full border border-primary/20" alt="responder" />
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-0.5">
                          <h5 className="text-[9px] font-bold uppercase tracking-widest text-primary">{review.response.responderName}</h5>
                          <span className="text-[7px] font-bold uppercase opacity-40">{review.response.responderTitle}</span>
                       </div>
                       <p className="text-[10px] leading-relaxed opacity-80">{review.response.message}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Interactions Footer */}
            <div className="pt-4 mt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
               <button className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-widest text-text-sec-light hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-sm">thumb_up</span>
                  Helpful ({review.helpfulCount})
               </button>
               <button className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light opacity-30 hover:opacity-100 transition-all">
                  Report
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal logic logic omitted as changes are identical to InternationalGateway logic style for brevity, just ensuring container wrapper is correct */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowFeedbackModal(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 p-8 animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowFeedbackModal(false)} className="absolute top-6 right-6 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                 <span className="material-symbols-outlined">close</span>
              </button>
              
              <h3 className="text-xl font-bold font-display mb-2">Share Your Story</h3>
              <p className="text-xs opacity-60 mb-6">How was your recent booking experience with us?</p>
              
              <div className="flex gap-3 mb-6">
                 <button 
                  onClick={() => setFeedbackType('text')}
                  className={`flex-1 py-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${feedbackType === 'text' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/5 opacity-50 hover:opacity-100'}`}
                 >
                    <span className="material-symbols-outlined">description</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Write Review</span>
                 </button>
                 <button 
                  onClick={() => setFeedbackType('video')}
                  className={`flex-1 py-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all ${feedbackType === 'video' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/5 opacity-50 hover:opacity-100'}`}
                 >
                    <span className="material-symbols-outlined">videocam</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest">Video Review</span>
                 </button>
              </div>

              <div className="space-y-5">
                 <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2 block">Overall Rating</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button key={star} className="size-9 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-white transition-all text-yellow-400">
                            <span className="material-symbols-outlined text-lg">star</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {feedbackType === 'text' ? (
                   <div>
                      <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2 block">Review Details</label>
                      <textarea 
                        className="w-full h-28 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Tell us about your trip..."
                      />
                   </div>
                 ) : (
                   <div className="py-10 border-2 border-dashed border-primary/20 rounded-[2rem] bg-primary/5 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:bg-primary/10 transition-all">
                      <div className="size-14 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                         <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold">Record or Upload Video</p>
                        <p className="text-[9px] opacity-60">MP4, MOV up to 100MB (Max 30s)</p>
                      </div>
                   </div>
                 )}

                 <button className="w-full h-12 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                    Submit Feedback
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Video Player Overlay - No changes needed to logic */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-300 bg-black/95">
           <button onClick={() => setActiveVideo(null)} className="absolute top-10 right-10 z-[210] size-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined text-2xl">close</span>
           </button>
           
           <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img src={activeVideo.thumbnail} className="w-full h-full object-cover blur-sm opacity-50" alt="bg" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                 <div className="size-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-1 font-display">{activeVideo.user}'s Journey</h4>
                 <p className="text-xs text-white/60 mb-6 italic">"A truly spiritual experience in {activeVideo.trip}..."</p>
                 
                 <div className="mt-auto w-full">
                    <div className="h-1 w-full bg-white/20 rounded-full mb-3">
                       <div className="h-full w-1/3 bg-primary rounded-full relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 bg-white rounded-full shadow-lg"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between text-white/40 text-[9px] font-bold uppercase tracking-widest">
                       <span>0:12</span>
                       <span>0:30</span>
                    </div>
                 </div>
              </div>
              
              <div className="absolute bottom-12 left-6 right-6 flex items-center gap-3 bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
                 <img src={activeVideo.avatar} className="size-8 rounded-xl object-cover" alt="user" />
                 <div className="flex-1">
                    <p className="text-white text-[10px] font-bold">{activeVideo.user}</p>
                    <p className="text-white/60 text-[9px] font-medium">{activeVideo.trip}</p>
                 </div>
                 <button className="size-7 rounded-lg bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">add</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};