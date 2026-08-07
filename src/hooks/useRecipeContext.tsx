import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Recipe,
  SearchFilters,
  MealPlanResponse,
  UserPreferences,
} from '../types';
import { api } from '../utils/api';

interface RecipeContextType {
  recipes: Recipe[];
  favorites: string[];
  favoriteRecipes: Recipe[];
  userPreferences: UserPreferences;
  selectedRecipe: Recipe | null;
  mealPlan: MealPlanResponse | null;
  searchFilters: SearchFilters;
  searchQuery: string;
  aiSummary: string;
  loading: boolean;
  error: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  executeSearch: (query?: string, filters?: SearchFilters) => Promise<void>;
  toggleFavorite: (recipeId: string, event?: React.MouseEvent) => void;
  isFavorite: (recipeId: string) => boolean;
  generateMealPlan: (days: number, calories?: number) => Promise<void>;
  updateUserPreferences: (newPrefs: Partial<UserPreferences>) => Promise<void>;
}

const defaultFilters: SearchFilters = {
  dietary: [],
  max_calories: 1000,
  max_cook_time: 120,
  difficulty: '',
  cuisine: '',
};

const defaultPreferences: UserPreferences = {
  user_id: 'default_user',
  dietary_restrictions: [],
  allergies: [],
  calorie_target: 2000,
  cuisine_preferences: [],
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['1', '2']);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(defaultFilters);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    executeSearch('', defaultFilters);
    loadUserPreferences();
    loadFavorites();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const prefs = await api.getUserPreferences();
      if (prefs) setUserPreferences(prefs);
    } catch (e) {
      console.warn('Failed to load preferences:', e);
    }
  };

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      if (data && data.recipes) {
        setFavoriteRecipes(data.recipes);
        setFavorites(data.recipes.map((r) => r.id));
      }
    } catch (e) {
      console.warn('Failed to load favorites:', e);
    }
  };

  const executeSearch = async (query: string = searchQuery, filters: SearchFilters = searchFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.search(query, filters);
      setRecipes(res.recipes);
      setAiSummary(res.ai_summary || '');
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to search recipes');
      setLoading(false);
    }
  };

  const toggleFavorite = async (recipeId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();

    const isFav = favorites.includes(recipeId);
    let updatedFavs: string[];

    if (isFav) {
      updatedFavs = favorites.filter((id) => id !== recipeId);
      setFavoriteRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } else {
      updatedFavs = [...favorites, recipeId];
      const targetRecipe = recipes.find((r) => r.id === recipeId);
      if (targetRecipe) {
        setFavoriteRecipes((prev) => [...prev, targetRecipe]);
      }
    }

    setFavorites(updatedFavs);
    try {
      await api.toggleFavorite(recipeId);
    } catch (e) {
      console.warn('Error toggling favorite backend:', e);
    }
  };

  const isFavorite = (recipeId: string) => favorites.includes(recipeId);

  const generateMealPlan = async (days: number = 7, calories: number = userPreferences.calorie_target) => {
    setLoading(true);
    setError(null);
    try {
      const plan = await api.generateMealPlan(days, { dietary: userPreferences.dietary_restrictions }, calories);
      setMealPlan(plan);
      setLoading(false);
    } catch (err: any) {
      setError(err?.message || 'Failed to generate meal plan');
      setLoading(false);
    }
  };

  const updateUserPreferences = async (newPrefs: Partial<UserPreferences>) => {
    try {
      const updated = await api.updatePreferences(newPrefs);
      if (updated && updated.preferences) {
        setUserPreferences(updated.preferences);
      }
    } catch (e) {
      console.warn('Error updating preferences:', e);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favorites,
        favoriteRecipes,
        userPreferences,
        selectedRecipe,
        mealPlan,
        searchFilters,
        searchQuery,
        aiSummary,
        loading,
        error,
        setSearchQuery,
        setSearchFilters,
        setSelectedRecipe,
        executeSearch,
        toggleFavorite,
        isFavorite,
        generateMealPlan,
        updateUserPreferences,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};
