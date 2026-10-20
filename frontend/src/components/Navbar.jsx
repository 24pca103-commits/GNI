import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  X,
  Mail,
  Phone,
  ArrowRight,
  Sparkles,
  Home,
  Bookmark,
  Hammer,
  Users,
  Compass,
  Palette,
  MoreHorizontal,
  GraduationCap,
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', icon: Home, shortLabel: 'Home' },
    { label: 'About', href: '#about', icon: Compass, shortLabel: 'About' },
    { label: 'Heritage Pillars', href: '#heritage-skills', icon: Bookmark, shortLabel: 'Pillars' },
    { label: 'Studios', href: '#facilities', icon: Palette, shortLabel: 'Studios' },
    { label: 'Learning Journey', href: '#learning-journey', icon: Sparkles, shortLabel: 'Journey' },
    { label: 'Workshops', href: '#workshop', icon: Hammer, shortLabel: 'Workshop' },
    { label: 'Creators Circle', href: '#community', icon: Users, shortLabel: 'Circle' },
  ];

  // 4 Main mobile items (Journey in the exact center at index 2)
  const mobileNavItems = [
    { label: 'Home', href: '#home', icon: Home, shortLabel: 'Home' },
    { label: 'About', href: '#about', icon: Compass, shortLabel: 'About' },
    { label: 'Learning Journey', href: '#learning-journey', icon: Sparkles, shortLabel: 'Journey', isCenter: true },
    { label: 'Workshops', href: '#workshop', icon: Hammer, shortLabel: 'Workshop' },
  ];

  // Remaining sections accessible via the "More" bottom sheet
  const moreNavLinks = [
    {
      label: 'Heritage Pillars',
      href: '#heritage-skills',
      icon: Bookmark,
      desc: '4 traditional craft disciplines',
    },
    {
      label: 'Studio Facilities',
      href: '#facilities',
      icon: Palette,
      desc: 'Artisan forge, labs & stations',
    },
    {
      label: 'Creators Circle',
      href: '#community',
      icon: Users,
      desc: 'Master artisans & community guild',
    },
    {
      label: 'Cohort Admissions 2026',
      href: '/register',
      icon: Sparkles,
      desc: 'Apply for 60-day intensive cohort',
      isRoute: true,
    },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Top Contact & Announcement Bar in Dark Brown (#4A2C20) */}
        <div className="bg-[#4A2C20] border-b border-[#B89555]/20 text-[#F7F2E8]/90 py-1.5 px-3 sm:px-4 text-xs font-['DM_Sans']">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-5">
              <a
                href="mailto:info@artisancoach.org"
                className="hover:text-[#B89555] transition-colors flex items-center gap-1.5 text-[#F7F2E8]/85"
              >
                <Mail className="w-3.5 h-3.5 text-[#B89555]" />
                <span className="hidden sm:inline">info@artisancoach.org</span>
              </a>
              <a
                href="tel:+919061621111"
                className="flex items-center gap-1.5 hover:text-[#B89555] transition-colors text-[#F7F2E8]/85"
              >
                <Phone className="w-3.5 h-3.5 text-[#B89555]" />
                <span className="font-number font-medium text-[#F7F2E8] text-[11px] sm:text-xs">+91 90616 21111</span>
              </a>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B89555] animate-pulse" />
              <span className="text-[11px] sm:text-xs text-[#F7F2E8]/90 font-normal">
                Admissions Open 2026
              </span>
            </div>
          </div>
        </div>

      {/* Main Sticky Navbar in Light Palette Color (#F7F2E8) */}
      <nav
        className={`transition-colors duration-200 ${
          isScrolled
            ? 'bg-[#F7F2E8] border-b border-[#6B4030]/20 py-2 sm:py-2.5 shadow-md'
            : 'bg-[#F7F2E8]/95 backdrop-blur-sm border-b border-[#6B4030]/15 py-2 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo with Title Case Text */}
            <Link to="/" className="group flex items-center gap-2 sm:gap-3 min-w-0">
              <img
                src="/artisan/logo.png"
                alt="Global Nagas Institute logo"
                className="h-10 sm:h-12 md:h-14 lg:h-15 w-auto object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center">
                  <span className="font-['Cormorant_Garamond'] text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold tracking-tight text-[#4A2C20] group-hover:text-[#6B4030] transition-colors leading-tight truncate">
                    Global Nagas Institute
                  </span>
                </div>
              </div>
            </Link>

            {/* Center Navigation Links: Clean 6 items */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((item) => {
                const isSpecial = item.label.toLowerCase().includes('learning journey');

                if (isSpecial) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="font-['DM_Sans'] text-xs font-bold py-1 cursor-pointer relative group flex items-center gap-1.5 animate-text-glow"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B89555] animate-pulse shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  );
                }

                return item.isRoute ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="font-['DM_Sans'] text-xs font-semibold text-[#B89555] hover:text-[#241A16] transition-colors py-1 relative group"
                  >
                    <span>{item.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B89555] transition-all duration-200 group-hover:w-full" />
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="font-['DM_Sans'] text-xs font-semibold text-[#241A16] hover:text-[#B89555] transition-colors py-1 cursor-pointer relative group"
                  >
                    <span>{item.label}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#B89555] transition-all duration-200 group-hover:w-full" />
                  </a>
                );
              })}
            </div>

            {/* Right: Register CTA Button */}
            <div className="hidden sm:flex items-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] transition-colors border border-[#4A2C20] shadow-sm"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#B89555]" />
              </Link>
            </div>

            {/* Mobile Right: Register CTA Button (No Hamburger 3-Line Menu) */}
            <div className="flex sm:hidden items-center shrink-0">
              <Link
                to="/register"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] transition-colors shadow-xs border border-[#B89555]/40"
              >
                <span>Register</span>
                <ArrowRight className="w-3 h-3 text-[#B89555]" />
              </Link>
            </div>
          </div>
        </div>
      </nav>
      </header>

      {/* Mobile "More" Menu Bottom Sheet / Drawer - Positioned cleanly right above the bottom nav bar */}
      {moreMenuOpen && (
        <div className="sm:hidden fixed inset-0 z-40 flex flex-col justify-end pb-[54px]">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMoreMenuOpen(false)}
          />

          {/* Bottom Drawer Card */}
          <div className="relative z-10 bg-[#351E14] border-t-2 border-[#B89555] rounded-t-3xl shadow-[0_-10px_35px_rgba(0,0,0,0.6)] p-4 pb-4 space-y-3 max-h-[72vh] overflow-y-auto">
            {/* Header with Title & Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B89555] animate-pulse" />
                <span className="font-['Cormorant_Garamond'] text-lg font-bold text-[#F7F2E8]">
                  More Repository Sections
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMoreMenuOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-[#F7F2E8] flex items-center justify-center transition-colors cursor-pointer select-none outline-none"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Cards List */}
            <div className="grid grid-cols-1 gap-2 pt-0.5">
              {moreNavLinks.map((item) => {
                const Icon = item.icon;
                if (item.isRoute) {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#4A2C20] to-[#5C3728] border border-[#B89555]/40 text-[#F7F2E8] hover:border-[#B89555] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#B89555]/20 text-[#B89555] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-['DM_Sans'] text-xs font-bold text-white leading-tight">
                            {item.label}
                          </p>
                          <p className="font-['DM_Sans'] text-[10.5px] text-[#F7F2E8]/70 leading-tight mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[#B89555] shrink-0" />
                    </Link>
                  );
                }

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#B89555]/30 text-[#F7F2E8] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#B89555]/15 text-[#B89555] flex items-center justify-center shrink-0">
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <p className="font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] leading-tight">
                          {item.label}
                        </p>
                        <p className="font-['DM_Sans'] text-[10px] text-[#F7F2E8]/60 leading-tight mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#F7F2E8]/40 shrink-0" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar - Exactly 5 items, Journey at Center */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#4A2C20]/95 backdrop-blur-md border-t border-[#B89555]/30 shadow-[0_-4px_25px_rgba(0,0,0,0.35)] py-1.5 px-1">
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;

            // Center Journey item: shining golden sparkle icon, NO solid circular background
            if (item.isCenter) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-label={item.label}
                  title={item.label}
                  className="flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 active:scale-95 transition-transform cursor-pointer group"
                >
                  <div className="w-7 h-7 flex items-center justify-center rounded-lg group-hover:bg-white/10 transition-colors">
                    <Sparkles className="w-5 h-5 text-[#B89555] animate-pulse drop-shadow-[0_0_8px_rgba(184,149,85,0.85)]" />
                  </div>
                  <span className="text-[9.5px] font-['DM_Sans'] font-bold text-[#B89555] animate-text-glow mt-0.5 truncate max-w-full">
                    {item.shortLabel || item.label}
                  </span>
                </a>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                aria-label={item.label}
                title={item.label}
                className="flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 text-[#F7F2E8]/85 hover:text-[#B89555] active:scale-95 transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 flex items-center justify-center rounded-lg group-hover:bg-white/10 transition-colors">
                  {Icon && <Icon className="w-4.5 h-4.5" />}
                </div>
                <span className="text-[9.5px] font-['DM_Sans'] font-medium text-[#F7F2E8]/80 group-hover:text-[#B89555] mt-0.5 truncate max-w-full">
                  {item.shortLabel || item.label}
                </span>
              </a>
            );
          })}

          {/* 5th Item: More Button */}
          <button
            type="button"
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            aria-label="More navigation sections"
            title="More sections"
            className={`flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 active:scale-95 transition-all cursor-pointer group select-none outline-none focus:outline-none [-webkit-tap-highlight-color:transparent] ${
              moreMenuOpen ? 'text-[#B89555]' : 'text-[#F7F2E8]/85 hover:text-[#B89555]'
            }`}
          >
            <div className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
              moreMenuOpen ? 'bg-white/15' : 'group-hover:bg-white/10'
            }`}>
              <MoreHorizontal className="w-4.5 h-4.5" />
            </div>
            <span className={`text-[9.5px] font-['DM_Sans'] font-medium mt-0.5 truncate max-w-full ${
              moreMenuOpen ? 'text-[#B89555] font-bold' : 'text-[#F7F2E8]/80 group-hover:text-[#B89555]'
            }`}>
              More
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
