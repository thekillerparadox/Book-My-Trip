import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section className="w-full px-4 mb-20">
      <div className="max-w-[1200px] mx-auto bg-primary rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden">
        {/* Abstract pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-white text-3xl md:text-4xl font-black mb-4">
            Don't miss the next adventure
          </h2>
          <p className="text-white/90 font-medium">
            Get exclusive deals and mood-based travel inspiration delivered to your inbox.
          </p>
        </div>
        <div className="relative z-10 w-full max-w-md">
          <div className="flex bg-white p-2 rounded-full shadow-lg">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-transparent border-none focus:ring-0 text-text-main-light placeholder:text-gray-400 px-4 outline-none"
            />
            <button className="bg-black text-white px-6 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};