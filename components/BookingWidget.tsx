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
  const [infants, setInfants] = useState(0);
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
    const parts = [];
    parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const handleSearch = () => {
    if (onBook && to) {
      const newTrip: Trip = {
        id: Math.random().toString(36).substr(2, 9),
        destinationName: to,
        tripTitle: tripTitle || `${to} Getaway`, 
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1200&auto=format&fit=crop',
        dates: departDate || 'Upcoming',
        travelers: getTravelerText(),
        price: '₹24,999',
        type: activeTab,
        bookedAt: Date.now()
      };
      onBook(newTrip);
      alert(`Booking confirmed for "${newTrip.tripTitle}"! Check 'My Trips'.`);
      setTripTitle('');
      setTo('');
      setFrom('');
    } else {
      alert(`Please enter a destination to search for ${activeTab}.`);
    }
  };

  const CounterRow = ({ 
    label, 
    subLabel, 
    count, 
    onIncrement, 
    onDecrement, 
    min = 0, 
    max = 9 
  }: { 
    label: string; 
    subLabel: string; 
    count: number; 
    onIncrement: () => void; 
    onDecrement: () => void;
    min?: number;
    max?: number;
  }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
      <div className="flex flex-col">
        <span className="font-bold text-xs text-text-main-light dark:text-text-main-dark">{label}</span>
        <span className="text-[10px] text-text-sec-light dark:text-text-sec-dark">{subLabel}</span>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onDecrement(); }}
          disabled={count <= min}
          className={`size-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors ${count <= min ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary/10 hover:border-primary text-primary'}`}
        >
          <span className="material-symbols-outlined text-sm">remove</span>
        </button>
        <span className="font-bold text-xs w-4 text-center">{count}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onIncrement(); }}
          disabled={count >= max}
          className={`size-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors ${count >= max ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary/10 hover:border-primary text-primary'}`}
        >
          <span className="material-symbols-outlined text-sm">add</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[1100px] px-0">
      <div className="bg-white dark:bg-surface-dark rounded-3xl shadow-2xl p-5 md:p-6 border border-gray-100 dark:border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-white/5 mb-5 pb-2">
          <div className="flex gap-6 overflow-x-auto hide-scrollbar w-full md:w-auto">
            {BOOKING_TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex items-center gap-1.5 pb-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.type
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined text-lg ${activeTab === tab.type ? 'filled' : ''}`}>{tab.icon}</span>
                <span className="font-bold text-[11px] uppercase tracking-wider">{tab.type}</span>
              </button>
            ))}
          </div>

          {activeTab === BookingType.FLIGHTS && (
            <div className="flex bg-gray-50 dark:bg-background-dark p-1 rounded-full mb-2 md:mb-0">
              <button 
                onClick={() => setIsRoundTrip(true)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${isRoundTrip ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-text-sec-light'}`}
              >
                Round Trip
              </button>
              <button 
                onClick={() => setIsRoundTrip(false)}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${!isRoundTrip ? 'bg-white dark:bg-surface-dark shadow-sm text-primary' : 'text-text-sec-light'}`}
              >
                One Way
              </button>
            </div>
          )}
        </div>

        {/* Improved Grid: Use 2 columns on mobile instead of 1 to save vertical space */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-3 items-end">
          {/* Trip Name Input */}
          <div className="col-span-2 md:col-span-12 flex flex-col gap-1 mb-1">
             <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">Trip Name <span className="text-primary opacity-60">(Optional)</span></label>
             <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 group-focus-within:text-primary transition-colors text-lg">edit</span>
                <input
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-sm font-semibold placeholder:text-text-sec-light/30 outline-none transition-all"
                  placeholder="e.g., Anniversary Trip..."
                  type="text"
                />
             </div>
          </div>

          {activeTab === BookingType.FLIGHTS ? (
            <>
              <div className="col-span-2 md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">From</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 group-focus-within:text-primary transition-colors text-lg">flight_takeoff</span>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-sm font-semibold placeholder:text-text-sec-light/30 outline-none transition-all"
                    placeholder="Origin"
                    type="text"
                  />
                  <button 
                    onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                    className="absolute -right-2.5 top-1/2 -translate-y-1/2 size-6 bg-white dark:bg-surface-dark border border-gray-100 dark:border-white/10 rounded-full flex items-center justify-center z-10 hover:bg-primary hover:text-white transition-colors shadow-sm hidden md:flex"
                  >
                    <span className="material-symbols-outlined text-sm">sync_alt</span>
                  </button>
                </div>
              </div>

              <div className="col-span-2 md:col-span-3 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">To</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 group-focus-within:text-primary text-lg">flight_land</span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-sm font-semibold placeholder:text-text-sec-light/30 outline-none transition-all"
                    placeholder="Destination"
                    type="text"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">Departure</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 text-lg">calendar_today</span>
                  <input
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-[11px] font-bold outline-none"
                    type="date"
                  />
                </div>
              </div>

              <div className={`col-span-1 md:col-span-2 flex flex-col gap-1 transition-opacity ${!isRoundTrip ? 'opacity-30' : 'opacity-100'}`}>
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">Return</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 text-lg">event_repeat</span>
                  <input
                    disabled={!isRoundTrip}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-[11px] font-bold outline-none"
                    type="date"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-span-2 md:col-span-6 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">Location</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 group-focus-within:text-primary text-lg">location_on</span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-sm font-semibold placeholder:text-text-sec-light/30 outline-none transition-all"
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    type="text"
                  />
                </div>
              </div>

              <div className="col-span-2 md:col-span-4 flex flex-col gap-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">Dates</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 text-lg">date_range</span>
                  <input
                    className="w-full h-11 pl-10 pr-4 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent focus:border-primary/30 focus:ring-0 text-sm font-semibold placeholder:text-text-sec-light/30 outline-none"
                    placeholder="Select dates"
                    type="text"
                  />
                </div>
              </div>
            </>
          )}

          <div className="col-span-2 md:col-span-2 flex flex-col gap-1 relative" ref={pickerRef}>
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-sec-light/60 ml-1">Travelers</label>
            <div 
              onClick={() => setShowTravelerPicker(!showTravelerPicker)}
              className="relative h-11 pl-10 pr-3 bg-gray-50 dark:bg-background-dark rounded-xl border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center cursor-pointer"
            >
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-sec-light/40 text-lg">group</span>
              <span className="text-text-main-light dark:text-text-main-dark font-semibold text-xs truncate">
                {getTravelerText()}
              </span>
            </div>

            {showTravelerPicker && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 p-4 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                <h4 className="font-bold text-[11px] uppercase tracking-wider mb-3 opacity-40">Passengers</h4>
                <CounterRow 
                  label="Adults" 
                  subLabel="12+ yrs" 
                  count={adults} 
                  min={1}
                  onIncrement={() => setAdults(a => Math.min(9, a + 1))}
                  onDecrement={() => setAdults(a => Math.max(1, a - 1))}
                />
                <CounterRow 
                  label="Children" 
                  subLabel="2–12 yrs" 
                  count={children} 
                  onIncrement={() => setChildren(c => Math.min(9, c + 1))}
                  onDecrement={() => setChildren(c => Math.max(0, c - 1))}
                />
                <div className="mt-3">
                   <button 
                     onClick={() => setShowTravelerPicker(false)}
                     className="w-full py-2 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-primary/90 transition-all"
                   >
                     Done
                   </button>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-2 md:col-span-12 mt-1">
            <button 
              onClick={handleSearch}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] group"
            >
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
              <span className="text-xs uppercase tracking-widest">Explore {activeTab}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};