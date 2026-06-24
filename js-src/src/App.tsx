import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Terminal, 
  TrendingUp, 
  Radio, 
  ExternalLink, 
  FileCheck, 
  Clock, 
  Heart, 
  Sliders, 
  ShoppingCart, 
  Menu, 
  X,
  CreditCard,
  MessageSquare
} from 'lucide-react';

import { Product, VMConfig, PaymentSubmission } from './types';
import SpotifyWidget from './components/SpotifyWidget';
import AlertsSimulator from './components/AlertsSimulator';
import VmConfigurator from './components/VmConfigurator';
import ProductCatalog from './components/ProductCatalog';
import PaymentPortal from './components/PaymentPortal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'store' | 'vm' | 'alerts' | 'checkout' | 'orders'>('store');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customVmConfig, setCustomVmConfig] = useState<{ config: VMConfig; price: number } | null>(null);
  const [orders, setOrders] = useState<PaymentSubmission[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('jumpstreet_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        // Fallback
      }
    } else {
      // Seed initial dummy pending transaction for higher visual realism
      const seedOrder: PaymentSubmission = {
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
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        hasVM: false
      };
      setOrders([seedOrder]);
      localStorage.setItem('jumpstreet_orders', JSON.stringify([seedOrder]));
    }
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCustomVmConfig(null); // Clear custom VM if direct product selected
    setActiveTab('checkout');
  };

  const handleAddVmToCart = (config: VMConfig, price: number) => {
    setCustomVmConfig({ config, price });
    setSelectedProduct(null); // Clear pre-set products
    setActiveTab('checkout');
  };

  const handlePaymentSubmitted = (submission: PaymentSubmission) => {
    const updatedOrders = [submission, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('jumpstreet_orders', JSON.stringify(updatedOrders));
    setActiveTab('orders');
    
    // Smooth scroll back to top of screen
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelOrder = (id: string) => {
    const filtered = orders.filter(o => o.id !== id);
    setOrders(filtered);
    localStorage.setItem('jumpstreet_orders', JSON.stringify(filtered));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-neutral-100 flex flex-col font-sans selection:bg-white/20 selection:text-white">
      
      {/* Decorative Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-20" />

      {/* Top Notification Bar */}
      <div className="bg-black border-b border-white/10 px-4 py-2 text-center text-[10px] text-neutral-400 font-mono flex items-center justify-center gap-1.5 flex-wrap uppercase tracking-wider">
        <span>🚀 <strong>Bot Fixed</strong> indicator package & 5G SIM Hotspots live.</span>
        <span className="hidden sm:inline text-neutral-800">|</span>
        <span>Corporate Identity: <strong>Jumpstreet</strong> (a Mangalik and Sons Venture limited)</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-white text-black flex items-center justify-center font-mono font-black text-lg tracking-tighter shadow-xl">
              J
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-[0.15em] text-white uppercase font-sans">Jumpstreet</span>
                <span className="text-[9px] bg-neutral-900 px-2 py-0.5 rounded-none text-neutral-400 font-mono font-bold uppercase tracking-widest hidden xs:inline border border-white/5">
                  M&S Venture
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase">Mangalik & Sons Venture Limited</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-mono uppercase tracking-wider text-[11px]">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-4 py-2 rounded-none transition-all ${
                activeTab === 'store' ? 'bg-[#111111] text-white border border-white/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Bot Store & Pricing
            </button>
            <button
              onClick={() => setActiveTab('vm')}
              className={`px-4 py-2 rounded-none transition-all ${
                activeTab === 'vm' ? 'bg-[#111111] text-white border border-white/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Windows Cloud VM
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-none transition-all ${
                activeTab === 'alerts' ? 'bg-[#111111] text-white border border-white/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Live Alerts Simulator
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`px-4 py-2 rounded-none transition-all flex items-center gap-1.5 ${
                activeTab === 'checkout' ? 'bg-[#111111] text-blue-400 border border-white/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ShoppingCart size={12} />
              Checkout Portal
              {(selectedProduct || customVmConfig) && (
                <span className="w-1.5 h-1.5 rounded-none bg-blue-400 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-none transition-all flex items-center gap-1.5 ${
                activeTab === 'orders' ? 'bg-[#111111] text-neutral-200 border border-white/10 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              My Orders
              {orders.length > 0 && (
                <span className="bg-white/5 text-neutral-300 px-1.5 py-0.5 rounded-none text-[9px] font-mono border border-white/10">
                  {orders.length}
                </span>
              )}
            </button>
          </nav>

          {/* Social / External Links */}
          <div className="hidden sm:flex items-center gap-2">
            <a 
              href="https://ajainx1.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] font-mono font-bold tracking-wider uppercase px-3.5 py-2 rounded-none border border-white/10 hover:border-white/20 hover:bg-neutral-900 transition-all text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
            >
              <span>ajainx1.github.io</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Mobile Menu Trigger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white rounded-none hover:bg-neutral-900 transition-all"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-black border-b border-white/10 px-4 py-3 space-y-1.5 sticky top-[73px] z-30 font-mono uppercase tracking-wider text-[11px] animate-fade-in">
          <button
            onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2.5 rounded-none transition-all block ${
              activeTab === 'store' ? 'bg-[#111111] text-white' : 'text-neutral-400'
            }`}
          >
            Bot Store & Pricing
          </button>
          <button
            onClick={() => { setActiveTab('vm'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2.5 rounded-none transition-all block ${
              activeTab === 'vm' ? 'bg-[#111111] text-white' : 'text-neutral-400'
            }`}
          >
            Windows Cloud VM
          </button>
          <button
            onClick={() => { setActiveTab('alerts'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2.5 rounded-none transition-all block ${
              activeTab === 'alerts' ? 'bg-[#111111] text-white' : 'text-neutral-400'
            }`}
          >
            Live Alerts Simulator
          </button>
          <button
            onClick={() => { setActiveTab('checkout'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2.5 rounded-none transition-all flex items-center justify-between ${
              activeTab === 'checkout' ? 'bg-[#111111] text-blue-400' : 'text-neutral-400'
            }`}
          >
            <span>Checkout Portal</span>
            {(selectedProduct || customVmConfig) && <span className="w-2 h-2 rounded-none bg-blue-400 animate-pulse" />}
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setMobileMenuOpen(false); }}
            className={`w-full text-left p-2.5 rounded-none transition-all flex items-center justify-between ${
              activeTab === 'orders' ? 'bg-[#111111] text-neutral-200' : 'text-neutral-400'
            }`}
          >
            <span>My Orders</span>
            {orders.length > 0 && (
              <span className="bg-white/5 text-neutral-300 px-1.5 py-0.5 rounded-none text-[9px] font-mono">
                {orders.length}
              </span>
            )}
          </button>
          <div className="pt-2 border-t border-white/10 mt-2">
            <a 
              href="https://ajainx1.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full text-center py-2 bg-neutral-900 text-xs font-semibold text-neutral-300 rounded-none flex items-center justify-center gap-1 uppercase tracking-wider"
            >
              <span>Visit ajainx1.github.io</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
        
        {/* Left Side: Navigation / Tab content modules */}
        <div className="lg:col-span-8 space-y-8 min-w-0">
          
          {/* Hero Branding Board */}
          <div className="relative bg-[#111111] border border-white/10 rounded-none p-6 sm:p-8 overflow-hidden shadow-2xl">
            {/* Top mesh decoration */}
            <div className="absolute right-0 top-0 bg-blue-500/5 w-64 h-64 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-none bg-blue-400 animate-pulse" />
                <span className="text-[9px] font-mono text-blue-400 tracking-widest font-bold uppercase">
                  ACTIVE PLATFORM NODE
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight uppercase">
                Automated Alerts & Low-Latency Hosting for <span className="text-blue-400">Bot Fixed</span>
              </h1>
              
              <p className="text-xs sm:text-xs text-neutral-400 leading-relaxed max-w-2xl font-mono">
                Deploy state-of-the-art algorithmic trading configurations. Jumpstreet secures lowest-latency Windows VPS packages pre-installed with <strong>Bot Fixed</strong> indicators, paired with imported 5G network redundancy hardware from Japan and China.
              </p>

              {/* Status parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                <div className="bg-black p-3 rounded-none border border-white/5 text-center sm:text-left">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider">Gateway Status</span>
                  <span className="text-xs font-bold text-blue-400 flex items-center justify-center sm:justify-start gap-1 mt-0.5 uppercase font-mono">
                    <span className="w-1.5 h-1.5 rounded-none bg-blue-400 animate-pulse" /> Secure Live
                  </span>
                </div>
                <div className="bg-black p-3 rounded-none border border-white/5 text-center sm:text-left">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider">Signal Latency</span>
                  <span className="text-xs font-bold text-white font-mono block mt-0.5">~1.2 ms avg</span>
                </div>
                <div className="bg-black p-3 rounded-none border border-white/5 text-center sm:text-left">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider">5G Router Stock</span>
                  <span className="text-xs font-bold text-neutral-300 block mt-0.5 font-mono">14 Units Left</span>
                </div>
                <div className="bg-black p-3 rounded-none border border-white/5 text-center sm:text-left">
                  <span className="text-[9px] font-mono text-neutral-500 block uppercase tracking-wider">Operator</span>
                  <span className="text-[10px] font-bold text-blue-400 block truncate mt-0.5 font-mono uppercase" title="A Mangalik & Sons Venture">
                    Mangalik & Sons
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Views */}
          <div className="transition-all duration-300">
            {activeTab === 'store' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-white flex items-center gap-2 uppercase font-sans">
                      <TrendingUp size={16} className="text-white" />
                      Licenses & Hardware Catalog
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">Order licenses and hardware imported directly for optimal latency</p>
                  </div>
                </div>
                <ProductCatalog onSelectProduct={handleSelectProduct} />
              </div>
            )}

            {activeTab === 'vm' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold tracking-widest text-white flex items-center gap-2 uppercase font-sans">
                    <Sliders size={16} className="text-white" />
                    Custom VM Architecture Build
                  </h2>
                  <p className="text-xs text-neutral-400 font-mono">Tailor the perfect Windows VPS package for continuous automated execution</p>
                </div>
                <VmConfigurator onAddVmToCart={handleAddVmToCart} />
              </div>
            )}

            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <AlertsSimulator />
              </div>
            )}

            {activeTab === 'checkout' && (
              <div className="space-y-6">
                <PaymentPortal 
                  selectedProduct={selectedProduct}
                  customVmConfig={customVmConfig}
                  onPaymentSubmitted={handlePaymentSubmitted}
                />
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-sm font-bold tracking-widest text-white flex items-center gap-2 uppercase font-sans">
                      <FileCheck size={16} className="text-white" />
                      Order & License Logbook
                    </h2>
                    <p className="text-xs text-neutral-400 font-mono">Track and manage your billing verifications and subscription states</p>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono tracking-wider">
                    SECURED BY LOCAL STORAGE
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-[#111111] border border-white/10 rounded-none p-12 text-center">
                    <div className="w-12 h-12 bg-black border border-white/10 rounded-none flex items-center justify-center text-neutral-400 mx-auto mb-4">
                      <Clock size={18} />
                    </div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">No transactions lodged yet</h3>
                    <p className="text-xs text-neutral-500 mt-2 max-w-sm mx-auto font-mono">
                      Scan the UPI QR in the Checkout Portal, transfer funds, and enter your reference ID to spin up your license.
                    </p>
                    <button
                      onClick={() => setActiveTab('store')}
                      className="mt-6 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-none text-xs font-bold transition-all uppercase tracking-widest cursor-pointer"
                    >
                      Browse Licenses
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div 
                        key={ord.id}
                        className="bg-[#111111] border border-white/10 rounded-none p-5 space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5 pb-3 border-b border-white/5">
                          <div>
                            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">{ord.planName}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-neutral-500">ID: {ord.id}</span>
                              <span className="text-neutral-800">•</span>
                              <span className="text-[10px] font-mono text-neutral-500">{ord.createdAt}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 font-mono">
                            <span className={`px-2.5 py-0.5 rounded-none text-[9px] font-bold uppercase tracking-widest border ${
                              ord.status === 'active' || ord.status === 'completed'
                                ? 'bg-blue-400/5 text-blue-400 border-blue-400/20'
                                : 'bg-neutral-900 text-neutral-400 border-white/5 animate-pulse'
                            }`}>
                              {ord.status === 'active' || ord.status === 'completed' ? 'Verified & Active' : 'Verifying Ledger...'}
                            </span>
                          </div>
                        </div>

                        {/* Order breakdown */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                          <div>
                            <span className="text-neutral-500 block uppercase text-[9px] tracking-wider font-bold">LODGED USER</span>
                            <span className="text-neutral-200 mt-0.5 block truncate font-mono">{ord.email}</span>
                            <span className="text-neutral-400 text-[10px]">{ord.telegramUsername}</span>
                          </div>

                          <div>
                            <span className="text-neutral-500 block uppercase text-[9px] tracking-wider font-bold">UTR / REFERENCE CODE</span>
                            <span className="text-neutral-200 mt-0.5 block font-bold select-all">{ord.utrNo}</span>
                            <span className="text-[10px] text-neutral-500">Gateway: {ord.paymentMethod}</span>
                          </div>

                          <div>
                            <span className="text-neutral-500 block uppercase text-[9px] tracking-wider font-bold">TOTAL PAID AMOUNT</span>
                            <span className="text-blue-400 mt-0.5 block font-black text-sm">₹{ord.amountPaid.toLocaleString('en-IN')}</span>
                            <span className="text-[10px] text-neutral-500">~ ${(ord.amountPaid/85).toFixed(1)} USD</span>
                          </div>
                        </div>

                        {/* VM config details if included */}
                        {ord.hasVM && (
                          <div className="bg-black p-3 rounded-none border border-white/5 text-xs font-mono">
                            <div className="font-bold text-neutral-300 flex items-center gap-1.5 uppercase tracking-wide">
                              <Terminal size={12} className="text-blue-400 animate-pulse" />
                              <span>Windows Server Deployment Protocol Initiated</span>
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-1 leading-normal">
                              Provisioning <strong>{ord.vmDetails?.ram || 2}GB RAM</strong> node in <strong>{ord.vmDetails?.region || 'Mumbai'}</strong>. Pre-installed with anti-crash watchdogs. System credentials will dispatch to your registered Telegram account.
                            </p>
                          </div>
                        )}

                        <div className="pt-3 border-t border-white/5 flex justify-between items-center font-mono text-[10px]">
                          <span className="text-neutral-500 italic">
                            {ord.status === 'pending_verification' 
                              ? '🔒 Waiting for Mangalik & Sons administrator ledger review.' 
                              : '✅ License key dispatched successfully via Telegram.'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCancelOrder(ord.id)}
                            className="text-neutral-400 hover:text-rose-400 transition-colors uppercase tracking-wider font-bold"
                          >
                            Cancel Request
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

        {/* Right Sidebar: Spotify Widget & Company stats deck */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Persistent Spotify Feed Widget */}
          <SpotifyWidget />

          {/* Jumpstreet - A Mangalik & Sons Venture Overview Card */}
          <div className="bg-[#111111] border border-white/10 rounded-none p-5 space-y-4">
            <h3 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.15em] pb-2 border-b border-white/10">
              Corporate Overview
            </h3>
            
            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed font-mono">
              <p>
                <strong>Jumpstreet</strong> is a premier tech and hardware distribution entity operating under parent conglomerate <strong>A Mangalik and Sons Venture Limited</strong>.
              </p>
              <p>
                We specialize in building low-latency algorithmic utilities (including the signature <strong>Bot Fixed</strong> indicator platform) and securing direct imports of industrial-grade telecom equipment (such as 5G routers and enterprise J-SIM setups).
              </p>
            </div>

            <div className="bg-black p-3 rounded-none border border-white/5 space-y-2">
              <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider font-mono">Conglomerate Assets</span>
              <div className="grid grid-cols-2 gap-2 text-[9px] font-mono">
                <div className="bg-neutral-900/40 p-2 rounded-none border border-white/5">
                  <span className="text-neutral-500 block">Headquarters</span>
                  <span className="text-neutral-200 font-bold">New Delhi, IN</span>
                </div>
                <div className="bg-neutral-900/40 p-2 rounded-none border border-white/5">
                  <span className="text-neutral-500 block">Supply Line</span>
                  <span className="text-neutral-200 font-bold">Japan & China</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Help Desk Card */}
          <div className="bg-[#111111] border border-white/10 rounded-none p-5 text-center space-y-3">
            <div className="w-10 h-10 bg-white/5 rounded-none border border-white/10 flex items-center justify-center text-white mx-auto">
              <MessageSquare size={16} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Need Customized Implementation?</h4>
              <p className="text-[11px] text-neutral-400 mt-1.5 font-mono">
                We design fully automated systems according to your personal trading strategies and indicator preferences.
              </p>
            </div>
            <a 
              href="https://ajainx1.github.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 text-xs text-neutral-200 border border-white/5 rounded-none transition-all flex items-center justify-center gap-1.5 font-mono tracking-wider uppercase"
            >
              <span>Speak to Developer</span>
              <ExternalLink size={12} />
            </a>
          </div>

        </div>

      </main>

      {/* Footer copyright section */}
      <footer className="bg-black border-t border-white/10 py-8 px-4 text-center text-xs text-neutral-500 mt-12 font-mono">
        <div className="max-w-7xl mx-auto space-y-3">
          <p className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">
            Jumpstreet • A Mangalik and Sons Venture Limited © 2026. All rights reserved.
          </p>
          <p className="max-w-2xl mx-auto text-[9px] leading-relaxed text-neutral-600">
            Algorithmic indicator tools ("Bot Fixed") are developed for backtesting and analytical simulation. We do not provide personalized financial advice. Shipped hardware (5G SIM Hotspots) is subject to Indian import regulations.
          </p>
          <div className="flex justify-center gap-4 text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
            <a href="https://ajainx1.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Developer Profile</a>
            <span className="text-neutral-800">•</span>
            <a href="https://ajainx1.github.io" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Primary Portal</a>
            <span className="text-neutral-800">•</span>
            <a href="#" className="hover:text-blue-400 transition-colors">Term of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
