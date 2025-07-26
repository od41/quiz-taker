import { Question, QuizConfig, QuizState, AnsweredQuestion, QuizSummary } from '@/types/quiz';
import { getRecentlyAnsweredQuestions } from './storage';

export function selectRandomQuestions(
  allQuestions: Question[],
  count: number,
  category?: string
): Question[] {
  // Filter by category if specified
  let availableQuestions = category 
    ? allQuestions.filter(q => q.category === category)
    : allQuestions;
    
  // Get recently answered questions to avoid repetition
  const recentlyAnswered = getRecentlyAnsweredQuestions();
  
  // Filter out recently answered questions if we have enough questions
  const unAnsweredQuestions = availableQuestions.filter(
    q => !recentlyAnswered.includes(q.index)
  );
  
  // If we don't have enough unanswered questions, use all available
  if (unAnsweredQuestions.length < count) {
    availableQuestions = availableQuestions;
  } else {
    availableQuestions = unAnsweredQuestions;
  }
  
  // Shuffle and select the required count
  const shuffled = [...availableQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function initializeQuiz(
  questions: Question[],
  category: string,
  totalQuestions: number = 30
): QuizConfig {
  const selectedQuestions = selectRandomQuestions(questions, totalQuestions, category);
  
  return {
    category,
    totalQuestions: selectedQuestions.length,
    selectedQuestions
  };
}

export function createInitialQuizState(): QuizState {
  return {
    currentQuestionIndex: 0,
    answeredQuestions: [],
    score: 0,
    isComplete: false,
    startTime: new Date().toISOString()
  };
}

export function answerQuestion(
  quizState: QuizState,
  question: Question,
  userAnswer: string
): QuizState {
  const isCorrect = userAnswer === question.correctAnswer;
  
  const answeredQuestion: AnsweredQuestion = {
    questionIndex: question.index,
    category: question.category,
    userAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    answeredAt: new Date().toISOString()
  };
  
  const newState = {
    ...quizState,
    answeredQuestions: [...quizState.answeredQuestions, answeredQuestion],
    score: isCorrect ? quizState.score + 1 : quizState.score,
    currentQuestionIndex: quizState.currentQuestionIndex + 1
  };
  
  return newState;
}

export function isQuizComplete(quizState: QuizState, totalQuestions: number): boolean {
  return quizState.currentQuestionIndex >= totalQuestions;
}

export function calculateQuizSummary(
  quizState: QuizState,
  quizConfig: QuizConfig
): QuizSummary {
  const startTime = new Date(quizState.startTime);
  const endTime = new Date();
  const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
  
  return {
    totalQuestions: quizConfig.totalQuestions,
    correctAnswers: quizState.score,
    accuracy: Math.round((quizState.score / quizConfig.totalQuestions) * 100),
    duration,
    category: quizConfig.category
  };
}

export function getPerformanceMessage(accuracy: number): {
  message: string;
  color: string;
} {
  if (accuracy >= 90) {
    return {
      message: "Excellent! You demonstrate superior understanding of the material.",
      color: "text-green-700"
    };
  } else if (accuracy >= 80) {
    return {
      message: "Very Good! You have a strong grasp of the concepts.",
      color: "text-green-600"
    };
  } else if (accuracy >= 70) {
    return {
      message: "Good performance. Consider reviewing areas where you struggled.",
      color: "text-yellow-600"
    };
  } else if (accuracy >= 60) {
    return {
      message: "Fair performance. Additional study is recommended.",
      color: "text-orange-600"
    };
  } else {
    return {
      message: "Additional preparation needed. Focus on understanding key concepts.",
      color: "text-red-600"
    };
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${remainingSeconds}s`;
  }
}

export function getQuestionProgress(currentIndex: number, total: number): {
  percentage: number;
  text: string;
} {
  const percentage = Math.round((currentIndex / total) * 100);
  return {
    percentage,
    text: `Question ${currentIndex + 1} of ${total}`
  };
} 