
import React, { useState, useRef, useEffect } from 'react';
import { BOOKING_TABS } from '../constants';
import { BookingType, Trip } from '../types';

interface BookingWidgetProps {
  onBook?: (trip: Trip) => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ onBook }) => {
  const [activeTab, setActiveTab] = useState<BookingType>(BookingType.FLIGHTS);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  
  const [tripTitle, setTripTitle] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [showTravelerPicker, setShowTravelerPicker] = useState(false);
  
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowTravelerPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTravelerText = () => {
    return `${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}`;
  };

  const handleSearch = () => {
    if (onBook && to) {
      const newTrip: Trip = {
        id: Math.random().toString(36).substr(2, 9),
        destinationName: to,
        tripTitle: tripTitle || `${to} Adventure`, 
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1200&auto=format&fit=crop',
        dates: departDate || 'Flexible Dates',
        travelers: getTravelerText(),
        price: '₹24,999',
        type: activeTab,
        bookedAt: Date.now()
      };
      onBook(newTrip);
      alert(`Booking initiated for "${newTrip.tripTitle}"! Check 'My Trips'.`);
      setTripTitle('');
      setTo('');
      setFrom('');
    } else {
      alert(`Please enter a destination to search for ${activeTab}.`);
    }
  };

  return (
    <div className="w-full max-w-[1100px] px-0 mx-auto">
      <div className="bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-xl rounded-[2rem] shadow-2xl p-6 border border-white/20 dark:border-white/10">
        
        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-full sm:w-auto">
            {BOOKING_TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab.type
                    ? 'bg-white dark:bg-surface-dark text-primary shadow-md'
                    : 'text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${activeTab === tab.type ? 'filled' : ''}`}>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.type}</span>
              </button>
            ))}
          </div>

          {activeTab === BookingType.FLIGHTS && (
            <div className="flex gap-4 text-xs font-bold text-text-sec-light dark:text-text-sec-dark">
               <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <input type="radio" checked={isRoundTrip} onChange={() => setIsRoundTrip(true)} className="text-primary focus:ring-primary" />
                  Round Trip
               </label>
               <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <input type="radio" checked={!isRoundTrip} onChange={() => setIsRoundTrip(false)} className="text-primary focus:ring-primary" />
                  One Way
               </label>
            </div>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Trip Name (Optional) */}
          <div className="md:col-span-12">
             <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary transition-colors">edit</span>
                <input
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-semibold placeholder:text-text-sec-light/50 transition-all"
                  placeholder="Give your trip a name (e.g. Summer Honeymoon)"
                  type="text"
                />
             </div>
          </div>

          {activeTab === BookingType.FLIGHTS ? (
            <>
              {/* From */}
              <div className="md:col-span-3 relative group">
                 <label className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light absolute left-4 top-2">From</label>
                 <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full h-[60px] pt-6 pb-2 pl-10 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold placeholder:text-text-sec-light/50"
                    placeholder="Origin"
                    type="text"
                 />
                 <span className="material-symbols-outlined absolute left-3 top-8 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary text-lg">flight_takeoff</span>
                 
                 {/* Swap Button (Desktop only) */}
                 <button 
                    onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 size-8 rounded-full bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 shadow-md flex items-center justify-center text-primary hover:scale-110 transition-transform hidden md:flex"
                 >
                    <span className="material-symbols-outlined text-sm">swap_horiz</span>
                 </button>
              </div>

              {/* To */}
              <div className="md:col-span-3 relative group">
                 <label className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light absolute left-4 top-2">To</label>
                 <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-[60px] pt-6 pb-2 pl-10 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold placeholder:text-text-sec-light/50"
                    placeholder="Destination"
                    type="text"
                 />
                 <span className="material-symbols-outlined absolute left-3 top-8 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary text-lg">flight_land</span>
              </div>

              {/* Dates */}
              <div className="md:col-span-2 relative">
                 <label className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light absolute left-4 top-2">Depart</label>
                 <input
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full h-[60px] pt-6 pb-2 pl-4 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-xs font-bold"
                    type="date"
                 />
              </div>
              <div className={`md:col-span-2 relative ${!isRoundTrip ? 'opacity-50 pointer-events-none' : ''}`}>
                 <label className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light absolute left-4 top-2">Return</label>
                 <input
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full h-[60px] pt-6 pb-2 pl-4 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-xs font-bold"
                    type="date"
                    disabled={!isRoundTrip}
                 />
              </div>
            </>
          ) : (
            // Hotels / Activities Inputs
            <>
               <div className="md:col-span-6 relative group">
                 <label className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light absolute left-4 top-2">Location</label>
                 <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-[60px] pt-6 pb-2 pl-10 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold placeholder:text-text-sec-light/50"
                    placeholder={`Where to for ${activeTab.toLowerCase()}?`}
                    type="text"
                 />
                 <span className="material-symbols-outlined absolute left-3 top-8 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary text-lg">location_on</span>
               </div>
               <div className="md:col-span-4 relative group">
                 <label className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light absolute left-4 top-2">When</label>
                 <input
                    type="text"
                    placeholder="Add dates"
                    className="w-full h-[60px] pt-6 pb-2 pl-10 pr-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none focus:ring-2 focus:ring-primary/50 text-sm font-bold placeholder:text-text-sec-light/50"
                 />
                 <span className="material-symbols-outlined absolute left-3 top-8 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary text-lg">calendar_month</span>
               </div>
            </>
          )}

          {/* Travelers / Search Button Combined for better mobile layout */}
          <div className="md:col-span-2 relative" ref={pickerRef}>
             <button 
               onClick={() => setShowTravelerPicker(!showTravelerPicker)}
               className="w-full h-[60px] bg-gray-50 dark:bg-white/5 rounded-2xl flex flex-col justify-center px-4 text-left hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
             >
                <span className="text-[9px] font-bold uppercase tracking-widest text-text-sec-light">Travelers</span>
                <div className="flex items-center gap-1 overflow-hidden">
                   <span className="text-xs font-bold truncate">{getTravelerText()}</span>
                   <span className="material-symbols-outlined text-sm opacity-50">expand_more</span>
                </div>
             </button>

             {showTravelerPicker && (
               <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 p-4 z-50 animate-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-bold">Adults</span>
                     <div className="flex items-center gap-3">
                        <button onClick={() => setAdults(Math.max(1, adults - 1))} className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                        <span className="font-bold w-4 text-center">{adults}</span>
                        <button onClick={() => setAdults(adults + 1)} className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-sm font-bold">Children</span>
                     <div className="flex items-center gap-3">
                        <button onClick={() => setChildren(Math.max(0, children - 1))} className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">remove</span></button>
                        <span className="font-bold w-4 text-center">{children}</span>
                        <button onClick={() => setChildren(children + 1)} className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><span className="material-symbols-outlined text-sm">add</span></button>
                     </div>
                  </div>
               </div>
             )}
          </div>

          <div className="md:col-span-12 mt-2">
             <button 
               onClick={handleSearch}
               className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                <span className="material-symbols-outlined text-xl">search</span>
                Search {activeTab}
             </button>
          </div>

        </div>
      </div>
    </div>
  );
};
