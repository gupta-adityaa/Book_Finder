import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Loader className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
      <p className="text-gray-600">Searching for books...</p>
    </div>
  );
};

export default LoadingState;