'use client';

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  CloudRain,
  Wind,
  Radio,
  Wifi,
  ShieldAlert,
  Gauge,
  Compass,
  AlertTriangle,
  Flame,
  Layers,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Power,
  ChevronRight,
  Maximize2,
  Eye,
  Sliders,
  Play,
  RotateCcw
} from "lucide-react";

type WeatherMode = "day" | "night" | "rain" | "dust";
type GearState = "P" | "R" | "N" | "D";
type MachineType = "cat-797f" | "excavator-996b";

export default function TeleRemoteCockpitHUD() {
  const [weatherMode, setWeatherMode] = useState<WeatherMode>("day");
  const [machineType, setMachineType] = useState<MachineType>("cat-797f");
  const [gear, setGear] = useState<GearState>("D");
  const [speed, setSpeed] = useState<number>(34);
  const [isAccelerating, setIsAccelerating] = useState<boolean>(false);
  const [isBraking, setIsBraking] = useState<boolean>(false);
  const [steeringAngle, setSteeringAngle] = useState<number>(0);
  const [isWiperActive, setIsWiperActive] = useState<boolean>(false);
  const [isHighBeams, setIsHighBeams] = useState<boolean>(false);
  const [isArLidarOverlay, setIsArLidarOverlay] = useState<boolean>(true);
  const [isFlirThermal, setIsFlirThermal] = useState<boolean>(false);
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [radioLogIndex, setRadioLogIndex] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Radio dispatch transcript chatter
  const radioTranscripts = [
    { sender: "CENTRAL DISPATCH", text: "Hauler #07, path clear to Pit Bench Alpha. Maintain 40 km/h.", time: "10:42:08" },
    { sender: "BLAST SUPERVISOR", text: "Drill Sector 4 blast prep active. Maintain 150m standoff distance.", time: "10:42:19" },
    { sender: "SCADA TELEMETRY", text: "5G URLLC Tele-Remote Link stable (8.8ms latency, 0.0% packet drop).", time: "10:42:31" },
    { sender: "PIT TACTICAL", text: "Crusher Bin #01 ready for 360-tonne ore dump.", time: "10:42:45" },
  ];

  // Rotate radio messages periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setRadioLogIndex((prev) => (prev + 1) % radioTranscripts.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [radioTranscripts.length]);

  // Turn on wipers automatically in rain
  useEffect(() => {
    if (weatherMode === "rain") {
      setIsWiperActive(true);
    }
    if (weatherMode === "night") {
      setIsHighBeams(true);
    }
    if (weatherMode === "dust") {
      setIsFlirThermal(true);
    }
  }, [weatherMode]);

  // Acceleration & Speed Physics Loop
  useEffect(() => {
    if (isEmergencyStopped) {
      setSpeed(0);
      return;
    }

    const interval = setInterval(() => {
      setSpeed((prev) => {
        if (gear === "P" || gear === "N") {
          return Math.max(0, prev - 2);
        }
        if (isBraking) {
          return Math.max(0, prev - 4);
        }
        if (isAccelerating) {
          const maxSpeed = gear === "R" ? 18 : 68;
          return Math.min(maxSpeed, prev + 1.5);
        }
        // Coasting deceleration
        return Math.max(gear === "D" ? 28 : 0, prev - 0.4);
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isAccelerating, isBraking, gear, isEmergencyStopped]);

  // Web Audio Synth for Engine Hum & Alarms
  const triggerAudioBeep = (freq = 880, type: OscillatorType = "sine", duration = 0.15) => {
    if (!audioEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio context fallback
    }
  };

  // Weather Particles Canvas (Rain or Dust)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 500;

    const numParticles = weatherMode === "rain" ? 120 : weatherMode === "dust" ? 160 : 0;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      len: Math.random() * 20 + 10,
      speed: Math.random() * 8 + 4,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.7 + 0.3
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (weatherMode === "rain") {
        ctx.strokeStyle = "rgba(180, 220, 255, 0.6)";
        ctx.lineWidth = 1.5;
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + p.len);
          ctx.stroke();

          p.y += p.speed;
          p.x -= 1;
          if (p.y > canvas.height) {
            p.y = -20;
            p.x = Math.random() * canvas.width;
          }
        });
      } else if (weatherMode === "dust") {
        particles.forEach((p) => {
          ctx.fillStyle = `rgba(210, 160, 110, ${p.opacity * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.speed * 0.8;
          p.y += (Math.random() - 0.5) * 2;
          if (p.x > canvas.width) {
            p.x = -10;
            p.y = Math.random() * canvas.height;
          }
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    if (weatherMode === "rain" || weatherMode === "dust") {
      render();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [weatherMode]);

  // Derived Telemetry Values
  const calculatedRpm = Math.round(800 + (speed / 68) * 1250);
  const calculatedTorque = Math.round(2800 + (speed / 68) * 8200);
  const pitchDeg = Math.round((speed > 40 ? 3.2 : 1.8) * 10) / 10;
  const rollDeg = Math.round((steeringAngle / 30) * 4.5 * 10) / 10;

  // Background Scenery image by machine & mode
  let windshieldBg = "/images/hero_open_pit.jpg";
  if (machineType === "excavator-996b") {
    windshieldBg = "/images/mining_excavator.jpg";
  }

  return (
    <section id="tele-remote-hud" className="relative px-4 py-24 sm:px-6 lg:px-8 select-none overflow-hidden">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#6ce1ff]">
              <Radio size={13} className="animate-pulse text-[#6ce1ff]" /> 5G URLLC TELE-REMOTE COCKPIT HUD
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.06em] text-white sm:text-5xl">
              In-Cab Tele-Operation & Atmospheric Environment
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Ultra-low latency virtual cockpit interface with AR windshield projection, dynamic Day/Night/Weather atmospheric physics, and direct machine drive actuation.
            </p>
          </div>

          {/* Machine Unit Switcher */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/15 bg-[#060a0f] p-1.5 shadow-2xl">
            <button
              type="button"
              onClick={() => {
                setMachineType("cat-797f");
                triggerAudioBeep(600);
              }}
              className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                machineType === "cat-797f"
                  ? "bg-[#ffb35c] text-black shadow-[0_0_20px_rgba(255,179,92,0.4)] font-extrabold scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>CAT 797F (Hauler)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMachineType("excavator-996b");
                triggerAudioBeep(600);
              }}
              className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2 text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                machineType === "excavator-996b"
                  ? "bg-[#6ce1ff] text-black shadow-[0_0_20px_rgba(108,225,255,0.4)] font-extrabold scale-105"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>996B (Shovel)</span>
            </button>
          </div>
        </div>

        {/* Master Top Control Toolbar: Day / Night / Weather Mode Switcher */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#070c12]/90 p-3 backdrop-blur-xl shadow-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mr-2">
              ENVIRONMENT ATMOSPHERE:
            </span>

            {/* Clear Day */}
            <button
              type="button"
              onClick={() => {
                setWeatherMode("day");
                triggerAudioBeep(720);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                weatherMode === "day"
                  ? "bg-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Sun size={14} className={weatherMode === "day" ? "animate-spin" : ""} />
              <span>Day (Clear Sun)</span>
            </button>

            {/* Deep Night */}
            <button
              type="button"
              onClick={() => {
                setWeatherMode("night");
                triggerAudioBeep(520);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                weatherMode === "night"
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-105"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Moon size={14} />
              <span>Night (Stadium Beams)</span>
            </button>

            {/* Rainstorm */}
            <button
              type="button"
              onClick={() => {
                setWeatherMode("rain");
                triggerAudioBeep(450);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                weatherMode === "rain"
                  ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <CloudRain size={14} className={weatherMode === "rain" ? "animate-bounce" : ""} />
              <span>Heavy Rainstorm</span>
            </button>

            {/* Dust Storm */}
            <button
              type="button"
              onClick={() => {
                setWeatherMode("dust");
                triggerAudioBeep(380);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                weatherMode === "dust"
                  ? "bg-amber-700 text-white shadow-[0_0_20px_rgba(180,83,9,0.5)] scale-105"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Wind size={14} className={weatherMode === "dust" ? "animate-pulse" : ""} />
              <span>Desert Dust Storm</span>
            </button>
          </div>

          {/* Quick HUD Toggles */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsArLidarOverlay((prev) => !prev);
                triggerAudioBeep(800);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                isArLidarOverlay
                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/10 bg-black/40 text-slate-400"
              }`}
            >
              <Layers size={12} /> AR LiDAR Grid
            </button>

            <button
              type="button"
              onClick={() => {
                setIsFlirThermal((prev) => !prev);
                triggerAudioBeep(900);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                isFlirThermal
                  ? "border-amber-400/50 bg-gradient-to-r from-red-600/30 to-amber-500/30 text-amber-300 shadow-md"
                  : "border-white/10 bg-black/40 text-slate-400"
              }`}
            >
              <Flame size={12} /> FLIR Thermal IR
            </button>

            <button
              type="button"
              onClick={() => {
                setAudioEnabled((prev) => !prev);
                triggerAudioBeep(1000);
              }}
              className={`cursor-pointer flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[10px] font-mono font-bold uppercase transition-all ${
                audioEnabled ? "border-[#ffb35c]/50 bg-[#ffb35c]/20 text-[#ffb35c]" : "border-white/10 bg-black/40 text-slate-400"
              }`}
              title="Toggle Audio Feedback"
            >
              {audioEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
            </button>
          </div>
        </div>

        {/* Master In-Cab Tele-Remote Station Viewport (Cockpit Enclosure) */}
        <div className="relative rounded-[36px] border border-white/20 bg-[#03060a] p-3 md:p-6 shadow-[0_30px_100px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Main Panoramic Windshield Frame */}
          <div className="relative h-[560px] md:h-[640px] w-full overflow-hidden rounded-[28px] border-2 border-slate-700/60 bg-black shadow-inner">
            
            {/* Scenery View Through Windshield with Weather Filters */}
            <motion.div
              animate={{
                scale: isAccelerating ? 1.05 : isBraking ? 0.98 : 1.0,
                x: steeringAngle * -1.8,
                filter:
                  weatherMode === "night"
                    ? isFlirThermal
                      ? "hue-rotate(280deg) saturate(2.2) contrast(1.4)"
                      : "brightness(0.28) contrast(1.3) saturate(0.8)"
                    : weatherMode === "dust"
                    ? isFlirThermal
                      ? "hue-rotate(280deg) saturate(2.2) contrast(1.4)"
                      : "sepia(0.8) contrast(1.2) brightness(0.85) blur(1.5px)"
                    : weatherMode === "rain"
                    ? "brightness(0.7) contrast(1.1) saturate(0.9)"
                    : isFlirThermal
                    ? "hue-rotate(280deg) saturate(2.2) contrast(1.4)"
                    : "brightness(1.0) contrast(1.05)"
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="absolute inset-0 h-full w-full"
            >
              <Image
                src={windshieldBg}
                alt="Open Pit Mining Scenery"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center select-none"
              />

              {/* Night Stadium Beams Light Cones */}
              {weatherMode === "night" && (
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isHighBeams ? "opacity-90" : "opacity-40"
                  } bg-[radial-gradient(ellipse_at_50%_75%,_rgba(255,255,220,0.45)_0%,_rgba(255,240,180,0.15)_40%,_transparent_75%)]`}
                />
              )}

              {/* FLIR Thermal Overlay Scan Grid */}
              {isFlirThermal && (
                <div className="absolute inset-0 bg-gradient-to-t from-red-950/40 via-purple-950/20 to-cyan-950/40 mix-blend-color-dodge" />
              )}
            </motion.div>

            {/* Weather Particle Canvas Layer (Rain drops / Dust) */}
            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-10 h-full w-full" />

            {/* Animated Windshield Wiper Blades */}
            {isWiperActive && (
              <div className="pointer-events-none absolute inset-0 z-15 overflow-hidden">
                <motion.div
                  animate={{ rotate: [-65, 65, -65] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "bottom center" }}
                  className="absolute bottom-0 left-1/2 -ml-1 h-[75%] w-2 bg-gradient-to-t from-slate-900 via-slate-600 to-slate-400 shadow-2xl"
                >
                  <div className="h-full w-0.5 bg-slate-300 opacity-60" />
                </motion.div>
              </div>
            )}

            {/* ========================================================= */}
            {/* AUGMENTED REALITY (AR) WINDSHIELD HEAD-UP DISPLAY (HUD)    */}
            {/* ========================================================= */}
            <div className="pointer-events-none absolute inset-0 z-20 p-6 flex flex-col justify-between">
              
              {/* Top Horizon & Tele-Remote Status Bar */}
              <div className="flex items-start justify-between">
                {/* 5G Link Telemetry */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/75 px-4 py-2 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center gap-2">
                    <Wifi size={14} className="text-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      5G URLLC: 8.8ms
                    </span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="text-[10px] font-mono text-slate-300">
                    BITRATE: <span className="font-bold text-white">142 Mbps (4K 60FPS)</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="text-[10px] font-mono text-slate-300">
                    MODE: <span className="font-bold text-[#ffb35c]">TELE-OP OVERRIDE</span>
                  </div>
                </div>

                {/* Artificial Horizon / Inclinometer */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-black/75 px-4 py-2 backdrop-blur-md">
                  <Compass size={14} className="text-[#6ce1ff]" />
                  <div className="text-[10px] font-mono text-slate-300">
                    PITCH: <span className="font-bold text-white">+{pitchDeg}°</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="text-[10px] font-mono text-slate-300">
                    ROLL: <span className={`font-bold ${Math.abs(rollDeg) > 4 ? "text-amber-400" : "text-white"}`}>{rollDeg > 0 ? `+${rollDeg}` : rollDeg}°</span>
                  </div>
                  <span className="text-slate-600">|</span>
                  <div className="text-[10px] font-mono text-emerald-400">
                    ENVELOPE: NOMINAL
                  </div>
                </div>
              </div>

              {/* Center AR Trajectory Guidance & Obstacle Tracking Bounding Boxes */}
              <div className="relative my-auto flex items-center justify-center">
                
                {/* AR Dynamic Vector Road Trajectory */}
                {isArLidarOverlay && (
                  <motion.div
                    animate={{
                      x: steeringAngle * -2.4,
                      skewX: steeringAngle * -0.4,
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 18 }}
                    className="relative h-48 w-72 border-b-2 border-emerald-400/80 [clip-path:polygon(30%_0%,70%_0%,100%_100%,0%_100%)] bg-gradient-to-t from-emerald-500/20 via-emerald-500/5 to-transparent flex items-center justify-center"
                  >
                    <div className="h-full w-0.5 border-r border-dashed border-emerald-400/60" />
                    <div className="absolute top-6 font-mono text-[9px] font-bold text-emerald-300 tracking-wider">
                      OPTIMAL AUTONOMOUS TRACK
                    </div>
                  </motion.div>
                )}

                {/* AR Obstacle Bounding Box: Lead Hauler */}
                <motion.div
                  animate={{
                    x: 120 + steeringAngle * -1.2,
                    y: -40,
                  }}
                  className="absolute rounded-lg border-2 border-[#6ce1ff]/80 bg-[#6ce1ff]/10 p-2 font-mono text-[9px] text-[#6ce1ff] backdrop-blur-sm"
                >
                  <div className="flex items-center gap-1 font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#6ce1ff] animate-ping" />
                    HAULER #04 · RANGE: 48.2m
                  </div>
                  <div className="text-[8px] text-slate-300">REL VEL: +2.1 km/h · SAFE GAP</div>
                </motion.div>

                {/* AR Obstacle Bounding Box: Blast Zone Marker */}
                <motion.div
                  animate={{
                    x: -160 + steeringAngle * -1.2,
                    y: -60,
                  }}
                  className="absolute rounded-lg border border-amber-400/80 bg-amber-500/10 p-2 font-mono text-[9px] text-amber-300 backdrop-blur-sm"
                >
                  <div className="font-bold flex items-center gap-1">
                    <AlertTriangle size={11} className="text-amber-400" /> PIT BENCH 04 ENTRANCE
                  </div>
                  <div className="text-[8px] text-slate-300">GRADE: -8.4% · SPEED LIMIT: 45 km/h</div>
                </motion.div>
              </div>

              {/* Bottom In-HUD Center Cluster (Speedometer & Gear) */}
              <div className="flex items-end justify-between">
                
                {/* Left Digital Gauge HUD */}
                <div className="flex items-center gap-4 rounded-3xl border border-white/15 bg-black/80 p-4 backdrop-blur-xl shadow-2xl">
                  <div className="text-center">
                    <div className="text-[9px] font-mono uppercase text-slate-400">GROUND SPEED</div>
                    <div className="text-4xl font-black font-mono tracking-tight text-white">
                      {Math.round(speed)}
                      <span className="text-sm font-normal text-[#ffb35c] ml-1">km/h</span>
                    </div>
                  </div>
                  <div className="h-10 w-[1px] bg-white/15" />
                  <div className="text-center">
                    <div className="text-[9px] font-mono uppercase text-slate-400">ENGINE RPM</div>
                    <div className="text-2xl font-black font-mono tracking-tight text-emerald-400">
                      {calculatedRpm}
                    </div>
                  </div>
                  <div className="h-10 w-[1px] bg-white/15" />
                  <div className="text-center">
                    <div className="text-[9px] font-mono uppercase text-slate-400">DRIVE GEAR</div>
                    <div className="text-2xl font-black font-mono tracking-tight text-[#6ce1ff]">
                      [{gear}]
                    </div>
                  </div>
                </div>

                {/* Right Live Radio Chatter Feed HUD */}
                <div className="max-w-md rounded-2xl border border-white/15 bg-black/80 p-3 font-mono backdrop-blur-xl shadow-2xl">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mb-1 border-b border-white/10 pb-1">
                    <span className="flex items-center gap-1 text-[#ffb35c]">
                      <Radio size={11} className="animate-pulse" />
                      RADIO DISPATCH COMMS CH-04
                    </span>
                    <span>{radioTranscripts[radioLogIndex].time}</span>
                  </div>
                  <div className="text-[10px] text-slate-200 leading-snug">
                    <span className="font-bold text-[#6ce1ff]">
                      {radioTranscripts[radioLogIndex].sender}:
                    </span>{" "}
                    {radioTranscripts[radioLogIndex].text}
                  </div>
                </div>

              </div>

            </div>

            {/* In-Cab Dual Digital Side Mirror Cam PIPs */}
            <div className="pointer-events-none absolute left-4 top-20 z-20 hidden md:block h-32 w-24 rounded-2xl border-2 border-slate-600 bg-black/90 p-1 shadow-2xl overflow-hidden">
              <div className="relative h-full w-full rounded-xl overflow-hidden">
                <Image
                  src="/images/hauler_360_rear.jpg"
                  alt="Left Mirror Cam"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-emerald-500/10" />
                <div className="absolute top-1 left-1 font-mono text-[8px] font-bold text-emerald-300 bg-black/80 px-1 rounded">
                  L-CAM · CLEAR
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute right-4 top-20 z-20 hidden md:block h-32 w-24 rounded-2xl border-2 border-slate-600 bg-black/90 p-1 shadow-2xl overflow-hidden">
              <div className="relative h-full w-full rounded-xl overflow-hidden">
                <Image
                  src="/images/hauler_360_right.jpg"
                  alt="Right Mirror Cam"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-emerald-500/10" />
                <div className="absolute top-1 right-1 font-mono text-[8px] font-bold text-emerald-300 bg-black/80 px-1 rounded">
                  R-CAM · CLEAR
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================= */}
          {/* PHYSICAL OPERATOR CONSOLE DASHBOARD CONTROLS               */}
          {/* ========================================================= */}
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
            
            {/* Left: Gear Selector & Drive Pedal Controls (4 Cols) */}
            <div className="rounded-3xl border border-white/10 bg-[#060a0f] p-5 lg:col-span-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[#ffb35c] uppercase mb-3">
                  TRANSMISSION & DRIVE ACTUATION
                </div>

                {/* Gear Shift Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {(["P", "R", "N", "D"] as GearState[]).map((g) => {
                    const isActive = gear === g;
                    return (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGear(g);
                          triggerAudioBeep( isActive ? 400 : 650 );
                        }}
                        className={`cursor-pointer rounded-xl py-3 font-mono font-black text-lg transition-all ${
                          isActive
                            ? g === "P"
                              ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] scale-105"
                              : g === "R"
                              ? "bg-amber-400 text-black shadow-[0_0_15px_rgba(251,191,36,0.5)] scale-105"
                              : g === "D"
                              ? "bg-emerald-400 text-black shadow-[0_0_15px_rgba(52,211,153,0.5)] scale-105"
                              : "bg-blue-500 text-white shadow-md scale-105"
                            : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Throttle & Brake Pedals */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onMouseDown={() => {
                    setIsBraking(true);
                    triggerAudioBeep(300, "triangle", 0.3);
                  }}
                  onMouseUp={() => setIsBraking(false)}
                  onTouchStart={() => setIsBraking(true)}
                  onTouchEnd={() => setIsBraking(false)}
                  className={`cursor-pointer select-none rounded-2xl border-2 p-4 text-center transition-all ${
                    isBraking
                      ? "border-red-500 bg-red-950/80 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.5)] scale-95"
                      : "border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40"
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider">SERVICE BRAKE</div>
                  <div className="mt-1 text-sm font-black text-white">HOLD TO BRAKE</div>
                </button>

                <button
                  type="button"
                  onMouseDown={() => {
                    setIsAccelerating(true);
                    triggerAudioBeep(550, "sine", 0.4);
                  }}
                  onMouseUp={() => setIsAccelerating(false)}
                  onTouchStart={() => setIsAccelerating(true)}
                  onTouchEnd={() => setIsAccelerating(false)}
                  className={`cursor-pointer select-none rounded-2xl border-2 p-4 text-center transition-all ${
                    isAccelerating
                      ? "border-emerald-400 bg-emerald-950/80 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-95"
                      : "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40"
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold uppercase tracking-wider">THROTTLE ACCEL</div>
                  <div className="mt-1 text-sm font-black text-white">HOLD TO DRIVE</div>
                </button>
              </div>
            </div>

            {/* Middle: Interactive Steering Wheel & Angle Controller (4 Cols) */}
            <div className="rounded-3xl border border-white/10 bg-[#060a0f] p-5 lg:col-span-4 shadow-xl flex flex-col justify-between text-center">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-[#6ce1ff] uppercase">
                <span>ARTICULATED STEERING</span>
                <span className="text-white font-bold">{steeringAngle > 0 ? `+${steeringAngle}° RIGHT` : steeringAngle < 0 ? `${steeringAngle}° LEFT` : "0.0° CENTER"}</span>
              </div>

              {/* Steering Wheel Graphic */}
              <div className="my-3 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: steeringAngle }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative h-28 w-28 rounded-full border-4 border-slate-600 bg-gradient-to-br from-slate-800 to-black p-2 shadow-2xl flex items-center justify-center"
                >
                  <div className="h-full w-full rounded-full border border-dashed border-[#ffb35c]/50 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-[#ffb35c] text-black font-mono font-black text-[9px] flex items-center justify-center shadow-lg">
                      MINE
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Steering Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="-35"
                  max="35"
                  value={steeringAngle}
                  onChange={(e) => setSteeringAngle(Number(e.target.value))}
                  className="w-full accent-[#ffb35c] cursor-pointer"
                />
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500">
                  <button type="button" onClick={() => setSteeringAngle(-25)} className="hover:text-white">-25° HARD LEFT</button>
                  <button type="button" onClick={() => setSteeringAngle(0)} className="text-amber-400 font-bold hover:underline">RESET CENTER (0°)</button>
                  <button type="button" onClick={() => setSteeringAngle(25)} className="hover:text-white">+25° HARD RIGHT</button>
                </div>
              </div>
            </div>

            {/* Right: Aux Cabin Systems & Safety Emergency E-Stop (4 Cols) */}
            <div className="rounded-3xl border border-white/10 bg-[#060a0f] p-5 lg:col-span-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase mb-3">
                  CABIN ACCESSORIES & HARD E-STOP
                </div>

                {/* Aux Toggle Switches */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsWiperActive((prev) => !prev);
                      triggerAudioBeep(500);
                    }}
                    className={`cursor-pointer rounded-xl border p-2.5 text-[10px] font-mono font-bold uppercase transition-all ${
                      isWiperActive
                        ? "border-cyan-400 bg-cyan-950/60 text-cyan-300"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    WIPERS: {isWiperActive ? "ACTIVE" : "OFF"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHighBeams((prev) => !prev);
                      triggerAudioBeep(550);
                    }}
                    className={`cursor-pointer rounded-xl border p-2.5 text-[10px] font-mono font-bold uppercase transition-all ${
                      isHighBeams
                        ? "border-amber-400 bg-amber-950/60 text-amber-300 shadow-md"
                        : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    HIGH BEAMS: {isHighBeams ? "ON" : "OFF"}
                  </button>
                </div>
              </div>

              {/* Massive Industrial E-STOP Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEmergencyStopped((prev) => !prev);
                    triggerAudioBeep(220, "sawtooth", 0.6);
                  }}
                  className={`cursor-pointer w-full rounded-2xl border-2 py-3.5 px-4 font-mono font-black text-xs uppercase tracking-widest transition-all ${
                    isEmergencyStopped
                      ? "border-red-500 bg-red-600 text-white shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse"
                      : "border-red-600/40 bg-red-950/40 text-red-400 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Power size={14} />
                    <span>{isEmergencyStopped ? "EMERGENCY E-STOP TRIPPED (CLICK TO RESET)" : "EMERGENCY HARD E-STOP"}</span>
                  </div>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
