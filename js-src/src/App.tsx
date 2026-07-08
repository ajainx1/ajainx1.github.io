import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Terminal, TrendingUp, Radio, ExternalLink,
  FileCheck, Clock, Sliders, ShoppingCart, Menu, X,
  MessageSquare, Sun, Moon, Eye, Server, ChevronUp, Zap
} from 'lucide-react';

import { Product, VMConfig, PaymentSubmission } from './types';
import { useToast } from './context/ToastContext';
import SpotifyWidget from './components/SpotifyWidget';
import AlertsSimulator from './components/AlertsSimulator';
import VmConfigurator from './components/VmConfigurator';
import ProductCatalog from './components/ProductCatalog';
import PaymentPortal from './components/PaymentPortal';

/* ══════════════════════════════
   HOOKS
══════════════════════════════ */

function useVisitCounter() {
  const [displayCount, setDisplayCount] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem('jumpstreet_visits') || '0', 10);
    const newCount = stored + 1;
    localStorage.setItem('jumpstreet_visits', String(newCount));
    setCount(newCount);

    // Count-up animation
    const start = Math.max(0, newCount - 30);
    let current = start;
    const duration = 1200;
    const steps = newCount - start;
    const interval = steps > 0 ? duration / steps : 0;
    if (steps <= 0) { setDisplayCount(newCount); return; }
    const timer = setInterval(() => {
      current++;
      setDisplayCount(current);
      if (current >= newCount) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, []);

  return { count, displayCount };
}

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('jumpstreet_theme');
    return stored !== 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('light-mode', !isDark);
    localStorage.setItem('jumpstreet_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(p => !p) };
}

function useScrollTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return { visible, scrollTop };
}

/* ══════════════════════════════
   SUB-COMPONENTS
══════════════════════════════ */

function DarkModeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="dark-mode-toggle"
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider hidden sm:block"
            style={{ color: isDark ? '#9ca3af' : '#666' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
      <div className={`toggle-track ${isDark ? '' : 'is-light'}`}>
        <div className="toggle-thumb" />
      </div>
      {isDark
        ? <Moon size={13} style={{ color: '#60a5fa' }} />
        : <Sun  size={13} style={{ color: '#f59e0b' }} />
      }
    </button>
  );
}

function VisitCounterBadge({ displayCount, isDark }: { displayCount: number; isDark: boolean }) {
  return (
    <div className="visit-counter-badge" aria-label={`${displayCount} platform visits`}>
      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping flex-shrink-0" />
      <Eye size={11} style={{ color: '#60a5fa', flexShrink: 0 }} />
      <span className="font-mono font-black text-[11px]"
            style={{ color: isDark ? '#e5e7eb' : '#111' }}>
        {displayCount.toLocaleString('en-IN')}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-wider"
            style={{ color: isDark ? '#6b7280' : '#999' }}>
        visits
      </span>
    </div>
  );
}

/* ── Ticker items ── */
const TICKER_ITEMS = [
  '🚀 HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (Bot Fixed v4.0) v4.0) v4.0) v4.0) v4.0) indicator package now live',
  '📡 High-Availability 5G Redundancy Nodes in stock — 14 units remaining',
  '⚡ Sub-millisecond Windows Cloud VMs available 24/7',
  '🇮🇳 Express shipping from New Delhi within 48 hrs',
  '🤖 Automated watchdogs pre-installed on all VMs',
  '💳 UPI, GPay & International Card payments accepted',
  '🔒 Managed by Jumpstreet — A Mangalik & Sons Securities Securities Securities Securities Securities Securities',
  '📈 Avg signal latency: 1.2ms via Jumpstreet API',
];

type TabKey = 'store' | 'vm' | 'alerts' | 'checkout' | 'orders';

/* ══════════════════════════════
   MAIN APP
══════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('store');
  const [tabKey, setTabKey] = useState(0); // force remount on tab change for animation
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customVmConfig, setCustomVmConfig] = useState<{ config: VMConfig; price: number } | null>(null);
  const [orders, setOrders] = useState<PaymentSubmission[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggle: toggleDark } = useDarkMode();
  const { displayCount } = useVisitCounter();
  const { visible: showScrollTop, scrollTop } = useScrollTop();
  const { addToast } = useToast();

  // Theme tokens
  const tk = {
    deep:  isDark ? '#0A0A0A'   : '#F5F5F7',
    card:  isDark ? '#111111'   : '#ffffff',
    cardB: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
    bg0:   isDark ? '#000000'   : '#f0f0f3',
    text1: isDark ? '#ffffff'   : '#111111',
    text2: isDark ? '#9ca3af'   : '#666666',
    text3: isDark ? '#4b5563'   : '#aaaaaa',
    nav:   isDark ? 'rgba(4,4,4,0.94)'    : 'rgba(255,255,255,0.96)',
    ticker:isDark ? 'rgba(0,0,0,0.92)'    : 'rgba(242,242,248,0.95)',
  };

  // Load orders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jumpstreet_orders');
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch {}
    } else {
      const seed: PaymentSubmission = {
        id: 'TXN-842013', planId: 'bot_standard',
        planName: 'HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (Bot Fixed v4.0) v4.0) v4.0) v4.0) v4.0) - Standard License',
        amountPaid: 999, currency: 'INR', paymentMethod: 'UPI',
        utrNo: '412095384112', email: 'jain.aditya33@gmail.com',
        telegramUsername: '@ajain_fixed', status: 'pending_verification',
        createdAt: new Date(Date.now() - 3600000).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        }),
        hasVM: false,
      };
      setOrders([seed]);
      localStorage.setItem('jumpstreet_orders', JSON.stringify([seed]));
    }
  }, []);

  const switchTab = (tab: TabKey) => {
    setActiveTab(tab);
    setTabKey(k => k + 1);
    setMobileMenuOpen(false);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCustomVmConfig(null);
    switchTab('checkout');
    addToast(`${product.name} added to checkout`, 'success', '🛒');
  };

  const handleAddVmToCart = (config: VMConfig, price: number) => {
    setCustomVmConfig({ config, price });
    setSelectedProduct(null);
    switchTab('checkout');
    addToast(`VM (${config.ram}GB RAM) added to checkout`, 'success', '🖥️');
  };

  const handlePaymentSubmitted = (submission: PaymentSubmission) => {
    const updated = [submission, ...orders];
    setOrders(updated);
    localStorage.setItem('jumpstreet_orders', JSON.stringify(updated));
    switchTab('orders');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    addToast('Payment submitted! Awaiting verification.', 'success', '✅');
  };

  const handleCancelOrder = (id: string) => {
    const filtered = orders.filter(o => o.id !== id);
    setOrders(filtered);
    localStorage.setItem('jumpstreet_orders', JSON.stringify(filtered));
    addToast('Order cancelled and removed.', 'warn', '🗑️');
  };

  const navItems: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: 'store',    label: 'Store',    icon: <TrendingUp size={14} /> },
    { key: 'vm',       label: 'Cloud VM', icon: <Server size={14} /> },
    { key: 'alerts',   label: 'Alerts',   icon: <Radio size={14} /> },
    { key: 'checkout', label: 'Checkout', icon: <ShoppingCart size={14} /> },
    { key: 'orders',   label: 'Orders',   icon: <FileCheck size={14} /> },
  ];

  const hasPendingCheckout = !!(selectedProduct || customVmConfig);

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative"
      style={{ background: tk.deep, color: tk.text1, transition: 'background 0.35s, color 0.35s' }}
    >
      {/* ── Grid mesh bg ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(${isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.04)'} 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          zIndex: 0,
        }}
      />
      {/* ── Ambient glows ── */}
      <div className="fixed pointer-events-none" style={{ top: '-10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 65%)', filter: 'blur(50px)', zIndex: 0 }} />
      <div className="fixed pointer-events-none" style={{ top: '40%', right: '-5%',  width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 65%)', filter: 'blur(50px)', zIndex: 0 }} />

      {/* ── Ticker bar ── */}
      <div className="relative z-10 py-2 border-b" style={{ background: tk.ticker, borderColor: tk.cardB }}>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-2 mx-8 text-[10px] font-mono uppercase tracking-wider" style={{ color: tk.text3 }}>
                {item}
                <span className="w-1 h-1 rounded-full bg-blue-500/60" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky Header ── */}
      <header
        className="sticky top-0 z-40 border-b px-4 sm:px-6 py-3 backdrop-blur-xl"
        style={{ background: tk.nav, borderColor: tk.cardB }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-black text-base sm:text-lg animate-glow flex-shrink-0"
              style={{ background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff', borderRadius: '6px' }}
            >
              J
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase" style={{ color: tk.text1 }}>
                  Jumpstreet
                </span>
                <span className="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest hidden md:inline"
                      style={{ background: isDark ? '#1a1a1a' : '#ebebef', color: tk.text3, border: `1px solid ${tk.cardB}` }}>
                  M&amp;S Venture
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-wider uppercase" style={{ color: tk.text3 }}>
                Mangalik &amp; Sons Venture Ltd.
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5 font-mono uppercase tracking-wider text-[10px]" aria-label="Main navigation">
            {navItems.map(({ key, label, icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  id={`nav-${key}`}
                  onClick={() => switchTab(key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-md transition-all relative"
                  style={{
                    background: isActive ? (isDark ? '#181818' : '#f0f0f3') : 'transparent',
                    color: isActive ? (key === 'checkout' ? '#60a5fa' : tk.text1) : tk.text3,
                    border: `1px solid ${isActive ? tk.cardB : 'transparent'}`,
                    fontWeight: isActive ? 700 : 400,
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {icon}
                  {label}
                  {key === 'checkout' && hasPendingCheckout && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping absolute -top-0.5 -right-0.5" />
                  )}
                  {key === 'orders' && orders.length > 0 && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full ml-0.5"
                          style={{ background: isDark ? '#1a1a1a' : '#ebebef', color: tk.text3 }}>
                      {orders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <DarkModeToggle isDark={isDark} onToggle={() => {
              toggleDark();
              addToast(isDark ? 'Light mode enabled' : 'Dark mode enabled', 'info', isDark ? '☀️' : '🌙');
            }} />
            <a
              href="https://ajainx1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-bold tracking-wider uppercase px-3 py-2 rounded-md transition-all"
              style={{ border: `1px solid ${tk.cardB}`, color: tk.text3 }}
            >
              <span className="hidden md:inline">ajainx1.github.io</span>
              <ExternalLink size={11} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-2 rounded-md transition-all ripple-container"
              style={{ color: tk.text2 }}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Dropdown Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden sticky z-30 border-b px-4 py-2 space-y-1 font-mono uppercase tracking-wider text-[11px] animate-fade-in-up"
          style={{ top: '61px', background: tk.nav, borderColor: tk.cardB }}
        >
          {navItems.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className="w-full text-left flex items-center justify-between p-2.5 rounded-md transition-all"
              style={{
                background: activeTab === key ? (isDark ? '#181818' : '#f0f0f3') : 'transparent',
                color: activeTab === key ? (key === 'checkout' ? '#60a5fa' : tk.text1) : tk.text3,
              }}
            >
              <span className="flex items-center gap-2">{icon} {label}</span>
              {key === 'orders' && orders.length > 0 && (
                <span style={{ color: tk.text3 }} className="text-[9px] font-mono">{orders.length}</span>
              )}
            </button>
          ))}
          <div className="pt-2 pb-1 border-t flex items-center justify-between" style={{ borderColor: tk.cardB }}>
            <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: tk.text3 }}>
              {isDark ? '🌙 Dark' : '☀️ Light'} Mode
            </span>
            <DarkModeToggle isDark={isDark} onToggle={() => {
              toggleDark();
              addToast(isDark ? 'Light mode enabled' : 'Dark mode enabled', 'info', isDark ? '☀️' : '🌙');
            }} />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-5 min-w-0 animate-fade-in-up">

          {/* ── Hero Card ── */}
          <div
            className="relative rounded-xl border overflow-hidden shadow-2xl"
            style={{ background: tk.card, borderColor: tk.cardB }}
          >
            <div className="absolute right-0 top-0 w-72 h-72 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div className="absolute left-0 bottom-0 w-48 h-48 pointer-events-none"
                 style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

            <div className="relative p-5 sm:p-7 lg:p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[9px] font-mono text-blue-400 tracking-widest font-bold uppercase">
                  Platform Node Active
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight uppercase mb-3">
                <span className="shimmer-text">Automated Alerts</span>{' '}
                <span style={{ color: tk.text1 }}>&amp; Proximity Hosting & HFT Pipelines for</span>{' '}
                <span className="text-blue-400">HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (Bot Fixed v4.0) v4.0) v4.0) v4.0) v4.0)</span>
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed max-w-2xl font-mono mb-5" style={{ color: tk.text2 }}>
                Deploy state-of-the-art algorithmic trading configurations. Jumpstreet secures
                lowest-latency Windows VPS packages pre-installed with{' '}
                <strong style={{ color: tk.text1 }}>HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (Bot Fixed v4.0) v4.0) v4.0) v4.0) v4.0)</strong> indicators, paired with
                imported path-redundant telecommunications hardware from Japan and China.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Gateway Status', value: 'Secure Live',    color: '#60a5fa', pulse: true },
                  { label: 'Signal Latency',  value: '~1.2 ms avg',   color: tk.text1,  pulse: false },
                  { label: 'Dual-Homed Node Stock', value: '14 Units Left', color: tk.text2,  pulse: false },
                  { label: 'Operator',        value: 'M&S Securities',   color: '#60a5fa', pulse: false },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border"
                    style={{ background: tk.bg0, borderColor: tk.cardB }}
                  >
                    <span className="text-[9px] font-mono block uppercase tracking-wider mb-0.5" style={{ color: tk.text3 }}>{s.label}</span>
                    <span className="text-[11px] font-bold flex items-center gap-1 font-mono" style={{ color: s.color }}>
                      {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse flex-shrink-0" />}
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div key={tabKey} className="tab-content">

            {activeTab === 'store' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold tracking-widest flex items-center gap-2 uppercase" style={{ color: tk.text1 }}>
                    <TrendingUp size={16} className="text-blue-400" /> Licenses &amp; Hardware Catalog
                  </h2>
                  <p className="text-xs font-mono mt-0.5" style={{ color: tk.text2 }}>Order licenses and hardware imported for optimal latency</p>
                </div>
                <ProductCatalog onSelectProduct={handleSelectProduct} isDark={isDark} />
              </div>
            )}

            {activeTab === 'vm' && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-sm font-bold tracking-widest flex items-center gap-2 uppercase" style={{ color: tk.text1 }}>
                    <Sliders size={16} className="text-blue-400" /> Custom VM Architecture Build
                  </h2>
                  <p className="text-xs font-mono mt-0.5" style={{ color: tk.text2 }}>Tailor the perfect Windows VPS for continuous automated execution</p>
                </div>
                <VmConfigurator onAddVmToCart={handleAddVmToCart} isDark={isDark} />
              </div>
            )}

            {activeTab === 'alerts' && (
              <AlertsSimulator isDark={isDark} />
            )}

            {activeTab === 'checkout' && (
              <PaymentPortal
                selectedProduct={selectedProduct}
                customVmConfig={customVmConfig}
                onPaymentSubmitted={handlePaymentSubmitted}
                isDark={isDark}
              />
            )}

            {activeTab === 'orders' && (
              <div className="space-y-5">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <div>
                    <h2 className="text-sm font-bold tracking-widest flex items-center gap-2 uppercase" style={{ color: tk.text1 }}>
                      <FileCheck size={16} className="text-blue-400" /> Order &amp; License Logbook
                    </h2>
                    <p className="text-xs font-mono mt-0.5" style={{ color: tk.text2 }}>Track billing verifications and subscription states</p>
                  </div>
                  <span className="text-[9px] font-mono tracking-wider" style={{ color: tk.text3 }}>
                    LOCAL STORAGE SECURED
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="rounded-xl border p-10 sm:p-12 text-center animate-scale-in"
                       style={{ background: tk.card, borderColor: tk.cardB }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                         style={{ background: tk.bg0, border: `1px solid ${tk.cardB}`, color: tk.text3 }}>
                      <Clock size={20} />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: tk.text1 }}>No transactions yet</h3>
                    <p className="text-xs mt-2 max-w-xs mx-auto font-mono" style={{ color: tk.text2 }}>
                      Scan the UPI QR in Checkout, transfer funds, and enter your reference ID.
                    </p>
                    <button
                      onClick={() => switchTab('store')}
                      className="mt-6 px-6 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-widest"
                      style={{ background: isDark ? '#fff' : '#111', color: isDark ? '#000' : '#fff' }}
                    >
                      Browse Licenses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord, i) => (
                      <div
                        key={ord.id}
                        className="rounded-xl border p-4 sm:p-5 space-y-4 animate-fade-in-up"
                        style={{ background: tk.card, borderColor: tk.cardB, animationDelay: `${i * 0.07}s` }}
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b"
                             style={{ borderColor: tk.cardB }}>
                          <div>
                            <span className="text-xs font-bold font-mono uppercase tracking-wider" style={{ color: tk.text1 }}>
                              {ord.planName}
                            </span>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono" style={{ color: tk.text3 }}>ID: {ord.id}</span>
                              <span style={{ color: tk.cardB }}>•</span>
                              <span className="text-[10px] font-mono" style={{ color: tk.text3 }}>{ord.createdAt}</span>
                            </div>
                          </div>
                          <span
                            className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono border flex-shrink-0"
                            style={{
                              background: (ord.status === 'active' || ord.status === 'completed') ? 'rgba(59,130,246,0.1)' : (isDark ? '#111' : '#f5f5f7'),
                              color: (ord.status === 'active' || ord.status === 'completed') ? '#60a5fa' : tk.text3,
                              borderColor: (ord.status === 'active' || ord.status === 'completed') ? 'rgba(59,130,246,0.25)' : tk.cardB,
                            }}
                          >
                            {(ord.status === 'active' || ord.status === 'completed') ? '✅ Verified & Active' : '⏳ Verifying...'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                          {[
                            { label: 'User', primary: ord.email, secondary: ord.telegramUsername },
                            { label: 'UTR / Reference', primary: ord.utrNo, secondary: `via ${ord.paymentMethod}`, copyable: true },
                            { label: 'Total Paid', primary: `₹${ord.amountPaid.toLocaleString('en-IN')}`, secondary: `~$${(ord.amountPaid/85).toFixed(1)} USD`, big: true },
                          ].map((row, j) => (
                            <div key={j}>
                              <span className="block text-[9px] uppercase tracking-wider font-bold mb-0.5" style={{ color: tk.text3 }}>{row.label}</span>
                              <span className={`block truncate ${row.big ? 'text-blue-400 font-black text-base' : ''}`} style={row.big ? {} : { color: tk.text1 }}>
                                {row.primary}
                              </span>
                              <span style={{ color: tk.text2 }}>{row.secondary}</span>
                            </div>
                          ))}
                        </div>

                        {ord.hasVM && (
                          <div className="p-3 rounded-lg border text-xs font-mono"
                               style={{ background: tk.bg0, borderColor: tk.cardB }}>
                            <div className="font-bold flex items-center gap-1.5 uppercase tracking-wide" style={{ color: tk.text1 }}>
                              <Terminal size={12} className="text-blue-400 animate-pulse" />
                              Windows Server Deployment Initiated
                            </div>
                            <p className="text-[10px] mt-1 leading-relaxed" style={{ color: tk.text2 }}>
                              Provisioning <strong>{ord.vmDetails?.ram || 2}GB RAM</strong> node in <strong>{ord.vmDetails?.region || 'Mumbai'}</strong>. Credentials dispatched via Telegram.
                            </p>
                          </div>
                        )}

                        <div className="pt-3 border-t flex justify-between items-center font-mono text-[10px]"
                             style={{ borderColor: tk.cardB }}>
                          <span className="italic" style={{ color: tk.text2 }}>
                            {ord.status === 'pending_verification'
                              ? '🔒 Awaiting ledger review by Mangalik & Sons Securities Securities Securities Securities Securities.'
                              : '✅ License key dispatched via Telegram.'}
                          </span>
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="text-rose-400/60 hover:text-rose-400 transition-colors uppercase tracking-wider font-bold ml-4"
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
        <aside className="lg:col-span-4 space-y-5 animate-slide-right delay-200">
          <SpotifyWidget isDark={isDark} />

          {/* Corporate Overview */}
          <div className="rounded-xl border p-5 space-y-4" style={{ background: tk.card, borderColor: tk.cardB }}>
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] pb-2 border-b" style={{ color: tk.text2, borderColor: tk.cardB }}>
              Corporate Overview
            </h3>
            <div className="space-y-3 text-xs leading-relaxed font-mono" style={{ color: isDark ? '#d1d5db' : '#555' }}>
              <p>
                <strong style={{ color: tk.text1 }}>Jumpstreet</strong> is a premier tech and hardware distribution entity under{' '}
                <strong style={{ color: tk.text1 }}>A Mangalik and Sons Securities Limited</strong>.
              </p>
              <p>
                We specialize in FPGA-accelerated latency-critical trading utilities (the{' '}
                <strong style={{ color: tk.text1 }}>HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (Bot Fixed v4.0) v4.0) v4.0) v4.0) v4.0)</strong> indicator platform) and direct imports
                of industrial-grade 5G routers and enterprise J-SIM setups.
              </p>
            </div>
            <div className="p-3 rounded-lg border" style={{ background: tk.bg0, borderColor: tk.cardB }}>
              <span className="text-[9px] font-bold block uppercase tracking-wider font-mono mb-2" style={{ color: tk.text3 }}>Conglomerate Assets</span>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                {[
                  { label: 'HQ', value: 'New Delhi, IN' },
                  { label: 'Supply', value: 'Japan & China' },
                  { label: 'Founded', value: '2022' },
                  { label: 'Sector', value: 'FinTech & HW' },
                ].map(item => (
                  <div key={item.label} className="p-2 rounded-md border" style={{ background: isDark ? 'rgba(255,255,255,0.02)' : '#ebebef', borderColor: tk.cardB }}>
                    <span className="block" style={{ color: tk.text3 }}>{item.label}</span>
                    <span className="font-bold" style={{ color: tk.text1 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visit Stats */}
          <div className="rounded-xl border p-4" style={{ background: tk.card, borderColor: tk.cardB }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-400" />
                <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: tk.text3 }}>Platform Visits</span>
              </div>
              <span className="font-mono font-black text-blue-400 text-lg">{displayCount.toLocaleString('en-IN')}</span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: isDark ? '#1a1a1a' : '#e8e8ed' }}>
              <div className="h-full rounded-full bg-blue-500" style={{ width: '72%', transition: 'width 1.2s ease' }} />
            </div>
            <div className="flex justify-between text-[9px] font-mono mt-1" style={{ color: tk.text3 }}>
              <span>Unique browsers</span>
              <span>72% retention</span>
            </div>
          </div>

          {/* Help Desk */}
          <div className="rounded-xl border p-5 text-center space-y-3" style={{ background: tk.card, borderColor: tk.cardB }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto"
                 style={{ background: tk.bg0, border: `1px solid ${tk.cardB}`, color: isDark ? '#fff' : '#333' }}>
              <MessageSquare size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: tk.text1 }}>Need Custom Setup?</h4>
              <p className="text-[11px] mt-1 font-mono" style={{ color: tk.text2 }}>
                We design fully automated systems tailored to your trading strategy.
              </p>
            </div>
            <a
              href="https://ajainx1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 text-xs font-mono tracking-wider uppercase rounded-lg transition-all flex items-center justify-center gap-1.5 hover:gap-2.5"
              style={{ background: tk.bg0, color: tk.text2, border: `1px solid ${tk.cardB}` }}
            >
              <span>Speak to Developer</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t py-8 px-4 text-center text-xs font-mono mt-8 relative z-10"
        style={{ background: isDark ? '#000' : '#ebebef', borderColor: tk.cardB, color: tk.text3 }}
      >
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <DarkModeToggle isDark={isDark} onToggle={() => {
              toggleDark();
              addToast(isDark ? 'Light mode enabled' : 'Dark mode enabled', 'info', isDark ? '☀️' : '🌙');
            }} />
            <span className="text-[9px] uppercase tracking-wider font-mono" style={{ color: tk.text3 }}>Theme Preference</span>
          </div>
          <p className="font-semibold uppercase tracking-wider text-[10px]">
            Jumpstreet • A Mangalik and Sons Securities Limited © 2026. All rights reserved.
          </p>
          <p className="max-w-2xl mx-auto text-[9px] leading-relaxed" style={{ color: isDark ? '#374151' : '#bbb' }}>
            Algorithmic quantitative signals ("HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (HFT Signal Suite (Bot Fixed v4.0) v4.0) v4.0) v4.0) v4.0)") are for backtesting and analytical simulation.
            We do not provide personalised financial advice. Shipped hardware is subject to Indian import regulations.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[9px] uppercase tracking-widest font-bold">
            {[
              { label: 'Developer Profile', href: 'https://ajainx1.github.io' },
              { label: 'Primary Portal', href: 'https://ajainx1.github.io' },
              { label: 'Terms of Service', href: '#' },
            ].map(link => (
              <a key={link.label} href={link.href} target={link.href !== '#' ? '_blank' : undefined}
                 rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            <Eye size={11} className="text-blue-400" />
            <span className="text-[9px] font-mono" style={{ color: isDark ? '#374151' : '#ccc' }}>
              {displayCount.toLocaleString('en-IN')} platform visits recorded
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
            onClick={() => switchTab(key)}
            className={`mobile-nav-btn ${activeTab === key ? 'active' : ''}`}
            aria-current={activeTab === key ? 'page' : undefined}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Visit Counter Floating Badge ── */}
      <VisitCounterBadge displayCount={displayCount} isDark={isDark} />

      {/* ── Scroll-to-Top Button ── */}
      {showScrollTop && (
        <button
          onClick={scrollTop}
          className="scroll-top-btn"
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </div>
  );
}
