/**
 * server.js - Standalone Express Backend for Hackathon MVP
 * Tech: Node.js (Express), @google/genai SDK, dotenv, cors
 * 
 * To run:
 * 1. npm install express @google/genai dotenv cors
 * 2. Add GEMINI_API_KEY to your .env file
 * 3. node server.js
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Google Gen AI client with recommended user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// =========================================================================
// [INSERT YOUR SYSTEM PROMPT HERE]
// =========================================================================
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

// Utility to clean possible markdown code fences from AI output
function cleanJsonOutput(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return cleaned.trim();
}

/**
 * Route: POST /api/generate-quiz
 * Body: { curriculum_standard: 'WAEC', class_level: 'JSS1', subject: 'Mathematics', topic: 'Fractions', count: 3 }
 */
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { curriculum_standard = 'WAEC', class_level = 'JSS1', subject = 'Mathematics', topic, count = 3 } = req.body;

    const userPrompt = `MODE A: QUESTION GENERATION
Generate ${count} practice questions for:
- Curriculum Standard: ${curriculum_standard}
- Class Level: ${class_level}
- Subject: ${subject}
${topic ? `- Topic: ${topic}` : ''}

Strictly follow the JSON schema specified in your system instructions.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsedData = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsedData);
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    res.status(500).json({
      error: 'Failed to generate quiz from Gemini SDK',
      details: error.message,
    });
  }
});

/**
 * Route: POST /api/tutor-explain
 * Body: { curriculum_standard, class_level, subject, concept, question, student_answer, correct_answer }
 */
app.post('/api/tutor-explain', async (req, res) => {
  try {
    const { curriculum_standard = 'WAEC', class_level, subject, concept, question, student_answer, correct_answer } = req.body;

    const userPrompt = `MODE B: TUTOR EXPLANATION / REMEDIATION
Curriculum Standard: ${curriculum_standard}
Class Level: ${class_level}
Subject: ${subject}
Concept: ${concept}
Question: ${question}
Student's Answer: ${student_answer}
Correct Answer: ${correct_answer}

Provide step-by-step encouraging remediation and a single follow-up check question in the required JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(cleanJsonOutput(response.text || '{}'));
    res.json(parsedData);
  } catch (error) {
    console.error('Explanation Error:', error);
    res.status(500).json({
      error: 'Failed to generate explanation from Gemini SDK',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Curriculum Tutor Backend listening on port ${PORT}`);
});
