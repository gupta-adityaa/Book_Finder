import React from 'react';
import { Heart, Grid, List } from 'lucide-react';

interface ResultsHeaderProps {
  totalResults: number;
  favorites: string[];
  viewMode: 'grid' | 'list';
  setViewMode: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
  loading: boolean;
}

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  totalResults,
  favorites,
  viewMode,
  setViewMode,
  loading
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          {!loading && (
            <p className="text-gray-600">
              Found <span className="font-semibold text-amber-700">{totalResults.toLocaleString()}</span> books
            </p>
          )}
          
          {favorites.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              <span>{favorites.length} favorite{favorites.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-amber-100 text-amber-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsHeader;