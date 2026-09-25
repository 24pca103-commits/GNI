import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Pencil,
  FileCode2,
  Paintbrush,
  Sparkles,
  Flame,
  Briefcase,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function LearningJourney() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      period: 'Day 1–10',
      phase: 'Phase 01',
      title: 'Drawing & Symbols',
      desc: 'Practical drawing and traditional symbols.',
      icon: Pencil,
      details: 'Line geometry, sacred motifs, ancient grid systems.',
      outcome: 'Master Foundational Sacred Proportions',
    },
    {
      period: 'Day 11–20',
      phase: 'Phase 02',
      title: 'Tamili & Inscriptions',
      desc: 'Tamili script and inscription practice.',
      icon: FileCode2,
      details: 'Deciphering Brahmi epigraphy, copper plate scribing.',
      outcome: 'Read and Scribe Ancestral Inscriptions',
    },
    {
      period: 'Day 21–30',
      phase: 'Phase 03',
      title: 'Rock Art & Painting',
      desc: 'Traditional visual language and painting practice.',
      icon: Paintbrush,
      details: 'Natural mineral pigments, prehistoric rock art techniques.',
      outcome: 'Concoct Natural Mineral Paints',
    },
    {
      period: 'Day 31–40',
      phase: 'Phase 04',
      title: 'Iconography',
      desc: 'Understanding symbols, forms and cultural meaning.',
      icon: Sparkles,
      details: 'Deity proportions, spiritual geometry, traditional shilpa canons.',
      outcome: 'Encode Spiritual Meaning into Sculptural Forms',
    },
    {
      period: 'Day 41–50',
      phase: 'Phase 05',
      title: 'Naga Jewellery & Metal Basics',
      desc: 'Introduction to traditional metal craftsmanship.',
      icon: Flame,
      details: 'Brass sheet forming, repoussé, sacred naga ornamental motifs.',
      outcome: 'Form Authentic Metal Repoussé Motifs',
    },
    {
      period: 'Day 51–60',
      phase: 'Phase 06',
      title: 'Real-World Applications + 1 Field Visit',
      desc: 'Apply heritage knowledge to modern creative fields + 1 immersive field visit.',
      icon: Briefcase,
      details: 'Textiles, interior design, branding, pooja decor, livelihood + 1 field visit.',
      outcome: 'Produce Commercial Portfolio & Complete 1 Field Visit',
    },
  ];

  return (
    <section id="learning-journey" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      {/* Ambient Floating Bubbles */}
      <FloatingBubbles count={14} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              Structured Curriculum
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight">
              60-Day Heritage Creator Journey
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-base sm:text-lg text-[#6B4030] font-normal leading-relaxed">
              From learning the foundational strokes to launching authentic creations.
            </p>
          </div>
        </Reveal>

        {/* Serpentine Interactive Roadmap Navigation Track */}
        <Reveal direction="up" delay={150}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#6B4030]/15 shadow-sm mb-6 sm:mb-8">
            {/* Step Progress Pills Track */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-6 border-b border-[#6B4030]/15">
              {steps.map((st, idx) => {
                const isSelected = activeStep === idx;
                const Icon = st.icon;
                return (
                  <button
                    key={st.phase}
                    onClick={() => setActiveStep(idx)}
                    className={`flex flex-col items-start p-3 sm:p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#4A2C20] text-[#F7F2E8] border-[#B89555] shadow-md scale-[1.02]'
                        : 'bg-[#F7F2E8]/60 text-[#6B4030] border-transparent hover:border-[#B89555]/40 hover:bg-[#F7F2E8]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <span className="text-[11px] font-['DM_Sans'] font-semibold text-[#B89555]">
                        {st.phase}
                      </span>
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B89555]' : 'text-[#6B4030]'}`} />
                    </div>
                    <span className="text-xs font-number font-bold leading-tight">
                      {st.period}
                    </span>
                    <span className={`text-[11px] font-['DM_Sans'] truncate w-full mt-1 ${isSelected ? 'text-white font-medium' : 'text-[#241A16]/80'}`}>
                      {st.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Phase Detail Stage */}
            <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1 rounded-md text-xs font-number font-bold bg-[#4A2C20] text-[#F7F2E8]">
                    {steps[activeStep].period}
                  </span>
                  <span className="text-xs font-['DM_Sans'] text-[#6B4030] font-semibold">
                    {steps[activeStep].phase} of 06
                  </span>
                </div>
                <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-[#241A16]">
                  {steps[activeStep].title}
                </h3>
                <p className="font-['DM_Sans'] text-base text-[#6B4030] font-medium leading-relaxed">
                  {steps[activeStep].desc}
                </p>
                <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#241A16]/75 leading-relaxed">
                  Focus modules: {steps[activeStep].details}
                </p>
              </div>

              <div className="lg:col-span-4 bg-[#F7F2E8] rounded-2xl p-5 border border-[#6B4030]/15 space-y-3">
                <div className="flex items-center gap-2 text-xs font-['DM_Sans'] font-bold text-[#4A2C20] uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-[#B89555]" />
                  <span>Key Milestone Outcome</span>
                </div>
                <p className="font-['DM_Sans'] text-sm font-semibold text-[#241A16]">
                  "{steps[activeStep].outcome}"
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-[#6B4030]/15 text-xs text-[#6B4030] font-medium">
                  <span>Interactive Module</span>
                  <span className="text-[#B89555] font-bold">10-Day Sprint</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Serpentine Alternating Roadmap Pathway */}
        <div className="space-y-4">
          <div className="text-center mb-6">
            <span className="text-xs font-['DM_Sans'] uppercase tracking-wider font-semibold text-[#6B4030]">
              Full 60-Day Syllabus Breakdown
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.phase} direction="up" delay={100 + idx * 50}>
                  <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#6B4030]/15 shadow-sm hover:border-[#B89555] transition-all flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-number font-bold text-[#B89555]">
                          {step.period} • {step.phase}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555]" />
                      </div>
                      <h4 className="font-['Cormorant_Garamond'] text-xl font-bold text-[#241A16]">
                        {step.title}
                      </h4>
                      <p className="font-['DM_Sans'] text-xs text-[#6B4030] font-medium">
                        {step.desc}
                      </p>
                      <p className="font-['DM_Sans'] text-[11px] text-[#241A16]/70 pt-1">
                        {step.details}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Field Visit Highlight Banner - Solid Deep Brown (No Gradients) */}
        <Reveal direction="zoom" delay={300}>
          <div className="mt-12 bg-[#4A2C20] rounded-2xl p-6 sm:p-8 text-[#F7F2E8] border border-[#B89555]/40 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#B89555] text-[#241A16] flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="inline-block px-3 py-0.5 rounded-full text-xs font-['DM_Sans'] bg-white/10 text-[#B89555] font-medium">
                  Immersive Experience
                </span>
                <h3 className="font-['Cormorant_Garamond'] text-2xl sm:text-3xl font-bold text-white">
                  Includes an On-Site Field Visit
                </h3>
                <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#F7F2E8]/85 max-w-xl font-normal">
                  Direct hands-on archaeological exploration of ancient temple rock inscriptions, heritage
                  guilds, and active master artisan workshops across Tamil Nadu.
                </p>
              </div>
            </div>
            <div className="shrink-0 px-5 py-2.5 rounded-xl bg-white/10 border border-[#B89555]/30 text-xs font-['DM_Sans'] text-[#B89555] font-medium">
              ★ Guided by historians
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
