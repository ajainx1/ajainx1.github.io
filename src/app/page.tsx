"use client";

import { motion } from "framer-motion";
import { Terminal, Shield, Network, Server, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      
      {/* Abstract Background Elements (21st.dev style) */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
        <div className="absolute top-[20%] left-[20%] w-72 h-72 bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-[var(--amber)] rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border2)] bg-[var(--card)]/50 backdrop-blur-md shadow-sm mb-4"
        >
          <Shield className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-medium tracking-wide">SME Cybersecurity Engineer</span>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold font-title tracking-tight text-[var(--fg)]">
          Aditya <span className="text-[var(--primary)]">Jain</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed">
          Results-driven Cybersecurity SME with 5+ years of enterprise experience in SecOps, Purple Teaming, and AI Automation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Link href="/js" className="group relative px-6 py-3 font-semibold text-[var(--bg)] bg-[var(--primary)] rounded-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[var(--primary-glow)] shadow-lg flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            <span>JumpStreet Portal</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link href="/charity-quiz" className="group relative px-6 py-3 font-semibold text-white bg-emerald-600 rounded-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500 shadow-lg flex items-center gap-2">
            <span className="text-xl">🎮</span>
            <span>Play Charity Quiz</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link href="/live.html" className="px-6 py-3 font-semibold text-[var(--fg)] bg-[var(--card2)] border border-[var(--border2)] rounded-lg hover:bg-[var(--card)] transition-colors shadow-sm">
            View Full Portfolio
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-[var(--border)]"
        >
          {[
            { label: "Years SecOps", value: "5+" },
            { label: "Govt Endpoints", value: "750+" },
            { label: "Audits Automated", value: "120+" },
            { label: "Effort Saved", value: "60%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-4 bg-[var(--card)]/30 rounded-xl border border-[var(--border)] backdrop-blur-sm">
              <span className="text-3xl font-bold text-[var(--primary)] font-mono">{stat.value}</span>
              <span className="text-sm text-[var(--muted)] font-medium mt-1 uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </main>
  );
}
