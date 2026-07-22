"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, Lightbulb, User, LogOut, ArrowLeft, Sun, Moon, Zap, Cpu, Award, Network, Activity, Server } from 'lucide-react';
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
  
  const [category, setCategory] = useState<CategoryKey | 'custom-ai'>('animals');
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

  // Staking Nodes State
  const [stakingNodes, setStakingNodes] = useState([
    { name: "Patna Core Nodes", address: "0x3f5c...a1d9", staked: 4810, latency: "14ms", status: "ACTIVE" },
    { name: "Frankfurt Threat Feed", address: "0x7a2d...93b8", staked: 1290, latency: "42ms", status: "ACTIVE" },
    { name: "Singapore Gateway Hub", address: "0x98f2...e311", staked: 9480, latency: "22ms", status: "ACTIVE" }
  ]);

  // Update node latency
  useEffect(() => {
    const nodeInterval = setInterval(() => {
      setStakingNodes(prev => prev.map(node => ({
        ...node,
        latency: `${Math.floor(10 + Math.random() * 20)}ms`
      })));
    }, 6000);
    return () => clearInterval(nodeInterval);
  }, []);

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
      let basePoints = isPlanetBonus ? 20 : 10;
      
      // Combo Streak Multiplier
      let multiplier = 1;
      if (streak >= 2) {
        multiplier = 2; // 2x points for 3 or more correct answers in a row!
      }
      
      const points = basePoints * multiplier;
      
      saveScore(score + points);
      setStreak(s => s + 1);
      setStakingNodes(prev => prev.map((node, idx) => {
        if (idx === 0) return { ...node, staked: node.staked + points };
        return node;
      }));
      if (category === 'custom-ai') {
        setAiCorrectCount(c => c + 1);
      }
      recordDailyActivity();
      
      if (multiplier > 1) {
        setFeedback({ text: `🔥 COMBO STREAK! 2X MULTIPLIER! +${points} grains donated!`, type: 'success' });
      } else if (isPlanetBonus) {
        setFeedback({ text: `Correct! +${points} grains of rice donated (PLANET BONUS 2X!).`, type: 'success' });
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
    const text = `🌾 I just generated ${score} grains of karmic impact on Cyber Free Rice! Test your cybersecurity knowledge & feed global causes:`;
    const shareUrl = "https://adityasec32.systems/charity-quiz";
    if (navigator.share) {
      navigator.share({ title: 'Cyber Free Rice', text, url: shareUrl }).catch(console.error);
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + " " + shareUrl)}`;
      window.open(whatsappUrl, '_blank');
      navigator.clipboard.writeText(`${text} ${shareUrl}`);
      addToast('Copied share link & opening WhatsApp!', 'success');
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
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-hidden relative ${isDark ? 'text-white' : 'text-slate-800'}`}>
      
      {/* Emotional, Attractive, Heart-Melting Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Base layer: Deep rich color for dark mode, warm creamy white for light mode */}
        <div className={`absolute inset-0 transition-colors duration-700 ${isDark ? 'bg-[#0f0414]' : 'bg-[#fff5f5]'}`} />
        
        {/* Dynamic Emotional Orbs */}
        <motion.div 
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-60 mix-blend-screen ${isDark ? 'bg-rose-600' : 'bg-rose-300'}`} 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute bottom-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-50 mix-blend-screen ${isDark ? 'bg-amber-600' : 'bg-orange-200'}`} 
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -60, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-[20%] right-[5%] w-[50vw] h-[50vw] rounded-full blur-[110px] opacity-50 mix-blend-screen ${isDark ? 'bg-purple-700' : 'bg-pink-300'}`} 
        />
        
        {/* Subtle Pulse to simulate a heartbeat of compassion */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full blur-[140px] mix-blend-screen ${isDark ? 'bg-fuchsia-600' : 'bg-red-200'}`}
        />
        <div className="absolute inset-0 backdrop-blur-[70px]" />
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 px-4 sm:px-6 py-4 flex items-center justify-between transition-all duration-300 ${isDark ? 'bg-black/20 border-b border-white/10' : 'bg-white/30 border-b border-white/40'} backdrop-blur-2xl shadow-sm`}>
        <Link href="/" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
          <ArrowLeft size={16} /> Dashboard
        </Link>
        
        <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm shadow-md">C</div>
          <span>Charity Quiz</span>
        </div>

        <div className="flex items-center gap-3">
          {dailyStreak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md shadow-sm">
              🔥 {dailyStreak}
            </div>
          )}

          <button onClick={toggleTheme} className="p-2 rounded-full bg-white/20 border border-white/30 backdrop-blur-md hover:bg-white/30 transition-all shadow-sm">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md shadow-sm">
              <img src={user.avatar} alt="User" className="w-6 h-6 rounded-full shadow-sm" />
              <span className="text-xs font-semibold hidden sm:block">{user.name}</span>
              <button onClick={handleLogout} className="text-rose-500 hover:text-rose-400"><LogOut size={14} /></button>
            </div>
          ) : (
            <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold bg-white text-slate-800 hover:bg-gray-50 transition-all shadow-md">
              <User size={16} /> Sign In
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 relative z-10 flex flex-col gap-6">
        
        {/* Highlighted Supreme Intro Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className={`w-full p-8 sm:p-10 rounded-[32px] text-center overflow-hidden relative shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-3xl border transition-all ${isDark ? 'bg-gradient-to-b from-rose-950/40 via-black/40 to-slate-950/60 border-rose-500/20' : 'bg-gradient-to-b from-rose-50/80 via-white/90 to-amber-50/80 border-rose-200'}`}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-rose-500/10 blur-3xl rounded-full pointer-events-none" />

          {/* Emotional Headline */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 font-title leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 drop-shadow-md">
              Every Answer Saves a Life.
            </span>
          </h1>

          <p className="text-sm sm:text-lg max-w-3xl mx-auto font-medium leading-relaxed mb-6 text-slate-200">
            Play daily to transform a life. For every correct answer, we donate{' '}
            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
              10 grains of rice
            </span>{' '}
            to feed <strong className="text-rose-300 font-bold">rescue animals</strong> and <strong className="text-amber-300 font-bold">vulnerable families</strong> globally. Your knowledge creates real-world miracles.
          </p>

          {/* Highlight Badges */}
          <div className="flex flex-wrap justify-center gap-3 text-xs font-mono font-bold uppercase tracking-wider">
            <span className="px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 shadow-sm flex items-center gap-1.5">
              ❤️ 10 Grains Pledged / Answer
            </span>
            <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 shadow-sm flex items-center gap-1.5">
              🕊️ 100% Free &amp; Ad-Funded
            </span>
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 shadow-sm flex items-center gap-1.5">
              🌍 Verified Global Impact
            </span>
          </div>
        </motion.div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Active Quiz Panel */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Categories & Difficulty Container */}
            <div className={`p-3 rounded-[28px] backdrop-blur-3xl shadow-xl border flex flex-col sm:flex-row gap-3 justify-between items-center ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/70 border-white/60'}`}>
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto p-1.5 bg-black/20 rounded-[22px]">
                  {(Object.keys(quizData) as CategoryKey[]).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-[16px] text-xs font-bold capitalize transition-all ${category === cat ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md scale-[1.02]' : 'opacity-70 hover:opacity-100 hover:bg-white/10 text-white'}`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      const keys = Object.keys(quizData) as CategoryKey[];
                      setCategory(keys[Math.floor(Math.random() * keys.length)]);
                    }}
                    className={`px-4 py-2 rounded-[16px] text-xs font-bold capitalize transition-all opacity-70 hover:opacity-100 hover:bg-white/10 text-white`}
                  >
                    🎲 Random
                  </button>
                  <button
                    onClick={() => setShowAIModal(true)}
                    className={`px-4 py-2 rounded-[16px] text-xs font-bold transition-all flex items-center gap-1.5 ${category === 'custom-ai' ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md' : 'opacity-80 hover:opacity-100 hover:bg-white/10 text-white'}`}
                  >
                    <Cpu size={14} /> AI Quiz
                  </button>
                </div>

                {category !== 'custom-ai' && (
                  <div className="flex gap-1.5 p-1.5 bg-black/20 rounded-[22px]">
                    {(['beginner', 'intermediate', 'advanced'] as Difficulty[]).map(diff => (
                      <button
                        key={diff}
                        onClick={() => setDifficulty(diff)}
                        className={`px-3 py-1.5 rounded-[14px] text-xs font-bold capitalize transition-all ${difficulty === diff ? 'bg-blue-500 text-white shadow-md' : 'opacity-60 hover:opacity-100 text-slate-300'}`}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                )}
            </div>

            {/* Corporate Sponsorship Banner */}
            <div className={`p-4 sm:p-5 rounded-[24px] border backdrop-blur-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group ${isDark ? 'bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-teal-950/60 border-emerald-500/30' : 'bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-200'}`}>
              <div className="flex items-center gap-3.5 z-10">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 text-emerald-400 font-black text-lg shadow-inner">
                  🐋
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Official Sponsor</span>
                    <span className="text-xs text-slate-400 font-mono">Orca6™ HFT</span>
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-wider mt-1 text-white">Automate Trading with Sub-Millisecond AI</h4>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Pre-funded demo account credentials delivered instantly • Zero personal capital risk.</p>
                </div>
              </div>
              <Link
                href="https://jumpstreet.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2 z-10"
              >
                <span>Explore Orca6™</span>
                <Zap size={14} />
              </Link>
            </div>

            {/* Quiz Area */}
            <div className="w-full">
              <AnimatePresence mode="wait">
                {showAICompletion && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full p-10 rounded-[32px] text-center shadow-xl backdrop-blur-2xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/60'}`}>
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Award size={40} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Quiz Completed!</h3>
                    <p className="text-base opacity-80 mb-8">
                      You answered {aiCorrectCount} of 5 questions correctly on <strong>{aiTopic}</strong>. <br/>You generated <strong>{aiCorrectCount * 10} grains</strong> of rice!
                    </p>
                    <div className="flex justify-center gap-4">
                      <button onClick={handleShareAIResult} className="px-6 py-3 rounded-full font-semibold bg-white text-slate-800 shadow-md hover:scale-105 transition-transform flex items-center gap-2">
                        <Share2 size={18} /> Share Result
                      </button>
                      <button onClick={() => setShowAIModal(true)} className="px-6 py-3 rounded-full font-semibold bg-black/10 hover:bg-black/20 transition-colors">
                        New Topic
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
                      className={`w-full rounded-[32px] border p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl relative overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/60'}`}
                    >
                      {category === 'custom-ai' && (
                        <div className="text-xs font-bold text-purple-500 uppercase tracking-wide mb-5 flex items-center gap-2">
                          <Cpu size={14}/> AI Quiz: Question {aiIndex + 1} of {aiQuestions.length} ({aiTopic})
                        </div>
                      )}

                      {currentQuestion.scenario && (
                        <div className={`p-5 rounded-[20px] mb-6 text-sm leading-relaxed border ${isDark ? 'bg-black/20 border-white/5' : 'bg-white/40 border-white/50 shadow-sm'}`}>
                          {currentQuestion.scenario}
                        </div>
                      )}
                      
                      <h3 className="text-lg sm:text-xl font-semibold mb-8 leading-relaxed">
                        {currentQuestion.question}
                      </h3>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {currentQuestion.options.map((opt, i) => {
                          let btnClass = `w-full text-left p-4 rounded-[20px] text-sm sm:text-base font-medium transition-all flex items-center shadow-sm border `;
                           if (isAnswered) {
                            if (i === currentQuestion.answer) {
                              btnClass += `bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-lg z-10 scale-[1.02] `;
                            } else if (i === selectedAnswer) {
                              btnClass += `bg-red-500/20 border-red-500/40 text-red-400 opacity-90 `;
                            } else {
                              btnClass += isDark ? `bg-white/5 border-white/5 opacity-40 ` : `bg-black/5 border-black/5 opacity-50 `;
                            }
                          } else {
                            btnClass += isDark 
                              ? `bg-black/40 border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:scale-[1.01] cursor-pointer text-white`
                              : `bg-white/70 border-white/90 hover:bg-white hover:border-emerald-400 hover:scale-[1.01] cursor-pointer hover:shadow-md text-slate-900`;
                          }

                          return (
                            <button
                              key={i}
                              disabled={isAnswered}
                              onClick={() => handleAnswer(i)}
                              className={btnClass}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 shrink-0 text-sm font-bold ${isAnswered && i === currentQuestion.answer ? 'bg-white/20' : (isDark ? 'bg-white/10' : 'bg-black/5')}`}>
                                {String.fromCharCode(65 + i)}
                              </div>
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {/* Google AdSense / Display Ad Unit Placeholder */}
                      <div className={`p-4 rounded-[20px] border border-dashed text-center my-6 backdrop-blur-md ${isDark ? 'bg-black/30 border-white/10 text-slate-400' : 'bg-slate-50 border-black/10 text-slate-500'}`}>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest block opacity-50 mb-1">Monetized Display Ad Space</span>
                        <div className="min-h-[70px] flex flex-col items-center justify-center text-xs font-mono text-emerald-400/90 bg-emerald-500/5 rounded-xl border border-emerald-500/10 p-3">
                          <span className="font-bold">📺 Google AdSense / Ezoic Unit Slot Active</span>
                          <span className="text-[10px] text-slate-400 mt-1">Est. CPM $4.50 – $10.00 USD • Refreshes per question response</span>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center min-h-[40px]">
                        <AnimatePresence>
                          {feedback && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-sm font-semibold px-4 py-2 rounded-full ${feedback.type === 'success' ? 'bg-green-500/20 text-green-600 dark:text-green-400' : feedback.type === 'error' ? 'bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                              {feedback.text}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {currentQuestion.hint && !isAnswered && (
                          <div className="flex-1 text-right">
                            {showHint ? (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`inline-block p-4 rounded-[20px] text-sm text-left border shadow-sm ${isDark ? 'bg-white/10 border-white/20' : 'bg-white/80 border-white/100'}`}>
                                💡 {currentQuestion.hint}
                              </motion.div>
                            ) : (
                              <button onClick={handleUseHint} disabled={score < 5} className={`px-5 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors ${score >= 5 ? (isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50') : 'opacity-40 cursor-not-allowed'}`}>
                                <Lightbulb size={14} className="inline mr-1" /> Use Hint (-5 Grains)
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                ) : (
                  !showAICompletion && (
                    <motion.div className={`p-10 text-center rounded-[32px] backdrop-blur-2xl shadow-lg border ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/50'}`}>
                      <p className="opacity-70">Loading questions...</p>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Staking Stats & Widgets */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Main Score Widget */}
            <motion.div layout className={`w-full rounded-[32px] border p-8 text-center relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/50 border-white/60'}`}>
              
              <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-500 shadow-inner">
                Level {level}: {currentLevelTitle}
              </div>
              
              <div className="flex flex-col items-center justify-center gap-2 mb-6">
                <motion.span 
                  key={score}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-bold tracking-tight"
                >
                  {score.toLocaleString()}
                </motion.span>
                <span className="text-xs font-semibold uppercase tracking-widest opacity-60">Grains Donated</span>
                
                {score >= 500 && (
                  <div className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-[20px] bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm shadow-sm">
                    <Heart size={16} className="fill-emerald-500" />
                    You've funded {Math.floor(score / 500)} full meal{Math.floor(score / 500) > 1 ? 's' : ''}!
                  </div>
                )}
              </div>

              <div className="relative h-24 flex flex-col items-center justify-center">
                <AnimatePresence>
                  {riceGrains.map(grain => (
                    <motion.span
                      key={grain.id}
                      initial={{ opacity: 0, y: -40, scale: 0.5 }}
                      animate={{ opacity: 1, y: 20, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute text-3xl z-10"
                      style={{ left: grain.left, animationDelay: grain.delay }}
                    >
                      {grain.icon}
                    </motion.span>
                  ))}
                </AnimatePresence>
                <motion.div animate={riceGrains.length ? { scale: [1, 1.1, 1] } : {}} className="text-6xl relative z-20">
                  {recipientIcons[recipient].base}
                </motion.div>
              </div>

              <div className={`w-full h-3 rounded-full overflow-hidden mt-8 shadow-inner ${isDark ? 'bg-black/30' : 'bg-black/5'}`}>
                <motion.div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.5 }} />
              </div>
              <span className="text-[10px] font-semibold mt-3 block opacity-60">{milestone} / 500 for a full bowl</span>

              <div className="mt-8">
                <button onClick={handleShare} className={`w-full py-3.5 rounded-2xl text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50'}`}>
                  <Share2 size={16} /> Share Impact
                </button>
              </div>
            </motion.div>

            {/* Recipients Widget */}
            <div className={`p-6 rounded-[32px] border shadow-lg backdrop-blur-2xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/50'}`}>
              <h3 className="text-sm font-bold mb-4 opacity-80 px-2">Support Target</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(recipientIcons).slice(0, 4).map(([key, info]) => (
                  <button
                    key={key}
                    onClick={() => setRecipient(key)}
                    className={`p-4 rounded-[20px] text-sm font-semibold transition-all flex flex-col items-center gap-2 text-center border ${recipient === key ? 'bg-blue-500 text-white shadow-lg border-blue-400' : (isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-white/80 hover:bg-white shadow-sm')}`}
                  >
                    <span className="text-2xl">{info.base.slice(0, 2)}</span>
                    <span className="text-xs">{info.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Real-World Impact Gallery */}
        <div className="w-full mt-8">
          <div className={`p-8 rounded-[32px] shadow-lg backdrop-blur-2xl border overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/50'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Heart size={28} className="text-rose-500 fill-rose-500" />
              <h2 className="text-2xl font-bold tracking-tight">Real-World Impact</h2>
            </div>
            <p className="text-sm opacity-80 mb-8 max-w-3xl leading-relaxed">
              Every single grain of rice makes a difference. These are the actual street animals and communities you are helping feed every time you answer a question. <strong>Your knowledge is their survival.</strong>
            </p>
            
            <div className="relative w-full overflow-hidden rounded-[24px] h-56 flex items-center">
              {/* Infinite Scrolling Marquee */}
              <motion.div 
                className="flex gap-4 absolute left-0"
                animate={{ x: [0, -15000] }}
                transition={{ repeat: Infinity, duration: 250, ease: 'linear' }}
              >
                {Array.from({ length: 72 }).map((_, i) => (
                  <div key={i} className="w-40 h-56 shrink-0 rounded-[16px] overflow-hidden shadow-sm border border-white/10 group relative bg-black/10">
                    <img 
                      src={`/impact/impact-${i + 1}.jpeg`} 
                      alt={`Real-World Impact ${i + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <Heart size={16} className="text-white fill-white" />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      {/* AI Quiz Settings Modal */}
      <AnimatePresence>
        {showAIModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`w-full max-w-md p-8 rounded-[32px] shadow-2xl border ${isDark ? 'bg-[#1c1c1e] border-white/10' : 'bg-white/90 border-white/100 backdrop-blur-xl'}`}>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg rotate-3">
                <Cpu size={32} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">Custom AI Quiz</h3>
              <p className="text-sm text-center opacity-60 mb-8">
                Enter any topic and generate a quiz to feed charities!
              </p>

              <div className="mb-5">
                <label className="text-xs font-semibold ml-2 mb-2 block opacity-70">Topic</label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g., Space Exploration"
                  disabled={isGeneratingAI}
                  className={`w-full p-4 rounded-[16px] border outline-none transition-all shadow-inner ${isDark ? 'bg-black/30 border-white/10 focus:border-purple-500' : 'bg-gray-50 border-gray-200 focus:border-purple-400'}`}
                />
              </div>

              <div className="mb-8">
                <label className="text-xs font-semibold ml-2 mb-2 block opacity-70">Gemini API Key</label>
                <input
                  type="password"
                  value={aiKey}
                  onChange={e => setAiKey(e.target.value)}
                  placeholder="Paste AI key here..."
                  disabled={isGeneratingAI}
                  className={`w-full p-4 rounded-[16px] border outline-none transition-all shadow-inner ${isDark ? 'bg-black/30 border-white/10 focus:border-purple-500' : 'bg-gray-50 border-gray-200 focus:border-purple-400'}`}
                />
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGenerateAIQuiz}
                  disabled={isGeneratingAI}
                  className="w-full py-4 rounded-[20px] font-bold bg-black text-white dark:bg-white dark:text-black hover:scale-[1.02] disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isGeneratingAI ? 'Generating...' : 'Generate Quiz'}
                </button>
                <button onClick={() => setShowAIModal(false)} disabled={isGeneratingAI} className="py-4 font-semibold opacity-60 hover:opacity-100">Cancel</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showEmailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={`w-full max-w-sm p-8 rounded-[32px] shadow-2xl border text-center ${isDark ? 'bg-[#1c1c1e] border-white/10' : 'bg-white/90 border-white/100 backdrop-blur-xl'}`}>
              {!magicLinkSent ? (
                <>
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <User size={32} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Sign In</h3>
                  <p className="text-sm opacity-60 mb-8">Enter your email to receive a secure login link.</p>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full p-4 rounded-[16px] border outline-none transition-all shadow-inner mb-6 text-center ${isDark ? 'bg-black/30 border-white/10 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-400'}`}
                  />
                  <div className="flex flex-col gap-3">
                    <button onClick={sendMagicLink} disabled={isSendingMagicLink} className="w-full py-4 rounded-[20px] font-bold bg-blue-500 text-white hover:scale-[1.02] disabled:opacity-50 transition-all shadow-md shadow-blue-500/20">
                      {isSendingMagicLink ? 'Sending...' : 'Send Magic Link'}
                    </button>
                    <button onClick={() => setShowEmailModal(false)} className="py-4 font-semibold opacity-60 hover:opacity-100">Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Check your inbox</h3>
                  <p className="text-sm opacity-60 mb-8">We sent a magic link to {emailInput}. Click it to log in securely.</p>
                  <button onClick={() => setShowEmailModal(false)} className="py-4 font-semibold opacity-60 hover:opacity-100">Close</button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Announcement Modal */}
      <AnimatePresence>
        {showLevelUpModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-lg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 30 }}
              className={`w-full max-w-sm rounded-[32px] shadow-2xl border p-10 text-center relative overflow-hidden ${isDark ? 'bg-[#1c1c1e] border-white/10' : 'bg-white/90 border-white/100 backdrop-blur-xl'}`}
            >
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-400/20 blur-[60px] rounded-full pointer-events-none" />
              
              <div className="text-7xl mb-6 inline-block">🌟</div>
              <h3 className="text-3xl font-bold mb-2">Level Up!</h3>
              <p className="text-sm opacity-70 mb-8">Your impact is growing globally.</p>

              <div className={`p-6 rounded-[24px] mb-8 border shadow-inner ${isDark ? 'bg-black/30 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">New Rank</div>
                <div className="text-xl font-bold">
                  Level {levelUpData.level}: {levelUpData.title}
                </div>
              </div>

              <button
                onClick={() => setShowLevelUpModal(false)}
                className="w-full py-4 rounded-[20px] bg-blue-500 text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-blue-500/30"
              >
                Continue Playing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
