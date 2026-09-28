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
      image: '/artisan/slide-collaborate.jpg',
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
      className="relative pt-28 pb-8 sm:pt-36 sm:pb-12 md:pt-40 md:pb-14 overflow-hidden bg-[#241A16] text-[#F7F2E8]"
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
                loading={idx === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="w-full h-full object-cover object-center"
              />
              {/* Rich dark overlay ensuring high-contrast text visibility */}
              <div className="absolute inset-0 bg-[#241A16]/75 sm:bg-[#241A16]/70" />
            </div>
          );
        })}
      </div>

      {/* Banner Left and Right Slider Arrows on Desktop Only (Hidden on mobile so they never cover text) */}
      <button
        onClick={prevSlide}
        className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#241A16]/90 hover:bg-[#B89555] hover:text-[#241A16] text-[#F7F2E8] border border-[#B89555]/40 items-center justify-center transition-all duration-200 shadow-md cursor-pointer group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 md:w-12 md:h-12 rounded-full bg-[#241A16]/90 hover:bg-[#B89555] hover:text-[#241A16] text-[#F7F2E8] border border-[#B89555]/40 items-center justify-center transition-all duration-200 shadow-md cursor-pointer group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-10 lg:px-12">
        <div className="max-w-3xl space-y-2.5 sm:space-y-5 text-left mx-0">
          {/* Tag Badge in Sentence Case */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full bg-[#4A2C20] border border-[#B89555]/50 text-[#E5B869] text-[11px] sm:text-xs font-['DM_Sans'] font-medium self-start shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] animate-pulse" />
            <span>{current.tag}</span>
          </div>

          {/* Heading in Cormorant Garamond - Sentence Case with high contrast */}
          <h1 className="font-['Cormorant_Garamond'] text-xl sm:text-4xl md:text-5xl lg:text-[54px] font-bold text-white tracking-tight leading-tight text-left drop-shadow-md">
            <span className="block sm:inline">{current.headingMain}</span>{' '}
            <span className="text-[#E5B869] italic block sm:inline">
              {current.headingAccent}
            </span>
          </h1>

          {/* Subtitle in DM Sans - Sentence Case */}
          <p className="font-['Cormorant_Garamond'] text-sm sm:text-2xl text-white font-medium text-left leading-snug drop-shadow-sm">
            {current.subtitle}
          </p>

          {/* Description in DM Sans - Sentence Case */}
          <p className="font-['DM_Sans'] text-[11.5px] sm:text-[14.5px] text-[#F7F2E8] max-w-2xl leading-relaxed font-normal text-left drop-shadow-xs">
            {current.desc}
          </p>

          {/* Heritage Quote Card (Solid flat background, NO gradients) */}
          <div className="bg-[#241A16]/95 border border-[#B89555]/40 p-3.5 sm:p-4 rounded-xl max-w-2xl text-left shadow-md">
            <div className="flex items-start gap-2.5 sm:gap-3">
              <Quote className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#E5B869] shrink-0 mt-0.5" />
              <div className="space-y-0.5 sm:space-y-1 text-left">
                <p className="font-['Cormorant_Garamond'] italic text-xs sm:text-base text-white leading-relaxed font-normal text-left">
                  "{current.quote}"
                </p>
                <p className="font-['DM_Sans'] text-[10px] sm:text-xs text-[#E5B869] font-semibold text-left">
                  — {current.author}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons in Sentence Case - Adopt text size on mobile & desktop */}
          <div className="pt-1 sm:pt-2 flex flex-row flex-wrap items-center gap-2.5 sm:gap-3.5 justify-start">
            <Link
              to="/register"
              className="w-auto inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg font-['DM_Sans'] text-xs sm:text-sm font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c7a462] transition-colors border border-[#B89555] shadow-md shrink-0"
            >
              <span>{current.primaryBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#241A16]" />
            </Link>

            <button
              onClick={handleStaticClick}
              className="w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-lg font-['DM_Sans'] text-xs sm:text-sm font-medium text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] border border-[#B89555]/40 transition-colors cursor-default shadow-sm shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5B869]" />
              <span>{current.secondaryBtn}</span>
            </button>
          </div>

          {/* Core Highlights Placed Directly Below Register Button - Strictly Single Line on Mobile */}
          <div className="pt-1.5 sm:pt-3 flex flex-nowrap items-center justify-start gap-2 sm:gap-6 text-[10px] sm:text-sm font-['DM_Sans'] text-white/95 w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span className="font-number text-xs sm:text-lg font-bold text-[#E5B869]">4</span>
              <span className="whitespace-nowrap">Heritage Pillars</span>
            </div>
            <div className="h-2.5 sm:h-3 w-px bg-white/30 shrink-0" />
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <span className="font-number text-xs sm:text-lg font-bold text-[#E5B869]">60</span>
              <span className="whitespace-nowrap">Days <span className="hidden sm:inline">Creator </span>Journey</span>
            </div>
            <div className="h-2.5 sm:h-3 w-px bg-white/30 shrink-0" />
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#E5B869] shrink-0" />
              <span className="whitespace-nowrap">Hands-on Livelihood</span>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Bottom Center Alignment for Indicator Dots & Mobile Controls */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
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
