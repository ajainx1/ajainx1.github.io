"use client";
import React, { useState } from 'react';
import { Send, MessageSquare, BellRing, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertNotification } from './types';
import TiltWrapper from '@/components/3d/TiltWrapper';

const INITIAL_ALERTS: AlertNotification[] = [
  { id: 'a1', type: 'telegram', pair: 'BTC/USDT', signalType: 'BUY',  price: '92,450.50', indicator: 'Order Book Imbalance (Microstructural Buy Signal)', timestamp: 'Just now' },
  { id: 'a2', type: 'whatsapp', pair: 'ETH/USDT', signalType: 'SELL', price: '3,840.15',  indicator: 'BBO Spread Flap (Volatility Sell Signal)',    timestamp: '2 mins ago' },
  { id: 'a3', type: 'signal',   pair: 'SOL/USDT', signalType: 'BUY',  price: '184.20',    indicator: 'Mean Reversion Z-Score Arbitrage Buy (Z < -2.5)',       timestamp: '5 mins ago' },
];

export default function AlertsSimulator() {
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [activePlatform, setActivePlatform] = useState<'telegram' | 'whatsapp' | 'signal'>('telegram');
  const [customPair, setCustomPair] = useState('BTC/USDT');
  const [customSignal, setCustomSignal] = useState<'BUY' | 'SELL'>('BUY');
  const [customIndicator, setCustomIndicator] = useState('Mean Reversion Z-Score Arbitrage Buy (Z < -2.5)');
  const [lastDelivered, setLastDelivered] = useState<string | null>(null);

  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch {}
  };

  const handleTriggerAlert = () => {
    const prices: Record<string, string> = {
      'BTC/USDT': '92,480.00', 'ETH/USDT': '3,845.50',
      'SOL/USDT': '185.10', 'BNB/USDT': '612.40', 'NIFTY 50': '23,520.15',
    };
    const newAlert: AlertNotification = {
      id: Math.random().toString(),
      type: activePlatform,
      pair: customPair,
      signalType: customSignal,
      price: prices[customPair] || '1.00',
      indicator: customIndicator,
      timestamp: 'Just now',
    };
    setAlerts([newAlert, ...alerts.slice(0, 5)]);
    playNotificationSound();
    setLastDelivered(newAlert.id);
    setTimeout(() => setLastDelivered(null), 1500);
  };

  const getPlatform = (type: 'telegram' | 'whatsapp' | 'signal') => ({
    telegram: { name: 'Telegram', dot: '#38bdf8', label: 'sky' },
    whatsapp: { name: 'WhatsApp', dot: '#34d399', label: 'emerald' },
    signal:   { name: 'Signal',   dot: '#60a5fa', label: 'blue' },
  }[type]);

  const inputClass = "w-full bg-slate-50 border border-black/5 text-slate-900 outline-none px-4 py-3 text-sm font-medium rounded-[12px] focus:border-blue-300 focus:bg-white transition-colors shadow-sm";

  return (
    <TiltWrapper>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[24px] border border-white/60 p-6 sm:p-8 shadow-sm bg-white/60 backdrop-blur-2xl relative overflow-hidden"
    >
      <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4">
         <BellRing size={300} className="text-blue-600" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-10 flex-wrap gap-4 relative z-10">
        <div>
          <h3 className="text-lg sm:text-xl font-black tracking-widest flex items-center gap-3 uppercase text-slate-900 font-title">
            <BellRing size={22} className="text-blue-600" />
            Live Alert Tester
          </h3>
          <p className="text-sm mt-2 font-medium text-slate-500 max-w-md">
            Simulate telemetry webhook triggers for microstructural trade indicators to external endpoints.
          </p>
        </div>
        <div className="text-[10px] font-bold px-4 py-2 rounded-full tracking-widest uppercase text-blue-700 bg-blue-50 border border-blue-100 shadow-sm animate-pulse">
          ZERO LATENCY
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 relative z-10">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-8">
          {/* Platform selector */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
              1. Select Platform
            </label>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {(['telegram', 'whatsapp', 'signal'] as const).map(plat => {
                const p = getPlatform(plat);
                const isSel = activePlatform === plat;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className={`p-4 rounded-[16px] text-xs font-bold tracking-widest uppercase transition-all flex flex-col items-center gap-2.5 border relative overflow-hidden ${
                      isSel 
                        ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' 
                        : 'bg-white border-black/5 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {isSel && (
                      <motion.div 
                        layoutId="activePlatformIndicator"
                        className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent pointer-events-none" 
                      />
                    )}
                    <span className="w-3 h-3 rounded-full z-10" style={{ background: p.dot, boxShadow: `0 0 10px ${p.dot}` }} />
                    <span className="z-10">{p.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Trading Asset */}
          <div className="space-y-3">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
              2. Trading Asset
            </label>
            <select value={customPair} onChange={e => setCustomPair(e.target.value)} className={inputClass}>
              <option value="BTC/USDT">BTC/USDT (Crypto)</option>
              <option value="ETH/USDT">ETH/USDT (Crypto)</option>
              <option value="SOL/USDT">SOL/USDT (Crypto)</option>
              <option value="NIFTY 50">NIFTY 50 (Indian Indices)</option>
            </select>
          </div>

          {/* Direction + Indicator */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                3. Logic
              </label>
              <div className="grid grid-cols-2 gap-2 p-2 rounded-[16px] bg-slate-100 border border-black/5 shadow-inner">
                {(['BUY', 'SELL'] as const).map(sig => (
                  <button
                    key={sig}
                    type="button"
                    onClick={() => setCustomSignal(sig)}
                    className={`py-2 rounded-lg text-xs font-bold tracking-widest transition-all ${
                      customSignal === sig 
                        ? (sig === 'BUY' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-red-500 text-white shadow-sm') 
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {sig}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
                4. Indicator
              </label>
              <select value={customIndicator} onChange={e => setCustomIndicator(e.target.value)} className={inputClass}>
                <option value="Mean Reversion Z-Score Arbitrage Buy (Z < -2.5)">RSI Oversold</option>
                <option value="Order Book Imbalance (Microstructural Buy Signal)">EMA Golden Cross</option>
                <option value="Mean Reversion Z-Score Arbitrage Buy (Z < -2.5)">Mean Reversion Z-Score</option>
                <option value="S/R Breakthrough (Volume Spike Confirm)">S/R Breakthrough</option>
              </select>
            </div>
          </div>

          {/* Fire button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTriggerAlert}
            className="w-full py-4 mt-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-3 group shadow-md hover:shadow-xl bg-slate-900 text-white hover:bg-blue-600"
          >
            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Fire Simulated Alert
          </motion.button>
        </div>

        {/* Phone Simulator */}
        <div className="lg:col-span-7">
          <div className="relative border border-black/5 overflow-hidden shadow-inner flex flex-col rounded-[24px] bg-slate-50/80 h-[500px]">
             
            {/* Status bar */}
            <div className="px-6 py-4 flex justify-between items-center border-b border-black/5 bg-white/80 backdrop-blur-xl">
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <Smartphone size={14} className="text-blue-600" />
                JUMPSTREET BOT SIM v1.0
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                <span>5G J-SIM</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm" />
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 p-6 overflow-y-auto space-y-5">
              <AnimatePresence initial={false}>
                {alerts.filter(a => a.type === activePlatform).length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center text-center p-8 font-medium text-slate-400"
                  >
                    <div>
                      <MessageSquare size={40} className="mx-auto mb-4 opacity-50 text-slate-300" />
                      <p className="text-xs uppercase tracking-widest font-bold">No alerts yet. Trigger above!</p>
                    </div>
                  </motion.div>
                ) : (
                  alerts
                    .filter(a => a.type === activePlatform)
                    .map((alert, i) => {
                      const isNewest = lastDelivered === alert.id;
                      return (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, y: 20, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
                          className={`p-5 rounded-[16px] border transition-all duration-300 relative overflow-hidden shadow-sm ${
                            isNewest 
                              ? 'bg-white border-blue-200 shadow-md' 
                              : 'bg-white/80 border-black/5'
                          }`}
                        >
                          {isNewest && (
                            <motion.div
                               initial={{ opacity: 1 }}
                               animate={{ opacity: 0 }}
                               transition={{ duration: 1.5 }}
                               className="absolute inset-0 bg-blue-50/50 pointer-events-none"
                            />
                          )}
                          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                            <span
                              className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full uppercase border ${
                                alert.signalType === 'BUY'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : 'bg-red-50 text-red-600 border-red-100'
                              }`}
                            >
                              🎯 BOT FIXED — {alert.signalType} SIGNAL
                            </span>
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                              {alert.timestamp.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-sm font-medium space-y-2 text-slate-600">
                            <div>
                              <span>Asset:</span>{' '}
                              <strong className="text-slate-900">{alert.pair}</strong>
                            </div>
                            <div>
                              <span>Logic:</span>{' '}
                              <span className="text-blue-600 font-bold">{alert.indicator}</span>
                            </div>
                            <div>
                              <span>Price:</span>{' '}
                              <strong className="text-slate-900">{alert.price} USDT</strong>
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-slate-400">
                            <span className="flex items-center gap-2 text-blue-600">
                              <Check size={14} /> Delivered via Jumpstreet API
                            </span>
                            <span className="opacity-60">
                              ID: {alert.id.substring(0, 6)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                )}
              </AnimatePresence>
            </div>

            {/* Platform badge */}
            <div className="absolute bottom-4 right-4 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md border border-black/5 text-slate-500 shadow-sm z-20">
              {getPlatform(activePlatform).name} Feed
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    </TiltWrapper>
  );
}
