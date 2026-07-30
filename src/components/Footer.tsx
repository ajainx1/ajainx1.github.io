import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 text-slate-400 py-12 px-6 font-sans relative z-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-title font-black text-xl tracking-tight">
            <span className="p-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-mono font-bold">CK</span>
            <span>CyberKarma</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            Turn your trivia knowledge into real-world impact. Every 200 Karma Points earned funds 1 bowl of fresh curd & milk for street animals in Patna, Bihar.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <Heart size={14} className="fill-emerald-400" />
            <span>100% Free & Ethically Funded</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-200">Platform</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/" className="hover:text-emerald-400 transition-colors">Charity Quiz</Link></li>
            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Mission</Link></li>
            <li><Link href="/impact-reports" className="hover:text-emerald-400 transition-colors">Transparency Reports</Link></li>
            <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ & Contact</Link></li>
          </ul>
        </div>

        {/* Resources & Tech */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-200">Ecosystem</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/free-domains" className="hover:text-emerald-400 transition-colors">Free Developer Domains</Link></li>
            <li><Link href="/portfolio" className="hover:text-emerald-400 transition-colors">SecOps Portfolio</Link></li>
            <li><a href="https://jumpstreet.tech" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">JumpStreet Tech</a></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase tracking-widest text-slate-200">Legal & Policy</h4>
          <ul className="space-y-2 text-xs font-mono">
            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
            <li><a href="mailto:support@cyberkarma.me" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"><Mail size={12} /> support@cyberkarma.me</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} CyberKarma. All rights reserved. Field-verified in Patna, Bihar, India.</span>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
          <Link href="/faq" className="hover:underline">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
