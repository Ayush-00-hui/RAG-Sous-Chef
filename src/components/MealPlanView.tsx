import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  ShoppingBag,
  Flame,
  Zap,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
  Utensils,
  Sliders,
} from 'lucide-react';
import { useRecipeContext } from '../hooks/useRecipeContext';
import { Recipe } from '../types';

export const MealPlanView: React.FC = () => {
  const { mealPlan, generateMealPlan, setSelectedRecipe, userPreferences, loading } = useRecipeContext();
  const [activeTab, setActiveTab] = useState<'schedule' | 'shopping'>('schedule');
  const [daysCount, setDaysCount] = useState<number>(7);
  const [targetCalories, setTargetCalories] = useState<number>(userPreferences.calorie_target || 2000);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!mealPlan) {
      generateMealPlan(daysCount, targetCalories);
    }
  }, []);

  const handleGenerate = () => {
    generateMealPlan(daysCount, targetCalories);
  };

  const toggleCheck = (itemKey: string) => {
    setCheckedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> AI Automated RAG Meal Planning
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100">Personalized Macro-Balanced Meal Plan</h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Optimized for your calorie target ({targetCalories} kcal/day) and high-protein nutrition targets.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1.5 gap-2">
            <span className="text-xs font-semibold text-slate-400 pl-2 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Target:
            </span>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-20 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              step={100}
              min={1200}
              max={4000}
            />
            <span className="text-xs text-slate-500 pr-2">kcal</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Re-Generate Plan'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Calendar className="w-4 h-4" /> 7-Day Schedule
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'shopping'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Automated Shopping List
        </button>
      </div>

      {/* Tab 1: 7-Day Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {loading && !mealPlan ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-400">Synthesizing macro-optimized weekly schedule...</p>
            </div>
          ) : mealPlan ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mealPlan.schedule.map((day) => (
                <div
                  key={day.day_number}
                  className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl hover:border-slate-700 transition-all"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-extrabold text-xs flex items-center justify-center">
                        D{day.day_number}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-base text-slate-100">{day.day_name}</h3>
                        <p className="text-xs text-slate-400">Day {day.day_number} Meal Plan</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-amber-400 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5" /> {day.total_calories} kcal
                      </div>
                      <div className="text-[10px] text-slate-400">
                        P: <span className="text-emerald-400 font-semibold">{day.total_protein_g}g</span> • C:{' '}
                        <span className="text-sky-400 font-semibold">{day.total_carbs_g}g</span> • F:{' '}
                        <span className="text-amber-400 font-semibold">{day.total_fat_g}g</span>
                      </div>
                    </div>
                  </div>

                  {/* Meals Breakdown */}
                  <div className="space-y-3">
                    {/* Breakfast */}
                    <MealRow
                      label="Breakfast"
                      recipe={day.meals.breakfast}
                      onSelect={() => setSelectedRecipe(day.meals.breakfast)}
                    />
                    {/* Lunch */}
                    <MealRow
                      label="Lunch"
                      recipe={day.meals.lunch}
                      onSelect={() => setSelectedRecipe(day.meals.lunch)}
                    />
                    {/* Dinner */}
                    <MealRow
                      label="Dinner"
                      recipe={day.meals.dinner}
                      onSelect={() => setSelectedRecipe(day.meals.dinner)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}

      {/* Tab 2: Shopping List */}
      {activeTab === 'shopping' && mealPlan?.shopping_list && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" /> Integrated Grocery Shopping List
              </h2>
              <p className="text-xs text-slate-400">Consolidated ingredients for your entire weekly plan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(mealPlan.shopping_list).map(([category, items]: [string, any]) => (
              <div key={category} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-emerald-400 uppercase tracking-wider border-b border-slate-800/80 pb-2">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {(items as Array<{ item: string; frequency: number }>).map((itemObj, i) => {
                    const key = `${category}-${i}`;
                    const isChecked = checkedItems[key];
                    return (
                      <li
                        key={i}
                        onClick={() => toggleCheck(key)}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-slate-900/50 border-slate-800/50 text-slate-500 line-through'
                            : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-emerald-500/40'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${isChecked ? 'text-emerald-500/40' : 'text-slate-600'}`}
                          />
                          <span>{itemObj.item}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                          x{itemObj.frequency}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface MealRowProps {
  label: string;
  recipe: Recipe;
  onSelect: () => void;
}

const MealRow: React.FC<MealRowProps> = ({ label, recipe, onSelect }) => (
  <div
    onClick={onSelect}
    className="p-3.5 bg-slate-950/60 hover:bg-slate-800/80 rounded-2xl border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between group"
  >
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {label}
        </span>
        <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition-colors">
          {recipe.name}
        </span>
      </div>
      <div className="text-[11px] text-slate-400 flex items-center gap-3">
        <span>{recipe.calories} kcal</span>
        <span>•</span>
        <span>{recipe.protein_g}g protein</span>
        <span>•</span>
        <span className="capitalize">{recipe.cuisine}</span>
      </div>
    </div>
    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
  </div>
);
