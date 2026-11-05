import React, { useState, useEffect } from 'react';
import { Bookmark, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import ScrollRow from './ScrollRow';
import { fetchPillars } from '../services/api';

const DEFAULT_PILLARS = [
  {
    number: '1',
    title: 'Painting & Natural Mineral Pigments',
    category: 'Art & Heritage',
    badge: 'Core Studio Track',
    image: '/artisan/pillar-painting.jpg',
    description:
      'Prehistoric rock painting, temple murals, sketching, and sacred deity iconography.',
    subjects: 'Rock art, temple murals, sketching & iconography',
    tags: ['Rock Painting', 'Temple Murals', 'Sketching', 'Iconography'],
  },
  {
    number: '2',
    title: 'Libi – Language, Scripts & Epigraphy',
    category: 'Language & Epigraphy',
    badge: 'Archival Epigraphy Track',
    image: '/artisan/pillar-epigraphy.jpg',
    description:
      'Tamili Brahmi script deciphering, copper plate engraving, and stone inscription reading.',
    subjects: 'Tamili script, copper plates & stone inscriptions',
    tags: ['Tamili Script', 'Copper Plates', 'Stone Inscriptions'],
  },
  {
    number: '3',
    title: 'Sculpturing & Sacred Nagas Metal Art',
    category: 'Sculpturing & Metal Art',
    badge: 'Work Integrated Guild',
    image: '/artisan/pillar-metal.jpg',
    description:
      'Handmade naga jewellery, copper/brass repousse, and sacred metal casting traditions.',
    subjects: 'Naga jewellery, repousse & metal casting',
    tags: ['Naga Jewellery', 'Copper/Brass', 'Metal Casting'],
  },
  {
    number: '4',
    title: 'Heritage Applications & Interior Crafts',
    category: 'Design & Livelihood',
    badge: 'Industry Incubation Track',
    image: '/artisan/pillar-applications.jpg',
    description:
      'Blouse design, pooja room sanctums, jewellery motifs, and sacred architectural elements.',
    subjects: 'Pooja interiors, blouse motifs & heritage decor',
    tags: ['Pooja Interiors', 'Jewellery Motifs', 'Heritage Décor'],
  },
];

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const countWord = (n) => COUNT_WORDS[n] || String(n);

export default function HeritageFramework() {
  const [pillars, setPillars] = useState(DEFAULT_PILLARS);

  useEffect(() => {
    let isMounted = true;
    fetchPillars()
      .then((data) => {
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const activeOnly = data.filter((p) => p.is_active !== false && p.is_active !== 0);
          if (activeOnly.length > 0) {
            setPillars(activeOnly);
          }
        }
      })
      .catch((err) => {
        console.warn('[HeritageFramework] Using fallback pillars:', err.message);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStaticClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const workshopEl = document.querySelector('#workshop') || document.querySelector('#learning-journey');
    if (workshopEl) {
      workshopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="heritage-skills" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden" style={{ '--row-bg': '#F7F2E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Centered Section Header */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Bookmark className="w-3.5 h-3.5 text-[#B89555]" />
              <span>{pillars.length} Heritage Skill Pillars • Premium + Structured</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-normal pb-1">
              <span className="block sm:inline">Programs Tailored to</span>{' '}
              <span className="block sm:inline">Heritage &amp; Industry Needs</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] font-normal leading-relaxed mb-3 text-center mx-auto max-w-2xl">
              {countWord(pillars.length)} comprehensive disciplines bridging ancient Tamil wisdom with practical livelihood and craftsmanship.
            </p>

            {/* Centered Repository Action Button */}
            <div className="inline-block">
              <button
                onClick={handleStaticClick}
                className="inline-flex items-center gap-2 px-5 py-2 sm:px-6 sm:py-2.5 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c7a462] transition-colors cursor-pointer shadow-sm"
              >
                <span>View All Repository Tracks</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#241A16]" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Medium-Sized Cards Grid - 4 Columns on Desktop / 2 on Tablet / Swipable on Mobile */}
        <Reveal direction="up" delay={150}>
          <ScrollRow label="Heritage skill pillars" dots>
            {pillars.map((pillar) => {
              return (
                <div
                  key={pillar.number}
                  className="w-[78vw] max-w-[290px] sm:w-[290px] shrink-0 snap-start flex flex-col"
                >
                  <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#6B4030]/15 border-b-4 border-b-[#B89555] shadow-[0_12px_30px_-6px_rgba(74,44,32,0.12)] hover:shadow-[0_20px_45px_-8px_rgba(74,44,32,0.22)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group h-full relative select-none">
                    {/* Card Featured Image - Proportional Medium Height */}
                    <div className="relative h-40 sm:h-44 overflow-hidden bg-[#241A16] shrink-0">
                      <img
                        src={pillar.image}
                        alt={pillar.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />

                      {/* Category Pill with Bookmark Icon */}
                      <div className="absolute top-2.5 left-2.5 bg-[#241A16]/90 px-2.5 py-0.5 rounded-full border border-[#B89555]/30 text-[#B89555] text-[10px] sm:text-[11px] font-['DM_Sans'] font-medium flex items-center gap-1 shadow-sm z-10">
                        <Bookmark className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#B89555]" />
                        <span>{pillar.badge}</span>
                      </div>

                      {/* Bottom Dark Panel for Title - Unified Fixed Slot */}
                      <div className="absolute inset-x-0 bottom-0 bg-[#241A16]/95 px-3 py-2 text-[#F7F2E8] z-10 border-t border-[#B89555]/20 h-[56px] sm:h-[62px] flex flex-col justify-center">
                        <p className="font-['DM_Sans'] text-[9px] sm:text-[10px] text-[#B89555] font-medium leading-none mb-1 truncate">
                          {pillar.category}
                        </p>
                        <h3 className="font-['Cormorant_Garamond'] text-sm sm:text-base font-bold text-white tracking-tight leading-snug line-clamp-2 break-words [overflow-wrap:anywhere] min-w-0 max-w-full">
                          {pillar.title}
                        </h3>
                      </div>
                    </div>

                    {/* Card Content Body - Medium Compact Proportions with Equal Height Slots */}
                    <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-1 text-left min-w-0 gap-2.5 sm:gap-3">
                      {/* Description Slot - Unified Height */}
                      <div className="h-[44px] sm:h-[48px] flex items-start overflow-hidden">
                        <p className="font-['DM_Sans'] text-[11.5px] sm:text-xs text-[#241A16]/85 leading-relaxed font-normal line-clamp-2 break-words [overflow-wrap:anywhere] min-w-0 max-w-full">
                          {pillar.description}
                        </p>
                      </div>

                      {/* Subject Curriculum Overview Inner Card - Unified Fixed Height Across All Cards */}
                      <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15 h-[64px] sm:h-[68px] shrink-0 flex flex-col justify-center min-w-0">
                        <span className="text-[10px] sm:text-[10.5px] font-['DM_Sans'] font-semibold text-[#6B4030] block shrink-0 leading-tight mb-0.5">
                          Modules &amp; Practicals:
                        </span>
                        <p className="text-[11px] sm:text-[11.5px] font-['DM_Sans'] text-[#241A16]/80 leading-snug line-clamp-2 break-words [overflow-wrap:anywhere] min-w-0 max-w-full">
                          {pillar.subjects}
                        </p>
                      </div>

                      {/* Tags Slot - Unified Fixed Height with Hidden Overflow */}
                      <div className="h-[50px] sm:h-[54px] shrink-0 flex flex-wrap content-start items-center gap-1 sm:gap-1.5 pt-0.5 overflow-hidden">
                        {Array.isArray(pillar.tags) &&
                          pillar.tags.map((tag, tagIdx) => (
                            <span
                              key={`${pillar.number || pillar.id || 'p'}-tag-${tagIdx}`}
                              className="px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-['DM_Sans'] font-medium bg-[#F7F2E8] text-[#6B4030] border border-[#6B4030]/20 truncate max-w-[130px]"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>

                      {/* Know More Pill Button - Pinned to bottom */}
                      <div className="pt-2.5 border-t border-[#6B4030]/15 flex items-center justify-between mt-auto shrink-0">
                        <span className="text-[10px] sm:text-[11px] font-['DM_Sans'] font-semibold text-[#6B4030]">
                          Cohort Track
                        </span>
                        <button
                          onClick={handleStaticClick}
                          className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full font-['DM_Sans'] text-[10px] sm:text-[11px] font-semibold text-[#241A16] border border-[#6B4030]/30 hover:border-[#B89555] hover:bg-[#B89555] transition-all cursor-pointer group/btn"
                        >
                          <span>Know More</span>
                          <ArrowRight className="w-3 h-3 text-[#241A16] group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollRow>
        </Reveal>
      </div>
    </section>
  );
}
