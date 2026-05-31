import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950 px-6 py-16">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr_0.7fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="flex w-fit items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image src="/logo.png" alt="StrayGuard Logo" fill className="object-contain p-1.5" />
              </div>
              <div>
                <div className="text-lg font-bold tracking-tight text-white">StrayGuard</div>
                <div className="text-sm text-slate-400">AI Road Safety Intelligence</div>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Real-time animal detection, danger zone mapping, and intelligent speed guidance to prevent collisions on Indian highways.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:shadow-xl hover:shadow-sky-500/40"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <FooterColumn
            title="Platform"
            items={[
              ['Features', '#features'],
              ['Impact Metrics', '#impact'],
              ['Dashboard', '/login'],
            ]}
          />

          <FooterColumn
            title="Project"
            items={[
              ['Hackathon 2026', '#'],
              ['Documentation', '#'],
              ['Contact Team', 'mailto:team@strayguard.app'],
            ]}
          />

          <div className="space-y-5">
            <h3 className="text-base font-semibold text-white">Connect</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Reach out for demos, collaboration opportunities, or pilot deployment discussions.
            </p>

            <div className="flex gap-3">
              <SocialIcon href="https://github.com" icon={Github} label="GitHub" />
              <SocialIcon href="https://twitter.com" icon={Twitter} label="Twitter" />
              <SocialIcon href="https://linkedin.com" icon={Linkedin} label="LinkedIn" />
              <SocialIcon href="mailto:team@strayguard.app" icon={Mail} label="Email" />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 StrayGuard. Built for National Road Safety Hackathon 2026.</p>
          <div className="flex gap-6">
            <a href="#" className="transition hover:text-slate-300">
              Privacy Policy
            </a>
            <a href="#" className="transition hover:text-slate-300">
              Terms of Service
            </a>
            <a href="#" className="transition hover:text-slate-300">
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: Array<[string, string]> }) {
  return (
    <div className="space-y-5">
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <ul className="space-y-3">
        {items.map(([label, href]) => (
          <li key={label}>
            {href.startsWith('/') ? (
              <Link href={href} className="text-sm text-slate-400 transition hover:text-white">
                {label}
              </Link>
            ) : href.startsWith('mailto:') ? (
              <a href={href} className="text-sm text-slate-400 transition hover:text-white">
                {label}
              </a>
            ) : (
              <a href={href} className="text-sm text-slate-400 transition hover:text-white">
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialIcon({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-5 w-5" />
    </a>
  );
}
