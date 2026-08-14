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
  title: "CyberKarma — Answer a Quiz, Feed an Animal 🐾",
  description: "Play free educational cybersecurity, nature & trivia quizzes. 100% of ethical ad revenue (Google AdSense) directly funds milk, curd & food for stray animals in Patna, India.",
  keywords: [
    "CyberKarma",
    "Cyber Free Rice",
    "Answer quiz feed animal",
    "Free cybersecurity quiz",
    "Animal charity quiz India",
    "Patna stray dog feeding",
    "Digital daanam",
    "Aditya Jain"
  ],
  manifest: "/manifest.json",
  metadataBase: new URL("https://cyberkarma.me"),
  alternates: {
    canonical: "https://cyberkarma.me",
  },
  openGraph: {
    title: "CyberKarma — Answer a Quiz, Feed an Animal 🐾",
    description: "Play free educational cybersecurity & trivia quizzes to fund real stray animal feeding drives in Patna, India. 100% ad-funded, zero user donations.",
    url: "https://cyberkarma.me",
    siteName: "CyberKarma",
    images: [
      {
        url: "/cyberkarma_hero_banner.jpg",
        width: 1200,
        height: 630,
        alt: "CyberKarma — Answer a Quiz, Feed an Animal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CyberKarma — Answer a Quiz, Feed an Animal 🐾",
    description: "Play free educational cybersecurity & trivia quizzes to fund real stray animal feeding drives in Patna, India.",
    images: ["/cyberkarma_hero_banner.jpg"],
  },
  other: {
    'google-adsense-account': 'ca-pub-6072468142870937',
    'theme-color': '#070b14',
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "name": "CyberKarma Initiative",
    "url": "https://cyberkarma.me",
    "founder": {
      "@type": "Person",
      "name": "Aditya Jain",
      "jobTitle": "Cybersecurity Engineer",
      "url": "https://adityasec32.systems"
    },
    "description": "Play free educational cybersecurity & trivia quizzes to fund real stray animal feeding drives in Patna, Bihar, India.",
    "areaServed": "Patna, Bihar, India",
    "nonprofitStatus": "Nonprofit501c3"
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="theme-color" content="#070b14" />
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
        className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased bg-[#070b14] text-[#e2e8f0]`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-slate-950 font-bold rounded-lg shadow-lg font-mono">
          Skip to main content
        </a>
        <Background3D />
        <div aria-hidden="true" className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#128807]"></div>
        {children}
        <CookieConsent />
        <PWAInstallPrompt />
        <TelegramVisitorLogger />
      </body>
    </html>
  );
}
