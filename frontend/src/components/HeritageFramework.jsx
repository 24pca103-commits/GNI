import React from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

export default function HeritageFramework() {
  const pillars = [
    {
      number: '01',
      title: 'Painting (Art & Heritage)',
      category: 'Art & Heritage',
      badge: 'Core Studio Track',
      image: '/artisan/pillar-painting.jpg',
      description:
        'Prehistoric rock painting, temple painting, basic sketching, and sacred iconography.',
      subjects: 'Prehistoric rock art, temple murals, basic sketching, sacred deity iconography',
      tags: ['Rock Painting', 'Temple Painting', 'Basic Sketching', 'Iconography'],
    },
    {
      number: '02',
      title: 'Libi (Language & Epigraphy)',
      category: 'Language & Epigraphy',
      badge: 'Archival Epigraphy Track',
      image: '/artisan/pillar-epigraphy.jpg',
      description:
        'Tamili script, copper plate inscription basics, and stone inscription reading.',
      subjects: 'Tamili script, copper plate engraving, stone inscription reading, Sangam archives',
      tags: ['Tamili Script', 'Copper Plates', 'Stone Inscriptions', 'Reading Basics'],
    },
    {
      number: '03',
      title: 'Sculpturing & Nagas Metal Art',
      category: 'Sculpturing & Metal Art',
      badge: 'Work Integrated Guild',
      image: '/artisan/pillar-metal.jpg',
      description:
        'Handmade naga jewellery, copper/brass work, and sacred metal craft.',
      subjects: 'Handmade naga jewellery, copper/brass work, sacred metal casting, antique repoussé',
      tags: ['Naga Jewellery', 'Copper/Brass Work', 'Sacred Metal Craft', 'Sculpturing'],
    },
    {
      number: '04',
      title: 'Heritage Applications',
      category: 'Design & Livelihood',
      badge: 'Industry Incubation Track',
      image: '/artisan/pillar-applications.jpg',
      description:
        'Blouse design, pooja room interiors, jewellery motifs, architecture elements, home décor, branding.',
      subjects: 'Blouse design, pooja room interiors, jewellery motifs, architecture elements, home décor, branding',
      tags: ['Blouse Design', 'Pooja Interiors', 'Jewellery Motifs', 'Architecture Elements', 'Home Décor', 'Branding'],
    },
  ];

  const handleStaticClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <section id="heritage-skills" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Bookmark className="w-3.5 h-3.5 text-[#B89555]" />
              <span>4 Heritage Skill Pillars • Premium + Structured</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              <span className="block sm:inline">Programs Tailored to</span>{' '}
              <span className="block sm:inline">Heritage & Industry Needs</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-base sm:text-lg text-[#6B4030] font-normal leading-relaxed mb-3">
              Four comprehensive disciplines bridging ancient Tamil wisdom with practical livelihood and craftsmanship — Premium + Structured.
            </p>

            {/* Centered Repository Action Button */}
            <div className="inline-block">
              <button
                onClick={handleStaticClick}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c7a462] transition-colors cursor-default shadow-sm"
              >
                <span>View All Repository Tracks</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#241A16]" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* 4 Cards Grid - Sliding on Mobile */}
        <Reveal direction="up" delay={150}>
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-5 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-8 lg:gap-10">
            {pillars.map((pillar) => {
              return (
                <div
                  key={pillar.number}
                  className="w-[84vw] max-w-[340px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#6B4030]/15 border-b-4 border-b-[#B89555] shadow-[0_20px_45px_-8px_rgba(74,44,32,0.18)] hover:shadow-[0_30px_60px_-10px_rgba(74,44,32,0.28)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full relative select-none">
                    {/* Card Featured Image */}
                    <div className="relative h-60 sm:h-72 overflow-hidden bg-[#241A16]">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Category Pill with Bookmark Icon */}
                      <div className="absolute top-4 left-4 bg-[#241A16]/90 px-3 py-1 rounded-full border border-[#B89555]/30 text-[#B89555] text-xs font-['DM_Sans'] font-medium flex items-center gap-1.5 shadow-sm z-10">
                        <Bookmark className="w-3 h-3 text-[#B89555]" />
                        <span>{pillar.badge}</span>
                      </div>

                      {/* Bottom Dark Panel for Title */}
                      <div className="absolute inset-x-0 bottom-0 bg-[#241A16]/85 p-5 text-[#F7F2E8] z-10">
                        <p className="font-['DM_Sans'] text-xs text-[#B89555] font-medium mb-0.5">
                          {pillar.category}
                        </p>
                        <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-white tracking-tight">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1 space-y-5">
                      <p className="font-['DM_Sans'] text-sm text-[#241A16]/85 leading-relaxed font-normal">
                        {pillar.description}
                      </p>

                      {/* Subject Curriculum Overview */}
                      <div className="p-3.5 rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15 space-y-1">
                        <span className="text-[11px] font-['DM_Sans'] font-semibold text-[#6B4030] block">
                          Subjects & practical modules:
                        </span>
                        <p className="text-xs font-['DM_Sans'] text-[#241A16]/80 leading-normal">
                          {pillar.subjects}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {pillar.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 rounded-md text-xs font-['DM_Sans'] font-medium bg-[#F7F2E8] text-[#6B4030] border border-[#6B4030]/20"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Know More Pill Button */}
                      <div className="pt-4 border-t border-[#6B4030]/15 flex items-center justify-between">
                        <span className="text-xs font-['DM_Sans'] font-semibold text-[#6B4030]">
                          Cohort Track
                        </span>
                        <button
                          onClick={handleStaticClick}
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#241A16] border border-[#6B4030]/30 hover:border-[#B89555] hover:bg-[#B89555] transition-all cursor-default group/btn"
                        >
                          <span>Know More</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#241A16] group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
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
