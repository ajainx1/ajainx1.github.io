import React from 'react';
import CharityQuizClient from '@/components/charity/CharityQuizClient';
import { ToastProvider } from '@/components/js/ToastContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CyberKarma — Play Quizzes & Feed Animals',
  description: 'Play free cybersecurity quizzes and help feed stray animals. Every correct answer donates food to animals in need.',
  manifest: '/manifest-quiz.json',
};

export default function CyberKarmaHomePage() {
  return (
    <ToastProvider>
      <CharityQuizClient />
    </ToastProvider>
  );
}
