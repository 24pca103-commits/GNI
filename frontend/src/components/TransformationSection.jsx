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
    <section className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              The Creative Evolution
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              What Can a Heritage Creator Become?
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-[#6B4030] font-semibold mt-3 sm:mt-4 max-w-2xl mx-auto leading-relaxed">
              "A heritage creator who understands Tamil culture and transforms it into art, jewellery,
              interiors, textile design and livelihood."
            </p>
          </div>
        </Reveal>

        {/* Visual Progression Line: Learn → Practice → Create → Showcase → Connect → Build Livelihood */}
        <Reveal direction="up" delay={200}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#6B4030]/15 shadow-sm relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-4 relative">
              {steps.map((st, idx) => {
                const Icon = st.icon;
                const isLast = idx === steps.length - 1;
                return (
                  <div key={st.label} className="flex flex-col items-center text-center relative group">
                    {/* Circle Node */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-sm ${
                        isLast
                          ? 'bg-[#B89555] text-[#241A16] scale-105'
                          : 'bg-[#4A2C20] text-[#F7F2E8] group-hover:bg-[#6B4030]'
                      }`}
                    >
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Step Name */}
                    <p className="font-['Cormorant_Garamond'] text-xl font-bold text-[#241A16]">
                      {st.label}
                    </p>

                    <p className="font-['DM_Sans'] text-xs text-[#6B4030] font-medium mt-1">
                      {st.desc}
                    </p>

                    {/* Step Number Tag */}
                    <span className="mt-3 text-xs font-number font-bold text-[#B89555]">
                      Step 0{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Application Domains Grid in Title Case */}
            <div className="mt-12 pt-8 border-t border-[#6B4030]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15">
                <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#241A16]">Textile & Blouse Design</p>
                <p className="text-xs font-['DM_Sans'] text-[#6B4030]">Traditional Motifs</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15">
                <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#241A16]">Pooja & Living Interiors</p>
                <p className="text-xs font-['DM_Sans'] text-[#6B4030]">Sacred Architecture</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15">
                <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#241A16]">Handmade Jewelry</p>
                <p className="text-xs font-['DM_Sans'] text-[#6B4030]">Naga & Sacred Metallurgy</p>
              </div>
              <div className="p-3 rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15">
                <p className="font-['Cormorant_Garamond'] text-base font-bold text-[#241A16]">Home Décor & Branding</p>
                <p className="text-xs font-['DM_Sans'] text-[#6B4030]">Modern Cultural Identity</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
