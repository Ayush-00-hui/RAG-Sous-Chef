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
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="input-recipe-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recipes, ingredients or macros (e.g., 'high protein salmon', 'keto bowl')..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 text-slate-100 placeholder-slate-400 rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-xl text-sm sm:text-base transition-all"
          />
        </div>

        <button
          id="btn-toggle-filters"
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
            showFilters || activeFilters.dietary.length > 0 || activeFilters.max_calories < 1000
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Filter className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilters.dietary.length > 0 && (
            <span className="px-1.5 py-0.2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full">
              {activeFilters.dietary.length}
            </span>
          )}
        </button>

        <button
          id="btn-submit-search"
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 px-5 sm:px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 shrink-0"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>RAG Search</span>
            </>
          )}
        </button>
      </form>

      {/* Expanded Filter Drawer */}
      {showFilters && (
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" /> Advanced RAG Search Criteria
            </h3>
            <button onClick={() => setShowFilters(false)} className="text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calorie Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" /> Max Calories
                </span>
                <span className="text-emerald-400 font-bold">{activeFilters.max_calories} kcal</span>
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
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" /> Max Total Time
                </span>
                <span className="text-sky-400 font-bold">{activeFilters.max_cook_time} mins</span>
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
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-purple-400" /> Difficulty Level
              </label>
              <select
                id="select-difficulty"
                value={activeFilters.difficulty}
                onChange={(e) => setActiveFilters((p) => ({ ...p, difficulty: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl text-xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">All Difficulties</option>
                <option value="Easy">Easy (Under 20m)</option>
                <option value="Medium">Medium (Standard)</option>
                <option value="Hard">Hard (Advanced Gourmet)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              id="btn-clear-filters"
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              <X className="w-3.5 h-3.5" /> Clear filters
            </button>
            <button
              id="btn-apply-filters"
              type="button"
              onClick={() => {
                onSearch(query, activeFilters);
                setShowFilters(false);
              }}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Apply Filter Criteria
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
