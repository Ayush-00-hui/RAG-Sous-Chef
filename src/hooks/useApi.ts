import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import {
  SearchFilters,
  SearchResponse,
  MealPlanResponse,
  SubstitutionResponse,
  NutritionFacts,
  Recipe,
  UserPreferences,
} from '../types';

export function useApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiCall();
      setLoading(false);
      return res;
    } catch (err: any) {
      const msg = err?.message || 'An unexpected error occurred';
      setError(msg);
      setLoading(false);
      return null;
    }
  }, []);

  const search = useCallback(
    (query: string, filters: SearchFilters): Promise<SearchResponse | null> =>
      execute(() => api.search(query, filters)),
    [execute]
  );

  const getRecipe = useCallback(
    (recipe_id: string): Promise<{ recipe: Recipe; nutrition_facts: NutritionFacts; similar_recipes: Recipe[] } | null> =>
      execute(() => api.getRecipe(recipe_id)),
    [execute]
  );

  const generateMealPlan = useCallback(
    (days: number, preferences: Record<string, any>, calories: number): Promise<MealPlanResponse | null> =>
      execute(() => api.generateMealPlan(days, preferences, calories)),
    [execute]
  );

  const getSubstitutions = useCallback(
    (ingredient: string, recipe_id?: string): Promise<SubstitutionResponse | null> =>
      execute(() => api.getSubstitutions(ingredient, recipe_id)),
    [execute]
  );

  const getNutrition = useCallback(
    (recipe_id: string): Promise<NutritionFacts | null> =>
      execute(() => api.getNutrition(recipe_id)),
    [execute]
  );

  const toggleFavorite = useCallback(
    (recipe_id: string) => execute(() => api.toggleFavorite(recipe_id)),
    [execute]
  );

  const getFavorites = useCallback(
    (): Promise<{ recipes: Recipe[] } | null> => execute(() => api.getFavorites()),
    [execute]
  );

  const getUserPreferences = useCallback(
    (): Promise<UserPreferences | null> => execute(() => api.getUserPreferences()),
    [execute]
  );

  const updatePreferences = useCallback(
    (prefs: Partial<UserPreferences>) => execute(() => api.updatePreferences(prefs)),
    [execute]
  );

  return {
    loading,
    error,
    search,
    getRecipe,
    generateMealPlan,
    getSubstitutions,
    getNutrition,
    toggleFavorite,
    getFavorites,
    getUserPreferences,
    updatePreferences,
  };
}
