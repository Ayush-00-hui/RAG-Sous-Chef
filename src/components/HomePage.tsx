import React from 'react';
import { Sparkles, Zap, Search, BookOpen, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { RecipeCard } from './RecipeCard';
import { useRecipeContext } from '../hooks/useRecipeContext';

interface HomePageProps {
  onNavigateMealPlan: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateMealPlan }) => {
  const {
    recipes,
    aiSummary,
    loading,
    error,
    searchQuery,
    setSelectedRecipe,
    toggleFavorite,
    isFavorite,
    searchFilters,
    setSearchFilters,
    executeSearch,
  } = useRecipeContext();

  const handleFilterClick = (tag: string) => {
    const current = searchFilters.dietary || [];
    const updated = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag];
    const newFilters = { ...searchFilters, dietary: updated };
    setSearchFilters(newFilters);
    executeSearch(searchQuery, newFilters);
  };

  return (
    <div className="space-y-10 pb-16 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white border-b border-gray-200 pt-12 pb-10 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Offline Vector RAG · Recipe & Nutrition Engine
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Your Personal{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500">
              Culinary AI Assistant
            </span>
          </h1>

          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mt-3">
            Search 5000+ recipes with semantic AI, discover macro profiles, get ingredient swaps, and build 7-day meal plans — all 100% offline.
          </p>

          {/* Search Bar */}
          <div className="pt-5 max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Dietary Shortcut Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {['high-protein', 'vegan', 'keto', 'gluten-free', 'low-carb'].map((tag) => {
              const active = (searchFilters.dietary || []).includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleFilterClick(tag)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
                    active
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  {active ? '✓ ' : '+ '}{tag}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* RAG Synthesis Summary Box */}
      {aiSummary && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border border-emerald-200 rounded-2xl p-5 flex items-start gap-4 shadow-sm">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                RAG Search Analysis
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiSummary}</p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-2xl p-5 text-center shadow-sm">
          <div>
            <div className="text-2xl font-black text-emerald-600">5,000+</div>
            <div className="text-xs text-gray-400 font-medium">Indexed Recipes</div>
          </div>
          <div>
            <div className="text-2xl font-black text-sky-600">Semantic</div>
            <div className="text-xs text-gray-400 font-medium">Vector Search</div>
          </div>
          <div>
            <div className="text-2xl font-black text-violet-600">Instant</div>
            <div className="text-xs text-gray-400 font-medium">Ingredient Swaps</div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">7-Day</div>
            <div className="text-xs text-gray-400 font-medium">Meal Planning</div>
          </div>
        </div>
      </section>

      {/* Recipe Grid Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-500" />
              {searchQuery ? `Results for "${searchQuery}"` : 'Recommended Discoveries'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {recipes.length} verified recipes with full nutritional facts
            </p>
          </div>
          <button
            onClick={onNavigateMealPlan}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-2 transition-colors"
          >
            Create 7-Day Meal Plan <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-gray-400">Querying Offline RAG Engine...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-center text-rose-600 text-sm">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && recipes.length === 0 && (
          <div className="py-16 text-center bg-white border border-gray-200 rounded-2xl p-8 space-y-3">
            <Search className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">No matching recipes found</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Try a different query or broaden your filters.
            </p>
          </div>
        )}

        {/* Recipe Cards */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={toggleFavorite}
                onSelectRecipe={setSelectedRecipe}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
