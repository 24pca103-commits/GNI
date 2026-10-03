import React from 'react';
import {
  FileText,
  Hammer,
  Users,
  ShieldCheck,
  Archive,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function Process() {
  const steps = [
    {
      title: 'Epigraphical & Script Ingestion',
      icon: FileText,
      description:
        'Systematic documentation, field rubbings, and optical analysis of ancient inscriptions, rock art, and copper plate records.',
      badge: 'Archival Protocol',
      highlight: 'Field rubbings & optical archival',
    },
    {
      title: 'Material & Tool Standards Maintenance',
      icon: Hammer,
      description:
        'Sourcing pure copper, temple brass sheets, hand-forged steel chisels, and unadulterated mineral pigments adhering to traditional metallurgical codes.',
      badge: 'Sacred Metallurgy',
      highlight: 'Pure copper & hand-forged tools',
    },
    {
      title: 'Tactile Lineage Transmission',
      icon: Users,
      description:
        'Intensive hands-on studio coaching under hereditary master craftsmen to instill correct muscle memory, striking rhythm, and sacred iconography.',
      badge: 'Studio Transmission',
      highlight: 'Direct master sthapathi coaching',
    },
    {
      title: 'Shilpa Canons & Authenticity Audits',
      icon: ShieldCheck,
      description:
        'Every created artifact is evaluated against classical Shilpa Shastra proportions, traditional iconometrical ratios, and geometric precision.',
      badge: 'Canonic Quality Audit',
      highlight: 'Agamic precision & canonic audits',
    },
    {
      title: 'Repository Archiving & Livelihood Release',
      icon: Archive,
      description:
        'Approved works enter the physical repository gallery and catalog, while creators are connected with architectural clients, fashion houses, and collectors.',
      badge: 'Catalog & Livelihood',
      highlight: 'Gallery catalog & client release',
    },
  ];

  return (
    <section id="process" className="py-12 md:py-20 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20] border border-[#B89555]/40 text-[#E5B869] text-xs font-['DM_Sans'] font-semibold mb-2.5 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>Repository Protocols</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              <span className="block sm:inline">Process of Maintenance &</span>{' '}
              <span className="block sm:inline">Heritage Preservation</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal text-justify indent-5 sm:indent-0 sm:text-center sm:mx-auto max-w-2xl">
              How Global Nagas Institute systematically preserves, safeguards, and transmits unbroken ancient
              wisdom from historical field archives into living modern craftsmanship.
            </p>
          </div>
        </Reveal>

        {/* Vertical Staggered Timeline Layout */}
        <div className="relative">
          {/* Central Golden Timeline Spine (Desktop) */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-transparent via-[#B89555] to-transparent -translate-x-1/2 z-0" />

          {/* Mobile Left Timeline Spine */}
          <div className="md:hidden absolute left-6 top-4 bottom-4 w-0.5 bg-gradient-to-b from-transparent via-[#B89555] to-transparent z-0" />

          <div className="space-y-8 sm:space-y-12 relative z-10">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={item.title} className="relative flex items-center md:justify-between">
                  {/* Desktop Layout: Left Card or Empty Space */}
                  <div className={`hidden md:block md:w-[45%] ${isEven ? 'pr-8' : 'order-2 pl-8'}`}>
                    <Reveal direction={isEven ? 'left' : 'right'} delay={150}>
                      <div className="bg-white hover:bg-[#FAF6EE] p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-[#6B4030]/15 hover:border-[#B89555] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-left">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-block text-[11px] font-['DM_Sans'] font-semibold uppercase tracking-wider text-[#E5B869] bg-[#4A2C20] px-3 py-1 rounded-full border border-[#B89555]/40 shadow-xs">
                            {item.badge}
                          </span>
                          <span className="text-[11px] font-['DM_Sans'] font-bold text-[#6B4030] bg-[#FAF6EE] px-2.5 py-0.5 rounded-full border border-[#6B4030]/20">
                            Protocol {index + 1}
                          </span>
                        </div>

                        <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] mb-2 leading-snug">
                          {item.title}
                        </h3>

                        <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#6B4030] leading-relaxed font-normal mb-4 text-left">
                          {item.description}
                        </p>

                        <div className="pt-3 border-t border-[#6B4030]/10 flex items-center justify-between text-[11px] font-['DM_Sans'] font-medium text-[#4A2C20]">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555]" />
                            <span>{item.highlight}</span>
                          </span>
                          <span className="text-[#B89555] font-semibold">Verified</span>
                        </div>
                      </div>
                    </Reveal>
                  </div>

                  {/* Central Golden Medallion Node (Desktop & Mobile) */}
                  <div className="absolute left-6 -translate-x-1/2 md:left-1/2 md:-translate-x-1/2 z-20">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#B89555] bg-[#FAF6EE] text-[#4A2C20] flex items-center justify-center shadow-md group hover:scale-110 hover:bg-[#4A2C20] hover:text-[#F7F2E8] hover:border-[#4A2C20] transition-all duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  {/* Desktop Layout: Empty Space Counterpart */}
                  <div className={`hidden md:block md:w-[45%] ${isEven ? 'order-2 pl-8' : 'order-1 pr-8'}`} />

                  {/* Mobile Layout Card */}
                  <div className="md:hidden pl-14 w-full">
                    <Reveal direction="up" delay={150}>
                      <div className="bg-white hover:bg-[#FAF6EE] p-5 sm:p-6 rounded-2xl border border-[#6B4030]/15 hover:border-[#B89555] shadow-sm hover:shadow-md transition-all duration-300 text-left">
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className="inline-block text-[10.5px] font-['DM_Sans'] font-semibold uppercase tracking-wider text-[#E5B869] bg-[#4A2C20] px-2.5 py-0.5 rounded-full border border-[#B89555]/40 shadow-xs">
                            {item.badge}
                          </span>
                          <span className="text-[10.5px] font-['DM_Sans'] font-bold text-[#6B4030] bg-[#FAF6EE] px-2 py-0.5 rounded-full border border-[#6B4030]/20">
                            Protocol {index + 1}
                          </span>
                        </div>

                        <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#241A16] mb-1.5 leading-snug">
                          {item.title}
                        </h3>

                        <p className="font-['DM_Sans'] text-xs text-[#6B4030] leading-relaxed font-normal mb-3 text-left">
                          {item.description}
                        </p>

                        <div className="pt-2.5 border-t border-[#6B4030]/10 flex items-center justify-between text-[10.5px] font-['DM_Sans'] font-medium text-[#4A2C20]">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#B89555]" />
                            <span>{item.highlight}</span>
                          </span>
                          <span className="text-[#B89555] font-semibold">Verified</span>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality Commitment Banner - Clean Ivory & Gold Border */}
        <Reveal direction="up" delay={500}>
          <div className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-2xl sm:rounded-3xl bg-[#FAF6EE] border border-[#B89555]/40 p-5 sm:p-6 text-[#241A16] shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-2.5 sm:gap-4 text-xs font-['DM_Sans'] text-left text-justify">
              <span className="flex items-center gap-2 font-bold text-[#4A2C20]">
                <ShieldCheck className="w-4 h-4 text-[#B89555] shrink-0" />
                <span>Uncompromising Preservation Standards</span>
              </span>
              <span className="flex items-center gap-1.5 text-[#6B4030]"><span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" /> 100% Traditional Hand Tools</span>
              <span className="flex items-center gap-1.5 text-[#6B4030]"><span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" /> Agamic Iconometrical Authenticity</span>
              <span className="flex items-center gap-1.5 text-[#6B4030]"><span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" /> Master Sthapathi Certification</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
