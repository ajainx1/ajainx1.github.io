"use client";
import React from 'react';
import { Zap, ShoppingCart, ArrowRight, Radio } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from './types';
import TiltWrapper from '@/components/3d/TiltWrapper';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
}

const PRODUCTS: Product[] = [
  {
    id: 'bot_standard',
    name: 'Bot Fixed — Standard License',
    description: 'Autonomous trading indicator system. Instant signals sent directly to your messenger.',
    price: 999,
    currency: 'INR',
    badge: 'Popular',
    type: 'bot',
    image: '/js/bot_standard.png',
    specs: [
      'Telegram, WhatsApp & Signal Webhook Alerts',
      'Fully custom strategies implementation',
      'No VM headache — direct web API hooks',
      'Jumpstreet 0-latency engine access',
      '24/7 client-side running capability',
    ],
  },
  {
    id: 'bot_premium',
    name: 'Bot Fixed — Premium VM Bundle',
    description: 'Fully hands-off trading system. Standard Bot Fixed + Dedicated Windows Cloud VM setup.',
    price: 1499,
    currency: 'INR',
    badge: 'Best Value',
    type: 'bundle',
    image: '/js/bot_premium.png',
    specs: [
      'Includes 1 Month Bot Fixed License',
      'Pre-installed on Windows Cloud VM (2GB ECC RAM, 1 vCPU)',
      'Jumpstreet "Tricks Implementation" (Watchdogs & Anti-crash)',
      'Premium custom integration techniques included',
      'Fully set up — 0 configuration needed',
    ],
  },
  {
    id: '5g_hotspot',
    name: 'Jumpstreet 5G SIM Hotspot',
    description: 'Industrial-grade low-latency 5G portable router unlocked for Airtel & Jio. Japan/China import.',
    price: 3499,
    currency: 'INR',
    badge: 'Hardware Import',
    type: 'hotspot',
    image: '/js/5g_hotspot.png',
    specs: [
      'High-speed 5G downlink up to 1.8 Gbps',
      'Unlocked multi-band support (JP/CN/IN bands)',
      'Ultra low-latency gaming/trading firmware',
      'Rechargeable 4500mAh battery (12 hrs active)',
      'Ideal for backup internet redundancy',
    ],
  },
  {
    id: 'pro_trader_bundle',
    name: 'Pro Trader Ultimate Bundle',
    description: 'The definitive algorithmic trading gear. Premium Bot Fixed + Windows VM + 5G SIM Hotspot.',
    price: 4499,
    currency: 'INR',
    badge: 'Ultimate Elite',
    type: 'bundle',
    image: '/js/pro_trader_bundle.png',
    specs: [
      'All Premium VM Bundle benefits (Save ₹1000+!)',
      'Physical 5G SIM Hotspot shipped express',
      'Free VIP priority shipping within India',
      'Jumpstreet 1-on-1 private optimisation session',
      'Lifetime software upgrades & developer hotline',
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function ProductCatalog({ onSelectProduct }: ProductCatalogProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {PRODUCTS.map((prod) => {
          const isPremium = prod.id === 'bot_premium' || prod.id === 'pro_trader_bundle';
          const isHardware = prod.type === 'hotspot';

          return (
            <TiltWrapper tiltDeg={6}>
            <motion.div
              key={prod.id}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="rounded-xl border flex flex-col justify-between overflow-hidden relative group shadow-xl backdrop-blur-sm"
              style={{
                backgroundColor: 'var(--card)',
                borderColor: isPremium ? 'var(--border2)' : 'var(--border)',
              }}
            >
              {/* Magic Border Glow for Premium */}
              {isPremium && (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-[var(--primary)]/20 via-transparent to-[var(--primary)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Badge */}
              {prod.badge && (
                <div className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-widest z-10 border ${isPremium ? 'bg-[var(--fg)] text-[var(--bg)] border-transparent' : 'bg-[var(--card2)] text-[var(--muted)] border-[var(--border)]'}`}>
                  {isPremium && <span className="mr-1">⭐</span>}
                  {prod.badge}
                </div>
              )}

              {/* Image */}
              <div className="h-36 sm:h-44 relative overflow-hidden flex-shrink-0 border-b border-[var(--border)] z-10">
                <motion.img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.68)' }}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3.5 flex items-center gap-1.5 drop-shadow-md">
                  {isHardware
                    ? <Radio size={13} className="text-[var(--primary)]" />
                    : <Zap size={13} className="text-[var(--primary)]" />}
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[var(--muted)]">
                    {isHardware ? 'Hardware Redundancy' : 'Algorithmic Software'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4 z-10 relative">
                <div>
                  <h4 className="text-sm font-bold tracking-wide uppercase group-hover:text-[var(--primary)] transition-colors text-[var(--fg)]">
                    {prod.name}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed text-[var(--muted)]">
                    {prod.description}
                  </p>

                  <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    {prod.specs?.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 rounded-full ${isPremium ? 'bg-[var(--fg)]' : 'bg-[var(--primary)]'}`} />
                        <span className="font-mono text-[var(--muted)]">
                          {spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-[var(--border)] space-y-3">
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
                      Price in India
                    </span>
                    <div className="text-right">
                      <span className={`text-xl sm:text-2xl font-black ${isPremium ? 'text-[var(--primary)]' : 'text-[var(--fg)]'}`}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] block text-[var(--muted)]">
                        ~${(prod.price / 85).toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className={`w-full py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer group/btn border shadow-sm ${
                      isPremium 
                        ? 'bg-[var(--fg)] text-[var(--bg)] border-transparent hover:bg-[var(--primary)] hover:text-white' 
                        : 'bg-[var(--card2)] text-[var(--fg)] border-[var(--border)] hover:bg-[var(--card)]'
                    }`}
                  >
                    <ShoppingCart size={13} />
                    Apply to Checkout
                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
            </TiltWrapper>
          );
        })}
      </motion.div>

      {/* Trust Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-[var(--border)] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center font-mono uppercase tracking-wider text-[11px] bg-[var(--card)] backdrop-blur-sm shadow-md"
      >
        {[
          { icon: '🇮🇳', title: 'Shipped Local', desc: 'All 5G Routers dispatched express from New Delhi.' },
          { icon: '🤖', title: '0 VM Headache', desc: 'No server setups required. We fully provision on robust VMs.' },
          { icon: '💳', title: 'UPI / Cards', desc: 'Secure transactions with rapid manual activation.' },
        ].map((item, i) => (
          <div
            key={i}
            className={`space-y-1 py-3 sm:py-0 ${i > 0 ? 'sm:border-l border-t sm:border-t-0 border-[var(--border)]' : ''}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-bold block text-xs text-[var(--fg)]">
              {item.title}
            </span>
            <span className="text-[9px] font-mono normal-case text-[var(--muted)]">
              {item.desc}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
