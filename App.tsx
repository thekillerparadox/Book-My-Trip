import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodSection } from './components/MoodSection';
import { TrendingSection } from './components/TrendingSection';
import { InternationalGateway } from './components/InternationalGateway';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { TripsSection } from './components/TripsSection';
import { AIVisualizer } from './components/AIVisualizer';
import { ReviewsSection } from './components/ReviewsSection';
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
      <main className="w-full flex flex-col items-center min-h-[100vh]">
        {currentView === 'home' ? (
          <div className="w-full flex flex-col items-center">
            <Hero onBook={handleBookTrip} />
            {/* 
                Margin top calculation:
                Mobile: Widget moved to 75% out. Widget height approx 370px. 0.75*370 = 277px. 
                        mt-[330px] gives ~50px buffer.
                Desktop: Widget moved to 75% out. Widget height approx 250px. 0.75*250 = 188px.
                        mt-[230px] gives ~40px buffer.
            */}
            <div className="w-full flex flex-col items-center gap-6 md:gap-8 mt-[330px] md:mt-[230px]">
              <MoodSection />
              <TrendingSection />
              <AIVisualizer />
              <InternationalGateway onBook={handleBookTrip} />
              <ReviewsSection />
              <Newsletter />
            </div>
          </div>
        ) : (
          <div className="pt-24 w-full flex justify-center min-h-[60vh]">
            <TripsSection trips={trips} onRemove={handleRemoveTrip} onGoHome={() => setCurrentView('home')} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;