import React, { useState, useEffect } from 'react';
import { X, Clock, Flame, ChefHat, Users, CheckCircle, Repeat, Sparkles, Bookmark } from 'lucide-react';
import { Recipe, NutritionFacts, SubstitutionResponse } from '../types';
import { NutritionChart } from './NutritionChart';
import { API_BASE_URL } from '../utils/constants';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  if (!recipe) return null;

  const [activeTab, setActiveTab] = useState<'instructions' | 'nutrition' | 'substitutions'>('instructions');
  const [selectedIngredient, setSelectedIngredient] = useState<string>('');
  const [substitutionData, setSubstitutionData] = useState<SubstitutionResponse | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(null);

  // Fetch Nutrition facts and Similar recipes
  useEffect(() => {
    if (!recipe) return;

    fetch(`${API_BASE_URL}/recipe/${recipe.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.nutrition_facts) setNutritionFacts(data.nutrition_facts);
        if (data.similar_recipes) setSimilarRecipes(data.similar_recipes);
      })
      .catch((err) => console.error('Failed to fetch recipe details:', err));
  }, [recipe.id]);

  const handleFetchSubstitution = (ingredient: string) => {
    setSelectedIngredient(ingredient);
    setSubLoading(true);
    setActiveTab('substitutions');

    fetch(`${API_BASE_URL}/substitutions/${encodeURIComponent(ingredient)}?recipe_id=${recipe.id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubstitutionData(data);
        setSubLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch substitutions:', err);
        setSubLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header */}
        <div className="p-6 bg-slate-900 border-b border-slate-800 flex items-start justify-between gap-4 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {recipe.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {recipe.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-100">{recipe.name}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => onToggleFavorite(recipe.id, e)}
              className={`p-2.5 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-100 border border-slate-700'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 rounded-xl transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Metrics Quick Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 rounded-2xl border border-slate-800 text-center">
            <div>
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Calories
              </div>
              <div className="text-base font-extrabold text-amber-400">{recipe.calories} kcal</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Prep / Cook
              </div>
              <div className="text-base font-extrabold text-sky-400">{recipe.prep_time}m / {recipe.cook_time}m</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Servings
              </div>
              <div className="text-base font-extrabold text-emerald-400">{recipe.servings} Yield</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
                <ChefHat className="w-3.5 h-3.5 text-purple-400" /> Protein
              </div>
              <div className="text-base font-extrabold text-purple-400">{recipe.protein_g}g</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 gap-4 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('instructions')}
              className={`pb-3 transition-colors ${
                activeTab === 'instructions'
                  ? 'text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Preparation & Ingredients
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`pb-3 transition-colors ${
                activeTab === 'nutrition'
                  ? 'text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nutrition Facts
            </button>
            <button
              onClick={() => setActiveTab('substitutions')}
              className={`pb-3 transition-colors ${
                activeTab === 'substitutions'
                  ? 'text-emerald-400 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ingredient Swaps
            </button>
          </div>

          {/* Tab 1: Preparation & Ingredients */}
          {activeTab === 'instructions' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Ingredients Column */}
              <div className="space-y-3 md:col-span-1 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Ingredients ({recipe.ingredients.length})
                </h3>
                <p className="text-[11px] text-slate-400">Click any ingredient to find instant dietary substitutes.</p>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleFetchSubstitution(ing)}
                      className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-xs text-slate-300 hover:text-emerald-300 cursor-pointer transition-colors flex items-center justify-between group"
                    >
                      <span>{ing}</span>
                      <Repeat className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions Steps Column */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-emerald-400" /> Step-by-Step Instructions
                </h3>
                <ol className="space-y-3">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="p-4 bg-slate-950/40 rounded-2xl border border-slate-800/80 flex gap-4">
                      <span className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

            </div>
          )}

          {/* Tab 2: Nutrition Chart */}
          {activeTab === 'nutrition' && (
            <div>
              {nutritionFacts ? (
                <NutritionChart nutrition={nutritionFacts} />
              ) : (
                <div className="p-8 text-center text-slate-400 text-sm">Loading nutrition facts...</div>
              )}
            </div>
          )}

          {/* Tab 3: Ingredient Substitutions */}
          {activeTab === 'substitutions' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h3 className="font-bold text-sm text-slate-200 mb-1">
                  Culinary Ingredient Substitution Engine
                </h3>
                <p className="text-xs text-slate-400">
                  Select an ingredient from the recipe list to view healthy, vegan, keto, or allergen-free substitutes.
                </p>
              </div>

              {subLoading ? (
                <div className="p-8 text-center text-slate-400 text-xs">Finding optimal culinary substitutes...</div>
              ) : substitutionData ? (
                <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Target Ingredient:</span>
                    <span className="text-sm font-bold text-emerald-400">{substitutionData.target_ingredient}</span>
                  </div>

                  <div className="space-y-3">
                    {substitutionData.substitutions.map((sub, i) => (
                      <div key={i} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100 text-sm">{sub.substitute}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                            {sub.diet}
                          </span>
                        </div>
                        <div className="text-xs text-emerald-300 font-semibold">Substitution Ratio: {sub.ratio}</div>
                        <p className="text-xs text-slate-400">{sub.notes}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-amber-300/80 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                    💡 <strong>Chef Tip:</strong> {substitutionData.tip}
                  </p>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 text-xs">
                  Click on any ingredient in the Preparation tab to view substitutions here.
                </div>
              )}
            </div>
          )}

          {/* Similar RAG Recipe Suggestions */}
          {similarRecipes.length > 0 && (
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Similar Recommended Recipes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {similarRecipes.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectRecipe(sim)}
                    className="p-3 bg-slate-950/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 cursor-pointer transition-all space-y-1"
                  >
                    <div className="font-bold text-xs text-slate-200 line-clamp-1">{sim.name}</div>
                    <div className="text-[10px] text-slate-400">{sim.calories} kcal • {sim.protein_g}g protein</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
