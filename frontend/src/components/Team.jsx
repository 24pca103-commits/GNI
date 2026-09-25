import React from 'react';
import { Users, Mail, Compass, Award, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function Team() {
  const teamMembers = [
    {
      name: 'Dr. S. Thirugnanam, Ph.D.',
      designation: 'Director & Chief Epigraphist',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      description:
        'Over 28 years documenting Southern Indian stone inscriptions and Tamili Brahmi scripts. Former advisor to Archaeological Surveys.',
      specialty: 'Tamili Script & Epigraphy',
    },
    {
      name: 'Shilpi R. Balasubramanian',
      designation: 'Principal Sthapathi & Master Sculptor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      description:
        'Hereditary sthapathi with 30+ consecrated temple installations. Master of Shilpa Shastra proportions and sacred lost-wax bronze casting.',
      specialty: 'Temple Canons & Metallurgy',
    },
    {
      name: 'Meenakshi Sundaram',
      designation: 'Head of Traditional Painting Studio',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      description:
        'Specialist in prehistoric rock art pigments and classical temple murals. Hand-grinds mineral ores, plant resins, and soot inks.',
      specialty: 'Rock Art & Natural Pigments',
    },
    {
      name: 'Ananya V. Raja, M.Des',
      designation: 'Curator of Heritage Applications',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      description:
        'Transforms ancient sacred motifs into contemporary high-fashion bridal blouses, jewelry lines, and luxury architectural pooja interiors.',
      specialty: 'Blouse Design & Luxury Interiors',
    },
    {
      name: 'K. Senthil Kumar',
      designation: 'Master Artisan & Repoussé Craftsman',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      description:
        'Fourth-generation brass and copper repoussé master. Leads intensive daily hammer work, chasing, and sacred naga emblem crafting.',
      specialty: 'Naga Metal Craft & Repoussé',
    },
    {
      name: 'Dr. Radhika Natarajan',
      designation: 'Research Dean & Manuscript Archivist',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      description:
        'Deciphers medieval Chola and Pandya copper plates and palm-leaf manuscripts. Connects classical Sangam poetry to artistic iconography.',
      specialty: 'Copper Plates & Sangam Lore',
    },
  ];

  return (
    <section id="team" className="py-12 md:py-20 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={10} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Users className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Master Mentors & Stewards</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              <span className="block sm:inline">The Team Behind</span>{' '}
              <span className="block sm:inline">Global Nagas Institute</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal">
              Meet the hereditary sthapathis, epigraphists, master metallurgists, and heritage curators dedicated
              to transmitting ancient Tamil mastery to each creator cohort.
            </p>
          </div>
        </Reveal>

        {/* Team Grid in Title Case */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member, idx) => (
            <Reveal key={idx} direction="up" delay={idx * 100}>
              <div className="bg-white rounded-3xl overflow-hidden border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col group h-full">
                {/* Profile Image */}
                <div className="relative h-60 overflow-hidden bg-[#241A16]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#241A16]/80 via-transparent to-transparent opacity-90" />

                  {/* Specialty Tag */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="inline-block px-3 py-1 rounded-full text-[11px] font-['DM_Sans'] font-semibold bg-[#4A2C20] text-[#B89555] border border-[#B89555]/30 shadow-sm">
                      {member.specialty}
                    </span>
                  </div>
                </div>

                {/* Member Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#241A16] group-hover:text-[#4A2C20] transition-colors">
                      {member.name}
                    </h3>
                    <p className="font-['DM_Sans'] text-xs font-semibold text-[#B89555] tracking-wide">
                      {member.designation}
                    </p>
                    <p className="font-['DM_Sans'] text-xs text-[#6B4030] leading-relaxed pt-2 font-normal">
                      {member.description}
                    </p>
                  </div>

                  {/* Connect Lineage Footer */}
                  <div className="pt-3 border-t border-[#6B4030]/10 flex items-center justify-between text-xs text-[#6B4030]">
                    <span className="font-['DM_Sans'] text-[11px] font-medium">Cohort Studio Guide</span>
                    <div className="flex items-center gap-1.5 text-[#B89555]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-['DM_Sans'] font-semibold">Master Mentor</span>
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
