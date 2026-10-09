'use client';

import { ExternalLink, Globe, Shield, Terminal, TrendingUp, Cpu, Video, MessageSquare, Share2, Code2 } from "lucide-react";
import { motion } from "framer-motion";

const externalCategories = [
  {
    category: "GLOBAL MARKET & EXCHANGES",
    color: "#ffb35c",
    links: [
      {
        title: "London Metal Exchange (LME)",
        desc: "World centre for industrial metals trading and pricing benchmarks.",
        url: "https://www.lme.com",
        badge: "MARKETS",
      },
      {
        title: "Mining.com Intelligence",
        desc: "Global mining news, mineral commodity data, and technological breakthroughs.",
        url: "https://www.mining.com",
        badge: "NEWS & DATA",
      },
      {
        title: "International Council on Mining & Metals (ICMM)",
        desc: "Global leadership in sustainable, zero-harm, and responsible mining practices.",
        url: "https://www.icmm.com",
        badge: "STANDARDS",
      },
      {
        title: "Global Mining Guidelines Group (GMG)",
        desc: "Collaborative operational standards for autonomous mining and AI telemetry.",
        url: "https://gmggroup.org",
        badge: "GUIDELINES",
      },
    ],
  },
  {
    category: "AUTONOMOUS TECH & HARDWARE ALLIANCES",
    color: "#6ce1ff",
    links: [
      {
        title: "Caterpillar MineStar Solutions",
        desc: "Industry-leading Cat autonomous haulage and Command fleet systems.",
        url: "https://www.cat.com/en_US/products/new/technology/minestar.html",
        badge: "HAUL FLEET",
      },
      {
        title: "Komatsu Autonomous Haulage (AHS)",
        desc: "Pioneering unmanned super-class haul truck systems in mega-quarries.",
        url: "https://www.komatsu.com",
        badge: "AUTONOMY",
      },
      {
        title: "NVIDIA Omniverse Digital Twin",
        desc: "Physically accurate simulation platform for industrial geospatial twins.",
        url: "https://www.nvidia.com/en-us/omniverse/",
        badge: "DIGITAL TWIN",
      },
      {
        title: "Trimble Geospatial & LiDAR",
        desc: "High-precision GNSS positioning, 3D laser scanning, and quarry survey tools.",
        url: "https://geospatial.trimble.com",
        badge: "TELEMETRY",
      },
    ],
  },
];

const socialLinks = [
  { name: "LinkedIn", icon: Share2, url: "https://www.linkedin.com" },
  { name: "Twitter / X", icon: MessageSquare, url: "https://twitter.com" },
  { name: "YouTube Tech Channel", icon: Video, url: "https://www.youtube.com" },
  { name: "GitHub Open Protocol", icon: Code2, url: "https://github.com" },
];

export default function ExternalEcosystem() {
  return (
    <section id="ecosystem" className="relative scroll-mt-20 px-4 pt-4 pb-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ce1ff]/30 bg-[#6ce1ff]/10 px-3 py-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-[#6ce1ff]">
              <Globe size={11} /> EXTERNAL INDUSTRY ECOSYSTEM
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-4xl">
              Connected Mining Network & Portals
            </h2>
            <p className="mt-1.5 max-w-2xl text-xs text-slate-300">
              Explore live global commodity exchanges, autonomous fleet documentation, international safety standards, and partner websites.
            </p>
          </div>

          {/* Social Follow Network */}
          <div className="flex flex-wrap items-center gap-3">
            {socialLinks.map((s) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-[#080d14] px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-[#ffb35c] hover:bg-[#ffb35c]/10 hover:text-[#ffb35c]"
                >
                  <Icon size={14} />
                  <span>{s.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {externalCategories.map((group) => (
            <div
              key={group.category}
              className="rounded-[32px] border border-white/10 bg-[#060a0f] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: group.color }}>
                  {group.category}
                </p>
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  VERIFIED EXTERNAL LINKS
                </span>
              </div>

              <div className="space-y-4">
                {group.links.map((link) => (
                  <motion.a
                    key={link.title}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ x: 6 }}
                    className="group block rounded-2xl border border-white/10 bg-[#091018] p-4 transition-all hover:border-white/30 hover:bg-[#0d1622]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-[#ffb35c]">
                            {link.title}
                          </span>
                          <span className="rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-slate-400">
                            {link.badge}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-slate-400">
                          {link.desc}
                        </p>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition group-hover:border-[#ffb35c] group-hover:bg-[#ffb35c] group-hover:text-black">
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
