export interface BookResult {
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

export interface SearchFilters {
  searchType: 'title' | 'author' | 'subject' | 'isbn' | 'publisher';
  query: string;
  language: string;
  startYear: string;
  endYear: string;
  sortBy: 'relevance' | 'title' | 'date' | 'rating';
}

export interface SearchType {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Language {
  value: string;
  label: string;
}