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
    name: 'Orca6™ — Trial License',
    description: 'We will provide a pre-configured demo account for you to test and verify the Orca6™ execution logic firsthand.',
    price: 600,
    currency: 'INR',
    badge: 'Popular Trial',
    type: 'bot',
    image: '/js/bot_standard.png',
    specs: [
      'Telegram, WhatsApp & Signal Webhook Alerts',
      'Minimum capital required: 500 USD',
      'We provide the demo account credentials',
      'Lightning-fast trade execution to maximize profit margins',
      '24/7 autonomous client-side running capability',
    ],
  },
  {
    id: 'bot_premium',
    name: 'Orca6™ — Premium VM Bundle',
    description: 'Full hands-off automated trading system running on Orca6™ logic, hosted on a dedicated low-latency server.',
    price: 1499,
    currency: 'INR',
    badge: 'VIP Elite',
    type: 'bundle',
    image: '/js/bot_premium.png',
    specs: [
      'Includes 1 Month Orca6™ License',
      'Minimum capital required: 500 USD',
      'Account credentials required for deployment',
      'Pre-installed on Windows Cloud VM (2GB ECC RAM, 1 vCPU)',
      'Jumpstreet Anti-crash execution watchdogs included',
      'VIP onboarding — 100% setup handled by our team',
    ],
  }
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
                      Pricing
                    </span>
                    <div className="text-right">
                      <span className={`text-2xl sm:text-3xl font-black font-title tracking-tight ${isPremium ? 'text-emerald-600' : 'text-slate-900'}`}>
                        ₹{prod.price.toLocaleString('en-IN')} INR
                      </span>
                      <span className="text-[10px] font-bold block text-slate-500 mt-1">
                        International: ${(prod.price / 85).toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className={`w-full py-3.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer group/btn border shadow-sm ${
                      isPremium 
                        ? 'bg-emerald-500 text-white border-transparent hover:bg-emerald-600 shadow-md hover:shadow-lg' 
                        : 'bg-slate-100 text-slate-700 border-black/5 hover:bg-slate-200'
                    }`}
                  >
                    <ShoppingCart size={16} />
                    Activate License
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
          { icon: '🛡️', title: '100% Uptime Guarantee', desc: 'Enterprise SLAs with Zero Setup Fees.' },
          { icon: '🔄', title: 'Cancel Anytime', desc: '7-day money-back guarantee on all licenses.' },
          { icon: '💳', title: 'Global Payments', desc: 'UPI, GPay, Visa, Mastercard accepted.' },
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
