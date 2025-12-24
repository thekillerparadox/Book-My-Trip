import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodSection } from './components/MoodSection';
import { TrendingSection } from './components/TrendingSection';
import { TripPlanner } from './components/TripPlanner';
import { InternationalGateway } from './components/InternationalGateway';
import { TourGuideSection } from './components/TourGuideSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { TripsSection } from './components/TripsSection';
import { AIVisualizer } from './components/AIVisualizer';
import { ReviewsSection } from './components/ReviewsSection';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { ChatBot } from './components/ChatBot';
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

  const renderContent = () => {
    switch (currentView) {
      case 'guides':
        return <TourGuideSection onBook={handleBookTrip} />;
      case 'trips':
        return (
          <div className="pt-24 w-full flex justify-center min-h-[60vh]">
            <TripsSection trips={trips} onRemove={handleRemoveTrip} onGoHome={() => setCurrentView('home')} />
          </div>
        );
      case 'home':
      default:
        return (
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
              <TripPlanner onBook={handleBookTrip} />
              <AIVisualizer />
              <InternationalGateway onBook={handleBookTrip} />
              <ReviewsSection />
              <Newsletter />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="w-full flex flex-col items-center min-h-[100vh]">
        {renderContent()}
      </main>
      <Footer />
      
      {/* Accessibility Features */}
      <AccessibilityPanel />
      <ChatBot />
    </div>
  );
};

export default App;