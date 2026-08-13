import React, { useState } from 'react';
import { Repeat, Sparkles, Search, CheckCircle, Lightbulb } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { SubstitutionResponse } from '../types';

const POPULAR_INGREDIENTS = [
  'Heavy Cream',
  'Butter',
  'Eggs',
  'Soy Sauce',
  'All-Purpose Flour',
  'Sugar',
  'Peanut Butter',
  'Cow Milk',
];

export const SubstitutionsView: React.FC = () => {
  const { getSubstitutions, loading } = useApi();
  const [ingredient, setIngredient] = useState<string>('Heavy Cream');
  const [result, setResult] = useState<SubstitutionResponse | null>(null);

  const handleSearch = async (target: string = ingredient) => {
    if (!target.trim()) return;
    setIngredient(target);
    const data = await getSubstitutions(target);
    if (data) setResult(data);
  };

  React.useEffect(() => {
    handleSearch('Heavy Cream');
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white border-2 border-gray-900 rounded-2xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-100 text-gray-900 text-xs font-bold tracking-tight">
          <Repeat className="w-3.5 h-3.5" /> AI Ingredient Substitution Engine
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Smart Culinary Substitutions</h1>
        <p className="text-sm text-gray-500 max-w-2xl font-medium">
          Instantly replace allergens, high-calorie fats, or non-vegan ingredients while preserving taste and texture.
        </p>

        {/* Input Controls */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Enter ingredient (e.g. eggs, heavy cream, soy sauce)..."
              className="w-full bg-white border-2 border-gray-900 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900 shadow-sm transition-all"
            />
          </div>
          <button
            onClick={() => handleSearch(ingredient)}
            disabled={loading}
            className="px-6 py-2.5 rounded bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-white" /> Find Swaps
          </button>
        </div>

        {/* Popular Shortcuts */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-bold">Popular:</span>
          {POPULAR_INGREDIENTS.map((item) => (
            <button
              key={item}
              onClick={() => handleSearch(item)}
              className="px-2.5 py-1 rounded bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors text-xs font-bold"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-gray-500">Analyzing culinary ratio and texture profile...</p>
        </div>
      ) : result ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              Substitutes for <span className="text-gray-900 underline decoration-gray-300 underline-offset-4">{result.target_ingredient}</span>
            </h2>
            <span className="text-xs font-bold text-gray-500">
              {result.substitutions.length} verified alternatives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.substitutions.map((sub, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base">{sub.substitute}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-white border border-gray-200 text-gray-700">
                    {sub.diet}
                  </span>
                </div>

                <div className="text-xs font-bold bg-white border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg inline-block shadow-sm">
                  Substitution Ratio: {sub.ratio}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed font-medium">{sub.notes}</p>
              </div>
            ))}
          </div>

          {result.tip && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3 text-gray-800 text-xs shadow-sm">
              <Lightbulb className="w-5 h-5 text-gray-900 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-gray-900">Culinary Tip:</strong> {result.tip}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
