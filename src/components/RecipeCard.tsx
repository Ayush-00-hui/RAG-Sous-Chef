import React from 'react';
import { Clock, Flame, Star, Bookmark, ChevronRight, Sparkles } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  const totalTime = recipe.prep_time + recipe.cook_time;

  const cuisineGradient: Record<string, string> = {
    Mediterranean: 'from-teal-50 to-cyan-50',
    Thai: 'from-orange-50 to-amber-50',
    American: 'from-blue-50 to-indigo-50',
    Italian: 'from-green-50 to-emerald-50',
    Asian: 'from-rose-50 to-pink-50',
    Indian: 'from-yellow-50 to-orange-50',
  };
  const gradient = cuisineGradient[recipe.cuisine] || 'from-gray-50 to-slate-50';

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelectRecipe(recipe)}
      className="group relative bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Card Color Header */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Top Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600 uppercase tracking-wider">
                {recipe.cuisine}
              </span>
              {recipe.rag_score && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {Math.round(recipe.rag_score * 100)}% Match
                </span>
              )}
            </div>
            <button
              id={`btn-fav-${recipe.id}`}
              type="button"
              onClick={(e) => onToggleFavorite(recipe.id, e)}
              className={`p-1.5 rounded-xl transition-all border ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-gray-50 text-gray-300 hover:text-rose-400 border-gray-200 hover:border-rose-200'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Bookmark recipe'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Title & Description */}
          <h3 className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1 mb-1 text-base">
            {recipe.name}
          </h3>
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {recipe.description}
          </p>

          {/* Dietary Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.dietary_tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
              >
                {tag}
              </span>
            ))}
            {recipe.dietary_tags.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] text-gray-400">
                +{recipe.dietary_tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="border-t border-gray-100 pt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2 text-center py-2 bg-gray-50 rounded-xl">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Calories</div>
              <div className="text-sm font-extrabold text-orange-500 flex items-center justify-center gap-0.5">
                <Flame className="w-3 h-3" />{recipe.calories}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Protein</div>
              <div className="text-sm font-extrabold text-violet-600">{recipe.protein_g}g</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Time</div>
              <div className="text-sm font-extrabold text-sky-500 flex items-center justify-center gap-0.5">
                <Clock className="w-3 h-3" />{totalTime}m
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {recipe.rating}
            </div>
            <div className="flex items-center gap-1 text-emerald-600 font-bold group-hover:translate-x-0.5 transition-transform">
              <span>View Recipe</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
