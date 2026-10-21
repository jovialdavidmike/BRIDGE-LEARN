import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, ArrowRight, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { Question, ClassLevel, SubjectName, UserAnswerRecord, CurriculumStandard } from '../types';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  questions: Question[];
  userAnswers: UserAnswerRecord[];
  curriculumStandard: CurriculumStandard;
  classLevel: ClassLevel;
  subject: SubjectName;
  topic?: string;
  onRetake: () => void;
  onNewQuiz: () => void;
  onOpenRemediation: (question: Question, selectedOption: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  score,
  totalQuestions,
  questions,
  userAnswers,
  curriculumStandard,
  classLevel,
  subject,
  topic,
  onRetake,
  onNewQuiz,
  onOpenRemediation,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [percentage]);

  // Exam-Specific Grade System
  const getExamGrade = (pct: number, standard: CurriculumStandard) => {
    if (standard === 'SAT') {
      const satScore = Math.round(200 + (pct / 100) * 600);
      if (pct >= 85) return { grade: `${satScore}/800`, label: 'Ivy / Competitive', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
      if (pct >= 70) return { grade: `${satScore}/800`, label: 'Strong Target', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-300' };
      if (pct >= 50) return { grade: `${satScore}/800`, label: 'National Average', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' };
      return { grade: `${satScore}/800`, label: 'Needs Practice', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300' };
    }

    if (standard === 'JAMB') {
      const jambScore = Math.round((pct / 100) * 400);
      if (pct >= 75) return { grade: `${jambScore}/400`, label: 'High Merit (Medicine/Eng)', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
      if (pct >= 60) return { grade: `${jambScore}/400`, label: 'Good Competitive Mark', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-300' };
      if (pct >= 50) return { grade: `${jambScore}/400`, label: 'Admission Eligible', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' };
      return { grade: `${jambScore}/400`, label: 'Below Cut-off', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300' };
    }

    if (standard === 'IGCSE') {
      if (pct >= 85) return { grade: 'Grade 9 (A*)', label: 'Exceptional Mastery', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
      if (pct >= 75) return { grade: 'Grade 8 (A)', label: 'Excellent Standard', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
      if (pct >= 65) return { grade: 'Grade 6 (B)', label: 'Strong Pass', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-300' };
      if (pct >= 50) return { grade: 'Grade 4 (C)', label: 'Standard Pass', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' };
      return { grade: 'Grade U', label: 'Ungraded / Review', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300' };
    }

    // WAEC / NECO Default
    if (pct >= 75) return { grade: 'A1', label: 'Distinction (Excellent)', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
    if (pct >= 70) return { grade: 'B2', label: 'Very Good', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-300' };
    if (pct >= 65) return { grade: 'B3', label: 'Good', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-300' };
    if (pct >= 60) return { grade: 'C4', label: 'Credit', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' };
    if (pct >= 55) return { grade: 'C5', label: 'Credit', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-300' };
    if (pct >= 50) return { grade: 'C6', label: 'Credit', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-300' };
    if (pct >= 45) return { grade: 'D7', label: 'Pass', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-300' };
    if (pct >= 40) return { grade: 'E8', label: 'Pass', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-300' };
    return { grade: 'F9', label: 'Fail / Needs Remediation', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-300' };
  };

  const examGrade = getExamGrade(percentage, curriculumStandard);

  const getTutorMessage = (pct: number) => {
    if (pct >= 80) return `Outstanding performance! You are showing exceptional mastery aligned with ${curriculumStandard} standards. Keep this momentum high!`;
    if (pct >= 60) return `Solid effort! You demonstrated strong foundational knowledge for ${curriculumStandard}. Review the questions below to push higher!`;
    return `Well done for putting in the effort. Remember, every scholar improves with practice. Check the explanations below and let our AI tutor break down the concepts!`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Score Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-200 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-3">
          <span className="font-bold text-amber-800 bg-amber-200/60 px-1.5 py-0.5 rounded text-[11px]">{curriculumStandard}</span>
          <span>{classLevel}</span> · <span>{subject}</span> {topic && `· ${topic}`}
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Practice Quiz Complete!
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto mb-6">
          {getTutorMessage(percentage)}
        </p>

        {/* Score and WAEC Grade Display */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
              Your Score
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {score}<span className="text-slate-400 text-xl font-normal">/{totalQuestions}</span>
            </div>
            <span className="text-xs text-slate-600 font-semibold">{percentage}% Accuracy</span>
          </div>

          <div className={`p-4 rounded-xl border ${examGrade.bg}`}>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
              {curriculumStandard} Performance
            </span>
            <div className={`text-3xl sm:text-4xl font-extrabold ${examGrade.color}`}>
              {examGrade.grade}
            </div>
            <span className={`text-xs font-semibold ${examGrade.color}`}>{examGrade.label}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake This Quiz</span>
          </button>
          <button
            onClick={onNewQuiz}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <span>Practice Another Topic</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg">Review All Questions</h3>
          <span className="text-xs text-slate-500">{questions.length} Questions</span>
        </div>

        <div className="space-y-4 divide-y divide-slate-100">
          {questions.map((q, idx) => {
            const userPick = userAnswers.find((a) => a.questionId === q.id);
            const isCorrect = userPick?.isCorrect ?? false;

            return (
              <div key={q.id} className="pt-4 first:pt-0 space-y-2.5 text-xs sm:text-sm">
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 leading-snug">{q.question}</p>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs">Your Answer:</span>
                        <span
                          className={`font-semibold flex items-center gap-1 ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {userPick?.selectedOption || 'None'}
                          {isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                        </span>
                      </div>

                      {!isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs">Correct Answer:</span>
                          <span className="font-bold text-emerald-700">{q.correct_answer}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-700 text-xs leading-relaxed">
                      <span className="font-semibold text-slate-800 block mb-0.5">Tutor Explanation:</span>
                      {q.explanation}
                    </div>

                    {!isCorrect && (
                      <div className="mt-2">
                        <button
                          onClick={() => onOpenRemediation(q, userPick?.selectedOption || '')}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/70 border border-amber-300 px-2.5 py-1 rounded-md transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>Get Step-by-Step Remediation for this Question</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
