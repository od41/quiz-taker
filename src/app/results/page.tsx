'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';

// Disable static generation for this page since it relies on search params
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/Layout/Header';
import { QuizSummary } from '@/components/Quiz/QuizSummary';
import { getUserData } from '@/lib/storage';
import { QuizSummary as QuizSummaryType, AnsweredQuestion } from '@/types/quiz';

function ResultsPageContent() {
  const [summary, setSummary] = useState<QuizSummaryType | null>(null);
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>([]);
  const [userName, setUserName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();

  const initializePage = useCallback(() => {
    try {
      // Check if user has a session
      const userData = getUserData();
      if (!userData?.session) {
        router.push('/');
        return;
      }

      setUserName(userData.session.name);

      // Get quiz results from URL parameters
      const summaryParam = searchParams.get('summary');
      const answeredQuestionsParam = searchParams.get('answeredQuestions');

      if (!summaryParam || !answeredQuestionsParam) {
        router.push('/categories');
        return;
      }

      const parsedSummary = JSON.parse(summaryParam) as QuizSummaryType;
      const parsedAnsweredQuestions = JSON.parse(answeredQuestionsParam) as AnsweredQuestion[];

      setSummary(parsedSummary);
      setAnsweredQuestions(parsedAnsweredQuestions);

    } catch (error) {
      console.error('Error loading results:', error);
      alert('Error loading quiz results. Redirecting to categories.');
      router.push('/categories');
    } finally {
      setIsLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    initializePage();
  }, [initializePage]);

  const handleStartNewQuiz = () => {
    if (!summary) return;
    
    // Navigate to quiz page with same category
    const params = new URLSearchParams({
      category: summary.category,
      count: summary.totalQuestions.toString()
    });
    
    router.push(`/quiz?${params.toString()}`);
  };

  const handleBackToCategories = () => {
    router.push('/categories');
  };

  const handleBackToWelcome = () => {
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gov-background">
        <Header userName={userName} />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="gov-spinner mx-auto"></div>
            <h2 className="gov-heading-l">Loading Results...</h2>
            <p className="gov-body text-gray-600">Calculating your performance, please wait.</p>
          </div>
        </main>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gov-background">
        <Header userName={userName} />
        <main className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <h2 className="gov-heading-l text-red-600">No Results Found</h2>
            <p className="gov-body text-gray-600">
              Unable to load quiz results. Please take a quiz first.
            </p>
            <button 
              onClick={handleBackToCategories}
              className="gov-button"
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
        onBackClick={handleBackToWelcome} 
      />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <QuizSummary
          summary={summary}
          answeredQuestions={answeredQuestions}
          onStartNewQuiz={handleStartNewQuiz}
          onBackToCategories={handleBackToCategories}
        />
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gov-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="gov-spinner mx-auto"></div>
            <h2 className="gov-heading-l">Loading...</h2>
            <p className="gov-body text-gray-600">Preparing your results, please wait.</p>
          </div>
        </div>
      </div>
    }>
      <ResultsPageContent />
    </Suspense>
  );
} 