import React from 'react';
import dynamic from 'next/dynamic';
const CharityQuizClient = dynamic(() => import('@/components/charity/CharityQuizClient'), {
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
      <p className="text-emerald-500 font-mono text-sm tracking-widest animate-pulse">LOADING CYBERKARMA...</p>
    </div>
  )
});
import { ToastProvider } from '@/components/js/ToastContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CyberKarma | Answer Questions, Feed Animals',
  description: 'Play fun, educational quizzes and help feed stray dogs. Every correct answer donates milk and curd to animals in need.',
  manifest: '/manifest-quiz.json',
};

export default function CyberKarmaHomePage() {
  return (
    <ToastProvider>
      <CharityQuizClient />
    </ToastProvider>
  );
}
