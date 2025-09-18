import React, { useState } from 'react';
import { SearchFilters, BookResult } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useBookSearch } from './hooks/useBookSearch';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsHeader from './components/ResultsHeader';
import ErrorMessage from './components/ErrorMessage';
import LoadingState from './components/LoadingState';
import BookGrid from './components/BookGrid';
import Pagination from './components/Pagination';
import NoResults from './components/NoResults';
import BookDetailModal from './components/BookDetailModal';

function App() {
  const [selectedBook, setSelectedBook] = useState<BookResult | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('bookFinder_favorites', []);
  const [searchHistory, setSearchHistory] = useLocalStorage<string[]>('bookFinder_searchHistory', []);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchType: 'title',
    query: '',
    language: '',
    startYear: '',
    endYear: '',
    sortBy: 'relevance'
  });

  const resultsPerPage = 20;
  const { books, loading, error, totalResults, currentPage, searchBooks } = useBookSearch(
    filters,
    searchHistory,
    setSearchHistory,
    resultsPerPage
  );

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

  const handleClearFilters = () => {
    setFilters({
      searchType: 'title',
      query: '',
      language: '',
      startYear: '',
      endYear: '',
      sortBy: 'relevance'
    });
    setShowFilters(false);
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Header />

        <SearchForm
          filters={filters}
          setFilters={setFilters}
          loading={loading}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchHistory={searchHistory}
          onSubmit={handleSearch}
        />

        {(books.length > 0 || loading) && (
          <ResultsHeader
            totalResults={totalResults}
            favorites={favorites}
            viewMode={viewMode}
            setViewMode={setViewMode}
            loading={loading}
          />
        )}

        {error && <ErrorMessage error={error} />}

        {loading && <LoadingState />}

        {books.length > 0 && !loading && (
          <>
            <BookGrid
              books={books}
              viewMode={viewMode}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onViewDetails={setSelectedBook}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {books.length === 0 && !loading && filters.query && !error && (
          <NoResults filters={filters} onClearFilters={handleClearFilters} />
        )}

        <BookDetailModal
          book={selectedBook}
          favorites={favorites}
          onClose={() => setSelectedBook(null)}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}

export default App;