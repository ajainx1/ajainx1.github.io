import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
const BackgroundWrapper = dynamic(() => import('@/components/3d/BackgroundWrapper'), { ssr: false });
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import TelegramVisitorLogger from "@/components/TelegramVisitorLogger";
import SecurityGuard from "@/components/SecurityGuard";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "CyberKarma | Play Free Quizzes, Learn & Feed Street Animals",
  description: "Play free educational quizzes for kids and adults! Answer questions about AI, science, and charity. Every correct answer donates real food to feed street dogs and animals.",
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
    title: "CyberKarma | Play Quizzes & Feed Street Animals",
    description: "Learn and donate! Play free educational quizzes and help feed street dogs and animals with every correct answer.",
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
    description: "Learn and donate! Play free educational quizzes and help feed street dogs and animals with every correct answer.",
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
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="theme-color" content="#000000" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CyberKarma",
              "url": "https://cyberkarma.me",
              "description": "Play free educational quizzes for kids and adults! Answer questions about AI, science, and charity. Every correct answer donates real food to feed street dogs and animals.",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "NGO",
                "name": "CyberKarma Charity",
                "url": "https://cyberkarma.me"
              }
            })
          }}
        />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta name="google-adsense-account" content="ca-pub-6072468142870937" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6072468142870937"
          crossOrigin="anonymous"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if (typeof window !== 'undefined' && window.location.protocol === 'http:' && window.location.hostname !== 'localhost') { window.location.replace('https://' + window.location.hostname + window.location.pathname + window.location.search); }`,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased bg-[var(--bg)] text-[var(--fg)]`}
      >
        <BackgroundWrapper />
        <div className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#128807]"></div>
        {children}
        <PWAInstallPrompt />
        <TelegramVisitorLogger />
        <SecurityGuard />
      </body>
    </html>
  );
}
