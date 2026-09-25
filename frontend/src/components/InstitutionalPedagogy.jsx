import React from 'react';
import {
  Compass,
  BookOpen,
  Hammer,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Award,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function InstitutionalPedagogy() {
  const theoryPoints = [
    'Sacred temple proportions & shilpa canons',
    'Tamili Brahmi & copper plate epigraphical deciphering',
    'Sangam literature symbolism & cultural philosophy',
  ];

  const practicePoints = [
    'Tactile brass sheet forming & antique repoussé',
    'Natural mineral pigment grinding & rock art techniques',
    'Commercial craftsmanship for modern luxury interiors',
  ];

  return (
    <section id="pedagogy" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={10} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Compass className="w-3.5 h-3.5 text-[#B89555]" />
              <span>The Learning Methodology</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Timeless Wisdom. Hands-on Mastery.
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed">
              Experiencing the structured curriculum at the Global Nagas Institute repository is truly transformative.
              We combine classical historical literature with intensive, daily tactile craftsmanship to prepare
              learners for dignified sustainable careers.
            </p>
          </div>
        </Reveal>

        {/* Golden Equilibrium Gauge - 1:3 Harmonic Balance */}
        <Reveal direction="up" delay={150}>
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-white rounded-2xl p-5 sm:p-6 border border-[#6B4030]/15 shadow-sm">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#6B4030]" />
                <span className="font-['DM_Sans'] text-xs sm:text-sm font-semibold text-[#6B4030]">
                  25% Theoretical Foundations
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#F7F2E8] border border-[#6B4030]/20">
                <Scale className="w-3.5 h-3.5 text-[#B89555]" />
                <span className="font-['DM_Sans'] text-[11px] font-medium text-[#241A16]">
                  Harmonic 1:3 Learning Equilibrium
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hammer className="w-4 h-4 text-[#B89555]" />
                <span className="font-['DM_Sans'] text-xs sm:text-sm font-semibold text-[#B89555]">
                  75% Hands-on Studio Practice
                </span>
              </div>
            </div>

            {/* Visual Ratio Balance Track */}
            <div className="w-full h-3.5 rounded-full bg-[#F7F2E8] p-0.5 border border-[#6B4030]/15 flex overflow-hidden">
              <div className="h-full bg-[#6B4030] rounded-l-full w-[25%]" title="25% Theory" />
              <div className="h-full bg-[#B89555] rounded-r-full w-[75%]" title="75% Hands-on Studio" />
            </div>

            <p className="text-center font-['DM_Sans'] text-[11px] text-[#6B4030] mt-3">
              Every 1 hour of scriptural & geometric study is anchored by 3 hours of physical hammer, chisel, and pigment work.
            </p>
          </div>
        </Reveal>

        {/* Symmetrical Dual Pavilion (50 / 50 Balanced Grid) with Animated Image Zoom on Click */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          {/* Left Wing: 25% Theoretical Foundations */}
          <Reveal direction="up" delay={200}>
            <div className="bg-white rounded-3xl overflow-hidden border border-[#6B4030]/20 border-b-4 border-b-[#6B4030] shadow-[0_24px_50px_-10px_rgba(74,44,32,0.18)] hover:shadow-[0_28px_55px_-10px_rgba(74,44,32,0.25)] transition-all duration-300 flex flex-col justify-between h-full select-none group">
              <div>
                {/* Header Image Frame */}
                <div className="relative h-60 sm:h-72 overflow-hidden bg-[#241A16]">
                  <img
                    src="/artisan/pillar-epigraphy.jpg"
                    alt="Epigraphical study, manuscripts, and temple canons"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-[#241A16]/25" />

                  {/* Percentage Floating Badge */}
                  <div className="absolute top-4 left-4 bg-[#241A16]/90 border border-[#6B4030]/40 px-3.5 py-1.5 rounded-xl flex items-center gap-2 z-10 shadow-sm">
                    <BookOpen className="w-4 h-4 text-[#F7F2E8]" />
                    <span className="font-number text-xl sm:text-2xl font-bold text-white">
                      25%
                    </span>
                    <span className="text-[11px] font-['DM_Sans'] uppercase font-semibold text-[#F7F2E8]/90 tracking-wider">
                      Theory
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-7 sm:p-8 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-['DM_Sans'] font-semibold uppercase tracking-wider text-[#6B4030]">
                      Classical Foundations & Canons
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16] leading-snug">
                      Ancient Wisdom, Scripture & Epigraphy
                    </h3>
                  </div>

                  <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#241A16]/80 leading-relaxed font-normal">
                    The theoretical basis involves deep exploration of Sangam heritage literature, understanding
                    sacred temple geometry, deciphering Tamili Brahmi epigraphical records, and learning the
                    philosophical canons of traditional shilpa shastras.
                  </p>

                  {/* Key Syllabus Modules */}
                  <div className="pt-2 space-y-2.5">
                    <span className="text-xs font-['DM_Sans'] font-bold text-[#4A2C20] block">
                      Core Learning Modules:
                    </span>
                    {theoryPoints.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-['DM_Sans'] text-[#6B4030]">
                        <CheckCircle2 className="w-4 h-4 text-[#6B4030] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Meta */}
              <div className="px-7 sm:px-8 py-4 bg-[#F7F2E8]/60 border-t border-[#6B4030]/15 flex items-center justify-between text-xs font-['DM_Sans'] text-[#6B4030]">
                <span>15 hours per module</span>
                <span className="font-semibold text-[#4A2C20]">Scriptural Grounding</span>
              </div>
            </div>
          </Reveal>

          {/* Right Wing: 75% Hands-on Studio Practice */}
          <Reveal direction="up" delay={250}>
            <div className="bg-white rounded-3xl overflow-hidden border border-[#B89555]/30 border-b-4 border-b-[#B89555] shadow-[0_24px_50px_-10px_rgba(74,44,32,0.22)] hover:shadow-[0_28px_55px_-10px_rgba(74,44,32,0.28)] transition-all duration-300 flex flex-col justify-between h-full select-none group">
              <div>
                {/* Header Image Frame */}
                <div className="relative h-60 sm:h-72 overflow-hidden bg-[#241A16]">
                  <img
                    src="/artisan/hands-on-studio.jpg"
                    alt="Hands-on traditional metal sculpture and sacred craft studio apprentices"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-[#241A16]/25" />

                  {/* Percentage Floating Badge */}
                  <div className="absolute top-4 left-4 bg-[#4A2C20] border border-[#B89555]/50 px-3.5 py-1.5 rounded-xl flex items-center gap-2 shadow-md z-10">
                    <Hammer className="w-4 h-4 text-[#B89555]" />
                    <span className="font-number text-xl sm:text-2xl font-bold text-[#B89555]">
                      75%
                    </span>
                    <span className="text-[11px] font-['DM_Sans'] uppercase font-semibold text-white tracking-wider">
                      Hands-on Studio
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-7 sm:p-8 space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-['DM_Sans'] font-semibold uppercase tracking-wider text-[#B89555]">
                      Tactile Craft & Livelihood Creation
                    </span>
                    <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16] leading-snug">
                      Tactile Craftsmanship & Modern Livelihood
                    </h3>
                  </div>

                  <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#241A16]/80 leading-relaxed font-normal">
                    The practical immersion involves tactile stone scribing, preparing natural mineral pigments,
                    forging antique brass and copper repoussé, mastering naga jewellery, and creating commercial
                    products for modern architecture and luxury interiors.
                  </p>

                  {/* Key Syllabus Modules */}
                  <div className="pt-2 space-y-2.5">
                    <span className="text-xs font-['DM_Sans'] font-bold text-[#4A2C20] block">
                      Core learning modules:
                    </span>
                    {practicePoints.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-['DM_Sans'] text-[#6B4030]">
                        <CheckCircle2 className="w-4 h-4 text-[#B89555] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer Meta */}
              <div className="px-7 sm:px-8 py-4 bg-[#F7F2E8]/60 border-t border-[#6B4030]/15 flex items-center justify-between text-xs font-['DM_Sans'] text-[#6B4030]">
                <span>45 hours per module</span>
                <span className="font-semibold text-[#B89555]">Tactile livelihood</span>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Anchored Institutional Master Bar */}
        <Reveal direction="up" delay={300}>
          <div className="bg-[#4A2C20] rounded-2xl p-6 sm:p-8 text-[#F7F2E8] border border-[#B89555]/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-[#B89555] text-[#241A16] flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-['DM_Sans'] text-[#B89555] font-semibold uppercase tracking-wider block">
                  Guild certified pedagogy
                </span>
                <p className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-white">
                  Mentored directly by traditional temple sthapatis and master artisans.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-[#B89555]/30 text-xs font-['DM_Sans'] text-[#B89555] font-medium">
              <Award className="w-4 h-4 text-[#B89555]" />
              <span>Ancestral wisdom → Modern economy</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
