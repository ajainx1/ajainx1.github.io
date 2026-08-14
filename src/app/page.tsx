"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  BookOpen, 
  Layers, 
  Zap, 
  HelpCircle, 
  TrendingUp, 
  Globe, 
  Users, 
  Eye, 
  Coffee, 
  Info,
  ChevronDown
} from "lucide-react";
import dynamic from "next/dynamic";

const CharityQuizClient = dynamic(() => import("@/components/charity/CharityQuizClient"), {
  loading: () => (
    <div className="min-h-[500px] flex flex-col items-center justify-center bg-slate-900/60 rounded-[32px] border border-emerald-500/20 p-8 text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
      <p className="text-emerald-400 font-mono text-xs tracking-widest uppercase animate-pulse">
        Initializing Karmic Quiz Engine...
      </p>
    </div>
  )
});

export default function CyberKarmaHome() {
  const [activeTab, setActiveTab] = useState<"quiz" | "ledger" | "transparency">("quiz");
  const [totalAnswered, setTotalAnswered] = useState<number>(12840);
  const [mealsFunded, setMealsFunded] = useState<number>(3420);
  const quizSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cyberkarma_community_counter");
    if (stored) {
      const parsed = JSON.parse(stored);
      setTotalAnswered(parsed.answered || 12840);
      setMealsFunded(parsed.meals || 3420);
    }
  }, []);

  const scrollToQuiz = () => {
    quizSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(
      "🐾 I am feeding stray animals in Patna just by answering educational cybersecurity & trivia quizzes! Join the movement at https://cyberkarma.me"
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-[#e2e8f0] font-sans relative selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Warm Karmic Green Mesh Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] bg-emerald-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-teal-900/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-amber-900/10 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.06),rgba(255,255,255,0))]" />
      </div>

      {/* Top Banner: Transparency & Zero-Donation Guarantee */}
      <div className="w-full bg-emerald-950/80 border-b border-emerald-500/20 py-2 px-4 text-center text-xs font-mono font-bold text-emerald-300 backdrop-blur-md relative z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>100% Free &bull; Zero User Donations Collected</span>
          </span>
          <span className="hidden sm:inline text-emerald-700">&bull;</span>
          <span>Google AdSense ad revenue directly buys milk &amp; food for stray animals in Patna, Bihar</span>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-500/10 bg-[#070b14]/85 backdrop-blur-2xl shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2.5 font-title font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20 text-base">
              🐾
            </span>
            <span className="text-white font-black font-title text-xl tracking-tight">
              Cyber<span className="text-emerald-400">Karma</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            <button onClick={scrollToQuiz} className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400">
              <span>Play Quiz</span>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
            </button>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#ledger" className="hover:text-emerald-400 transition-colors">Impact Ledger</a>
            <a href="#transparency" className="hover:text-emerald-400 transition-colors">Transparency</a>
            <Link href="/impact-reports" className="hover:text-emerald-400 transition-colors">Field Drives</Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={shareOnWhatsApp}
              className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40 text-xs font-mono font-bold transition-all"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            {/* Bridge to Portfolio */}
            <a
              href="https://adityasec32.systems"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-900 border border-emerald-500/30 text-slate-300 hover:text-white hover:border-emerald-500/60 transition-all flex items-center gap-1.5"
            >
              <span>By Aditya Jain</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-24 sm:space-y-32 relative z-10">
        
        {/* HERO SECTION: THE KARMA PROMISE */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/50 backdrop-blur-xl text-xs font-mono font-bold text-emerald-300 shadow-lg shadow-emerald-950/40">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>THE CYBER FREE RICE INITIATIVE &bull; DIGITAL DAANAM</span>
          </div>

          {/* Master Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-title tracking-tight text-white leading-tight">
              Answer a Quiz. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                Feed an Animal. 🐾
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Play free educational quizzes in <strong>Cybersecurity, Science, Nature &amp; Trivia</strong>. Non-intrusive ethical ads directly fund milk, curd, and food drives for street animals in Patna, India.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-4 pt-2">
            <button
              onClick={scrollToQuiz}
              className="px-8 py-4 rounded-2xl text-sm font-mono font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2.5 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>🐾 Start Karmic Quiz</span>
            </button>

            <a
              href="#how-it-works"
              className="px-8 py-4 rounded-2xl text-sm font-mono font-bold bg-slate-900/80 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/30 transition-all flex items-center gap-2"
            >
              <span>How Karma Works</span>
              <ChevronDown className="w-4 h-4 text-emerald-400" />
            </a>

            <button
              onClick={shareOnWhatsApp}
              className="px-6 py-4 rounded-2xl text-sm font-mono font-bold bg-emerald-950/40 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-900/40 transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Invite Friends</span>
            </button>
          </div>

          {/* Live Proof Counters */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { label: "Questions Solved", value: totalAnswered.toLocaleString() + "+", icon: "🧠" },
              { label: "Meals & Milk Funded", value: mealsFunded.toLocaleString() + "+", icon: "🥛" },
              { label: "Patna Drives Done", value: "48+", icon: "📍" },
              { label: "User Cost", value: "₹0.00 (100% Free)", icon: "✨" }
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-emerald-500/10 backdrop-blur-xl flex flex-col items-center justify-center text-center">
                <div className="text-xl mb-1">{stat.icon}</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{stat.value}</div>
                <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

        </section>

        {/* SECTION 2: HOW KARMA WORKS (TRANSPARENCY STRIP) */}
        <section id="how-it-works" className="space-y-8 pt-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Zero-Donation Transparency</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
              How Your Answers Become Real Meals
            </h2>
            <p className="text-sm text-slate-400">
              We never ask for your credit card, bank details, or money. Here is the exact math of karma:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-8 rounded-[24px] bg-slate-900/50 border border-emerald-500/15 flex flex-col justify-between space-y-4 backdrop-blur-xl">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-2xl">
                  1️⃣
                </div>
                <h3 className="text-xl font-bold font-title text-white">You Answer Free Quizzes</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Solve 10 quick trivia questions in Cybersecurity, Animal Care, Nature, or Science. Every correct answer adds karma grains to the community pool.
                </p>
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold">Free Education &bull; 100% Free</div>
            </div>

            <div className="p-8 rounded-[24px] bg-slate-900/50 border border-teal-500/15 flex flex-col justify-between space-y-4 backdrop-blur-xl">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-2xl">
                  2️⃣
                </div>
                <h3 className="text-xl font-bold font-title text-white">Ethical Ads Generate Revenue</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Verified ad partners (Google AdSense) display non-intrusive banners on quiz pages. Advertisers pay for your legitimate views and engagement.
                </p>
              </div>
              <div className="text-xs font-mono text-teal-400 font-bold">Zero User Out-of-Pocket Cost</div>
            </div>

            <div className="p-8 rounded-[24px] bg-slate-900/50 border border-amber-500/15 flex flex-col justify-between space-y-4 backdrop-blur-xl">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-2xl">
                  3️⃣
                </div>
                <h3 className="text-xl font-bold font-title text-white">Real Food Drives in Patna</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  100% of net ad earnings purchase fresh milk, curd, dog biscuits, pedigree, and grains distributed to stray dogs, cows, and birds in Patna, Bihar.
                </p>
              </div>
              <div className="text-xs font-mono text-amber-400 font-bold">Documented in Field Reports</div>
            </div>

          </div>
        </section>

        {/* SECTION 3: THE INTERACTIVE CHARITY QUIZ ENGINE */}
        <section ref={quizSectionRef} id="quiz" className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Live Karma Session &bull; 10 Questions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
                Play the CyberKarma Quiz Now
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href="/quiz" 
                className="text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800"
              >
                <span>Direct /quiz Link</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Embedded Full Quiz Engine */}
          <div className="rounded-[32px] overflow-hidden border border-emerald-500/20 bg-slate-900/40 backdrop-blur-2xl shadow-2xl">
            <CharityQuizClient />
          </div>
        </section>

        {/* SECTION 4: IMPACT LEDGER & PROOF */}
        <section id="ledger" className="space-y-8 pt-6">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Community Impact Ledger</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
              The Patna Animal Feeding Ledger
            </h2>
            <p className="text-sm text-slate-400">
              Real animals, real nutrition, verified local drives. Every bowl is cataloged.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="text-3xl">🐕</div>
              <h3 className="text-lg font-bold text-white">Street Dogs (Canines)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Boiled milk, fresh curd, and nutritious biscuits distributed across Boring Road, Bailey Road, and Gandhi Maidan areas in Patna.
              </p>
              <div className="text-xs font-mono text-emerald-400 font-bold pt-2 border-t border-slate-800">
                Over 2,200+ Dogs Fed
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="text-3xl">🐄</div>
              <h3 className="text-lg font-bold text-white">Stray Cows &amp; Cattle</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Fresh green fodder, chana chuni, and clean water supplied to stray cows navigating busy Patna transit corridors and local gaushalas.
              </p>
              <div className="text-xs font-mono text-amber-400 font-bold pt-2 border-t border-slate-800">
                Over 650+ Cows Supported
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="text-3xl">🕊️</div>
              <h3 className="text-lg font-bold text-white">Urban Birds &amp; Pigeons</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Grains (bajra, wheat, rice) and clay water bowls replenished daily across rooftops and public tree clusters to prevent heat stroke.
              </p>
              <div className="text-xs font-mono text-cyan-400 font-bold pt-2 border-t border-slate-800">
                Daily Grain Feeders Active
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              href="/impact-reports"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400 hover:bg-slate-800 transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Monthly Drive Photos &amp; Field Reports</span>
            </Link>
          </div>
        </section>

        {/* SECTION 5: FOUNDER & MISSION BRIDGE */}
        <section id="transparency" className="p-8 sm:p-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900/70 to-teal-950/40 backdrop-blur-2xl space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" />
                <span>FOUNDER &bull; MISSION &bull; VALUES</span>
              </div>

              <h2 className="text-3xl font-bold font-title text-white">
                Built by Aditya Jain &mdash; Cybersecurity Engineer
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                CyberKarma is a non-profit personal philanthropic initiative engineered by Aditya Jain (Security Administrator at NIC / MeitY). It bridges modern full-stack web engineering (Next.js, Supabase, Framer Motion) with genuine community animal welfare in Patna.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="https://adityasec32.systems"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>Visit Aditya&apos;s Security Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href="/faq"
                  className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                  <span>Read FAQ</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/15 space-y-3 font-mono text-xs text-slate-400">
              <div className="text-emerald-400 font-bold text-sm">Karma Principles:</div>
              <div>🐾 1. Zero personal profit.</div>
              <div>🥛 2. 100% net ad proceeds buy animal nourishment.</div>
              <div>🧠 3. Free educational quizzes for all ages.</div>
              <div>🛡️ 4. Zero tracking or sensitive data collection.</div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 bg-[#05080f] py-12 text-slate-400 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-title font-bold text-white text-base">
              <span>🐾</span>
              <span>CyberKarma.me &mdash; Answer a Quiz, Feed an Animal</span>
            </div>

            <div className="flex flex-wrap gap-6 text-slate-400">
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
              <Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link>
              <Link href="/impact-reports" className="hover:text-emerald-400 transition-colors">Transparency</Link>
              <a href="https://adityasec32.systems" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <span>AdityaSec</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500 text-[11px]">
            <div>&copy; 2026 CyberKarma Initiative. Dedicated to the stray animals of Patna, Bihar.</div>
            <div>Built with ❤️ by Aditya Jain</div>
          </div>

        </div>
      </footer>

    </div>
  );
}
