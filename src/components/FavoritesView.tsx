import React from 'react';
import { Bookmark, Sparkles } from 'lucide-react';
import { useRecipeContext } from '../hooks/useRecipeContext';
import { RecipeCard } from './RecipeCard';

export const FavoritesView: React.FC = () => {
  const { favoriteRecipes, isFavorite, toggleFavorite, setSelectedRecipe } = useRecipeContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 space-y-2 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-50 text-rose-700 text-xs font-bold tracking-tight border border-rose-200 shadow-sm">
          <Bookmark className="w-3.5 h-3.5 fill-rose-600 text-rose-600" /> Saved Favorites
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Your Bookmarked Recipes</h1>
        <p className="text-sm text-gray-500 font-medium">
          Quickly access your saved recipes, macro profiles, and step-by-step instructions anytime.
        </p>
      </div>

      {favoriteRecipes.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
          <Bookmark className="w-10 h-10 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No favorite recipes saved yet</h3>
          <p className="text-xs text-gray-500 font-medium">
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
