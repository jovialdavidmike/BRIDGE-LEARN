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
  'JSS1-Mathematics': [
    {
      id: 1,
      question: 'Find the Least Common Multiple (L.C.M.) of 12 and 18.',
      options: ['A) 24', 'B) 36', 'C) 48', 'D) 72'],
      correct_answer: 'B) 36',
      explanation: 'Prime factors: 12 = 2² × 3, 18 = 2 × 3². The LCM takes the highest powers: 2² × 3² = 4 × 9 = 36.',
    },
    {
      id: 2,
      question: 'A bag of gari in Mile 12 market costs ₦18,000. If Musa gets a 15% discount for paying cash, how much does he pay?',
      options: ['A) ₦15,300', 'B) ₦16,200', 'C) ₦15,000', 'D) ₦17,100'],
      correct_answer: 'A) ₦15,300',
      explanation: 'Discount = 15% of ₦18,000 = 0.15 × 18,000 = ₦2,700. Amount paid = ₦18,000 - ₦2,700 = ₦15,300.',
    },
    {
      id: 3,
      question: 'Simplify the algebraic expression: 5x + 3y - 2x + 4y',
      options: ['A) 3x + 7y', 'B) 7x + 7y', 'C) 3x - y', 'D) 10xy'],
      correct_answer: 'A) 3x + 7y',
      explanation: 'Group like terms: (5x - 2x) + (3y + 4y) = 3x + 7y.',
    },
  ],
  'SS1-Chemistry': [
    {
      id: 1,
      question: 'What is the electronic configuration of an atom of Magnesium (atomic number 12)?',
      options: ['A) 2, 8, 1', 'B) 2, 8, 2', 'C) 2, 8, 3', 'D) 2, 8, 4'],
      correct_answer: 'B) 2, 8, 2',
      explanation: 'Magnesium has 12 electrons arranged in shells as K=2, L=8, M=2.',
    },
    {
      id: 2,
      question: 'Which of the following processes separates a mixture of kerosene and water?',
      options: ['A) Simple distillation', 'B) Using a separating funnel', 'C) Filtration', 'D) Fractional crystallization'],
      correct_answer: 'B) Using a separating funnel',
      explanation: 'Kerosene and water are immiscible liquids with different densities; a separating funnel is used to tap off the denser liquid.',
    },
    {
      id: 3,
      question: 'Which element is situated in Group 2, Period 3 of the Periodic Table?',
      options: ['A) Sodium', 'B) Magnesium', 'C) Aluminium', 'D) Calcium'],
      correct_answer: 'B) Magnesium',
      explanation: 'Magnesium (Z=12) has 3 electron shells (Period 3) and 2 valence electrons (Group 2).',
    },
  ],
  'JSS1-Basic Science': [
    {
      id: 1,
      question: 'Which of the following organs is responsible for pumping blood throughout the human body?',
      options: ['A) Brain', 'B) Lungs', 'C) Heart', 'D) Liver'],
      correct_answer: 'C) Heart',
      explanation: 'The human heart is a muscular pump that circulates oxygenated and deoxygenated blood through the circulatory system.',
    },
    {
      id: 2,
      question: 'Which of these is an example of renewable energy in Nigeria?',
      options: ['A) Crude oil', 'B) Coal from Enugu', 'C) Solar energy from the sun', 'D) Natural gas'],
      correct_answer: 'C) Solar energy from the sun',
      explanation: 'Solar energy is replenished naturally by sunlight and cannot be depleted, unlike fossil fuels such as coal and crude oil.',
    },
    {
      id: 3,
      question: 'What happens to the molecules of water when liquid water freezes into ice?',
      options: ['A) They move faster', 'B) They lose kinetic energy and become fixed', 'C) They turn into steam', 'D) They expand infinitely'],
      correct_answer: 'B) They lose kinetic energy and become fixed',
      explanation: 'During freezing, cooling removes thermal energy so water molecules slow down and settle into a crystalline lattice structure.',
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
Please generate ${count} multiple-choice practice questions strictly adhering to:
- Curriculum Standard: ${curriculum_standard}
- Class Level: ${class_level}
- Subject: ${subject}
${topic ? `- Topic Focus: ${topic}` : '- Core Curriculum Topics'}

Curriculum Standard Specific Guidance:
- WAEC / NECO: Follow Nigerian senior/junior secondary curriculum (NERDC). Use Nigerian contexts, local currencies (₦), and WAEC examination phrasing.
- JAMB (UTME): Fast-paced CBT style, highly conceptual testing understanding of syllabus prerequisites.
- IGCSE: Cambridge international GCSE syllabus, metric units, international contexts, clear multi-step reasoning.
- SAT: College Board Digital SAT question style, realistic reasoning, US units/contexts where appropriate.

Requirements:
1. Adapt vocabulary and difficulty strictly to ${curriculum_standard} at the ${class_level} grade level.
2. Provide 4 options labeled A), B), C), D).
3. Specify correct_answer in format "A) [Text]".
4. Provide a clear 1-2 sentence explanation of why this is correct.
5. Return strictly the JSON structure specified in your system instructions.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY is not set. Falling back to curated questions.');
      const fallbackKey = `${class_level}-${subject}`;
      const questions = CURATED_FALLBACK_QUIZZES[fallbackKey] || CURATED_FALLBACK_QUIZZES['JSS1-Mathematics'];
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
    const fallbackKey = `${class_level}-${subject}`;
    const fallbackList = CURATED_FALLBACK_QUIZZES[fallbackKey] || CURATED_FALLBACK_QUIZZES['JSS1-Mathematics'];

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
