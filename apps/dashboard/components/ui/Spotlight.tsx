'use client';

import { motion } from 'framer-motion';

export function Spotlight({
  className = '',
  fill = 'rgba(255, 255, 255, 0.35)',
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4 }}
      className={`pointer-events-none absolute h-[30rem] w-[30rem] rounded-full blur-3xl ${className}`}
      style={{ background: `radial-gradient(circle, ${fill} 0%, transparent 68%)` }}
    />
  );
}