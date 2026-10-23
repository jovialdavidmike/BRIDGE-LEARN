/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { QuizCard } from './components/QuizCard';
import { ResultScreen } from './components/ResultScreen';
import { TutorRemediationModal } from './components/TutorRemediationModal';
import { SupabaseModal } from './components/SupabaseModal';
import { HackathonGuideModal } from './components/HackathonGuideModal';
import { ClassLevel, SubjectName, Question, UserAnswerRecord, QuizResultHistory, CurriculumStandard } from './types';
import { FALLBACK_QUESTIONS } from './data/curriculumData';
import { saveQuizResult, fetchQuizHistory } from './lib/supabase';

export default function App() {
  // App views: dashboard | quiz | result
  const [view, setView] = useState<'dashboard' | 'quiz' | 'result'>('dashboard');

  // Curriculum & Exam Standard Selection State
  const [selectedStandard, setSelectedStandard] = useState<CurriculumStandard>('WAEC');
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel>('JSS1');
  const [selectedSubject, setSelectedSubject] = useState<SubjectName>('Mathematics');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(3);

  // Active Quiz State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswerRecord[]>([]);

  // Remediation Modal State (Mode B)
  const [isRemediationOpen, setIsRemediationOpen] = useState<boolean>(false);
  const [remediationQuestion, setRemediationQuestion] = useState<Question | null>(null);
  const [remediationStudentAnswer, setRemediationStudentAnswer] = useState<string | null>(null);

  // Modals
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);

  // Persistence / History State
  const [quizHistory, setQuizHistory] = useState<QuizResultHistory[]>([]);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await fetchQuizHistory();
      setQuizHistory(history);
    } catch (e) {
      console.warn('History load notice:', e);
    }
  };

  // Helper to extract option letter (e.g. "B" from "B) 36")
  const getOptionLetter = (str: string) => {
    const match = str.trim().match(/^([A-D])\)?/i);
    return match ? match[1].toUpperCase() : '';
  };

  // Start Quiz (Mode A API call)
  const handleStartQuiz = async () => {
    setIsLoading(true);
    setUserAnswers([]);
    setCurrentQuestionIndex(0);

    try {
      const response = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculum_standard: selectedStandard,
          class_level: selectedLevel,
          subject: selectedSubject,
          topic: selectedTopic || undefined,
          count: questionCount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        setView('quiz');
      } else {
        throw new Error('Invalid questions received');
      }
    } catch (err) {
      console.warn('Backend fetch failed, utilizing verified curriculum fallback bank:', err);
      const fallbackKey = `${selectedStandard}-${selectedLevel}-${selectedSubject}`;
      const fallback =
        FALLBACK_QUESTIONS[fallbackKey] ||
        (selectedStandard === 'SAT'
          ? FALLBACK_QUESTIONS['SAT-Grade 11-SAT Math']
          : FALLBACK_QUESTIONS['WAEC-SS1-Mathematics'] || Object.values(FALLBACK_QUESTIONS)[0]);
      setQuestions(fallback.slice(0, questionCount));
      setView('quiz');
    } finally {
      setIsLoading(false);
    }
  };

  // User selects an option
  const handleSelectOption = (option: string) => {
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;

    // Check if already answered
    const existing = userAnswers.find((a) => a.questionId === currentQ.id);
    if (existing) return;

    const chosenLetter = getOptionLetter(option);
    const correctLetter = getOptionLetter(currentQ.correct_answer);
    const isCorrect = chosenLetter === correctLetter;

    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      selectedOption: option,
      isCorrect,
    };

    setUserAnswers((prev) => [...prev, record]);
  };

  // Advance question or finish
  const handleNextQuestion = async () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate score and complete
      const finalScore = userAnswers.filter((a) => a.isCorrect).length;
      const percentage = Math.round((finalScore / questions.length) * 100);

      // Persist to Supabase / LocalStorage
      await saveQuizResult({
        curriculum_standard: selectedStandard,
        class_level: selectedLevel,
        subject: selectedSubject,
        topic: selectedTopic || 'Curriculum Practice',
        score: finalScore,
        totalQuestions: questions.length,
        percentage,
      });

      loadHistory();
      setView('result');
    }
  };

  // Open Mode B Remediation Modal
  const handleOpenRemediation = (question: Question, selectedOption: string) => {
    setRemediationQuestion(question);
    setRemediationStudentAnswer(selectedOption);
    setIsRemediationOpen(true);
  };

  // Metrics
  const totalQuizzes = quizHistory.length;
  const avgAccuracy =
    totalQuizzes > 0
      ? Math.round(quizHistory.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
      : 0;

  const currentQ = questions[currentQuestionIndex];
  const currentAnswerRecord = currentQ ? userAnswers.find((a) => a.questionId === currentQ.id) : null;
  const currentSelectedOption = currentAnswerRecord ? currentAnswerRecord.selectedOption : null;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Sticky Header */}
      <Header
        quizCount={totalQuizzes}
        accuracy={avgAccuracy}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
        onOpenGuide={() => setIsGuideModalOpen(true)}
        onResetToHome={() => setView('dashboard')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:px-6">
        {view === 'dashboard' && (
          <Dashboard
            selectedStandard={selectedStandard}
            selectedLevel={selectedLevel}
            selectedSubject={selectedSubject}
            selectedTopic={selectedTopic}
            questionCount={questionCount}
            isLoading={isLoading}
            onSelectStandard={setSelectedStandard}
            onSelectLevel={setSelectedLevel}
            onSelectSubject={setSelectedSubject}
            onSelectTopic={setSelectedTopic}
            onSelectCount={setQuestionCount}
            onStartQuiz={handleStartQuiz}
            quizHistory={quizHistory}
          />
        )}

        {view === 'quiz' && currentQ && (
          <div className="py-2">
            <QuizCard
              question={currentQ}
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              selectedOption={currentSelectedOption}
              onSelectOption={handleSelectOption}
              onNextQuestion={handleNextQuestion}
              onOpenRemediation={handleOpenRemediation}
              curriculumStandard={selectedStandard}
              classLevel={selectedLevel}
              subject={selectedSubject}
            />
          </div>
        )}

        {view === 'result' && (
          <div className="py-2">
            <ResultScreen
              score={userAnswers.filter((a) => a.isCorrect).length}
              totalQuestions={questions.length}
              questions={questions}
              userAnswers={userAnswers}
              curriculumStandard={selectedStandard}
              classLevel={selectedLevel}
              subject={selectedSubject}
              topic={selectedTopic}
              onRetake={() => {
                setUserAnswers([]);
                setCurrentQuestionIndex(0);
                setView('quiz');
              }}
              onNewQuiz={() => setView('dashboard')}
              onOpenRemediation={handleOpenRemediation}
            />
          </div>
        )}
      </main>

      {/* Mode B Remediation Modal */}
      <TutorRemediationModal
        isOpen={isRemediationOpen}
        onClose={() => setIsRemediationOpen(false)}
        question={remediationQuestion}
        studentAnswer={remediationStudentAnswer}
        curriculumStandard={selectedStandard}
        classLevel={selectedLevel}
        subject={selectedSubject}
      />

      {/* Supabase Integration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        onConfigSaved={loadHistory}
      />

      {/* Hackathon Developer Quick-Start Modal */}
      <HackathonGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-4 px-4 text-center text-xs text-slate-500">
        <p>
          BridgeLearn AI Tutor · Bridging Local Foundational Learning (WAEC · NECO · JAMB) with Global Opportunities (IGCSE · SAT)
        </p>
      </footer>
    </div>
  );
}
