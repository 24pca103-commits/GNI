import React, { useState, useEffect } from 'react';
import GniLoader from './GniLoader';

/**
 * Preloader Component for Global Nagas Institute
 * Initial site-load preloader showcasing the authentic circular loop font animation.
 */
export default function Preloader() {
  const [isFading, setIsFading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    // Extended preloading time (~2.8s) so the circular loop font animation is clearly visible
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2800);

    // Unmount after smooth fade-out finishes (~3.5s total)
    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
    }, 3500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Loading Global Nagas Institute"
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF7F0] select-none transition-opacity duration-700 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient warm background glow aura */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#B89555]/12 blur-3xl pointer-events-none -z-10" />

      <GniLoader size="xl" />
    </div>
  );
}
