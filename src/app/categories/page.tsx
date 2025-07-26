'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { Header } from '@/components/Layout/Header';
import { getUserData } from '@/lib/storage';
import { getAvailableCategories } from '@/lib/questionParser';
import { QuizCategory } from '@/types/quiz';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(30);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    // Check if user has a session
    const userData = getUserData();
    if (!userData?.session) {
      router.push('/');
      return;
    }
    
    setUserName(userData.session.name);
    
    // Load available categories
    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      const availableCategories = await getAvailableCategories();
      setCategories(availableCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Error loading categories. Please refresh the page.');
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleStartQuiz = () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    
    // Navigate to quiz page with selected category
    const params = new URLSearchParams({
      category: selectedCategory,
      count: questionCount.toString()
    });
    
    router.push(`/quiz?${params.toString()}`);
  };

  const handleBackToWelcome = () => {
    router.push('/');
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'constitutional-law':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'public-administration':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'ethics':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'financial-management':
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gov-background">
      <Header userName={userName} showBackButton onBackClick={handleBackToWelcome} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="gov-heading-xl">Choose Your Study Topic</h1>
          <p className="gov-body text-gray-600">
            Select a category to begin your quiz. Each category contains questions 
            relevant to Nigerian civil service knowledge and best practices.
          </p>
        </div>

        {/* Category Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              clickable
              onClick={() => handleCategorySelect(category.id)}
              className={`transition-all duration-200 ${
                selectedCategory === category.id 
                  ? 'ring-2 ring-nigeria-green bg-green-50' 
                  : 'hover:bg-gray-50'
              }`}
              ariaLabel={`Select ${category.name} category`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-nigeria-green rounded-lg flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(category.id)}
                </div>
                <div className="flex-1">
                  <h3 className="gov-heading-m mb-2">{category.name}</h3>
                  <p className="gov-body-s text-gray-600 mb-3">
                    {category.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="gov-body-s font-medium text-nigeria-green">
                      Available Questions: 20+
                    </span>
                    {selectedCategory === category.id && (
                      <div className="w-6 h-6 bg-nigeria-green rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Quiz Configuration */}
        {selectedCategory && (
          <Card className="fade-in">
            <div className="space-y-6">
              <h2 className="gov-heading-l">Quiz Configuration</h2>
              
              <div>
                <label htmlFor="questionCount" className="block gov-body font-medium mb-2">
                  Number of Questions
                </label>
                <select
                  id="questionCount"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="gov-input"
                >
                  <option value={10}>10 Questions (Quick Review)</option>
                  <option value={20}>20 Questions (Standard)</option>
                  <option value={30}>30 Questions (Comprehensive)</option>
                  <option value={50}>50 Questions (Extended Practice)</option>
                </select>
                <p className="gov-body-s text-gray-600 mt-1">
                  Estimated time: {Math.ceil(questionCount * 1.5)} - {Math.ceil(questionCount * 2)} minutes
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="gov-heading-m text-blue-800 mb-2">Quiz Instructions</h3>
                <ul className="gov-body-s text-blue-700 space-y-1">
                  <li>• Questions are selected randomly to avoid repetition</li>
                  <li>• Each question has 4 multiple choice options</li>
                  <li>• You&apos;ll receive immediate feedback after each answer</li>
                  <li>• Your progress and performance will be saved locally</li>
                  <li>• No time limit - take your time to think carefully</li>
                </ul>
              </div>

              <Button 
                onClick={handleStartQuiz}
                disabled={isLoading}
                ariaLabel="Start quiz with selected category"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="gov-spinner"></div>
                    <span>Loading Questions...</span>
                  </div>
                ) : (
                  `Start ${questionCount} Question Quiz`
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* Instructions if no category selected */}
        {!selectedCategory && (
          <Card className="text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="gov-heading-m">Select a Category</h3>
              <p className="gov-body text-gray-600">
                Choose one of the categories above to configure and start your quiz.
              </p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
} 