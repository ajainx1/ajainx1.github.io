import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CyberKarma',
  description: 'Read the CyberKarma Privacy Policy. We use minimal data collection. Your scores are stored locally. We use Google AdSense and may use AI providers for the Custom Quiz feature.',
  alternates: { canonical: 'https://cyberkarma.me/privacy/' },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 font-inter">
      <div className="max-w-3xl mx-auto space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold font-title">Privacy Policy</h1>
        <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
          <p>Last updated: July 2026</p>
          
          <h2 className="text-xl font-bold text-white mt-8">1. Information We Collect</h2>
          <p>We believe in minimal data collection. You do not need to create an account to play CyberKarma. Your score, streak, and lifetime Karma Points are stored locally on your device using browser LocalStorage.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">2. Third-Party Services</h2>
          <p>We use third-party advertising networks (like Google AdSense) to fund our charity drives. These partners may use cookies or similar technologies to serve personalized ads based on your visit to this and other websites.</p>
          
          <h2 className="text-xl font-bold text-white mt-8">3. AI Services</h2>
          <p>If you use the Custom AI Quiz feature, the topic you enter is sent to an AI provider (e.g., Google Gemini or Ollama) to generate the questions. Do not enter sensitive personal information into the AI prompt.</p>

          <h2 className="text-xl font-bold text-white mt-8">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, you can contact us at support@cyberkarma.me.</p>
        </div>
      </div>
    </main>
  );
}
