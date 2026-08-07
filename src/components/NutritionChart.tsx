import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { NutritionFacts } from '../types';

interface NutritionChartProps {
  nutrition: NutritionFacts;
}

const COLORS = ['#10b981', '#38bdf8', '#f59e0b']; // Protein (Emerald), Carbs (Sky), Fat (Amber)

export const NutritionChart: React.FC<NutritionChartProps> = ({ nutrition }) => {
  const p = nutrition.per_serving;
  const m = nutrition.macro_distribution;

  const data = [
    { name: 'Protein', value: p.protein_g * 4, grams: p.protein_g, pct: m.protein_percentage },
    { name: 'Carbs', value: p.carbs_g * 4, grams: p.carbs_g, pct: m.carbs_percentage },
    { name: 'Fat', value: p.fat_g * 9, grams: p.fat_g, pct: m.fat_percentage },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> Nutritional Breakdown (Per Serving)
        </h4>
        <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
          {p.calories} kcal
        </span>
      </div>

      {/* Recharts Pie Chart Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-700 p-2 rounded-lg text-xs font-semibold shadow-xl">
                        <p className="text-slate-200">{item.name}</p>
                        <p className="text-emerald-400">{item.grams}g ({item.pct}%)</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Macros Summary List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-300">Protein</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{p.protein_g}g ({m.protein_percentage}%)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400" />
              <span className="text-xs font-semibold text-slate-300">Carbohydrates</span>
            </div>
            <span className="text-xs font-bold text-sky-400">{p.carbs_g}g ({m.carbs_percentage}%)</span>
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-xs font-semibold text-slate-300">Dietary Fat</span>
            </div>
            <span className="text-xs font-bold text-amber-400">{p.fat_g}g ({m.fat_percentage}%)</span>
          </div>
        </div>
      </div>

      {/* Micronutrients Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-800 pt-3">
        <div className="p-2 bg-slate-950/40 rounded-lg">
          <div className="text-slate-400 text-[10px]">Dietary Fiber</div>
          <div className="font-bold text-slate-200">{p.fiber_g}g</div>
        </div>
        <div className="p-2 bg-slate-950/40 rounded-lg">
          <div className="text-slate-400 text-[10px]">Sodium</div>
          <div className="font-bold text-slate-200">{p.sodium_mg}mg</div>
        </div>
        <div className="p-2 bg-slate-950/40 rounded-lg">
          <div className="text-slate-400 text-[10px]">Potassium</div>
          <div className="font-bold text-slate-200">{p.potassium_mg}mg</div>
        </div>
      </div>

      {/* Allergen Warning Banner */}
      {nutrition.allergens && nutrition.allergens.length > 0 ? (
        <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            <strong>Contains Allergens:</strong> {nutrition.allergens.join(', ')}
          </span>
        </div>
      ) : (
        <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No common major allergen triggers detected.</span>
        </div>
      )}
    </div>
  );
};
