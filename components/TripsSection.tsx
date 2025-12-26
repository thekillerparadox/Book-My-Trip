
import React, { useState } from 'react';
import { Trip } from '../types';

interface TripsSectionProps {
  trips: Trip[];
  onRemove: (id: string) => void;
  onGoHome: () => void;
}

export const TripsSection: React.FC<TripsSectionProps> = ({ trips, onRemove, onGoHome }) => {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const filteredTrips = trips.filter(trip => {
    let matchesFilter = true;
    if (filter === 'upcoming') matchesFilter = trip.status === 'upcoming' || !trip.status;
    else if (filter === 'completed') matchesFilter = trip.status === 'completed';
    else if (filter === 'cancelled') matchesFilter = trip.status === 'cancelled';
    
    const matchesSearch = trip.destinationName.toLowerCase().includes(search.toLowerCase()) || 
                          (trip.tripTitle && trip.tripTitle.toLowerCase().includes(search.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const activeTrips = trips.filter(t => t.status !== 'cancelled');
  
  const totalSpent = activeTrips.reduce((acc, trip) => {
    const price = parseInt(trip.price.replace(/[^0-9]/g, '')) || 0;
    return acc + price;
  }, 0);

  const uniqueCountries = new Set(activeTrips.map(t => t.destinationName.split(',').pop()?.trim())).size;

  const getStatusColor = (status?: string) => {
    if (status === 'completed') return 'bg-emerald-500/20 text-emerald-100 border-emerald-500/30';
    if (status === 'cancelled') return 'bg-red-500/20 text-red-100 border-red-500/30';
    return 'bg-blue-500/20 text-blue-100 border-blue-500/30';
  };

  const getStatusLabel = (status?: string) => {
    if (status === 'completed') return 'Completed';
    if (status === 'cancelled') return 'Cancelled';
    return 'Upcoming';
  };

  const getStatusIcon = (status?: string) => {
    if (status === 'completed') return 'check_circle';
    if (status === 'cancelled') return 'cancel';
    return 'hourglass_top';
  };

  return (
    <section className="w-full max-w-[1200px] px-4 md:px-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Stats Dashboard */}
      <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 font-display">My Itineraries</h1>
          <p className="text-text-sec-light dark:text-text-sec-dark text-lg opacity-80">
            Manage your bookings, track your budget, and relive your memories.
          </p>
        </div>
        
        <div className="flex gap-3 bg-white dark:bg-surface-dark p-2 rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 overflow-x-auto max-w-full">
           <div className="px-6 py-2 border-r border-gray-100 dark:border-white/5 min-w-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">Active Trips</p>
              <p className="text-2xl font-black text-primary">{activeTrips.length}</p>
           </div>
           <div className="px-6 py-2 border-r border-gray-100 dark:border-white/5 min-w-[100px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">Countries</p>
              <p className="text-2xl font-black text-primary">{uniqueCountries}</p>
           </div>
           <div className="px-6 py-2 min-w-[120px]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">Total Spend</p>
              <p className="text-2xl font-black text-primary">₹{(totalSpent / 100000).toFixed(1)}L</p>
           </div>
        </div>
      </div>

      {/* Controls: Filter & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
         <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl w-full md:w-auto overflow-x-auto hide-scrollbar">
            {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  filter === f 
                  ? 'bg-white dark:bg-gray-700 shadow-md text-primary' 
                  : 'text-text-sec-light dark:text-text-sec-dark hover:bg-gray-200 dark:hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
         </div>

         <div className="relative w-full md:w-80 group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary transition-colors">search</span>
            <input 
              type="text" 
              placeholder="Search trips..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm transition-all"
            />
         </div>
      </div>

      {/* Empty State */}
      {filteredTrips.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="size-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-5xl text-gray-400">luggage</span>
          </div>
          <h3 className="text-2xl font-bold mb-3 font-display">No trips found</h3>
          <p className="text-text-sec-light max-w-sm mb-8">
            {search || filter !== 'all' ? "Try adjusting your filters." : "Your travel stories start here. Browse our collections and book your first escape."}
          </p>
          <button 
            onClick={onGoHome}
            className="px-8 py-4 bg-primary text-white dark:text-background-dark font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform uppercase tracking-widest text-xs"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTrips.map((trip) => (
            <div 
              key={trip.id}
              className={`bg-white dark:bg-surface-dark rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 group flex flex-col relative ${trip.status === 'cancelled' ? 'opacity-70 hover:opacity-100 grayscale hover:grayscale-0' : ''}`}
            >
              {/* Image Area */}
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.destinationName} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                
                <div className="absolute top-4 left-4 flex gap-2">
                   <div className={`px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg flex items-center gap-1.5 ${getStatusColor(trip.status)}`}>
                      <span className="material-symbols-outlined text-sm filled">{getStatusIcon(trip.status)}</span>
                      <span className="text-[9px] font-black uppercase tracking-widest">{getStatusLabel(trip.status)}</span>
                   </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                   <h3 className="text-xl font-bold font-display truncate leading-tight shadow-black/50 drop-shadow-md">
                     {trip.tripTitle || trip.destinationName}
                   </h3>
                   <div className="flex items-center gap-1 opacity-90">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span className="text-xs font-medium">{trip.destinationName}</span>
                   </div>
                </div>

                <button 
                  onClick={() => onRemove(trip.id)}
                  className="absolute top-4 right-4 size-8 bg-black/20 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove trip"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light opacity-60 mb-1">Dates</p>
                      <div className="flex items-center gap-1.5">
                         <span className="material-symbols-outlined text-sm text-primary">calendar_month</span>
                         <span className="text-xs font-bold truncate">{trip.dates}</span>
                      </div>
                   </div>
                   <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light opacity-60 mb-1">Travelers</p>
                      <div className="flex items-center gap-1.5">
                         <span className="material-symbols-outlined text-sm text-primary">group</span>
                         <span className="text-xs font-bold truncate">{trip.travelers}</span>
                      </div>
                   </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <div>
                     <p className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light opacity-60">Total Cost</p>
                     <p className={`text-lg font-black ${trip.status === 'cancelled' ? 'line-through text-gray-400' : 'text-primary'}`}>{trip.price}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedTrip(trip)}
                    className="px-5 py-2.5 bg-gray-100 dark:bg-white/10 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trip Details Modal */}
      {selectedTrip && (
         <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setSelectedTrip(null)}></div>
            <div className="relative w-full max-w-2xl bg-white dark:bg-surface-dark rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
               
               <div className="h-48 md:h-64 relative">
                  <img src={selectedTrip.image} className="w-full h-full object-cover" alt={selectedTrip.destinationName} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <button onClick={() => setSelectedTrip(null)} className="absolute top-6 right-6 size-10 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-white hover:text-black transition-all flex items-center justify-center">
                     <span className="material-symbols-outlined">close</span>
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                     <div className="flex items-center gap-3 mb-2">
                        <div className={`px-3 py-1 rounded-full border backdrop-blur-md flex items-center gap-1.5 ${getStatusColor(selectedTrip.status)}`}>
                           <span className="material-symbols-outlined text-sm filled">{getStatusIcon(selectedTrip.status)}</span>
                           <span className="text-[9px] font-black uppercase tracking-widest">{getStatusLabel(selectedTrip.status)}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] font-bold uppercase tracking-widest">
                           {selectedTrip.type}
                        </span>
                     </div>
                     <h2 className="text-3xl md:text-4xl font-black font-display">{selectedTrip.tripTitle || selectedTrip.destinationName}</h2>
                     <p className="opacity-80 flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {selectedTrip.destinationName}
                     </p>
                  </div>
               </div>

               <div className="p-6 md:p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                     <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-primary mb-1">calendar_month</span>
                        <p className="text-[9px] font-bold uppercase opacity-50">Dates</p>
                        <p className="text-xs font-bold">{selectedTrip.dates}</p>
                     </div>
                     <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-primary mb-1">group</span>
                        <p className="text-[9px] font-bold uppercase opacity-50">Travelers</p>
                        <p className="text-xs font-bold">{selectedTrip.travelers}</p>
                     </div>
                     <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-primary mb-1">payments</span>
                        <p className="text-[9px] font-bold uppercase opacity-50">Cost</p>
                        <p className={`text-xs font-bold ${selectedTrip.status === 'cancelled' ? 'line-through text-red-400' : ''}`}>{selectedTrip.price}</p>
                     </div>
                     <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-primary mb-1">confirmation_number</span>
                        <p className="text-[9px] font-bold uppercase opacity-50">Ref ID</p>
                        <p className="text-xs font-bold">#{selectedTrip.id.substring(0, 6)}</p>
                     </div>
                  </div>

                  <h3 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                     <span className="material-symbols-outlined text-primary">timeline</span>
                     Itinerary Highlights
                  </h3>
                  <div className="space-y-6 relative pl-4 border-l-2 border-dashed border-gray-200 dark:border-white/10 ml-2 mb-8">
                     {[
                        { day: 'Day 1', title: 'Arrival & Check-in', desc: 'Private transfer to your hotel. Welcome dinner at sunset.' },
                        { day: 'Day 2', title: 'City Exploration', desc: 'Guided tour of historic landmarks and local markets.' },
                        { day: 'Day 3', title: 'Leisure & Adventure', desc: 'Free time for shopping or optional water sports activities.' },
                     ].map((item, i) => (
                        <div key={i} className={`relative ${selectedTrip.status === 'cancelled' ? 'opacity-50' : ''}`}>
                           <div className="absolute -left-[21px] top-0 size-3 rounded-full bg-primary ring-4 ring-white dark:ring-surface-dark"></div>
                           <h4 className="text-sm font-bold text-primary mb-1">{item.day}: {item.title}</h4>
                           <p className="text-xs text-text-sec-light dark:text-text-sec-dark leading-relaxed">{item.desc}</p>
                        </div>
                     ))}
                  </div>

                  {selectedTrip.status !== 'cancelled' ? (
                    <div className="flex gap-4">
                       <button className="flex-1 py-4 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">download</span>
                          Download Tickets
                       </button>
                       <button className="flex-1 py-4 bg-gray-100 dark:bg-white/5 text-text-main-light dark:text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined">share</span>
                          Share Trip
                       </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl flex items-center justify-center gap-2 text-red-600 dark:text-red-400">
                      <span className="material-symbols-outlined">cancel</span>
                      <span className="text-xs font-bold uppercase tracking-widest">This booking was cancelled</span>
                    </div>
                  )}
               </div>
            </div>
         </div>
      )}

    </section>
  );
};
