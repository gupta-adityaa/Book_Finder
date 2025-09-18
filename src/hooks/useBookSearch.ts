import { useState, useCallback } from 'react';
import { BookResult, SearchFilters } from '../types';
import { buildApiUrl } from '../utils/api';

interface UseBookSearchReturn {
  books: BookResult[];
  loading: boolean;
  error: string | null;
  totalResults: number;
  currentPage: number;
  searchBooks: (page?: number) => Promise<void>;
}

export function useBookSearch(
  filters: SearchFilters,
  searchHistory: string[],
  setSearchHistory: React.Dispatch<React.SetStateAction<string[]>>,
  resultsPerPage: number = 20
): UseBookSearchReturn {
  const [books, setBooks] = useState<BookResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const searchBooks = useCallback(async (page: number = 1) => {
    if (!filters.query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const url = buildApiUrl(filters, page, resultsPerPage);
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
  }, [filters, searchHistory, setSearchHistory, resultsPerPage]);

  return {
    books,
    loading,
    error,
    totalResults,
    currentPage,
    searchBooks
  };
}