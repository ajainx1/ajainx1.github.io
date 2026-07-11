"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, Lightbulb, User, LogOut, ArrowLeft, Sun, Moon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { quizData, CategoryKey, Difficulty, Question } from './quizData';
import { useToast } from '../js/ToastContext';
import Link from 'next/link';

// Use same env variables as the HTML script, or fallback to the hardcoded ones if not in env
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xkhgccximcrsdpdlskys.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhraGdjY3hpbWNyc2RwZGxza3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NjQ0OTksImV4cCI6MjA5OTI0MDQ5OX0.R9t0QNG0voJPyxhZkXO2hQtD4_Gr2xdnGyI8AlTOk5g';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const recipientIcons: Record<string, { base: string; float: string; label: string }> = {
  human: { base: '🤲🥣', float: '💚', label: 'Humans' },
  birds: { base: '🕊️🌾', float: '✨', label: 'Birds' },
  cows: { base: '🐄🌿', float: '🌾', label: 'Cows' },
  dogs: { base: '🐕🦴', float: '🦴', label: 'Dogs' },
  moon: { base: '🍚🥛', float: '🤍', label: 'Moon (2)' },
  jupiter: { base: '📚💻', float: '💛', label: 'Jupiter (3)' },
  rahu: { base: '💊🧣', float: '⚕️', label: 'Rahu (4)' },
  venus: { base: '👗🌸', float: '💖', label: 'Venus (6)' },
  saturn: { base: '🦯🤝', float: '🖤', label: 'Saturn (8)' },
};

export default function CharityQuizClient() {
  // State
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [category, setCategory] = useState<CategoryKey>('network');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [recipient, setRecipient] = useState('human');
  const [showAstro, setShowAstro] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Feedback & Interactions
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [riceGrains, setRiceGrains] = useState<{ id: number; left: string; delay: string; icon: string }[]>([]);
  
  // Auth
  const [user, setUser] = useState<{ email: string; name: string; avatar: string } | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSendingMagicLink, setIsSendingMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  // Theme
  const [isDark, setIsDark] = useState(true);

  const { addToast } = useToast();

  // Initialize
  useEffect(() => {
    const isDarkMode = localStorage.getItem('jumpstreet_theme') !== 'light';
    setIsDark(isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
    
    // Auth Check
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        handleUserLogin(session.user.email);
      } else {
        const localScore = parseInt(localStorage.getItem('charityRiceScore') || '0', 10);
        setScore(localScore);
      }
    };
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email) {
        handleUserLogin(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => authListener.subscription.unsubscribe();
  }, []);

  const handleUserLogin = (email: string) => {
    const name = email.split('@')[0];
    const avatar = `https://ui-avatars.com/api/?name=${email}&background=10b981&color=fff`;
    setUser({ email, name, avatar });
    const userScore = parseInt(localStorage.getItem(`charityRiceScore_${email}`) || '0', 10);
    setScore(userScore);
  };

  const saveScore = (newScore: number) => {
    setScore(newScore);
    localStorage.setItem('charityRiceScore', String(newScore));
    if (user) {
      localStorage.setItem(`charityRiceScore_${user.email}`, String(newScore));
    }
  };

  // Question Logic
  const loadNextQuestion = useCallback(() => {
    const allQ = quizData[category].questions;
    const filteredQ = allQ.filter(q => q.difficulty === difficulty);
    if (filteredQ.length === 0) {
      setCurrentQuestion(null);
      return;
    }
    const rand = Math.floor(Math.random() * filteredQ.length);
    setCurrentQuestion(filteredQ[rand]);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);
  }, [category, difficulty]);

  useEffect(() => {
    loadNextQuestion();
    setStreak(0);
  }, [category, difficulty, loadNextQuestion]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('jumpstreet_theme', newDark ? 'dark' : 'light');
    document.body.classList.toggle('light-mode', !newDark);
  };

  const handleAnswer = (index: number) => {
    if (isAnswered || !currentQuestion) return;
    setIsAnswered(true);
    setSelectedAnswer(index);

    if (index === currentQuestion.answer) {
      // Correct
      saveScore(score + 10);
      setStreak(s => s + 1);
      setFeedback({ text: 'Correct! +10 grains of rice donated.', type: 'success' });
      triggerRiceAnimation();
      
      if ('vibrate' in navigator) navigator.vibrate(50);
    } else {
      // Incorrect
      setStreak(0);
      setFeedback({ text: 'Incorrect. Try the next one!', type: 'error' });
      if ('vibrate' in navigator) navigator.vibrate([50, 100, 50]);
    }

    setTimeout(() => {
      loadNextQuestion();
    }, 2500);
  };

  const triggerRiceAnimation = () => {
    const grains = Array.from({ length: 6 }).map((_, i) => ({
      id: Date.now() + i,
      left: `calc(50% + ${(Math.random() - 0.5) * 80}px)`,
      delay: `${Math.random() * 0.2}s`,
      icon: recipientIcons[recipient].float === '✨' ? '🌾' : '🍚'
    }));
    setRiceGrains(grains);
    setTimeout(() => setRiceGrains([]), 1500);
  };

  const handleUseHint = () => {
    if (score >= 5 && currentQuestion?.hint && !showHint) {
      saveScore(score - 5);
      setShowHint(true);
      setFeedback({ text: 'Hint revealed! -5 grains.', type: 'info' });
    } else if (score < 5) {
      setFeedback({ text: 'Not enough grains! You need 5 to use a hint.', type: 'error' });
    }
  };

  const sendMagicLink = async () => {
    if (!emailInput || !emailInput.includes('@')) {
      addToast('Please enter a valid email', 'error');
      return;
    }
    setIsSendingMagicLink(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: { emailRedirectTo: window.location.href }
    });
    if (error) {
      addToast(`Error: ${error.message}`, 'error');
    } else {
      setMagicLinkSent(true);
    }
    setIsSendingMagicLink(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    addToast('Logged out successfully', 'info');
  };

  const handleShare = () => {
    const text = `I just generated ${score} grains of rice by playing Cyber FreeRice! Join me in learning and feeding the hungry:`;
    if (navigator.share) {
      navigator.share({ title: 'Cyber FreeRice', text, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      addToast('Copied to clipboard!', 'success');
    }
  };

  const milestone = score % 500;
  const progressPct = Math.min((milestone / 500) * 100, 100);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-[#0a0f0d] text-emerald-50' : 'bg-emerald-50 text-emerald-950'}`}>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full mix-blend-screen opacity-30 ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-400/40'}`} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 blur-[100px] rounded-full mix-blend-screen opacity-30 ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-400/40'}`} />
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] ${isDark ? 'invert-0' : 'invert'}`} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b px-4 sm:px-6 py-3 backdrop-blur-xl flex items-center justify-between ${isDark ? 'bg-[#0a0f0d]/80 border-emerald-900/50' : 'bg-emerald-50/80 border-emerald-200'}`}>
        <Link href="/" className="flex items-center gap-2 text-sm font-mono font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
          <ArrowLeft size={16} /> Return
        </Link>
        
        <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tight">
          <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-xs">C</div>
          <span className={isDark ? 'text-emerald-50' : 'text-emerald-950'}>Cyber<span className="text-emerald-500">FreeRice</span></span>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50' : 'bg-emerald-200 text-emerald-700 hover:bg-emerald-300'}`}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className={`flex items-center gap-3 px-3 py-1.5 rounded-full border ${isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-100 border-emerald-300'}`}>
              <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full border border-emerald-500" />
              <span className="text-xs font-semibold hidden sm:block">{user.name}</span>
              <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400"><LogOut size={14} /></button>
            </div>
          ) : (
            <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-white hover:bg-emerald-400 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
              <User size={14} /> Login
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 relative z-10 flex flex-col items-center">
        
        {/* Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`w-full p-6 sm:p-8 rounded-2xl border text-center mb-8 overflow-hidden relative ${isDark ? 'bg-emerald-900/10 border-emerald-800/50' : 'bg-emerald-100/50 border-emerald-200'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full" />
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight mb-2">Play. Learn. Feed.</h1>
          <p className={`text-sm max-w-xl mx-auto ${isDark ? 'text-emerald-200/70' : 'text-emerald-700/80'}`}>
            Welcome to Cyber FreeRice — where your cybersecurity knowledge feeds the hungry. For every correct answer, we donate <strong className="text-emerald-500">10 grains of rice</strong> to charities!
          </p>
        </motion.div>

        {/* Categories & Difficulty */}
        <div className="w-full flex flex-col sm:flex-row justify-center gap-4 mb-8">
          <div className={`flex flex-wrap justify-center gap-2 p-1.5 rounded-xl border ${isDark ? 'bg-[#0a0f0d] border-emerald-900/50' : 'bg-white border-emerald-200 shadow-sm'}`}>
            {(Object.keys(quizData) as CategoryKey[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold capitalize transition-all ${category === cat ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]' : isDark ? 'text-emerald-400 hover:bg-emerald-900/30' : 'text-emerald-600 hover:bg-emerald-50'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className={`flex flex-wrap justify-center gap-2 p-1.5 rounded-xl border ${isDark ? 'bg-[#0a0f0d] border-emerald-900/50' : 'bg-white border-emerald-200 shadow-sm'}`}>
            {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all ${difficulty === diff ? (isDark ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700' : 'bg-emerald-100 text-emerald-700 border border-emerald-300') : (isDark ? 'text-emerald-500/50 hover:text-emerald-400' : 'text-emerald-600/60 hover:text-emerald-600')}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Recipients */}
        <div className="text-center mb-8">
          <p className={`text-xs font-mono uppercase tracking-widest mb-3 ${isDark ? 'text-emerald-500/60' : 'text-emerald-600/70'}`}>Choose Your Karmic Path</p>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(recipientIcons).slice(0, 4).map(([key, info]) => (
              <button
                key={key}
                onClick={() => setRecipient(key)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${recipient === key ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : (isDark ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800' : 'bg-white text-emerald-700 border border-emerald-200')}`}
              >
                {info.float} {info.label}
              </button>
            ))}
            <button onClick={() => setShowAstro(!showAstro)} className={`px-4 py-2 rounded-full text-xs font-bold border border-dashed transition-all ${isDark ? 'border-emerald-700 text-emerald-500 hover:bg-emerald-900/20' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'}`}>
              🌌 Astro Science
            </button>
          </div>
          
          <AnimatePresence>
            {showAstro && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap justify-center gap-2 mt-3 overflow-hidden">
                 {Object.entries(recipientIcons).slice(4).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setRecipient(key)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all ${recipient === key ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : (isDark ? 'bg-indigo-900/20 text-indigo-400 border border-indigo-800' : 'bg-white text-indigo-700 border border-indigo-200')}`}
                  >
                    {info.float} {info.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Score Board */}
        <motion.div layout className={`w-full max-w-sm rounded-3xl border p-8 text-center relative overflow-hidden mb-8 shadow-2xl ${isDark ? 'bg-gradient-to-b from-emerald-900/20 to-[#0a0f0d] border-emerald-800/50 shadow-emerald-900/20' : 'bg-white border-emerald-200 shadow-emerald-200/50'}`}>
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none" />
          <h2 className={`text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-4 ${isDark ? 'text-emerald-500/70' : 'text-emerald-600/70'}`}>Impact Generated</h2>
          
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-4xl drop-shadow-lg">🌟</span>
            <motion.span 
              key={score}
              initial={{ scale: 1.2, color: '#10b981' }}
              animate={{ scale: 1, color: isDark ? '#34d399' : '#059669' }}
              className="text-6xl font-black font-mono tracking-tighter text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {score.toLocaleString()}
            </motion.span>
          </div>

          <div className="relative h-20 flex flex-col items-center justify-center">
            <AnimatePresence>
              {riceGrains.map(grain => (
                <motion.span
                  key={grain.id}
                  initial={{ opacity: 0, y: -40, scale: 0.5, rotate: 0 }}
                  animate={{ opacity: 1, y: 20, scale: 1, rotate: 90 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeIn" }}
                  className="absolute text-2xl z-10"
                  style={{ left: grain.left, animationDelay: grain.delay }}
                >
                  {grain.icon}
                </motion.span>
              ))}
            </AnimatePresence>
            <motion.div animate={riceGrains.length ? { y: [0, 5, 0], scale: [1, 1.1, 1] } : {}} className="text-5xl relative z-20 mt-4">
              {recipientIcons[recipient].base}
              <motion.span animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-4 -right-4 text-xl">
                {recipientIcons[recipient].float}
              </motion.span>
            </motion.div>
          </div>

          <div className={`w-full h-2 rounded-full overflow-hidden mt-6 border ${isDark ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-100 border-emerald-200'}`}>
            <motion.div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
          </div>
          <span className={`text-[9px] font-mono mt-2 block ${isDark ? 'text-emerald-500/50' : 'text-emerald-600/70'}`}>{milestone} / 500 grains for a full bowl</span>

          <div className="mt-6 flex flex-col gap-3 items-center">
            <AnimatePresence>
              {streak >= 3 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="text-xs font-bold text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
                  🔥 {streak} Correct in a Row!
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={handleShare} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border ${isDark ? 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/30' : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}>
              <Share2 size={12} /> Share Impact
            </button>
          </div>
        </motion.div>

        {/* Quiz Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {currentQuestion ? (
              <motion.div
                key={currentQuestion.question}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`w-full rounded-2xl border p-6 sm:p-8 shadow-xl relative ${isDark ? 'bg-[#0d1310]/80 border-emerald-800/40' : 'bg-white/80 border-emerald-200 backdrop-blur-sm'}`}
              >
                {/* Decorative top border line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50 rounded-t-2xl" />
                
                {currentQuestion.scenario && (
                  <div className={`p-4 rounded-xl border mb-6 text-sm font-mono leading-relaxed ${isDark ? 'bg-emerald-900/20 border-emerald-800/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>
                    {currentQuestion.scenario}
                  </div>
                )}
                
                <h3 className={`text-lg sm:text-xl font-bold mb-8 leading-snug ${isDark ? 'text-emerald-50' : 'text-emerald-950'}`}>
                  {currentQuestion.question}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentQuestion.options.map((opt, i) => {
                    let btnClass = `p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-center text-center `;
                    if (isAnswered) {
                      if (i === currentQuestion.answer) {
                        btnClass += `bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] z-10 `;
                      } else if (i === selectedAnswer) {
                        btnClass += `bg-rose-500/10 border-rose-500/50 text-rose-500 `;
                      } else {
                        btnClass += isDark ? `bg-[#0a0f0d] border-emerald-900/30 text-emerald-500/40 ` : `bg-gray-50 border-gray-200 text-gray-400 `;
                      }
                    } else {
                      btnClass += isDark 
                        ? `bg-emerald-900/10 border-emerald-800/50 text-emerald-200 hover:bg-emerald-900/30 hover:border-emerald-500 hover:text-emerald-50 cursor-pointer`
                        : `bg-white border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-400 cursor-pointer shadow-sm hover:shadow`;
                    }

                    return (
                      <button
                        key={i}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(i)}
                        className={btnClass}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 min-h-[40px]">
                  <AnimatePresence>
                    {feedback && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-sm font-bold ${feedback.type === 'success' ? 'text-emerald-500' : feedback.type === 'error' ? 'text-rose-500' : 'text-amber-500'}`}>
                        {feedback.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {currentQuestion.hint && !isAnswered && (
                    <div className="flex-1 text-right">
                      {showHint ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`inline-block p-3 rounded-lg border text-xs font-mono text-left ${isDark ? 'bg-amber-900/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                          💡 Hint: {currentQuestion.hint}
                        </motion.div>
                      ) : (
                        <button onClick={handleUseHint} disabled={score < 5} className={`px-4 py-2 rounded-full text-xs font-bold border border-dashed transition-colors ${score >= 5 ? (isDark ? 'border-amber-500/50 text-amber-500 hover:bg-amber-900/30' : 'border-amber-400 text-amber-600 hover:bg-amber-50') : (isDark ? 'border-emerald-900/50 text-emerald-700 cursor-not-allowed' : 'border-gray-300 text-gray-400 cursor-not-allowed')}`}>
                          <Lightbulb size={12} className="inline mr-1" />
                          Use Hint (-5 Grains)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div className={`p-8 text-center rounded-2xl border ${isDark ? 'bg-emerald-900/10 border-emerald-800/50 text-emerald-500/60' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                <p>Loading questions or no questions available for this difficulty.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`w-full max-w-sm p-8 rounded-3xl border shadow-2xl text-center ${isDark ? 'bg-[#0d1310] border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]' : 'bg-white border-emerald-200 shadow-emerald-500/20'}`}>
              {!magicLinkSent ? (
                <>
                  <h3 className="text-xl font-bold text-emerald-500 mb-2">Email Login</h3>
                  <p className={`text-xs mb-6 ${isDark ? 'text-emerald-200/50' : 'text-emerald-700/60'}`}>Enter your email to receive a secure login link (Magic Link).</p>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full p-3 rounded-xl border text-center mb-4 outline-none transition-all ${isDark ? 'bg-[#0a0f0d] border-emerald-900/50 focus:border-emerald-500 text-emerald-50' : 'bg-gray-50 border-emerald-200 focus:border-emerald-400 text-emerald-950'}`}
                  />
                  <button onClick={sendMagicLink} disabled={isSendingMagicLink} className="w-full py-3 rounded-xl font-bold bg-emerald-500 text-white hover:bg-emerald-400 transition-colors disabled:opacity-50">
                    {isSendingMagicLink ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-500 mb-2">Magic Link Sent!</p>
                  <p className={`text-xs mb-6 ${isDark ? 'text-emerald-200/50' : 'text-emerald-700/60'}`}>Check your inbox and click the link to instantly log in and sync your karmic impact.</p>
                </>
              )}
              <button onClick={() => setShowEmailModal(false)} className={`mt-6 text-xs font-semibold ${isDark ? 'text-rose-500/80 hover:text-rose-400' : 'text-rose-600 hover:text-rose-500'}`}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
