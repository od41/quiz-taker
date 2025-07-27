import React, { useState, useEffect } from 'react';
import { Question } from '@/types/quiz';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  disabled?: boolean;
}

export function QuestionCard({ question, onAnswer, disabled = false }: QuestionCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  // Reset selected answer when question changes
  useEffect(() => {
    setSelectedAnswer('');
  }, [question.index]);

  const handleOptionSelect = (option: string) => {
    if (!disabled) {
      setSelectedAnswer(option);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer && !disabled) {
      onAnswer(selectedAnswer);
    }
  };

  // Determine options based on question type
  const isMultipleChoice = question.type === 'multiple-choice';
  const isTrueFalse = question.type === 'true-false';
  
  const renderOptions = () => {
    if (isMultipleChoice) {
      const options = ['A', 'B', 'C', 'D'];
      return options.map((letter, index) => (
        <div key={letter} className="w-full">
          <button
            className={`w-full p-4 text-left border-2 rounded-none transition-all duration-200 ${
              selectedAnswer === letter
                ? 'border-nigeria-green bg-green-50 shadow-md'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleOptionSelect(letter)}
            disabled={disabled}
            aria-pressed={selectedAnswer === letter}
            aria-label={`Option ${letter}: ${question.options?.[index]}`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  selectedAnswer === letter
                    ? 'border-nigeria-green bg-nigeria-green text-white'
                    : 'border-gray-400 bg-white'
                }`}
              >
                <span className="font-bold text-sm">{letter}</span>
              </div>
              <span className="mb-0! text-left">
                {question.options?.[index]}
              </span>
            </div>
          </button>
        </div>
      ));
    } else if (isTrueFalse) {
      const trueFalseOptions = ['True', 'False'];
      return trueFalseOptions.map((option) => (
        <div key={option} className="w-1/2">
          <button
            className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
              selectedAnswer === option
                ? 'border-3 border-nigeria-green shadow-lg transform scale-105'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:shadow-sm hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => handleOptionSelect(option)}
            disabled={disabled}
            aria-pressed={selectedAnswer === option}
            aria-label={`Answer: ${option}`}
          >
            <div className="flex items-center justify-center space-x-4">
              {/* <div
                className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center ${
                  selectedAnswer === option
                    ? 'border-white bg-white text-nigeria-green shadow-inner'
                    : 'border-gray-400 bg-white text-gray-600'
                }`}
              >
                <span className={`font-bold text-xl ${
                  selectedAnswer === option ? 'text-nigeria-green' : 'text-gray-600'
                }`}>
                  {option === 'True' ? '✓' : '✗'}
                </span>
              </div> */}
              <span className={`gov-bodyyy font-bold text-md ${
                selectedAnswer === option ? 'text-nigeria-green' : 'text-gray-800'
              }`}>
                {option}
              </span>
              {selectedAnswer === option && (
                <div className="">
                  <span className="text-nigeria-green font-bold text-lg">●</span>
                </div>
              )}
            </div>
          </button>
        </div>
      ));
    }
    return null;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="fade-in">
        <div className="">
          {/* Question Title */}
          <div>
            <h2 className="text-sm font-bold mb-2!">{question.title}</h2>
            <p className="text-2xl">{question.question}</p>
          </div>

          {/* Answer Options */}
          <div className="">
            <h3 className="gov-heading-m mb-4!">Choose your answer:</h3>
            <div className={`flex gap-4 ${isTrueFalse ? 'flex-row items-center justify-center' : 'flex-col'}  `}>
              {renderOptions()}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer || disabled}
              ariaLabel="Submit your answer"
            >
              Submit Answer
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 