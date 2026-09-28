import React from 'react';
import { Feather, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

export default function SacredDisconnect() {
  return (
    <section className="py-8 md:py-12 bg-[#F7F2E8] text-[#241A16] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Master Centerpiece Frame with Heritage Double Gold Border */}
        <Reveal direction="zoom" delay={150}>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 border border-[#B89555]/40 shadow-sm relative overflow-hidden">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-[#B89555]" />
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-[#B89555]" />
            <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-[#B89555]" />
            <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-[#B89555]" />

            <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
              {/* Central Spiritual Icon Badge */}
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center mx-auto border border-[#B89555]/40">
                <Feather className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>

              <div>
                <span className="inline-block px-3 py-0.5 sm:px-4 sm:py-1 rounded-full bg-[#F7F2E8] border border-[#6B4030]/20 text-[#6B4030] text-[10px] sm:text-xs font-['DM_Sans'] font-medium">
                  Cultural Reflection
                </span>
                <h2 className="font-['Cormorant_Garamond'] text-xl sm:text-4xl md:text-5xl font-bold text-[#4A2C20] tracking-tight mt-1.5 sm:mt-2.5 leading-tight">
                  Reconnect with What Truly Matters
                </h2>
                <div className="w-16 sm:w-20 h-0.5 bg-[#B89555] mx-auto mt-2 sm:mt-2.5" />
              </div>

              {/* Main Emotive Statement */}
              <p className="font-['Cormorant_Garamond'] italic text-sm sm:text-2xl md:text-3xl text-[#241A16] leading-snug sm:leading-relaxed font-normal pt-1 sm:pt-2 text-justify indent-5 sm:indent-0">
                "Modern life has created a sacred disconnect — where people may be successful
                externally, yet feel disconnected from peace, purpose, creativity and roots."
              </p>

              {/* Two-Column Contrast Bridge: The Disconnect vs The Heritage Bridge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-5 pt-3 sm:pt-6 text-left">
                {/* The Modern Disconnect */}
                <div className="p-4.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#F7F2E8] border border-[#6B4030]/20 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6B4030]" />
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#4A2C20]">
                      The Modern Dilemma
                    </h3>
                  </div>
                  <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-relaxed text-justify indent-4 sm:indent-0">
                    Fast-paced routine, purely digital interactions, and alienation from tactile creation leave people longing for deeper purpose.
                  </p>
                </div>

                {/* The Heritage Bridge */}
                <div className="p-4.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#4A2C20]/5 border border-[#B89555]/40 space-y-1.5 sm:space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B89555]" />
                    <h3 className="font-['Cormorant_Garamond'] text-base sm:text-lg font-bold text-[#241A16]">
                      The Heritage Remedy
                    </h3>
                  </div>
                  <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-relaxed text-justify indent-4 sm:indent-0">
                    Engaging with ancient stone epigraphy, hand-forged metals, and sacred painting restores stillness and artistic mastery.
                  </p>
                </div>
              </div>

              {/* Closing Core Truth - Solid Brown (No Gradients) */}
              <div className="pt-2 sm:pt-4">
                <div className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-[#4A2C20] text-[#F7F2E8] border border-[#B89555]/30">
                  <p className="font-['Cormorant_Garamond'] text-base sm:text-xl font-semibold text-[#F7F2E8] leading-snug">
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
