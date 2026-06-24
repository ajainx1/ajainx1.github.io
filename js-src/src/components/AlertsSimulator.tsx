import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquare, Shield, BellRing, Smartphone, Zap, Play, Check } from 'lucide-react';
import { AlertNotification } from '../types';

const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'a1',
    type: 'telegram',
    pair: 'BTC/USDT',
    signalType: 'BUY',
    price: '92,450.50',
    indicator: 'EMA Golden Cross (50/200)',
    timestamp: 'Just now',
  },
  {
    id: 'a2',
    type: 'whatsapp',
    pair: 'ETH/USDT',
    signalType: 'SELL',
    price: '3,840.15',
    indicator: 'RSI Overbought (74.8)',
    timestamp: '2 mins ago',
  },
  {
    id: 'a3',
    type: 'signal',
    pair: 'SOL/USDT',
    signalType: 'BUY',
    price: '184.20',
    indicator: 'MACD Bullish Cross',
    timestamp: '5 mins ago',
  }
];

export default function AlertsSimulator() {
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [activePlatform, setActivePlatform] = useState<'telegram' | 'whatsapp' | 'signal'>('telegram');
  const [customPair, setCustomPair] = useState('BTC/USDT');
  const [customSignal, setCustomSignal] = useState<'BUY' | 'SELL'>('BUY');
  const [customIndicator, setCustomIndicator] = useState('RSI Oversold (28.5)');
  const [lastDelivered, setLastDelivered] = useState<string | null>(null);

  // Play a soft notification audio tone using Web Audio API (completely client side, fully compatible with sandbox)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5 note

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.45);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      // Audio context might be blocked by browser user gesture policies, ignore gracefully
    }
  };

  const handleTriggerAlert = () => {
    const prices: Record<string, string> = {
      'BTC/USDT': '92,480.00',
      'ETH/USDT': '3,845.50',
      'SOL/USDT': '185.10',
      'BNB/USDT': '612.40',
      'NIFTY 50': '23,520.15',
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

  // Get color schemes per platform
  const getPlatformDetails = (type: 'telegram' | 'whatsapp' | 'signal') => {
    switch (type) {
      case 'telegram':
        return {
          name: 'Telegram',
          color: 'bg-sky-500',
          textColor: 'text-sky-400',
          borderColor: 'border-sky-500/20',
          bgColor: 'bg-sky-950/20',
          hoverBg: 'hover:bg-sky-900/30',
          bubbleBg: 'bg-sky-900/40 border-sky-800/40',
        };
      case 'whatsapp':
        return {
          name: 'WhatsApp',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/20',
          bgColor: 'bg-emerald-950/20',
          hoverBg: 'hover:bg-emerald-900/30',
          bubbleBg: 'bg-emerald-900/40 border-emerald-800/40',
        };
      case 'signal':
        return {
          name: 'Signal',
          color: 'bg-blue-600',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20',
          bgColor: 'bg-blue-950/20',
          hoverBg: 'hover:bg-blue-900/30',
          bubbleBg: 'bg-blue-900/40 border-blue-800/40',
        };
    }
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-none p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold tracking-[0.2em] text-white flex items-center gap-2 uppercase">
            <BellRing size={16} className="text-blue-400 animate-bounce" />
            Live Alert Tester
          </h3>
          <p className="text-xs text-neutral-400 mt-1">Test how Bot Fixed generates alerts on WhatsApp, Telegram, or Signal</p>
        </div>
        <div className="text-[10px] font-mono bg-black px-2.5 py-1 rounded-none border border-white/5 text-blue-400 tracking-wider">
          ZERO LATENCY
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulator controls */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-2">
              1. Select Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['telegram', 'whatsapp', 'signal'] as const).map((plat) => {
                const details = getPlatformDetails(plat);
                const isSel = activePlatform === plat;
                return (
                  <button
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className={`p-2.5 rounded-none border text-[11px] font-mono tracking-wider uppercase transition-all flex flex-col items-center gap-1.5 ${
                      isSel
                        ? `text-white bg-black border-white/40 shadow-md`
                        : 'border-white/5 bg-black/40 text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900'
                    }`}
                  >
                    <span className={`w-2 h-2 ${details.color}`} />
                    {details.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-1.5">
              2. Trading Asset
            </label>
            <select
              value={customPair}
              onChange={(e) => setCustomPair(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-none p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
            >
              <option value="BTC/USDT">BTC/USDT (Crypto)</option>
              <option value="ETH/USDT">ETH/USDT (Crypto)</option>
              <option value="SOL/USDT">SOL/USDT (Crypto)</option>
              <option value="NIFTY 50">NIFTY 50 (Indian Indices)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-1.5">
                3. Direction
              </label>
              <div className="grid grid-cols-2 gap-1.5 bg-black p-1 rounded-none border border-white/10">
                <button
                  type="button"
                  onClick={() => setCustomSignal('BUY')}
                  className={`py-1.5 rounded-none text-xs font-bold tracking-wider transition-all ${
                    customSignal === 'BUY'
                      ? 'bg-white text-black'
                      : 'text-neutral-500 hover:text-neutral-200'
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setCustomSignal('SELL')}
                  className={`py-1.5 rounded-none text-xs font-bold tracking-wider transition-all ${
                    customSignal === 'SELL'
                      ? 'bg-neutral-800 text-white'
                      : 'text-neutral-500 hover:text-neutral-200'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-1.5">
                4. Logic Trigger
              </label>
              <select
                value={customIndicator}
                onChange={(e) => setCustomIndicator(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-none p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
              >
                <option value="RSI Oversold (28.5)">RSI Oversold</option>
                <option value="EMA Golden Cross (50/200)">EMA Golden Cross</option>
                <option value="MACD Bullish Cross">MACD Bullish Cross</option>
                <option value="S/R Bounce Confirm">S/R Bounce</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleTriggerAlert}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-none text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group shadow-xl hover:shadow-blue-600/15"
          >
            <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Fire Simulated Alert Tone
          </button>

          <div className="bg-black border border-white/5 rounded-none p-3 text-[11px] text-neutral-400 leading-relaxed font-mono">
            <span className="font-bold text-blue-400">🚀 FULLY SET: WE PROVIDE.</span> Instant webhook alert deliveries with near zero latency. Avoid screen fatigue. Link it to premium VMs!
          </div>
        </div>

        {/* Live Device Monitor Render */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div className="border border-white/10 bg-black rounded-none overflow-hidden shadow-2xl flex flex-col h-[340px] relative">
            
            {/* Phone Status bar */}
            <div className="bg-neutral-950 px-4 py-2 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                <Smartphone size={12} className="text-blue-400" />
                <span>JUMPSTREET BOT SIM v1.0</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                <span>5G J-SIM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              </div>
            </div>

            {/* Messenger chat window */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-black">
              {alerts.filter(a => a.type === activePlatform).length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-6 text-neutral-600 font-mono">
                  <div>
                    <MessageSquare size={30} className="mx-auto mb-2 text-neutral-700" />
                    <p className="text-[11px] tracking-wider uppercase">No alerts generated yet. Trigger above to test!</p>
                  </div>
                </div>
              ) : (
                alerts
                  .filter((a) => a.type === activePlatform)
                  .map((alert) => {
                    const platformDetails = getPlatformDetails(alert.type);
                    const isNewest = lastDelivered === alert.id;
                    return (
                      <div
                        key={alert.id}
                        className={`p-3.5 rounded-none border transition-all duration-500 bg-neutral-950 border-white/5 ${
                          isNewest 
                            ? 'scale-[1.02] border-blue-500/50 ring-1 ring-blue-500/10' 
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-none uppercase font-mono border ${
                            alert.signalType === 'BUY' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-950/20' : 'border-rose-500/30 text-rose-400 bg-rose-950/20'
                          }`}>
                            🎯 BOT FIXED - {alert.signalType} SIGNAL
                          </span>
                          <span className="text-[9px] text-neutral-500 font-mono">{alert.timestamp.toUpperCase()}</span>
                        </div>
                        
                        <div className="text-[11px] font-mono space-y-1 text-neutral-300">
                          <div>
                            <span className="text-neutral-500">Asset Pair:</span> <strong className="text-white font-medium">{alert.pair}</strong>
                          </div>
                          <div>
                            <span className="text-neutral-500">Trigger Logic:</span> <span className="text-blue-400 font-medium">{alert.indicator}</span>
                          </div>
                          <div>
                            <span className="text-neutral-500">Entry Price:</span> <strong className="text-neutral-100 font-mono">{alert.price} USDT</strong>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-neutral-500 font-mono uppercase">
                          <span className="flex items-center gap-1 text-blue-400">
                            <Check size={11} /> Delivered via Jumpstreet API
                          </span>
                          <span className="text-neutral-600">ID: {alert.id.substring(0,6)}</span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Platform indicator badge */}
            <div className="absolute bottom-2 right-2 bg-neutral-950 border border-white/5 px-2.5 py-1 rounded-none text-[9px] text-neutral-400 font-mono uppercase tracking-wider">
              {getPlatformDetails(activePlatform).name} Feed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
