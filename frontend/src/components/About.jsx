import React from 'react';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Award,
  CheckCircle2,
  Compass,
  Palette,
  Hammer,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function About() {
  const pillars = [
    {
      id: 0,
      icon: Palette,
      title: 'Ancestral Lineage & Living Practice',
      desc: 'We safeguard ancient Tamil wisdom not as passive museum exhibits, but through active daily hands-on practice, brushwork, and tactile carving under hereditary sthapathis.',
      metric: '100% Hands-on',
      highlight: 'Direct Living Sthapathi Mentorship',
    },
    {
      id: 1,
      icon: BookOpen,
      title: 'Sacred Epigraphical Repository',
      desc: 'Translating Tamili Brahmi inscriptions, copper plate land grants, and ancient manuscripts into actionable design knowledge for modern architectural and artistic creations.',
      metric: '2,000+ Inscriptions',
      highlight: 'Deciphering & Archival Studies',
    },
    {
      id: 2,
      icon: Hammer,
      title: 'Dignified Livelihood Creation',
      desc: 'Empowering traditional artisans, architects, and designers to command premium international markets for authentic sacred craftsmanship and luxury temple motifs.',
      metric: '₹80K - ₹2.5L / Month',
      highlight: 'Skill to Sustainable Revenue',
    },
  ];

  return (
    <section id="about" className="py-12 md:py-20 bg-white relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89555]" />
              <span>About Global Nagas Institute</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              <span className="block sm:inline">Preserving Ancient Tamil Wisdom</span>{' '}
              <span className="block sm:inline">Through Living Craftsmanship</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal">
              Global Nagas Institute is a specialized repository and pedagogical sanctuary bridging
              ancient rock art, Tamili epigraphy, and sacred metallurgy with contemporary design and sustainable livelihoods.
            </p>
          </div>
        </Reveal>

        {/* Unified Symmetrical Showcase Stage */}
        <Reveal direction="up" delay={180}>
          <div className="bg-[#F7F2E8] rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-[#6B4030]/15 shadow-md grid lg:grid-cols-12 gap-6 lg:gap-12 items-center">
            {/* Left Column: Authentic Studio Visual with Fixed Proportions */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-lg border border-[#6B4030]/20 bg-[#241A16] h-[300px] sm:h-[420px] group">
              <img
                src="/artisan/hands-on-studio.jpg"
                alt="Master artisans and students sculpting and carving sacred Tamil idols at Global Nagas Institute"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Overlaid Gold Badge on Top Left */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-md border border-[#6B4030]/15 flex items-center gap-1.5 sm:gap-2">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B89555]" />
                <span className="text-[11px] sm:text-xs font-['DM_Sans'] font-bold text-[#4A2C20]">
                  Living Atelier & Repository
                </span>
              </div>

              {/* Floating Bottom Status Bar - Clean 2-Col Grid to Prevent Text Overlap */}
              <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-[#241A16]/95 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-[#B89555]/30 grid grid-cols-2 divide-x divide-[#B89555]/30 text-[#F7F2E8]">
                <div className="pr-2 sm:pr-3 min-w-0">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-xl font-bold text-[#B89555] leading-tight truncate">
                    4 Heritage Pillars
                  </p>
                  <p className="font-['DM_Sans'] text-[10px] sm:text-[11px] text-[#F7F2E8]/80 mt-0.5 leading-tight truncate">
                    <span className="hidden sm:inline">Painting, Libi, Metal & Applications</span>
                    <span className="sm:hidden">Painting, Libi & Metal</span>
                  </p>
                </div>
                <div className="pl-2.5 sm:pl-3.5 min-w-0">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-xl font-bold text-[#B89555] leading-tight truncate">
                    1:3 Ratio
                  </p>
                  <p className="font-['DM_Sans'] text-[10px] sm:text-[11px] text-[#F7F2E8]/80 mt-0.5 leading-tight truncate">
                    25% Theory : 75% Studio
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Mission Narrative & Action */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full bg-[#4A2C20]/10 text-[#6B4030] text-xs font-['DM_Sans'] font-medium">
                  Our Mission & Pedagogical Ethos
                </span>
                <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#241A16] leading-tight">
                  From Ancient Temple Wisdom to Dignified Modern Creation
                </h3>
                <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#6B4030] leading-relaxed font-normal">
                  Ancient Tamil craftsmanship was never an isolated art — it was a complete spiritual, mathematical,
                  and architectural science. Global Nagas Institute brings this timeless tradition into hands-on
                  studios, giving every learner the tools to preserve cultural memory while building a thriving livelihood.
                </p>
              </div>

              {/* Institute Charter Quote Box */}
              <div className="bg-white border border-[#6B4030]/20 p-4 sm:p-5 rounded-2xl shadow-xs flex items-start gap-3.5">
                <Compass className="w-6 h-6 text-[#B89555] shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-snug">
                    "Save Tamil Wisdom Through Practice. Skill Over Theory, Learn by Doing."
                  </p>
                  <p className="font-['DM_Sans'] text-xs text-[#6B4030] font-medium mt-1">
                    — Charter of Global Nagas Institute
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#heritage-skills"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-['DM_Sans'] font-semibold text-xs text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] shadow-sm transition-all"
                >
                  <span>Explore 4 Heritage Pillars</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B89555]" />
                </a>

                <a
                  href="#why-join"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full font-['DM_Sans'] font-semibold text-xs text-[#241A16] bg-white border border-[#6B4030]/25 hover:bg-[#F7F2E8] transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#B89555]" />
                  <span>Why Join Us</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* 3 Symmetrical, Equal-Height Feature Cards - Sliding on Mobile */}
        <Reveal direction="up" delay={250}>
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 mt-8 sm:mt-10">
            {pillars.map((pillar) => {
              const IconComponent = pillar.icon;

              return (
                <div
                  key={pillar.id}
                  className="w-[84vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col justify-between group h-full">
                    <div>
                      {/* Header: Icon & Metric Pill */}
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-['DM_Sans'] font-bold text-[#241A16] bg-[#B89555] px-3 py-1 rounded-full shadow-xs">
                          {pillar.metric}
                        </span>
                      </div>

                      <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] mb-2.5 leading-snug group-hover:text-[#4A2C20] transition-colors">
                        {pillar.title}
                      </h3>

                      <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#6B4030] leading-relaxed font-normal">
                        {pillar.desc}
                      </p>
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-[#6B4030]/10 flex items-center gap-2 text-[11px] font-['DM_Sans'] text-[#4A2C20] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555]" />
                      <span>{pillar.highlight}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Hint Dots */}
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-3">
            {pillars.map((_, i) => (
              <span key={i} className="w-2 h-1.5 rounded-full bg-[#B89555]/50" />
            ))}
            <span className="text-[11px] font-['DM_Sans'] text-[#6B4030]/70 ml-1">Swipe to view more</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
