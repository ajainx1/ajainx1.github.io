export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type CategoryKey = 'network' | 'web' | 'crypto' | 'compliance' | 'gk' | 'science' | 'history';

export interface Question {
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  hint: string;
  scenario?: string;
}

export interface CategoryData {
  title: string;
  description: string;
  questions: Question[];
}

export const quizData: Record<CategoryKey, CategoryData> = {
  network: {
    title: "Network Security",
    description: "Defend the perimeter. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "Which port is typically used for SSH?", options: ["21", "22", "23", "443"], answer: 1, hint: "It is one higher than FTP's control port." },
      { difficulty: 'beginner', question: "What port is associated with RDP (Remote Desktop Protocol)?", options: ["3389", "8080", "445", "139"], answer: 0, hint: "It's in the 3000 range." },
      { difficulty: 'intermediate', question: "What does 'Zero Trust' architecture mean?", options: ["Never trust, always verify every access request", "Trust local network traffic only", "Eliminate all user passwords", "Block all inbound internet traffic"], answer: 0, hint: "Verification is required regardless of location." },
      { difficulty: 'intermediate', question: "Which DNS record type maps a domain name to an IPv4 address?", options: ["MX", "CNAME", "A", "TXT"], answer: 2, hint: "It's the first letter of the alphabet." },
      { difficulty: 'advanced', question: "What is the primary purpose of a BGP blackhole?", options: ["To speed up routing", "To drop traffic directed to a specific IP during a DDoS", "To encrypt internal traffic", "To compress HTTP responses"], answer: 1, hint: "It is often used as a defense mechanism against volumetric attacks." }
    ]
  },
  web: {
    title: "Web Security",
    description: "Secure the application layer. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "Which HTTP status code indicates 'Forbidden'?", options: ["200", "401", "403", "404"], answer: 2, hint: "It's in the 400 range, but not 'Not Found'." },
      { difficulty: 'beginner', question: "What vulnerability occurs when an application includes untrusted data in a web page without proper validation?", options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Buffer Overflow", "CSRF"], answer: 1, hint: "The acronym has two 'S's." },
      { difficulty: 'intermediate', question: "Which attack tricks a user into clicking a malicious link by masquerading as a trustworthy entity?", options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Phishing", "Man-in-the-Middle (MitM)"], answer: 2, hint: "It sounds like a popular outdoor activity with a rod." },
      { difficulty: 'intermediate', question: "What is the main function of a WAF (Web Application Firewall)?", options: ["Protect against physical tampering", "Filter and monitor HTTP traffic to a web application", "Encrypt hard drives", "Manage active directory users"], answer: 1, hint: "It acts as a shield specifically for HTTP/S traffic." },
      { difficulty: 'advanced', question: "What class of vulnerability is present when an API accepts a raw file path query parameter without sanitization, e.g. '?file=../../../../etc/passwd'?", options: ["SQL Injection (SQLi)", "Path Traversal / Local File Inclusion (LFI)", "Stored Cross-Site Scripting (XSS)", "Cross-Site Request Forgery (CSRF)"], answer: 1, hint: "It involves moving 'up' directories." }
    ]
  },
  crypto: {
    title: "Cryptography",
    description: "Master encryption. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "Which of the following is a symmetric encryption algorithm?", options: ["RSA", "AES", "DSA", "ECC"], answer: 1, hint: "Advanced Encryption Standard." },
      { difficulty: 'beginner', question: "Which protocol is designed to provide communication security over a computer network?", options: ["HTTP", "TLS", "FTP", "Telnet"], answer: 1, hint: "It replaced SSL." },
      { difficulty: 'intermediate', question: "What is the function of a 'salt' in password hashing?", options: ["To encrypt the password for later decryption", "To add random data to defend against rainbow tables", "To make the password easier to remember", "To compress the password hash"], answer: 1, hint: "It prevents pre-computed dictionary attacks." },
      { difficulty: 'intermediate', question: "What does PKI stand for?", options: ["Public Key Infrastructure", "Private Key Interchange", "Pre-shared Key Initialization", "Personal Key Identifier"], answer: 0, hint: "It manages digital certificates." },
      { difficulty: 'advanced', question: "In elliptic curve cryptography (ECC), what provides the security advantage over RSA?", options: ["It uses symmetric keys", "It offers equivalent security with significantly smaller key sizes", "It cannot be decrypted by quantum computers", "It is faster for bulk data encryption"], answer: 1, hint: "It requires less computational power and storage for the same strength." }
    ]
  },
  compliance: {
    title: "Compliance",
    description: "Navigate policies. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "What does the Principle of Least Privilege dictate?", options: ["Give everyone admin rights for efficiency", "Users get only the access rights necessary for their job", "All access is denied by default", "Use passwords with fewer characters"], answer: 1, hint: "Only give them what they need." },
      { difficulty: 'beginner', question: "What does MFA stand for?", options: ["Multi-Factor Authentication", "Main Firewall Access", "Malware Filtering Application", "Master File Allocation"], answer: 0, hint: "It requires more than just a password." },
      { difficulty: 'intermediate', question: "What does SIEM stand for in cybersecurity?", options: ["System Information and Event Monitoring", "Security Information and Event Management", "Secure Integration of Enterprise Modules", "System Incident and Event Management"], answer: 1, hint: "It manages security events." },
      { difficulty: 'intermediate', question: "Which framework is commonly used as a standard for information security management systems (ISMS)?", options: ["ISO 27001", "PCI DSS", "HIPAA", "GDPR"], answer: 0, hint: "It is an Information Security standard." },
      { difficulty: 'advanced', question: "Under GDPR, what is the maximum fine for a severe violation?", options: ["10 Million Euros", "20 Million Euros or 4% of global turnover", "500,000 Euros", "1% of annual profit"], answer: 1, hint: "It is the higher of a specific monetary amount or a percentage of global revenue." }
    ]
  },
  gk: {
    title: "General Knowledge",
    description: "Test your general trivia. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "Which is the largest ocean on Earth?", options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], answer: 2, hint: "It covers more than 30% of the Earth's surface." },
      { difficulty: 'beginner', question: "How many colors are there in a rainbow?", options: ["5", "6", "7", "8"], answer: 2, hint: "VIBGYOR color sequence." },
      { difficulty: 'intermediate', question: "Which country is the native home of the Kangaroo?", options: ["South Africa", "Australia", "New Zealand", "Austria"], answer: 1, hint: "It is both a continent and a country." },
      { difficulty: 'intermediate', question: "What is the capital city of Japan?", options: ["Kyoto", "Osaka", "Seoul", "Tokyo"], answer: 3, hint: "It is the most populous metropolitan area in the world." },
      { difficulty: 'advanced', question: "What is the smallest country in the world by land area?", options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"], answer: 1, hint: "It is an independent city-state enclaved within Rome, Italy." }
    ]
  },
  science: {
    title: "Science & Space",
    description: "Explore the universe. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "Which planet in our solar system is known as the Red Planet?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2, hint: "It is named after the Roman god of war." },
      { difficulty: 'beginner', question: "What gas do humans need to breathe in to survive?", options: ["Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"], answer: 2, hint: "It makes up about 21% of Earth's atmosphere." },
      { difficulty: 'intermediate', question: "What is the chemical formula for water?", options: ["H2O", "CO2", "O2", "NaCl"], answer: 0, hint: "Two parts hydrogen, one part oxygen." },
      { difficulty: 'intermediate', question: "Which is the closest star to Earth?", options: ["Alpha Centauri", "Sirius", "The Sun", "Betelgeuse"], answer: 2, hint: "It dominates our daylight sky." },
      { difficulty: 'advanced', question: "What is the speed of light in a vacuum?", options: ["150,000 km/s", "299,792 km/s", "500,000 km/s", "1,000,000 km/s"], answer: 1, hint: "It is approximately 300,000 kilometers per second." }
    ]
  },
  history: {
    title: "History & Culture",
    description: "Learn about the past. Feed the hungry.",
    questions: [
      { difficulty: 'beginner', question: "Who was the first President of the United States?", options: ["Abraham Lincoln", "Thomas Jefferson", "George Washington", "John Adams"], answer: 2, hint: "He is featured on the US one-dollar bill." },
      { difficulty: 'beginner', question: "Which ancient civilization built the Great Pyramids?", options: ["Romans", "Greeks", "Egyptians", "Mayans"], answer: 2, hint: "They lived along the Nile River." },
      { difficulty: 'intermediate', question: "In which year did World War II end?", options: ["1918", "1939", "1945", "1950"], answer: 2, hint: "It ended in 1945." },
      { difficulty: 'intermediate', question: "Who painted the famous Mona Lisa?", options: ["Michelangelo", "Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso"], answer: 2, hint: "He was a famous Italian Renaissance polymath." },
      { difficulty: 'advanced', question: "Which empire was ruled by Julius Caesar?", options: ["Ottoman Empire", "Roman Empire", "British Empire", "Mongol Empire"], answer: 1, hint: "It originated in the Italian peninsula and expanded across the Mediterranean." }
    ]
  }
};
