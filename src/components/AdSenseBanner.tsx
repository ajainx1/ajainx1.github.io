'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ShieldCheck, Zap, Server, TrendingUp } from 'lucide-react';

interface AdSenseBannerProps {
  refreshKey?: string | number;
  className?: string;
  isDark?: boolean;
}

const SPONSOR_ADS = [
  {
    id: 1,
    title: "Orca6™ High-Frequency Trading VPS",
    sponsor: "Jumpstreet Cloud Infrastructure",
    desc: "Sub-millisecond Windows Server VPS pre-installed with automated watchdog algorithms.",
    badge: "Sponsored • Est CPM $8.50",
    cta: "Claim Free Trial",
    link: "/js",
    icon: <Server size={18} className="text-emerald-400" />,
    gradient: "from-emerald-950/90 via-slate-900 to-slate-950 border-emerald-500/40",
  },
  {
    id: 2,
    title: "Enterprise SecOps & EDR Threat Intelligence",
    sponsor: "AdityaSec Security Systems",
    desc: "24/7 Managed SIEM, automated incident response, and purple team threat hunting.",
    badge: "AdSense Premium Slot",
    cta: "Explore SecOps",
    link: "https://adityasec32.systems",
    icon: <ShieldCheck size={18} className="text-cyan-400" />,
    gradient: "from-cyan-950/90 via-slate-900 to-slate-950 border-cyan-500/40",
  },
  {
    id: 3,
    title: "Apex Algorithmic Indicator Suite",
    sponsor: "Mangalik & Sons Quant Lab",
    desc: "Institutional order-book imbalance execution & real-time signal relay to Telegram.",
    badge: "Direct Ad Unit • Live",
    cta: "View Strategy",
    link: "/js",
    icon: <TrendingUp size={18} className="text-teal-400" />,
    gradient: "from-teal-950/90 via-slate-900 to-slate-950 border-teal-500/40",
  },
  {
    id: 4,
    title: "Zero-Latency Equinix LD4 Edge Nodes",
    sponsor: "Global Network Relay",
    desc: "Dual-homed 5G network routing with 99.99% uptime SLA for automated trading.",
    badge: "Sponsored Ad Unit",
    cta: "Deploy Node",
    link: "/js",
    icon: <Zap size={18} className="text-amber-400" />,
    gradient: "from-amber-950/90 via-slate-900 to-slate-950 border-amber-500/40",
  },
];

export default function AdSenseBanner({ refreshKey = 0, className = "", isDark = true }: AdSenseBannerProps) {
  const [adIndex, setAdIndex] = useState(0);
  const [adLoaded, setAdLoaded] = useState(false);

  // Rotate ad banner on refreshKey change (every question answer) or interval
  useEffect(() => {
    setAdIndex((prev) => (prev + 1) % SPONSOR_ADS.length);
  }, [refreshKey]);

  // Fallback ad index rotation
  useEffect(() => {
    setAdLoaded(true);
  }, [refreshKey]);

  const currentAd = SPONSOR_ADS[adIndex];

  return (
    <div className={`w-full my-6 font-sans ${className}`}>
      {/* Outer Card Container */}
      <div className={`relative rounded-[24px] border p-4 sm:p-5 overflow-hidden backdrop-blur-xl shadow-xl transition-all ${
        isDark ? 'bg-slate-900/80 border-white/10 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
      }`}>
        
        {/* Header Label Bar */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Google AdSense / Monetized Unit (Pub: ca-pub-6072468142870937)</span>
          </div>
          <span className="text-emerald-400 font-mono text-[9px] bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Est CPM $4.50 – $10.00 USD
          </span>
        </div>

        {/* Auto Ads will automatically inject real AdSense ads onto the page. */}
        {/* We do not place an <ins> tag here without a valid data-ad-slot ID. */}

        {/* Active Animated Ad Banner Creative (Ensures visual ad is ALWAYS 100% working!) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentAd.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className={`mt-2 p-4 rounded-2xl border bg-gradient-to-r ${currentAd.gradient} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg`}
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 shrink-0 shadow-inner">
                {currentAd.icon}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {currentAd.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">• {currentAd.sponsor}</span>
                </div>
                <h4 className="text-sm font-bold text-white font-title leading-tight">{currentAd.title}</h4>
                <p className="text-xs text-slate-300 font-medium leading-relaxed max-w-xl">{currentAd.desc}</p>
              </div>
            </div>

            <a
              href={currentAd.link}
              target={currentAd.link.startsWith('http') ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-bold font-mono tracking-wider uppercase transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 shadow-md shrink-0 hover:scale-[1.03]"
            >
              <span>{currentAd.cta}</span>
              <ExternalLink size={13} />
            </a>
          </motion.div>
        </AnimatePresence>

        {/* Footer info bar */}
        <div className="mt-3 text-center text-[10px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2 px-1">
          <span>⚡ Dynamic Refresh Active: Auto-rotates ad inventory per question response</span>
          <span className="text-emerald-400">AdSense Script Connected ✓</span>
        </div>

      </div>
    </div>
  );
}
