'use client';

import { useEffect } from 'react';
import Head from 'next/head';

export default function JumpstreetRedirect() {
  useEffect(() => {
    // Perform the redirect on the client-side
    window.location.replace('https://jumpstreet.tech');
  }, []);

  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content="0; url=https://jumpstreet.tech" />
        <title>Redirecting to Jumpstreet.tech...</title>
      </Head>
      <div className="min-h-screen bg-[#0f0414] flex items-center justify-center font-sans text-white">
        <div className="text-center flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Redirecting to Jumpstreet.tech...</h1>
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
