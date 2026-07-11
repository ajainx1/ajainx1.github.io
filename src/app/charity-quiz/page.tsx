import React from 'react';
import CharityQuizClient from '@/components/charity/CharityQuizClient';
import { ToastProvider } from '@/components/js/ToastContext';

export default function CharityQuizPage() {
  return (
    <ToastProvider>
      <CharityQuizClient />
    </ToastProvider>
  );
}
