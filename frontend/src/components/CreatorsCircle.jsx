import React from 'react';
import { Sparkles, MessageSquare, Award, ArrowUpRight } from 'lucide-react';
import Reveal from './Reveal';

export default function CreatorsCircle() {
  const handleStaticClick = (e) => {
    e.preventDefault();
  };

  const communityFeatures = [
    {
      title: 'Peer Guild Critiques',
      desc: 'Share works-in-progress, rock art sketches, and metal casts with fellow heritage creators.',
      icon: MessageSquare,
    },
    {
      title: 'Annual Heritage Showcase',
      desc: 'Curated public exhibitions presenting member creations to art collectors and architects.',
      icon: Award,
    },
    {
      title: 'Repository Access',
      desc: 'Continuous access to rare manuscripts, digitized epigraphy, and traditional pigment recipes.',
      icon: Sparkles,
    },
  ];

  return (
    <section id="community" className="py-10 md:py-16 bg-[#241A16] text-[#F7F2E8] relative overflow-hidden">
      {/* Background Banner Image with Dark Gold & Charcoal Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <img
          src="/artisan/community-banner.jpg"
          alt="Tamil Heritage Goldsmith Creators Circle Guild Atelier"
          className="w-full h-full object-cover opacity-25 md:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#241A16] via-[#241A16]/90 to-[#241A16]/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#241A16] via-transparent to-[#241A16]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          {/* Left Column: Heading, Subtitle, Description & Static Button */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <Reveal direction="up" delay={100}>
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#4A2C20]/90 backdrop-blur-xs border border-[#B89555]/30 text-[#B89555] text-xs font-['DM_Sans'] font-medium">
                Exclusive Community • WhatsApp Group
              </span>
            </Reveal>

            <Reveal direction="up" delay={200}>
              <h2 className="font-['Cormorant_Garamond'] text-2xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                A2O Creators Circle Community
              </h2>
            </Reveal>

            <Reveal direction="up" delay={300}>
              <p className="font-['Cormorant_Garamond'] text-xl sm:text-2xl text-[#B89555] font-medium italic">
                Not Just Students. A Community of Creators.
              </p>
            </Reveal>

            <Reveal direction="up" delay={400}>
              <p className="font-['DM_Sans'] text-sm sm:text-base text-[#F7F2E8]/85 leading-relaxed font-normal text-justify indent-5 sm:indent-0">
                Join our dedicated WhatsApp group and creator guild — not just students, but a thriving community where
                heritage learners share ideas, showcase work, get master feedback, and collaborate on commercial projects.
              </p>
            </Reveal>

            <Reveal direction="up" delay={500}>
              <div className="pt-2">
                {/* Strictly static button */}
                <button
                  onClick={handleStaticClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-['DM_Sans'] text-xs font-semibold text-[#241A16] bg-[#B89555] hover:bg-[#c8a565] shadow-sm transition-all duration-200 cursor-default group"
                >
                  <span>Join A2O WhatsApp Group</span>
                  <ArrowUpRight className="w-4 h-4 text-[#241A16] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 3 Community Benefit Cards */}
          <div className="lg:col-span-6 space-y-3 sm:space-y-4">
            {communityFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Reveal key={feat.title} direction="up" delay={200 + idx * 100}>
                  <div className="bg-[#4A2C20]/60 backdrop-blur-sm p-4.5 sm:p-7 rounded-xl sm:rounded-2xl border border-white/10 hover:border-[#B89555]/40 transition-all duration-300 flex items-start gap-3.5 sm:gap-5 shadow-sm">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#4A2C20] text-[#B89555] flex items-center justify-center shrink-0 border border-[#B89555]/30 shadow-sm">
                      <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-['Cormorant_Garamond'] text-lg sm:text-xl font-bold text-white leading-snug">
                        {feat.title}
                      </h3>
                      <p className="font-['DM_Sans'] text-xs sm:text-[13px] text-[#F7F2E8]/80 leading-relaxed font-normal text-justify indent-4 sm:indent-0">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
