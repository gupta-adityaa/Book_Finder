import React from 'react';
import { Book, Calendar, Star, Globe, Heart, Eye } from 'lucide-react';
import { BookResult } from '../types';
import { getCoverUrl, getBookUrl } from '../utils/api';

interface BookDetailModalProps {
  book: BookResult | null;
  favorites: string[];
  onClose: () => void;
  onToggleFavorite: (bookKey: string) => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  favorites,
  onClose,
  onToggleFavorite
}) => {
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Book Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              {book.cover_i ? (
                <img
                  src={getCoverUrl(book.cover_i, 'L')}
                  alt={`${book.title} cover`}
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
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h3>
                {book.author_name && (
                  <p className="text-xl text-gray-600">
                    by {book.author_name.join(', ')}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {book.first_publish_year && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span><strong>First Published:</strong> {book.first_publish_year}</span>
                  </div>
                )}
                
                {book.edition_count && (
                  <div className="flex items-center gap-2">
                    <Book className="w-4 h-4 text-gray-400" />
                    <span><strong>Editions:</strong> {book.edition_count}</span>
                  </div>
                )}
                
                {book.ratings_average && (
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span><strong>Rating:</strong> {book.ratings_average.toFixed(1)}/5 ({book.ratings_count} ratings)</span>
                  </div>
                )}
                
                {book.language && book.language.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <span><strong>Languages:</strong> {book.language.slice(0, 3).join(', ')}</span>
                  </div>
                )}
              </div>
              
              {book.subject && book.subject.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-2">
                    {book.subject.slice(0, 10).map((subject, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm"
                      >
                        {subject}
                      </span>
                    ))}
                    {book.subject.length > 10 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{book.subject.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {book.publisher && book.publisher.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Publishers</h4>
                  <p className="text-gray-600">{book.publisher.slice(0, 5).join(', ')}</p>
                </div>
              )}
              
              {book.isbn && book.isbn.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">ISBN</h4>
                  <p className="text-gray-600 font-mono">{book.isbn[0]}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => onToggleFavorite(book.key)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-colors ${
                    favorites.includes(book.key)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(book.key) ? 'fill-current' : ''}`} />
                  {favorites.includes(book.key) ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                
                <a
                  href={getBookUrl(book.key)}
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
  );
};

export default BookDetailModal;