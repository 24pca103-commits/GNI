import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Hand,
  Sparkles,
  ArrowRight,
  Hammer,
  Palette,
  Flame,
  Layers,
} from 'lucide-react';
import Reveal from './Reveal';
import { fetchActiveCourses } from '../services/api';


// Fallback workshop presets in case API is temporarily unavailable
const DEFAULT_WORKSHOPS = [
  {
    id: 'tamil-heritage',
    tabLabel: 'Art & Epigraphy',
    tag: 'Immersive Masterclass',
    title: 'Ancient Tamil Art & Heritage Experience Workshop',
    subtitle: 'A one-day hands-on introduction to Tamil heritage, art and craftsmanship.',
    image: '/artisan/workshop.jpg',
    imageAlt: 'Tamil heritage workshop hands-on experience',
    feeBadge: 'Special Cohort Access',
    fee: '₹4,999',
    feeNote: 'Includes raw materials, inscription plate, and craft kit.',
    seatsInfo: 'Limited Seats (30–50 Seats) • Fee: ₹4,999',
    seatsDesc: 'Hands-on learning, live sthapathi guidance & take-home craft.',
    highlights: [
      { icon: Calendar, label: '1 Day Pilot Event' },
      { icon: Users, label: '30–50 People' },
      { icon: Hand, label: 'Hands-on Learning' },
      { icon: Sparkles, label: 'Photos & Videos Recorded' },
    ],
    activities: [
      'Basic Prehistoric Rock Painting',
      'Basic Tamili Writing',
      'Iconography Basics',
      'Intro to Naga Jewellery Concepts',
      'Temple Architecture',
      'Live Hands-on Experience (Simple Copper Plate Inscription Making)',
    ],
  },
  {
    id: 'sacred-metal',
    tabLabel: 'Naga Jewellery & Metal Art',
    tag: 'Artisan Metallurgy Forge',
    title: 'Sacred Metal Casting & Jewellery Workshop',
    subtitle: 'A masterclass on traditional lost-wax casting and antique Naga jewellery chasing.',
    image: '/artisan/pillar-metal.jpg',
    imageAlt: 'Sacred metal casting and Naga jewellery workshop',
    feeBadge: 'Guild Studio Access',
    fee: '₹5,499',
    feeNote: 'Includes brass alloy raw stock, chasing tools, and finished craft artifact.',
    seatsInfo: 'Limited Seats (25–35 Seats) • Fee: ₹5,499',
    seatsDesc: 'Direct sthapathi guild apprenticeship & custom cast souvenir.',
    highlights: [
      { icon: Calendar, label: '1 Day Intensive' },
      { icon: Users, label: '25–35 People' },
      { icon: Hand, label: 'Live Metal Chasing' },
      { icon: Sparkles, label: 'Artifact Take-Home' },
    ],
    activities: [
      'Traditional Lost-Wax Mold Preparation',
      'Sacred Dravidian Ornamental Motifs',
      'Repousse Chasing & Relief Hammering',
      'Antique Naga Coil Jewelry Fabrication',
      'Furnace Pouring & Brass Metallurgy',
      'Live Finishing, Polishing & Patina Chemistry',
    ],
  },
];

// Helper to determine if an offering qualifies as a workshop (Strictly 1-9 days course only)
function isWorkshopOffering(item) {
  if (!item) return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const dur = (item.duration || '').toLowerCase();
  const dayMatch = dur.match(/(\d+)\s*day/i);
  const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;

  // Strictly filter out long-term curriculum cohorts (10+ days / 30-day / 60-day)
  if (dayCount !== null && dayCount > 9) {
    return false;
  }
  if (
    title.includes('60-day') ||
    title.includes('60 day') ||
    title.includes('30-day') ||
    title.includes('30 day') ||
    dur.includes('60') ||
    dur.includes('30') ||
    cat.includes('journey') ||
    cat.includes('cohort')
  ) {
    return false;
  }

  // 1-9 days course only view
  if (dayCount !== null && dayCount <= 9) {
    return true;
  }

  if (cat.includes('workshop') || title.includes('workshop')) {
    return true;
  }

  return false;
}

// Clean and sanitize activity texts (filters out accidental error stack traces or overly long blocks)
function cleanActivityText(text) {
  if (!text) return '';
  const str = String(text).trim();
  if (
    str.includes('react-dom') ||
    str.includes('ReferenceError') ||
    str.includes('WorkshopSection') ||
    str.includes('Uncaught') ||
    str.includes('React DevTools')
  ) {
    return 'Hands-on Heritage Craft & Inscription Practice';
  }
  if (str.length > 95) {
    const firstPart = str.split(/[.\n;]/)[0];
    return firstPart && firstPart.length >= 10 && firstPart.length <= 95
      ? firstPart.trim()
      : str.slice(0, 90).trim() + '...';
  }
  return str;
}

function mapCourseToWorkshop(c) {
  const parsedActivities = c.highlights
    ? c.highlights
        .split(/[;\n,]/)
        .map((s) => cleanActivityText(s))
        .filter(Boolean)
    : [];

  const activities =
    parsedActivities.length > 0
      ? parsedActivities
      : [
          'Prehistoric Rock Painting',
          'Tamili Script Practice',
          'Iconography Basics & Sacred Geometry',
          'Live Hands-on Studio Practice',
        ];

  const priceNum = Number(c.discount_price || c.original_price || 4999);
  const formattedFee = `₹${priceNum.toLocaleString('en-IN')}`;

  return {
    id: String(c.id || c.slug),
    tabLabel: c.title,
    tag: c.badge || 'Hands-on Intensive Workshop (1–9 Days)',
    title: c.title,
    subtitle:
      c.description ||
      'A hands-on introduction to Tamil heritage, authentic art canons, and ancestral craftsmanship.',
    image: c.image_url || '/artisan/workshop.jpg',
    imageAlt: c.title,
    feeBadge: c.badge || 'Special Access',
    fee: formattedFee,
    feeNote: 'Includes raw materials, inscription plate, and certified craft kit.',
    seatsInfo:
      Number(c.seats_available) === 0
        ? `Full Capacity (0 Seats Available) • Fee: ${formattedFee}`
        : `Seats Available: ${c.seats_available ?? 30} / ${c.seats_total ?? 50} • Fee: ${formattedFee}`,
    seatsDesc: `${c.mode || 'Hands-on learning'}, live sthapathi guidance & take-home craft.`,
    isFull: Number(c.seats_available) === 0,
    highlights: [
      { icon: Calendar, label: c.duration || '1 Day Intensive' },
      { icon: Users, label: `${c.seats_total || 50} Max Seats` },
      { icon: Hand, label: c.mode || 'Hands-on Learning' },
      { icon: Sparkles, label: 'Photos & Certificate' },
    ],
    activities,
  };
}

export default function WorkshopSection() {
  const [workshops, setWorkshops] = useState(DEFAULT_WORKSHOPS);
  const [activeWorkshopIndex, setActiveWorkshopIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const loadWorkshops = async () => {
      try {
        const liveOfferings = await fetchActiveCourses();
        if (isMounted && liveOfferings && liveOfferings.length > 0) {
          const filtered = liveOfferings.filter(isWorkshopOffering);
          if (filtered.length > 0) {
            setWorkshops(filtered.map(mapCourseToWorkshop));
          }
        }
      } catch (err) {
        console.warn('[WorkshopSection] Using fallback workshops:', err);
      }
    };

    loadWorkshops();

    const handleStorageChange = (e) => {
      if (e.key === 'gni_custom_courses') {
        loadWorkshops();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const safeIndex = activeWorkshopIndex < workshops.length ? activeWorkshopIndex : 0;
  const currentWorkshop = workshops[safeIndex] || workshops[0] || DEFAULT_WORKSHOPS[0];
  const highlights = currentWorkshop.highlights || [];
  const activities = currentWorkshop.activities || [];

  return (
    <section id="workshop" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A2C20] border border-[#B89555]/40 text-[#E5B869] text-xs sm:text-sm font-['DM_Sans'] font-semibold mb-3 shadow-xs leading-normal">
              <Hammer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5B869]" />
              <span>{currentWorkshop.tag || 'Hands-on Intensive Workshop (1–9 Days)'}</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-normal pb-1">
              {currentWorkshop.title}
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-center mx-auto max-w-2xl">
              {currentWorkshop.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Clean Static Non-Sliding Workshop Selection Cards */}
        {workshops.length > 1 && (
          <Reveal direction="up" delay={120}>
            <div className="max-w-3xl mx-auto mb-7 sm:mb-9">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B89555] animate-pulse" />
                  <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider">
                    Select Intensive Workshop
                  </span>
                </div>
                <span className="font-['DM_Sans'] text-xs font-medium text-[#6B4030]">
                  {safeIndex + 1} of {workshops.length} Selected
                </span>
              </div>

              {/* Static Responsive Grid (Zero Horizontal Sliding / Scrolling) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                {workshops.map((ws, idx) => {
                  const isCurrent = safeIndex === idx;
                  const icons = [Hammer, Flame, Palette, Layers];
                  const Icon = icons[idx % icons.length];

                  return (
                    <button
                      key={ws.id}
                      type="button"
                      onClick={() => setActiveWorkshopIndex(idx)}
                      className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl text-left transition-all duration-200 cursor-pointer border flex items-center justify-between gap-3 select-none ${
                        isCurrent
                          ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#B89555] shadow-md ring-2 ring-[#B89555]/30'
                          : 'bg-white hover:bg-[#FAF6EE] text-[#241A16] border-[#6B4030]/20 hover:border-[#B89555]/40 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isCurrent ? 'bg-[#B89555] text-[#241A16]' : 'bg-[#4A2C20]/10 text-[#6B4030]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span
                            className={`block text-xs sm:text-sm font-['DM_Sans'] font-bold truncate ${
                              isCurrent ? 'text-white' : 'text-[#241A16]'
                            }`}
                          >
                            {ws.tabLabel}
                          </span>
                          <span
                            className={`block text-[11px] font-['DM_Sans'] ${
                              isCurrent ? 'text-[#E5B869]' : 'text-[#6B4030]'
                            }`}
                          >
                            {ws.highlights?.[0]?.label || 'Hands-on Intensive'}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-number font-bold leading-normal inline-flex items-center ${
                            isCurrent
                              ? 'bg-[#B89555] text-[#241A16]'
                              : 'bg-[#FAF7F0] text-[#6B4030] border border-[#6B4030]/15'
                          }`}
                        >
                          {ws.fee}
                        </span>
                        {isCurrent && (
                          <span className="w-2 h-2 rounded-full bg-[#E5B869] shadow-[0_0_8px_#E5B869] animate-pulse" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Master Showcase Card */}
        <Reveal direction="up" delay={200}>
          <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#6B4030]/15 shadow-sm grid lg:grid-cols-12 items-stretch">
            {/* Left Column: Workshop Visual with Solid Overlay */}
            <div className="lg:col-span-5 relative bg-[#241A16] h-64 sm:h-80 lg:h-auto min-h-[260px] sm:min-h-[340px] lg:min-h-full">
              <img
                src={currentWorkshop.image}
                alt={currentWorkshop.imageAlt}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/artisan/workshop.jpg';
                }}
              />

              {/* Floating Fee Badge on Image - Compact Height */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3.5 sm:left-3.5 sm:right-3.5 bg-[#241A16]/90 backdrop-blur-sm py-1.5 px-3 sm:py-2.5 sm:px-4 rounded-lg sm:rounded-xl border border-[#B89555]/40 text-[#F7F2E8] space-y-0.5 sm:space-y-1 shadow-md">
                <span className="font-['DM_Sans'] text-[9px] sm:text-[10.5px] text-[#B89555] font-semibold uppercase tracking-wider block leading-tight">
                  {currentWorkshop.feeBadge || 'Special Cohort Access'}
                </span>
                <p className="font-['Cormorant_Garamond'] text-sm sm:text-lg lg:text-xl font-bold text-white leading-tight">
                  Fee: <span className="font-number text-[#B89555]">{currentWorkshop.fee}</span>
                </p>
                <p className="font-['DM_Sans'] text-[9.5px] sm:text-[11px] text-[#F7F2E8]/85 leading-tight line-clamp-1 sm:line-clamp-2">
                  {currentWorkshop.feeNote}
                </p>
              </div>
            </div>

            {/* Right Column: Workshop Details, Activities & Working Register Button */}
            <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-between space-y-5 sm:space-y-6">
              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15 text-center space-y-0.5 sm:space-y-1"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B4030] mx-auto" />
                      <p className="font-['DM_Sans'] text-[11px] sm:text-xs font-medium text-[#241A16] leading-tight">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Workshop Activities (Old Structure: Clean Uniform Cards, No Stage Highlights) */}
              <div className="space-y-2.5 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-[#6B4030]/15 pb-1.5 sm:pb-2">
                  <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-2xl font-bold text-[#241A16]">
                    Hands-on Activities
                  </h3>
                  <span className="font-['DM_Sans'] text-[11px] sm:text-xs text-[#6B4030] font-medium">
                    <span className="font-number font-bold">{activities.length}</span> Practical Modules
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                  {activities.map((act, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#F7F2E8]/60 border border-[#6B4030]/15 ${
                        activities.length === 1 ? 'sm:col-span-2' : ''
                      }`}
                    >
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#4A2C20] text-[#B89555] text-[10px] sm:text-xs font-number font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-['DM_Sans'] text-[11.5px] sm:text-[13px] font-normal text-[#241A16] leading-tight">
                        {act}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functional CTA Button to /register */}
              <div className="pt-4 border-t border-[#6B4030]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left space-y-1">
                  <p className="font-['DM_Sans'] text-xs text-[#6B4030] font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>{currentWorkshop.seatsInfo}</span>
                  </p>
                  <p className="font-['DM_Sans'] text-[11px] sm:text-xs text-[#241A16]/80 leading-snug">
                    {currentWorkshop.seatsDesc}
                  </p>
                </div>

                {currentWorkshop.isFull ? (
                  <span className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-red-800 bg-red-100/90 border border-red-300 cursor-not-allowed shrink-0">
                    <span>Workshop Full</span>
                  </span>
                ) : (
                  <Link
                    to={`/register?course=${encodeURIComponent(currentWorkshop.title)}&duration=${encodeURIComponent(currentWorkshop.highlights?.[0]?.label?.match(/\d+\s*day[s]?/i)?.[0] || '1 Day')}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all duration-200 cursor-pointer shrink-0"
                  >
                    <span>Register for Workshop</span>
                    <ArrowRight className="w-4 h-4 text-[#241A16]" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
