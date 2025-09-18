import React from 'react';
import { Book } from 'lucide-react';
import { SearchFilters } from '../types';

interface NoResultsProps {
  filters: SearchFilters;
  onClearFilters: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ filters, onClearFilters }) => {
  return (
    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
      <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
      <p className="text-gray-500 mb-4">
        Try adjusting your search terms or filters
      </p>
      <button
        onClick={onClearFilters}
        className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default NoResults;