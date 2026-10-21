import React, { useState } from 'react';
import { X, Terminal, Server, Code, Check, Copy, Sparkles, BookOpen } from 'lucide-react';

interface HackathonGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonGuideModal: React.FC<HackathonGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'server' | 'frontend'>('terminal');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const terminalCommands = `# 1. Create project directories
mkdir naijalearn-tutor && cd naijalearn-tutor
mkdir backend frontend

# 2. Setup Node.js (Express) Backend
cd backend
npm init -y
npm install express cors dotenv @google/genai
# Add your GEMINI_API_KEY into backend/.env:
# echo "GEMINI_API_KEY=your_key_here" > .env
# echo "PORT=5000" >> .env
# node server.js

# 3. Setup React (Vite) Frontend with Tailwind CSS
cd ../frontend
npm create vite@latest . -- --template react
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install lucide-react canvas-confetti @types/canvas-confetti @supabase/supabase-js
npm run dev
`;

  const serverJsSnippet = `// backend/server.js
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
    headers: { 'User-Agent': 'aistudio-build' },
  },
});

// =========================================================================
// [INSERT YOUR SYSTEM PROMPT HERE]
// =========================================================================
const TUTOR_SYSTEM_INSTRUCTION = \`
You are an expert secondary school tutor specializing in the curriculum for JSS1 to SS3 students, with particular alignment to WAEC and NECO standards.
\`;

// Route: Generate practice quiz
app.post('/api/generate-quiz', async (req, res) => {
  try {
    const { class_level = 'JSS1', subject = 'Mathematics', topic, count = 3 } = req.body;

    const userPrompt = \`MODE A: QUESTION GENERATION
Generate \${count} WAEC/NECO standard multiple-choice practice questions for:
- Class Level: \${class_level}
- Subject: \${subject}
\${topic ? \`- Topic: \${topic}\` : ''}

Strictly follow the JSON schema specified in your system instructions.\`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(\`Server listening on port \${PORT}\`));
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg">Hackathon Developer Quick-Start</h2>
            <p className="text-xs text-slate-500">
              Terminal setup commands, server.js, and architecture guide for your 5-day sprint
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 mt-4 gap-2">
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'terminal'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>1. Terminal Commands</span>
          </button>
          <button
            onClick={() => setActiveTab('server')}
            className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'server'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>2. server.js (Node.js)</span>
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`pb-2.5 text-xs font-bold px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'frontend'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>3. Frontend Architecture</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-4">
          {activeTab === 'terminal' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-semibold">
                  Run these bash commands in your terminal to initialize backend & frontend:
                </span>
                <button
                  onClick={() => handleCopy(terminalCommands, 'term')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  {copiedKey === 'term' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'term' ? 'Copied Commands!' : 'Copy Commands'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                {terminalCommands}
              </pre>
            </div>
          )}

          {activeTab === 'server' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600 font-semibold">
                  Express backend route calling Google Gen AI SDK (`gemini-3.8-flash`):
                </span>
                <button
                  onClick={() => handleCopy(serverJsSnippet, 'srv')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  {copiedKey === 'srv' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'srv' ? 'Copied Code!' : 'Copy server.js'}</span>
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto max-h-72 border border-slate-800 leading-relaxed">
                {serverJsSnippet}
              </pre>
            </div>
          )}

          {activeTab === 'frontend' && (
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p>
                The frontend running in this app uses <strong>React 19 + Tailwind CSS</strong>:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                <li>
                  <strong>Grade & Subject Selection:</strong> Dynamic filtering for JSS1-JSS3 (Basic 7-9 / BECE) and SS1-SS3 (WAEC / NECO / UTME).
                </li>
                <li>
                  <strong>Mode A (Quiz Generation):</strong> Fetches 3, 5, or 10 curriculum questions with instantaneous local fallback if offline.
                </li>
                <li>
                  <strong>Mode B (Tutor Remediation):</strong> Interactive step-by-step tutoring modal with warm, encouraging Nigerian teacher voice and check questions.
                </li>
                <li>
                  <strong>Supabase & LocalStorage:</strong> Dual-layer persistence so test attempts are safely stored during your hackathon demo.
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
