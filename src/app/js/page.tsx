"use client";
import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Terminal, TrendingUp, Radio, ExternalLink,
  FileCheck, Clock, Sliders, ShoppingCart, Menu, X,
  MessageSquare, Sun, Moon, Eye, Server, ChevronUp, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
      className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full backdrop-blur-xl border border-black/5 bg-white/80 shadow-md"
      aria-label={`${displayCount} platform visits`}
    >
      <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping flex-shrink-0" />
      <Eye size={14} className="text-blue-600 flex-shrink-0" />
      <span className="font-title font-black text-xs text-slate-900 tracking-wide">
        {displayCount.toLocaleString('en-IN')}
      </span>
      <span className="font-bold text-[9px] uppercase tracking-widest text-slate-400">
        visits
      </span>
    </motion.div>
  );
}

/* ── Ticker items ── */
const TICKER_ITEMS = [
  '🚀 Orca6 automated trading indicator package now live',
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
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 400, damping: 25 } },
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
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Sync wallet connection state
  useEffect(() => {
    const checkWallet = () => {
      const savedWallet = localStorage.getItem("web3_wallet_address");
      setWalletAddress(savedWallet);
    };
    checkWallet();
    window.addEventListener("storage", checkWallet);
    return () => window.removeEventListener("storage", checkWallet);
  }, []);
  
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
        planName: 'Orca6 - Trial License',
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
    <div className="min-h-screen flex flex-col font-sans relative text-slate-900 bg-slate-50 overflow-x-hidden selection:bg-blue-500 selection:text-white transition-colors duration-500">
      {/* ── Dynamic iCloud Mesh Background ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50" />
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-60 bg-blue-200 mix-blend-multiply" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[130px] opacity-50 bg-indigo-200 mix-blend-multiply" />
        <div className="absolute inset-0 backdrop-blur-[80px]" />
      </div>

      {/* ── Ticker bar ── */}
      <div className="relative z-10 py-2 border-b border-black/5 bg-white/60 backdrop-blur-md overflow-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex whitespace-nowrap"
        >
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
              {item}
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" />
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-40 border-b border-black/5 px-4 sm:px-6 py-3 bg-white/70 backdrop-blur-2xl shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0 group cursor-pointer" onClick={() => switchTab('store')}>
            <div className="w-10 h-10 flex items-center justify-center font-title font-black text-lg rounded-[12px] bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all">
              J
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-widest uppercase text-slate-900">
                  Jumpstreet
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest hidden md:inline bg-blue-50 text-blue-700 border border-blue-100 shadow-inner">
                  M&amp;S Venture
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-wider uppercase text-slate-500 group-hover:text-blue-600 transition-colors">
                Mangalik &amp; Sons Venture Ltd.
              </p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2 font-bold uppercase tracking-widest text-[11px] p-1.5 bg-slate-100/50 rounded-2xl border border-black/5 backdrop-blur-sm shadow-inner" aria-label="Main navigation">
            {navItems.map(({ key, label, icon }) => {
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative z-10 ${
                    isActive ? (key === 'checkout' ? 'text-blue-600' : 'text-slate-900') : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="desktopNavBubble"
                      className="absolute inset-0 bg-white border border-black/5 rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {icon}
                  {label}
                  {key === 'checkout' && hasPendingCheckout && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping absolute top-1.5 right-1.5" />
                  )}
                  {key === 'orders' && orders.length > 0 && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full ml-1 bg-blue-50 text-blue-700 border border-blue-100">
                      {orders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {walletAddress && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            )}
            <Link
              href="/portfolio"
              className="hidden sm:flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all border border-black/5 text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 group shadow-sm bg-white/50"
            >
              <span className="hidden md:inline">Aditya Portfolio</span>
              <ExternalLink size={14} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(m => !m)}
              className="lg:hidden p-3 rounded-xl transition-all bg-slate-100 text-slate-600 border border-black/5 hover:bg-slate-200"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
            className="lg:hidden sticky z-30 border-b border-black/5 px-4 py-4 space-y-2 font-bold uppercase tracking-widest text-[11px] bg-white/95 backdrop-blur-2xl overflow-hidden shadow-md"
            style={{ top: '65px' }}
          >
            {navItems.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => switchTab(key)}
                className={`w-full text-left flex items-center justify-between p-4 rounded-xl transition-all ${
                   activeTab === key ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`flex items-center gap-3 ${activeTab === key && key === 'checkout' ? 'text-blue-600' : ''}`}>
                  {icon} {label}
                </span>
                {key === 'orders' && orders.length > 0 && (
                  <span className="text-[10px] font-bold text-blue-700 bg-white px-3 py-1 rounded-full border border-blue-100 shadow-sm">
                    {orders.length}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative z-10">

        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8 min-w-0">

          {/* ── Hero Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[32px] border border-white/60 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.05)] bg-white/60 backdrop-blur-2xl transition-shadow hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)]"
          >
            <div className="absolute right-0 top-0 w-80 h-80 pointer-events-none bg-blue-100/50 blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="absolute left-0 bottom-0 w-64 h-64 pointer-events-none bg-indigo-100/50 blur-[60px] rounded-full -translate-x-1/3 translate-y-1/3" />

            <div className="relative p-8 sm:p-10 lg:p-12">
              <div className="flex items-center gap-3 mb-6 bg-white/60 w-max px-4 py-2 rounded-full border border-black/5 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-sm" />
                <span className="text-[11px] font-bold text-blue-600 tracking-[0.2em] uppercase">
                  Platform Node Active
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] uppercase mb-6 text-slate-900 font-title">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 drop-shadow-sm">Automated Alerts</span>{' '}
                <span className="opacity-90">&amp; Proximity Hosting & HFT Pipelines for</span>{' '}
                <span className="text-blue-600 drop-shadow-sm">Orca6</span>
              </h1>

              <p className="text-sm sm:text-base leading-relaxed max-w-2xl mb-6 text-slate-600 font-medium">
                Deploy state-of-the-art algorithmic trading configurations. Jumpstreet secures
                lowest-latency Windows VPS packages pre-installed with{' '}
                <strong className="text-slate-900 font-bold">Orca6</strong> indicators, paired with
                imported path-redundant telecommunications hardware from Japan and China.
              </p>

              <div className="mb-10 p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm text-sm font-medium text-amber-900 leading-relaxed max-w-2xl">
                <strong className="text-amber-700 block mb-2 text-xs tracking-widest uppercase">⚠️ Operational Requirements</strong>
                We require a <strong>minimum capital of 500 USD</strong>. To protect our proprietary strategies, we do not share them. We only require your account credentials to deploy Orca6 directly to your account. You may also provide a trial account to evaluate our execution logic.
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Gateway Status', value: 'Secure Live',    color: '#2563eb', pulse: true, bg: 'bg-blue-50' },
                  { label: 'Signal Latency',  value: '~1.2 ms avg',   color: '#0f172a',  pulse: false, bg: 'bg-slate-100' },
                  { label: 'Dual-Homed Node Stock', value: '14 Units Left', color: '#64748b',  pulse: false, bg: 'bg-slate-50' },
                  { label: 'Operator',        value: 'M&S Securities',   color: '#4f46e5', pulse: false, bg: 'bg-indigo-50' },
                ].map((s, i) => (
                  <motion.div
                    whileHover={{ y: -4 }}
                    key={i}
                    className={`p-4 rounded-2xl border border-black/5 backdrop-blur-xl shadow-sm ${s.bg}`}
                  >
                    <span className="text-[10px] font-bold block uppercase tracking-widest mb-1.5 text-slate-500">{s.label}</span>
                    <span className="text-xs font-black flex items-center gap-2 font-title tracking-wide" style={{ color: s.color }}>
                      {s.pulse && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse flex-shrink-0 shadow-sm" />}
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
                  <div className="bg-white/60 p-6 rounded-[24px] border border-white/60 shadow-sm backdrop-blur-xl mb-6">
                    <h2 className="text-base sm:text-lg font-black tracking-widest flex items-center gap-3 uppercase text-slate-900 font-title">
                      <TrendingUp size={22} className="text-blue-600" /> Licenses &amp; Hardware Catalog
                    </h2>
                    <p className="text-sm font-semibold mt-1 text-slate-500">Order licenses and hardware imported for optimal latency</p>
                  </div>
                  <ProductCatalog onSelectProduct={handleSelectProduct} />
                </motion.div>
              )}

              {activeTab === 'vm' && (
                <motion.div key="vm" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
                  <div className="bg-white/60 p-6 rounded-[24px] border border-white/60 shadow-sm backdrop-blur-xl mb-6">
                    <h2 className="text-base sm:text-lg font-black tracking-widest flex items-center gap-3 uppercase text-slate-900 font-title">
                      <Sliders size={22} className="text-blue-600" /> Custom VM Architecture Build
                    </h2>
                    <p className="text-sm font-semibold mt-1 text-slate-500">Tailor the perfect Windows VPS for continuous automated execution</p>
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
                  <div className="flex justify-between items-center flex-wrap gap-3 bg-white/60 p-6 rounded-[24px] border border-white/60 shadow-sm backdrop-blur-xl">
                    <div>
                      <h2 className="text-base sm:text-lg font-black tracking-widest flex items-center gap-3 uppercase text-slate-900 font-title">
                        <FileCheck size={22} className="text-blue-600" /> Order &amp; License Logbook
                      </h2>
                      <p className="text-sm font-semibold mt-1 text-slate-500">Track billing verifications and subscription states</p>
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                      LOCAL STORAGE SECURED
                    </span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="rounded-[24px] border border-white/60 p-12 sm:p-16 text-center bg-white/40 backdrop-blur-2xl shadow-sm">
                      <div className="w-20 h-20 rounded-[20px] flex items-center justify-center mx-auto mb-6 bg-slate-100 border border-black/5 text-slate-400 shadow-inner">
                        <Clock size={32} />
                      </div>
                      <h3 className="text-base font-black uppercase tracking-widest text-slate-900 font-title">No transactions yet</h3>
                      <p className="text-sm mt-3 max-w-sm mx-auto font-medium text-slate-500 leading-relaxed">
                        Scan the UPI QR in Checkout, transfer funds, and enter your reference ID.
                      </p>
                      <button
                        onClick={() => switchTab('store')}
                        className="mt-8 px-8 py-3.5 rounded-full text-xs font-bold transition-all uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
                          className="rounded-[24px] border border-white/60 p-6 sm:p-8 space-y-6 bg-white/60 backdrop-blur-xl shadow-sm hover:shadow-md hover:bg-white/80 transition-all group"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-black/5">
                            <div>
                              <span className="text-sm font-black uppercase tracking-widest text-slate-900 group-hover:text-blue-600 transition-colors font-title">
                                {ord.planName}
                              </span>
                              <div className="flex flex-wrap items-center gap-3 mt-2 font-mono">
                                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-black/5">ID: {ord.id}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] font-bold text-slate-500">{ord.createdAt}</span>
                              </div>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                                (ord.status === 'active' || ord.status === 'completed') 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {(ord.status === 'active' || ord.status === 'completed') ? '✅ Verified & Active' : '⏳ Verifying...'}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                            {[
                              { label: 'User', primary: ord.email, secondary: ord.telegramUsername },
                              { label: 'UTR / Reference', primary: ord.utrNo, secondary: `via ${ord.paymentMethod}` },
                              { label: 'Total Paid', primary: `₹${ord.amountPaid.toLocaleString('en-IN')}`, secondary: `~$${(ord.amountPaid/85).toFixed(1)} USD`, big: true },
                            ].map((row, j) => (
                              <div key={j}>
                                <span className="block text-[10px] uppercase tracking-widest font-bold mb-1.5 text-slate-500">{row.label}</span>
                                <span className={`block truncate ${row.big ? 'text-blue-600 font-black text-2xl font-title tracking-tight' : 'text-slate-900 font-bold'}`}>
                                  {row.primary}
                                </span>
                                <span className="text-[11px] text-slate-500 mt-1 block font-medium">{row.secondary}</span>
                              </div>
                            ))}
                          </div>

                          {ord.hasVM && (
                            <div className="p-5 rounded-2xl border border-black/5 bg-slate-50">
                              <div className="font-black flex items-center gap-3 uppercase tracking-widest text-slate-900 font-title">
                                <Terminal size={18} className="text-indigo-600 animate-pulse" />
                                Windows Server Deployment Initiated
                              </div>
                              <p className="text-sm mt-3 leading-relaxed text-slate-600 font-medium">
                                Provisioning <strong className="text-slate-900 font-bold">{ord.vmDetails?.ram || 2}GB RAM</strong> node in <strong className="text-slate-900 font-bold">{ord.vmDetails?.region || 'Mumbai'}</strong>. Credentials dispatched via Telegram.
                              </p>
                            </div>
                          )}

                          <div className="pt-5 border-t border-black/5 flex justify-between items-center text-[11px] font-bold">
                            <span className="italic text-slate-500">
                              {ord.status === 'pending_verification'
                                ? '🔒 Awaiting ledger review by Mangalik & Sons Securities.'
                                : '✅ License key dispatched via Telegram.'}
                            </span>
                            <button
                              onClick={() => handleCancelOrder(ord.id)}
                              className="text-red-500 hover:text-white transition-colors uppercase tracking-widest ml-4 px-4 py-2 rounded-full border border-red-200 bg-red-50 hover:bg-red-500 shadow-sm"
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
            className="rounded-[24px] border border-white/60 p-8 space-y-6 bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] pb-4 border-b border-black/5 text-slate-500 flex items-center gap-2">
               Corporate Overview
            </h3>
            <div className="space-y-4 text-sm leading-relaxed text-slate-600 font-medium">
              <p>
                <strong className="text-slate-900 font-bold">Jumpstreet</strong> is a premier tech and hardware distribution entity under{' '}
                <strong className="text-slate-900 font-bold">A Mangalik and Sons Securities Limited</strong>.
              </p>
              <p>
                We specialize in FPGA-accelerated latency-critical trading utilities (the{' '}
                <strong className="text-slate-900 font-bold">HFT Signal Suite (Bot Fixed v4.0)</strong> indicator platform) and direct imports
                of industrial-grade 5G routers and enterprise J-SIM setups.
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-black/5 bg-slate-50">
              <span className="text-[10px] font-black block uppercase tracking-widest font-title mb-4 text-slate-400">Conglomerate Assets</span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'HQ', value: 'New Delhi, IN' },
                  { label: 'Supply', value: 'Japan & China' },
                  { label: 'Founded', value: '2022' },
                  { label: 'Sector', value: 'FinTech & HW' },
                ].map(item => (
                  <div key={item.label} className="p-3 rounded-xl border border-black/5 bg-white shadow-sm hover:border-blue-200 transition-colors">
                    <span className="block text-[9px] font-bold text-slate-400 mb-1 uppercase tracking-widest">{item.label}</span>
                    <span className="font-black text-slate-900">{item.value}</span>
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
            className="rounded-[24px] border border-white/60 p-6 sm:p-8 bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Eye size={18} className="text-blue-600" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Platform Visits</span>
                </div>
                <span className="font-black text-blue-600 text-3xl font-title drop-shadow-sm tracking-tight">{displayCount.toLocaleString('en-IN')}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-slate-100 border border-black/5 shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm" 
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold mt-3 text-slate-400 uppercase tracking-widest">
                <span>Unique browsers</span>
                <span className="text-blue-600">72% retention</span>
              </div>
            </div>
          </motion.div>

          {/* Help Desk */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-[24px] border border-white/60 p-8 sm:p-10 text-center space-y-5 bg-white/60 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
          >
            <div className="w-16 h-16 rounded-[20px] flex items-center justify-center mx-auto bg-slate-50 border border-black/5 text-blue-600 shadow-inner">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="text-base font-black uppercase tracking-widest text-slate-900 font-title">Need Custom Setup?</h4>
              <p className="text-xs mt-2 font-medium text-slate-500 leading-relaxed max-w-[200px] mx-auto">
                We design fully automated systems tailored to your trading strategy.
              </p>
            </div>
            <Link
              href="/portfolio#contact"
              className="w-full py-4 mt-4 text-xs font-bold tracking-widest uppercase rounded-full transition-all flex items-center justify-center gap-3 bg-slate-900 text-white shadow-md hover:shadow-xl hover:bg-slate-800 hover:-translate-y-0.5 group"
            >
              <span>Speak to Developer</span>
              <ExternalLink size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>
        </aside>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-black/5 py-12 px-4 text-center text-xs mt-auto relative z-10 bg-slate-100/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto space-y-6">
          <p className="font-black uppercase tracking-[0.2em] text-[11px] text-slate-900 font-title">
            Jumpstreet • A Mangalik and Sons Securities Limited © 2026. All rights reserved.
          </p>
          <p className="max-w-2xl mx-auto text-[11px] leading-relaxed text-slate-500 font-medium">
            Algorithmic quantitative signals ("HFT Signal Suite (Bot Fixed v4.0)") are for backtesting and analytical simulation.
            We do not provide personalised financial advice. Shipped hardware is subject to Indian import regulations.
          </p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 text-[10px] uppercase tracking-widest font-bold text-slate-400">
            {[
              { label: 'Developer Profile', href: '/portfolio' },
              { label: 'Primary Portal', href: '/' },
              { label: 'Terms of Service', href: '#' },
            ].map(link => (
              <Link key={link.label} href={link.href} className="hover:text-blue-600 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ── Mobile Bottom Navigation ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-black/5 flex justify-around p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        {navItems.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => switchTab(key)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl gap-1.5 min-w-[60px] transition-all ${
              activeTab === key ? 'text-blue-600 bg-blue-50' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {icon}
            <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
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
            className="fixed bottom-24 sm:bottom-8 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center bg-slate-900 text-white shadow-[0_10px_25px_rgba(0,0,0,0.15)] hover:bg-blue-600 hover:shadow-[0_10px_25px_rgba(37,99,235,0.3)] transition-all"
            aria-label="Scroll to top"
          >
            <ChevronUp size={24} />
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
