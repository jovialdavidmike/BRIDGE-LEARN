export type CurriculumStandard = 'WAEC' | 'NECO' | 'JAMB' | 'SAT' | 'IGCSE';

export type ClassLevel = string;

export type SubjectName = string;

export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface QuizPayload {
  mode: 'quiz';
  curriculum_standard: string;
  subject: string;
  class_level: string;
  questions: Question[];
}

export interface FollowUpQuestion {
  question: string;
  options: string[];
  correct_answer: string;
}

export interface TutorExplanationPayload {
  mode: 'explanation';
  curriculum_standard: string;
  subject: string;
  class_level: string;
  concept: string;
  explanation: string;
  follow_up_question: FollowUpQuestion;
}

export interface UserAnswerRecord {
  questionId: number;
  selectedOption: string;
  isCorrect: boolean;
  timeSpentSeconds?: number;
}

export interface QuizResultHistory {
  id: string;
  date: string;
  curriculum_standard: CurriculumStandard;
  class_level: string;
  subject: string;
  topic?: string;
  score: number;
  totalQuestions: number;
  percentage: number;
}
