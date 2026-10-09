'use client';

import { useState } from "react";
import { Menu, X, Zap } from "lucide-react";

interface NavbarProps {
  onOpenDemo?: () => void;
}

const navItems = [
  { name: "Overview", href: "#experience" },
  { name: "Dashboard", href: "#dashboard" },
  { name: "Fleet 3D CAD", href: "#interactive-3d" },
  { name: "Journey", href: "#journey" },
  { name: "Digital Twin", href: "#digital-twin" },
  { name: "Dispatch Map", href: "#fleet-dispatch" },
  { name: "Safety & AI", href: "#safety" },
];

export default function Navbar({ onOpenDemo }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#05070a]/90 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo - Fixed No Shrink */}
        <a href="#experience" className="flex shrink-0 items-center gap-3 pr-4 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#ffb35c]/60 bg-[#ffb35c]/15 text-xs font-black text-[#ffb35c] shadow-[0_0_15px_rgba(255,179,92,0.3)] transition group-hover:scale-105">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-[0.25em] text-white">MINETECH</span>
            <span className="text-[8px] font-mono tracking-widest text-[#6ce1ff]">3D SMART MINING</span>
          </div>
        </a>

        {/* Desktop Navigation Links - Single line, clean spacing */}
        <nav className="hidden items-center gap-1 xl:gap-2 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300 transition-colors hover:bg-white/5 hover:text-[#ffb35c]"
            >
              {item.name}
            </a>
          ))}
        </nav>

        {/* Right CTA Button - Fixed No Shrink */}
        <div className="hidden shrink-0 items-center pl-4 sm:flex">
          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#ffb35c] px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0a0d11] shadow-[0_0_25px_rgba(255,179,92,0.35)] transition-all hover:brightness-110 active:scale-95 whitespace-nowrap"
          >
            <Zap size={14} className="fill-black" />
            <span>LAUNCH SIMULATOR</span>
          </button>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#ffb35c] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-black sm:hidden"
          >
            <Zap size={12} fill="black" /> SIM
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#05070a]/98 px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2 hover:bg-white/5 hover:text-[#ffb35c]"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-3">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  onOpenDemo?.();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffb35c] py-3 text-xs font-bold uppercase tracking-[0.18em] text-black shadow-lg"
              >
                <Zap size={14} fill="black" /> LAUNCH SIMULATOR
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
