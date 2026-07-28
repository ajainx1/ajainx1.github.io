'use client';

import { useEffect } from 'react';

export default function JumpstreetRedirect() {
  useEffect(() => {
    // Fallback redirect on the client-side
    window.location.replace('https://jumpstreet.tech');
  }, []);

  return (
    <>
      {/* Raw script tag for instant redirect before React hydrates */}
      <script dangerouslySetInnerHTML={{ __html: `window.location.replace('https://jumpstreet.tech');` }} />
      <meta httpEquiv="refresh" content="0; url=https://jumpstreet.tech" />
      
      <div className="min-h-screen bg-[#0f0414] flex items-center justify-center font-sans text-white">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Redirecting to JumpStreet Tech...</h1>
          <p className="text-slate-400">Please wait while we securely transfer you to the trading platform.</p>
          <a 
            href="https://jumpstreet.tech" 
            className="mt-6 text-emerald-400 hover:text-emerald-300 underline font-medium text-sm"
          >
            Click here if you are not redirected automatically
          </a>
        </div>
      </div>
    </>
  );
}
