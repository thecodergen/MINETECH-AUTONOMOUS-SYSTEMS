'use client';

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Layers, Radio, Sparkles, SlidersHorizontal } from "lucide-react";

export default function DigitalTwinSection() {
  const [digital, setDigital] = useState(true);

  return (
    <section id="digital-twin" className="relative scroll-mt-24 px-5 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#6ce1ff]">
              <Layers size={13} /> GEOSPATIAL TELEMETRY
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
              One Mine. One Living Digital Twin.
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[#0a1017] p-1.5 shadow-lg">
            <button
              type="button"
              onClick={() => setDigital(false)}
              className={`rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-all ${
                !digital
                  ? "bg-[#ffb35c] text-black shadow-[0_0_20px_rgba(255,179,92,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Physical Pit
            </button>
            <button
              type="button"
              onClick={() => setDigital(true)}
              className={`rounded-full px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.22em] transition-all ${
                digital
                  ? "bg-[#6ce1ff] text-black shadow-[0_0_20px_rgba(108,225,255,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Digital Twin AI
            </button>
          </div>
        </div>

        {/* Dynamic Digital Twin Split Comparison */}
        <div className="group relative overflow-hidden rounded-[32px] border border-white/15 bg-[#050d12] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.7)]">
          <div className="relative h-[520px] w-full overflow-hidden rounded-[26px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={digital ? "digital" : "physical"}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={digital ? "/images/digital_twin_mine.jpg" : "/images/hero_open_pit.jpg"}
                  alt={digital ? "Digital Twin Mine" : "Physical Mine Pit"}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 90vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-transparent to-black/30" />
              </motion.div>
            </AnimatePresence>

            {/* Top Telemetry Header */}
            <div className="absolute left-5 right-5 top-5 z-20 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 rounded-full border border-white/20 bg-black/70 px-4 py-2 backdrop-blur-md">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    digital ? "bg-[#6ce1ff] shadow-[0_0_12px_#6ce1ff]" : "bg-[#ffb35c] shadow-[0_0_12px_#ffb35c]"
                  }`}
                />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {digital ? "REAL-TIME DIGITAL TWIN v4.2" : "OPTICAL PIT CAPTURE (GOLDEN HOUR)"}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[10px] text-white">
                <span className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                  LiDAR: 4.8M PTS/SEC
                </span>
                <span className="rounded-lg border border-white/10 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                  LATENCY: 12ms
                </span>
              </div>
            </div>

            {/* Bottom Real-time Telemetry Overlay Grid */}
            <div className="absolute bottom-5 left-5 right-5 z-20 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "SURFACE TOPOGRAPHY", val: "± 2.4cm RTK", status: "SYNCED" },
                { label: "HAUL FLEET TRACKING", val: "48 / 48 ACTIVE", status: "ONLINE" },
                { label: "CRUSHER THROUGHPUT", val: "14,250 T/H", status: "OPTIMAL" },
                { label: "GEO-HAZARD RISK", val: "0.02 (LOW)", status: "SECURE" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/15 bg-black/75 p-3.5 backdrop-blur-md"
                >
                  <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-white">
                    {item.val}
                  </p>
                  <span className="mt-1 inline-block text-[8px] font-bold uppercase tracking-wider text-[#6ce1ff]">
                    ● {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
