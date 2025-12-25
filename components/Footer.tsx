import React from 'react';

const SOCIAL_LINKS = [
  { 
    name: 'Instagram', 
    handle: '@bookmytrip', 
    url: '#', 
    iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' 
  },
  { 
    name: 'Twitter', 
    handle: '@bookmytrip_ai', 
    url: '#', 
    iconPath: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z' 
  },
  { 
    name: 'Facebook', 
    handle: 'Book My Trip Official', 
    url: '#', 
    iconPath: 'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z' 
  },
  { 
    name: 'LinkedIn', 
    handle: 'Book My Trip', 
    url: '#', 
    iconPath: 'M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z' 
  }
];

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-light dark:bg-surface-dark pt-12 pb-8 border-t border-[#f5f2f0] dark:border-[#3e362e]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-8 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">travel_explore</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight font-display">Book My Trip</h2>
            </div>
            <p className="text-text-sec-light dark:text-text-sec-dark max-w-xs mb-6 text-sm leading-relaxed">
              Curating personalized travel experiences based on how you feel. Explore the world, one
              mood at a time.
            </p>
            
            {/* Social Media Links */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-3 opacity-60">Follow Us</h4>
              <div className="flex flex-col gap-3">
                {SOCIAL_LINKS.map(link => (
                  <a 
                    href={link.url} 
                    key={link.name} 
                    className="flex items-center gap-3 text-text-sec-light dark:text-text-sec-dark hover:text-primary dark:hover:text-primary transition-all group w-fit"
                  >
                    <div className="size-8 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <svg className="size-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path d={link.iconPath} />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold">{link.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm mb-1">Company</h4>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">About Us</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Careers</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Blog</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Press</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm mb-1">Support</h4>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Contact Us</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">FAQs</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Sitemap</a>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm mb-1">Work With Us</h4>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Partner with us</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Travel Agents</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Affiliates</a>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
               <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Contact</p>
               <a href="mailto:hello@bookmytrip.com" className="text-xs font-medium hover:text-primary transition-colors block mb-1">hello@bookmytrip.com</a>
               <a href="tel:+15550192834" className="text-xs font-medium hover:text-primary transition-colors block">+1 (555) 019-2834</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-[#e6e0db] dark:border-[#3e362e]">
          <p className="text-xs text-text-sec-light dark:text-text-sec-dark font-medium">
            © 2024 Book My Trip. All rights reserved.
          </p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Terms</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="text-xs text-text-sec-light hover:text-primary transition-colors" href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};