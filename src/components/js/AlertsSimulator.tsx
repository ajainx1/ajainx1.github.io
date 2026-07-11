"use client";
import React, { useState } from 'react';
import { Send, MessageSquare, BellRing, Smartphone, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertNotification } from './types';

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

  const inputClass = "w-full bg-[var(--card2)] border border-[var(--border)] text-[var(--fg)] outline-none px-3 py-2.5 text-xs font-mono rounded-lg focus:border-[var(--primary)] transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[var(--border)] p-4 sm:p-6 shadow-2xl bg-[var(--card)] backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4">
         <BellRing size={300} className="text-[var(--primary)]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-3 relative z-10">
        <div>
          <h3 className="text-sm sm:text-base font-bold tracking-[0.2em] flex items-center gap-2 uppercase text-[var(--fg)]">
            <BellRing size={18} className="text-[var(--primary)]" />
            Live Alert Tester
          </h3>
          <p className="text-xs mt-1.5 font-mono text-[var(--muted)]">
            Simulate telemetry webhook triggers for microstructural trade indicators to external endpoints.
          </p>
        </div>
        <div className="text-[9px] font-mono px-3 py-1.5 rounded-lg tracking-wider text-[var(--primary)] bg-[var(--primary)]/10 border border-[var(--primary)]/20 shadow-[0_0_10px_rgba(56,189,248,0.15)] animate-pulse">
          ZERO LATENCY
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 relative z-10">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Platform selector */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
              1. Select Platform
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['telegram', 'whatsapp', 'signal'] as const).map(plat => {
                const p = getPlatform(plat);
                const isSel = activePlatform === plat;
                return (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className={`p-3 rounded-lg text-[10px] sm:text-[11px] font-mono tracking-wider uppercase transition-all flex flex-col items-center gap-2 border relative overflow-hidden ${
                      isSel 
                        ? 'bg-[var(--card2)] border-[var(--primary)]/50 text-[var(--fg)] shadow-[0_0_15px_rgba(56,189,248,0.15)]' 
                        : 'bg-[var(--card)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--card2)]'
                    }`}
                  >
                    {isSel && (
                      <motion.div 
                        layoutId="activePlatformIndicator"
                        className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/10 to-transparent pointer-events-none" 
                      />
                    )}
                    <span className="w-2.5 h-2.5 rounded-full z-10" style={{ background: p.dot, boxShadow: `0 0 8px ${p.dot}` }} />
                    <span className="z-10">{p.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Trading Asset */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                3. Logic
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[var(--card2)] border border-[var(--border)]">
                {(['BUY', 'SELL'] as const).map(sig => (
                  <button
                    key={sig}
                    type="button"
                    onClick={() => setCustomSignal(sig)}
                    className={`py-1.5 rounded-md text-xs font-bold tracking-wider transition-all ${
                      customSignal === sig 
                        ? (sig === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400') 
                        : 'text-[var(--muted)] hover:bg-[var(--card)]'
                    }`}
                  >
                    {sig}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
                4. Indicator
              </label>
              <select value={customIndicator} onChange={e => setCustomIndicator(e.target.value)} className={inputClass} style={{ height: '38px' }}>
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
            className="w-full py-3.5 mt-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group shadow-xl bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--primary)] hover:text-white hover:shadow-[var(--primary)]/20"
          >
            <Send size={15} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            Fire Simulated Alert
          </motion.button>
        </div>

        {/* Phone Simulator */}
        <div className="lg:col-span-7">
          <div className="relative border border-[var(--border)] overflow-hidden shadow-2xl flex flex-col rounded-2xl bg-[var(--card2)]/30 h-[400px]">
             
            {/* Status bar */}
            <div className="px-5 py-3 flex justify-between items-center border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted)]">
                <Smartphone size={12} className="text-[var(--primary)]" />
                JUMPSTREET BOT SIM v1.0
              </div>
              <div className="flex items-center gap-2.5 text-[10px] font-mono text-[var(--muted)]">
                <span>5G J-SIM</span>
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <AnimatePresence initial={false}>
                {alerts.filter(a => a.type === activePlatform).length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex items-center justify-center text-center p-6 font-mono text-[var(--muted)]"
                  >
                    <div>
                      <MessageSquare size={32} className="mx-auto mb-3 opacity-40" />
                      <p className="text-[11px] uppercase tracking-wider">No alerts yet. Trigger above!</p>
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
                          className={`p-4 rounded-xl border transition-all duration-300 relative overflow-hidden ${
                            isNewest 
                              ? 'bg-[var(--card)] border-[var(--primary)]/50 shadow-[0_0_15px_rgba(56,189,248,0.1)]' 
                              : 'bg-[var(--card)]/50 border-[var(--border)]'
                          }`}
                        >
                          {isNewest && (
                            <motion.div
                               initial={{ opacity: 1 }}
                               animate={{ opacity: 0 }}
                               transition={{ duration: 1.5 }}
                               className="absolute inset-0 bg-[var(--primary)]/10 pointer-events-none"
                            />
                          )}
                          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                            <span
                              className={`text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase font-mono border ${
                                alert.signalType === 'BUY'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              🎯 BOT FIXED — {alert.signalType} SIGNAL
                            </span>
                            <span className="text-[10px] font-mono text-[var(--muted)]">
                              {alert.timestamp.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-xs font-mono space-y-1.5 text-[var(--muted)]">
                            <div>
                              <span>Asset:</span>{' '}
                              <strong className="text-[var(--fg)]">{alert.pair}</strong>
                            </div>
                            <div>
                              <span>Logic:</span>{' '}
                              <span className="text-[var(--primary)] font-medium">{alert.indicator}</span>
                            </div>
                            <div>
                              <span>Price:</span>{' '}
                              <strong className="text-[var(--fg)]">{alert.price} USDT</strong>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[10px] font-mono uppercase text-[var(--muted)]">
                            <span className="flex items-center gap-1.5 text-[var(--primary)]">
                              <Check size={12} /> Delivered via Jumpstreet API
                            </span>
                            <span className="opacity-50">
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
            <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider bg-[var(--card)]/90 backdrop-blur border border-[var(--border)] text-[var(--muted)] shadow-lg z-20">
              {getPlatform(activePlatform).name} Feed
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
