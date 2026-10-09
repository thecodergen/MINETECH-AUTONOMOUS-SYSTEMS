'use client';

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radio, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Navigation, 
  RefreshCw, 
  Zap, 
  Truck, 
  Wind, 
  Flame, 
  SlidersHorizontal,
  CheckCircle2,
  Gauge
} from "lucide-react";

type EmergencyScenario = "normal" | "rockfall" | "gas" | "tire";

interface HaulerUnit {
  id: string;
  name: string;
  status: "HAULING" | "LOADING" | "DUMPING" | "REROUTED" | "EMERGENCY_STOP" | "COOLING";
  speed: number;
  payload: number;
  tireTemp: number;
  location: string;
  destination: string;
  routeProgress: number; // 0 to 100
  x: number;
  y: number;
}

const initialHaulers: HaulerUnit[] = [
  { id: "HT-01", name: "Alpha Hauler 01", status: "HAULING", speed: 52, payload: 360, tireTemp: 68, location: "Ramp B7", destination: "Primary Crusher #1", routeProgress: 35, x: 28, y: 38 },
  { id: "HT-02", name: "Alpha Hauler 02", status: "LOADING", speed: 0, payload: 180, tireTemp: 62, location: "Bench 14 Shovel #1", destination: "Primary Crusher #1", routeProgress: 5, x: 14, y: 22 },
  { id: "HT-03", name: "Bravo Hauler 03", status: "HAULING", speed: 48, payload: 355, tireTemp: 71, location: "Switchback Ramp C", destination: "Waste Dump South", routeProgress: 68, x: 62, y: 44 },
  { id: "HT-04", name: "Bravo Hauler 04", status: "HAULING", speed: 54, payload: 362, tireTemp: 74, location: "Pit Central Corridor", destination: "Primary Crusher #1", routeProgress: 52, x: 45, y: 55 },
  { id: "HT-05", name: "Charlie Hauler 05", status: "DUMPING", speed: 0, payload: 0, tireTemp: 66, location: "Primary Crusher #1", destination: "Bench 22 Shovel #2", routeProgress: 95, x: 80, y: 72 },
  { id: "HT-06", name: "Charlie Hauler 06", status: "HAULING", speed: 50, payload: 350, tireTemp: 69, location: "Ramp A-North", destination: "Bench 14 Shovel #1", routeProgress: 20, x: 22, y: 68 }
];

export default function FleetDispatchSimulator() {
  const [scenario, setScenario] = useState<EmergencyScenario>("normal");
  const [haulers, setHaulers] = useState<HaulerUnit[]>(initialHaulers);
  const [selectedTruck, setSelectedTruck] = useState<HaulerUnit>(initialHaulers[0]);
  const [scenarioLogs, setScenarioLogs] = useState<string[]>([
    "10:44:12 - Autonomous Fleet Dispatch nominal. 48 units synchronized.",
    "10:44:18 - RTK-GNSS constellation locked (18 satellites, ±1.4cm accuracy).",
    "10:44:25 - Crusher throughput tracking at 7,120 Tonnes/hour."
  ]);

  // Live truck route movement simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setHaulers((prevHaulers) =>
        prevHaulers.map((truck) => {
          let newProgress = (truck.routeProgress + 1.2) % 100;
          let newSpeed = truck.speed;
          let newStatus = truck.status;
          let newTemp = truck.tireTemp;

          // React to active scenarios
          if (scenario === "rockfall" && (truck.id === "HT-01" || truck.id === "HT-02")) {
            newStatus = "REROUTED";
            newSpeed = 32;
          } else if (scenario === "tire" && truck.id === "HT-04") {
            newStatus = "COOLING";
            newSpeed = 15;
            newTemp = 118;
          } else if (scenario === "gas" && truck.id === "HT-06") {
            newStatus = "EMERGENCY_STOP";
            newSpeed = 0;
          } else if (scenario === "normal") {
            if (truck.status === "REROUTED" || truck.status === "EMERGENCY_STOP" || truck.status === "COOLING") {
              newStatus = "HAULING";
              newSpeed = 50 + Math.floor(Math.random() * 5);
              newTemp = 68;
            }
          }

          return {
            ...truck,
            routeProgress: newProgress,
            speed: newSpeed,
            status: newStatus,
            tireTemp: newTemp
          };
        })
      );
    }, 800);

    return () => clearInterval(interval);
  }, [scenario]);

  const triggerScenario = (newScenario: EmergencyScenario) => {
    setScenario(newScenario);
    const time = new Date().toLocaleTimeString();

    if (newScenario === "rockfall") {
      setScenarioLogs((prev) => [
        `${time} - [CRITICAL ALERT] Seismic sensor S-04 detected slope instability on Ramp B7 (Mag 2.7).`,
        `${time} - [NEURAL DISPATCH] Auto-rerouting HT-01 & HT-02 to Switchback Ramp C. Perimeter isolated.`,
        ...prev.slice(0, 5)
      ]);
    } else if (newScenario === "gas") {
      setScenarioLogs((prev) => [
        `${time} - [HAZARD WARNING] Subterranean sensor drift 12 flagged CH4 gas surge (2.6%).`,
        `${time} - [SAFETY OVERRIDE] Auxiliary ventilation boosted to 650 m³/s. Automated drift seal engaged.`,
        ...prev.slice(0, 5)
      ]);
    } else if (newScenario === "tire") {
      setScenarioLogs((prev) => [
        `${time} - [THERMAL WARNING] HT-04 Right-Rear 59/80R63 tire exceeded safety threshold: 118°C.`,
        `${time} - [AI GOVERNOR] Speed restricted to 15 km/h. Automated diversion to Pit Cooling Bay 2.`,
        ...prev.slice(0, 5)
      ]);
    } else {
      setScenarioLogs((prev) => [
        `${time} - [SYSTEM RESTORE] All emergency safety protocols cleared. Restoring nominal AI fleet flow.`,
        ...prev.slice(0, 5)
      ]);
    }
  };

  return (
    <section id="fleet-dispatch" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Title */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#6ce1ff]">
              <Navigation size={13} className="animate-spin" /> AUTONOMOUS DISPATCH COMMAND
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
              Tactical Fleet Dispatch & Emergency Simulator
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Real-time geospatial pit telemetry matrix. Simulate unexpected mine events (rockfalls, gas surges, tire overheat) to observe sub-second autonomous rerouting and safety shutdown protocols.
            </p>
          </div>

          {/* Emergency Scenario Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#070b10] p-1.5 shadow-2xl">
            <button
              type="button"
              onClick={() => triggerScenario("normal")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                scenario === "normal"
                  ? "bg-emerald-400 text-black shadow-[0_0_18px_rgba(52,211,153,0.4)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <CheckCircle2 size={13} /> Normal Sync
            </button>
            <button
              type="button"
              onClick={() => triggerScenario("rockfall")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                scenario === "rockfall"
                  ? "bg-red-500 text-white shadow-[0_0_18px_rgba(239,68,68,0.5)]"
                  : "text-slate-400 hover:text-red-400"
              }`}
            >
              <AlertTriangle size={13} /> Slope Rockfall
            </button>
            <button
              type="button"
              onClick={() => triggerScenario("gas")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                scenario === "gas"
                  ? "bg-amber-400 text-black shadow-[0_0_18px_rgba(251,191,36,0.5)]"
                  : "text-slate-400 hover:text-amber-400"
              }`}
            >
              <Wind size={13} /> Methane Spike
            </button>
            <button
              type="button"
              onClick={() => triggerScenario("tire")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider transition-all ${
                scenario === "tire"
                  ? "bg-orange-500 text-white shadow-[0_0_18px_rgba(249,115,22,0.5)]"
                  : "text-slate-400 hover:text-orange-400"
              }`}
            >
              <Flame size={13} /> Tire Overheat
            </button>
          </div>
        </div>

        {/* Tactical Map & Fleet Panel Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Tactical Open-Pit Geospatial Map (8 Columns) */}
          <div className="relative h-[560px] overflow-hidden rounded-[32px] border border-white/15 bg-[#05090f] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.8)] lg:col-span-8">
            
            {/* Map Background Grid & Elevation Contours */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

            {/* Simulated Pit Zones (SVG Overlay) */}
            <svg className="absolute inset-0 h-full w-full pointer-events-none">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffb35c" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#6ce1ff" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="hazardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Haul Road Splines */}
              <path d="M 120 140 Q 250 200 480 320 T 780 420" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="16" strokeLinecap="round" />
              <path d="M 120 140 Q 250 200 480 320 T 780 420" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 6" />

              <path d="M 180 420 Q 320 280 520 220 T 780 420" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="16" strokeLinecap="round" />
              <path d="M 180 420 Q 320 280 520 220 T 780 420" fill="none" stroke="url(#routeGrad)" strokeWidth="2" strokeDasharray="6 6" />

              {/* Slope Hazard Area when active */}
              {scenario === "rockfall" && (
                <g>
                  <circle cx="320" cy="240" r="70" fill="url(#hazardGrad)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <text x="270" y="245" fill="#ef4444" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    ⚠ SLOPE COLLAPSE ZONE
                  </text>
                </g>
              )}

              {/* Subterranean Gas Portal when active */}
              {scenario === "gas" && (
                <g>
                  <circle cx="180" cy="420" r="60" fill="rgba(251,191,36,0.15)" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  <text x="130" y="425" fill="#fbbf24" fontSize="11" fontWeight="bold" fontFamily="monospace">
                    ⚠ CH4 GAS SURGE
                  </text>
                </g>
              )}
            </svg>

            {/* Interactive Pit Waypoint Markers */}
            <div className="absolute left-[12%] top-[20%] flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/20 text-amber-300 shadow-lg">
                <MapPin size={16} />
              </div>
              <span className="mt-1 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-200">
                BENCH 14 (SHOVEL #1)
              </span>
            </div>

            <div className="absolute right-[12%] bottom-[16%] flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#6ce1ff]/40 bg-[#6ce1ff]/20 text-[#6ce1ff] shadow-lg">
                <Activity size={16} />
              </div>
              <span className="mt-1 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-200">
                PRIMARY CRUSHER #1
              </span>
            </div>

            <div className="absolute left-[16%] bottom-[18%] flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 shadow-lg">
                <Zap size={16} />
              </div>
              <span className="mt-1 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-200">
                SUB-PORTAL LEVEL 12
              </span>
            </div>

            <div className="absolute right-[28%] top-[24%] flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-purple-400/40 bg-purple-500/20 text-purple-300 shadow-lg">
                <SlidersHorizontal size={14} />
              </div>
              <span className="mt-1 rounded bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-200">
                PIT COOLING BAY 2
              </span>
            </div>

            {/* Interactive Moving Autonomous Haulers */}
            {haulers.map((truck) => {
              const isSelected = selectedTruck.id === truck.id;
              const isWarning = truck.status === "REROUTED" || truck.status === "EMERGENCY_STOP" || truck.status === "COOLING";

              return (
                <motion.div
                  key={truck.id}
                  onClick={() => setSelectedTruck(truck)}
                  className="absolute cursor-pointer -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${truck.x + (truck.routeProgress * 0.4)}%`,
                    top: `${truck.y + Math.sin(truck.routeProgress * 0.08) * 8}%`
                  }}
                  whileHover={{ scale: 1.25 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div
                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-mono font-bold shadow-xl backdrop-blur-md transition-all ${
                      isSelected
                        ? "border-white bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                        : isWarning
                        ? "border-red-500 bg-red-950/90 text-red-300 animate-bounce"
                        : "border-[#ffb35c]/40 bg-[#0b1219]/90 text-amber-300 hover:border-[#ffb35c]"
                    }`}
                  >
                    <Truck size={11} />
                    <span>{truck.id}</span>
                  </div>
                </motion.div>
              );
            })}

            {/* Live Tactical Event Console (Bottom of Map) */}
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-black/75 p-3 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-[#ffb35c]">
                  <Radio size={12} className="animate-pulse" /> SCADA INCIDENT & DISPATCH LOG
                </div>
                <span className="font-mono text-[9px] text-slate-500">LIVE FEED</span>
              </div>
              <div className="mt-2 space-y-1 font-mono text-[10px] text-slate-300">
                {scenarioLogs.map((log, idx) => (
                  <div key={idx} className="truncate">
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Selected Hauler Telemetry Inspector (4 Columns) */}
          <div className="flex flex-col justify-between rounded-[32px] border border-white/15 bg-gradient-to-b from-[#091018] to-[#04070a] p-6 shadow-2xl lg:col-span-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="text-[10px] font-mono tracking-widest text-[#6ce1ff]">
                  SELECTED FLEET UNIT
                </div>
                <div
                  className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase ${
                    selectedTruck.status === "HAULING"
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : selectedTruck.status === "REROUTED"
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : selectedTruck.status === "COOLING"
                      ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {selectedTruck.status}
                </div>
              </div>

              {/* Hauler Info */}
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-white">
                    {selectedTruck.name}
                  </h3>
                  <span className="font-mono text-xs text-slate-400">{selectedTruck.id}</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Ultra-Class Autonomous 360T Haulage Platform
                </p>
              </div>

              {/* Real-Time Telemetry Gauges */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-mono text-slate-400">SPEED (GPS-RTK)</div>
                  <div className="mt-1 text-xl font-black text-white">
                    {selectedTruck.speed} <span className="text-xs text-slate-400 font-normal">km/h</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-mono text-slate-400">PAYLOAD LOADED</div>
                  <div className="mt-1 text-xl font-black text-[#ffb35c]">
                    {selectedTruck.payload} <span className="text-xs text-slate-400 font-normal">Tonnes</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-mono text-slate-400">TIRE HEAT INDEX</div>
                  <div className={`mt-1 text-xl font-black ${selectedTruck.tireTemp > 90 ? "text-red-400" : "text-emerald-400"}`}>
                    {selectedTruck.tireTemp} <span className="text-xs text-slate-400 font-normal">°C</span>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-mono text-slate-400">ROUTE COMPLETION</div>
                  <div className="mt-1 text-xl font-black text-[#6ce1ff]">
                    {Math.round(selectedTruck.routeProgress)} <span className="text-xs text-slate-400 font-normal">%</span>
                  </div>
                </div>
              </div>

              {/* Route Itinerary Breakdown */}
              <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Current Sector</span>
                  <span className="font-mono font-bold text-white">{selectedTruck.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Target Waypoint</span>
                  <span className="font-mono font-bold text-[#ffb35c]">{selectedTruck.destination}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Guidance Channel</span>
                  <span className="font-mono font-bold text-emerald-400">RTK-L1/L2 Dual Sat</span>
                </div>
              </div>

              {/* Hauler Selector Quick Grid */}
              <div className="mt-6 border-t border-white/10 pt-4">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  SWITCH FLEET UNIT
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {haulers.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTruck(t)}
                      className={`rounded-lg py-1.5 text-[10px] font-mono font-bold transition-all ${
                        selectedTruck.id === t.id
                          ? "bg-[#6ce1ff] text-black shadow-md"
                          : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>NEURAL ROUTER: ONLINE</span>
                <span className="text-[#6ce1ff]">LATENCY: 3.2ms</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
