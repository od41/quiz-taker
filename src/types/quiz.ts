export interface Question {
  index: string;
  title: string;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options?: string[]; // Optional for true/false questions
  correctAnswer: string;
  explanation: string;
  category: string;
}

export interface UserSession {
  name: string;
  sessionId: string;
  createdAt: string;
  currentQuizId?: string;
}

export interface QuizConfig {
  category: string;
  totalQuestions: number;
  selectedQuestions: Question[];
}

export interface QuizState {
  currentQuestionIndex: number;
  answeredQuestions: AnsweredQuestion[];
  score: number;
  isComplete: boolean;
  startTime: string;
}

export interface AnsweredQuestion {
  questionIndex: string;
  category: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface QuizHistory {
  quizId: string;
  sessionId: string;
  category: string;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  duration: number; // in seconds
  answeredQuestions: AnsweredQuestion[];
}

export interface UserData {
  session: UserSession;
  quizHistory: QuizHistory[];
  recentlyAnsweredQuestions: string[]; // question indices
}

export interface QuizCategory {
  id: string;
  name: string;
  description: string;
  questionCount: number;
}

export interface QuizSummary {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  duration: number;
  category: string;
} 