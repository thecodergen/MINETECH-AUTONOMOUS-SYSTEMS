'use client';

import { ArrowRight, Play, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const MiningScene = dynamic(() => import("@/components/scene/MiningScene"), {
  ssr: false,
  loading: () => (
    <div className="h-[540px] w-full animate-pulse rounded-[30px] border border-white/10 bg-slate-900/60 p-6" />
  ),
});

interface HeroSectionProps {
  onOpenDemo?: () => void;
}

export default function HeroSection({ onOpenDemo }: HeroSectionProps) {
  return (
    <section id="experience" className="relative scroll-mt-24 min-h-[calc(100vh-110px)] px-5 pb-16 pt-8 sm:px-8 lg:px-10">
      {/* 3D Animated Ambient Glows */}
      <div className="pointer-events-none absolute -left-20 top-20 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(255,179,92,0.15),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(108,225,255,0.12),transparent_70%)] blur-3xl" />

      <div className="mx-auto max-w-7xl rounded-[36px] border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-5 shadow-[0_35px_110px_rgba(0,0,0,0.6)] sm:p-7 lg:p-9">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.35fr]">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#ffb35c]/30 bg-[#ffb35c]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffca72]">
              <Sparkles size={13} className="text-[#ffb35c]" /> 3D AUTONOMOUS EXTRACTION PLATFORM
            </div>

            <h1 className="text-4xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-7xl">
              THE FUTURE OF MINING
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-300 sm:text-lg">
              Next-generation autonomous haulage, live geospatial digital twins, and subterranean IoT intelligence operating with zero carbon waste.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#smart-hauler"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ffb35c] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-[#0a0d11] shadow-[0_10px_40px_rgba(255,179,92,0.4)] transition hover:brightness-110 active:scale-95"
              >
                EXPLORE THE MINE <ArrowRight size={16} />
              </a>
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition hover:border-[#6ce1ff]/50 hover:bg-[#6ce1ff]/10 hover:text-[#6ce1ff] active:scale-95"
              >
                <Zap size={16} className="text-[#6ce1ff]" /> LAUNCH SIMULATOR
              </button>
            </div>

            {/* Quick Badges */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Payload</p>
                <p className="mt-1 font-mono text-base font-black text-white sm:text-lg">360 Tonnes</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Response</p>
                <p className="mt-1 font-mono text-base font-black text-[#6ce1ff] sm:text-lg">&lt; 12ms RTK</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400">Zero Harm</p>
                <p className="mt-1 font-mono text-base font-black text-emerald-400 sm:text-lg">99.98% Safe</p>
              </div>
            </div>
          </motion.div>

          {/* Right 3D Visualizer Scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <MiningScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
