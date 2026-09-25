import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Quote,
  Sparkles,
} from 'lucide-react';
import Reveal from './Reveal';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: '/artisan/hero.jpg',
      tag: 'Ancient Wisdom & Stone Reliefs',
      headingMain: 'From Ancient Tamil Wisdom',
      headingAccent: 'To Modern Creation',
      subtitle: 'Learn Heritage. Create Art. Build Livelihood.',
      desc: 'A structured heritage learning experience that transforms ancient Tamil knowledge into practical creativity, craftsmanship and modern applications.',
      quote:
        'To us, every land is our home and all people are our kin. We preserve our sacred roots so our creations belong to the world.',
      author: 'Ancient Sangam Heritage Philosophy',
      primaryBtn: 'Register for Cohort',
      secondaryBtn: 'Explore Heritage Skills',
    },
    {
      id: 2,
      image: '/artisan/slide-craft.jpg',
      tag: 'Sacred Metallurgy & Naga Jewelry',
      headingMain: 'Skill in the Hands,',
      headingAccent: 'Reverence in the Heart',
      subtitle: 'Where Traditional Metallurgy Meets Enduring Livelihood.',
      desc: 'Master the timeless techniques of handmade naga jewelry, copper and brass repoussé, and sacred iconography under veteran artisan guilds.',
      quote:
        'Of all pursuits, craftsmanship born from one’s own hands holds the truest dignity, enduring value, and creative sovereignty.',
      author: 'Traditional Artisan Creed',
      primaryBtn: 'Register for Cohort',
      secondaryBtn: 'Discover Sacred Metallurgy',
    },
    {
      id: 3,
      image: '/artisan/workshop.jpg',
      tag: 'Epigraphy, Rock Art & Community',
      headingMain: 'Preserve the Past,',
      headingAccent: 'Shape Tomorrow’s Legacy',
      subtitle: 'Bridging Ancient Inscriptions, Temple Art, and Living Communities.',
      desc: 'Immerse in hands-on Tamili epigraphy, natural mineral painting, and collective peer guilds designed to nurture a self-reliant generation of creators.',
      quote:
        'Learn thoroughly that which is worth learning, and let your daily practice and creations stand true to that sacred knowledge.',
      author: 'Classical Heritage Teaching',
      primaryBtn: 'Join the Journey',
      secondaryBtn: 'Explore Workshop Details',
    },
  ];

  // Auto-play sliding carousel every 4.5 seconds continuously
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  const handleStaticClick = (e) => {
    e.preventDefault();
  };

  const current = slides[currentSlide];

  return (
    <section
      id="home"
      className="relative pt-36 pb-12 sm:pt-36 sm:pb-12 md:pt-40 md:pb-14 overflow-hidden bg-[#241A16] text-[#F7F2E8]"
    >
      {/* Background Auto-Sliding Carousel with Solid Color Overlay (No Gradients) */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
              } transition-transform duration-10000 ease-out`}
            >
              <img
                src={slide.image}
                alt={slide.headingMain}
                className="w-full h-full object-cover object-center"
              />
              {/* Solid flat dark overlay - NO gradients */}
              <div className="absolute inset-0 bg-[#241A16]/90" />
            </div>
          );
        })}
      </div>

      {/* Banner Left and Right Slider Arrows on Desktop Only (Hidden on mobile so they never cover text) */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#241A16]/80 hover:bg-[#B89555] hover:text-[#241A16] text-[#F7F2E8] border border-[#B89555]/40 items-center justify-center transition-all duration-200 shadow-md cursor-pointer group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#241A16]/80 hover:bg-[#B89555] hover:text-[#241A16] text-[#F7F2E8] border border-[#B89555]/40 items-center justify-center transition-all duration-200 shadow-md cursor-pointer group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-4 sm:space-y-5 text-center sm:text-left mx-auto sm:mx-0">
          {/* Tag Badge in Sentence Case */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A2C20] border border-[#B89555]/40 text-[#B89555] text-xs font-['DM_Sans']">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] animate-pulse" />
            <span>{current.tag}</span>
          </div>

          {/* Heading in Cormorant Garamond - Sentence Case */}
          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-[#F7F2E8] tracking-tight leading-[1.15]">
            <span>
              {current.headingMain}{' '}
              <span className="text-[#B89555] italic block sm:inline">
                {current.headingAccent}
              </span>
            </span>
          </h1>

          {/* Subtitle in DM Sans - Sentence Case */}
          <p className="font-['Cormorant_Garamond'] text-lg sm:text-2xl text-[#F7F2E8]/90 font-medium">
            {current.subtitle}
          </p>

          {/* Description in DM Sans - Sentence Case */}
          <p className="font-['DM_Sans'] text-sm sm:text-[14.5px] text-[#F7F2E8]/85 max-w-2xl leading-relaxed font-normal">
            {current.desc}
          </p>

          {/* Heritage Quote Card (Solid flat background, NO gradients) */}
          <div className="bg-[#4A2C20]/90 border border-[#B89555]/30 p-3.5 sm:p-4 rounded-xl max-w-2xl text-left">
            <div className="flex items-start gap-3">
              <Quote className="w-5 h-5 text-[#B89555] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-['Cormorant_Garamond'] italic text-sm sm:text-base text-[#F7F2E8] leading-relaxed font-normal">
                  "{current.quote}"
                </p>
                <p className="font-['DM_Sans'] text-xs text-[#B89555] font-semibold">
                  — {current.author}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons in Sentence Case */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5 justify-center sm:justify-start">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-['DM_Sans'] text-sm font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c7a462] transition-colors border border-[#B89555]"
            >
              <span>{current.primaryBtn}</span>
              <ArrowRight className="w-4 h-4 text-[#241A16]" />
            </Link>

            <button
              onClick={handleStaticClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-['DM_Sans'] text-sm font-medium text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] border border-[#B89555]/40 transition-colors cursor-default"
            >
              <BookOpen className="w-4 h-4 text-[#B89555]" />
              <span>{current.secondaryBtn}</span>
            </button>
          </div>

          {/* Core Highlights Placed Directly Below Register Button */}
          <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6 text-xs sm:text-sm font-['DM_Sans'] text-[#F7F2E8]/90">
            <div className="flex items-center gap-2">
              <span className="font-number text-base sm:text-lg font-bold text-[#B89555]">4</span>
              <span>Heritage Pillars</span>
            </div>
            <div className="h-3.5 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="font-number text-base sm:text-lg font-bold text-[#B89555]">60</span>
              <span>Days Creator Journey</span>
            </div>
            <div className="h-3.5 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B89555]" />
              <span>Hands-on Livelihood</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Bottom Center Alignment for Indicator Dots & Mobile Controls */}
      <div className="absolute bottom-3.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
        <button
          onClick={prevSlide}
          className="sm:hidden w-7 h-7 rounded-full bg-[#241A16]/90 border border-[#B89555]/40 text-[#F7F2E8] flex items-center justify-center shadow-xs"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentSlide
                ? 'w-7 sm:w-8 bg-[#B89555]'
                : 'w-2 sm:w-2.5 bg-[#F7F2E8]/40 hover:bg-[#F7F2E8]/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}

        <button
          onClick={nextSlide}
          className="sm:hidden w-7 h-7 rounded-full bg-[#241A16]/90 border border-[#B89555]/40 text-[#F7F2E8] flex items-center justify-center shadow-xs"
          aria-label="Next slide"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}
