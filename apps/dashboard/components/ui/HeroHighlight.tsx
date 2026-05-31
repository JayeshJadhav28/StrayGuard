'use client';

import { ReactNode } from 'react';

export function HeroHighlight({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.18),transparent_45%),linear-gradient(180deg,rgba(2,6,23,0)_0%,rgba(2,6,23,0.12)_100%)]" />
      <div className="relative">{children}</div>
    </section>
  );
}