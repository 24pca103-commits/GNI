import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Pencil,
  FileCode2,
  Paintbrush,
  Sparkles,
  Flame,
  Briefcase,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  BookOpen,
  Hammer,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';
import { fetchActiveCourses } from '../services/api';

// Permanent Field Visit Banner Configuration
const DEFAULT_FIELD_VISIT = {
  tag: 'Immersive Experience',
  badge: '★ Guided by historians',
  title: 'Includes an On-Site Field Visit',
  desc: 'Direct hands-on archaeological exploration of ancient temple rock inscriptions, heritage guilds, and active master artisan workshops across Tamil Nadu.',
  image: '/artisan/field-visit-banner.png',
};

// Multi-Journey Configuration
const DEFAULT_JOURNEYS = [
  {
    id: '60-day',
    tabLabel: '60-Day Full Cohort',
    badge: 'Comprehensive Guild Syllabus',
    title: '60-Day Heritage Creator Journey',
    subtitle: 'A transformative 6-phase curriculum uniting ancient shilpa shastra, epigraphy, natural pigments, and tactile brass metallurgy.',
    duration: '60 Days',
    totalHours: '360 Total Hours (90h Theory • 270h Tactile Studio)',
    mode: 'Studio Immersion + 1 Field Visit',
    steps: [
      {
        period: 'Day 1–10',
        phase: 'Phase 01',
        title: 'Drawing & Sacred Proportions',
        desc: 'Master foundational shilpa geometric grids, traditional drafting styles, and divine temple proportions.',
        icon: Pencil,
        theoryHours: '15h Theory',
        studioHours: '45h Drafting Studio',
        details: 'Line geometry, sacred motifs, ancient grid systems, and palm-leaf stylus drafting.',
        materials: ['Natural graphite', 'Bamboo stylus', 'Handmade cotton paper', 'Proportion calipers'],
        outcome: 'Precision Temple Shilpa Proportion Grid & Sacred Motif Portfolio',
      },
      {
        period: 'Day 11–20',
        phase: 'Phase 02',
        title: 'Tamili Brahmi & Epigraphy',
        desc: 'Decipher ancient Tamil Brahmi scripts, understand copper plate royal charters, and learn rock scribing.',
        icon: FileCode2,
        theoryHours: '15h Theory',
        studioHours: '45h Epigraphy Studio',
        details: 'Deciphering Brahmi epigraphy, copper plate scribing, stylus handling, and rubbing archival prints.',
        materials: ['Annealed copper sheets', 'Hardened steel styluses', 'Ink rubbing pads', 'Palm-leaf manuscripts'],
        outcome: 'Hand-Scribed Copper Inscription Charter Tablet in Ancient Tamili',
      },
      {
        period: 'Day 21–30',
        phase: 'Phase 03',
        title: 'Natural Pigments & Rock Art',
        desc: 'Extract, grind, and concoct prehistoric earth pigments using raw minerals, sap, and authentic rock binders.',
        icon: Paintbrush,
        theoryHours: '12h Theory',
        studioHours: '48h Pigment Studio',
        details: 'Natural mineral pigments, prehistoric rock art techniques, natural fixatives, and limestone fresco washes.',
        materials: ['Raw red ochre & yellow limonite', 'Granite mortar & pestle', 'Neem gum binder', 'Lime plaster slab'],
        outcome: 'Authentic Mineral Pigment Mural Artwork Tablet on Prepared Lime Plaster',
      },
      {
        period: 'Day 31–40',
        phase: 'Phase 04',
        title: 'Iconography & Spiritual Geometry',
        desc: 'Encode philosophical and spiritual symbolism into sculptural silhouettes and sacred Dravidian deity forms.',
        icon: Sparkles,
        theoryHours: '18h Theory',
        studioHours: '42h Clay Modeling Studio',
        details: 'Deity proportions, spiritual geometry, traditional shilpa canons, and relief clay modeling.',
        materials: ['Riverbed terracotta clay', 'Boxwood sculpting ribs', 'Proportion compasses', 'Canonic manuscripts'],
        outcome: 'Full-Scale Traditional Iconographical Sculptural Relief Model',
      },
      {
        period: 'Day 41–50',
        phase: 'Phase 05',
        title: 'Artisan Metallurgy & Naga Jewellery',
        desc: 'Introduction to tactile brass sheet forming, repoussé relief chasing, and sacred Naga ornamental metallurgy.',
        icon: Flame,
        theoryHours: '12h Theory',
        studioHours: '48h Forge & Chasing Studio',
        details: 'Brass sheet forming, pitch bowl repoussé, sacred naga ornamental motifs, and antique soldering.',
        materials: ['Jewellery brass alloy', 'Pine pitch chasing bowl', 'Assorted chasing chisels', 'Hardwood mallet'],
        outcome: 'Chased Sacred Naga Repoussé Medallion in Solid Brass',
      },
      {
        period: 'Day 51–60',
        phase: 'Phase 06',
        title: 'Commercial Production & Field Visit',
        desc: 'Apply ancestral heritage craftsmanship to modern luxury interiors, bespoke jewellery, and participate in an on-site field study.',
        icon: Briefcase,
        theoryHours: '10h Theory',
        studioHours: '50h Portfolio & Field Studio',
        details: 'Textiles, interior design, branding, pooja decor, livelihood + 1 immersive field visit.',
        materials: ['Commercial design templates', 'Curated exhibition mounts', 'Field study sketchbook', 'Certificate portfolio'],
        outcome: 'Comprehensive Heritage Creator Commercial Portfolio & Guild Credential',
      },
    ],
    fieldVisit: DEFAULT_FIELD_VISIT,
  },
  {
    id: '30-day',
    tabLabel: '30-Day Foundation Sprint',
    badge: 'Accelerated Studio Sprint',
    title: '30-Day Heritage Foundation Track',
    subtitle: 'An intensive studio sprint focusing on sacred geometric drafting, Tamili epigraphy, and natural mineral fresco pigments.',
    duration: '30 Days',
    totalHours: '180 Total Hours (45h Theory • 135h Studio Practice)',
    mode: 'Intensive Studio Sprint',
    steps: [
      {
        period: 'Day 1–10',
        phase: 'Phase 01',
        title: 'Drawing & Line Geometry',
        desc: 'Sacred Dravidian proportion grids, kolam mathematics, and precision temple line fundamentals.',
        icon: Pencil,
        theoryHours: '15h Theory',
        studioHours: '45h Drafting Studio',
        details: 'Foundational temple drafting, kolam mathematics, and sacred geometry.',
        materials: ['Natural graphite', 'Precision proportion dividers', 'Handmade cotton rag paper'],
        outcome: 'Mastered Sacred Dravidian Proportion Grids & Line Canons',
      },
      {
        period: 'Day 11–20',
        phase: 'Phase 02',
        title: 'Tamili Inscriptions & Palm Leaf',
        desc: 'Ancient script scribing, copper plate epigraphy, and archival palm-leaf stylus decoding.',
        icon: FileCode2,
        theoryHours: '15h Theory',
        studioHours: '45h Scribing Studio',
        details: 'Tamili Brahmi letterforms, stylus handling, and copper plate rubbings.',
        materials: ['Annealed copper sheet', 'Engraving stylus', 'Traditional archival ink'],
        outcome: 'Engraved Traditional Tamili Inscription Plaque',
      },
      {
        period: 'Day 21–30',
        phase: 'Phase 03',
        title: 'Natural Pigments & Mural Art',
        desc: 'Raw mineral grinding, natural binder blending, and authentic lime fresco tablet painting.',
        icon: Paintbrush,
        theoryHours: '15h Theory',
        studioHours: '45h Fresco Studio',
        details: 'Raw rock pigment preparation, organic binders, and sample fresco tablet.',
        materials: ['Natural earth minerals', 'Granite pestle', 'Fresco plaster tablet'],
        outcome: 'Finished Natural Mineral Pigment Fresco Tablet',
      },
    ],
    fieldVisit: DEFAULT_FIELD_VISIT,
  },
];

function isJourneyOffering(item) {
  if (!item) return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const dur = (item.duration || '').toLowerCase();
  const dayMatch = dur.match(/(\d+)\s*day/i);
  const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;

  if (dayCount !== null && dayCount <= 9) return false;
  if (cat.includes('workshop') || title.includes('workshop')) return false;
  if (dayCount !== null && dayCount >= 10) return true;
  if (
    cat.includes('journey') ||
    cat.includes('cohort') ||
    title.includes('60-day') ||
    title.includes('60 day') ||
    title.includes('30-day') ||
    title.includes('30 day') ||
    dur.includes('60') ||
    dur.includes('30')
  ) {
    return true;
  }
  return false;
}

const STEP_ICONS = [Pencil, FileCode2, Paintbrush, Sparkles, Flame, Briefcase];

function mapCourseToJourney(c, index) {
  const slug = (c.slug || '').toLowerCase();
  const title = (c.title || '').toLowerCase();

  let customSteps = null;
  if (typeof c.highlights === 'string' && c.highlights.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(c.highlights);
      if (Array.isArray(parsed) && parsed.length > 0) {
        customSteps = parsed.map((st, i) => ({
          period: st.period || `Day ${i * 10 + 1}–${(i + 1) * 10}`,
          phase: `Phase 0${i + 1}`,
          title: st.title || `Phase ${i + 1}`,
          desc: st.desc || st.details || `${st.title} structured module with expert guild guidance.`,
          icon: STEP_ICONS[i % STEP_ICONS.length],
          theoryHours: st.theoryHours || '15h Theory',
          studioHours: st.studioHours || '45h Studio',
          details: st.details || `${c.mode || 'Studio practice'} focusing on ${st.title}.`,
          materials: st.materials || ['Sacred Shastric Canons', 'Guild Tools', 'Dedicated Studio Workstation'],
          outcome: st.outcome || `Master ${st.title} with authentic hands-on execution.`,
        }));
      }
    } catch (_) {}
  }

  if (c.id === 201 || slug.includes('60-day') || title.includes('60-day')) {
    return {
      ...DEFAULT_JOURNEYS[0],
      title: c.title || DEFAULT_JOURNEYS[0].title,
      subtitle: c.description || DEFAULT_JOURNEYS[0].subtitle,
      badge: c.badge || DEFAULT_JOURNEYS[0].badge,
      steps: customSteps || DEFAULT_JOURNEYS[0].steps,
      fieldVisit: DEFAULT_FIELD_VISIT,
    };
  }
  if (c.id === 202 || slug.includes('30-day') || title.includes('30-day')) {
    return {
      ...DEFAULT_JOURNEYS[1],
      title: c.title || DEFAULT_JOURNEYS[1].title,
      subtitle: c.description || DEFAULT_JOURNEYS[1].subtitle,
      badge: c.badge || DEFAULT_JOURNEYS[1].badge,
      steps: customSteps || DEFAULT_JOURNEYS[1].steps,
      fieldVisit: DEFAULT_FIELD_VISIT,
    };
  }

  let steps = customSteps || [];

  if (steps.length === 0) {
    const parsedActivities = c.highlights
      ? c.highlights.split(/[;\n]/).map((s) => s.trim()).filter(Boolean)
      : [];

    const activities = parsedActivities.length > 0 ? parsedActivities : [
      'Foundational Sacred Geometry',
      'Epigraphy & Tamili Inscriptions',
      'Raw Mineral Pigments & Fresco',
      'Final Hands-on Masterwork'
    ];

    steps = activities.map((act, i) => {
      const match = act.match(/^(Day\s*[\d–-]+)\s*:\s*(.+)$/i);
      const period = match ? match[1] : `Day ${i * 10 + 1}–${(i + 1) * 10}`;
      const stepTitle = match ? match[2] : act;
      return {
        period,
        phase: `Phase 0${i + 1}`,
        title: stepTitle,
        desc: `${stepTitle} structured curriculum module with master sthapathi studio mentoring.`,
        icon: STEP_ICONS[i % STEP_ICONS.length],
        theoryHours: '15h Theory',
        studioHours: '45h Studio',
        details: `${c.mode || 'Studio practice'} focusing on ${stepTitle}.`,
        materials: ['Sacred Shastric Canons', 'Guild Tools', 'Dedicated Studio Workstation'],
        outcome: `Master ${stepTitle} with authentic hands-on execution.`,
      };
    });
  }

  return {
    id: String(c.id || c.slug || `custom-journey-${index}`),
    tabLabel: c.title,
    badge: c.pillar_title ? `Pillar: ${c.pillar_title}` : (c.badge || `${c.duration || 'Structured'} Journey`),
    duration: c.duration || `${steps.length * 10} Days`,
    totalHours: `${steps.length * 60} Total Hours (${steps.length * 15}h Theory • ${steps.length * 45}h Studio)`,
    mode: c.mode || 'Full Cohort Immersion',
    title: c.title,
    subtitle: c.description || 'Hands-on heritage learning journey and authentic craft immersion.',
    steps,
    fieldVisit: DEFAULT_FIELD_VISIT,
  };
}

export default function LearningJourney() {
  const [journeys, setJourneys] = useState(DEFAULT_JOURNEYS);
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const stepperRef = useRef(null);
  const sectionRef = useRef(null);
  const isInViewRef = useRef(false);

  // Mouse drag-to-slide & touch swipe state
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);
  const isHoveredRef = useRef(false);
  const animationFrameRef = useRef(null);

  // Observe if LearningJourney is visible in viewport so auto-slide only runs when looking at this section
  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Strictly horizontal container scrolling (never touches window vertical scroll!)
  const scrollPhaseIntoCenter = (btnIndex) => {
    if (!stepperRef.current) return;
    const buttons = stepperRef.current.querySelectorAll('[data-phase-btn]');
    const targetBtn = buttons[btnIndex];
    if (!targetBtn) return;
    const container = stepperRef.current;
    const btnLeft = targetBtn.offsetLeft;
    const btnWidth = targetBtn.offsetWidth;
    const containerWidth = container.clientWidth;
    const targetScroll = btnLeft - containerWidth / 2 + btnWidth / 2;
    container.scrollTo({
      left: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  };

  const handleMouseDown = (e) => {
    if (!stepperRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - stepperRef.current.offsetLeft;
    scrollLeftRef.current = stepperRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !stepperRef.current) return;
    e.preventDefault();
    const x = e.pageX - stepperRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    stepperRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
  };

  const handleWheel = (e) => {
    if (stepperRef.current && Math.abs(e.deltaY) > 0) {
      stepperRef.current.scrollLeft += e.deltaY * 0.8;
    }
  };

  const scrollStep = (direction) => {
    if (!stepperRef.current) return;
    const scrollAmount = 240;
    stepperRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    let isMounted = true;
    const loadJourneys = async () => {
      try {
        const liveOfferings = await fetchActiveCourses();
        if (isMounted && liveOfferings && liveOfferings.length > 0) {
          const filtered = liveOfferings.filter(isJourneyOffering);
          if (filtered.length > 0) {
            setJourneys(filtered.map(mapCourseToJourney));
          }
        }
      } catch (err) {
        console.warn('[LearningJourney] Using fallback journeys:', err);
      }
    };

    loadJourneys();

    window.addEventListener('storage', loadJourneys);
    window.addEventListener('focus', loadJourneys);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadJourneys);
      window.removeEventListener('focus', loadJourneys);
    };
  }, []);

  const currentJourney = journeys[activeJourneyIndex] || journeys[0] || DEFAULT_JOURNEYS[0];
  const steps = currentJourney.steps || [];

  // 1. Auto-slide active phase every 4.5s continuously when steps > 1, paused on hover, drag, or when section not in view
  useEffect(() => {
    if (steps.length <= 1) return;

    const interval = setInterval(() => {
      if (!isInViewRef.current) return; // Do NOT auto-slide if user is reading another section like Workshop!
      if (!isHoveredRef.current && !isDraggingRef.current) {
        setActiveStep((prev) => {
          const next = (prev + 1) % steps.length;
          scrollPhaseIntoCenter(next);
          return next;
        });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [steps.length]);

  // 2. Continuous horizontal gliding loop when > 8 phase cards exist (>90 Days)
  useEffect(() => {
    if (steps.length <= 8) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const scrollSpeed = 0.55;

    const loopTicker = () => {
      if (isInViewRef.current && stepperRef.current && !isDraggingRef.current && !isHoveredRef.current) {
        const el = stepperRef.current;
        const halfWidth = el.scrollWidth / 2;
        if (halfWidth > 0 && el.scrollLeft >= halfWidth) {
          el.scrollLeft -= halfWidth;
        } else {
          el.scrollLeft += scrollSpeed;
        }
      }
      animationFrameRef.current = requestAnimationFrame(loopTicker);
    };

    animationFrameRef.current = requestAnimationFrame(loopTicker);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [steps.length]);

  const isLooping = steps.length > 8;
  const displaySteps = isLooping ? [...steps, ...steps] : steps;

  // Safe active step guard
  const safeStepIndex = activeStep < steps.length ? activeStep : 0;
  const currentStep = steps[safeStepIndex] || steps[0];
  const ActiveIcon = currentStep?.icon || Pencil;

  const handleSelectPhase = (idx) => {
    const targetIdx = idx % steps.length;
    setActiveStep(targetIdx);
    scrollPhaseIntoCenter(idx);
  };

  return (
    <section ref={sectionRef} id="learning-journey" className="py-12 md:py-16 bg-[#F7F2E8] relative overflow-hidden">
      {/* Ambient Floating Elements */}
      <FloatingBubbles count={12} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Institutional Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 px-2 min-w-0">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A2C20] border border-[#B89555]/40 text-[#E5B869] text-xs sm:text-sm font-['DM_Sans'] font-semibold mb-3.5 shadow-xs leading-normal">
              <GraduationCap className="w-4 h-4 text-[#E5B869]" />
              <span>Structured Curriculum &amp; Cohort Syllabus</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight pb-1 break-words [overflow-wrap:break-word] hyphens-none min-w-0 max-w-full">
              {currentJourney.title}
            </h2>
            <div className="w-20 h-0.5 bg-[#B89555] mx-auto mt-3" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-center mx-auto max-w-2xl break-words [overflow-wrap:break-word] hyphens-none min-w-0 max-w-full">
              {currentJourney.subtitle}
            </p>

            {/* Academic Spec Ribbon */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-['DM_Sans'] text-[#6B4030]">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B4030]/15 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-[#B89555]" />
                <strong className="text-[#4A2C20]">{currentJourney.duration}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B4030]/15 shadow-2xs">
                <BookOpen className="w-3.5 h-3.5 text-[#B89555]" />
                <span>{steps.length} Modular Phases</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#6B4030]/15 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B89555]" />
                <span>Guild Certified Sthapathi Mentorship</span>
              </span>
            </div>
          </div>
        </Reveal>

        {/* Modern Compact Cohort Program Selector Deck */}
        {journeys.length > 1 && (
          <Reveal direction="up" delay={120}>
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 px-2 sm:px-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 px-1">
                <div>
                  <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B89555] animate-pulse" />
                    Select Cohort Program
                  </span>
                </div>
                <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#6B4030]/15 text-[#4A2C20] font-['DM_Sans'] text-[11px] font-semibold shadow-2xs">
                  <span>Track {activeJourneyIndex + 1} of {journeys.length}</span>
                </span>
              </div>

              <div
                className={`grid ${
                  journeys.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                } gap-2.5 sm:gap-3`}
              >
                {journeys.map((journey, idx) => {
                  const isCurrent = activeJourneyIndex === idx;
                  return (
                    <button
                      key={journey.id}
                      type="button"
                      onClick={() => {
                        setActiveJourneyIndex(idx);
                        setActiveStep(0);
                      }}
                      className={`relative w-full text-left rounded-xl sm:rounded-2xl p-3 sm:p-3.5 transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group border min-w-0 ${
                        isCurrent
                          ? 'bg-[#4A2C20] text-[#FAF7F0] border-2 border-[#B89555] shadow-md ring-2 ring-[#B89555]/20'
                          : 'bg-white hover:bg-[#FAF6EE] text-[#241A16] border-[#6B4030]/15 hover:border-[#B89555]/40 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isCurrent
                              ? 'bg-[#B89555] text-[#241A16]'
                              : 'bg-[#4A2C20]/10 text-[#6B4030] group-hover:bg-[#4A2C20] group-hover:text-[#B89555]'
                          }`}
                        >
                          <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4
                            className={`font-['Cormorant_Garamond'] text-sm sm:text-base font-bold leading-tight break-words [overflow-wrap:break-word] hyphens-none ${
                              isCurrent ? 'text-white' : 'text-[#241A16]'
                            }`}
                          >
                            {journey.tabLabel}
                          </h4>
                          <div
                            className={`flex flex-wrap items-center gap-1.5 text-[10.5px] sm:text-[11px] font-['DM_Sans'] mt-0.5 ${
                              isCurrent ? 'text-[#E5B869]' : 'text-[#6B4030]'
                            }`}
                          >
                            <span className="whitespace-nowrap">{journey.duration}</span>
                            <span>&bull;</span>
                            <span className="whitespace-nowrap">{journey.steps?.length || 0} Phases</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all ${
                          isCurrent
                            ? 'bg-[#B89555] border-[#B89555] text-[#241A16]'
                            : 'border-[#6B4030]/25 bg-transparent group-hover:border-[#B89555]'
                        }`}
                      >
                        {isCurrent && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </Reveal>
        )}

        {/* Master Active Phase Showcase Card with Integrated Progression Stepper */}
        <Reveal direction="up" delay={140}>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#6B4030]/15 shadow-sm overflow-hidden mb-8 sm:mb-10">
            {/* 1. Integrated Cohort Progression Stepper Header */}
            <div className="bg-[#FAF7F0] border-b border-[#6B4030]/15 p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider block">
                    Cohort Progression Stepper
                  </span>
                  <span className="font-['DM_Sans'] text-[11px] text-[#6B4030]">
                    Select any phase below to inspect its shastric syllabus, studio hours, and physical takeaway artifact.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {steps.length > 8 && (
                    <div className="hidden sm:flex items-center gap-1 mr-1">
                      <button
                        type="button"
                        onClick={() => scrollStep('left')}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-[#FAF7F0] border border-[#6B4030]/20 flex items-center justify-center text-[#4A2C20] hover:text-[#B89555] transition-colors cursor-pointer shadow-2xs"
                        title="Scroll Left"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollStep('right')}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-[#FAF7F0] border border-[#6B4030]/20 flex items-center justify-center text-[#4A2C20] hover:text-[#B89555] transition-colors cursor-pointer shadow-2xs"
                        title="Scroll Right"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                  <span className="self-start sm:self-auto font-['DM_Sans'] text-xs font-semibold text-[#4A2C20] bg-white px-3 py-1 rounded-full border border-[#6B4030]/15 inline-flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#B89555] animate-pulse" />
                    Active: Phase {safeStepIndex + 1} of {steps.length}
                  </span>
                </div>
              </div>

              {/* Stepper Nodes Rail with Seamless Horizontal Flow & Hidden Scrollbars */}
              <div className="relative">
                <div
                  ref={stepperRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onWheel={handleWheel}
                  onTouchStart={() => {
                    isHoveredRef.current = true;
                  }}
                  onTouchEnd={() => {
                    isHoveredRef.current = false;
                  }}
                  className="w-full overflow-x-auto pb-2 pt-1 scroll-smooth select-none touch-pan-x relative z-10 scrollbar-none [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 w-max min-w-full">
                    {displaySteps.map((st, idx) => {
                      const originalIndex = idx % steps.length;
                      const isSelected = safeStepIndex === originalIndex;
                      const isPast = originalIndex < safeStepIndex;
                      const Icon = st.icon;

                      return (
                        <button
                          key={`${st.phase}-${idx}`}
                          data-phase-btn
                          type="button"
                          onClick={() => {
                            if (!hasMovedRef.current) {
                              handleSelectPhase(originalIndex);
                            }
                          }}
                          className={`h-12 sm:h-13 px-3 sm:px-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-max max-w-fit group shadow-2xs ${
                            isSelected
                              ? 'bg-[#4A2C20] text-white border-[#B89555] shadow-md ring-2 ring-[#B89555]/30'
                              : isPast
                              ? 'bg-[#FAF7F0] hover:bg-white text-[#241A16] border-[#B89555]/40 hover:border-[#B89555]'
                              : 'bg-white hover:bg-[#F7F2E8] text-[#241A16] border-[#6B4030]/15 hover:border-[#B89555]/40'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? 'bg-[#B89555] text-[#241A16]'
                                : isPast
                                ? 'bg-[#4A2C20]/15 text-[#4A2C20]'
                                : 'bg-[#4A2C20]/5 text-[#6B4030] border border-[#6B4030]/10'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <div className="flex flex-col justify-center min-w-0 pr-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[9px] sm:text-[9.5px] font-['DM_Sans'] font-bold uppercase tracking-wider ${
                                  isSelected ? 'text-[#E5B869]' : 'text-[#6B4030]'
                                }`}
                              >
                                {st.phase}
                              </span>
                              <span
                                className={`inline-block text-[8.5px] sm:text-[9px] font-['DM_Sans'] font-medium px-1.5 py-0.2 rounded ${
                                  isSelected
                                    ? 'bg-white/15 text-[#F7F2E8]'
                                    : 'bg-[#4A2C20]/5 text-[#6B4030]'
                                }`}
                              >
                                {st.period}
                              </span>
                            </div>

                            <h5
                              className={`font-['Cormorant_Garamond'] text-xs sm:text-[13.5px] font-bold leading-tight mt-0.5 whitespace-nowrap ${
                                isSelected ? 'text-white' : 'text-[#241A16]'
                              }`}
                            >
                              {st.title}
                            </h5>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Active Phase Academic Syllabus & Capstone Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#6B4030]/15 items-stretch">
              {/* Left Side (7 cols): Active Phase Academic Syllabus & Studio Breakdown */}
              <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-5">
                  {/* Phase & Period Tag */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0 shadow-2xs">
                        <ActiveIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-['DM_Sans'] font-bold text-[#B89555] uppercase tracking-wider block">
                          {currentStep?.phase} Module Breakdown
                        </span>
                        <span className="text-xs font-['DM_Sans'] font-semibold text-[#4A2C20] bg-[#FAF7F0] px-2.5 py-0.5 rounded-full border border-[#6B4030]/15 inline-block">
                          {currentStep?.period}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-block text-xs font-['DM_Sans'] font-semibold text-[#4A2C20] px-3 py-1 rounded-md bg-[#FAF7F0] border border-[#6B4030]/15">
                        {currentStep?.theoryHours || '15h Theory'} &bull; {currentStep?.studioHours || '45h Studio'}
                      </span>
                    </div>
                  </div>

                  {/* Full Un-truncated Heading */}
                  <div className="min-w-0">
                    <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241A16] leading-tight break-words [overflow-wrap:break-word] hyphens-none min-w-0">
                      {currentStep?.title}
                    </h3>
                    <p className="font-['DM_Sans'] text-sm sm:text-base text-[#6B4030] leading-relaxed mt-2 break-words [overflow-wrap:break-word] hyphens-none min-w-0">
                      {currentStep?.desc}
                    </p>
                  </div>

                  {/* Harmonic Ratio Equilibrium Gauge */}
                  <div className="p-4 rounded-xl bg-[#FAF7F0] border border-[#6B4030]/15 space-y-2">
                    <div className="flex items-center justify-between text-xs font-['DM_Sans']">
                      <span className="font-semibold text-[#6B4030] flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#6B4030]" />
                        <span>25% Literature Canons ({currentStep?.theoryHours || '15h'})</span>
                      </span>
                      <span className="font-semibold text-[#B89555] flex items-center gap-1.5">
                        <Hammer className="w-3.5 h-3.5 text-[#B89555]" />
                        <span>75% Tactile Studio Practice ({currentStep?.studioHours || '45h'})</span>
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#E8DEC8] flex overflow-hidden">
                      <div className="h-full bg-[#6B4030] w-[25%]" title="25% Canonic Theory" />
                      <div className="h-full bg-[#B89555] w-[75%]" title="75% Hands-on Studio" />
                    </div>
                  </div>

                  {/* Core Studio Focus */}
                  <div className="space-y-1.5 min-w-0">
                    <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wide block">
                      Core Studio Practice:
                    </span>
                    <div className="flex items-start gap-2.5 text-xs sm:text-sm font-['DM_Sans'] text-[#241A16] bg-[#F7F2E8]/70 p-3.5 rounded-xl border border-[#6B4030]/10 min-w-0">
                      <Sparkles className="w-4 h-4 text-[#B89555] shrink-0 mt-0.5" />
                      <span className="leading-relaxed break-words [overflow-wrap:break-word] hyphens-none min-w-0">{currentStep?.details}</span>
                    </div>
                  </div>

                  {/* Materials Provided */}
                  {currentStep?.materials && currentStep.materials.length > 0 && (
                    <div className="space-y-2">
                      <span className="font-['DM_Sans'] text-xs font-bold text-[#6B4030] uppercase tracking-wider block">
                        Guild Materials &amp; Media Provided in Studio:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {currentStep.materials.map((mat, mIdx) => (
                          <span
                            key={mIdx}
                            className="text-xs font-['DM_Sans'] font-medium px-3 py-1 rounded-md bg-[#FAF7F0] border border-[#6B4030]/15 text-[#4A2C20]"
                          >
                            &bull; {mat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side (5 cols): Milestone Deliverable & Cohort Enrollment (Deep Bronze) */}
              <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 bg-[#4A2C20] text-[#F7F2E8] flex flex-col justify-between space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B89555]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-5">
                  {/* Deliverable Badge */}
                  <div className="flex items-center justify-between border-b border-[#B89555]/25 pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#E5B869]" />
                      <span className="font-['DM_Sans'] text-xs font-bold text-[#E5B869] uppercase tracking-wider">
                        Phase Milestone Deliverable
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-['DM_Sans'] font-semibold bg-white/10 text-[#F7F2E8] border border-white/20">
                      {currentStep?.period}
                    </span>
                  </div>

                  {/* Title & Phase Number */}
                  <div className="min-w-0">
                    <span className="text-[11px] font-['DM_Sans'] text-[#E5B869] font-semibold uppercase tracking-widest block mb-1">
                      {currentStep?.phase} Capstone Output
                    </span>
                    <h4 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-white leading-tight break-words [overflow-wrap:break-word] hyphens-none min-w-0">
                      {currentStep?.title}
                    </h4>
                  </div>

                  {/* Tangible Artifact Callout Box */}
                  <div className="p-4 sm:p-5 rounded-xl bg-white/10 border border-[#B89555]/30 space-y-2 backdrop-blur-xs min-w-0">
                    <span className="font-['DM_Sans'] text-[11px] font-bold text-[#E5B869] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E5B869]" />
                      Physical Artifact You Take Home:
                    </span>
                    <p className="font-['Cormorant_Garamond'] text-base sm:text-lg lg:text-xl font-bold text-white leading-snug italic break-words [overflow-wrap:break-word] hyphens-none min-w-0">
                      &ldquo;{currentStep?.outcome}&rdquo;
                    </p>
                  </div>

                  {/* Institutional Verification Specs */}
                  <div className="space-y-2 text-xs font-['DM_Sans'] text-[#F7F2E8]/85 pt-1">
                    <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                      <span className="text-[#E5B869]">Guild Mentorship</span>
                      <span className="font-medium text-white">Traditional Temple Sthapathis</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-white/10">
                      <span className="text-[#E5B869]">Evaluation Method</span>
                      <span className="font-medium text-white">Direct Guild Critique</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-[#E5B869]">Credential Earned</span>
                      <span className="font-medium text-white">GNI Guild Milestone Credit</span>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 space-y-4 pt-4 border-t border-[#B89555]/30">
                  {/* Stepper Navigation Controls */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSelectPhase(Math.max(safeStepIndex - 1, 0))}
                      disabled={safeStepIndex === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F7F2E8] hover:text-[#E5B869] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors bg-white/10 border border-white/20"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Prev Phase</span>
                    </button>

                    <span className="text-xs font-['DM_Sans'] font-medium text-[#E5B869]">
                      Phase {safeStepIndex + 1} of {steps.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleSelectPhase(Math.min(safeStepIndex + 1, steps.length - 1))}
                      disabled={safeStepIndex === steps.length - 1}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#F7F2E8] hover:text-[#E5B869] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors bg-white/10 border border-white/20"
                    >
                      <span>Next Phase</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Enrollment Button */}
                  <Link
                    to={`/register?course=${encodeURIComponent(currentJourney.title)}&duration=${encodeURIComponent(currentJourney.duration)}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-['DM_Sans'] text-xs sm:text-sm font-bold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                  >
                    <span>Enroll in {currentJourney.tabLabel}</span>
                    <ArrowRight className="w-4 h-4 text-[#241A16]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Permanent Field Visit Highlight Banner */}
        <Reveal direction="zoom" delay={250}>
          <div className="bg-[#4A2C20] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-[#F7F2E8] border border-[#B89555]/40 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8 min-h-[190px] sm:min-h-[220px]">
            {/* Background Archaeological Drawing */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-end">
              <img
                src={DEFAULT_FIELD_VISIT.image}
                alt="Archaeological Temple & Epigraphy Field Visit Drawing"
                loading="lazy"
                decoding="async"
                className="w-[120%] sm:w-[90%] md:w-[75%] h-[130%] sm:h-[150%] object-contain object-right opacity-65 sm:opacity-80 invert sepia saturate-[250%] hue-rotate-[350deg] brightness-125 mix-blend-screen scale-110 sm:scale-130 md:scale-140 transform translate-x-3 sm:translate-x-8"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A2C20] via-[#4A2C20]/80 to-transparent w-full sm:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#4A2C20]/70 via-transparent to-[#4A2C20]/40" />
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-4 h-4 border-t-2 border-l-2 border-[#B89555] z-10 pointer-events-none" />
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-4 h-4 border-t-2 border-r-2 border-[#B89555] z-10 pointer-events-none" />
            <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-4 h-4 border-b-2 border-l-2 border-[#B89555] z-10 pointer-events-none" />
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-4 h-4 border-b-2 border-r-2 border-[#B89555] z-10 pointer-events-none" />

            <div className="space-y-3.5 sm:space-y-4 text-left w-full relative z-10 max-w-3xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#B89555] text-[#241A16] flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#241A16]" />
                  </div>
                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-['DM_Sans'] bg-[#241A16]/60 text-[#E5B869] font-medium border border-[#B89555]/30 whitespace-nowrap shadow-2xs leading-normal">
                    {DEFAULT_FIELD_VISIT.tag}
                  </span>
                </div>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#241A16]/60 border border-[#B89555]/30 text-xs font-['DM_Sans'] text-[#E5B869] font-medium whitespace-nowrap shadow-2xs leading-normal">
                  {DEFAULT_FIELD_VISIT.badge}
                </div>
              </div>

              <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                {DEFAULT_FIELD_VISIT.title}
              </h3>

              <p className="font-['DM_Sans'] text-xs sm:text-sm md:text-base text-[#F7F2E8]/90 max-w-2xl font-normal leading-relaxed text-left">
                {DEFAULT_FIELD_VISIT.desc}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
