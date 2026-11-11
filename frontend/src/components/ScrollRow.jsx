import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * One horizontal row of cards with no visible scrollbar.
 * - Centred when all cards fit; scrolls from the left when they don't.
 * - Edge fades + arrow buttons (sm and up) appear only while there is more to scroll.
 * - Optional dots under the row (only while it overflows).
 * - `activeIndex` keeps the selected card fully in view (scrolls the row, never the page).
 * Fade colour comes from the CSS variable --row-bg set by the parent section.
 */
export default function ScrollRow({ children, activeIndex, label, role, dots = false, className = '' }) {
  const trackRef = useRef(null);
  const innerRef = useRef(null);
  const [state, setState] = useState({ left: false, right: false, overflow: false, current: 0 });
  const items = Children.toArray(children);

  const update = useCallback(() => {
    const el = trackRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const overflow = el.scrollWidth > el.clientWidth + 4;
    // Index of the card nearest the left edge (for the dots)
    let current = 0;
    let best = Infinity;
    [...inner.children].forEach((child, i) => {
      const d = Math.abs(child.offsetLeft - el.scrollLeft - 16);
      if (d < best) {
        best = d;
        current = i;
      }
    });
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) current = inner.children.length - 1;
    setState({
      overflow,
      left: overflow && el.scrollLeft > 4,
      right: overflow && el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      current,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    if (innerRef.current) ro.observe(innerRef.current);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [update, items.length]);

  const scrollToCard = useCallback((i, onlyIfHidden) => {
    const el = trackRef.current;
    const card = innerRef.current?.children[i];
    if (!el || !card) return;
    const left = card.offsetLeft;
    const hidden = left < el.scrollLeft || left + card.offsetWidth > el.scrollLeft + el.clientWidth;
    if (!onlyIfHidden || hidden) el.scrollTo({ left: Math.max(0, left - 16), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (activeIndex !== undefined && activeIndex !== null) scrollToCard(activeIndex, true);
  }, [activeIndex, scrollToCard]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  const arrow =
    'hidden sm:flex absolute top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white border border-[#6B4030]/15 shadow-md items-center justify-center text-[#4A2C20] hover:bg-[#4A2C20] hover:text-[#E5B869] transition-colors cursor-pointer';

  return (
    <div className={className}>
      <div className="relative">
        {state.left && (
          <>
                        <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className={`${arrow} -left-3`}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}
        {state.right && (
          <>
                        <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className={`${arrow} -right-3`}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* py leaves room so card shadows are not clipped by the scroll container */}
        <div
          ref={trackRef}
          className="relative overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-4 px-4 scroll-px-4 sm:mx-0 sm:px-0 sm:scroll-px-0 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div ref={innerRef} role={role} aria-label={label} className="flex w-max mx-auto gap-3 sm:gap-4 items-stretch">
            {items}
          </div>
        </div>
      </div>

      {dots && state.overflow && items.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToCard(i, false)}
              aria-label={`Go to card ${i + 1}`}
              className={`gni-dot h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                state.current === i ? 'w-6 bg-[#B89555]' : 'w-2 bg-[#6B4030]/30 hover:bg-[#6B4030]/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
