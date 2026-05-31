'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HeroHighlight } from '@/components/ui/HeroHighlight';

export function CTASection() {
  return (
    <section className="px-6 py-24 md:py-32">
      <HeroHighlight className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 px-6 py-20 shadow-2xl shadow-sky-950/30 backdrop-blur-xl md:px-10">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-sm text-amber-200">
              <Sparkles className="h-4 w-4" />
              Ready for deployment
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Ready to make roads safer?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-400">
              Open the dashboard to inspect live detections, track danger zones, and review the latest risk maps.
            </p>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-10">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-sky-500/25 transition hover:from-sky-400 hover:to-cyan-400"
              >
                Get started now
                <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </HeroHighlight>
    </section>
  );
}