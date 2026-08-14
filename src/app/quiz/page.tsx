import React from 'react';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const CharityQuizClient = dynamic(() => import('@/components/charity/CharityQuizClient'), {
  loading: () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0b0f19]">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
      <p className="text-emerald-500 font-mono text-sm tracking-widest animate-pulse">LOADING CYBERKARMA QUIZ...</p>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'Play CyberKarma Quiz | Answer Trivia, Feed Stray Animals',
  description: 'Answer cybersecurity, science, and general knowledge questions to fund real stray dog and bird feeding drives in Patna, India.',
  alternates: { canonical: 'https://cyberkarma.me/quiz/' },
};

export default function QuizPage() {
  return <CharityQuizClient />;
}
