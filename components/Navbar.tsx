import React, { useState, useEffect, useRef } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleNav = (view: AppView) => {
    setView(view);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-[100] w-full bg-surface-light/80 dark:bg-surface-dark/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5">
      <div className="px-6 md:px-8 py-3 flex items-center justify-between max-w-[1440px] mx-auto">
        
        {/* Logo Section */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          onClick={() => handleNav('home')}
        >
          <div className="size-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white shadow-sm">
            <span className="material-symbols-outlined text-2xl font-bold">travel_explore</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight font-display hidden sm:block">
            Book<span className="text-primary">My</span>Trip
          </h1>
        </div>

        {/* Desktop Main Navigation */}
        <nav className="hidden lg:flex items-center gap-1 mx-8">
          {[
            { label: 'Explore', view: 'home' as AppView, icon: 'explore' },
            { label: 'Flights', view: 'home' as AppView, icon: 'flight' },
            { label: 'Hotels', view: 'home' as AppView, icon: 'hotel' },
            { label: 'Deals', view: 'home' as AppView, icon: 'local_offer' },
            { label: 'My Trips', view: 'trips' as AppView, icon: 'luggage' }
          ].map((item) => (
            <button 
              key={item.label}
              onClick={() => handleNav(item.view)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all relative group ${
                currentView === item.view && item.label === (currentView === 'home' ? 'Explore' : 'My Trips')
                  ? 'text-primary bg-primary/5' 
                  : 'text-text-sec-light dark:text-text-sec-dark hover:text-primary hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${currentView === item.view && item.label === (currentView === 'home' ? 'Explore' : 'My Trips') ? 'filled' : ''}`}>
                {item.icon}
              </span>
              {item.label}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full transition-all duration-300 ${
                currentView === item.view && item.label === (currentView === 'home' ? 'Explore' : 'My Trips') ? 'opacity-100' : 'opacity-0 scale-0 group-hover:opacity-40'
              }`} />
            </button>
          ))}
        </nav>

        {/* Right Actions Section */}
        <div className="flex items-center gap-3 lg:gap-5 justify-end flex-1 lg:flex-none">
          
          {/* Search Bar - Interactive */}
          <div className={`relative flex items-center transition-all duration-300 hidden md:flex ${searchExpanded ? 'w-64' : 'w-10'}`}>
            <button 
              onClick={() => setSearchExpanded(!searchExpanded)}
              className={`size-10 rounded-full flex items-center justify-center transition-colors ${searchExpanded ? 'text-primary' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-text-sec-light'}`}
            >
              <span className="material-symbols-outlined text-2xl">search</span>
            </button>
            <input 
              type="text"
              placeholder="Search destinations..."
              className={`absolute left-0 pl-10 pr-4 py-2 bg-gray-100 dark:bg-white/5 border-none rounded-full text-sm focus:ring-1 focus:ring-primary w-full transition-opacity duration-300 ${searchExpanded ? 'opacity-100 z-[-1]' : 'opacity-0 pointer-events-none'}`}
              onBlur={() => !searchExpanded && setSearchExpanded(false)}
            />
          </div>

          <div className="h-6 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>

          {/* Utils: Wishlist & Currency */}
          <div className="hidden sm:flex items-center gap-1">
            <button className="size-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-text-sec-light dark:text-text-sec-dark flex items-center justify-center transition-colors group">
              <span className="material-symbols-outlined text-2xl group-hover:text-red-500 transition-colors">favorite</span>
            </button>
            <button className="px-3 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-xs font-bold text-text-sec-light dark:text-text-sec-dark flex items-center gap-1.5 transition-colors">
              <span className="material-symbols-outlined text-lg">language</span>
              EN / INR
            </button>
          </div>

          {/* User Profile / Menu Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 pl-3 bg-white dark:bg-surface-dark border border-gray-200 dark:border-white/10 rounded-full hover:shadow-md transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-text-sec-light">menu</span>
              <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs shadow-sm">
                JD
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-64 bg-white dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-white/5 py-3 z-[110] animate-in fade-in slide-in-from-top-2">
                <div className="px-5 py-3 border-b border-gray-50 dark:border-white/5">
                  <p className="text-xs font-bold text-text-sec-light/60 uppercase tracking-widest mb-1">Welcome back</p>
                  <p className="font-bold text-sm">John Doe</p>
                </div>
                <div className="py-2">
                  <button onClick={() => handleNav('trips')} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">account_circle</span> Profile Settings
                  </button>
                  <button onClick={() => handleNav('trips')} className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">luggage</span> My Bookings
                  </button>
                  <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">wallet</span> Wallet
                  </button>
                  <button className="w-full flex items-center gap-3 px-5 py-2.5 text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">help</span> Help Center
                  </button>
                </div>
                <div className="pt-2 border-t border-gray-50 dark:border-white/5 px-5">
                   <button className="w-full py-2.5 text-sm font-bold text-red-500 hover:text-red-600 text-left transition-colors">
                     Sign Out
                   </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            className="lg:hidden size-10 rounded-full bg-gray-100 dark:bg-white/5 text-text-main-light dark:text-text-main-dark flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'grid_view'}</span>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-surface-light dark:bg-surface-dark border-b border-gray-100 dark:border-white/5 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-300 z-[90]">
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Explore', view: 'home' as AppView, icon: 'explore' },
                 { label: 'Flights', view: 'home' as AppView, icon: 'flight' },
                 { label: 'Hotels', view: 'home' as AppView, icon: 'hotel' },
                 { label: 'Deals', view: 'home' as AppView, icon: 'local_offer' },
                 { label: 'Trips', view: 'trips' as AppView, icon: 'luggage' },
                 { label: 'Support', view: 'home' as AppView, icon: 'help' }
               ].map(item => (
                 <button 
                  key={item.label}
                  onClick={() => handleNav(item.view)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border ${
                    currentView === item.view && item.label === (currentView === 'home' ? 'Explore' : 'Trips')
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-gray-100 dark:border-white/5 text-text-sec-light dark:text-text-sec-dark'
                  }`}
                 >
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                    <span className="text-xs font-bold">{item.label}</span>
                 </button>
               ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
               <div className="flex items-center justify-between px-2">
                  <span className="text-sm font-bold">Region & Currency</span>
                  <button className="text-sm font-bold text-primary">English / INR</button>
               </div>
               <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold transition-all shadow-lg shadow-primary/20">
                Sign In
               </button>
            </div>
        </div>
      )}
    </header>
  );
};