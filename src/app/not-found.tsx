import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-slate-900/80 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <span className="text-4xl font-black font-mono">404</span>
        </div>
        <h1 className="text-3xl font-black font-title">Page Not Found</h1>
        <p className="text-sm text-slate-400 leading-relaxed font-mono">
          The karmic path you were looking for doesn't exist or has moved. Return home to keep answering quiz questions and feeding animals!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Home size={16} /> Back to Quiz Home
          </Link>
          <Link
            href="/faq"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
          >
            <HelpCircle size={16} /> FAQ & Support
          </Link>
        </div>
      </div>
    </main>
  );
}
