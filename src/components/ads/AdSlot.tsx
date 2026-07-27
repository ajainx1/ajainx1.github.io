"use client";
import React, { useEffect, useRef } from 'react';
import { Sparkles, Megaphone } from 'lucide-react';

interface AdSlotProps {
  adClient?: string;
  adSlot?: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle';
  isDark?: boolean;
  className?: string;
  type?: 'banner' | 'square' | 'responsive';
}

export default function AdSlot({ 
  adClient, 
  adSlot, 
  adFormat = 'auto', 
  isDark = true,
  className = '',
  type = 'responsive'
}: AdSlotProps) {
  const adRef = useRef<HTMLModElement>(null);
  
  // Placeholder mode is triggered if there is no client ID provided.
  const isPlaceholder = !adClient || !adSlot;

  useEffect(() => {
    if (!isPlaceholder && typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense Error: ", e);
      }
    }
  }, [isPlaceholder]);

  // Determine placeholder height based on ad type
  const heightClass = 
    type === 'banner' ? 'h-24 sm:h-32' :
    type === 'square' ? 'aspect-square max-h-[300px]' :
    'min-h-[120px]';

  if (isPlaceholder) {
    return (
      <div className={`relative w-full ${heightClass} flex flex-col items-center justify-center rounded-[24px] overflow-hidden border border-dashed transition-all duration-300 ${isDark ? 'border-white/20 bg-white/5' : 'border-slate-300 bg-slate-100'} ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10 opacity-50" />
        
        <div className={`relative z-10 flex flex-col items-center gap-2 text-center p-4 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
          <div className={`p-2 rounded-xl ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
            <Megaphone size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest font-mono">Premium Ad Placement</span>
          <span className="text-[10px] opacity-70">
            {type === 'banner' ? '728x90 Leaderboard' : type === 'square' ? '250x250 Medium Rectangle' : 'Responsive Ad Unit'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}
