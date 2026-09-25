import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import TargetAudience from '../components/TargetAudience';
import HeritageFramework from '../components/HeritageFramework';
import WhyJoinUs from '../components/WhyJoinUs';
import InstitutionalPedagogy from '../components/InstitutionalPedagogy';
import StudioFacilities from '../components/StudioFacilities';
import CoreValues from '../components/CoreValues';
import LearningJourney from '../components/LearningJourney';
import WorkshopSection from '../components/WorkshopSection';
import Process from '../components/Process';
import TransformationSection from '../components/TransformationSection';
import Team from '../components/Team';
import CreatorsCircle from '../components/CreatorsCircle';
import Testimonials from '../components/Testimonials';
import SacredDisconnect from '../components/SacredDisconnect';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F2E8] text-[#241A16] flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1. Banner */}
        <Hero />

        {/* 2. About Us */}
        <About />

        {/* Target Audience Profile */}
        <TargetAudience />

        {/* 4 Heritage Skill Pillars */}
        <HeritageFramework />

        {/* 3. Why Join Us */}
        <WhyJoinUs />

        {/* Pedagogical Methodology */}
        <InstitutionalPedagogy />

        {/* Studio Facilities */}
        <StudioFacilities />

        {/* 5 Core Values */}
        <CoreValues />

        {/* 60-Day Learning Journey */}
        <LearningJourney />

        {/* 6-Step Workshop */}
        <WorkshopSection />

        {/* 4. Process of Maintenance */}
        <Process />

        {/* 5-Tier Transformation */}
        <TransformationSection />

        {/* 5. Team Behind */}
        <Team />

        {/* Creators Circle */}
        <CreatorsCircle />

        {/* 6. Testimonials */}
        <Testimonials />

        {/* Cultural Reflection */}
        <SacredDisconnect />

        {/* 7. Register / Admissions CTA */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
