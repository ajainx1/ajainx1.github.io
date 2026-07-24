import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background3D from "@/components/3d/Background3D";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import TelegramVisitorLogger from "@/components/TelegramVisitorLogger";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Aditya Jain — Cybersecurity Engineer & SME",
  description: "Portfolio of Aditya Jain — 4+ years enterprise SecOps, EDR/SIEM SME, Purple Teaming, and Threat Hunting.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://adityasec32.systems"),
  alternates: {
    canonical: "https://adityasec32.systems",
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
        <meta name="google-adsense-account" content="ca-pub-6072468142870937" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6072468142870937"
          crossOrigin="anonymous"
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
      </body>
    </html>
  );
}
