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
} from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home', icon: Home, shortLabel: 'Home' },
    { label: 'Heritage Pillars', href: '#heritage-skills', icon: Bookmark, shortLabel: 'Pillars' },
    { label: 'Learning Journey', href: '#learning-journey', icon: Sparkles, shortLabel: 'Journey' },
    { label: 'Studios', href: '#facilities', icon: Palette, shortLabel: 'Studios' },
    { label: 'Workshops', href: '#workshop', icon: Hammer, shortLabel: 'Workshop' },
    { label: 'Creators Circle', href: '#community', icon: Users, shortLabel: 'Circle' },
    { label: 'About', href: '#about', icon: Compass, shortLabel: 'About' },
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
                className="h-9 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
              />
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center">
                  <span className="font-['Cormorant_Garamond'] text-base sm:text-xl md:text-2xl font-bold tracking-tight text-[#241A16] group-hover:text-[#6B4030] transition-colors leading-tight truncate">
                    Global Nagas Institute
                  </span>
                </div>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5">
                  <span className="h-px w-2 bg-[#B89555] shrink-0" />
                  <span className="font-['DM_Sans'] text-[10px] sm:text-[11px] text-[#6B4030] font-medium truncate">
                    Heritage Framework & Repository
                  </span>
                  <span className="h-px w-2 bg-[#B89555] shrink-0" />
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
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20] hover:bg-[#6B4030] transition-colors border border-[#4A2C20] shadow-sm"
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

      {/* Mobile Fixed Bottom Navigation Bar - Icons with Names Below */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#4A2C20]/95 backdrop-blur-md border-t border-[#B89555]/30 shadow-[0_-4px_25px_rgba(0,0,0,0.35)] py-1.5 px-1">
        <div className="flex items-center justify-between w-full max-w-md mx-auto">
          {navLinks.map((item) => {
            const isSpecial = item.label.toLowerCase().includes('learning journey');
            const Icon = item.icon;

            if (isSpecial) {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  aria-label={item.label}
                  title={item.label}
                  className="flex flex-col items-center justify-center flex-1 min-w-0 py-0.5 px-0.5 active:scale-95 transition-transform cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#B89555] text-[#241A16] shadow-md">
                    <Sparkles className="w-4 h-4 text-[#241A16] animate-pulse" />
                  </div>
                  <span className="text-[9.5px] font-['DM_Sans'] font-bold text-[#B89555] mt-0.5 truncate max-w-full">
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
        </div>
      </div>
    </>
  );
}
