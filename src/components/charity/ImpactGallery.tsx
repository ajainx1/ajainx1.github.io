import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const STREET_FEEDING_DRIVE = [
  {
    src: '/impact/street-dog-14.jpg',
    title: 'Community Dog Feeding',
    location: 'Shiv Raj Yadav Path, Mohanpur Punaichak, Patna',
    date: '26 Jul 2026 • 5:21 PM',
    tag: 'Street Survival'
  },
  {
    src: '/impact/street-dog-15.jpg',
    title: 'Monsoon Evening Feeding',
    location: 'Mohanpur Punaichak, Patna',
    date: '26 Jul 2026 • 5:21 PM',
    tag: 'Monsoon Care Drive'
  },
  {
    src: '/impact/street-dog-16.jpg',
    title: 'Stall Vendor Night Care',
    location: 'Patna Division, Bihar',
    date: '26 Jul 2026 • 5:21 PM',
    tag: 'Evening Care Patrol'
  },
  {
    src: '/impact/street-dog-18.jpg',
    title: 'Pack Feeding Spot',
    location: 'Rajbansi Nagar, Patna',
    date: '26 Jul 2026 • 5:21 PM',
    tag: 'Zero Animal Hunger'
  },
  {
    src: '/impact/street-dog-19.jpg',
    title: 'Daily Stray Hydration',
    location: 'Patna Division, Bihar',
    date: '26 Jul 2026 • 5:21 PM',
    tag: 'Direct Street Feeding'
  },
  {
    src: '/impact/street-dog-20.jpg',
    title: 'Night Stall Feeding Spot',
    location: 'Egg Vendor Hub, Patna, Bihar',
    date: '22 Jul 2026 • 7:18 PM',
    tag: 'Night Feeding Drive'
  }
];

export default function ImpactGallery({ isDark }: { isDark: boolean }) {
  const [previewImage, setPreviewImage] = useState<any>(null);

  return (
    <>
      <div className="w-full mt-8">
        <div className={`p-8 sm:p-10 rounded-[32px] shadow-2xl backdrop-blur-2xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/60'}`}>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="p-2 rounded-xl bg-rose-500/20 text-rose-500 border border-rose-500/30">
                  <Heart size={24} className="fill-rose-500" />
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-title">Real-World Impact Drive</h2>
              </div>
              <p className="text-sm opacity-90 max-w-3xl leading-relaxed font-medium">
                Every single grain of rice makes a difference. These are the actual street animals and communities you are helping feed every time you answer a question. <strong>Your knowledge is their survival.</strong>
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEEDING VERIFIED • PATNA DIVISION</span>
            </div>
          </div>

          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
                <span>🐶 </span> Direct Street Feeding Drive • Rajbansi Nagar, Patna
              </h3>
              <span className="text-xs text-rose-500 font-bold">9 Verified Field Photos</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {STREET_FEEDING_DRIVE.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setPreviewImage(item)}
                  className="relative group rounded-[20px] overflow-hidden shadow-lg border border-white/15 cursor-pointer bg-black/40 h-72 flex flex-col justify-end p-4"
                >
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-colors" />

                  <div className="relative z-10 space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500 text-white shadow-sm inline-block mb-1">
                      {item.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white leading-tight font-title">{item.title}</h4>
                    <p className="text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                      <span>📍</span> {item.location}
                    </p>
                    <span className="text-[9px] text-slate-400 block font-mono">{item.date}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest opacity-70 flex items-center gap-2">
                <span>📸 </span> Global Verified Deliveries
              </h3>
              <span className="text-xs text-emerald-500 font-bold">14,203+ Deliveries</span>
            </div>
            
            <div className="relative w-full overflow-hidden rounded-[20px]">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent z-10" style={{ opacity: isDark ? 0.8 : 0.4 }} />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent z-10" style={{ opacity: isDark ? 0.8 : 0.4 }} />
              
              <div className="flex gap-3 py-2 px-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {Array.from({ length: 18 }).map((_, i) => {
                  const imgIndex = (i % 18) + 1;
                  return (
                    <div key={i} className="w-40 h-56 shrink-0 rounded-[16px] overflow-hidden shadow-sm border border-white/10 group relative bg-black/10 snap-center">
                      <Image 
                        src={`/impact/impact-${imgIndex}.jpeg`} 
                        alt={`Real-World Impact ${imgIndex}`} 
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <Heart size={16} className="text-white fill-white" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/80 rounded-full text-white flex items-center justify-center transition-colors border border-white/20"
              >
                ✕
              </button>
              <div className="relative h-96 w-full bg-black">
                <Image
                  src={previewImage.src}
                  alt={previewImage.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6 bg-slate-950 text-white space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {previewImage.tag}
                  </span>
                  <h3 className="text-xl font-bold font-title">{previewImage.title}</h3>
                </div>
                <p className="text-slate-400 flex items-center gap-2 font-mono text-sm">
                  <span>📍</span> {previewImage.location}
                </p>
                <p className="text-slate-500 font-mono text-xs">{previewImage.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
