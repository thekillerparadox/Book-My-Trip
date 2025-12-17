import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-light dark:bg-surface-dark pt-16 pb-8 border-t border-[#f5f2f0] dark:border-[#3e362e]">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-3xl">travel_explore</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">Book My Trip</h2>
            </div>
            <p className="text-text-sec-light dark:text-text-sec-dark max-w-xs mb-6">
              Curating personalized travel experiences based on how you feel. Explore the world, one
              mood at a time.
            </p>
            <div className="flex gap-4">
              <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
              <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined">alternate_email</span>
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg">Company</h4>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              About Us
            </a>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Careers
            </a>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Blog
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg">Support</h4>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Contact Us
            </a>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              FAQs
            </a>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Privacy Policy
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-lg">Work With Us</h4>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Partner with us
            </a>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Travel Agents
            </a>
            <a className="text-text-sec-light hover:text-primary transition-colors" href="#">
              Affiliates
            </a>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#e6e0db] dark:border-[#3e362e]">
          <p className="text-sm text-text-sec-light dark:text-text-sec-dark">
            © 2024 Book My Trip. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="text-sm text-text-sec-light hover:text-primary transition-colors" href="#">
              Terms
            </a>
            <a className="text-sm text-text-sec-light hover:text-primary transition-colors" href="#">
              Privacy
            </a>
            <a className="text-sm text-text-sec-light hover:text-primary transition-colors" href="#">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};