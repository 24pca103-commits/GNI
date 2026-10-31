import React, { useEffect, useRef, useState } from 'react';

/**
 * Reusable Scroll Reveal / Lazy Animation Component
 * Animates children into view when scrolled to by the user
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  direction = 'up', // 'up', 'down', 'left', 'right', 'zoom', 'fade'
  duration = 700,
  threshold = 0.12,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) {
            observer.unobserve(ref.current);
          }
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold]);

  const getDirectionClass = () => {
    if (isVisible) {
      return 'translate-y-0 translate-x-0 scale-100 opacity-100';
    }

    switch (direction) {
      case 'up':
        return 'translate-y-10 opacity-0';
      case 'down':
        return '-translate-y-10 opacity-0';
      case 'left':
        return 'translate-x-10 opacity-0';
      case 'right':
        return '-translate-x-10 opacity-0';
      case 'zoom':
        return 'scale-90 opacity-0';
      case 'fade':
      default:
        return 'opacity-0';
    }
  };

  return (
    <div
      ref={ref}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all ease-out transform will-change-transform ${getDirectionClass()} ${className}`}
    >
      {children}
    </div>
  );
}
