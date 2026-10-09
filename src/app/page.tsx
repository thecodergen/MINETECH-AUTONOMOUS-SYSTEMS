'use client';

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import RealTimeMiningBar from "@/components/ui/RealTimeMiningBar";
import HeroSection from "@/components/sections/HeroSection";
import Interactive3DExplorer from "@/components/sections/Interactive3DExplorer";
import TeleRemoteCockpitHUD from "@/components/sections/TeleRemoteCockpitHUD";
import MiningJourney from "@/components/sections/MiningJourney";
import DigitalTwinSection from "@/components/sections/DigitalTwinSection";
import FleetDispatchSimulator from "@/components/sections/FleetDispatchSimulator";
import MiningDashboard from "@/components/sections/MiningDashboard";
import AIIntelligence from "@/components/sections/AIIntelligence";
import SafetySection from "@/components/sections/SafetySection";
import TechnologySection from "@/components/sections/TechnologySection";
import ExternalEcosystem from "@/components/sections/ExternalEcosystem";
import FinalCTA from "@/components/sections/FinalCTA";
import DemoModal from "@/components/ui/DemoModal";

export default function Home() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#040608] text-slate-50 selection:bg-[#ffb35c] selection:text-black">
      {/* Dynamic 3D Volumetric Background Lighting Cones */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(255,179,92,0.14),transparent_40%),radial-gradient(circle_at_85%_35%,_rgba(108,225,255,0.08),transparent_35%),radial-gradient(circle_at_15%_75%,_rgba(255,179,92,0.06),transparent_30%)]" />

      {/* Real-time Mining Intelligence Ticker Bar */}
      <RealTimeMiningBar />

      {/* Main Top Navigation */}
      <Navbar onOpenDemo={() => setDemoOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10 overflow-hidden">
        <HeroSection onOpenDemo={() => setDemoOpen(true)} />
        <Interactive3DExplorer />
        <TeleRemoteCockpitHUD />
        <MiningJourney />
        <DigitalTwinSection />
        <FleetDispatchSimulator />
        <MiningDashboard />
        <AIIntelligence />
        <SafetySection />
        <TechnologySection />
        <ExternalEcosystem />
        <FinalCTA onOpenDemo={() => setDemoOpen(true)} />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-[#030508] py-10 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p>© 2026 MINETECH AUTONOMOUS SYSTEMS INC. ALL RIGHTS RESERVED.</p>
          <p className="mt-2 text-[10px] font-mono tracking-widest text-slate-600">
            ENGINEERED WITH HIGH-PRECISION GEOSPATIAL TELEMETRY & 3D DIGITAL TWIN ARCHITECTURE
          </p>
        </div>
      </footer>

      {/* Interactive Fleet Simulator & Lead Demo Modal */}
      <DemoModal isOpen={demoOpen} onClose={() => setDemoOpen(false)} />
    </div>
  );
}
