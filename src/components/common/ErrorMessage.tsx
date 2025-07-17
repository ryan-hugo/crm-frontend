import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`flex items-center space-x-2 text-red-600 text-sm ${className}`}>
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;

