"use client";

import dynamic from 'next/dynamic';

// Dynamically import the 3D background with SSR disabled to prevent Server Component hydration errors
// and to ensure heavy Three.js assets are only loaded on the client after the main paint.
const Background3D = dynamic(() => import('./Background3D'), { 
  ssr: false,
  loading: () => null
});

export default function BackgroundWrapper() {
  return <Background3D />;
}
