"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Global3DBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    // 1. Add Three.js script to document body if not present
    let threeScript = document.querySelector('script[src*="three.min.js"]') as HTMLScriptElement;
    if (!threeScript) {
      threeScript = document.createElement("script");
      threeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      threeScript.async = true;
      document.body.appendChild(threeScript);
    }

    const initVanta = () => {
      // 2. Add Vanta.net script to document body if not present
      let vantaScript = document.querySelector('script[src*="vanta.net.min.js"]') as HTMLScriptElement;
      if (!vantaScript) {
        vantaScript = document.createElement("script");
        vantaScript.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js";
        vantaScript.async = true;
        document.body.appendChild(vantaScript);
      }

      const tryInit = () => {
        const VANTA = (window as any).VANTA;
        if (VANTA && VANTA.NET && vantaRef.current) {
          const isLight = document.body.classList.contains("light-mode") || document.body.classList.contains("theme-light");
          try {
            const effect = VANTA.NET({
              el: vantaRef.current,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: isLight ? 0x0f4c81 : 0x38bdf8,
              backgroundColor: isLight ? 0xf8fafc : 0x0b0f19,
              points: 15.0,
              maxDistance: 24.0,
              spacing: 18.0,
              showDots: true,
            });
            setVantaEffect(effect);
          } catch (err) {
            console.error("Vanta initialization error:", err);
          }
        } else {
          // Retry in case loading takes a brief moment
          setTimeout(tryInit, 100);
        }
      };

      if (threeScript.onload) {
        // Scripts are ready or already loading
        tryInit();
      } else {
        vantaScript.onload = tryInit;
      }
    };

    if (window.hasOwnProperty("THREE")) {
      initVanta();
    } else {
      threeScript.onload = initVanta;
    }

    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.destroy();
        } catch (e) {
          // ignore destroy errors on unmount
        }
      }
    };
  }, []);

  // Sync Vanta theme configuration when light/dark mode changes on body class list
  useEffect(() => {
    if (vantaEffect) {
      const updateVantaTheme = () => {
        const isLight = document.body.classList.contains("light-mode") || document.body.classList.contains("theme-light");
        try {
          vantaEffect.setOptions({
            color: isLight ? 0x0f4c81 : 0x38bdf8,
            backgroundColor: isLight ? 0xf8fafc : 0x0b0f19,
          });
        } catch (e) {
          // Vanta effect might be destroyed or in transition
        }
      };

      const observer = new MutationObserver(updateVantaTheme);
      observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

      // Trigger initial sync
      updateVantaTheme();

      return () => observer.disconnect();
    }
  }, [vantaEffect]);

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10 w-screen h-screen transition-opacity duration-700"
      style={{ pointerEvents: "none" }}
    />
  );
}
