"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, TrendingUp, Users, Heart, X, MapPin, Calendar, Maximize2 } from 'lucide-react';
import Image from 'next/image';

interface LightboxPhoto {
  src: string;
  title: string;
  location: string;
  date: string;
  meals: string;
}

export default function ClientImpactReports() {
  const [activePhoto, setActivePhoto] = useState<LightboxPhoto | null>(null);

  const julyPhoto: LightboxPhoto = {
    src: "/impact/street-dog-14.jpg",
    title: "July 2026 Feeding Drive",
    location: "Rajbansi Nagar & Punaichak, Patna",
    date: "July 24, 2026",
    meals: "22 Bowls of Milk & Curd"
  };

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
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">July 2026</h3>
                    <p className="text-sm text-emerald-400 font-mono mt-1 flex items-center gap-1">
                      <MapPin size={13} /> Field-verified in Patna
                    </p>
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
              </div>

              {/* Photo Thumbnail with Lightbox Trigger */}
              <button
                onClick={() => setActivePhoto(julyPhoto)}
                className="h-44 w-full relative rounded-xl overflow-hidden border border-white/10 group/btn focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                aria-label="Expand feeding drive photo"
              >
                <Image src={julyPhoto.src} alt={julyPhoto.title} fill className="object-cover group-hover/btn:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 group-hover/btn:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 opacity-90 group-hover/btn:opacity-100 transition-opacity border border-white/20">
                    <Maximize2 size={13} /> Tap to Expand Photo
                  </span>
                </div>
              </button>
            </div>
            
            {/* August 2026 Published Report */}
            <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 group hover:border-emerald-500/50 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">August 2026 Field Drive</h3>
                    <p className="text-sm text-emerald-400 font-mono mt-1 flex items-center gap-1">
                      <MapPin size={13} /> Rajbansi Nagar & Patna Division, Bihar
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
                    Published
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300 mb-6">
                  <li>• <strong className="text-white">Karma Points:</strong> 18,400 Points</li>
                  <li>• <strong className="text-white">Meals Provided:</strong> 92 Bowls of Fresh Milk & Curd</li>
                  <li>• <strong className="text-white">Field Operations:</strong> 22 Field-Verified Feeding Drives (July 28 - August 5)</li>
                </ul>
              </div>

              {/* Photo Thumbnails Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {[
                  { src: '/impact/impact-103.jpg', title: 'Morning Curd & Milk Patrol', location: 'Patna Division, Bihar', date: '05 Aug 2026 • 9:15 AM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-102.jpg', title: 'Morning Stray Dog Feeding', location: 'Rajbansi Nagar, Patna', date: '04 Aug 2026 • 8:40 AM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-101.jpg', title: 'Evening Street Feeding', location: 'Punaichak Hub, Patna', date: '04 Aug 2026 • 6:57 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-100.jpg', title: 'Community Dog Curd Drive', location: 'Market Stall Hub, Patna', date: '03 Aug 2026 • 5:47 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-99.jpg', title: 'Morning Hydration & Milk Bowl', location: 'Patna Streets, Bihar', date: '03 Aug 2026 • 10:12 AM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-98.jpg', title: 'Stray Rescue Morning Care', location: 'Rajbansi Nagar, Patna', date: '02 Aug 2026 • 8:45 AM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-97.jpg', title: 'Evening Curd & Milk Bowl', location: 'Patna Division, Bihar', date: '02 Aug 2026 • 7:03 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-96.jpg', title: 'Night Market Stall Feeding', location: 'Local Vendor Hub, Patna', date: '01 Aug 2026 • 6:32 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-95.jpg', title: 'Evening Stray Nourishment', location: 'Rajbansi Nagar, Patna', date: '01 Aug 2026 • 5:42 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-94.jpg', title: 'Night Patrol Feeding Spot', location: 'Punaichak, Patna', date: '31 Jul 2026 • 8:01 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-93.jpg', title: 'Evening Community Care', location: 'Rajbansi Nagar Road, Patna', date: '31 Jul 2026 • 6:42 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-92.jpg', title: 'Monsoon Curd & Milk Drive', location: 'Patna Division, Bihar', date: '31 Jul 2026 • 6:10 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-91.jpg', title: 'Morning Stray Hydration', location: 'Patna Streets, Bihar', date: '30 Jul 2026 • 8:48 AM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-90.jpg', title: 'Night Vendor Feed Hub', location: 'Market Stall, Patna', date: '29 Jul 2026 • 7:32 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-89.jpg', title: 'Evening Curd Bowl Drive', location: 'Rajbansi Nagar, Patna', date: '29 Jul 2026 • 5:08 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-88.jpg', title: 'Night Stray Patrol', location: 'Patna Division, Bihar', date: '28 Jul 2026 • 7:11 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-87.jpg', title: 'Evening Dog Feed Spot', location: 'Rajbansi Nagar, Patna', date: '28 Jul 2026 • 5:10 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-82.jpg', title: 'Fresh Milk & Curd Feeding', location: 'Rajbansi Nagar, Patna', date: '29 Jul 2026 • 5:07 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-83.jpg', title: 'Street Dog Curd Bowl', location: 'Local Market Stall, Patna', date: '29 Jul 2026 • 5:07 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-84.jpg', title: 'Volunteer Evening Patrol', location: 'Rajbansi Nagar Road, Patna', date: '29 Jul 2026 • 5:07 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-85.jpg', title: 'Stray Dog Rescue Feeding', location: 'Patna Division, Bihar', date: '29 Jul 2026 • 5:07 PM', meals: 'Milk & Curd Bowl' },
                  { src: '/impact/impact-86.jpg', title: 'Night Stall Feeding Patrol', location: 'Market Stall Hub, Patna', date: '29 Jul 2026 • 5:07 PM', meals: 'Milk & Curd Bowl' }
                ].map((photo, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(photo)}
                    className="h-16 w-full relative rounded-lg overflow-hidden border border-white/10 group/btn focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image src={photo.src} alt={photo.title} fill className="object-cover group-hover/btn:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/30 group-hover/btn:bg-black/10 transition-colors flex items-center justify-center">
                      <Maximize2 size={10} className="text-white opacity-80 group-hover/btn:opacity-100" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setActivePhoto(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-slate-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-white/10 bg-slate-900/80">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">{activePhoto.title}</h3>
                <p className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-1">
                  <MapPin size={13} /> {activePhoto.location} • <Calendar size={13} /> {activePhoto.date}
                </p>
              </div>
              <button 
                onClick={() => setActivePhoto(null)}
                aria-label="Close photo preview"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative h-[55vh] sm:h-[65vh] w-full bg-black">
              <Image src={activePhoto.src} alt={activePhoto.title} fill className="object-contain" />
            </div>

            <div className="p-4 sm:p-6 bg-slate-950 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <span className="text-xs sm:text-sm text-slate-300 font-mono flex items-center gap-2">
                <Heart size={16} className="text-rose-400 fill-rose-400" /> Impact Delivered: <strong>{activePhoto.meals}</strong>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Field Verified by Local Patna Volunteers ✓
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
