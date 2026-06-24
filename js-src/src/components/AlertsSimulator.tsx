import React, { useState } from 'react';
import { Send, MessageSquare, BellRing, Smartphone, Check } from 'lucide-react';
import { AlertNotification } from '../types';

const INITIAL_ALERTS: AlertNotification[] = [
  { id: 'a1', type: 'telegram', pair: 'BTC/USDT', signalType: 'BUY',  price: '92,450.50', indicator: 'EMA Golden Cross (50/200)', timestamp: 'Just now' },
  { id: 'a2', type: 'whatsapp', pair: 'ETH/USDT', signalType: 'SELL', price: '3,840.15',  indicator: 'RSI Overbought (74.8)',    timestamp: '2 mins ago' },
  { id: 'a3', type: 'signal',   pair: 'SOL/USDT', signalType: 'BUY',  price: '184.20',    indicator: 'MACD Bullish Cross',       timestamp: '5 mins ago' },
];

interface AlertsSimulatorProps { isDark: boolean; }

export default function AlertsSimulator({ isDark }: AlertsSimulatorProps) {
  const [alerts, setAlerts] = useState<AlertNotification[]>(INITIAL_ALERTS);
  const [activePlatform, setActivePlatform] = useState<'telegram' | 'whatsapp' | 'signal'>('telegram');
  const [customPair, setCustomPair] = useState('BTC/USDT');
  const [customSignal, setCustomSignal] = useState<'BUY' | 'SELL'>('BUY');
  const [customIndicator, setCustomIndicator] = useState('RSI Oversold (28.5)');
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

  const cardBg = isDark ? '#111111' : '#ffffff';
  const deepBg = isDark ? '#000' : '#f8f8fa';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#fff' : '#111';
  const textSecondary = isDark ? '#9ca3af' : '#666';
  const textMuted = isDark ? '#4b5563' : '#aaa';
  const inputStyle: React.CSSProperties = {
    background: deepBg,
    border: `1px solid ${borderColor}`,
    color: textPrimary,
    outline: 'none',
    width: '100%',
    padding: '10px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    borderRadius: '2px',
  };

  return (
    <div
      className="rounded-sm border p-4 sm:p-6 shadow-2xl"
      style={{ background: cardBg, borderColor }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold tracking-[0.2em] flex items-center gap-2 uppercase"
              style={{ color: textPrimary }}>
            <BellRing size={16} className="text-blue-400 animate-bounce" />
            Live Alert Tester
          </h3>
          <p className="text-xs mt-1 font-mono" style={{ color: textSecondary }}>
            Test how Bot Fixed generates alerts on WhatsApp, Telegram, or Signal
          </p>
        </div>
        <div
          className="text-[10px] font-mono px-2.5 py-1 rounded-sm tracking-wider text-blue-400"
          style={{ background: deepBg, border: `1px solid ${borderColor}` }}
        >
          ZERO LATENCY
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Platform selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                   style={{ color: textSecondary }}>
              1. Select Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['telegram', 'whatsapp', 'signal'] as const).map(plat => {
                const p = getPlatform(plat);
                const isSel = activePlatform === plat;
                return (
                  <button
                    key={plat}
                    onClick={() => setActivePlatform(plat)}
                    className="p-2.5 rounded-sm text-[11px] font-mono tracking-wider uppercase transition-all flex flex-col items-center gap-1.5"
                    style={{
                      border: `1px solid ${isSel ? 'rgba(255,255,255,0.35)' : borderColor}`,
                      background: isSel ? (isDark ? '#0d0d0d' : '#f5f5f8') : (isDark ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.02)'),
                      color: isSel ? textPrimary : textSecondary,
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: p.dot }} />
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trading Asset */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                   style={{ color: textSecondary }}>
              2. Trading Asset
            </label>
            <select value={customPair} onChange={e => setCustomPair(e.target.value)} style={inputStyle}>
              <option value="BTC/USDT">BTC/USDT (Crypto)</option>
              <option value="ETH/USDT">ETH/USDT (Crypto)</option>
              <option value="SOL/USDT">SOL/USDT (Crypto)</option>
              <option value="NIFTY 50">NIFTY 50 (Indian Indices)</option>
            </select>
          </div>

          {/* Direction + Indicator */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                     style={{ color: textSecondary }}>
                3. Direction
              </label>
              <div className="grid grid-cols-2 gap-1 p-1 rounded-sm"
                   style={{ background: deepBg, border: `1px solid ${borderColor}` }}>
                {(['BUY', 'SELL'] as const).map(sig => (
                  <button
                    key={sig}
                    type="button"
                    onClick={() => setCustomSignal(sig)}
                    className="py-1.5 rounded-sm text-xs font-bold tracking-wider transition-all"
                    style={{
                      background: customSignal === sig ? (isDark ? '#fff' : '#111') : 'transparent',
                      color: customSignal === sig ? (isDark ? '#000' : '#fff') : textSecondary,
                    }}
                  >
                    {sig}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                     style={{ color: textSecondary }}>
                4. Indicator
              </label>
              <select value={customIndicator} onChange={e => setCustomIndicator(e.target.value)} style={{ ...inputStyle, height: '38px' }}>
                <option value="RSI Oversold (28.5)">RSI Oversold</option>
                <option value="EMA Golden Cross (50/200)">EMA Golden Cross</option>
                <option value="MACD Bullish Cross">MACD Bullish Cross</option>
                <option value="S/R Bounce Confirm">S/R Bounce</option>
              </select>
            </div>
          </div>

          {/* Fire button */}
          <button
            onClick={handleTriggerAlert}
            className="w-full py-3 text-white rounded-sm text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 group shadow-xl"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}
          >
            <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Fire Simulated Alert
          </button>

          <div
            className="p-3 rounded-sm text-[11px] leading-relaxed font-mono"
            style={{ background: deepBg, border: `1px solid ${borderColor}`, color: textSecondary }}
          >
            <span className="font-bold text-blue-400">🚀 FULLY SET: WE PROVIDE.</span>{' '}
            Instant webhook alert deliveries with near zero latency. Link it to premium VMs!
          </div>
        </div>

        {/* Phone Simulator */}
        <div className="lg:col-span-7">
          <div
            className="border overflow-hidden shadow-2xl flex flex-col rounded-sm"
            style={{ height: '320px', background: deepBg, borderColor }}
          >
            {/* Status bar */}
            <div
              className="px-4 py-2 flex justify-between items-center border-b"
              style={{ background: isDark ? '#050505' : '#f2f2f5', borderColor }}
            >
              <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: textSecondary }}>
                <Smartphone size={11} className="text-blue-400" />
                JUMPSTREET BOT SIM v1.0
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: textSecondary }}>
                <span>5G J-SIM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              </div>
            </div>

            {/* Chat window */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3"
                 style={{ background: isDark ? '#000' : '#fafafa' }}>
              {alerts.filter(a => a.type === activePlatform).length === 0 ? (
                <div className="h-full flex items-center justify-center text-center p-6 font-mono"
                     style={{ color: textMuted }}>
                  <div>
                    <MessageSquare size={28} className="mx-auto mb-2" style={{ opacity: 0.4 }} />
                    <p className="text-[11px] uppercase tracking-wider">No alerts yet. Trigger above!</p>
                  </div>
                </div>
              ) : (
                alerts
                  .filter(a => a.type === activePlatform)
                  .map(alert => {
                    const isNewest = lastDelivered === alert.id;
                    return (
                      <div
                        key={alert.id}
                        className="p-3 rounded-sm border transition-all duration-500 animate-fade-in-up"
                        style={{
                          background: isDark ? '#0d0d0d' : '#fff',
                          borderColor: isNewest ? 'rgba(59,130,246,0.45)' : borderColor,
                          transform: isNewest ? 'scale(1.015)' : 'scale(1)',
                          boxShadow: isNewest ? '0 0 0 1px rgba(59,130,246,0.18)' : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                          <span
                            className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-sm uppercase font-mono border"
                            style={{
                              background: alert.signalType === 'BUY'
                                ? 'rgba(52,211,153,0.1)' : 'rgba(251,113,133,0.1)',
                              color: alert.signalType === 'BUY' ? '#34d399' : '#fb7185',
                              borderColor: alert.signalType === 'BUY'
                                ? 'rgba(52,211,153,0.25)' : 'rgba(251,113,133,0.25)',
                            }}
                          >
                            🎯 BOT FIXED — {alert.signalType} SIGNAL
                          </span>
                          <span className="text-[9px] font-mono" style={{ color: textMuted }}>
                            {alert.timestamp.toUpperCase()}
                          </span>
                        </div>

                        <div className="text-[11px] font-mono space-y-1" style={{ color: isDark ? '#d1d5db' : '#555' }}>
                          <div>
                            <span style={{ color: textMuted }}>Asset:</span>{' '}
                            <strong style={{ color: textPrimary }}>{alert.pair}</strong>
                          </div>
                          <div>
                            <span style={{ color: textMuted }}>Logic:</span>{' '}
                            <span className="text-blue-400 font-medium">{alert.indicator}</span>
                          </div>
                          <div>
                            <span style={{ color: textMuted }}>Price:</span>{' '}
                            <strong style={{ color: textPrimary }}>{alert.price} USDT</strong>
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t flex items-center justify-between text-[9px] font-mono uppercase"
                             style={{ borderColor, color: textMuted }}>
                          <span className="flex items-center gap-1 text-blue-400">
                            <Check size={10} /> Delivered via Jumpstreet API
                          </span>
                          <span style={{ color: isDark ? '#374151' : '#ddd' }}>
                            ID: {alert.id.substring(0, 6)}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Platform badge */}
            <div
              className="absolute bottom-2 right-2 px-2.5 py-1 rounded-sm text-[9px] font-mono uppercase tracking-wider"
              style={{ background: isDark ? '#0a0a0a' : '#f0f0f3', border: `1px solid ${borderColor}`, color: textMuted, position: 'relative' }}
            >
              {getPlatform(activePlatform).name} Feed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
