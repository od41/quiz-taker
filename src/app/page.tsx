'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { Header } from '@/components/Layout/Header';
import { createUserSession, getUserData } from '@/lib/storage';

export default function WelcomePage() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user already has a session
    const userData = getUserData();
    if (userData?.session) {
      // User has existing session, redirect to categories
      router.push('/categories');
    }
  }, [router]);

  const handleStartQuiz = () => {
    if (!name.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Create user session
      createUserSession(name.trim());
      
      // Redirect to categories page
      router.push('/categories');
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Error creating session. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleStartQuiz();
    }
  };

  return (
    <div className="min-h-screen bg-gov-background">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="gov-heading-xl">Civil Service Study Platform</h1>
          <p className="gov-body text-gray-600">
            Enhance your knowledge and skills as a Nigerian civil servant through 
            interactive quizzes covering key topics in public administration.
          </p>
        </div>

        <Card className="text-center fade-in">
          <div className="space-y-6">
            <div>
              <h2 className="gov-heading-l">Welcome</h2>
              <p className="gov-body text-gray-600">
                Enter your name to begin your learning journey. Your progress will be 
                saved locally for tracking your improvement over time.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block gov-body font-medium mb-2 text-left">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter your full name"
                  className="gov-input"
                  disabled={isLoading}
                  autoFocus
                  maxLength={50}
                />
              </div>

              <Button 
                onClick={handleStartQuiz}
                disabled={!name.trim() || isLoading}
                ariaLabel="Start quiz session"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="gov-spinner"></div>
                    <span>Setting up...</span>
                  </div>
                ) : (
                  'Get Started'
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-nigeria-green rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="gov-heading-m">Interactive Learning</h3>
              <p className="gov-body-s text-gray-600">
                Multiple choice questions with immediate feedback and explanations
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-nigeria-green rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="gov-heading-m">Progress Tracking</h3>
              <p className="gov-body-s text-gray-600">
                Monitor your performance and track improvement over time
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-nigeria-green rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="gov-heading-m">Comprehensive Topics</h3>
              <p className="gov-body-s text-gray-600">
                Constitutional law, public administration, ethics, and financial management
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-nigeria-green rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="gov-heading-m">Mobile Optimized</h3>
              <p className="gov-body-s text-gray-600">
                Study anywhere, anytime with our mobile-friendly interface
              </p>
            </div>
          </Card>
        </div>

        {/* Footer Information */}
        <div className="mt-8 text-center">
          <p className="gov-body-s text-gray-500">
            This platform is designed to support the professional development of 
            Nigerian civil servants in accordance with public service excellence standards.
          </p>
        </div>
      </main>
    </div>
  );
}
