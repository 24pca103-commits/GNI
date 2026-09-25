import React from 'react';

export default function FloatingBubbles({ count = 8, className = '' }) {
  // Array of predefined subtle floating bubbles
  const bubbles = [
    { size: 40, left: '8%', delay: '0s', duration: '9s', opacity: 0.18 },
    { size: 65, left: '22%', delay: '2s', duration: '12s', opacity: 0.12 },
    { size: 28, left: '38%', delay: '4s', duration: '8s', opacity: 0.2 },
    { size: 85, left: '55%', delay: '1s', duration: '15s', opacity: 0.08 },
    { size: 36, left: '72%', delay: '3s', duration: '10s', opacity: 0.15 },
    { size: 55, left: '88%', delay: '5s', duration: '13s', opacity: 0.12 },
    { size: 30, left: '15%', delay: '6s', duration: '7s', opacity: 0.22 },
    { size: 70, left: '80%', delay: '2.5s', duration: '14s', opacity: 0.1 },
  ].slice(0, count);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      <style>{`
        @keyframes gentleBubbleFloat {
          0% {
            transform: translateY(110%) translateX(0px) scale(0.9);
            opacity: 0;
          }
          20% {
            opacity: var(--bubble-opacity);
            transform: translateY(80%) translateX(8px) scale(1);
          }
          50% {
            transform: translateY(45%) translateX(-12px) scale(1.05);
          }
          80% {
            opacity: var(--bubble-opacity);
            transform: translateY(15%) translateX(10px) scale(1);
          }
          100% {
            transform: translateY(-20%) translateX(0px) scale(0.95);
            opacity: 0;
          }
        }
        .gentle-bubble {
          animation: gentleBubbleFloat var(--bubble-duration) ease-in-out infinite;
          animation-delay: var(--bubble-delay);
        }
      `}</style>

      {bubbles.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#B89555] gentle-bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: b.left,
            bottom: '-40px',
            '--bubble-opacity': b.opacity,
            '--bubble-duration': b.duration,
            '--bubble-delay': b.delay,
            border: '1px solid rgba(184, 149, 85, 0.25)',
          }}
        />
      ))}
    </div>
  );
}
