import React from 'react';
import { Shield, Hand, Sparkles, TrendingUp, Compass, Award, CheckCircle2 } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function CoreValues() {
  const values = [
    {
      num: '01',
      title: 'Preserve Heritage',
      statement: 'Save Tamil Wisdom Through Practice',
      detail:
        'Living culture cannot be preserved solely inside museum glass; it survives when breathed into daily human practice.',
      icon: Shield,
      highlight: 'Living Practice',
      metric: '100% Living Tradition',
    },
    {
      num: '02',
      title: 'Create With Hands',
      statement: 'Skill Over Theory Through Tactile Work',
      detail:
        'The touch of stone, mineral paint, and the hammer on metal — true understanding lives in the fingertips of the creator.',
      icon: Hand,
      highlight: '75% Tactile Work',
      metric: '3:1 Practical Ratio',
    },
    {
      num: '03',
      title: 'Sacred Craftsmanship',
      statement: 'Respect Tradition and Ancient Canons',
      detail:
        'Every motif, proportion, and inscription carries sacred philosophical context passed down across millennia.',
      icon: Sparkles,
      highlight: 'Millennia Canons',
      metric: 'Millennia-Old Codes',
    },
    {
      num: '04',
      title: 'Livelihood Creation',
      statement: 'Skill → Income → Dignified Identity',
      detail:
        'Cultural learning must empower economic self-sufficiency, transforming artisans into thriving entrepreneurs.',
      icon: TrendingUp,
      highlight: 'Economic Dignity',
      metric: 'Sustainable Income',
    },
    {
      num: '05',
      title: 'Cultural Pride',
      statement: 'Bring Ancient Wisdom into Modern Life',
      detail:
        'Bridging ancestral Tamil mastery with contemporary architecture, fashion, interior design, and global branding.',
      icon: Compass,
      highlight: 'Modern Relevance',
      metric: 'Modern Application',
    },
  ];

  return (
    <section id="core-values" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      {/* Gentle Floating Bubbles Animation */}
      <FloatingBubbles count={12} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        {/* Centered Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              Guiding Philosophy
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight">
              Five Core Values
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed">
              The foundational pillars that guide every artisan, discipline, and creation across our repository.
            </p>
          </div>
        </Reveal>

        {/* Centered Symmetrical Charter Banner */}
        <Reveal direction="up" delay={150}>
          <div className="bg-[#4A2C20] rounded-2xl p-6 sm:p-8 text-[#F7F2E8] border border-[#B89555]/30 shadow-md text-center max-w-4xl mx-auto relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[#B89555]" />
              <span className="font-['DM_Sans'] text-xs uppercase tracking-wider text-[#B89555] font-semibold">
                Global Nagas Institute Charter
              </span>
            </div>
            <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl md:text-3xl text-white font-bold leading-snug">
              "Knowledge that remains untouched turns to memory; knowledge that creates turns to legacy."
            </p>
            <p className="font-['DM_Sans'] text-xs text-[#F7F2E8]/75 mt-2 font-normal">
              Hover over any of the five pillars to explore its craft significance and studio standard.
            </p>
          </div>
        </Reveal>

        {/* Symmetrical 5 Pillars Cards Grid: Default Clean White, Color Changes Only on Hover */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 items-stretch">
          {values.map((v, idx) => {
            const Icon = v.icon;

            return (
              <Reveal key={v.num} direction="up" delay={150 + idx * 70}>
                <div
                  className="group h-full rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between select-none bg-white text-[#241A16] border border-[#6B4030]/15 shadow-sm hover:bg-[#4A2C20] hover:text-[#F7F2E8] hover:border-[#B89555] hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-[#B89555]/40"
                >
                  <div className="space-y-4">
                    {/* Top Row: Number & Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-number text-2xl font-bold leading-none text-[#4A2C20] group-hover:text-[#B89555] transition-colors">
                        {v.num}
                      </span>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all bg-[#F7F2E8] text-[#6B4030] group-hover:bg-[#241A16] group-hover:text-[#B89555] group-hover:border group-hover:border-[#B89555]/40 group-hover:shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Value Title */}
                    <div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold leading-tight text-[#241A16] group-hover:text-white transition-colors">
                        {v.title}
                      </h3>
                      <p className="font-['DM_Sans'] text-xs font-semibold mt-1.5 leading-snug text-[#6B4030] group-hover:text-[#B89555] transition-colors">
                        {v.statement}
                      </p>
                    </div>

                    {/* Detail Description */}
                    <p className="font-['DM_Sans'] text-xs leading-relaxed font-normal pt-2 border-t border-[#6B4030]/10 text-[#241A16]/75 group-hover:border-white/10 group-hover:text-[#F7F2E8]/85 transition-colors">
                      {v.detail}
                    </p>

                    {/* Benchmark Metric Tag */}
                    <div className="flex items-center gap-1.5 pt-1 text-[11px] font-['DM_Sans'] font-medium text-[#6B4030] group-hover:text-[#B89555] transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555] shrink-0" />
                      <span>{v.metric}</span>
                    </div>
                  </div>

                  {/* Bottom Highlight Pill */}
                  <div className="pt-4 mt-4">
                    <span className="inline-block w-full text-center text-[11px] font-['DM_Sans'] font-medium px-3 py-1.5 rounded-lg border border-[#6B4030]/15 bg-[#F7F2E8] text-[#6B4030] group-hover:bg-[#B89555] group-hover:text-[#241A16] group-hover:font-semibold group-hover:border-[#B89555] transition-all">
                      {v.highlight}
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
