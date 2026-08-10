import React from 'react';
import { Clock, Flame, Star, Bookmark, ChevronRight, Sparkles, Users, ChefHat } from 'lucide-react';
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

  const cuisineColors: Record<string, { bg: string; text: string; border: string; bar: string }> = {
    Mediterranean: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', bar: 'from-teal-400 to-cyan-400' },
    Thai: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', bar: 'from-orange-400 to-amber-400' },
    American: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', bar: 'from-blue-400 to-indigo-400' },
    Italian: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', bar: 'from-green-400 to-emerald-400' },
    Asian: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', bar: 'from-rose-400 to-pink-400' },
    Indian: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', bar: 'from-yellow-400 to-orange-400' },
  };
  const c = cuisineColors[recipe.cuisine] || { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', bar: 'from-gray-400 to-slate-400' };

  const difficultyDot: Record<string, string> = { Easy: 'bg-emerald-400', Medium: 'bg-amber-400', Hard: 'bg-rose-400' };

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelectRecipe(recipe)}
      className="group bg-white border border-gray-200 hover:border-emerald-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Gradient accent bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${c.bar}`} />

      <div className="p-5 flex flex-col flex-1">

        {/* Top Row: Cuisine + Match + Bookmark */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${c.bg} ${c.text} ${c.border}`}>
              {recipe.cuisine}
            </span>
            {recipe.rag_score && (
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {Math.round(recipe.rag_score * 100)}% Match
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
              <span className={`w-2 h-2 rounded-full ${difficultyDot[recipe.difficulty] || 'bg-gray-300'}`} />
              {recipe.difficulty}
            </span>
          </div>
          <button
            id={`btn-fav-${recipe.id}`}
            type="button"
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className={`p-2 rounded-xl transition-all border shrink-0 ${
              isFavorite
                ? 'bg-rose-50 text-rose-500 border-rose-200'
                : 'bg-gray-50 text-gray-300 hover:text-rose-400 border-gray-200 hover:border-rose-200'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2 text-lg leading-snug mb-2">
          {recipe.name}
        </h3>

        {/* Description — show 3 lines instead of 2 */}
        <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-4">
          {recipe.description}
        </p>

        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {recipe.dietary_tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100"
            >
              {tag}
            </span>
          ))}
          {recipe.dietary_tags.length > 4 && (
            <span className="px-2 py-1 text-xs text-gray-400">+{recipe.dietary_tags.length - 4} more</span>
          )}
        </div>

        {/* 4-column Metrics (expanded from 3) */}
        <div className="grid grid-cols-4 gap-2 text-center py-3 bg-gray-50 rounded-xl mb-3">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Cal</div>
            <div className="text-base font-black text-orange-500 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5" />{recipe.calories}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Protein</div>
            <div className="text-base font-black text-violet-600">{recipe.protein_g}g</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Carbs</div>
            <div className="text-base font-black text-sky-600">{recipe.carbs_g}g</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Fat</div>
            <div className="text-base font-black text-amber-500">{recipe.fat_g}g</div>
          </div>
        </div>

        {/* Bottom: Time, Servings, Rating, CTA */}
        <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-gray-700">{totalTime}m</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-gray-700">{recipe.servings} servings</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-amber-600">{recipe.rating}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm group-hover:translate-x-0.5 transition-transform">
            View Recipe <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
