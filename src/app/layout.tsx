import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';
const Background3D = dynamic(() => import('@/components/3d/Background3D'), { ssr: false });
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
  title: "CyberKarma — Play Free Quizzes & Feed Street Animals",
  description: "CyberKarma (cyberkarma.me) is a free educational quiz platform. Answer questions across AI, SecOps, Animal Welfare & Science to donate real rice meals to street animals.",
  manifest: "/manifest-quiz.json",
  metadataBase: new URL("https://cyberkarma.me"),
  alternates: {
    canonical: "https://cyberkarma.me",
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
        <Background3D />
        <div className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#128807]"></div>
        {children}
        <PWAInstallPrompt />
        <TelegramVisitorLogger />
        <SecurityGuard />
      </body>
    </html>
  );
}
