export const quizQuestions = [
  // Fundamentals
  { question: "What does the 'A' in the CIA triad stand for?", options: ["Authentication", "Authorization", "Availability", "Accountability"], answer: 2 },
  { question: "Which HTTP status code indicates 'Forbidden'?", options: ["200", "401", "403", "404"], answer: 2 },
  { question: "What is 'Purple Teaming' in cybersecurity?", options: ["When red and blue teams collaborate to improve defenses", "A team dedicated to physical security testing", "Automated vulnerability scanning", "Writing malware for research"], answer: 0 },
  { question: "What does 'Zero Trust' architecture mean?", options: ["Never trust, always verify every access request", "Trust local network traffic only", "Eliminate all user passwords", "Block all inbound internet traffic"], answer: 0 },
  
  // Encryption & Cryptography
  { question: "Which of the following is a symmetric encryption algorithm?", options: ["RSA", "AES", "DSA", "ECC"], answer: 1 },
  { question: "What is the function of a 'salt' in password hashing?", options: ["To encrypt the password for later decryption", "To add random data to defend against rainbow tables", "To make the password easier to remember", "To compress the password hash"], answer: 1 },
  { question: "Which protocol is designed to provide communication security over a computer network?", options: ["HTTP", "TLS", "FTP", "Telnet"], answer: 1 },
  { question: "What does PKI stand for?", options: ["Public Key Infrastructure", "Private Key Interchange", "Pre-shared Key Initialization", "Personal Key Identifier"], answer: 0 },
  
  // Enterprise SecOps & Infrastructure
  { question: "What does SIEM stand for in cybersecurity?", options: ["System Information and Event Monitoring", "Security Information and Event Management", "Secure Integration of Enterprise Modules", "System Incident and Event Management"], answer: 1 },
  { question: "What is the primary purpose of an EDR solution?", options: ["To encrypt data at rest", "To filter incoming network traffic", "To monitor and respond to threats on endpoints", "To provide VPN access"], answer: 2 },
  { question: "Which tool is commonly used for network protocol analysis?", options: ["Metasploit", "Burp Suite", "Wireshark", "John the Ripper"], answer: 2 },
  { question: "What is the main function of a WAF (Web Application Firewall)?", options: ["Protect against physical tampering", "Filter and monitor HTTP traffic to a web application", "Encrypt hard drives", "Manage active directory users"], answer: 1 },
  
  // Active Directory & Windows
  { question: "In Active Directory, what is a 'Golden Ticket' attack?", options: ["Forging a TGT using the krbtgt hash", "Stealing a user's password from the SAM database", "Bypassing MFA on a domain controller", "Creating a rogue domain admin account"], answer: 0 },
  { question: "Which protocol does Active Directory primarily use for authentication?", options: ["NTLM", "RADIUS", "Kerberos", "SAML"], answer: 2 },
  { question: "What is 'BloodHound' primarily used for?", options: ["Antivirus scanning", "Mapping complex Active Directory relationships", "Packet sniffing", "DDoS mitigation"], answer: 1 },
  
  // Attacks & Vulnerabilities
  { question: "Which attack tricks a user into clicking a malicious link by masquerading as a trustworthy entity?", options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Phishing", "Man-in-the-Middle (MitM)"], answer: 2 },
  { question: "What vulnerability occurs when an application includes untrusted data in a web page without proper validation?", options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Buffer Overflow", "CSRF"], answer: 1 },
  { question: "What is a 'Supply Chain Attack'?", options: ["Attacking the logistics of hardware delivery", "Compromising a third-party vendor to access the primary target", "Stealing physical inventory", "Flooding an e-commerce site with traffic"], answer: 1 },
  { question: "What kind of attack uses a botnet to overwhelm a target server with traffic?", options: ["DDoS", "Phishing", "Ransomware", "SQL Injection"], answer: 0 },
  
  // Networking
  { question: "Which port is typically used for SSH?", options: ["21", "22", "23", "443"], answer: 1 },
  { question: "What port is associated with RDP (Remote Desktop Protocol)?", options: ["3389", "8080", "445", "139"], answer: 0 },
  { question: "Which DNS record type maps a domain name to an IPv4 address?", options: ["MX", "CNAME", "A", "TXT"], answer: 2 },
  
  // General & Policy
  { question: "What does the Principle of Least Privilege dictate?", options: ["Give everyone admin rights for efficiency", "Users get only the access rights necessary for their job", "All access is denied by default", "Use passwords with fewer characters"], answer: 1 },
  { question: "What is a honeypot used for?", options: ["Storing legitimate user passwords securely", "Decoying attackers to study their tactics", "Increasing network throughput", "Patching vulnerabilities automatically"], answer: 1 },
  { question: "What is OSINT?", options: ["Open Source Intelligence", "Operating System Interface", "Outbound System Interception", "Open Standard Interoperability"], answer: 0 },
  { question: "What does MFA stand for?", options: ["Multi-Factor Authentication", "Main Firewall Access", "Malware Filtering Application", "Master File Allocation"], answer: 0 }
];
