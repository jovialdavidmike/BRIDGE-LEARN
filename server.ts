import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System Prompt: Bridging local foundational learning with global opportunities
const TUTOR_SYSTEM_INSTRUCTION = `
You are an expert secondary school tutor specializing in helping students bridge local foundational learning with global opportunities. Your primary function is to generate curriculum-accurate practice questions and provide clear, encouraging explanations tailored exactly to the requested [Curriculum_Standard] (e.g., WAEC, NECO, JAMB, SAT, IGCSE) and [Class_Level].

### CORE BEHAVIOR & RULES:
1. CURRICULUM ALIGNMENT: Adapt vocabulary, difficulty, question style, and depth strictly to the target Curriculum Standard and Class Level requested. For example, SAT questions should reflect SAT reasoning and formatting styles, while WAEC/NECO should strictly reflect the Nigerian curriculum syllabus.
2. LOCALIZATION & CONTEXT: Use appropriate context, units, and spelling based on the standard (e.g., US spelling/units and styling for SAT; UK/Nigerian spelling and local contexts for IGCSE/WAEC).
3. OUTPUT FORMATTING: You must ALWAYS respond in valid JSON. Do not include markdown formatting like \`\`\`json or preambles outside the JSON object.

### MODES OF OPERATION:

MODE A: QUESTION GENERATION
When requested to generate practice questions, respond strictly with this JSON structure:
{
  "mode": "quiz",
  "curriculum_standard": "<Requested Standard>",
  "subject": "<Subject Name>",
  "class_level": "<Target Level>",
  "questions": [
    {
      "id": 1,
      "question": "<Question Text>",
      "options": [
        "A) <Option A>",
        "B) <Option B>",
        "C) <Option C>",
        "D) <Option D>"
      ],
      "correct_answer": "<Option + A A) Option Text, e.g.,>",
      "explanation": "<A 1-2 clear correct explanation is of sentence this why>"
    }
  ]
}

MODE B: TUTOR EXPLANATION / REMEDIATION
When a student answers a question incorrectly or asks for clarification on a topic, respond strictly with this JSON structure:
{
  "mode": "explanation",
  "curriculum_standard": "<Requested Standard>",
  "subject": "<Subject Name>",
  "class_level": "<Target Level>",
  "concept": "<Name concept of the>",
  "explanation": "<A 2-3 Avoid and appropriate breakdown clear, curriculum. encouraging. for grade it jargon, keep level paragraph step-by-step the>",
  "follow_up_question": {
    "question": "<A check if question see simple single student the to understood>",
    "options": [
      "A) <Option A>",
      "B) <Option B>",
      "C) <Option C>",
      "D) <Option D>"
    ],
    "correct_answer": "<Correct Option>"
  }
}
`.trim();

// Curated fallback questions in case API key is missing or network failure occurs during hackathon
const CURATED_FALLBACK_QUIZZES: Record<string, any[]> = {
  'SAT-Grade 11-SAT Math': [
    {
      id: 1,
      question: 'In the xy-plane, line k passes through the point (4, 11) and has a slope of -2. What is the y-intercept of line k?',
      options: ['A) (0, 3)', 'B) (0, 15)', 'C) (0, 19)', 'D) (0, 22)'],
      correct_answer: 'C) (0, 19)',
      explanation: 'Using the point-slope form y - 11 = -2(x - 4), we get y = -2x + 8 + 11 = -2x + 19. Setting x = 0 yields y = 19, so the y-intercept is (0, 19).',
    },
    {
      id: 2,
      question: 'If 3x + 2y = 23 and 2x - y = 6, what is the value of x + y?',
      options: ['A) 7', 'B) 9', 'C) 11', 'D) 13'],
      correct_answer: 'B) 9',
      explanation: 'Multiplying 2x - y = 6 by 2 yields 4x - 2y = 12. Adding this to 3x + 2y = 23 gives 7x = 35 => x = 5. Substituting gives y = 4. Thus x + y = 9.',
    },
    {
      id: 3,
      question: 'The function f(t) = 850(1.06)^t models the value of an investment fund in dollars t years after opening. Which statement best interprets 1.06 in this context?',
      options: [
        'A) The fund value increases by 6% each year',
        'B) The initial balance was $1.06',
        'C) The fund increases by $106 every year',
        'D) The fund value doubles every 6 years',
      ],
      correct_answer: 'A) The fund value increases by 6% each year',
      explanation: 'In the exponential model f(t) = P(1 + r)^t, the factor 1.06 corresponds to 1 + 0.06, which represents an annual percentage increase of 6%.',
    },
  ],
  'SAT-Grade 11-Reading and Writing': [
    {
      id: 1,
      question: 'Botanist Jane Alvarez observed that alpine wildflowers growing in rocky soil produce deeper root systems than those growing in nutrient-rich valley loam. Alvarez hypothesized that the deeper roots _______ the flowers to access moisture reserves during prolonged seasonal droughts.',
      options: ['A) enables', 'B) enable', 'C) has enabled', 'D) is enabling'],
      correct_answer: 'B) enable',
      explanation: 'The subject of the clause is the plural noun phrase "the deeper roots," which agrees with the plural verb form "enable."',
    },
    {
      id: 2,
      question: 'While researching a topic, a student took the following notes:\n• The Chaco Canyon civilization in New Mexico flourished from 900 to 1150 CE.\n• Pueblo Bonito was the largest Great House in the canyon, containing over 600 masonry rooms.\n• Archaeologists have uncovered thousands of turquoise artifacts at the site.\nWhich choice most effectively uses relevant information from the notes to emphasize the monumental scale of Pueblo Bonito?',
      options: [
        'A) Located in New Mexico, the Chaco Canyon civilization flourished from 900 to 1150 CE.',
        'B) Containing more than 600 masonry rooms, Pueblo Bonito stood as the largest Great House in Chaco Canyon.',
        'C) Archaeologists studying Chaco Canyon have found thousands of turquoise artifacts.',
        'D) Pueblo Bonito was built by a civilization that flourished during the medieval era.',
      ],
      correct_answer: 'B) Containing more than 600 masonry rooms, Pueblo Bonito stood as the largest Great House in Chaco Canyon.',
      explanation: 'Choice B directly emphasizes the architectural scale by mentioning the "more than 600 masonry rooms" and its distinction as the largest Great House.',
    },
  ],
  'WAEC-SS1-Mathematics': [
    {
      id: 1,
      question: 'Evaluate log₁₀ 25 + log₁₀ 4 without using mathematical tables.',
      options: ['A) 1', 'B) 2', 'C) 10', 'D) 100'],
      correct_answer: 'B) 2',
      explanation: 'By the product law of logarithms: log₁₀ 25 + log₁₀ 4 = log₁₀(25 × 4) = log₁₀ 100 = log₁₀(10²) = 2.',
    },
    {
      id: 2,
      question: 'A trader in Balogun market bought a bag of rice for ₦30,000 and sold it for ₦36,000. Calculate the percentage profit.',
      options: ['A) 15%', 'B) 16.7%', 'C) 20%', 'D) 25%'],
      correct_answer: 'C) 20%',
      explanation: 'Profit = ₦36,000 - ₦30,000 = ₦6,000. Percentage profit = (6,000 / 30,000) × 100% = 20%.',
    },
  ],
  'WAEC-JSS1-Mathematics': [
    {
      id: 1,
      question: 'Find the Least Common Multiple (L.C.M.) of 12 and 18.',
      options: ['A) 24', 'B) 36', 'C) 48', 'D) 72'],
      correct_answer: 'B) 36',
      explanation: 'Prime factors: 12 = 2² × 3, 18 = 2 × 3². The LCM takes the highest powers: 2² × 3² = 4 × 9 = 36.',
    },
    {
      id: 2,
      question: 'Chinedu bought 4 exercise books at ₦150 each from a stationery shop in Enugu. How much change will he receive if he pays with a ₦1,000 note?',
      options: ['A) ₦400', 'B) ₦600', 'C) ₦350', 'D) ₦450'],
      correct_answer: 'A) ₦400',
      explanation: 'The 4 exercise books cost 4 × ₦150 = ₦600. Subtracting ₦600 from ₦1,000 leaves ₦400 change.',
    },
  ],
};

function cleanJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

// Route 1: Generate Multiple Choice Questions (Mode A)
app.post('/api/quiz/generate', async (req, res) => {
  const {
    curriculum_standard = 'WAEC',
    class_level = 'JSS1',
    subject = 'Mathematics',
    topic,
    count = 3,
  } = req.body;

  const prompt = `MODE A: QUESTION GENERATION
Please generate ${count} authentic practice questions strictly adhering to:
- Curriculum Standard: ${curriculum_standard}
- Class Level: ${class_level}
- Subject: ${subject}
${topic ? `- Topic Focus: ${topic}` : '- Core Syllabus Topics'}

CURRICULUM & SUBJECT REQUIREMENTS:
1. IF CURRICULUM STANDARD IS "SAT":
   - Class Level uses US High School Grade format: ${class_level} (Grade 9, 10, 11, or 12).
   - Question Style: Strict Digital SAT format (College Board style).
   - Subject Questions:
     * If subject is "SAT Math": Feature authentic SAT domains (Heart of Algebra, Passport to Advanced Math, Problem Solving & Data Analysis, Geometry & Trig). Clear math notation, variable relationships, constants, or coordinate graphs.
     * If subject is "Reading and Writing": Present a short 2-4 sentence stimulus text or student research notes, followed by an official SAT question stem (e.g., words in context, conventions of Standard English, logical transitions, or rhetorical synthesis).
     * If subject is Physics, Chemistry, or Biology: Pre-college / AP / SAT subject difficulty calibrated to ${class_level}.
   - Context: US English spelling, standard units, realistic scenarios.

2. IF CURRICULUM STANDARD IS "WAEC" OR "NECO":
   - Class Level uses Nigerian Secondary format: ${class_level} (JSS1, JSS2, JSS3 for Junior; SS1, SS2, SS3 for Senior).
   - Question Style: Official West African Examinations Council (WAEC/WASSCE) or NECO syllabus questions.
   - Context: Nigerian contexts, currency in Naira (₦), local names (Amina, Chinedu, Musa, Emeka), local commerce/produce.

3. IF CURRICULUM STANDARD IS "JAMB":
   - CBT speed-focused university entrance format with 4 options.

4. IF CURRICULUM STANDARD IS "IGCSE":
   - Cambridge International Secondary (Years 7 - 11) with metric units and command words.

Requirements:
- Ensure 4 options labeled A), B), C), D).
- Specify correct_answer in format "A) [Text]".
- Provide a clear 1-2 sentence explanation tailored to the examination level.
- Return strictly the JSON structure specified in your system instructions.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Falling back to curated questions.');
      const fallbackKey = `${curriculum_standard}-${class_level}-${subject}`;
      const questions =
        CURATED_FALLBACK_QUIZZES[fallbackKey] ||
        (curriculum_standard === 'SAT'
          ? CURATED_FALLBACK_QUIZZES['SAT-Grade 11-SAT Math']
          : CURATED_FALLBACK_QUIZZES['WAEC-SS1-Mathematics'] || CURATED_FALLBACK_QUIZZES['WAEC-JSS1-Mathematics']);
      return res.json({
        mode: 'quiz',
        curriculum_standard,
        subject,
        class_level,
        topic: topic || 'Foundational Concepts',
        is_mock_fallback: true,
        questions: questions.slice(0, count),
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const textOutput = response.text || '{}';
    const cleanedJson = cleanJsonString(textOutput);
    const parsedData = JSON.parse(cleanedJson);

    // Validate that questions exist
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error('Model did not return a valid questions array');
    }

    return res.json({
      ...parsedData,
      curriculum_standard: parsedData.curriculum_standard || curriculum_standard,
      subject: parsedData.subject || subject,
      class_level: parsedData.class_level || class_level,
      is_mock_fallback: false,
    });
  } catch (error: any) {
    console.error('Error generating quiz:', error);
    const fallbackKey = `${curriculum_standard}-${class_level}-${subject}`;
    const fallbackList =
      CURATED_FALLBACK_QUIZZES[fallbackKey] ||
      (curriculum_standard === 'SAT'
        ? CURATED_FALLBACK_QUIZZES['SAT-Grade 11-SAT Math']
        : CURATED_FALLBACK_QUIZZES['WAEC-SS1-Mathematics'] || CURATED_FALLBACK_QUIZZES['WAEC-JSS1-Mathematics']);

    return res.status(200).json({
      mode: 'quiz',
      curriculum_standard,
      subject,
      class_level,
      topic: topic || 'Core Curriculum',
      is_mock_fallback: true,
      fallback_reason: error.message || 'API request limit or transient network error',
      questions: fallbackList.slice(0, count),
    });
  }
});

// Route 2: Tutor Explanation / Remediation (Mode B)
app.post('/api/tutor/explain', async (req, res) => {
  const {
    curriculum_standard = 'WAEC',
    class_level = 'JSS1',
    subject = 'Mathematics',
    concept = 'Topic Review',
    question = '',
    student_answer = '',
    correct_answer = '',
  } = req.body;

  const prompt = `MODE B: TUTOR EXPLANATION / REMEDIATION
A student in ${class_level} studying ${subject} under the ${curriculum_standard} curriculum attempted the following question and needs personalized remediation.

Curriculum Standard: ${curriculum_standard}
Class Level: ${class_level}
Subject: ${subject}
Concept to Clarify: ${concept}
Question: ${question}
Student's Chosen Answer: ${student_answer || 'Incorrect answer'}
Correct Answer: ${correct_answer}

Please provide an encouraging step-by-step breakdown (2-3 short paragraphs, no heavy jargon, warm tutor tone appropriate for ${curriculum_standard}) and one simple follow-up question to test their understanding.
Return strictly the JSON object as instructed.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        mode: 'explanation',
        subject,
        class_level,
        concept,
        explanation: `Well done for attempting this question! In ${subject} for ${class_level}, understanding ${concept} is key. Remember the fundamental rule: when solving this step-by-step, always isolate your terms carefully and double-check your arithmetic. With continuous practice, questions like this in your WAEC/NECO exams will become easy marks!`,
        follow_up_question: {
          question: `Quick check: Which of the following is essential when applying ${concept}?`,
          options: [
            'A) Applying inverse operations to both sides',
            'B) Guessing the final value without working',
            'C) Disregarding the signs of terms',
            'D) Changing the question parameters',
          ],
          correct_answer: 'A) Applying inverse operations to both sides',
        },
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const textOutput = response.text || '{}';
    const cleaned = cleanJsonString(textOutput);
    const parsed = JSON.parse(cleaned);

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating explanation:', error);
    return res.status(200).json({
      mode: 'explanation',
      subject,
      class_level,
      concept,
      explanation: `Good effort! Don't worry at all about missing this question — mistakes are how we learn best. To master ${concept}, break the problem into two parts: first identify what is given, then apply the standard rule. Remember that practice makes perfect for your examinations!`,
      follow_up_question: {
        question: `Which fundamental step should you take first when tackling a ${subject} question?`,
        options: [
          'A) Write down the given information and formulas',
          'B) Pick any random choice from the options',
          'C) Skip the question immediately',
          'D) Change the units without converting',
        ],
        correct_answer: 'A) Write down the given information and formulas',
      },
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Mount Vite or static file serving
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NaijaLearn AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
