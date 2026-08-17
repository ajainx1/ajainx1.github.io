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
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import TiltWrapper from "@/components/3d/TiltWrapper";

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
    "  \"role\": \"SME Cybersecurity Engineer\",",
    "  \"exp\": \"4+ Years Enterprise SecOps\",",
    "  \"location\": \"Patna, Bihar, India\",",
    "  \"current\": \"Security Administrator @ National Informatics Centre (NIC)\",",
    "  \"focus\": \"SecOps, Purple Teaming, Threat Hunting\"",
    "}"
  ],
  skills: [
    "aditya@secops:~$ list-skills --verbose",
    "• SIEM/EDR: Wazuh, Blu Sapphire, SentinelOne, Trend Micro, Kaspersky EDR",
    "• Offensive: Metasploit, Nmap, Burp Suite Pro, BloodHound, Impacket, Mimikatz",
    "• Network: Check Point NGFW, Fortinet FortiGate, Sophos, Cisco AnyConnect, OSPF",
    "• Scripting: Python, PowerShell, Bash, Git",
    "• Compliance: NIST CSF, OWASP Top 10, CERT-In, RAM Dump Analysis"
  ],
  exp: [
    "aditya@secops:~$ get-history",
    "• Ebix Technologies / NIC (Security Administrator) - Feb 2024 to Present",
    "  - Managed SentinelOne/Deep Security EDR across 750+ offices",
    "  - Built compliance automation scripts (120+ checks) saving 60% cycle effort",
    "• RRG Engineering / Nuclear Fuel Complex (SOC Threat Hunter) - Dec 2022 to Jul 2023",
    "  - 24x7 CNI nuclear SOC monitoring, +35% SIEM detection boost",
    "• E2E Networks (SOC Analyst - IDS) - Aug 2022 to Oct 2022",
    "  - Wazuh & Snort custom signature development"
  ],
  certs: [
    "aditya@secops:~$ list-certs",
    "[Completed]",
    "• Fortinet Certified Associate (FCA) in Cybersecurity",
    "• Red Hat Certified System Administrator (RHCSA)",
    "• In the Trenches: SOC - EC-Council",
    "• Autopsy Basics (Digital Forensics) - BasisTech",
    "[In Progress / Targeted]",
    "• eJPT (Target: Q4 2026)",
    "• CEH v13 / CompTIA Security+ (2026)",
    "• CISSP (Target: Q3 2027)",
    "• OSCP / PEN-200"
  ]
};

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
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Persistent client-side visitor tracker starting at 2143
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

  // Sync wallet connection state
  useEffect(() => {
    const checkWallet = () => {
      const savedWallet = localStorage.getItem("web3_wallet_address");
      setWalletAddress(savedWallet);
    };
    checkWallet();
    window.addEventListener("storage", checkWallet);
    return () => window.removeEventListener("storage", checkWallet);
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
    <div className="min-h-screen relative flex flex-col font-sans bg-slate-50 text-slate-900 transition-colors duration-500">
      
      {/* Dynamic iCloud Mesh Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-slate-50" />
        <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-60 bg-blue-200 mix-blend-multiply" />
        <motion.div animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }} transition={{ duration: 35, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[130px] opacity-50 bg-indigo-200 mix-blend-multiply" />
        <div className="absolute inset-0 backdrop-blur-[80px]" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 backdrop-blur-2xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-title font-bold text-lg tracking-tight hover:opacity-80 transition-opacity">
            <span className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md px-2 py-0.5 rounded-lg text-sm font-semibold">AJ</span>
            <span>Aditya<span className="text-blue-500">.</span>Jain</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
            <a href="#about" className="hover:text-[var(--fg)] transition-colors">About</a>
            <a href="#skills" className="hover:text-[var(--fg)] transition-colors">Competencies</a>
            <a href="#experience" className="hover:text-[var(--fg)] transition-colors">Experience</a>
            <a href="#projects" className="hover:text-[var(--fg)] transition-colors flex items-center gap-1.5">
              Projects
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--primary)]"></span>
              </span>
            </a>
            <a href="#certs" className="hover:text-[var(--fg)] transition-colors">Credentials</a>
            <a href="#contact" className="hover:text-[var(--fg)] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {walletAddress && (
              <div className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-700 shadow-sm text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
              </div>
            )}
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/5 bg-white shadow-sm text-xs font-semibold text-slate-600">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>{visitorCount} visitors</span>
            </div>
            <a 
              href="/Aditya_Jain_Cybersecurity_Engineer_US.pdf" 
              download 
              className="px-5 py-2 text-xs font-bold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </header>

      {/* Telemetry Indicator Row */}
      <div className="w-full border-b border-black/5 bg-slate-100/50 py-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex gap-8 items-center tracking-wide">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> SEC_CORE: ACTIVE</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> AD_HARDENED: TRUE</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"></span> BGP_RTT: 18.2ms</div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[calc(100vh-12rem)]">
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/5 bg-white/60 backdrop-blur-xl shadow-sm text-sm font-semibold text-slate-700">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>SecOps • Purple Team • Threat Hunting</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-bold font-title tracking-tight text-slate-900 leading-tight">
              Aditya <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Jain</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
              Versatile Cybersecurity Engineer with <strong>4+ years of enterprise experience</strong> in Security Operations, Threat Hunting, and Vulnerability Management across India’s national government IT infrastructure.
            </p>

            {/* Quick Action Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {[
                { label: "Years SecOps", value: "4+" },
                { label: "Govt Endpoints", value: "750+" },
                { label: "Audits Automated", value: "120+" },
                { label: "Effort Saved", value: "60%" }
              ].map((stat, i) => (
                <div key={i} className="p-4 bg-white/60 border border-black/5 rounded-[20px] backdrop-blur-xl shadow-sm flex flex-col items-center justify-center text-center hover:bg-white/90 transition-colors">
                  <div className="text-2xl font-black text-slate-800">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-6">
              <a href="https://jumpstreet.tech" target="_blank" rel="noopener noreferrer" className="group px-6 py-3.5 text-sm font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span>JumpStreet Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="https://cyberkarma.me" target="_blank" rel="noopener noreferrer" className="group px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                <span className="text-lg">🎮</span>
                <span>Play Charity Quiz</span>
              </a>
              <a href="#about" className="px-6 py-3.5 text-sm font-bold text-slate-700 bg-white/60 border border-black/10 rounded-full hover:bg-white transition-all shadow-sm hover:shadow-md backdrop-blur-xl">
                View Portfolio
              </a>
            </div>
          </div>

          {/* Sleek macOS Terminal Card */}
          <div className="lg:col-span-6 w-full">
            <TiltWrapper className="w-full h-[450px] rounded-[24px] border border-white/40 bg-white/60 backdrop-blur-2xl overflow-hidden flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
              {/* macOS Window Controls */}
              <div className="bg-white/50 px-5 py-3.5 border-b border-black/5 flex items-center justify-between backdrop-blur-md">
                <div className="flex gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-red-400 border border-red-500/50 shadow-inner"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-500/50 shadow-inner"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border border-emerald-500/50 shadow-inner"></span>
                </div>
                <div className="text-[11px] font-bold text-slate-500 tracking-wide flex items-center gap-2"><TermIcon size={12}/> aditya@secops — terminal</div>
                <div className="w-10"></div> {/* spacer for centering */}
              </div>
              
              <div className="flex-1 p-5 font-mono text-sm overflow-y-auto space-y-2 text-slate-700 bg-white/40 scrollbar-thin scrollbar-thumb-slate-300">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith("aditya@secops:~$") ? "font-bold text-blue-600" : "text-slate-600"}>
                    {line}
                  </div>
                ))}
                <div ref={terminalEndRef}></div>
              </div>

              {/* Terminal Quick Options */}
              <div className="px-5 py-3 border-t border-black/5 bg-white/50 flex gap-2 overflow-x-auto text-xs font-semibold backdrop-blur-md">
                <span className="text-slate-500 self-center mr-1">Try:</span>
                {["whoami", "skills", "exp", "certs"].map(cmd => (
                  <button key={cmd} onClick={() => runTerminalShortcut(cmd)} className="px-3 py-1.5 bg-white border border-black/10 rounded-full text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm">{cmd}</button>
                ))}
                <button onClick={() => runTerminalShortcut("clear")} className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-full text-rose-600 hover:bg-rose-100 transition-colors shadow-sm">clear</button>
              </div>

              <form onSubmit={handleCommandSubmit} className="border-t border-black/5 bg-white/80 px-5 py-4 flex gap-3 backdrop-blur-xl">
                <span className="font-mono text-sm font-bold text-blue-600 self-center">aditya@secops:~$</span>
                <input 
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none font-mono text-sm text-slate-700 placeholder:text-slate-400"
                  placeholder="Enter command..."
                  autoComplete="off"
                  spellCheck="false"
                />
              </form>
            </TiltWrapper>
          </div>
        </section>

        {/* SUMMARY / ABOUT */}
        <section id="about" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">01 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Professional Summary</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-5 text-slate-600 leading-relaxed text-base sm:text-lg">
              <p>
                Highly capable <strong>Cybersecurity Engineer &amp; SME</strong> with <strong>4+ years of hands-on enterprise experience</strong> architecting, tuning, and defending critical IT and e-governance systems. Currently managing large-scale SecOps operations at Ebix Technologies contracted directly to the National Informatics Centre (NIC).
              </p>
              <p>
                Adept at offensive simulations (Active Directory exploitation, payload analysis, and sandbox malware replication) and defensive engineering (writing custom Wazuh/Snort IDS rules, tuning SIEM systems, and orchestrating EDR policies).
              </p>
              <p>
                Proven ability to automate regulatory auditing through custom PowerShell and Python frameworks, reducing overall audit cycles by 60% and successfully responding to national CERT-In security advisories.
              </p>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 shadow-sm mt-4">
                <p className="text-sm font-semibold text-blue-900 flex gap-2 items-start">
                  <span className="text-lg">🎯</span> 
                  <span>Open to U.S. Relocation / H-1B Sponsorship. Currently targeted locations: Washington D.C. Metro, Northern Virginia, Austin TX, Dallas TX, or Chicago IL.</span>
                </p>
              </div>
            </div>
            
            <div className="lg:col-span-5">
              <TiltWrapper className="p-6 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="text-xs font-bold text-slate-500 border-b border-black/5 pb-3 mb-4 flex items-center gap-2">
                  <TermIcon size={14}/> profile.json
                </div>
                <pre className="text-[13px] font-mono text-slate-700 leading-relaxed overflow-x-auto whitespace-pre">
{`{
  "name": "Aditya Jain",
  "title": "Cybersecurity Engineer",
  "exp": "4+ Years Enterprise SecOps",
  "relocation": "U.S. Relocation / H-1B",
  "email": "adityasec32@gmail.com",
  "contact": "+91 740 058 8896",
  "studying": "MBA in Cybersecurity",
  "pursuing": ["OSCP", "CISSP"]
}`}
                </pre>
              </TiltWrapper>
            </div>
          </div>
        </section>

        {/* CORE COMPETENCIES */}
        <section id="skills" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">02 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Core Competencies</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "SIEM / EDR",
                desc: "Wazuh SIEM, Blu Sapphire, SentinelOne EDR, Trend Micro Deep Security, Kaspersky EDR, Splunk (familiar), Microsoft Sentinel."
              },
              {
                title: "Offensive Security",
                desc: "Active Directory Exploitation (Kerberoasting, Pass-the-Hash, DCSync, Kerberos Delegation), Burp Suite Pro, BloodHound, Metasploit, Nmap, Impacket, Mimikatz."
              },
              {
                title: "Network Security & VPNs",
                desc: "Check Point NGFW, Fortinet FortiGate, Sophos, Cisco AnyConnect, AAA (TACACS+/RADIUS), OSPF Routing, Wireshark packet capture & triage."
              },
              {
                title: "Scripting & AI Automation",
                desc: "Python, PowerShell, Bash, Git. Developing customized automated compliance scripting, network log parsers, and AI telemetry helpers."
              },
              {
                title: "Compliance & Incident Response",
                desc: "NIST CSF, OWASP Top 10 remediation, CERT-In compliance guidelines, RAM dump forensics, threat intelligence feed integration, Snort signature engineering."
              },
              {
                title: "Endpoint & Infrastructure",
                desc: "KACE UEM (750+ nodes), USB policy enforcement, unified security baselines, Linux server hardening, DHCP/PXE deployment, automated patching."
              }
            ].map((skill, idx) => (
              <TiltWrapper key={idx} className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm flex flex-col justify-between hover:shadow-lg hover:bg-white/60 hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                    <div className="p-2 bg-blue-50 rounded-xl shadow-inner border border-blue-100">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <h3 className="font-title font-bold text-xl text-slate-800">{skill.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{skill.desc}</p>
                </div>
              </TiltWrapper>
            ))}
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">03 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Professional Experience</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="relative border-l-2 border-black/10 ml-4 sm:ml-8 pl-8 sm:pl-10 space-y-12">
            {[
              {
                period: "Feb 2024 – Present",
                role: "Security Administrator",
                company: "Ebix Technologies (Contracted to National Informatics Centre - NIC)",
                location: "Patna, Bihar, India",
                tags: ["EDR Deployment", "Incidents & Forensics", "60% Audit Effort Saved", "750+ Offices"],
                bullets: [
                  "Enterprise EDR Deployment: Architected and managed SentinelOne and Trend Micro Deep Security across 750+ regional offices, monitoring threat telemetry and tuning detection rules to neutralize emerging vectors.",
                  "Incident Response & Forensics: Primary responder to CERT-In security advisories; performed host forensics, RAM dump analysis, IP reputation triage, and authored PoC exploits to validate vulnerability closures.",
                  "Compliance Automation: Built PowerShell and Python frameworks executing 120+ regulatory checks (NIST/ISO 27001 aligned) across 750+ endpoints — reducing manual cycles by 60%.",
                  "Vulnerability Management: Coordinated disclosure and patching with government development teams to remediate OWASP Top 10 vulnerabilities.",
                  "Endpoint & Network Hardening: Enforced default-deny policies on Check Point NGFW, deployed USB blocks, and conducted public IP exposure audits."
                ]
              },
              {
                period: "Dec 2022 – Jul 2023",
                role: "SOC Analyst — Threat Hunter",
                company: "RRG Engineering Technologies (Contracted to Nuclear Fuel Complex - NFC)",
                location: "Kota, Rajasthan, India",
                tags: ["24x7 CNI SOC", "Blu Sapphire SIEM", "+35% Detection Boost", "Malware Sandboxing"],
                bullets: [
                  "CNI SOC Operations: Threat hunting and incident response SME in a 24x7 critical nuclear infrastructure SOC (DOE-equivalent sensitivity), monitoring telemetry via Blu Sapphire SIEM.",
                  "Sandbox Analysis: Reproduced adversary exploit signatures in isolated lab environments; performed behavioral malware analysis with Kaspersky EDR to reverse-engineer TTPs.",
                  "Detection Engineering: Tuned SIEM correlation rules and EDR behavioral rules, yielding a 35% improvement in true-positive detection rates while eliminating alert fatigue."
                ]
              },
              {
                period: "Aug 2022 – Oct 2022",
                role: "SOC Analyst — IDS & Signature Development",
                company: "E2E Networks Limited",
                location: "Vellore, Tamil Nadu, India",
                tags: ["Snort IDS", "Wazuh SIEM", "Perimeter Blocklist"],
                bullets: [
                  "IDS Engineering: Authored and deployed custom Snort and Wazuh IDS signatures to capture novel attack patterns.",
                  "Threat Intelligence: Automated AbuseIPDB threat feed ingestion to enforce real-time perimeter firewall IP blocklisting.",
                  "Telemetry Analysis: Analyzed bandwidth and network traffic logs to identify routing loops and anomalies."
                ]
              },
              {
                period: "Dec 2021 – May 2022",
                role: "Technical Support Executive",
                company: "Teleperformance",
                location: "Jaipur, Rajasthan, India",
                tags: ["Enterprise Support", "Microsoft Suite", "SLA Compliance"],
                bullets: [
                  "Delivered Tier-2 Microsoft enterprise support via the Rave ticketing platform, maintaining SLA compliance and documenting security knowledge bases."
                ]
              }
            ].map((exp, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline Node Point */}
                <div className="absolute -left-[41px] sm:-left-[49px] top-4 w-5 h-5 rounded-full border-[3px] border-white bg-blue-500 shadow-md group-hover:scale-125 transition-transform duration-300"></div>
                
                <TiltWrapper key={idx} className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl space-y-5 hover:shadow-xl hover:bg-white/60 transition-all duration-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold font-mono shadow-inner">{exp.period}</span>
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-blue-400" /> {exp.location}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-title text-slate-900">{exp.role}</h3>
                    <div className="text-sm text-slate-600 font-semibold">{exp.company}</div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className={`px-3 py-1 rounded-lg text-[11px] font-bold tracking-wide border shadow-sm ${tag.includes("%") || tag.includes("+") ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-white border-black/5 text-slate-600"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-3 text-sm text-slate-600 leading-relaxed list-disc pl-5 pt-3 marker:text-blue-400">
                    {exp.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                </TiltWrapper>
              </div>
            ))}
          </div>
        </section>

        {/* TECHNICAL PROJECTS */}
        <section id="projects" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">04 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Key Security Projects</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "CDAC/CERT-In Compliance Engine",
                status: "NIC Production (Classified)",
                desc: "Engineered a PowerShell & Python framework executing 120+ automated system configuration checks mapped to NIST standards across 750+ government nodes via KACE UEM.",
                tags: ["PowerShell", "Python", "KACE UEM", "NIST CSF"],
                badge: "Enterprise",
                color: "bg-blue-50 text-blue-700 border-blue-200"
              },
              {
                title: "Government NOC Admin Portal",
                status: "Live Deployment",
                desc: "A dashboard monitoring 38 district-level router nodes with real-time traceroute telemetry and a voice-input enabled RAG cybersecurity chatbot running locally (Ollama/LLM).",
                tags: ["React/Next.js", "Ollama LLM", "PHP API", "RAG"],
                badge: "Govt Deployment",
                link: "/noc/",
                color: "bg-indigo-50 text-indigo-700 border-indigo-200"
              },
              {
                title: "Real-Time Network Alert Dashboard",
                status: "Live Deployment",
                desc: "Automated ping monitoring and packet loss analysis dashboard for enterprise core routing units. Integrates custom outage alerting, noise filters, and live telemetry log feeds.",
                tags: ["JavaScript", "CSS Grid", "Fetch API", "WebSockets"],
                badge: "Live Gateway",
                link: "/alert/",
                color: "bg-violet-50 text-violet-700 border-violet-200"
              },
              {
                title: "Cyber Free Rice Initiative",
                status: "Charity Quiz",
                desc: "Interactive education platform featuring a stunning macOS-inspired UI. User quiz scores are simulated to feed directly into food charity initiatives (FreeRice concept).",
                tags: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS"],
                badge: "Community",
                link: "/charity-quiz",
                color: "bg-emerald-50 text-emerald-700 border-emerald-200"
              }
            ].map((project, idx) => (
              <TiltWrapper key={idx} className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl flex flex-col justify-between hover:bg-white/60 hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{project.status}</span>
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${project.color}`}>{project.badge}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold font-title text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.desc}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white border border-black/5 rounded-lg text-[11px] font-bold text-slate-600 shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg"
                    >
                      <span>Launch Project</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 text-slate-400 text-xs font-bold cursor-not-allowed">Internal Infrastructure Only</span>
                  )}
                </div>
              </TiltWrapper>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS & CREDENTIALS */}
        <section id="certs" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">05 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Certifications &amp; Training</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Completed List */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-title font-bold text-slate-800 flex items-center gap-3"><Award className="w-6 h-6 text-blue-600" /> Completed Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Fortinet Certified Associate (FCA) in Cybersecurity",
                  "Red Hat Certified System Administrator (RHCSA)",
                  "In the Trenches: SOC - EC-Council",
                  "Autopsy Basics (Digital Forensics) - BasisTech",
                  "Fundamental AI Concepts - Microsoft",
                  "Ethical Hacking Expert - Star Certification",
                  "Security Management & Governance - Royal Holloway",
                  "TCM Security Live Training & Certifications"
                ].map((cert, idx) => (
                  <div key={idx} className="p-4 bg-white/60 border border-black/5 rounded-2xl text-sm font-semibold text-slate-700 flex items-start gap-3 shadow-sm hover:shadow-md transition-shadow backdrop-blur-xl">
                    <span className="text-blue-500 font-black mt-0.5">✓</span>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Certifications Roadmap */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-title font-bold text-slate-800 flex items-center gap-3"><BookOpen className="w-6 h-6 text-indigo-600" /> Targeted Roadmap</h3>
              <div className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl shadow-sm space-y-6">
                <div className="space-y-4">
                  {[
                    { cert: "eJPT (eLearnSecurity)", time: "Target Q4 2026" },
                    { cert: "CEH v13 / CompTIA Security+", time: "Target 2026" },
                    { cert: "CISSP (ISC2)", time: "Roadmap Q3 2027" },
                    { cert: "OSCP / PEN-200 (Offensive Security)", time: "Post-CISSP" }
                  ].map((target, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-3 text-sm border-b border-black/5 pb-3">
                      <span className="font-bold text-slate-700">{target.cert}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap">{target.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-sm text-slate-600 leading-relaxed pt-3">
                  <strong>Offensive Labs Active Practice:</strong> Hack The Box (Active Directory, Pro Hacker rank), Vulnlab (AD multi-forest pivots, Domain Controller compromise).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">06 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Education</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                degree: "Master of Business Administration (MBA) in Cybersecurity",
                school: "Chitkara University, India",
                period: "Expected Jul 2027 (In Progress)"
              },
              {
                degree: "B.Tech in Computer Science & Engineering",
                school: "Manipal University Jaipur, India",
                period: "Graduated 2022"
              }
            ].map((edu, idx) => (
              <div key={idx} className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <span className="inline-block px-3 py-1 bg-white border border-black/5 text-blue-600 rounded-full text-xs font-bold shadow-sm">{edu.period}</span>
                  <h3 className="text-xl font-bold font-title text-slate-900 pt-2">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-slate-500">{edu.school}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / ESTABLISH CONNECTION */}
        <section id="contact" className="space-y-6 pt-16 pb-12">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-blue-500 font-bold">07 /</span>
            <h2 className="text-3xl font-bold font-title text-slate-900">Establish Connection</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-black/10 to-transparent"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-4">
              <TiltWrapper className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl space-y-6 shadow-sm">
                <h3 className="text-2xl font-bold font-title text-slate-900">Get in Touch</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  Open to enterprise SecOps, Purple Teaming, Detection Engineering, or Red Team roles — worldwide remote and relocation opportunities.
                </p>
                
                <div className="space-y-4 font-mono text-sm font-bold text-slate-600">
                  <a href="mailto:adityasec32@gmail.com" className="flex items-center gap-4 hover:text-blue-600 hover:bg-white transition-all p-4 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>adityasec32@gmail.com</span>
                  </a>
                  <a href="tel:+917400588896" className="flex items-center gap-4 hover:text-blue-600 hover:bg-white transition-all p-4 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>+91 740 058 8896</span>
                  </a>
                  <a href="https://linkedin.com/in/ajainx1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-blue-600 hover:bg-white transition-all p-4 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                    <span>linkedin.com/in/ajainx1</span>
                  </a>
                  <a href="https://github.com/ajainx1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 hover:text-blue-600 hover:bg-white transition-all p-4 bg-white/60 rounded-2xl border border-black/5 shadow-sm">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    <span>github.com/ajainx1</span>
                  </a>
                </div>
              </TiltWrapper>
            </div>

            {/* PGP Secure Command / Relocation List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-8 rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl space-y-5 shadow-sm">
                <div className="flex items-center gap-3 text-slate-800">
                  <div className="p-2 bg-slate-100 rounded-xl border border-black/5">
                    <Key className="w-6 h-6" />
                  </div>
                  <h3 className="font-title font-bold text-xl">Secure Communications</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  To securely share logs, endpoints, or project briefs, import my PGP public key directly:
                </p>
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 select-all shadow-inner">
                  curl -s https://adityasec32.systems/pgp.asc | gpg --import
                </div>
              </div>

              {/* Relocation details */}
              <div className="p-6 rounded-[24px] border border-red-100 bg-red-50/50 backdrop-blur-xl text-sm text-slate-600 shadow-sm">
                <h4 className="font-title font-bold text-red-900 mb-2 flex items-center gap-2"><MapPin className="w-5 h-5 text-red-500" /> Relocation Interests (U.S. Sponsorship)</h4>
                Washington D.C. Metro Area, Northern Virginia (NOVA), Austin TX, Dallas TX, or Chicago IL.
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-black/5 bg-slate-100/50 py-8 text-xs text-slate-500 font-semibold backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            <span>Session Active — © 2026 Aditya Jain. All rights reserved.</span>
          </div>
          <div>Built with Next.js &amp; Tailwind • Deployed via GitHub Pages</div>
        </div>
      </footer>

    </div>
  );
}
