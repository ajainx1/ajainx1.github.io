"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Terminal as TermIcon,
  Download, 
  ArrowRight, 
  Mail, 
  CheckCircle2, 
  Lock, 
  ExternalLink, 
  Award, 
  BookOpen, 
  Briefcase, 
  Layers, 
  MapPin, 
  Globe, 
  Code2, 
  X, 
  FileText,
  KeyRound,
  Send,
  Sparkles,
  Menu,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import TiltWrapper from "@/components/3d/TiltWrapper";
import CyberResumeButton from "@/components/CyberResumeButton";

// Interactive Terminal Data
const COMMANDS = {
  help: [
    "Available commands:",
    "  whoami      - Display professional profile summary",
    "  skills      - List core technical competencies & NGFW stacks",
    "  exp         - View verified enterprise employment history",
    "  education   - View academic degrees & MBA (Cybersecurity)",
    "  certs       - View active & targeted certifications",
    "  contact     - Display direct contact channels & relocation status",
    "  clear       - Clear terminal output"
  ],
  whoami: [
    "aditya@secops:~$ cat whoami.json",
    "{",
    "  \"name\": \"Aditya Jain\",",
    "  \"title\": \"Cybersecurity Engineer | Network Security & NGFW Architecture\",",
    "  \"specialization\": \"Palo Alto/Check Point/Fortinet NGFW, VAPT, SIEM/EDR, DFIR\",",
    "  \"experience\": \"4+ Years Enterprise SecOps & CNI Defense\",",
    "  \"current\": \"Security Administrator & NGFW Architect @ Ebix / NIC (MeitY)\",",
    "  \"impact\": \"750+ Endpoints Secured · 60% Audit Effort Saved · +35% True-Positives\",",
    "  \"education\": \"MBA (Cybersecurity) in progress · B.Tech CSE (Manipal)\",",
    "  \"phone\": \"+91 74005 88896\",",
    "  \"email\": \"adityasec32@gmail.com / contact@adityasec32.systems\",",
    "  \"relocation\": \"Preferred: Delhi NCR / Noida · Open: Blr/Hyd/Pune/Mum/Jaipur · UAE · SG · UK · Germany · EU · US\"",
    "}"
  ],
  skills: [
    "aditya@secops:~$ list-competencies --verbose",
    "• Network Security & NGFW : Palo Alto (Panorama, App-ID, Threat Prev), Check Point, Fortinet, Default-Deny, ZTNA, OSPF, TACACS+/RADIUS, Wireshark",
    "• Offensive & VAPT        : Web & Infra VAPT, OWASP Top 10, Active Directory Exploitation (BloodHound, Kerberoasting, DCSync, Impacket, Mimikatz, Rubeus, Hashcat, NetExec, Burp Suite Pro, Nmap)",
    "• SIEM / EDR & Hunting    : Wazuh, Splunk, SentinelOne, Trend Micro Deep Security, Microsoft Sentinel, Kaspersky EDR, Snort, MITRE ATT&CK",
    "• Compliance & Cloud      : CERT-In Guidelines, CDAC Standards, NIST CSF, ISO 27001, AWS/Azure Fundamentals, Python, Bash, PowerShell, Git, RAM Dump Analysis"
  ],
  exp: [
    "aditya@secops:~$ get-history",
    "• Ebix Technologies / Client: NIC (MeitY) (Security Admin & NGFW Architect) - Feb 2024 to Present",
    "  - Default-deny Palo Alto/Check Point clusters; managed SentinelOne/Deep Security/Wazuh across 750+ endpoints; automated 120+ CERT-In checks (60% audit cut)",
    "• Independent Security Researcher (Offensive Security & AD Exploitation) - Aug 2023 to Jan 2024",
    "  - Advanced AD exploitation labs (HTB, VulnLab multi-forest, Kerberoasting, DCSync, DC compromise)",
    "• RRG Engineering / Client: DAE Nuclear Fuel Complex (SOC Analyst - Threat Hunter) - Dec 2022 to Jul 2023",
    "  - 24x7 CNI nuclear SOC threat hunting; Blu Sapphire SIEM / Splunk; +35% true-positive detection boost",
    "• E2E Networks Limited (SOC Analyst - IDS & Signatures) - Aug 2022 to Oct 2022",
    "  - Authored Snort & Wazuh signatures; automated AbuseIPDB perimeter IP blocklisting",
    "• Teleperformance (Technical Support Executive - Microsoft Enterprise) - Dec 2021 to May 2022",
    "  - Tier-2 Microsoft enterprise support with strict SLA compliance"
  ],
  education: [
    "aditya@secops:~$ get-education",
    "• Chitkara University (Punjab, India) - MBA in Cybersecurity (In Progress, Exp: Jul 2027)",
    "• Manipal University Jaipur (Rajasthan, India) - B.Tech in Computer Science & Engineering (2019 - 2022)",
    "• Hindu College of Engineering (Haryana, India) - Diploma in Computer Science & Engineering (2013 - 2018)"
  ],
  certs: [
    "aditya@secops:~$ list-certs",
    "[Earned & Verified]",
    "• Fortinet Certified Associate (FCA) in Cybersecurity (Jan 2026)",
    "• EC-Council: In the Trenches - SOC",
    "[In Progress & Targeted]",
    "• eJPT (Junior Penetration Tester) - Target: Q4 2026",
    "• CEH v13 (Certified Ethical Hacker) - Target: 2026",
    "• CISSP (Information Systems Security) - Target: Q3 2027",
    "• OSCP (Offensive Security Certified Professional) - Target: 2027+",
    "• MBA in Cybersecurity (Chitkara University - In Progress)"
  ],
  contact: [
    "aditya@secops:~$ show-contact",
    "• Phone     : +91 74005 88896",
    "• Email     : adityasec32@gmail.com / contact@adityasec32.systems",
    "• LinkedIn  : https://www.linkedin.com/in/ajainx1",
    "• GitHub    : https://github.com/ajainx1",
    "• Portfolio : https://adityasec32.systems",
    "• Location  : Patna, India (On-site: NIC, MeitY) | Preferred: Delhi NCR / Noida",
    "• Relocation: Open to India (Blr/Hyd/Pune/Mum/Jaipur), UAE, Singapore, UK, Germany (EU Blue Card), EU, US"
  ]
};

interface WriteUp {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  tags: string[];
  content: {
    overview: string;
    methodology: string[];
    takeaways: string[];
  };
}

const WRITE_UPS: WriteUp[] = [
  {
    id: "kerberoasting-dcsync",
    title: "Kerberoasting → DCSync: Chaining AD Attacks in a Multi-Forest Lab",
    category: "Offensive Security / Active Directory",
    readTime: "7 min read",
    date: "Aug 2026",
    summary: "Deep-dive analysis on requesting TGS tickets for SPN accounts, cracking RC4/AES hashes with Hashcat, escalating through nested delegation groups, and executing DCSync via Impacket secretsdump.",
    tags: ["Active Directory", "Kerberos", "BloodHound", "Impacket", "DCSync", "Purple Team"],
    content: {
      overview: "Active Directory remains the primary target for enterprise compromise. In this multi-forest lab simulation, we chain credential harvesting against service accounts (SPNs) through privilege escalation vectors directly to full Domain Controller replication (DCSync).",
      methodology: [
        "Phase 1 - Reconnaissance: Enumerated Service Principal Names (SPNs) using PowerView (Get-DomainUser -SPN) and Impacket's GetUserSPNs.py without administrative privileges.",
        "Phase 2 - Kerberoasting: Requested TGS tickets for high-value service accounts, exported tickets, and cracked hashes offline using Hashcat mode 13100 (RC4) and 18200 (AES-256).",
        "Phase 3 - Lateral Movement: Leveraged cracked Tier-1 service credentials with BloodHound path graphing to discover unconstrained delegation on an auxiliary backup server.",
        "Phase 4 - Domain Compromise: Exploited DS-Replication-Get-Changes-All permissions to execute remote DCSync using Impacket secretsdump.py, dumping the KRBTGT hash."
      ],
      takeaways: [
        "Enforce 25+ character complex passwords or Group Managed Service Accounts (gMSA) to render offline Kerberoasting crack attempts mathematically infeasible.",
        "Disable RC4-HMAC encryption domain-wide, enforcing AES-128 / AES-256 Kerberos ticket encryption.",
        "Deploy honeypot SPN service accounts with Wazuh SIEM alerting on Event ID 4769 (Kerberos Ticket Request with 0x17 ticket encryption)."
      ]
    }
  },
  {
    id: "cert-in-automation",
    title: "Automating 120+ CERT-In Checks with PowerShell & KACE UEM",
    category: "SecOps / Compliance Automation",
    readTime: "5 min read",
    date: "Jul 2026",
    summary: "How we engineered a scalable PowerShell & Python framework across 750+ government endpoints, reducing manual security audit cycles by 60% while hardening critical CIS/NIST baselines.",
    tags: ["PowerShell", "KACE UEM", "NIST CSF", "CERT-In", "Registry Hardening"],
    content: {
      overview: "Managing compliance across 750+ distributed government endpoint nodes historically required weeks of manual checklist verifications. By architecting an automated modular PowerShell agent orchestrated via KACE UEM, audit turnaround was compressed from 14 days to under 4 hours.",
      methodology: [
        "Architecture Design: Developed a 120-check modular PowerShell auditing script verifying USB storage restrictions, SMBv1 deprecation, Local Admin password rotation (LAPS), and firewall state.",
        "Telemetry Aggregation: Structured audit outputs as cryptographic SHA-256 JSON payloads transmitted over mutual TLS to a centralized compliance database.",
        "Automated Remediation: Configured automated rollback scripts that instantly re-enforced Group Policy Object (GPO) registry keys whenever deviation was detected.",
        "Executive Reporting: Integrated Python data pipelines to render real-time compliance scorecards across all 38 district operational zones."
      ],
      takeaways: [
        "60% reduction in manual engineer audit cycles across 750+ government offices.",
        "Zero-day remediation visibility for unauthorized peripheral devices and dormant local accounts.",
        "Established automated compliance evidence generation mapped directly to ISO 27001 and CERT-In mandates."
      ]
    }
  },
  {
    id: "wazuh-splunk-tuning",
    title: "Tuning Wazuh + Splunk: Cutting False Positives by 30% in CNI SOC",
    category: "Detection Engineering / SIEM",
    readTime: "6 min read",
    date: "Jun 2026",
    summary: "Practical detection engineering guide on optimizing correlation rules, establishing contextual noise baselines, and increasing true-positive threat hunting efficacy in a 24x7 nuclear SOC environment.",
    tags: ["Wazuh", "Splunk", "Detection Engineering", "Sigma Rules", "SOC Optimization"],
    content: {
      overview: "Alert fatigue is the primary vulnerability in high-throughput 24x7 SOC environments. At the Nuclear Fuel Complex (NFC) CNI monitoring center, custom rule tuning and baseline filtering resulted in a +35% boost in true-positive alert efficacy.",
      methodology: [
        "Baseline Noise Profiling: Identified top noisy Event IDs (Sysmon 1, 3, 7, and Security 4688) generated by routine administrative maintenance scripts and automated backup jobs.",
        "Contextual Correlation: Converted static single-event triggers into multi-stage Sigma correlation rules (e.g., PowerShell encoded execution followed immediately by outbound DNS query to non-standard TLD).",
        "EDR Behavioral Pairing: Cross-correlated Wazuh SIEM alerts with Kaspersky & SentinelOne EDR telemetry to auto-enrich alerts with parent-child process trees and process hash reputations.",
        "Continuous Purple Team Testing: Validated rule efficacy using Atomic Red Team simulations, confirming zero suppression of genuine TTPs."
      ],
      takeaways: [
        "Reduced daily alert volume by 30%, allowing Level 2/3 analysts to focus exclusively on high-fidelity indicators.",
        "Boosted true-positive detection rate by 35% across lateral movement and privilege escalation phases.",
        "Documented reproducible detection playbooks for rapid triage of living-off-the-land binaries (LOLBins)."
      ]
    }
  }
];

export default function Home() {
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    "aditya@secops:~# secure session initialized...",
    "SEC_CORE: ACTIVE | 750+ ENDPOINTS HARDENED",
    "Type 'whoami' or 'help' for available commands.",
    ""
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);
  const [caseStudyModal, setCaseStudyModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [contactMessage, setContactMessage] = useState<string>("");
  const [contactSent, setContactSent] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let response: string[] = [];
    if (cmd === "clear") {
      setTerminalHistory([]);
      setTerminalInput("");
      return;
    } else if (cmd in COMMANDS) {
      response = COMMANDS[cmd as keyof typeof COMMANDS];
    } else {
      response = [`aditya@secops:~$ ${cmd}`, `Command '${cmd}' not recognized. Type 'help' for instructions.`];
    }

    setTerminalHistory((prev) => [...prev, `aditya@secops:~$ ${terminalInput}`, ...response, ""]);
    setTerminalInput("");
  };

  const runTerminalShortcut = (cmd: string) => {
    let response = COMMANDS[cmd as keyof typeof COMMANDS];
    if (cmd === "clear") {
      setTerminalHistory([]);
      return;
    }
    setTerminalHistory((prev) => [...prev, `aditya@secops:~$ ${cmd}`, ...response, ""]);
  };

  const handleQuickContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage) return;
    window.location.href = `mailto:contact@adityasec32.systems?subject=Portfolio Inquiry via adityasec32.systems&body=${encodeURIComponent(contactMessage)}`;
    setContactSent(true);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-[#020617] text-[#E8EAE6] selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Background Cyber Mesh with Motion Reduction Respect */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[#020617]/75 backdrop-blur-[1px]" />
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-15 bg-emerald-700 pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] rounded-full blur-[150px] opacity-10 bg-cyan-700 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.04),rgba(255,255,255,0))]" />
      </div>

      {/* CISO / Recruiter Sanitization Trust Banner */}
      <div className="w-full bg-emerald-950/70 border-b border-emerald-500/20 py-1.5 px-4 text-center text-[11px] font-mono font-semibold text-emerald-300 backdrop-blur-md relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>All government case studies &amp; project demos are sanitized recordings &amp; mock telemetry; zero live state infrastructure is exposed.</span>
        </div>
      </div>

      {/* Sticky 5-Section Navigation Header (Mercury 5) */}
      <header className="sticky top-0 z-40 w-full border-b border-emerald-500/10 bg-[#020617]/85 backdrop-blur-2xl shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-title font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 shadow-md shadow-emerald-500/20 px-2 py-0.5 rounded-lg text-sm font-black font-mono">AJ</span>
            <span className="text-white">Aditya<span className="text-emerald-400">.</span>Jain</span>
          </Link>
          
          {/* Exactly Five Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
            <a 
              href="#projects" 
              className="relative group px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-500/25 hover:border-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
              title="Explore Planetary Defense Grid & Case Studies"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-180 transition-transform duration-700" />
              <span className="tracking-widest">Projects &bull; Orbit</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
            </a>
            <a href="#writeups" className="hover:text-emerald-400 transition-colors">Write-Ups</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </nav>

          {/* Right Permanent Resume CTA */}
          <div className="flex items-center gap-3">
            <CyberResumeButton variant="nav" />

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-6 py-4 space-y-3 text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-emerald-400">Home</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-emerald-400">Projects</a>
            <a href="#writeups" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-emerald-400">Write-Ups</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-emerald-400">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 hover:text-emerald-400">Contact</a>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-24 sm:space-y-32 relative z-10">
        
        {/* TIER 1: HERO SECTION */}
        <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[calc(100vh-14rem)]">
          <div className="lg:col-span-7 space-y-7">
            
            {/* Purple Teamer Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/40 backdrop-blur-xl text-xs font-mono font-bold text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>PURPLE TEAMER &bull; CNI THREAT HUNTER &bull; SECOPS SME</span>
            </div>

            {/* H1 & Master H2 Headline */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-6xl font-black font-title tracking-tight text-white leading-tight">
                Aditya Jain
              </h1>
              
              <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-title leading-snug">
                Cybersecurity Engineer | Network Security &amp; NGFW Architecture | VAPT &bull; SIEM/EDR &bull; DFIR
              </h2>

              {/* One-Line Value Prop with Proof */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl pt-1">
                Securing 750+ government endpoints &amp; Critical National Infrastructure &mdash; cutting audit effort 60% and lifting detection 35%.
              </p>
            </div>

            {/* Exact CTA Hierarchy Order */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* 1. Download Resume (Cyber Tactical Scramble) */}
              <CyberResumeButton variant="hero" showChecksum={true} />

              {/* 2. View Case Studies (Cosmic Orbital Defense Grid CTA) */}
              <a 
                href="#projects"
                className="group relative px-6 py-3.5 rounded-xl text-xs font-mono font-bold bg-slate-900/90 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/50 hover:border-emerald-400 hover:text-white transition-all flex items-center gap-2.5 hover:-translate-y-0.5 min-h-[44px] shadow-xl shadow-emerald-950/40"
              >
                <Globe className="w-4 h-4 text-emerald-400 group-hover:rotate-45 transition-transform" />
                <span>🛰️ View Orbital Defense Grid &amp; Projects</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </a>

              {/* 3. Contact (Ghost) */}
              <a 
                href="#contact"
                className="px-6 py-3.5 rounded-xl text-xs font-mono font-bold bg-transparent text-slate-300 hover:text-white hover:bg-slate-900/60 transition-all flex items-center gap-2 min-h-[44px]"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Contact</span>
              </a>
            </div>

            {/* Proof-Metrics Strip Under Hero */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Impact &amp; Operational Metrics</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Endpoints Secured", value: "750+" },
                  { label: "Audit Effort Reduced", value: "60%" },
                  { label: "True Positives Boost", value: "+35%" },
                  { label: "District Core Nodes", value: "38" },
                  { label: "Teams Trained", value: "60+" }
                ].map((stat, i) => (
                  <div key={i} className="p-3.5 bg-slate-900/60 border border-emerald-500/10 rounded-2xl backdrop-blur-xl flex flex-col items-center justify-center text-center hover:border-emerald-500/30 transition-colors">
                    <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">{stat.value}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-1 leading-tight">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Terminal Simulator on Right */}
          <div className="lg:col-span-5">
            <TiltWrapper tiltDeg={3}>
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/95 backdrop-blur-2xl shadow-2xl overflow-hidden font-mono text-xs shadow-emerald-950/30">
                <div className="px-4 py-3 bg-slate-900/90 border-b border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] text-slate-300 font-bold ml-2">aditya@secops: ~/terminal</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">BASH 5.2</span>
                </div>

                <div className="p-4 h-[300px] overflow-y-auto space-y-2 text-slate-300 scrollbar-thin">
                  {terminalHistory.map((line, i) => (
                    <div key={i} className={line.startsWith("aditya@") ? "text-emerald-400 font-bold" : "text-slate-300 whitespace-pre-wrap leading-relaxed"}>
                      {line}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Shortcuts */}
                <div className="p-2 border-t border-slate-900 bg-slate-900/40 flex flex-wrap gap-1.5">
                  {["whoami", "skills", "exp", "certs", "contact", "clear"].map((cmd) => (
                    <button
                      key={cmd}
                      onClick={() => runTerminalShortcut(cmd)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-[10px] text-emerald-400 hover:bg-slate-700 hover:text-emerald-300 font-mono transition-colors"
                    >
                      ${cmd}
                    </button>
                  ))}
                </div>

                {/* Input Form */}
                <form onSubmit={handleCommandSubmit} className="p-3 bg-slate-900/80 border-t border-emerald-500/10 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">aditya@secops:~$</span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type 'whoami' or 'help'..."
                    className="flex-1 bg-transparent border-none outline-none text-emerald-300 placeholder:text-slate-600 text-xs font-mono"
                  />
                </form>
              </div>
            </TiltWrapper>
          </div>
        </section>

        {/* TIER 2 & 3: KEY PROJECTS & CASE STUDIES — TOP-ANGLE UNIVERSE DEFENSE GRID */}
        <section id="projects" className="space-y-10 pt-8">
          
          {/* Top-Angle Orbital Command Banner */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900/95 to-emerald-950/40 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
            {/* Ambient Nebula Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-300">
                  <Globe className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
                  <span>TOP-ANGLE ORBITAL RADAR // ALL-SYSTEMS UNIVERSE MATRIX</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black font-title text-white tracking-tight">
                  Critical National Infrastructure &amp; Engineering Grid
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  An omniscient, top-down orbital vantage point connecting 6 synchronized state defense portals, sub-second telemetry nodes, and algorithmic ecosystems.
                </p>
              </div>

              {/* 4 Macroscopic Telemetry Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/25 text-center shadow-lg shadow-emerald-950/30">
                  <div className="text-xl font-mono font-black text-emerald-400">38 / 38</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">DHQ Loopbacks</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-cyan-500/25 text-center shadow-lg shadow-cyan-950/30">
                  <div className="text-xl font-mono font-black text-cyan-400">293</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">Monitored IPs</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/25 text-center shadow-lg shadow-blue-950/30">
                  <div className="text-xl font-mono font-black text-blue-400">0.01%</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">Firewall Drop</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/25 text-center shadow-lg shadow-indigo-950/30">
                  <div className="text-xl font-mono font-black text-indigo-400">60%</div>
                  <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">Audit Time Cut</div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Planetary Defense Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Node 01: CDAC/CERT-In Compliance Automation Engine */}
            <TiltWrapper tiltDeg={3}>
              <div className="h-full p-7 rounded-[24px] bg-slate-900/70 border border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group hover:shadow-xl hover:shadow-emerald-950/40">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Case Study (Sanitized)
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">ORBIT: NIST-CSF-01</span>
                  </div>

                  <h3 className="text-xl font-bold font-title text-white group-hover:text-emerald-400 transition-colors">
                    CDAC / CERT-In Compliance Engine
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Impact:</strong> Cut quarterly audit cycles by 60% across 750+ government endpoints using PowerShell &amp; Python orchestration mapped to NIST CSF &amp; CERT-In baselines.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["PowerShell", "Python", "KACE UEM", "NIST CSF", "CERT-In"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-emerald-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setCaseStudyModal(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Case Study Modal</span>
                  </button>
                  <span className="text-[10px] font-mono text-slate-400">Sanitized</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Node 02: Government NOC Admin & Telemetry Portal */}
            <TiltWrapper tiltDeg={3}>
              <div className="h-full p-7 rounded-[24px] bg-slate-900/70 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group hover:shadow-xl hover:shadow-cyan-950/40">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      Live Sandbox
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">ORBIT: 38-DHQ-CORE</span>
                  </div>

                  <h3 className="text-xl font-bold font-title text-white group-hover:text-cyan-400 transition-colors">
                    State NOC Admin &amp; Telemetry
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Impact:</strong> Centralized 38 district link health monitors with local on-premise Ollama RAG chatbot assistance, TACACS+ credential resets, and district audit sheets.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Next.js", "Ollama LLM", "PHP API", "Three.js", "RAG"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-cyan-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="/noc/"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Launch Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-mono text-slate-400">Live Demo</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Node 03: Real-Time Network Alert Dashboard */}
            <TiltWrapper tiltDeg={3}>
              <div className="h-full p-7 rounded-[24px] bg-slate-900/70 border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group hover:shadow-xl hover:shadow-blue-950/40">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      Live Telemetry
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">ORBIT: 293-NODES</span>
                  </div>

                  <h3 className="text-xl font-bold font-title text-white group-hover:text-blue-400 transition-colors">
                    Real-Time Alert &amp; Speech Grid
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Impact:</strong> Automated ping outage detection for 293 core nodes with Indian English Web Speech voice alerts, noise filtering, and sparkline latency telemetry.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["JavaScript", "Chart.js", "Web Speech API", "Glassmorphic"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-blue-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="/alert/"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 hover:text-blue-300"
                  >
                    <span>Launch Alerts</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-mono text-slate-400">Voice Synthesis</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Node 04: State NOC Diagnostics & Speed Engine */}
            <TiltWrapper tiltDeg={3}>
              <div className="h-full p-7 rounded-[24px] bg-slate-900/70 border border-indigo-500/20 hover:border-indigo-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group hover:shadow-xl hover:shadow-indigo-950/40">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      Throughput QoS
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">ORBIT: SPEED-INJECT</span>
                  </div>

                  <h3 className="text-xl font-bold font-title text-white group-hover:text-indigo-400 transition-colors">
                    State NOC Speed &amp; Bandwidth
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Impact:</strong> Multi-threaded TCP/HTTP bandwidth diagnostic utility measuring latency, jitter, throughput, and 1080p Ultra-HD video conferencing readiness scores.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Performance API", "Vanta.js", "TCP Sockets", "Speed Test"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-indigo-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="/speed/"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300"
                  >
                    <span>Run Speed Test</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-mono text-slate-400">Bandwidth Test</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Node 05: 38-District Video Conference (VC) Studio Monitor */}
            <TiltWrapper tiltDeg={3}>
              <div className="h-full p-7 rounded-[24px] bg-slate-900/70 border border-teal-500/20 hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group hover:shadow-xl hover:shadow-teal-950/40">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 border border-teal-500/20 text-teal-400">
                      Broadcast Ready
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">ORBIT: 38-VC-STUDIOS</span>
                  </div>

                  <h3 className="text-xl font-bold font-title text-white group-hover:text-teal-400 transition-colors">
                    38-District VC Studio Codec Monitor
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Impact:</strong> 38-District Panasonic KX-VC1300 real-time telemetry (Jitter, Packet Loss, Latency) monitoring 1080p high-definition broadcast readiness.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Panasonic Codecs", "QoS Analysis", "Jitter Buffers", "HD 1080p"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-teal-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="/vc/"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-teal-400 hover:text-teal-300"
                  >
                    <span>Launch VC Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-mono text-slate-400">38 Studios</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Node 06: CyberKarma & JumpStreet Dual Impact Ecosystems */}
            <TiltWrapper tiltDeg={3}>
              <div className="h-full p-7 rounded-[24px] bg-slate-900/70 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group hover:shadow-xl hover:shadow-purple-950/40">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 border border-purple-500/20 text-purple-400">
                      Karma &amp; Quant
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">ORBIT: SOCIAL-ALGO</span>
                  </div>

                  <h3 className="text-xl font-bold font-title text-white group-hover:text-purple-400 transition-colors">
                    CyberKarma &amp; JumpStreet Engines
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong>Impact:</strong> Decentralized ethical charity quiz engine funding real animal rescue meals in Patna + quantitative algorithmic trading platform (Orca6).
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Next.js", "Web3/Charity", "Algorithmic Quant", "TypeScript"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-purple-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="https://cyberkarma.me"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-purple-400 hover:text-purple-300"
                  >
                    <span>cyberkarma.me</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://jumpstreet.tech"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-mono text-cyan-400 hover:underline"
                  >
                    jumpstreet.tech &rarr;
                  </a>
                </div>
              </div>
            </TiltWrapper>

          </div>
        </section>

        {/* SECTION 2: CERTIFICATIONS STRIP (TRUST SIGNALS) */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>02 // Verified Credentials &amp; Certifications</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-title text-white">
              Professional Certifications &amp; Ongoing Roadmap
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Fortinet Certified Associate (FCA)", org: "Fortinet", status: "Verified / Active", color: "border-red-500/25 text-red-400 bg-red-950/20" },
              { title: "In the Trenches: SOC Analyst", org: "EC-Council", status: "Verified / Active", color: "border-emerald-500/25 text-emerald-400 bg-emerald-950/20" },
              { title: "OSCP (Offensive Security)", org: "OffSec", status: "Target: 2027+", color: "border-rose-500/25 text-rose-400 bg-rose-950/20" },
              { title: "Active Directory Labs", org: "HTB & VulnLab", status: "Multi-Forest AD Mastery", color: "border-amber-500/25 text-amber-400 bg-amber-950/20" },
              { title: "eJPT (Junior Penetration Tester)", org: "eLearnSecurity", status: "Target: Q4 2026", color: "border-purple-500/25 text-purple-400 bg-purple-950/20" },
              { title: "Certified Ethical Hacker (CEH v13)", org: "EC-Council", status: "Target: 2026", color: "border-blue-500/25 text-blue-400 bg-blue-950/20" },
              { title: "CISSP (Information Systems Security)", org: "ISC2", status: "Target: Q3 2027", color: "border-indigo-500/25 text-indigo-400 bg-indigo-950/20" },
              { title: "MBA in Cybersecurity", org: "Chitkara University", status: "In Progress (Exp 2027)", color: "border-emerald-500/25 text-emerald-300 bg-emerald-950/20" }
            ].map((cert, idx) => (
              <div key={idx} className={`p-4 rounded-2xl border ${cert.color} backdrop-blur-xl flex flex-col justify-between space-y-2`}>
                <div>
                  <div className="text-xs font-mono font-bold text-slate-400">{cert.org}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{cert.title}</div>
                </div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300 pt-2 border-t border-slate-800">
                  {cert.status}
                </div>
              </div>
            ))}
          </div>
        </section>

        
        {/* SECTION: ACADEMIC EDUCATION */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Academic Degrees &amp; Higher Education</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-title text-white">
              Education &amp; Cybersecurity Qualifications
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[24px] bg-slate-900/60 border border-emerald-500/20 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold font-mono border border-emerald-500/20">Expected Jul 2027</span>
                <h3 className="text-lg font-bold font-title text-white">MBA in Cybersecurity</h3>
                <div className="text-xs text-slate-400 font-semibold">Chitkara University &bull; Punjab, India</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Postgraduate studies specializing in enterprise cybersecurity risk governance, compliance frameworks, and defensive/offensive alignment.
                </p>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 font-bold border-t border-slate-800 pt-3">
                In Progress (Active Coursework)
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-slate-900/60 border border-cyan-500/20 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full text-xs font-bold font-mono border border-cyan-500/20">2019 &mdash; 2022</span>
                <h3 className="text-lg font-bold font-title text-white">B.Tech &mdash; Computer Science &amp; Engineering</h3>
                <div className="text-xs text-slate-400 font-semibold">Manipal University Jaipur &bull; Rajasthan, India</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Undergraduate degree in CSE with extensive coursework in Network Security, Operating Systems, Cryptography, and Distributed Systems.
                </p>
              </div>
              <div className="text-[11px] font-mono text-cyan-400 font-bold border-t border-slate-800 pt-3">
                Completed &bull; B.Tech CSE
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-slate-900/60 border border-blue-500/20 backdrop-blur-xl flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold font-mono border border-blue-500/20">2013 &mdash; 2018</span>
                <h3 className="text-lg font-bold font-title text-white">Diploma &mdash; Computer Science &amp; Engineering</h3>
                <div className="text-xs text-slate-400 font-semibold">Hindu College of Engineering &bull; Haryana, India</div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Core engineering diploma covering computer networking, system administration, C/C++ programming, and digital electronics.
                </p>
              </div>
              <div className="text-[11px] font-mono text-blue-400 font-bold border-t border-slate-800 pt-3">
                Completed &bull; Diploma CSE
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 3: EMPLOYMENT TIMELINE */}
        <section className="space-y-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>03 // Verified Experience Timeline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-title text-white">
              Enterprise Work History (4+ Years SecOps)
            </h2>
          </div>

          <div className="space-y-6">
                        {[
              {
                period: "Feb 2024 — Present",
                role: "Security Administrator & NGFW Architect",
                company: "Ebix Technologies Ltd (Client: National Informatics Centre - NIC, MeitY Govt. of India)",
                location: "Patna, Bihar, India",
                tags: ["750+ Endpoints", "Palo Alto", "Check Point", "SentinelOne", "Deep Security", "60% Audit Cut"],
                bullets: [
                  "NGFW & Network Hardening: Architect and enforce default-deny policies across Palo Alto and Check Point NGFW clusters; audit public IP exposure and secure Linux rack servers across the Bihar State Data Centre (SDC).",
                  "Enterprise EDR/SIEM Deployment: Manage SentinelOne, Trend Micro Deep Security, and Wazuh/Splunk deployments across 750+ regional government endpoints; tune correlation rules against emerging attack vectors, reducing false-positive fatigue by 30%.",
                  "Incident Response & Compliance: Serve as primary CERT-In incident responder; automate compliance reporting (120+ CDAC/CERT-In checks via KACE UEM), cutting manual audit effort by 60%.",
                  "VAPT & AD Security: Lead coordination with NIC-CERT to remediate critical web vulnerabilities (authoring PoC exploits) and conduct Active Directory attack-path analysis to secure district-level nodes.",
                  "Security Training: Deliver specialized training on NGFW, EDR, and CERT-In compliance to 60+ district-level Facility Management System (FMS) teams."
                ]
              },
              {
                period: "Aug 2023 — Jan 2024",
                role: "Independent Security Researcher",
                company: "Offensive Security & Active Directory Exploitation Focus",
                location: "Remote",
                tags: ["Active Directory", "Hack The Box", "VulnLab", "Kerberoasting", "DCSync", "PrivEsc"],
                bullets: [
                  "Executed advanced Active Directory exploitation labs (Hack The Box, VulnLab multi-forest environments), mastering Kerberoasting, DCSync, and Domain Controller compromise techniques.",
                  "Pursued MBA (Cybersecurity) coursework and aligned certification trajectories (eJPT, CEH) to bridge defensive architecture with offensive red-team methodologies."
                ]
              },
              {
                period: "Dec 2022 — Jul 2023",
                role: "SOC Analyst — Threat Hunter",
                company: "RRG Engineering Technologies (Client: Nuclear Fuel Complex - NFC / DAE Govt. of India)",
                location: "Kota, Rajasthan, India",
                tags: ["24x7 CNI SOC", "Blu Sapphire SIEM", "Splunk", "+35% Detection Boost", "Malware TTPs"],
                bullets: [
                  "CNI SOC Operations: Operated as SME for threat hunting in a 24/7 Critical National Infrastructure SOC, monitoring enterprise telemetry via Blu Sapphire SIEM and Splunk.",
                  "Detection Engineering: Engineered and tuned SIEM correlation rules and EDR policies, achieving a 35% improvement in true-positive detection rates.",
                  "Malware Analysis: Performed behavioral malware analysis and sandbox payload reproduction to reverse-engineer TTPs and update detection signatures."
                ]
              },
              {
                period: "Aug 2022 — Oct 2022",
                role: "SOC Analyst — IDS & Signature Development",
                company: "E2E Networks Limited",
                location: "Vellore, Tamil Nadu, India",
                tags: ["Snort IDS", "Wazuh SIEM", "AbuseIPDB Feed", "Perimeter Defense"],
                bullets: [
                  "Authored and deployed custom Snort and Wazuh IDS signatures, improving detection coverage against novel attack patterns in a 24/7 SOC environment.",
                  "Automated AbuseIPDB feed ingestion for real-time perimeter IP blocklisting, significantly reducing inbound malicious traffic and routing anomalies."
                ]
              },
              {
                period: "Dec 2021 — May 2022",
                role: "Technical Support Executive (Microsoft Enterprise)",
                company: "Teleperformance",
                location: "Jaipur, Rajasthan, India",
                tags: ["Tier-2 Enterprise Support", "Microsoft 365", "SLA Compliance"],
                bullets: [
                  "Delivered Tier-2 Microsoft enterprise product support, maintaining strict SLA compliance and contributing to internal knowledge base documentation."
                ]
              }
            ].map((exp, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-[24px] bg-slate-900/50 border border-slate-800 hover:border-emerald-500/30 transition-all backdrop-blur-xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold font-mono border border-emerald-500/20">{exp.period}</span>
                  <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {exp.location}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold font-title text-white">{exp.role}</h3>
                  <div className="text-sm text-slate-400 font-semibold">{exp.company}</div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {exp.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-emerald-300">
                      {tag}
                    </span>
                  ))}
                </div>

                <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc pl-5 pt-2 marker:text-emerald-400">
                  {exp.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: TECHNICAL WRITE-UPS ENGINE (TIER 5) */}
        <section id="writeups" className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>04 // Technical Publications &amp; Field Blueprints</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
                Technical Write-Ups &amp; Defense Blueprints
              </h2>
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm">
              Sanitized threat hunting methodology, Active Directory attack chain reproductions, and compliance automation scripts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {WRITE_UPS.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedWriteUp(art)}
                className="p-6 rounded-[24px] bg-slate-900/60 border border-emerald-500/15 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group backdrop-blur-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold font-title text-white group-hover:text-emerald-400 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {art.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>Read Full Blueprint</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: BEYOND SECURITY — SIDE PROJECTS SHELF */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <div className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider">
              05 // Breadth &amp; Engineering Diversity
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-title text-white">
              Beyond Security &mdash; Side Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Side 1: CyberKarma */}
            <TiltWrapper tiltDeg={3}>
              <div className="p-8 rounded-[24px] bg-slate-900/60 border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl h-full group hover:shadow-xl hover:shadow-amber-950/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                      Social Impact &bull; Animal Daanam
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">cyberkarma.me</span>
                  </div>
                  <h3 className="text-xl font-bold font-title text-white group-hover:text-amber-400 transition-colors">
                    CyberKarma &mdash; Free Rice Security Engine
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Gamified cybersecurity education initiative where purple team, threat hunting, and security quiz answers generate ethical revenue to fund real stray animal feeding drives in Patna.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["Next.js", "Free Rice Model", "Gamified Learning", "Ethical Ads", "Direct Charity"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-amber-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a 
                    href="https://cyberkarma.me" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>Visit cyberkarma.me</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-mono text-slate-400">Live Charity Portal</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Side 2: JumpStreet */}
            <TiltWrapper tiltDeg={3}>
              <div className="p-8 rounded-[24px] bg-slate-900/60 border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl h-full group hover:shadow-xl hover:shadow-purple-950/30">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/25">
                      Quantitative &bull; High Frequency
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">jumpstreet.tech</span>
                  </div>
                  <h3 className="text-xl font-bold font-title text-white group-hover:text-purple-400 transition-colors">
                    JumpStreet Quant Platform (Orca6)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Statistical arbitrage quantitative trading architecture with real-time market data streaming, automated risk parameter execution, and embedded high-speed Orca6 VT100 terminal.
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {["TypeScript", "Algorithmic Arbitrage", "Orca6 Engine", "WebSocket Streaming", "Risk Controls"].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-slate-950 border border-slate-800 text-purple-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a 
                    href="https://jumpstreet.tech" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-purple-400 hover:text-purple-300"
                  >
                    <span>Visit jumpstreet.tech</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[10px] font-mono text-slate-400">Live Trading Bot</span>
                </div>
              </div>
            </TiltWrapper>
          </div>
        </section>

        {/* SECTION 6: ABOUT PROFILE */}
        <section id="about" className="space-y-8 pt-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>06 // Professional Summary</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
              Executive Profile &amp; Philosophy
            </h2>
          </div>

                    <div className="p-8 rounded-[24px] bg-slate-900/60 border border-emerald-500/15 backdrop-blur-xl space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
            <p>
              <strong>Cybersecurity Engineer &amp; NGFW Architect at Ebix Technologies (Client: NIC, MeitY Govt. of India)</strong>, architecting default-deny NGFW estates (Palo Alto, Check Point, Fortinet) and managing SentinelOne, Deep Security, and Wazuh deployments across 750+ regional government endpoints.
            </p>
            <p>
              <strong>Primary CERT-In Incident Responder</strong> with hands-on proficiency in Active Directory attack-path analysis (Kerberoasting, DCSync, Delegation Abuse), web &amp; infrastructure VAPT, and digital forensics.
            </p>
            <p>
              <strong>Prior 24x7 CNI SOC Threat Hunter at Nuclear Fuel Complex (DAE)</strong>, conducting proactive threat hunts, reverse-engineering malware payloads, and tuning SIEM correlation rules to boost true-positive rates by 35%.
            </p>
            <p>
              Pursuing an <strong>MBA in Cybersecurity (Chitkara University)</strong>, B.Tech CSE (Manipal University Jaipur), holding <strong>Fortinet FCA</strong> and <strong>EC-Council SOC</strong>, with target completion for <strong>eJPT, CEH v13, CISSP, and OSCP</strong>.
            </p>
          </div>
        </section>

        {/* SECTION 7: CONTACT & RECRUITER REACH */}
        <section id="contact" className="space-y-8 pt-6">
          <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-cyan-950/30 backdrop-blur-2xl space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Mail className="w-3.5 h-3.5" />
                <span>DIRECT_CONTACT // OPEN_TO_OPPORTUNITIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">Let&apos;s Connect</h2>
              <p className="text-sm sm:text-base text-slate-300">
                Open for high-impact Cybersecurity Engineer, Purple Teamer, and SOC Lead roles.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Open to relocation: India &bull; UAE &bull; Singapore &bull; UK &bull; EU</span>
              </div>
            </div>

            {/* Direct Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <a
                href="mailto:contact@adityasec32.systems"
                className="p-5 rounded-2xl bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group min-h-[44px]"
              >
                <Mail className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-mono font-bold text-white">Direct Email</div>
                <div className="text-[11px] font-mono text-slate-400">adityasec32@gmail.com</div>
              </a>

              <a
                href="https://www.linkedin.com/in/adityajainx1/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group min-h-[44px]"
              >
                <Globe className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-mono font-bold text-white">LinkedIn Profile</div>
                <div className="text-[11px] font-mono text-slate-400">in/adityajainx1</div>
              </a>

              <a
                href="https://github.com/ajainx1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group min-h-[44px]"
              >
                <Code2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-mono font-bold text-white">GitHub Code</div>
                <div className="text-[11px] font-mono text-slate-400">github.com/ajainx1</div>
              </a>
            </div>

            {/* Quick Contact Box */}
            <form onSubmit={handleQuickContact} className="max-w-xl mx-auto space-y-3 pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Drop a quick message, role invite, or question..."
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 min-h-[44px]"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 min-h-[44px]"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              {contactSent && (
                <div className="text-xs font-mono text-emerald-400 text-center">
                  Redirecting to your default email client...
                </div>
              )}
            </form>

            {/* Repeat Download Resume at Bottom of Page (Never make recruiters scroll back up) */}
            <div className="text-center pt-6 border-t border-slate-800">
              <CyberResumeButton variant="bottom" />
            </div>

            {/* PGP & Security Disclosure Signals */}
            <div className="pt-6 text-center space-y-2 text-[11px] font-mono text-slate-400">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span className="flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PGP: 4A8B 92C1 3E7F 8902 B5D4 1A9C 77E0 63F8</span>
                </span>
                <span>&bull;</span>
                <a href="/.well-known/security.txt" className="text-emerald-400 hover:underline">
                  security.txt Policy
                </a>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Write-Up Reader Modal */}
      <AnimatePresence>
        {selectedWriteUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-sans text-slate-200"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {selectedWriteUp.category}
                  </span>
                  <h3 className="text-2xl font-bold font-title text-white mt-2">
                    {selectedWriteUp.title}
                  </h3>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-4">
                    <span>{selectedWriteUp.date}</span>
                    <span>&bull;</span>
                    <span>{selectedWriteUp.readTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWriteUp(null)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close Blueprint"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">Executive Overview</h4>
                  <p>{selectedWriteUp.content.overview}</p>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">Technical Methodology &amp; Execution</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {selectedWriteUp.content.methodology.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">Defensive Mitigations &amp; Key Takeaways</h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    {selectedWriteUp.content.takeaways.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-mono text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedWriteUp(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-colors min-h-[44px]"
                >
                  Close Blueprint
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Case Study Modal */}
      <AnimatePresence>
        {caseStudyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-sans text-slate-200"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Architecture Case Study (Sanitized)
                  </span>
                  <h3 className="text-xl font-bold font-title text-white mt-2">
                    CDAC / CERT-In Compliance Automation Engine
                  </h3>
                </div>
                <button
                  onClick={() => setCaseStudyModal(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close Case Study"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
                <p>
                  <strong>Challenge:</strong> 750+ government endpoints distributed across 38 regional districts required quarterly compliance auditing against 120+ mandatory CERT-In and NIST guidelines. Manual auditing required over 14 business days.
                </p>
                <p>
                  <strong>Architecture:</strong> Designed a zero-dependency PowerShell core packaged for silent orchestration via KACE UEM. Telemetry was aggregated into a central dashboard that triggered automated remediation GPO scripts for non-compliant endpoints.
                </p>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-emerald-300">
                  <div>✓ 60% reduction in manual engineer audit cycles</div>
                  <div>✓ 100% visibility over unauthorized USB peripherals</div>
                  <div>✓ Automated SHA-256 evidence logging for official audits</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setCaseStudyModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-colors min-h-[44px]"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
