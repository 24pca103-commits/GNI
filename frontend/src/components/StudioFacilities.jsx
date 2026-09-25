import React, { useState, useEffect } from 'react';
import {
  Palette,
  ScrollText,
  Hammer,
  Sparkles,
  BookOpen,
  Building2,
  CheckCircle2,
  Wrench,
  Users,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function StudioFacilities() {
  const facilities = [
    {
      id: 0,
      title: 'Design & Iconography Studio',
      category: 'Visual Arts & Sacred Geometry',
      image: '/artisan/pillar-painting.jpg',
      icon: Palette,
      desc: 'Equipped with traditional drawing boards, shilpa sastra proportion grids, and sketching stations for classical Tamil iconography and temple motifs.',
      tools: ['T-squares & grid drafting scales', 'Handmade mulberry drawing paper', 'Shilpa proportion templates', 'Natural charcoal pencils'],
      capabilities: [
        'Temple architectural proportion drafting',
        'Traditional deity shilpa grid construction',
        'Textile and jewellery motif vectorization',
      ],
      curator: 'Master Iconography Guild Sthapati',
    },
    {
      id: 1,
      title: 'Epigraphy & Manuscript Lab',
      category: 'Archaeology & Script Archives',
      image: '/artisan/pillar-epigraphy.jpg',
      icon: ScrollText,
      desc: 'Housing authentic stone inscription rubbings, Tamili Brahmi transcription desks, and palm-leaf scribing tools for hands-on historical research.',
      tools: ['Brass palm-leaf styluses', 'Ink rubbing handmade paper', 'Magnification stereoscopes', 'Deciphering character charts'],
      capabilities: [
        'Deciphering 3rd century BCE Tamili Brahmi',
        'Copper plate inscription scribing',
        'Preservation of archival rock rubbings',
      ],
      curator: 'Senior Epigraphist & Archaeologist',
    },
    {
      id: 2,
      title: 'Sacred Metallurgy Forge',
      category: 'Jewellery & Metal Crafts',
      image: '/artisan/pillar-metal.jpg',
      icon: Hammer,
      desc: 'Dedicated artisanal benches for hand-forging, copper and brass repoussé, antique naga jewelry fabrication, and precision metal chasing.',
      tools: ['Pitch bowls & chasing hammers', 'Shaping stakes & planishers', 'Charcoal mini-hearth', 'Jewellery casting crucibles'],
      capabilities: [
        'Traditional naga serpent necklace forming',
        'Copper plate sacred repoussé relief',
        'Brass temple vessel fabrication',
      ],
      curator: 'Master Metal Craft Artisan Guild',
    },
    {
      id: 3,
      title: 'Natural Mineral Pigment Studio',
      category: 'Ancient Materials & Dyes',
      image: '/artisan/slide-craft.jpg',
      icon: Sparkles,
      desc: 'Dedicated space for rock grinding, mixing natural earth pigments, tree resin binders, and testing prehistoric fresco textures on rock surfaces.',
      tools: ['Granite grinding mortars & pestles', 'Raw ochre & lapis minerals', 'Neem gum natural binders', 'Traditional squirrel-hair brushes'],
      capabilities: [
        'Pure mineral extraction and levigation',
        'Rock surface fresco plastering',
        'Lightfast natural pigment testing',
      ],
      curator: 'Traditional Fresco Artist & Botanist',
    },
    {
      id: 4,
      title: 'Heritage Application Lab',
      category: 'Commercial Design & Interiors',
      image: '/artisan/pillar-applications.jpg',
      icon: Building2,
      desc: 'Where creators prototype modern applications: sacred pooja room interior mockups, bespoke embroidered textiles, and heritage brand packaging.',
      tools: ['Pooja room 3D scale models', 'Aari embroidery frames', 'Brass architectural trims', 'Packaging design workbenches'],
      capabilities: [
        'Bespoke pooja sanctum layout modeling',
        'Luxury blouse motif embroidery styling',
        'Commercial cultural product incubation',
      ],
      curator: 'Spatial Architect & Brand Designer',
    },
    {
      id: 5,
      title: 'Sangam Heritage Library',
      category: 'Archival Research & Literature',
      image: '/artisan/audience-history.jpg',
      icon: BookOpen,
      desc: 'An extensive repository of rare archaeological books, temple architecture treatises, epigraphical journals, and Sangam poetry translations.',
      tools: ['1,200+ historical volumes', 'Archaeological Survey monographs', 'Quiet study carrels', 'Digital manuscript terminals'],
      capabilities: [
        'Sangam literature context cross-referencing',
        'Temple architecture vastu research',
        'Primary source historical verification',
      ],
      curator: 'Heritage Archivist & Historian',
    },
  ];

  // 3-in-Front Infinite Looping Carousel State
  const extendedFacilities = [...facilities, ...facilities, ...facilities];
  const [currentIndex, setCurrentIndex] = useState(facilities.length);
  const [withTransition, setWithTransition] = useState(true);

  // Active facility is the center one of the 3 visible items (safe positive modulo)
  const activeIndex = (((currentIndex + 1) % facilities.length) + facilities.length) % facilities.length;
  const current = facilities[activeIndex] || facilities[0];
  const CurrentIcon = current ? current.icon : facilities[0].icon;

  const nextSlide = () => {
    setWithTransition(true);
    setCurrentIndex((prev) => (prev >= facilities.length * 2 ? facilities.length : prev + 1));
  };

  const prevSlide = () => {
    setWithTransition(true);
    setCurrentIndex((prev) => (prev <= 0 ? facilities.length * 2 - 1 : prev - 1));
  };

  // Touch handlers for mobile swipe
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 45) {
      nextSlide();
    } else if (distance < -45) {
      prevSlide();
    }
  };

  // Continuous auto-sliding & looping every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex((prev) => (prev >= facilities.length * 2 ? facilities.length : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [facilities.length]);

  // Seamless infinite loop transition handler
  const handleTransitionEnd = () => {
    if (currentIndex >= facilities.length * 2) {
      setWithTransition(false);
      setCurrentIndex((prev) => prev - facilities.length);
    } else if (currentIndex < facilities.length) {
      setWithTransition(false);
      setCurrentIndex((prev) => prev + facilities.length);
    }
  };

  useEffect(() => {
    if (!withTransition) {
      const raf = requestAnimationFrame(() => {
        setWithTransition(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [withTransition]);

  return (
    <section id="facilities" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles in Background */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              Infrastructure & Studios
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Repository Studios & Facilities
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-base sm:text-lg text-[#6B4030] font-normal leading-relaxed">
              Explore our 6 dedicated purpose-built spaces designed for tactile craftsmanship and epigraphical study.
            </p>
          </div>
        </Reveal>

        {/* 3-in-Front Scrolling & Looping Icon Carousel - Visible on Mobile & Desktop */}
        <Reveal direction="up" delay={150}>
            <div className="relative mb-6 sm:mb-8 max-w-3xl mx-auto">
              {/* Carousel Container with Arrows and Viewport */}
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Prev Button */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous Studio"
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white border border-[#6B4030]/20 text-[#6B4030] hover:bg-[#4A2C20] hover:text-[#B89555] hover:border-[#B89555] transition-all flex items-center justify-center shrink-0 shadow-sm cursor-pointer z-20"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Viewport: Shows EXACTLY 3 items in front at a time (Touch Swipeable) */}
                <div
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  className="flex-1 overflow-hidden py-3 px-1"
                >
                  <div
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                      transform: `translateX(-${(currentIndex * 100) / 3}%)`,
                      transition: withTransition ? 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
                    }}
                    className="flex items-start"
                  >
                    {extendedFacilities.map((fac, idx) => {
                      const Icon = fac.icon;
                      // Check if this item is currently the center active one
                      const isCenter = idx === currentIndex + 1;

                      return (
                        <div
                          key={idx}
                          className="w-1/3 flex-shrink-0 px-1 sm:px-2 flex flex-col items-center justify-center text-center"
                        >
                          <button
                            onClick={() => {
                              setWithTransition(true);
                              const targetIndex = facilities.length + (idx % facilities.length) - 1;
                              setCurrentIndex(targetIndex);
                            }}
                            className="flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group focus:outline-hidden w-full"
                          >
                            {/* Round Shape Icon Container */}
                            <div
                              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isCenter
                                  ? 'bg-[#4A2C20] text-[#B89555] ring-4 ring-[#B89555]/40 shadow-xl scale-110'
                                  : 'bg-white border border-[#6B4030]/20 text-[#6B4030] group-hover:bg-[#4A2C20] group-hover:text-[#B89555] group-hover:scale-105 shadow-sm opacity-80 group-hover:opacity-100'
                              }`}
                            >
                              <Icon className="w-6 h-6" />
                            </div>

                            {/* Name Mentioned Below Icon */}
                            <span
                              className={`text-xs font-['DM_Sans'] mt-2.5 max-w-[120px] leading-snug line-clamp-2 transition-colors ${
                                isCenter ? 'font-bold text-[#241A16]' : 'font-medium text-[#6B4030]'
                              }`}
                            >
                              {fac.title}
                            </span>

                            {/* Center Active Indicator Dot/Bar */}
                            {isCenter ? (
                              <span className="w-6 h-1 rounded-full bg-[#B89555] mt-1.5 transition-all" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-transparent mt-1.5" />
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  aria-label="Next Studio"
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-white border border-[#6B4030]/20 text-[#6B4030] hover:bg-[#4A2C20] hover:text-[#B89555] hover:border-[#B89555] transition-all flex items-center justify-center shrink-0 shadow-sm cursor-pointer z-20"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Loop Progress Dots for the 6 studios */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {facilities.map((fac, idx) => (
                  <button
                    key={fac.id}
                    onClick={() => {
                      setWithTransition(true);
                      setCurrentIndex(facilities.length + idx - 1);
                    }}
                    aria-label={`Slide to ${fac.title}`}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      idx === activeIndex ? 'w-8 bg-[#B89555]' : 'w-2 bg-[#6B4030]/25 hover:bg-[#6B4030]/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Dynamic Studio Showcase Stage - Split Visual & Workbench */}
          <Reveal direction="up" delay={200}>
            <div
              key={current.id}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="bg-white rounded-3xl p-5 sm:p-10 border border-[#6B4030]/15 shadow-[0_24px_50px_-10px_rgba(74,44,32,0.2)] grid lg:grid-cols-12 gap-6 sm:gap-8 items-center relative overflow-hidden transition-all duration-500"
            >
              {/* Left Column: Authentic Studio Visual with Details */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden bg-[#241A16] h-[260px] sm:h-[340px] md:h-[420px] group">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-[#241A16]/30" />

                {/* Top Category Tag */}
                <div className="absolute top-4 left-4 bg-[#241A16]/90 px-3.5 py-1.5 rounded-xl border border-[#B89555]/30 text-[#B89555] text-xs font-['DM_Sans'] font-medium flex items-center gap-1.5 shadow-sm">
                  <CurrentIcon className="w-3.5 h-3.5 text-[#B89555]" />
                  <span className="text-[#F7F2E8]">{current.category}</span>
                </div>

                {/* Bottom Curator Panel */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#241A16]/90 p-4 rounded-xl border border-[#B89555]/40 text-[#F7F2E8] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-['DM_Sans'] text-[#B89555] font-semibold block">
                      Lead Supervisor
                    </span>
                    <p className="font-['DM_Sans'] text-xs text-white font-medium">
                      {current.curator}
                    </p>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#B89555]" />
                </div>
              </div>

              {/* Right Column: Workbench Specifications & Tools */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-['DM_Sans'] text-[#6B4030]">
                    <CurrentIcon className="w-4 h-4 text-[#B89555]" />
                    <span>Facility Specification <span className="font-number font-bold text-[#B89555]">{activeIndex + 1}</span></span>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-[#241A16] tracking-tight">
                    {current.title}
                  </h3>
                  <p className="font-['DM_Sans'] text-sm sm:text-[14.5px] text-[#241A16]/80 leading-relaxed font-normal">
                    {current.desc}
                  </p>
                </div>

                {/* Studio Equipment & Tools Grid */}
                <div className="space-y-2.5">
                  <h4 className="font-['DM_Sans'] text-xs font-bold text-[#6B4030] flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>Tools & Equipment Provided:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {current.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-['DM_Sans'] font-medium bg-[#F7F2E8] text-[#241A16] border border-[#6B4030]/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Capabilities List */}
                <div className="space-y-2 pt-2 border-t border-[#6B4030]/15">
                  <h4 className="font-['DM_Sans'] text-xs font-bold text-[#6B4030]">
                    Core Learning Outcomes:
                  </h4>
                  <div className="space-y-1.5">
                    {current.capabilities.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-['DM_Sans'] text-[#241A16]/85">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Studio Bottom Bar */}
                <div className="pt-4 border-t border-[#6B4030]/15 flex items-center justify-between text-xs font-['DM_Sans'] text-[#6B4030]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>30–50 Students Cohort Batch</span>
                  </span>
                  <span className="font-semibold text-[#B89555]">
                    Open for 2026 Admissions
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
      </div>
    </section>
  );
}
