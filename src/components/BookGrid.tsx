import React from 'react';
import { BookResult } from '../types';
import BookCard from './BookCard';

interface BookGridProps {
  books: BookResult[];
  viewMode: 'grid' | 'list';
  favorites: string[];
  onToggleFavorite: (bookKey: string) => void;
  onViewDetails: (book: BookResult) => void;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  viewMode,
  favorites,
  onToggleFavorite,
  onViewDetails
}) => {
  return (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
      : "space-y-4 mb-8"
    }>
      {books.map((book) => (
        <BookCard
          key={book.key}
          book={book}
          viewMode={viewMode}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default BookGrid;