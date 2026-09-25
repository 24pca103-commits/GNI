import React from 'react';
import { Star, MessageSquareQuote, CheckCircle2, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Ananthi Selvaraj',
      role: 'Sacred Jewellery Designer, Chennai',
      batch: 'Cohort Alumni • Naga Metallurgy & Repoussé Masterclass',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      review:
        'Learning handmade naga repoussé and sacred iconography under traditional sthapathis unlocked an entirely new luxury market for my atelier. My custom temple-motif bridal jewelry orders tripled within 4 months of completing the cohort.',
      rating: 5,
    },
    {
      name: 'Arunachalam Murugan',
      role: 'Conservation Architect & Restoration Lead, Madurai',
      batch: 'Cohort Alumni • Epigraphy & Temple Architecture Track',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      review:
        'The Tamili script deciphering and stone inscription reading modules gave me the authentic foundation required for heritage conservation projects. The 1:3 theory-to-studio balance is truly unparalleled across India.',
      rating: 5,
    },
    {
      name: 'Priyadharshini K.',
      role: 'Textile & Blouse Motif Creator, Coimbatore',
      batch: 'Cohort Alumni • Prehistoric Rock Painting & Iconography',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
      review:
        'I learned to grind natural mineral pigments and transcribe ancient temple motifs directly into custom bridal blouses. What used to be a weekend hobby is now a dignified six-figure monthly livelihood.',
      rating: 5,
    },
    {
      name: 'Venkatesh Raman',
      role: 'Luxury Interior Consultant, Bangalore',
      batch: 'Cohort Alumni • Brass Repoussé & Heritage Interiors',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      review:
        'Clients now gladly pay a high premium for hand-beaten sacred brass panels and pooja room interior sanctums. GNI didn’t just teach me ancient craft; they taught me the commercial framework of sacred craftsmanship.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-12 md:py-20 bg-white relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Artisan Alumni Voices</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Words From Our Heritage Creators
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-3 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal">
              Real feedback from architects, jewellery designers, and traditional artisans whose skills,
              income, and cultural identity were transformed at Global Nagas Institute.
            </p>
          </div>
        </Reveal>

        {/* Testimonials Grid: Sliding on Mobile, Grid on Larger Screens */}
        <Reveal direction="up" delay={150}>
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar pb-5 pt-1 gap-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:gap-8">
            {testimonials.map((item, idx) => (
              <div
                key={idx}
                className="w-[84vw] max-w-[320px] md:w-auto md:max-w-none shrink-0 snap-center flex flex-col"
              >
                <div className="bg-[#F7F2E8] rounded-3xl p-6 sm:p-8 border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col justify-between group h-full">
                  <div>
                    {/* Rating Stars in Antique Gold #B89555 & Quote Icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(item.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#B89555] text-[#B89555]" />
                        ))}
                      </div>
                      <MessageSquareQuote className="w-6 h-6 text-[#6B4030]/30 group-hover:text-[#B89555] transition-colors" />
                    </div>

                    {/* Review Text */}
                    <p className="font-['DM_Sans'] text-[#241A16] text-xs sm:text-sm leading-relaxed italic mb-6 font-normal">
                      "{item.review}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="pt-4 border-t border-[#6B4030]/15 flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-[#6B4030]/20 shadow-xs shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-['Cormorant_Garamond'] font-bold text-[#241A16] text-lg">
                          {item.name}
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-[#B89555] shrink-0" title="Verified Cohort Graduate" />
                      </div>
                      <p className="font-['DM_Sans'] text-xs font-semibold text-[#6B4030]">
                        {item.role}
                      </p>
                      <p className="font-['DM_Sans'] text-[11px] text-[#B89555] font-medium mt-0.5">
                        {item.batch}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Swipe Hint Dots */}
          <div className="flex md:hidden items-center justify-center gap-1.5 mt-3">
            {testimonials.map((_, i) => (
              <span key={i} className="w-2 h-1.5 rounded-full bg-[#B89555]/50" />
            ))}
            <span className="text-[11px] font-['DM_Sans'] text-[#6B4030]/70 ml-1">Swipe to view reviews</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
