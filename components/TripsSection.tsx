import React from 'react';
import { Trip } from '../types';

interface TripsSectionProps {
  trips: Trip[];
  onRemove: (id: string) => void;
  onGoHome: () => void;
}

export const TripsSection: React.FC<TripsSectionProps> = ({ trips, onRemove, onGoHome }) => {
  return (
    <section className="w-full max-w-[1200px] px-6 py-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">My Itineraries</h1>
          <p className="text-text-sec-light dark:text-text-sec-dark text-lg">
            Manage your upcoming adventures and past memories.
          </p>
        </div>
        <button 
          onClick={onGoHome}
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-full font-bold hover:bg-primary hover:text-white transition-all group"
        >
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Find More Trips
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="size-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
             <span className="material-symbols-outlined text-5xl text-gray-400">luggage</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">No trips booked yet</h3>
          <p className="text-text-sec-light max-w-sm mb-8">
            Your travel stories start here. Browse our collections and book your first escape.
          </p>
          <button 
            onClick={onGoHome}
            className="px-8 py-4 bg-primary text-white dark:text-background-dark font-black rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div 
              key={trip.id}
              className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.destinationName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                  {trip.type}
                </div>
                <button 
                  onClick={() => onRemove(trip.id)}
                  className="absolute top-4 right-4 size-10 bg-white/20 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                  title="Remove trip"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1 truncate" title={trip.tripTitle || trip.destinationName}>
                   {trip.tripTitle || trip.destinationName}
                </h3>
                {trip.tripTitle && (
                  <p className="text-xs font-medium text-text-sec-light dark:text-text-sec-dark opacity-60 mb-2 truncate">
                    {trip.destinationName}
                  </p>
                )}
                
                <div className="space-y-3 mb-6 mt-3">
                  <div className="flex items-center gap-3 text-sm text-text-sec-light">
                    <span className="material-symbols-outlined text-lg">calendar_month</span>
                    <span className="font-medium">{trip.dates}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-text-sec-light">
                    <span className="material-symbols-outlined text-lg">group</span>
                    <span className="font-medium">{trip.travelers}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-gray-50 dark:border-gray-800">
                  <div>
                    <p className="text-[10px] font-black text-text-sec-light uppercase tracking-widest">Paid Total</p>
                    <p className="text-xl font-black text-primary">{trip.price}</p>
                  </div>
                  <button className="px-5 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};