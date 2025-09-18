import { Book, User, Hash, Globe } from 'lucide-react';
import { SearchType, Language } from '../types';

export const SEARCH_TYPES: SearchType[] = [
  { value: 'title', label: 'Title', icon: Book },
  { value: 'author', label: 'Author', icon: User },
  { value: 'subject', label: 'Subject', icon: Hash },
  { value: 'isbn', label: 'ISBN', icon: Hash },
  { value: 'publisher', label: 'Publisher', icon: Globe }
];

export const LANGUAGES: Language[] = [
  { value: '', label: 'All Languages' },
  { value: 'eng', label: 'English' },
  { value: 'spa', label: 'Spanish' },
  { value: 'fre', label: 'French' },
  { value: 'ger', label: 'German' },
  { value: 'ita', label: 'Italian' }
];