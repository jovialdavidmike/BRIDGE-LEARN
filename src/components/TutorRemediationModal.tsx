import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, XCircle, Loader2, Award } from 'lucide-react';
import { Question, ClassLevel, SubjectName, TutorExplanationPayload, CurriculumStandard } from '../types';

interface TutorRemediationModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question | null;
  studentAnswer: string | null;
  curriculumStandard: CurriculumStandard;
  classLevel: ClassLevel;
  subject: SubjectName;
}

export const TutorRemediationModal: React.FC<TutorRemediationModalProps> = ({
  isOpen,
  onClose,
  question,
  studentAnswer,
  curriculumStandard,
  classLevel,
  subject,
}) => {
  const [loading, setLoading] = useState(false);
  const [explanationData, setExplanationData] = useState<TutorExplanationPayload | null>(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const [followUpChecked, setFollowUpChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && question) {
      fetchRemediation();
    } else {
      setExplanationData(null);
      setSelectedFollowUp(null);
      setFollowUpChecked(false);
      setError(null);
    }
  }, [isOpen, question]);

  const fetchRemediation = async () => {
    if (!question) return;
    setLoading(true);
    setError(null);
    setSelectedFollowUp(null);
    setFollowUpChecked(false);

    try {
      const response = await fetch('/api/tutor/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculum_standard: curriculumStandard,
          class_level: classLevel,
          subject: subject,
          concept: question.question.slice(0, 60),
          question: question.question,
          student_answer: studentAnswer,
          correct_answer: question.correct_answer,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const data: TutorExplanationPayload = await response.json();
      setExplanationData(data);
    } catch (err: any) {
      console.error('Failed to load tutor explanation:', err);
      // Fallback encouraging explanation
      setExplanationData({
        mode: 'explanation',
        curriculum_standard: curriculumStandard,
        subject,
        class_level: classLevel,
        concept: `${subject} Core Principle`,
        explanation: `Do not worry at all — every great Nigerian scholar learns by tackling challenging questions! In ${subject} for ${classLevel}, take your time to read the question statement carefully. Identify the known values and what is required, then follow the standard formula or principle step by step.`,
        follow_up_question: {
          question: `Which approach is most recommended when tackling complex ${subject} problems?`,
          options: [
            'A) Break the problem into small steps and identify key terms',
            'B) Guess without checking the units or logic',
            'C) Rush through without re-reading',
            'D) Memorize answers without understanding steps',
          ],
          correct_answer: 'A) Break the problem into small steps and identify key terms',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !question) return null;

  const isFollowUpCorrect =
    explanationData &&
    selectedFollowUp &&
    selectedFollowUp.trim().charAt(0).toUpperCase() ===
      explanationData.follow_up_question.correct_answer.trim().charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-lg">Naija Tutor Breakdown</h2>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                Mode B
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Personalized WAEC/NECO remedial coaching for {classLevel} · {subject}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">
              Your tutor is analyzing the concept and tailoring a simple explanation...
            </p>
            <p className="text-xs text-slate-400">Aligned with {classLevel} curriculum standards</p>
          </div>
        )}

        {/* Content State */}
        {!loading && explanationData && (
          <div className="py-4 space-y-5 text-sm">
            {/* Concept Tag */}
            <div className="bg-emerald-50 text-emerald-900 px-3 py-2 rounded-xl border border-emerald-200/80 text-xs font-semibold flex items-center justify-between">
              <span>Concept: <strong className="font-extrabold">{explanationData.concept}</strong></span>
              <span className="text-[11px] bg-emerald-200/60 text-emerald-950 px-2 py-0.5 rounded-full">
                {classLevel}
              </span>
            </div>

            {/* Step by Step Breakdown */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Step-by-Step Breakdown:
              </h4>
              <div className="bg-slate-50 p-4 rounded-xl text-slate-700 leading-relaxed text-xs sm:text-sm border border-slate-200/70 whitespace-pre-line">
                {explanationData.explanation}
              </div>
            </div>

            {/* Follow-up Check Question */}
            {explanationData.follow_up_question && (
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>Check Your Understanding:</span>
                </div>

                <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                  {explanationData.follow_up_question.question}
                </p>

                <div className="space-y-2">
                  {explanationData.follow_up_question.options.map((opt, idx) => {
                    const isSelected = selectedFollowUp === opt;
                    const optLetter = opt.trim().charAt(0).toUpperCase();
                    const correctLetter = explanationData.follow_up_question.correct_answer.trim().charAt(0).toUpperCase();
                    const isOptCorrect = optLetter === correctLetter;

                    let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:bg-amber-100/40';
                    if (followUpChecked) {
                      if (isOptCorrect) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
                      } else if (isSelected && !isOptCorrect) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-950';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-amber-100 border-amber-400 text-amber-950 font-medium';
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (!followUpChecked) {
                            setSelectedFollowUp(opt);
                          }
                        }}
                        className={`w-full p-2.5 text-left rounded-lg text-xs border transition-all ${btnStyle}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {!followUpChecked && selectedFollowUp && (
                  <button
                    onClick={() => setFollowUpChecked(true)}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    Check My Answer
                  </button>
                )}

                {followUpChecked && (
                  <div
                    className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
                      isFollowUpCorrect
                        ? 'bg-emerald-100 text-emerald-900'
                        : 'bg-rose-100 text-rose-900'
                    }`}
                  >
                    {isFollowUpCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>Excellent! You got it right! Keep up the brilliant work.</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-700 shrink-0" />
                        <span>
                          The correct option is{' '}
                          <strong>{explanationData.follow_up_question.correct_answer}</strong>.
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Got It, Back to Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
