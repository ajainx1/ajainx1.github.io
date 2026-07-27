import React from 'react';
import CharityQuizClient from '@/components/charity/CharityQuizClient';
import { ToastProvider } from '@/components/js/ToastContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CyberKarma — Play Quizzes & Feed Animals',
  description: 'Stake threat intelligence trivia answers to generate karmic impact.',
  manifest: '/manifest-quiz.json',
};

export default function CyberKarmaHomePage() {
  return (
    <ToastProvider>
      <CharityQuizClient />
    </ToastProvider>
  );
}
