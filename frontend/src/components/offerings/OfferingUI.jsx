import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Clock, Hand, Users } from 'lucide-react';
import Reveal from '../Reveal';
import { formatINR, getPricing, getSeats, registerLink } from '../../utils/offerings';

const FALLBACK_IMAGE = '/artisan/workshop.jpg';

export function OfferingImage({ src, alt, className = '', fallback = FALLBACK_IMAGE }) {
  return (
    <img
      src={src || fallback}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallback;
      }}
    />
  );
}

export function SectionHeader({ icon: Icon, eyebrow, title, subtitle }) {
  return (
    <Reveal direction="up" delay={80}>
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#4A2C20] text-[#E5B869] text-xs font-['DM_Sans'] font-semibold tracking-wide">
          {Icon && <Icon className="w-3.5 h-3.5" />}
          {eyebrow}
        </span>
        <h2 className="mt-4 font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-bold text-[#241A16] leading-[1.1] tracking-tight">
          {title}
        </h2>
        <p className="mt-4 font-['DM_Sans'] text-[15px] sm:text-base text-[#6B4030] leading-relaxed">
          {subtitle}
        </p>
      </div>
    </Reveal>
  );
}

export function SubHeading({ title, meta }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-[#6B4030]/10 pb-3">
      <h4 className="font-['Cormorant_Garamond'] text-2xl sm:text-[28px] font-bold text-[#241A16] leading-tight">
        {title}
      </h4>
      {meta && (
        <span className="font-['DM_Sans'] text-xs font-medium text-[#6B4030] whitespace-nowrap pb-1">{meta}</span>
      )}
    </div>
  );
}

/** One scrollable row of equally sized cards; arrows appear when the row overflows. */
export function OfferingPicker({ label, items, activeIndex, onSelect }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    updateEdges();
    el.addEventListener('scroll', updateEdges, { passive: true });
    const ro = new ResizeObserver(updateEdges);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateEdges);
      ro.disconnect();
    };
  }, [updateEdges, items.length]);

  // Keep the selected card fully visible (horizontal scroll only, never moves the page)
  useEffect(() => {
    const el = trackRef.current;
    const card = el?.children[activeIndex];
    if (!el || !card) return;
    const left = card.offsetLeft; // track is the offset parent
    if (left < el.scrollLeft || left + card.offsetWidth > el.scrollLeft + el.clientWidth) {
      el.scrollTo({ left: Math.max(0, left - 16), behavior: 'smooth' });
    }
  }, [activeIndex]);

  if (items.length < 2) return null;

  const scrollByCards = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(300, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  const arrowClass =
    'hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#6B4030]/15 shadow-md items-center justify-center text-[#4A2C20] hover:bg-[#4A2C20] hover:text-[#E5B869] transition-colors cursor-pointer';

  return (
    <div className="relative mb-8">
      {edges.left && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--picker-bg)] to-transparent z-[5]" />
          <button type="button" aria-label="Scroll left" onClick={() => scrollByCards(-1)} className={`${arrowClass} -left-3`}>
            <ChevronLeft className="w-5 h-5" />
          </button>
        </>
      )}
      {edges.right && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--picker-bg)] to-transparent z-[5]" />
          <button type="button" aria-label="Scroll right" onClick={() => scrollByCards(1)} className={`${arrowClass} -right-3`}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div
        ref={trackRef}
        role="tablist"
        aria-label={label}
        className="relative flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, idx) => {
          const isActive = idx === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              title={item.title}
              onClick={() => onSelect(idx)}
              className={`snap-start shrink-0 w-[272px] sm:w-[300px] h-[88px] flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B89555] ${
                isActive
                  ? 'bg-[#4A2C20] border-[#4A2C20] shadow-lg shadow-[#4A2C20]/20'
                  : 'bg-white border-[#6B4030]/12 hover:border-[#B89555]/60'
              }`}
            >
              <OfferingImage
                src={item.image}
                alt=""
                fallback={item.fallbackImage}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <span className="min-w-0 flex-1">
                <span
                  className={`font-['DM_Sans'] text-[13.5px] font-semibold leading-snug line-clamp-2 [overflow-wrap:anywhere] ${
                    isActive ? 'text-white' : 'text-[#241A16]'
                  }`}
                >
                  {item.title}
                </span>
                <span
                  className={`block font-['DM_Sans'] text-xs mt-1 truncate ${isActive ? 'text-[#E5B869]' : 'text-[#6B4030]'}`}
                >
                  {item.meta}
                </span>
              </span>
              {/* Check slot is always reserved so cards keep the same layout when selected */}
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                  isActive ? 'bg-[#B89555] border-[#B89555] text-[#241A16]' : 'border-[#6B4030]/20 text-transparent'
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const CARD_SHADOW = 'shadow-[0_1px_2px_rgba(36,26,22,0.04),0_12px_32px_-16px_rgba(36,26,22,0.18)]';

/** Image beside title, description and quick facts; sized to sit next to the booking card. */
export function OverviewCard({ course, facts, fallbackImage }) {
  return (
    <article className={`h-full rounded-3xl bg-white border border-[#6B4030]/12 overflow-hidden ${CARD_SHADOW} grid sm:grid-cols-5`}>
      <div className="relative sm:col-span-2 aspect-[16/10] sm:aspect-auto sm:min-h-[340px] bg-[#241A16]">
        <OfferingImage
          src={course.image_url}
          alt={course.title}
          fallback={fallbackImage}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {course.badge && (
          <span className="absolute top-4 left-4 max-w-[calc(100%-2rem)] truncate px-3 py-1.5 rounded-full bg-[#241A16]/75 backdrop-blur-sm border border-[#B89555]/40 text-[#E5B869] font-['DM_Sans'] text-xs font-semibold">
            {course.badge}
          </span>
        )}
      </div>
      <div className="sm:col-span-3 p-6 sm:p-8 flex flex-col justify-center">
        {course.pillar_title && (
          <p className="font-['DM_Sans'] text-xs font-semibold uppercase tracking-[0.14em] text-[#B89555]">
            {course.pillar_title}
          </p>
        )}
        <h3 className="mt-2 font-['Cormorant_Garamond'] text-3xl sm:text-4xl font-bold text-[#241A16] leading-tight">
          {course.title}
        </h3>
        {course.description && (
          <p className="mt-3 font-['DM_Sans'] text-[15px] text-[#6B4030] leading-relaxed">{course.description}</p>
        )}
        <FactRow facts={facts} />
      </div>
    </article>
  );
}

export function FactRow({ facts }) {
  const visible = facts.filter((f) => f.label);
  if (visible.length === 0) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-2">
      {visible.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7F0] border border-[#6B4030]/10 font-['DM_Sans'] text-[13px] text-[#4A2C20]"
        >
          <Icon className="w-3.5 h-3.5 text-[#B89555]" />
          {label}
        </li>
      ))}
    </ul>
  );
}

/**
 * Layout rule for repeated content (workshop steps, journey phases, and anything
 * added later): a two-column grid where every card stretches to its row's height
 * and a lone last card spans the full row. This way no blank space is ever left
 * beside or under a card. Cards rendered here should use `h-full w-full`.
 */
export function CardGrid({ items, renderItem }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className={`flex ${items.length % 2 === 1 && i === items.length - 1 ? 'md:col-span-2' : ''}`}>
          {renderItem(item, i)}
        </li>
      ))}
    </ol>
  );
}

function SeatMeter({ seats }) {
  if (!seats.total) return null;
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between font-['DM_Sans'] text-[13px]">
        <span className="inline-flex items-center gap-1.5 text-[#F7F2E8]/70">
          <Users className="w-3.5 h-3.5 text-[#B89555]" />
          Seats
        </span>
        <span className="font-semibold text-white">
          {seats.isFull ? 'Fully booked' : `${seats.available} of ${seats.total} left`}
        </span>
      </div>
      <div
        className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-label="Seats booked"
        aria-valuenow={seats.filledPercent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${seats.isLow || seats.isFull ? 'bg-[#E58A5A]' : 'bg-[#B89555]'}`}
          style={{ width: `${Math.max(seats.filledPercent, 4)}%` }}
        />
      </div>
      {seats.isLow && (
        <p className="mt-2 font-['DM_Sans'] text-xs font-medium text-[#F2B28F]">
          Only {seats.available} {seats.available === 1 ? 'seat' : 'seats'} left
        </p>
      )}
    </div>
  );
}

/** `preview` renders the button without a link (used by the admin editor preview). */
export function BookingCard({ course, inclusions, ctaLabel, className = '', preview = false }) {
  const { price, original, savePercent } = getPricing(course);
  const seats = getSeats(course);

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-[#241A16] text-[#F7F2E8] p-6 sm:p-7 shadow-xl shadow-[#241A16]/15 flex flex-col ${className}`}>
      <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#B89555]/20 blur-3xl" />
      <div className="relative flex flex-col flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-['DM_Sans'] text-[11px] font-semibold uppercase tracking-[0.14em] text-[#E5B869]">
            Course fee
          </span>
          {savePercent > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-[#B89555] text-[#241A16] font-['DM_Sans'] text-[11px] font-bold">
              Save {savePercent}%
            </span>
          )}
        </div>
        <div className="mt-2 flex items-baseline flex-wrap gap-x-3">
          <span className="font-['Cormorant_Garamond'] text-5xl font-bold text-white leading-none">
            {formatINR(price)}
          </span>
          {original > 0 && (
            <span className="font-['DM_Sans'] text-base text-[#F7F2E8]/45 line-through">{formatINR(original)}</span>
          )}
        </div>
        {inclusions && (
          <p className="mt-3 font-['DM_Sans'] text-sm text-[#F7F2E8]/75 leading-relaxed">{inclusions}</p>
        )}

        <SeatMeter seats={seats} />

        <ul className="mt-6 space-y-2 font-['DM_Sans'] text-[13px] text-[#F7F2E8]/80 border-t border-white/10 pt-5">
          {course.duration && (
            <li className="flex items-center gap-2.5">
              <Clock className="w-3.5 h-3.5 text-[#B89555]" />
              {course.duration}
            </li>
          )}
          {course.mode && (
            <li className="flex items-center gap-2.5">
              <Hand className="w-3.5 h-3.5 text-[#B89555]" />
              {course.mode}
            </li>
          )}
        </ul>

        <div className="mt-auto" />
        {seats.isFull ? (
          <span className="mt-6 w-full inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/10 border border-white/15 font-['DM_Sans'] text-sm font-semibold text-[#F7F2E8]/70 cursor-not-allowed">
            Fully booked
          </span>
        ) : preview ? (
          <span
            title="Disabled in preview"
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#B89555] font-['DM_Sans'] text-sm font-bold text-[#241A16]"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4" />
          </span>
        ) : (
          <Link
            to={registerLink(course)}
            onClick={() => window.scrollTo(0, 0)}
            className="group mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#B89555] hover:bg-[#C9A666] font-['DM_Sans'] text-sm font-bold text-[#241A16] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5B869]"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </div>
  );
}

export function SectionSkeleton() {
  return (
    <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 animate-pulse" aria-hidden="true">
      <div className="lg:col-span-8 rounded-3xl bg-white border border-[#6B4030]/10 h-[380px]" />
      <div className="lg:col-span-4 rounded-3xl bg-[#241A16]/10 h-[380px]" />
      <div className="lg:col-span-12 rounded-3xl bg-white border border-[#6B4030]/10 h-[420px]" />
    </div>
  );
}

export function EmptyState({ message }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#6B4030]/25 bg-white/60 p-10 text-center font-['DM_Sans'] text-sm text-[#6B4030]">
      {message}
    </div>
  );
}
