import React, { useState, useEffect, useCallback } from 'react';
import { Search, Book, User, Calendar, Globe, Hash, Filter, Grid, List, Heart, Eye, Star, ChevronLeft, ChevronRight, Loader, AlertCircle } from 'lucide-react';

interface BookResult {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  language?: string[];
  cover_i?: number;
  edition_count?: number;
  ratings_average?: number;
  ratings_count?: number;
}

interface SearchFilters {
  searchType: 'title' | 'author' | 'subject' | 'isbn' | 'publisher';
  query: string;
  language: string;
  startYear: string;
  endYear: string;
  sortBy: 'relevance' | 'title' | 'date' | 'rating';
}

const SEARCH_TYPES = [
  { value: 'title', label: 'Title', icon: Book },
  { value: 'author', label: 'Author', icon: User },
  { value: 'subject', label: 'Subject', icon: Hash },
  { value: 'isbn', label: 'ISBN', icon: Hash },
  { value: 'publisher', label: 'Publisher', icon: Globe }
];

const LANGUAGES = [
  { value: '', label: 'All Languages' },
  { value: 'eng', label: 'English' },
  { value: 'spa', label: 'Spanish' },
  { value: 'fre', label: 'French' },
  { value: 'ger', label: 'German' },
  { value: 'ita', label: 'Italian' }
];

function App() {
  const [books, setBooks] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'title',
    query: '',
    language: '',
    startYear: '',
    endYear: '',
    sortBy: 'relevance'
  });

  const resultsPerPage = 20;

  // Load favorites and search history from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bookFinder_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    const savedHistory = localStorage.getItem('bookFinder_searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('bookFinder_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('bookFinder_searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const buildApiUrl = (page: number = 1) => {
    const baseUrl = 'https://openlibrary.org/search.json';
    const params = new URLSearchParams();
    
    // Main search parameter
    if (filters.query.trim()) {
      params.append(filters.searchType, filters.query.trim());
    }
    
    // Additional filters
    if (filters.language) {
      params.append('language', filters.language);
    }
    
    // Year range
    if (filters.startYear && filters.endYear) {
      params.append('publish_year', `${filters.startYear}-${filters.endYear}`);
    } else if (filters.startYear) {
      params.append('publish_year', `${filters.startYear}-`);
    } else if (filters.endYear) {
      params.append('publish_year', `-${filters.endYear}`);
    }
    
    // Pagination
    params.append('page', page.toString());
    params.append('limit', resultsPerPage.toString());
    
    // Fields to return
    params.append('fields', 'key,title,author_name,first_publish_year,isbn,subject,publisher,language,cover_i,edition_count,ratings_average,ratings_count');
    
    return `${baseUrl}?${params.toString()}`;
  };

  const searchBooks = useCallback(async (page: number = 1) => {
    if (!filters.query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = buildApiUrl(page);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setBooks(data.docs || []);
      setTotalResults(data.numFound || 0);
      setCurrentPage(page);
      
      // Add to search history
      if (!searchHistory.includes(filters.query)) {
        setSearchHistory(prev => [filters.query, ...prev.slice(0, 9)]);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books. Please try again.');
      setBooks([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [filters, searchHistory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchBooks(1);
  };

  const handlePageChange = (page: number) => {
    searchBooks(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (bookKey: string) => {
    setFavorites(prev => 
      prev.includes(bookKey) 
        ? prev.filter(key => key !== bookKey)
        : [...prev, bookKey]
    );
  };

  const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M') => {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  };

  const getBookUrl = (bookKey: string) => {
    return `https://openlibrary.org${bookKey}`;
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const showPagination = totalPages > 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="w-8 h-8 text-amber-700" />
            <h1 className="text-4xl font-bold text-gray-800">BookFinder</h1>
          </div>
          <p className="text-gray-600 text-lg">Discover your next great read</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-6">
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

        {/* Results Header */}
        {(books.length > 0 || loading) && (
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
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="text-red-800 font-medium">Search Error</h3>
                <p className="text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Searching for books...</p>
          </div>
        )}

        {/* Books Grid/List */}
        {books.length > 0 && !loading && (
          <>
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
              : "space-y-4 mb-8"
            }>
              {books.map((book) => (
                <div
                  key={book.key}
                  className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${
                    viewMode === 'list' ? 'flex gap-4 p-4' : 'flex flex-col'
                  }`}
                >
                  {/* Book Cover */}
                  <div className={viewMode === 'list' ? 'w-24 flex-shrink-0' : 'relative'}>
                    {book.cover_i ? (
                      <img
                        src={getCoverUrl(book.cover_i, viewMode === 'list' ? 'S' : 'M')}
                        alt={`${book.title} cover`}
                        className={`object-cover ${
                          viewMode === 'list' 
                            ? 'w-full h-32 rounded-lg' 
                            : 'w-full h-64 group-hover:scale-105 transition-transform duration-300'
                        }`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NCIgdmlld0JveD0iMCAwIDIwMCAyNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMyQzEwNC40MTggMTMyIDEwOCAxMjguNDE4IDEwOCAxMjRDMTA4IDExOS41ODIgMTA0LjQxOCAxMTYgMTAwIDExNkM5NS41ODIgMTE2IDkyIDExOS41ODIgOTIgMTI0QzkyIDEyOC40MTggOTUuNTgyIDEzMiAxMDAgMTMyWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                        }}
                      />
                    ) : (
                      <div className={`bg-gradient-to-b from-gray-200 to-gray-300 flex items-center justify-center ${
                        viewMode === 'list' ? 'w-full h-32 rounded-lg' : 'w-full h-64'
                      }`}>
                        <Book className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(book.key);
                      }}
                      className={`absolute ${viewMode === 'list' ? 'top-1 right-1' : 'top-3 right-3'} p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all duration-200 ${
                        favorites.includes(book.key) ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${favorites.includes(book.key) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Book Info */}
                  <div className={viewMode === 'list' ? 'flex-1 min-w-0' : 'p-4 flex-1'}>
                    <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2 leading-tight">
                      {book.title}
                    </h3>
                    
                    {book.author_name && (
                      <p className="text-gray-600 mb-2 line-clamp-1">
                        by {book.author_name.slice(0, 2).join(', ')}
                        {book.author_name.length > 2 && ` +${book.author_name.length - 2} more`}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm text-gray-500">
                      {book.first_publish_year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Published {book.first_publish_year}</span>
                        </div>
                      )}
                      
                      {book.edition_count && (
                        <div className="flex items-center gap-2">
                          <Book className="w-4 h-4" />
                          <span>{book.edition_count} edition{book.edition_count !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      
                      {book.ratings_average && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{book.ratings_average.toFixed(1)} ({book.ratings_count} ratings)</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                      <a
                        href={getBookUrl(book.key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="View on Open Library"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * resultsPerPage + 1} - {Math.min(currentPage * resultsPerPage, totalResults)} of {totalResults.toLocaleString()} results
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-amber-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {books.length === 0 && !loading && filters.query && !error && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <Book className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No books found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search terms or filters
            </p>
            <button
              onClick={() => {
                setFilters(prev => ({ 
                  ...prev, 
                  query: '', 
                  language: '', 
                  startYear: '', 
                  endYear: '', 
                  searchType: 'title' 
                }));
                setShowFilters(false);
              }}
              className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Book Detail Modal */}
        {selectedBook && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Book Cover */}
                  <div className="lg:col-span-1">
                    {selectedBook.cover_i ? (
                      <img
                        src={getCoverUrl(selectedBook.cover_i, 'L')}
                        alt={`${selectedBook.title} cover`}
                        className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
                      />
                    ) : (
                      <div className="w-full max-w-sm mx-auto h-96 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-lg flex items-center justify-center">
                        <Book className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Book Information */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-2">{selectedBook.title}</h3>
                      {selectedBook.author_name && (
                        <p className="text-xl text-gray-600">
                          by {selectedBook.author_name.join(', ')}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      {selectedBook.first_publish_year && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span><strong>First Published:</strong> {selectedBook.first_publish_year}</span>
                        </div>
                      )}
                      
                      {selectedBook.edition_count && (
                        <div className="flex items-center gap-2">
                          <Book className="w-4 h-4 text-gray-400" />
                          <span><strong>Editions:</strong> {selectedBook.edition_count}</span>
                        </div>
                      )}
                      
                      {selectedBook.ratings_average && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span><strong>Rating:</strong> {selectedBook.ratings_average.toFixed(1)}/5 ({selectedBook.ratings_count} ratings)</span>
                        </div>
                      )}
                      
                      {selectedBook.language && selectedBook.language.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <span><strong>Languages:</strong> {selectedBook.language.slice(0, 3).join(', ')}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedBook.subject && selectedBook.subject.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Subjects</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBook.subject.slice(0, 10).map((subject, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                            >
                              {subject}
                            </span>
                          ))}
                          {selectedBook.subject.length > 10 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                              +{selectedBook.subject.length - 10} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {selectedBook.publisher && selectedBook.publisher.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Publishers</h4>
                        <p className="text-gray-600">{selectedBook.publisher.slice(0, 5).join(', ')}</p>
                      </div>
                    )}
                    
                    {selectedBook.isbn && selectedBook.isbn.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">ISBN</h4>
                        <p className="text-gray-600 font-mono">{selectedBook.isbn[0]}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => toggleFavorite(selectedBook.key)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                          favorites.includes(selectedBook.key)
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.includes(selectedBook.key) ? 'fill-current' : ''}`} />
                        {favorites.includes(selectedBook.key) ? 'Remove from Favorites' : 'Add to Favorites'}
                      </button>
                      
                      <a
                        href={getBookUrl(selectedBook.key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View on Open Library
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
