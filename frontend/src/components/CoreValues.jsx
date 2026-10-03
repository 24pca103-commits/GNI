import React, { useState, useRef } from 'react';
import { Shield, Hand, Sparkles, TrendingUp, Compass, Award, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function CoreValues() {
  const values = [
    {
      num: '1',
      title: 'Preserve Heritage',
      statement: 'Ancestral Wisdom in Practice',
      detail:
        'Living traditions safeguarded through hands-on daily master practice, not inside museum glass.',
      icon: Shield,
      imageIcon: '/artisan/values/val-preserve-heritage.png',
      highlight: 'Living Practice',
      metric: '100% Living Tradition',
    },
    {
      num: '2',
      title: 'Hand Mastery',
      statement: 'Skill Over Theory by Doing',
      detail:
        'Tactile mastery sculpted into the creator’s fingers with sacred tools and pure metals.',
      icon: Hand,
      imageIcon: '/artisan/values/val-create-hands.png',
      highlight: '75% Studio Work',
      metric: '3:1 Practical Ratio',
    },
    {
      num: '3',
      title: 'Sacred Craft',
      statement: 'Respect for Ancient Canons',
      detail:
        'Every motif, proportion, and line follows timeless Shilpa Shastra philosophical canons.',
      icon: Sparkles,
      imageIcon: '/artisan/values/val-sacred-craft.png',
      highlight: 'Millennia Canons',
      metric: 'Agamic Precision Codes',
    },
    {
      num: '4',
      title: 'Empower Livelihood',
      statement: 'Skill to Dignified Income',
      detail:
        'Cultural mastery that builds sustainable, independent livelihoods and economic self-reliance.',
      icon: TrendingUp,
      imageIcon: '/artisan/values/val-livelihood-income.png',
      highlight: 'Economic Dignity',
      metric: 'Sustainable Income',
    },
    {
      num: '5',
      title: 'Cultural Pride',
      statement: 'Ancient Wisdom in Modern Life',
      detail:
        'Bridging deep heritage artistry with contemporary luxury design and modern architecture.',
      icon: Compass,
      imageIcon: '/artisan/values/val-cultural-pride.png',
      highlight: 'Modern Relevance',
      metric: 'Modern Application',
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

        {/* Symmetrical 5 Pillars Cards: Sliding on Mobile, Uniform Grid on Desktop */}
        <Reveal direction="up" delay={150}>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1 gap-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:gap-5 items-stretch"
          >
            {values.map((v, idx) => {
              return (
                <div
                  key={v.num}
                  data-card-index={idx}
                  className="w-[82vw] max-w-[300px] sm:w-auto sm:max-w-none shrink-0 snap-center flex flex-col h-full"
                >
                  <div className="group h-full rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between select-none bg-[#FAF6EE] text-[#241A16] border border-[#6B4030]/15 shadow-sm hover:border-[#B89555] hover:shadow-xl text-center">
                    {/* Top Content Group */}
                    <div className="flex flex-col items-center">
                      {/* Top Large Circular Gold Medallion Image Icon */}
                      <div className="relative flex justify-center pt-1 mb-3">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#B89555] bg-white p-2.5 flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110">
                          <img
                            src={v.imageIcon}
                            alt={v.title}
                            className="w-full h-full object-contain filter drop-shadow-xs"
                            loading="lazy"
                          />
                        </div>
                        <span className="absolute top-0 -right-2 font-number text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#4A2C20]/10 text-[#4A2C20]">
                          0{v.num}
                        </span>
                      </div>

                      {/* Single-Line Value Title */}
                      <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold leading-none text-[#241A16] group-hover:text-[#4A2C20] transition-colors whitespace-nowrap overflow-hidden text-ellipsis w-full mb-1.5">
                        {v.title}
                      </h3>

                      {/* Fixed-Height Statement Subtitle for Perfect Alignment */}
                      <div className="min-h-[32px] sm:min-h-[36px] flex items-center justify-center w-full mb-2">
                        <p className="font-['Cormorant_Garamond'] italic text-xs sm:text-[13px] leading-snug text-[#6B4030]">
                          {v.statement}
                        </p>
                      </div>

                      {/* Decorative Ornament Divider */}
                      <div className="flex items-center justify-center gap-1.5 py-1 mb-2.5 w-full">
                        <span className="h-px w-6 bg-[#B89555]/40" />
                        <span className="text-[10px] text-[#B89555]">❖</span>
                        <span className="h-px w-6 bg-[#B89555]/40" />
                      </div>

                      {/* Fixed-Height Description for Uniform Text Flow */}
                      <div className="min-h-[64px] sm:min-h-[72px] flex items-center justify-center w-full">
                        <p className="font-['DM_Sans'] text-xs leading-relaxed font-normal text-[#241A16]/80 text-center">
                          {v.detail}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Highlight Pill & Metric locked to identical baseline */}
                    <div className="pt-3 mt-4 border-t border-[#6B4030]/15 space-y-1.5 w-full">
                      <span className="inline-block w-full text-center text-[10.5px] sm:text-[11px] font-['DM_Sans'] px-2.5 py-1 rounded-full border border-[#B89555]/50 bg-white text-[#4A2C20] font-semibold group-hover:bg-[#4A2C20] group-hover:text-[#B89555] group-hover:border-[#4A2C20] transition-all whitespace-nowrap">
                        {v.highlight}
                      </span>
                      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[10.5px] font-['DM_Sans'] font-medium text-[#6B4030] whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" />
                        <span>{v.metric}</span>
                      </div>
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
