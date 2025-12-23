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
    <section className="w-full max-w-[1200px] px-6 py-16">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
             <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl filled">reviews</span>
             </div>
             <h2 className="text-4xl font-bold tracking-tight font-display">Traveler Insights</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-2xl text-lg opacity-80 leading-relaxed">
            Real stories, verified stays, and AI-curated experiences. Discover the world through the eyes of our community.
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner self-start">
           <div className="flex flex-col px-4 border-r border-gray-200 dark:border-white/10">
              <span className="text-xl font-bold font-display">4.9</span>
              <span className="text-[9px] font-bold uppercase tracking-widest opacity-40">Avg Rating</span>
           </div>
           <button 
             onClick={() => setShowFeedbackModal(true)}
             className="px-8 py-3 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
           >
             Share Your Experience
           </button>
        </div>
      </div>

      {/* Video Stories Row (Instagram Style) */}
      <div className="mb-16">
         <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-6">Featured Video Stories</h4>
         <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-4 -mx-2 px-2">
            {REVIEWS.filter(r => r.thumbnail).map((r) => (
              <button 
                key={r.id}
                onClick={() => setActiveVideo(r)}
                className="flex-shrink-0 group relative w-32 md:w-40 aspect-[9/16] rounded-2xl overflow-hidden border-2 border-primary/20 hover:border-primary transition-all shadow-md active:scale-95"
              >
                <img src={r.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={r.user} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                   <span className="material-symbols-outlined text-white text-4xl filled">play_circle</span>
                </div>
                <div className="absolute bottom-3 left-3 text-left">
                   <p className="text-[10px] font-bold text-white truncate w-24">{r.user}</p>
                   <p className="text-[8px] text-white/60 font-medium">{r.trip}</p>
                </div>
              </button>
            ))}
            {/* CTA to record video feedback */}
            <button 
              onClick={() => { setFeedbackType('video'); setShowFeedbackModal(true); }}
              className="flex-shrink-0 w-32 md:w-40 aspect-[9/16] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center gap-3 bg-gray-50/50 dark:bg-white/5 hover:bg-primary/5 hover:border-primary/40 transition-all group"
            >
               <div className="size-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">video_call</span>
               </div>
               <span className="text-[9px] font-bold uppercase tracking-widest text-center px-4 opacity-60 group-hover:opacity-100">Add Video Review</span>
            </button>
         </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-6 mb-10 border-b border-gray-100 dark:border-white/5 overflow-x-auto hide-scrollbar">
         {[
           { id: 'all', label: 'All Reviews', icon: 'sort' },
           { id: 'video', label: 'With Video', icon: 'videocam' },
           { id: 'verified', label: 'Verified Stays', icon: 'verified' }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveFilter(tab.id as any)}
             className={`flex items-center gap-2 pb-4 px-2 border-b-2 transition-all whitespace-nowrap text-xs font-bold uppercase tracking-widest ${
               activeFilter === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-sec-light opacity-50 hover:opacity-100'
             }`}
           >
             <span className="material-symbols-outlined text-sm">{tab.icon}</span>
             {tab.label}
           </button>
         ))}
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredReviews.map((review) => (
          <div 
            key={review.id}
            className="bg-white dark:bg-surface-dark rounded-[2rem] p-8 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group relative"
          >
            {/* Header: User & Meta */}
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={review.avatar} className="size-12 rounded-2xl object-cover border-2 border-primary/10 shadow-sm" alt={review.user} />
                    {review.isVerified && (
                      <div className="absolute -bottom-1 -right-1 size-5 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white dark:border-surface-dark shadow-md" title="Verified Traveler">
                        <span className="material-symbols-outlined text-[10px] font-black">check</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{review.user}</h4>
                    <p className="text-[10px] font-bold text-primary tracking-wide uppercase">{review.travelType} Traveler</p>
                  </div>
               </div>
               <span className="text-[10px] font-bold opacity-30 uppercase tracking-widest">{review.date}</span>
            </div>

            {/* Content: Rating & Text */}
            <div className="flex items-center gap-0.5 mb-4">
               {[...Array(5)].map((_, i) => (
                 <span key={i} className={`material-symbols-outlined text-base ${i < review.rating ? 'text-yellow-400 filled' : 'text-gray-200'}`}>star</span>
               ))}
            </div>

            <p className="text-sm leading-relaxed text-text-sec-light dark:text-text-sec-dark font-medium italic mb-6">
              "{review.comment}"
            </p>

            {/* Travel Context Badge */}
            <div className="flex items-center gap-2 mb-8 bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl w-fit border border-gray-100 dark:border-white/5">
               <span className="material-symbols-outlined text-base opacity-40">location_on</span>
               <span className="text-[10px] font-bold opacity-60 tracking-tight">Visted {review.trip}</span>
            </div>

            {/* Official Response */}
            {review.response && (
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                 <div className="flex items-start gap-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
                    <img src={review.response.responderAvatar} className="size-8 rounded-full border border-primary/20" alt="responder" />
                    <div className="flex-1">
                       <div className="flex items-center justify-between mb-1">
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary">{review.response.responderName}</h5>
                          <span className="text-[8px] font-bold uppercase opacity-40">{review.response.responderTitle}</span>
                       </div>
                       <p className="text-[11px] leading-relaxed opacity-80">{review.response.message}</p>
                    </div>
                 </div>
              </div>
            )}

            {/* Interactions Footer */}
            <div className="pt-6 mt-6 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
               <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-sec-light hover:text-primary transition-all">
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  Helpful ({review.helpfulCount})
               </button>
               <button className="text-[10px] font-bold uppercase tracking-widest text-text-sec-light opacity-30 hover:opacity-100 transition-all">
                  Report
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowFeedbackModal(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 p-10 animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowFeedbackModal(false)} className="absolute top-6 right-6 size-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                 <span className="material-symbols-outlined">close</span>
              </button>
              
              <h3 className="text-2xl font-bold font-display mb-2">Share Your Story</h3>
              <p className="text-sm opacity-60 mb-8">How was your recent booking experience with us?</p>
              
              <div className="flex gap-4 mb-8">
                 <button 
                  onClick={() => setFeedbackType('text')}
                  className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${feedbackType === 'text' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/5 opacity-50 hover:opacity-100'}`}
                 >
                    <span className="material-symbols-outlined">description</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Write Review</span>
                 </button>
                 <button 
                  onClick={() => setFeedbackType('video')}
                  className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${feedbackType === 'video' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-white/5 opacity-50 hover:opacity-100'}`}
                 >
                    <span className="material-symbols-outlined">videocam</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Video Review</span>
                 </button>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block">Overall Rating</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button key={star} className="size-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-white transition-all text-yellow-400">
                            <span className="material-symbols-outlined">star</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {feedbackType === 'text' ? (
                   <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-3 block">Review Details</label>
                      <textarea 
                        className="w-full h-32 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                        placeholder="Tell us about your trip..."
                      />
                   </div>
                 ) : (
                   <div className="py-12 border-2 border-dashed border-primary/20 rounded-[2rem] bg-primary/5 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-primary/10 transition-all">
                      <div className="size-16 rounded-full bg-primary text-white flex items-center justify-center animate-pulse">
                         <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Record or Upload Video</p>
                        <p className="text-[10px] opacity-60">MP4, MOV up to 100MB (Max 30s)</p>
                      </div>
                   </div>
                 )}

                 <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                    Submit Feedback
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Video Player Overlay */}
      {activeVideo && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center animate-in fade-in duration-300 bg-black/95">
           <button onClick={() => setActiveVideo(null)} className="absolute top-10 right-10 z-[210] size-14 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined text-3xl">close</span>
           </button>
           
           <div className="relative w-full max-w-sm aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl">
              <img src={activeVideo.thumbnail} className="w-full h-full object-cover blur-sm opacity-50" alt="bg" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
                 <div className="size-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-white text-5xl">play_arrow</span>
                 </div>
                 <h4 className="text-2xl font-bold text-white mb-2 font-display">{activeVideo.user}'s Journey</h4>
                 <p className="text-sm text-white/60 mb-8 italic">"A truly spiritual experience in {activeVideo.trip}..."</p>
                 
                 {/* Simulated Video Player Controls */}
                 <div className="mt-auto w-full">
                    <div className="h-1 w-full bg-white/20 rounded-full mb-4">
                       <div className="h-full w-1/3 bg-primary rounded-full relative">
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full shadow-lg"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between text-white/40 text-[10px] font-bold uppercase tracking-widest">
                       <span>0:12</span>
                       <span>0:30</span>
                    </div>
                 </div>
              </div>
              
              {/* Profile Bar in Video */}
              <div className="absolute bottom-16 left-8 right-8 flex items-center gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/10">
                 <img src={activeVideo.avatar} className="size-10 rounded-xl object-cover" alt="user" />
                 <div className="flex-1">
                    <p className="text-white text-xs font-bold">{activeVideo.user}</p>
                    <p className="text-white/60 text-[10px] font-medium">{activeVideo.trip}</p>
                 </div>
                 <button className="size-8 rounded-lg bg-primary text-white flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg">add</span>
                 </button>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};