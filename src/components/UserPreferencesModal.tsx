import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert, Sliders, Flame, Check } from 'lucide-react';
import { useRecipeContext } from '../hooks/useRecipeContext';
import { DIETARY_OPTIONS } from '../utils/constants';

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserPreferencesModal: React.FC<UserPreferencesModalProps> = ({ isOpen, onClose }) => {
  const { userPreferences, updateUserPreferences } = useRecipeContext();

  const [calorieTarget, setCalorieTarget] = useState<number>(userPreferences.calorie_target || 2000);
  const [restrictions, setRestrictions] = useState<string[]>(userPreferences.dietary_restrictions || []);
  const [allergyInput, setAllergyInput] = useState<string>('');
  const [allergies, setAllergies] = useState<string[]>(userPreferences.allergies || []);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCalorieTarget(userPreferences.calorie_target || 2000);
      setRestrictions(userPreferences.dietary_restrictions || []);
      setAllergies(userPreferences.allergies || []);
      setSaved(false);
    }
  }, [isOpen, userPreferences]);

  if (!isOpen) return null;

  const toggleRestriction = (option: string) => {
    setRestrictions((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      setAllergies([...allergies, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleSave = async () => {
    await updateUserPreferences({
      calorie_target: calorieTarget,
      dietary_restrictions: restrictions,
      allergies,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">User Dietary Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Calorie Target */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" /> Daily Target Calories (kcal)
          </label>
          <input
            type="number"
            value={calorieTarget}
            onChange={(e) => setCalorieTarget(Number(e.target.value))}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
            step={50}
            min={1000}
            max={5000}
          />
        </div>

        {/* Dietary Restrictions */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Dietary Preferences</label>
          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((opt) => {
              const active = restrictions.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleRestriction(opt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    active
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Allergies */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" /> Specific Food Allergies
          </label>
          <form onSubmit={handleAddAllergy} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Peanuts, Shellfish, Soy..."
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700"
            >
              Add
            </button>
          </form>

          {allergies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {allergies.map((a) => (
                <span
                  key={a}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5"
                >
                  {a}
                  <X className="w-3 h-3 cursor-pointer hover:text-rose-100" onClick={() => removeAllergy(a)} />
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Preferences Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
};
