import React from 'react';
import Link from 'next/link';
import { ExternalLink, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JumpStreet Tech Portal | CyberKarma Partner',
  description: 'Learn about JumpStreet Tech — automated algorithmic trading systems, execution infrastructure, and Web3 gateway tools partner of CyberKarma.',
  alternates: { canonical: 'https://cyberkarma.me/js/' },
};

export default function JumpstreetPortal() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 font-sans selection:bg-emerald-500/30 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-slate-900/80 border border-white/10 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-2xl text-center space-y-6">
        
        <div className="flex justify-start">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-mono">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>

        <div className="space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2">
            <Zap size={28} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-title">JumpStreet Tech Partner Portal</h1>
          <p className="text-slate-300 text-sm leading-relaxed max-w-md mx-auto">
            JumpStreet Tech is a premier technology partner sponsoring CyberKarma's street animal feeding drives. They develop automated algorithmic trading infrastructure and Web3 gateway tools.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs text-slate-300 font-mono">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck size={16} /> Verified Partner Status
          </div>
          <p>Official sponsor funding 50+ bowls of fresh milk and curd monthly for stray dogs in Patna, Bihar.</p>
        </div>

        <div className="pt-2">
          <a
            href="https://jumpstreet.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg hover:scale-105"
          >
            <span>Proceed to JumpStreet.tech</span>
            <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </main>
  );
}
