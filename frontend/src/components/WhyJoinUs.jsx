import React from 'react';
import {
  Compass,
  Hammer,
  BookOpen,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  Feather,
  Layers,
} from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function WhyJoinUs() {
  const benefits = [
    {
      step: '1',
      icon: Award,
      title: 'Direct Living Master Lineage',
      tag: 'Sacred Lineage',
      desc: 'Learn directly under hereditary Tamil sthapathis and certified epigraphists with unbroken wisdom.',
      metric: 'Unbroken Lineage',
      badge: 'Master Sthapathi',
    },
    {
      step: '2',
      icon: Hammer,
      title: '1:3 Harmonic Theory To Practice Ratio',
      tag: 'Skill Over Theory',
      desc: '75% tactile physical execution in dedicated studios: brass repoussé, stone chiseling, and mineral pigments.',
      metric: '75% Studio Practice',
      badge: 'Chisel & Hammer Work',
    },
    {
      step: '3',
      icon: Compass,
      title: 'Livelihood Creation & Revenue Pathways',
      tag: 'Skill To Income',
      desc: 'Translate rock art and sacred metalwork into lucrative applications: pooja sanctums, jewellery, and luxury interiors.',
      metric: '₹80K - ₹2.5L / Mo',
      badge: 'High-Demand Market',
    },
    {
      step: '4',
      icon: Layers,
      title: 'Authentic Studio Kits & Tools Included',
      tag: 'Complete Materials',
      desc: 'Artisan kit provided with hand-forged chisels, raw copper/brass sheets, and palm leaf styluses.',
      metric: '100% Kit Provided',
      badge: 'Traditional Toolkit',
    },
    {
      step: '5',
      icon: Users,
      title: 'A2O Creators Guild & Fellowship',
      tag: 'Creative Circle',
      desc: 'Lifetime access to the physical repository, peer guild critiques, and annual heritage showcase.',
      metric: 'Lifetime Fellowship',
      badge: 'Annual Showcase',
    },
    {
      step: '6',
      icon: Feather,
      title: 'Revival of Endangered Cultural Pride',
      tag: 'Ancient Tamil Wisdom',
      desc: 'Reclaim 2,500+ years of Tamil scriptural and metallurgy genius through hands-on practice.',
      metric: '2,500+ Yrs Heritage',
      badge: 'Save Ancient Wisdom',
    },
  ];

  return (
    <section id="why-join" className="py-8 md:py-20 bg-[#F7F2E8] relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={10} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Why Join Global Nagas Institute</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Why Join Global Nagas Institute?
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal text-justify indent-5 sm:indent-0 sm:text-center sm:mx-auto max-w-2xl">
              Not just an academy — a structured repository and living atelier transforming timeless Tamil wisdom into tactile mastery.
            </p>
          </div>
        </Reveal>

        {/* Benefits Grid: 6 Distinct Pillars - Sliding on Mobile */}
        <Reveal direction="up" delay={150}>
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8">
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="w-[85vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col justify-between group h-full">
                    <div>
                      {/* Header: Icon */}
                      <div className="flex items-center justify-start mb-3 sm:mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-110">
                          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                      </div>

                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-['DM_Sans'] font-semibold bg-[#F7F2E8] text-[#6B4030] border border-[#6B4030]/15 mb-2 sm:mb-2.5">
                        {item.tag}
                      </span>

                      <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-2xl font-bold text-[#241A16] mb-1.5 sm:mb-2.5 leading-snug group-hover:text-[#4A2C20] transition-colors text-left">
                        {item.title}
                      </h3>

                      <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#6B4030] leading-relaxed font-normal text-justify indent-4 sm:indent-0">
                        {item.desc}
                      </p>
                    </div>

                    {/* Card Footer: Metric & Badge */}
                    <div className="mt-3 sm:mt-6 pt-2.5 sm:pt-4 border-t border-[#6B4030]/10 flex items-center justify-between">
                      <span className="font-['DM_Sans'] text-[11px] sm:text-xs font-bold text-[#241A16]">
                        {item.metric}
                      </span>
                      <span className="font-['DM_Sans'] text-[10px] sm:text-[11px] font-medium text-[#B89555]">
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Swipe Hint Dots */}
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-3">
            {benefits.map((_, i) => (
              <span key={i} className="w-2 h-1.5 rounded-full bg-[#B89555]/50" />
            ))}
            <span className="text-[11px] font-['DM_Sans'] text-[#6B4030]/70 ml-1">Swipe to view more</span>
          </div>
        </Reveal>

        {/* Bottom Call to Action Card */}
        <Reveal direction="up" delay={650}>
          <div className="mt-8 sm:mt-12 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-[#6B4030]/15 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1 text-left">
              <h4 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] text-left">
                Begin Your 60-Day Heritage Creator Journey
              </h4>
              <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#6B4030] text-left text-justify">
                Limited cohort size: 25 participants per batch to guarantee personal master artisan attention.
              </p>
            </div>
            <a
              href="#register"
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-['DM_Sans'] font-semibold text-xs text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] transition-colors shadow-sm shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>Enroll In Next Cohort</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B89555]" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
