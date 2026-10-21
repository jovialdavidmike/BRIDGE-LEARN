import { ClassLevel, SubjectName, Question, CurriculumStandard } from '../types';

export interface CurriculumStandardMeta {
  id: CurriculumStandard;
  name: string;
  scope: 'Local' | 'National' | 'Global Bridge';
  region: string;
  flag: string;
  description: string;
  gradingStyle: string;
}

export const CURRICULUM_STANDARDS: CurriculumStandardMeta[] = [
  {
    id: 'WAEC',
    name: 'WAEC (WASSCE)',
    scope: 'Local',
    region: 'West Africa',
    flag: '🇳🇬',
    description: 'West African Examinations Council standard syllabus & question styles',
    gradingStyle: 'A1 - F9 Scale',
  },
  {
    id: 'NECO',
    name: 'NECO (SSCE & BECE)',
    scope: 'Local',
    region: 'Nigeria',
    flag: '🇳🇬',
    description: 'National Examinations Council curriculum & standardized formatting',
    gradingStyle: 'Distinction / Credit / Pass',
  },
  {
    id: 'JAMB',
    name: 'JAMB (UTME)',
    scope: 'National',
    region: 'Nigerian Universities',
    flag: '🎓',
    description: 'CBT speed-focused entrance examination with high-yield concepts',
    gradingStyle: '400-Point Target',
  },
  {
    id: 'IGCSE',
    name: 'Cambridge IGCSE',
    scope: 'Global Bridge',
    region: 'International / UK',
    flag: '🇬🇧',
    description: 'International General Certificate of Secondary Education curriculum',
    gradingStyle: '9-1 / A*-G Scale',
  },
  {
    id: 'SAT',
    name: 'Digital SAT',
    scope: 'Global Bridge',
    region: 'US & Global Colleges',
    flag: '🇺🇸',
    description: 'College Board reasoning style, word problems, and evidence-based analysis',
    gradingStyle: '1600-Scale (Math & Reading)',
  },
];

export interface SubjectMeta {
  id: SubjectName;
  name: string;
  category: 'STEM' | 'Humanities' | 'Commercial' | 'General';
  icon: string;
  color: string;
  applicableLevels: ClassLevel[];
  popularTopics: Record<ClassLevel, string[]>;
}

export const CLASS_LEVELS: { id: ClassLevel; label: string; badge: string; description: string }[] = [
  { id: 'JSS1', label: 'JSS 1', badge: 'Basic 7', description: 'Foundations of Junior Secondary curriculum' },
  { id: 'JSS2', label: 'JSS 2', badge: 'Basic 8', description: 'Intermediate Junior Secondary concepts' },
  { id: 'JSS3', label: 'JSS 3', badge: 'BECE / Junior WAEC', description: 'Final Junior Secondary & Exam prep' },
  { id: 'SS1', label: 'SS 1', badge: 'Senior 1', description: 'Intro to Senior Secondary & Sciences' },
  { id: 'SS2', label: 'SS 2', badge: 'Senior 2', description: 'Advanced Senior Secondary coursework' },
  { id: 'SS3', label: 'SS 3', badge: 'WAEC / NECO / UTME', description: 'Senior School Certificate Examination focus' },
];

export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'Mathematics',
    name: 'Mathematics',
    category: 'STEM',
    icon: 'Calculator',
    color: 'emerald',
    applicableLevels: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
    popularTopics: {
      JSS1: ['Whole Numbers & Place Value', 'Fractions, Decimals & Percentages', 'Simple Algebraic Equations', 'Plane Shapes & Perimeter', 'Direct Proportions'],
      JSS2: ['Algebraic Factorization', 'Linear Equations in One Variable', 'Pythagoras Theorem', 'Angles & Parallel Lines', 'Simple Interest & Profit/Loss'],
      JSS3: ['Simultaneous Linear Equations', 'Quadratic Expressions', 'Trigonometric Ratios (Sine & Cosine)', 'Surface Area of 3D Solids', 'Probability Basics'],
      SS1: ['Number Bases & Modular Arithmetic', 'Indices & Logarithms', 'Sets & Venn Diagrams', 'Quadratic Equations by Factorization', 'Mensuration of Solids'],
      SS2: ['Simultaneous Equations (Linear & Quadratic)', 'Arithmetic Progression (A.P.) & G.P.', 'Circle Theorems', 'Trigonometry & Bearings', 'Statistics & Probability'],
      SS3: ['Calculus (Differentiation & Integration)', 'Matrices & Determinants', 'Coordinate Geometry', 'Vectors in a Plane', 'WAEC General Revision'],
    },
  },
  {
    id: 'Basic Science',
    name: 'Basic Science',
    category: 'STEM',
    icon: 'FlaskConical',
    color: 'blue',
    applicableLevels: ['JSS1', 'JSS2', 'JSS3'],
    popularTopics: {
      JSS1: ['Living and Non-Living Things', 'Matter & its States', 'Human Skeletal System', 'Environmental Pollution', 'Renewable Energy Sources'],
      JSS2: ['Thermal Energy & Heat Transfer', 'Digestive and Respiratory Systems', 'Chemical Elements & Compounds', 'Kinetic Theory of Matter', 'Reproductive Health'],
      JSS3: ['Atomic Structure & Periodic Table Intro', 'Electric Current & Circuits', 'Magnetism & Electromagnets', 'Genetics & Simple Heredity', 'BECE Integrated Science Revision'],
      SS1: [],
      SS2: [],
      SS3: [],
    },
  },
  {
    id: 'Chemistry',
    name: 'Chemistry',
    category: 'STEM',
    icon: 'Atom',
    color: 'purple',
    applicableLevels: ['SS1', 'SS2', 'SS3'],
    popularTopics: {
      JSS1: [],
      JSS2: [],
      JSS3: [],
      SS1: ['Particulate Nature of Matter', 'Atomic Structure & Electronic Configuration', 'Periodic Table & Periodicity', 'Chemical Bonding (Ionic & Covalent)', 'Acids, Bases, and Salts'],
      SS2: ['Gas Laws (Boyle’s, Charles’s, Ideal)', 'Mole Concept & Stoichiometry', 'Rate of Chemical Reactions', 'Oxidation-Reduction (Redox) Reactions', 'Electrolysis & Faradays Laws'],
      SS3: ['Organic Chemistry (Hydrocarbons, Alkanols)', 'Thermochemistry & Enthalpy Changes', 'Industrial Chemistry (Haber & Contact processes)', 'Volumetric Analysis (Titration calculations)', 'WAEC Past Paper Review'],
    },
  },
  {
    id: 'Physics',
    name: 'Physics',
    category: 'STEM',
    icon: 'Zap',
    color: 'amber',
    applicableLevels: ['SS1', 'SS2', 'SS3'],
    popularTopics: {
      JSS1: [],
      JSS2: [],
      JSS3: [],
      SS1: ['Units and Dimensions', 'Position, Distance, and Displacement', 'Speed, Velocity, and Acceleration', 'Scalars and Vectors', 'Work, Energy, and Power'],
      SS2: ['Heat Energy & Thermal Expansion', 'Wave Motion & Sound Waves', 'Reflection & Refraction of Light', 'Electric Fields & Ohm’s Law', 'Gravitational Field'],
      SS3: ['Electromagnetic Induction', 'Alternating Current (A.C.) Circuits', 'Models of the Atom & Radioactivity', 'Energy Quantization & Photoelectric Effect', 'SSCE Comprehensive Practice'],
    },
  },
  {
    id: 'Biology',
    name: 'Biology',
    category: 'STEM',
    icon: 'Dna',
    color: 'teal',
    applicableLevels: ['SS1', 'SS2', 'SS3'],
    popularTopics: {
      JSS1: [],
      JSS2: [],
      JSS3: [],
      SS1: ['Cell Structure and Organization', 'Classification of Living Things', 'Nutrition in Animals and Plants', 'Cellular Respiration', 'Ecology and Habitats in Nigeria'],
      SS2: ['Transport System in Mammals and Plants', 'Excretory Systems', 'Homeostasis & Regulation', 'Reproduction in Flowering Plants', 'Pollination and Seed Dispersal'],
      SS3: ['Mendelian Genetics & Inheritance', 'Variation in Population & Blood Groups', 'Evolution & Adaptation', 'Ecology of Populations & Pollution', 'WAEC Biology Past Papers'],
    },
  },
  {
    id: 'English Studies',
    name: 'English Studies',
    category: 'General',
    icon: 'BookOpen',
    color: 'rose',
    applicableLevels: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
    popularTopics: {
      JSS1: ['Parts of Speech (Nouns, Pronouns, Verbs)', 'Subject-Verb Concord', 'Punctuation Marks', 'Comprehension & Vocabulary', 'Synonyms and Antonyms'],
      JSS2: ['Tenses (Present, Past, Perfect)', 'Active and Passive Voice', 'Direct and Indirect Speech', 'Idiomatic Expressions', 'Letter Writing Format'],
      JSS3: ['Complex Sentence Structures', 'Relative Clauses', 'Phrasal Verbs', 'BECE English Examination Prep', 'Summary Writing Techniques'],
      SS1: ['Concord Rules (Advanced)', 'Lexis and Structure in Context', 'Stress Patterns and Oral English (Vowels & Consonants)', 'Clauses and Phrases Analysis', 'Expository Essay Writing'],
      SS2: ['Figures of Speech (Metaphor, Simile, Irony)', 'Idioms and Collocations', 'Comprehension Inference Skills', 'Oral English (Rhymes & Emphatic Stress)', 'Register of Various Fields'],
      SS3: ['WAEC Oral English Drills', 'Summary Writing Mastery', 'Antonyms and Synonyms in Context', 'Idioms & Fixed Prepositions', 'SSCE English Language Practice'],
    },
  },
  {
    id: 'Agricultural Science',
    name: 'Agricultural Science',
    category: 'STEM',
    icon: 'Sprout',
    color: 'lime',
    applicableLevels: ['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'],
    popularTopics: {
      JSS1: ['Importance of Agriculture in Nigeria', 'Forms of Farm Animals', 'Soil Formation and Components', 'Classification of Crops', 'Weeds and Pest Control'],
      JSS2: ['Farm Structures and Buildings', 'Crop Propagation (Sexual & Asexual)', 'Animal Nutrition & Feed Stuffs', 'Forests and Forest Uses in Nigeria', 'Farm Power and Machinery'],
      JSS3: ['Agricultural Marketing & Cooperatives', 'Fisheries & Aquaculture', 'Poultry Production & Care', 'Post-Harvest Processing', 'BECE Agricultural Science Revision'],
      SS1: ['Agricultural Ecology & Agro-ecological Zones', 'Rock Weathering & Soil Profiles', 'Plant Nutrients & Fertilizer Calculation', 'Farm Surveying & Planning', 'Crop Husbandry (Maize, Cassava, Yam)'],
      SS2: ['Pasture and Forage Crops', 'Animal Breeding and Reproduction', 'Livestock Diseases & Prevention', 'Agricultural Economics (Demand & Supply)', 'Farm Budgeting and Accounts'],
      SS3: ['Agricultural Extension Services', 'Farm Records and Accounting', 'SSCE Past Questions Review', 'Fish Farming Systems in Nigeria', 'Export Crops & Trade'],
    },
  },
];

// Fallback bank for low-connectivity or quick testing
export const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  'JSS1-Mathematics': [
    {
      id: 1,
      question: 'Express 45 as a product of its prime factors.',
      options: ['A) 3 × 15', 'B) 3² × 5', 'C) 5 × 9', 'D) 2 × 3 × 7'],
      correct_answer: 'B) 3² × 5',
      explanation: 'Dividing 45 by the smallest prime 3 gives 15; dividing 15 by 3 gives 5. Hence, 45 = 3 × 3 × 5 = 3² × 5.',
    },
    {
      id: 2,
      question: 'A trader in Balogun market bought a bag of rice for ₦30,000 and sold it for ₦36,000. Calculate the percentage profit.',
      options: ['A) 15%', 'B) 16.7%', 'C) 20%', 'D) 25%'],
      correct_answer: 'C) 20%',
      explanation: 'Profit = Selling Price - Cost Price = ₦36,000 - ₦30,000 = ₦6,000. Percentage profit = (6,000 / 30,000) × 100% = 20%.',
    },
    {
      id: 3,
      question: 'Solve for x in the simple equation: 4x - 7 = 17',
      options: ['A) x = 5', 'B) x = 6', 'C) x = 7', 'D) x = 8'],
      correct_answer: 'B) x = 6',
      explanation: 'Add 7 to both sides: 4x = 17 + 7 = 24. Divide both sides by 4: x = 24 / 4 = 6.',
    },
  ],
  'JSS1-Basic Science': [
    {
      id: 1,
      question: 'Which of the following properties is characteristic of all living organisms?',
      options: ['A) Ability to conduct electricity', 'B) Movement and Respiration', 'C) Sublimation when heated', 'D) Fixed geometric crystal shape'],
      correct_answer: 'B) Movement and Respiration',
      explanation: 'All living things exhibit the characteristics of life summarized by MR NIGER D (Movement, Respiration, Nutrition, Irritability, Growth, Excretion, Reproduction, Death).',
    },
    {
      id: 2,
      question: 'Which state of matter has a definite volume but takes the shape of its container?',
      options: ['A) Solid', 'B) Gas', 'C) Liquid', 'D) Plasma'],
      correct_answer: 'C) Liquid',
      explanation: 'Liquids have particles that slide over each other with definite volume, adopting the container’s shape.',
    },
    {
      id: 3,
      question: 'Which of the following human body parts is protected by the rib cage?',
      options: ['A) The brain and spinal cord', 'B) The heart and lungs', 'C) The kidney and bladder', 'D) The stomach and intestines'],
      correct_answer: 'B) The heart and lungs',
      explanation: 'The thoracic rib cage encases and shields vital organs in the chest cavity, principally the lungs and heart.',
    },
  ],
  'SS1-Chemistry': [
    {
      id: 1,
      question: 'An atom of an element has an atomic number of 11 and a mass number of 23. How many neutrons are in its nucleus?',
      options: ['A) 11', 'B) 12', 'C) 23', 'D) 34'],
      correct_answer: 'B) 12',
      explanation: 'Number of neutrons = Mass number (A) - Atomic number (Z) = 23 - 11 = 12 neutrons.',
    },
    {
      id: 2,
      question: 'Which of the following substances will turn moist blue litmus paper red?',
      options: ['A) Dilute Hydrochloric acid', 'B) Aqueous Sodium hydroxide', 'C) Distilled water', 'D) Calcium hydroxide solution'],
      correct_answer: 'A) Dilute Hydrochloric acid',
      explanation: 'Acids turn moist blue litmus paper red due to the presence of hydrogen ions (H⁺) in aqueous solution.',
    },
    {
      id: 3,
      question: 'What type of chemical bonding exists in sodium chloride (NaCl)?',
      options: ['A) Covalent bonding', 'B) Electrovalent (Ionic) bonding', 'C) Dative bonding', 'D) Metallic bonding'],
      correct_answer: 'B) Electrovalent (Ionic) bonding',
      explanation: 'Sodium (a metal) transfers its valence electron to chlorine (a non-metal), creating Na⁺ and Cl⁻ ions held by electrostatic attraction.',
    },
  ],
};
