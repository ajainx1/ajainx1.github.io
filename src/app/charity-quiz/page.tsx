import React from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const CharityQuizClient = dynamic(() => import('@/components/charity/CharityQuizClient'), {
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
      <p className="text-emerald-500 font-mono text-sm tracking-widest animate-pulse">LOADING CYBERKARMA...</p>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'CyberKarma Charity Quiz | Answer Questions, Feed Animals',
  description: 'Play free educational quizzes for all ages! Answer trivia questions and donate food to street dogs in Patna, Bihar.',
  alternates: { canonical: 'https://cyberkarma.me/charity-quiz/' },
};

export default function CharityQuizPage() {
  return <CharityQuizClient />;
}
