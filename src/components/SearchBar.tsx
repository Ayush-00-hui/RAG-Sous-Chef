import React, { useState } from 'react';
import { Search, Filter, X, Flame, Clock, ChefHat, Sparkles } from 'lucide-react';
import { SearchFilters } from '../types';
import { useRecipeContext } from '../hooks/useRecipeContext';

interface SearchBarProps {
  onSearch?: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
  activeFilters?: SearchFilters;
  setActiveFilters?: React.Dispatch<React.SetStateAction<SearchFilters>>;
}

const DIETARY_OPTIONS = [
  'high-protein',
  'vegan',
  'keto',
  'gluten-free',
  'low-carb',
  'dairy-free',
  'vegetarian',
];

export const SearchBar: React.FC<SearchBarProps> = (props) => {
  const context = useRecipeContext();

  const onSearch = props.onSearch || ((q, f) => context.executeSearch(q, f));
  const isLoading = props.isLoading !== undefined ? props.isLoading : context.loading;
  const activeFilters = props.activeFilters || context.searchFilters;
  const setActiveFilters = props.setActiveFilters || context.setSearchFilters;

  const [query, setQuery] = useState(context.searchQuery || '');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    context.setSearchQuery(query);
    onSearch(query, activeFilters);
  };

  const toggleDietaryTag = (tag: string) => {
    setActiveFilters((prev) => {
      const exists = prev.dietary.includes(tag);
      const updated = exists ? prev.dietary.filter((t) => t !== tag) : [...prev.dietary, tag];
      const newFilters = { ...prev, dietary: updated };
      onSearch(query, newFilters);
      return newFilters;
    });
  };

  const handleMaxCaloriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setActiveFilters((prev) => ({ ...prev, max_calories: val }));
  };

  const clearFilters = () => {
    const resetFilters: SearchFilters = {
      dietary: [],
      max_calories: 1000,
      max_cook_time: 120,
      difficulty: 'all',
      cuisine: 'all',
    };
    setActiveFilters(resetFilters);
    onSearch(query, resetFilters);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="relative flex items-center justify-center w-full max-w-3xl mx-auto">
        <div className="relative flex flex-1 items-center bg-white border-2 border-gray-900 rounded-lg shadow-sm hover:shadow transition-all focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900 p-1 pl-4">
          <Search className="w-5 h-5 text-gray-500 shrink-0" />
          <input
            id="input-recipe-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask NutriChef about meals, options, or ingredients..."
            className="w-full bg-transparent border-none text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 px-3 py-3 text-base font-semibold"
          />
          
          <div className="flex items-center gap-2 pr-1 shrink-0">
            <button
              id="btn-toggle-filters"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center p-2.5 rounded transition-all ${
                showFilters || activeFilters.dietary.length > 0 || activeFilters.max_calories < 1000
                  ? 'bg-gray-200 text-gray-900'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Advanced Filters"
            >
              <Filter className="w-5 h-5" />
              {activeFilters.dietary.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[9px] font-bold text-white border border-white">
                  {activeFilters.dietary.length}
                </span>
              )}
            </button>
            <button
              id="btn-submit-search"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center justify-center p-2.5 rounded bg-gray-900 hover:bg-gray-800 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Submit Request"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Expanded Filter Drawer */}
      {showFilters && (
        <div className="p-6 bg-white border-2 border-gray-900 rounded-lg shadow-sm space-y-6 mt-4 relative z-10">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-900" /> Advanced Criteria
            </h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 p-1.5 rounded transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calorie Range Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-700">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-gray-900" /> Max Calories
                </span>
                <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-bold">{activeFilters.max_calories} kcal</span>
              </div>
              <input
                id="slider-max-calories"
                type="range"
                min="200"
                max="1200"
                step="50"
                value={activeFilters.max_calories}
                onChange={handleMaxCaloriesChange}
                className="w-full accent-gray-900 cursor-pointer"
              />
            </div>

            {/* Cook Time Filter */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-700">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-900" /> Max Time
                </span>
                <span className="text-gray-900 bg-gray-100 px-2 py-0.5 rounded font-bold">{activeFilters.max_cook_time} mins</span>
              </div>
              <input
                id="slider-max-cooktime"
                type="range"
                min="15"
                max="180"
                step="15"
                value={activeFilters.max_cook_time}
                onChange={(e) => setActiveFilters((p) => ({ ...p, max_cook_time: Number(e.target.value) }))}
                className="w-full accent-gray-900 cursor-pointer"
              />
            </div>

            {/* Difficulty Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-gray-900" /> Difficulty Level
              </label>
              <select
                id="select-difficulty"
                value={activeFilters.difficulty}
                onChange={(e) => setActiveFilters((p) => ({ ...p, difficulty: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 text-gray-900 border border-gray-300 rounded font-semibold focus:ring-2 focus:ring-gray-900 outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy (Under 20m)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Hard">Hard (Advanced Gourmet)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              id="btn-clear-filters"
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-3 py-1.5 rounded font-bold transition-colors"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
            <button
              id="btn-apply-filters"
              type="button"
              onClick={() => {
                onSearch(query, activeFilters);
                setShowFilters(false);
              }}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded transition-colors"
            >
              Apply Criteria
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
