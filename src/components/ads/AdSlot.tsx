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
      <div className={`relative w-full ${heightClass} flex flex-col items-center justify-center rounded-[24px] overflow-hidden border shadow-sm transition-all duration-300 ${isDark ? 'border-indigo-500/30 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 hover:from-indigo-900/60 hover:to-purple-900/60' : 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100'} ${className}`}>
        
        <div className={`absolute top-3 right-4 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${isDark ? 'bg-black/40 text-white/50' : 'bg-white/60 text-slate-400'}`}>
          Sponsored
        </div>

        <div className={`relative z-10 flex flex-col items-center gap-3 text-center p-6 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg`}>
              <Megaphone size={16} />
            </div>
            <span className="font-bold text-sm tracking-wide">TechForGood</span>
          </div>
          
          <div>
            <h4 className="font-black text-lg mb-1 leading-tight">Elevate Your Engineering</h4>
            <p className={`text-xs max-w-[200px] leading-relaxed ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Join the fastest-growing community of developers building the future.
            </p>
          </div>
          
          <button className={`mt-1 px-5 py-2 rounded-full text-xs font-bold transition-transform hover:scale-105 shadow-md ${isDark ? 'bg-white text-indigo-900' : 'bg-indigo-600 text-white'}`}>
            Learn More
          </button>
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
