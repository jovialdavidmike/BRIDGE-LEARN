import React, { useState } from 'react';
import {
  Sparkles,
  Calculator,
  FlaskConical,
  Atom,
  Zap,
  Dna,
  BookOpen,
  Sprout,
  Target,
  History,
  GraduationCap,
  ChevronRight,
  Globe2,
  Compass,
} from 'lucide-react';
import { ClassLevel, SubjectName, QuizResultHistory, CurriculumStandard } from '../types';
import { CLASS_LEVELS, SUBJECTS, CURRICULUM_STANDARDS } from '../data/curriculumData';

interface DashboardProps {
  selectedStandard: CurriculumStandard;
  selectedLevel: ClassLevel;
  selectedSubject: SubjectName;
  selectedTopic: string;
  questionCount: number;
  isLoading: boolean;
  onSelectStandard: (standard: CurriculumStandard) => void;
  onSelectLevel: (level: ClassLevel) => void;
  onSelectSubject: (subject: SubjectName) => void;
  onSelectTopic: (topic: string) => void;
  onSelectCount: (count: number) => void;
  onStartQuiz: () => void;
  quizHistory: QuizResultHistory[];
}

export const Dashboard: React.FC<DashboardProps> = ({
  selectedStandard,
  selectedLevel,
  selectedSubject,
  selectedTopic,
  questionCount,
  isLoading,
  onSelectStandard,
  onSelectLevel,
  onSelectSubject,
  onSelectTopic,
  onSelectCount,
  onStartQuiz,
  quizHistory,
}) => {
  const [customTopicInput, setCustomTopicInput] = useState('');

  // Icon mapping helper
  const getSubjectIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-emerald-600" />;
      case 'FlaskConical':
        return <FlaskConical className="w-5 h-5 text-blue-600" />;
      case 'Atom':
        return <Atom className="w-5 h-5 text-purple-600" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-600" />;
      case 'Dna':
        return <Dna className="w-5 h-5 text-teal-600" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-rose-600" />;
      case 'Sprout':
        return <Sprout className="w-5 h-5 text-lime-600" />;
      default:
        return <GraduationCap className="w-5 h-5 text-slate-600" />;
    }
  };

  const activeStandardMeta = CURRICULUM_STANDARDS.find((s) => s.id === selectedStandard) || CURRICULUM_STANDARDS[0];
  const currentSubjectMeta = SUBJECTS.find((s) => s.id === selectedSubject) || SUBJECTS[0];
  const popularTopics = currentSubjectMeta.popularTopics[selectedLevel] || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner: Local Foundational Learning to Global Opportunities */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-7 shadow-lg border border-emerald-600/30">
        <div className="absolute -right-8 -bottom-10 w-44 h-44 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-amber-300 text-xs font-semibold mb-3">
            <Globe2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Bridging Local Foundational Learning with Global Opportunities</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Curriculum Tutor: WAEC, JAMB, IGCSE & SAT
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Practice questions and tailored explanations calibrated strictly to your target exam standard. Master local foundations in Nigeria and excel on global international stages.
          </p>
        </div>
      </div>

      {/* Step 1: Select Curriculum Standard */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">Target Curriculum Standard</h2>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            {activeStandardMeta.region} · {activeStandardMeta.scope}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {CURRICULUM_STANDARDS.map((std) => {
            const isSelected = selectedStandard === std.id;
            return (
              <button
                key={std.id}
                onClick={() => onSelectStandard(std.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{std.flag}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      std.scope === 'Global Bridge'
                        ? 'bg-blue-100 text-blue-800'
                        : std.scope === 'National'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {std.scope}
                  </span>
                </div>
                <div className="mt-2 font-bold text-sm text-slate-900">{std.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                  {std.description}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Select Class Level */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">Select Class Level</h2>
          </div>
          <span className="text-xs text-slate-500">Junior (JSS) & Senior (SS)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {CLASS_LEVELS.map((level) => {
            const isSelected = selectedLevel === level.id;
            return (
              <button
                key={level.id}
                onClick={() => {
                  onSelectLevel(level.id);
                  const subjectStillValid = SUBJECTS.find(
                    (s) => s.id === selectedSubject && s.applicableLevels.includes(level.id)
                  );
                  if (!subjectStillValid) {
                    const fallback = SUBJECTS.find((s) => s.applicableLevels.includes(level.id));
                    if (fallback) onSelectSubject(fallback.id);
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-base ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                    {level.label}
                  </span>
                  {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-emerald-200/70 text-emerald-900' : 'bg-slate-200/80 text-slate-700'
                    }`}
                  >
                    {level.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 3: Select Subject */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">Select Subject</h2>
          </div>
          <span className="text-xs text-slate-500">Filtered for {selectedLevel}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {SUBJECTS.filter((subj) => subj.applicableLevels.includes(selectedLevel)).map((subject) => {
            const isSelected = selectedSubject === subject.id;
            return (
              <button
                key={subject.id}
                onClick={() => {
                  onSelectSubject(subject.id);
                  onSelectTopic('');
                }}
                className={`p-3.5 rounded-xl border flex flex-col items-start text-left transition-all relative ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                }`}
              >
                <div className="p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs mb-2">
                  {getSubjectIcon(subject.icon)}
                </div>
                <span className={`font-semibold text-sm ${isSelected ? 'text-emerald-950 font-bold' : 'text-slate-800'}`}>
                  {subject.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5">{subject.category}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 4: Topic Selection & Quiz Length */}
      <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="font-bold text-slate-800 text-base sm:text-lg">Choose Topic & Length</h2>
          </div>
          <span className="text-xs text-slate-500">Curriculum Syllabus</span>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-600 block">
            Popular {selectedSubject} Topics for {selectedLevel}:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectTopic('')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedTopic === ''
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
              }`}
            >
              🌟 General Revision ({selectedStandard} Standard)
            </button>
            {popularTopics.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => onSelectTopic(topic)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or enter a specific topic (e.g. Simultaneous Equations, Stoichiometry, Trigonometry)..."
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customTopicInput.trim()) {
                    onSelectTopic(customTopicInput.trim());
                  }
                }}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              {customTopicInput.trim() && (
                <button
                  onClick={() => onSelectTopic(customTopicInput.trim())}
                  className="px-3.5 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-900 transition-colors"
                >
                  Set Topic
                </button>
              )}
            </div>
            {selectedTopic && (
              <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1 font-medium">
                <Target className="w-3.5 h-3.5 text-emerald-600" />
                Active Focus: <span className="font-bold underline">{selectedTopic}</span>
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs font-semibold text-slate-600">Question Count:</span>
            <div className="flex items-center gap-2">
              {[3, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => onSelectCount(num)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                    questionCount === num
                      ? 'bg-amber-400 text-emerald-950 border-amber-400 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} Questions {num === 3 && '(Quick)'} {num === 5 && '(Standard)'} {num === 10 && '(Exam)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={onStartQuiz}
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-base shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating {selectedStandard} {selectedLevel} Questions...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>
                  Start {selectedStandard} Practice Quiz ({selectedLevel} {selectedSubject})
                </span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>

      {/* Quiz History / Progress Log */}
      {quizHistory.length > 0 && (
        <section className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              <h2 className="font-bold text-slate-800 text-base sm:text-lg">Recent Quiz Activity</h2>
            </div>
            <span className="text-xs text-slate-500">Saved locally & Supabase</span>
          </div>

          <div className="divide-y divide-slate-100">
            {quizHistory.slice(0, 5).map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800">{item.subject}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                      {item.curriculum_standard || 'WAEC'} · {item.class_level}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 truncate max-w-xs">
                    {item.topic || 'General Practice'} · {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-extrabold text-sm ${
                      item.percentage >= 70
                        ? 'text-emerald-600'
                        : item.percentage >= 50
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {item.score}/{item.totalQuestions} ({item.percentage}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
