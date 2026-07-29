"use client";
import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

export default function MilestoneModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [visitorNumber, setVisitorNumber] = useState(3320);

  useEffect(() => {
    // Generate a pseudo-random, ever-increasing visitor number
    // using the current date/time to make it look realistic.
    const launchDate = new Date('2024-01-01').getTime(); 
    const now = Date.now();
    const hoursSinceLaunch = (now - launchDate) / (1000 * 60 * 60);
    // Base 3320 + ~12 visitors per hour since launch
    const calculatedVisitors = 3320 + Math.floor(hoursSinceLaunch * 12.4);
    
    // To make it slightly random but mostly consistent
    const randomFuzz = Math.floor(Math.random() * 5);
    
    setVisitorNumber(calculatedVisitors + randomFuzz);

    // Only show it once per session to avoid annoying the user on every refresh
    if (!sessionStorage.getItem('milestone_shown')) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        triggerConfetti();
        sessionStorage.setItem('milestone_shown', 'true');
      }, 1500); // Show after 1.5s
      return () => clearTimeout(timer);
    }
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="relative w-full max-w-sm rounded-2xl p-1 bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 shadow-2xl"
        >
          <div className="bg-white rounded-[14px] p-8 flex flex-col items-center text-center">
            <div className="text-5xl mb-4 animate-bounce">🏆</div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-3 font-serif">
              Milestone Visitor!
            </h2>
            
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Congratulations! You are visitor <span className="font-bold text-emerald-600">#{visitorNumber.toLocaleString()}</span> to CyberKarma.
            </p>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-[#0b3d60] hover:bg-[#072c47] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              Continue to Portal
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
