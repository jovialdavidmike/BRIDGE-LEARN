import React from 'react';
import { CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Question, ClassLevel, SubjectName, CurriculumStandard } from '../types';

interface QuizCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption: string | null;
  onSelectOption: (option: string) => void;
  onNextQuestion: () => void;
  onOpenRemediation: (question: Question, selectedOption: string) => void;
  curriculumStandard: CurriculumStandard;
  classLevel: ClassLevel;
  subject: SubjectName;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onNextQuestion,
  onOpenRemediation,
  curriculumStandard,
  classLevel,
  subject,
}) => {
  const isAnswered = selectedOption !== null;

  // Extract option letter from e.g. "B) 36" or "B"
  const getOptionLetter = (str: string) => {
    const match = str.trim().match(/^([A-D])\)?/i);
    return match ? match[1].toUpperCase() : '';
  };

  const correctLetter = getOptionLetter(question.correct_answer);
  const selectedLetter = selectedOption ? getOptionLetter(selectedOption) : null;
  const isUserCorrect = selectedLetter === correctLetter;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-md border border-slate-200/90 max-w-3xl mx-auto space-y-6">
      {/* Top Meta & Progress */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-200">
              {curriculumStandard}
            </span>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              {classLevel}
            </span>
            <span className="font-semibold text-slate-700">{subject}</span>
          </div>
          <span className="font-bold text-slate-500">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Text */}
      <div className="pt-1">
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {question.question}
        </h3>
      </div>

      {/* Options List */}
      <div className="space-y-2.5">
        {question.options.map((option, idx) => {
          const optionLetter = getOptionLetter(option);
          const isSelected = selectedOption === option;
          const isOptionCorrect = optionLetter === correctLetter;

          let optionStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

          if (isAnswered) {
            if (isOptionCorrect) {
              optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium ring-2 ring-emerald-500/30';
            } else if (isSelected && !isOptionCorrect) {
              optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-400/30';
            } else {
              optionStyle = 'bg-slate-50/50 border-slate-200/60 text-slate-400 opacity-60';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswered && onSelectOption(option)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${optionStyle} ${
                !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                  isAnswered && isOptionCorrect
                    ? 'bg-emerald-600 text-white'
                    : isAnswered && isSelected && !isOptionCorrect
                    ? 'bg-rose-600 text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                {optionLetter || String.fromCharCode(65 + idx)}
              </div>

              <div className="flex-1 text-sm sm:text-base leading-relaxed">
                {/* Strip leading "A) " if duplicated */}
                {option.replace(/^[A-D]\)\s*/i, '')}
              </div>

              {isAnswered && isOptionCorrect && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              )}
              {isAnswered && isSelected && !isOptionCorrect && (
                <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Answer Feedback & Explanation Drawer */}
      {isAnswered && (
        <div
          className={`p-4 sm:p-5 rounded-xl border space-y-3 transition-all ${
            isUserCorrect
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/90 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
            {isUserCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-800">Correct! Well done, sharp mind! 🎯</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-600" />
                <span className="text-rose-800">
                  Not quite! The correct answer is{' '}
                  <span className="underline font-extrabold">{question.correct_answer}</span>
                </span>
              </>
            )}
          </div>

          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white/70 p-3 rounded-lg border border-slate-200/60">
            <span className="font-bold text-slate-900 block mb-1">Curriculum Explanation:</span>
            {question.explanation}
          </div>

          {/* Remediation Mode Prompt Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={() => onOpenRemediation(question, selectedOption)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg bg-white border border-amber-400 text-amber-900 hover:bg-amber-100/60 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Ask Naija Tutor to explain this concept step-by-step</span>
            </button>

            <button
              onClick={onNextQuestion}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <span>{currentIndex + 1 < totalQuestions ? 'Next Question' : 'Finish & View Score'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
