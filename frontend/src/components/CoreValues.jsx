import React, { useState, useRef } from 'react';
import { Shield, Hand, Sparkles, TrendingUp, Compass, Award, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function CoreValues() {
  const values = [
    {
      num: '1',
      title: 'Preserve Heritage',
      statement: 'Save Tamil Wisdom Through Practice',
      detail:
        'Preserve and safeguard ancient Tamil wisdom through active daily practice.',
      icon: Shield,
      highlight: 'Save Tamil Wisdom',
      metric: 'Living Practice',
    },
    {
      num: '2',
      title: 'Create with Hands',
      statement: 'Skill Over Theory, Learn by Doing',
      detail:
        'Hands-on experience and real craft execution over passive book theory.',
      icon: Hand,
      highlight: 'Hands-on Experience',
      metric: 'Learn by Doing',
    },
    {
      num: '3',
      title: 'Sacred Craftsmanship',
      statement: 'Respect Tradition and Meaning',
      detail:
        'Every motif, sacred geometry proportion, and inscription respects ancient cultural meaning.',
      icon: Sparkles,
      highlight: 'Respect Tradition',
      metric: 'Sacred Meaning',
    },
    {
      num: '4',
      title: 'Livelihood Creation',
      statement: 'Skill → Income → Identity',
      detail:
        'Transforming authentic heritage craft mastery into sustainable income and proud identity.',
      icon: TrendingUp,
      highlight: 'Skill → Income → Identity',
      metric: 'Sustainable Income',
    },
    {
      num: '5',
      title: 'Cultural Pride',
      statement: 'Ancient Knowledge for Modern Life',
      detail:
        'Applying timeless ancient Tamil knowledge into modern design, interiors, and daily life.',
      icon: Compass,
      highlight: 'Ancient Knowledge',
      metric: 'Modern Life',
    },
  ];

  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  // Detect card in view while scrolling on mobile
  const handleScroll = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    const card = el.querySelector('[data-card-index]');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16; // width + gap
    const activeIndex = Math.round(el.scrollLeft / cardWidth);
    setActiveDot(Math.min(Math.max(activeIndex, 0), values.length - 1));
  };

  const scrollToCard = (idx) => {
    setActiveDot(idx);
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const card = container.querySelector(`[data-card-index="${idx}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  return (
    <section id="core-values" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      {/* Gentle Floating Bubbles Animation */}
      <FloatingBubbles count={12} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-5 sm:space-y-8">
        {/* Centered Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              Guiding Philosophy
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Five Core Values
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-justify indent-5 sm:indent-0 sm:text-center sm:mx-auto max-w-2xl">
              The foundational pillars that guide every artisan, discipline, and creation across our repository.
            </p>
          </div>
        </Reveal>

        {/* Centered Symmetrical Charter Banner */}
        <Reveal direction="up" delay={150}>
          <div className="bg-[#4A2C20] rounded-2xl p-5 sm:p-8 text-[#F7F2E8] border border-[#B89555]/30 shadow-md text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
              <Award className="w-4 h-4 text-[#B89555]" />
              <span className="font-['DM_Sans'] text-xs uppercase tracking-wider text-[#B89555] font-semibold">
                Global Nagas Institute Charter
              </span>
            </div>
            <p className="font-['Cormorant_Garamond'] text-lg sm:text-2xl md:text-3xl text-white font-bold leading-snug">
              "Knowledge that remains untouched turns to memory; knowledge that creates turns to legacy."
            </p>
            <p className="font-['DM_Sans'] text-xs text-[#F7F2E8]/75 mt-1.5 sm:mt-2 font-normal text-justify indent-5 sm:indent-0 sm:text-center">
              Explore each of the five pillars representing our craft significance and studio standards.
            </p>
          </div>
        </Reveal>

        {/* Symmetrical 5 Pillars Cards: Sliding on Mobile, Grid on Larger Screens */}
        <Reveal direction="up" delay={150}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1 gap-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-5 items-stretch"
          >
            {values.map((v, idx) => {
              const Icon = v.icon;

              return (
                <div
                  key={v.num}
                  data-card-index={idx}
                  className="w-[82vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="group h-full rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between select-none bg-white text-[#241A16] border border-[#6B4030]/15 shadow-sm hover:border-[#B89555]/50 hover:shadow-lg">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Top Row: Number & Icon */}
                      <div className="flex items-center justify-between">
                        <span className="font-number text-xl sm:text-2xl font-bold leading-none text-[#4A2C20] group-hover:text-[#B89555] transition-colors">
                          {v.num}
                        </span>
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all bg-[#F7F2E8] text-[#6B4030] group-hover:bg-[#4A2C20] group-hover:text-[#B89555] shadow-xs">
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>

                      {/* Value Title */}
                      <div>
                        <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-2xl font-bold leading-tight text-[#241A16] text-left">
                          {v.title}
                        </h3>
                        <p className="font-['DM_Sans'] text-[11px] sm:text-xs font-semibold mt-1 leading-snug text-[#6B4030] text-left">
                          {v.statement}
                        </p>
                      </div>

                      {/* Detail Description */}
                      <p className="font-['DM_Sans'] text-xs leading-relaxed font-normal pt-1.5 sm:pt-2 border-t border-[#6B4030]/10 text-[#241A16]/80 text-justify indent-4 sm:indent-0">
                        {v.detail}
                      </p>

                      {/* Benchmark Metric Tag */}
                      <div className="flex items-center gap-2 pt-0.5 text-[10px] sm:text-[11px] font-['DM_Sans'] font-medium text-[#6B4030]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" />
                        <span>{v.metric}</span>
                      </div>
                    </div>

                    {/* Bottom Highlight Pill */}
                    <div className="pt-2.5 mt-2.5 sm:pt-4 sm:mt-4">
                      <span className="inline-block w-full text-center text-[10px] sm:text-[11px] font-['DM_Sans'] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-[#6B4030]/15 bg-[#F7F2E8] text-[#6B4030] font-medium group-hover:bg-[#B89555] group-hover:text-[#241A16] group-hover:font-semibold group-hover:border-[#B89555] transition-all">
                        {v.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Mobile Indicator Dots (Dynamic color change on manual scroll) */}
          <div className="flex sm:hidden items-center justify-center gap-2 mt-3">
            {values.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeDot === i
                    ? 'w-6 bg-[#B89555]'
                    : 'w-2 bg-[#6B4030]/30 hover:bg-[#6B4030]/60'
                }`}
                aria-label={`View value ${i + 1}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
