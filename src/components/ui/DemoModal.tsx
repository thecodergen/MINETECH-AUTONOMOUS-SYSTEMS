'use client';

import { useState } from "react";
import { X, CheckCircle2, Zap, ArrowRight, Activity, Cpu, Sliders, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [mineType, setMineType] = useState<"open-pit" | "subterranean" | "lithium">("open-pit");
  const [fleetCount, setFleetCount] = useState<number>(32);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });

  // Calculated real-time simulation metrics
  const dailyTonnage = Math.round(fleetCount * (mineType === "open-pit" ? 9400 : mineType === "subterranean" ? 4800 : 7200));
  const fuelSavings = Math.round(fleetCount * 14.8);
  const carbonOffset = Math.round(fleetCount * 38.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[32px] border border-white/20 bg-[#070c12] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9)] sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            {!submitted ? (
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb35c]/30 bg-[#ffb35c]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-[#ffca72]">
                  <Zap size={12} /> INTERACTIVE FLEET SIMULATOR & DEMO
                </div>

                <h3 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                  Configure Your Smart Mine Deployment
                </h3>
                <p className="mt-2 text-sm text-slate-300">
                  Select your extraction environment and autonomous fleet size to calculate real-time productivity yield.
                </p>

                {/* Interactive Mine Type Selector */}
                <div className="mt-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    1. Select Operation Profile
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    {[
                      { id: "open-pit", label: "Open-Pit Copper/Iron", tag: "360T Haulers" },
                      { id: "subterranean", label: "Subterranean Gold", tag: "Low-Profile LHD" },
                      { id: "lithium", label: "Lithium Extraction", tag: "Continuous Flow" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setMineType(item.id as any)}
                        className={`rounded-2xl border p-3.5 text-left transition-all ${
                          mineType === item.id
                            ? "border-[#ffb35c] bg-[#ffb35c]/15 text-white shadow-[0_0_20px_rgba(255,179,92,0.25)]"
                            : "border-white/10 bg-black/40 text-slate-400 hover:border-white/25 hover:text-white"
                        }`}
                      >
                        <p className="text-xs font-bold text-white">{item.label}</p>
                        <p className="mt-1 text-[10px] text-[#6ce1ff]">{item.tag}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fleet Size Slider */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      2. Autonomous Fleet Units:
                    </span>
                    <span className="font-mono text-base font-black text-[#ffb35c]">
                      {fleetCount} Heavy Units
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="120"
                    step="2"
                    value={fleetCount}
                    onChange={(e) => setFleetCount(Number(e.target.value))}
                    className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#ffb35c]"
                  />
                  <div className="mt-2 flex justify-between text-[9px] font-mono text-slate-500">
                    <span>6 UNITS (PILOT)</span>
                    <span>60 UNITS (MEDIUM)</span>
                    <span>120 UNITS (MEGA-PIT)</span>
                  </div>
                </div>

                {/* Live Calculated Yield Projections */}
                <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/15 bg-gradient-to-r from-[#0d1822] to-[#080d14] p-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Daily Output</p>
                    <p className="mt-1 font-mono text-lg font-black text-white sm:text-xl">
                      {dailyTonnage.toLocaleString()} <span className="text-xs font-normal text-slate-400">T/day</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Fuel Reduction</p>
                    <p className="mt-1 font-mono text-lg font-black text-emerald-400 sm:text-xl">
                      +{fuelSavings}% <span className="text-xs font-normal text-slate-400">Yield</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">Carbon Offset</p>
                    <p className="mt-1 font-mono text-lg font-black text-[#6ce1ff] sm:text-xl">
                      {carbonOffset}k <span className="text-xs font-normal text-slate-400">T/yr</span>
                    </p>
                  </div>
                </div>

                {/* Demo Request Form */}
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Full Name *
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Alex Morgan"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#ffb35c] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                        Work Email *
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="alex@miningcorp.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#ffb35c] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                      Mining Organization / Operation Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rio Tinto / BHP / Freeport-McMoRan"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-[#ffb35c] focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#ffb35c] py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-[#0a0d11] shadow-[0_10px_40px_rgba(255,179,92,0.4)] transition hover:brightness-110"
                    >
                      INITIALIZE SIMULATION DISPATCH <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/20 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.4)]">
                  <CheckCircle2 size={32} />
                </div>

                <h3 className="mt-5 text-2xl font-black text-white">
                  Simulation Dispatch Initialized!
                </h3>
                <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">
                  Thank you, <strong className="text-white">{formData.name}</strong>. Your customized {fleetCount}-unit {mineType} telemetry profile and digital twin demonstration link have been generated and dispatched to <strong className="text-[#6ce1ff]">{formData.email}</strong>.
                </p>

                <div className="mt-8 flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-full bg-[#ffb35c] px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black"
                  >
                    RETURN TO DASHBOARD
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
