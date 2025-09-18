import { SearchFilters } from '../types';

export const buildApiUrl = (filters: SearchFilters, page: number = 1, resultsPerPage: number = 20): string => {
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

export const getCoverUrl = (coverId: number, size: 'S' | 'M' | 'L' = 'M'): string => {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

export const getBookUrl = (bookKey: string): string => {
  return `https://openlibrary.org${bookKey}`;
};