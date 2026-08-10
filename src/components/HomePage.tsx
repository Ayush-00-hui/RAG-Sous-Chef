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
      {/* Hero Section / Chat UI */}
      <section className={`relative transition-all duration-500 ease-in-out ${searchQuery ? 'pt-8 pb-4 bg-white/50 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-100' : 'pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center bg-white'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {!searchQuery && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" /> Powered by Offline Vector RAG
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight">
                Your AI-Powered <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
                  Sous-Chef
                </span>
              </h1>

              <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                Ask me anything about healthy meals. I use semantic search to find the perfect recipes and calculate your exact nutritional macros offline.
              </p>
            </div>
          )}

          {/* Search Bar Chat Input */}
          <div className="px-4">
            <SearchBar />
          </div>

          {/* Dietary Shortcut Pills (Only show on home) */}
          {!searchQuery && (
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-6 pb-4">
              {['high-protein', 'vegan', 'keto', 'gluten-free', 'low-carb'].map((tag) => {
                const active = (searchFilters.dietary || []).includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleFilterClick(tag)}
                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold capitalize transition-all border ${
                      active
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50/50'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* RAG Synthesis Chat Message */}
      {aiSummary && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in-up">
          <div className="flex gap-4 sm:gap-6 items-start">
            {/* AI Avatar */}
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 border border-emerald-200 z-10">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            
            {/* Chat Bubble */}
            <div className="flex-1 bg-white rounded-3xl rounded-tl-sm shadow-xl shadow-gray-200/50 p-6 sm:p-8 border border-gray-100 relative group transition-all hover:shadow-2xl">
              {/* Little speech triangle */}
              <div className="absolute top-5 -left-3 w-6 h-6 bg-white border-b border-l border-gray-100 transform rotate-45 rounded-sm"></div>
              
              <h3 className="text-xs font-bold text-emerald-600 mb-3 flex items-center gap-2 uppercase tracking-widest">
                <Zap className="w-4 h-4" /> NutriChef AI Analysis
              </h3>
              
              <div className="prose prose-emerald prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed font-medium">
                {aiSummary.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      {!searchQuery && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: '5k+', label: 'Recipes Indexed', sub: 'via RAG Vector DB', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
              { value: '384-D', label: 'Embeddings', sub: 'all-MiniLM-L6-v2', color: 'text-teal-600', bg: 'bg-teal-50 border-teal-100' },
              { value: '20+', label: 'Diet Swaps', sub: 'vegan, keto, GF', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-100' },
              { value: '7-Day', label: 'Meal Planner', sub: 'with shopping list', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
            ].map(s => (
              <div key={s.value} className={`bg-white border rounded-3xl p-5 text-center shadow-sm hover:shadow-md transition-shadow ${s.bg}`}>
                <div className={`text-3xl font-black tracking-tight ${s.color}`}>{s.value}</div>
                <div className="text-sm font-bold text-gray-800 mt-2">{s.label}</div>
                <div className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider font-semibold">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recipe Grid Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        {searchQuery && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-500" />
                Retrieved Context Recipes
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium">
                {recipes.length} verified recipes used to generate the analysis above
              </p>
            </div>
            <button
              onClick={onNavigateMealPlan}
              className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm font-bold border border-emerald-200 flex items-center gap-2 transition-colors shadow-sm"
            >
              Create 7-Day Meal Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

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
