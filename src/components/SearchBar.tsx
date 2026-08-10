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
        <div className="relative flex flex-1 items-center bg-white/80 backdrop-blur-md border border-gray-200/80 rounded-full shadow-lg shadow-emerald-500/10 hover:shadow-xl transition-all focus-within:ring-2 focus-within:ring-emerald-500/50 p-1.5 pl-5">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            id="input-recipe-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask NutriChef about high protein meals, keto options, or ingredients..."
            className="w-full bg-transparent border-none text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 px-3 py-3 text-base sm:text-lg font-medium"
          />
          
          <div className="flex items-center gap-2 pr-1 shrink-0">
            <button
              id="btn-toggle-filters"
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center p-2.5 rounded-full transition-all ${
                showFilters || activeFilters.dietary.length > 0 || activeFilters.max_calories < 1000
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-gray-100/80 text-gray-500 hover:bg-gray-200'
              }`}
              title="Advanced Filters"
            >
              <Filter className="w-5 h-5" />
              {activeFilters.dietary.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white border-2 border-white">
                  {activeFilters.dietary.length}
                </span>
              )}
            </button>
            <button
              id="btn-submit-search"
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center justify-center p-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-md shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Submit Request"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Expanded Filter Drawer */}
      {showFilters && (
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-2xl space-y-6 mt-4 relative z-10">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="font-bold text-sm sm:text-base text-gray-800 flex items-center gap-2">
              <Filter className="w-5 h-5 text-emerald-500" /> Advanced Criteria
            </h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calorie Range Slider */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" /> Max Calories
                </span>
                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{activeFilters.max_calories} kcal</span>
              </div>
              <input
                id="slider-max-calories"
                type="range"
                min="200"
                max="1200"
                step="50"
                value={activeFilters.max_calories}
                onChange={handleMaxCaloriesChange}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Cook Time Filter */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-bold text-gray-600">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-500" /> Max Time
                </span>
                <span className="text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">{activeFilters.max_cook_time} mins</span>
              </div>
              <input
                id="slider-max-cooktime"
                type="range"
                min="15"
                max="180"
                step="15"
                value={activeFilters.max_cook_time}
                onChange={(e) => setActiveFilters((p) => ({ ...p, max_cook_time: Number(e.target.value) }))}
                className="w-full accent-sky-500 cursor-pointer"
              />
            </div>

            {/* Difficulty Select */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-gray-600 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-purple-500" /> Difficulty Level
              </label>
              <select
                id="select-difficulty"
                value={activeFilters.difficulty}
                onChange={(e) => setActiveFilters((p) => ({ ...p, difficulty: e.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 text-gray-800 border border-gray-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500/50 outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy (Under 20m)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Hard">Hard (Advanced Gourmet)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              id="btn-clear-filters"
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg font-bold transition-colors"
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
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md shadow-emerald-500/20 transition-all"
            >
              Apply Criteria
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
