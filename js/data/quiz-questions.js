export const quizQuestions = [
  {
    question: "Which of the following is a symmetric encryption algorithm?",
    options: ["RSA", "AES", "DSA", "ECC"],
    answer: 1 // AES is at index 1
  },
  {
    question: "What does SIEM stand for in cybersecurity?",
    options: [
      "System Information and Event Monitoring",
      "Security Information and Event Management",
      "Secure Integration of Enterprise Modules",
      "System Incident and Event Management"
    ],
    answer: 1
  },
  {
    question: "In Active Directory, what is a 'Golden Ticket' attack?",
    options: [
      "Forging a TGT (Ticket Granting Ticket) using the krbtgt hash",
      "Stealing a user's password directly from the SAM database",
      "Bypassing MFA on a domain controller",
      "Creating a rogue domain admin account"
    ],
    answer: 0
  },
  {
    question: "Which port is typically used for SSH?",
    options: ["21", "22", "23", "443"],
    answer: 1
  },
  {
    question: "What is the primary purpose of an EDR solution?",
    options: [
      "To encrypt data at rest",
      "To filter incoming network traffic",
      "To monitor and respond to threats on endpoint devices",
      "To provide VPN access to remote workers"
    ],
    answer: 2
  },
  {
    question: "What does the 'A' in the CIA triad stand for?",
    options: ["Authentication", "Authorization", "Availability", "Accountability"],
    answer: 2
  },
  {
    question: "Which attack method involves tricking a user into clicking a malicious link by masquerading as a trustworthy entity?",
    options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Phishing", "Man-in-the-Middle (MitM)"],
    answer: 2
  },
  {
    question: "What is the function of a 'salt' in password hashing?",
    options: [
      "To encrypt the password so it can be decrypted later",
      "To add random data to the password before hashing to defend against rainbow tables",
      "To make the password easier to remember",
      "To compress the password hash for storage"
    ],
    answer: 1
  },
  {
    question: "Which HTTP status code indicates 'Forbidden'?",
    options: ["200", "401", "403", "404"],
    answer: 2
  },
  {
    question: "What is 'Purple Teaming' in cybersecurity?",
    options: [
      "When red and blue teams work together collaboratively to improve defenses",
      "A team dedicated solely to physical security testing",
      "An automated vulnerability scanning process",
      "A group that writes malware for research"
    ],
    answer: 0
  }
];
