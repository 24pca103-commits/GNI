import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Hand,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import Reveal from './Reveal';

export default function WorkshopSection() {
  const activities = [
    'Basic Prehistoric Rock Painting',
    'Basic Tamili Writing',
    'Iconography Basics',
    'Intro to Naga Jewellery Concepts',
    'Temple Architecture',
    'Live Hands-on Experience (Simple Copper Plate Inscription Making)',
  ];

  const highlights = [
    { icon: Calendar, label: '1 Day Pilot Event' },
    { icon: Users, label: '30–50 People' },
    { icon: Hand, label: 'Hands-on Learning' },
    { icon: Sparkles, label: 'Photos & Videos Recorded' },
  ];

  return (
    <section id="workshop" className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up" delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/10 border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium mb-2.5">
              Immersive Masterclass
            </span>
            <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#241A16] tracking-tight leading-tight">
              <span className="block sm:inline">Ancient Tamil Art &</span>{' '}
              <span className="block sm:inline">Heritage Experience Workshop</span>
            </h2>
            <div className="w-16 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
            <p className="font-['DM_Sans'] mt-2.5 text-sm sm:text-lg text-[#6B4030] font-normal leading-relaxed text-left text-justify indent-3 sm:indent-0 sm:text-center">
              A one-day hands-on introduction to Tamil heritage, art and craftsmanship.
            </p>
          </div>
        </Reveal>

        {/* Master Showcase Card */}
        <Reveal direction="up" delay={200}>
          <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#6B4030]/15 shadow-sm grid lg:grid-cols-12 items-stretch">
            {/* Left Column: Workshop Visual with Solid Overlay (No Gradients) */}
            <div className="lg:col-span-5 relative bg-[#241A16] min-h-[220px] sm:min-h-[320px] lg:min-h-full">
              <img
                src="/artisan/workshop.jpg"
                alt="Tamil heritage workshop hands-on experience"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />

              {/* Floating Fee Badge on Image - Solid Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-[#241A16]/90 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-[#B89555]/40 text-[#F7F2E8] space-y-0.5 sm:space-y-1">
                <span className="font-['DM_Sans'] text-[10px] sm:text-xs text-[#B89555] font-medium">
                  Special Cohort Access
                </span>
                <p className="font-['Cormorant_Garamond'] text-xl sm:text-3xl font-bold text-white leading-tight">
                  Introductory Fee: <span className="font-number text-[#B89555]">₹4,999</span>
                </p>
                <p className="font-['DM_Sans'] text-[11px] sm:text-xs text-[#F7F2E8]/80 leading-snug text-left text-justify">
                  Includes raw materials, inscription plate, and craft kit.
                </p>
              </div>
            </div>

            {/* Right Column: Workshop Details, Activities & Working Register Button */}
            <div className="lg:col-span-7 p-4 sm:p-10 lg:p-12 flex flex-col justify-between space-y-4 sm:space-y-8">
              {/* 4 Feature Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                {highlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-[#F7F2E8] border border-[#6B4030]/15 text-center space-y-0.5 sm:space-y-1"
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#6B4030] mx-auto" />
                      <p className="font-['DM_Sans'] text-[11px] sm:text-xs font-medium text-[#241A16] leading-tight">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Workshop Activities (6 items in Sentence Case) */}
              <div className="space-y-2.5 sm:space-y-4">
                <div className="flex items-center justify-between border-b border-[#6B4030]/15 pb-1.5 sm:pb-2">
                  <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-2xl font-bold text-[#241A16]">
                    Hands-on Activities
                  </h3>
                  <span className="font-['DM_Sans'] text-[11px] sm:text-xs text-[#6B4030] font-medium">
                    <span className="font-number font-bold">6</span> Practical Modules
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-0.5 sm:pt-1">
                  {activities.map((act, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-[#F7F2E8]/60 border border-[#6B4030]/15"
                    >
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#4A2C20] text-[#B89555] text-[10px] sm:text-xs font-number font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="font-['DM_Sans'] text-[11.5px] sm:text-[13px] font-normal text-[#241A16] leading-tight">
                        {act}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Functional CTA Button to /register */}
              <div className="pt-3 sm:pt-4 border-t border-[#6B4030]/15 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <div className="text-center sm:text-left space-y-0.5 sm:space-y-1">
                  <p className="font-['DM_Sans'] text-[11px] sm:text-xs text-[#6B4030] font-semibold">
                    Limited Seats (<span className="font-number">30–50</span> Seats) • Fee: ₹4,999
                  </p>
                  <p className="font-['DM_Sans'] text-[10px] sm:text-xs text-[#241A16]/80 leading-snug">
                    Hands-on learning, live sthapathi guidance & take-home craft.
                  </p>
                </div>

                <Link
                  to="/register"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all duration-200"
                >
                  <span>Register for Workshop</span>
                  <ArrowRight className="w-4 h-4 text-[#241A16]" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
