'use client';

export function LandingBackgroundVideo() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-35"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="/landing-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.24),transparent_45%),linear-gradient(180deg,rgba(2,6,23,0.1)_0%,rgba(2,6,23,0.65)_100%)]" />
    </div>
  );
}