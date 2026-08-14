import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background3D from "@/components/3d/Background3D";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import TelegramVisitorLogger from "@/components/TelegramVisitorLogger";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Aditya Jain — Cybersecurity Engineer & Purple Teamer",
  description: "Network Security & NGFW Architecture (Palo Alto · Check Point · Fortinet) · VAPT · SIEM/EDR · DFIR — securing 750+ government endpoints & Critical National Infrastructure.",
  keywords: [
    "Aditya Jain",
    "Cybersecurity Engineer",
    "Purple Teamer",
    "SecOps",
    "Threat Hunting",
    "SentinelOne",
    "Wazuh SIEM",
    "Check Point NGFW",
    "Fortinet FortiGate",
    "Palo Alto",
    "DFIR",
    "VAPT",
    "Active Directory Security",
    "NIST CSF",
    "CERT-In"
  ],
  manifest: "/manifest.json",
  metadataBase: new URL("https://adityasec32.systems"),
  alternates: {
    canonical: "https://adityasec32.systems",
  },
  openGraph: {
    title: "Aditya Jain — Cybersecurity Engineer & Purple Teamer",
    description: "Network Security & NGFW Architecture (Palo Alto · Check Point · Fortinet) · VAPT · SIEM/EDR · DFIR — securing 750+ government endpoints & Critical National Infrastructure.",
    url: "https://adityasec32.systems",
    siteName: "AdityaSec Systems",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Aditya Jain — Cybersecurity Engineer & Purple Teamer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Jain — Cybersecurity Engineer & Purple Teamer",
    description: "Network Security & NGFW Architecture (Palo Alto · Check Point · Fortinet) · VAPT · SIEM/EDR · DFIR — securing 750+ government endpoints & Critical National Infrastructure.",
    images: ["/og_image.png"],
  },
  other: {
    'google-adsense-account': 'ca-pub-6072468142870937',
    'theme-color': '#020617',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Aditya Jain",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Aditya Jain",
    "jobTitle": "Cybersecurity Engineer & Purple Teamer",
    "url": "https://adityasec32.systems",
    "knowsAbout": [
      "Cybersecurity",
      "Network Security",
      "Purple Teaming",
      "Threat Hunting",
      "SentinelOne EDR",
      "Wazuh SIEM",
      "Check Point NGFW",
      "Fortinet FortiGate",
      "Active Directory Security",
      "Incident Response",
      "DFIR"
    ],
    "sameAs": [
      "https://cyberkarma.me",
      "https://github.com/ajainx1",
      "https://www.linkedin.com/in/adityajainx1/"
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#020617" />
        <meta name="google-adsense-account" content="ca-pub-6072468142870937" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <Script
          id="sw-register"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function() { navigator.serviceWorker.register('/sw.js').catch(function(err){}); }); }`
          }}
        />
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6072468142870937"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 font-bold rounded-lg shadow-lg font-mono">
          Skip to main content
        </a>
        <noscript>
          <div className="p-6 bg-slate-900 text-emerald-400 text-center font-mono text-sm border-b border-emerald-500/30">
            <strong>Aditya Jain SecOps Portfolio requires JavaScript.</strong> 4+ years Enterprise SecOps, EDR/SIEM SME, Purple Teaming & Threat Hunting.
          </div>
        </noscript>
        <Background3D />
        <div aria-hidden="true" className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#128807]"></div>
        {children}
        <Footer />
        <CookieConsent />
        <PWAInstallPrompt />
        <TelegramVisitorLogger />
      </body>
    </html>
  );
}
