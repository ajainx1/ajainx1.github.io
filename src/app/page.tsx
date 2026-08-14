"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal as TermIcon, 
  Shield, 
  Network, 
  Server, 
  ArrowRight, 
  Download, 
  Phone, 
  Mail, 
  Cpu, 
  Key, 
  Award, 
  BookOpen, 
  Briefcase, 
  FileText,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Lock,
  Layers,
  Sparkles,
  ChevronRight,
  X,
  Code2,
  Flame,
  Globe,
  Share2
} from "lucide-react";
import Link from "next/link";
import TiltWrapper from "@/components/3d/TiltWrapper";
import AdSenseBanner from "@/components/AdSenseBanner";

// Command responses for the Terminal Simulator
const COMMANDS = {
  help: [
    "Available commands:",
    "  whoami    - Display professional profile summary",
    "  skills    - List core technical competencies",
    "  exp       - List professional employment history",
    "  certs     - List active and targeted certifications",
    "  clear     - Clear terminal screen"
  ],
  whoami: [
    "aditya@secops:~$ cat whoami.json",
    "{",
    "  \"name\": \"Aditya Jain\",",
    "  \"role\": \"Cybersecurity Engineer & Purple Teamer\",",
    "  \"exp\": \"4+ Years Enterprise SecOps & CNI Defense\",",
    "  \"location\": \"Open to Relocation: India · UAE · Singapore · UK · EU\",",
    "  \"current\": \"Security Administrator @ National Informatics Centre (NIC/MeitY)\",",
    "  \"focus\": \"NGFW Architecture, Purple Teaming, Threat Hunting, SIEM/EDR, DFIR\"",
    "}"
  ],
  skills: [
    "aditya@secops:~$ list-skills --verbose",
    "• Firewalls/NGFW: Check Point NGFW, Fortinet FortiGate, Palo Alto, Sophos, Cisco AnyConnect, OSPF/BGP",
    "• SIEM / EDR: Wazuh, Blu Sapphire, SentinelOne, Trend Micro Deep Security, Kaspersky EDR",
    "• Offensive / VAPT: Metasploit, Nmap, Burp Suite Pro, BloodHound, Impacket, Mimikatz, Kerberoasting",
    "• Scripting: Python, PowerShell, Bash, Git",
    "• Regulatory: NIST CSF, CERT-In Baseline, OWASP Top 10, ISO 27001, RAM Dump Analysis"
  ],
  exp: [
    "aditya@secops:~$ get-history",
    "• Ebix Technologies / NIC (Security Administrator) - Feb 2024 to Present",
    "  - Secured 750+ government endpoints with SentinelOne & Deep Security",
    "  - Built compliance automation scripts (120+ checks) cutting audit effort by 60%",
    "• RRG Engineering / Nuclear Fuel Complex (SOC Threat Hunter) - Dec 2022 to Jul 2023",
    "  - 24x7 CNI nuclear SOC monitoring, +35% SIEM true-positive boost",
    "• E2E Networks (SOC Analyst - IDS) - Aug 2022 to Oct 2022",
    "  - Wazuh & Snort custom signature engineering"
  ],
  certs: [
    "aditya@secops:~$ list-certs",
    "[Completed & Active]",
    "• Fortinet Certified Associate in Cybersecurity (FCAC)",
    "• EC-Council SOC Analyst - In the Trenches: SOC",
    "• Red Hat Certified System Administrator (RHCSA)",
    "• BasisTech Autopsy Basics (Digital Forensics)",
    "[In Progress / Targeted]",
    "• eJPT (Target: Q4 2026)",
    "• CEH v13 (EC-Council Certified Ethical Hacker)",
    "• CISSP (Target: Q3 2027)",
    "• OSCP / PEN-200"
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
    summary: "Deep-dive analysis on extracting TGS tickets for SPN accounts, cracking RC4-HMAC hashes with Hashcat, escalating through nested delegation groups, and executing DCSync via Impacket secretsdump.",
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
    "aditya@secops:~# initialising secure session...",
    "SEC_CORE: ACTIVE",
    "AD_HARDENED: TRUE",
    "Type 'help' for available commands.",
    ""
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [visitorCount, setVisitorCount] = useState(2143);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedWriteUp, setSelectedWriteUp] = useState<WriteUp | null>(null);
  const [caseStudyModal, setCaseStudyModal] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Persistent client-side visitor tracker
  useEffect(() => {
    const storedCount = localStorage.getItem("portfolio_visitor_count");
    if (storedCount) {
      const current = parseInt(storedCount, 10);
      const updated = current + 1;
      localStorage.setItem("portfolio_visitor_count", updated.toString());
      setVisitorCount(updated);
    } else {
      localStorage.setItem("portfolio_visitor_count", "2143");
      setVisitorCount(2143);
    }
  }, []);

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

  return (
    <div className="min-h-screen relative flex flex-col font-sans bg-slate-950 text-slate-100 transition-colors duration-500 selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Dynamic Cyber Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-950" />
        <motion.div animate={{ x: [0, 40, 0], y: [0, 25, 0], scale: [1, 1.08, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-20 bg-emerald-600 mix-blend-screen" />
        <motion.div animate={{ x: [0, -40, 0], y: [0, -25, 0], scale: [1, 1.15, 1] }} transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[150px] opacity-15 bg-cyan-600 mix-blend-screen" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))]" />
      </div>

      {/* Sticky 5-Section Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-emerald-500/10 bg-slate-950/80 backdrop-blur-2xl shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-title font-bold text-lg tracking-tight hover:opacity-90 transition-opacity">
            <span className="bg-gradient-to-br from-emerald-500 to-cyan-600 text-slate-950 shadow-md shadow-emerald-500/20 px-2 py-0.5 rounded-lg text-sm font-black font-mono">AJ</span>
            <span className="text-white">Aditya<span className="text-emerald-400">.</span>Jain</span>
          </Link>
          
          {/* 5 Master Nav Sections */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <a href="#home" className="hover:text-emerald-400 transition-colors">Home</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              Projects
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
              </span>
            </a>
            <a href="#writeups" className="hover:text-emerald-400 transition-colors">Write-Ups</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-slate-900/80 text-xs font-mono font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <span>{visitorCount} secops views</span>
            </div>
            <a 
              href="/resume.pdf" 
              download 
              className="px-4 sm:px-5 py-2 text-xs font-bold font-mono rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume.pdf</span>
            </a>
          </div>
        </div>
      </header>

      {/* Telemetry Live Bar */}
      <div className="w-full border-b border-emerald-500/10 bg-slate-900/40 py-2 text-[11px] font-mono font-semibold text-slate-400 overflow-x-auto whitespace-nowrap backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-8 items-center tracking-wide">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> SEC_CORE: ACTIVE</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> AD_HARDENED: TRUE</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span> CNI_DEFENSE: ONLINE</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span> 38 DISTRICT NODES: 100% UPTIME</div>
          <div className="flex items-center gap-2 text-slate-400"><Globe className="w-3 h-3 text-emerald-400" /> OPEN TO RELOCATION: INDIA · UAE · SINGAPORE · UK · EU</div>
        </div>
      </div>

      <main id="main-content" className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-28 relative z-10">
        
        {/* HERO SECTION */}
        <section id="home" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-14rem)]">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-950/40 backdrop-blur-xl text-xs font-mono font-bold text-emerald-300">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>SME Cybersecurity Engineer & Purple Teamer</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black font-title tracking-tight text-white leading-tight">
                Aditya Jain — <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Cybersecurity Engineer & Purple Teamer</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Network Security & NGFW Architecture (Palo Alto · Check Point · Fortinet) · VAPT · SIEM/EDR · DFIR — securing 750+ government endpoints & Critical National Infrastructure.
              </p>
            </div>

            {/* Recruiter Conversion CTAs in Master Order */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a 
                href="/resume.pdf" 
                download
                className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2.5 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                <Download className="w-4 h-4" />
                <span>⬇ Download Resume</span>
              </a>

              <a 
                href="#projects"
                className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:bg-slate-800 hover:border-emerald-500/60 transition-all flex items-center gap-2 hover:-translate-y-0.5"
              >
                <span>View Projects</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a 
                href="#contact"
                className="px-6 py-3 rounded-xl text-xs font-mono font-bold bg-slate-900/60 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Contact</span>
              </a>
            </div>

            {/* Proof-Metrics Strip */}
            <div className="pt-6 border-t border-slate-800/80">
              <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-bold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Impact & Enterprise Proof Metrics</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { label: "Endpoints Secured", value: "750+" },
                  { label: "Audit Effort Reduced", value: "60%" },
                  { label: "True-Positive Rate", value: "+35%" },
                  { label: "District Nodes", value: "38" },
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
            <TiltWrapper tiltDeg={4}>
              <div className="rounded-2xl border border-emerald-500/20 bg-slate-950/90 backdrop-blur-2xl shadow-2xl overflow-hidden font-mono text-xs shadow-emerald-950/30">
                <div className="px-4 py-3 bg-slate-900/90 border-b border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] text-slate-400 font-bold ml-2">aditya@secops: ~/identity</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">BASH 5.2</span>
                </div>

                <div className="p-4 h-[320px] overflow-y-auto space-y-2 text-slate-300">
                  {terminalHistory.map((line, i) => (
                    <div key={i} className={line.startsWith("aditya@") ? "text-emerald-400 font-bold" : "text-slate-300 whitespace-pre-wrap leading-relaxed"}>
                      {line}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>

                {/* Shortcuts */}
                <div className="p-2 border-t border-slate-900 bg-slate-900/40 flex flex-wrap gap-1.5">
                  {["whoami", "skills", "exp", "certs", "clear"].map((cmd) => (
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
                    placeholder="type 'help' or command..."
                    className="flex-1 bg-transparent border-none outline-none text-emerald-300 placeholder:text-slate-600 text-xs font-mono"
                  />
                </form>
              </div>
            </TiltWrapper>
          </div>
        </section>

        {/* SECTION 2: TECHNICAL WRITE-UPS (THE CONTENT ENGINE) */}
        <section id="writeups" className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>01 // Technical Publications & Blueprints</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
                Technical Write-Ups & Field Blueprints
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
                className="p-6 rounded-[24px] bg-slate-900/60 border border-emerald-500/10 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 group backdrop-blur-xl"
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

        {/* SECTION 3: KEY SECURITY PROJECTS & CASE STUDIES */}
        <section id="projects" className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <span>02 // Enterprise Case Studies & Portals</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
                Enterprise Projects & Verified Systems
              </h2>
            </div>
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>Explore All Systems ({ALL_PROJECTS_COUNT})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1: Compliance Automation Engine */}
            <TiltWrapper tiltDeg={4}>
              <div className="h-full p-8 rounded-[24px] bg-slate-900/60 border border-emerald-500/15 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      Government Case Study (Sanitized)
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">NIST CSF // 750+ NODES</span>
                  </div>

                  <h3 className="text-2xl font-bold font-title text-white group-hover:text-emerald-400 transition-colors">
                    CDAC / CERT-In Compliance Automation Engine
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Engineered a PowerShell & Python framework executing 120+ automated system configuration checks mapped to NIST standards across 750+ government nodes via KACE UEM. Reduced audit cycle from weeks to 4 hours.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {["PowerShell", "Python", "KACE UEM", "NIST CSF", "CERT-In Baseline"].map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-emerald-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => setCaseStudyModal(true)}
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Architecture Case Study</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-500">Sanitized Metrics</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Card 2: Government NOC Admin Portal */}
            <TiltWrapper tiltDeg={4}>
              <div className="h-full p-8 rounded-[24px] bg-slate-900/60 border border-cyan-500/15 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      Demo Available
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">38 DISTRICT CORES</span>
                  </div>

                  <h3 className="text-2xl font-bold font-title text-white group-hover:text-cyan-400 transition-colors">
                    Government NOC Admin & Telemetry Portal
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Operations platform monitoring 38 district-level router nodes across Bihar State. Features real-time link telemetry, TACACS+ portal integration, district audit downloads, and an on-premise Ollama RAG AI assistant.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Next.js", "Ollama LLM", "PHP API", "Three.js", "RAG"].map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-cyan-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="/noc/"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    <span>Explore Demo Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[11px] font-mono text-slate-500">Live Sandbox</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Card 3: Alert Dashboard */}
            <TiltWrapper tiltDeg={4}>
              <div className="h-full p-8 rounded-[24px] bg-slate-900/60 border border-blue-500/15 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                      Demo Available
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">SUB-SECOND TELEMETRY</span>
                  </div>

                  <h3 className="text-2xl font-bold font-title text-white group-hover:text-blue-400 transition-colors">
                    Real-Time Network Alert Dashboard
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Automated ping monitoring and packet loss analysis dashboard for enterprise core routing units. Integrates Indian English Web Speech voice alerts, PAC/UPS telemetry, and live sparklines.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {["JavaScript", "Chart.js", "Web Speech API", "CSS Glassmorphism"].map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-blue-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href="/alert/"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-blue-400 hover:text-blue-300"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <span className="text-[11px] font-mono text-slate-500">TTS Audio Engine</span>
                </div>
              </div>
            </TiltWrapper>

            {/* Card 4: Cyber Free Rice Initiative */}
            <TiltWrapper tiltDeg={4}>
              <div className="h-full p-8 rounded-[24px] bg-slate-900/60 border border-amber-500/15 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xl group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                      Social Impact / Live
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 font-bold">CYBER EDUCATION</span>
                  </div>

                  <h3 className="text-2xl font-bold font-title text-white group-hover:text-amber-400 transition-colors">
                    Cyber Free Rice Initiative
                  </h3>

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Interactive education platform featuring a sleek cyber UI. User quiz scores in threat hunting, purple teaming, and general security feed directly into simulated food charity karma pools.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {["Next.js", "Framer Motion", "Tailwind CSS", "Gamification"].map((t, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-slate-950 border border-slate-800 text-amber-400/80">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <Link
                    href="/charity-quiz"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 hover:text-amber-300"
                  >
                    <span>Play Security Quiz</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] font-mono text-slate-500">Live Charity Engine</span>
                </div>
              </div>
            </TiltWrapper>

          </div>

          {/* Side Projects Shelf */}
          <div className="pt-6">
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider">Side Projects & Engineering Shelf</div>
                <div className="text-sm text-slate-300 font-medium">
                  <strong>JumpStreet Bot</strong> (Quantitative Algorithmic Execution) &bull; <strong>Orca6 Terminal</strong> (In-Memory Unix Shell Emulator)
                </div>
              </div>
              <Link
                href="/projects"
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-mono font-bold text-slate-200 hover:bg-slate-700 hover:text-white transition-colors"
              >
                Browse Side Projects
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: ABOUT & CREDENTIALS */}
        <section id="about" className="space-y-12 pt-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>03 // Professional Background & Certifications</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">
              Executive Profile & Trajectory
            </h2>
          </div>

          {/* 4-Line Bio Mirroring Resume */}
          <div className="p-8 rounded-[24px] bg-slate-900/60 border border-emerald-500/15 backdrop-blur-xl space-y-4">
            <h3 className="text-xl font-bold font-title text-emerald-400">Professional Summary</h3>
            <div className="space-y-2 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                <strong>Security Administrator at National Informatics Centre (NIC / MeitY)</strong>, securing 750+ government endpoints and enterprise network infrastructure with SentinelOne, Deep Security, Check Point NGFW, and automated compliance frameworks.
              </p>
              <p>
                <strong>Prior 24x7 CNI SOC Threat Hunter at Nuclear Fuel Complex (NFC / DAE)</strong>, conducting proactive threat hunts, reverse-engineering malware TTPs, and engineering SIEM correlation rules to boost true-positive rates by 35%.
              </p>
              <p>
                Currently pursuing an <strong>MBA in Information Technology</strong>, bridging high-stakes defensive cyber engineering with strategic risk governance, compliance auditing, and incident response readiness.
              </p>
              <p>
                Active purple teaming practitioner holding <strong>Fortinet FCAC, EC-Council SOC, RHCSA, BasisTech Forensics</strong>, with target completion for <strong>eJPT, CEH v13, and CISSP</strong>.
              </p>
            </div>
          </div>

          {/* Certifications Strip */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold font-title text-slate-200">Certifications & Targeted Trajectory</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Fortinet Certified Associate (FCA)", org: "Fortinet", status: "Verified / Active", color: "border-red-500/20 text-red-400 bg-red-950/20" },
                { title: "In the Trenches: SOC Analyst", org: "EC-Council", status: "Verified / Active", color: "border-emerald-500/20 text-emerald-400 bg-emerald-950/20" },
                { title: "Red Hat Certified Admin (RHCSA)", org: "Red Hat", status: "Certified", color: "border-amber-500/20 text-amber-400 bg-amber-950/20" },
                { title: "Autopsy Basics Digital Forensics", org: "BasisTech", status: "Certified", color: "border-cyan-500/20 text-cyan-400 bg-cyan-950/20" },
                { title: "eJPT (Junior Penetration Tester)", org: "eLearnSecurity", status: "Target: Q4 2026", color: "border-purple-500/20 text-purple-400 bg-purple-950/20" },
                { title: "Certified Ethical Hacker (CEH v13)", org: "EC-Council", status: "Target: 2026", color: "border-blue-500/20 text-blue-400 bg-blue-950/20" },
                { title: "CISSP (Information Systems Security)", org: "ISC2", status: "Target: Q3 2027", color: "border-indigo-500/20 text-indigo-400 bg-indigo-950/20" },
                { title: "MBA Information Technology", org: "Postgraduate", status: "In Progress", color: "border-emerald-500/20 text-emerald-300 bg-emerald-950/20" }
              ].map((cert, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${cert.color} backdrop-blur-xl flex flex-col justify-between space-y-2`}>
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-400">{cert.org}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{cert.title}</div>
                  </div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 pt-2 border-t border-slate-800">
                    {cert.status}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: CONTACT & RECRUITER REACH */}
        <section id="contact" className="space-y-8 pt-6">
          <div className="p-8 sm:p-12 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-cyan-950/30 backdrop-blur-2xl space-y-8">
            <div className="space-y-2 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Mail className="w-3.5 h-3.5" />
                <span>DIRECT_CONTACT // OPEN_TO_OPPORTUNITIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold font-title text-white">Let&apos;s Connect</h2>
              <p className="text-sm sm:text-base text-slate-300">
                Open for high-impact Cybersecurity Engineer, Purple Teamer, and SOC Lead roles.
              </p>
              <div className="pt-2 text-xs font-mono font-bold text-emerald-400 flex items-center justify-center gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>Open to relocation: India · UAE · Singapore · UK · EU</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <a
                href="mailto:contact@adityasec32.systems"
                className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <Mail className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-mono font-bold text-white">Email</div>
                <div className="text-[11px] font-mono text-slate-400">contact@adityasec32.systems</div>
              </a>

              <a
                href="https://www.linkedin.com/in/adityajainx1/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <Globe className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-mono font-bold text-white">LinkedIn Profile</div>
                <div className="text-[11px] font-mono text-slate-400">in/adityajainx1</div>
              </a>

              <a
                href="https://github.com/ajainx1"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/20 hover:border-purple-500/50 hover:bg-slate-900 transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <Code2 className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-mono font-bold text-white">GitHub Code</div>
                <div className="text-[11px] font-mono text-slate-400">github.com/ajainx1</div>
              </a>
            </div>

            <div className="text-center pt-4">
              <a
                href="/resume.pdf"
                download
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-xs hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download Executive CV (PDF)</span>
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Write-Up Reader Modal */}
      <AnimatePresence>
        {selectedWriteUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-sans"
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
                    <span>•</span>
                    <span>{selectedWriteUp.readTime}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWriteUp(null)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
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
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">Technical Methodology & Execution</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {selectedWriteUp.content.methodology.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-2">Defensive Mitigations & Key Takeaways</h4>
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
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl font-sans"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <span className="px-3 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Architecture Case Study
                  </span>
                  <h3 className="text-xl font-bold font-title text-white mt-2">
                    CDAC / CERT-In Compliance Automation Engine
                  </h3>
                </div>
                <button
                  onClick={() => setCaseStudyModal(false)}
                  className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
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
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono font-bold text-white transition-colors"
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

const ALL_PROJECTS_COUNT = 8;
