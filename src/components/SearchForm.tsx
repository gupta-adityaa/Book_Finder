import React from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import { SearchFilters } from '../types';
import { SEARCH_TYPES, LANGUAGES } from '../constants';

interface SearchFormProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  loading: boolean;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  searchHistory: string[];
  onSubmit: (e: React.FormEvent) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  filters,
  setFilters,
  loading,
  showFilters,
  setShowFilters,
  searchHistory,
  onSubmit
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Search Type Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SEARCH_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, searchType: type.value as any }))}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  filters.searchType === type.value
                    ? 'border-amber-500 bg-amber-50 text-amber-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{type.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
            placeholder={`Search by ${SEARCH_TYPES.find(t => t.value === filters.searchType)?.label.toLowerCase()}...`}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Search History Suggestions */}
        {searchHistory.length > 0 && !filters.query && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-500 mr-2">Recent searches:</span>
            {searchHistory.slice(0, 5).map((term, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, query: term }))}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {/* Advanced Filters Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Search Button */}
          <button
            type="submit"
            disabled={!filters.query.trim() || loading}
            className="flex-1 sm:flex-none bg-amber-600 text-white px-8 py-3 rounded-xl hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                Searching...
              </div>
            ) : (
              'Search Books'
            )}
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.value} value={lang.value}>{lang.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Year</label>
              <input
                type="number"
                value={filters.startYear}
                onChange={(e) => setFilters(prev => ({ ...prev, startYear: e.target.value }))}
                placeholder="e.g. 2000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Year</label>
              <input
                type="number"
                value={filters.endYear}
                onChange={(e) => setFilters(prev => ({ ...prev, endYear: e.target.value }))}
                placeholder="e.g. 2023"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="relevance">Relevance</option>
                <option value="title">Title</option>
                <option value="date">Publication Date</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchForm;