import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Stats } from './components/Stats';
import { Analytics } from './components/Analytics';
import { Testimonials } from './components/Testimonials';
import { Showcase } from './components/Showcase';
import { LastUrl } from './components/LastUrl';
import { FAQ } from './components/FAQ';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { Redirect } from './pages/Redirect';

function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <Hero />
      <Features />
      <Stats />
      <Analytics />
      <Testimonials />
      <Showcase />
      <LastUrl />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/redirect" element={<Redirect />} />
        <Route path="/:shortCode" element={<Redirect />} />
      </Routes>
    </Router>
  );
}

export default App;