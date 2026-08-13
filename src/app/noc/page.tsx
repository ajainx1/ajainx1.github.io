"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function NocPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([
    { sender: 'AI Assistant', text: 'Hello! I am your air-gapped SecOps AI Assistant (Ollama LLM). How can I assist with telemetry or firewall rules today?' }
  ]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [
      ...prev,
      { sender: 'You', text: userMsg },
      { sender: 'AI Assistant', text: `SecOps Query Received: "${userMsg}". All district telemetry systems operating nominally (0% packet loss).` }
    ]);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] p-4 sm:p-6 font-sans flex flex-col">
      <div className="max-w-7xl w-full mx-auto flex-1 flex flex-col gap-6">
        {/* Top Header */}
        <header className="flex flex-wrap justify-between items-center pb-5 border-b border-[#2e3c54] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-bold text-white shadow-md">
              NOC
            </div>
            <div>
              <h1 className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">Air-Gapped Enterprise AI & NOC Gateway</h1>
              <p className="text-xs text-slate-400 font-mono">SecOps Intranet Operations • 38 District Nodes Active</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SEC_CORE: ONLINE
            </span>
            <Link href="/portfolio/" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all">
              ← Portfolio
            </Link>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Controls & Telemetry */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Monitored Districts", val: "38 / 38", color: "text-sky-400" },
                { label: "BGP RTT Latency", val: "18.2 ms", color: "text-emerald-400" },
                { label: "Default-Deny Policy", val: "HARDENED", color: "text-amber-400" },
                { label: "Air-Gapped RAG LLM", val: "Ollama 3b", color: "text-purple-400" }
              ].map((card, i) => (
                <div key={i} className="p-4 bg-[#161e2f] border border-[#2e3c54] rounded-2xl">
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{card.label}</div>
                  <div className={`text-xl font-extrabold font-mono mt-1 ${card.color}`}>{card.val}</div>
                </div>
              ))}
            </div>

            {/* Quick Tools Directory */}
            <div className="p-6 bg-[#161e2f] border border-[#2e3c54] rounded-3xl space-y-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🛠️</span> Enterprise Tool Directory
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { name: "Network Alert Dashboard", link: "/alert/", icon: "📡" },
                  { name: "Firewall Policy Audit", link: "/portfolio/#skills", icon: "🛡️" },
                  { name: "VAPT Vulnerability Hub", link: "/portfolio/#experience", icon: "🔍" },
                  { name: "EDR Sentinel Monitor", link: "/portfolio/#experience", icon: "⚡" },
                  { name: "DFIR Memory Triage", link: "/portfolio/#experience", icon: "🔬" },
                  { name: "Compliance Engine", link: "/portfolio/#projects", icon: "📋" }
                ].map((tool, idx) => (
                  <Link key={idx} href={tool.link} className="p-3.5 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all text-slate-200 hover:text-white">
                    <span>{tool.icon}</span>
                    <span className="truncate">{tool.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* AI RAG Chatbot Section */}
          <div className="lg:col-span-4 bg-[#161e2f] border border-[#2e3c54] rounded-3xl p-5 flex flex-col h-[500px]">
            <div className="pb-3 border-b border-[#2e3c54] mb-3 flex items-center justify-between">
              <span className="font-bold text-sm text-white flex items-center gap-2">
                <span>🤖</span> Ollama AI SecOps Chatbot
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">AIR-GAPPED</span>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs font-sans">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-3 rounded-xl max-w-[85%] ${msg.sender === 'You' ? 'bg-blue-600 text-white ml-auto' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                  <div className="text-[9px] opacity-60 font-mono mb-1">{msg.sender}</div>
                  <div>{msg.text}</div>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleChat} className="pt-3 border-t border-[#2e3c54] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Ask SecOps AI..."
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
