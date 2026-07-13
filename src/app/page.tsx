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
    "• Fortinet Certified Associate in Cybersecurity (FCAC)",
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
    <div className="min-h-screen relative flex flex-col font-sans bg-[#0b0f19] text-[#f8fafc]">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[#0b0f19]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 font-title font-bold text-lg tracking-wide hover:opacity-90 transition-opacity">
            <span className="bg-[var(--primary)] text-[#0b0f19] px-2 py-0.5 rounded text-sm font-mono">AJ</span>
            <span>Aditya<span className="text-[var(--primary)]">.</span>Jain</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--muted)]">
            <a href="#about" className="hover:text-[var(--fg)] transition-colors">About</a>
            <a href="#skills" className="hover:text-[var(--fg)] transition-colors">Competencies</a>
            <a href="#experience" className="hover:text-[var(--fg)] transition-colors">Experience</a>
            <a href="#projects" className="hover:text-[var(--fg)] transition-colors">Projects</a>
            <a href="#certs" className="hover:text-[var(--fg)] transition-colors">Credentials</a>
            <a href="#contact" className="hover:text-[var(--fg)] transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--card)]/40 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse"></span>
              <span>{visitorCount} visitors</span>
            </div>
            <a 
              href="/Aditya_Jain_Cybersecurity_Engineer_US.pdf" 
              download 
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[var(--card2)] border border-[var(--border2)] text-[var(--fg)] hover:bg-[var(--card)] transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>
          </div>
        </div>
      </header>

      {/* Telemetry Indicator Row */}
      <div className="w-full border-b border-[var(--border)] bg-[#0f172a]/40 py-2 text-xs font-mono text-[var(--muted)] overflow-x-auto whitespace-nowrap">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 items-center">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> SEC_CORE: ACTIVE</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> AD_HARDENED: TRUE</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500"></span> BGP_RTT: 18.2ms</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> THREEJS: POWER_HIGH</div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-10rem)]">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border2)] bg-[var(--card)]/50 backdrop-blur-md text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>SecOps • Purple Team • Threat Hunting</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-title tracking-tight text-[var(--fg)] leading-none">
              Aditya <span className="text-[var(--primary)] glow">Jain</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl leading-relaxed">
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
                <div key={i} className="p-3 bg-[var(--card)]/20 border border-[var(--border)] rounded-xl backdrop-blur-sm">
                  <div className="text-2xl font-bold text-[var(--primary)] font-mono">{stat.value}</div>
                  <div className="text-[10px] text-[var(--muted)] uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-6">
              <Link href="/js" className="group px-5 py-2.5 text-sm font-semibold text-[var(--bg)] bg-[var(--primary)] rounded-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-[var(--primary-glow)] shadow-md">
                <TermIcon className="w-4 h-4" />
                <span>JumpStreet Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/charity-quiz" className="group px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500">
                <span>🎮</span>
                <span>Play Charity Quiz</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#about" className="px-5 py-2.5 text-sm font-semibold text-[var(--fg)] bg-[var(--card2)] border border-[var(--border2)] rounded-lg hover:bg-[var(--card)] transition-colors shadow-sm">
                View Full Portfolio
              </a>
            </div>
          </div>

          {/* Interactive React Terminal Card */}
          <div className="lg:col-span-5 w-full">
            <TiltWrapper className="w-full h-[400px] rounded-xl border border-[var(--border2)] bg-[#0d1117] overflow-hidden flex flex-col shadow-2xl">
              <div className="bg-[#161b22] px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <div className="text-[10px] font-mono text-[var(--muted)]">aditya@secops:~ — audit_node v2.6</div>
              </div>
              
              <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
                {terminalHistory.map((line, idx) => (
                  <div key={idx} className={line.startsWith("aditya@secops:~$") ? "text-[var(--primary)]" : "text-slate-300"}>
                    {line}
                  </div>
                ))}
                <div ref={terminalEndRef}></div>
              </div>

              {/* Terminal Quick Options */}
              <div className="px-4 py-2 border-t border-[var(--border)]/40 bg-[#0d1117]/80 flex gap-2 overflow-x-auto text-[10px] font-mono">
                <span className="text-[var(--muted)] self-center">Try:</span>
                <button onClick={() => runTerminalShortcut("whoami")} className="px-2 py-0.5 bg-[var(--card2)] border border-[var(--border)] rounded text-slate-300 hover:border-[var(--primary)] hover:text-white transition-colors">whoami</button>
                <button onClick={() => runTerminalShortcut("skills")} className="px-2 py-0.5 bg-[var(--card2)] border border-[var(--border)] rounded text-slate-300 hover:border-[var(--primary)] hover:text-white transition-colors">skills</button>
                <button onClick={() => runTerminalShortcut("exp")} className="px-2 py-0.5 bg-[var(--card2)] border border-[var(--border)] rounded text-slate-300 hover:border-[var(--primary)] hover:text-white transition-colors">exp</button>
                <button onClick={() => runTerminalShortcut("certs")} className="px-2 py-0.5 bg-[var(--card2)] border border-[var(--border)] rounded text-slate-300 hover:border-[var(--primary)] hover:text-white transition-colors">certs</button>
                <button onClick={() => runTerminalShortcut("clear")} className="px-2 py-0.5 bg-red-950/20 border border-red-500/30 rounded text-red-400 hover:bg-red-900/30 transition-colors">clear</button>
              </div>

              <form onSubmit={handleCommandSubmit} className="border-t border-[var(--border)] bg-[#161b22] px-4 py-3 flex gap-2">
                <span className="font-mono text-xs text-[var(--primary)] self-center">aditya@secops:~$</span>
                <input 
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="flex-1 bg-transparent font-mono text-xs text-slate-100 focus:outline-none" 
                  placeholder="type a command (whoami, skills)..."
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
            <span className="text-xl font-mono text-[var(--primary)]">01 /</span>
            <h2 className="text-3xl font-bold font-title">Professional Summary</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4 text-[var(--muted)] leading-relaxed text-base sm:text-lg">
              <p>
                Highly capable <strong>Cybersecurity Engineer &amp; SME</strong> with <strong>4+ years of hands-on enterprise experience</strong> architecting, tuning, and defending critical IT and e-governance systems. Currently managing large-scale SecOps operations at Ebix Technologies contracted directly to the National Informatics Centre (NIC).
              </p>
              <p>
                Adept at offensive simulations (Active Directory exploitation, payload analysis, and sandbox malware replication) and defensive engineering (writing custom Wazuh/Snort IDS rules, tuning SIEM systems, and orchestrating EDR policies).
              </p>
              <p>
                Proven ability to automate regulatory auditing through custom PowerShell and Python frameworks, reducing overall audit cycles by 60% and successfully responding to national CERT-In security advisories.
              </p>
              <p className="text-sm font-medium text-[var(--fg)] border-l-2 border-[var(--primary)] pl-3">
                🎯 Open to U.S. Relocation / H-1B Sponsorship. Currently targeted locations: Washington D.C. Metro, Northern Virginia, Austin TX, Dallas TX, or Chicago IL.
              </p>
            </div>
            
            <div className="lg:col-span-5">
              <TiltWrapper className="p-5 rounded-xl border border-[var(--border2)] bg-[var(--card)]/40 backdrop-blur-md shadow-lg">
                <div className="text-xs font-mono text-[var(--primary)] border-b border-[var(--border)]/40 pb-2 mb-3">~/profile.json</div>
                <pre className="text-xs font-mono text-slate-300 leading-normal overflow-x-auto whitespace-pre">
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
            <span className="text-xl font-mono text-[var(--primary)]">02 /</span>
            <h2 className="text-3xl font-bold font-title">Core Competencies</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
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
              <TiltWrapper key={idx} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/20 backdrop-blur-sm flex flex-col justify-between hover:border-[var(--border2)] transition-colors">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[var(--primary)]">
                    <Cpu className="w-5 h-5" />
                    <h3 className="font-title font-semibold text-lg">{skill.title}</h3>
                  </div>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{skill.desc}</p>
                </div>
              </TiltWrapper>
            ))}
          </div>
        </section>

        {/* EXPERIENCE TIMELINE */}
        <section id="experience" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-[var(--primary)]">03 /</span>
            <h2 className="text-3xl font-bold font-title">Professional Experience</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <div className="relative border-l border-[var(--border2)] ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-12">
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
                <div className="absolute -left-[31px] sm:-left-[41px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--primary)] bg-[#0b0f19] group-hover:bg-[var(--primary)] transition-colors duration-300"></div>
                
                <TiltWrapper key={idx} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/10 backdrop-blur-sm space-y-4 hover:border-[var(--border2)] transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-mono text-[var(--primary)]">{exp.period}</span>
                    <span className="text-xs text-[var(--muted)] flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {exp.location}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-title">{exp.role}</h3>
                    <div className="text-sm text-[var(--muted)] font-medium">{exp.company}</div>
                  </div>

                  {/* Highlights Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {exp.tags.map((tag, i) => (
                      <span key={i} className={`px-2.5 py-0.5 rounded text-[10px] font-mono border ${tag.includes("%") || tag.includes("+") ? "bg-[var(--primary-glow)] border-[var(--primary)] text-[var(--primary)]" : "bg-[var(--card2)] border-[var(--border)] text-[var(--muted)]"}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <ul className="space-y-2 text-sm text-[var(--muted)] leading-relaxed list-disc pl-4 pt-2">
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
            <span className="text-xl font-mono text-[var(--primary)]">04 /</span>
            <h2 className="text-3xl font-bold font-title">Key Security Projects</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "CDAC/CERT-In Compliance Engine",
                status: "NIC Production (Classified)",
                desc: "Engineered a PowerShell & Python framework executing 120+ automated system configuration checks mapped to NIST standards across 750+ government nodes via KACE UEM.",
                tags: ["PowerShell", "Python", "KACE UEM", "NIST CSF"],
                badge: "Enterprise",
                color: "border-[var(--primary)] bg-[var(--primary-glow)] text-[var(--primary)]"
              },
              {
                title: "Government NOC Admin Portal",
                status: "Live Deployment",
                desc: "A dashboard monitoring 38 district-level router nodes with real-time traceroute telemetry and a voice-input enabled RAG cybersecurity chatbot running locally (Ollama/LLM).",
                tags: ["React/Next.js", "Ollama LLM", "PHP API", "RAG"],
                badge: "Govt Deployment",
                link: "/noc/",
                color: "border-sky-500/30 bg-sky-500/10 text-sky-400"
              },
              {
                title: "Real-Time Network Alert Dashboard",
                status: "Live Deployment",
                desc: "Automated ping monitoring and packet loss analysis dashboard for enterprise core routing units. Integrates custom outage alerting, noise filters, and live telemetry log feeds.",
                tags: ["JavaScript", "CSS Grid", "Fetch API", "WebSockets"],
                badge: "Live Gateway",
                link: "/alert/",
                color: "border-purple-500/30 bg-purple-500/10 text-purple-400"
              },
              {
                title: "Cyber Free Rice Initiative",
                status: "Charity Quiz",
                desc: "Interactive cybersecurity education and awareness platform. User quiz scores are simulated to feed directly into food charity initiatives (FreeRice concept). Deployed on Next.js.",
                tags: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS"],
                badge: "Community",
                link: "/charity-quiz",
                color: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              }
            ].map((project, idx) => (
              <TiltWrapper key={idx} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/10 backdrop-blur-sm flex flex-col justify-between hover:border-[var(--border2)] transition-colors relative overflow-hidden group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[var(--muted)]">{project.status}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${project.color}`}>{project.badge}</span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-title">{project.title}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed">{project.desc}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 bg-[var(--card2)] border border-[var(--border)] rounded text-[10px] font-mono text-[var(--muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] hover:underline"
                    >
                      <span>Launch Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs font-mono text-[var(--muted)] cursor-default">Internal Infrastructure Only</span>
                  )}
                </div>
              </TiltWrapper>
            ))}
          </div>
        </section>

        {/* CERTIFICATIONS & CREDENTIALS */}
        <section id="certs" className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-[var(--primary)]">05 /</span>
            <h2 className="text-3xl font-bold font-title">Certifications &amp; Training</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Completed List */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-title font-semibold flex items-center gap-2"><Award className="w-5 h-5 text-[var(--primary)]" /> Completed Credentials</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Fortinet Certified Associate in Cybersecurity (FCAC)",
                  "Red Hat Certified System Administrator (RHCSA)",
                  "In the Trenches: SOC - EC-Council",
                  "Autopsy Basics (Digital Forensics) - BasisTech",
                  "Fundamental AI Concepts - Microsoft",
                  "Ethical Hacking Expert - Star Certification",
                  "Security Management & Governance - Royal Holloway",
                  "TCM Security Live Training & Certifications"
                ].map((cert, idx) => (
                  <div key={idx} className="p-3 bg-[var(--card)]/10 border border-[var(--border)] rounded-lg text-sm text-slate-300 flex items-start gap-2">
                    <span className="text-[var(--primary)] font-mono font-bold">[+]</span>
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Certifications Roadmap */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-title font-semibold flex items-center gap-2"><BookOpen className="w-5 h-5 text-sky-400" /> Targeted Roadmap</h3>
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[#1e293b]/20 backdrop-blur-sm space-y-4">
                <div className="space-y-3">
                  {[
                    { cert: "eJPT (eLearnSecurity)", time: "Target Q4 2026" },
                    { cert: "CEH v13 / CompTIA Security+", time: "Target 2026" },
                    { cert: "CISSP (ISC2)", time: "Roadmap Q3 2027" },
                    { cert: "OSCP / PEN-200 (Offensive Security)", time: "Post-CISSP" }
                  ].map((target, idx) => (
                    <div key={idx} className="flex justify-between items-center gap-2 text-sm border-b border-[var(--border)]/30 pb-2">
                      <span className="font-semibold text-slate-200">{target.cert}</span>
                      <span className="text-xs font-mono text-[var(--primary)] bg-[var(--primary-glow)] px-2 py-0.5 rounded border border-[var(--primary)]/30 whitespace-nowrap">{target.time}</span>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-[var(--muted)] leading-relaxed pt-2">
                  <strong>Offensive Labs Active Practice:</strong> Hack The Box (Active Directory, Pro Hacker rank), Vulnlab (AD multi-forest pivots, Domain Controller compromise).
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="space-y-6 pt-16">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-[var(--primary)]">06 /</span>
            <h2 className="text-3xl font-bold font-title">Education</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
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
              <div key={idx} className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/20 backdrop-blur-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-mono text-[var(--primary)]">{edu.period}</span>
                  <h3 className="text-lg font-bold font-title">{edu.degree}</h3>
                  <p className="text-sm text-[var(--muted)]">{edu.school}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT / ESTABLISH CONNECTION */}
        <section id="contact" className="space-y-6 pt-16 pb-12">
          <div className="flex items-center gap-3">
            <span className="text-xl font-mono text-[var(--primary)]">07 /</span>
            <h2 className="text-3xl font-bold font-title">Establish Connection</h2>
            <div className="flex-1 h-px bg-[var(--border)]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-4">
              <TiltWrapper className="p-6 rounded-xl border border-[var(--border)] bg-[var(--card)]/30 backdrop-blur-sm space-y-4">
                <h3 className="text-xl font-bold font-title">Get in Touch</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  Open to enterprise SecOps, Purple Teaming, Detection Engineering, or Red Team roles — worldwide remote and relocation opportunities.
                </p>
                
                <div className="space-y-3 font-mono text-xs text-slate-300">
                  <a href="mailto:adityasec32@gmail.com" className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors p-2 bg-[#0b0f19]/60 rounded border border-[var(--border)]/40">
                    <Mail className="w-4 h-4 text-[var(--primary)]" />
                    <span>adityasec32@gmail.com</span>
                  </a>
                  <a href="tel:+917400588896" className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors p-2 bg-[#0b0f19]/60 rounded border border-[var(--border)]/40">
                    <Phone className="w-4 h-4 text-[var(--primary)]" />
                    <span>+91 740 058 8896</span>
                  </a>
                  <a href="https://linkedin.com/in/ajainx1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors p-2 bg-[#0b0f19]/60 rounded border border-[var(--border)]/40">
                    <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                    <span>linkedin.com/in/ajainx1</span>
                  </a>
                  <a href="https://github.com/ajainx1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--primary)] transition-colors p-2 bg-[#0b0f19]/60 rounded border border-[var(--border)]/40">
                    <svg className="w-4 h-4 text-[var(--primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                    </svg>
                    <span>github.com/ajainx1</span>
                  </a>
                </div>
              </TiltWrapper>
            </div>

            {/* PGP Secure Command / Relocation List */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-xl border border-[var(--border2)] bg-[var(--card)]/40 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 text-[var(--primary)]">
                  <Key className="w-5 h-5 animate-pulse" />
                  <h3 className="font-title font-semibold text-lg">Secure Communications</h3>
                </div>
                <p className="text-sm text-[var(--muted)] leading-relaxed">
                  To securely share logs, endpoints, or project briefs, import my PGP public key directly:
                </p>
                <div className="p-3 bg-black/60 rounded border border-[var(--border)] font-mono text-[11px] text-[var(--muted)] select-all leading-normal">
                  curl -s https://adityasec32.systems/pgp.asc | gpg --import
                </div>
              </div>

              {/* Relocation details */}
              <div className="p-5 rounded-xl border border-[var(--border)] bg-[#1e293b]/10 backdrop-blur-sm text-sm text-[var(--muted)]">
                <h4 className="font-title font-semibold text-[#f8fafc] mb-1.5 flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400" /> Relocation Interests (U.S. Sponsorship)</h4>
                Washington D.C. Metro Area, Northern Virginia (NOVA), Austin TX, Dallas TX, or Chicago IL.
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--border)] bg-[#0b0f19]/90 py-6 text-xs text-[var(--muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Session Active — © 2026 Aditya Jain. All rights reserved.</span>
          </div>
          <div>Built with Next.js &amp; Three.js • Deployed via GitHub Pages</div>
        </div>
      </footer>

    </div>
  );
}
