import React from 'react';
import {
  BookOpen,
  Hand,
  Sparkles,
  Eye,
  Share2,
  TrendingUp,
} from 'lucide-react';
import Reveal from './Reveal';

export default function TransformationSection() {
  const steps = [
    { label: 'Learn', icon: BookOpen, desc: 'Ancient Wisdom & Canons' },
    { label: 'Practice', icon: Hand, desc: 'Hands-on Technique' },
    { label: 'Create', icon: Sparkles, desc: 'Original Heritage Art' },
    { label: 'Showcase', icon: Eye, desc: 'Exhibitions & Repositories' },
    { label: 'Connect', icon: Share2, desc: 'A2O Creator Guild' },
    { label: 'Build Livelihood', icon: TrendingUp, desc: 'Sustainable Creative Income' },
  ];

  return (
    <section className="py-10 md:py-16 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              The Creative Evolution
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              What Can a Heritage Creator Become?
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['Cormorant_Garamond'] text-lg sm:text-2xl text-[#6B4030] font-semibold mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed text-justify indent-5 sm:indent-0 sm:text-center">
              "A heritage creator who understands authentic culture and transforms it into art, jewellery,
              interiors, textile design and sustainable livelihood."
            </p>
          </div>
        </Reveal>

        {/* Visual Progression Grid: Clean Free-Floating Icons (No Box) */}
        <Reveal direction="up" delay={200}>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-[#6B4030]/15 shadow-sm relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 relative z-10">
              {steps.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.label}
                    className="flex flex-col items-center text-center group p-3 sm:p-4 rounded-xl hover:bg-[#FAF6EE] transition-all duration-300"
                  >
                    {/* Free-Floating Icon without Box */}
                    <div className="mb-3 sm:mb-4 flex items-center justify-center">
                      <Icon className="w-8 h-8 sm:w-11 sm:h-11 text-[#4A2C20] group-hover:text-[#B89555] group-hover:scale-115 transition-all duration-300 stroke-[1.75]" />
                    </div>

                    {/* Step Name */}
                    <p className="font-['Cormorant_Garamond'] text-base sm:text-xl font-bold text-[#241A16] leading-tight mb-1 group-hover:text-[#4A2C20]">
                      {st.label}
                    </p>

                    {/* Step Description */}
                    <p className="font-['DM_Sans'] text-xs text-[#6B4030] font-medium leading-snug">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Application Domains Grid in Title Case */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#6B4030]/15">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center">
                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555] transition-colors">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">Textile & Blouse</p>
                  <p className="text-[11px] font-['DM_Sans'] text-[#6B4030] mt-0.5">Traditional Motifs & Zari</p>
                </div>
                <div className="p-3 sm:p-4 rounded-xl bg-[#FAF6EE] border border-[#6B4030]/15 hover:border-[#B89555] transition-colors">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16] leading-tight">Pooja Interiors</p>
                  <p className="text-[11px] font-['DM_Sans'] text-[#6B4030] mt-0.5">Sacred Architecture</p>
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
