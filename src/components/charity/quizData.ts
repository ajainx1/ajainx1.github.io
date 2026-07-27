export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type CategoryKey = 'animals' | 'nature' | 'humanities' | 'science' | 'gk';

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
  "animals": {
    "title": "Animal Welfare",
    "description": "Learn about the animal kingdom to help feed rescue dogs and street animals today.",
    "questions": [
      {
        "difficulty": "beginner",
        "question": "What do pet dogs need to drink every day to stay healthy and happy?",
        "options": [
          "Fresh water",
          "Soda",
          "Fruit juice",
          "Salty soup"
        ],
        "answer": 0,
        "hint": "It is clear, cold, and comes from the tap."
      },
      {
        "difficulty": "beginner",
        "question": "What should you do if you see a lost dog walking around your street without an owner?",
        "options": [
          "Run away screaming",
          "Try to catch it by chasing it",
          "Tell a trusted adult right away",
          "Throw rocks at it"
        ],
        "answer": 2,
        "hint": "An adult can safely figure out how to help."
      },
      {
        "difficulty": "beginner",
        "question": "What is the name of a safe place where homeless pets stay until they are adopted?",
        "options": [
          "A pet factory",
          "An animal shelter",
          "A grocery store",
          "A zoo"
        ],
        "answer": 1,
        "hint": "It is a community facility dedicated to housing unwanted or stray pets."
      },
      {
        "difficulty": "beginner",
        "question": "Which of these is a kind way to show love to a pet cat?",
        "options": [
          "Gently stroking its back",
          "Pulling its tail",
          "Yelling loudly near its ears",
          "Stepping on its paws"
        ],
        "answer": 0,
        "hint": "Cats prefer soft, gentle touches."
      },
      {
        "difficulty": "beginner",
        "question": "Why is it dangerous to leave a pet inside a parked car on a warm summer day?",
        "options": [
          "The pet will get bored",
          "The car radio might turn off",
          "The seats will get dirty",
          "The inside of the car gets dangerously hot very fast"
        ],
        "answer": 3,
        "hint": "Cars act like ovens in heat, putting animals at risk."
      },
      {
        "difficulty": "beginner",
        "question": "Which basic animal need protects pets from rain, extreme heat, and snow?",
        "options": [
          "Toys",
          "Shelter",
          "Leashes",
          "Treats"
        ],
        "answer": 1,
        "hint": "This provides a roof over their head."
      },
      {
        "difficulty": "beginner",
        "question": "What helpful item should a pet dog wear on its collar in case it gets lost?",
        "options": [
          "An ID tag with a phone number",
          "A superhero cape",
          "A pair of sunglasses",
          "A wristwatch"
        ],
        "answer": 0,
        "hint": "It lists contact information so people can call the owner."
      },
      {
        "difficulty": "beginner",
        "question": "Which food is safe and healthy to feed to a pet dog?",
        "options": [
          "Chocolate bars",
          "Grapes and raisins",
          "Specially made dog food",
          "Onions"
        ],
        "answer": 2,
        "hint": "This food is formulated specifically for canine nutrition."
      },
      {
        "difficulty": "beginner",
        "question": "What should you always do before petting someone else's dog?",
        "options": [
          "Bark at the dog first",
          "Ask the dog's owner for permission",
          "Give the dog a big sudden hug",
          "Take away its toy"
        ],
        "answer": 1,
        "hint": "Politely check with the person holding the leash."
      },
      {
        "difficulty": "beginner",
        "question": "What is the primary job of a veterinarian?",
        "options": [
          "To train dogs to do tricks",
          "To sell fish tanks",
          "To walk pets in the park",
          "To keep animals healthy and treat sick ones"
        ],
        "answer": 3,
        "hint": "They are doctors who go to school to study animal medicine."
      },
      {
        "difficulty": "intermediate",
        "question": "What famous set of core principles for farm animal welfare was originally articulated in the UK in 1965?",
        "options": [
          "The Five Freedoms",
          "The Animal Bill of Rights",
          "The Humane Code",
          "The Universal Animal Mandate"
        ],
        "answer": 0,
        "hint": "They include freedom from hunger/thirst, discomfort, pain, fear, and freedom to express normal behavior."
      },
      {
        "difficulty": "intermediate",
        "question": "In the Five Freedoms framework, which freedom directly addresses an animal's psychological well-being?",
        "options": [
          "Freedom from hunger and thirst",
          "Freedom from discomfort",
          "Freedom from fear and distress",
          "Freedom from pain, injury, or disease"
        ],
        "answer": 2,
        "hint": "This freedom emphasizes preventing mental suffering and anxiety."
      },
      {
        "difficulty": "intermediate",
        "question": "What does the abbreviation ASPCA stand for?",
        "options": [
          "American Society for Animal Protection and Care",
          "American Society for the Prevention of Cruelty to Animals",
          "Association for Animal Safety and Prevention",
          "Allied States Protection of Companion Animals"
        ],
        "answer": 1,
        "hint": "It was founded in 1866 and is one of the oldest animal welfare organizations in North America."
      },
      {
        "difficulty": "intermediate",
        "question": "Which international treaty regulates global trade in wild animals and plants to protect them from over-exploitation?",
        "options": [
          "CITES",
          "NATO",
          "UNESCO",
          "NAFTA"
        ],
        "answer": 0,
        "hint": "Its acronym stands for Convention on International Trade in Endangered Species of Wild Fauna and Flora."
      },
      {
        "difficulty": "intermediate",
        "question": "In free-roaming cat management, what does the welfare practice acronym 'TNR' stand for?",
        "options": [
          "Track, Nurture, Release",
          "Tag, Neutralize, Relocate",
          "Test, Nourish, Rescue",
          "Trap-Neuter-Return"
        ],
        "answer": 3,
        "hint": "It is a humane strategy to control outdoor cat populations."
      },
      {
        "difficulty": "intermediate",
        "question": "Providing puzzle feeders, toys, and varied stimuli to captive animals to promote species-typical behavior is called what?",
        "options": [
          "Behavioral conditioning",
          "Environmental enrichment",
          "Operant modification",
          "Sensory deprivation"
        ],
        "answer": 1,
        "hint": "This process enriches the animal's living space and routine."
      },
      {
        "difficulty": "intermediate",
        "question": "Passed in 1966, which principal U.S. federal law regulates the treatment of animals in research, exhibition, and transport?",
        "options": [
          "The Animal Welfare Act",
          "The Endangered Species Act",
          "The Humane Slaughter Act",
          "The Paws and Claws Act"
        ],
        "answer": 0,
        "hint": "It is abbreviated as the AWA and enforced by the USDA."
      },
      {
        "difficulty": "intermediate",
        "question": "What surgical procedure permanently prevents a female companion animal from reproducing?",
        "options": [
          "Neutering",
          "Cropping",
          "Spaying",
          "Docking"
        ],
        "answer": 2,
        "hint": "This specific term refers to an ovariohysterectomy in females."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the legal process of transferring official ownership of a homeless shelter animal to a new family?",
        "options": [
          "Fostering",
          "Adoption",
          "Quarantine",
          "Surrender"
        ],
        "answer": 1,
        "hint": "This term describes taking a pet permanently into your home."
      },
      {
        "difficulty": "intermediate",
        "question": "In what year did a full European Union ban on conventional, unenriched 'battery cages' for egg-laying hens take effect?",
        "options": [
          "1999",
          "2005",
          "2012",
          "2020"
        ],
        "answer": 2,
        "hint": "The directive was passed in 1999 (1999/74/EC), giving a 13-year phase-out ending in this year."
      },
      {
        "difficulty": "advanced",
        "question": "Who served as the chairman of the 1965 UK government committee whose report on intensive livestock husbandry led to the Five Freedoms?",
        "options": [
          "Prof. F.W. Rogers Brambell",
          "Ruth Harrison",
          "Dr. David Mellor",
          "Marian Stamp Dawkins"
        ],
        "answer": 0,
        "hint": "The technical committee was named after this zoologist."
      },
      {
        "difficulty": "advanced",
        "question": "Qualitative Behaviour Assessment (QBA), pioneered by Dr. Françoise Wemelsfelder, relies on which psychological methodology to assess emotional state?",
        "options": [
          "Fixed Choice Categorization",
          "Free Choice Profiling",
          "Operant Demand Functioning",
          "Stereotypic Frequency Scoring"
        ],
        "answer": 1,
        "hint": "It allows observers to use their own descriptive vocabulary to score animal expressiveness."
      },
      {
        "difficulty": "advanced",
        "question": "Which specific European Union Council Regulation establishes detailed legal rules regarding the protection of live animals during transport?",
        "options": [
          "EC No 178/2002",
          "EC No 853/2004",
          "EC No 1/2005",
          "EC No 1099/2009"
        ],
        "answer": 2,
        "hint": "This 2005 regulation replaced Directive 91/628/EEC."
      },
      {
        "difficulty": "advanced",
        "question": "The 'Five Domains Model' for assessing animal welfare was developed by David Mellor and Reid in 1994 to expand beyond the Five Freedoms. What is the Fifth Domain?",
        "options": [
          "Mental State",
          "Nutritional Status",
          "Environmental Conditions",
          "Health Domain"
        ],
        "answer": 0,
        "hint": "Domains 1 to 4 evaluate physical/functional states, which feed into this final psychological outcome domain."
      },
      {
        "difficulty": "advanced",
        "question": "When assessing chronic welfare state via glucocorticoids, which substrate matrix provides an integrated retrospective measure of stress hormone secretion over weeks to months?",
        "options": [
          "Blood plasma",
          "Saliva",
          "Hair or wool",
          "Urine"
        ],
        "answer": 3,
        "hint": "As this keratinized structure grows, circulating hormones are passively incorporated into its shaft over long periods."
      },
      {
        "difficulty": "advanced",
        "question": "In Russell and Burch's landmark 1959 framework of the 3Rs in humane animal experimentation, what does the third 'R' stand for alongside Replacement and Reduction?",
        "options": [
          "Rehabilitation",
          "Refinement",
          "Recycling",
          "Restitution"
        ],
        "answer": 1,
        "hint": "It involves modifying procedures to minimize pain, suffering, distress, or lasting harm."
      },
      {
        "difficulty": "advanced",
        "question": "In livestock stunning monitoring, which neurophysiological finding is considered the definitive gold-standard indicator of irreversible brain death / insensibility on an EEG?",
        "options": [
          "An isoelectric (flatline) trace",
          "High-voltage theta waves",
          "Rhythmic alpha activity",
          "Polyspike discharge"
        ],
        "answer": 0,
        "hint": "It represents the complete absence of measurable electrical activity in the cerebral cortex."
      },
      {
        "difficulty": "advanced",
        "question": "Which major UK statute consolidated numerous legacy welfare laws and formally introduced a legally enforceable 'duty of care' for animal owners in England and Wales?",
        "options": [
          "Protection of Animals Act 1911",
          "Animal Welfare Act 2006",
          "Pet Animals Act 1951",
          "Animals (Scientific Procedures) Act 1986"
        ],
        "answer": 2,
        "hint": "This legislation overhauled almost a century of UK animal cruelty law in the mid-2000s."
      },
      {
        "difficulty": "advanced",
        "question": "How does the landmark European 'Welfare Quality®' assessment protocol fundamentally differ from older traditional farm welfare inspection systems?",
        "options": [
          "It relies purely on resource-based inputs",
          "It prioritizes animal-based (outcome) measures over environmental inputs",
          "It removes physical health from the evaluation matrix",
          "It exclusively measures physiological stress parameters"
        ],
        "answer": 1,
        "hint": "Instead of measuring pen dimensions or trough length, it directly measures parameters on the animals themselves."
      },
      {
        "difficulty": "advanced",
        "question": "In dairy cattle lameness assessment, the standardized 5-point locomotion scoring system developed by Sprecher et al. (1997) relies primarily on which physiological visual marker?",
        "options": [
          "Back posture (arching) while standing and walking",
          "Angle of the hock joint during extension",
          "Speed of stride length",
          "Head bobbing amplitude"
        ],
        "answer": 0,
        "hint": "An arch in this anatomical feature when standing or walking indicates escalating severity of lameness."
      }
    ]
  },
  "nature": {
    "title": "Nature & Environment",
    "description": "Every correct answer plants a seed of hope and provides nourishment to the hungry.",
    "questions": [
      {
        "difficulty": "beginner",
        "question": "What is the primary color of most plant leaves?",
        "options": [
          "Red",
          "Blue",
          "Green",
          "Yellow"
        ],
        "answer": 2,
        "hint": "It is the color of grass."
      },
      {
        "difficulty": "beginner",
        "question": "What do bees make that people love to eat?",
        "options": [
          "Milk",
          "Honey",
          "Bread",
          "Butter"
        ],
        "answer": 1,
        "hint": "It is sweet and golden."
      },
      {
        "difficulty": "beginner",
        "question": "Which giant animal is known for eating bamboo?",
        "options": [
          "Giant Panda",
          "Lion",
          "Giraffe",
          "Penguin"
        ],
        "answer": 0,
        "hint": "This black-and-white bear is native to China."
      },
      {
        "difficulty": "beginner",
        "question": "What falls from clouds when it rains?",
        "options": [
          "Sand",
          "Water",
          "Rocks",
          "Juice"
        ],
        "answer": 1,
        "hint": "It wets the ground and helps plants grow."
      },
      {
        "difficulty": "beginner",
        "question": "Which gas in the air do humans need to breathe in to live?",
        "options": [
          "Helium",
          "Oxygen",
          "Smoke",
          "Methane"
        ],
        "answer": 1,
        "hint": "Trees produce this gas during the day."
      },
      {
        "difficulty": "beginner",
        "question": "What is the largest land mammal alive today?",
        "options": [
          "African Elephant",
          "Hippopotamus",
          "Rhinoceros",
          "Grizzly Bear"
        ],
        "answer": 0,
        "hint": "It has a long trunk and big ears."
      },
      {
        "difficulty": "beginner",
        "question": "Which season comes right after winter?",
        "options": [
          "Autumn",
          "Summer",
          "Spring",
          "Monsoon"
        ],
        "answer": 2,
        "hint": "Flowers start blooming in this season."
      },
      {
        "difficulty": "beginner",
        "question": "Where do fish live and swim?",
        "options": [
          "In trees",
          "In water",
          "Underground",
          "In the clouds"
        ],
        "answer": 1,
        "hint": "Lakes, rivers, and oceans are full of it."
      },
      {
        "difficulty": "beginner",
        "question": "What gives the Earth heat and light during the day?",
        "options": [
          "The Moon",
          "The Sun",
          "Volcanoes",
          "Stars"
        ],
        "answer": 1,
        "hint": "It is a big star at the center of our solar system."
      },
      {
        "difficulty": "beginner",
        "question": "What do caterpillars turn into after going through metamorphosis?",
        "options": [
          "Frogs",
          "Butterflies",
          "Birds",
          "Spiders"
        ],
        "answer": 1,
        "hint": "They have colorful wings and fly around flowers."
      },
      {
        "difficulty": "intermediate",
        "question": "In which layer of Earth's atmosphere is the ozone layer located?",
        "options": [
          "Troposphere",
          "Stratosphere",
          "Mesosphere",
          "Thermosphere"
        ],
        "answer": 1,
        "hint": "It lies directly above the troposphere."
      },
      {
        "difficulty": "intermediate",
        "question": "What type of tree sheds its leaves annually during autumn?",
        "options": [
          "Coniferous",
          "Evergreen",
          "Deciduous",
          "Sclerophyllous"
        ],
        "answer": 2,
        "hint": "Oak and maple are common examples."
      },
      {
        "difficulty": "intermediate",
        "question": "Which ocean is the largest and deepest on Earth?",
        "options": [
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
          "Pacific Ocean"
        ],
        "answer": 3,
        "hint": "It covers more than 30% of the Earth's surface."
      },
      {
        "difficulty": "intermediate",
        "question": "What primary force causes the daily rising and falling of ocean tides?",
        "options": [
          "Earth's magnetic field",
          "Gravitational pull of the Moon",
          "Solar radiation pressure",
          "Oceanic thermohaline currents"
        ],
        "answer": 1,
        "hint": "Our natural satellite exerts a pull on Earth's waters."
      },
      {
        "difficulty": "intermediate",
        "question": "What term describes a species that has a disproportionately large effect on its ecosystem relative to its abundance?",
        "options": [
          "Endemic species",
          "Invasive species",
          "Keystone species",
          "Indicator species"
        ],
        "answer": 2,
        "hint": "Sea otters and wolves are famous examples."
      },
      {
        "difficulty": "intermediate",
        "question": "Which terrestrial biome is characterized by extremely low temperatures, short growing seasons, and permafrost?",
        "options": [
          "Taiga",
          "Tundra",
          "Chaparral",
          "Savanna"
        ],
        "answer": 1,
        "hint": "Found in Arctic regions and high mountain tops."
      },
      {
        "difficulty": "intermediate",
        "question": "What process converts liquid water into water vapor in the hydrological cycle?",
        "options": [
          "Condensation",
          "Precipitation",
          "Transpiration",
          "Evaporation"
        ],
        "answer": 3,
        "hint": "It happens when water is heated by the sun."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the world's largest living coral reef system?",
        "options": [
          "Mesoamerican Barrier Reef",
          "New Caledonia Barrier Reef",
          "Great Barrier Reef",
          "Florida Reef Tract"
        ],
        "answer": 2,
        "hint": "It is located off the coast of Queensland, Australia."
      },
      {
        "difficulty": "intermediate",
        "question": "Which organelle in plant cells is responsible for carrying out photosynthesis?",
        "options": [
          "Mitochondria",
          "Chloroplast",
          "Golgi apparatus",
          "Endoplasmic reticulum"
        ],
        "answer": 1,
        "hint": "It contains green chlorophyll pigments."
      },
      {
        "difficulty": "intermediate",
        "question": "What term describes animals that feed primarily on both plants and meat?",
        "options": [
          "Herbivores",
          "Carnivores",
          "Omnivores",
          "Detritivores"
        ],
        "answer": 2,
        "hint": "Humans, bears, and pigs belong to this group."
      },
      {
        "difficulty": "advanced",
        "question": "Which biogeographical boundary line separates the ecozones of Asia and Wallacea (Australasia)?",
        "options": [
          "Weber Line",
          "Lydekker Line",
          "Wallace Line",
          "MOHO Line"
        ],
        "answer": 2,
        "hint": "Named after natural historian Alfred Russel."
      },
      {
        "difficulty": "advanced",
        "question": "Which enzyme initiates the first major step of carbon fixation in the Calvin cycle?",
        "options": [
          "PEP carboxylase",
          "RuBisCO",
          "ATP synthase",
          "Pyruvate dehydrogenase"
        ],
        "answer": 1,
        "hint": "It is often considered the most abundant enzyme on Earth."
      },
      {
        "difficulty": "advanced",
        "question": "What is the ecological principle stating that two species competing for identical limited resources cannot stably coexist?",
        "options": [
          "Competitive Exclusion Principle",
          "Intermediate Disturbance Hypothesis",
          "Margalef's Diversity Law",
          "Rensch's Rule"
        ],
        "answer": 0,
        "hint": "Also known as Gause's Law."
      },
      {
        "difficulty": "advanced",
        "question": "What specific carbon fixation pathway is utilized by desert plants like cacti to open stomata only at night?",
        "options": [
          "C3 Carbon Fixation",
          "C4 Carbon Fixation",
          "Crassulacean Acid Metabolism",
          "Glycolate Pathway"
        ],
        "answer": 2,
        "hint": "Abbreviated as CAM."
      },
      {
        "difficulty": "advanced",
        "question": "What physiological strategy enables the Wood Frog (Lithobates sylvaticus) to survive freezing over 60% of its body water?",
        "options": [
          "Accumulation of high glucose and urea concentrations",
          "Rapid synthesis of anti-freeze proteins (AFPs) only",
          "Supercooling blood below -15°C without ice nucleation",
          "Complete dehydration of intracellular space into the gut"
        ],
        "answer": 0,
        "hint": "The frog floods its organs with a high concentration of simple sugars."
      },
      {
        "difficulty": "advanced",
        "question": "What is the term for the thin surface layer of soil above permafrost that thaws during summer and freezes during winter?",
        "options": [
          "Talik",
          "Active layer",
          "Solifluction sheet",
          "Cryoturbated zone"
        ],
        "answer": 1,
        "hint": "It actively undergoes freeze-thaw cycles every year."
      },
      {
        "difficulty": "advanced",
        "question": "Which specific symbiotic relationship benefits one organism while leaving the host organism unaffected?",
        "options": [
          "Mutualism",
          "Parasitism",
          "Amensalism",
          "Commensalism"
        ],
        "answer": 3,
        "hint": "Barnacles attached to whales are a classic example."
      },
      {
        "difficulty": "advanced",
        "question": "What is the name of the oceanographic process where deep, cold, nutrient-rich water rises toward the surface?",
        "options": [
          "Downwelling",
          "Upwelling",
          "Langmuir circulation",
          "Thermohaline turnover"
        ],
        "answer": 1,
        "hint": "It fuels major fisheries along western continental coastlines."
      },
      {
        "difficulty": "advanced",
        "question": "What geological event describes the last known full magnetic field reversal on Earth, occurring approximately 780,000 years ago?",
        "options": [
          "Laschamp Excursion",
          "Brunhes-Matuyama Reversal",
          "Blake Event",
          "Jaramillo Subchron"
        ],
        "answer": 1,
        "hint": "Named after French and Japanese geophysicists."
      },
      {
        "difficulty": "advanced",
        "question": "In plant vascular anatomy, what dead, elongated cells with pitted walls conduct sap in gymnosperms, lacking true vessel elements?",
        "options": [
          "Sieve tube elements",
          "Tracheids",
          "Companion cells",
          "Parenchyma cells"
        ],
        "answer": 1,
        "hint": "Unlike angiosperms, conifers rely almost entirely on these for water transport."
      }
    ]
  },
  "humanities": {
    "title": "Humanities & Care",
    "description": "Explore the kindness of humanity. Play daily to transform a life in need with a hot meal.",
    "questions": [
      {
        "difficulty": "beginner",
        "question": "Which tool does a doctor or nurse use to listen to your heart and breathing?",
        "options": [
          "Microscope",
          "Stethoscope",
          "Telescope",
          "Thermometer"
        ],
        "answer": 1,
        "hint": "It has earpieces connected to a round chest piece."
      },
      {
        "difficulty": "beginner",
        "question": "What do healthcare workers put on their hands to keep things clean and germ-free?",
        "options": [
          "Socks",
          "Hats",
          "Gloves",
          "Shoes"
        ],
        "answer": 2,
        "hint": "These cover your fingers and palms."
      },
      {
        "difficulty": "beginner",
        "question": "Who wrote famous fairy tales for children like 'The Ugly Duckling' and 'The Little Mermaid'?",
        "options": [
          "Hans Christian Andersen",
          "Dr. Seuss",
          "William Shakespeare",
          "J.K. Rowling"
        ],
        "answer": 0,
        "hint": "He was a famous Danish author born in Odense."
      },
      {
        "difficulty": "beginner",
        "question": "Which famous historical nurse was known as 'The Lady with the Lamp'?",
        "options": [
          "Clara Barton",
          "Marie Curie",
          "Florence Nightingale",
          "Rosa Parks"
        ],
        "answer": 2,
        "hint": "Her modern nursing work started during the Crimean War."
      },
      {
        "difficulty": "beginner",
        "question": "What symbol is widely recognized around the world for medical aid and emergency care?",
        "options": [
          "A blue circle",
          "A red cross",
          "A green star",
          "A yellow square"
        ],
        "answer": 1,
        "hint": "It consists of two crossing perpendicular lines on a white background."
      },
      {
        "difficulty": "beginner",
        "question": "Where do people go when they need overnight care from doctors and nurses?",
        "options": [
          "Bakery",
          "Library",
          "Post Office",
          "Hospital"
        ],
        "answer": 3,
        "hint": "This building has emergency rooms and patient wards."
      },
      {
        "difficulty": "beginner",
        "question": "What short story genre uses animal characters to teach a moral lesson about caring or behavior?",
        "options": [
          "Recipe",
          "Dictionary",
          "Fable",
          "Shopping List"
        ],
        "answer": 2,
        "hint": "'The Tortoise and the Hare' is a classic example."
      },
      {
        "difficulty": "beginner",
        "question": "What instrument is used to check a person's body temperature when they feel sick?",
        "options": [
          "Thermometer",
          "Ruler",
          "Scale",
          "Clock"
        ],
        "answer": 0,
        "hint": "The word starts with 'thermo', which relates to heat."
      },
      {
        "difficulty": "beginner",
        "question": "What is the main subject of study in a classic literature class?",
        "options": [
          "Math equations",
          "Books and stories",
          "Chemical reactions",
          "Rocks and minerals"
        ],
        "answer": 1,
        "hint": "It involves reading written works like novels and poems."
      },
      {
        "difficulty": "beginner",
        "question": "Which special vehicle carries patients quickly to the hospital during emergencies?",
        "options": [
          "School bus",
          "Fire truck",
          "Garbage truck",
          "Ambulance"
        ],
        "answer": 3,
        "hint": "It has sirens and flashing lights to clear traffic."
      },
      {
        "difficulty": "intermediate",
        "question": "Which French philosopher is famous for the foundational statement 'I think, therefore I am'?",
        "options": [
          "Immanuel Kant",
          "René Descartes",
          "Friedrich Nietzsche",
          "John Locke"
        ],
        "answer": 1,
        "hint": "He wrote 'Discourse on the Method' in 1637."
      },
      {
        "difficulty": "intermediate",
        "question": "Clara Barton is best known for establishing which major humanitarian aid organization in 1881?",
        "options": [
          "Salvation Army",
          "UNICEF",
          "American Red Cross",
          "Doctors Without Borders"
        ],
        "answer": 2,
        "hint": "She was inspired by visiting the International Red Cross in Europe."
      },
      {
        "difficulty": "intermediate",
        "question": "Which ethical theory asserts that actions are right if they promote the greatest happiness for the greatest number?",
        "options": [
          "Utilitarianism",
          "Deontology",
          "Virtue Ethics",
          "Existentialism"
        ],
        "answer": 0,
        "hint": "Jeremy Bentham and John Stuart Mill were key founders of this philosophy."
      },
      {
        "difficulty": "intermediate",
        "question": "Which ancient Greek physician is traditionally revered as the 'Father of Medicine'?",
        "options": [
          "Galen",
          "Avicenna",
          "Hippocrates",
          "Aristotle"
        ],
        "answer": 2,
        "hint": "Graduating medical students often take an oath named after him."
      },
      {
        "difficulty": "intermediate",
        "question": "Which artistic and literary movement emphasized intense emotion, nature, and individualism in the late 18th century?",
        "options": [
          "Realism",
          "Romanticism",
          "Modernism",
          "Postmodernism"
        ],
        "answer": 1,
        "hint": "Famous figures include William Wordsworth, Lord Byron, and Mary Shelley."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the international English name for the medical humanitarian organization founded in France as 'Médecins Sans Frontières'?",
        "options": [
          "Oxfam",
          "World Health Organization",
          "Mercy Ships",
          "Doctors Without Borders"
        ],
        "answer": 3,
        "hint": "They won the Nobel Peace Prize in 1999 for work in crisis zones."
      },
      {
        "difficulty": "intermediate",
        "question": "In bioethics, which principle obligates caregivers to avoid inflicting unnecessary harm on patients?",
        "options": [
          "Non-maleficence",
          "Beneficence",
          "Autonomy",
          "Justice"
        ],
        "answer": 0,
        "hint": "It is closely summarized by the Latin phrase 'Primum non nocere'."
      },
      {
        "difficulty": "intermediate",
        "question": "Who authored the 1899 psychoanalytic text 'The Interpretation of Dreams'?",
        "options": [
          "Carl Jung",
          "Sigmund Freud",
          "B.F. Skinner",
          "Ivan Pavlov"
        ],
        "answer": 1,
        "hint": "He was an Austrian neurologist who founded psychoanalysis."
      },
      {
        "difficulty": "intermediate",
        "question": "What branch of the humanities studies human societies, cultures, and their historical development?",
        "options": [
          "Sociology",
          "Epistemology",
          "Anthropology",
          "Philology"
        ],
        "answer": 2,
        "hint": "The term originates from Greek roots meaning 'study of humans'."
      },
      {
        "difficulty": "intermediate",
        "question": "According to Elizabeth Kübler-Ross's 1969 model, which stage is typically considered the first stage of grief?",
        "options": [
          "Anger",
          "Bargaining",
          "Denial",
          "Depression"
        ],
        "answer": 2,
        "hint": "It acts as a temporary defense mechanism refusing to accept the reality of loss."
      },
      {
        "difficulty": "advanced",
        "question": "Which 19th-century positivist philosopher explicitly coined the term 'altruism' (altruisme) to describe a moral doctrine centered on living for others?",
        "options": [
          "Auguste Comte",
          "Henri Bergson",
          "Émile Durkheim",
          "Paul Ricoeur"
        ],
        "answer": 0,
        "hint": "He also established sociology as a scientific discipline and formulated the Law of Three Stages."
      },
      {
        "difficulty": "advanced",
        "question": "In nursing theory, who developed the 'Culture Care Diversity and Universality' theory, establishing the field of Transcultural Nursing?",
        "options": [
          "Jean Watson",
          "Madeleine Leininger",
          "Dorothea Orem",
          "Callista Roy"
        ],
        "answer": 1,
        "hint": "She published her foundational theoretical framework using the Sunrise Enabler model."
      },
      {
        "difficulty": "advanced",
        "question": "Paul Farmer, co-founder of Partners In Health, gained world renown primarily for his community-based care model treating which disease in Haiti?",
        "options": [
          "Ebola virus",
          "Malaria",
          "Multidrug-resistant Tuberculosis",
          "Chagas disease"
        ],
        "answer": 2,
        "hint": "His work targeting MDR-TB challenged global health assumptions about treating infectious diseases in resource-poor settings."
      },
      {
        "difficulty": "advanced",
        "question": "The historic 1979 Belmont Report outlined three foundational ethical principles for human subject research: Respect for Persons, Beneficence, and what third principle?",
        "options": [
          "Autonomy",
          "Justice",
          "Non-maleficence",
          "Veracity"
        ],
        "answer": 1,
        "hint": "This principle addresses the fair distribution of the burdens and benefits of research."
      },
      {
        "difficulty": "advanced",
        "question": "Which political philosopher wrote 'The Human Condition' (1958), analyzing the 'vita activa' through the tripartite division of labor, work, and action?",
        "options": [
          "Hannah Arendt",
          "Simone de Beauvoir",
          "Edith Stein",
          "Iris Murdoch"
        ],
        "answer": 0,
        "hint": "She was a German-American thinker who famously covered the trial of Adolf Eichmann."
      },
      {
        "difficulty": "advanced",
        "question": "In narrative medicine—pioneered by Rita Charon—what term describes a patient's written or spoken account of living through illness?",
        "options": [
          "Pathography",
          "Diagnostic locus",
          "Anamnesis",
          "Illness narrative"
        ],
        "answer": 3,
        "hint": "It contrasts the biomedical account of 'disease' with the human experience of 'illness'."
      },
      {
        "difficulty": "advanced",
        "question": "Which 1642 text by Sir Thomas Browne combined spiritual autobiography with early medical humanities, profoundly influencing English prose?",
        "options": [
          "Religio Medici",
          "Micrographia",
          "Anatomy of Melancholy",
          "Hydriotaphia"
        ],
        "answer": 0,
        "hint": "The title translates from Latin as 'The Religion of a Physician'."
      },
      {
        "difficulty": "advanced",
        "question": "Who founded the Henry Street Settlement in New York City in 1893, effectively pioneering public health nursing and community caregiving in the US?",
        "options": [
          "Jane Addams",
          "Mary Breckinridge",
          "Lillian Wald",
          "Lavinia Dock"
        ],
        "answer": 2,
        "hint": "She coined the term 'public health nurse' to emphasize care rooted in community social context."
      },
      {
        "difficulty": "advanced",
        "question": "Which 1963 treatise by Michel Foucault traces the architectural, epistemological, and perceptual origins of modern clinical medicine?",
        "options": [
          "Jacques Derrida",
          "The Birth of the Clinic",
          "Gilles Deleuze",
          "Maurice Merleau-Ponty"
        ],
        "answer": 1,
        "hint": "Subtitled 'An Archaeology of Medical Perception', it explores the evolution of the medical gaze."
      },
      {
        "difficulty": "advanced",
        "question": "Which psychologist and philosopher formulated the 'ethics of care' theoretical framework in her landmark 1982 book 'In a Different Voice'?",
        "options": [
          "Carol Gilligan",
          "Nel Noddings",
          "Virginia Held",
          "Annette Baier"
        ],
        "answer": 0,
        "hint": "She critiqued Lawrence Kohlberg's stages of moral development for gender bias."
      }
    ]
  },
  "science": {
    "title": "Science & Health",
    "description": "Empower your mind. Every right answer turns into tangible support for vulnerable families.",
    "questions": [
      {
        "difficulty": "beginner",
        "question": "What planet do humans live on?",
        "options": [
          "Earth",
          "Mars",
          "Jupiter",
          "Venus"
        ],
        "answer": 0,
        "hint": "It is also known as the 'Blue Planet'."
      },
      {
        "difficulty": "beginner",
        "question": "What gas do humans need to breathe in to survive?",
        "options": [
          "Helium",
          "Oxygen",
          "Carbon Dioxide",
          "Nitrogen"
        ],
        "answer": 1,
        "hint": "Plants produce this gas during daylight hours."
      },
      {
        "difficulty": "beginner",
        "question": "What color are most plant leaves?",
        "options": [
          "Blue",
          "Red",
          "Green",
          "Yellow"
        ],
        "answer": 2,
        "hint": "This color comes from a chemical called chlorophyll."
      },
      {
        "difficulty": "beginner",
        "question": "Which organ in the human body pumps blood?",
        "options": [
          "Heart",
          "Lungs",
          "Stomach",
          "Brain"
        ],
        "answer": 0,
        "hint": "It beats continuously inside your chest."
      },
      {
        "difficulty": "beginner",
        "question": "How many legs does an insect have?",
        "options": [
          "4",
          "8",
          "10",
          "6"
        ],
        "answer": 3,
        "hint": "Spiders have 8, but insects have two fewer."
      },
      {
        "difficulty": "beginner",
        "question": "What is the hard structure inside our bodies that makes up the skeleton?",
        "options": [
          "Muscles",
          "Bones",
          "Skin",
          "Veins"
        ],
        "answer": 1,
        "hint": "Calcium helps make these strong."
      },
      {
        "difficulty": "beginner",
        "question": "What is water called when it freezes solid?",
        "options": [
          "Steam",
          "Vapor",
          "Ice",
          "Juice"
        ],
        "answer": 2,
        "hint": "You might put cubes of this in a warm drink."
      },
      {
        "difficulty": "beginner",
        "question": "What does a caterpillar turn into after making a cocoon?",
        "options": [
          "Butterfly",
          "Dragonfly",
          "Ladybug",
          "Grasshopper"
        ],
        "answer": 0,
        "hint": "It is an insect with colorful wings."
      },
      {
        "difficulty": "beginner",
        "question": "What bright star gives light and heat to Earth?",
        "options": [
          "The Moon",
          "North Star",
          "Mars",
          "The Sun"
        ],
        "answer": 3,
        "hint": "It rises in the east every morning."
      },
      {
        "difficulty": "beginner",
        "question": "Which body part do you use to smell flowers?",
        "options": [
          "Eyes",
          "Nose",
          "Ears",
          "Mouth"
        ],
        "answer": 1,
        "hint": "It sits right in the center of your face."
      },
      {
        "difficulty": "intermediate",
        "question": "Which organelle is widely referred to as the powerhouse of the cell?",
        "options": [
          "Mitochondrion",
          "Nucleus",
          "Ribosome",
          "Endoplasmic Reticulum"
        ],
        "answer": 0,
        "hint": "It generates most of the chemical energy needed to power cellular reactions."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the chemical symbol for the element gold?",
        "options": [
          "Ag",
          "Fe",
          "Au",
          "Go"
        ],
        "answer": 2,
        "hint": "It derives from the Latin word 'aurum'."
      },
      {
        "difficulty": "intermediate",
        "question": "Which hormone is produced by the pancreas to lower blood sugar levels?",
        "options": [
          "Glucagon",
          "Insulin",
          "Cortisol",
          "Thyroxine"
        ],
        "answer": 1,
        "hint": "Diabetics often monitor levels of this hormone or take it as medication."
      },
      {
        "difficulty": "intermediate",
        "question": "What process do green plants use to convert light energy into chemical energy?",
        "options": [
          "Respiration",
          "Fermentation",
          "Transpiration",
          "Photosynthesis"
        ],
        "answer": 3,
        "hint": "This process produces glucose and oxygen from carbon dioxide and water."
      },
      {
        "difficulty": "intermediate",
        "question": "Which part of the brain is primarily responsible for balance and voluntary motor coordination?",
        "options": [
          "Cerebellum",
          "Cerebrum",
          "Medulla Oblongata",
          "Hypothalamus"
        ],
        "answer": 0,
        "hint": "Its name is Latin for 'little brain'."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the pH value of pure, neutral water at 25 degrees Celsius?",
        "options": [
          "0",
          "5",
          "7",
          "14"
        ],
        "answer": 2,
        "hint": "It sits right in the middle of the 0 to 14 scale."
      },
      {
        "difficulty": "intermediate",
        "question": "Which vitamin is synthesized in human skin upon exposure to ultraviolet light?",
        "options": [
          "Vitamin C",
          "Vitamin D",
          "Vitamin A",
          "Vitamin K"
        ],
        "answer": 1,
        "hint": "It is often called the 'sunshine vitamin'."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the hardest naturally occurring mineral on Earth?",
        "options": [
          "Quartz",
          "Corundum",
          "Topaz",
          "Diamond"
        ],
        "answer": 3,
        "hint": "It scores a 10 on the Mohs hardness scale."
      },
      {
        "difficulty": "intermediate",
        "question": "Which blood vessels carry oxygenated blood away from the heart to the rest of the body?",
        "options": [
          "Arteries",
          "Veins",
          "Capillaries",
          "Venules"
        ],
        "answer": 0,
        "hint": "The aorta is the largest example of these."
      },
      {
        "difficulty": "intermediate",
        "question": "Which gas accounts for approximately 78% of Earth's atmosphere by volume?",
        "options": [
          "Oxygen",
          "Carbon Dioxide",
          "Nitrogen",
          "Argon"
        ],
        "answer": 2,
        "hint": "It has the atomic number 7."
      },
      {
        "difficulty": "advanced",
        "question": "A deficiency in homogentisate 1,2-dioxygenase leads to an accumulation of homogentisic acid in which metabolic disorder?",
        "options": [
          "Phenylketonuria",
          "Alkaptonuria",
          "Tyrosinemia Type I",
          "Maple Syrup Urine Disease"
        ],
        "answer": 1,
        "hint": "Symptoms include dark urine upon standing and bluish-black connective tissue pigmentation (ochronosis)."
      },
      {
        "difficulty": "advanced",
        "question": "Which luminal co-transporter in the thick ascending limb of the loop of Henle is inhibited by loop diuretics like furosemide?",
        "options": [
          "NKCC2",
          "NCC",
          "ENaC",
          "SGLT2"
        ],
        "answer": 0,
        "hint": "It translocates one sodium, one potassium, and two chloride ions."
      },
      {
        "difficulty": "advanced",
        "question": "Mutations in the GNPTAB gene impair UDP-N-acetylglucosamine-1-phosphotransferase, causing which lysosomal storage disorder?",
        "options": [
          "Gaucher Disease",
          "Fabry Disease",
          "I-cell Disease (Mucolipidosis II)",
          "Niemann-Pick Disease Type C"
        ],
        "answer": 2,
        "hint": "Lysosomal enzymes fail to receive the mannose-6-phosphate targeting signal."
      },
      {
        "difficulty": "advanced",
        "question": "Which enzyme acts as the primary rate-limiting step in human cholesterol biosynthesis and is targeted by statins?",
        "options": [
          "Squalene synthase",
          "Mevalonate kinase",
          "Thiolase",
          "HMG-CoA reductase"
        ],
        "answer": 3,
        "hint": "It converts 3-hydroxy-3-methylglutaryl-CoA to mevalonate."
      },
      {
        "difficulty": "advanced",
        "question": "In subatomic physics, which particle was predicted by Hideki Yukawa in 1935 to mediate the strong residual force between nucleons?",
        "options": [
          "Pion (Pi-meson)",
          "Gluon",
          "Z boson",
          "Muon"
        ],
        "answer": 0,
        "hint": "It comes in charged (+/-) and neutral forms and was discovered in cosmic ray emulsions in 1947."
      },
      {
        "difficulty": "advanced",
        "question": "Which organic chemistry rearrangement transforms an acyl azide into an isocyanate via the loss of nitrogen gas?",
        "options": [
          "Hofmann rearrangement",
          "Curtius rearrangement",
          "Lossen rearrangement",
          "Schmidt reaction"
        ],
        "answer": 1,
        "hint": "It involves thermal degradation of carboxylic acid derivatives using diphenylphosphoryl azide (DPPA) or similar reagents."
      },
      {
        "difficulty": "advanced",
        "question": "Roughly 50% of Noonan syndrome cases are caused by gain-of-function missense mutations in which gene?",
        "options": [
          "KRAS",
          "SOS1",
          "PTPN11",
          "RAF1"
        ],
        "answer": 2,
        "hint": "This gene encodes the non-receptor protein tyrosine phosphatase SHP-2."
      },
      {
        "difficulty": "advanced",
        "question": "Anti-Hu antibodies (ANNA-1) are most classically associated with which paraneoplastic neurological condition?",
        "options": [
          "Subacute Sensory Neuronopathy",
          "Lambert-Eaton Myasthenic Syndrome",
          "Opsoclonus-Myoclonus Syndrome",
          "Limbic Encephalitis"
        ],
        "answer": 0,
        "hint": "It primarily causes severe multifocal sensory loss and ataxia, often preceding diagnosis of small cell lung carcinoma."
      },
      {
        "difficulty": "advanced",
        "question": "In Penicillium chrysogenum, which non-ribosomal enzyme catalyzes the oxidative cyclization of L-delta-(alpha-aminoadipoyl)-L-cysteine-D-valine to form isopenicillin N?",
        "options": [
          "Acyl-CoA:isopenicillin N acyltransferase",
          "Isopenicillin N epimerase",
          "Deacetoxycephalosporin C synthase",
          "Isopenicillin N synthase"
        ],
        "answer": 3,
        "hint": "This mononuclear non-heme iron enzyme forms both the beta-lactam and thiazolidine rings in a single step."
      },
      {
        "difficulty": "advanced",
        "question": "Andersen-Tawil syndrome (Long QT syndrome type 7) is primarily caused by loss-of-function mutations in which potassium channel gene?",
        "options": [
          "KCNQ1",
          "KCNJ2",
          "KCNH2",
          "KCNE1"
        ],
        "answer": 1,
        "hint": "It encodes the inward-rectifier potassium channel Kir2.1."
      }
    ]
  },
  "gk": {
    "title": "General Knowledge",
    "description": "Small trivia, massive impact. Help us achieve a hunger-free world, one question at a time.",
    "questions": [
      {
        "difficulty": "beginner",
        "question": "What color is the sky on a clear day?",
        "options": [
          "Green",
          "Blue",
          "Red",
          "Yellow"
        ],
        "answer": 1,
        "hint": "It is the same color as the ocean."
      },
      {
        "difficulty": "beginner",
        "question": "How many legs does a dog have?",
        "options": [
          "Two",
          "Four",
          "Six",
          "Eight"
        ],
        "answer": 1,
        "hint": "Count two in the front and two in the back."
      },
      {
        "difficulty": "beginner",
        "question": "Which animal is known for saying 'Meow'?",
        "options": [
          "Dog",
          "Cow",
          "Cat",
          "Duck"
        ],
        "answer": 2,
        "hint": "This pet likes to chase mice."
      },
      {
        "difficulty": "beginner",
        "question": "What color is a ripe banana?",
        "options": [
          "Purple",
          "Blue",
          "Yellow",
          "Black"
        ],
        "answer": 2,
        "hint": "It is a bright primary color."
      },
      {
        "difficulty": "beginner",
        "question": "What sweet food do bees make?",
        "options": [
          "Honey",
          "Chocolate",
          "Jam",
          "Candy"
        ],
        "answer": 0,
        "hint": "It comes in jars and is made from flower nectar."
      },
      {
        "difficulty": "beginner",
        "question": "How many days are in one week?",
        "options": [
          "5",
          "7",
          "10",
          "12"
        ],
        "answer": 1,
        "hint": "Monday to Sunday."
      },
      {
        "difficulty": "beginner",
        "question": "Which fruit is said to keep the doctor away if you eat one every day?",
        "options": [
          "Orange",
          "Banana",
          "Apple",
          "Grape"
        ],
        "answer": 2,
        "hint": "It can be red, green, or yellow."
      },
      {
        "difficulty": "beginner",
        "question": "What is ice made of?",
        "options": [
          "Milk",
          "Frozen Water",
          "Juice",
          "Soda"
        ],
        "answer": 1,
        "hint": "It melts into liquid when warm."
      },
      {
        "difficulty": "beginner",
        "question": "Which shape has three sides?",
        "options": [
          "Square",
          "Circle",
          "Triangle",
          "Rectangle"
        ],
        "answer": 2,
        "hint": "The prefix 'tri-' means three."
      },
      {
        "difficulty": "beginner",
        "question": "Which season comes directly after winter?",
        "options": [
          "Summer",
          "Spring",
          "Fall",
          "Autumn"
        ],
        "answer": 1,
        "hint": "It is the season when flowers start to bloom."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the capital city of Australia?",
        "options": [
          "Sydney",
          "Melbourne",
          "Canberra",
          "Brisbane"
        ],
        "answer": 2,
        "hint": "It was chosen as a compromise between Sydney and Melbourne."
      },
      {
        "difficulty": "intermediate",
        "question": "Who painted the Mona Lisa?",
        "options": [
          "Vincent van Gogh",
          "Leonardo da Vinci",
          "Pablo Picasso",
          "Claude Monet"
        ],
        "answer": 1,
        "hint": "He was a famous Italian Renaissance polymath."
      },
      {
        "difficulty": "intermediate",
        "question": "What element does the chemical symbol 'O' represent?",
        "options": [
          "Gold",
          "Osmium",
          "Oxygen",
          "Oganesson"
        ],
        "answer": 2,
        "hint": "It is essential for human respiration."
      },
      {
        "difficulty": "intermediate",
        "question": "Which planet in our solar system is known as the Red Planet?",
        "options": [
          "Venus",
          "Mars",
          "Jupiter",
          "Saturn"
        ],
        "answer": 1,
        "hint": "It is named after the Roman god of war."
      },
      {
        "difficulty": "intermediate",
        "question": "In what year did the Titanic sink?",
        "options": [
          "1905",
          "1912",
          "1918",
          "1923"
        ],
        "answer": 1,
        "hint": "It occurred just two years before the start of World War I."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the largest ocean on Earth?",
        "options": [
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
          "Pacific Ocean"
        ],
        "answer": 3,
        "hint": "Its name means 'peaceful'."
      },
      {
        "difficulty": "intermediate",
        "question": "Who wrote the play 'Romeo and Juliet'?",
        "options": [
          "Charles Dickens",
          "William Shakespeare",
          "Mark Twain",
          "Jane Austen"
        ],
        "answer": 1,
        "hint": "He is often called the 'Bard of Avon'."
      },
      {
        "difficulty": "intermediate",
        "question": "What currency is used in Japan?",
        "options": [
          "Yuan",
          "Won",
          "Yen",
          "Baht"
        ],
        "answer": 2,
        "hint": "Its symbol is ¥."
      },
      {
        "difficulty": "intermediate",
        "question": "What is the hardest natural substance on Earth?",
        "options": [
          "Quartz",
          "Diamond",
          "Titanium",
          "Corundum"
        ],
        "answer": 1,
        "hint": "It is made of pure carbon organized in a crystal lattice."
      },
      {
        "difficulty": "intermediate",
        "question": "Which country gifted the Statue of Liberty to the United States?",
        "options": [
          "United Kingdom",
          "France",
          "Spain",
          "Germany"
        ],
        "answer": 1,
        "hint": "It was designed by Frédéric-Auguste Bartholdi."
      },
      {
        "difficulty": "advanced",
        "question": "What is the highest mountain peak in Canada?",
        "options": [
          "Mount Columbia",
          "Mount Robson",
          "Mount Logan",
          "Mount Saint Elias"
        ],
        "answer": 2,
        "hint": "It is located in the Saint Elias Mountains within Kluane National Park."
      },
      {
        "difficulty": "advanced",
        "question": "Which series of treaties signed in 1648 ended the Thirty Years' War?",
        "options": [
          "Treaty of Utrecht",
          "Peace of Westphalia",
          "Treaty of Tordesillas",
          "Peace of Augsburg"
        ],
        "answer": 1,
        "hint": "It established the concept of sovereign statehood in modern diplomacy."
      },
      {
        "difficulty": "advanced",
        "question": "Who is the only person to have received two unshared Nobel Prizes?",
        "options": [
          "Marie Curie",
          "Linus Pauling",
          "John Bardeen",
          "Frederick Sanger"
        ],
        "answer": 1,
        "hint": "He won the 1954 Chemistry prize and the 1962 Peace prize."
      },
      {
        "difficulty": "advanced",
        "question": "What is the term for the radius of a sphere such that if all the mass of an object were compressed within it, the escape speed would equal the speed of light?",
        "options": [
          "Chandrasekhar limit",
          "Hubble radius",
          "Schwarzschild radius",
          "Oort radius"
        ],
        "answer": 2,
        "hint": "Named after a German astronomer who derived it in 1916."
      },
      {
        "difficulty": "advanced",
        "question": "In what year did the Byzantine Empire collapse with the fall of Constantinople?",
        "options": [
          "1204",
          "1356",
          "1453",
          "1492"
        ],
        "answer": 2,
        "hint": "The city was conquered by Ottoman Sultan Mehmed II."
      },
      {
        "difficulty": "advanced",
        "question": "In the International System of Units (SI), what is the base unit of luminous intensity?",
        "options": [
          "Lumen",
          "Lux",
          "Candela",
          "Watt"
        ],
        "answer": 2,
        "hint": "The word stems from the Latin for candle."
      },
      {
        "difficulty": "advanced",
        "question": "Which 18th-century English poet wrote the satirical poem 'The Dunciad'?",
        "options": [
          "Alexander Pope",
          "John Dryden",
          "Samuel Johnson",
          "Jonathan Swift"
        ],
        "answer": 0,
        "hint": "He was famous for his translation of Homer's works into heroic couplets."
      },
      {
        "difficulty": "advanced",
        "question": "Which mineral ranks at 9 on the Mohs scale of hardness?",
        "options": [
          "Topaz",
          "Corundum",
          "Quartz",
          "Fluorite"
        ],
        "answer": 1,
        "hint": "Rubies and sapphires are gem varieties of this mineral."
      },
      {
        "difficulty": "advanced",
        "question": "What kind of insect was the first physical 'computer bug' recorded by Grace Hopper in 1947?",
        "options": [
          "Beetle",
          "Moth",
          "Fly",
          "Roach"
        ],
        "answer": 1,
        "hint": "It was trapped in a relay of the Harvard Mark II computer."
      },
      {
        "difficulty": "advanced",
        "question": "Which chemical element has the highest melting point of all pure metals?",
        "options": [
          "Platinum",
          "Titanium",
          "Tungsten",
          "Rhenium"
        ],
        "answer": 2,
        "hint": "Also known as Wolfram, it has the symbol W."
      }
    ]
  }
};
