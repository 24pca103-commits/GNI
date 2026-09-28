import React, { useState, useRef } from 'react';
import { Shield, Hand, Sparkles, TrendingUp, Compass, Award, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function CoreValues() {
  const [activeCard, setActiveCard] = useState(0);
  const scrollRef = useRef(null);

  const values = [
    {
      num: '1',
      title: 'Preserve Heritage',
      statement: 'Save Tamil Wisdom Through Practice',
      detail:
        'Culture survives when breathed into daily hands-on practice, not inside museum glass.',
      icon: Shield,
      highlight: 'Living Practice',
      metric: '100% Living Tradition',
    },
    {
      num: '2',
      title: 'Create With Hands',
      statement: 'Skill Over Theory Through Tactile Work',
      detail:
        'The touch of stone, mineral paint, and metal — mastery lives in the creator’s fingers.',
      icon: Hand,
      highlight: '75% Tactile Work',
      metric: '3:1 Practical Ratio',
    },
    {
      num: '3',
      title: 'Sacred Craftsmanship',
      statement: 'Respect Tradition and Ancient Canons',
      detail:
        'Every motif, proportion, and inscription carries sacred philosophical context.',
      icon: Sparkles,
      highlight: 'Millennia Canons',
      metric: 'Millennia-Old Codes',
    },
    {
      num: '4',
      title: 'Livelihood Creation',
      statement: 'Skill → Income → Dignified Identity',
      detail:
        'Cultural learning must empower economic self-reliance and dignified livelihoods.',
      icon: TrendingUp,
      highlight: 'Economic Dignity',
      metric: 'Sustainable Income',
    },
    {
      num: '5',
      title: 'Cultural Pride',
      statement: 'Bring Ancient Wisdom into Modern Life',
      detail:
        'Bridging ancestral Tamil mastery with contemporary architecture and modern branding.',
      icon: Compass,
      highlight: 'Modern Relevance',
      metric: 'Modern Application',
    },
  ];

  // Detect card in view while scrolling on mobile
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const card = container.querySelector('[data-card-index]');
    if (!card) return;
    const cardWidth = card.offsetWidth + 16; // width + gap
    const activeIndex = Math.round(scrollLeft / cardWidth);
    if (activeIndex >= 0 && activeIndex < values.length && activeIndex !== activeCard) {
      setActiveCard(activeIndex);
    }
  };

  const scrollToCard = (idx) => {
    setActiveCard(idx);
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
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed text-justify indent-5 sm:indent-0">
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
              Click or scroll over any of the five pillars to explore its craft significance and studio standard.
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
              const isActive = activeCard === idx;

              return (
                <div
                  key={v.num}
                  data-card-index={idx}
                  onClick={() => setActiveCard(idx)}
                  className="w-[82vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div
                    className={`group h-full rounded-2xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none ${
                      isActive
                        ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#B89555] shadow-xl ring-2 ring-[#B89555]/50 -translate-y-1'
                        : 'bg-white text-[#241A16] border border-[#6B4030]/15 shadow-sm hover:bg-[#4A2C20] hover:text-[#F7F2E8] hover:border-[#B89555] hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-[#B89555]/40'
                    }`}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      {/* Top Row: Number & Icon */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-number text-xl sm:text-2xl font-bold leading-none transition-colors ${
                            isActive ? 'text-[#B89555]' : 'text-[#4A2C20] group-hover:text-[#B89555]'
                          }`}
                        >
                          {v.num}
                        </span>
                        <div
                          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all ${
                            isActive
                              ? 'bg-[#241A16] text-[#B89555] border border-[#B89555]/40 shadow-sm'
                              : 'bg-[#F7F2E8] text-[#6B4030] group-hover:bg-[#241A16] group-hover:text-[#B89555] group-hover:border group-hover:border-[#B89555]/40 group-hover:shadow-sm'
                          }`}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      </div>

                      {/* Value Title */}
                      <div>
                        <h3
                          className={`font-['Cormorant_Garamond'] text-lg sm:text-2xl font-bold leading-tight transition-colors text-left ${
                            isActive ? 'text-white' : 'text-[#241A16] group-hover:text-white'
                          }`}
                        >
                          {v.title}
                        </h3>
                        <p
                          className={`font-['DM_Sans'] text-[11px] sm:text-xs font-semibold mt-1 leading-snug transition-colors text-left ${
                            isActive ? 'text-[#B89555]' : 'text-[#6B4030] group-hover:text-[#B89555]'
                          }`}
                        >
                          {v.statement}
                        </p>
                      </div>

                      {/* Detail Description */}
                      <p
                        className={`font-['DM_Sans'] text-xs leading-relaxed font-normal pt-1.5 sm:pt-2 border-t transition-colors text-justify indent-4 sm:indent-0 ${
                          isActive
                            ? 'border-white/10 text-[#F7F2E8]/85'
                            : 'border-[#6B4030]/10 text-[#241A16]/75 group-hover:border-white/10 group-hover:text-[#F7F2E8]/85'
                        }`}
                      >
                        {v.detail}
                      </p>

                      {/* Benchmark Metric Tag */}
                      <div
                        className={`flex items-center gap-2 pt-0.5 text-[10px] sm:text-[11px] font-['DM_Sans'] font-medium transition-colors ${
                          isActive ? 'text-[#B89555]' : 'text-[#6B4030] group-hover:text-[#B89555]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" />
                        <span>{v.metric}</span>
                      </div>
                    </div>

                    {/* Bottom Highlight Pill */}
                    <div className="pt-2.5 mt-2.5 sm:pt-4 sm:mt-4">
                      <span
                        className={`inline-block w-full text-center text-[10px] sm:text-[11px] font-['DM_Sans'] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border transition-all ${
                          isActive
                            ? 'bg-[#B89555] text-[#241A16] font-semibold border-[#B89555]'
                            : 'border-[#6B4030]/15 bg-[#F7F2E8] text-[#6B4030] font-medium group-hover:bg-[#B89555] group-hover:text-[#241A16] group-hover:font-semibold group-hover:border-[#B89555]'
                        }`}
                      >
                        {v.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Mobile Indicator Dots */}
          <div className="flex sm:hidden items-center justify-center gap-2 mt-3">
            {values.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeCard === i ? 'w-6 bg-[#B89555]' : 'w-2 bg-[#6B4030]/30 hover:bg-[#6B4030]/60'
                }`}
                aria-label={`View value ${i + 1}`}
              />
            ))}
            <span className="text-[11px] font-['DM_Sans'] text-[#6B4030]/80 ml-1.5">
              Tap or scroll
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
