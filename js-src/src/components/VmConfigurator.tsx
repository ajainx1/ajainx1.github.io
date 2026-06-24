import React, { useState } from 'react';
import { Cpu, HardDrive, MapPin, Layers, Server, ShieldCheck, Terminal, HelpCircle } from 'lucide-react';
import { VMConfig } from '../types';

interface VmConfiguratorProps {
  onAddVmToCart: (config: VMConfig, price: number) => void;
}

export default function VmConfigurator({ onAddVmToCart }: VmConfiguratorProps) {
  // Cloud VM states
  const [ram, setRam] = useState<number>(2); // 2GB, 4GB, 8GB
  const [cpu, setCpu] = useState<number>(1); // 1, 2, 4 vCPUs
  const [storage, setStorage] = useState<number>(40); // 40, 80, 120 GB
  const [region, setRegion] = useState<string>('Mumbai (India)');
  const [preInstalled, setPreInstalled] = useState<boolean>(true);
  const [addTricks, setAddTricks] = useState<boolean>(true);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Price calculations
  const calculatePrice = () => {
    let base = 0;
    // RAM cost
    if (ram === 2) base += 299;
    else if (ram === 4) base += 549;
    else if (ram === 8) base += 1049;

    // CPU cost
    if (cpu === 2) base += 150;
    else if (cpu === 4) base += 350;

    // Storage cost
    if (storage === 80) base += 99;
    else if (storage === 120) base += 199;

    // Custom Integration/tricks
    if (addTricks) base += 250;

    return base;
  };

  const totalPrice = calculatePrice();
  const usdPrice = (totalPrice / 85).toFixed(2); // Mock INR to USD conversion

  const handleDeployConfig = () => {
    const config: VMConfig = {
      ram,
      cpu,
      storage,
      region,
      preInstalled,
    };
    onAddVmToCart(config, totalPrice);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2500);
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-none p-6 shadow-2xl relative overflow-hidden">
      
      {/* Decorative Server Backdrop Graphic */}
      <div className="absolute right-0 top-0 opacity-[0.01] pointer-events-none">
        <Server size={300} className="text-white" />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-white/5 text-neutral-300 text-[9px] uppercase font-mono px-2 py-0.5 rounded-none border border-white/10">
              Infrastructure
            </span>
            <span className="bg-blue-950/40 text-blue-400 text-[9px] uppercase font-mono px-2 py-0.5 rounded-none border border-blue-900/30">
              Lowest Config Ready
            </span>
          </div>
          <h3 className="text-sm font-bold tracking-[0.2em] text-white mt-2.5 flex items-center gap-2 uppercase">
            <Server size={18} className="text-blue-400" />
            Windows Cloud VM Configurator
          </h3>
          <p className="text-xs text-neutral-400">Deploy a dedicated virtual environment for 24/7 autonomous trading</p>
        </div>
        
        <div className="bg-black px-3.5 py-1.5 rounded-none border border-white/5 text-right">
          <span className="text-[9px] text-neutral-500 block uppercase font-mono tracking-wider">LATENCY TO INDIA</span>
          <span className="text-xs font-mono font-bold text-blue-400">~8.4ms (Mumbai Region)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specification Selection Form */}
        <div className="lg:col-span-7 space-y-5">
          {/* Ram Options */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Layers size={14} className="text-neutral-500" />
                System RAM (Virtual Memory)
              </span>
              <span className="text-[11px] font-mono text-neutral-400">{ram} GB DDR4 ECC</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[2, 4, 8].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setRam(g)}
                  className={`p-3 rounded-none border text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    ram === g
                      ? 'border-white text-white bg-white/5'
                      : 'border-white/5 bg-black text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50'
                  }`}
                >
                  <span className="font-mono">{g} GB</span>
                  <span className="text-[9px] text-neutral-500 font-normal mt-0.5 uppercase tracking-wider">
                    {g === 2 ? 'Lowest Cost' : g === 4 ? 'Standard' : 'Power Elite'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* CPU Options */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                <Cpu size={14} className="text-neutral-500" />
                Processor Cores (vCPUs)
              </span>
              <span className="text-[11px] font-mono text-neutral-400">{cpu} vCPU Xeon Skylake</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[1, 2, 4].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCpu(c)}
                  className={`p-3 rounded-none border text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    cpu === c
                      ? 'border-white text-white bg-white/5'
                      : 'border-white/5 bg-black text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50'
                  }`}
                >
                  <span className="font-mono">{c} vCPU{c > 1 ? 's' : ''}</span>
                  <span className="text-[9px] text-neutral-500 font-normal mt-0.5 uppercase tracking-wider">
                    {c === 1 ? 'Eco Standard' : c === 2 ? 'Recommended' : 'Max Speed'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Storage Options */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] flex items-center gap-1.5">
                <HardDrive size={14} className="text-neutral-500" />
                SSD NVMe Storage
              </span>
              <span className="text-[11px] font-mono text-neutral-400">{storage} GB NVMe</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[40, 80, 120].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStorage(s)}
                  className={`p-3 rounded-none border text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    storage === s
                      ? 'border-white text-white bg-white/5'
                      : 'border-white/5 bg-black text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50'
                  }`}
                >
                  <span className="font-mono">{s} GB SSD</span>
                  <span className="text-[9px] text-neutral-500 font-normal mt-0.5 uppercase tracking-wider">
                    {s === 40 ? 'Base' : s === 80 ? 'Expanded' : 'High Volume'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Region selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-neutral-500" /> Datacenter Location
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-none p-3 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
              >
                <option value="Mumbai (India)">Mumbai (India) - Recommended</option>
                <option value="Tokyo (Japan)">Tokyo (Japan) - Fast Asia Inbound</option>
                <option value="Singapore">Singapore (South Asia Link)</option>
                <option value="Oregon (US)">Oregon (United States)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-1.5">
                <Terminal size={14} className="text-neutral-500" /> Pre-Configurations
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 bg-black border border-white/10 p-2.5 rounded-none cursor-pointer hover:bg-neutral-900/60 transition-colors">
                  <input
                    type="checkbox"
                    checked={preInstalled}
                    onChange={(e) => setPreInstalled(e.target.checked)}
                    className="rounded-none border-white/20 bg-black text-blue-600 focus:ring-0"
                  />
                  <span className="text-xs text-neutral-300 font-mono">Pre-install "Bot Fixed"</span>
                </label>
              </div>
            </div>
          </div>

          {/* Premium Tricks integration */}
          <div className="bg-black border border-white/5 p-4 rounded-none flex items-start gap-3">
            <input
              type="checkbox"
              id="tricks-checkbox"
              checked={addTricks}
              onChange={(e) => setAddTricks(e.target.checked)}
              className="mt-1 rounded-none border-white/20 bg-black text-blue-600 focus:ring-0 h-4 w-4"
            />
            <div className="flex-1">
              <label htmlFor="tricks-checkbox" className="text-xs font-bold text-blue-400 flex items-center gap-1.5 cursor-pointer uppercase tracking-wider">
                Include Premium Integration Techniques & Tricks (+₹250 / $3)
              </label>
              <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed font-mono">
                Includes automated watchdogs that auto-restart your bot if it crashes, low-latency API proxy techniques, custom secret indicator setup strategies, and 1-on-1 implementation trick guide by Jumpstreet.
              </p>
            </div>
          </div>
        </div>

        {/* Deploy & Summary Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-black border border-white/10 rounded-none p-5 space-y-6 flex flex-col justify-between h-full">
            <div>
              <h4 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.25em] mb-4 pb-2 border-b border-white/5">
                PROVISIONING ESTIMATE
              </h4>

              <div className="space-y-3.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Windows Server Suite</span>
                  <span className="text-neutral-300">Included</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">RAM allocation ({ram} GB DDR4)</span>
                  <span className="text-neutral-300">
                    {ram === 2 ? '₹299' : ram === 4 ? '₹549' : '₹1049'}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Processor capacity ({cpu} vCPU Xeon)</span>
                  <span className="text-neutral-300">
                    {cpu === 1 ? '₹0' : cpu === 2 ? '+₹150' : '+₹350'}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Storage capacity ({storage} GB NVMe)</span>
                  <span className="text-neutral-300">
                    {storage === 40 ? '₹0' : storage === 80 ? '+₹99' : '+₹199'}/mo
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Pre-installed software suite</span>
                  <span className="text-blue-400">FREE Setup</span>
                </div>
                {addTricks && (
                  <div className="flex justify-between items-center text-blue-400 font-medium">
                    <span>Premium Integration coaching</span>
                    <span>+₹250/mo</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-neutral-400">Auto-deployment region</span>
                  <span className="text-neutral-300">{region.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xs font-semibold text-neutral-500">Monthly Total:</span>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                  <span className="text-[10px] text-neutral-500 block">~ ${usdPrice} USD / mo</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleDeployConfig}
                  className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-xs font-bold tracking-widest uppercase rounded-none transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={16} />
                  {addedSuccess ? 'ADDED TO CHECKOUT!' : 'APPLY TO PAYMENT PORTAL'}
                </button>
                <span className="text-[10px] text-neutral-500 text-center block leading-normal font-mono">
                  Deploying Windows Server environment. Instant automated bootup within 3-5 minutes post payment verification.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
