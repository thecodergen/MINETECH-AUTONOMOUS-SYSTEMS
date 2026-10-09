# MineTech Autonomous Systems & Digital Twin SCADA Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.0-ff0055?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Status](https://img.shields.io/badge/Deployment-Operational-00E676?style=for-the-badge)]()

---

## 🌟 Executive Overview

**MineTech Autonomous Systems** is a next-generation Industrial IoT, Digital Twin, and Autonomous Fleet SCADA platform engineered for ultra-heavy open-pit and subterranean mining operations. Built with **Next.js 16 (Turbopack)**, **React 19**, **Framer Motion**, and **Three.js**, it delivers real-time machine telemetry, 360° interactive CAD turntable inspection, dynamic tactical route dispatching, and emergency fail-safe simulation.

---

## 🚀 Key Interactive Systems

### 1. 🔍 Unified 3D CAD Studio & Live Mine Sector Deployment
- **360° Studio Turntable**: Smooth drag-to-rotate interaction across multi-angle studio renders (Front, Quarter 45°, Profile, Rear 180°).
- **Subsystem Click-to-Zoom**: Precision spring camera locking with target reticle for core components (C32 Quad-Turbo Engine, 128-Beam LiDAR Mast, 55m³ Rock Bucket, 18.3m Lattice Drill Mast, LHD Battery Packs).
- **Live Mine Deployment Toggle**: Instant one-click transition from studio clean-room CAD to real-world active pit benches and subterranean tunnels.

### 2. 🚛 Autonomous Fleet Dispatch & Scenario Simulator
- **Live Open-Pit Tactical Map**: Real-time animated autonomous haul trucks navigating active haulage sectors from Pit Face Alpha to Crusher 01.
- **Dynamic SCADA Feed**: Real-time velocity gauges, payload meters, engine RPM, GPS coordinates, and proximity safety halos.
- **4 Emergency Scenario Triggers**:
  - ⚠️ **Rockfall Hazard Detected**: Instantly stops trucks in Sector 4, reroutes oncoming haulers to Bypass Beta, and issues emergency dispatch alarms.
  - 🛑 **Sub-Surface Methane Gas Surge**: Halts drill operations, starts high-volume auxiliary ventilation (650 m³/s), and enforces safety zone isolation.
  - 🔥 **Tire Thermal Overheat (>115°C)**: Limits maximum speed to 15 km/h and dispatches hauler to mobile cooling bay.
  - ✅ **Normal Production Dispatch**: Resumes optimal throughput routing at nominal speeds.

### 3. 🛡️ Subterranean Safety & Environmental Guardian
- Real-time subterranean air purity monitoring (99.4%), temperature gradient (24.8°C), personnel proximity radar, and micro-seismic stability tracking.
- Live zone compliance gauges for haul road clearance, ventilation flow, geofencing, and emergency beacon links.

### 4. 📊 Real-Time SCADA Telemetry & Industrial Dashboard
- Real-time pit extraction metrics ($24.8\text{k}$ Tonnes / Shift).
- Fleet autonomous availability rate ($98.4\%$).
- Millisecond-level sensor synchronization with ISO 16/13 hydraulic quality, TPMS pressure, and RTK-GNSS positioning.

---

## 🚜 Heavy Equipment Fleet Roster

| Machine Unit | Operational Role | Payload / Capacity | Monitored Operating Temperatures | Key Subsystems Monitored |
| :--- | :--- | :--- | :--- | :--- |
| **CAT 797F Autonomous Truck** | Surface Haulage | 360 Tonnes (400 Tons) | Engine: $245^\circ\text{C}$ · Hoist: $114^\circ\text{C}$ | C32 V16 Engine, Dual LiDAR/GNSS, 3-Stage Hoist, 63" Titan Tires |
| **996B Hydraulic Shovel** | Primary Extraction | 55m³ Rock Bucket (95T/pass) | Cummins QSK60: $245^\circ\text{C}$ · Rams: $114^\circ\text{C}$ | 55m³ Bucket, Twin Boom Rams, Crawler Tracks, Dual QSK60 Units |
| **PV-271 Rotary Drill** | Blast Preparation | 350mm Hole Diameter | Compressor: $242^\circ\text{C}$ · Rotary: $114^\circ\text{C}$ | 18.3m Lattice Mast, High-Torque Rotary Head, Leveling Jacks |
| **Subterranean LHD Loader** | Deep Drift Extraction | 18.0 Tonnes Scoop | Battery/Inverter: $242^\circ\text{C}$ · Rams: $114^\circ\text{C}$ | Low-Profile Scoop, LFP 340kWh Battery Bank, Articulation Hitch |

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router & Turbopack
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark SCADA color tokens
- **Animations & Physics**: [Framer Motion](https://www.framer.com/motion/) (Spring transitions, layout morphing, draggable dials)
- **3D Graphics & Canvas**: [Three.js](https://threejs.org/) & [Lucide Icons](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-checking)

---

## 📂 Repository Architecture

```text
3d-mining/
├── public/
│   └── images/                     # 2K photorealistic studio & live mine renders
│       ├── hauler_pbr_studio.jpg   # CAT 797F 360° Studio angles
│       ├── excavator_pbr_studio.jpg# 996B Hydraulic Excavator renders
│       ├── drill_pbr_studio.jpg    # PV-271 Drill Rig renders
│       ├── lhd_pbr_studio.jpg      # Subterranean LHD Loader renders
│       ├── mining_haul_truck.jpg   # Live mine deployment views
│       ├── mining_excavator.jpg
│       ├── mining_drill_rig.jpg
│       └── underground_tunnel.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML & SCADA Theme layout
│   │   ├── page.tsx                # Master orchestration homepage
│   │   └── globals.css             # Glassmorphic CSS tokens & keyframes
│   └── components/
│       ├── sections/
│       │   ├── Interactive3DExplorer.tsx  # 360° CAD & Live Mine Subsystem Inspector
│       │   ├── FleetDispatchSimulator.tsx # Tactical Map & Emergency Scenarios
│       │   ├── SafetySection.tsx          # Subterranean Zero-Harm Safety Guardian
│       │   ├── AIIntelligence.tsx         # Autonomous AI dispatch neural routing
│       │   ├── HeroSection.tsx            # Hero visual header
│       │   ├── MiningDashboard.tsx        # SCADA Telemetry grids
│       │   └── DigitalTwinSection.tsx     # Digital twin architecture overview
│       └── ui/
│           ├── Navbar.tsx                 # Navigation bar
│           ├── RealTimeMiningBar.tsx      # Ticker & live shift stats
│           └── DemoModal.tsx              # Interactive demo booking modal
├── PROJECT_REPORT.md               # Detailed engineering and architecture report
└── README.md                       # Repository overview and documentation
```

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
