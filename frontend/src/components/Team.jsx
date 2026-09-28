import React from 'react';
import { Users, Mail, Compass, Award, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function Team() {
  const teamMembers = [
    {
      name: 'Dr. S. Thirugnanam, Ph.D.',
      designation: 'Director & Chief Epigraphist',
      image: '',
      description:
        '28+ years documenting Southern Indian stone inscriptions and Tamili Brahmi scripts.',
      specialty: 'Tamili Script & Epigraphy',
    },
    {
      name: 'Shilpi R. Balasubramanian',
      designation: 'Principal Sthapathi & Master Sculptor',
      image: '',
      description:
        'Hereditary sthapathi with 30+ temple installations and lost-wax bronze casting mastery.',
      specialty: 'Temple Canons & Metallurgy',
    },
    {
      name: 'Meenakshi Sundaram',
      designation: 'Head of Traditional Painting Studio',
      image: '',
      description:
        'Specialist in prehistoric rock art pigments, mineral ores, and temple murals.',
      specialty: 'Rock Art & Natural Pigments',
    },
    {
      name: 'Ananya V. Raja, M.Des',
      designation: 'Curator of Heritage Applications',
      image: '',
      description:
        'Transforms sacred motifs into contemporary high-fashion bridal wear and luxury interiors.',
      specialty: 'Blouse Design & Interiors',
    },
    {
      name: 'K. Senthil Kumar',
      designation: 'Master Artisan & Repoussé Craftsman',
      image: '',
      description:
        'Fourth-generation brass and copper repoussé master leading intensive studio hammer work.',
      specialty: 'Naga Metal Craft & Repoussé',
    },
    {
      name: 'Dr. Radhika Natarajan',
      designation: 'Research Dean & Manuscript Archivist',
      image: '',
      description:
        'Deciphers medieval copper plates and manuscripts, connecting Sangam lore to art.',
      specialty: 'Copper Plates & Sangam Lore',
    },
  ];

  return (
    <section id="team" className="py-8 md:py-20 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={10} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Users className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Master Mentors & Stewards</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              The Team Behind Global Nagas Institute
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal">
              Meet the hereditary sthapathis, epigraphists, and master artisans transmitting ancient Tamil mastery.
            </p>
          </div>
        </Reveal>

        {/* Team Grid in Title Case */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {teamMembers.map((member, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 100}>
              <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col group h-full">
                {/* Empty Profile Placeholder Avatar */}
                <div className="relative pt-6 pb-3.5 px-4 bg-[#F7F2E8] border-b border-[#6B4030]/15 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#4A2C20] border-2 border-[#B89555]/50 flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-[#B89555] transition-all duration-300">
                    <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[#B89555]" />
                  </div>

                  {/* Specialty Tag */}
                  <div className="mt-2.5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-['DM_Sans'] font-semibold bg-[#4A2C20] text-[#B89555] border border-[#B89555]/30 shadow-xs">
                      {member.specialty}
                    </span>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-3.5 sm:p-6 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                  <div className="space-y-0.5 sm:space-y-1">
                    <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#241A16] group-hover:text-[#4A2C20] transition-colors leading-snug">
                      {member.name}
                    </h3>
                    <p className="font-['DM_Sans'] text-[11px] sm:text-xs font-semibold text-[#B89555] tracking-wide">
                      {member.designation}
                    </p>
                    <p className="font-['DM_Sans'] text-xs text-[#6B4030] leading-snug pt-1 sm:pt-2 font-normal">
                      {member.description}
                    </p>
                  </div>

                  {/* Connect Lineage Footer */}
                  <div className="pt-2 sm:pt-3 border-t border-[#6B4030]/10 flex items-center justify-between text-xs text-[#6B4030]">
                    <span className="font-['DM_Sans'] text-[10px] sm:text-[11px] font-medium">Cohort Guide</span>
                    <div className="flex items-center gap-1 text-[#B89555]">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="text-[10px] sm:text-[11px] font-['DM_Sans'] font-semibold">Master Mentor</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
