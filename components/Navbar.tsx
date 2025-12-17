import React, { useState } from 'react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-light/90 dark:bg-surface-dark/90 backdrop-blur-md border-b border-[#f5f2f0] dark:border-[#3e362e]">
      <div className="px-6 md:px-10 py-4 flex items-center justify-between max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="size-8 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">travel_explore</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">Book My Trip</h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end items-center gap-8">
          <nav className="flex items-center gap-8">
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Destinations</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Deals</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">My Trips</a>
          </nav>
          <button className="bg-primary hover:bg-primary/90 text-white dark:text-background-dark text-sm font-bold px-6 py-2.5 rounded-full transition-colors">
            Sign In
          </button>
        </div>
        <button 
          className="md:hidden text-text-main-light dark:text-text-main-dark"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface-light dark:bg-surface-dark border-b border-[#f5f2f0] dark:border-[#3e362e] p-4 flex flex-col gap-4 shadow-lg">
           <a className="text-sm font-semibold hover:text-primary transition-colors p-2" href="#">Destinations</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors p-2" href="#">Deals</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors p-2" href="#">My Trips</a>
            <button className="bg-primary hover:bg-primary/90 text-white dark:text-background-dark text-sm font-bold px-6 py-2.5 rounded-full transition-colors w-full">
            Sign In
          </button>
        </div>
      )}
    </header>
  );
};