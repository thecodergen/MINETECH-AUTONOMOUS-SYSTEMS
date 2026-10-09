'use client';

import Image from "next/image";
import { ArrowRight, ShieldCheck, Sparkles, Zap, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface FinalCTAProps {
  onOpenDemo?: () => void;
}

export default function FinalCTA({ onOpenDemo }: FinalCTAProps) {
  return (
    <section id="contact" className="relative scroll-mt-20 px-4 pt-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="group relative overflow-hidden rounded-[36px] border border-white/15 bg-[#060a0f] p-8 shadow-[0_35px_100px_rgba(0,0,0,0.8)] sm:p-12 lg:p-16">
          {/* Photorealistic Background with Heavy Cinematic Gradient */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero_open_pit.jpg"
              alt="Mining Operations Background"
              fill
              sizes="(max-width: 1200px) 100vw, 90vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05080c] via-[#05080c]/90 to-[#05080c]/70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,179,92,0.2),transparent_40%)]" />
          </div>

          <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb35c]/30 bg-[#ffb35c]/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-[#ffca72]">
                <Sparkles size={13} /> DEPLOY MINETECH INTELLIGENCE
              </div>
              <h2 className="mt-5 text-4xl font-black leading-tight tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
                Ready to transform your extraction operations?
              </h2>
              <p className="mt-4 max-w-xl text-base text-slate-300">
                Integrate live geospatial digital twins, autonomous haulage intelligence, and zero-harm subterranean telemetry today.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <Mail size={14} className="text-[#ffb35c]" /> dispatch@minetech.global
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={14} className="text-[#6ce1ff]" /> +1 (800) 412-MINE
                </span>
              </div>
            </div>

            <div className="flex flex-col items-start gap-4 sm:flex-row lg:flex-col lg:items-end">
              <motion.button
                type="button"
                onClick={onOpenDemo}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#ffb35c] px-8 py-4 text-xs font-bold uppercase tracking-[0.22em] text-[#0a0d11] shadow-[0_15px_40px_rgba(255,179,92,0.4)] transition hover:brightness-110 active:scale-95"
              >
                REQUEST FLEET DEMO <ArrowRight size={16} />
              </motion.button>
              <span className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <ShieldCheck size={14} className="text-emerald-400" /> ISO 27001 & ISA-95 Compliant
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
