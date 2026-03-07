/**
 * SearchBar Component - Global search bar with autocomplete suggestions
 * Features: Debounced search, keyboard navigation, results preview
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Car, Bike } from 'lucide-react';
import { allVehicles } from '../data/vehicles';

export default function SearchBar({ 
  variant = 'default', // 'default', 'hero', 'compact'
  onSearch,
  placeholder = 'Search cars, bikes, brands...',
  className = '' 
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Debounced search for suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const results = allVehicles
        .filter(
          v =>
            v.name.toLowerCase().includes(q) ||
            v.brand.toLowerCase().includes(q) ||
            v.bodyType.toLowerCase().includes(q)
        )
        .slice(0, 5);
      setSuggestions(results);
      setIsOpen(results.length > 0);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        navigate(`/vehicle/${suggestions[selectedIndex].id}`);
        setIsOpen(false);
        setQuery('');
      } else if (onSearch) {
        onSearch(query);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query);
    }
    setIsOpen(false);
  };

  // Variant styles
  const variantStyles = {
    default: 'bg-white/5 border border-white/10 rounded-xl',
    hero: 'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20',
    compact: 'bg-white/5 border border-white/10 rounded-lg',
  };

  const inputSizes = {
    default: 'px-4 py-3',
    hero: 'px-6 py-4 text-lg',
    compact: 'px-3 py-2 text-sm',
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className={variantStyles[variant]}>
        <div className="flex items-center gap-3">
          <Search className={`text-gray-400 ml-3 ${variant === 'hero' ? 'w-6 h-6 ml-4' : 'w-5 h-5'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            className={`flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none ${inputSizes[variant]}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {variant === 'hero' && (
            <button
              type="submit"
              className="btn-gradient mr-2 flex items-center gap-2"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-dark-800/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-black/30 z-50 animate-slide-down"
        >
          {suggestions.map((vehicle, index) => (
            <button
              key={vehicle.id}
              onClick={() => {
                navigate(`/vehicle/${vehicle.id}`);
                setIsOpen(false);
                setQuery('');
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                index === selectedIndex
                  ? 'bg-primary-500/20 text-white'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-12 h-8 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium">{vehicle.name}</p>
                <p className="text-xs text-gray-500">
                  {vehicle.brand} • {vehicle.fuelType} • {vehicle.priceFormatted}
                </p>
              </div>
              {vehicle.type === 'car' ? (
                <Car className="w-4 h-4 text-primary-400" />
              ) : (
                <Bike className="w-4 h-4 text-accent-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
