import React from 'react';

interface CardProps {
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function Card({
  children,
  clickable = false,
  onClick,
  className = '',
  ariaLabel
}: CardProps) {
  const baseClasses = 'gov-card';
  const clickableClasses = clickable ? 'gov-card--clickable' : '';
  
  const combinedClasses = [baseClasses, clickableClasses, className]
    .filter(Boolean)
    .join(' ');

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  const props = clickable
    ? {
        role: 'button',
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
        'aria-label': ariaLabel
      }
    : {};

  return (
    <div className={combinedClasses} {...props}>
      {children}
    </div>
  );
} 