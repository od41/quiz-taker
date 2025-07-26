import React, { useEffect } from 'react';
import { Button } from '@/components/UI/Button';

interface FeedbackModalProps {
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  onNext: () => void;
  isVisible: boolean;
}

export function FeedbackModal({
  isCorrect,
  userAnswer,
  correctAnswer,
  explanation,
  onNext,
  isVisible
}: FeedbackModalProps) {
  useEffect(() => {
    if (isVisible) {
      // Focus the modal when it appears for accessibility
      const modal = document.getElementById('feedback-modal');
      modal?.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onNext();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isVisible, onNext]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-title"
      aria-describedby="feedback-explanation"
    >
      <div 
        id="feedback-modal"
        className="bg-white w-full max-w-lg mx-auto rounded-lg shadow-2xl slide-up"
        tabIndex={-1}
      >
        {/* Header */}
        <div className={`p-6 border-b-4 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isCorrect ? 'bg-green-500' : 'bg-red-500'
            }`}>
              {isCorrect ? (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            <div>
              <h2 
                id="feedback-title" 
                className={`gov-heading-l mb-0 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </h2>
              <p className="gov-body-s mb-0 text-gray-600">
                Your answer: <strong>{userAnswer}</strong>
                {!isCorrect && (
                  <span> | Correct answer: <strong className="text-green-600">{correctAnswer}</strong></span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Explanation */}
        <div className="p-6">
          <h3 className="gov-heading-m mb-3">Explanation</h3>
          <p id="feedback-explanation" className="gov-body text-gray-700">
            {explanation}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 border-t bg-gray-50">
          <Button onClick={onNext} ariaLabel="Continue to next question">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
} 