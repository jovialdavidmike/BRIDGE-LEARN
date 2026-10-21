# BridgeLearn AI
**Local Foundation to Global Opportunities**

An AI-powered curriculum tutor built for the **Neighborhood Hacks** hackathon. 

## The Problem
In many secondary schools, large class sizes make one-on-one tutoring nearly impossible for students preparing for high-stakes exams. As an educator handling JSS1 to SS3 subjects like Mathematics, Basic Science, and Chemistry, the gap in accessible, localized academic remediation is highly visible. Existing AI tools often confuse students by introducing university-level jargon or ignoring local curriculum standards. Furthermore, students aiming to bridge the gap between local standards (WAEC/NECO) and international opportunities (SAT/IGCSE) often lack affordable specialized tutoring. 

## The Solution
BridgeLearn AI allows students to select their specific curriculum standard and exact class level to generate tailored practice quizzes. When a student struggles, the AI provides a simplified, step-by-step breakdown of the concept alongside a follow-up check question to ensure true understanding.

## Core Features
* **Dynamic Curriculum Selection:** Toggle between WAEC, JAMB, Cambridge IGCSE, and Digital SAT standards.
* **Smart Class Mapping:** Automatically filters class levels (e.g., JSS1-SS3 vs. US Grades) based on the chosen curriculum.
* **AI Remediation Modal:** "Ask Tutor" feature provides encouraging, step-by-step breakdowns whenever a student seeks clarification.
* **Dynamic Scoring:** Scores and performance reports are mapped dynamically to the chosen examination scale (e.g., WAEC A1-F9, SAT 800 scale).

* ## Tech Stack
* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Node.js (Express)
* **Database & Auth:** Supabase (quiz_attempts storage)
* **AI Engine:** Google Gen AI SDK (Gemini)

## Local Setup
1. Clone the repository.
2. Install frontend dependencies: `cd client && npm install`
3. Install backend dependencies: `cd server && npm install`
4. Create a `.env` file in the server directory and add your `GEMINI_API_KEY` and `SUPABASE_URL`/`SUPABASE_KEY`.
5. Run the development servers: `npm run dev` (in both client and server directories).
