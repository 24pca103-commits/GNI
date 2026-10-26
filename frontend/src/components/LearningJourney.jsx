import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Pencil,
  FileCode2,
  Paintbrush,
  Sparkles,
  Flame,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Check,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';
import { fetchActiveCourses } from '../services/api';

// Multi-Journey Configuration (Option A: Responsive Tabbed Switching)
const DEFAULT_JOURNEYS = [
  {
    id: '60-day',
    tabLabel: '60-Day Full Cohort',
    badge: 'Structured Curriculum',
    title: '60-Day Heritage Creator Journey',
    subtitle: 'From learning the foundational strokes to launching authentic creations.',
    steps: [
      {
        period: 'Day 1–10',
        phase: 'Phase 1',
        title: 'Drawing & Symbols',
        desc: 'Practical drawing and traditional symbols.',
        icon: Pencil,
        details: 'Line geometry, sacred motifs, ancient grid systems.',
        outcome: 'Master Foundational Sacred Proportions',
      },
      {
        period: 'Day 11–20',
        phase: 'Phase 2',
        title: 'Tamili & Inscriptions',
        desc: 'Tamili script and inscription practice.',
        icon: FileCode2,
        details: 'Deciphering Brahmi epigraphy, copper plate scribing.',
        outcome: 'Read and Scribe Ancestral Inscriptions',
      },
      {
        period: 'Day 21–30',
        phase: 'Phase 3',
        title: 'Rock Art & Painting',
        desc: 'Traditional visual language and painting practice.',
        icon: Paintbrush,
        details: 'Natural mineral pigments, prehistoric rock art techniques.',
        outcome: 'Concoct Natural Mineral Paints',
      },
      {
        period: 'Day 31–40',
        phase: 'Phase 4',
        title: 'Iconography',
        desc: 'Understanding symbols, forms and cultural meaning.',
        icon: Sparkles,
        details: 'Deity proportions, spiritual geometry, traditional shilpa canons.',
        outcome: 'Encode Spiritual Meaning into Sculptural Forms',
      },
      {
        period: 'Day 41–50',
        phase: 'Phase 5',
        title: 'Naga Jewellery & Metal Basics',
        desc: 'Introduction to traditional metal craftsmanship.',
        icon: Flame,
        details: 'Brass sheet forming, repousse, sacred naga ornamental motifs.',
        outcome: 'Form Authentic Metal Repousse Motifs',
      },
      {
        period: 'Day 51–60',
        phase: 'Phase 6',
        title: 'Real-World Applications + 1 Field Visit',
        desc: 'Apply heritage knowledge to modern creative fields + 1 immersive field visit.',
        icon: Briefcase,
        details: 'Textiles, interior design, branding, pooja decor, livelihood + 1 field visit.',
        outcome: 'Produce Commercial Portfolio & Complete 1 Field Visit',
      },
    ],
    fieldVisit: {
      tag: 'Immersive Experience',
      badge: '★ Guided by historians',
      title: 'Includes an On-Site Field Visit',
      desc: 'Direct hands-on archaeological exploration of ancient temple rock inscriptions, heritage guilds, and active master artisan workshops across Tamil Nadu.',
      image: '/artisan/field-visit-banner.png',
    },
  },
  {
    id: '30-day',
    tabLabel: '30-Day Foundation Sprint',
    badge: 'Accelerated Studio Track',
    title: '30-Day Heritage Foundation Track',
    subtitle: 'An intensive studio sprint focusing on drawing geometry, Tamili epigraphy, and natural mineral pigments.',
    steps: [
      {
        period: 'Day 1–10',
        phase: 'Phase 1',
        title: 'Drawing & Line Geometry',
        desc: 'Sacred Dravidian proportion grids and line fundamentals.',
        icon: Pencil,
        details: 'Foundational temple drafting, kolam mathematics, and sacred geometry.',
        outcome: 'Master Sacred Proportion Grids',
      },
      {
        period: 'Day 11–20',
        phase: 'Phase 2',
        title: 'Tamili Inscriptions & Palm Leaf',
        desc: 'Ancient script scribing and archival decoding.',
        icon: FileCode2,
        details: 'Tamili Brahmi letterforms, stylus handling, and copper plate rubbings.',
        outcome: 'Engrave Traditional Tamili Inscriptions',
      },
      {
        period: 'Day 21–30',
        phase: 'Phase 3',
        title: 'Natural Pigments & Mural Art',
        desc: 'Mineral grinding and authentic temple fresco practice.',
        icon: Paintbrush,
        details: 'Raw rock pigment preparation, organic binders, and sample fresco tablet.',
        outcome: 'Craft Authentic Natural Mineral Mural Artwork Tablet',
      },
    ],
    fieldVisit: null,
  },
];

function isJourneyOffering(item) {
  if (!item) return false;
  const cat = (item.category || '').toLowerCase();
  const title = (item.title || '').toLowerCase();
  const dur = (item.duration || '').toLowerCase();
  const dayMatch = dur.match(/(\d+)\s*day/i);
  const dayCount = dayMatch ? parseInt(dayMatch[1], 10) : null;

  // If <= 9 days or category/title contains workshop, it's handled in WorkshopSection
  if (dayCount !== null && dayCount <= 9) {
    return false;
  }
  if (cat.includes('workshop') || title.includes('workshop')) {
    return false;
  }

  // 10+ days (30, 60, etc.) are long-term learning journeys
  if (dayCount !== null && dayCount >= 10) {
    return true;
  }

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

  // Not a multi-day learning journey or cohort track
  return false;
}

const STEP_ICONS = [Pencil, FileCode2, Paintbrush, Sparkles, Flame, Briefcase];

function mapCourseToJourney(c, index) {
  const slug = (c.slug || '').toLowerCase();
  const title = (c.title || '').toLowerCase();

  // Try parsing custom JSON array phases from Admin Phase Builder (including Key Milestone Outcomes)
  let customSteps = null;
  if (typeof c.highlights === 'string' && c.highlights.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(c.highlights);
      if (Array.isArray(parsed) && parsed.length > 0) {
        customSteps = parsed.map((st, i) => ({
          period: st.period || `Day ${i * 10 + 1}–${(i + 1) * 10}`,
          phase: `Phase ${i + 1}`,
          title: st.title || `Phase ${i + 1}`,
          desc: st.details || `${st.title} structured module with expert guild guidance.`,
          icon: STEP_ICONS[i % STEP_ICONS.length],
          details: st.details || `${c.mode || 'Studio practice'} focusing on ${st.title}.`,
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
    };
  }
  if (c.id === 202 || slug.includes('30-day') || title.includes('30-day')) {
    return {
      ...DEFAULT_JOURNEYS[1],
      title: c.title || DEFAULT_JOURNEYS[1].title,
      subtitle: c.description || DEFAULT_JOURNEYS[1].subtitle,
      badge: c.badge || DEFAULT_JOURNEYS[1].badge,
      steps: customSteps || DEFAULT_JOURNEYS[1].steps,
    };
  }

  // Custom Journey created in Admin
  let steps = customSteps || [];

  // 1. Try parsing JSON array from Admin Phase Builder
  if (typeof c.highlights === 'string' && c.highlights.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(c.highlights);
      if (Array.isArray(parsed) && parsed.length > 0) {
        steps = parsed.map((st, i) => ({
          period: st.period || `Day ${i * 10 + 1}–${(i + 1) * 10}`,
          phase: `Phase ${i + 1}`,
          title: st.title || `Phase ${i + 1}`,
          desc: st.details || `${st.title} structured module with expert guild guidance.`,
          icon: STEP_ICONS[i % STEP_ICONS.length],
          details: st.details || `${c.mode || 'Studio practice'} focusing on ${st.title}.`,
          outcome: st.outcome || `Master ${st.title} with authentic hands-on execution.`,
        }));
      }
    } catch (_) {}
  }

  // 2. Fallback to semicolons if not JSON
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
      const title = match ? match[2] : act;
      return {
        period,
        phase: `Phase ${i + 1}`,
        title,
        desc: `${title} structured module with expert guild guidance.`,
        icon: STEP_ICONS[i % STEP_ICONS.length],
        details: `${c.mode || 'Studio practice'} focusing on ${title}.`,
        outcome: `Master ${title} with authentic hands-on execution.`,
      };
    });
  }

  return {
    id: String(c.id || c.slug || `custom-journey-${index}`),
    tabLabel: c.title,
    badge: c.badge || `${c.duration || 'Structured'} Journey`,
    title: c.title,
    subtitle: c.description || 'Hands-on heritage learning journey and authentic craft immersion.',
    steps,
    fieldVisit: {
      tag: 'Heritage Cohort',
      badge: `★ ${c.duration || 'Extended'} Duration`,
      title: c.title,
      desc: c.description || 'Complete hands-on experience and take-home authentic certified craft.',
      image: c.image_url || '/artisan/pedagogy-practice.jpg',
    },
  };
}

export default function LearningJourney() {
  const [journeys, setJourneys] = useState(DEFAULT_JOURNEYS);
  const [activeJourneyIndex, setActiveJourneyIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(0);

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

    const handleStorageChange = (e) => {
      if (e.key === 'gni_custom_courses') {
        loadJourneys();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const currentJourney = journeys[activeJourneyIndex] || journeys[0] || DEFAULT_JOURNEYS[0];
  const steps = currentJourney.steps || [];

  // Safe active step guard in case switching to journey with fewer steps
  const safeStepIndex = activeStep < steps.length ? activeStep : 0;
  const currentStep = steps[safeStepIndex];

  // Dynamic grid columns for step pills
  const getGridColsClass = (count) => {
    if (count <= 3) return 'grid-cols-1 sm:grid-cols-3';
    if (count === 4) return 'grid-cols-2 sm:grid-cols-4';
    if (count === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6';
  };

  return (
    <section id="learning-journey" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      {/* Ambient Floating Bubbles */}
      <FloatingBubbles count={14} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4A2C20] border border-[#B89555]/40 text-[#E5B869] text-xs sm:text-sm font-['DM_Sans'] font-semibold mb-3 shadow-xs leading-normal">
              <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5B869]" />
              <span>{currentJourney.badge || 'Structured Curriculum'}</span>
            </div>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-normal pb-1">
              {currentJourney.title}
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-center mx-auto max-w-2xl">
              {currentJourney.subtitle}
            </p>
          </div>
        </Reveal>

        {/* Responsive Track Selection Grid - Structured Card Format, No Loose Badge View */}
        {journeys.length > 1 && (
          <Reveal direction="up" delay={120}>
            <div className="max-w-5xl mx-auto mb-8 sm:mb-10">
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B89555]" />
                  <span className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20] uppercase tracking-wider">
                    Select Heritage Track
                  </span>
                </div>
                <span className="font-['DM_Sans'] text-xs font-medium text-[#6B4030]">
                  {activeJourneyIndex + 1} of {journeys.length} Selected
                </span>
              </div>

              {/* Structured Uniform Cards Grid (No loose floating badges) */}
              <div
                className={`grid ${
                  journeys.length === 2
                    ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto'
                    : journeys.length === 3
                    ? 'grid-cols-1 sm:grid-cols-3 max-w-4xl mx-auto'
                    : journeys.length === 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                } gap-3 sm:gap-3.5`}
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
                      className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group relative ${
                        isCurrent
                          ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#B89555] shadow-md ring-2 ring-[#B89555]/30'
                          : 'bg-white hover:bg-[#FAF6EE] text-[#241A16] border-[#6B4030]/15 hover:border-[#B89555]/40 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isCurrent
                              ? 'bg-[#B89555] text-[#241A16] shadow-xs'
                              : 'bg-[#4A2C20]/10 text-[#6B4030] group-hover:bg-[#4A2C20] group-hover:text-[#B89555]'
                          }`}
                        >
                          <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                        <div className="min-w-0">
                          <h4
                            className={`font-['DM_Sans'] text-xs sm:text-sm font-bold leading-snug line-clamp-1 transition-colors ${
                              isCurrent ? 'text-white' : 'text-[#241A16] group-hover:text-[#4A2C20]'
                            }`}
                            title={journey.tabLabel}
                          >
                            {journey.tabLabel}
                          </h4>
                          <p
                            className={`text-[11px] sm:text-xs font-['DM_Sans'] mt-0.5 leading-normal transition-colors ${
                              isCurrent ? 'text-[#E5B869]' : 'text-[#6B4030]'
                            }`}
                          >
                            {journey.steps.length} Structured Phases
                          </p>
                        </div>
                      </div>

                      {/* Active indicator check circle */}
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

        {/* Milestone Interactive Roadmap Stage - Full Text View & Zero Horizontal Scrolling */}
        <Reveal direction="up" delay={150}>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#6B4030]/15 shadow-sm mb-6 sm:mb-8">
            {/* Interactive Milestone Cards Grid - Full Text View for Every Badge and Title */}
            <div className="pb-6 sm:pb-8 border-b border-[#6B4030]/15">
              <div className="flex items-center justify-between mb-4">
                <span className="font-['DM_Sans'] text-xs font-bold text-[#6B4030] uppercase tracking-wider">
                  Select a Milestone to Explore
                </span>
                <span className="font-['DM_Sans'] text-xs font-medium text-[#6B4030] bg-[#F7F2E8] px-3 py-1 rounded-full border border-[#6B4030]/20 inline-flex items-center gap-1 leading-normal">
                  <span className="font-number font-bold text-[#4A2C20]">{steps.length}</span> Structured Phases
                </span>
              </div>

              <div
                className={`grid ${
                  steps.length <= 3
                    ? 'grid-cols-1 sm:grid-cols-3'
                    : steps.length === 4
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                } gap-3 sm:gap-4`}
              >
                {steps.map((st, idx) => {
                  const isSelected = safeStepIndex === idx;
                  const Icon = st.icon;

                  return (
                    <button
                      key={st.phase}
                      type="button"
                      onClick={() => setActiveStep(idx)}
                      className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                        isSelected
                          ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#B89555] shadow-md ring-2 ring-[#B89555]/40 scale-[1.01]'
                          : 'bg-[#F7F2E8]/60 hover:bg-[#F7F2E8] text-[#241A16] border-[#6B4030]/15 hover:border-[#B89555]/50 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Horizontal Badges: Phase & Period */}
                      <div className="flex items-center justify-between gap-2 mb-2 w-full">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-['DM_Sans'] font-bold inline-flex items-center gap-1.5 leading-normal transition-colors ${
                            isSelected
                              ? 'bg-[#B89555] text-[#241A16]'
                              : 'bg-[#4A2C20] text-[#E5B869]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{st.phase}</span>
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-number font-bold inline-flex items-center leading-normal transition-colors ${
                            isSelected
                              ? 'bg-white/20 text-[#F7F2E8] border border-white/30'
                              : 'bg-[#4A2C20]/10 text-[#4A2C20] border border-[#6B4030]/20'
                          }`}
                        >
                          {st.period}
                        </span>
                      </div>

                      {/* Full Title View - Zero Truncation, Ample Line-Height */}
                      <h4
                        className={`font-['Cormorant_Garamond'] text-base sm:text-lg font-bold leading-normal pb-0.5 break-words transition-colors ${
                          isSelected ? 'text-white' : 'text-[#241A16] group-hover:text-[#4A2C20]'
                        }`}
                      >
                        {st.title}
                      </h4>

                      {/* Studio Focus / Discipline Preview */}
                      <p
                        className={`font-['DM_Sans'] text-[11.5px] sm:text-xs mt-2 leading-relaxed transition-colors ${
                          isSelected ? 'text-[#F7F2E8]/85' : 'text-[#6B4030]'
                        }`}
                      >
                        {st.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Phase Detail Stage */}
            {currentStep && (
              <div className="pt-4 sm:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-center">
                <div className="lg:col-span-8 space-y-3.5">
                  {/* Clean Horizontal Badges - Fully Responsive */}
                  <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <span className="px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-number font-bold bg-[#4A2C20] text-[#E5B869] border border-[#B89555]/30 shadow-2xs inline-flex items-center gap-1.5 leading-normal">
                      <Sparkles className="w-3.5 h-3.5 text-[#B89555]" />
                      <span>{currentStep.period}</span>
                    </span>
                    <span className="text-xs sm:text-sm font-['DM_Sans'] text-[#4A2C20] font-bold bg-[#F7F2E8] px-3.5 py-1.5 rounded-full border border-[#6B4030]/20 inline-flex items-center leading-normal">
                      <span>{currentStep.phase} of {steps.length}</span>
                    </span>
                  </div>

                  <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241A16] leading-normal pb-1">
                    {currentStep.title}
                  </h3>
                  <p className="font-['DM_Sans'] text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-left">
                    {currentStep.desc}
                  </p>
                  <div className="p-3.5 rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#B89555] shrink-0 mt-0.5" />
                    <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#241A16]/90 leading-relaxed">
                      <strong className="font-bold text-[#4A2C20]">Studio Focus:</strong> {currentStep.details}
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#F7F2E8] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-[#6B4030]/15 space-y-4 shadow-2xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-['DM_Sans'] font-bold text-[#4A2C20] uppercase tracking-wide">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#B89555] shrink-0" />
                      <span>Key Milestone Outcome</span>
                    </div>
                    <p className="font-['DM_Sans'] text-xs sm:text-sm font-semibold text-[#241A16] leading-relaxed">
                      "{currentStep.outcome}"
                    </p>
                  </div>

                  {/* Previous / Next Desktop & Mobile Navigation Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#6B4030]/15">
                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
                      disabled={safeStepIndex === 0}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4A2C20] hover:text-[#B89555] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors bg-white border border-[#6B4030]/20"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>

                    <span className="text-xs font-number font-bold text-[#6B4030]">
                      Phase {safeStepIndex + 1} of {steps.length}
                    </span>

                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
                      disabled={safeStepIndex === steps.length - 1}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4A2C20] hover:text-[#B89555] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors bg-white border border-[#6B4030]/20"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        {/* Syllabus Breakdown Section */}
        <div className="space-y-4">
          <div className="text-center mb-4 sm:mb-6">
            <span className="text-xs font-['DM_Sans'] uppercase tracking-wider font-bold text-[#6B4030] bg-[#4A2C20]/5 px-3.5 py-1.5 rounded-full border border-[#6B4030]/15 inline-block">
              {currentJourney.tabLabel} &bull; Detailed Syllabus Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.phase} direction="up" delay={100 + idx * 50}>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#6B4030]/15 shadow-sm hover:border-[#B89555] transition-all flex flex-col justify-between h-full group text-left">
                    <div>
                      {/* Top Horizontal Badge Strip - Clean Separation & No Overlap */}
                      <div className="flex items-center justify-between gap-2 border-b border-[#6B4030]/10 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-9 h-9 rounded-xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-[#B89555] group-hover:text-[#241A16] transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-['DM_Sans'] font-bold text-[#4A2C20] tracking-wide uppercase leading-normal">
                            {step.phase}
                          </span>
                        </div>
                        <span className="text-xs font-number font-bold text-[#4A2C20] px-3 py-1.5 rounded-full bg-[#B89555]/20 border border-[#B89555]/40 shrink-0 leading-normal inline-flex items-center">
                          {step.period}
                        </span>
                      </div>

                      {/* Heading in dedicated container with ample line height */}
                      <h4 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] leading-normal pb-1 break-words">
                        {step.title}
                      </h4>
                      <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#6B4030] font-normal leading-relaxed mb-3">
                        {step.desc}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#6B4030]/10 mt-auto">
                      <div className="p-2.5 rounded-lg bg-[#F7F2E8]/80 text-[11.5px] font-['DM_Sans'] text-[#241A16]/80 flex items-start gap-2">
                        <span className="font-bold text-[#B89555] shrink-0">&bull;</span>
                        <span className="leading-relaxed">{step.details}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-['DM_Sans'] font-medium text-emerald-800 leading-normal">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Outcome: {step.outcome}</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Field Visit Highlight Banner */}
        {currentJourney.fieldVisit && (
          <Reveal direction="zoom" delay={300}>
            <div className="mt-8 sm:mt-12 bg-[#4A2C20] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-[#F7F2E8] border border-[#B89555]/40 shadow-md relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-8 min-h-[190px] sm:min-h-[220px]">
              {/* Background Temple & Field Exploration Drawing Banner */}
              <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-end">
                <img
                  src={currentJourney.fieldVisit.image}
                  alt="Archaeological Temple & Epigraphy Field Visit Drawing"
                  className="w-[120%] sm:w-[90%] md:w-[75%] h-[130%] sm:h-[150%] object-contain object-right opacity-65 sm:opacity-80 invert sepia saturate-[250%] hue-rotate-[350deg] brightness-125 mix-blend-screen scale-110 sm:scale-130 md:scale-140 transform translate-x-3 sm:translate-x-8"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A2C20] via-[#4A2C20]/80 to-transparent w-full sm:w-3/4" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4A2C20]/70 via-transparent to-[#4A2C20]/40" />
              </div>

              {/* Corner Decorative Ornaments */}
              <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 border-t-2 border-l-2 border-[#B89555] z-10" />
              <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 border-t-2 border-r-2 border-[#B89555] z-10" />
              <div className="absolute bottom-3 left-3 sm:bottom-3.5 sm:left-3.5 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 border-b-2 border-l-2 border-[#B89555] z-10" />
              <div className="absolute bottom-3 right-3 sm:bottom-3.5 sm:right-3.5 w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 border-b-2 border-r-2 border-[#B89555] z-10" />

              <div className="space-y-3 text-left w-full relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#B89555] text-[#241A16] flex items-center justify-center shrink-0 shadow-sm">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#241A16]" />
                    </div>
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-['DM_Sans'] bg-white/15 text-[#E5B869] font-semibold border border-[#B89555]/40 whitespace-nowrap shadow-2xs leading-normal">
                      {currentJourney.fieldVisit.tag}
                    </span>
                  </div>
                  <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white/15 border border-[#B89555]/40 text-xs font-['DM_Sans'] text-[#E5B869] font-semibold whitespace-nowrap shadow-2xs leading-normal">
                    {currentJourney.fieldVisit.badge}
                  </div>
                </div>

                <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-normal pb-1">
                  {currentJourney.fieldVisit.title}
                </h3>

                <p className="font-['DM_Sans'] text-xs sm:text-sm md:text-base text-[#F7F2E8]/95 max-w-2xl font-normal leading-relaxed text-left">
                  {currentJourney.fieldVisit.desc}
                </p>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
