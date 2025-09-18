import React from 'react';
import { Book, Calendar, Star, Heart, Eye } from 'lucide-react';
import { BookResult } from '../types';
import { getCoverUrl, getBookUrl } from '../utils/api';

interface BookCardProps {
  book: BookResult;
  viewMode: 'grid' | 'list';
  favorites: string[];
  onToggleFavorite: (bookKey: string) => void;
  onViewDetails: (book: BookResult) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  viewMode,
  favorites,
  onToggleFavorite,
  onViewDetails
}) => {
  return (
    <div
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
            onToggleFavorite(book.key);
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
            onClick={() => onViewDetails(book)}
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
  );
};

export default BookCard;