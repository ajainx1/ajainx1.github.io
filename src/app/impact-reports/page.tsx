import React from 'react';
import type { Metadata } from 'next';
import ClientImpactReports from '@/components/charity/ClientImpactReports';

export const metadata: Metadata = {
  title: 'Impact & Transparency Reports | CyberKarma Charity',
  description: 'See the real-world impact of CyberKarma. Field-verified feeding drive photos, monthly expenditure reports, and Karma Point tallies from our Patna volunteers.',
  alternates: { canonical: 'https://cyberkarma.me/impact-reports/' },
  openGraph: {
    title: 'CyberKarma Impact Reports — Radical Transparency',
    description: 'Every bowl funded, every feeding drive documented. Browse our field-verified monthly impact reports from Patna, Bihar.',
    url: 'https://cyberkarma.me/impact-reports/',
  },
};

export default function ImpactReportsPage() {
  return <ClientImpactReports />;
}

