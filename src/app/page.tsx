import React from 'react';
import CharityQuizClient from '@/components/charity/CharityQuizClient';
import { ToastProvider } from '@/components/js/ToastContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CyberKarma — Play Free Quizzes & Feed Street Animals',
  description: 'CyberKarma (cyberkarma.me) is a free educational quiz platform. Answer questions across AI, SecOps, Animal Welfare & Science to donate real rice meals to street animals.',
  manifest: '/manifest-quiz.json',
};

export default function CyberKarmaHomePage() {
  return (
    <ToastProvider>
      <CharityQuizClient />
    </ToastProvider>
  );
}
