import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <div>
          <h3 className="text-red-800 font-medium">Search Error</h3>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;