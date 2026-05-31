'use client';

import { motion } from 'framer-motion';

export function BackgroundBeams({ className = '' }: { className?: string }) {
  const beams = Array.from({ length: 10 });

  return (
    <div className={`pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.16),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,0.08),transparent_30%)]" />
      {beams.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.08, x: '-120%' }}
          animate={{ opacity: [0.05, 0.22, 0.05], x: ['-120%', '220%'] }}
          transition={{ duration: 10 + index, repeat: Infinity, ease: 'linear', delay: index * 0.4 }}
          className="absolute top-0 h-full w-1 bg-gradient-to-b from-transparent via-sky-500/40 to-transparent blur-[1px]"
          style={{ left: `${index * 11}%` }}
        />
      ))}
    </div>
  );
}