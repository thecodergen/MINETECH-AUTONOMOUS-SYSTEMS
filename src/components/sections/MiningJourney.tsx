'use client';

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ArrowRight, Activity, ShieldAlert, Cpu } from "lucide-react";

const journeyStages = [
  {
    number: "01",
    title: "SURFACE OPERATIONS",
    subtitle: "High-Volume Open-Pit Extraction",
    description: "Massive terraced benches operating around the clock with autonomous ultra-class haulers and electric hydraulic excavators.",
    accent: "#ffb35c",
    image: "/images/hero_open_pit.jpg",
    metrics: [
      { label: "DAILY EXTRACTION", value: "320,000 T" },
      { label: "FLEET UTILIZATION", value: "96.4%" },
      { label: "CYCLE EFFICIENCY", value: "+18.2%" },
    ],
  },
  {
    number: "02",
    title: "UNDERGROUND INTELLIGENCE",
    subtitle: "Deep Subterranean Connectivity",
    description: "Connected infrastructure, rugged IoT gas sensors, and automated low-profile loaders operating 1,200m below the surface.",
    accent: "#6ce1ff",
    image: "/images/underground_tunnel.jpg",
    metrics: [
      { label: "SUBTERRANEAN DEPTH", value: "-1,250m" },
      { label: "IoT SENSOR NODES", value: "1,420 LIVE" },
      { label: "AIR QUALITY INDEX", value: "99.2%" },
    ],
  },
  {
    number: "03",
    title: "THE SMART MINE & AI",
    subtitle: "Autonomous Ecosystem Orchestration",
    description: "Neural network telemetry synthesizing rock hardness, truck speeds, crusher intake, and predictive maintenance in real time.",
    accent: "#a4f39b",
    image: "/images/ai_intelligence.jpg",
    metrics: [
      { label: "AI DISPATCH ACCURACY", value: "99.8%" },
      { label: "UNSCHEDULED DOWNTIME", value: "-44%" },
      { label: "CARBON INTENSITY", value: "-22.6%" },
    ],
  },
];

export default function MiningJourney() {
  const [activeStage, setActiveStage] = useState(0);
  const current = journeyStages[activeStage];

  return (
    <section id="journey" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#ffb35c]">
              01 / OPERATIONAL ARCHITECTURE
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">
              The Mine in Full Motion
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-300">
            From the open-pit rim to deep subterranean drifts, every extraction tier is connected to a singular AI operating model.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Photorealistic Stage Showcase */}
          <div className="group relative overflow-hidden rounded-[32px] border border-white/15 bg-[#060a0f] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.5)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.number}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5 }}
                className="relative h-[480px] w-full overflow-hidden rounded-[24px]"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 60vw"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-black/30 to-transparent" />

                {/* Stage Header Badge */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 backdrop-blur-md">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: current.accent, boxShadow: `0 0 12px ${current.accent}` }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                    STAGE {current.number} · {current.subtitle}
                  </span>
                </div>

                {/* Bottom Overlay Metrics */}
                <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-black/70 p-3.5 backdrop-blur-md">
                  {current.metrics.map((m) => (
                    <div key={m.label} className="text-center">
                      <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                        {m.label}
                      </p>
                      <p className="mt-1 font-mono text-base font-black text-white sm:text-lg" style={{ color: current.accent }}>
                        {m.value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Stage Selection Cards */}
          <div className="flex flex-col justify-between space-y-4">
            {journeyStages.map((stage, idx) => {
              const isActive = idx === activeStage;
              return (
                <div
                  key={stage.title}
                  onClick={() => setActiveStage(idx)}
                  className={`cursor-pointer rounded-[26px] border p-6 transition-all duration-300 ${
                    isActive
                      ? "border-[#ffb35c]/60 bg-gradient-to-r from-[#0d1722] to-[#070b10] shadow-[0_10px_40px_rgba(255,179,92,0.15)]"
                      : "border-white/10 bg-[#060a0f]/80 hover:border-white/25 hover:bg-[#0a1017]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      {stage.number} / 03
                    </span>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: stage.accent }}
                    />
                  </div>

                  <h3 className="mt-3 text-xl font-bold tracking-tight text-white">
                    {stage.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {stage.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
