"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Award, User, ShieldAlert, Cpu, Globe, Moon, Sun } from "lucide-react";
import TiltWrapper from "@/components/3d/TiltWrapper";

export default function GatewayPage() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("jumpstreet_theme") !== "light";
    setIsDark(isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem("jumpstreet_theme", nextDark ? "dark" : "light");
    document.body.classList.toggle("light-mode", !nextDark);
  };

  const portalCards = [
    {
      title: "Security Engineering Portfolio",
      subtitle: "SecOps // Audits // Hardening",
      description: "Detailed enterprise security engineering profile, threat hunting competencies, Active Directory hardening logs, and national e-governance systems audit records.",
      link: "/portfolio",
      icon: User,
      cta: "Explore Portfolio",
      color: "from-[#38bdf8]/10 to-[#0284c7]/5",
      borderColor: "border-[#38bdf8]/30",
      glowColor: "shadow-[#38bdf8]/10",
      textColor: "text-[#38bdf8]",
    },
    {
      title: "JumpStreet Trading Portal",
      subtitle: "HFT Bot // Alert Webhooks // Cloud VM",
      description: "High-frequency algorithmic trading configurations, 1.2ms latency alert webhooks, and secure cloud-hosted Windows VM setup modules.",
      link: "/js",
      icon: Cpu,
      cta: "Configure Portal",
      color: "from-indigo-600/10 to-indigo-950/5",
      borderColor: "border-indigo-500/30",
      glowColor: "shadow-indigo-500/10",
      textColor: "text-indigo-400",
    },
    {
      title: "Cyber FreeRice Challenge",
      subtitle: "Threat Intel Trivia // Feed The Hungry",
      description: "Interactive gamified cybersecurity compliance and threat intelligence trivia. Feed the hungry by donating grain milestones.",
      link: "/charity-quiz",
      icon: Award,
      cta: "Play & Feed Grains",
      color: "from-emerald-600/10 to-emerald-950/5",
      borderColor: "border-emerald-500/30",
      glowColor: "shadow-emerald-500/10",
      textColor: "text-emerald-400",
    }
  ];

  return (
    <div className={`min-h-screen relative flex flex-col items-center justify-between font-sans selection:bg-[#38bdf8] selection:text-[#0b0f19] overflow-x-hidden ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Top Header Navbar */}
      <header className={`w-full z-50 border-b px-6 py-4 backdrop-blur-xl flex items-center justify-between transition-colors ${isDark ? 'bg-[#0b0f19]/40 border-slate-800/60' : 'bg-slate-50/40 border-slate-200'}`}>
        <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider text-[#38bdf8]">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          SEC_CORE // GATEWAY HUB
        </div>
        <div className="flex items-center gap-4">
          {/* Quick links header */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
            <Link href="/noc/" className="hover:text-[#38bdf8] transition-colors">NOC Portal</Link>
            <Link href="/alert/" className="hover:text-[#38bdf8] transition-colors">Alert Monitor</Link>
          </nav>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${isDark ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-black'}`}
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Portal Section */}
      <main className="flex-1 w-full max-w-7xl px-6 py-12 md:py-24 flex flex-col items-center justify-center relative z-10">
        
        {/* Hub Titles */}
        <div className="text-center max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-black font-title tracking-tight mb-4 bg-gradient-to-r from-[#38bdf8] via-slate-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            Select Systems Gateway
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-mono leading-relaxed">
            Welcome to the security operations and engineering directory. Access specialized terminals below.
          </p>
        </div>

        {/* 3D Interactive Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {portalCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <TiltWrapper key={i} tiltDeg={5}>
                <Link
                  href={card.link}
                  className={`group block h-full p-8 rounded-3xl border bg-gradient-to-br ${card.color} ${card.borderColor} backdrop-blur-md shadow-lg ${card.glowColor} hover:scale-[1.02] transition-all duration-300 relative overflow-hidden`}
                >
                  {/* Sheen sweep */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                  
                  {/* Card Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-950/40 border ${card.borderColor} ${card.textColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Info */}
                  <div className="mb-2 text-[10px] font-mono font-bold tracking-widest uppercase text-slate-500">
                    {card.subtitle}
                  </div>
                  <h3 className="text-xl font-bold font-title text-white mb-3 tracking-tight group-hover:text-[#38bdf8] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans mb-8">
                    {card.description}
                  </p>

                  {/* Link CTA */}
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider mt-auto text-white">
                    <span>{card.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#38bdf8]" />
                  </div>
                </Link>
              </TiltWrapper>
            );
          })}
        </div>
      </main>

      {/* Professional Footer Navigation */}
      <footer className="w-full max-w-7xl px-6 py-8 border-t border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-500 mt-12 z-10">
        <div>
          © 2026 Aditya Jain. All Rights Reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          <Link href="/portfolio" className="hover:text-white transition-colors">Portfolio</Link>
          <Link href="/js" className="hover:text-white transition-colors">JumpStreet</Link>
          <Link href="/charity-quiz" className="hover:text-white transition-colors">Charity Quiz</Link>
          <Link href="/noc/" className="hover:text-white transition-colors">State NOC</Link>
          <Link href="/alert/" className="hover:text-white transition-colors">Threat Monitor</Link>
        </div>
      </footer>
    </div>
  );
}
