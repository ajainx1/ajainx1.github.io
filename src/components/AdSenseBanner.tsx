'use client';

import React, { useEffect, useRef } from 'react';

interface AdSenseBannerProps {
  className?: string;
  isDark?: boolean;
  adSlot?: string;
  adFormat?: string;
}

export default function AdSenseBanner({ 
  className = "", 
  isDark = true,
  adSlot = "1234567890",
  adFormat = "auto"
}: AdSenseBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    // Only push once per component instance to strictly adhere to AdSense policies against rapid auto-refreshing
    if (pushedRef.current) return;

    try {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        pushedRef.current = true;
      }
    } catch (err) {
      console.debug("AdSense load notice:", err);
    }
  }, []);

  return (
    <div className={`w-full my-6 font-sans ${className}`}>
      {/* Container adhering to Google AdSense Placement Policies */}
      <div className={`relative rounded-2xl border p-4 overflow-hidden backdrop-blur-xl shadow-md transition-all ${
        isDark ? 'bg-slate-900/60 border-white/10 text-white' : 'bg-white/80 border-slate-200 text-slate-900'
      }`}>
        
        {/* Strictly Compliant Ad Label (Google Policy requires "ADVERTISEMENT" or "SPONSORED LINKS") */}
        <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-white/10">
          <span>ADVERTISEMENT</span>
          <span className="text-[9px] text-slate-500 font-mono">CyberKarma Ethical Ad Network</span>
        </div>

        {/* AdSense Unit */}
        <div className="w-full flex justify-center items-center min-h-[90px] overflow-hidden rounded-xl bg-black/20">
          <ins
            ref={adRef}
            className="adsbygoogle w-full"
            style={{ display: 'block', textAlign: 'center' }}
            data-ad-client="ca-pub-6072468142870937"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive="true"
          />
        </div>

        {/* Compliant Footer Disclaimer */}
        <div className="mt-2 text-center text-[9px] font-mono text-slate-400">
          100% of ad revenue directly funds street animal feeding drives in Patna, Bihar.
        </div>

      </div>
    </div>
  );
}
