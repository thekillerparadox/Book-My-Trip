import React, { useState, useRef, useEffect } from 'react';
import { BOOKING_TABS } from '../constants';
import { BookingType, Trip } from '../types';

interface BookingWidgetProps {
  onBook?: (trip: Trip) => void;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ onBook }) => {
  const [activeTab, setActiveTab] = useState<BookingType>(BookingType.FLIGHTS);
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  
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
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=1200&auto=format&fit=crop',
        dates: departDate || 'Upcoming',
        travelers: getTravelerText(),
        price: '₹24,999',
        type: activeTab,
        bookedAt: Date.now()
      };
      onBook(newTrip);
      alert(`Booking confirmed for your ${activeTab} to ${to}! Check 'My Trips'.`);
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
    <div className="flex items-center justify-between py-3 border-b border-[#e6e0db]/50 dark:border-[#3e362e]/50 last:border-0">
      <div className="flex flex-col">
        <span className="font-bold text-sm text-text-main-light dark:text-text-main-dark">{label}</span>
        <span className="text-xs text-text-sec-light dark:text-text-sec-dark">{subLabel}</span>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={(e) => { e.stopPropagation(); onDecrement(); }}
          disabled={count <= min}
          className={`size-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors ${count <= min ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary/10 hover:border-primary text-primary'}`}
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="font-bold text-sm w-4 text-center">{count}</span>
        <button 
          onClick={(e) => { e.stopPropagation(); onIncrement(); }}
          disabled={count >= max}
          className={`size-8 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-colors ${count >= max ? 'opacity-30 cursor-not-allowed' : 'hover:bg-primary/10 hover:border-primary text-primary'}`}
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative z-20 w-full max-w-[1140px] px-4 -mt-24 md:-mt-32 mb-16">
      <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-white/5 backdrop-blur-md">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-[#e6e0db] dark:border-[#3e362e] mb-8 pb-1">
          <div className="flex gap-8 overflow-x-auto hide-scrollbar w-full md:w-auto">
            {BOOKING_TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => setActiveTab(tab.type)}
                className={`flex items-center gap-2 pb-4 border-b-4 transition-all whitespace-nowrap ${
                  activeTab === tab.type
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-sec-light dark:text-text-sec-dark hover:text-primary dark:hover:text-primary'
                }`}
              >
                <span className={`material-symbols-outlined ${activeTab === tab.type ? 'filled' : ''}`}>{tab.icon}</span>
                <span className="font-bold text-sm">{tab.type}</span>
              </button>
            ))}
          </div>

          {activeTab === BookingType.FLIGHTS && (
            <div className="flex bg-background-light dark:bg-background-dark p-1 rounded-full mb-4 md:mb-0">
              <button 
                onClick={() => setIsRoundTrip(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isRoundTrip ? 'bg-primary text-white shadow-md' : 'text-text-sec-light'}`}
              >
                Round Trip
              </button>
              <button 
                onClick={() => setIsRoundTrip(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isRoundTrip ? 'bg-primary text-white shadow-md' : 'text-text-sec-light'}`}
              >
                One Way
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
          {activeTab === BookingType.FLIGHTS ? (
            <>
              <div className="md:col-span-3 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
                  From
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary transition-colors">
                    flight_takeoff
                  </span>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-xl border border-transparent focus:border-primary focus:ring-0 text-text-main-light dark:text-text-main-dark font-semibold placeholder:text-text-sec-light/50 transition-all outline-none"
                    placeholder="Origin City"
                    type="text"
                  />
                  <button 
                    onClick={() => { const temp = from; setFrom(to); setTo(temp); }}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 size-7 bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center z-10 hover:bg-primary hover:text-white transition-colors shadow-sm hidden md:flex"
                  >
                    <span className="material-symbols-outlined text-sm">sync_alt</span>
                  </button>
                </div>
              </div>

              <div className="md:col-span-3 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
                  To
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary">
                    flight_land
                  </span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-xl border border-transparent focus:border-primary focus:ring-0 text-text-main-light dark:text-text-main-dark font-semibold placeholder:text-text-sec-light/50 transition-all outline-none"
                    placeholder="Destination"
                    type="text"
                  />
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
                  Departure
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                    calendar_today
                  </span>
                  <input
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-xl border border-transparent focus:border-primary focus:ring-0 text-text-main-light dark:text-text-main-dark font-semibold placeholder:text-text-sec-light/50 outline-none"
                    type="date"
                  />
                </div>
              </div>

              <div className={`md:col-span-2 flex flex-col gap-2 transition-opacity ${!isRoundTrip ? 'opacity-30' : 'opacity-100'}`}>
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
                  Return
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                    event_repeat
                  </span>
                  <input
                    disabled={!isRoundTrip}
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-xl border border-transparent focus:border-primary focus:ring-0 text-text-main-light dark:text-text-main-dark font-semibold placeholder:text-text-sec-light/50 outline-none"
                    type="date"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="md:col-span-6 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
                  Destination
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light group-focus-within:text-primary transition-colors">
                    location_on
                  </span>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-xl border border-transparent focus:border-primary focus:ring-0 text-text-main-light dark:text-text-main-dark font-semibold placeholder:text-text-sec-light/50 transition-all outline-none"
                    placeholder={`Where are you looking for ${activeTab.toLowerCase()}?`}
                    type="text"
                  />
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col gap-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
                  Dates
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                    date_range
                  </span>
                  <input
                    className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-xl border border-transparent focus:border-primary focus:ring-0 text-text-main-light dark:text-text-main-dark font-semibold placeholder:text-text-sec-light/50 outline-none"
                    placeholder="Select dates"
                    type="text"
                  />
                </div>
              </div>
            </>
          )}

          <div className="md:col-span-2 flex flex-col gap-2 relative" ref={pickerRef}>
            <label className="text-[10px] font-extrabold uppercase tracking-widest text-text-sec-light dark:text-text-sec-dark ml-1">
              Travelers
            </label>
            <div 
              onClick={() => setShowTravelerPicker(!showTravelerPicker)}
              className="relative h-14 pl-11 pr-3 bg-background-light dark:bg-background-dark rounded-xl border border-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-all flex items-center cursor-pointer overflow-hidden"
            >
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                person_add
              </span>
              <span className="text-text-main-light dark:text-text-main-dark font-semibold text-sm truncate">
                {getTravelerText()}
              </span>
            </div>

            {showTravelerPicker && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 p-5 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                <h4 className="font-bold text-sm mb-4">Who's traveling?</h4>
                <CounterRow 
                  label="Adults" 
                  subLabel="12+ years" 
                  count={adults} 
                  min={1}
                  onIncrement={() => setAdults(a => Math.min(9, a + 1))}
                  onDecrement={() => setAdults(a => Math.max(1, a - 1))}
                />
                <CounterRow 
                  label="Children" 
                  subLabel="2–12 years" 
                  count={children} 
                  onIncrement={() => setChildren(c => Math.min(9, c + 1))}
                  onDecrement={() => setChildren(c => Math.max(0, c - 1))}
                />
                <CounterRow 
                  label="Infants" 
                  subLabel="Under 2 years" 
                  count={infants} 
                  onIncrement={() => setInfants(i => Math.min(5, i + 1))}
                  onDecrement={() => setInfants(i => Math.max(0, i - 1))}
                />
                <div className="mt-4 pt-4 border-t border-[#e6e0db]/50 dark:border-[#3e362e]/50">
                   <button 
                     onClick={() => setShowTravelerPicker(false)}
                     className="w-full py-2.5 bg-primary text-white dark:text-background-dark rounded-lg font-bold text-xs hover:bg-primary/90 transition-colors"
                   >
                     Apply Selection
                   </button>
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-12 mt-4">
            <button 
              onClick={handleSearch}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white dark:text-background-dark font-black rounded-xl shadow-xl shadow-primary/25 flex items-center justify-center gap-3 transition-all active:scale-[0.98] group"
            >
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">search</span>
              <span className="uppercase tracking-widest">Search & Book {activeTab}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};