import React from 'react';
import Reveal from './Reveal';

export default function TransformationSection() {
  const steps = [
    {
      num: '01',
      tamil: 'கற்றல்',
      label: 'Learn',
      desc: 'Ancient Wisdom & Canons',
      detail: 'Epigraphy, Vastu & Sacred Lore',
    },
    {
      num: '02',
      tamil: 'பயிற்சி',
      label: 'Practice',
      desc: 'Hands-on Technique',
      detail: 'Mastering Hammer, Chisel & Casting',
    },
    {
      num: '03',
      tamil: 'படைப்பு',
      label: 'Create',
      desc: 'Original Heritage Art',
      detail: 'Temple Motifs & Gold Repoussé',
    },
    {
      num: '04',
      tamil: 'காட்சி',
      label: 'Showcase',
      desc: 'Exhibitions & Archives',
      detail: 'Public Galleries & Architect Curations',
    },
    {
      num: '05',
      tamil: 'இணைப்பு',
      label: 'Connect',
      desc: 'A2O Creator Guild',
      detail: 'Peer Critiques & Global Collaborations',
    },
    {
      num: '06',
      tamil: 'வாழ்வாதாரம்',
      label: 'Build Livelihood',
      desc: 'Sustainable Income',
      detail: 'Commercial Orders & Royal Commissions',
      featured: true,
    },
  ];

  return (
    <section className="py-10 md:py-16 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              The Creative Evolution Roadmap
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              What Can a Heritage Creator Become?
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['Cormorant_Garamond'] text-lg sm:text-2xl text-[#6B4030] font-semibold mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed text-justify indent-5 sm:indent-0 sm:text-center">
              "A heritage creator who understands Tamil culture and transforms it into art, jewellery,
              interiors, textile design and sustainable livelihood."
            </p>
          </div>
        </Reveal>

        {/* Visual Progression Roadmap: 6 Step Heritage Evolution Nodes */}
        <Reveal direction="up" delay={200}>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#6B4030]/15 shadow-sm relative">
            {/* Connected Dashed Guideline on Desktop */}
            <div className="hidden lg:block absolute top-[68px] left-16 right-16 h-0.5 border-t-2 border-dashed border-[#B89555]/30 z-0 pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 relative z-10">
              {steps.map((st, idx) => {
                return (
                  <div
                    key={st.label}
                    className={`group rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-md select-none ${
                      st.featured
                        ? 'bg-[#FAF6EE] border-2 border-[#B89555] shadow-xs'
                        : 'bg-[#FAF6EE]/70 hover:bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555]/60'
                    }`}
                  >
                    {/* Background Subtle Watermark Number */}
                    <span className="font-['Cormorant_Garamond'] text-4xl sm:text-5xl font-bold text-[#6B4030]/10 absolute -bottom-1.5 -right-1 pointer-events-none select-none group-hover:text-[#B89555]/20 transition-colors">
                      {st.num}
                    </span>

                    <div>
                      {/* Top Milestone Badge */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center font-['Cormorant_Garamond'] text-base sm:text-lg font-bold shadow-xs transition-all duration-300 ${
                            st.featured
                              ? 'bg-[#B89555] text-[#241A16] border-[#4A2C20]'
                              : 'bg-white text-[#4A2C20] border-[#B89555] group-hover:bg-[#4A2C20] group-hover:text-[#FAF6EE] group-hover:border-[#4A2C20]'
                          }`}
                        >
                          {st.num}
                        </div>

                        {/* Tamil Cultural Term Tag */}
                        <span className="text-[10.5px] sm:text-xs font-semibold text-[#B89555] font-['DM_Sans'] bg-[#4A2C20]/5 px-2 py-0.5 rounded-md border border-[#B89555]/25">
                          {st.tamil}
                        </span>
                      </div>

                      {/* Step Name */}
                      <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-[#241A16] leading-tight mb-1">
                        {st.label}
                      </h3>

                      {/* Step Subtitle */}
                      <p className="font-['DM_Sans'] text-xs font-semibold text-[#6B4030] leading-snug">
                        {st.desc}
                      </p>

                      {/* Step Detail */}
                      <p className="font-['DM_Sans'] text-[11px] text-[#241A16]/70 mt-1.5 leading-snug">
                        {st.detail}
                      </p>
                    </div>

                    {/* Bottom Progress Pill */}
                    <div className="mt-4 pt-2.5 border-t border-[#6B4030]/10 flex items-center justify-between text-[10px] sm:text-[11px] font-['DM_Sans'] font-medium text-[#6B4030]">
                      <span>Stage</span>
                      <span className="text-[#B89555] font-bold">Phase {idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Domains Grid in Title Case */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#6B4030]/15">
              <div className="text-center mb-4">
                <span className="text-xs font-['DM_Sans'] font-semibold text-[#6B4030] uppercase tracking-wider">
                  Transformation Disciplines & Career Avenues
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center">
                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555] transition-colors">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">Textile & Blouse</p>
                  <p className="text-[11px] font-['DM_Sans'] text-[#6B4030] mt-0.5">Traditional Motifs & Zari</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555] transition-colors">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">Pooja Interiors</p>
                  <p className="text-[11px] font-['DM_Sans'] text-[#6B4030] mt-0.5">Sacred Dravidian Architecture</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555] transition-colors">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">Handmade Jewelry</p>
                  <p className="text-[11px] font-['DM_Sans'] text-[#6B4030] mt-0.5">Naga Metallurgy & Filigree</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555] transition-colors">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">Home Décor</p>
                  <p className="text-[11px] font-['DM_Sans'] text-[#6B4030] mt-0.5">Cultural Branding & Relief Art</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
