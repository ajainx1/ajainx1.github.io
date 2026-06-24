import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Layers,
  Terminal,
  TrendingUp,
  Radio,
  ExternalLink,
  FileCheck,
  Clock,
  Sliders,
  ShoppingCart,
  Menu,
  X,
  CreditCard,
  MessageSquare,
  Sun,
  Moon,
  Eye,
  Zap,
  Server
} from 'lucide-react';

import { Product, VMConfig, PaymentSubmission } from './types';
import SpotifyWidget from './components/SpotifyWidget';
import AlertsSimulator from './components/AlertsSimulator';
import VmConfigurator from './components/VmConfigurator';
import ProductCatalog from './components/ProductCatalog';
import PaymentPortal from './components/PaymentPortal';

/* ─── Visit counter hook ─── */
function useVisitCounter() {
  const [count, setCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('jumpstreet_visits') || '0', 10);
    const newCount = stored + 1;
    localStorage.setItem('jumpstreet_visits', String(newCount));
    setCount(newCount);

    // Animate count-up
    let current = Math.max(0, newCount - 20);
    const step = () => {
      current++;
      setDisplayCount(current);
      if (current < newCount) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  return { count, displayCount };
}

/* ─── Dark mode hook ─── */
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('jumpstreet_theme');
    return stored !== 'light'; // default dark
  });

  useEffect(() => {
    if (isDark) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
    localStorage.setItem('jumpstreet_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(p => !p) };
}

/* ─── Dark Mode Toggle Component ─── */
function DarkModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="dark-mode-toggle"
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:block"
            style={{ color: isDark ? '#9ca3af' : '#555' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
      <div className={`toggle-track ${isDark ? '' : 'is-light'}`}>
        <div className="toggle-thumb" />
      </div>
      {isDark
        ? <Moon size={13} style={{ color: '#60a5fa' }} />
        : <Sun size={13} style={{ color: '#f59e0b' }} />
      }
    </button>
  );
}

/* ─── Visit Counter Badge ─── */
function VisitCounterBadge({ displayCount, isDark }: { displayCount: number; isDark: boolean }) {
  return (
    <div className="visit-counter-badge" aria-label="Visit counter">
      <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" style={{ flexShrink: 0 }} />
      <Eye size={12} style={{ color: '#60a5fa', flexShrink: 0 }} />
      <span
        className="font-mono font-bold text-[11px]"
        style={{ color: isDark ? '#e5e7eb' : '#111' }}
      >
        {displayCount.toLocaleString('en-IN')}
      </span>
      <span
        className="font-mono text-[9px] uppercase tracking-wider"
        style={{ color: isDark ? '#6b7280' : '#888' }}
      >
        visits
      </span>
    </div>
  );
}

/* ─── Notification ticker ─── */
const TICKER_ITEMS = [
  '🚀 Bot Fixed indicator package now live',
  '📡 5G SIM Hotspots in stock — 14 units left',
  '⚡ Zero-latency Windows Cloud VMs available',
  '🇮🇳 Express shipping from New Delhi',
  '🤖 Automated watchdogs pre-installed on all VMs',
  '💳 UPI & Card payments accepted',
  '🔒 Managed by Jumpstreet — A Mangalik & Sons Venture',
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'vm' | 'alerts' | 'checkout' | 'orders'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customVmConfig, setCustomVmConfig] = useState<{ config: VMConfig; price: number } | null>(null);
  const [orders, setOrders] = useState<PaymentSubmission[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { displayCount } = useVisitCounter();

  const cardBg = isDark ? 'bg-[#111111]' : 'bg-white';
  const cardBorder = isDark ? 'border-white/10' : 'border-black/8';
  const deepBg = isDark ? 'bg-[#0A0A0A]' : 'bg-[#F4F4F6]';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-neutral-400' : 'text-gray-500';
  const textMuted = isDark ? 'text-neutral-500' : 'text-gray-400';
  const navBg = isDark ? 'bg-black/90' : 'bg-white/95';
  const inputStyle = isDark
    ? 'bg-black border-white/10 text-neutral-200 focus:border-white/40'
    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-400';
  const deepCardBg = isDark ? 'bg-black' : 'bg-gray-100';

  // Load orders
  useEffect(() => {
    const savedOrders = localStorage.getItem('jumpstreet_orders');
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch {}
    } else {
      const seed: PaymentSubmission = {
        id: 'TXN-842013',
        planId: 'bot_standard',
        planName: 'Bot Fixed - Standard License',
        amountPaid: 999,
        currency: 'INR',
        paymentMethod: 'UPI',
        utrNo: '412095384112',
        email: 'jain.aditya33@gmail.com',
        telegramUsername: '@ajain_fixed',
        status: 'pending_verification',
        createdAt: new Date(Date.now() - 3600000).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }),
        hasVM: false,
      };
      setOrders([seed]);
      localStorage.setItem('jumpstreet_orders', JSON.stringify([seed]));
    }
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCustomVmConfig(null);
    setActiveTab('checkout');
  };

  const handleAddVmToCart = (config: VMConfig, price: number) => {
    setCustomVmConfig({ config, price });
    setSelectedProduct(null);
    setActiveTab('checkout');
  };

  const handlePaymentSubmitted = (submission: PaymentSubmission) => {
    const updated = [submission, ...orders];
    setOrders(updated);
    localStorage.setItem('jumpstreet_orders', JSON.stringify(updated));
    setActiveTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOrder = (id: string) => {
    const filtered = orders.filter(o => o.id !== id);
    setOrders(filtered);
    localStorage.setItem('jumpstreet_orders', JSON.stringify(filtered));
  };

  const navItems: { key: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { key: 'store',    label: 'Store',    icon: <TrendingUp size={14} /> },
    { key: 'vm',       label: 'Cloud VM', icon: <Server size={14} /> },
    { key: 'alerts',   label: 'Alerts',   icon: <Radio size={14} /> },
    { key: 'checkout', label: 'Checkout', icon: <ShoppingCart size={14} /> },
    { key: 'orders',   label: 'Orders',   icon: <FileCheck size={14} /> },
  ];

  return (
    <div className={`min-h-screen ${deepBg} ${textPrimary} flex flex-col font-sans`}
         style={{ transition: 'background 0.35s, color 0.35s' }}>

      {/* ── Decorative Grid Mesh ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.07]"
           style={{
             backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
             backgroundSize: '28px 28px',
           }} />

      {/* ── Ambient Glow Blobs ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
      <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* ── Notification Ticker Bar ── */}
      <div
        className="relative z-10 border-b py-2 overflow-hidden"
        style={{
          background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(240,240,245,0.95)',
          borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
        }}
      >
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className={`inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider mx-8 ${textMuted}`}>
                {item}
                <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-blue-500' : 'bg-blue-400'}`} />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-6 py-3"
        style={{
          background: isDark ? 'rgba(5,5,5,0.92)' : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-black text-base sm:text-lg shadow-xl animate-glow"
              style={{
                background: isDark ? '#fff' : '#111',
                color: isDark ? '#000' : '#fff',
                borderRadius: '4px',
              }}
            >
              J
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-2">
                <span className={`text-xs sm:text-sm font-bold tracking-[0.15em] uppercase ${textPrimary}`}>
                  Jumpstreet
                </span>
                <span
                  className="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest hidden sm:inline"
                  style={{
                    background: isDark ? '#1a1a1a' : '#f0f0f2',
                    color: isDark ? '#6b7280' : '#888',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  M&amp;S Venture
                </span>
              </div>
              <p className={`text-[9px] font-mono tracking-wider uppercase ${textMuted}`}>
                Mangalik &amp; Sons Venture Ltd.
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 font-mono uppercase tracking-wider text-[10px]">
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                id={`nav-${key}`}
                onClick={() => setActiveTab(key)}
                className="flex items-center gap-1.5 px-3 py-2 transition-all rounded-sm"
                style={{
                  background: activeTab === key
                    ? (isDark ? '#161616' : '#f0f0f3')
                    : 'transparent',
                  color: activeTab === key
                    ? (key === 'checkout' ? '#60a5fa' : (isDark ? '#fff' : '#111'))
                    : (isDark ? '#6b7280' : '#999'),
                  border: activeTab === key
                    ? `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`
                    : '1px solid transparent',
                  fontWeight: activeTab === key ? 700 : 400,
                }}
              >
                {icon}
                {label}
                {key === 'checkout' && (selectedProduct || customVmConfig) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                )}
                {key === 'orders' && orders.length > 0 && (
                  <span
                    className="text-[8px] font-mono px-1.5 py-0.5 rounded-full"
                    style={{ background: isDark ? '#1a1a1a' : '#e8e8ed', color: isDark ? '#9ca3af' : '#555' }}
                  >
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle — always visible */}
            <DarkModeToggle isDark={isDark} onToggle={toggleDark} />

            {/* External link — hidden on very small screens */}
            <a
              href="https://ajainx1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-2 rounded-sm transition-all"
              style={{
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                color: isDark ? '#6b7280' : '#888',
              }}
            >
              <span className="hidden md:inline">ajainx1.github.io</span>
              <ExternalLink size={11} />
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-2 rounded-sm transition-all"
              style={{ color: isDark ? '#9ca3af' : '#666' }}
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden sticky z-30 border-b px-4 py-3 space-y-1 font-mono uppercase tracking-wider text-[11px] animate-fade-in-up"
          style={{
            top: '65px',
            background: isDark ? 'rgba(5,5,5,0.98)' : 'rgba(255,255,255,0.98)',
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          }}
        >
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setMobileMenuOpen(false); }}
              className="w-full text-left flex items-center justify-between p-2.5 rounded-sm transition-all"
              style={{
                background: activeTab === key ? (isDark ? '#161616' : '#f0f0f3') : 'transparent',
                color: activeTab === key
                  ? (key === 'checkout' ? '#60a5fa' : (isDark ? '#fff' : '#111'))
                  : (isDark ? '#6b7280' : '#999'),
              }}
            >
              <span className="flex items-center gap-2">{icon}{label}</span>
              {key === 'orders' && orders.length > 0 && (
                <span className="text-[9px] font-mono px-1.5 py-0.5"
                      style={{ color: isDark ? '#6b7280' : '#aaa' }}>
                  {orders.length}
                </span>
              )}
            </button>
          ))}

          {/* Dark mode in drawer too */}
          <div className="pt-2 border-t flex items-center justify-between"
               style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }}>
            <span className={`text-[10px] font-mono uppercase tracking-wider ${textMuted}`}>
              {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </span>
            <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6 min-w-0 animate-fade-in-up">

          {/* ── Hero Card ── */}
          <div
            className="relative rounded-sm border overflow-hidden shadow-2xl"
            style={{
              background: isDark ? '#111111' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            }}
          >
            {/* Glow blobs inside hero */}
            <div className="absolute right-0 top-0 w-64 h-64 rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute left-0 bottom-0 w-48 h-48 rounded-full pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[9px] font-mono text-blue-400 tracking-widest font-bold uppercase">
                  Active Platform Node
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight uppercase mb-3">
                <span className="shimmer-text">Automated Alerts</span>{' '}
                <span className={textPrimary}>&amp; Low-Latency Hosting for</span>{' '}
                <span className="text-blue-400">Bot Fixed</span>
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed max-w-2xl font-mono ${textSecondary} mb-5`}>
                Deploy state-of-the-art algorithmic trading configurations. Jumpstreet secures
                lowest-latency Windows VPS packages pre-installed with{' '}
                <strong className={textPrimary}>Bot Fixed</strong> indicators, paired with imported
                5G network redundancy hardware from Japan and China.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Gateway Status', value: 'Secure Live', valueClass: 'text-blue-400', pulse: true },
                  { label: 'Signal Latency',  value: '~1.2 ms avg', valueClass: textPrimary, pulse: false },
                  { label: '5G Router Stock', value: '14 Units',    valueClass: isDark ? 'text-neutral-300' : 'text-gray-700', pulse: false },
                  { label: 'Operator',        value: 'Mangalik & Sons', valueClass: 'text-blue-400', pulse: false },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-sm border text-center sm:text-left"
                    style={{
                      background: isDark ? '#000' : '#f6f6f8',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <span className={`text-[9px] font-mono block uppercase tracking-wider ${textMuted}`}>{s.label}</span>
                    <span className={`text-xs font-bold flex items-center justify-center sm:justify-start gap-1 mt-0.5 font-mono ${s.valueClass}`}>
                      {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />}
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="transition-all duration-300 animate-fade-in-up">

            {activeTab === 'store' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className={`text-sm font-bold tracking-widest flex items-center gap-2 uppercase ${textPrimary}`}>
                      <TrendingUp size={16} /> Licenses &amp; Hardware Catalog
                    </h2>
                    <p className={`text-xs font-mono ${textSecondary}`}>
                      Order licenses and hardware imported directly for optimal latency
                    </p>
                  </div>
                </div>
                <ProductCatalog onSelectProduct={handleSelectProduct} isDark={isDark} />
              </div>
            )}

            {activeTab === 'vm' && (
              <div className="space-y-5">
                <h2 className={`text-sm font-bold tracking-widest flex items-center gap-2 uppercase ${textPrimary}`}>
                  <Sliders size={16} /> Custom VM Architecture Build
                </h2>
                <p className={`text-xs font-mono ${textSecondary}`}>
                  Tailor the perfect Windows VPS package for continuous automated execution
                </p>
                <VmConfigurator onAddVmToCart={handleAddVmToCart} isDark={isDark} />
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-5">
                <AlertsSimulator isDark={isDark} />
              </div>
            )}

            {activeTab === 'checkout' && (
              <div className="space-y-5">
                <PaymentPortal
                  selectedProduct={selectedProduct}
                  customVmConfig={customVmConfig}
                  onPaymentSubmitted={handlePaymentSubmitted}
                  isDark={isDark}
                />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className={`text-sm font-bold tracking-widest flex items-center gap-2 uppercase ${textPrimary}`}>
                      <FileCheck size={16} /> Order &amp; License Logbook
                    </h2>
                    <p className={`text-xs font-mono ${textSecondary}`}>
                      Track and manage your billing verifications and subscription states
                    </p>
                  </div>
                  <div className={`text-[10px] font-mono tracking-wider ${textMuted}`}>
                    SECURED BY LOCAL STORAGE
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div
                    className="rounded-sm border p-10 sm:p-12 text-center"
                    style={{
                      background: isDark ? '#111111' : '#ffffff',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-sm flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: isDark ? '#000' : '#f5f5f7',
                        border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'}`,
                        color: isDark ? '#6b7280' : '#aaa',
                      }}
                    >
                      <Clock size={18} />
                    </div>
                    <h3 className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>
                      No transactions yet
                    </h3>
                    <p className={`text-xs mt-2 max-w-sm mx-auto font-mono ${textSecondary}`}>
                      Scan the UPI QR in the Checkout Portal, transfer funds, and enter your reference ID.
                    </p>
                    <button
                      onClick={() => setActiveTab('store')}
                      className="mt-6 px-5 py-2 rounded-sm text-xs font-bold transition-all uppercase tracking-widest cursor-pointer"
                      style={{ background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff' }}
                    >
                      Browse Licenses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(ord => (
                      <div
                        key={ord.id}
                        className="rounded-sm border p-4 sm:p-5 space-y-4 animate-fade-in-up"
                        style={{
                          background: isDark ? '#111111' : '#ffffff',
                          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
                        }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b"
                             style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                          <div>
                            <span className={`text-xs font-bold font-mono uppercase tracking-wider ${textPrimary}`}>
                              {ord.planName}
                            </span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className={`text-[10px] font-mono ${textMuted}`}>ID: {ord.id}</span>
                              <span className={textMuted}>•</span>
                              <span className={`text-[10px] font-mono ${textMuted}`}>{ord.createdAt}</span>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest font-mono border ${
                              ord.status === 'active' || ord.status === 'completed'
                                ? 'bg-blue-400/10 text-blue-400 border-blue-400/25 '
                                : 'text-neutral-400 border-white/5 animate-pulse'
                            }`}
                            style={{
                              background: ord.status !== 'active' && ord.status !== 'completed'
                                ? (isDark ? '#1a1a1a' : '#f5f5f7') : undefined,
                            }}
                          >
                            {ord.status === 'active' || ord.status === 'completed'
                              ? '✅ Verified & Active'
                              : '⏳ Verifying Ledger...'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                          <div>
                            <span className={`block uppercase text-[9px] tracking-wider font-bold mb-0.5 ${textMuted}`}>User</span>
                            <span className={`block truncate ${textPrimary}`}>{ord.email}</span>
                            <span className={`text-[10px] ${textSecondary}`}>{ord.telegramUsername}</span>
                          </div>
                          <div>
                            <span className={`block uppercase text-[9px] tracking-wider font-bold mb-0.5 ${textMuted}`}>UTR / Reference</span>
                            <span className={`block font-bold select-all ${textPrimary}`}>{ord.utrNo}</span>
                            <span className={`text-[10px] ${textSecondary}`}>via {ord.paymentMethod}</span>
                          </div>
                          <div>
                            <span className={`block uppercase text-[9px] tracking-wider font-bold mb-0.5 ${textMuted}`}>Total Paid</span>
                            <span className="text-blue-400 block font-black text-sm">₹{ord.amountPaid.toLocaleString('en-IN')}</span>
                            <span className={`text-[10px] ${textSecondary}`}>~${(ord.amountPaid / 85).toFixed(1)} USD</span>
                          </div>
                        </div>

                        {ord.hasVM && (
                          <div
                            className="p-3 rounded-sm border text-xs font-mono"
                            style={{
                              background: isDark ? '#000' : '#f8f8fa',
                              borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
                            }}
                          >
                            <div className={`font-bold flex items-center gap-1.5 uppercase tracking-wide ${textPrimary}`}>
                              <Terminal size={12} className="text-blue-400 animate-pulse" />
                              Windows Server Deployment Initiated
                            </div>
                            <p className={`text-[10px] mt-1 leading-normal ${textSecondary}`}>
                              Provisioning <strong>{ord.vmDetails?.ram || 2}GB RAM</strong> node in{' '}
                              <strong>{ord.vmDetails?.region || 'Mumbai'}</strong>. Credentials dispatch via Telegram.
                            </p>
                          </div>
                        )}

                        <div className="pt-3 border-t flex justify-between items-center font-mono text-[10px]"
                             style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                          <span className={`italic ${textSecondary}`}>
                            {ord.status === 'pending_verification'
                              ? '🔒 Awaiting ledger review by Mangalik & Sons.'
                              : '✅ License key dispatched via Telegram.'}
                          </span>
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="text-neutral-400 hover:text-rose-400 transition-colors uppercase tracking-wider font-bold ml-4"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-5 animate-slide-right">
          <SpotifyWidget isDark={isDark} />

          {/* Corporate Overview */}
          <div
            className="rounded-sm border p-5 space-y-4"
            style={{
              background: isDark ? '#111111' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            }}
          >
            <h3 className={`text-[10px] font-mono font-bold uppercase tracking-[0.15em] pb-2 border-b ${textSecondary}`}
                style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
              Corporate Overview
            </h3>
            <div className={`space-y-3 text-xs leading-relaxed font-mono ${isDark ? 'text-neutral-300' : 'text-gray-600'}`}>
              <p>
                <strong className={textPrimary}>Jumpstreet</strong> is a premier tech and hardware distribution
                entity under <strong className={textPrimary}>A Mangalik and Sons Venture Limited</strong>.
              </p>
              <p>
                We specialize in low-latency algorithmic utilities (the{' '}
                <strong className={textPrimary}>Bot Fixed</strong> indicator platform) and direct imports
                of industrial-grade 5G routers and enterprise J-SIM setups.
              </p>
            </div>
            <div
              className="p-3 rounded-sm border space-y-2"
              style={{
                background: isDark ? '#000' : '#f6f6f8',
                borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
              }}
            >
              <span className={`text-[9px] font-bold block uppercase tracking-wider font-mono ${textMuted}`}>
                Conglomerate Assets
              </span>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                {[
                  { label: 'Headquarters', value: 'New Delhi, IN' },
                  { label: 'Supply Line', value: 'Japan & China' },
                ].map(item => (
                  <div
                    key={item.label}
                    className="p-2 rounded-sm border"
                    style={{
                      background: isDark ? 'rgba(255,255,255,0.03)' : '#f0f0f2',
                      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
                    }}
                  >
                    <span className={`block ${textMuted}`}>{item.label}</span>
                    <span className={`font-bold ${textPrimary}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Help Desk */}
          <div
            className="rounded-sm border p-5 text-center space-y-3"
            style={{
              background: isDark ? '#111111' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            }}
          >
            <div
              className="w-10 h-10 rounded-sm flex items-center justify-center mx-auto"
              style={{
                background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f3',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'}`,
                color: isDark ? '#fff' : '#333',
              }}
            >
              <MessageSquare size={16} />
            </div>
            <div>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${textPrimary}`}>
                Need Custom Implementation?
              </h4>
              <p className={`text-[11px] mt-1.5 font-mono ${textSecondary}`}>
                We design fully automated systems tailored to your trading strategy.
              </p>
            </div>
            <a
              href="https://ajainx1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 text-xs font-mono tracking-wider uppercase rounded-sm transition-all flex items-center justify-center gap-1.5"
              style={{
                background: isDark ? '#1a1a1a' : '#f0f0f3',
                color: isDark ? '#e5e7eb' : '#333',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
              }}
            >
              <span>Speak to Developer</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Visit stats in sidebar on desktop */}
          <div
            className="rounded-sm border p-4 hidden lg:block"
            style={{
              background: isDark ? '#111111' : '#ffffff',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-400" />
                <span className={`text-[10px] font-mono uppercase tracking-wider ${textMuted}`}>
                  Platform Visits
                </span>
              </div>
              <span className="font-mono font-black text-blue-400 text-lg">
                {displayCount.toLocaleString('en-IN')}
              </span>
            </div>
            <div
              className="mt-2 h-1 rounded-full overflow-hidden"
              style={{ background: isDark ? '#1a1a1a' : '#e8e8ed' }}
            >
              <div className="h-full rounded-full bg-blue-500 animate-pulse" style={{ width: '65%' }} />
            </div>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-8 px-4 text-center text-xs font-mono mt-12"
        style={{
          background: isDark ? '#000' : '#f0f0f3',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
          color: isDark ? '#4b5563' : '#999',
        }}
      >
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-3 mb-3">
            <DarkModeToggle isDark={isDark} onToggle={toggleDark} />
            <span className={`text-[9px] uppercase tracking-wider font-mono ${textMuted}`}>
              Theme Preference
            </span>
          </div>
          <p className="font-semibold uppercase tracking-wider text-[10px]"
             style={{ color: isDark ? '#6b7280' : '#aaa' }}>
            Jumpstreet • A Mangalik and Sons Venture Limited © 2026. All rights reserved.
          </p>
          <p className="max-w-2xl mx-auto text-[9px] leading-relaxed"
             style={{ color: isDark ? '#374151' : '#ccc' }}>
            Algorithmic indicator tools ("Bot Fixed") are developed for backtesting and analytical simulation.
            We do not provide personalised financial advice. Shipped hardware (5G SIM Hotspots) is subject to Indian import regulations.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-[9px] uppercase tracking-widest font-bold">
            <a href="https://ajainx1.github.io" target="_blank" rel="noopener noreferrer"
               className="hover:text-blue-400 transition-colors">Developer Profile</a>
            <span style={{ color: isDark ? '#1f2937' : '#ddd' }}>•</span>
            <a href="https://ajainx1.github.io" target="_blank" rel="noopener noreferrer"
               className="hover:text-blue-400 transition-colors">Primary Portal</a>
            <span style={{ color: isDark ? '#1f2937' : '#ddd' }}>•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
          </div>
          {/* Visit count in footer */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <Eye size={11} className="text-blue-400" />
            <span className="text-[9px] font-mono" style={{ color: isDark ? '#374151' : '#ccc' }}>
              {displayCount.toLocaleString('en-IN')} platform visits
            </span>
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="mobile-bottom-nav lg:hidden" aria-label="Mobile navigation">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            id={`mob-nav-${key}`}
            onClick={() => { setActiveTab(key); setMobileMenuOpen(false); }}
            className={`mobile-nav-btn ${activeTab === key ? 'active' : ''}`}
          >
            {icon}
            <span>{label}</span>
            {key === 'checkout' && (selectedProduct || customVmConfig) && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            )}
          </button>
        ))}
      </nav>

      {/* ── Visit Counter Floating Badge ── */}
      <VisitCounterBadge displayCount={displayCount} isDark={isDark} />
    </div>
  );
}
