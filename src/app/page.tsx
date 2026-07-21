"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, Award, User, ShieldAlert, Cpu, Globe, Moon, Sun, Wallet, Copy, Check, LogOut, ChevronDown, Activity, Bell, ShoppingCart, Heart, Menu } from "lucide-react";

export default function GatewayPage() {
  const [isDark, setIsDark] = useState(true);
  
  // Web3 Connection States
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("0.00 ETH");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  
  // Telemetry States
  const [blockHeight, setBlockHeight] = useState<number>(19482917);
  const [gasPrice, setGasPrice] = useState<number>(21);
  const [netLoad, setNetLoad] = useState<number>(14);

  // Sync theme & wallet state on mount
  useEffect(() => {
    // For this cinematic page, we heavily encourage dark mode. 
    // We will sync it, but the styling will be dark-dominant.
    const isDarkMode = localStorage.getItem("jumpstreet_theme") !== "light";
    setIsDark(isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);

    const savedWallet = localStorage.getItem("web3_wallet_address");
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletBalance(localStorage.getItem("web3_wallet_balance") || "1.42 ETH");
    }

    const blockInterval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
    }, 12000);

    const telemetryInterval = setInterval(() => {
      setGasPrice(Math.floor(18 + Math.random() * 10));
      setNetLoad(Math.floor(10 + Math.random() * 8));
    }, 5000);

    return () => {
      clearInterval(blockInterval);
      clearInterval(telemetryInterval);
    };
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem("jumpstreet_theme", nextDark ? "dark" : "light");
    document.body.classList.toggle("light-mode", !nextDark);
  };

  const handleConnectWallet = (provider: string) => {
    setIsConnecting(true);
    setShowWalletModal(false);
    setTimeout(() => {
      const mockAddress = "0x7a2d71100f2e82500000000000000000000093B8";
      const mockBalance = provider === "phantom" ? "124.5 SOL" : "1.42 ETH";
      setWalletAddress(mockAddress);
      setWalletBalance(mockBalance);
      localStorage.setItem("web3_wallet_address", mockAddress);
      localStorage.setItem("web3_wallet_balance", mockBalance);
      setIsConnecting(false);
      window.dispatchEvent(new Event("storage"));
    }, 1500);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setWalletBalance("0.00 ETH");
    localStorage.removeItem("web3_wallet_address");
    localStorage.removeItem("web3_wallet_balance");
    setShowDisconnectModal(false);
    window.dispatchEvent(new Event("storage"));
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Scroll animations for the Hero Section
  const { scrollYProgress } = useScroll();
  
  // Hero text scales up and fades out as you scroll down
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 1.1]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 50]);

  return (
    <div className={`min-h-screen relative font-sans selection:bg-[#38bdf8] selection:text-[#000000] overflow-x-hidden ${isDark ? 'bg-black text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Header Navbar - Floating & Frosted */}
      <header className={`fixed top-0 left-0 w-full z-50 px-6 py-4 backdrop-blur-xl flex items-center justify-between transition-colors border-b ${isDark ? 'bg-black/60 border-white/10' : 'bg-white/60 border-black/10'}`}>
        <div className={`flex items-center gap-2 font-mono text-sm font-semibold tracking-wider ${isDark ? 'text-white' : 'text-black'}`}>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          SEC_CORE
        </div>
        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider mr-4">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-[#38bdf8] transition-colors py-2">
                Projects <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full right-0 w-48 bg-black/90 border border-white/10 rounded-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col shadow-2xl backdrop-blur-xl">
                <Link href="/noc/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 text-white">NOC Portal</Link>
                <Link href="https://www.worldmonitor.app/dashboard?zoom=1.00&view=global&timeRange=7d&layers=conflicts%2Cbases%2Chotspots%2Cnuclear%2Csanctions%2Cweather%2Ceconomic%2Cwaterways%2Coutages%2Cmilitary%2Cnatural" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 text-white" target="_blank" rel="noopener noreferrer">World Monitor</Link>
                <Link href="/alert/" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 text-white">Live Alerts</Link>
                <Link href="https://jumpstreet.tech" className="px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 text-white" target="_blank" rel="noopener noreferrer">Marketplace</Link>
                <Link href="/charity-quiz" className="px-4 py-3 hover:bg-white/10 transition-colors text-white">Cyber Free Rice</Link>
              </div>
            </div>
          </nav>
          
          {walletAddress ? (
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-full border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{walletAddress.slice(0, 6)}...</span>
            </button>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              disabled={isConnecting}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-full border transition-all active:scale-95 disabled:opacity-50 ${isDark ? 'border-white/20 bg-white/10 text-white hover:bg-white/20' : 'border-black/20 bg-black/5 text-black hover:bg-black/10'}`}
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnecting ? "Connecting..." : "Connect"}</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border transition-all ${isDark ? 'border-white/20 bg-white/10 hover:bg-white/20 text-white' : 'border-black/20 bg-black/5 hover:bg-black/10 text-black'}`}
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full border transition-all ${isDark ? 'border-white/20 bg-white/10 text-white' : 'border-black/20 bg-black/5 text-black'}`}
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-[70px] left-4 right-4 z-40 p-4 rounded-2xl border backdrop-blur-3xl shadow-2xl flex flex-col gap-4 font-mono text-sm uppercase tracking-wider ${isDark ? 'bg-black/90 border-white/10 text-white' : 'bg-white/90 border-black/10 text-black'}`}
          >
            <Link href="/noc/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 border-b border-current/10 hover:bg-current/5 rounded-lg flex items-center gap-3">
              <Activity className="w-4 h-4 text-emerald-500" /> NOC Portal
            </Link>
            <Link href="https://www.worldmonitor.app/dashboard?zoom=1.00&view=global&timeRange=7d&layers=conflicts%2Cbases%2Chotspots%2Cnuclear%2Csanctions%2Cweather%2Ceconomic%2Cwaterways%2Coutages%2Cmilitary%2Cnatural" target="_blank" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 border-b border-current/10 hover:bg-current/5 rounded-lg flex items-center gap-3">
              <Globe className="w-4 h-4 text-blue-500" /> World Monitor
            </Link>
            <Link href="/alert/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 border-b border-current/10 hover:bg-current/5 rounded-lg flex items-center gap-3">
              <Bell className="w-4 h-4 text-indigo-500" /> Live Alerts
            </Link>
            <Link href="https://jumpstreet.tech" target="_blank" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 hover:bg-current/5 rounded-lg flex items-center gap-3">
              <ShoppingCart className="w-4 h-4 text-[#00A86B]" /> Marketplace
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Telemetry Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-2xl hidden md:flex items-center justify-between p-3 rounded-2xl backdrop-blur-2xl border border-white/10 bg-black/40 shadow-2xl font-mono text-[10px] tracking-wider uppercase text-slate-300">
        <div className="flex items-center gap-2 px-4">
          <span className="opacity-50">Block</span>
          <span className="text-white font-bold">{blockHeight.toLocaleString()}</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 px-4">
          <span className="opacity-50">Gas</span>
          <span className="text-[#38bdf8] font-bold">{gasPrice} Gwei</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 px-4">
          <span className="opacity-50">Load</span>
          <span className="text-indigo-400 font-bold">{netLoad}% (Nominal)</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 px-4">
          <span className="opacity-50">Uptime</span>
          <span className="text-white font-bold">99.99%</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-2 px-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
          <span className="text-[#00A86B] font-bold">SECURE</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative w-full h-[120vh] flex flex-col items-center pt-[30vh]">
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="text-center px-4 flex flex-col items-center z-10 sticky top-[30vh]"
        >
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] font-black tracking-tighter leading-none mb-6">
            <span className="block bg-gradient-to-r from-emerald-400 via-white to-slate-400 bg-clip-text text-transparent">ORCA6 — Cybersecurity.</span>
            <span className="block bg-gradient-to-r from-slate-400 via-white to-emerald-400 bg-clip-text text-transparent">Infrastructure. Precision.</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium tracking-tight opacity-70 max-w-4xl mb-6 leading-relaxed">
            Next-generation low-latency engineering meets decentralized trading infrastructure. Gamified threat intelligence, sub-millisecond provisioning, and cryptographically verified identities. Built for traders who demand zero compromise.
          </p>
          <div className="flex items-center justify-center gap-2 mb-8 text-[#00A86B] font-mono text-sm tracking-wider">
            <span>🔒 256-bit encrypted node provisioning. Zero-knowledge identity contracts.</span>
          </div>
          
          <Link href="https://jumpstreet.tech" className="mb-10 px-8 py-4 rounded-full bg-[#00A86B] text-white font-black tracking-widest uppercase text-sm hover:scale-105 transition-transform shadow-[0_0_30px_rgba(0,168,107,0.5)] flex items-center gap-2 z-20 relative" target="_blank" rel="noopener noreferrer">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> START TRADING WITH ORCA6
          </Link>
          
          {/* Quick Access Links */}
          <div className="flex flex-wrap justify-center gap-4 relative z-20">
            <Link href="/portfolio" className="px-6 py-3 rounded-full bg-white text-black font-bold tracking-widest uppercase text-xs hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">
              <User className="w-4 h-4" /> Identity Contract
            </Link>
            <Link href="https://jumpstreet.tech" className="px-6 py-3 rounded-full bg-indigo-500 text-white font-bold tracking-widest uppercase text-xs hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              <Cpu className="w-4 h-4" /> Marketplace
            </Link>
            <div className="relative group z-30">
              <button className="px-6 py-3 rounded-full bg-emerald-500 text-black font-bold tracking-widest uppercase text-xs hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(52,211,153,0.4)] flex items-center gap-2 border-2 border-emerald-400">
                <Award className="w-4 h-4" /> Projects <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute top-full right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 flex flex-col overflow-hidden">
                <Link href="/noc/" className="px-4 py-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-3">
                  <Activity className="w-4 h-4 text-emerald-400" /> NOC Portal
                </Link>
                <div className="h-[1px] w-full bg-slate-800"></div>
                <Link href="https://www.worldmonitor.app/dashboard?zoom=1.00&view=global&timeRange=7d&layers=conflicts%2Cbases%2Chotspots%2Cnuclear%2Csanctions%2Cweather%2Ceconomic%2Cwaterways%2Coutages%2Cmilitary%2Cnatural" className="px-4 py-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-3" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 text-[#38bdf8]" /> World Monitor
                </Link>
                <div className="h-[1px] w-full bg-slate-800"></div>
                <Link href="/alert/" className="px-4 py-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-3">
                  <Bell className="w-4 h-4 text-blue-400" /> Live Alerts
                </Link>
                <div className="h-[1px] w-full bg-slate-800"></div>
                <Link href="https://jumpstreet.tech" className="px-4 py-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-3" target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="w-4 h-4 text-indigo-400" /> Marketplace
                </Link>
                <div className="h-[1px] w-full bg-slate-800"></div>
                <Link href="/charity-quiz" className="px-4 py-3 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-sm font-semibold flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-400" /> Cyber Free Rice
                </Link>
              </div>
            </div>
          </div>

          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mt-16 opacity-50 pointer-events-none"
          >
            <ChevronDown className="w-10 h-10" />
          </motion.div>
        </motion.div>
      </section>

      {/* Cinematic Portal Sections */}
      <div className="relative z-20 w-full bg-black">
        
        {/* Section 1: Portfolio */}
        <section className="min-h-screen w-full flex items-center justify-center py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0284c7]/10 to-black pointer-events-none" />
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
                Identity <br/><span className="text-[#38bdf8]">Contract.</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 font-medium mb-10 leading-relaxed max-w-lg">
                Cryptographic identity contracts for enterprise threat hunting and decentralized compliance.
              </p>
              <Link href="/portfolio" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold tracking-wide hover:scale-105 transition-transform">
                Explore Portfolio <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] border border-white/10 bg-gradient-to-br from-[#38bdf8]/20 to-transparent overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(56,189,248,0.15)]"
            >
              <User className="w-48 h-48 text-[#38bdf8] drop-shadow-[0_0_30px_rgba(56,189,248,0.5)]" />
            </motion.div>
          </div>
        </section>

        {/* Section 2: JumpStreet */}
        <section className="min-h-screen w-full flex items-center justify-center py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-indigo-900/10 to-black pointer-events-none" />
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] border border-white/10 bg-gradient-to-br from-indigo-500/20 to-transparent overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(99,102,241,0.15)] order-2 lg:order-1"
            >
              <Cpu className="w-48 h-48 text-indigo-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.5)]" />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
                Algo Execution. <br/><span className="text-indigo-400">JumpStreet.</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 font-medium mb-10 leading-relaxed max-w-lg">
                Quantitative high-frequency alert webhooks, trading bot nodes, and low-latency cloud-based backtesting & execution nodes.
              </p>
              <Link href="https://jumpstreet.tech" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-500 text-white font-bold tracking-wide hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]" target="_blank" rel="noopener noreferrer">
                Deploy Node <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Section 3: Charity Quiz */}
        <section className="min-h-screen w-full flex items-center justify-center py-20 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-emerald-900/10 to-black pointer-events-none" />
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-white">
                Proof of <br/><span className="text-emerald-400">Knowledge.</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-400 font-medium mb-10 leading-relaxed max-w-lg">
                Stake threat intelligence trivia answers to generate karmic impact, feeding global communities with verified correctness.
              </p>
              <Link href="https://cyberkarma.software" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-emerald-500 text-black font-bold tracking-wide hover:scale-105 transition-transform hover:shadow-[0_0_30px_rgba(52,211,153,0.4)]" target="_blank" rel="noopener noreferrer">
                Play & Earn Karma <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: false, margin: "-20%" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] border border-white/10 bg-gradient-to-br from-emerald-500/20 to-transparent overflow-hidden flex items-center justify-center shadow-[0_0_100px_rgba(52,211,153,0.15)]"
            >
              <Award className="w-48 h-48 text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.5)]" />
            </motion.div>
          </div>
        </section>


      </div>

      {/* Brand Footer */}
      <footer className="w-full py-8 border-t border-white/10 bg-black text-center relative z-20">
        <p className="font-mono text-xs text-slate-500 uppercase tracking-widest">
          Managed by Jumpstreet — A Mangalik & Sons Venture
        </p>
      </footer>

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowWalletModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold mb-2 text-white">Connect Wallet</h3>
            <p className="text-white/50 text-sm mb-6">Select a provider to authenticate your Web3 session.</p>
            <div className="space-y-3">
              <button onClick={() => handleConnectWallet("metamask")} className="w-full py-3 px-4 rounded-xl border border-white/10 hover:border-[#38bdf8]/50 hover:bg-[#38bdf8]/10 text-white flex items-center justify-between group transition-all">
                <span className="font-bold">MetaMask</span>
                <span className="text-xs text-white/30 group-hover:text-[#38bdf8]">Detected</span>
              </button>
              <button onClick={() => handleConnectWallet("phantom")} className="w-full py-3 px-4 rounded-xl border border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/10 text-white flex items-center justify-between group transition-all">
                <span className="font-bold">Phantom</span>
                <span className="text-xs text-white/30 group-hover:text-indigo-400">Solana Network</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disconnect Modal */}
      {showDisconnectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <button onClick={() => setShowDisconnectModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold mb-2 text-white">Active Session</h3>
            <div className="bg-black/50 border border-white/10 rounded-xl p-4 mb-6 mt-4">
              <div className="text-xs text-white/50 mb-1">Connected Address</div>
              <div className="font-mono text-sm break-all text-emerald-400">{walletAddress}</div>
              <div className="mt-4 flex gap-2">
                <button onClick={copyAddress} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-2">
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <button onClick={handleDisconnect} className="flex-1 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xs font-bold flex items-center justify-center gap-2">
                  <LogOut className="w-3 h-3" /> Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
