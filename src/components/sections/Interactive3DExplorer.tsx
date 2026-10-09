'use client';

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Eye, 
  Flame, 
  Layers, 
  RotateCcw, 
  Maximize2, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Radio, 
  Crosshair, 
  Focus,
  RotateCw,
  Play,
  Pause,
  MoveHorizontal,
  Zap,
  Mountain,
  Wrench,
  Gauge
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type MainViewEnv = "cad-studio" | "live-mine";
type DiagnosticMode = "360-turntable" | "xray" | "thermal" | "exploded";

interface TurntableAngle {
  degree: number;
  label: string;
  short: string;
  src: string;
}

interface Hotspot {
  id: string;
  name: string;
  short: string;
  category: string;
  bestAngleIndex: number;
  x: number;
  y: number;
  scale: number;
  status: string;
  health: number;
  temp: string;
  pressure?: string;
  detail: string;
  stats: { label: string; value: string }[];
}

interface VehicleData {
  id: string;
  name: string;
  roleBadge: string;
  modelBadge: string;
  category: string;
  description: string;
  liveMineSrc: string;
  angles: TurntableAngle[];
  xraySrc: string;
  thermalSrc: string;
  explodedSrc: string;
  fieldSpecs: { label: string; val: string }[];
  hotspots: Record<string, Hotspot>;
}

const vehiclesMaster: VehicleData[] = [
  {
    id: "cat-797f",
    name: "CAT 797F Autonomous Haul Truck",
    roleBadge: "SURFACE HAULAGE",
    modelBadge: "360-TONNE PAYLOAD",
    category: "HIGH-VOLUME OPEN-PIT EXTRACTION",
    description: "Ultra-class 4,000 HP autonomous heavy haul truck operating 24/7 with dual RTK-GNSS and LiDAR obstacle avoidance.",
    liveMineSrc: "/images/mining_haul_truck.jpg",
    angles: [
      { degree: 0, label: "0° Front Head-On", short: "FRONT", src: "/images/hauler_360_front.jpg" },
      { degree: 45, label: "45° Front-Right Three-Quarter", short: "FRONT-R", src: "/images/hauler_360_right.jpg" },
      { degree: 180, label: "180° Rear Hoist & Axle View", short: "REAR", src: "/images/hauler_360_rear.jpg" },
      { degree: 315, label: "315° Front-Left Master PBR", short: "FRONT-L", src: "/images/hauler_pbr_studio.jpg" },
    ],
    xraySrc: "/images/hauler_xray_hologram.jpg",
    thermalSrc: "/images/hauler_flir_thermal.jpg",
    explodedSrc: "/images/hauler_exploded_cad.jpg",
    fieldSpecs: [
      { label: "Power Output", val: "4,000 HP (2,983 kW)" },
      { label: "Gross Weight", val: "623,690 kg" },
      { label: "Top Speed", val: "67.6 km/h" },
      { label: "Guidance", val: "Dual RTK-GNSS + LiDAR" },
    ],
    hotspots: {
      engine: {
        id: "engine",
        short: "C32 V16",
        name: "Cat C32 ACERT Quad-Turbo Powertrain",
        category: "POWERTRAIN & PROPULSION",
        bestAngleIndex: 3,
        x: 34,
        y: 48,
        scale: 2.1,
        status: "OPTIMAL",
        health: 98,
        temp: "88.4 °C",
        pressure: "620 kPa",
        detail: "4,000 HP (2,983 kW) ultra-heavy diesel powertrain with quad turbochargers, common-rail injection, and vibration analytics.",
        stats: [
          { label: "Displacement", value: "32.1 Liters V16" },
          { label: "Power Output", value: "4,000 HP @ 1,750 RPM" },
          { label: "Peak Torque", value: "11,200 Nm" },
          { label: "Vibration Health", value: "0.12 mm/s RMS" }
        ]
      },
      lidar: {
        id: "lidar",
        short: "LiDAR MAST",
        name: "Dual 128-Beam Solid-State LiDAR & GNSS",
        category: "AUTONOMOUS GUIDANCE",
        bestAngleIndex: 0,
        x: 50,
        y: 16,
        scale: 2.4,
        status: "LIVE TRACKING",
        health: 100,
        temp: "38.2 °C",
        detail: "Dual high-frequency 128-beam optical LiDAR scanners with RTK-GNSS for 360° obstacle tracking with 35ms latency.",
        stats: [
          { label: "Sampling Rate", value: "2.4M pts/sec" },
          { label: "Detection Range", value: "320 Meters (360°)" },
          { label: "Position Precision", value: "± 1.4 cm RTK" },
          { label: "Obstacle Response", value: "< 35 ms" }
        ]
      },
      hydraulics: {
        id: "hydraulics",
        short: "3-STAGE HOIST",
        name: "Dual 3-Stage Telescopic Hoist Cylinders",
        category: "HEAVY HYDRAULICS",
        bestAngleIndex: 2,
        x: 36,
        y: 60,
        scale: 2.2,
        status: "READY",
        health: 96,
        temp: "62.5 °C",
        pressure: "24.5 MPa",
        detail: "Telescopic hydraulic hoist cylinders delivering 360-tonne rock payload dump cycle completion in 24.2 seconds.",
        stats: [
          { label: "System Pressure", value: "24.5 MPa" },
          { label: "Dump Cycle Time", value: "24.2 Seconds" },
          { label: "Fluid Cleanliness", value: "ISO 16/13 Class" },
          { label: "Piston Stroke", value: "3.45 Meters" }
        ]
      },
      wheels: {
        id: "wheels",
        short: "63\" TITAN TIRES",
        name: "59/80R63 Titan Radial Mining Tires",
        category: "RUNNING GEAR & SUSPENSION",
        bestAngleIndex: 1,
        x: 58,
        y: 65,
        scale: 2.1,
        status: "BALANCED",
        health: 94,
        temp: "66.8 °C",
        pressure: "105.2 PSI",
        detail: "4.03-meter diameter radial steel-belted tires with integrated TPMS acoustic sensors and compound heat monitoring.",
        stats: [
          { label: "Outer Diameter", value: "4.03 Meters (13.2 ft)" },
          { label: "Tire Weight", value: "5,350 kg" },
          { label: "TPMS Inflation", value: "105.2 PSI" },
          { label: "Tread Remaining", value: "84% (68 mm depth)" }
        ]
      },
    }
  },
  {
    id: "excavator-996b",
    name: "996B Hydraulic Mining Excavator",
    roleBadge: "EXTRACTION & LOADING",
    modelBadge: "55m³ BUCKET CAPACITY",
    category: "HIGH-VOLUME SHOVEL EXTRACTION",
    description: "Massive 55m³ electric hydraulic mining shovel engineered for 3-pass fast-loading of ultra-class haul trucks.",
    liveMineSrc: "/images/mining_excavator.jpg",
    angles: [
      { degree: 0, label: "0° Front Bucket View", short: "FRONT", src: "/images/excavator_360_front.jpg" },
      { degree: 45, label: "45° Studio 3D Turntable", short: "FRONT-R", src: "/images/excavator_pbr_studio.jpg" },
      { degree: 180, label: "180° Rear Power & Counterweight", short: "REAR", src: "/images/excavator_360_rear.jpg" },
      { degree: 315, label: "315° Pit Bench Profile", short: "PROFILE", src: "/images/mining_excavator.jpg" },
    ],
    xraySrc: "/images/hauler_xray_hologram.jpg",
    thermalSrc: "/images/hauler_flir_thermal.jpg",
    explodedSrc: "/images/hauler_exploded_cad.jpg",
    fieldSpecs: [
      { label: "Bucket Payload", val: "95 Tonnes / Pass" },
      { label: "Cycle Time", val: "27.4 Seconds" },
      { label: "Breakout Force", val: "2,240 kN" },
      { label: "Telemetry", val: "Payload Sensor Link" },
    ],
    hotspots: {
      bucket: {
        id: "bucket",
        short: "55m³ BUCKET",
        name: "55m³ Cast Steel Heavy Rock Bucket",
        category: "GROUND ENGAGING TOOLS",
        bestAngleIndex: 0,
        x: 22,
        y: 70,
        scale: 2.2,
        status: "OPTIMAL",
        health: 96,
        temp: "54.2 °C",
        detail: "Reinforced rock bucket with forged penetration teeth, wear shrouds, and real-time payload mass sensors.",
        stats: [
          { label: "Bucket Payload", value: "95 Tonnes / Pass" },
          { label: "Breakout Force", value: "2,240 kN" },
          { label: "Cycle Time", value: "27.4 Seconds" },
          { label: "Teeth Wear", value: "12% Worn" }
        ]
      },
      boom: {
        id: "boom",
        short: "BOOM CYLINDERS",
        name: "Twin Hydraulic Arm Cylinders",
        category: "HIGH PRESSURE ACTUATION",
        bestAngleIndex: 1,
        x: 44,
        y: 35,
        scale: 2.2,
        status: "READY",
        health: 98,
        temp: "72.0 °C",
        pressure: "34.0 MPa",
        detail: "340-bar hydraulic pistons delivering 2,240 kN rock penetration force with active dampening.",
        stats: [
          { label: "Operating Bar", value: "340 Bar (34.0 MPa)" },
          { label: "Oil Flow Rate", value: "4,200 L/min" },
          { label: "Boom Stress", value: "0.28 Yield (Safe)" },
          { label: "Seals State", value: "Nominal" }
        ]
      },
      tracks: {
        id: "tracks",
        short: "CRAWLER TRACKS",
        name: "Heavy-Duty Cast Steel Undercarriage",
        category: "RUNNING GEAR & PROPULSION",
        bestAngleIndex: 2,
        x: 52,
        y: 78,
        scale: 2.1,
        status: "BALANCED",
        health: 95,
        temp: "42.5 °C",
        detail: "Continuous heavy crawler track assemblies providing stable bench anchoring on steep mining benches.",
        stats: [
          { label: "Ground Pressure", value: "260 kPa" },
          { label: "Track Width", value: "1,600 mm" },
          { label: "Gradeability", value: "Up to 35°" },
          { label: "Tension State", value: "Hydraulic Auto" }
        ]
      },
      power: {
        id: "power",
        short: "POWER UNIT",
        name: "Dual Cummins QSK60 Power Module",
        category: "POWERTRAIN & GENERATION",
        bestAngleIndex: 2,
        x: 74,
        y: 44,
        scale: 2.2,
        status: "OPTIMAL",
        health: 97,
        temp: "84.0 °C",
        detail: "Twin 3,000 HP diesel-electric generating units powering multi-pump hydraulic distribution systems.",
        stats: [
          { label: "Combined Output", value: "6,000 HP" },
          { label: "Generator Rating", value: "4,500 kVA" },
          { label: "Cooling Airflow", value: "2,400 m³/h" },
          { label: "Emissions Tier", value: "Tier 4 Final" }
        ]
      }
    }
  },
  {
    id: "drill-pv271",
    name: "PV-271 Rotary Blast Hole Drill",
    roleBadge: "BLAST PREPARATION",
    modelBadge: "350mm HOLE DIAMETER",
    category: "AUTONOMOUS BLASTHOLE DRILLING",
    description: "Autonomous GPS-guided rotary drill rig capable of single-pass 18m drilling with 1.2cm collar precision.",
    liveMineSrc: "/images/mining_drill_rig.jpg",
    angles: [
      { degree: 45, label: "45° Studio 3D Turntable", short: "FRONT-R", src: "/images/drill_pbr_studio.jpg" },
      { degree: 180, label: "180° Rear Engine & Outriggers", short: "REAR", src: "/images/drill_360_rear.jpg" },
      { degree: 315, label: "315° Pit Bench Profile", short: "PROFILE", src: "/images/mining_drill_rig.jpg" },
    ],
    xraySrc: "/images/hauler_xray_hologram.jpg",
    thermalSrc: "/images/hauler_flir_thermal.jpg",
    explodedSrc: "/images/hauler_exploded_cad.jpg",
    fieldSpecs: [
      { label: "Bit Diameter", val: "270 - 350 mm" },
      { label: "Drill Depth", val: "Up to 55 Meters" },
      { label: "Feed Force", val: "311 kN (70,000 lbf)" },
      { label: "Positioning", val: "Automated Auto-Level" },
    ],
    hotspots: {
      mast: {
        id: "mast",
        short: "LATTICE MAST",
        name: "18m Heavy Lattice Drilling Mast",
        category: "DRILLING STRUCTURE",
        bestAngleIndex: 0,
        x: 32,
        y: 22,
        scale: 2.3,
        status: "OPTIMAL",
        health: 100,
        temp: "32.0 °C",
        detail: "Ruggedized high-strength steel mast engineered for rapid single-pass 18m drilling with auto-rod carousel.",
        stats: [
          { label: "Mast Length", value: "18.3 Meters" },
          { label: "Drill Depth", value: "Up to 55 Meters" },
          { label: "Feed Force", value: "311 kN" },
          { label: "Vertical Angle", value: "0.0° Laser Calibrated" }
        ]
      },
      rotary: {
        id: "rotary",
        short: "ROTARY HEAD",
        name: "High-Torque Rotary Drive Head",
        category: "ROTARY DRILLING",
        bestAngleIndex: 0,
        x: 30,
        y: 46,
        scale: 2.3,
        status: "ACTIVE",
        health: 96,
        temp: "68.5 °C",
        detail: "Continuous variable speed drive applying up to 14,200 Nm torque to rotary tricone drill bits.",
        stats: [
          { label: "Max Torque", value: "14,200 Nm" },
          { label: "Rotation Speed", value: "0 - 150 RPM" },
          { label: "Bit Diameter", value: "270 - 350 mm" },
          { label: "Penetration Rate", value: "1.4 m/min" }
        ]
      },
      jacks: {
        id: "jacks",
        short: "LEVELING JACKS",
        name: "Auto-Leveling Hydraulic Outriggers",
        category: "HYDRAULIC ANCHORING",
        bestAngleIndex: 1,
        x: 58,
        y: 72,
        scale: 2.1,
        status: "LOCKED",
        health: 98,
        temp: "45.0 °C",
        detail: "Four heavy hydraulic leveling cylinders anchoring the crawler base on uneven blasted rock benches.",
        stats: [
          { label: "Auto-Leveling", value: "< 15 Seconds" },
          { label: "Jack Pressure", value: "22.5 MPa" },
          { label: "Max Grade Hold", value: "20° Bench Slope" },
          { label: "Lock Valves", value: "Dual Pilot Check" }
        ]
      }
    }
  },
  {
    id: "lhd-loader",
    name: "Subterranean LHD Low-Profile Loader",
    roleBadge: "UNDERGROUND UTILITY",
    modelBadge: "ZERO EMISSION SUB-SURFACE",
    category: "DEEP SUBTERRANEAN DRIFT EXTRACTION",
    description: "Compact battery-electric articulated loader engineered to navigate tight 3.5m subterranean tunnels with zero emissions.",
    liveMineSrc: "/images/underground_tunnel.jpg",
    angles: [
      { degree: 45, label: "45° Studio 3D Turntable", short: "FRONT-R", src: "/images/lhd_pbr_studio.jpg" },
      { degree: 315, label: "315° Sub-Drift Tunnel View", short: "TUNNEL", src: "/images/underground_tunnel.jpg" },
    ],
    xraySrc: "/images/hauler_xray_hologram.jpg",
    thermalSrc: "/images/hauler_flir_thermal.jpg",
    explodedSrc: "/images/hauler_exploded_cad.jpg",
    fieldSpecs: [
      { label: "Tramming Capacity", val: "18.0 Tonnes" },
      { label: "Tunnel Clearance", val: "2.4m Low-Profile" },
      { label: "Battery Range", val: "4.5 Hours Continuous" },
      { label: "Proximity Halo", val: "Active Laser Detection" },
    ],
    hotspots: {
      bucket: {
        id: "bucket",
        short: "SCOOP BUCKET",
        name: "Heavy Underground Rock Scoop",
        category: "MUCKING & LOADING",
        bestAngleIndex: 0,
        x: 22,
        y: 62,
        scale: 2.2,
        status: "OPTIMAL",
        health: 96,
        temp: "48.0 °C",
        detail: "Low-profile cast rock scoop engineered for rapid subterranean mucking in narrow 3.5m crosscuts.",
        stats: [
          { label: "Payload Capacity", value: "18.0 Tonnes" },
          { label: "Breakout Force", value: "380 kN" },
          { label: "Cycle Time", value: "14.2 Seconds" },
          { label: "Penetration Tip", value: "Tungsten Carbide" }
        ]
      },
      battery: {
        id: "battery",
        short: "BATTERY PACK",
        name: "Lithium-Iron Phosphate Battery Bank",
        category: "CLEAN PROPULSION",
        bestAngleIndex: 0,
        x: 76,
        y: 48,
        scale: 2.2,
        status: "CHARGING",
        health: 100,
        temp: "32.4 °C",
        detail: "Modular swappable liquid-cooled battery pack delivering 4.5 hours continuous tramming with zero exhaust gas.",
        stats: [
          { label: "Capacity", value: "340 kWh" },
          { label: "Runtime", value: "4.5 Hours Continuous" },
          { label: "Swap Time", value: "< 8 Minutes" },
          { label: "Cell Health", value: "Balanced (32°C)" }
        ]
      },
      lighting: {
        id: "lighting",
        short: "LED & RADAR",
        name: "Volumetric LED Searchlamps & Laser Radar",
        category: "PERCEPTION & VISIBILITY",
        bestAngleIndex: 0,
        x: 54,
        y: 32,
        scale: 2.3,
        status: "ACTIVE",
        health: 100,
        temp: "36.0 °C",
        detail: "42,000-lumen daylight searchlamps and optical laser radar penetrating underground mist and rock dust.",
        stats: [
          { label: "Output", value: "42,000 Lumens" },
          { label: "Proximity Halo", value: "Active Laser 360°" },
          { label: "Color Temp", value: "5700K Daylight" },
          { label: "Thermal IR Cam", value: "Continuous Stream" }
        ]
      }
    }
  }
];

export default function Interactive3DExplorer() {
  const [envMode, setEnvMode] = useState<MainViewEnv>("cad-studio");
  const [activeVehicleIdx, setActiveVehicleIdx] = useState<number>(0);
  const [diagnosticMode, setDiagnosticMode] = useState<DiagnosticMode>("360-turntable");
  const [currentAngleIdx, setCurrentAngleIdx] = useState<number>(0);
  const [activeHotspotKey, setActiveHotspotKey] = useState<string>("engine");
  const [isZoomedIn, setIsZoomedIn] = useState<boolean>(false);
  const [autoSpin, setAutoSpin] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartX = useRef<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentVehicle = vehiclesMaster[activeVehicleIdx];
  const anglesList = currentVehicle.angles;
  const currentAngle = anglesList[currentAngleIdx % anglesList.length] || anglesList[0];

  const currentHotspot =
    currentVehicle.hotspots[activeHotspotKey] ||
    Object.values(currentVehicle.hotspots)[0];

  // Auto-Spin timer for 360 mode
  useEffect(() => {
    if (!autoSpin || envMode !== "cad-studio" || diagnosticMode !== "360-turntable") return;

    const interval = setInterval(() => {
      setCurrentAngleIdx((prev) => (prev + 1) % anglesList.length);
    }, 2200);

    return () => clearInterval(interval);
  }, [autoSpin, envMode, diagnosticMode, anglesList.length]);

  // Switch Vehicle
  const handleSelectVehicle = (idx: number) => {
    setActiveVehicleIdx(idx);
    setCurrentAngleIdx(0);
    const firstHotspotKey = Object.keys(vehiclesMaster[idx].hotspots)[0];
    setActiveHotspotKey(firstHotspotKey);
    setIsZoomedIn(false);
    setAutoSpin(false);
  };

  // Mouse Drag 360 Rotation handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (envMode !== "cad-studio") return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || envMode !== "cad-studio") return;
    const deltaX = e.clientX - dragStartX.current;
    if (Math.abs(deltaX) > 60) {
      if (deltaX > 0) {
        setCurrentAngleIdx((prev) => (prev + 1) % anglesList.length);
      } else {
        setCurrentAngleIdx((prev) => (prev - 1 + anglesList.length) % anglesList.length);
      }
      dragStartX.current = e.clientX;
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Select subsystem -> Automatically rotate to optimal angle & zoom into component!
  const handleSelectSubsystem = (key: string) => {
    if (activeHotspotKey === key && isZoomedIn) {
      setIsZoomedIn(false); // Toggle back to full view if clicked again
    } else {
      setActiveHotspotKey(key);
      const target = currentVehicle.hotspots[key];
      if (target && envMode === "cad-studio" && diagnosticMode === "360-turntable") {
        setCurrentAngleIdx(target.bestAngleIndex % anglesList.length);
      }
      setIsZoomedIn(true);
    }
  };

  const handleToggleFullView = () => {
    setIsZoomedIn((prev) => !prev);
  };

  // Determine active image source
  let activeImageSrc = currentAngle.src;
  if (envMode === "live-mine") {
    activeImageSrc = currentVehicle.liveMineSrc;
  } else {
    if (diagnosticMode === "xray") activeImageSrc = currentVehicle.xraySrc;
    if (diagnosticMode === "thermal") activeImageSrc = currentVehicle.thermalSrc;
    if (diagnosticMode === "exploded") activeImageSrc = currentVehicle.explodedSrc;
  }

  const currentScale = isZoomedIn ? (currentHotspot?.scale || 2.2) : 1.0;
  const currentOriginX = isZoomedIn ? (currentHotspot?.x ?? 50) : 50;
  const currentOriginY = isZoomedIn ? (currentHotspot?.y ?? 50) : 50;

  return (
    <section id="interactive-3d" className="relative px-4 py-24 sm:px-6 lg:px-8 select-none">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Master Header with Environment Mode Toggle */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb35c]/30 bg-[#ffb35c]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#ffb35c]">
              <Zap size={13} className="text-[#ffb35c] animate-pulse" /> UNIFIED FLEET INTELLIGENCE & 3D CAD
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
              {currentVehicle.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              {currentVehicle.description}
            </p>
          </div>

          {/* Master View Mode Toggle (3D CAD Studio vs Live Mine Deployment) */}
          <div className="relative z-30 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-[#060a0f] p-1.5 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setEnvMode("cad-studio");
                setIsZoomedIn(false);
              }}
              className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                envMode === "cad-studio"
                  ? "bg-[#ffb35c] text-black shadow-[0_0_20px_rgba(255,179,92,0.4)] font-extrabold scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Wrench size={13} />
              <span>3D CAD Studio (360°)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEnvMode("live-mine");
                setIsZoomedIn(false);
              }}
              className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                envMode === "live-mine"
                  ? "bg-[#6ce1ff] text-black shadow-[0_0_20px_rgba(108,225,255,0.4)] font-extrabold scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Mountain size={13} />
              <span>Live Mine Deployment</span>
            </button>
          </div>
        </div>

        {/* Clean Vehicle Switcher Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#060a0f] p-1.5 shadow-xl">
            {vehiclesMaster.map((veh, idx) => {
              const isSelected = activeVehicleIdx === idx;
              return (
                <button
                  key={veh.id}
                  type="button"
                  onClick={() => handleSelectVehicle(idx)}
                  className={`cursor-pointer rounded-xl px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                    isSelected
                      ? "bg-[#ffb35c] text-black shadow-[0_0_20px_rgba(255,179,92,0.45)] scale-105 font-extrabold"
                      : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {veh.name.split(" ")[0]} {veh.name.split(" ")[1]}
                </button>
              );
            })}
          </div>

          {/* Diagnostic View Modes (Active only in 3D CAD Studio Mode) */}
          {envMode === "cad-studio" && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-white/10 bg-[#070b10] p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setDiagnosticMode("360-turntable")}
                className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                  diagnosticMode === "360-turntable"
                    ? "bg-[#ffb35c] text-black shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <RotateCw size={12} /> 360° Turntable
              </button>
              <button
                type="button"
                onClick={() => setDiagnosticMode("xray")}
                className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                  diagnosticMode === "xray"
                    ? "bg-[#6ce1ff] text-black shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Layers size={12} /> X-Ray Mesh
              </button>
              <button
                type="button"
                onClick={() => setDiagnosticMode("thermal")}
                className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                  diagnosticMode === "thermal"
                    ? "bg-gradient-to-r from-red-500 to-amber-400 text-black shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Flame size={12} /> FLIR Thermal
              </button>
              <button
                type="button"
                onClick={() => setDiagnosticMode("exploded")}
                className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                  diagnosticMode === "exploded"
                    ? "bg-emerald-400 text-black shadow-md font-extrabold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Maximize2 size={12} /> Exploded CAD
              </button>
            </div>
          )}
        </div>

        {/* Main Viewport & Telemetry Panel Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* Main Visual Viewport (8 Columns) */}
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`group relative h-[560px] overflow-hidden rounded-[32px] border border-white/15 bg-[#030508] shadow-[0_30px_100px_rgba(0,0,0,0.85)] lg:col-span-8 ${
              envMode === "cad-studio" ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            {/* The Image with Smooth Spring Zooming */}
            <div className="absolute inset-0 h-full w-full overflow-hidden">
              <motion.div
                key={`${currentVehicle.id}-${envMode}-${diagnosticMode}-${currentAngleIdx}-${activeHotspotKey}-${isZoomedIn}`}
                initial={{ opacity: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: currentScale,
                  transformOrigin: `${currentOriginX}% ${currentOriginY}%`,
                }}
                transition={{
                  scale: { type: "spring", stiffness: 220, damping: 26 },
                  opacity: { duration: 0.2 }
                }}
                className="relative h-full w-full pointer-events-none"
              >
                <Image
                  src={activeImageSrc}
                  alt={currentVehicle.name}
                  fill
                  priority
                  sizes="(max-width: 1200px) 100vw, 65vw"
                  className="object-cover object-center select-none"
                />

                {/* Lighting Vignette Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#04070a]/90 via-transparent to-[#04070b]/30" />
              </motion.div>
            </div>

            {/* Target Reticle Overlay When Zoomed In */}
            {isZoomedIn && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="pointer-events-none absolute inset-0 flex items-center justify-center z-20"
              >
                <div className="flex items-center gap-1.5 rounded-full border border-[#ffb35c]/40 bg-black/60 px-4 py-1.5 backdrop-blur-md font-mono text-[10px] font-bold text-[#ffb35c]">
                  <Focus size={13} className="animate-spin" /> ZOOM LOCKED: {currentHotspot.short}
                </div>
              </motion.div>
            )}

            {/* Floating Top Left Controls */}
            <div className="pointer-events-auto absolute left-4 top-4 z-30 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleToggleFullView}
                className={`cursor-pointer flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                  !isZoomedIn
                    ? "border-[#ffb35c]/50 bg-[#ffb35c]/25 text-[#ffb35c] shadow-[0_0_15px_rgba(255,179,92,0.3)]"
                    : "border-white/15 bg-black/75 text-slate-300 hover:text-white"
                }`}
              >
                {!isZoomedIn ? <Eye size={12} /> : <RotateCcw size={12} />}
                <span>{!isZoomedIn ? "Full View (1.0x)" : "Zoom Out to Full"}</span>
              </button>

              {envMode === "cad-studio" && diagnosticMode === "360-turntable" && (
                <button
                  type="button"
                  onClick={() => setAutoSpin((prev) => !prev)}
                  className={`cursor-pointer flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
                    autoSpin
                      ? "border-amber-400/50 bg-amber-500/25 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                      : "border-white/15 bg-black/75 text-slate-300 hover:text-white"
                  }`}
                >
                  {autoSpin ? <Pause size={12} /> : <Play size={12} />}
                  <span>{autoSpin ? "Auto-Spin ON" : "Auto-Spin 360°"}</span>
                </button>
              )}

              {envMode === "live-mine" && (
                <div className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/80 px-3 py-1.5 font-mono text-[9px] font-bold text-emerald-300 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ACTIVE MINE SECTOR TELEMETRY
                </div>
              )}
            </div>

            {/* Floating Top Right Angle Dial (CAD Studio 360 Mode) */}
            {envMode === "cad-studio" && diagnosticMode === "360-turntable" && (
              <div className="pointer-events-auto absolute right-4 top-4 z-30 flex items-center gap-1 rounded-2xl border border-white/15 bg-black/80 p-1.5 backdrop-blur-md shadow-xl">
                {anglesList.map((angle, idx) => {
                  const isActive = (currentAngleIdx % anglesList.length) === idx;
                  return (
                    <button
                      key={`${angle.degree}-${idx}`}
                      type="button"
                      onClick={() => {
                        setCurrentAngleIdx(idx);
                        setAutoSpin(false);
                      }}
                      className={`cursor-pointer rounded-xl px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-[#ffb35c] text-black shadow-md font-extrabold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {angle.short}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Bottom Telemetry Legend & Quick Field Specs */}
            <div className="pointer-events-auto absolute bottom-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/75 p-3 text-[11px] backdrop-blur-xl">
              <div className="flex items-center gap-3">
                {envMode === "cad-studio" ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                    <MoveHorizontal size={13} className="animate-pulse" />
                    DRAG MOUSE 360° ROTATION
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#6ce1ff] font-mono">
                    <Mountain size={13} />
                    {currentVehicle.roleBadge} · {currentVehicle.modelBadge}
                  </span>
                )}
                {envMode === "cad-studio" && diagnosticMode === "360-turntable" && (
                  <span className="font-mono text-xs text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-lg">
                    {currentAngle.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <Radio size={12} className="text-[#ffb35c] animate-pulse" />
                <span>ZOOM: {currentScale}x · {currentHotspot.short}</span>
              </div>
            </div>
          </div>

          {/* Right Subsystem Diagnostics Panel (4 Columns) */}
          <div className="flex flex-col justify-between rounded-[32px] border border-white/15 bg-gradient-to-b from-[#091018] to-[#04070a] p-6 shadow-2xl lg:col-span-4">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-[#ffb35c]">
                    SUBSYSTEM INSPECTOR
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 uppercase">
                    {currentVehicle.modelBadge}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-bold uppercase text-emerald-400">
                  <ShieldCheck size={11} /> {currentHotspot.status}
                </div>
              </div>

              {/* Subsystem Buttons - ROTATE 360 & ZOOM TO PART ON CLICK */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {Object.keys(currentVehicle.hotspots).map((key) => {
                  const p = currentVehicle.hotspots[key];
                  const isSelected = activeHotspotKey === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectSubsystem(key)}
                      className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                        isSelected
                          ? "bg-[#ffb35c] text-black font-extrabold shadow-[0_0_15px_rgba(255,179,92,0.5)] scale-105"
                          : "border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {p.short}
                    </button>
                  );
                })}
              </div>

              {/* Active Component Details */}
              <div className="mt-6">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  {currentHotspot.category}
                </p>
                <h3 className="mt-1 text-xl font-black text-white">
                  {currentHotspot.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {currentHotspot.detail}
                </p>
              </div>

              {/* Metric Highlights */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-mono text-slate-400">CORE HEALTH</div>
                  <div className="mt-1 text-lg font-black text-emerald-400">
                    {currentHotspot.health}%
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="text-[10px] font-mono text-slate-400">THERMAL LOAD</div>
                  <div className="mt-1 text-lg font-black text-amber-400">
                    {currentHotspot.temp}
                  </div>
                </div>
              </div>

              {/* Specification Table */}
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4">
                {currentHotspot.stats.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{spec.label}</span>
                    <span className="font-mono font-bold text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Field Operational Specs Bar (When in Live Mine Mode) */}
            {envMode === "live-mine" && (
              <div className="mt-4 border-t border-white/10 pt-3">
                <div className="text-[9px] font-mono uppercase text-slate-500 mb-2">FIELD DEPLOYMENT METRICS</div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  {currentVehicle.fieldSpecs.map((fs) => (
                    <div key={fs.label} className="rounded-lg bg-black/40 p-1.5 border border-white/5">
                      <div className="text-slate-500">{fs.label}</div>
                      <div className="font-mono font-bold text-white">{fs.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Action Footer */}
            <div className="mt-4 border-t border-white/10 pt-3">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>SCADA ID: {currentVehicle.id.toUpperCase()}</span>
                <span className="text-emerald-400">NOMINAL SYNC</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
