import React from 'react';
import { QuizSummary as QuizSummaryType, AnsweredQuestion } from '@/types/quiz';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { formatDuration, getPerformanceMessage } from '@/lib/quizEngine';

interface QuizSummaryProps {
  summary: QuizSummaryType;
  answeredQuestions: AnsweredQuestion[];
  onStartNewQuiz: () => void;
  onBackToCategories: () => void;
}

export function QuizSummary({
  summary,
  answeredQuestions,
  onStartNewQuiz,
  onBackToCategories
}: QuizSummaryProps) {
  const performanceMessage = getPerformanceMessage(summary.accuracy);
  const incorrectAnswers = answeredQuestions.filter(q => !q.isCorrect);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Main Results Card */}
      <Card className="text-center fade-in">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="gov-heading-xl">Quiz Complete!</h1>
            <p className="gov-body-s text-gray-600">Category: {summary.category}</p>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-nigeria-green">
                {summary.correctAnswers}
              </div>
              <p className="gov-body-s text-gray-600">Correct</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {summary.totalQuestions - summary.correctAnswers}
              </div>
              <p className="gov-body-s text-gray-600">Incorrect</p>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${summary.accuracy >= 70 ? 'text-nigeria-green' : 'text-red-600'}`}>
                {summary.accuracy}%
              </div>
              <p className="gov-body-s text-gray-600">Accuracy</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-700">
                {formatDuration(summary.duration)}
              </div>
              <p className="gov-body-s text-gray-600">Duration</p>
            </div>
          </div>

          {/* Performance Message */}
          <div className={`p-4 rounded-lg ${
            summary.accuracy >= 70 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`gov-body font-medium ${performanceMessage.color}`}>
              {performanceMessage.message}
            </p>
          </div>
        </div>
      </Card>

      {/* Review Incorrect Answers */}
      {incorrectAnswers.length > 0 && (
        <Card>
          <h2 className="gov-heading-l mb-4">Review Incorrect Answers</h2>
          <div className="space-y-4">
            {incorrectAnswers.map((answer) => (
              <div key={answer.questionIndex} className="border-l-4 border-red-400 pl-4 py-2">
                <p className="gov-body-s text-gray-600 mb-1">
                  Question {answeredQuestions.findIndex(q => q.questionIndex === answer.questionIndex) + 1}
                </p>
                <div className="space-y-1">
                  <p className="gov-body-s">
                    <span className="text-red-600">Your answer: {answer.userAnswer}</span>
                  </p>
                  <p className="gov-body-s">
                    <span className="text-green-600">Correct answer: {answer.correctAnswer}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={onStartNewQuiz}>
          Start New Quiz
        </Button>
        <Button variant="secondary" onClick={onBackToCategories}>
          Choose Different Category
        </Button>
      </div>

      {/* Progress Message */}
      <Card className="text-center">
        <div className="space-y-2">
          <h3 className="gov-heading-m">Keep Learning!</h3>
          <p className="gov-body text-gray-600">
            Consistent practice is key to mastering civil service concepts. 
            Review the areas where you struggled and try again.
          </p>
        </div>
      </Card>
    </div>
  );
} 