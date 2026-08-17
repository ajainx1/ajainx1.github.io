export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type CategoryKey = 'cybersecurity' | 'animals' | 'nature' | 'science' | 'gk' | 'humanities';

export interface Question {
  difficulty: Difficulty;
  question: string;
  options: string[];
  answer: number;
  hint: string;
  scenario?: string;
  explanation?: string;
}

export interface CategoryData {
  title: string;
  description: string;
  icon: string;
  questions: Question[];
}

export const quizData: Record<CategoryKey, CategoryData> = {
  cybersecurity: {
    title: "Cybersecurity & Purple Team",
    description: "Crack offensive & defensive cyber trivia to fund real street animal meals and secure the digital frontier.",
    icon: "🛡️",
    questions: [
      {
        difficulty: 'beginner',
        question: "What does 'EDR' stand for in enterprise security operations?",
        options: ["Endpoint Detection and Response", "External Data Recovery", "Encrypted Directory Route", "Entity Defense Registry"],
        answer: 0,
        hint: "It focuses on real-time behavior monitoring at the device level.",
        explanation: "EDR (Endpoint Detection and Response) provides continuous endpoint monitoring and telemetry response."
      },
      {
        difficulty: 'beginner',
        question: "Which port is standard for encrypted web traffic (HTTPS)?",
        options: ["Port 80", "Port 443", "Port 8080", "Port 22"],
        answer: 1,
        hint: "Port 80 is unencrypted HTTP; add 363 to get secure HTTPS.",
        explanation: "TCP Port 443 is universally designated for SSL/TLS encrypted HTTPS traffic."
      },
      {
        difficulty: 'beginner',
        question: "What is a 'Zero-Day' vulnerability?",
        options: ["A bug that takes zero days to patch", "A flaw with 0 known exploits", "A vulnerability unknown to the vendor with no official patch", "A flaw that only works at midnight"],
        answer: 2,
        hint: "The vendor has had 'zero days' to fix it before public discovery.",
        explanation: "Zero-day vulnerabilities are software security holes known to attackers before the vendor has released a patch."
      },
      {
        difficulty: 'intermediate',
        question: "In Active Directory security, what is 'Kerberoasting' primarily targeting?",
        options: ["Domain Controller root certificates", "Service Principal Names (SPN) user accounts", "DNS server records", "Local Administrator passwords"],
        answer: 1,
        hint: "Attackers request TGS service tickets for user accounts with SPNs to crack offline.",
        explanation: "Kerberoasting abuses Kerberos ticket granting service (TGS) requests to crack service account passwords offline."
      },
      {
        difficulty: 'intermediate',
        question: "Which SIEM query syntax component is widely used in Wazuh & Splunk for parent-child process detection?",
        options: ["Sysmon Event ID 1", "Sysmon Event ID 3", "Security Event ID 4624", "Event ID 7045"],
        answer: 0,
        hint: "Event ID 1 logs process creation with full command lines and hashes.",
        explanation: "Sysmon Event ID 1 logs process creation with parent process IDs and command-line arguments."
      },
      {
        difficulty: 'intermediate',
        question: "What does 'DCSync' attack emulate to dump Active Directory hashes?",
        options: ["A compromised workstation login", "A Domain Controller replication request", "A Kerberos AS-REQ pre-authentication", "An SMB file share mount"],
        answer: 1,
        hint: "It uses Directory Replication Service Remote Protocol (MS-DRSR) via DS-Replication-Get-Changes.",
        explanation: "DCSync impersonates a Domain Controller using MS-DRSR to synchronize user password hashes including KRBTGT."
      },
      {
        difficulty: 'advanced',
        question: "Which firewall architecture model drops all packets unless explicitly permitted by an approved rule?",
        options: ["Stateful Inspection Mode", "Default-Deny (Zero Trust Perimeter)", "Promiscuous Packet Forwarding", "Adaptive Deep Packet Routing"],
        answer: 1,
        hint: "It permits nothing by default: everything not permitted is dropped.",
        explanation: "Default-Deny architecture enforces that all network traffic is blocked unless an explicit firewall whitelist rule allows it."
      },
      {
        difficulty: 'advanced',
        question: "In memory forensics, which volatility plugin is standard for enumerating hidden Windows processes?",
        options: ["windows.malfind", "windows.psxview", "windows.netscan", "windows.vadinfo"],
        answer: 1,
        hint: "It cross-references process lists from the active process list, CSRSS, and thread structures.",
        explanation: "psxview detects stealth rootkits by cross-referencing multiple internal Windows process tracking tables."
      },
      {
        difficulty: 'advanced',
        question: "What cryptographic technique mitigates AS-REP Roasting in Active Directory?",
        options: ["Disabling SMBv1", "Enforcing Kerberos Pre-Authentication on all user accounts", "Enabling LLMNR multicast", "Rotating KRBTGT password once"],
        answer: 1,
        hint: "AS-REP Roasting only works on accounts where 'Do not require Kerberos preauthentication' is checked.",
        explanation: "Ensuring Kerberos Pre-Authentication is enabled prevents attackers from requesting raw AS-REP ticket encryptions without valid credentials."
      }
    ]
  },
  animals: {
    title: "Animal Welfare & Compassion",
    description: "Learn about the animal kingdom to help feed rescue dogs, birds, cows, and street animals today.",
    icon: "🐕",
    questions: [
      { difficulty: 'beginner', question: "What is a group of lions called?", options: ["A pack", "A pride", "A herd", "A flock"], answer: 1, hint: "It implies dignity and noble self-respect.", explanation: "A family group of lions is known as a pride." },
      { difficulty: 'beginner', question: "Which animal is known as man's most loyal best friend?", options: ["Cat", "Horse", "Dog", "Parrot"], answer: 2, hint: "They have a powerful sense of smell, wag their tails, and bark.", explanation: "Dogs have shared a deep bond of companionship with humans for over 15,000 years." },
      { difficulty: 'beginner', question: "What do giant pandas primarily eat in the wild?", options: ["Insects", "Fish", "Bamboo", "Berries"], answer: 2, hint: "It's a fast-growing green grass native to Asia.", explanation: "Bamboo makes up over 99% of a giant panda's natural diet." },
      { difficulty: 'intermediate', question: "How many stomach compartments does a ruminant cow have?", options: ["One", "Two", "Three", "Four"], answer: 3, hint: "Rumen, reticulum, omasum, and abomasum.", explanation: "Cows have a specialized four-compartment stomach to ferment and digest plant cellulose." },
      { difficulty: 'intermediate', question: "Which mammal possesses the strongest bite force in the animal kingdom relative to its size?", options: ["Hippopotamus", "Lion", "Gorilla", "Hyena"], answer: 0, hint: "These semi-aquatic African giants have tusks that can chomp over 12,000 Newtons.", explanation: "Hippos have an astonishing bite force of around 12,600 N (2,800 psi)." },
      { difficulty: 'intermediate', question: "What is the only mammal naturally capable of true sustained powered flight?", options: ["Flying Squirrel", "Bat", "Sugar Glider", "Colugo"], answer: 1, hint: "They navigate dark skies using ultrasound echolocation.", explanation: "Bats are the only true flying mammals, having adapted wings with elongated fingers." },
      { difficulty: 'advanced', question: "What is the scientific term for the study of animal behavior?", options: ["Entomology", "Ethology", "Ornithology", "Zoology"], answer: 1, hint: "It starts with 'Etho' from the Greek word for custom/character.", explanation: "Ethology is the scientific and objective study of animal behavior under natural conditions." },
      { difficulty: 'advanced', question: "Which species of bird undertakes the longest annual migration on Earth?", options: ["Arctic Tern", "Albatross", "Swallow", "Hummingbird"], answer: 0, hint: "It travels from the Arctic to the Antarctic and back (approx 70,000 km).", explanation: "The Arctic Tern migrates from pole to pole, covering over 70,000 km annually." },
      { difficulty: 'advanced', question: "What sensory organs on sharks detect micro-electrical fields from prey?", options: ["Lateral line", "Ampullae of Lorenzini", "Olfactory bulb", "Nictitating membrane"], answer: 1, hint: "Named after Italian physician Stefano Lorenzini in 1678.", explanation: "The Ampullae of Lorenzini are specialized electroreceptors that detect electric fields in water." }
    ]
  },
  nature: {
    title: "Nature & Ecology",
    description: "Every correct answer plants a seed of karmic hope and provides nourishment to hungry street animals.",
    icon: "🌱",
    questions: [
      { difficulty: 'beginner', question: "What gas do green plants absorb from the atmosphere during photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1, hint: "It is the gas exhaled by humans and animals.", explanation: "Plants absorb carbon dioxide (CO2) and release life-giving oxygen through photosynthesis." },
      { difficulty: 'beginner', question: "What is the largest tropical rainforest in the world?", options: ["Congo Rainforest", "Daintree Rainforest", "Amazon Rainforest", "Tongass Forest"], answer: 2, hint: "Located largely in South America, producing substantial Earth oxygen.", explanation: "The Amazon Basin spans over 6.7 million square kilometers across South America." },
      { difficulty: 'beginner', question: "Which part of the plant is the primary site of photosynthesis?", options: ["Root", "Stem", "Leaf", "Petal"], answer: 2, hint: "They are filled with green chlorophyll pigments.", explanation: "Leaves capture sunlight with chlorophyll to convert water and carbon dioxide into sugars." },
      { difficulty: 'intermediate', question: "What is the term for a community of living organisms interacting with their physical habitat?", options: ["Biosphere", "Ecosystem", "Habitat", "Biome"], answer: 1, hint: "It ends in 'system'.", explanation: "An ecosystem is a biological community of interacting organisms and their physical environment." },
      { difficulty: 'intermediate', question: "What is the hardest naturally occurring mineral on Earth (Rating 10 on Mohs scale)?", options: ["Quartz", "Topaz", "Diamond", "Corundum"], answer: 2, hint: "Composed of pure carbon arranged in a tetrahedral crystal lattice.", explanation: "Diamond is the hardest known natural mineral with a Mohs hardness of 10." },
      { difficulty: 'intermediate', question: "Which layer of the atmosphere contains the protective ozone layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], answer: 1, hint: "It is the second layer, directly above the troposphere.", explanation: "The stratosphere contains the ozone layer which absorbs harmful solar UV-B rays." },
      { difficulty: 'advanced', question: "What ecological process describes land degradation in drylands resulting in desert conditions?", options: ["Deforestation", "Erosion", "Desertification", "Salinization"], answer: 2, hint: "The name literally means transforming into a desert.", explanation: "Desertification is the degradation of fertile land in arid and semi-arid regions." },
      { difficulty: 'advanced', question: "Which biome is characterized by permanently frozen subsoil known as permafrost?", options: ["Taiga", "Tundra", "Savanna", "Chaparral"], answer: 1, hint: "A cold, vast, treeless Arctic ecosystem.", explanation: "The tundra biome has permafrost ground that remains frozen year-round." },
      { difficulty: 'advanced', question: "What scale is used to categorize hurricane intensity based on sustained wind speed?", options: ["Richter Scale", "Beaufort Scale", "Saffir-Simpson Scale", "Fujita Scale"], answer: 2, hint: "It categorizes hurricanes from Category 1 to Category 5.", explanation: "The Saffir-Simpson Hurricane Wind Scale classifies hurricanes from 1 to 5 based on wind velocity." }
    ]
  },
  science: {
    title: "Science, Space & Health",
    description: "Empower your mind with astrophysics & biology. Turn intelligence into tangible stray animal meals.",
    icon: "🔬",
    questions: [
      { difficulty: 'beginner', question: "What organ is responsible for pumping blood throughout the human body?", options: ["Brain", "Liver", "Lungs", "Heart"], answer: 3, hint: "It beats continuously over 100,000 times a day.", explanation: "The heart is the muscular pump that circulates oxygenated blood through the circulatory system." },
      { difficulty: 'beginner', question: "Which vitamin is synthesized in human skin when exposed to morning sunlight?", options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"], answer: 3, hint: "Often affectionately called the 'sunshine vitamin'.", explanation: "Sunlight stimulates skin synthesis of cholecalciferol (Vitamin D3)." },
      { difficulty: 'beginner', question: "What is the speed of light in a vacuum approximately?", options: ["300,000 km/s", "150,000 km/s", "1,000 km/s", "30,000 km/s"], answer: 0, hint: "Approx 3 × 10^8 meters per second.", explanation: "Light travels at approximately 299,792 kilometers per second in vacuum." },
      { difficulty: 'intermediate', question: "Which physicist formulated the mass-energy equivalence equation E=mc²?", options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Niels Bohr"], answer: 2, hint: "Famous for his General and Special Theories of Relativity.", explanation: "Albert Einstein published the mass-energy equivalence equation in his 1905 Annus Mirabilis papers." },
      { difficulty: 'intermediate', question: "What cellular organelle is universally dubbed the 'powerhouse of the cell'?", options: ["Nucleus", "Ribosome", "Mitochondria", "Golgi Apparatus"], answer: 2, hint: "It synthesizes adenosine triphosphate (ATP).", explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions." },
      { difficulty: 'intermediate', question: "What is the most abundant chemical element in the universe by mass?", options: ["Oxygen", "Carbon", "Hydrogen", "Helium"], answer: 2, hint: "Element #1 on the periodic table, fueling stars via nuclear fusion.", explanation: "Hydrogen accounts for roughly 75% of the baryonic mass of the universe." },
      { difficulty: 'advanced', question: "What quantum principle states that position and momentum cannot be simultaneously measured precisely?", options: ["Pauli Exclusion Principle", "Heisenberg Uncertainty Principle", "Bohr Complementarity", "Schrödinger Wave Collapse"], answer: 1, hint: "Formulated by German quantum physicist Werner Heisenberg in 1927.", explanation: "Heisenberg's Uncertainty Principle fundamental limits measurement precision of conjugate variables." },
      { difficulty: 'advanced', question: "What is the rarest major ABO/Rh blood type in the global human population?", options: ["O Positive", "A Negative", "B Positive", "AB Negative"], answer: 3, hint: "Found in less than 1% of the world population.", explanation: "AB Negative is the rarest ABO blood type worldwide, present in approximately 0.6% of individuals." },
      { difficulty: 'advanced', question: "What astronomical term defines the boundary around a black hole beyond which light cannot escape?", options: ["Accretion Disk", "Event Horizon", "Photon Sphere", "Singularity"], answer: 1, hint: "The point of no return for all mass and electromagnetic radiation.", explanation: "The Event Horizon marks the radius at which escape velocity equals the speed of light." }
    ]
  },
  gk: {
    title: "General Knowledge & Geography",
    description: "Small trivia, massive real-world impact. Help us achieve zero animal hunger in Patna, one question at a time.",
    icon: "🌍",
    questions: [
      { difficulty: 'beginner', question: "How many continents make up planet Earth?", options: ["5", "6", "7", "8"], answer: 2, hint: "Asia, Africa, North America, South America, Antarctica, Europe, Australia.", explanation: "Earth has 7 recognized continents." },
      { difficulty: 'beginner', question: "What is the capital city of France?", options: ["Rome", "Berlin", "Madrid", "Paris"], answer: 3, hint: "Known as the City of Light, home to the Eiffel Tower.", explanation: "Paris has been the historic and cultural capital of France since the 10th century." },
      { difficulty: 'beginner', question: "Which planet in our solar system is nicknamed the 'Red Planet'?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1, hint: "Colored red due to iron oxide (rust) on its surface.", explanation: "Mars appears reddish in the night sky due to abundant iron minerals in its regolith." },
      { difficulty: 'intermediate', question: "What is the longest river in the world by total length?", options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"], answer: 1, hint: "Flowing northward through northeastern Africa into the Mediterranean Sea.", explanation: "The Nile River spans approximately 6,650 kilometers (4,132 miles)." },
      { difficulty: 'intermediate', question: "In which year did the RMS Titanic sink after striking an iceberg?", options: ["1905", "1912", "1920", "1931"], answer: 1, hint: "It occurred on April 15 in the early 20th century.", explanation: "The Titanic sank on her maiden voyage on April 15, 1912." },
      { difficulty: 'intermediate', question: "What is the smallest sovereign nation in the world by land area?", options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], answer: 2, hint: "An independent city-state enclave located completely within Rome, Italy.", explanation: "Vatican City covers an area of just 0.49 square kilometers (121 acres)." },
      { difficulty: 'advanced', question: "Who was the first person to win two Nobel Prizes in two different scientific disciplines?", options: ["Rosalind Franklin", "Marie Curie", "Jane Addams", "Dorothy Hodgkin"], answer: 1, hint: "Won in Physics (1903) and Chemistry (1911) for research on radioactivity and discovery of Radium.", explanation: "Marie Curie remains the only person to win Nobel Prizes in two distinct scientific fields." },
      { difficulty: 'advanced', question: "Which ancient civilization constructed the cliffside city of Machu Picchu in Peru?", options: ["Aztec Empire", "Maya Civilization", "Inca Empire", "Olmec Civilization"], answer: 2, hint: "Built under Emperor Pachacuti in the 15th century in the Andes Mountains.", explanation: "Machu Picchu was built as an estate for the Inca emperor Pachacuti around 1450." },
      { difficulty: 'advanced', question: "What is the deepest known point in Earth's oceans?", options: ["Puerto Rico Trench", "Java Trench", "Challenger Deep (Mariana Trench)", "Tonga Trench"], answer: 2, hint: "Plunging nearly 11,000 meters (36,000 feet) beneath the Pacific surface.", explanation: "Challenger Deep in the Mariana Trench reaches an extreme depth of approximately 10,928 meters." }
    ]
  },
  humanities: {
    title: "Ethics, Kindness & Karma",
    description: "Explore the deep kindness of humanity. Play daily to turn correct answers into hot, nourishing street meals.",
    icon: "🕊️",
    questions: [
      { difficulty: 'beginner', question: "Who founded the Missionaries of Charity to serve the poorest of the poor in Calcutta?", options: ["Florence Nightingale", "Mother Teresa", "Rosa Parks", "Clara Barton"], answer: 1, hint: "She was awarded the Nobel Peace Prize in 1979 for her humanitarian service.", explanation: "Mother Teresa dedicated her entire life to caring for the destitute and dying in India." },
      { difficulty: 'beginner', question: "Which universal international humanitarian organization uses a Red Cross on white?", options: ["UNICEF", "WHO", "International Red Cross", "Amnesty International"], answer: 2, hint: "Founded in Geneva by Henry Dunant in 1863.", explanation: "The International Red Cross and Red Crescent Movement provides neutral humanitarian assistance globally." },
      { difficulty: 'beginner', question: "What basic universal human action releases endorphins and communicates warm friendliness?", options: ["A frown", "A crossed arm", "A smile", "A shrug"], answer: 2, hint: "It uses facial muscles around the mouth and eyes.", explanation: "Smiling triggers dopamine and endorphin release, scientifically improving emotional wellbeing." },
      { difficulty: 'intermediate', question: "Which landmark declaration was adopted by the United Nations General Assembly in 1948?", options: ["Magna Carta", "Universal Declaration of Human Rights (UDHR)", "Geneva Conventions", "Treaty of Versailles"], answer: 1, hint: "Comprising 30 articles establishing fundamental human rights for all people.", explanation: "The UDHR was adopted on 10 December 1948 in Paris as a common standard of achievements for all peoples." },
      { difficulty: 'intermediate', question: "Which civil rights icon championed nonviolent resistance and delivered the famous 'I Have a Dream' speech?", options: ["Malcolm X", "Nelson Mandela", "Martin Luther King Jr.", "Frederick Douglass"], answer: 2, hint: "Led the 1963 March on Washington for Jobs and Freedom.", explanation: "Dr. Martin Luther King Jr. led the American civil rights movement using nonviolent civil disobedience." },
      { difficulty: 'intermediate', question: "What does the ancient Sanskrit concept 'Ahimsa' literally translate to?", options: ["Truthfulness", "Non-violence / Non-harm to all living beings", "Selfless Giving", "Devotional Meditation"], answer: 1, hint: "A core tenet of Hinduism, Buddhism, and Jainism.", explanation: "Ahimsa signifies non-injury and compassion toward all sentient living beings." },
      { difficulty: 'advanced', question: "In moral philosophy, what is the principle of maximizing the greatest good for the greatest number called?", options: ["Deontology", "Utilitarianism", "Virtue Ethics", "Nihilism"], answer: 1, hint: "Advocated by Jeremy Bentham and John Stuart Mill.", explanation: "Utilitarianism posits that the most ethical choice is the one that produces the greatest net happiness." },
      { difficulty: 'advanced', question: "Which ancient Greek philosophical term denotes selfless, unconditional, spiritual love for all beings?", options: ["Eros", "Philia", "Agape", "Ludus"], answer: 2, hint: "Often contrasted with romantic love (Eros) and friendship (Philia).", explanation: "Agape is the highest form of love, representing selfless universal goodwill and charity." },
      { difficulty: 'advanced', question: "What psychological term explains why individuals are less likely to help a victim when others are present?", options: ["Bystander Effect", "Halo Effect", "Confirmation Bias", "Hawthorne Effect"], answer: 0, hint: "Driven by the diffusion of personal responsibility among a crowd.", explanation: "The Bystander Effect demonstrates that the presence of others inhibits helping behavior in emergencies." }
    ]
  }
};
