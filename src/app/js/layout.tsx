import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Orca6™ — Automated Trading Platform by Jumpstreet',
  description: 'Orca6 automated trading indicator platform with sub-millisecond latency, VM hosting, and 24/7 VIP support.',
};

export default function JSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
