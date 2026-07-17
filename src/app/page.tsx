"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Terminal, Award, User, ShieldAlert, Cpu, Globe, Moon, Sun, Wallet, Copy, Check, LogOut } from "lucide-react";
import TiltWrapper from "@/components/3d/TiltWrapper";

export default function GatewayPage() {
  const [isDark, setIsDark] = useState(true);
  
  // Web3 Connection States
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string>("0.00 ETH");
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Telemetry States
  const [blockHeight, setBlockHeight] = useState<number>(19482903);
  const [gasPrice, setGasPrice] = useState<number>(21);
  const [netLoad, setNetLoad] = useState<number>(14);

  // Sync theme & wallet state on mount
  useEffect(() => {
    const isDarkMode = localStorage.getItem("jumpstreet_theme") !== "light";
    setIsDark(isDarkMode);
    document.body.classList.toggle("light-mode", !isDarkMode);

    const savedWallet = localStorage.getItem("web3_wallet_address");
    if (savedWallet) {
      setWalletAddress(savedWallet);
      setWalletBalance(localStorage.getItem("web3_wallet_balance") || "1.42 ETH");
    }

    // Tick block height
    const blockInterval = setInterval(() => {
      setBlockHeight(prev => prev + 1);
    }, 12000);

    // Randomize gas and load slightly
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
      
      // Dispatch storage event to trigger updates in active sub-pages
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

  const portalCards = [
    {
      title: "Identity Contract (Portfolio)",
      subtitle: "SecOps // Audits // Attestations",
      description: "Cryptographically signed credentials, enterprise threat hunting logs, e-governance audits, and decentralized compliance attestations.",
      link: "/portfolio",
      icon: User,
      cta: "Explore Identity",
      color: "from-[#38bdf8]/10 to-[#0284c7]/5",
      borderColor: "border-[#38bdf8]/30",
      glowColor: "shadow-[#38bdf8]/10",
      textColor: "text-[#38bdf8]",
    },
    {
      title: "JumpStreet DeFi Yields",
      subtitle: "Algo Nodes // Alert Webhooks // Mining",
      description: "Quantitative high-frequency alert webhooks, trading bot nodes, and low-latency cloud mining/VM configurations.",
      link: "/js",
      icon: Cpu,
      cta: "Configure Nodes",
      color: "from-indigo-600/10 to-indigo-950/5",
      borderColor: "border-indigo-500/30",
      glowColor: "shadow-indigo-500/10",
      textColor: "text-indigo-400",
    },
    {
      title: "Proof-of-Knowledge Staking",
      subtitle: "Trivia // Impact Milestones // Grains",
      description: "Stake threat intelligence trivia answers to generate karmic impact, feeding global communities with verified correctness.",
      link: "/charity-quiz",
      icon: Award,
      cta: "Play & Mint Impact",
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
          SEC_CORE // WEB3 GATEWAY
        </div>
        <div className="flex items-center gap-3">
          {/* Quick links header */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider mr-4">
            <Link href="/noc/" className="hover:text-[#38bdf8] transition-colors">NOC Terminal</Link>
            <Link href="/alert/" className="hover:text-[#38bdf8] transition-colors">Threat Monitor</Link>
          </nav>
          
          {/* Connect Wallet Button */}
          {walletAddress ? (
            <button
              onClick={() => setShowDisconnectModal(true)}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              <span className="opacity-55 ml-1">({walletBalance})</span>
            </button>
          ) : (
            <button
              onClick={() => setShowWalletModal(true)}
              disabled={isConnecting}
              className="flex items-center gap-2 px-4 py-1.5 text-xs font-mono font-bold tracking-wider uppercase rounded-lg border border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
            </button>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg border transition-all ${isDark ? 'border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-black'}`}
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Web3 Section */}
      <main className="flex-1 w-full max-w-7xl px-6 py-12 md:py-20 flex flex-col items-center justify-center relative z-10">
        
        {/* Web3 Live Telemetry Grid */}
        <div className={`w-full grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl border mb-16 backdrop-blur-md font-mono text-[10px] tracking-wider uppercase transition-colors ${isDark ? 'bg-slate-950/30 border-slate-800/80 text-slate-400' : 'bg-slate-100/50 border-slate-200 text-slate-600'}`}>
          <div className="flex flex-col gap-1 items-center justify-center border-r border-slate-800/40 py-2">
            <span className="opacity-55">Block Height</span>
            <span className="text-white font-bold tracking-normal text-xs">{blockHeight.toLocaleString()}</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center border-none md:border-r border-slate-800/40 py-2">
            <span className="opacity-55">Base Gas</span>
            <span className="text-[#38bdf8] font-bold text-xs">{gasPrice} Gwei</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center border-r border-slate-800/40 py-2">
            <span className="opacity-55">Net Load</span>
            <span className="text-indigo-400 font-bold text-xs">{netLoad}% Capacity</span>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center py-2">
            <span className="opacity-55">Network Status</span>
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Healthy
            </span>
          </div>
        </div>

        {/* Hub Titles */}
        <div className="text-center max-w-2xl mb-16">
          <h1 className="text-4xl md:text-5xl font-black font-title tracking-tight mb-4 bg-gradient-to-r from-[#38bdf8] via-slate-100 to-white bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.25)]">
            Decentralized Gateway Hub
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-mono leading-relaxed">
            Welcome to the security operations and cryptographic engineering directory. Select a smart node to begin.
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

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-sm rounded-3xl border p-8 relative overflow-hidden shadow-2xl ${isDark ? 'bg-[#0d131a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className="text-xl font-black font-title text-[#38bdf8] mb-1">Connect Web3 Wallet</h3>
            <p className="text-xs text-slate-400 font-mono mb-6">Select a cryptographic node provider below.</p>
            
            <div className="flex flex-col gap-3">
              {[
                { name: "MetaMask", id: "metamask", icon: "🦊" },
                { name: "WalletConnect", id: "walletconnect", icon: "🌐" },
                { name: "Coinbase Wallet", id: "coinbase", icon: "🛡️" },
                { name: "Phantom", id: "phantom", icon: "👻" }
              ].map(prov => (
                <button
                  key={prov.id}
                  onClick={() => handleConnectWallet(prov.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border text-sm font-mono font-bold transition-all hover:scale-[1.01] active:scale-95 ${isDark ? 'bg-slate-900/40 border-slate-800 hover:border-[#38bdf8]/40 hover:bg-[#38bdf8]/5' : 'bg-slate-50 border-slate-200 hover:border-[#38bdf8]/40 hover:bg-[#38bdf8]/5'}`}
                >
                  <span>{prov.name}</span>
                  <span className="text-xl">{prov.icon}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowWalletModal(false)}
              className="w-full mt-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Disconnect Wallet Modal */}
      {showDisconnectModal && walletAddress && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className={`w-full max-w-sm rounded-3xl border p-8 text-center relative overflow-hidden shadow-2xl ${isDark ? 'bg-[#0d131a] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-16 h-16 mx-auto bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-6 h-6" />
            </div>
            
            <h3 className="text-lg font-bold font-title text-white mb-2">Connected Node</h3>
            
            <div className={`flex items-center justify-center gap-2 p-3 rounded-xl mb-6 border font-mono text-xs ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span>{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</span>
              <button onClick={copyAddress} className="text-[#38bdf8] hover:text-white transition-colors" title="Copy Address">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDisconnect}
                className="flex-1 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-400 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
              <button
                onClick={() => setShowDisconnectModal(false)}
                className={`flex-1 py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider border transition-all ${isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-850' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Professional Footer Navigation */}
      <footer className="w-full max-w-7xl px-6 py-8 border-t border-slate-800/40 flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-slate-500 mt-12 z-10">
        <div>
          © 2026 Aditya Jain. Cryptographically Attested.
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
