import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Destinations', view: 'home' as AppView, icon: 'public' },
    { label: 'Flights', view: 'home' as AppView, icon: 'flight' },
    { label: 'My Trips', view: 'trips' as AppView, icon: 'luggage' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
          isScrolled || mobileMenuOpen
            ? 'bg-white/90 dark:bg-[#0A0C10]/90 backdrop-blur-md border-gray-200/50 dark:border-white/5 py-3 shadow-sm'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setView('home')}
          >
            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-2xl">travel_explore</span>
            </div>
            <span className={`text-lg font-bold tracking-tight font-display transition-colors ${isScrolled || mobileMenuOpen ? 'text-text-main-light dark:text-text-main-dark' : 'text-white'}`}>
              Book<span className="text-primary">My</span>Trip
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-md transition-all ${
             isScrolled 
             ? 'bg-gray-100/50 dark:bg-white/5 border-gray-200/50 dark:border-white/5' 
             : 'bg-white/10 border-white/10'
          }`}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => setView(link.view)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentView === link.view && (link.view !== 'home' || link.label === 'Destinations')
                    ? 'bg-white dark:bg-white/10 text-primary shadow-sm'
                    : isScrolled 
                      ? 'text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-text-main-dark' 
                      : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className={`flex items-center rounded-full transition-all duration-300 overflow-hidden ${
                searchOpen 
                ? 'w-48 sm:w-64 pl-4 pr-1 bg-white/10 backdrop-blur-md border border-white/10' 
                : 'w-10 bg-transparent'
            }`}>
               <input 
                 type="text" 
                 placeholder="Search places..." 
                 className={`bg-transparent border-none text-sm w-full focus:ring-0 px-0 placeholder:text-text-sec-light dark:placeholder:text-text-sec-dark/50 ${
                    isScrolled ? 'text-text-main-light dark:text-text-main-dark' : 'text-white placeholder:text-white/50'
                 } ${searchOpen ? 'opacity-100' : 'opacity-0'}`}
               />
               <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className={`size-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
                    isScrolled 
                    ? 'hover:bg-gray-100 dark:hover:bg-white/10 text-text-sec-light dark:text-text-sec-dark' 
                    : 'hover:bg-white/10 text-white'
                }`}
               >
                 <span className="material-symbols-outlined">search</span>
               </button>
            </div>

            <div className={`h-6 w-px hidden md:block ${isScrolled ? 'bg-gray-200 dark:bg-white/10' : 'bg-white/20'}`}></div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button className={`text-sm font-bold px-2 transition-colors ${
                  isScrolled 
                  ? 'text-text-sec-light dark:text-text-sec-dark hover:text-primary' 
                  : 'text-white/90 hover:text-white'
              }`}>
                Log In
              </button>
              <button className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-105 transition-all active:scale-95">
                Sign Up
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden size-10 flex items-center justify-center rounded-full transition-colors ${
                  isScrolled || mobileMenuOpen
                  ? 'bg-gray-100 dark:bg-white/5 text-text-main-light dark:text-text-main-dark'
                  : 'bg-white/10 text-white backdrop-blur-md'
              }`}
            >
              <span className="material-symbols-outlined">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-white dark:bg-[#0A0C10] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) pt-24 px-6 flex flex-col gap-6 ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col gap-2">
           {navLinks.map(link => (
             <button
               key={link.label}
               onClick={() => { setView(link.view); setMobileMenuOpen(false); }}
               className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 active:scale-98 transition-transform"
             >
                <div className="size-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center text-primary shadow-sm">
                   <span className="material-symbols-outlined text-xl">{link.icon}</span>
                </div>
                <span className="text-lg font-bold tracking-tight">{link.label}</span>
                <span className="material-symbols-outlined ml-auto opacity-30">chevron_right</span>
             </button>
           ))}
        </div>
        
        <div className="mt-auto pb-10 flex flex-col gap-4">
           <button className="w-full py-4 rounded-xl border border-gray-200 dark:border-white/10 font-bold text-text-main-light dark:text-text-main-dark hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
             Log In
           </button>
           <button className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
             Create Free Account
           </button>
           <p className="text-center text-xs text-text-sec-light dark:text-text-sec-dark mt-2">
              By joining, you agree to our Terms of Service.
           </p>
        </div>
      </div>
    </>
  );
};