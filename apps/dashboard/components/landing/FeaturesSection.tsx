'use client';

import { motion } from 'framer-motion';
import { Activity, BarChart3, MapPin, Smartphone } from 'lucide-react';
import { CardSpotlight } from '@/components/ui/CardSpotlight';

const features = [
  {
    icon: Smartphone,
    title: 'Mobile AI Dashcam',
    description: 'On-device TFLite inference detects stray animals in real time using the phone camera.',
  },
  {
    icon: MapPin,
    title: 'Danger Zones',
    description: 'DBSCAN clustering turns detection density into dynamic geofenced risk zones.',
  },
  {
    icon: Activity,
    title: 'Speed Advisory',
    description: 'ISA guidance recommends safer speeds when a driver enters a high-risk corridor.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Heatmaps, trends, and zone analytics for NGOs, researchers, and authorities.',
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 md:py-32">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-3xl text-center"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-sky-300/80">
            Core product
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            One platform for detection, risk mapping, and advisory.
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-400">
            A compact but complete prototype that connects the dashcam, cloud engine, and dashboard.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
            >
              <CardSpotlight className="h-full">
                <div className="flex h-full flex-col p-6">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-lg shadow-sky-500/20">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="mt-3 flex-1 leading-7 text-slate-400">{feature.description}</p>
                  <div className="mt-6 text-sm font-medium text-sky-300">Learn more</div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}