"use client";
import React, { useState } from 'react';
import { Cpu, HardDrive, MapPin, Layers, Server, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VMConfig } from './types';

interface VmConfiguratorProps {
  onAddVmToCart: (config: VMConfig, price: number) => void;
}

export default function VmConfigurator({ onAddVmToCart }: VmConfiguratorProps) {
  const [ram, setRam] = useState<number>(2);
  const [cpu, setCpu] = useState<number>(1);
  const [storage, setStorage] = useState<number>(40);
  const [region, setRegion] = useState<string>('Mumbai (India)');
  const [preInstalled, setPreInstalled] = useState<boolean>(true);
  const [addTricks, setAddTricks] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const calculatePrice = () => {
    let base = 0;
    if (ram === 2) base += 299; else if (ram === 4) base += 549; else if (ram === 8) base += 1049;
    if (cpu === 2) base += 150; else if (cpu === 4) base += 350;
    if (storage === 80) base += 99; else if (storage === 120) base += 199;
    if (addTricks) base += 250;
    return base;
  };

  const totalPrice = calculatePrice();
  const usdPrice = (totalPrice / 85).toFixed(2);

  const handleDeployConfig = () => {
    const config: VMConfig = { ram, cpu, storage, region, preInstalled };
    onAddVmToCart(config, totalPrice);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  const OptionBtn = ({
    label, sub, isActive, onClick,
  }: { label: string; sub: string; isActive: boolean; onClick: () => void }) => (
    <motion.button
      whileHover={{ scale: isActive ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      type="button"
      onClick={onClick}
      className={`p-2.5 sm:p-3 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 border relative overflow-hidden ${
        isActive 
          ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--fg)] shadow-sm' 
          : 'bg-[var(--card2)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--card)]'
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/10 to-transparent pointer-events-none" 
        />
      )}
      <span className="font-mono text-xs sm:text-sm z-10">{label}</span>
      <span className="text-[9px] font-normal mt-0.5 uppercase tracking-wider opacity-80 z-10">
        {sub}
      </span>
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[var(--border)] p-4 sm:p-6 shadow-2xl relative overflow-hidden bg-[var(--card)] backdrop-blur-md"
    >
      {/* Decorative */}
      <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none rotate-12">
        <Server size={300} className="text-[var(--primary)]" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 sm:mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] uppercase font-mono px-2.5 py-1 rounded-md bg-[var(--card2)] text-[var(--muted)] border border-[var(--border)]">
              Infrastructure
            </span>
            <span className="text-[9px] uppercase font-mono px-2.5 py-1 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              Config Ready
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold tracking-[0.2em] flex items-center gap-2 uppercase text-[var(--fg)]">
            <Server size={18} className="text-[var(--primary)]" />
            Windows Cloud VM Configurator
          </h3>
          <p className="text-xs mt-1.5 font-mono text-[var(--muted)] max-w-md">
            Deploy a dedicated virtual environment optimized for 24/7 autonomous HFT trading with sub-millisecond latency.
          </p>
        </div>
        <div className="px-4 py-3 rounded-lg text-right flex-shrink-0 bg-[var(--card2)] border border-[var(--border)] shadow-inner">
          <span className="text-[9px] uppercase font-mono tracking-wider block text-[var(--muted)]">
            Latency to India
          </span>
          <span className="text-xs font-mono font-black text-[var(--primary)]">~8.4ms (Mumbai)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 relative z-10">
        {/* Form */}
        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
          {/* RAM */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 text-[var(--muted)]">
                <Layers size={14} /> System RAM
              </span>
              <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">{ram} GB DDR5 ECC 5600MHz</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: 2, sub: 'Lowest Cost' },
                { v: 4, sub: 'Standard' },
                { v: 8, sub: 'Power Elite' },
              ].map(({ v, sub }) => (
                <OptionBtn key={`ram-${v}`} label={`${v} GB`} sub={sub} isActive={ram === v} onClick={() => setRam(v)} />
              ))}
            </div>
          </div>

          {/* CPU */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 text-[var(--muted)]">
                <Cpu size={14} /> Processor Cores
              </span>
              <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">{cpu} vCPU Xeon Scalable Gen 4</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: 1, sub: 'Eco Standard' },
                { v: 2, sub: 'Recommended' },
                { v: 4, sub: 'Max Speed' },
              ].map(({ v, sub }) => (
                <OptionBtn key={`cpu-${v}`} label={`${v} vCPU${v > 1 ? 's' : ''}`} sub={sub} isActive={cpu === v} onClick={() => setCpu(v)} />
              ))}
            </div>
          </div>

          {/* Storage */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 text-[var(--muted)]">
                <HardDrive size={14} /> PCIe Gen5 NVMe Storage
              </span>
              <span className="text-[11px] font-mono text-[var(--muted)] hidden sm:inline">{storage} GB NVMe</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: 40,  sub: 'Base' },
                { v: 80,  sub: 'Expanded' },
                { v: 120, sub: 'High Volume' },
              ].map(({ v, sub }) => (
                <OptionBtn key={`st-${v}`} label={`${v} GB`} sub={sub} isActive={storage === v} onClick={() => setStorage(v)} />
              ))}
            </div>
          </div>

          {/* Region + Pre-install */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 text-[var(--muted)]">
                <MapPin size={14} /> Datacenter
              </label>
              <select 
                value={region} 
                onChange={e => setRegion(e.target.value)} 
                className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-xs font-mono text-[var(--fg)] outline-none focus:border-[var(--primary)] transition-colors"
              >
                <option value="Mumbai (India)">Mumbai (India) — Recommended</option>
                <option value="Tokyo (Japan)">Tokyo (Japan) — Fast Asia</option>
                <option value="Singapore">Singapore (South Asia)</option>
                <option value="Oregon (US)">Oregon (United States)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 text-[var(--muted)]">
                <Terminal size={14} /> Pre-Configurations
              </label>
              <label className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors bg-[var(--card2)] border border-[var(--border)] hover:bg-[var(--card)] group">
                <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${preInstalled ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--muted)] group-hover:border-[var(--primary)]'}`}>
                   {preInstalled && <ShieldCheck size={12} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={preInstalled}
                  onChange={e => setPreInstalled(e.target.checked)}
                  className="hidden"
                />
                <span className="text-xs font-mono text-[var(--fg)]">
                  Pre-install HFT Signal Suite
                </span>
              </label>
            </div>
          </div>

          {/* Tricks */}
          <label className="flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors bg-[var(--primary)]/5 border border-[var(--primary)]/20 hover:bg-[var(--primary)]/10 group">
             <div className={`mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center border transition-colors ${addTricks ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--primary)]/50 group-hover:border-[var(--primary)]'}`}>
                   {addTricks && <Zap size={10} className="text-white fill-white" />}
             </div>
            <input
              type="checkbox"
              checked={addTricks}
              onChange={e => setAddTricks(e.target.checked)}
              className="hidden"
            />
            <div className="flex-1">
              <div className="text-xs font-bold flex items-center gap-1.5 uppercase tracking-wider text-[var(--primary)] group-hover:text-sky-300 transition-colors">
                Premium Integration Techniques (+₹250)
              </div>
              <p className="text-[11px] mt-1.5 leading-relaxed font-mono text-[var(--muted)]">
                Automated watchdog tasks, kernel-bypass Solarflare drivers, raw exchange BGP optimization, and 1-on-1 performance tuning by Jumpstreet.
              </p>
            </div>
          </label>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-5">
          <div className="rounded-xl border border-[var(--border)] p-5 sm:p-6 flex flex-col justify-between h-full bg-[var(--card2)]/50 relative overflow-hidden">
             
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--card2)] pointer-events-none" />
            
            <div className="relative z-10">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-5 pb-3 border-b border-[var(--border)] text-[var(--muted)] flex items-center gap-2">
                <Layers size={14} /> Provisioning Estimate
              </h4>

              <div className="space-y-3.5 font-mono text-xs">
                {[
                  { label: 'Windows Server Suite', value: 'Included', color: 'var(--muted)' },
                  { label: `RAM (${ram} GB DDR5)`, value: ram === 2 ? '₹299' : ram === 4 ? '₹549' : '₹1049', color: 'var(--fg)' },
                  { label: `CPU (${cpu} vCPU)`, value: cpu === 1 ? '₹0' : cpu === 2 ? '+₹150' : '+₹350', color: 'var(--fg)' },
                  { label: `Storage (${storage} GB)`, value: storage === 40 ? '₹0' : storage === 80 ? '+₹99' : '+₹199', color: 'var(--fg)' },
                  { label: 'Pre-installed software', value: 'FREE Setup', color: 'var(--primary)' },
                  ...(addTricks ? [{ label: 'Premium Integration', value: '+₹250', color: 'var(--primary)' }] : []),
                  { label: 'Region', value: region.split(' ')[0], color: 'var(--muted)' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span style={{ color: row.color === 'var(--fg)' ? 'var(--muted)' : row.color }}>{row.label}</span>
                    <span className={row.color === 'var(--fg)' ? 'font-medium' : 'font-bold'} style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-[var(--border)] space-y-4 mt-6 relative z-10">
              <div className="flex justify-between items-end font-mono">
                <span className="text-xs font-semibold text-[var(--muted)] mb-1">Monthly Total:</span>
                <div className="text-right">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={totalPrice}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-2xl sm:text-3xl font-black text-[var(--fg)] block"
                    >
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[10px] block text-[var(--muted)]">
                    ~${usdPrice} USD / mo
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeployConfig}
                className={`w-full py-3.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-lg ${
                  addedSuccess
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--primary)] hover:text-white hover:shadow-[var(--primary)]/20'
                }`}
              >
                <ShieldCheck size={16} className={addedSuccess ? "animate-pulse" : ""} />
                {addedSuccess ? '✅ Added to Checkout!' : 'Apply to Payment Portal'}
              </motion.button>

              <p className="text-[10px] text-center leading-normal font-mono text-[var(--muted)]">
                Windows Server deploys within <strong className="text-[var(--fg)] font-medium">3–5 minutes</strong> post payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
