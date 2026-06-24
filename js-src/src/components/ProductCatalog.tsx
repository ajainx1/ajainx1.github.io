import React from 'react';
import { Zap, ShoppingCart, ArrowRight, Radio } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  isDark: boolean;
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
    image: 'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=600',
    specs: [
      'All Premium VM Bundle benefits (Save ₹1000+!)',
      'Physical 5G SIM Hotspot shipped express',
      'Free VIP priority shipping within India',
      'Jumpstreet 1-on-1 private optimisation session',
      'Lifetime software upgrades & developer hotline',
    ],
  },
];

export default function ProductCatalog({ onSelectProduct, isDark }: ProductCatalogProps) {
  const textPrimary = isDark ? '#fff' : '#111';
  const textSecondary = isDark ? '#9ca3af' : '#666';
  const textMuted = isDark ? '#4b5563' : '#aaa';
  const cardBg = isDark ? '#111111' : '#ffffff';
  const deepBg = isDark ? '#000' : '#f5f5f7';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)';
  const borderColorStrong = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {PRODUCTS.map((prod) => {
          const isPremium = prod.id === 'bot_premium' || prod.id === 'pro_trader_bundle';
          const isHardware = prod.type === 'hotspot';

          return (
            <div
              key={prod.id}
              className="rounded-sm border flex flex-col justify-between overflow-hidden relative group shadow-xl product-card-glow transition-all duration-300"
              style={{
                background: cardBg,
                borderColor: isPremium ? borderColorStrong : borderColor,
              }}
            >
              {/* Badge */}
              {prod.badge && (
                <div
                  className="absolute top-3 right-3 px-2.5 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-widest z-10"
                  style={{
                    background: isPremium ? (isDark ? '#fff' : '#111') : (isDark ? '#1a1a1a' : '#f0f0f3'),
                    color: isPremium ? (isDark ? '#000' : '#fff') : (isDark ? '#9ca3af' : '#666'),
                    border: `1px solid ${isPremium ? 'transparent' : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)')}`,
                  }}
                >
                  {isPremium && <span className="mr-1">⭐</span>}
                  {prod.badge}
                </div>
              )}

              {/* Image */}
              <div className="h-36 sm:h-44 relative overflow-hidden flex-shrink-0 border-b"
                   style={{ borderColor }}>
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  style={{ filter: 'brightness(0.68)' }}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0"
                     style={{ background: `linear-gradient(to top, ${cardBg}, transparent)` }} />
                <div className="absolute bottom-2.5 left-3.5 flex items-center gap-1.5">
                  {isHardware
                    ? <Radio size={13} className="text-blue-400" />
                    : <Zap size={13} className="text-white" />}
                  <span className="text-[9px] font-mono uppercase tracking-widest"
                        style={{ color: isDark ? '#9ca3af' : '#ccc' }}>
                    {isHardware ? 'Hardware Redundancy' : 'Algorithmic Software'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-bold tracking-wide uppercase group-hover:text-blue-400 transition-colors"
                      style={{ color: textPrimary }}>
                    {prod.name}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: textSecondary }}>
                    {prod.description}
                  </p>

                  <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    {prod.specs?.map((spec, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span
                          className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 rounded-full"
                          style={{ background: isPremium ? (isDark ? '#fff' : '#333') : '#3b82f6' }}
                        />
                        <span className="font-mono" style={{ color: isDark ? '#d1d5db' : '#555' }}>
                          {spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 sm:pt-4 border-t space-y-3"
                     style={{ borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)' }}>
                  <div className="flex justify-between items-baseline font-mono">
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: textMuted }}>
                      Price in India
                    </span>
                    <div className="text-right">
                      <span
                        className="text-xl sm:text-2xl font-black"
                        style={{
                          color: isPremium ? '#60a5fa' : textPrimary,
                        }}
                      >
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[9px] block" style={{ color: textMuted }}>
                        ~${(prod.price / 85).toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectProduct(prod)}
                    className="w-full py-2.5 rounded-sm text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer group/btn"
                    style={{
                      background: isPremium ? (isDark ? '#fff' : '#111') : (isDark ? '#1a1a1a' : '#f0f0f3'),
                      color: isPremium ? (isDark ? '#000' : '#fff') : (isDark ? '#d1d5db' : '#444'),
                      border: `1px solid ${isPremium ? 'transparent' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                    }}
                  >
                    <ShoppingCart size={13} />
                    Apply to Checkout
                    <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Bar */}
      <div
        className="rounded-sm border p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center font-mono uppercase tracking-wider text-[11px]"
        style={{
          background: isDark ? '#111111' : '#ffffff',
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        }}
      >
        {[
          { icon: '🇮🇳', title: 'Shipped Local', desc: 'All 5G Routers dispatched express from New Delhi.' },
          { icon: '🤖', title: '0 VM Headache', desc: 'No server setups required. We fully provision on robust VMs.' },
          { icon: '💳', title: 'UPI / Cards', desc: 'Secure transactions with rapid manual activation.' },
        ].map((item, i) => (
          <div
            key={i}
            className="space-y-1 py-3 sm:py-0"
            style={{
              borderTop: i > 0 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none',
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-bold block text-xs" style={{ color: isDark ? '#fff' : '#111' }}>
              {item.title}
            </span>
            <span className="text-[9px] font-mono normal-case" style={{ color: isDark ? '#6b7280' : '#999' }}>
              {item.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
