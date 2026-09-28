import React, { useRef, useState } from 'react';
import { Star, MessageSquareQuote, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import FloatingBubbles from './FloatingBubbles';

export default function Testimonials() {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      name: 'Ananthi Selvaraj',
      role: 'Sacred Jewellery Designer, Chennai',
      batch: 'Cohort Alumni • Naga Metallurgy',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      review:
        'Learning handmade naga repoussé and sacred iconography under traditional sthapathis unlocked a lucrative luxury market for my atelier. Orders tripled within 4 months.',
      rating: 5,
    },
    {
      name: 'Arunachalam Murugan',
      role: 'Conservation Architect, Madurai',
      batch: 'Cohort Alumni • Epigraphy Track',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
      review:
        'The Tamili script deciphering and stone inscription modules gave me the authentic foundation required for heritage conservation projects.',
      rating: 5,
    },
    {
      name: 'Priyadharshini K.',
      role: 'Textile & Blouse Creator, Coimbatore',
      batch: 'Cohort Alumni • Rock Art & Painting',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=300&q=80',
      review:
        'I learned to grind natural mineral pigments and transcribe ancient temple motifs into custom bridal blouses. A dignified six-figure monthly livelihood.',
      rating: 5,
    },
    {
      name: 'Venkatesh Raman',
      role: 'Luxury Interior Consultant, Bangalore',
      batch: 'Cohort Alumni • Heritage Interiors',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      review:
        'Clients gladly pay a high premium for hand-beaten sacred brass panels and pooja sanctums. GNI taught me the commercial framework of sacred craft.',
      rating: 5,
    },
    {
      name: 'Kavinraj Thirunavukkarasu',
      role: 'Temple Muralist & Calligrapher, Thanjavur',
      batch: 'Cohort Alumni • Epigraphical Arts',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      review:
        'The rare palm-leaf manuscript preservation techniques and natural binder recipes gave my temple restoration work unprecedented authenticity and acclaim.',
      rating: 5,
    },
    {
      name: 'Meenakshi Sundaram',
      role: 'Sacred Bronze Sculptor, Kumbakonam',
      batch: 'Cohort Alumni • Lost Wax Metallurgy',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      review:
        'Understanding the Dhyana Shlokas and Shilpa Shastras allowed me to create museum-grade icons. GNI connects timeless traditions with global connoisseurs.',
      rating: 5,
    },
  ];

  // Manual scroll nudge buttons for user convenience
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Duplicated array for 100% seamless infinite horizontal looping
  const loopedList = [...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="py-8 md:py-16 bg-white relative overflow-hidden border-t border-[#6B4030]/15">
      {/* Floating Animated Bubbles */}
      <FloatingBubbles count={8} color="#B89555" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header in Title Case */}
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              <MessageSquareQuote className="w-3.5 h-3.5 text-[#B89555]" />
              <span>Artisan Alumni Voices</span>
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              Words From Our Heritage Creators
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-base text-[#6B4030] leading-relaxed font-normal text-justify indent-5 sm:indent-0">
              Real feedback from architects, designers, and artisans whose skills and livelihoods were transformed.
            </p>
          </div>
        </Reveal>

        {/* Top Controls: Left / Right navigation */}
        <Reveal direction="up" delay={120}>
          <div className="flex items-center justify-end mb-3 sm:mb-4 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => scroll('left')}
                aria-label="Previous Testimonial"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7F2E8] border border-[#6B4030]/20 text-[#6B4030] hover:bg-[#4A2C20] hover:text-[#B89555] hover:border-[#B89555] transition-all flex items-center justify-center shadow-xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                aria-label="Next Testimonial"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F7F2E8] border border-[#6B4030]/20 text-[#6B4030] hover:bg-[#4A2C20] hover:text-[#B89555] hover:border-[#B89555] transition-all flex items-center justify-center shadow-xs cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Single Row Horizontal Infinite Scrolling Track */}
        <Reveal direction="up" delay={150}>
          <div
            className="relative overflow-hidden group py-2"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {/* Left & Right Soft Fade Gradient Masks */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 sm:w-16 bg-gradient-to-l from-white via-white/80 to-transparent z-10" />

            {/* Scroll Container with marquee animation in a single horizontal row */}
            <div
              ref={scrollRef}
              className={`flex items-stretch gap-4 sm:gap-6 ${
                isPaused ? 'overflow-x-auto no-scrollbar' : 'animate-marquee-infinite'
              }`}
            >
              {loopedList.map((item, idx) => (
                <div
                  key={idx}
                  className="w-[310px] sm:w-[360px] md:w-[380px] shrink-0 flex flex-col"
                >
                  <div className="bg-[#F7F2E8] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#6B4030]/15 shadow-sm hover:shadow-xl hover:border-[#B89555]/50 transition-all duration-300 flex flex-col justify-between h-full group/card">
                    <div>
                      {/* Rating Stars in Antique Gold #B89555 & Quote Icon */}
                      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#B89555] text-[#B89555]" />
                          ))}
                        </div>
                        <MessageSquareQuote className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B4030]/30 group-hover/card:text-[#B89555] transition-colors" />
                      </div>

                      {/* Review Text */}
                      <p className="font-['DM_Sans'] text-[#241A16] text-xs sm:text-[13.5px] leading-relaxed italic mb-3 sm:mb-5 font-normal text-justify indent-4 sm:indent-0">
                        "{item.review}"
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="pt-2.5 sm:pt-4 border-t border-[#6B4030]/15 flex items-center gap-2.5 sm:gap-3.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl object-cover border border-[#6B4030]/20 shadow-xs shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-['Cormorant_Garamond'] font-bold text-[#241A16] text-sm sm:text-base leading-tight truncate">
                            {item.name}
                          </h3>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B89555] shrink-0" title="Verified Cohort Graduate" />
                        </div>
                        <p className="font-['DM_Sans'] text-[10px] sm:text-xs font-semibold text-[#6B4030] truncate">
                          {item.role}
                        </p>
                        <p className="font-['DM_Sans'] text-[9px] sm:text-[10.5px] text-[#B89555] font-medium mt-0.5 truncate">
                          {item.batch}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
