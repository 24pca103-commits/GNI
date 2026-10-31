import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Clock, GraduationCap, Hand, MapPin, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import useOfferings from '../hooks/useOfferings';
import {
  formatINR,
  getDayCount,
  getPricing,
  parseDetails,
  parseJourneyPhases,
  periodLength,
} from '../utils/offerings';
import {
  BookingCard,
  CARD_SHADOW,
  EmptyState,
  OfferingPicker,
  OverviewCard,
  SectionHeader,
  SectionSkeleton,
  SubHeading,
} from './offerings/OfferingUI';

// Established display order for the original journeys; new ones from admin follow by id
const CANONICAL_IDS = [201, 202];
const FALLBACK_IMAGE = '/artisan/pedagogy-practice.jpg';
const FIELD_VISIT_IMAGE = '/artisan/field-visit-banner.png';

function PhaseDetail({ phase, index, className = '' }) {
  return (
    <div className={`flex flex-col rounded-2xl bg-[#FAF7F0] border border-[#6B4030]/10 p-5 sm:p-7 ${className}`}>
      <p className="font-['DM_Sans'] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#B89555]">
        Phase {index + 1}
        {phase.period && ` · ${phase.period}`}
      </p>
      <h5 className="mt-1.5 font-['Cormorant_Garamond'] text-2xl sm:text-[28px] font-bold text-[#241A16] leading-tight">
        {phase.title}
      </h5>
      {phase.details && (
        <p className="mt-3 font-['DM_Sans'] text-sm sm:text-[15px] text-[#6B4030] leading-relaxed">{phase.details}</p>
      )}

      {phase.materials.length > 0 && (
        <div className="mt-5">
          <p className="font-['DM_Sans'] text-xs font-semibold text-[#4A2C20]">Materials provided</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {phase.materials.map((m) => (
              <li
                key={m}
                className="px-2.5 py-1 rounded-md bg-white border border-[#6B4030]/12 font-['DM_Sans'] text-xs text-[#4A2C20]"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>
      )}

      {phase.outcome && (
        <div className="mt-5">
          <div className="rounded-xl bg-white border border-[#B89555]/40 p-4 flex items-start gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#4A2C20] text-[#E5B869] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="font-['DM_Sans'] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B4030]/80">
                You&apos;ll create
              </p>
              <p className="mt-0.5 font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#241A16] leading-snug">
                {phase.outcome}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * List + detail roadmap. On large screens the detail panel sets the row height and
 * the phase list scrolls inside that height, so both columns always end on the same
 * line (no blank space). On small screens the detail opens under the selected phase.
 */
function Roadmap({ phases, totalDays }) {
  const [active, setActive] = useState(0);
  const safeActive = active < phases.length ? active : 0;
  const listRef = useRef(null);
  const [scrollHint, setScrollHint] = useState({ top: false, bottom: false });

  const updateHint = useCallback(() => {
    const el = listRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight > el.clientHeight + 2;
    setScrollHint({
      top: scrollable && el.scrollTop > 4,
      bottom: scrollable && el.scrollTop + el.clientHeight < el.scrollHeight - 4,
    });
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    updateHint();
    el.addEventListener('scroll', updateHint, { passive: true });
    const ro = new ResizeObserver(updateHint);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateHint);
      ro.disconnect();
    };
  }, [updateHint]);

  const select = (i) => {
    setActive(i);
    // Keep the chosen phase visible inside the list (scrolls the list only, never the page)
    const el = listRef.current;
    const item = el?.children[i];
    if (el && item && el.scrollHeight > el.clientHeight) {
      const top = item.offsetTop;
      if (top < el.scrollTop || top + item.offsetHeight > el.scrollTop + el.clientHeight) {
        el.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
      }
    }
  };

  return (
    <section className={`rounded-3xl bg-white border border-[#6B4030]/12 p-6 sm:p-8 lg:p-10 ${CARD_SHADOW}`}>
      <SubHeading
        title="Your roadmap"
        meta={`${phases.length} ${phases.length === 1 ? 'phase' : 'phases'}${totalDays ? ` · ${totalDays} days` : ''}`}
      />

      {/* Proportional progress bar: one segment per phase */}
      {phases.length > 1 && (
        <div className="mt-6">
          <div className="flex gap-1 h-2">
            {phases.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => select(i)}
                aria-label={`Show phase ${i + 1}: ${p.title}`}
                style={{ flex: `${periodLength(p.period)} 1 0%` }}
                className={`h-full rounded-full transition-colors cursor-pointer ${
                  i <= safeActive ? 'bg-[#B89555]' : 'bg-[#E8DEC8] hover:bg-[#D9C9A6]'
                }`}
              />
            ))}
          </div>
          {totalDays && (
            <div className="mt-2 flex justify-between font-['DM_Sans'] text-[11px] text-[#6B4030]/80">
              <span>Day 1</span>
              <span>Day {totalDays}</span>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 grid lg:grid-cols-12 gap-4 lg:gap-8 lg:items-stretch">
        {/* Phase list: fills its column absolutely on lg, so the detail panel decides the row height */}
        <div className="relative lg:col-span-5">
          <ol
            ref={listRef}
            className="space-y-2 lg:absolute lg:inset-0 lg:overflow-y-auto lg:pr-2 [scrollbar-width:thin] [scrollbar-color:#D9C9A6_transparent]"
          >
            {phases.map((p, i) => {
              const isActive = i === safeActive;
              return (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => select(i)}
                    aria-expanded={isActive}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89555] ${
                      isActive
                        ? 'bg-[#4A2C20] border-[#4A2C20] text-white'
                        : 'bg-white border-[#6B4030]/10 hover:border-[#B89555]/50 hover:bg-[#FAF7F0]'
                    }`}
                  >
                    <span
                      className={`w-8 h-8 rounded-full font-['DM_Sans'] text-xs font-bold flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-[#B89555] text-[#241A16]' : 'bg-[#FAF7F0] border border-[#B89555]/40 text-[#4A2C20]'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      {p.period && (
                        <span
                          className={`block font-['DM_Sans'] text-[11px] font-medium ${isActive ? 'text-[#E5B869]' : 'text-[#6B4030]/80'}`}
                        >
                          {p.period}
                        </span>
                      )}
                      <span
                        className={`block font-['DM_Sans'] text-sm font-semibold leading-snug ${isActive ? 'text-white' : 'text-[#241A16]'}`}
                      >
                        {p.title}
                      </span>
                    </span>
                  </button>
                  {/* On small screens the detail opens directly under the selected phase */}
                  {isActive && <PhaseDetail phase={p} index={i} className="gni-fade-up mt-2 lg:hidden" />}
                </li>
              );
            })}
          </ol>
          {/* Fades hint that more phases are available by scrolling (lg only) */}
          {scrollHint.top && (
            <div className="pointer-events-none absolute inset-x-0 top-0 hidden h-8 bg-gradient-to-b from-white to-transparent lg:block" />
          )}
          {scrollHint.bottom && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-10 bg-gradient-to-t from-white to-transparent lg:block" />
          )}
        </div>

        <div className="hidden lg:block lg:col-span-7">
          <PhaseDetail
            key={safeActive}
            phase={phases[safeActive]}
            index={safeActive}
            className="gni-fade-up w-full"
          />
        </div>
      </div>
    </section>
  );
}

function FieldVisitBanner({ visit }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#4A2C20] text-[#F7F2E8] p-7 sm:p-10 border border-[#B89555]/30">
      <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-end">
        <img
          src={FIELD_VISIT_IMAGE}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-[140%] w-auto max-w-none object-contain opacity-40 sm:opacity-70 invert sepia saturate-[250%] hue-rotate-[350deg] brightness-125 mix-blend-screen translate-x-1/4 sm:translate-x-10"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A2C20] via-[#4A2C20]/85 to-transparent" />
      </div>
      <div className="relative max-w-2xl">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#241A16]/50 border border-[#B89555]/30 text-[#E5B869] font-['DM_Sans'] text-xs font-semibold">
          <MapPin className="w-3.5 h-3.5" />
          Field visit
        </span>
        <h4 className="mt-4 font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-white leading-tight">
          {visit.title || 'Includes an on-site field visit'}
        </h4>
        {visit.description && (
          <p className="mt-3 font-['DM_Sans'] text-sm sm:text-base text-[#F7F2E8]/85 leading-relaxed">
            {visit.description}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Journey detail rows (overview + booking, roadmap, field visit). Used by
 * the website section and by the admin editor's preview, so both always match.
 * `preview` disables the application link.
 */
export function JourneyDetail({ course, preview = false }) {
  const details = parseDetails(course.details);
  const durationDays = getDayCount(course.duration);
  const phases = parseJourneyPhases(course.highlights, durationDays);
  const totalDays =
    durationDays || (phases.length ? phases.reduce((sum, p) => sum + periodLength(p.period), 0) : null);

  return (
    <>
      {/* Row 1: overview beside booking, equal height */}
      <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-8">
          <OverviewCard
            course={course}
            fallbackImage={FALLBACK_IMAGE}
            facts={[
              { icon: Clock, label: course.duration },
              { icon: BookOpen, label: phases.length ? `${phases.length} phases` : '' },
              { icon: Hand, label: course.mode },
              { icon: MapPin, label: details.field_visit.enabled ? 'Field visit included' : '' },
            ]}
          />
        </div>
        <div className="lg:col-span-4">
          <BookingCard
            course={course}
            inclusions={details.inclusions}
            ctaLabel="Apply for this journey"
            preview={preview}
            className="h-full"
          />
        </div>
      </div>

      {/* Row 2: full-width roadmap */}
      {phases.length > 0 && <Roadmap key={course.id} phases={phases} totalDays={totalDays} />}

      {details.field_visit.enabled && <FieldVisitBanner visit={details.field_visit} />}
    </>
  );
}

export default function LearningJourney() {
  const journeys = useOfferings('journey', CANONICAL_IDS);
  const [activeIndex, setActiveIndex] = useState(0);

  const list = journeys || [];
  const safeIndex = activeIndex < list.length ? activeIndex : 0;
  const current = list[safeIndex];

  const pickerItems = list.map((j) => {
    const phaseCount = parseJourneyPhases(j.highlights).length;
    return {
      id: j.id,
      title: j.title,
      image: j.image_url,
      fallbackImage: FALLBACK_IMAGE,
      meta: [j.duration, phaseCount ? `${phaseCount} phases` : null, formatINR(getPricing(j).price)]
        .filter(Boolean)
        .join(' · '),
    };
  });


  return (
    <section id="learning-journey" className="gni-offering py-16 md:py-24 bg-[#F7F2E8] relative overflow-hidden" style={{ '--picker-bg': '#F7F2E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          icon={GraduationCap}
          eyebrow="Learning Journeys · 10+ Days"
          title="Go deeper with a structured journey"
          subtitle="Multi-week cohorts that build your skills phase by phase, guided by traditional sthapathis, from first principles to a finished portfolio."
        />

        {journeys === null ? (
          <SectionSkeleton />
        ) : !current ? (
          <EmptyState message="New learning journeys are being planned. Please check back soon." />
        ) : (
          <>
            <Reveal direction="up" delay={120}>
              <OfferingPicker
                label="Choose a learning journey"
                items={pickerItems}
                activeIndex={safeIndex}
                onSelect={setActiveIndex}
              />
            </Reveal>

            <div key={current.id} className="gni-fade-up space-y-6 lg:space-y-8">
              <JourneyDetail course={current} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
