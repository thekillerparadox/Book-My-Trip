
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-surface-dark pt-16 pb-8 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-black tracking-tight font-display text-text-main-light dark:text-text-main-dark">
                Book<span className="text-primary">My</span>Trip
              </h2>
            </div>
            <p className="text-text-sec-light dark:text-text-sec-dark max-w-xs text-sm leading-relaxed mb-6">
              Curating personalized travel experiences based on how you feel. Explore the world, one mood at a time.
            </p>
            <div className="flex gap-4">
               {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                  <a key={social} href="#" className="size-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-text-sec-light hover:bg-primary hover:text-white transition-all">
                     <span className="material-symbols-outlined text-lg">public</span>
                  </a>
               ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-text-main-light dark:text-white">Company</h4>
            <ul className="space-y-2 text-xs text-text-sec-light dark:text-text-sec-dark font-medium">
               <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-text-main-light dark:text-white">Support</h4>
            <ul className="space-y-2 text-xs text-text-sec-light dark:text-text-sec-dark font-medium">
               <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Safety</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Cancellation</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Sitemap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4 text-text-main-light dark:text-white">Legal</h4>
            <ul className="space-y-2 text-xs text-text-sec-light dark:text-text-sec-dark font-medium">
               <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
               <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-white/5 text-center">
          <p className="text-xs text-text-sec-light dark:text-text-sec-dark font-medium opacity-60">
            © 2024 Book My Trip. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
