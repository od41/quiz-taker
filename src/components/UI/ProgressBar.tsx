import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showText?: boolean;
}

export function ProgressBar({ current, total, label, showText = true }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="w-full space-y-2">
      {showText && (
        <div className="flex justify-between items-center">
          <span className="gov-body-s">
            {label || `Question ${current} of ${total}`}
          </span>
          <span className="gov-body-s font-medium">
            {percentage}%
          </span>
        </div>
      )}
      
      <div 
        className="gov-progress"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || `Progress: ${current} of ${total} questions completed`}
      >
        <div 
          className="gov-progress-bar"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="sr-only">
        {percentage}% complete. {current} out of {total} questions answered.
      </div>
    </div>
  );
} 