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
  animals: {
    title: "Animal Welfare",
    description: "Learn about the animal kingdom to help feed rescue dogs and street animals today.",
    questions: [
      { difficulty: 'beginner', question: "What is a group of lions called?", options: ["A pack", "A pride", "A herd", "A flock"], answer: 1, hint: "It implies dignity and self-respect." },
      { difficulty: 'beginner', question: "Which animal is known as man's best friend?", options: ["Cat", "Horse", "Dog", "Parrot"], answer: 2, hint: "They have a powerful sense of smell and bark." },
      { difficulty: 'beginner', question: "What do pandas primarily eat?", options: ["Insects", "Fish", "Bamboo", "Berries"], answer: 2, hint: "It's a fast-growing grass native to Asia." },
      { difficulty: 'intermediate', question: "How many compartments does a cow's stomach have?", options: ["One", "Two", "Three", "Four"], answer: 3, hint: "They are ruminants, requiring complex digestion." },
      { difficulty: 'intermediate', question: "Which mammal is known to have the most powerful bite?", options: ["Hippopotamus", "Lion", "Gorilla", "Hyena"], answer: 0, hint: "Despite their diet, these massive river animals have enormous jaws." },
      { difficulty: 'intermediate', question: "What is the only mammal capable of true sustained flight?", options: ["Flying Squirrel", "Bat", "Lemur", "Glider"], answer: 1, hint: "They navigate using echolocation." },
      { difficulty: 'advanced', question: "What is the scientific term for the study of animal behavior?", options: ["Entomology", "Ethology", "Ornithology", "Zoology"], answer: 1, hint: "It starts with 'Etho'." },
      { difficulty: 'advanced', question: "Which species of bird is known to migrate the longest distance?", options: ["Arctic Tern", "Albatross", "Swallow", "Hummingbird"], answer: 0, hint: "It travels from pole to pole." },
      { difficulty: 'advanced', question: "What unique sensory organ do sharks use to detect electrical fields?", options: ["Lateral line", "Ampullae of Lorenzini", "Olfactory bulb", "Nictitating membrane"], answer: 1, hint: "Named after an Italian anatomist." }
    ]
  },
  nature: {
    title: "Nature & Environment",
    description: "Every correct answer plants a seed of hope and provides nourishment to the hungry.",
    questions: [
      { difficulty: 'beginner', question: "What gas do plants absorb from the atmosphere during photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: 1, hint: "It is what humans exhale." },
      { difficulty: 'beginner', question: "What is the largest rainforest in the world?", options: ["Congo", "Daintree", "Amazon", "Tongass"], answer: 2, hint: "Located largely in South America." },
      { difficulty: 'beginner', question: "Which part of the plant conducts photosynthesis?", options: ["Root", "Stem", "Leaf", "Flower"], answer: 2, hint: "They are usually flat and green." },
      { difficulty: 'intermediate', question: "What is the term for a community of living organisms interacting with their physical environment?", options: ["Biosphere", "Ecosystem", "Habitat", "Biome"], answer: 1, hint: "It ends in 'system'." },
      { difficulty: 'intermediate', question: "What is the hardest naturally occurring mineral on Earth?", options: ["Quartz", "Topaz", "Diamond", "Corundum"], answer: 2, hint: "Made of pure carbon." },
      { difficulty: 'intermediate', question: "Which layer of the atmosphere contains the ozone layer?", options: ["Troposphere", "Stratosphere", "Mesosphere", "Thermosphere"], answer: 1, hint: "It is the second layer, just above the troposphere." },
      { difficulty: 'advanced', question: "What is the name of the process by which soil loses its fertility and turns into desert?", options: ["Deforestation", "Erosion", "Desertification", "Salinization"], answer: 2, hint: "The name literally implies becoming a desert." },
      { difficulty: 'advanced', question: "Which biome is characterized by permafrost?", options: ["Taiga", "Tundra", "Savanna", "Chaparral"], answer: 1, hint: "It's a cold, treeless region." },
      { difficulty: 'advanced', question: "What natural phenomenon is measured using the Saffir-Simpson scale?", options: ["Earthquakes", "Tornadoes", "Hurricanes", "Tsunamis"], answer: 2, hint: "It categorizes them from 1 to 5 based on wind speed." }
    ]
  },
  humanities: {
    title: "Humanities & Care",
    description: "Explore the kindness of humanity. Play daily to transform a life in need with a hot meal.",
    questions: [
      { difficulty: 'beginner', question: "Who won the Nobel Peace Prize for her work in the slums of Calcutta?", options: ["Florence Nightingale", "Mother Teresa", "Rosa Parks", "Marie Curie"], answer: 1, hint: "She founded the Missionaries of Charity." },
      { difficulty: 'beginner', question: "Which international organization's primary symbol is a red cross on a white background?", options: ["UNICEF", "WHO", "Red Cross", "Amnesty International"], answer: 2, hint: "The name is literally its symbol." },
      { difficulty: 'beginner', question: "What is the universal gesture that signifies happiness and friendliness?", options: ["A wave", "A nod", "A smile", "A handshake"], answer: 2, hint: "It uses the muscles of the mouth." },
      { difficulty: 'intermediate', question: "Which document was adopted by the UN in 1948 to protect human rights globally?", options: ["The Magna Carta", "The Bill of Rights", "Universal Declaration of Human Rights", "The Geneva Conventions"], answer: 2, hint: "It declares rights for the universe of humans." },
      { difficulty: 'intermediate', question: "What does the humanitarian organization 'Doctors Without Borders' primarily do?", options: ["Build hospitals", "Provide medical aid where it's needed most", "Train local nurses", "Distribute vaccines only"], answer: 1, hint: "They focus on immediate medical assistance in crisis zones." },
      { difficulty: 'intermediate', question: "Which historical figure is known for leading the Civil Rights Movement using nonviolent civil disobedience?", options: ["Malcolm X", "Nelson Mandela", "Martin Luther King Jr.", "Frederick Douglass"], answer: 2, hint: "He had a famous 'Dream'." },
      { difficulty: 'advanced', question: "In ethical philosophy, what is the principle of maximizing overall happiness called?", options: ["Deontology", "Utilitarianism", "Nihilism", "Existentialism"], answer: 1, hint: "Associated with John Stuart Mill and Jeremy Bentham." },
      { difficulty: 'advanced', question: "What term describes the psychological phenomenon where people are less likely to offer help to a victim when other people are present?", options: ["Bystander Effect", "Halo Effect", "Placebo Effect", "Hawthorne Effect"], answer: 0, hint: "It involves people standing by." },
      { difficulty: 'advanced', question: "Which ancient Greek concept refers to a deep, unconditional love for humanity?", options: ["Eros", "Philia", "Agape", "Storge"], answer: 2, hint: "It is often translated as 'charity' in biblical texts." }
    ]
  },
  science: {
    title: "Science & Health",
    description: "Empower your mind. Every right answer turns into tangible support for vulnerable families.",
    questions: [
      { difficulty: 'beginner', question: "What organ is responsible for pumping blood throughout the human body?", options: ["Brain", "Liver", "Lungs", "Heart"], answer: 3, hint: "It beats continuously." },
      { difficulty: 'beginner', question: "Which vitamin is primarily produced in the skin when exposed to sunlight?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], answer: 3, hint: "Often called the 'sunshine vitamin'." },
      { difficulty: 'beginner', question: "What is the boiling point of water at sea level in Celsius?", options: ["50", "90", "100", "120"], answer: 2, hint: "It is the basis for the Celsius scale." },
      { difficulty: 'intermediate', question: "Which scientist is famous for the theory of relativity (E=mc^2)?", options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Galileo Galilei"], answer: 2, hint: "He had iconic wild hair." },
      { difficulty: 'intermediate', question: "What part of the cell is known as the powerhouse?", options: ["Nucleus", "Ribosome", "Mitochondria", "Endoplasmic Reticulum"], answer: 2, hint: "It starts with 'Mito'." },
      { difficulty: 'intermediate', question: "What is the most abundant gas in the Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Hydrogen", "Nitrogen"], answer: 3, hint: "It makes up about 78%." },
      { difficulty: 'advanced', question: "What is the name of the process by which cells break down glucose to produce ATP without oxygen?", options: ["Photosynthesis", "Aerobic Respiration", "Anaerobic Respiration", "Transpiration"], answer: 2, hint: "The prefix 'an-' means without." },
      { difficulty: 'advanced', question: "In physics, what principle states that the exact position and momentum of an electron cannot be simultaneously known?", options: ["Pauli Exclusion Principle", "Heisenberg Uncertainty Principle", "Bohr Model", "Schrödinger's Cat"], answer: 1, hint: "Named after Werner." },
      { difficulty: 'advanced', question: "What is the rarest blood type among the general human population?", options: ["O positive", "A negative", "B positive", "AB negative"], answer: 3, hint: "It lacks both A and B antigens and the Rh factor." }
    ]
  },
  gk: {
    title: "General Knowledge",
    description: "Small trivia, massive impact. Help us achieve a hunger-free world, one question at a time.",
    questions: [
      { difficulty: 'beginner', question: "How many continents are there on Earth?", options: ["5", "6", "7", "8"], answer: 2, hint: "Africa, Antarctica, Asia, Australia, Europe, North America, South America." },
      { difficulty: 'beginner', question: "What is the capital city of France?", options: ["Rome", "Berlin", "Madrid", "Paris"], answer: 3, hint: "Home to the Eiffel Tower." },
      { difficulty: 'beginner', question: "Which planet is known as the 'Red Planet'?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1, hint: "Named after the Roman god of war." },
      { difficulty: 'intermediate', question: "Which author wrote the 'Harry Potter' series?", options: ["J.R.R. Tolkien", "George R.R. Martin", "J.K. Rowling", "Stephen King"], answer: 2, hint: "Her first name is Joanne." },
      { difficulty: 'intermediate', question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], answer: 1, hint: "Located in Africa." },
      { difficulty: 'intermediate', question: "In what year did the Titanic sink?", options: ["1905", "1912", "1920", "1931"], answer: 1, hint: "It was early in the 20th century." },
      { difficulty: 'advanced', question: "What is the smallest country in the world by land area?", options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"], answer: 2, hint: "It is an enclave within Rome, Italy." },
      { difficulty: 'advanced', question: "Who was the first woman to win a Nobel Prize?", options: ["Rosalind Franklin", "Marie Curie", "Jane Addams", "Mother Teresa"], answer: 1, hint: "She won it in two different scientific fields." },
      { difficulty: 'advanced', question: "What is the main ingredient in traditional Japanese miso soup?", options: ["Tofu", "Seaweed", "Fermented soybean paste", "Fish broth"], answer: 2, hint: "It involves fermentation." }
    ]
  }
};
