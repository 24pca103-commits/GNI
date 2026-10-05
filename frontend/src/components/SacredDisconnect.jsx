import React from 'react';
import { Feather, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

export default function SacredDisconnect() {
  return (
    <section className="py-8 md:py-12 bg-[#F7F2E8] text-[#241A16] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Master Centerpiece Frame with Heritage Double Gold Border and Temple Line Art Background */}
        <Reveal direction="zoom" delay={150}>
          <div className="bg-[#FAF6EE] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border border-[#B89555]/40 shadow-sm relative overflow-hidden">
            {/* Background Architectural Temple, Manuscripts & Gold Jewellery Illustration with Mobile Zoom-In */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center sm:justify-end">
              <img
                src="/artisan/reconnect-bg-banner.png"
                alt="Heritage Temple, Manuscripts & Gold Jewellery Drawing"
                className="w-full h-full object-cover sm:object-contain object-center sm:object-right opacity-85 md:opacity-90 mix-blend-multiply scale-110 sm:scale-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6EE]/80 via-[#FAF6EE]/30 to-[#FAF6EE]/45 sm:from-[#FAF6EE]/75 sm:via-[#FAF6EE]/25 sm:to-[#FAF6EE]/55" />
            </div>

            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#B89555] z-10" />
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#B89555] z-10" />
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#B89555] z-10" />
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#B89555] z-10" />

            <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3.5 relative z-10">
              <div>
                <span className="inline-block px-3.5 py-0.5 sm:py-1 rounded-full bg-[#FAF6EE]/90 backdrop-blur-xs border border-[#6B4030]/25 text-[#4A2C20] text-xs font-['DM_Sans'] font-semibold shadow-xs">
                  Cultural Reflection
                </span>
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#4A2C20] tracking-tight mt-1.5 sm:mt-2 leading-tight">
                  Reconnect with What Truly Matters
                </h2>
                <div className="w-16 sm:w-20 h-0.5 bg-[#B89555] mx-auto mt-1.5 sm:mt-2" />
              </div>

              {/* Main Emotive Statement */}
              <p className="font-['Cormorant_Garamond'] italic text-base sm:text-2xl md:text-3xl text-[#241A16] leading-snug sm:leading-relaxed font-normal pt-0.5 sm:pt-1 text-justify indent-5 sm:indent-0 sm:text-center">
                "Modern life has created a sacred disconnect — where people may be successful
                externally, yet feel disconnected from peace, purpose, creativity and roots."
              </p>

              {/* Two-Column Contrast Bridge: The Disconnect vs The Heritage Bridge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-4 pt-2 sm:pt-4 text-left">
                {/* The Modern Disconnect */}
                <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF6EE]/90 backdrop-blur-xs border border-[#6B4030]/20 space-y-1 sm:space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B89555] shrink-0" />
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16]">
                      The Modern Dilemma
                    </h3>
                  </div>
                  <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-relaxed text-justify indent-4 sm:indent-0">
                    Fast-paced routine, purely digital interactions, and alienation from tactile creation leave people longing for deeper purpose.
                  </p>
                </div>

                {/* The Heritage Bridge */}
                <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#FAF6EE]/90 backdrop-blur-xs border border-[#6B4030]/20 space-y-1 sm:space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B89555] shrink-0" />
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16]">
                      The Heritage Remedy
                    </h3>
                  </div>
                  <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-relaxed text-justify indent-4 sm:indent-0">
                    Engaging with traditional goldsmithing, handmade jewellery, and sacred creation restores stillness and artistic mastery.
                  </p>
                </div>
              </div>

              {/* Closing Core Truth - Solid Brown (No Gradients) */}
              <div className="pt-1.5 sm:pt-3">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#4A2C20] text-[#F7F2E8] border border-[#B89555]/30">
                  <p className="font-['Cormorant_Garamond'] text-sm sm:text-lg font-semibold text-[#F7F2E8] leading-snug">
                    Heritage learning creates a bridge between ancient wisdom and modern life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
