"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, ArrowRight, Server, Shield, Cloud, Terminal, LogOut } from "lucide-react";
import Link from "next/link";
import TiltWrapper from "@/components/3d/TiltWrapper";

interface DomainResource {
  name: string;
  url: string;
  description: string;
  tags: string[];
}

const domainResources: DomainResource[] = [
  {
    name: "DigitalPlat",
    url: "https://domain.digitalplat.org",
    description: "Free subdomains for experimental developer projects and static sites.",
    tags: ["Subdomain", "Static Hosting", "Web3 Demo"]
  },
  {
    name: "DNSHE",
    url: "https://www.dnshe.com/",
    description: "Free subdomain registration across multiple domain suffixes, with fully custom nameserver support. Excellent for configuring ALIAS/CNAME records for nodes.",
    tags: ["Custom Nameservers", "Subdomain", "DNS Management"]
  },
  {
    name: "isroot.in",
    url: "https://isroot.in",
    description: "Free isroot.in subdomains tailored for the developer community.",
    tags: ["Community", "Subdomain", "Developer Focus"]
  },
  {
    name: "pp.ua",
    url: "https://nic.ua/",
    description: "Free pp.ua subdomains, often utilized for small-scale personal blogs and proof-of-concept decentralized applications.",
    tags: ["TLD/Sub", "Personal Projects", "PoC"]
  }
];

export default function FreeDomainsPage() {
  const [isDark, setIsDark] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Sync theme
    const isDarkMode = localStorage.getItem("jumpstreet_theme") !== "light";
    setIsDark(isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);

    // Sync wallet
    const savedWallet = localStorage.getItem("web3_wallet_address");
    if (savedWallet) setWalletAddress(savedWallet);

    const handleStorageChange = () => {
      const w = localStorage.getItem("web3_wallet_address");
      setWalletAddress(w || null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDisconnect = () => {
    setWalletAddress(null);
    localStorage.removeItem("web3_wallet_address");
    localStorage.removeItem("web3_wallet_balance");
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className={`min-h-screen relative flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-[#0a0f0d] text-emerald-50' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Gradients */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[120px]" />
        </div>
      )}

      {/* Header */}
      <header className={`w-full z-50 border-b px-6 py-4 backdrop-blur-xl flex items-center justify-between transition-colors ${isDark ? 'bg-[#0b0f19]/80 border-slate-800/60' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <Link href="/" className={`p-2 rounded-lg border transition-colors ${isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-200 hover:bg-slate-100 text-slate-600'}`}>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </Link>
          <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-wider text-amber-500">
            <Globe className="w-4 h-4" />
            FREE_DOMAINS // PORTAL
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {walletAddress ? (
            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border ${isDark ? 'bg-[#050a07] border-emerald-950/60' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className={`text-xs font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-slate-700'}`}>
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </span>
              <button onClick={handleDisconnect} className="ml-2 text-rose-500 hover:text-rose-400 transition-colors" title="Disconnect">
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold ${isDark ? 'bg-rose-950/20 border-rose-900/40 text-rose-500' : 'bg-rose-50 border-rose-200 text-rose-600'}`}>
              DISCONNECTED
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-12 relative z-10 flex flex-col gap-10">
        
        {/* Banner Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full p-8 md:p-12 rounded-3xl border relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-[#0c1510]/50 to-[#0a0f0d] border-emerald-950/60 shadow-xl' : 'bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-md'}`}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-black font-title tracking-tight mb-4 bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">
              Free Developer Domains
            </h1>
            <p className={`text-sm md:text-base font-mono leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Build, test, and deploy decentralized apps, nodes, and Web3 frontends without the friction of domain costs. Sourced from the globally curated <code className="bg-slate-800/50 px-1.5 py-0.5 rounded text-amber-400">free-for.dev</code> registry, these providers offer generous free tiers for infrastructure practitioners.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isDark ? 'bg-emerald-950/40 border-emerald-900/50 text-emerald-400' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                <Server className="w-3 h-3" /> Nameserver Support
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isDark ? 'bg-indigo-950/40 border-indigo-900/50 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                <Shield className="w-3 h-3" /> SSL/TLS Ready
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${isDark ? 'bg-purple-950/40 border-purple-900/50 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                <Cloud className="w-3 h-3" /> DevOps Friendly
              </span>
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {domainResources.map((resource, idx) => (
            <TiltWrapper key={idx} tiltDeg={3}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`h-full p-8 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-lg relative overflow-hidden group ${isDark ? 'bg-[#0b1016]/80 border-slate-800/60 hover:border-amber-500/40' : 'bg-white border-slate-200 hover:border-amber-400'}`}
              >
                {/* Hover Sweep */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                <div>
                  <div className="flex items-start justify-between mb-4">
                    <h2 className="text-2xl font-black font-title tracking-tight text-amber-500 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-amber-500/70" />
                      {resource.name}
                    </h2>
                  </div>
                  
                  <p className={`text-sm font-mono leading-relaxed mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {resource.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {resource.tags.map(tag => (
                      <span key={tag} className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider border ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border group-hover:scale-[1.02] ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'}`}
                >
                  <Terminal className="w-4 h-4" />
                  Claim Domain
                </a>
              </motion.div>
            </TiltWrapper>
          ))}
        </div>

      </main>
    </div>
  );
}
