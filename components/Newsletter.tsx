import React from 'react';

export const Newsletter: React.FC = () => {
  return (
    <section className="w-full px-4 mb-10">
      <div className="max-w-[1200px] mx-auto bg-primary rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left relative overflow-hidden shadow-2xl shadow-primary/30">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-xl">
          <h2 className="text-white text-2xl md:text-3xl font-bold mb-3 font-display">
            The next adventure is calling
          </h2>
          <p className="text-white/80 font-medium leading-relaxed text-sm">
            Join 50,000+ travelers. Get exclusive itineraries, travel news, and mood-based deals delivered to your inbox every week.
          </p>
        </div>
        <div className="relative z-10 w-full max-w-md">
          <form 
            onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }}
            className="flex bg-white p-1.5 rounded-2xl shadow-xl"
          >
            <input
              required
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-none focus:ring-0 text-text-main-light placeholder:text-gray-400 px-4 text-xs font-medium outline-none"
            />
            <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-md">
              Join Now
            </button>
          </form>
          <p className="text-white/40 text-[9px] mt-3 font-medium tracking-wide">
            Zero spam. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
};