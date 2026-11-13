import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUp, Phone, GraduationCap } from 'lucide-react';

export default function FloatingWidget() {
  // Shown only once the visitor reaches the bottom of the site (the footer is on screen),
  // so the buttons never sit on top of page content while reading.
  const [atBottom, setAtBottom] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      const footer = document.querySelector('footer');
      const reached = footer
        ? footer.getBoundingClientRect().top < window.innerHeight
        : window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 120;
      setAtBottom(reached);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  // Hide widget completely on Admin dashboard and Register page (Requirement 4)
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/register')) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const whatsappMessage = encodeURIComponent(
    'Hello Global Nagas Institute, I am interested in your heritage programs, workshops and admissions.'
  );
  const whatsappUrl = `https://wa.me/919514334698?text=${whatsappMessage}`;

  return (
    <aside
      aria-label="Quick actions and contact options"
      aria-hidden={!atBottom}
      className={`fixed right-4 bottom-[84px] sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 print:hidden transition-all duration-300 ease-out ${
        atBottom ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none invisible'
      }`}
    >
      {/* Scroll to Top Action Button (Icon Only - Requirement 1) */}
      {atBottom && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          title="Back to Top"
          className="w-11 h-11 rounded-full bg-white/95 hover:bg-[#FAF7F0] text-[#4A2C20] border border-[#6B4030]/25 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer backdrop-blur-xs group"
        >
          <ArrowUp className="w-5 h-5 text-[#6B4030] group-hover:text-[#B89555] transition-colors" />
        </button>
      )}

      {/* Quick Direct Call Button (Icon Only - Requirement 1) */}
      <a
        href="tel:+919514334698"
        aria-label="Call Admissions Desk: +91 95143 34698"
        title="Call Admissions (+91 95143 34698)"
        className="w-11 h-11 rounded-full bg-white/95 hover:bg-[#FAF7F0] text-[#4A2C20] border border-[#6B4030]/25 shadow-md hover:shadow-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer backdrop-blur-xs group"
      >
        <Phone className="w-5 h-5 text-[#6B4030] group-hover:text-[#4A2C20] transition-colors" />
      </a>

      {/* WhatsApp Instant Chat Button (Icon Only - Requirement 1) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Heritage Advisor on WhatsApp"
        title="Chat on WhatsApp (+91 95143 34698)"
        className="relative group w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
      >
        {/* Subtle breathing glow ring */}
        <span className="absolute -inset-0.5 rounded-full bg-[#25D366]/40 blur-xs animate-pulse -z-10" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          className="w-5 h-5 fill-current shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.776.978-.952 1.179-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.927-2.232-.244-.587-.492-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.507s1.078 2.908 1.229 3.109c.15.2 2.122 3.24 5.141 4.543.718.31 1.279.495 1.716.634.721.229 1.377.197 1.896.119.578-.087 1.78-.727 2.031-1.429.25-.702.25-1.303.175-1.429-.075-.125-.276-.225-.577-.375zM12.04 2C6.505 2 2.02 6.48 2.02 12c0 1.98.58 3.82 1.58 5.38L2 22l4.76-1.53c1.51.92 3.28 1.45 5.28 1.45 5.535 0 10.02-4.48 10.02-10S17.575 2 12.04 2zm0 18.23c-1.74 0-3.35-.53-4.69-1.43l-.34-.23-2.82.91.93-2.73-.24-.36c-1.01-1.4-1.56-3.08-1.56-4.85 0-4.54 3.7-8.23 8.25-8.23 4.55 0 8.25 3.69 8.25 8.23 0 4.54-3.7 8.23-8.25 8.23z" />
        </svg>
      </a>

      {/* Quick Apply / Register FAB (Icon Only - Requirement 1) */}
      <Link
        to="/register"
        aria-label="Apply for GNI Heritage Programs"
        title="Apply for Heritage Programs"
        className="w-11 h-11 rounded-full bg-[#4A2C20] hover:bg-[#603929] text-[#F7F2E8] border border-[#B89555]/40 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 cursor-pointer group"
      >
        <GraduationCap className="w-5 h-5 text-[#B89555] group-hover:scale-110 transition-transform" />
      </Link>
    </aside>
  );
}
