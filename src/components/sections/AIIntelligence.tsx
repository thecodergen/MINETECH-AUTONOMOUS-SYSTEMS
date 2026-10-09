'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { Cpu, Network, Sparkles, TrendingUp, Zap } from "lucide-react";

const capabilities = [
  {
    name: "Predictive Maintenance",
    detail: "Real-time thermal & vibration sensor analysis detects component wear 120 hours before mechanical failure.",
    stat: "99.4% Accuracy",
  },
  {
    name: "Autonomous Fleet Dispatch",
    detail: "Dynamic speed & route modulation minimizes haul cycle queuing and eliminates fuel waste on pit ramps.",
    stat: "+22% Throughput",
  },
  {
    name: "Ore Grade Optimization",
    detail: "Hyperspectral camera data syncs directly with crusher feeds to maximize mineral extraction recovery.",
    stat: "0.4% Yield Lift",
  },
  {
    name: "Subsurface Hazard AI",
    detail: "Micro-seismic radar arrays predict rock wall instability and geotechnical displacement in real time.",
    stat: "Zero High-P Incident",
  },
];

export default function AIIntelligence() {
  return (
    <section id="ai" className="relative scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#6ce1ff]">
            <Network size={13} /> NEURAL INFRASTRUCTURE
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Intelligence Orchestrating Every Tonne
          </h2>
          <p className="mt-3 text-base text-slate-300">
            A unified neural telemetry cloud continuously links every excavator bucket, autonomous hauler, and processing plant.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          {/* Photorealistic AI Visualization Centerpiece */}
          <div className="group relative overflow-hidden rounded-[32px] border border-white/15 bg-[#080d14] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <div className="relative h-[480px] w-full overflow-hidden rounded-[24px]">
              <Image
                src="/images/ai_intelligence.jpg"
                alt="AI Mining Network Visualization"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-transparent to-black/20" />

              {/* Real-time AI Node Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/15 bg-black/70 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6ce1ff] opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6ce1ff]" />
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    AI DISPATCH ENGINE v3.8 · 4,200 EVENTS/SEC
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-[#6ce1ff]">
                  LATENCY 8ms
                </span>
              </div>
            </div>
          </div>

          {/* AI Capability Matrix */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {capabilities.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ y: -3 }}
                className="rounded-[24px] border border-white/10 bg-[#070c12]/90 p-5 backdrop-blur-md transition-all hover:border-[#6ce1ff]/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {item.name}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#6ce1ff]">
                    {item.stat}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
