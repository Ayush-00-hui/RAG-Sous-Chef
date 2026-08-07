import React from 'react';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Search,
  BookOpen,
  Award,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
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
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" /> AI Vector RAG Recipe & Nutrition Engine
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-tight">
          Precision Culinary Intelligence & <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400">Macro RAG Engine</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Ask complex culinary prompts, discover verified macro profiles, generate instant dietary ingredient substitutions, and build 7-day personalized meal plans.
        </p>

        {/* Search Bar Component */}
        <div className="pt-4 max-w-3xl mx-auto">
          <SearchBar />
        </div>

        {/* Dietary Shortcut Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {['high-protein', 'vegan', 'keto', 'gluten-free', 'low-carb'].map((tag) => {
            const active = (searchFilters.dietary || []).includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleFilterClick(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                  active
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {tag}
              </button>
            );
          })}
        </div>
      </section>

      {/* RAG Synthesis Summary Box (if present) */}
      {aiSummary && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 flex items-start gap-4 shadow-xl">
            <div className="p-2.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider">
                RAG Vector Search Synthesis
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{aiSummary}</p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 text-center">
          <div>
            <div className="text-2xl font-black text-emerald-400">10,000+</div>
            <div className="text-xs text-slate-400 font-medium">RAG Indexed Recipes</div>
          </div>
          <div>
            <div className="text-2xl font-black text-sky-400">99.4%</div>
            <div className="text-xs text-slate-400 font-medium">Macro Precision Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-black text-purple-400">Instant</div>
            <div className="text-xs text-slate-400 font-medium">Allergen & Ingredient Swaps</div>
          </div>
          <div>
            <div className="text-2xl font-black text-amber-400">7-Day</div>
            <div className="text-xs text-slate-400 font-medium">Automated Meal Plans</div>
          </div>
        </div>
      </section>

      {/* Main Recipe Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Recommended Culinary Discoveries'}
            </h2>
            <p className="text-xs text-slate-400">Showing {recipes.length} verified recipes with full nutritional facts.</p>
          </div>

          <button
            onClick={onNavigateMealPlan}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-2 transition-colors"
          >
            Create 7-Day Meal Plan <ArrowRight className="w-4 h-4 text-emerald-400" />
          </button>
        </div>

        {/* Loading Spinner State */}
        {loading && (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-medium">Querying Vector RAG Database...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-center text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No matching recipes found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try loosening search filters or asking a broader query like "healthy chicken" or "keto dinner".
            </p>
          </div>
        )}

        {/* Recipe Cards Grid */}
        {!loading && recipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={isFavorite(recipe.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={setSelectedRecipe}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
