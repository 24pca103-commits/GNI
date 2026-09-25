import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Mail, Phone, ArrowRight, Sparkles } from 'lucide-react';

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
    { label: 'Home', href: '#home' },
    { label: 'Heritage Pillars', href: '#heritage-skills' },
    { label: 'Learning Journey', href: '#learning-journey' },
    { label: 'Workshops', href: '#workshop' },
    { label: 'Creators Circle', href: '#community' },
    { label: 'About', href: '#about' },
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
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Contact & Announcement Bar in Dark Brown (#4A2C20) */}
      <div className="bg-[#4A2C20] border-b border-[#B89555]/20 text-[#F7F2E8]/90 py-1.5 px-4 text-xs font-['DM_Sans']">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <a
              href="mailto:info@artisancoach.org"
              className="hover:text-[#B89555] transition-colors flex items-center gap-1.5 text-[#F7F2E8]/85"
            >
              <Mail className="w-3.5 h-3.5 text-[#B89555]" />
              <span className="hidden sm:inline">info@artisancoach.org</span>
              <span className="sm:hidden">Email</span>
            </a>
            <a
              href="tel:+919061621111"
              className="flex items-center gap-1.5 hover:text-[#B89555] transition-colors text-[#F7F2E8]/85"
            >
              <Phone className="w-3.5 h-3.5 text-[#B89555]" />
              <span className="font-number font-medium text-[#F7F2E8]">+91 90616 21111</span>
            </a>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B89555] animate-pulse" />
            <span className="text-[11px] sm:text-xs text-[#F7F2E8]/90 font-normal">
              Admissions Open for 2026 Heritage Creator Cohorts
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar in Light Palette Color (#F7F2E8) */}
      <nav
        className={`transition-colors duration-200 ${
          isScrolled
            ? 'bg-[#F7F2E8] border-b border-[#6B4030]/20 py-2.5 shadow-md'
            : 'bg-[#F7F2E8]/95 backdrop-blur-sm border-b border-[#6B4030]/15 py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo with Title Case Text */}
            <Link to="/" className="group flex items-center gap-3">
              <img
                src="/artisan/logo.png"
                alt="Global Nagas Institute logo"
                className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
              />
              <div className="flex flex-col justify-center">
                <div className="flex items-center">
                  <span className="font-['Cormorant_Garamond'] text-xl sm:text-2xl font-bold tracking-wide text-[#241A16] group-hover:text-[#6B4030] transition-colors leading-none">
                    Global Nagas Institute
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="h-px w-2.5 bg-[#B89555]" />
                  <span className="font-['DM_Sans'] text-[11px] text-[#6B4030] font-medium">
                    Heritage Framework & Repository
                  </span>
                  <span className="h-px w-2.5 bg-[#B89555]" />
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

            {/* Mobile Menu Toggle Button */}
            <div className="flex sm:hidden items-center gap-2">
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20]"
              >
                Register
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-[#241A16] hover:text-[#B89555] transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-[#F7F2E8] border-b border-[#6B4030]/20 px-6 py-4 space-y-3">
            <div className="flex flex-col space-y-2">
              {navLinks.map((item) => {
                const isSpecial = item.label.toLowerCase().includes('learning journey');

                if (isSpecial) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href)}
                      className="font-['DM_Sans'] text-xs font-bold py-1.5 cursor-pointer border-b border-[#6B4030]/10 flex items-center gap-2 animate-text-glow"
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
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-['DM_Sans'] text-xs text-[#B89555] font-semibold py-1.5 border-b border-[#6B4030]/10"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="font-['DM_Sans'] text-xs text-[#241A16] hover:text-[#B89555] py-1.5 cursor-pointer border-b border-[#6B4030]/10"
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full font-['DM_Sans'] text-xs font-semibold text-[#F7F2E8] bg-[#4A2C20]"
              >
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
