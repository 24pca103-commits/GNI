import React, { useState, useRef } from 'react';
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
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    if (!el) return;
    const cardWidth = el.firstElementChild?.offsetWidth || 1;
    const gap = 16;
    const scrollPosition = el.scrollLeft;
    const newIndex = Math.round(scrollPosition / (cardWidth + gap));
    setActiveDot(Math.min(Math.max(newIndex, 0), benefits.length - 1));
  };

  const scrollToCard = (index) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.offsetWidth || 1;
    const gap = 16;
    el.scrollTo({
      left: index * (cardWidth + gap),
      behavior: 'smooth',
    });
    setActiveDot(index);
  };
  const benefits = [
    {
      step: '1',
      icon: Award,
      image: '/artisan/about-studio.jpg',
      title: 'Living Master Lineage',
      subtitle: 'Unbroken ancestral goldsmith transmission',
      tag: 'Sacred Lineage',
      desc: 'Learn directly under hereditary Tamil sthapathis and certified master goldsmiths with unbroken wisdom.',
      metric: 'Unbroken Lineage',
      badge: 'Master Sthapathi',
    },
    {
      step: '2',
      icon: Hammer,
      image: '/artisan/why-join-practice.jpg',
      title: '75% Hands-on Practice',
      subtitle: 'Tactile craftsmanship over theory',
      tag: 'Skill Over Theory',
      desc: 'Intensive physical execution in dedicated studios: gold repousse, stone setting, wire drawing, and casting.',
      metric: '75% Studio Practice',
      badge: 'Forge & Anvil Work',
    },
    {
      step: '3',
      icon: Sparkles,
      image: '/artisan/pillar-applications.jpg',
      title: 'Livelihood & Career',
      subtitle: 'Crafting high-value luxury jewellery',
      tag: 'Skill To Income',
      desc: 'Create bespoke antique gold jewellery, temple ornaments, and bridal sets for prestigious boutique markets.',
      metric: '₹80K – ₹2.5L / Mo',
      badge: 'High-Demand Market',
    },
    {
      step: '4',
      icon: Layers,
      image: '/artisan/studio-pigments.jpg',
      title: 'Authentic Studio Kits',
      subtitle: 'Complete goldsmith toolset provided',
      tag: 'Complete Materials',
      desc: 'Full artisan toolkit provided: mini-anvils, chasing hammers, blowpipe, tweezers, and raw metal sheets.',
      metric: '100% Kit Provided',
      badge: 'Traditional Toolkit',
    },
    {
      step: '5',
      icon: Users,
      image: '/artisan/workshop.jpg',
      title: 'Creators Guild & Atelier',
      subtitle: 'Collaborative peer apprentice network',
      tag: 'Creative Circle',
      desc: 'Lifetime access to the physical repository, peer guild critiques, and annual heritage jewellery showcase.',
      metric: 'Lifetime Fellowship',
      badge: 'Annual Showcase',
    },
    {
      step: '6',
      icon: Feather,
      image: '/artisan/pillar-epigraphy.jpg',
      title: 'Enduring Cultural Pride',
      subtitle: 'Reclaiming 2,500+ years of heritage',
      tag: 'Ancient Tamil Wisdom',
      desc: 'Reclaim 2,500+ years of Tamil scriptural and metallurgy genius through hands-on jewellery creation.',
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
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 lg:gap-8"
          >
            {benefits.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.step}
                  className="w-[85vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
                >
                  <div className="bg-[#FAF6EE] rounded-2xl sm:rounded-3xl border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555] transition-all duration-300 flex flex-col justify-between group h-full overflow-hidden">
                    <div>
                      {/* Top Image Banner with Visual Depth */}
                      <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-[#241A16]">
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-[#241A16]/25 group-hover:bg-[#241A16]/15 transition-colors" />

                        {/* Top Tag */}
                        <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-['DM_Sans'] font-semibold bg-[#241A16]/85 backdrop-blur-xs text-[#B89555] border border-[#B89555]/30 shadow-xs">
                          {item.tag}
                        </span>
                      </div>

                      {/* Large Floating Circular Icon Medallion Overlapping Top Banner */}
                      <div className="relative -mt-7 sm:-mt-8 flex justify-center z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#B89555] bg-[#FAF6EE] text-[#4A2C20] group-hover:bg-[#4A2C20] group-hover:text-[#B89555] flex items-center justify-center transition-all duration-300 shadow-md group-hover:scale-110">
                          <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
                        </div>
                      </div>

                      {/* Centered Content Body */}
                      <div className="p-4 sm:p-6 pt-2 sm:pt-3 text-center space-y-2">
                        <h3 className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold text-[#241A16] group-hover:text-[#4A2C20] transition-colors leading-tight">
                          {item.title}
                        </h3>

                        <p className="font-['Cormorant_Garamond'] italic text-xs sm:text-sm text-[#6B4030] leading-snug">
                          {item.subtitle}
                        </p>

                        {/* Decorative Ornament Divider */}
                        <div className="flex items-center justify-center gap-1.5 py-0.5">
                          <span className="h-px w-6 bg-[#B89555]/40" />
                          <span className="text-[10px] text-[#B89555]">❖</span>
                          <span className="h-px w-6 bg-[#B89555]/40" />
                        </div>

                        <p className="font-['DM_Sans'] text-xs sm:text-[12.5px] text-[#241A16]/80 leading-relaxed font-normal text-justify indent-3 sm:indent-0 sm:text-center">
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Metric & Action Button */}
                    <div className="p-4 sm:p-6 pt-0 mt-auto">
                      <div className="pt-2.5 sm:pt-3 border-t border-[#6B4030]/15 flex items-center justify-between text-xs">
                        <span className="font-['DM_Sans'] text-[11px] sm:text-xs font-bold text-[#241A16]">
                          {item.metric}
                        </span>
                        <span className="px-3 py-1 rounded-full border border-[#B89555]/60 text-[10.5px] sm:text-[11px] font-['DM_Sans'] font-semibold text-[#4A2C20] group-hover:bg-[#4A2C20] group-hover:text-[#B89555] uppercase tracking-wider transition-colors">
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Interactive Indicator Dots (Dynamic color change on manual scroll) */}
          <div className="flex md:hidden items-center justify-center gap-2 mt-3">
            {benefits.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToCard(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeDot === i
                    ? 'w-6 bg-[#B89555]'
                    : 'w-2 bg-[#6B4030]/30 hover:bg-[#6B4030]/60'
                }`}
                aria-label={`Go to benefit ${i + 1}`}
              />
            ))}
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
