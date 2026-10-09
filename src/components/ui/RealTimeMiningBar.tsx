'use client';

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, Radio } from "lucide-react";

interface Commodity {
  symbol: string;
  name: string;
  price: number;
  change: number;
  unit: string;
}

const initialCommodities: Commodity[] = [
  { symbol: "HG", name: "COPPER", price: 4.68, change: +1.42, unit: "$/lb" },
  { symbol: "XAU", name: "GOLD", price: 2784.50, change: +0.68, unit: "$/oz" },
  { symbol: "LI", name: "LITHIUM", price: 14200, change: -0.35, unit: "$/t" },
  { symbol: "FE", name: "IRON ORE", price: 118.40, change: +2.15, unit: "$/t" },
  { symbol: "NI", name: "NICKEL", price: 16850, change: +0.94, unit: "$/t" },
];

const dispatchEvents = [
  "HT-042 [360T] dump cycle completed at Crusher #2 (24.1s)",
  "Autonomous Drill Rig RD-08 completed blast hole #148 at Bench 14",
  "Subterranean Stope Level 14: Air ventilation increased to 440 m³/s",
  "LiDAR Drone SkyScan-02 synched 4.8M point cloud to Digital Twin",
  "Shovel EX-112 commenced autonomous loading sequence at Zone Delta",
  "Pit Ramp B7 surface friction verified at 0.78 (Optimal)",
];

export default function RealTimeMiningBar() {
  const [commodities, setCommodities] = useState(initialCommodities);
  const [tonnage, setTonnage] = useState(328500);
  const [eventIdx, setEventIdx] = useState(0);

  // Live real-time market price micro-fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCommodities((prev) =>
        prev.map((c) => {
          const delta = (Math.random() - 0.48) * (c.price * 0.002);
          const newPrice = Number((c.price + delta).toFixed(c.price > 500 ? 0 : 2));
          const newChange = Number((c.change + (Math.random() - 0.49) * 0.1).toFixed(2));
          return { ...c, price: newPrice, change: newChange };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Live extraction ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setTonnage((t) => t + Math.floor(Math.random() * 8) + 2);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Rolling live dispatch events
  useEffect(() => {
    const interval = setInterval(() => {
      setEventIdx((prev) => (prev + 1) % dispatchEvents.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative z-40 border-b border-white/10 bg-[#020407] py-2 font-mono text-[11px] backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left Status & Dispatch Stream */}
        <div className="flex min-w-0 items-center gap-3 overflow-hidden">
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 whitespace-nowrap">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE TELEMETRY
          </span>

          <div className="truncate text-slate-300">
            <span className="text-[#ffb35c]">LOG // </span>
            <span className="text-slate-200">{dispatchEvents[eventIdx]}</span>
          </div>
        </div>

        {/* Right Live Tonnage & Commodity Prices */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <div className="flex items-center gap-1.5 text-slate-300 whitespace-nowrap">
            <Activity size={12} className="text-[#6ce1ff]" />
            <span className="text-slate-400">TODAY:</span>
            <span className="font-bold text-white tabular-nums">
              {tonnage.toLocaleString()} TONNES
            </span>
          </div>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            {commodities.map((item) => {
              const isPositive = item.change >= 0;
              return (
                <div key={item.symbol} className="flex items-center gap-1 whitespace-nowrap">
                  <span className="text-slate-400">{item.symbol}:</span>
                  <span className="font-bold text-white">
                    {item.price > 1000
                      ? `$${item.price.toLocaleString()}`
                      : `$${item.price.toFixed(2)}`}
                  </span>
                  <span
                    className={`flex items-center text-[10px] ${
                      isPositive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {isPositive ? `+${item.change}%` : `${item.change}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
