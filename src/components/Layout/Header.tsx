import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  userName?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function Header({ userName, showBackButton, onBackClick }: HeaderProps) {
  return (
    <header className="bg-white border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="nigeria-flag"></div>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <button
                onClick={onBackClick}
                className="p-2 hover:bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                aria-label="Go back"
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}
            <div>
              <Link href="/" className="flex items-center space-x-3 text-decoration-none">
                <div className="w-8 h-8 bg-nigeria-green rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NG</span>
                </div>
                <div>
                  <h1 className="gov-heading-m mb-0">Civil Service Study</h1>
                  <p className="gov-body-s mb-0 text-gray-600">Federal Republic of Nigeria</p>
                </div>
              </Link>
            </div>
          </div>
          
          {userName && (
            <div className="text-right">
              <p className="gov-body-s mb-0">Welcome,</p>
              <p className="gov-body font-semibold mb-0">{userName}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 