import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ & Contact | CyberKarma Charity Quiz',
  description: 'Frequently asked questions about CyberKarma. Learn how Karma Points work, how 200 points funds one bowl of food, and how to contact the team.',
  alternates: { canonical: 'https://cyberkarma.me/faq/' },
  openGraph: {
    title: 'FAQ & Contact — CyberKarma',
    description: 'Got questions? Learn how CyberKarma converts quiz answers into real food for street animals in Patna, Bihar.',
    url: 'https://cyberkarma.me/faq/',
  },
};

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many Karma Points equal a bowl of food?",
        "acceptedAnswer": { "@type": "Answer", "text": "It takes 200 Karma Points to fund one bowl of fresh curd and milk. Each correct standard question gives you 10 points, so you can feed an animal with just 20 correct answers!" }
      },
      {
        "@type": "Question",
        "name": "Who verifies the feeding drives?",
        "acceptedAnswer": { "@type": "Answer", "text": "Our local volunteers physically carry out the feeding drives in Patna. We upload field-verified photos directly to our Impact Reports gallery, complete with timestamps and geo-tags." }
      },
      {
        "@type": "Question",
        "name": "Is it really 100% free?",
        "acceptedAnswer": { "@type": "Answer", "text": "Yes. You never have to pay a single cent. The food is funded by the ethical advertisers and corporate sponsors displayed on the website." }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 sm:p-12 font-inter selection:bg-emerald-500/30">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-black font-title">FAQ & Contact</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold mb-2">How many Karma Points equal a bowl of food?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">It takes 200 Karma Points to fund one bowl of fresh curd and milk. Each correct standard question gives you 10 points, so you can feed an animal with just 20 correct answers!</p>
          </div>
          
          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold mb-2">Who verifies the feeding drives?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Our local volunteers physically carry out the feeding drives in Patna. We upload field-verified photos directly to our Impact Reports gallery, complete with timestamps and geo-tags.</p>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold mb-2">Is it really 100% free?</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Yes. You never have to pay a single cent. The food is funded by the ethical advertisers and corporate sponsors displayed on the website.</p>
          </div>
        </div>

        <div className="bg-emerald-950/20 p-8 rounded-3xl border border-emerald-500/20">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><Mail className="text-emerald-400" /> Contact Us</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Want to sponsor a feeding drive? Have questions about our impact? Or just want to say hi? We'd love to hear from you.
          </p>
          <a href="mailto:support@cyberkarma.me" className="inline-block px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-xl hover:bg-emerald-400 transition-colors">
            support@cyberkarma.me
          </a>
        </div>
      </div>
    </main>
  );
}
