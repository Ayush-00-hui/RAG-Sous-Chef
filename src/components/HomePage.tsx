import React from 'react';
import { Sparkles, Zap, Search, BookOpen, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { RecipeCard } from './RecipeCard';
import { useRecipeContext } from '../hooks/useRecipeContext';
import { motion } from 'motion/react';

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
      <section className={`relative transition-all duration-500 ease-in-out ${searchQuery ? 'pt-8 pb-4 bg-white sticky top-0 z-40 border-b border-gray-100' : 'pt-24 pb-16 px-4 sm:px-6 lg:px-8 text-center bg-white'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {!searchQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-gray-100 text-gray-700 text-xs sm:text-sm font-bold tracking-tight mb-2">
                Powered by Offline Vector RAG
              </div>

              <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight leading-tight"
              >
                Your <span style={{ fontFamily: 'var(--font-serif)' }} className="italic font-normal text-gray-800">AI-Powered</span> <br />
                <span style={{ fontFamily: 'var(--font-script)' }} className="text-7xl sm:text-8xl text-emerald-600 font-normal block mt-2">Sous-Chef</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed font-medium"
              >
                Ask me anything about healthy meals. I use semantic search to find the perfect recipes and calculate your exact nutritional macros offline.
              </motion.p>
            </motion.div>
          )}

          {/* Search Bar Chat Input */}
          <motion.div 
            initial={searchQuery ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="px-4"
          >
            <SearchBar />
          </motion.div>

          {/* Dietary Shortcut Pills (Only show on home) */}
          {!searchQuery && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-4"
            >
              {['high-protein', 'vegan', 'keto', 'gluten-free', 'low-carb'].map((tag) => {
                const active = (searchFilters.dietary || []).includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => handleFilterClick(tag)}
                    className={`px-4 py-1.5 rounded text-sm font-bold capitalize transition-colors border ${
                      active
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* RAG Synthesis Chat Message */}
      {aiSummary && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-fade-in-up">
          <div className="flex gap-4 sm:gap-6 items-start">
            {/* AI Avatar */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-gray-900 flex items-center justify-center shrink-0 z-10">
              <Zap className="w-5 h-5 text-white" />
            </div>
            
            {/* Chat Bubble */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-5 sm:p-7 relative transition-all">
              {/* Little speech triangle */}
              <div className="absolute top-4 -left-2.5 w-5 h-5 bg-white border-b border-l border-gray-200 transform rotate-45 rounded-sm"></div>
              
              <h3 className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-widest">
                Analysis
              </h3>
              
              <div className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed font-medium">
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
              { value: '5k+', label: 'Recipes Indexed', sub: 'via RAG Vector DB' },
              { value: '384-D', label: 'Embeddings', sub: 'all-MiniLM-L6-v2' },
              { value: '20+', label: 'Diet Swaps', sub: 'vegan, keto, GF' },
              { value: '7-Day', label: 'Meal Planner', sub: 'with shopping list' },
            ].map(s => (
              <div key={s.value} className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm">
                <div className="text-3xl font-black tracking-tight text-gray-900">{s.value}</div>
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
