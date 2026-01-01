
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
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
import { FeedbackSection } from './components/FeedbackSection';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { AccessibilityAgent } from './components/AccessibilityAgent';
import { PartnersSection } from './components/PartnersSection';
import { MobileAppPromo } from './components/MobileAppPromo';
import { AppView, Trip } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [trips, setTrips] = useState<Trip[]>([]);

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
    const newTrip = { ...trip, status: trip.status || 'upcoming' };
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    localStorage.setItem('bmt_trips', JSON.stringify(updatedTrips));
    if (window.confirm(`Trip to ${trip.destinationName} booked! See your itinerary?`)) {
      setCurrentView('trips');
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'guides':
        return <TourGuideSection onBook={handleBookTrip} />;
      case 'trips':
        return <div className="pt-24 w-full flex justify-center min-h-[80vh]"><TripsSection trips={trips} onRemove={(id) => { const next = trips.filter(t => t.id !== id); setTrips(next); localStorage.setItem('bmt_trips', JSON.stringify(next)); }} onGoHome={() => setCurrentView('home')} /></div>;
      case 'home':
      default:
        return (
          <div className="w-full flex flex-col items-center">
            <Hero onBook={handleBookTrip} />
            <div className="w-full flex flex-col items-center gap-16 md:gap-24 mt-48 sm:mt-56 md:mt-32 lg:mt-32">
              <div className="w-full reveal"><MoodSection /></div>
              <div className="w-full reveal"><TrendingSection /></div>
              <div className="w-full reveal"><TripPlanner onBook={handleBookTrip} /></div>
              <div className="w-full reveal"><AIVisualizer /></div>
              <div className="w-full reveal"><InternationalGateway onBook={handleBookTrip} /></div>
              <div className="w-full reveal"><ReviewsSection /></div>
              <div className="w-full reveal"><FeedbackSection trips={trips} /></div>
              <div className="w-full reveal"><PartnersSection /></div>
              <div className="w-full reveal"><MobileAppPromo /></div>
              <div className="w-full reveal"><Newsletter /></div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden min-h-screen">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="w-full flex flex-col items-center flex-1">
        {renderContent()}
      </main>
      <Footer />
      <AccessibilityPanel />
      <AccessibilityAgent setView={setCurrentView} />
    </div>
  );
};

export default App;
