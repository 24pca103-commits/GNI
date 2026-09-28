import React from 'react';
import { Compass, Palette, BookOpen, CheckCircle2, Users } from 'lucide-react';
import Reveal from './Reveal';

export default function TargetAudience() {
  const audiences = [
    {
      num: '1',
      title: 'Architects / Interior Designers',
      category: 'Spatial Design & Sacred Architecture',
      image: '/artisan/audience-architect.jpg',
      icon: Compass,
      desc: 'Integrate ancient Tamil stone relief motifs, sacred proportions, and traditional pooja sanctums into luxury residential and commercial architecture.',
      highlights: [
        'Temple proportions & vastu principles',
        'Pooja room & sacred acoustics',
      ],
      tag: 'Architectural Heritage',
    },
    {
      num: '2',
      title: 'Jewellery Designers / Artists',
      category: 'Ornamental Metallurgy & Art',
      image: '/artisan/audience-jewellery.jpg',
      icon: Palette,
      desc: 'Master ancient naga jewellery, copper/brass repoussé, Tanjore gold-leaf painting, and authentic heritage iconography.',
      highlights: [
        'Sacred naga motifs & metal casting',
        'Tanjore painting & temple fresco craft',
      ],
      tag: 'Creative Craftsmanship',
    },
    {
      num: '3',
      title: 'History Lovers / Students / Homemakers',
      category: 'Cultural Identity & Livelihood',
      image: '/artisan/audience-history.jpg',
      icon: BookOpen,
      desc: 'Learn ancient Tamili epigraphy and rock inscriptions, master handmade craft skills, and build self-reliant creative livelihoods.',
      highlights: [
        'Tamili Brahmi & stone epigraphy basics',
        'Clay, rock art & copper scribing',
      ],
      tag: 'Roots & Livelihood',
    },
  ];

  return (
    <section id="about" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Users className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Who Is This For?</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Find 3 Types of People
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-lg text-[#6B4030] font-normal leading-relaxed text-left text-justify sm:text-center">
              Curated for three distinct pathways of creativity, design, and livelihood.
            </p>
          </div>
        </Reveal>

        {/* 3 Cards Grid - Sliding on Mobile */}
        <Reveal direction="up" delay={150}>
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 sm:gap-9">
            {audiences.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.num}
                  className="w-[82vw] max-w-[310px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-white border border-[#6B4030]/15 border-b-4 border-b-[#B89555] shadow-[0_20px_45px_-10px_rgba(74,44,32,0.18)] hover:shadow-[0_30px_60px_-12px_rgba(74,44,32,0.28)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full select-none">
                    {/* Card Top: Distinct Featured Image Header */}
                    <div className="relative h-32 sm:h-48 overflow-hidden bg-[#241A16]">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Dark Solid Overlay at Bottom of Image for Smooth Transition */}
                      <div className="absolute inset-0 bg-[#241A16]/20" />

                      {/* Top Tag */}
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#241A16]/85 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#B89555]/30 text-[#B89555] text-[9.5px] sm:text-[11px] font-['DM_Sans'] font-medium">
                        {item.tag}
                      </div>
                    </div>

                    {/* Card Body: Clean White Surface for Maximum Legibility */}
                    <div className="p-3.5 sm:p-6 flex flex-col justify-between flex-1 space-y-2.5 sm:space-y-4 text-[#241A16] text-left">
                      <div>
                        {/* Icon & Category Header */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0 border border-[#B89555]/30 shadow-sm">
                            <Icon className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className="font-['DM_Sans'] text-[10.5px] sm:text-xs font-semibold text-[#6B4030]">
                              {item.category}
                            </p>
                            <span className="text-[9.5px] sm:text-[11px] text-[#241A16]/60 font-['DM_Sans']">
                              Heritage Pathway
                            </span>
                          </div>
                        </div>

                        <h3 className="font-['Cormorant_Garamond'] text-base sm:text-2xl font-bold text-[#241A16] mb-1 leading-snug">
                          {item.title}
                        </h3>

                        <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-snug font-normal mb-2.5 text-left">
                          {item.desc}
                        </p>

                        {/* Key Highlights */}
                        <div className="space-y-1 pt-2 border-t border-[#6B4030]/15 text-left">
                          {item.highlights.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-['DM_Sans'] text-[#241A16]/85">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" />
                              <span className="leading-snug text-[11px] sm:text-xs">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Category Bar */}
                      <div className="pt-2 border-t border-[#6B4030]/15 flex items-center justify-between text-[10.5px] sm:text-xs font-['DM_Sans'] font-medium text-[#6B4030]">
                        <span>Learner Profile</span>
                        <span className="text-[#B89555] font-semibold">
                          Core Track
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Hint Dots */}
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-3">
            {audiences.map((_, i) => (
              <span key={i} className="w-2 h-1.5 rounded-full bg-[#B89555]/50" />
            ))}
            <span className="text-[11px] font-['DM_Sans'] text-[#6B4030]/70 ml-1">Swipe to view more</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
