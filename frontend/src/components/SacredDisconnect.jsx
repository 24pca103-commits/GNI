import React from 'react';
import { Feather, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

export default function SacredDisconnect() {
  return (
    <section className="py-8 md:py-12 bg-[#F7F2E8] text-[#241A16] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Master Centerpiece Frame with Heritage Double Gold Border */}
        <Reveal direction="zoom" delay={150}>
          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-[#B89555]/40 shadow-sm relative overflow-hidden">
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[#B89555]" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[#B89555]" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[#B89555]" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[#B89555]" />

            <div className="text-center max-w-3xl mx-auto space-y-4">
              {/* Central Spiritual Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center mx-auto border border-[#B89555]/40">
                <Feather className="w-7 h-7" />
              </div>

              <div>
                <span className="inline-block px-4 py-1 rounded-full bg-[#F7F2E8] border border-[#6B4030]/20 text-[#6B4030] text-xs font-['DM_Sans'] font-medium">
                  Cultural Reflection
                </span>
                <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-[#4A2C20] tracking-tight mt-2.5 leading-tight">
                  <span className="block sm:inline">Reconnect with</span>{' '}
                  <span className="block sm:inline">What Truly Matters</span>
                </h2>
                <div className="w-20 h-0.5 bg-[#B89555] mx-auto mt-2.5" />
              </div>

              {/* Main Emotive Statement */}
              <p className="font-['Cormorant_Garamond'] italic text-xl sm:text-2xl md:text-3xl text-[#241A16] leading-relaxed font-normal pt-2">
                "Modern life has created a sacred disconnect — where people may be successful
                externally, yet feel disconnected from peace, purpose, creativity and their roots."
              </p>

              {/* Two-Column Contrast Bridge: The Disconnect vs The Heritage Bridge */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 text-left">
                {/* The Modern Disconnect */}
                <div className="p-5 rounded-2xl bg-[#F7F2E8] border border-[#6B4030]/20 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#6B4030]" />
                    <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#4A2C20]">
                      The Modern Dilemma
                    </h3>
                  </div>
                  <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-relaxed">
                    Fast-paced routine, purely digital interactions, and alienation from tactile creation
                    leave modern individuals longing for deeper creative purpose and rooted identity.
                  </p>
                </div>

                {/* The Heritage Bridge */}
                <div className="p-5 rounded-2xl bg-[#4A2C20]/5 border border-[#B89555]/40 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B89555]" />
                    <h3 className="font-['Cormorant_Garamond'] text-lg font-bold text-[#241A16]">
                      The Heritage Remedy
                    </h3>
                  </div>
                  <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#241A16]/80 leading-relaxed">
                    Engaging with ancient stone epigraphy, hand-forged metals, and sacred painting restores
                    stillness, dignity, and real-world artistic mastery.
                  </p>
                </div>
              </div>

              {/* Closing Core Truth - Solid Brown (No Gradients) */}
              <div className="pt-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#4A2C20] text-[#F7F2E8] border border-[#B89555]/30">
                  <p className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-semibold text-[#F7F2E8]">
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
