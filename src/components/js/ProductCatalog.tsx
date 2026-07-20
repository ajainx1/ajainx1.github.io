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
              className={`rounded-[24px] border flex flex-col justify-between overflow-hidden relative group shadow-sm hover:shadow-md transition-shadow backdrop-blur-xl ${isPremium ? 'bg-white border-blue-200' : 'bg-white/60 border-white/60'}`}
            >
              {/* Magic Border Glow for Premium */}
              {isPremium && (
                <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-50 via-transparent to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              )}

              {/* Badge */}
              {prod.badge && (
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10 border shadow-sm ${isPremium ? 'bg-blue-600 text-white border-transparent' : 'bg-white text-slate-500 border-black/5'}`}>
                  {isPremium && <span className="mr-1">⭐</span>}
                  {prod.badge}
                </div>
              )}

              {/* Image */}
              <div className="h-36 sm:h-48 relative overflow-hidden flex-shrink-0 border-b border-black/5 z-10 bg-slate-50">
                <motion.img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.95)' }}
                  loading="lazy"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.7 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2 drop-shadow-sm bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-black/5">
                  {isHardware
                    ? <Radio size={14} className="text-blue-600" />
                    : <Zap size={14} className="text-blue-600" />}
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    {isHardware ? 'Hardware Redundancy' : 'Algorithmic Software'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-5 z-10 relative">
                <div>
                  <h4 className="text-base font-black tracking-widest uppercase group-hover:text-blue-600 transition-colors text-slate-900 font-title">
                    {prod.name}
                  </h4>
                  <p className="text-sm mt-2 leading-relaxed text-slate-600 font-medium">
                    {prod.description}
                  </p>

                  <ul className="mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                    {prod.specs?.map((spec, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className={`w-1.5 h-1.5 mt-2 flex-shrink-0 rounded-full ${isPremium ? 'bg-blue-600' : 'bg-slate-400'}`} />
                        <span className="font-medium text-slate-600">
                          {spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 sm:pt-6 border-t border-black/5 space-y-4 mt-auto">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      Price in India
                    </span>
                    <div className="text-right">
                      <span className={`text-2xl sm:text-3xl font-black font-title tracking-tight ${isPremium ? 'text-blue-600' : 'text-slate-900'}`}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold block text-slate-400">
                        ~${(prod.price / 85).toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className={`w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer group/btn border shadow-sm ${
                      isPremium 
                        ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700 shadow-md hover:shadow-lg' 
                        : 'bg-slate-100 text-slate-700 border-black/5 hover:bg-slate-200'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    Apply to Checkout
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1.5 transition-transform" />
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
        className="rounded-[24px] border border-white/60 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center bg-white/60 backdrop-blur-xl shadow-sm"
      >
        {[
          { icon: '🇮🇳', title: 'Shipped Local', desc: 'All 5G Routers dispatched express from New Delhi.' },
          { icon: '🤖', title: '0 VM Headache', desc: 'No server setups required. We fully provision on robust VMs.' },
          { icon: '💳', title: 'UPI / Cards', desc: 'Secure transactions with rapid manual activation.' },
        ].map((item, i) => (
          <div
            key={i}
            className={`space-y-2 py-4 sm:py-0 ${i > 0 ? 'sm:border-l border-t sm:border-t-0 border-black/5' : ''}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="font-black block text-xs uppercase tracking-widest text-slate-900 font-title mt-2">
              {item.title}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {item.desc}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
