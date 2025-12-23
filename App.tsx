import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodSection } from './components/MoodSection';
import { TrendingSection } from './components/TrendingSection';
import { InternationalGateway } from './components/InternationalGateway';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { TripsSection } from './components/TripsSection';
import { AppView, Trip } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [trips, setTrips] = useState<Trip[]>([]);

  // Load trips from localStorage on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem('bmt_trips');
    if (savedTrips) {
      try {
        setTrips(JSON.parse(savedTrips));
      } catch (e) {
        console.error("Failed to parse saved trips", e);
      }
    }
  }, []);

  const handleBookTrip = (trip: Trip) => {
    const updatedTrips = [trip, ...trips];
    setTrips(updatedTrips);
    localStorage.setItem('bmt_trips', JSON.stringify(updatedTrips));
  };

  const handleRemoveTrip = (id: string) => {
    const updatedTrips = trips.filter(t => t.id !== id);
    setTrips(updatedTrips);
    localStorage.setItem('bmt_trips', JSON.stringify(updatedTrips));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="w-full flex flex-col items-center min-h-[70vh]">
        {currentView === 'home' ? (
          <>
            <Hero onBook={handleBookTrip} />
            <MoodSection />
            <TrendingSection />
            <InternationalGateway onBook={handleBookTrip} />
            <Newsletter />
          </>
        ) : (
          <TripsSection trips={trips} onRemove={handleRemoveTrip} onGoHome={() => setCurrentView('home')} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;