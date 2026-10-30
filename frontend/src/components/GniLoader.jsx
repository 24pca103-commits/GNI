import React from 'react';

/**
 * Universal GNI Brand Loading Component
 * Replaces generic loaders across the entire site with the signature
 * Global Nagas Institute circular loop font animation + center emblem + golden pulsing dots.
 *
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl'} size - Size preset
 * @param {boolean} fullScreen - Cover entire viewport
 * @param {boolean} overlay - Semi-transparent blur overlay
 * @param {string | null} text - Optional status text
 * @param {string} className - Optional container classes
 */
export default function GniLoader({
  size = 'md',
  fullScreen = false,
  overlay = false,
  text = null,
  className = '',
}) {
  const configs = {
    xs: {
      container: 'w-7 h-7',
      svgView: '0 0 100 100',
      r: 45,
      strokeWidth: 2,
      dots: 'hidden', // compact for button interiors
      spacing: 'space-y-0',
    },
    sm: {
      container: 'w-16 h-16 sm:w-20 sm:h-20',
      svgView: '0 0 100 100',
      r: 46,
      strokeWidth: 1.5,
      dots: 'flex items-center gap-1.5 pt-1',
      dotSize: 'w-1.5 h-1.5',
      spacing: 'space-y-2',
    },
    md: {
      container: 'w-28 h-28 sm:w-32 sm:h-32',
      svgView: '0 0 200 200',
      r: 94,
      strokeWidth: 2,
      dots: 'flex items-center gap-2 pt-1.5',
      dotSize: 'w-2 h-2',
      spacing: 'space-y-3.5',
    },
    lg: {
      container: 'w-36 h-36 sm:w-44 sm:h-44',
      svgView: '0 0 200 200',
      r: 94,
      strokeWidth: 2.2,
      dots: 'flex items-center gap-2.5 pt-2',
      dotSize: 'w-2.5 h-2.5',
      spacing: 'space-y-4',
    },
    xl: {
      container: 'w-48 h-48 sm:w-56 sm:h-56 md:w-60 md:h-60',
      svgView: '0 0 200 200',
      r: 94,
      strokeWidth: 2.2,
      dots: 'flex items-center gap-2.5 pt-2',
      dotSize: 'w-2.5 h-2.5',
      spacing: 'space-y-6',
    },
  };

  const cfg = configs[size] || configs.md;

  const content = (
    <div className={`flex flex-col items-center justify-center select-none ${cfg.spacing} ${className}`}>
      {/* Animated Circular Stage (strictly no container box or card border) */}
      <div className={`relative ${cfg.container} flex items-center justify-center shrink-0`}>
        {/* Subtle decorative golden circular roundup halo behind the font */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={cfg.svgView}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={size === 'xs' || size === 'sm' ? '50' : '100'}
            cy={size === 'xs' || size === 'sm' ? '50' : '100'}
            r={cfg.r}
            stroke="#B89555"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
          <circle
            cx={size === 'xs' || size === 'sm' ? '50' : '100'}
            cy={size === 'xs' || size === 'sm' ? '50' : '100'}
            r={cfg.r}
            stroke="#B89555"
            strokeOpacity="0.32"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="gni-accent-spin"
          />
          <circle
            cx={size === 'xs' || size === 'sm' ? '50' : '100'}
            cy={size === 'xs' || size === 'sm' ? '50' : '100'}
            r={cfg.r}
            stroke="#B89555"
            strokeWidth={cfg.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={size === 'xs' || size === 'sm' ? '290' : '590'}
            strokeDashoffset={size === 'xs' || size === 'sm' ? '290' : '590'}
            className="gni-roundup-stroke"
          />
        </svg>

        {/* Authentic Circular "GLOBAL NAGAS INSTITUTE" Font from Logo - Rotating in Continuous Loop */}
        <img
          src="/artisan/logo-ring.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none gni-font-loop"
          draggable="false"
        />

        {/* Central "GNI" Monogram Emblem - Stationary with Subtle Golden Breathing Aura */}
        <img
          src="/artisan/logo-center.png"
          alt="Global Nagas Institute"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none gni-center-pulse"
          draggable="false"
        />
      </div>

      {/* 3 Golden Loading Dots */}
      {cfg.dots !== 'hidden' && (
        <div className={cfg.dots} aria-hidden="true">
          <span className={`rounded-full bg-[#B89555] gni-dot-1 shrink-0 ${cfg.dotSize}`} />
          <span className={`rounded-full bg-[#B89555] gni-dot-2 shrink-0 ${cfg.dotSize}`} />
          <span className={`rounded-full bg-[#B89555] gni-dot-3 shrink-0 ${cfg.dotSize}`} />
        </div>
      )}

      {/* Optional Status Text (if provided) */}
      {text && (
        <p className="font-['DM_Sans'] text-xs sm:text-sm text-[#4A2C20] font-medium text-center pt-1 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-label="Loading Global Nagas Institute"
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#FAF7F0] select-none"
      >
        <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-[#B89555]/12 blur-3xl pointer-events-none -z-10" />
        {content}
      </div>
    );
  }

  if (overlay) {
    return (
      <div
        role="status"
        aria-label="Loading Global Nagas Institute"
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F0]/90 backdrop-blur-sm select-none p-4"
      >
        <div className="absolute w-72 h-72 rounded-full bg-[#B89555]/15 blur-3xl pointer-events-none -z-10" />
        {content}
      </div>
    );
  }

  return content;
}
