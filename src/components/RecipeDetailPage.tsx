import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Clock, Flame, ChefHat, Users, Star, Bookmark,
  CheckCircle, Repeat, Sparkles, AlertTriangle, Zap
} from 'lucide-react';
import { Recipe, NutritionFacts, SubstitutionResponse } from '../types';
import { API_BASE_URL } from '../utils/constants';

interface RecipeDetailPageProps {
  recipe: Recipe;
  onBack: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipeId: string, e: React.MouseEvent) => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const RecipeDetailPage: React.FC<RecipeDetailPageProps> = ({
  recipe,
  onBack,
  isFavorite,
  onToggleFavorite,
  onSelectRecipe,
}) => {
  const [activeTab, setActiveTab] = useState<'instructions' | 'nutrition' | 'substitutions'>('instructions');
  const [substitutionData, setSubstitutionData] = useState<SubstitutionResponse | null>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [similarRecipes, setSimilarRecipes] = useState<Recipe[]>([]);
  const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_BASE_URL}/recipe/${recipe.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.nutrition_facts) setNutritionFacts(data.nutrition_facts);
        if (data.similar_recipes) setSimilarRecipes(data.similar_recipes);
      })
      .catch(() => {});
  }, [recipe.id]);

  const handleFetchSubstitution = (ingredient: string) => {
    setSelectedIngredient(ingredient);
    setSubLoading(true);
    setActiveTab('substitutions');
    fetch(`${API_BASE_URL}/substitutions/${encodeURIComponent(ingredient)}?recipe_id=${recipe.id}`)
      .then(res => res.json())
      .then(data => { setSubstitutionData(data); setSubLoading(false); })
      .catch(() => setSubLoading(false));
  };

  const totalTime = recipe.prep_time + recipe.cook_time;

  const difficultyColor: Record<string, string> = {
    Easy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    Hard: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-emerald-600 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Recipes
          </button>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${difficultyColor[recipe.difficulty] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
              {recipe.difficulty}
            </span>
            <button
              onClick={(e) => onToggleFavorite(recipe.id, e)}
              className={`p-2 rounded-xl transition-all border ${
                isFavorite
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-gray-100 text-gray-400 border-gray-200 hover:text-rose-500 hover:bg-rose-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Hero Section */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 px-8 py-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/70 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                {recipe.cuisine}
              </span>
              {recipe.rag_score && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {Math.round(recipe.rag_score * 100)}% RAG Match
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight mb-3">
              {recipe.name}
            </h1>
            <p className="text-gray-600 text-base leading-relaxed max-w-2xl">{recipe.description}</p>

            <div className="flex flex-wrap gap-2 mt-4">
              {recipe.dietary_tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 text-emerald-700 border border-emerald-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-100">
            <div className="flex flex-col items-center py-5 gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Calories
              </div>
              <div className="text-2xl font-black text-orange-500">{recipe.calories}</div>
              <div className="text-[10px] text-gray-400">kcal</div>
            </div>
            <div className="flex flex-col items-center py-5 gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <ChefHat className="w-3.5 h-3.5 text-violet-400" /> Protein
              </div>
              <div className="text-2xl font-black text-violet-600">{recipe.protein_g}g</div>
              <div className="text-[10px] text-gray-400">per serving</div>
            </div>
            <div className="flex flex-col items-center py-5 gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Clock className="w-3.5 h-3.5 text-sky-400" /> Total Time
              </div>
              <div className="text-2xl font-black text-sky-600">{totalTime}m</div>
              <div className="text-[10px] text-gray-400">{recipe.prep_time}m prep + {recipe.cook_time}m cook</div>
            </div>
            <div className="flex flex-col items-center py-5 gap-1">
              <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Serves
              </div>
              <div className="text-2xl font-black text-emerald-600">{recipe.servings}</div>
              <div className="flex items-center gap-0.5 text-[10px] text-amber-500">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {recipe.rating}/5.0
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100">
            {(['instructions', 'nutrition', 'substitutions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3.5 text-sm font-semibold capitalize transition-all ${
                  activeTab === tab
                    ? 'text-emerald-600 border-b-2 border-emerald-500 bg-emerald-50/60'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab === 'instructions' ? '🍳 Preparation' : tab === 'nutrition' ? '📊 Nutrition' : '🔄 Swaps'}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Tab 1: Instructions + Ingredients */}
            {activeTab === 'instructions' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Ingredients */}
                <div className="md:col-span-1">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Ingredients <span className="text-xs font-normal text-gray-400">({recipe.ingredients.length})</span>
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">Click any ingredient to find dietary substitutes.</p>
                  <ul className="space-y-1.5">
                    {recipe.ingredients.map((ing, i) => (
                      <li
                        key={i}
                        onClick={() => handleFetchSubstitution(ing)}
                        className="px-3 py-2.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 rounded-xl text-xs text-gray-700 hover:text-emerald-700 cursor-pointer flex items-center justify-between gap-2 transition-all group"
                      >
                        <span>{ing}</span>
                        <Repeat className="w-3.5 h-3.5 text-gray-300 group-hover:text-emerald-400 transition-colors shrink-0" />
                      </li>
                    ))}
                  </ul>

                  {/* Allergen Warning */}
                  {recipe.allergens && recipe.allergens.length > 0 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-amber-700">Allergens</div>
                        <div className="text-xs text-amber-600">{recipe.allergens.join(', ')}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                    <ChefHat className="w-4 h-4 text-emerald-500" />
                    Step-by-Step Instructions
                  </h3>
                  <ol className="space-y-3">
                    {recipe.instructions.map((step, i) => (
                      <li key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <span className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{step}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Tab 2: Nutrition */}
            {activeTab === 'nutrition' && (
              <div className="space-y-4">
                {nutritionFacts ? (
                  <div className="space-y-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-500" /> Macro Breakdown (per serving)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Calories', value: `${nutritionFacts.per_serving.calories}`, unit: 'kcal', color: 'orange' },
                        { label: 'Protein', value: `${nutritionFacts.per_serving.protein_g}g`, unit: 'macros', color: 'violet' },
                        { label: 'Carbs', value: `${nutritionFacts.per_serving.carbs_g}g`, unit: 'macros', color: 'sky' },
                        { label: 'Fat', value: `${nutritionFacts.per_serving.fat_g}g`, unit: 'macros', color: 'amber' },
                      ].map(m => (
                        <div key={m.label} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                          <div className="text-xs text-gray-400 mb-1">{m.label}</div>
                          <div className="text-2xl font-black text-gray-800">{m.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Fiber', value: `${nutritionFacts.per_serving.fiber_g}g` },
                        { label: 'Sugar', value: `${nutritionFacts.per_serving.sugar_g}g` },
                        { label: 'Sodium', value: `${nutritionFacts.per_serving.sodium_mg}mg` },
                      ].map(m => (
                        <div key={m.label} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex justify-between items-center">
                          <span className="text-sm text-gray-500">{m.label}</span>
                          <span className="font-bold text-gray-800">{m.value}</span>
                        </div>
                      ))}
                    </div>
                    {/* Macro bar */}
                    <div>
                      <div className="text-xs font-semibold text-gray-500 mb-2">Macro Distribution</div>
                      <div className="flex rounded-full overflow-hidden h-3">
                        <div style={{ width: `${nutritionFacts.macro_distribution.protein_percentage}%` }} className="bg-violet-400" />
                        <div style={{ width: `${nutritionFacts.macro_distribution.carbs_percentage}%` }} className="bg-sky-400" />
                        <div style={{ width: `${nutritionFacts.macro_distribution.fat_percentage}%` }} className="bg-amber-400" />
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-400 inline-block" />Protein {nutritionFacts.macro_distribution.protein_percentage}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />Carbs {nutritionFacts.macro_distribution.carbs_percentage}%</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Fat {nutritionFacts.macro_distribution.fat_percentage}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-gray-400 text-sm animate-pulse">Loading nutrition data...</div>
                )}
              </div>
            )}

            {/* Tab 3: Substitutions */}
            {activeTab === 'substitutions' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <h3 className="font-bold text-emerald-800 text-sm mb-1">Ingredient Substitution Engine</h3>
                  <p className="text-xs text-emerald-700">
                    Click any ingredient in the Preparation tab to see healthy, vegan, keto, or allergen-free swaps.
                  </p>
                </div>
                {subLoading && (
                  <div className="py-10 text-center text-gray-400 text-sm animate-pulse">Finding optimal substitutes...</div>
                )}
                {!subLoading && substitutionData && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Replacing:</span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        {substitutionData.target_ingredient}
                      </span>
                    </div>
                    {substitutionData.substitutions.map((sub, i) => (
                      <div key={i} className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800">{sub.substitute}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                            {sub.diet}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-emerald-600">Ratio: {sub.ratio}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{sub.notes}</p>
                      </div>
                    ))}
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                      💡 <strong>Chef Tip:</strong> {substitutionData.tip}
                    </div>
                  </div>
                )}
                {!subLoading && !substitutionData && (
                  <div className="py-16 text-center text-gray-400 text-sm">
                    Go to <strong>Preparation</strong> tab and click any ingredient to see substitutes here.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Similar Recipes */}
        {similarRecipes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" /> You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similarRecipes.map(sim => (
                <div
                  key={sim.id}
                  onClick={() => onSelectRecipe(sim)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{sim.cuisine}</span>
                  </div>
                  <div className="font-bold text-sm text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-1">{sim.name}</div>
                  <div className="text-xs text-gray-400">{sim.calories} kcal · {sim.protein_g}g protein · ⭐ {sim.rating}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
