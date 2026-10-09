'use client';

import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Wind, Thermometer, Radio, Eye } from "lucide-react";

const indicators = [
  { label: "SUBTERRANEAN AIR PURITY", value: "99.4%", icon: Wind, status: "NOMINAL" },
  { label: "TEMPERATURE GRADIENT", value: "24.8°C", icon: Thermometer, status: "CONTROLLED" },
  { label: "PERSONNEL PROXIMITY", value: "ZERO HAZARD", icon: ShieldCheck, status: "SAFE" },
  { label: "STRATA SEISMIC STABILITY", value: "0.01 mm/s", icon: Eye, status: "STABLE" },
];

export default function SafetySection() {
  return (
    <section className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-emerald-400">
            <ShieldCheck size={13} /> ZERO-HARM PLATFORM
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
            Subterranean Safety & Environmental Guardians
          </h2>
          <p className="mt-3 text-base text-slate-300">
            Automated personnel detection halos and multi-gas atmospheric monitors safeguard every level from surface portal to deep stopes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Photorealistic Subterranean Safety Visual */}
          <div className="group relative overflow-hidden rounded-[32px] border border-white/15 bg-[#05090e] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <div className="relative h-[480px] w-full overflow-hidden rounded-[24px]">
              <Image
                src="/images/underground_tunnel.jpg"
                alt="Underground Mine Safety Tunnel"
                fill
                priority
                sizes="(max-width: 1200px) 100vw, 60vw"
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-transparent to-black/30" />

              {/* Top Sensor Tag */}
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/70 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  LEVEL 14 DRIFT · LIVE GAS & STRATA MONITORING
                </span>
              </div>

              {/* Bottom Real-time Safety Badges */}
              <div className="absolute bottom-4 left-4 right-4 z-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {indicators.map((ind) => {
                  const Icon = ind.icon;
                  return (
                    <div
                      key={ind.label}
                      className="rounded-2xl border border-white/15 bg-black/80 p-3 backdrop-blur-md"
                    >
                      <div className="flex items-center justify-between text-emerald-400">
                        <Icon size={14} />
                        <span className="text-[8px] font-bold uppercase tracking-wider">
                          {ind.status}
                        </span>
                      </div>
                      <p className="mt-2 font-mono text-sm font-black text-white">
                        {ind.value}
                      </p>
                      <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-slate-400">
                        {ind.label.split(" ")[0]} {ind.label.split(" ")[1]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Safety Protocols & Compliance Cards */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-[#070c12]/90 p-6 backdrop-blur-md">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">
                Live Zone Safety Compliance
              </p>
              <div className="mt-6 space-y-5">
                {[
                  ["Autonomous Haul Road Clearance", 100],
                  ["Subterranean Ventilation Airflow", 98],
                  ["Heavy Equipment Geofencing", 99],
                  ["Emergency Evacuation Beacon Link", 100],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-300">
                      <span>{label}</span>
                      <span className="font-mono font-bold text-emerald-400">{val}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#6ce1ff]"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
