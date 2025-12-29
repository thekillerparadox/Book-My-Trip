
import React, { useState, useRef } from 'react';
import { REVIEWS } from '../constants';
import { Review } from '../types';

const INITIAL_GALLERY_ITEMS = [
  { id: 'g1', image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200', title: 'Swiss Alps Morning', location: 'Switzerland', user: 'Alex D.', avatar: 'https://i.pravatar.cc/150?u=alex', likes: 245 },
  { id: 'g2', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', title: 'Yosemite Valley', location: 'USA', user: 'Sarah J.', avatar: 'https://i.pravatar.cc/150?u=sarah', likes: 189 },
  { id: 'g3', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200', title: 'Road to Nowhere', location: 'Iceland', user: 'Mike T.', avatar: 'https://i.pravatar.cc/150?u=mike', likes: 312 },
  { id: 'g4', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200', title: 'Foggy Forest', location: 'Canada', user: 'Emma W.', avatar: 'https://i.pravatar.cc/150?u=emma', likes: 156 },
  { id: 'g5', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200', title: 'Lake Louise', location: 'Banff', user: 'Chris B.', avatar: 'https://i.pravatar.cc/150?u=chris', likes: 420 },
  { id: 'g6', image: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1200', title: 'Autumn Colors', location: 'Kyoto', user: 'Yuki M.', avatar: 'https://i.pravatar.cc/150?u=yuki', likes: 278 },
  { id: 'g7', image: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1200', title: 'Alpine Lake', location: 'Italy', user: 'Marco P.', avatar: 'https://i.pravatar.cc/150?u=marco', likes: 199 },
  { id: 'g8', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200', title: 'Starry Night', location: 'Chile', user: 'Sofia L.', avatar: 'https://i.pravatar.cc/150?u=sofia', likes: 543 },
  { id: 'g9', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?q=80&w=1200', title: 'Great Wall', location: 'China', user: 'Wei C.', avatar: 'https://i.pravatar.cc/150?u=wei', likes: 890 },
];

const EXTRA_GALLERY_ITEMS = [
  { id: 'g10', image: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1200', title: 'Venice Canals', location: 'Italy', user: 'Julia R.', avatar: 'https://i.pravatar.cc/150?u=julia', likes: 412 },
  { id: 'g11', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200', title: 'Dubai Skyline', location: 'UAE', user: 'Ahmed K.', avatar: 'https://i.pravatar.cc/150?u=ahmed', likes: 895 },
  { id: 'g12', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200', title: 'Maldives Blue', location: 'Maldives', user: 'Sara W.', avatar: 'https://i.pravatar.cc/150?u=sara', likes: 673 },
  { id: 'g13', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1200', title: 'Tokyo Nights', location: 'Japan', user: 'Kenji T.', avatar: 'https://i.pravatar.cc/150?u=kenji', likes: 556 },
  { id: 'g14', image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1200', title: 'Sydney Harbor', location: 'Australia', user: 'Liam O.', avatar: 'https://i.pravatar.cc/150?u=liam', likes: 334 },
  { id: 'g15', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200', title: 'Jaipur Palace', location: 'India', user: 'Riya S.', avatar: 'https://i.pravatar.cc/150?u=riya', likes: 789 },
  { id: 'g16', image: 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?q=80&w=1200', title: 'Prague Old Town', location: 'Czech Republic', user: 'Erik S.', avatar: 'https://i.pravatar.cc/150?u=erik', likes: 521 },
  { id: 'g17', image: 'https://images.unsplash.com/photo-1532408840135-cbf9660e3d78?q=80&w=1200', title: 'Petra Treasury', location: 'Jordan', user: 'Layla H.', avatar: 'https://i.pravatar.cc/150?u=layla', likes: 645 },
  { id: 'g18', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200', title: 'Machu Picchu', location: 'Peru', user: 'Carlos M.', avatar: 'https://i.pravatar.cc/150?u=carlos', likes: 892 },
  { id: 'g19', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=1200', title: 'Barcelona Streets', location: 'Spain', user: 'Maria G.', avatar: 'https://i.pravatar.cc/150?u=maria', likes: 433 },
  { id: 'g20', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?q=80&w=1200', title: 'Reykjavik Church', location: 'Iceland', user: 'Bjorn K.', avatar: 'https://i.pravatar.cc/150?u=bjorn', likes: 376 },
  { id: 'g21', image: 'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?q=80&w=1200', title: 'Bora Bora Resort', location: 'French Polynesia', user: 'Sophie L.', avatar: 'https://i.pravatar.cc/150?u=sophie', likes: 988 },
];

export const ReviewsSection: React.FC = () => {
  const [viewMode, setViewMode] = useState<'gallery' | 'reviews'>('gallery');
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'verified'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeVideo, setActiveVideo] = useState<Review | null>(null);
  const [selectedGalleryItem, setSelectedGalleryItem] = useState<typeof INITIAL_GALLERY_ITEMS[0] | null>(null);
  const [galleryItems, setGalleryItems] = useState(INITIAL_GALLERY_ITEMS);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Upload Form State
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReviews = REVIEWS.filter(r => {
    if (activeFilter === 'video') return !!r.thumbnail;
    if (activeFilter === 'verified') return r.isVerified;
    return true;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviewImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (previewImage && location && title) {
      const newItem = {
        id: `new-${Date.now()}`,
        image: previewImage,
        title: title,
        location: location,
        user: 'You', // Placeholder for current user
        avatar: 'https://i.pravatar.cc/150?u=me',
        likes: 0
      };
      setGalleryItems([newItem, ...galleryItems]);
      setShowUploadModal(false);
      // Reset form
      setPreviewImage(null);
      setLocation('');
      setTitle('');
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate network delay for effect
    setTimeout(() => {
        const itemsToAdd = EXTRA_GALLERY_ITEMS.slice(loadedCount, loadedCount + 6);
        if (itemsToAdd.length > 0) {
            setGalleryItems(prev => [...prev, ...itemsToAdd]);
            setLoadedCount(prev => prev + 6);
        }
        setIsLoadingMore(false);
    }, 1500);
  };

  const hasMoreItems = loadedCount < EXTRA_GALLERY_ITEMS.length;

  return (
    <section className="w-full max-w-[1200px] px-6 py-10">
      {/* Header with Stats & Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-2xl filled">photo_camera</span>
             </div>
             <h2 className="text-3xl font-bold tracking-tight font-display">Travel Gallery</h2>
          </div>
          <p className="text-text-sec-light dark:text-text-sec-dark max-w-2xl text-base opacity-80 leading-relaxed">
            Share your journey with the world. Upload your favorite moments and inspire others to explore.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
           {/* View Toggle */}
           <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('gallery')} 
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'gallery' ? 'bg-white dark:bg-surface-dark shadow-md text-primary' : 'text-text-sec-light opacity-60 hover:opacity-100'}`}
              >
                Gallery
              </button>
              <button 
                onClick={() => setViewMode('reviews')} 
                className={`px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${viewMode === 'reviews' ? 'bg-white dark:bg-surface-dark shadow-md text-primary' : 'text-text-sec-light opacity-60 hover:opacity-100'}`}
              >
                Reviews
              </button>
           </div>

           <button 
             onClick={() => setShowUploadModal(true)}
             className="px-6 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 h-full"
           >
             <span className="material-symbols-outlined text-lg">add_a_photo</span>
             Upload Moment
           </button>
        </div>
      </div>

      {viewMode === 'reviews' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          {/* Gallery Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedGalleryItem(item)}
                className="break-inside-avoid relative group rounded-[1.5rem] overflow-hidden cursor-pointer bg-gray-100 dark:bg-white/5 animate-in zoom-in-50 duration-500"
              >
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="absolute bottom-4 left-4 right-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100 text-white">
                   <div className="flex items-center gap-2 mb-2">
                      <img src={item.avatar} className="size-6 rounded-full border border-white/50" alt={item.user} />
                      <p className="text-xs font-bold">{item.user}</p>
                   </div>
                   <div className="flex justify-between items-end">
                      <div>
                        <h4 className="font-bold font-display text-lg leading-none">{item.title}</h4>
                        <p className="text-[10px] opacity-80 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          {item.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <span className="material-symbols-outlined text-sm filled">favorite</span>
                        {item.likes}
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
             <button 
               onClick={handleLoadMore}
               disabled={isLoadingMore || !hasMoreItems}
               className={`group relative px-8 py-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary hover:bg-primary/5 transition-all text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 mx-auto overflow-hidden ${!hasMoreItems ? 'opacity-50 cursor-not-allowed' : ''}`}
             >
                <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {isLoadingMore ? (
                    <>
                        <span className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                        <span className="text-primary">Loading Moments...</span>
                    </>
                ) : hasMoreItems ? (
                    <>
                        <span className="relative z-10 group-hover:text-primary transition-colors">Load More Moments</span>
                        <span className="material-symbols-outlined text-lg relative z-10 group-hover:translate-y-0.5 transition-transform group-hover:text-primary">expand_more</span>
                    </>
                ) : (
                    <span className="relative z-10">No More Moments</span>
                )}
             </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setShowUploadModal(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 p-8 animate-in zoom-in-95 duration-300">
              <button onClick={() => setShowUploadModal(false)} className="absolute top-6 right-6 size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5">
                 <span className="material-symbols-outlined">close</span>
              </button>
              
              <h3 className="text-xl font-bold font-display mb-2">Share Your Experience</h3>
              <p className="text-xs opacity-60 mb-6">Inspire others with your travel moments.</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                 {/* Image Upload Area */}
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full h-40 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative active:scale-[0.99] ${
                      previewImage 
                      ? 'border-primary/50' 
                      : 'border-gray-200 dark:border-white/10 hover:border-primary/50 hover:bg-primary/5'
                    }`}
                  >
                    {previewImage ? (
                      <img src={previewImage} alt="Upload Preview" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-3xl opacity-40 mb-2">add_photo_alternate</span>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Click to upload photo</p>
                      </>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                 </div>

                 <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Title</label>
                    <input 
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="E.g. Sunset in Santorini"
                      className="w-full h-11 px-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                 </div>

                 <div>
                    <label className="text-[9px] font-bold uppercase tracking-widest opacity-40 mb-2 block ml-1">Location</label>
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="E.g. Oia, Greece"
                      className="w-full h-11 px-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-primary outline-none transition-all"
                      required
                    />
                 </div>

                 <button 
                    type="submit"
                    disabled={!previewImage || !title || !location}
                    className="w-full h-12 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    Post to Gallery
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Video Player Overlay (For Reviews Tab) */}
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
              </div>
           </div>
        </div>
      )}

      {/* Gallery Lightbox */}
      {selectedGalleryItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300 bg-black/95">
           <button onClick={() => setSelectedGalleryItem(null)} className="absolute top-10 right-10 z-[210] size-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined text-2xl">close</span>
           </button>
           
           <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
              <div className="flex-1 relative bg-black flex items-center justify-center">
                 <img src={selectedGalleryItem.image} className="max-w-full max-h-[80vh] object-contain" alt={selectedGalleryItem.title} />
              </div>
              <div className="w-full md:w-80 bg-white dark:bg-surface-dark p-8 flex flex-col border-l border-white/10">
                 <div className="flex items-center gap-3 mb-6">
                    <img src={selectedGalleryItem.avatar} className="size-10 rounded-full" alt={selectedGalleryItem.user} />
                    <div>
                       <h4 className="font-bold text-sm">{selectedGalleryItem.user}</h4>
                       <p className="text-[10px] opacity-60">Posted recently</p>
                    </div>
                 </div>
                 
                 <h2 className="text-2xl font-bold font-display mb-1">{selectedGalleryItem.title}</h2>
                 <p className="text-sm opacity-60 flex items-center gap-1 mb-6">
                    <span className="material-symbols-outlined text-base">location_on</span>
                    {selectedGalleryItem.location}
                 </p>

                 <div className="flex gap-4 mb-8">
                    <div className="flex items-center gap-1.5">
                       <span className="material-symbols-outlined text-red-500 filled">favorite</span>
                       <span className="text-xs font-bold">{selectedGalleryItem.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <span className="material-symbols-outlined text-text-sec-light">share</span>
                       <span className="text-xs font-bold">Share</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </section>
  );
};
