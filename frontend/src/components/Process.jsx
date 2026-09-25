import React from 'react';
import {
  FileText,
  Hammer,
  Users,
  ShieldCheck,
  Archive,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function Process() {
  const steps = [
    {
      step: '1',
      title: 'Epigraphical & Script Ingestion',
      icon: FileText,
      description:
        'Systematic documentation, field rubbings, and optical analysis of ancient Tamili Brahmi inscriptions, rock art, and copper plate records.',
      badge: 'Step 1: Epigraphical Archival',
    },
    {
      step: '2',
      title: 'Material & Tool Standards Maintenance',
      icon: Hammer,
      description:
        'Sourcing pure copper, temple brass sheets, hand-forged steel chisels, and unadulterated mineral pigments adhering to traditional metallurgical codes.',
      badge: 'Step 2: Sacred Metallurgy',
    },
    {
      step: '3',
      title: 'Tactile Lineage Transmission',
      icon: Users,
      description:
        'Intensive hands-on studio coaching under hereditary master sthapathis to instill correct muscle memory, striking rhythm, and sacred iconography.',
      badge: 'Step 3: Studio Transmission',
    },
    {
      step: '4',
      title: 'Shilpa Canons & Authenticity Audits',
      icon: ShieldCheck,
      description:
        'Every created artifact is evaluated against classical Shilpa Shastra proportions, Tamil iconometrical ratios, and geometric precision.',
      badge: 'Step 4: Canonic Quality Audit',
    },
    {
      step: '5',
      title: 'Repository Archiving & Livelihood Release',
      icon: Archive,
      description:
        'Approved works enter the physical repository gallery and catalog, while creators are connected with architectural clients, fashion houses, and collectors.',
      badge: 'Step 5: Catalog & Livelihood',
    },
  ];

  return (
    <section id="process" className="py-12 md:py-20 bg-white relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Repository Protocols</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              <span className="block sm:inline">Process of Maintenance &</span>{' '}
              <span className="block sm:inline">Heritage Preservation</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal">
              How Global Nagas Institute systematically preserves, safeguards, and transmits unbroken ancient Tamil
              wisdom from historical field archives into living modern craftsmanship.
            </p>
          </div>
        </Reveal>

        {/* 5-Step Process Timeline / Cards in Title Case */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 relative z-10">
          {steps.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal key={index} direction="up" delay={index * 100}>
                <div className="bg-[#F7F2E8] rounded-3xl p-5 sm:p-6 border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col justify-between group h-full">
                  <div>
                    {/* Header: Step Number & Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-['DM_Sans'] text-2xl font-bold text-[#6B4030]/30 group-hover:text-[#B89555] transition-colors">
                        {item.step}
                      </span>
                      <div className="w-11 h-11 rounded-2xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <span className="inline-block text-[10px] font-['DM_Sans'] font-semibold uppercase tracking-wider text-[#B89555] mb-2">
                      {item.badge}
                    </span>

                    <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#241A16] mb-2 leading-snug group-hover:text-[#4A2C20] transition-colors">
                      {item.title}
                    </h3>

                    <p className="font-['DM_Sans'] text-xs text-[#6B4030] leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#6B4030]/15 flex items-center gap-1.5 text-[11px] font-['DM_Sans'] font-semibold text-[#4A2C20]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555]" />
                    <span>Verified Protocol</span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Quality Commitment Banner */}
        <Reveal direction="up" delay={500}>
          <div className="mt-12 max-w-4xl mx-auto rounded-3xl bg-[#4A2C20] border border-[#B89555]/30 p-5 sm:p-6 text-center text-[#F7F2E8] shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-['DM_Sans']">
              <span className="flex items-center gap-2 font-bold text-[#B89555]">
                <ShieldCheck className="w-4 h-4 text-[#B89555]" />
                Uncompromising Preservation Standards
              </span>
              <span className="hidden sm:inline text-[#B89555]/40">•</span>
              <span>100% Traditional Hand Tools</span>
              <span className="hidden sm:inline text-[#B89555]/40">•</span>
              <span>Agamic Iconometrical Authenticity</span>
              <span className="hidden sm:inline text-[#B89555]/40">•</span>
              <span>Direct Master Sthapathi Certification</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
