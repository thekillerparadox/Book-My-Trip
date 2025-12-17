import React, { useState } from 'react';
import { BOOKING_TABS } from '../constants';
import { BookingType } from '../types';

export const BookingWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<BookingType>(BookingType.FLIGHTS);

  return (
    <div className="relative z-20 w-full max-w-[1080px] px-4 -mt-24 md:-mt-32 mb-16">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 md:p-8 border border-white/20 dark:border-white/5 backdrop-blur-sm">
        {/* Tabs */}
        <div className="flex gap-8 border-b border-[#e6e0db] dark:border-[#3e362e] mb-6 overflow-x-auto hide-scrollbar">
          {BOOKING_TABS.map((tab) => (
            <button
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`flex items-center gap-2 pb-3 border-b-4 transition-all whitespace-nowrap ${
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

        {/* Form Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Destination */}
          <div className="md:col-span-4 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-sec-light dark:text-text-sec-dark">
              Destination
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                location_on
              </span>
              <input
                className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-lg border-none focus:ring-2 focus:ring-primary text-text-main-light dark:text-text-main-dark font-medium placeholder:text-text-sec-light/70 outline-none"
                placeholder="Where do you want to go?"
                type="text"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-sec-light dark:text-text-sec-dark">
              Check-in / Out
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                calendar_month
              </span>
              <input
                className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-lg border-none focus:ring-2 focus:ring-primary text-text-main-light dark:text-text-main-dark font-medium placeholder:text-text-sec-light/70 outline-none"
                placeholder="Add dates"
                type="text"
              />
            </div>
          </div>

          {/* Travelers */}
          <div className="md:col-span-3 flex flex-col gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text-sec-light dark:text-text-sec-dark">
              Travelers
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-sec-light">
                group
              </span>
              <input
                className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-background-dark rounded-lg border-none focus:ring-2 focus:ring-primary text-text-main-light dark:text-text-main-dark font-medium placeholder:text-text-sec-light/70 outline-none"
                placeholder="2 Guests"
                type="text"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button className="w-full h-14 bg-primary hover:bg-primary/90 text-white dark:text-background-dark font-bold rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95">
              <span className="material-symbols-outlined">search</span>
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};