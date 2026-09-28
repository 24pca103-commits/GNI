import React, { useState, useEffect, useRef } from 'react';
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
      image: '/artisan/studio-iconography.jpg',
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
      image: '/artisan/studio-pigments.jpg',
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
      image: '/artisan/studio-library.jpg',
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

  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const isInteractingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Tripled list for infinite looping without jump
  const displayList = [...facilities, ...facilities, ...facilities];

  // Continuous smooth auto-scroll loop for the icon track
  useEffect(() => {
    let animId;
    const speed = 0.5; // gentle smooth auto-scroll speed

    const step = () => {
      const el = scrollRef.current;
      if (el && !isInteractingRef.current) {
        el.scrollLeft += speed;
        const oneThird = el.scrollWidth / 3;
        if (el.scrollLeft >= oneThird * 2) {
          el.scrollLeft -= oneThird;
        } else if (el.scrollLeft <= 0) {
          el.scrollLeft += oneThird;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Auto-cycle the active facility card every 5 seconds when not interacting
  useEffect(() => {
    const timer = setInterval(() => {
      if (!isInteractingRef.current) {
        setActiveIndex((prev) => (prev + 1) % facilities.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [facilities.length]);

  // Mouse Drag Handlers
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    isInteractingRef.current = true;
    startXRef.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
    scrollLeftRef.current = scrollRef.current?.scrollLeft || 0;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setTimeout(() => {
      if (!isDraggingRef.current) {
        isInteractingRef.current = false;
      }
    }, 1500);
  };

  const handleMouseEnter = () => {
    isInteractingRef.current = true;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    isInteractingRef.current = false;
  };

  // Touch Handlers
  const handleTouchStart = () => {
    isInteractingRef.current = true;
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isInteractingRef.current = false;
    }, 1500);
  };

  const current = facilities[activeIndex] || facilities[0];
  const CurrentIcon = current ? current.icon : facilities[0].icon;

  return (
    <section id="facilities" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles in Background */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-4 sm:mb-8">
            <span className="inline-block px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-[11px] sm:text-xs font-['DM_Sans'] font-medium mb-1.5 sm:mb-2.5">
              Infrastructure & Studios
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Repository Studios & Facilities
            </h2>
            <div className="w-14 sm:w-16 h-0.5 bg-[#B89555] mx-auto mt-1.5 sm:mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-xs sm:text-base text-[#6B4030] font-normal leading-relaxed text-justify indent-5 sm:indent-0 sm:text-center sm:mx-auto max-w-2xl">
              Explore our 6 dedicated purpose-built spaces designed for tactile craftsmanship and epigraphical study.
            </p>
          </div>
        </Reveal>

        {/* Auto-Scrolling & Manual Drag/Swipe Icon Carousel */}
        <Reveal direction="up" delay={150}>
          <div className="relative mb-4 sm:mb-8 max-w-4xl mx-auto py-2">
            {/* Soft fade masks on left and right edges */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#F7F2E8] via-[#F7F2E8]/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#F7F2E8] via-[#F7F2E8]/80 to-transparent z-10" />

            {/* Scrollable Icon Container */}
            <div
              ref={scrollRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="flex items-center gap-4 sm:gap-8 overflow-x-auto no-scrollbar py-3 px-6 cursor-grab active:cursor-grabbing select-none"
            >
              {displayList.map((fac, idx) => {
                const Icon = fac.icon;
                const isSelected = activeIndex === fac.id;

                return (
                  <button
                    key={`${fac.id}-${idx}`}
                    onClick={() => setActiveIndex(fac.id)}
                    className="flex flex-col items-center justify-center shrink-0 transition-all duration-300 cursor-pointer group focus:outline-hidden min-w-[90px] sm:min-w-[120px]"
                  >
                    {/* Round Shape Icon Container */}
                    <div
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#4A2C20] text-[#B89555] ring-2 sm:ring-4 ring-[#B89555]/50 shadow-md scale-105 sm:scale-110'
                          : 'bg-white border border-[#6B4030]/20 text-[#6B4030] group-hover:bg-[#4A2C20] group-hover:text-[#B89555] group-hover:scale-105 shadow-xs opacity-80 group-hover:opacity-100'
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>

                    {/* Title Below Icon */}
                    <span
                      className={`text-[10px] sm:text-xs font-['DM_Sans'] mt-1.5 sm:mt-2.5 max-w-[90px] sm:max-w-[120px] text-center leading-tight line-clamp-1 transition-colors ${
                        isSelected ? 'font-bold text-[#241A16]' : 'font-medium text-[#6B4030]'
                      }`}
                    >
                      {fac.title}
                    </span>

                    {/* Active Dot/Bar */}
                    {isSelected ? (
                      <span className="w-4 h-1 sm:w-6 sm:h-1 rounded-full bg-[#B89555] mt-1 transition-all" />
                    ) : (
                      <span className="w-1 h-1 rounded-full bg-transparent mt-1" />
                    )}
                  </button>
                );
              })}
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
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-[#6B4030]/15 shadow-[0_12px_28px_-6px_rgba(74,44,32,0.12)] grid lg:grid-cols-12 gap-4 sm:gap-8 items-center relative overflow-hidden transition-all duration-500"
            >
              {/* Left Column: Authentic Studio Visual with Details */}
              <div className="lg:col-span-6 relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#241A16] h-48 sm:h-[340px] md:h-[420px] group">
                <img
                  src={current.image}
                  alt={current.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-[#241A16]/20" />

                {/* Top Category Tag */}
                <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-[#241A16]/90 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-xl border border-[#B89555]/30 text-[#B89555] text-[9.5px] sm:text-xs font-['DM_Sans'] font-medium flex items-center gap-1 sm:gap-1.5 shadow-sm">
                  <CurrentIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#B89555]" />
                  <span className="text-[#F7F2E8]">{current.category}</span>
                </div>

                {/* Bottom Curator Panel (Desktop Only to save mobile space) */}
                <div className="hidden sm:flex absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-[#241A16]/90 p-1.5 sm:p-4 rounded-md sm:rounded-xl border border-[#B89555]/40 text-[#F7F2E8] items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[11px] font-['DM_Sans'] text-[#B89555] font-semibold block leading-tight">
                      Lead Supervisor
                    </span>
                    <p className="font-['DM_Sans'] text-[10px] sm:text-xs text-white font-medium leading-tight">
                      {current.curator}
                    </p>
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#B89555]" />
                </div>
              </div>

              {/* Right Column: Clean Workbench Specifications */}
              <div className="lg:col-span-6 space-y-3 sm:space-y-6 text-left">
                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-['DM_Sans'] text-[#6B4030]">
                    <CurrentIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#B89555]" />
                    <span>Facility Specification <span className="font-number font-bold text-[#B89555]">{activeIndex + 1}</span></span>
                  </div>
                  <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-4xl font-bold text-[#241A16] tracking-tight leading-tight">
                    {current.title}
                  </h3>
                  <p className="font-['DM_Sans'] text-xs sm:text-[14.5px] text-[#241A16]/85 leading-relaxed font-normal text-justify indent-4 sm:indent-0">
                    {current.desc}
                  </p>
                </div>

                {/* Studio Equipment & Tools Grid (Desktop / Tablet only to prevent mobile clutter) */}
                <div className="hidden sm:block space-y-2.5">
                  <h4 className="font-['DM_Sans'] text-xs font-bold text-[#6B4030] flex items-center gap-1">
                    <Wrench className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>Tools & Equipment:</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {current.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg text-xs font-['DM_Sans'] font-medium bg-[#F7F2E8] text-[#241A16] border border-[#6B4030]/20 leading-tight"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Practical Capabilities List */}
                <div className="space-y-1 sm:space-y-2 pt-1.5 sm:pt-2 border-t border-[#6B4030]/15">
                  <h4 className="font-['DM_Sans'] text-[10px] sm:text-xs font-bold text-[#6B4030]">
                    Key Learning Outcomes:
                  </h4>
                  <div className="space-y-1 sm:space-y-1.5">
                    {current.capabilities.slice(0, 2).map((c, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10.5px] sm:text-xs font-['DM_Sans'] text-[#241A16]/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" />
                        <span className="leading-snug">{c}</span>
                      </div>
                    ))}
                    {current.capabilities.slice(2).map((c, idx) => (
                      <div key={idx + 2} className="hidden sm:flex items-center gap-2 text-xs font-['DM_Sans'] text-[#241A16]/85">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" />
                        <span className="leading-snug">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Studio Bottom Bar (Desktop Only) */}
                <div className="hidden sm:flex pt-4 border-t border-[#6B4030]/15 items-center justify-between text-xs font-['DM_Sans'] text-[#6B4030]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>30–50 Students Batch</span>
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
