"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AlertPage() {
  const [logs, setLogs] = useState<Array<{ time: string; node: string; rtt: number }>>([
    { time: '10:14:02', node: 'Patna Main HQ Core Router', rtt: 12 },
    { time: '10:14:05', node: 'Gaya Regional Data Link', rtt: 18 },
    { time: '10:14:10', node: 'Muzaffarpur Secondary Node', rtt: 21 },
    { time: '10:14:15', node: 'Bhagalpur Perimeter Router', rtt: 19 },
  ]);
  const [currentRtt, setCurrentRtt] = useState(18);

  useEffect(() => {
    const nodes = ['Patna Main HQ', 'Gaya Regional Link', 'Muzaffarpur Node', 'Bhagalpur Core', 'Purnia Gateway', 'Darbhanga Hub'];
    const interval = setInterval(() => {
      const time = new Date().toTimeString().split(' ')[0];
      const node = nodes[Math.floor(Math.random() * nodes.length)];
      const rtt = Math.floor(Math.random() * 12) + 12;
      setCurrentRtt(rtt);
      setLogs(prev => [...prev.slice(-40), { time, node, rtt }]);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-[#f8fafc] p-6 font-sans flex flex-col">
      <div className="max-w-6xl w-full mx-auto flex-1 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center pb-5 border-b border-[#2e3c54] mb-6">
          <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
            <span className="text-sky-400 text-2xl">📡</span>
            <span>Enterprise Telemetry Alert Gateway</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]"></span>
              LIVE ICMP TELEMETRY
            </div>
            <Link href="/portfolio/" className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2">
              ← Portfolio
            </Link>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#161e2f] border border-[#2e3c54] rounded-2xl p-5">
            <div className="text-[11px] color-[#94a3b8] uppercase font-mono font-bold">Monitored Core Routers</div>
            <div className="text-3xl font-extrabold text-sky-400 mt-1 font-mono">38 Districts</div>
          </div>
          <div className="bg-[#161e2f] border border-[#2e3c54] rounded-2xl p-5">
            <div className="text-[11px] color-[#94a3b8] uppercase font-mono font-bold">Average Round-Trip Latency</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">{currentRtt} ms</div>
          </div>
          <div className="bg-[#161e2f] border border-[#2e3c54] rounded-2xl p-5">
            <div className="text-[11px] color-[#94a3b8] uppercase font-mono font-bold">Packet Loss Ratio</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">0.00%</div>
          </div>
          <div className="bg-[#161e2f] border border-[#2e3c54] rounded-2xl p-5">
            <div className="text-[11px] color-[#94a3b8] uppercase font-mono font-bold">Active Alert Noise Filters</div>
            <div className="text-3xl font-extrabold text-purple-400 mt-1 font-mono">12 Rules</div>
          </div>
        </div>

        {/* Stream Header */}
        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider font-mono">Real-Time System Telemetry Stream</h3>

        {/* Log Terminal Box */}
        <div className="bg-[#0d1117] border border-[#2e3c54] rounded-2xl p-5 font-mono text-xs flex-1 overflow-y-auto max-h-[500px] space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 py-1 border-b border-white/5 last:border-0">
              <span className="text-slate-500">[{log.time}]</span>
              <span className="text-emerald-400 font-bold">PING</span>
              <span>{log.node}: <strong className="text-sky-300">{log.rtt}ms</strong> RTT (0% loss)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
