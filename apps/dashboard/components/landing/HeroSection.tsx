'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, MapPinned, Activity, Gauge, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { HeroHighlight } from '@/components/ui/HeroHighlight';
import { Spotlight } from '@/components/ui/Spotlight';

export function HeroSection() {
  return (
    <HeroHighlight className="relative min-h-[calc(100svh-5rem)] px-6 py-6 lg:min-h-[calc(100svh-6rem)] lg:py-8">
      <Spotlight className="-top-40 left-1/2 -translate-x-1/2 md:-top-20" fill="rgba(14, 165, 233, 0.18)" />

      <div className="container relative">
        <div className="grid items-center gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6 lg:space-y-7"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/20 bg-sky-400/10 px-3.5 py-1.5 text-xs font-medium text-sky-200 backdrop-blur-sm sm:text-sm"
            >
              <ShieldCheck className="h-4 w-4" />
              National Road Safety Hackathon 2026
            </motion.div>

            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight text-white sm:text-[3.25rem] md:text-6xl xl:text-6xl">
                Protect drivers and stray animals with{' '}
                <span className="bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  real-time intelligence
                </span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
                Detect roadside animals, identify danger zones, and guide safer driving with live risk mapping built for Indian highways.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/login"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-sky-500/25 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/40 sm:text-base"
              >
                Access Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-3.5 text-sm font-medium text-slate-200 backdrop-blur-sm transition-all hover:bg-white/10 sm:text-base"
              >
                <Play className="h-5 w-5" />
                Watch Demo
              </a>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <ProofPill icon={<Activity className="h-4 w-4" />} label="Real-time detection" />
              <ProofPill icon={<MapPinned className="h-4 w-4" />} label="Live heatmaps" />
              <ProofPill icon={<Gauge className="h-4 w-4" />} label="Speed guidance" />
            </div>

            <div id="impact" className="grid grid-cols-3 gap-4 border-t border-white/10 pt-5 sm:max-w-xl">
              <HeroMetric value="4.8K+" label="Detections" />
              <HeroMetric value="8" label="Active Zones" />
              <HeroMetric value="36%" label="Speed ↓" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
            className="relative mx-auto w-full max-w-[32rem] lg:ml-auto"
          >
            <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-r from-sky-500/20 via-cyan-500/10 to-blue-500/20 blur-3xl" />

            <div className="relative aspect-[16/10] overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-900/80 p-2.5 shadow-2xl backdrop-blur-sm lg:aspect-[15/10]">
              <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950">
                <video
                  className="absolute inset-0 h-full w-full object-cover opacity-75"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                >
                  <source src="/landing-bg.mp4" type="video/mp4" />
                </video>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/20" />

                <div className="absolute right-3 top-3 rounded-2xl border border-white/10 bg-slate-950/80 px-3.5 py-2.5 text-right backdrop-blur-xl">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Corridor View</p>
                  <p className="mt-1 text-sm font-semibold text-white">Heatmap · Zones · Speed Advisory</p>
                </div>

                <div className="absolute bottom-3 left-3 right-3 grid grid-cols-3 gap-2.5">
                  <OverlayStat label="Zones" value="8" />
                  <OverlayStat label="Risk" value="High" />
                  <OverlayStat label="Animal" value="Cattle" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </HeroHighlight>
  );
}

function ProofPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-sm font-medium text-slate-300 backdrop-blur-sm transition-colors hover:bg-white/10">
      <span className="text-sky-400">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold text-white md:text-3xl">{value}</div>
      <div className="text-xs font-medium text-slate-400 sm:text-sm">{label}</div>
    </div>
  );
}

function OverlayStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/80 px-2.5 py-2 backdrop-blur-xl">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="mt-1 text-xs font-bold text-white sm:text-sm">{value}</div>
    </div>
  );
}
