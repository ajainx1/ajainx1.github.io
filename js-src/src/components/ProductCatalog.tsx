import React from 'react';
import { Shield, Zap, Sparkles, Server, ShoppingCart, HelpCircle, ArrowRight, Star, Cpu, Radio, Laptop } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  {
    id: 'bot_standard',
    name: 'Bot Fixed - Standard License',
    description: 'Autonomous trading indicator system. Instant signals sent directly to your messenger.',
    price: 999,
    currency: 'INR',
    badge: 'Popular',
    type: 'bot',
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=600',
    specs: [
      'Telegram, WhatsApp & Signal Webhook Alerts',
      'Fully custom strategies implementation',
      'No VM headache - direct web API hooks',
      'Jumpstreet 0-latency engine access',
      '24/7 client-side running capability'
    ]
  },
  {
    id: 'bot_premium',
    name: 'Bot Fixed - Premium VM Bundle',
    description: 'Fully hands-off trading system. Standard Bot Fixed + Dedicated Windows Cloud VM setup.',
    price: 1499,
    currency: 'INR',
    badge: 'Best Value',
    type: 'bundle',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=600',
    specs: [
      'Includes 1 Month Bot Fixed License',
      'Pre-installed on a Windows Cloud VM (2GB ECC RAM, 1 vCPU)',
      'Jumpstreet "Tricks Implementation" (Watchdogs & Anti-crash)',
      'Premium custom integration techniques included',
      'Fully set up and working out of the box - 0 configuration needed'
    ]
  },
  {
    id: '5g_hotspot',
    name: 'Jumpstreet 5G SIM Hotspot (Japan/China Import)',
    description: 'Industrial-grade low-latency 5G portable router unlocked for Airtel & Jio. Perfect backup for automated trading.',
    price: 3499,
    currency: 'INR',
    badge: 'Hardware Import',
    type: 'hotspot',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
    specs: [
      'High-speed 5G downlink up to 1.8 Gbps',
      'Unlocked multi-band support (Japan/China/India bands compatible)',
      'Ultra low-latency gaming/trading firmware optimized',
      'Rechargeable 4500mAh lithium battery (12 hours active)',
      'Ideal companion for backup internet redundancy'
    ]
  },
  {
    id: 'pro_trader_bundle',
    name: 'Pro Trader Ultimate Bundle',
    description: 'The definitive algorithmic trading gear. Premium Bot Fixed + Windows VM + Imported 5G SIM Hotspot.',
    price: 4499,
    currency: 'INR',
    badge: 'Ultimate Elite',
    type: 'bundle',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    specs: [
      'All Premium VM Bundle benefits included (Save over ₹1000!)',
      'Physical Jumpstreet 5G SIM Hotspot shipped express',
      'Free VIP priority shipping within India',
      'Jumpstreet 1-on-1 private optimization session',
      'Life-time software upgrades and direct developer hotline'
    ]
  }
];

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  return (
    <div className="space-y-8">
      
      {/* Dynamic Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PRODUCTS.map((prod) => {
          const isPremium = prod.id === 'bot_premium' || prod.id === 'pro_trader_bundle';
          const isHardware = prod.type === 'hotspot';
          
          return (
            <div 
              key={prod.id}
              className={`rounded-none border transition-all duration-300 flex flex-col justify-between overflow-hidden relative group shadow-2xl ${
                isPremium 
                  ? 'border-white/20 bg-[#111111] hover:border-white/40' 
                  : 'border-white/10 bg-[#111111] hover:border-white/30'
              }`}
            >
              {/* Badge top right */}
              {prod.badge && (
                <div className={`absolute top-3.5 right-3.5 px-2.5 py-0.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest z-10 ${
                  isPremium ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-300 border border-white/5'
                }`}>
                  {prod.badge}
                </div>
              )}

              {/* Product Visual Header */}
              <div className="h-44 relative overflow-hidden flex-shrink-0 border-b border-white/10">
                <img 
                  src={prod.image} 
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent" />
                
                {/* Meta details over picture */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-1.5">
                    {isHardware ? (
                      <Radio size={14} className="text-blue-400" />
                    ) : (
                      <Zap size={14} className="text-white" />
                    )}
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-widest">
                      {isHardware ? 'Hardware Redundancy' : 'Algorithmic Software'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-bold tracking-wide text-white group-hover:text-blue-400 transition-colors uppercase">
                    {prod.name}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {prod.description}
                  </p>

                  {/* Highlights checklist */}
                  <ul className="mt-4 space-y-2">
                    {prod.specs?.map((spec, sidx) => (
                      <li key={sidx} className="flex items-start gap-2 text-xs text-neutral-300">
                        <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${
                          isPremium ? 'bg-white' : 'bg-neutral-500'
                        }`} />
                        <span className="font-mono text-neutral-300">{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-3.5">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Price in India</span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-white">₹{prod.price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-neutral-500 block">~ ${(prod.price / 85).toFixed(2)} USD</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className={`w-full py-2.5 rounded-none text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isPremium 
                        ? 'bg-white text-black hover:bg-neutral-200' 
                        : 'bg-neutral-900 hover:bg-neutral-850 text-neutral-300 border border-white/5'
                    }`}
                  >
                    <ShoppingCart size={13} />
                    APPLY TO CHECKOUT
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust factors bar */}
      <div className="bg-[#111111] rounded-none p-5 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center font-mono uppercase tracking-wider text-[11px]">
        <div className="space-y-1">
          <span className="font-bold text-white block">🇮🇳 Shipped Local</span>
          <span className="text-[9px] text-neutral-500 font-mono normal-case">All 5G Routers dispatched express from New Delhi.</span>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-white/10 pt-3 sm:pt-0">
          <span className="font-bold text-blue-400 block">🤖 0 VM Headache</span>
          <span className="text-[9px] text-neutral-500 font-mono normal-case">No server setups required. We fully provision on robust VMs.</span>
        </div>
        <div className="space-y-1 border-t sm:border-t-0 pt-3 sm:pt-0">
          <span className="font-bold text-white block">💳 Direct UPI / Cards</span>
          <span className="text-[9px] text-neutral-500 font-mono normal-case">Secure transactions with rapid manual activation.</span>
        </div>
      </div>
    </div>
  );
}
