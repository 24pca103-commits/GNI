import React from 'react';
import { ArrowUp, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  const sections = [
    { label: 'Heritage Skills', href: '#heritage-skills' },
    { label: 'Core Values', href: '#core-values' },
    { label: 'Learning Journey', href: '#learning-journey' },
    { label: 'Workshop', href: '#workshop' },
    { label: 'Community', href: '#community' },
  ];

  const handleStaticClick = (e) => {
    e.preventDefault();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#F7F2E8] text-[#241A16] border-t border-[#6B4030]/20 py-6 sm:py-8 pb-20 sm:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 pb-5 sm:pb-6 border-b border-[#6B4030]/15 items-start">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-2.5 sm:space-y-3">
            <div className="flex items-center gap-3">
              <img
                src="/artisan/logo.png"
                alt="Global Nagas Institute logo"
                className="h-14 sm:h-16 md:h-18 w-auto object-contain transition-transform duration-200 hover:scale-105"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold tracking-tight text-[#4A2C20]">
                    Global Nagas Institute
                  </span>
                </div>
              </div>
            </div>

            <p className="font-['Cormorant_Garamond'] italic text-base sm:text-lg text-[#6B4030] font-normal">
              From Ancient Tamil Wisdom to Modern Creation
            </p>

            <p className="font-['DM_Sans'] text-xs text-[#241A16]/80 max-w-md leading-relaxed text-left text-justify">
              A structured heritage learning experience transforming ancient Tamil knowledge into
              practical creativity, craftsmanship and modern applications.
            </p>
          </div>

          {/* Static Section Links (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20]">
              Repository Sections
            </h4>
            <ul className="flex flex-col space-y-2 sm:space-y-1.5">
              {sections.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={handleStaticClick}
                    className="font-['DM_Sans'] text-xs text-[#6B4030] hover:text-[#B89555] transition-colors cursor-default"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Campus Address & Contact Info (3 cols) */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="font-['DM_Sans'] text-xs font-bold text-[#4A2C20]">
              Campus Address &amp; Contact
            </h4>
            <div className="flex items-start gap-2 text-xs font-['DM_Sans'] text-[#6B4030]">
              <MapPin className="w-4 h-4 text-[#B89555] shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[#241A16]/85">
                No.156, 2nd floor, Uppara street, Raja street corner, Coimbatore 641001
              </p>
            </div>
            <div className="space-y-1.5 pt-1 text-xs font-['DM_Sans'] text-[#6B4030]">
              <a
                href="tel:+919061621111"
                className="flex items-center gap-2 hover:text-[#4A2C20] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#B89555]" />
                <span className="font-number">+91 90616 21111</span>
              </a>
              <a
                href="mailto:info@artisancoach.org"
                className="flex items-center gap-2 hover:text-[#4A2C20] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#B89555]" />
                <span>info@artisancoach.org</span>
              </a>
            </div>
          </div>

          {/* Back to top (1 col) */}
          <div className="md:col-span-1 flex justify-end">
            <button
              onClick={scrollToTop}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-[#4A2C20] text-[#6B4030] hover:text-[#B89555] border border-[#6B4030]/20 shadow-xs transition-all duration-200 flex items-center justify-center cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-['DM_Sans'] text-[#6B4030]">
          <p>© <span className="font-number font-normal">2026</span> Global Nagas Institute. All Rights Reserved.</p>
          <p className="text-[11px] sm:text-xs">Designed with ancient Tamil cultural reverence.</p>
        </div>
      </div>
    </footer>
  );
}
