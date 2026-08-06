import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono, Geist } from "next/font/google";
import "./globals.css";
import BackgroundWrapper from "@/components/3d/BackgroundWrapper";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import TelegramVisitorLogger from "@/components/TelegramVisitorLogger";
import SecurityGuard from "@/components/SecurityGuard";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "CyberKarma | Play Quizzes, Feed Street Dogs",
  description: "Play free quizzes. Every correct answer donates milk & curd to street dogs in Patna, India. Turn your trivia into real impact — 100% free.",
  keywords: ["quizzes", "quiz", "charity", "feed dogs", "learn", "kids", "educational games", "animal welfare", "free quiz game", "donate food", "ai quiz"],
  authors: [{ name: "CyberKarma Team", url: "https://cyberkarma.me" }],
  creator: "CyberKarma",
  publisher: "CyberKarma Charity",
  manifest: "/manifest-quiz.json",
  metadataBase: new URL("https://cyberkarma.me"),
  alternates: {
    canonical: "https://cyberkarma.me",
  },
  openGraph: {
    title: "CyberKarma | Play Quizzes & Feed Street Dogs",
    description: "Play free quizzes. Every correct answer donates milk & curd to street dogs in Patna, India. Turn your trivia into real impact.",
    url: "https://cyberkarma.me",
    siteName: "CyberKarma",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "CyberKarma Charity Quiz",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberKarma | Play Quizzes & Feed Animals",
    description: "Play free quizzes. Every correct answer donates milk & curd to street dogs in Patna, India.",
    images: ["/icon.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-6072468142870937',
    'theme-color': '#0b0f19',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CyberKarma",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "CyberKarma",
      "url": "https://cyberkarma.me",
      "description": "Play free educational quizzes and donate food to street dogs with every correct answer.",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Any",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "NGO",
      "name": "CyberKarma Charity Foundation",
      "url": "https://cyberkarma.me",
      "description": "Field-verified street animal feeding initiative operating in Patna, Bihar.",
      "sameAs": [
        "https://cyberkarma.me/impact-reports/"
      ]
    }
  ];

  return (
    <html lang="en" className={cn("dark", "font-sans", geist.variable)}>
      <head>
        <meta name="theme-color" content="#0b0f19" />
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
        className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased bg-[var(--bg)] text-[var(--fg)]`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 font-bold rounded-lg shadow-lg font-mono">
          Skip to main content
        </a>
        <noscript>
          <div className="p-6 bg-slate-900 text-emerald-400 text-center font-mono text-sm border-b border-emerald-500/30">
            <strong>CyberKarma requires JavaScript to play quizzes.</strong> Every question answered donates real food to feed street dogs in Patna, Bihar. Please enable JavaScript to continue.
          </div>
        </noscript>
        <BackgroundWrapper />
        <div aria-hidden="true" className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#128807]"></div>
        {children}
        <Footer />
        <CookieConsent />
        <PWAInstallPrompt />
        <TelegramVisitorLogger />
        <SecurityGuard />
      </body>
    </html>
  );
}
