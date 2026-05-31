'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const stats = [
  { value: 4821, label: 'Total detections', suffix: '' },
  { value: 8, label: 'Active danger zones', suffix: '' },
  { value: 72, label: 'Detection accuracy', suffix: '%' },
  { value: 36, label: 'Avg. speed reduction', suffix: '%' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate(motionValue, value, { duration: 1.8, ease: 'easeOut' });
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated, motionValue, value]);

  return (
    <div ref={ref} className="flex items-baseline justify-center gap-1 text-4xl font-semibold md:text-5xl">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </div>
  );
}

export function StatsSection() {
  return (
    <section id="stats" className="relative overflow-hidden px-6 py-24">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-emerald-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.12),transparent_60%)]" />

      <div className="container relative">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-sky-950/20 backdrop-blur-xl"
            >
              <div className="text-sky-300">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="mt-3 text-sm uppercase tracking-[0.24em] text-slate-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}