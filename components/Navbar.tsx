import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

interface NavItem {
  label: string;
  view: AppView;
  icon: string;
  sectionId?: string;
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

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const navLinks: NavItem[] = [
    { label: 'Destinations', view: 'home', icon: 'public', sectionId: 'destinations' },
    { label: 'Tour Guides', view: 'guides', icon: 'person_pin_circle' },
    { label: 'Flights', view: 'home', icon: 'flight', sectionId: 'flights' },
    { label: 'My Trips', view: 'trips', icon: 'luggage' },
  ];

  const handleNavClick = (link: NavItem) => {
    setMobileMenuOpen(false);
    
    if (currentView !== link.view) {
      setView(link.view);
      // If switching view and has a section ID, wait for render then scroll
      if (link.sectionId) {
        setTimeout(() => {
          const element = document.getElementById(link.sectionId!);
          if (element) {
            const offset = 100; // Header offset
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      // Already on the view, just scroll
      if (link.sectionId) {
        const element = document.getElementById(link.sectionId);
        if (element) {
          const offset = 100;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b ${
          isScrolled || mobileMenuOpen
            ? 'bg-white/80 dark:bg-[#0A0C10]/80 backdrop-blur-xl border-gray-200/50 dark:border-white/5 py-3 shadow-sm supports-[backdrop-filter]:bg-white/60'
            : 'bg-transparent border-transparent py-5'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group select-none"
            onClick={() => handleNavClick({ label: 'Home', view: 'home', icon: 'home', sectionId: 'flights' })}
          >
            <div className="size-10 bg-gradient-to-tr from-primary to-secondary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <span className="material-symbols-outlined text-2xl">travel_explore</span>
            </div>
            <span className={`text-lg font-bold tracking-tight font-display transition-colors ${isScrolled || mobileMenuOpen ? 'text-text-main-light dark:text-text-main-dark' : 'text-white shadow-black/20 drop-shadow-md'}`}>
              Book<span className="text-primary">My</span>Trip
            </span>
          </div>

          {/* Desktop Nav - Pill Design */}
          <nav className={`hidden md:flex items-center gap-1 p-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 ${
             isScrolled 
             ? 'bg-gray-100/80 dark:bg-white/5 border-gray-200/50 dark:border-white/10 shadow-inner' 
             : 'bg-black/20 border-white/10 shadow-lg'
          }`}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`relative px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 overflow-hidden group ${
                  currentView === link.view && (!link.sectionId || (link.sectionId === 'flights' && window.scrollY < 500))
                    ? 'bg-white dark:bg-gray-800 text-primary shadow-sm'
                    : isScrolled 
                      ? 'text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-text-main-dark hover:bg-white/50 dark:hover:bg-white/5' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className={`material-symbols-outlined text-lg transition-transform group-hover:scale-110 ${currentView === link.view ? 'filled' : ''}`}>
                  {link.icon}
                </span>
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 lg:gap-4">
            {/* Expandable Search */}
            <div className={`flex items-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                searchOpen 
                ? 'w-full md:w-64 pl-4 pr-1 bg-gray-100 dark:bg-white/10 border border-transparent dark:border-white/10' 
                : 'w-10 bg-transparent'
            } ${!isScrolled && !searchOpen ? 'hover:bg-white/10' : ''}`}>
               <input 
                 type="text" 
                 placeholder="Search destinations..." 
                 className={`bg-transparent border-none text-sm w-full focus:ring-0 px-0 placeholder:text-text-sec-light dark:placeholder:text-text-sec-dark/50 ${
                    isScrolled ? 'text-text-main-light dark:text-text-main-dark' : 'text-white placeholder:text-white/70'
                 } ${searchOpen ? 'opacity-100' : 'opacity-0 w-0'} transition-opacity duration-300`}
               />
               <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className={`size-10 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${
                    isScrolled 
                    ? 'text-text-sec-light dark:text-text-sec-dark hover:bg-gray-200 dark:hover:bg-white/20' 
                    : 'text-white'
                }`}
               >
                 <span className="material-symbols-outlined">search</span>
               </button>
            </div>

            <div className={`h-6 w-px hidden md:block ${isScrolled ? 'bg-gray-200 dark:bg-white/10' : 'bg-white/20'}`}></div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button className={`text-sm font-bold px-3 py-2 rounded-lg transition-colors ${
                  isScrolled 
                  ? 'text-text-sec-light dark:text-text-sec-dark hover:text-primary hover:bg-primary/5' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}>
                Log In
              </button>
              <button className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 transition-all active:scale-95 flex items-center gap-2">
                <span>Sign Up</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden size-12 flex items-center justify-center rounded-full transition-all active:scale-95 ${
                  isScrolled || mobileMenuOpen
                  ? 'bg-gray-100 dark:bg-white/10 text-text-main-light dark:text-text-main-dark hover:bg-gray-200 dark:hover:bg-white/20'
                  : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined transition-transform duration-300" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-white/95 dark:bg-[#0A0C10]/95 backdrop-blur-xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex-1 flex flex-col justify-center px-8 gap-6 pt-20">
           {navLinks.map((link, idx) => (
             <button
               key={link.label}
               onClick={() => handleNavClick(link)}
               className={`flex items-center gap-6 p-4 rounded-3xl transition-all group ${
                 mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
               }`}
               style={{ transitionDelay: `${idx * 50}ms` }}
             >
                <div className={`size-14 rounded-2xl flex items-center justify-center shadow-lg transition-all group-hover:scale-110 ${
                  currentView === link.view
                  ? 'bg-primary text-white shadow-primary/30'
                  : 'bg-gray-100 dark:bg-white/5 text-text-sec-light dark:text-text-sec-dark group-hover:bg-white group-hover:text-primary'
                }`}>
                   <span className="material-symbols-outlined text-3xl">{link.icon}</span>
                </div>
                <div className="text-left">
                  <span className={`block text-2xl font-black tracking-tight transition-colors ${
                    currentView === link.view ? 'text-primary' : 'text-text-main-light dark:text-text-main-dark group-hover:text-primary'
                  }`}>{link.label}</span>
                  <span className="text-xs font-bold text-text-sec-light dark:text-text-sec-dark uppercase tracking-widest opacity-60">
                    {link.label === 'Destinations' ? 'Explore Trending' : link.label === 'Flights' ? 'Book Now' : 'View Section'}
                  </span>
                </div>
                <span className="material-symbols-outlined ml-auto text-2xl opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary">arrow_forward</span>
             </button>
           ))}
        </div>
        
        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 backdrop-blur-md">
           <div className="flex flex-col gap-4">
             <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-transform">
               Create Free Account
             </button>
             <button className="w-full py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 font-bold text-lg text-text-main-light dark:text-text-main-dark hover:bg-white dark:hover:bg-white/5 transition-colors">
               Log In
             </button>
           </div>
        </div>
      </div>
    </>
  );
};