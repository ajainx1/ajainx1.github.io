"use client";
import React, { useState } from 'react';
import { Cpu, HardDrive, MapPin, Layers, Server, ShieldCheck, Terminal, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VMConfig } from './types';
import TiltWrapper from '@/components/3d/TiltWrapper';

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
      className={`p-3 sm:p-4 rounded-[16px] text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 border relative overflow-hidden ${
        isActive 
          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
          : 'bg-white border-black/5 text-slate-500 hover:bg-slate-50'
      }`}
    >
      {isActive && (
        <motion.div 
          layoutId="activeIndicator"
          className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent pointer-events-none" 
        />
      )}
      <span className="font-title text-sm sm:text-base z-10 font-black">{label}</span>
      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest z-10 text-slate-400">
        {sub}
      </span>
    </motion.button>
  );

  return (
    <TiltWrapper tiltDeg={5}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[24px] border border-white/60 p-6 sm:p-8 shadow-sm relative overflow-hidden bg-white/60 backdrop-blur-2xl"
    >
      {/* Decorative */}
      <div className="absolute right-[-5%] top-[-10%] opacity-[0.03] pointer-events-none rotate-12">
        <Server size={300} className="text-blue-600" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-10 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-black/5 shadow-inner">
              Infrastructure
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100 shadow-sm">
              Config Ready
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-widest flex items-center gap-3 uppercase text-slate-900 font-title">
            <Server size={22} className="text-blue-600" />
            Windows Cloud VM Configurator
          </h3>
          <p className="text-sm mt-2 font-medium text-slate-500 max-w-md leading-relaxed">
            Deploy a dedicated virtual environment optimized for 24/7 autonomous HFT trading with sub-millisecond latency.
          </p>
        </div>
        <div className="px-5 py-4 rounded-[16px] text-right flex-shrink-0 bg-white border border-black/5 shadow-sm">
          <span className="text-[10px] uppercase font-bold tracking-widest block text-slate-400">
            Latency to India
          </span>
          <span className="text-sm font-black font-title text-blue-600 tracking-tight mt-1 block">~8.4ms (Mumbai)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10">
        {/* Form */}
        <div className="lg:col-span-7 space-y-8 lg:space-y-10">
          {/* RAM */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <Layers size={16} /> System RAM
              </span>
              <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">{ram} GB DDR5 ECC 5600MHz</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <Cpu size={16} /> Processor Cores
              </span>
              <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">{cpu} vCPU Xeon Scalable Gen 4</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <HardDrive size={16} /> PCIe Gen5 NVMe Storage
              </span>
              <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">{storage} GB NVMe</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <MapPin size={16} /> Datacenter
              </label>
              <select 
                value={region} 
                onChange={e => setRegion(e.target.value)} 
                className="w-full bg-white border border-black/5 rounded-[12px] px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-300 transition-colors shadow-sm"
              >
                <option value="Mumbai (India)">Mumbai (India) — Recommended</option>
                <option value="Tokyo (Japan)">Tokyo (Japan) — Fast Asia</option>
                <option value="Singapore">Singapore (South Asia)</option>
                <option value="Oregon (US)">Oregon (United States)</option>
              </select>
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-500">
                <Terminal size={16} /> Pre-Configurations
              </label>
              <label className="flex items-center gap-4 p-3.5 rounded-[12px] cursor-pointer transition-colors bg-white border border-black/5 hover:bg-slate-50 shadow-sm group">
                <div className={`w-5 h-5 rounded-[6px] flex items-center justify-center border-2 transition-colors ${preInstalled ? 'bg-blue-500 border-blue-500' : 'border-slate-300 group-hover:border-blue-400'}`}>
                   {preInstalled && <ShieldCheck size={14} className="text-white" />}
                </div>
                <input
                  type="checkbox"
                  checked={preInstalled}
                  onChange={e => setPreInstalled(e.target.checked)}
                  className="hidden"
                />
                <span className="text-sm font-bold text-slate-900">
                  Pre-install HFT Signal Suite
                </span>
              </label>
            </div>
          </div>

          {/* Tricks */}
          <label className="flex items-start gap-4 p-5 rounded-[16px] cursor-pointer transition-colors bg-blue-50/50 border border-blue-100 hover:bg-blue-50 shadow-sm group">
             <div className={`mt-0.5 w-5 h-5 rounded-[6px] flex-shrink-0 flex items-center justify-center border-2 transition-colors ${addTricks ? 'bg-indigo-600 border-indigo-600' : 'border-indigo-300 group-hover:border-indigo-500'}`}>
                   {addTricks && <Zap size={14} className="text-white fill-white" />}
             </div>
            <input
              type="checkbox"
              checked={addTricks}
              onChange={e => setAddTricks(e.target.checked)}
              className="hidden"
            />
            <div className="flex-1">
              <div className="text-sm font-black flex items-center gap-2 uppercase tracking-widest text-indigo-700 group-hover:text-indigo-800 transition-colors font-title">
                Premium Integration Techniques (+₹250)
              </div>
              <p className="text-xs mt-2 leading-relaxed font-medium text-slate-600">
                Automated watchdog tasks, kernel-bypass Solarflare drivers, raw exchange BGP optimization, and 1-on-1 performance tuning by Jumpstreet.
              </p>
            </div>
          </label>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-5">
          <div className="rounded-[24px] border border-black/5 p-6 sm:p-8 flex flex-col justify-between h-full bg-slate-50 relative overflow-hidden shadow-inner">
             
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-100 pointer-events-none" />
            
            <div className="relative z-10">
              <h4 className="text-[11px] font-bold uppercase tracking-widest mb-6 pb-4 border-b border-black/5 text-slate-500 flex items-center gap-3">
                <Layers size={16} /> Provisioning Estimate
              </h4>

              <div className="space-y-4 text-sm font-medium">
                {[
                  { label: 'Windows Server Suite', value: 'Included', color: 'text-slate-500' },
                  { label: `RAM (${ram} GB DDR5)`, value: ram === 2 ? '₹299' : ram === 4 ? '₹549' : '₹1049', color: 'text-slate-900' },
                  { label: `CPU (${cpu} vCPU)`, value: cpu === 1 ? '₹0' : cpu === 2 ? '+₹150' : '+₹350', color: 'text-slate-900' },
                  { label: `Storage (${storage} GB)`, value: storage === 40 ? '₹0' : storage === 80 ? '+₹99' : '+₹199', color: 'text-slate-900' },
                  { label: 'Pre-installed software', value: 'FREE Setup', color: 'text-emerald-600' },
                  ...(addTricks ? [{ label: 'Premium Integration', value: '+₹250', color: 'text-indigo-600' }] : []),
                  { label: 'Region', value: region.split(' ')[0], color: 'text-slate-500' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className={row.color === 'text-slate-900' ? 'text-slate-500' : row.color}>{row.label}</span>
                    <span className={`font-bold ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-black/5 space-y-6 mt-8 relative z-10">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest">Monthly Total:</span>
                <div className="text-right">
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={totalPrice}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-3xl sm:text-4xl font-black text-slate-900 font-title tracking-tight block"
                    >
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[11px] block font-bold text-slate-400 mt-1 uppercase tracking-widest">
                    ~${usdPrice} USD / mo
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleDeployConfig}
                className={`w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-xl ${
                  addedSuccess
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                    : 'bg-slate-900 text-white hover:bg-blue-600'
                }`}
              >
                <ShieldCheck size={18} className={addedSuccess ? "animate-pulse" : ""} />
                {addedSuccess ? '✅ Added to Checkout!' : 'Apply to Payment Portal'}
              </motion.button>

              <p className="text-[11px] text-center leading-relaxed font-medium text-slate-500">
                Windows Server deploys within <strong className="text-slate-900 font-bold">3–5 minutes</strong> post payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </TiltWrapper>
  );
}
