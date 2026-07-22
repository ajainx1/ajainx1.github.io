"use client";

import { useState, useEffect } from "react";

export default function PWAInstallPrompt() {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile device or small screen width
    const checkMobile = () => {
      const userAgentMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const screenMobile = window.innerWidth < 768;
      setIsMobile(userAgentMobile || screenMobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true) {
      setIsStandalone(true);
      return;
    }

    // Check if device is iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIosDevice);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  // NEVER show on desktop browsers
  if (!isMobile || isStandalone || !showPrompt || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="text-slate-100 font-semibold text-sm">Install App</h4>
          {isIOS ? (
            <p className="text-slate-400 text-xs mt-1">
              Tap <span className="inline-block mx-1">Share</span> then <strong>Add to Home Screen</strong>
            </p>
          ) : (
            <p className="text-slate-400 text-xs mt-1">Install this app on your device for quick access.</p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {!isIOS && isInstallable && (
            <button
              onClick={handleInstallClick}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              Install
            </button>
          )}
          <button
            onClick={() => setShowPrompt(false)}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Close prompt"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
