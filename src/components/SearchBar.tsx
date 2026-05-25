'use client';

import { useState } from 'react';
import { searchSoftware } from '@/lib/data';

interface SearchBarProps {
  placeholder?: string;
  popularSuggestions?: string[];
  size?: 'default' | 'large';
}

export default function SearchBar({
  placeholder = 'Search an app you want to replace, e.g. Photoshop, Notion, Canva...',
  popularSuggestions = [],
  size = 'default',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 1) {
      const results = searchSoftware(value.trim());
      setSuggestions(results.slice(0, 5).map((r) => r.name));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch}>
        <div
          className={`flex items-center bg-white rounded-2xl shadow-xl shadow-slate-900/5 border border-slate-200 overflow-hidden transition-all focus-within:border-amber-400 focus-within:shadow-amber-500/10 ${
            size === 'large' ? 'p-2' : 'p-1.5'
          }`}
        >
          <div className="pl-4 text-slate-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className={`flex-1 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent ${
              size === 'large' ? 'text-lg' : 'text-base'
            }`}
          />
          <button
            type="submit"
            className={`bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-all hover:shadow-lg ${
              size === 'large' ? 'px-8 py-3.5' : 'px-6 py-3'
            }`}
          >
            Find Alternatives
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-200 overflow-hidden animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-5 py-3.5 text-left text-slate-700 hover:bg-amber-50 hover:text-slate-900 transition-colors flex items-center gap-3"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {popularSuggestions.length > 0 && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {popularSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion);
                window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
              }}
              className="px-4 py-1.5 bg-white border border-slate-200 hover:border-amber-300 hover:bg-amber-50 rounded-full text-sm text-slate-600 hover:text-slate-900 transition-all"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
