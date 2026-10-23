import { Question, CurriculumStandard } from '../types';

export interface CurriculumStandardMeta {
  id: CurriculumStandard;
  name: string;
  scope: 'Local' | 'National' | 'Global Bridge';
  region: string;
  flag: string;
  description: string;
  gradingStyle: string;
  classSystemName: string;
}

export const CURRICULUM_STANDARDS: CurriculumStandardMeta[] = [
  {
    id: 'WAEC',
    name: 'WAEC (WASSCE)',
    scope: 'Local',
    region: 'West Africa',
    flag: '🇳🇬',
    description: 'West African Senior School Certificate examination syllabus (JSS1 - SS3 standards)',
    gradingStyle: 'A1 - F9 Scale',
    classSystemName: 'Nigerian Secondary (JSS1 - SS3)',
  },
  {
    id: 'NECO',
    name: 'NECO (SSCE & BECE)',
    scope: 'Local',
    region: 'Nigeria',
    flag: '🇳🇬',
    description: 'National Examinations Council curriculum & standardized BECE/SSCE questions',
    gradingStyle: 'Distinction / Credit / Pass',
    classSystemName: 'Nigerian Secondary (JSS1 - SS3)',
  },
  {
    id: 'JAMB',
    name: 'JAMB (UTME)',
    scope: 'National',
    region: 'Nigerian Universities',
    flag: '🎓',
    description: 'CBT speed-focused entrance examination with high-yield syllabus concepts',
    gradingStyle: '400-Point Target',
    classSystemName: 'UTME Target Tiers',
  },
  {
    id: 'IGCSE',
    name: 'Cambridge IGCSE',
    scope: 'Global Bridge',
    region: 'International / UK',
    flag: '🇬🇧',
    description: 'International General Certificate of Secondary Education (Year 7 - 11)',
    gradingStyle: '9-1 / A*-G Scale',
    classSystemName: 'UK Secondary (Years 7 - 11)',
  },
  {
    id: 'SAT',
    name: 'Digital SAT',
    scope: 'Global Bridge',
    region: 'US & Global Colleges',
    flag: '🇺🇸',
    description: 'College Board Digital SAT testing Math, Reading & Writing reasoning styles (Grades 9 - 12)',
    gradingStyle: '1600-Scale (800 Math / 800 RW)',
    classSystemName: 'US High School (Grades 9 - 12)',
  },
];

export interface ClassLevelItem {
  id: string;
  label: string;
  badge: string;
  description: string;
}

export interface SubjectMeta {
  id: string;
  name: string;
  category: 'STEM' | 'Humanities' | 'Commercial' | 'General' | 'SAT Core';
  icon: string;
  color: string;
  applicableLevels: string[];
  popularTopics: Record<string, string[]>;
}

// 1. Classes per Curriculum Standard
export function getClassLevelsForStandard(standard: CurriculumStandard): ClassLevelItem[] {
  switch (standard) {
    case 'SAT':
      return [
        { id: 'Grade 9', label: 'Grade 9', badge: 'Freshman / PSAT 8/9', description: 'Algebra foundations, linear relations, and passage analysis' },
        { id: 'Grade 10', label: 'Grade 10', badge: 'Sophomore / PSAT 10', description: 'Advanced algebra, coordinate geometry, and grammar conventions' },
        { id: 'Grade 11', label: 'Grade 11', badge: 'Junior / Core Digital SAT', description: 'Full Digital SAT scope: advanced math, rhetoric, and data analysis' },
        { id: 'Grade 12', label: 'Grade 12', badge: 'Senior / SAT Target 1500+', description: 'Final test-day drills, timed pacing, and high-difficulty questions' },
      ];

    case 'IGCSE':
      return [
        { id: 'Year 7', label: 'Year 7', badge: 'Stage 7 Checkpoint', description: 'Lower secondary introductory concepts' },
        { id: 'Year 8', label: 'Year 8', badge: 'Stage 8 Checkpoint', description: 'Intermediate secondary Cambridge syllabus' },
        { id: 'Year 9', label: 'Year 9', badge: 'Stage 9 Checkpoint', description: 'Pre-IGCSE foundation and core skills' },
        { id: 'Year 10', label: 'Year 10', badge: 'IGCSE Year 1', description: 'Extended syllabus coursework in sciences and mathematics' },
        { id: 'Year 11', label: 'Year 11', badge: 'IGCSE Candidate', description: 'Final examination past-paper preparation' },
      ];

    case 'JAMB':
      return [
        { id: 'UTME Foundation', label: 'UTME Prep', badge: 'SS2 / Fast-Track', description: 'Foundational review of high-yield JAMB syllabus topics' },
        { id: 'UTME Candidate', label: 'UTME Candidate', badge: 'SS3 / Exam Year', description: 'Comprehensive JAMB CBT drills across past questions' },
        { id: 'Post-UTME Drill', label: 'Post-UTME Drill', badge: 'Top-Tier Target', description: 'High-competition university screening questions' },
      ];

    case 'WAEC':
    case 'NECO':
    default:
      return [
        { id: 'JSS1', label: 'JSS 1', badge: 'Basic 7', description: 'Junior Secondary foundations' },
        { id: 'JSS2', label: 'JSS 2', badge: 'Basic 8', description: 'Intermediate Junior Secondary syllabus' },
        { id: 'JSS3', label: 'JSS 3', badge: 'BECE / Junior WAEC', description: 'Basic Education Certificate Examination prep' },
        { id: 'SS1', label: 'SS 1', badge: 'Senior 1', description: 'Introduction to Senior Secondary & Sciences' },
        { id: 'SS2', label: 'SS 2', badge: 'Senior 2', description: 'Advanced Senior Secondary coursework' },
        { id: 'SS3', label: 'SS 3', badge: 'WAEC Candidate', description: 'Senior School Certificate Examination (SSCE)' },
      ];
  }
}

// 2. Subjects per Curriculum Standard
export function getSubjectsForStandard(standard: CurriculumStandard): SubjectMeta[] {
  if (standard === 'SAT') {
    return [
      {
        id: 'SAT Math',
        name: 'SAT Math',
        category: 'SAT Core',
        icon: 'Calculator',
        color: 'emerald',
        applicableLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        popularTopics: {
          'Grade 9': ['Linear Equations in 1 & 2 Variables', 'Ratios, Rates, and Proportions', 'Exponents & Radical Expressions', 'Interpreting Linear Graphs'],
          'Grade 10': ['Systems of Two Linear Equations', 'Quadratic Equations & Parabola Vertex', 'Polynomial Factors & Graphs', 'Scatterplots & Line of Best Fit'],
          'Grade 11': ['Passport to Advanced Math', 'Function Notation & Transformations', 'Right Triangle Trigonometry & Radian Measure', 'Circle Equations in the xy-Plane'],
          'Grade 12': ['Complex Multi-Step Word Problems', 'Nonlinear System Intersections', 'Margin of Error & Statistical Inferences', 'Digital SAT Math Mixed Drills'],
        },
      },
      {
        id: 'Reading and Writing',
        name: 'Reading and Writing',
        category: 'SAT Core',
        icon: 'BookOpen',
        color: 'rose',
        applicableLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        popularTopics: {
          'Grade 9': ['Subject-Verb Agreement', 'Pronoun-Antecedent Concord', 'Words in Context (Tier 2 Vocabulary)', 'Identifying Main Ideas'],
          'Grade 10': ['Sentence Boundaries (Comma Splices & Run-ons)', 'Logical Transitions (Furthermore, However)', 'Text Structure and Purpose', 'Cross-Text Connections'],
          'Grade 11': ['Command of Evidence (Textual & Quantitative)', 'Rhetorical Synthesis (Bullet-Point Prompts)', 'Modifier Placement & Parallel Structure', 'Inference and Underlying Hypotheses'],
          'Grade 12': ['High-Difficulty Vocabulary in Context', 'Paired Historical & Scientific Passages', 'Complex Punctuation (Colons, Dashes, Semicolons)', 'Full RW Module Simulation'],
        },
      },
      {
        id: 'Physics',
        name: 'Physics (SAT/Pre-College)',
        category: 'STEM',
        icon: 'Zap',
        color: 'amber',
        applicableLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        popularTopics: {
          'Grade 9': ['Velocity, Acceleration, and Motion Graphs', 'Newton’s Three Laws of Motion', 'Gravity and Friction'],
          'Grade 10': ['Work, Kinetic and Potential Energy', 'Conservation of Momentum and Collisions', 'Uniform Circular Motion'],
          'Grade 11': ['Electric Fields and Coulomb’s Law', 'DC Circuits (Ohm’s Law & Series/Parallel)', 'Wave Properties and the Doppler Effect'],
          'Grade 12': ['Electromagnetic Induction', 'Thermodynamics and Heat Engines', 'Atomic & Nuclear Physics Foundations'],
        },
      },
      {
        id: 'Chemistry',
        name: 'Chemistry (SAT/Pre-College)',
        category: 'STEM',
        icon: 'Atom',
        color: 'purple',
        applicableLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        popularTopics: {
          'Grade 9': ['Atomic Structure and Subatomic Particles', 'Periodic Table Trends', 'Chemical Formulas and Nomenclature'],
          'Grade 10': ['Ionic vs. Covalent Chemical Bonds', 'The Mole Concept and Molar Mass', 'Balancing Chemical Equations & Stoichiometry'],
          'Grade 11': ['Gas Laws (Ideal Gas Equation PV=nRT)', 'Acids, Bases, and pH Calculations', 'Reaction Rates and Chemical Equilibrium'],
          'Grade 12': ['Thermodynamics (Enthalpy, Entropy, Gibbs Energy)', 'Electrochemistry and Oxidation-Reduction', 'Organic Functional Groups'],
        },
      },
      {
        id: 'Biology',
        name: 'Biology (SAT/Pre-College)',
        category: 'STEM',
        icon: 'Dna',
        color: 'teal',
        applicableLevels: ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'],
        popularTopics: {
          'Grade 9': ['Cell Organelles and Plasma Membrane', 'Photosynthesis and Cellular Respiration Basics', 'Ecology and Food Webs'],
          'Grade 10': ['DNA Replication, Transcription, and Translation', 'Mitosis and Meiosis', 'Mendelian Genetics and Punnett Squares'],
          'Grade 11': ['Population Genetics and Natural Selection', 'Human Body Systems & Homeostasis', 'Enzymatic Activity and Cellular Transport'],
          'Grade 12': ['Biotechnology (PCR, Gel Electrophoresis)', 'Ecosystem Dynamics and Nutrient Cycles', 'Phylogeny and Evolutionary Trees'],
        },
      },
    ];
  }

  if (standard === 'JAMB') {
    return [
      {
        id: 'Use of English',
        name: 'Use of English (Compulsory)',
        category: 'General',
        icon: 'BookOpen',
        color: 'rose',
        applicableLevels: ['UTME Foundation', 'UTME Candidate', 'Post-UTME Drill'],
        popularTopics: {
          'UTME Foundation': ['Comprehension Passages & Summary', 'Lexis and Structure', 'Synonyms and Antonyms'],
          'UTME Candidate': ['Sentence Interpretation', 'Idiomatic Expressions', 'Oral English (Vowels, Consonants, Rhymes, Stress)'],
          'Post-UTME Drill': ['Advanced Concord and Modifiers', 'Register and Collocations', 'Rapid-Fire JAMB English Drills'],
        },
      },
      {
        id: 'Mathematics',
        name: 'Mathematics',
        category: 'STEM',
        icon: 'Calculator',
        color: 'emerald',
        applicableLevels: ['UTME Foundation', 'UTME Candidate', 'Post-UTME Drill'],
        popularTopics: {
          'UTME Foundation': ['Number Bases & Logarithms', 'Sets and Binary Operations', 'Quadratic Equations'],
          'UTME Candidate': ['Matrices & Determinants', 'Calculus (Differentiation & Integration)', 'Coordinate Geometry & Straight Lines', 'Trigonometry & Bearings'],
          'Post-UTME Drill': ['Permutations and Combinations', 'Probability Theory', 'Circles and Conic Sections'],
        },
      },
      {
        id: 'Physics',
        name: 'Physics',
        category: 'STEM',
        icon: 'Zap',
        color: 'amber',
        applicableLevels: ['UTME Foundation', 'UTME Candidate', 'Post-UTME Drill'],
        popularTopics: {
          'UTME Foundation': ['Scalars and Vectors', 'Motion, Work, Energy and Power', 'Machines and Mechanical Advantage'],
          'UTME Candidate': ['Heat Energy and Thermal Expansion', 'Waves and Sound', 'Light (Reflection & Refraction)', 'Electric Current and Resistance'],
          'Post-UTME Drill': ['Electromagnetic Induction', 'A.C. Circuits', 'Modern Physics and Radioactivity'],
        },
      },
      {
        id: 'Chemistry',
        name: 'Chemistry',
        category: 'STEM',
        icon: 'Atom',
        color: 'purple',
        applicableLevels: ['UTME Foundation', 'UTME Candidate', 'Post-UTME Drill'],
        popularTopics: {
          'UTME Foundation': ['Separation of Mixtures', 'Atomic Structure and Bonding', 'Periodic Table Trends'],
          'UTME Candidate': ['Gas Laws and Mole Concept', 'Acids, Bases, and Salts', 'Redox Reactions and Electrolysis', 'Hydrocarbons and Alkanols'],
          'Post-UTME Drill': ['Chemical Equilibrium and Rates', 'Thermochemistry', 'Metals and their Compounds'],
        },
      },
      {
        id: 'Biology',
        name: 'Biology',
        category: 'STEM',
        icon: 'Dna',
        color: 'teal',
        applicableLevels: ['UTME Foundation', 'UTME Candidate', 'Post-UTME Drill'],
        popularTopics: {
          'UTME Foundation': ['Cell Structure and Functions', 'Classification of Living Organisms', 'Plant and Animal Nutrition'],
          'UTME Candidate': ['Transport and Excretory Systems', 'Genetics and Heredity', 'Ecology and Habitats', 'Reproduction in Plants and Animals'],
          'Post-UTME Drill': ['Evolution and Adaptation', 'Variation and Blood Groups', 'Microorganisms and Disease'],
        },
      },
      {
        id: 'Economics',
        name: 'Economics',
        category: 'Commercial',
        icon: 'TrendingUp',
        color: 'blue',
        applicableLevels: ['UTME Foundation', 'UTME Candidate', 'Post-UTME Drill'],
        popularTopics: {
          'UTME Foundation': ['Basic Economic Concepts (Scarcity, Choice)', 'Theory of Demand and Supply', 'Elasticity of Demand and Supply'],
          'UTME Candidate': ['Production and Cost Theory', 'Market Structures (Perfect Competition, Monopoly)', 'Money and Banking', 'National Income Accounting'],
          'Post-UTME Drill': ['Public Finance and Taxation', 'International Trade & Balance of Payments', 'Economic Development in Nigeria'],
        },
      },
    ];
  }

  if (standard === 'IGCSE') {
    return [
      {
        id: 'Cambridge Mathematics (0580)',
        name: 'Cambridge Mathematics',
        category: 'STEM',
        icon: 'Calculator',
        color: 'emerald',
        applicableLevels: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'],
        popularTopics: {
          'Year 7': ['Fractions, Decimals, Percentages', 'Sequences and Expressions', 'Area and Perimeter'],
          'Year 8': ['Linear Equations and Inequalities', 'Ratios and Scale Drawings', 'Pythagoras Theorem'],
          'Year 9': ['Simultaneous Equations', 'Standard Form and Indices', 'Coordinate Geometry'],
          'Year 10': ['Algebraic Fractions', 'Trigonometry (Sine, Cosine rules)', 'Quadratic Formula and Factorization', 'Probability Trees'],
          'Year 11': ['Functions and Composite Functions', 'Vectors and Transformations', 'Calculus Basics', 'Histograms and Cumulative Frequency'],
        },
      },
      {
        id: 'English as a Second/First Language',
        name: 'Cambridge English',
        category: 'General',
        icon: 'BookOpen',
        color: 'rose',
        applicableLevels: ['Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11'],
        popularTopics: {
          'Year 7': ['Reading for Gist and Detail', 'Punctuation and Paragraphing', 'Descriptive Writing'],
          'Year 8': ['Summary Writing Basics', 'Persuasive Writing Techniques', 'Tenses and Complex Sentences'],
          'Year 9': ['Analytical Reading', 'Formal Letter and Email Formats', 'Vocabulary in Context'],
          'Year 10': ['Directed Writing and Argumentation', 'Writer’s Effects and Imagery', 'Extended Reading Comprehension'],
          'Year 11': ['Paper 1 Reading Analysis', 'Paper 2 Writing Tasks (Interview, Report, Article)', 'Summary Techniques'],
        },
      },
      {
        id: 'Physics (0625)',
        name: 'Cambridge Physics',
        category: 'STEM',
        icon: 'Zap',
        color: 'amber',
        applicableLevels: ['Year 9', 'Year 10', 'Year 11'],
        popularTopics: {
          'Year 9': ['Measurement of Length, Volume and Time', 'Speed, Velocity and Acceleration', 'Mass and Weight'],
          'Year 10': ['Forces and Pressure', 'Thermal Physics and Specific Heat Capacity', 'Wave Properties and Light Optics'],
          'Year 11': ['Electricity and Magnetism', 'Logic Gates & Electrical Safety', 'Nuclear Physics and Half-Life'],
        },
      },
      {
        id: 'Chemistry (0620)',
        name: 'Cambridge Chemistry',
        category: 'STEM',
        icon: 'Atom',
        color: 'purple',
        applicableLevels: ['Year 9', 'Year 10', 'Year 11'],
        popularTopics: {
          'Year 9': ['States of Matter and Kinetic Particle Theory', 'Atoms, Elements and Compounds', 'Experimental Techniques'],
          'Year 10': ['Stoichiometry and Mole Concept', 'Acids, Bases, and Salts', 'Periodic Trends and Group Properties'],
          'Year 11': ['Reversible Reactions and Equilibrium', 'Organic Chemistry (Alkanes, Alkenes, Polymers)', 'Electrolysis and Energy Changes'],
        },
      },
      {
        id: 'Biology (0610)',
        name: 'Cambridge Biology',
        category: 'STEM',
        icon: 'Dna',
        color: 'teal',
        applicableLevels: ['Year 9', 'Year 10', 'Year 11'],
        popularTopics: {
          'Year 9': ['Characteristics and Classification of Living Organisms', 'Cell Structure and Organization', 'Movement In and Out of Cells'],
          'Year 10': ['Biological Molecules and Enzymes', 'Plant Nutrition and Transport in Plants', 'Human Gas Exchange and Respiration'],
          'Year 11': ['Coordination and Response', 'Reproduction and Inheritance', 'Biotechnology and Genetic Engineering'],
        },
      },
    ];
  }

  // WAEC & NECO Default
  return [
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
}

export function getDefaultClassLevel(standard: CurriculumStandard): string {
  const levels = getClassLevelsForStandard(standard);
  return levels[0]?.id || 'JSS1';
}

export function getDefaultSubject(standard: CurriculumStandard): string {
  const subjects = getSubjectsForStandard(standard);
  return subjects[0]?.id || 'Mathematics';
}

// 3. Fallback bank for low-connectivity or instant preview
export const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  // SAT Fallbacks
  'SAT-Grade 11-SAT Math': [
    {
      id: 1,
      question: 'In the xy-plane, line k passes through the point (4, 11) and has a slope of -2. What is the y-intercept of line k?',
      options: ['A) (0, 3)', 'B) (0, 15)', 'C) (0, 19)', 'D) (0, 22)'],
      correct_answer: 'C) (0, 19)',
      explanation: 'Using point-slope form y - y1 = m(x - x1): y - 11 = -2(x - 4) => y = -2x + 8 + 11 = -2x + 19. Setting x = 0 gives y = 19, so the y-intercept is (0, 19).',
    },
    {
      id: 2,
      question: 'If 3x + 2y = 23 and 2x - y = 6, what is the value of x + y?',
      options: ['A) 7', 'B) 9', 'C) 11', 'D) 13'],
      correct_answer: 'B) 9',
      explanation: 'Multiply the second equation by 2: 4x - 2y = 12. Add this to 3x + 2y = 23: 7x = 35 => x = 5. Substituting into 2(5) - y = 6 gives y = 4. Therefore, x + y = 5 + 4 = 9.',
    },
    {
      id: 3,
      question: 'The function f(t) = 850(1.06)^t models the value of an investment fund in dollars t years after opening. Which statement best interprets 1.06 in this context?',
      options: [
        'A) The fund value increases by 6% each year',
        'B) The initial balance was $1.06',
        'C) The fund increases by $106 every year',
        'D) The fund value doubles every 6 years'
      ],
      correct_answer: 'A) The fund value increases by 6% each year',
      explanation: 'In the exponential growth model f(t) = P(1 + r)^t, the factor 1.06 represents 1 + 0.06, indicating an annual percentage growth rate of 6%.',
    },
  ],
  'SAT-Grade 11-Reading and Writing': [
    {
      id: 1,
      question: 'Botanist Jane Alvarez observed that alpine wildflowers growing in rocky soil produce deeper root systems than those growing in nutrient-rich valley loam. Alvarez hypothesized that the deeper roots _______ the flowers to access moisture reserves during prolonged seasonal droughts.',
      options: ['A) enables', 'B) enable', 'C) has enabled', 'D) is enabling'],
      correct_answer: 'B) enable',
      explanation: 'The subject of the subordinate clause is the plural noun phrase "the deeper roots," which agrees with the plural verb "enable."',
    },
    {
      id: 2,
      question: 'While researching a topic, a student took the following notes:\n• The Chaco Canyon civilization in New Mexico flourished from 900 to 1150 CE.\n• Pueblo Bonito was the largest Great House in the canyon, containing over 600 masonry rooms.\n• Archaeologists have uncovered thousands of turquoise artifacts at the site.\nWhich choice most effectively uses relevant information from the notes to emphasize the monumental scale of Pueblo Bonito?',
      options: [
        'A) Located in New Mexico, the Chaco Canyon civilization flourished from 900 to 1150 CE.',
        'B) Containing more than 600 masonry rooms, Pueblo Bonito stood as the largest Great House in Chaco Canyon.',
        'C) Archaeologists studying Chaco Canyon have found thousands of turquoise artifacts.',
        'D) Pueblo Bonito was built by a civilization that flourished during the medieval era.'
      ],
      correct_answer: 'B) Containing more than 600 masonry rooms, Pueblo Bonito stood as the largest Great House in Chaco Canyon.',
      explanation: 'Option B directly emphasizes the monumental architectural scale by highlighting the "more than 600 masonry rooms" and status as the largest structure.',
    },
  ],

  // WAEC Fallbacks
  'WAEC-SS1-Mathematics': [
    {
      id: 1,
      question: 'Evaluate log₁₀ 25 + log₁₀ 4 without using mathematical tables.',
      options: ['A) 1', 'B) 2', 'C) 10', 'D) 100'],
      correct_answer: 'B) 2',
      explanation: 'Applying the logarithmic product rule: log₁₀ 25 + log₁₀ 4 = log₁₀(25 × 4) = log₁₀ 100 = log₁₀(10²) = 2.',
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
      question: 'Find the quadratic equation whose roots are -3 and 5.',
      options: ['A) x² - 2x - 15 = 0', 'B) x² + 2x - 15 = 0', 'C) x² - 8x + 15 = 0', 'D) x² + 8x - 15 = 0'],
      correct_answer: 'A) x² - 2x - 15 = 0',
      explanation: 'Standard form is x² - (sum of roots)x + (product of roots) = 0. Sum = -3 + 5 = 2. Product = (-3)(5) = -15. Therefore, x² - 2x - 15 = 0.',
    },
  ],
  'WAEC-JSS1-Mathematics': [
    {
      id: 1,
      question: 'Express 45 as a product of its prime factors.',
      options: ['A) 3 × 15', 'B) 3² × 5', 'C) 5 × 9', 'D) 2 × 3 × 7'],
      correct_answer: 'B) 3² × 5',
      explanation: 'Dividing 45 by 3 gives 15; dividing 15 by 3 gives 5. Hence, 45 = 3 × 3 × 5 = 3² × 5.',
    },
    {
      id: 2,
      question: 'Chinedu bought 4 exercise books at ₦150 each from a stationery shop in Enugu. How much change will he receive if he pays with a ₦1,000 note?',
      options: ['A) ₦400', 'B) ₦600', 'C) ₦350', 'D) ₦450'],
      correct_answer: 'A) ₦400',
      explanation: 'The 4 books cost 4 × ₦150 = ₦600. The change from ₦1,000 is ₦1,000 - ₦600 = ₦400.',
    },
  ],
};
