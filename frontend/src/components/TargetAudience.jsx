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
      desc: 'Transform ancient Tamil temple stone relief patterns, traditional wooden pillar carvings, sacred geometry, and pooja room sanctum layouts into bespoke luxury residential and commercial spaces.',
      highlights: [
        'Temple architectural proportions & vastu principles',
        'Pooja room interior detailing & sacred acoustics',
        'Traditional brass, wood, and stone integration',
      ],
      tag: 'Architectural Heritage',
    },
    {
      num: '2',
      title: 'Jewellery Designers / Artists',
      category: 'Ornamental Metallurgy & Traditional Art',
      image: '/artisan/audience-jewellery.jpg',
      icon: Palette,
      desc: 'Master the ancient canons of handmade naga jewellery, copper and brass repoussé, traditional Tanjore gold-leaf painting, and authentic iconography for fine jewelry and textile motifs.',
      highlights: [
        'Sacred naga motifs & handmade metal casting',
        'Traditional Tanjore & temple fresco techniques',
        'Blouse embroidery & modern heritage branding',
      ],
      tag: 'Creative Craftsmanship',
    },
    {
      num: '3',
      title: 'History Lovers / Students / Homemakers',
      category: 'Cultural Identity & Sustainable Livelihood',
      image: '/artisan/audience-history.jpg',
      icon: BookOpen,
      desc: 'Reconnect with ancestral Tamil roots, decipher ancient Tamili scripts and rock inscriptions, master practical handmade crafts, and build an independent, dignified creative livelihood from home.',
      highlights: [
        'Tamili Brahmi script & stone epigraphy basics',
        'Hands-on clay, rock art, and copper scribing',
        'Skill → income → identity for self-reliant creators',
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
            <p className="font-['DM_Sans'] mt-2.5 text-base sm:text-lg text-[#6B4030] font-normal leading-relaxed">
              The heritage framework is curated for three distinct pathways of creativity, design, and livelihood.
            </p>
          </div>
        </Reveal>

        {/* 3 Cards Grid - Sliding on Mobile */}
        <Reveal direction="up" delay={150}>
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-5 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 sm:gap-9">
            {audiences.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.num}
                  className="w-[84vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="group relative rounded-2xl overflow-hidden bg-white border border-[#6B4030]/15 border-b-4 border-b-[#B89555] shadow-[0_24px_50px_-10px_rgba(74,44,32,0.22)] hover:shadow-[0_34px_65px_-12px_rgba(74,44,32,0.32)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full select-none">
                    {/* Card Top: Distinct Featured Image Header */}
                    <div className="relative h-48 sm:h-52 overflow-hidden bg-[#241A16]">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Dark Solid Overlay at Bottom of Image for Smooth Transition */}
                      <div className="absolute inset-0 bg-[#241A16]/20" />

                      {/* Top Tag */}
                      <div className="absolute top-3 left-3 bg-[#241A16]/85 px-3 py-1 rounded-full border border-[#B89555]/30 text-[#B89555] text-[11px] font-['DM_Sans'] font-medium">
                        {item.tag}
                      </div>
                    </div>

                    {/* Card Body: Clean White Surface for Maximum Legibility */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5 text-[#241A16]">
                      <div>
                        {/* Icon & Category Header */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0 border border-[#B89555]/30 shadow-sm group-hover:scale-105 transition-transform">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-['DM_Sans'] text-xs font-semibold text-[#6B4030]">
                              {item.category}
                            </p>
                            <span className="text-[11px] text-[#241A16]/70 font-['DM_Sans'] font-medium">
                              Heritage Pathway
                            </span>
                          </div>
                        </div>

                        <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-[#241A16] mb-2.5 leading-snug">
                          {item.title}
                        </h3>

                        <p className="font-['DM_Sans'] text-xs sm:text-[13.5px] text-[#241A16]/80 leading-relaxed font-normal mb-5">
                          {item.desc}
                        </p>

                        {/* Key Highlights */}
                        <div className="space-y-2 pt-3 border-t border-[#6B4030]/15">
                          {item.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs font-['DM_Sans'] text-[#241A16]/85">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555] shrink-0 mt-0.5" />
                              <span className="leading-snug">{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Card Bottom Category Bar */}
                      <div className="pt-4 border-t border-[#6B4030]/15 flex items-center justify-between text-xs font-['DM_Sans'] font-medium text-[#6B4030]">
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
