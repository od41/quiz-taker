import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
  ariaLabel
}: ButtonProps) {
  const baseClasses = 'gov-button';
  const variantClasses = variant === 'secondary' ? 'gov-button--secondary' : '';
  const disabledClasses = disabled ? 'gov-button--disabled' : '';
  
  const combinedClasses = [baseClasses, variantClasses, disabledClasses, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
} 