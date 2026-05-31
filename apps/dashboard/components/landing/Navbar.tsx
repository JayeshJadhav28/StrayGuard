'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-slate-950/90 shadow-lg shadow-black/5 backdrop-blur-2xl'
          : 'bg-transparent'
      }`}
    >
      <nav className="container flex h-20 items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-transform group-hover:scale-105">
            <Image src="/logo.png" alt="StrayGuard Logo" fill className="object-contain p-1" priority />
          </div>

          <div className="min-w-0">
            <div className="text-base font-semibold tracking-tight text-white">StrayGuard</div>
            <div className="text-xs text-slate-400">AI Road Safety Intelligence</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Features
          </a>
          <a href="#impact" className="text-sm font-medium text-slate-300 transition hover:text-white">
            Impact
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200 lg:inline-flex">
            <ShieldCheck className="h-3.5 w-3.5" />
            Hackathon 2026
          </div>

          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-500/40"
          >
            Dashboard
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="container flex flex-col gap-2 px-6 py-4">
              <a
                href="#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Features
              </a>
              <a
                href="#impact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Impact
              </a>

              <div className="my-2 border-t border-white/10" />

              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25"
              >
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
