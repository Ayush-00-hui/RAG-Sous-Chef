import React from 'react';
import { Clock, Flame, Star, Bookmark, ChevronRight, AlertTriangle, Sparkles } from 'lucide-react';
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

  return (
    <div
      id={`recipe-card-${recipe.id}`}
      onClick={() => onSelectRecipe(recipe)}
      className="group relative bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header & Bookmark */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-teal-300 border border-slate-700 uppercase tracking-wider">
              {recipe.cuisine}
            </span>
            {recipe.rag_score && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {Math.round(recipe.rag_score * 100)}% Match
              </span>
            )}
          </div>

          <button
            id={`btn-fav-${recipe.id}`}
            type="button"
            onClick={(e) => onToggleFavorite(recipe.id, e)}
            className={`p-2 rounded-xl transition-all ${
              isFavorite
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-100 border border-slate-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Bookmark recipe'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* Title & Description */}
        <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1.5">
          {recipe.name}
        </h3>
        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
          {recipe.description}
        </p>

        {/* Dietary Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {recipe.dietary_tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
            >
              {tag}
            </span>
          ))}
          {recipe.dietary_tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-500">
              +{recipe.dietary_tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="border-t border-slate-800/80 pt-3 mt-auto space-y-3">
        <div className="grid grid-cols-3 gap-2 text-center py-1.5 bg-slate-950/50 rounded-xl border border-slate-800/50">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Calories</div>
            <div className="text-sm font-extrabold text-amber-400 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5" />
              {recipe.calories}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Protein</div>
            <div className="text-sm font-extrabold text-emerald-400">
              {recipe.protein_g}g
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Time</div>
            <div className="text-sm font-extrabold text-sky-400 flex items-center justify-center gap-0.5">
              <Clock className="w-3.5 h-3.5" />
              {totalTime}m
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <div className="flex items-center gap-1 font-semibold text-amber-300">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {recipe.rating}
          </div>
          <div className="flex items-center gap-1 text-emerald-400 font-bold group-hover:translate-x-1 transition-transform">
            <span>View Recipe</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
