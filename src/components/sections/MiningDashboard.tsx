'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, BatteryCharging, Gauge, Radio, ShieldCheck, Zap, RefreshCw } from "lucide-react";

const initialMetrics = [
  { label: "EXTRACTION RATE", value: 94.2, unit: "%", tone: "#ffb35c" },
  { label: "AUTONOMOUS UNITS", value: 48, unit: "/ 48", tone: "#6ce1ff" },
  { label: "FUEL RECOVERY", value: 91.8, unit: "%", tone: "#a4f39b" },
  { label: "ZERO-HARM SCORE", value: 99.98, unit: "%", tone: "#ffc978" },
];

const liveZones = [
  { name: "North Pit Tier 14", throughput: "4,200 T/h", haulers: 16, grade: "1.42% Cu", status: "Active" },
  { name: "South Stope Drift B", throughput: "2,850 T/h", haulers: 12, grade: "2.18 g/t Au", status: "Active" },
  { name: "Primary Jaw Crusher #1", throughput: "7,100 T/h", haulers: 20, grade: "Continuous", status: "Optimal" },
];

export default function MiningDashboard() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [activeZone, setActiveZone] = useState(0);

  // Live micro-telemetry updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((m, idx) => {
          if (idx === 0) {
            const val = Number((93.5 + Math.random() * 2).toFixed(1));
            return { ...m, value: val };
          }
          if (idx === 2) {
            const val = Number((90.5 + Math.random() * 2.5).toFixed(1));
            return { ...m, value: val };
          }
          return m;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="dashboard" className="relative px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-gradient-to-b from-[#091018] to-[#04070a] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.5)] sm:p-8 lg:p-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#6ce1ff]">
              <Radio size={13} className="animate-pulse" /> LIVE MINE SCADA TELEMETRY
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
              Real-Time Extraction & Fleet Intelligence
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> ALL NODES SYNCHRONIZED
            </span>
          </div>
        </div>

        {/* Live Metric Tiles */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -4 }}
              className="rounded-[26px] border border-white/10 bg-[#050b12]/90 p-5 shadow-lg backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">{item.label}</p>
                <Activity size={14} style={{ color: item.tone }} />
              </div>
              <p className="mt-4 font-mono text-3xl font-black text-white" style={{ color: item.tone }}>
                {item.value} <span className="text-sm font-normal text-slate-400">{item.unit}</span>
              </p>
              <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, item.value)}%`, background: item.tone }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Active Extraction Sectors */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {liveZones.map((zone, idx) => {
            const isSelected = idx === activeZone;
            return (
              <div
                key={zone.name}
                onClick={() => setActiveZone(idx)}
                className={`cursor-pointer rounded-[26px] border p-5 transition-all ${
                  isSelected
                    ? "border-[#ffb35c] bg-[#ffb35c]/10 shadow-[0_0_30px_rgba(255,179,92,0.2)]"
                    : "border-white/10 bg-[#060b10] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-white">{zone.name}</p>
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                    {zone.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 text-center">
                  <div>
                    <p className="text-[9px] text-slate-400">Rate</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#6ce1ff]">{zone.throughput}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400">Haulers</p>
                    <p className="mt-1 font-mono text-xs font-bold text-white">{zone.haulers}</p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400">Grade</p>
                    <p className="mt-1 font-mono text-xs font-bold text-[#ffb35c]">{zone.grade}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
