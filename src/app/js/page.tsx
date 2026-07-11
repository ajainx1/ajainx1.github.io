"use client";
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Terminal, TrendingUp, Radio, ExternalLink,
  FileCheck, Clock, Sliders, ShoppingCart, Menu, X,
  MessageSquare, Sun, Moon, Eye, Server, ChevronUp, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Product, VMConfig, PaymentSubmission } from '@/components/js/types';
import { useToast, ToastProvider } from '@/components/js/ToastContext';

import AlertsSimulator from '@/components/js/AlertsSimulator';
import VmConfigurator from '@/components/js/VmConfigurator';
import ProductCatalog from '@/components/js/ProductCatalog';
import PaymentPortal from '@/components/js/PaymentPortal';

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

function VisitCounterBadge({ displayCount }: { displayCount: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-[var(--primary)]/30 bg-[var(--primary)]/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]"
      aria-label={`${displayCount} platform visits`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping flex-shrink-0" />
      <Eye size={12} className="text-[var(--primary)] flex-shrink-0" />
      <span className="font-mono font-black text-[11px] text-[var(--fg)]">
        {displayCount.toLocaleString('en-IN')}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--muted)]">
        visits
      </span>
    </motion.div>
  );
}

/* ── Ticker items ── */
const TICKER_ITEMS = [
  '🚀 HFT Signal Suite (Bot Fixed v4.0) indicator package now live',
  '📡 High-Availability 5G Redundancy Nodes in stock — 14 units remaining',
  '⚡ Sub-millisecond Windows Cloud VMs available 24/7',
  '🇮🇳 Express shipping from New Delhi within 48 hrs',
  '🤖 Automated watchdogs pre-installed on all VMs',
  '💳 UPI, GPay & International Card payments accepted',
  '🔒 Managed by Jumpstreet — A Mangalik & Sons Securities',
  '📈 Avg signal latency: 1.2ms via Jumpstreet API',
];

type TabKey = 'store' | 'vm' | 'alerts' | 'checkout' | 'orders';

const tabVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { opacity: 0, y: -15, scale: 0.98, transition: { duration: 0.15 } }
};

/* ══════════════════════════════
   MAIN APP CONTENT
══════════════════════════════ */
function AppContent() {
  const [activeTab, setActiveTab] = useState<TabKey>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customVmConfig, setCustomVmConfig] = useState<{ config: VMConfig; price: number } | null>(null);
  const [orders, setOrders] = useState<PaymentSubmission[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const { displayCount } = useVisitCounter();
  const { visible: showScrollTop, scrollTop } = useScrollTop();
  const { addToast } = useToast();

  // Load orders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('jumpstreet_orders');
    if (saved) {
      try { setOrders(JSON.parse(saved)); } catch {}
    } else {
      const seed: PaymentSubmission = {
        id: 'TXN-842013', planId: 'bot_standard',
        planName: 'HFT Signal Suite (Bot Fixed v4.0) - Standard License',
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
    <div className="min-h-screen flex flex-col font-sans relative text-[var(--fg)] overflow-x-hidden selection:bg-[var(--primary)] selection:text-[var(--bg)]">
      {/* ── Grid mesh bg ── */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          zIndex: 0,
        }}
      />
      {/* ── Ambient glows ── */}
      <div className="fixed pointer-events-none top-[-10%] left-[20%] w-[500px] h-[500px] bg-[var(--primary)]/10 blur-[80px] rounded-full z-0 animate-pulse-slow" />
      <div className="fixed pointer-events-none top-[40%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/10 blur-[80px] rounded-full z-0 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* ── Ticker bar ── */}
      <div className="relative z-10 py-2 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-md overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-8 text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]/60 shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 border-b border-[var(--border)] px-4 sm:px-6 py-3 bg-[var(--bg)]/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer" onClick={() => switchTab('store')}>
            <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center font-mono font-black text-base sm:text-lg rounded-lg bg-[var(--fg)] text-[var(--bg)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              J
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold tracking-[0.15em] uppercase text-[var(--fg)]">
                  Jumpstreet
                </span>
                <span className="text-[8px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-widest hidden md:inline bg-[var(--card2)] text-[var(--muted)] border border-[var(--border)]">
                  M&amp;S Venture
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-wider uppercase text-[var(--muted)] group-hover:text-[var(--primary)] transition-colors">
                Mangalik &amp; Sons Venture Ltd.
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 font-mono uppercase tracking-wider text-[10px] p-1 bg-[var(--card2)]/50 rounded-xl border border-[var(--border)] backdrop-blur-sm" aria-label="Main navigation">
            {navItems.map(({ key, label, icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all relative z-10 ${
                    isActive ? (key === 'checkout' ? 'text-[var(--primary)]' : 'text-[var(--fg)]') : 'text-[var(--muted)] hover:text-[var(--fg)]'
                  } ${isActive ? 'font-bold' : 'font-medium'}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="desktopNavBubble"
                      className="absolute inset-0 bg-[var(--card)] border border-[var(--border)] rounded-lg shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {icon}
                  {label}
                  {key === 'checkout' && hasPendingCheckout && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping absolute top-1 right-1" />
                  )}
                  {key === 'orders' && orders.length > 0 && (
                    <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-md ml-1 bg-[var(--card2)] text-[var(--muted)] border border-[var(--border)]">
                      {orders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://ajainx1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-all border border-[var(--border)] text-[var(--muted)] hover:text-[var(--primary)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/10 group"
            >
              <span className="hidden md:inline">ajainx1.github.io</span>
              <ExternalLink size={12} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-2.5 rounded-lg transition-all bg-[var(--card2)] text-[var(--muted)] border border-[var(--border)] hover:bg-[var(--card)]"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Dropdown Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden sticky z-30 border-b border-[var(--border)] px-4 py-3 space-y-1.5 font-mono uppercase tracking-wider text-[11px] bg-[var(--bg)]/95 backdrop-blur-xl overflow-hidden"
            style={{ top: '65px' }}
          >
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`w-full text-left flex items-center justify-between p-3 rounded-lg transition-all ${
                   activeTab === key ? 'bg-[var(--card2)] text-[var(--fg)] border border-[var(--border)]' : 'text-[var(--muted)] hover:bg-[var(--card)]'
                }`}
              >
                <span className={`flex items-center gap-2 ${activeTab === key && key === 'checkout' ? 'text-[var(--primary)]' : ''}`}>
                  {icon} {label}
                </span>
                {key === 'orders' && orders.length > 0 && (
                  <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-md border border-[var(--border)]">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start relative z-10">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8 min-w-0">

          {/* ── Hero Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-2xl border border-[var(--border)] overflow-hidden shadow-2xl bg-[var(--card)]/80 backdrop-blur-md"
          >
            <div className="absolute right-0 top-0 w-80 h-80 pointer-events-none bg-[var(--primary)]/10 blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute left-0 bottom-0 w-64 h-64 pointer-events-none bg-indigo-500/10 blur-[60px] rounded-full -translate-x-1/3 translate-y-1/3" />

            <div className="relative p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                <span className="text-[10px] font-mono text-[var(--primary)] tracking-[0.2em] font-bold uppercase">
                  Platform Node Active
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight uppercase mb-4 text-[var(--fg)]">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-indigo-400 drop-shadow-sm">Automated Alerts</span>{' '}
                <span className="opacity-90">&amp; Proximity Hosting & HFT Pipelines for</span>{' '}
                <span className="text-[var(--primary)] drop-shadow-sm">HFT Signal Suite</span>
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed max-w-2xl font-mono mb-8 text-[var(--muted)]">
                Deploy state-of-the-art algorithmic trading configurations. Jumpstreet secures
                lowest-latency Windows VPS packages pre-installed with{' '}
                <strong className="text-[var(--fg)] font-medium">HFT Signal Suite (Bot Fixed v4.0)</strong> indicators, paired with
                imported path-redundant telecommunications hardware from Japan and China.
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Gateway Status', value: 'Secure Live',    color: 'var(--primary)', pulse: true },
                  { label: 'Signal Latency',  value: '~1.2 ms avg',   color: 'var(--fg)',  pulse: false },
                  { label: 'Dual-Homed Node Stock', value: '14 Units Left', color: 'var(--muted)',  pulse: false },
                  { label: 'Operator',        value: 'M&S Securities',   color: 'var(--primary)', pulse: false },
                ].map((s, i) => (
                  <motion.div
                    whileHover={{ y: -2 }}
                    key={i}
                    className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card2)]/50 backdrop-blur-sm"
                  >
                    <span className="text-[9px] font-mono block uppercase tracking-wider mb-1 text-[var(--muted)]">{s.label}</span>
                    <span className="text-[11px] font-bold flex items-center gap-1.5 font-mono" style={{ color: s.color }}>
                      {s.pulse && <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />}
                      {s.value}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Tab Content ── */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait">
              
              {activeTab === 'store' && (
                <motion.div key="store" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-widest flex items-center gap-2.5 uppercase text-[var(--fg)]">
                      <TrendingUp size={18} className="text-[var(--primary)]" /> Licenses &amp; Hardware Catalog
                    </h2>
                    <p className="text-xs font-mono mt-1 text-[var(--muted)]">Order licenses and hardware imported for optimal latency</p>
                  </div>
                  <ProductCatalog onSelectProduct={handleSelectProduct} />
                </motion.div>
              )}

              {activeTab === 'vm' && (
                <motion.div key="vm" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div>
                    <h2 className="text-sm sm:text-base font-bold tracking-widest flex items-center gap-2.5 uppercase text-[var(--fg)]">
                      <Sliders size={18} className="text-[var(--primary)]" /> Custom VM Architecture Build
                    </h2>
                    <p className="text-xs font-mono mt-1 text-[var(--muted)]">Tailor the perfect Windows VPS for continuous automated execution</p>
                  </div>
                  <VmConfigurator onAddVmToCart={handleAddVmToCart} />
                </motion.div>
              )}

              {activeTab === 'alerts' && (
                <motion.div key="alerts" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                  <AlertsSimulator />
                </motion.div>
              )}

              {activeTab === 'checkout' && (
                <motion.div key="checkout" variants={tabVariants} initial="hidden" animate="visible" exit="exit">
                  <PaymentPortal
                    selectedProduct={selectedProduct}
                    customVmConfig={customVmConfig}
                    onPaymentSubmitted={handlePaymentSubmitted}
                  />
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div key="orders" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="flex justify-between items-center flex-wrap gap-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold tracking-widest flex items-center gap-2.5 uppercase text-[var(--fg)]">
                        <FileCheck size={18} className="text-[var(--primary)]" /> Order &amp; License Logbook
                      </h2>
                      <p className="text-xs font-mono mt-1 text-[var(--muted)]">Track billing verifications and subscription states</p>
                    </div>
                    <span className="text-[9px] font-mono tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      LOCAL STORAGE SECURED
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="rounded-2xl border border-[var(--border)] p-12 sm:p-16 text-center bg-[var(--card)]/50 backdrop-blur-md">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[var(--card2)] border border-[var(--border)] text-[var(--muted)] shadow-inner">
                        <Clock size={24} />
                      </div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">No transactions yet</h3>
                      <p className="text-xs mt-2.5 max-w-sm mx-auto font-mono text-[var(--muted)] leading-relaxed">
                        Scan the UPI QR in Checkout, transfer funds, and enter your reference ID.
                      </p>
                      <button
                        onClick={() => switchTab('store')}
                        className="mt-8 px-8 py-3.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--primary)] hover:text-white shadow-lg hover:shadow-[var(--primary)]/20 hover:-translate-y-0.5"
                      >
                        Browse Licenses
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {orders.map((ord, i) => (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={ord.id}
                          className="rounded-2xl border border-[var(--border)] p-5 sm:p-6 space-y-5 bg-[var(--card)]/80 backdrop-blur-sm hover:border-[var(--primary)]/30 transition-colors group"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-[var(--border)]">
                            <div>
                              <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--fg)] group-hover:text-[var(--primary)] transition-colors">
                                {ord.planName}
                              </span>
                              <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                                <span className="text-[10px] font-mono text-[var(--muted)] bg-[var(--card2)] px-2 py-0.5 rounded-md">ID: {ord.id}</span>
                                <span className="text-[var(--border)]">•</span>
                                <span className="text-[10px] font-mono text-[var(--muted)]">{ord.createdAt}</span>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono border flex-shrink-0 shadow-sm ${
                                (ord.status === 'active' || ord.status === 'completed') 
                                  ? 'bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30' 
                                  : 'bg-[var(--card2)] text-[var(--muted)] border-[var(--border)]'
                              }`}
                            >
                              {(ord.status === 'active' || ord.status === 'completed') ? '✅ Verified & Active' : '⏳ Verifying...'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-mono">
                            {[
                              { label: 'User', primary: ord.email, secondary: ord.telegramUsername },
                              { label: 'UTR / Reference', primary: ord.utrNo, secondary: `via ${ord.paymentMethod}` },
                              { label: 'Total Paid', primary: `₹${ord.amountPaid.toLocaleString('en-IN')}`, secondary: `~$${(ord.amountPaid/85).toFixed(1)} USD`, big: true },
                            ].map((row, j) => (
                              <div key={j}>
                                <span className="block text-[9px] uppercase tracking-wider font-bold mb-1 text-[var(--muted)]">{row.label}</span>
                                <span className={`block truncate ${row.big ? 'text-[var(--primary)] font-black text-lg' : 'text-[var(--fg)] font-medium'}`}>
                                  {row.primary}
                                </span>
                                <span className="text-[10px] text-[var(--muted)] mt-0.5 block">{row.secondary}</span>
                              </div>
                            ))}
                          </div>

                          {ord.hasVM && (
                            <div className="p-4 rounded-xl border border-[var(--border)] text-xs font-mono bg-[var(--card2)]/50">
                              <div className="font-bold flex items-center gap-2 uppercase tracking-wide text-[var(--fg)]">
                                <Terminal size={14} className="text-[var(--primary)] animate-pulse" />
                                Windows Server Deployment Initiated
                              </div>
                              <p className="text-[11px] mt-2 leading-relaxed text-[var(--muted)]">
                                Provisioning <strong className="text-[var(--fg)] font-medium">{ord.vmDetails?.ram || 2}GB RAM</strong> node in <strong className="text-[var(--fg)] font-medium">{ord.vmDetails?.region || 'Mumbai'}</strong>. Credentials dispatched via Telegram.
                              </p>
                            </div>
                          )}

                          <div className="pt-4 border-t border-[var(--border)] flex justify-between items-center font-mono text-[10px]">
                            <span className="italic text-[var(--muted)]">
                              {ord.status === 'pending_verification'
                                ? '🔒 Awaiting ledger review by Mangalik & Sons Securities.'
                                : '✅ License key dispatched via Telegram.'}
                            </span>
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="text-rose-500/60 hover:text-rose-500 transition-colors uppercase tracking-wider font-bold ml-4 px-2 py-1 rounded-md hover:bg-rose-500/10"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-6 lg:space-y-8 lg:sticky lg:top-[90px]">
          {/* Corporate Overview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-[var(--border)] p-6 space-y-5 bg-[var(--card)]/80 backdrop-blur-md shadow-xl"
          >
            <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] pb-3 border-b border-[var(--border)] text-[var(--muted)] flex items-center gap-2">
               Corporate Overview
            </h3>
            <div className="space-y-4 text-xs leading-relaxed font-mono text-[var(--muted)]">
              <p>
                <strong className="text-[var(--fg)] font-medium">Jumpstreet</strong> is a premier tech and hardware distribution entity under{' '}
                <strong className="text-[var(--fg)] font-medium">A Mangalik and Sons Securities Limited</strong>.
              </p>
              <p>
                We specialize in FPGA-accelerated latency-critical trading utilities (the{' '}
                <strong className="text-[var(--fg)] font-medium">HFT Signal Suite (Bot Fixed v4.0)</strong> indicator platform) and direct imports
                of industrial-grade 5G routers and enterprise J-SIM setups.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--card2)]/50">
              <span className="text-[9px] font-bold block uppercase tracking-wider font-mono mb-3 text-[var(--muted)]">Conglomerate Assets</span>
              <div className="grid grid-cols-2 gap-2.5 text-[10px] font-mono">
                {[
                  { label: 'HQ', value: 'New Delhi, IN' },
                  { label: 'Supply', value: 'Japan & China' },
                  { label: 'Founded', value: '2022' },
                  { label: 'Sector', value: 'FinTech & HW' },
                ].map(item => (
                  <div key={item.label} className="p-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]/30 transition-colors">
                    <span className="block text-[9px] text-[var(--muted)] mb-0.5 uppercase tracking-wider">{item.label}</span>
                    <span className="font-bold text-[var(--fg)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Visit Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-[var(--border)] p-5 sm:p-6 bg-[var(--card)]/80 backdrop-blur-md shadow-xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-[var(--primary)]" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">Platform Visits</span>
                </div>
                <span className="font-mono font-black text-[var(--primary)] text-xl drop-shadow-sm">{displayCount.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-[var(--card2)] border border-[var(--border)]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-[var(--primary)] shadow-[0_0_10px_rgba(56,189,248,0.8)]" 
                />
              </div>
              <div className="flex justify-between text-[9px] font-mono mt-2 text-[var(--muted)] uppercase tracking-wider">
                <span>Unique browsers</span>
                <span>72% retention</span>
              </div>
            </div>
          </motion.div>

          {/* Help Desk */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-[var(--border)] p-6 sm:p-8 text-center space-y-4 bg-[var(--card)]/80 backdrop-blur-md shadow-xl"
          >
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto bg-[var(--card2)] border border-[var(--border)] text-[var(--fg)] shadow-inner">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--fg)]">Need Custom Setup?</h4>
              <p className="text-[11px] mt-1.5 font-mono text-[var(--muted)] leading-relaxed max-w-[200px] mx-auto">
                We design fully automated systems tailored to your trading strategy.
              </p>
            </div>
            <a
              href="https://ajainx1.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 mt-2 text-xs font-mono font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 bg-[var(--card2)] text-[var(--fg)] border border-[var(--border)] hover:bg-[var(--fg)] hover:text-[var(--bg)] hover:shadow-lg group"
            >
              <span>Speak to Developer</span>
              <ExternalLink size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </motion.div>
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border)] py-10 px-4 text-center text-xs font-mono mt-auto relative z-10 bg-[var(--card)]/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-5">
          <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-[var(--fg)]">
            Jumpstreet • A Mangalik and Sons Securities Limited © 2026. All rights reserved.
          </p>
          <p className="max-w-2xl mx-auto text-[10px] leading-relaxed text-[var(--muted)]">
            Algorithmic quantitative signals ("HFT Signal Suite (Bot Fixed v4.0)") are for backtesting and analytical simulation.
            We do not provide personalised financial advice. Shipped hardware is subject to Indian import regulations.
          </p>
          <div className="flex flex-wrap justify-center gap-5 sm:gap-8 text-[9px] uppercase tracking-widest font-bold text-[var(--muted)]">
            {[
              { label: 'Developer Profile', href: 'https://ajainx1.github.io' },
              { label: 'Primary Portal', href: 'https://ajainx1.github.io' },
              { label: 'Terms of Service', href: '#' },
            ].map(link => (
              <a key={link.label} href={link.href} target={link.href !== '#' ? '_blank' : undefined}
                 rel="noopener noreferrer" className="hover:text-[var(--primary)] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--bg)]/90 backdrop-blur-xl border-t border-[var(--border)] flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg gap-1 min-w-[60px] transition-colors ${
              activeTab === key ? 'text-[var(--primary)]' : 'text-[var(--muted)]'
            }`}
          >
            {icon}
            <span className="text-[9px] font-mono uppercase tracking-wider font-bold">{label}</span>
          </button>
        ))}
      </nav>

      {/* ── Visit Counter Floating Badge ── */}
      <VisitCounterBadge displayCount={displayCount} />

      {/* ── Scroll-to-Top Button ── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollTop}
            className="fixed bottom-24 sm:bottom-8 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center bg-[var(--fg)] text-[var(--bg)] shadow-xl hover:bg-[var(--primary)] hover:text-white transition-colors"
            aria-label="Scroll to top"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function JSPage() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
