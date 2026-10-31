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
  const [activeSection, setActiveSection] = useState('#home');

  const isClickScrollingRef = React.useRef(false);
  const clickTimeoutRef = React.useRef(null);

  useEffect(() => {
    if (window.location.hash) {
      setActiveSection(window.location.hash);
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // If user recently clicked a nav link, preserve that active state during smooth scroll
      if (isClickScrollingRef.current) return;

      const trackedSections = [
        '#home',
        '#about',
        '#heritage-skills',
        '#facilities',
        '#learning-journey',
        '#workshop',
        '#community',
      ];

      // If at or near top of page, activate #home
      if (window.scrollY < 120) {
        setActiveSection('#home');
        return;
      }

      // Check which section is currently centered/visible in viewport
      const scrollPosition = window.scrollY + 180;
      for (let i = trackedSections.length - 1; i >= 0; i--) {
        const id = trackedSections[i];
        const el = document.querySelector(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
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
    setActiveSection(href);
    isClickScrollingRef.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 1000);

    if (window.location.pathname !== '/') {
      window.location.href = '/' + href;
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 70;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
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
                  <span className="font-['Cormorant_Garamond'] text-lg sm:text-2xl md:text-2xl lg:text-3xl font-bold tracking-tight text-[#4A2C20] group-hover:text-[#6B4030] transition-colors leading-tight whitespace-nowrap">
                    Global Nagas Institute
                  </span>
                </div>
              </div>
            </Link>

            {/* Center Navigation Links: Clean 6 items with Active Section Highlight */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navLinks.map((item) => {
                const isSpecial = item.label.toLowerCase().includes('learning journey');
                const isActive = activeSection === item.href;

                if (isSpecial) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className={`font-['DM_Sans'] text-xs font-bold py-1 cursor-pointer relative group flex items-center gap-1.5 transition-colors ${
                        isActive ? 'text-[#B89555]' : 'text-[#4A2C20] hover:text-[#B89555]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B89555] animate-pulse shrink-0" />
                      <span className={isActive ? 'font-extrabold text-[#B89555]' : 'animate-text-glow'}>
                        {item.label}
                      </span>
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-[#B89555] transition-all duration-200 ${
                          isActive ? 'w-full shadow-xs' : 'w-0 group-hover:w-full'
                        }`}
                      />
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
                    className={`font-['DM_Sans'] text-xs transition-colors py-1 cursor-pointer relative group ${
                      isActive ? 'text-[#B89555] font-bold' : 'text-[#241A16] hover:text-[#B89555] font-semibold'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#B89555] transition-all duration-200 ${
                        isActive ? 'w-full shadow-xs' : 'w-0 group-hover:w-full'
                      }`}
                    />
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
                const isActive = !item.isRoute && activeSection === item.href;

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
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#4A2C20] border-[#B89555] shadow-md ring-1 ring-[#B89555]/60'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-[#B89555]/30 text-[#F7F2E8]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? 'bg-[#B89555] text-[#241A16] shadow-xs'
                            : 'bg-[#B89555]/15 text-[#B89555]'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-['DM_Sans'] text-xs leading-tight ${
                              isActive ? 'font-bold text-[#E5B869]' : 'font-semibold text-[#F7F2E8]'
                            }`}
                          >
                            {item.label}
                          </p>
                          {isActive && (
                            <span className="text-[9px] bg-[#B89555] text-[#241A16] font-extrabold uppercase px-1.5 py-0.5 rounded font-['DM_Sans']">
                              Active
                            </span>
                          )}
                        </div>
                        <p
                          className={`font-['DM_Sans'] text-[10px] leading-tight mt-0.5 ${
                            isActive ? 'text-[#F7F2E8]/90' : 'text-[#F7F2E8]/60'
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#E5B869]' : 'text-[#F7F2E8]/40'
                      }`}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Fixed Bottom Navigation Bar - Exactly 5 items with Clicked/Active Link Highlight */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#4A2C20]/95 backdrop-blur-md border-t border-[#B89555]/30 shadow-[0_-4px_25px_rgba(0,0,0,0.35)] py-1.5 px-1">
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.href;

            // Center Journey item
            if (item.isCenter) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-label={item.label}
                  title={item.label}
                  className={`flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 active:scale-95 transition-all cursor-pointer group relative ${
                    isActive ? 'scale-105' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                      isActive
                        ? 'bg-[#B89555] text-[#241A16] shadow-[0_0_14px_rgba(184,149,85,0.9)] ring-2 ring-[#E5B869]'
                        : 'group-hover:bg-white/10 text-[#B89555]'
                    }`}
                  >
                    <Sparkles
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-[#241A16] animate-pulse drop-shadow-sm'
                          : 'text-[#B89555] animate-pulse drop-shadow-[0_0_8px_rgba(184,149,85,0.85)]'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[9.5px] font-['DM_Sans'] font-bold mt-0.5 whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-[#E5B869] font-extrabold drop-shadow-[0_0_6px_rgba(229,184,105,0.8)]'
                        : 'text-[#B89555] animate-text-glow'
                    }`}
                  >
                    {item.shortLabel || item.label}
                  </span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] shadow-[0_0_6px_#E5B869] mt-0.5 animate-pulse" />
                  )}
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
                className={`flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 active:scale-95 transition-all cursor-pointer group relative ${
                  isActive ? 'scale-105' : 'text-[#F7F2E8]/75 hover:text-[#B89555]'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#B89555] text-[#241A16] shadow-[0_0_12px_rgba(184,149,85,0.85)] ring-1 ring-[#E5B869]/60'
                      : 'text-[#F7F2E8]/80 group-hover:bg-white/10 group-hover:text-[#B89555]'
                  }`}
                >
                  {Icon && <Icon className="w-4.5 h-4.5" />}
                </div>
                <span
                  className={`text-[9.5px] font-['DM_Sans'] mt-0.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'font-bold text-[#E5B869] drop-shadow-[0_0_4px_rgba(229,184,105,0.6)]'
                      : 'font-medium text-[#F7F2E8]/75 group-hover:text-[#B89555]'
                  }`}
                >
                  {item.shortLabel || item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] shadow-[0_0_6px_#E5B869] mt-0.5" />
                )}
              </a>
            );
          })}

          {/* 5th Item: More Button with Active State */}
          {(() => {
            const isMoreActive =
              moreMenuOpen ||
              moreNavLinks.some((m) => !m.isRoute && m.href === activeSection);

            return (
              <button
                type="button"
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                aria-label="More navigation sections"
                title="More sections"
                className={`flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 active:scale-95 transition-all cursor-pointer group select-none outline-none focus:outline-none [-webkit-tap-highlight-color:transparent] relative ${
                  isMoreActive ? 'scale-105' : 'text-[#F7F2E8]/75 hover:text-[#B89555]'
                }`}
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isMoreActive
                      ? 'bg-[#B89555] text-[#241A16] shadow-[0_0_12px_rgba(184,149,85,0.85)] ring-1 ring-[#E5B869]/60'
                      : 'text-[#F7F2E8]/80 group-hover:bg-white/10 group-hover:text-[#B89555]'
                  }`}
                >
                  <MoreHorizontal className="w-4.5 h-4.5" />
                </div>
                <span
                  className={`text-[9.5px] font-['DM_Sans'] mt-0.5 whitespace-nowrap transition-colors ${
                    isMoreActive
                      ? 'font-bold text-[#E5B869] drop-shadow-[0_0_4px_rgba(229,184,105,0.6)]'
                      : 'font-medium text-[#F7F2E8]/75 group-hover:text-[#B89555]'
                  }`}
                >
                  More
                </span>
                {isMoreActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5B869] shadow-[0_0_6px_#E5B869] mt-0.5" />
                )}
              </button>
            );
          })()}
        </div>
      </div>
    </>
  );
}
