import React, { useState } from 'react';
import { Cpu, HardDrive, MapPin, Layers, Server, ShieldCheck, Terminal } from 'lucide-react';
import { VMConfig } from '../types';

interface VmConfiguratorProps {
  onAddVmToCart: (config: VMConfig, price: number) => void;
  isDark: boolean;
}

export default function VmConfigurator({ onAddVmToCart, isDark }: VmConfiguratorProps) {
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

  // Theme tokens
  const cardBg = isDark ? '#111111' : '#ffffff';
  const deepBg = isDark ? '#000' : '#f8f8fa';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const borderStrong = isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.18)';
  const textPrimary = isDark ? '#fff' : '#111';
  const textSecondary = isDark ? '#9ca3af' : '#666';
  const textMuted = isDark ? '#4b5563' : '#aaa';
  const btnBase = {
    border: `1px solid ${border}`,
    background: isDark ? '#000' : '#f5f5f7',
    color: textSecondary,
  };
  const btnActive = {
    border: `1px solid ${borderStrong}`,
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(59,130,246,0.06)',
    color: textPrimary,
  };
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: deepBg,
    border: `1px solid ${border}`,
    borderRadius: '2px',
    padding: '10px 12px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: textPrimary,
    outline: 'none',
  };

  const OptionBtn = ({
    label, sub, isActive, onClick,
  }: { label: string; sub: string; isActive: boolean; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-2.5 sm:p-3 rounded-sm text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5"
      style={isActive ? btnActive : btnBase}
    >
      <span className="font-mono text-xs sm:text-sm">{label}</span>
      <span className="text-[9px] font-normal mt-0.5 uppercase tracking-wider" style={{ color: textMuted }}>
        {sub}
      </span>
    </button>
  );

  return (
    <div
      className="rounded-sm border p-4 sm:p-6 shadow-2xl relative overflow-hidden"
      style={{ background: cardBg, borderColor: border }}
    >
      {/* Decorative */}
      <div className="absolute right-0 top-0 opacity-[0.015] pointer-events-none">
        <Server size={260} style={{ color: textPrimary }} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm"
              style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f3', color: textSecondary, border: `1px solid ${border}` }}
            >
              Infrastructure
            </span>
            <span
              className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-sm text-blue-400"
              style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              Config Ready
            </span>
          </div>
          <h3 className="text-sm font-bold tracking-[0.2em] flex items-center gap-2 uppercase"
              style={{ color: textPrimary }}>
            <Server size={17} className="text-blue-400" />
            Windows Cloud VM Configurator
          </h3>
          <p className="text-xs mt-1 font-mono" style={{ color: textSecondary }}>
            Deploy a dedicated virtual environment for 24/7 autonomous trading
          </p>
        </div>
        <div
          className="px-3 py-2 rounded-sm text-right flex-shrink-0"
          style={{ background: deepBg, border: `1px solid ${border}` }}
        >
          <span className="text-[9px] uppercase font-mono tracking-wider block" style={{ color: textMuted }}>
            Latency to India
          </span>
          <span className="text-xs font-mono font-bold text-blue-400">~8.4ms (Mumbai)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* RAM */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5"
                    style={{ color: textSecondary }}>
                <Layers size={13} style={{ color: textMuted }} /> System RAM
              </span>
              <span className="text-[11px] font-mono" style={{ color: textSecondary }}>{ram} GB DDR4 ECC</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 2, sub: 'Lowest Cost' },
                { v: 4, sub: 'Standard' },
                { v: 8, sub: 'Power Elite' },
              ].map(({ v, sub }) => (
                <OptionBtn key={v} label={`${v} GB`} sub={sub} isActive={ram === v} onClick={() => setRam(v)} />
              ))}
            </div>
          </div>

          {/* CPU */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5"
                    style={{ color: textSecondary }}>
                <Cpu size={13} style={{ color: textMuted }} /> Processor Cores
              </span>
              <span className="text-[11px] font-mono" style={{ color: textSecondary }}>{cpu} vCPU Xeon Skylake</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 1, sub: 'Eco Standard' },
                { v: 2, sub: 'Recommended' },
                { v: 4, sub: 'Max Speed' },
              ].map(({ v, sub }) => (
                <OptionBtn key={v} label={`${v} vCPU${v > 1 ? 's' : ''}`} sub={sub} isActive={cpu === v} onClick={() => setCpu(v)} />
              ))}
            </div>
          </div>

          {/* Storage */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5"
                    style={{ color: textSecondary }}>
                <HardDrive size={13} style={{ color: textMuted }} /> SSD NVMe Storage
              </span>
              <span className="text-[11px] font-mono" style={{ color: textSecondary }}>{storage} GB NVMe</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: 40,  sub: 'Base' },
                { v: 80,  sub: 'Expanded' },
                { v: 120, sub: 'High Volume' },
              ].map(({ v, sub }) => (
                <OptionBtn key={v} label={`${v} GB`} sub={sub} isActive={storage === v} onClick={() => setStorage(v)} />
              ))}
            </div>
          </div>

          {/* Region + Pre-install */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5"
                     style={{ color: textSecondary }}>
                <MapPin size={13} style={{ color: textMuted }} /> Datacenter
              </label>
              <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
                <option value="Mumbai (India)">Mumbai (India) — Recommended</option>
                <option value="Tokyo (Japan)">Tokyo (Japan) — Fast Asia</option>
                <option value="Singapore">Singapore (South Asia)</option>
                <option value="Oregon (US)">Oregon (United States)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5"
                     style={{ color: textSecondary }}>
                <Terminal size={13} style={{ color: textMuted }} /> Pre-Configurations
              </label>
              <label
                className="flex items-center gap-2 p-2.5 rounded-sm cursor-pointer transition-colors"
                style={{ background: deepBg, border: `1px solid ${border}` }}
              >
                <input
                  type="checkbox"
                  checked={preInstalled}
                  onChange={e => setPreInstalled(e.target.checked)}
                  className="w-4 h-4"
                  style={{ accentColor: '#3b82f6' }}
                />
                <span className="text-xs font-mono" style={{ color: isDark ? '#d1d5db' : '#555' }}>
                  Pre-install "Bot Fixed"
                </span>
              </label>
            </div>
          </div>

          {/* Tricks */}
          <div
            className="p-4 rounded-sm flex items-start gap-3"
            style={{ background: deepBg, border: `1px solid ${border}` }}
          >
            <input
              type="checkbox"
              id="tricks-checkbox"
              checked={addTricks}
              onChange={e => setAddTricks(e.target.checked)}
              className="mt-1 w-4 h-4"
              style={{ accentColor: '#3b82f6' }}
            />
            <div className="flex-1">
              <label htmlFor="tricks-checkbox"
                     className="text-xs font-bold flex items-center gap-1.5 cursor-pointer uppercase tracking-wider text-blue-400">
                Premium Integration Techniques &amp; Tricks (+₹250)
              </label>
              <p className="text-[11px] mt-1 leading-relaxed font-mono" style={{ color: textSecondary }}>
                Automated watchdogs, low-latency API proxy techniques, custom indicator setup, and 1-on-1 trick guide by Jumpstreet.
              </p>
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-5">
          <div
            className="rounded-sm border p-4 sm:p-5 flex flex-col justify-between h-full"
            style={{ background: deepBg, borderColor: border }}
          >
            <div>
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-4 pb-2 border-b"
                  style={{ color: textMuted, borderColor: border }}>
                Provisioning Estimate
              </h4>

              <div className="space-y-3 font-mono text-xs">
                {[
                  { label: 'Windows Server Suite', value: 'Included', color: textSecondary },
                  { label: `RAM (${ram} GB DDR4)`, value: ram === 2 ? '₹299' : ram === 4 ? '₹549' : '₹1049', color: textPrimary },
                  { label: `CPU (${cpu} vCPU Xeon)`, value: cpu === 1 ? '₹0' : cpu === 2 ? '+₹150' : '+₹350', color: textPrimary },
                  { label: `Storage (${storage} GB NVMe)`, value: storage === 40 ? '₹0' : storage === 80 ? '+₹99' : '+₹199', color: textPrimary },
                  { label: 'Pre-installed software', value: 'FREE Setup', color: '#60a5fa' },
                  ...(addTricks ? [{ label: 'Premium Integration', value: '+₹250', color: '#60a5fa' }] : []),
                  { label: 'Region', value: region.split(' ')[0], color: textSecondary },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span style={{ color: textSecondary }}>{row.label}</span>
                    <span style={{ color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t space-y-3 mt-4" style={{ borderColor: border }}>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs font-semibold" style={{ color: textSecondary }}>Monthly Total:</span>
                <div className="text-right">
                  <span className="text-2xl font-black" style={{ color: textPrimary }}>
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] block" style={{ color: textMuted }}>
                    ~${usdPrice} USD / mo
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDeployConfig}
                className="w-full py-3 rounded-sm text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                style={{
                  background: addedSuccess
                    ? 'linear-gradient(135deg, #059669, #34d399)'
                    : (isDark ? '#fff' : '#111'),
                  color: addedSuccess ? '#fff' : (isDark ? '#000' : '#fff'),
                }}
              >
                <ShieldCheck size={15} />
                {addedSuccess ? '✅ Added to Checkout!' : 'Apply to Payment Portal'}
              </button>

              <p className="text-[10px] text-center leading-normal font-mono" style={{ color: textMuted }}>
                Windows Server deploys within 3–5 minutes post payment verification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
