import type { Metadata } from "next";
import { Inter, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Aditya Jain — Cybersecurity Engineer & SME",
  description: "Portfolio of Aditya Jain — 5+ years enterprise SecOps, EDR/SIEM SME, Purple Teaming, and AI Automation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${outfit.variable} ${mono.variable} antialiased bg-[var(--bg)] text-[var(--fg)]`}
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#ff9933] via-white to-[#128807]"></div>
        {children}
      </body>
    </html>
  );
}
