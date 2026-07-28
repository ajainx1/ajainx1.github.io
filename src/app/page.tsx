import React from 'react';
import CharityQuizClient from '@/components/charity/CharityQuizClient';
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
