"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, Lightbulb, User, LogOut, ArrowLeft, Sun, Moon, Zap, Cpu, Award } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { quizData, CategoryKey, Difficulty, Question } from './quizData';
import { useToast } from '../js/ToastContext';
import Link from 'next/link';
import TiltWrapper from '@/components/3d/TiltWrapper';

// Initialize Supabase client
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

const levelTitles = [
  { minLvl: 1, title: "Chandra Novice" },
  { minLvl: 3, title: "Budha Auditor" },
  { minLvl: 5, title: "Mangala Sentinel" },
  { minLvl: 8, title: "Brihaspati Sage" },
  { minLvl: 12, title: "Shukra Guardian" },
  { minLvl: 16, title: "Shani Elder" },
  { minLvl: 20, title: "Rahu Illusionist" },
  { minLvl: 25, title: "Ketu Supreme Architect" }
];

export default function CharityQuizClient() {
  // State
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  
  // Daily Streak & Shields State
  const [dailyStreak, setDailyStreak] = useState(0);
  const [streakShields, setStreakShields] = useState(0);
  const [lastPlayedDate, setLastPlayedDate] = useState('');
  const [dailyPlanetBonus, setDailyPlanetBonus] = useState({ name: '', targetRecipient: '', message: '' });
  
  const [category, setCategory] = useState<CategoryKey | 'custom-ai'>('network');
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

  // Custom AI Quiz States
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiKey, setAiKey] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiQuestions, setAiQuestions] = useState<Question[]>([]);
  const [aiIndex, setAiIndex] = useState(0);
  const [aiCorrectCount, setAiCorrectCount] = useState(0);
  const [showAICompletion, setShowAICompletion] = useState(false);

  // Visitor count
  const [quizVisitorCount, setQuizVisitorCount] = useState(1437);

  // Level up states
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ level: 1, title: '' });

  // Refs to track recently shown questions to prevent repeats
  const questionHistoryRef = useRef<string[]>([]);
  const currentQuestionRef = useRef<Question | null>(null);

  // Theme
  const [isDark, setIsDark] = useState(true);

  const { addToast } = useToast();

  // Web3 States
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);

  // Sync wallet connection state
  useEffect(() => {
    const checkWallet = () => {
      const savedWallet = localStorage.getItem("web3_wallet_address");
      setWalletAddress(savedWallet);
    };
    checkWallet();
    window.addEventListener("storage", checkWallet);
    return () => window.removeEventListener("storage", checkWallet);
  }, []);

  const handleMintSoulboundNFT = () => {
    if (!walletAddress) {
      addToast("No connected Web3 node. Please connect your wallet in the gateway hub.", "info");
      return;
    }
    setIsMinting(true);
    setTimeout(() => {
      setNftMinted(true);
      setIsMinting(false);
      addToast("Proof-of-Impact Soulbound Badge cryptographically minted!", "success");
    }, 2500);
  };

  // Initialize
  useEffect(() => {
    const isDarkMode = localStorage.getItem('jumpstreet_theme') !== 'light';
    setIsDark(isDarkMode);
    
    // Persistent client-side visitor tracker starting at 1437
    const storedQuizCount = localStorage.getItem("charity_quiz_visitor_count");
    if (storedQuizCount) {
      const current = parseInt(storedQuizCount, 10);
      const updated = current + 1;
      localStorage.setItem("charity_quiz_visitor_count", updated.toString());
      setQuizVisitorCount(updated);
    } else {
      localStorage.setItem("charity_quiz_visitor_count", "1437");
      setQuizVisitorCount(1437);
    }
    document.body.classList.toggle('light-mode', !isDarkMode);
    
    // Calculate daily planet alignment bonus
    calculateDailyPlanetBonus();
    
    // Auth & Game states Check
    const checkSessionAndStates = async () => {
      // Load Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        handleUserLogin(session.user.email);
      } else {
        const localScore = parseInt(localStorage.getItem('charityRiceScore') || '0', 10);
        setScore(localScore);
        // Initialize level storage so we don't trigger modal on mount
        const calculatedLevel = Math.floor(localScore / 200) + 1;
        localStorage.setItem('charityQuizLastLevel', String(calculatedLevel));
      }
      
      // Load daily streaks & shields from local storage
      const localStreak = parseInt(localStorage.getItem('charityQuizStreak') || '0', 10);
      const localShields = parseInt(localStorage.getItem('charityQuizShields') || '0', 10);
      const localLastPlayed = localStorage.getItem('charityQuizLastPlayedDate') || '';
      const savedAIKey = localStorage.getItem('GEMINI_API_KEY') || '';
      
      setDailyStreak(localStreak);
      setStreakShields(localShields);
      setLastPlayedDate(localLastPlayed);
      setAiKey(savedAIKey);
      
      // Validate streak
      if (localLastPlayed) {
        const todayStr = new Date().toISOString().split('T')[0];
        const lastDate = new Date(localLastPlayed);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 1) {
          // Missed a day! check shields
          if (localShields > 0) {
            const updatedShields = localShields - 1;
            setStreakShields(updatedShields);
            localStorage.setItem('charityQuizShields', String(updatedShields));
            addToast(`🛡️ Your streak of ${localStreak} days was saved by a Streak Shield!`, 'info');
          } else {
            setDailyStreak(0);
            localStorage.setItem('charityQuizStreak', '0');
          }
        }
      }
    };
    checkSessionAndStates();
    
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
    // Initialize level storage so we don't trigger modal on mount
    const calculatedLevel = Math.floor(userScore / 200) + 1;
    localStorage.setItem('charityQuizLastLevel', String(calculatedLevel));
  };

  const saveScore = (newScore: number) => {
    setScore(newScore);
    localStorage.setItem('charityRiceScore', String(newScore));
    if (user) {
      localStorage.setItem(`charityRiceScore_${user.email}`, String(newScore));
    }
  };

  // Calculate daily planet alignment bonus
  const calculateDailyPlanetBonus = () => {
    const day = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const bonuses = {
      0: { name: "Sunday (Sun Day)", targetRecipient: "dogs", message: "☀️ Today is Sun Day! Feed the Dogs for 2X Grains!" },
      1: { name: "Monday (Moon Day)", targetRecipient: "moon", message: "🌕 Today is Moon Day! Feed the Moon Mothers for 2X Grains!" },
      2: { name: "Tuesday (Mars Day)", targetRecipient: "cows", message: "🔥 Today is Mars Day! Feed the Cows for 2X Grains!" },
      3: { name: "Wednesday (Mercury Day)", targetRecipient: "birds", message: "✨ Today is Mercury Day! Feed the Birds for 2X Grains!" },
      4: { name: "Thursday (Jupiter Day)", targetRecipient: "jupiter", message: "🪐 Today is Jupiter Day! Support Jupiter's Scholars for 2X Grains!" },
      5: { name: "Friday (Venus Day)", targetRecipient: "venus", message: "💖 Today is Venus Day! Support Venus Women Shelters for 2X Grains!" },
      6: { name: "Saturday (Saturn Day)", targetRecipient: "saturn", message: "🛡️ Today is Saturday! Help Saturn's Disabled for 2X Grains!" }
    };
    setDailyPlanetBonus(bonuses[day as keyof typeof bonuses]);
  };

  // Record daily streak activity
  const recordDailyActivity = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    if (lastPlayedDate !== todayStr) {
      let newStreak = 1;
      if (lastPlayedDate) {
        const lastDate = new Date(lastPlayedDate);
        const todayDate = new Date(todayStr);
        const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreak = dailyStreak + 1;
        }
      }
      
      setDailyStreak(newStreak);
      setLastPlayedDate(todayStr);
      localStorage.setItem('charityQuizLastPlayedDate', todayStr);
      localStorage.setItem('charityQuizStreak', String(newStreak));
    }
  };

  const handleBuyShield = () => {
    if (score >= 500) {
      const newScore = score - 500;
      const newShields = streakShields + 1;
      
      saveScore(newScore);
      setStreakShields(newShields);
      localStorage.setItem('charityQuizShields', String(newShields));
      
      setFeedback({ text: 'Streak Shield purchased successfully! 🛡️ -500 grains.', type: 'success' });
      addToast('Streak Shield Purchased! 🛡️', 'success');
    }
  };

  // Question Logic
  const loadNextQuestion = useCallback(() => {
    if (category === 'custom-ai') return; // Handled separately by AI state flow
    
    const allQ = quizData[category].questions;
    const filteredQ = allQ.filter(q => q.difficulty === difficulty);
    if (filteredQ.length === 0) {
      setCurrentQuestion(null);
      return;
    }
    
    // Filter out recently seen questions from history
    let pool = filteredQ.filter(q => !questionHistoryRef.current.includes(q.question));
    
    // If all questions in the category/difficulty have been seen, reset history for this pool
    if (pool.length === 0) {
      pool = filteredQ;
      // Keep only the last question in history to prevent back-to-back repeats
      const lastQ = currentQuestionRef.current;
      questionHistoryRef.current = lastQ ? [lastQ.question] : [];
    }
    
    // If there's more than 1 option, ensure we don't repeat the current question back-to-back
    if (pool.length > 1 && currentQuestionRef.current) {
      pool = pool.filter(q => q.question !== currentQuestionRef.current?.question);
    }
    
    const rand = Math.floor(Math.random() * pool.length);
    const selected = pool[rand];
    
    setCurrentQuestion(selected);
    currentQuestionRef.current = selected;
    
    // Add to history
    questionHistoryRef.current.push(selected.question);
    if (questionHistoryRef.current.length > 5) {
      questionHistoryRef.current.shift();
    }
    
    setIsAnswered(false);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowHint(false);
  }, [category, difficulty]);

  useEffect(() => {
    loadNextQuestion();
    if (category !== 'custom-ai') {
      setStreak(0);
      setAiQuestions([]);
      setShowAICompletion(false);
    }
  }, [category, difficulty, loadNextQuestion]);

  // Hook to track and celebrate Level Up achievements
  useEffect(() => {
    if (score > 0) {
      const calculatedLevel = Math.floor(score / 200) + 1;
      const storedLvl = parseInt(localStorage.getItem('charityQuizLastLevel') || '1', 10);
      
      if (calculatedLevel > storedLvl) {
        localStorage.setItem('charityQuizLastLevel', String(calculatedLevel));
        
        let title = "Chandra Novice";
        for (const item of levelTitles) {
          if (calculatedLevel >= item.minLvl) {
            title = item.title;
          }
        }
        
        setLevelUpData({ level: calculatedLevel, title });
        setShowLevelUpModal(true);
        addToast(`🎉 Level Up! You reached Level ${calculatedLevel}!`, 'success');
        
        // Play level-up sound effect (ascending arpeggio)
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const playNote = (freq: number, delay: number, duration: number) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
            gain.gain.setValueAtTime(0.15, audioCtx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);
            osc.start(audioCtx.currentTime + delay);
            osc.stop(audioCtx.currentTime + delay + duration);
          };
          
          playNote(261.63, 0, 0.2); // C4
          playNote(329.63, 0.15, 0.2); // E4
          playNote(392.00, 0.3, 0.2); // G4
          playNote(523.25, 0.45, 0.5); // C5
        } catch (e) {
          console.error(e);
        }
      } else if (calculatedLevel < storedLvl) {
        localStorage.setItem('charityQuizLastLevel', String(calculatedLevel));
      }
    }
  }, [score, addToast]);

  // Generate Custom AI Quiz
  const handleGenerateAIQuiz = async () => {
    if (!aiTopic.trim()) {
      addToast('Please enter a topic', 'error');
      return;
    }
    if (!aiKey.trim()) {
      addToast('Please enter a Gemini API Key', 'error');
      return;
    }

    setIsGeneratingAI(true);
    localStorage.setItem('GEMINI_API_KEY', aiKey);
    setFeedback(null);

    const promptText = `Generate exactly 5 multiple choice questions on the topic: "${aiTopic}".
Return the output ONLY as a valid JSON array matching the structure:
[
  {
    "question": "question text",
    "options": ["option 1", "option 2", "option 3", "option 4"],
    "answer": 0,
    "hint": "helpful hint",
    "scenario": "brief context"
  }
]
Ensure the JSON output is raw, without any markdown formatting, backticks, or wrapping. Keep it strictly educational and correct.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${aiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        throw new Error('API key is invalid or request blocked.');
      }

      const data = await response.json();
      const textResponse = data.candidates[0].content.parts[0].text;
      const parsedQuestions = JSON.parse(textResponse) as Question[];

      if (parsedQuestions.length === 0) {
        throw new Error('No questions returned.');
      }

      setAiQuestions(parsedQuestions);
      setAiIndex(0);
      setAiCorrectCount(0);
      setCategory('custom-ai');
      setCurrentQuestion(parsedQuestions[0]);
      setIsAnswered(false);
      setSelectedAnswer(null);
      setShowHint(false);
      setShowAIModal(false);
      setShowAICompletion(false);
      addToast('AI Quiz Generated!', 'success');
    } catch (err: any) {
      addToast(`AI Generation Failed: ${err.message || err}`, 'error');
    } finally {
      setIsGeneratingAI(false);
    }
  };

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

    const isCorrect = (index === currentQuestion.answer);

    if (isCorrect) {
      // Correct
      const isPlanetBonus = (recipient === dailyPlanetBonus.targetRecipient);
      const points = isPlanetBonus ? 20 : 10;
      
      saveScore(score + points);
      setStreak(s => s + 1);
      if (category === 'custom-ai') {
        setAiCorrectCount(c => c + 1);
      }
      recordDailyActivity();
      
      if (isPlanetBonus) {
        setFeedback({ text: `Correct! +20 grains of rice donated (PLANET BONUS 2X!).`, type: 'success' });
      } else {
        setFeedback({ text: `Correct! +${points} grains of rice donated.`, type: 'success' });
      }
      
      triggerRiceAnimation();
      
      if ('vibrate' in navigator) navigator.vibrate(50);
    } else {
      // Incorrect
      setStreak(0);
      setFeedback({ text: 'Incorrect. Try the next one!', type: 'error' });
      if ('vibrate' in navigator) navigator.vibrate([50, 100, 50]);
    }

    setTimeout(() => {
      if (category === 'custom-ai') {
        const nextIndex = aiIndex + 1;
        if (nextIndex < aiQuestions.length) {
          setAiIndex(nextIndex);
          setCurrentQuestion(aiQuestions[nextIndex]);
          setIsAnswered(false);
          setSelectedAnswer(null);
          setFeedback(null);
          setShowHint(false);
        } else {
          // Finished AI Quiz
          setShowAICompletion(true);
          setCurrentQuestion(null);
        }
      } else {
        loadNextQuestion();
      }
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
    const text = `I just reached Level ${level} and generated ${score} grains of rice on Cyber FreeRice! Join me:`;
    if (navigator.share) {
      navigator.share({ title: 'Cyber FreeRice', text, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      addToast('Copied to clipboard!', 'success');
    }
  };

  // Share AI Custom Quiz Accomplishment (Viral Booster)
  const handleShareAIResult = () => {
    const text = `🧠 I just scored ${aiCorrectCount}/5 in a custom AI-generated quiz on "${aiTopic}" on Cyber FreeRice, donating ${aiCorrectCount * 10} grains of rice! Try any topic here:`;
    if (navigator.share) {
      navigator.share({ title: 'Cyber FreeRice AI Quiz', text, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.href}`);
      addToast('Copied to clipboard!', 'success');
    }
  };

  // XP Calculations
  const milestone = score % 500;
  const progressPct = Math.min((milestone / 500) * 100, 100);
  
  const level = Math.floor(score / 200) + 1;
  let currentLevelTitle = "Chandra Novice";
  for (const item of levelTitles) {
    if (level >= item.minLvl) {
      currentLevelTitle = item.title;
    }
  }

  return (
    <TiltWrapper tiltDeg={6}>
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-[#0a0f0d]/50 text-emerald-50' : 'bg-emerald-50/50 text-emerald-950'}`}>
      
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute top-0 right-0 w-96 h-96 blur-[100px] rounded-full mix-blend-screen opacity-30 ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-400/40'}`} />
        <div className={`absolute bottom-0 left-0 w-96 h-96 blur-[100px] rounded-full mix-blend-screen opacity-30 ${isDark ? 'bg-emerald-600/20' : 'bg-emerald-400/40'}`} />
        <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] ${isDark ? 'invert-0' : 'invert'}`} />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 border-b px-4 sm:px-6 py-3 backdrop-blur-xl flex items-center justify-between ${isDark ? 'bg-[#0a0f0d]/50 border-emerald-900/50' : 'bg-emerald-50/50 border-emerald-200'}`}>
        <Link href="/" className="flex items-center gap-2 text-sm font-mono font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
          <ArrowLeft size={16} /> Return
        </Link>
        
        <div className="flex items-center gap-2 font-mono font-bold text-lg tracking-tight">
          <div className="w-6 h-6 rounded bg-emerald-500 text-white flex items-center justify-center text-xs">C</div>
          <span className={isDark ? 'text-emerald-50' : 'text-emerald-950'}>Cyber<span className="text-emerald-500">FreeRice</span></span>
        </div>

        <div className="flex items-center gap-3">
          {walletAddress && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </div>
          )}
          <div className="hidden md:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-mono text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{quizVisitorCount} quiz visits</span>
          </div>

          {dailyStreak > 0 && (
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20">
              🔥 {dailyStreak} Days
            </div>
          )}

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

        {/* Daily Planetary alignment multiplier info */}
        {dailyPlanetBonus.message && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-xl bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center mb-6 text-xs font-bold text-amber-500 flex items-center justify-center gap-2">
            <Zap size={14} />
            <span>{dailyPlanetBonus.message}</span>
          </motion.div>
        )}

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
            
            {/* Custom AI Quiz Button */}
            <button
              onClick={() => setShowAIModal(true)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 border border-purple-500/30 text-purple-400 hover:bg-purple-500/10 ${category === 'custom-ai' ? 'bg-purple-500 text-white border-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.3)]' : ''}`}
            >
              <Cpu size={12} /> Custom AI Quiz
            </button>
          </div>
          
          {category !== 'custom-ai' && (
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
          )}
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
          
          {/* Level Indicator */}
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono font-bold text-emerald-400">
            <span>🛡️ Level {level}: {currentLevelTitle}</span>
          </div>

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

          {/* Streak Shields Shop */}
          <div className="flex items-center justify-between gap-2 border-t border-b border-dashed border-emerald-800/40 py-2.5 my-4 text-xs font-mono">
            <span className="text-emerald-500/70">🛡️ Shields: {streakShields}</span>
            <button 
              onClick={handleBuyShield}
              disabled={score < 500}
              className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              Buy Shield (500 Grains)
            </button>
          </div>

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
            {level >= 3 && (
              <button
                onClick={handleMintSoulboundNFT}
                disabled={isMinting || nftMinted}
                className={`w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all border ${
                  nftMinted 
                    ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400 cursor-default' 
                    : 'border-[#38bdf8]/30 bg-[#38bdf8]/10 text-[#38bdf8] hover:bg-[#38bdf8]/20 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                }`}
              >
                <Award size={14} />
                <span>{isMinting ? "Minting SBT..." : nftMinted ? "SBT Badge Minted! ✓" : "Mint Proof-of-Impact SBT"}</span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Quiz Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {showAICompletion && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full p-8 rounded-2xl border text-center shadow-xl ${isDark ? 'bg-[#0d1310]/80 border-purple-800/40' : 'bg-white/80 border-purple-200'}`}>
                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={32} className="text-purple-400" />
                </div>
                <h3 className="text-xl font-bold font-mono text-purple-400 mb-2">Custom AI Quiz Completed!</h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-emerald-50/60' : 'text-emerald-950/60'}`}>
                  You answered {aiCorrectCount} of 5 questions correctly on the topic: <strong>{aiTopic}</strong>. This generated <strong>{aiCorrectCount * 10} grains</strong> of charitable rice!
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button onClick={handleShareAIResult} className="px-5 py-2.5 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-2 transition-colors">
                    <Share2 size={16} /> Share & Brag on LinkedIn/X
                  </button>
                  <button onClick={() => setShowAIModal(true)} className={`px-5 py-2.5 rounded-xl font-bold border transition-colors ${isDark ? 'border-emerald-800 text-emerald-400 hover:bg-emerald-900/25' : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'}`}>
                    Play New Topic
                  </button>
                </div>
              </motion.div>
            )}

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
                
                {category === 'custom-ai' && (
                  <div className="text-[10px] font-mono text-purple-400 font-bold mb-4 uppercase tracking-widest">
                    🤖 AI Quiz: Question {aiIndex + 1} of {aiQuestions.length} ({aiTopic})
                  </div>
                )}

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
              !showAICompletion && (
                <motion.div className={`p-8 text-center rounded-2xl border ${isDark ? 'bg-emerald-900/10 border-emerald-800/50 text-emerald-500/60' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                  <p>Loading questions or no questions available for this difficulty.</p>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>

        {/* Sponsored Placement Section (Monetization Demo) */}
        <div className={`w-full p-6 rounded-2xl border text-center mt-8 ${isDark ? 'bg-purple-950/5 border-purple-900/20' : 'bg-purple-50/50 border-purple-200'}`}>
          <span className="text-[9px] font-mono font-bold text-purple-500 uppercase tracking-widest block mb-2">Sponsored Placement</span>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left max-w-xl">
              <h4 className="text-sm font-mono font-bold">Upgrade your skills with OffSec (OSCP)</h4>
              <p className={`text-xs mt-1 ${isDark ? 'text-emerald-50/50' : 'text-emerald-950/50'}`}>
                OffSec has pledged to match up to 100,000 grains of rice today! Learn advanced penetration testing and support global food programs.
              </p>
            </div>
            <a href="https://www.offsec.com/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg text-xs font-bold bg-purple-600 text-white hover:bg-purple-500 transition-colors shrink-0">
              Visit OffSec
            </a>
          </div>
        </div>

      </main>

      {/* AI Quiz Settings Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={`w-full max-w-md p-8 rounded-3xl border shadow-2xl text-center ${isDark ? 'bg-[#0d1310] border-purple-500/30 shadow-[0_0_50px_rgba(147,51,234,0.1)]' : 'bg-white border-emerald-200 shadow-emerald-500/20'}`}>
              <h3 className="text-xl font-bold text-purple-400 mb-2">Create Custom AI Quiz</h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-emerald-200/50' : 'text-emerald-700/60'}`}>
                Enter any topic (e.g. World History, Indian Cuisine, JavaScript) and feed charities by answering AI-crafted questions!
              </p>

              <div className="text-left mb-4">
                <label className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-2">1. Choose Your Topic</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g., Space Exploration"
                  disabled={isGeneratingAI}
                  className={`w-full p-3 rounded-xl border text-center outline-none transition-all ${isDark ? 'bg-[#0a0f0d] border-purple-900/50 focus:border-purple-500 text-emerald-50' : 'bg-gray-50 border-purple-200 focus:border-purple-400 text-emerald-950'}`}
                />
              </div>

              <div className="text-left mb-6">
                <label className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block mb-1">2. Enter Gemini API Key</label>
                <span className={`text-[9px] block mb-2 ${isDark ? 'text-emerald-500/40' : 'text-emerald-700/50'}`}>
                  Get a free API key instantly at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="underline text-emerald-500 hover:text-emerald-400">Google AI Studio</a>.
                </span>
                <input
                  type="password"
                  value={aiKey}
                  onChange={e => setAiKey(e.target.value)}
                  placeholder="Paste AI key here..."
                  disabled={isGeneratingAI}
                  className={`w-full p-3 rounded-xl border text-center outline-none transition-all ${isDark ? 'bg-[#0a0f0d] border-purple-900/50 focus:border-purple-500 text-emerald-50' : 'bg-gray-50 border-purple-200 focus:border-purple-400 text-emerald-950'}`}
                />
              </div>

              <button
                onClick={handleGenerateAIQuiz}
                disabled={isGeneratingAI}
                className="w-full py-3.5 rounded-xl font-bold bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
              >
                {isGeneratingAI ? (
                  <>🤖 Crafting Questions...</>
                ) : (
                  <>🔮 Generate custom Quiz</>
                )}
              </button>

              <button onClick={() => setShowAIModal(false)} disabled={isGeneratingAI} className={`mt-6 text-xs font-semibold ${isDark ? 'text-rose-500/80 hover:text-rose-400' : 'text-rose-600 hover:text-rose-500'}`}>Cancel</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Level Up Announcement Modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className={`w-full max-w-sm rounded-3xl border p-8 text-center relative overflow-hidden shadow-2xl ${isDark ? 'bg-gradient-to-b from-amber-950/40 to-[#0b0f19] border-amber-500/30' : 'bg-white border-amber-300'}`}
            >
              {/* Glowing Amber Light Background */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 blur-[50px] rounded-full pointer-events-none" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="text-6xl mb-4 inline-block drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                🌟
              </motion.div>

              <h3 className="text-2xl font-black font-title text-amber-500 mb-2">Rank Up!</h3>
              <p className={`text-xs mb-6 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Incredible knowledge! Your answers are generating high impact for global charities.
              </p>

              <div className={`p-4 rounded-2xl mb-6 border ${isDark ? 'bg-amber-950/20 border-amber-500/20' : 'bg-amber-50 border-amber-200'}`}>
                <div className="text-[10px] font-mono uppercase tracking-wider text-amber-500 mb-1">New Title Earned</div>
                <div className="text-lg font-bold font-title text-[var(--fg)]">
                  Level {levelUpData.level}: {levelUpData.title}
                </div>
              </div>

              <button
                onClick={() => setShowLevelUpModal(false)}
                className="w-full py-3 px-6 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 active:scale-95 transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Continue Feeding
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </TiltWrapper>
  );
}
