import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodSection } from './components/MoodSection';
import { TrendingSection } from './components/TrendingSection';
import { InternationalGateway } from './components/InternationalGateway';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Navbar />
      <main className="w-full flex flex-col items-center">
        <Hero />
        <MoodSection />
        <TrendingSection />
        <InternationalGateway />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default App;