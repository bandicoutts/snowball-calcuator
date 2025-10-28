'use client';

export function GradientField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large radial gradient spot */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-30 animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(124,92,255,0.4) 0%, transparent 70%)',
        }}
      />

      {/* Secondary gradient spot */}
      <div
        className="absolute top-1/3 right-1/4 w-[600px] h-[600px] opacity-20 animate-glow-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(155,140,255,0.3) 0%, transparent 70%)',
          animationDelay: '2s',
        }}
      />

      {/* Conic gradient streaks */}
      <div
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] opacity-10"
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(124,92,255,0.3) 0deg, transparent 60deg, transparent 300deg, rgba(124,92,255,0.3) 360deg)',
          filter: 'blur(40px)',
        }}
      />
    </div>
  );
}
