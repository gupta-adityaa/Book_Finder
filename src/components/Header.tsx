import React from 'react';
import { Book } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Book className="w-8 h-8 text-amber-700" />
        <h1 className="text-4xl font-bold text-gray-800">BookFinder</h1>
      </div>
      <p className="text-gray-600 text-lg">Discover your next great read</p>
    </div>
  );
};

export default Header;