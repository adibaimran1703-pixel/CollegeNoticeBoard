'use client';

import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Unable to load notices at this time. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-red-100 shadow-sm max-w-md mx-auto my-8">
      <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl mb-4 border border-red-100">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-2">Something went wrong</h3>
      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors focus:ring-2 focus:ring-slate-400"
        >
          <RotateCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
