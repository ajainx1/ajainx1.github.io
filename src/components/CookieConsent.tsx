"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function CookieConsent() {
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    const consent = localStorage.getItem("cyberkarma_cookie_consent");
    if (!consent) {
      setAccepted(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cyberkarma_cookie_consent", "true");
    setAccepted(true);
  };

  if (accepted) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/30 text-white backdrop-blur-xl shadow-2xl space-y-3 font-sans">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold font-title">Privacy & Cookie Notice</h4>
          <p className="text-xs text-slate-300 leading-relaxed font-mono">
            We use essential cookies and ethical ad partners (Google AdSense) to fund real animal feeding drives in Patna. By continuing, you agree to our{' '}
            <Link href="/privacy" className="text-emerald-400 underline hover:text-emerald-300">Privacy Policy</Link>.
          </p>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-1">
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors shadow-sm"
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
