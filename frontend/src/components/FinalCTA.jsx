import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from './Reveal';

export default function FinalCTA() {
  return (
    <section className="py-8 md:py-12 bg-[#F7F2E8] relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="zoom" delay={150}>
          {/* Solid Deep Brown Container (No Gradients) */}
          <div className="bg-[#4A2C20] rounded-3xl p-6 sm:p-10 md:p-12 text-center text-[#F7F2E8] border border-[#B89555]/40 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 border border-[#B89555]/40 text-[#B89555] text-xs font-['DM_Sans'] font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Admissions Now Open</span>
              </div>

              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Begin Your Heritage Journey
              </h2>

              <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-[#F7F2E8] tracking-wide font-normal">
                Learn Heritage. Create Art. Build Livelihood.
              </p>

              <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#F7F2E8]/80 leading-relaxed max-w-lg mx-auto font-normal">
                Join our upcoming cohort to uncover ancient Tamil knowledge, master traditional craftsmanship,
                and transform cultural wisdom into a sustainable, modern creative career.
              </p>

              <div className="pt-4 flex justify-center">
                {/* Strictly functional button to /register */}
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all duration-200 border border-[#B89555]"
                >
                  <span>Register Now</span>
                  <ArrowRight className="w-4 h-4 text-[#241A16]" />
                </Link>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-['DM_Sans'] text-[#F7F2E8]/70">
                <span>✓ <span className="font-number font-semibold">4</span> Skill Pillars</span>
                <span>•</span>
                <span>✓ <span className="font-number font-semibold">60</span>-Day Cohort Journey</span>
                <span>•</span>
                <span>✓ Materials & Kit Included</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
