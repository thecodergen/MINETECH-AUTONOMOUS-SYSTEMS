'use client';

import {
  BrainCircuit,
  Cable,
  Cloud,
  Cpu,
  Gauge,
  Map,
  Radar,
  Route,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

const technologies = [
  {
    name: "Neural AI Engine",
    icon: BrainCircuit,
    desc: "Predictive load-balancing models dispatching autonomous fleets with sub-second recalculation.",
    tag: "EDGE AI",
    color: "#ffb35c",
  },
  {
    name: "Subsurface IoT Mesh",
    icon: Cpu,
    desc: "Ruggedized LoRaWAN and 5G sensor nodes capturing gas, temperature, and micro-seismic shifts.",
    tag: "TELEMETRY",
    color: "#6ce1ff",
  },
  {
    name: "LiDAR & Computer Vision",
    icon: Radar,
    desc: "Continuous 3D spatial scanning creating millimeter-accurate point clouds of active pit benches.",
    tag: "SPATIAL",
    color: "#a4f39b",
  },
  {
    name: "Geospatial Digital Twin",
    icon: Map,
    desc: "Living virtual quarry synchronized with real-time ore grades, equipment vectors, and water levels.",
    tag: "SIMULATION",
    color: "#ffc978",
  },
  {
    name: "Autonomous Haul Fleet",
    icon: Route,
    desc: "Driverless 360-tonne haul trucks and electric shovels operating 24/7 without fatigue.",
    tag: "ROBOTICS",
    color: "#6ce1ff",
  },
  {
    name: "Predictive SCADA",
    icon: Gauge,
    desc: "Continuous vibration and fluid spectrometry preventing catastrophic crusher and engine failure.",
    tag: "DIAGNOSTICS",
    color: "#ffb35c",
  },
  {
    name: "Fiber Strata Backhaul",
    icon: Cable,
    desc: "Ultra-low latency subterranean backhaul linking deep drifts to surface control rooms.",
    tag: "CONNECTIVITY",
    color: "#a4f39b",
  },
  {
    name: "Autonomous Cloud Core",
    icon: Cloud,
    desc: "ISO 27001 encrypted industrial data warehouse with real-time ESG carbon reporting.",
    tag: "ENTERPRISE",
    color: "#ffc978",
  },
];

export default function TechnologySection() {
  return (
    <section id="technology" className="relative scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#6ce1ff]">
            <Zap size={13} /> TECHNOLOGY STACK
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Engineered for Extreme Geology
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Eight interconnected technology pillars powering high-yield, zero-harm autonomous mining operations.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {technologies.map(({ name, icon: Icon, desc, tag, color }) => (
            <motion.div
              key={name}
              whileHover={{ y: -8, scale: 1.02 }}
              className="tech-card glass-panel group relative overflow-hidden rounded-[28px] p-6 transition-all"
            >
              <div
                className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl transition group-hover:opacity-40"
                style={{ background: color }}
              />

              <div className="flex items-center justify-between">
                <div
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border"
                  style={{ borderColor: `${color}40`, background: `${color}15`, color }}
                >
                  <Icon size={22} />
                </div>
                <span
                  className="rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ borderColor: `${color}30`, color }}
                >
                  {tag}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold text-white transition group-hover:text-[#ffb35c]">
                {name}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
