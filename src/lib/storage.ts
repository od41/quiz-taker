import { UserSession, UserData, QuizHistory, AnsweredQuestion } from '@/types/quiz';

const STORAGE_KEYS = {
  USER_DATA: 'civil_service_quiz_user_data',
  CURRENT_QUIZ: 'civil_service_quiz_current',
} as const;

export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateQuizId(): string {
  return `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createUserSession(name: string): UserSession {
  const session: UserSession = {
    name: name.trim(),
    sessionId: generateSessionId(),
    createdAt: new Date().toISOString(),
  };
  
  const userData: UserData = {
    session,
    quizHistory: [],
    recentlyAnsweredQuestions: [],
  };
  
  localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  return session;
}

export function getUserData(): UserData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading user data from localStorage:', error);
    return null;
  }
}

export function updateUserData(userData: UserData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
}

export function addQuizHistory(quizHistory: QuizHistory): void {
  const userData = getUserData();
  if (!userData) return;
  
  userData.quizHistory.unshift(quizHistory); // Add to beginning
  
  // Keep only last 20 quiz histories
  if (userData.quizHistory.length > 20) {
    userData.quizHistory = userData.quizHistory.slice(0, 20);
  }
  
  updateUserData(userData);
}

export function addAnsweredQuestions(answeredQuestions: AnsweredQuestion[]): void {
  const userData = getUserData();
  if (!userData) return;
  
  const questionIndices = answeredQuestions.map(q => q.questionIndex);
  userData.recentlyAnsweredQuestions.push(...questionIndices);
  
  // Keep only last 100 answered questions to avoid repetition
  if (userData.recentlyAnsweredQuestions.length > 100) {
    userData.recentlyAnsweredQuestions = userData.recentlyAnsweredQuestions.slice(-100);
  }
  
  updateUserData(userData);
}

export function getRecentlyAnsweredQuestions(): string[] {
  const userData = getUserData();
  return userData?.recentlyAnsweredQuestions || [];
}

export function clearUserData(): void {
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_QUIZ);
}

export function saveCurrentQuiz(quizState: unknown): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_QUIZ, JSON.stringify(quizState));
  } catch (error) {
    console.error('Error saving current quiz state:', error);
  }
}

export function getCurrentQuiz(): unknown {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_QUIZ);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error reading current quiz state:', error);
    return null;
  }
}

export function clearCurrentQuiz(): void {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_QUIZ);
} 