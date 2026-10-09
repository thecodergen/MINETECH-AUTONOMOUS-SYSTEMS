'use client';

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Radio } from "lucide-react";

const scenes = [
  {
    id: "open-pit",
    title: "OPEN-PIT BENCHES",
    tag: "SURFACE EXTRACTION",
    src: "/images/hero_open_pit.jpg",
    depth: "Depth: -480m",
    coords: "23°14'08\"S 68°54'21\"W",
    telemetry: "Fleet Active: 48 Units | Output: 14,200 T/h",
    status: "OPTIMAL",
  },
  {
    id: "haul-truck",
    title: "ULTRA-CLASS HAULER",
    tag: "CAT 797F AUTONOMOUS",
    src: "/images/mining_haul_truck.jpg",
    depth: "Elevation: +1,240m",
    coords: "Sector 4 — Ramp B7",
    telemetry: "Payload: 360 Tonnes | Grade: 11.4%",
    status: "IN TRANSIT",
  },
  {
    id: "digital-twin",
    title: "DIGITAL TWIN MESH",
    tag: "AI TELEMETRY OVERLAY",
    src: "/images/digital_twin_mine.jpg",
    depth: "Resolution: 2.4cm / pt",
    coords: "Pit Geospatial Sync",
    telemetry: "LiDAR Point Cloud: 4.8M pts/sec",
    status: "LIVE SYNC",
  },
  {
    id: "tunnel",
    title: "DEEP TUNNEL DRIFT",
    tag: "SUBTERRANEAN ACCESS",
    src: "/images/underground_tunnel.jpg",
    depth: "Sub-surface: -1,150m",
    coords: "Level 14 — Crosscut West",
    telemetry: "Ventilation: 420 m³/s | Air Quality: 99.4%",
    status: "MONITORED",
  },
];

export default function MiningScene() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const current = scenes[activeIdx];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-[540px] w-full overflow-hidden rounded-[30px] border border-white/15 bg-[#05080c] shadow-[0_25px_90px_rgba(0,0,0,0.7)]"
    >
      {/* Dynamic Background Image with Smooth Parallax */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: mousePos.x * 0.7,
            y: mousePos.y * 0.7,
          }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 55vw"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {/* Cinematic Vignette & Dynamic Lighting Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-black/20 to-transparent opacity-85" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,179,92,0.18),transparent_55%)]" />
        </motion.div>
      </AnimatePresence>

      {/* LiDAR Scanning Line Effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 animate-[pulse_4s_infinite] bg-gradient-to-b from-transparent via-[#6ce1ff]/15 to-transparent blur-sm" />

      {/* Top Telemetry Bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ffb35c] opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#ffb35c]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-white">
            {current.tag}
          </span>
        </div>

        <div className="hidden items-center gap-4 text-[10px] font-medium tracking-[0.2em] text-slate-300 sm:flex">
          <span className="flex items-center gap-1.5 text-[#6ce1ff]">
            <Radio size={12} className="animate-pulse" /> {current.coords}
          </span>
          <span className="text-white/40">|</span>
          <span>{current.depth}</span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {current.status}
        </div>
      </div>

      {/* Center Reticle & Coordinates Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <div className="h-44 w-44 rounded-full border border-white/10 opacity-40 transition-transform duration-300 group-hover:scale-110" />
        <div className="absolute h-2 w-2 rounded-full bg-[#6ce1ff]/60" />
      </div>

      {/* Bottom Scene Switcher Tabs */}
      <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-gradient-to-t from-[#05080c] via-[#05080c]/90 to-transparent p-4 backdrop-blur-md">
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-300">
          <span className="flex items-center gap-1.5 text-white/90">
            <Cpu size={12} className="text-[#ffb35c]" /> {current.telemetry}
          </span>
          <span className="text-slate-400">SELECT REAL-TIME FEED</span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {scenes.map((scene, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`group/btn relative flex items-center gap-2 overflow-hidden rounded-xl border px-3 py-2 text-left transition ${
                  isActive
                    ? "border-[#ffb35c] bg-[#ffb35c]/15 text-white shadow-[0_0_20px_rgba(255,179,92,0.3)]"
                    : "border-white/10 bg-black/40 text-slate-400 hover:border-white/30 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="relative h-6 w-8 shrink-0 overflow-hidden rounded-md border border-white/10">
                  <Image
                    src={scene.src}
                    alt={scene.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-bold tracking-[0.14em]">
                    0{idx + 1} · {scene.title.split(" ")[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
