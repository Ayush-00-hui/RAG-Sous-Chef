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
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          <Repeat className="w-3.5 h-3.5" /> AI Ingredient Substitution Engine
        </div>
        <h1 className="text-3xl font-extrabold text-slate-100">Smart Culinary Substitutions</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Instantly replace allergens, high-calorie fats, or non-vegan ingredients while preserving taste and texture.
        </p>

        {/* Input Controls */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              placeholder="Enter ingredient (e.g. eggs, heavy cream, soy sauce)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={() => handleSearch(ingredient)}
            disabled={loading}
            className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" /> Find Swaps
          </button>
        </div>

        {/* Popular Shortcuts */}
        <div className="pt-2 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Popular:</span>
          {POPULAR_INGREDIENTS.map((item) => (
            <button
              key={item}
              onClick={() => handleSearch(item)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Analyzing culinary ratio and texture profile...</p>
        </div>
      ) : result ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              Substitutes for <span className="text-emerald-400">{result.target_ingredient}</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">
              {result.substitutions.length} verified alternatives
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.substitutions.map((sub, i) => (
              <div
                key={i}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-base">{sub.substitute}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {sub.diet}
                  </span>
                </div>

                <div className="text-xs text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-800/30 px-3 py-1.5 rounded-xl inline-block">
                  Substitution Ratio: {sub.ratio}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{sub.notes}</p>
              </div>
            ))}
          </div>

          {result.tip && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3 text-amber-300 text-xs">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">Culinary Tip:</strong> {result.tip}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
