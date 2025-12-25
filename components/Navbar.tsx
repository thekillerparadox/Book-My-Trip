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
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  const navLinks: NavItem[] = [
    { label: 'Tour Guides', view: 'guides', icon: 'person_pin_circle' },
    { label: 'My Trips', view: 'trips', icon: 'luggage' },
  ];

  const handleNavClick = (link: NavItem) => {
    setMobileMenuOpen(false);
    
    if (currentView !== link.view) {
      setView(link.view);
      if (link.sectionId) {
        setTimeout(() => {
          const element = document.getElementById(link.sectionId!);
          if (element) {
            const offset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
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
      if (link.sectionId) {
        const element = document.getElementById(link.sectionId);
        if (element) {
          const offset = 80;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
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
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${
          isScrolled || mobileMenuOpen
            ? 'bg-white/95 dark:bg-[#0A0C10]/95 backdrop-blur-md border-gray-200/50 dark:border-white/5 py-4 shadow-sm'
            : 'bg-transparent border-transparent py-5 md:py-8'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between gap-6">
          {/* Logo */}
          <div
            className="flex items-center gap-4 cursor-pointer group select-none flex-shrink-0"
            onClick={() => handleNavClick({ label: 'Home', view: 'home', icon: 'home', sectionId: 'flights' })}
          >
            {/* Minimal Vector Compass Logo with Continuous Animation */}
            <div className="relative size-10 md:size-11 flex items-center justify-center">
               <svg 
                 viewBox="0 0 24 24" 
                 fill="none" 
                 xmlns="http://www.w3.org/2000/svg" 
                 className={`w-full h-full transition-colors duration-300 ${isScrolled || mobileMenuOpen ? 'text-primary' : 'text-white'}`}
               >
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" className="opacity-30" />
                  <path 
                    d="M12 4L14 12L12 20L10 12L12 4Z" 
                    fill="currentColor" 
                    className="origin-center animate-compass-spin" 
                  />
                  <circle cx="12" cy="12" r="1" fill="currentColor" className="text-white dark:text-black" />
               </svg>
            </div>
            
            <div className="flex flex-col leading-none justify-center gap-0.5">
               <span className={`text-xl md:text-2xl font-black tracking-tighter font-display transition-colors ${isScrolled || mobileMenuOpen ? 'text-text-main-light dark:text-text-main-dark' : 'text-white shadow-black/20 drop-shadow-md'}`}>
                  Book<span className="text-primary">My</span>Trip
               </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className={`hidden lg:flex items-center gap-2 p-1.5 rounded-full border backdrop-blur-xl transition-all duration-300 ${
             isScrolled 
             ? 'bg-gray-100/80 dark:bg-white/5 border-gray-200/50 dark:border-white/10 shadow-inner' 
             : 'bg-black/20 border-white/10 shadow-lg'
          }`}>
            {navLinks.map((link) => {
              const isActive = currentView === link.view && (!link.sectionId || (link.sectionId === 'flights' && window.scrollY < 500));
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`relative px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 overflow-hidden group ${
                    isActive
                      ? 'bg-white dark:bg-gray-800 text-primary shadow-sm scale-100'
                      : isScrolled 
                        ? 'text-text-sec-light dark:text-text-sec-dark hover:text-text-main-light dark:hover:text-text-main-dark hover:bg-white/50 dark:hover:bg-white/5' 
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:scale-110 ${isActive ? 'filled' : ''}`}>
                    {link.icon}
                  </span>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-in fade-in zoom-in"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
            {/* Expandable Search */}
            <div className={`flex items-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                searchOpen 
                ? 'w-48 md:w-64 pl-4 pr-1 bg-gray-100 dark:bg-white/10 border border-transparent dark:border-white/10' 
                : 'w-10 bg-transparent'
            } ${!isScrolled && !searchOpen ? 'hover:bg-white/10' : ''}`}>
               <input 
                 type="text" 
                 placeholder="Search..." 
                 className={`bg-transparent border-none text-xs w-full focus:ring-0 px-0 placeholder:text-text-sec-light dark:placeholder:text-text-sec-dark/50 ${
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
                 <span className="material-symbols-outlined text-[22px]">search</span>
               </button>
            </div>

            <div className={`h-6 w-px hidden md:block ${isScrolled ? 'bg-gray-200 dark:bg-white/10' : 'bg-white/20'}`}></div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <button className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 ${
                  isScrolled 
                  ? 'text-text-sec-light dark:text-text-sec-dark hover:text-primary hover:bg-primary/5' 
                  : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}>
                Log In
              </button>
              <button className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 group">
                <span>Sign Up</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden size-12 flex items-center justify-center rounded-full transition-all active:scale-90 ${
                  isScrolled || mobileMenuOpen
                  ? 'bg-gray-100 dark:bg-white/10 text-text-main-light dark:text-text-main-dark hover:bg-gray-200 dark:hover:bg-white/20'
                  : 'bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
              }`}
            >
              <span className="material-symbols-outlined text-[26px] transition-transform duration-300" style={{ transform: mobileMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-white/95 dark:bg-[#0A0C10]/95 backdrop-blur-2xl transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col lg:hidden ${
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex-1 flex flex-col justify-center px-6 md:px-12 gap-6 pt-20">
           {navLinks.map((link, idx) => (
             <button
               key={link.label}
               onClick={() => handleNavClick(link)}
               className={`flex items-center gap-6 p-4 rounded-3xl transition-all group ${
                 mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
               } hover:bg-gray-50 dark:hover:bg-white/5 active:scale-[0.98]`}
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
             <button className="w-full py-4 rounded-2xl bg-primary text-white font-bold text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
               <span>Create Free Account</span>
               <span className="material-symbols-outlined text-xl">person_add</span>
             </button>
             <button className="w-full py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 font-bold text-base text-text-main-light dark:text-text-main-dark hover:bg-white dark:hover:bg-white/5 active:scale-95 transition-all">
               Log In
             </button>
           </div>
        </div>
      </div>
    </>
  );
};