import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, TrendingUp, Users, Heart } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impact & Transparency Reports | CyberKarma Charity',
  description: 'See the real-world impact of CyberKarma. Field-verified feeding drive photos, monthly expenditure reports, and Karma Point tallies from our Patna volunteers.',
  alternates: { canonical: 'https://cyberkarma.me/impact-reports/' },
  openGraph: {
    title: 'CyberKarma Impact Reports — Radical Transparency',
    description: 'Every bowl funded, every feeding drive documented. Browse our field-verified monthly impact reports from Patna, Bihar.',
    url: 'https://cyberkarma.me/impact-reports/',
  },
};


export default function ImpactReportsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 font-inter selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black font-title">Transparency & Impact</h1>
          <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
            We believe in radical transparency. Every Karma Point earned, every dollar spent, and every meal delivered is documented here. We operate exclusively with local volunteers for field-verified feeding drives in Patna.
          </p>
        </div>

        {/* Global Impact Counter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex flex-col gap-2">
            <TrendingUp size={24} className="text-emerald-400 mb-2" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-500">Total Karma Points</span>
            <span className="text-4xl font-black text-white font-mono">4,500</span>
          </div>
          <div className="p-6 rounded-[32px] bg-blue-500/10 border border-blue-500/20 flex flex-col gap-2">
            <Heart size={24} className="text-blue-400 mb-2" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-widest text-blue-500">Bowls of Curd & Milk</span>
            <span className="text-4xl font-black text-white font-mono">22</span>
          </div>
          <div className="p-6 rounded-[32px] bg-rose-500/10 border border-rose-500/20 flex flex-col gap-2">
            <Users size={24} className="text-rose-400 mb-2" aria-hidden="true" />
            <span className="text-sm font-bold uppercase tracking-widest text-rose-500">Street Dogs Fed</span>
            <span className="text-4xl font-black text-white font-mono">22+</span>
          </div>
        </div>

        {/* Methodology */}
        <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2"><CheckCircle2 className="text-emerald-400" /> Verification Methodology</h2>
          <p className="text-slate-300 leading-relaxed text-sm">
            All feeding drives are field-verified by our team operating in Patna. 
            Currently, our impact metrics calculate approximately 200 Karma Points = 1 Bowl of Curd & Milk for a street animal. 
            Funds generated from sponsorships and advertising are directly converted into fresh curd and milk for street animals.
          </p>
        </div>

        {/* Monthly Reports */}
        <div className="space-y-6">
          <h2 className="text-3xl font-black font-title">Monthly Reports</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Example Report Card */}
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">July 2026</h3>
                  <p className="text-sm text-emerald-400 font-mono mt-1">Field-verified in Patna</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                  Published
                </span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300 mb-6">
                <li>• <strong className="text-white">Karma Points:</strong> 4,500</li>
                <li>• <strong className="text-white">Meals:</strong> 22 bowls provided (200 pts each)</li>
                <li>• <strong className="text-white">Cost:</strong> ~₹550 (sponsored via ad revenue)</li>
              </ul>
              <div className="h-40 w-full relative rounded-xl overflow-hidden border border-white/10">
                <Image src="/impact/street-dog-14.jpg" alt="Feeding Drive July" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
            
            {/* Pending Report */}
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 opacity-70">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">August 2026</h3>
                  <p className="text-sm text-slate-400 font-mono mt-1">Data Collection in Progress</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-500/20 text-slate-400 text-xs font-bold uppercase tracking-wider border border-slate-500/30">
                  Pending
                </span>
              </div>
              <div className="h-40 w-full bg-black/40 rounded-xl flex items-center justify-center border border-white/5">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Report Drops Sep 1st</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
