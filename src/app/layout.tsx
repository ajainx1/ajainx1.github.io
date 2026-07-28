import type { Metadata, Viewport } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackgroundWrapper from "@/components/3d/BackgroundWrapper";
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
  title: "Aditya Jain - Cybersecurity Engineer & SME",
  description: "Portfolio of Aditya Jain - Enterprise SecOps, EDR/SIEM SME, Purple Teaming, Threat Hunting, and Security Automation.",
  keywords: ["Aditya Jain", "Cybersecurity Engineer", "SecOps", "SIEM", "EDR", "Purple Teaming", "Threat Hunting", "SOC", "Security Automation"],
  authors: [{ name: "Aditya Jain", url: "https://adityasec32.systems" }],
  creator: "Aditya Jain",
  publisher: "Aditya Jain",
  metadataBase: new URL("https://adityasec32.systems"),
  alternates: {
    canonical: "https://adityasec32.systems",
  },
  openGraph: {
    title: "Aditya Jain - Cybersecurity Engineer & SME",
    description: "Enterprise SecOps, EDR/SIEM SME, Purple Teaming, Threat Hunting, and Security Automation.",
    url: "https://adityasec32.systems",
    siteName: "Aditya Jain Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aditya Jain - Cybersecurity Engineer & SME",
    description: "Enterprise SecOps, EDR/SIEM SME, Purple Teaming, Threat Hunting, and Security Automation.",
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
    'theme-color': '#0f172a',
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
