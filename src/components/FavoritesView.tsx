import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useRecipeContext } from '../hooks/useRecipeContext';
import { RecipeCard } from './RecipeCard';

export const FavoritesView: React.FC = () => {
  const { favoriteRecipes, isFavorite, toggleFavorite, setSelectedRecipe } = useRecipeContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
          <Bookmark className="w-3.5 h-3.5 fill-rose-300" /> Saved Favorites
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Your Bookmarked Recipes</h1>
        <p className="text-sm text-slate-400">
          Quickly access your saved recipes, macro profiles, and step-by-step instructions anytime.
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8">
          <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">No favorite recipes saved yet</h3>
          <p className="text-xs text-slate-500">
            Click the bookmark icon on any recipe card to save it here for instant access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteRecipes.map((recipe) => (
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
    </div>
  );
};
