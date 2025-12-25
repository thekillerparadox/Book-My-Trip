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
import { AccessibilityAgent } from './components/AccessibilityAgent';
import { PartnersSection } from './components/PartnersSection';
import { MobileAppPromo } from './components/MobileAppPromo';
import { AppView, Trip } from './types';

const MOCK_TRIPS: Trip[] = [
  {
    id: 'trip_1',
    destinationName: 'Santorini, Greece',
    tripTitle: 'Anniversary Getaway',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1200&auto=format&fit=crop',
    dates: 'Oct 15 - Oct 22',
    travelers: '2 Adults',
    price: '₹1,20,000',
    type: 'Vacation Package',
    bookedAt: Date.now() - 10000000,
    status: 'completed'
  },
  {
    id: 'trip_2',
    destinationName: 'Kyoto, Japan',
    tripTitle: 'Cultural Exploration',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1200&auto=format&fit=crop',
    dates: 'Nov 05 - Nov 12',
    travelers: '1 Adult',
    price: '₹1,15,000',
    type: 'Solo Trip',
    bookedAt: Date.now() - 5000000,
    status: 'completed'
  },
  {
    id: 'trip_3',
    destinationName: 'Maldives',
    tripTitle: 'Ocean Paradise',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=1200&auto=format&fit=crop',
    dates: 'Dec 01 - Dec 07',
    travelers: '2 Adults, 1 Child',
    price: '₹2,50,000',
    type: 'Luxury Resort',
    bookedAt: Date.now() - 2000000,
    status: 'upcoming'
  },
  {
    id: 'trip_4',
    destinationName: 'New York City, USA',
    tripTitle: 'Business Conference',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1200&auto=format&fit=crop',
    dates: 'Sep 10 - Sep 15',
    travelers: '1 Adult',
    price: '₹1,80,000',
    type: 'Business Class',
    bookedAt: Date.now() - 15000000,
    status: 'completed'
  },
  {
    id: 'trip_5',
    destinationName: 'Paris, France',
    tripTitle: 'Summer Vacation',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1200&auto=format&fit=crop',
    dates: 'Aug 01 - Aug 10',
    travelers: '2 Adults, 2 Children',
    price: '₹2,40,000',
    type: 'Family Suite',
    bookedAt: Date.now() - 20000000,
    status: 'cancelled'
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [trips, setTrips] = useState<Trip[]>([]);

  // Load trips from localStorage on mount
  useEffect(() => {
    const savedTrips = localStorage.getItem('bmt_trips');
    if (savedTrips) {
      try {
        const parsed = JSON.parse(savedTrips);
        if (Array.isArray(parsed) && parsed.length > 0) {
           setTrips(parsed);
        } else {
           setTrips(MOCK_TRIPS);
           localStorage.setItem('bmt_trips', JSON.stringify(MOCK_TRIPS));
        }
      } catch (e) {
        console.error("Failed to parse saved trips", e);
        setTrips(MOCK_TRIPS);
        localStorage.setItem('bmt_trips', JSON.stringify(MOCK_TRIPS));
      }
    } else {
      setTrips(MOCK_TRIPS);
      localStorage.setItem('bmt_trips', JSON.stringify(MOCK_TRIPS));
    }
  }, []);

  const handleBookTrip = (trip: Trip) => {
    // Ensure status is set for new bookings
    const newTrip = { ...trip, status: trip.status || 'upcoming' };
    const updatedTrips = [newTrip, ...trips];
    setTrips(updatedTrips);
    localStorage.setItem('bmt_trips', JSON.stringify(updatedTrips));
    // Automatically switch to trips view to show the new booking
    if (window.confirm(`Booking Confirmed! View your trip to ${trip.destinationName}?`)) {
      setCurrentView('trips');
    }
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
                Increased margin top for better spacing between Hero widget and content.
                Mobile: Widget ~370px height, translated 75%. Protrudes ~280px. mt-[400px] gives ~120px gap.
                Desktop: Widget ~250px height, translated 75%. Protrudes ~190px. mt-[320px] gives ~130px gap.
            */}
            <div className="w-full flex flex-col items-center gap-6 md:gap-8 mt-[400px] md:mt-[320px]">
              <MoodSection />
              <TrendingSection />
              <TripPlanner onBook={handleBookTrip} />
              <AIVisualizer />
              <InternationalGateway onBook={handleBookTrip} />
              <ReviewsSection />
              <PartnersSection />
              <MobileAppPromo />
              <Newsletter />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      <Navbar currentView={currentView} setView={setCurrentView} />
      <main className="w-full flex flex-col items-center min-h-[100vh]">
        {renderContent()}
      </main>
      <Footer />
      
      {/* Accessibility Features */}
      <AccessibilityPanel />
      <AccessibilityAgent setView={setCurrentView} />
    </div>
  );
};

export default App;
