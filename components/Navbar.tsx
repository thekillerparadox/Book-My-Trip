import React, { useState } from 'react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (view: AppView) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-[#f5f2f0] dark:border-[#3e362e]">
      <div className="px-6 md:px-10 py-4 flex items-center justify-between max-w-[1440px] mx-auto">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNav('home')}
        >
          <div className="size-8 text-primary flex items-center justify-center transition-transform group-hover:rotate-12">
            <span className="material-symbols-outlined text-3xl">travel_explore</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Book My Trip</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end items-center gap-8">
          <nav className="flex items-center gap-8">
            <button 
              onClick={() => handleNav('home')}
              className={`text-sm font-semibold transition-colors ${currentView === 'home' ? 'text-primary' : 'hover:text-primary'}`}
            >
              Destinations
            </button>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Deals</a>
            <button 
              onClick={() => handleNav('trips')}
              className={`text-sm font-semibold transition-colors ${currentView === 'trips' ? 'text-primary' : 'hover:text-primary'}`}
            >
              My Trips
            </button>
          </nav>
          <button className="bg-primary hover:bg-primary/90 text-white dark:text-background-dark text-sm font-bold px-6 py-2.5 rounded-full transition-colors shadow-lg shadow-primary/20">
            Sign In
          </button>
        </div>
        <button 
          className="md:hidden text-text-main-light dark:text-text-main-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface-light dark:bg-surface-dark border-b border-[#f5f2f0] dark:border-[#3e362e] p-4 flex flex-col gap-4 shadow-lg animate-in slide-in-from-top duration-200">
            <button 
              onClick={() => handleNav('home')}
              className={`text-sm font-semibold p-2 text-left ${currentView === 'home' ? 'text-primary' : ''}`}
            >
              Destinations
            </button>
            <a className="text-sm font-semibold hover:text-primary transition-colors p-2" href="#">Deals</a>
            <button 
              onClick={() => handleNav('trips')}
              className={`text-sm font-semibold p-2 text-left ${currentView === 'trips' ? 'text-primary' : ''}`}
            >
              My Trips
            </button>
            <button className="bg-primary hover:bg-primary/90 text-white dark:text-background-dark text-sm font-bold px-6 py-2.5 rounded-full transition-colors w-full">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
};