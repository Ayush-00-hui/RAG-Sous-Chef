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
      <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 text-gray-900 text-xs font-bold tracking-tight">
            <Sparkles className="w-3.5 h-3.5" /> AI Automated RAG Meal Planning
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Personalized Macro-Balanced Meal Plan</h1>
          <p className="text-sm text-gray-500 max-w-2xl font-medium">
            Optimized for your calorie target ({targetCalories} kcal/day) and high-protein nutrition targets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="flex items-center bg-emerald-50 border border-emerald-100 rounded p-1.5 gap-2">
            <span className="text-xs font-bold text-emerald-800 pl-2 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" /> Target:
            </span>
            <input
              type="number"
              value={targetCalories}
              onChange={(e) => setTargetCalories(Number(e.target.value))}
              className="w-20 bg-white border border-emerald-200 rounded px-2.5 py-1 text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              step={100}
              min={1200}
              max={4000}
            />
            <span className="text-xs font-bold text-emerald-600 pr-2">kcal</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Re-Generate Plan'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schedule'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" /> 7-Day Schedule
        </button>
        <button
          onClick={() => setActiveTab('shopping')}
          className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'shopping'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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
              <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-bold text-gray-500">Synthesizing macro-optimized weekly schedule...</p>
            </div>
          ) : mealPlan ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mealPlan.schedule.map((day) => (
                <div
                  key={day.day_number}
                  className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm hover:shadow transition-all"
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs flex items-center justify-center border border-emerald-100">
                        D{day.day_number}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-gray-900 tracking-tight">{day.day_name}</h3>
                        <p className="text-xs text-gray-500 font-medium">Day {day.day_number} Meal Plan</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-900 flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 text-orange-500" /> {day.total_calories} kcal
                      </div>
                      <div className="text-[10px] text-gray-500 font-semibold mt-0.5">
                        P: <span className="text-emerald-600">{day.total_protein_g}g</span> • C:{' '}
                        <span className="text-sky-600">{day.total_carbs_g}g</span> • F:{' '}
                        <span className="text-amber-500">{day.total_fat_g}g</span>
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
                      dayNumber={day.day_number}
                    />
                    {/* Lunch */}
                    <MealRow
                      label="Lunch"
                      recipe={day.meals.lunch}
                      onSelect={() => setSelectedRecipe(day.meals.lunch)}
                      dayNumber={day.day_number}
                    />
                    {/* Dinner */}
                    <MealRow
                      label="Dinner"
                      recipe={day.meals.dinner}
                      onSelect={() => setSelectedRecipe(day.meals.dinner)}
                      dayNumber={day.day_number}
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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-900" /> Integrated Grocery Shopping List
              </h2>
              <p className="text-xs text-gray-500 font-medium mt-1">Consolidated ingredients for your entire weekly plan.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(mealPlan.shopping_list).map(([category, items]: [string, any]) => (
              <div key={category} className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wider border-b border-gray-200 pb-2">
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
                        className={`p-2.5 rounded border text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-gray-200 border-gray-200 text-gray-400 line-through'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 ${isChecked ? 'text-gray-400' : 'text-gray-300'}`}
                          />
                          <span>{itemObj.item}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
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
  dayNumber: number;
}

const BREAKFAST_IMAGES = [
  "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=100&h=100&fit=crop"
];

const LUNCH_IMAGES = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=100&h=100&fit=crop"
];

const DINNER_IMAGES = [
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1544025162-8315ea07f4bb?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=100&h=100&fit=crop"
];

const MealRow: React.FC<MealRowProps> = ({ label, recipe, onSelect, dayNumber }) => {
  let thumbUrl = LUNCH_IMAGES[0];
  let labelColor = "bg-emerald-50 border-emerald-200 text-emerald-700";
  
  if (label === 'Breakfast') {
    thumbUrl = BREAKFAST_IMAGES[(dayNumber - 1) % BREAKFAST_IMAGES.length];
    labelColor = "bg-amber-50 border-amber-200 text-amber-700";
  } else if (label === 'Lunch') {
    thumbUrl = LUNCH_IMAGES[(dayNumber - 1) % LUNCH_IMAGES.length];
    labelColor = "bg-sky-50 border-sky-200 text-sky-700";
  } else if (label === 'Dinner') {
    thumbUrl = DINNER_IMAGES[(dayNumber - 1) % DINNER_IMAGES.length];
    labelColor = "bg-indigo-50 border-indigo-200 text-indigo-700";
  }

  return (
    <div
      onClick={onSelect}
      className="p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow cursor-pointer transition-all flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <img src={thumbUrl} alt="Thumbnail" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded border ${labelColor}`}>
              {label}
            </span>
            <span className="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {recipe.name}
            </span>
          </div>
          <div className="text-[11px] text-gray-500 font-medium flex items-center gap-2">
            <span>{recipe.calories} kcal</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span>{recipe.protein_g}g protein</span>
            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
            <span className="capitalize">{recipe.cuisine}</span>
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 transition-colors shrink-0" />
    </div>
  );
};
