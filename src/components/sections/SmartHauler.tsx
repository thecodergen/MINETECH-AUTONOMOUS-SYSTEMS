'use client';

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, BatteryCharging, Gauge, Radio, ShieldCheck, Zap, Layers, Cpu, Focus, RotateCcw, Eye } from "lucide-react";

interface Hotspot {
  id: string;
  label: string;
  shortLabel: string;
  detail: string;
  position: string;
  x: number; // percentage from left
  y: number; // percentage from top
  scale: number;
  stats: { key: string; val: string }[];
}

interface FleetMachine {
  id: string;
  name: string;
  category: string;
  model: string;
  image: string;
  badge: string;
  specs: { label: string; val: string }[];
  hotspots: Hotspot[];
}

const fleetMachines: FleetMachine[] = [
  {
    id: "haul-truck",
    name: "CAT 797F Autonomous Haul Truck",
    category: "SURFACE HAULAGE",
    model: "Ultra-Class 360T Hauler",
    image: "/images/hauler_pbr_studio.jpg",
    badge: "360-TONNE PAYLOAD",
    specs: [
      { label: "Power Output", val: "4,000 HP (2,983 kW)" },
      { label: "Gross Weight", val: "623,690 kg" },
      { label: "Top Speed", val: "67.6 km/h" },
      { label: "Guidance", val: "Dual RTK-GNSS + LiDAR" },
    ],
    hotspots: [
      {
        id: "engine",
        label: "C32 ACERT Quad-Turbo Powertrain",
        shortLabel: "C32 Engine",
        detail: "4,000 HP heavy diesel unit with automated predictive injection, quad turbochargers, and thermal monitoring.",
        position: "top-[48%] left-[34%]",
        x: 34,
        y: 48,
        scale: 2.1,
        stats: [
          { key: "Output", val: "4,000 HP" },
          { key: "Thermal State", val: "88°C (Nominal)" },
          { key: "Vibration Health", val: "0.14 mm/s RMS" },
        ],
      },
      {
        id: "lidar",
        label: "Autonomous LiDAR & GNSS Mast",
        shortLabel: "LiDAR Mast",
        detail: "Dual solid-state 128-beam optical LiDAR pucks paired with RTK-GNSS for centimeter navigation.",
        position: "top-[14%] left-[38%]",
        x: 38,
        y: 14,
        scale: 2.4,
        stats: [
          { key: "Range", val: "320m 360°" },
          { key: "Precision", val: "± 1.4 cm RTK" },
          { key: "Latency", val: "< 35ms response" },
        ],
      },
      {
        id: "tires",
        label: "4.0m Heavy Titan Tread Tires",
        shortLabel: "63\" Tires",
        detail: "59/80R63 radial steel-belted industrial mining tires with integrated TPMS acoustic telemetry.",
        position: "bottom-[24%] left-[48%]",
        x: 48,
        y: 68,
        scale: 2.0,
        stats: [
          { key: "Tire Pressure", val: "105 PSI" },
          { key: "Compound Temp", val: "66°C" },
          { key: "Tread Life", val: "84% Remaining" },
        ],
      },
      {
        id: "hydraulics",
        label: "Dual 3-Stage Hoist Cylinders",
        shortLabel: "Hoist Rams",
        detail: "Heavy hydraulic telescopic lift cylinders delivering 360-tonne dump cycle completion in 24.2 seconds.",
        position: "top-[42%] right-[28%]",
        x: 62,
        y: 44,
        scale: 2.1,
        stats: [
          { key: "Dump Cycle", val: "24.2s" },
          { key: "Hydraulic Pressure", val: "24.5 MPa" },
          { key: "Fluid Quality", val: "ISO 16/13" },
        ],
      },
    ],
  },
  {
    id: "excavator",
    name: "996B Hydraulic Mining Excavator",
    category: "EXTRACTION & LOADING",
    model: "55m³ Electric Hydraulic Shovel",
    image: "/images/excavator_pbr_studio.jpg",
    badge: "55m³ BUCKET CAPACITY",
    specs: [
      { label: "Bucket Payload", val: "95 Tonnes / Pass" },
      { label: "Cycle Time", val: "27.4 Seconds" },
      { label: "Breakout Force", val: "2,240 kN" },
      { label: "Telemetry", val: "Payload Sensor Link" },
    ],
    hotspots: [
      {
        id: "bucket",
        label: "55m³ Cast Steel Rock Bucket",
        shortLabel: "55m³ Bucket",
        detail: "Heavy reinforced wear-resistant rock bucket with real-time payload mass sensors and forged teeth.",
        position: "top-[64%] left-[28%]",
        x: 28,
        y: 64,
        scale: 2.2,
        stats: [
          { key: "Payload Load", val: "94.8 Tonnes" },
          { key: "Teeth Wear", val: "12% Worn" },
          { key: "Penetration", val: "48° Optimal" },
        ],
      },
      {
        id: "boom",
        label: "Twin Hydraulic Arm Cylinders",
        shortLabel: "Boom Rams",
        detail: "High-pressure articulated hydraulic rams delivering 2,240 kN rock penetration breakout force.",
        position: "top-[32%] left-[46%]",
        x: 46,
        y: 32,
        scale: 2.1,
        stats: [
          { key: "Operating Bar", val: "340 Bar" },
          { key: "Hydraulic Temp", val: "72°C" },
          { key: "Boom Stress", val: "0.28 Yield" },
        ],
      },
      {
        id: "tracks",
        label: "Heavy-Duty Crawler Undercarriage",
        shortLabel: "Tracks",
        detail: "Dual continuous forged steel track assemblies providing stable bench anchoring on 14° pit grade.",
        position: "bottom-[22%] right-[32%]",
        x: 64,
        y: 72,
        scale: 2.0,
        stats: [
          { key: "Ground Pressure", val: "260 kPa" },
          { key: "Tension", val: "Calibrated" },
          { key: "Stability", val: "Safe (14°)" },
        ],
      },
      {
        id: "cab",
        label: "Pressurized Operator Cabin & Telemetry",
        shortLabel: "Command Cab",
        detail: "Ergonomic ROPS/FOPS cabin with integrated payload telemetry displays and 360° proximity radar.",
        position: "top-[28%] right-[32%]",
        x: 68,
        y: 28,
        scale: 2.2,
        stats: [
          { key: "Radar Range", val: "180 Meters" },
          { key: "Air Quality", val: "HEPA Pressurized" },
          { key: "SCADA Link", val: "Real-time" },
        ],
      },
    ],
  },
  {
    id: "drill-rig",
    name: "PV-271 Rotary Blast Hole Drill",
    category: "BLAST PREPARATION",
    model: "Autonomous GPS Blasthole Rig",
    image: "/images/drill_pbr_studio.jpg",
    badge: "350mm HOLE DIAMETER",
    specs: [
      { label: "Bit Diameter", val: "270 - 350 mm" },
      { label: "Drill Depth", val: "Up to 55 Meters" },
      { label: "Feed Force", val: "311 kN (70,000 lbf)" },
      { label: "Positioning", val: "Automated Auto-Level" },
    ],
    hotspots: [
      {
        id: "mast",
        label: "18m Heavy Lattice Drilling Mast",
        shortLabel: "Lattice Mast",
        detail: "Ruggedized steel mast engineered for rapid single-pass 18m drilling with automated rod carousel.",
        position: "top-[24%] left-[28%]",
        x: 28,
        y: 24,
        scale: 2.2,
        stats: [
          { key: "Mast Angle", val: "0.0° Vertical" },
          { key: "Feed Pulldown", val: "311 kN" },
          { key: "Vibration", val: "0.18 mm/s" },
        ],
      },
      {
        id: "rotary-head",
        label: "High-Torque Rotary Drive Head",
        shortLabel: "Rotary Head",
        detail: "Continuous variable speed drive applying up to 14,200 Nm torque to rotary tricone drill bits.",
        position: "top-[42%] left-[26%]",
        x: 26,
        y: 42,
        scale: 2.3,
        stats: [
          { key: "RPM Speed", val: "120 RPM" },
          { key: "Torque Load", val: "11,400 Nm" },
          { key: "Penetration", val: "1.4 m/min" },
        ],
      },
      {
        id: "gps-mast",
        label: "RTK Strata Hole Guidance Mast",
        shortLabel: "GPS Auto",
        detail: "Automated auto-leveling and geospatial guidance placing blastholes within 1.2cm collar tolerance.",
        position: "top-[20%] right-[48%]",
        x: 51,
        y: 20,
        scale: 2.3,
        stats: [
          { key: "Collar Precision", val: "± 1.2 cm" },
          { key: "Depth Accuracy", val: "± 0.5 cm" },
          { key: "Deviation", val: "< 0.3° vertical" },
        ],
      },
      {
        id: "tracks",
        label: "Crawler Base & Leveling Jacks",
        shortLabel: "Jacks & Tracks",
        detail: "Four hydraulic outrigger leveling cylinders anchoring the crawler carriage on uneven rock benches.",
        position: "bottom-[24%] right-[42%]",
        x: 54,
        y: 72,
        scale: 2.0,
        stats: [
          { key: "Jack Pressure", val: "22.5 MPa" },
          { key: "Auto Level", val: "< 15 seconds" },
          { key: "Grade Hold", val: "Up to 20°" },
        ],
      },
    ],
  },
  {
    id: "underground-lhd",
    name: "Subterranean LHD Low-Profile Loader",
    category: "UNDERGROUND UTILITY",
    model: "Battery-Electric Sub-surface Loader",
    image: "/images/lhd_pbr_studio.jpg",
    badge: "ZERO EMISSION SUB-SURFACE",
    specs: [
      { label: "Tramming Capacity", val: "18.0 Tonnes" },
      { label: "Tunnel Clearance", val: "2.4m Low-Profile" },
      { label: "Battery Range", val: "4.5 Hours Continuous" },
      { label: "Proximity Halo", val: "Active Laser Detection" },
    ],
    hotspots: [
      {
        id: "bucket",
        label: "Low-Profile Rock Scoop Bucket",
        shortLabel: "Scoop Bucket",
        detail: "Wear-resistant rock scoop engineered for rapid underground loading in tight 3.5m crosscuts.",
        position: "bottom-[34%] left-[24%]",
        x: 24,
        y: 62,
        scale: 2.2,
        stats: [
          { key: "Payload Capacity", val: "18.0 Tonnes" },
          { key: "Breakout Force", val: "380 kN" },
          { key: "Cycle Time", val: "14.2s" },
        ],
      },
      {
        id: "chassis",
        label: "Articulated Low-Profile Frame",
        shortLabel: "Articulated Joint",
        detail: "Heavy articulated center steering joint delivering a tight 3.2m turning radius in subterranean tunnels.",
        position: "bottom-[38%] left-[48%]",
        x: 48,
        y: 54,
        scale: 2.1,
        stats: [
          { key: "Turn Radius", val: "3.2 meters" },
          { key: "Roll Safety", val: "FOPS / ROPS L2" },
          { key: "Drivetrain", val: "Dual Electric 4WD" },
        ],
      },
      {
        id: "battery",
        label: "Lithium-Iron Phosphate Battery Bank",
        shortLabel: "Battery Module",
        detail: "Modular swappable liquid-cooled battery pack providing zero exhaust emissions underground.",
        position: "top-[48%] right-[22%]",
        x: 78,
        y: 48,
        scale: 2.2,
        stats: [
          { key: "Capacity", val: "340 kWh" },
          { key: "Thermal State", val: "32°C Optimal" },
          { key: "Swap Time", val: "< 8 minutes" },
        ],
      },
      {
        id: "safety-lamps",
        label: "Volumetric High-Lumen Headlamps",
        shortLabel: "LED Lamps & Cab",
        detail: "42,000 Lumen LED searchlights and forward FLIR camera piercing through tunnel mist and rock dust.",
        position: "top-[28%] left-[60%]",
        x: 60,
        y: 30,
        scale: 2.3,
        stats: [
          { key: "Luminous Flux", val: "42,000 Lumens" },
          { key: "Color Temp", val: "5700K Daylight" },
          { key: "Laser Radar", val: "360° Halo Active" },
        ],
      },
    ],
  },
];

export default function SmartHauler() {
  const [activeMachineIdx, setActiveMachineIdx] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string>("engine");
  const [isZoomedIn, setIsZoomedIn] = useState<boolean>(false); // Start in full view

  const currentMachine = fleetMachines[activeMachineIdx];
  const currentHotspot =
    currentMachine.hotspots.find((h) => h.id === activeHotspotId) || currentMachine.hotspots[0];

  const handleMachineChange = (idx: number) => {
    setActiveMachineIdx(idx);
    setActiveHotspotId(fleetMachines[idx].hotspots[0].id);
    setIsZoomedIn(false); // Show full view on machine change
  };

  const handleSelectHotspot = (id: string) => {
    if (activeHotspotId === id && isZoomedIn) {
      setIsZoomedIn(false); // Click again to toggle back to full view
    } else {
      setActiveHotspotId(id);
      setIsZoomedIn(true); // Zoom into the selected device
    }
  };

  const currentScale = isZoomedIn ? currentHotspot.scale : 1.0;
  const currentOriginX = isZoomedIn ? currentHotspot.x : 50;
  const currentOriginY = isZoomedIn ? currentHotspot.y : 50;

  return (
    <section id="smart-hauler" className="relative px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb35c]/30 bg-[#ffb35c]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffca72]">
              <Zap size={13} className="text-[#ffb35c]" /> HEAVY AUTONOMY FLEET
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
              Photorealistic Heavy Autonomy
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Select any machine or subsystem button to automatically zoom into that exact device with high-precision telemetry inspection.
            </p>
          </div>

          {/* Machine Category Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#070b10] p-1.5 shadow-2xl">
            {fleetMachines.map((m, idx) => {
              const isActive = idx === activeMachineIdx;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => handleMachineChange(idx)}
                  className={`cursor-pointer rounded-xl px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-all ${
                    isActive
                      ? "bg-[#ffb35c] text-black shadow-[0_0_20px_rgba(255,179,92,0.4)] scale-105 font-extrabold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {m.name.split(" ")[0]} {m.name.split(" ")[1]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Machine Showcase Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.85fr]">
          {/* Photorealistic Centerpiece with Precision Device Zoom */}
          <div className="group relative overflow-hidden rounded-[32px] border border-white/15 bg-[#070b10] p-4 shadow-[0_30px_90px_rgba(0,0,0,0.6)]">
            <div className="relative h-[480px] w-full overflow-hidden rounded-[24px] sm:h-[540px]">
              
              {/* Animated Zooming Image */}
              <motion.div
                key={currentMachine.id}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  scale: currentScale,
                }}
                style={{
                  transformOrigin: `${currentOriginX}% ${currentOriginY}%`,
                }}
                transition={{
                  scale: { type: "spring", stiffness: 220, damping: 26 },
                  opacity: { duration: 0.35 }
                }}
                className="relative h-full w-full"
              >
                <Image
                  src={currentMachine.image}
                  alt={currentMachine.name}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 60vw"
                  className="object-cover object-center select-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#04070a] via-transparent to-black/30" />
              </motion.div>

              {/* Top Badge & Zoom Toggle Controls */}
              <div className="absolute left-4 top-4 z-20 flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-3.5 py-1.5 backdrop-blur-md">
                  <span className="h-2 w-2 rounded-full bg-[#ffb35c] shadow-[0_0_10px_#ffb35c]" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white">
                    {currentMachine.category} · {currentMachine.badge}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsZoomedIn((prev) => !prev)}
                  className={`cursor-pointer flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    !isZoomedIn
                      ? "border-[#ffb35c]/50 bg-[#ffb35c]/25 text-[#ffb35c]"
                      : "border-white/15 bg-black/75 text-slate-300 hover:text-white"
                  }`}
                >
                  {!isZoomedIn ? <Eye size={11} /> : <RotateCcw size={11} />}
                  <span>{!isZoomedIn ? "Full (1.0x)" : "Zoom Out to Full"}</span>
                </button>
              </div>

              {/* Target Reticle Overlay When Zoomed In */}
              {isZoomedIn && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
                >
                  <div className="flex items-center gap-1.5 rounded-full border border-[#ffb35c]/40 bg-black/60 px-3.5 py-1 backdrop-blur-md font-mono text-[9px] font-bold text-[#ffb35c]">
                    <Focus size={12} className="animate-spin" /> ZOOM LOCKED: {currentHotspot.shortLabel}
                  </div>
                </motion.div>
              )}

              {/* Bottom Quick Specs Bar */}
              <div className="absolute bottom-4 left-4 right-4 z-20 grid grid-cols-2 gap-2 rounded-xl border border-white/15 bg-black/80 p-3 backdrop-blur-md sm:grid-cols-4">
                {currentMachine.specs.map((s) => (
                  <div key={s.label} className="text-center sm:text-left">
                    <p className="text-[8px] uppercase tracking-widest text-slate-400">{s.label}</p>
                    <p className="mt-0.5 font-mono text-xs font-bold text-white truncate">{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Telemetry Subsystem Breakdown */}
          <div className="flex flex-col justify-between space-y-6">
            
            {/* Subsystem Selectable Buttons */}
            <div className="rounded-[28px] border border-white/15 bg-[#070b10] p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-mono tracking-widest text-[#ffb35c]">
                  SELECT SUBSYSTEM TO ZOOM
                </span>
                <span className="font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  OPTICAL ZOOM: {currentScale}x
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {currentMachine.hotspots.map((h) => {
                  const isSelected = activeHotspotId === h.id;
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => handleSelectHotspot(h.id)}
                      className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                        isSelected
                          ? "bg-[#ffb35c] text-black shadow-[0_0_20px_rgba(255,179,92,0.5)] scale-105 font-extrabold"
                          : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Focus size={12} className={isSelected ? "text-black" : "text-[#ffb35c]"} />
                      <span>{h.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Subsystem Detail Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHotspot.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex-1 rounded-[28px] border border-white/15 bg-gradient-to-b from-[#091018] to-[#04070a] p-6 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[9px] font-mono tracking-widest text-[#ffca72]">
                      SUBSYSTEM COMPONENT
                    </span>
                    <h3 className="mt-1 text-xl font-bold text-white">{currentHotspot.label}</h3>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[9px] font-bold text-emerald-400">
                    <ShieldCheck size={12} /> NOMINAL
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-slate-300">
                  {currentHotspot.detail}
                </p>

                {/* Subsystem Live Telemetry Cards */}
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {currentHotspot.stats.map((stat) => (
                    <div
                      key={stat.key}
                      className="rounded-xl border border-white/10 bg-black/40 p-3 text-center"
                    >
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">{stat.key}</p>
                      <p className="mt-1 font-mono text-xs font-bold text-[#ffb35c] truncate">
                        {stat.val}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </section>
  );
}
