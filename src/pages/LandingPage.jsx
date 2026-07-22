import React from 'react';
import Navbar from '../components/Navbar';
import MobileNav from '../components/MobileNav';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import PricingSection from '../components/PricingSection';
import CtaSection from '../components/CtaSection';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pb-16 md:pb-0">
        <Hero />
        <AboutSection />
        <PricingSection />
        <CtaSection />
      </main>
      <MobileNav />
    </div>
  );
}
