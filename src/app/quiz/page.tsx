'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';

// Disable static generation for this page since it relies on search params
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { ProgressBar } from '@/components/UI/ProgressBar';
import { QuestionCard } from '@/components/Quiz/QuestionCard';
import { FeedbackModal } from '@/components/Quiz/FeedbackModal';
import { getUserData, addAnsweredQuestions, addQuizHistory, generateQuizId } from '@/lib/storage';
import { loadQuestionsFromCategory } from '@/lib/questionParser';
import { initializeQuiz, createInitialQuizState, answerQuestion, isQuizComplete, calculateQuizSummary } from '@/lib/quizEngine';
import { Question, QuizConfig, QuizState } from '@/types/quiz';

function QuizPageContent() {
  const [quizConfig, setQuizConfig] = useState<QuizConfig | null>(null);
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswer, setLastAnswer] = useState<{
    userAnswer: string;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const initializeQuizPage = useCallback(async () => {
    try {
      // Check if user has a session
      const userData = getUserData();
      if (!userData?.session) {
        router.push('/');
        return;
      }

      setUserName(userData.session.name);

      // Get quiz parameters
      const category = searchParams.get('category');
      const count = parseInt(searchParams.get('count') || '30');

      if (!category) {
        router.push('/categories');
        return;
      }

      // Load questions for the category
      const questions = await loadQuestionsFromCategory(category);
      
      if (questions.length === 0) {
        alert('No questions found for this category. Please try another category.');
        router.push('/categories');
        return;
      }

      // Initialize quiz configuration
      const config = initializeQuiz(questions, category, count);
      const state = createInitialQuizState();

      setQuizConfig(config);
      setQuizState(state);
      setCurrentQuestion(config.selectedQuestions[0]);
      
    } catch (error) {
      console.error('Error initializing quiz:', error);
      alert('Error loading quiz. Please try again.');
      router.push('/categories');
    } finally {
      setIsLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    initializeQuizPage();
  }, [initializeQuizPage]);

  const handleAnswer = (userAnswer: string) => {
    if (!quizState || !quizConfig || !currentQuestion) return;

    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    
    // Update quiz state
    const newState = answerQuestion(quizState, currentQuestion, userAnswer);
    setQuizState(newState);

    // Show feedback
    setLastAnswer({
      userAnswer,
      isCorrect,
      explanation: currentQuestion.explanation
    });
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (!quizState || !quizConfig) return;

    setShowFeedback(false);
    setLastAnswer(null);

    // Check if quiz is complete
    if (isQuizComplete(quizState, quizConfig.totalQuestions)) {
      completeQuiz();
      return;
    }

    // Load next question
    const nextQuestion = quizConfig.selectedQuestions[quizState.currentQuestionIndex];
    setCurrentQuestion(nextQuestion);
  };

  const completeQuiz = () => {
    if (!quizState || !quizConfig) return;

    try {
      // Calculate summary
      const summary = calculateQuizSummary(quizState, quizConfig);
      
      // Save quiz history
      const quizHistory = {
        quizId: generateQuizId(),
        sessionId: getUserData()?.session.sessionId || '',
        category: quizConfig.category,
        totalQuestions: quizConfig.totalQuestions,
        correctAnswers: quizState.score,
        completedAt: new Date().toISOString(),
        duration: summary.duration,
        answeredQuestions: quizState.answeredQuestions
      };

      addQuizHistory(quizHistory);
      addAnsweredQuestions(quizState.answeredQuestions);

      // Navigate to results page
      const params = new URLSearchParams({
        summary: JSON.stringify(summary),
        answeredQuestions: JSON.stringify(quizState.answeredQuestions)
      });
      
      router.push(`/results?${params.toString()}`);
      
    } catch (error) {
      console.error('Error completing quiz:', error);
      alert('Error saving quiz results. Please try again.');
    }
  };

  const handleBackToCategories = () => {
    const confirmExit = confirm('Are you sure you want to exit the quiz? Your progress will be lost.');
    if (confirmExit) {
      router.push('/categories');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gov-background">
        <Header userName={userName} />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="gov-spinner mx-auto"></div>
            <h2 className="gov-heading-l">Loading Quiz...</h2>
            <p className="gov-body text-gray-600">Preparing your questions, please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!quizConfig || !quizState || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gov-background">
        <Header userName={userName} />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="gov-heading-l text-red-600">Error Loading Quiz</h2>
            <p className="gov-body text-gray-600">Unable to load quiz questions. Please try again.</p>
            <button 
              onClick={() => router.push('/categories')}
              className="gov-button gov-button--secondary"
            >
              Back to Categories
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-background">
      <Header 
        userName={userName} 
        showBackButton 
        onBackClick={handleBackToCategories} 
      />
      
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Quiz Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="gov-heading-l mb-1">
                {quizConfig.category.charAt(0).toUpperCase() + quizConfig.category.slice(1).replace('-', ' ')}
              </h1>
            </div>
            <div className="text-right">
              <p className="gov-body-s text-gray-600">Score</p>
              <p className="gov-heading-m text-nigeria-green">
                {quizState.score}/{quizState.currentQuestionIndex}
              </p>
            </div>
          </div>
          
          <ProgressBar 
            current={quizState.currentQuestionIndex + 1} 
            total={quizConfig.totalQuestions}
          />
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          disabled={showFeedback}
        />

        {/* Feedback Modal */}
        <FeedbackModal
          isVisible={showFeedback}
          isCorrect={lastAnswer?.isCorrect || false}
          userAnswer={lastAnswer?.userAnswer || ''}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={lastAnswer?.explanation || ''}
          onNext={handleNextQuestion}
        />

        {/* Quiz Status */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-lg px-4 py-2 shadow-sm">
            <div className="text-center">
              <p className="gov-body-s text-gray-600">Correct</p>
              <p className="gov-heading-m text-green-600">{quizState.score}</p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="gov-body-s text-gray-600">Incorrect</p>
              <p className="gov-heading-m text-red-600">
                {quizState.currentQuestionIndex - quizState.score}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <p className="gov-body-s text-gray-600">Remaining</p>
              <p className="gov-heading-m text-gray-700">
                {quizConfig.totalQuestions - quizState.currentQuestionIndex}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gov-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="gov-spinner mx-auto"></div>
            <h2 className="gov-heading-l">Loading...</h2>
            <p className="gov-body text-gray-600">Preparing your quiz, please wait.</p>
          </div>
        </div>
      </div>
    }>
      <QuizPageContent />
    </Suspense>
  );
} 