'use client';

import { useRef, useState } from 'react';

export function CardSpotlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={(event) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      className={`group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/70 shadow-xl shadow-slate-950/30 backdrop-blur-sm ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(360px circle at ${position.x}px ${position.y}px, rgba(14,165,233,0.14), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}