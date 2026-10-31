import React, { useState } from 'react';
import { Clock, Flame, Hand, Users } from 'lucide-react';
import Reveal from './Reveal';
import useOfferings from '../hooks/useOfferings';
import { formatINR, getPricing, getSeats, parseDetails, parseWorkshopModules } from '../utils/offerings';
import {
  BookingCard,
  CARD_SHADOW,
  EmptyState,
  OfferingPicker,
  OverviewCard,
  SectionHeader,
  SectionSkeleton,
  SubHeading,
  CardGrid,
} from './offerings/OfferingUI';

// Established display order for the original workshops; new ones from admin follow by id
const CANONICAL_IDS = [102, 101, 103, 104];
const FALLBACK_IMAGE = '/artisan/workshop.jpg';

function StepCard({ step, index }) {
  return (
    <article className="flex h-full w-full items-start gap-4 rounded-2xl border border-[#6B4030]/10 bg-[#FCFAF6] p-5">
      <span className="w-9 h-9 rounded-full bg-white border border-[#B89555]/50 text-[#4A2C20] font-['DM_Sans'] text-xs font-bold flex items-center justify-center shrink-0">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="min-w-0 pt-1">
        {step.day && (
          <span className="block font-['DM_Sans'] text-[11px] font-semibold uppercase tracking-[0.12em] text-[#B89555] mb-0.5">
            {step.day}
          </span>
        )}
        <h5 className="font-['DM_Sans'] text-[15px] font-semibold text-[#241A16] leading-snug">{step.title}</h5>
        {step.desc && <p className="mt-1 font-['DM_Sans'] text-sm text-[#6B4030] leading-relaxed">{step.desc}</p>}
      </div>
    </article>
  );
}

/**
 * Workshop detail rows (overview + booking, then the steps). Used by the
 * website section and by the admin editor's preview, so both always match.
 * `preview` disables the booking link.
 */
export function WorkshopDetail({ course, preview = false }) {
  const details = parseDetails(course.details);
  const modules = parseWorkshopModules(course.highlights);
  const seats = getSeats(course);

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
              { icon: Hand, label: course.mode },
              { icon: Users, label: seats.total ? `Batch of ${seats.total}` : '' },
            ]}
          />
        </div>
        <div className="lg:col-span-4">
          <BookingCard
            course={course}
            inclusions={details.inclusions}
            ctaLabel="Reserve your seat"
            preview={preview}
            className="h-full"
          />
        </div>
      </div>

      {/* Row 2: the steps, full width */}
      {modules.length > 0 && (
        <section className={`rounded-3xl bg-white border border-[#6B4030]/12 p-6 sm:p-8 lg:p-10 ${CARD_SHADOW}`}>
          <SubHeading title="What you'll do" meta={`${modules.length} ${modules.length === 1 ? 'step' : 'steps'}`} />
          <div className="mt-6">
            <CardGrid items={modules} renderItem={(m, i) => <StepCard step={m} index={i} />} />
          </div>
        </section>
      )}
    </>
  );
}

export default function WorkshopSection() {
  const workshops = useOfferings('workshop', CANONICAL_IDS);
  const [activeIndex, setActiveIndex] = useState(0);

  const list = workshops || [];
  const safeIndex = activeIndex < list.length ? activeIndex : 0;
  const current = list[safeIndex];

  const pickerItems = list.map((w) => {
    const seats = getSeats(w);
    return {
      id: w.id,
      title: w.title,
      image: w.image_url,
      fallbackImage: FALLBACK_IMAGE,
      meta: [w.duration, formatINR(getPricing(w).price), seats.isFull ? 'Full' : null].filter(Boolean).join(' · '),
    };
  });

  return (
    <section id="workshop" className="gni-offering py-16 md:py-24 bg-[#FAF7F0] relative overflow-hidden" style={{ '--picker-bg': '#FAF7F0' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          icon={Flame}
          eyebrow="Hands-on Workshops · 1–9 Days"
          title="Learn a heritage craft in the studio"
          subtitle="Short, practical sessions with master artisans. Every material is provided, and you leave with a piece you made with your own hands."
        />

        {workshops === null ? (
          <SectionSkeleton />
        ) : !current ? (
          <EmptyState message="New workshops are being scheduled. Please check back soon." />
        ) : (
          <>
            <Reveal direction="up" delay={120}>
              <OfferingPicker
                label="Choose a workshop"
                items={pickerItems}
                activeIndex={safeIndex}
                onSelect={setActiveIndex}
              />
            </Reveal>

            <div key={current.id} className="gni-fade-up space-y-6 lg:space-y-8">
              <WorkshopDetail course={current} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
