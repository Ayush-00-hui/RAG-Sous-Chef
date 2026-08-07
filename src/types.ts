export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | string;
  cuisine: string;
  dietary_tags: string[];
  rating: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  allergens?: string[];
  rag_score?: number;
  similarity_score?: number;
}

export interface SearchFilters {
  dietary: string[];
  max_calories: number;
  max_cook_time: number;
  difficulty: string;
  cuisine: string;
}

export interface MacroDistribution {
  protein_percentage: number;
  carbs_percentage: number;
  fat_percentage: number;
}

export interface NutritionFacts {
  recipe_id: string;
  recipe_name: string;
  servings: number;
  per_serving: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    sugar_g: number;
    sodium_mg: number;
    potassium_mg: number;
  };
  macro_distribution: MacroDistribution;
  allergens: string[];
  dietary_compliance: string[];
}

export interface Meal {
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
}

export interface DayPlan {
  day_number: number;
  day_name: string;
  meals: Meal;
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  target_delta: number;
  nutrition_note?: string;
}

export interface ShoppingCategoryItem {
  item: string;
  frequency: number;
}

export interface ShoppingList {
  [category: string]: ShoppingCategoryItem[];
}

export interface MealPlanResponse {
  plan_days: number;
  target_daily_calories: number;
  preferences: Record<string, any>;
  schedule: DayPlan[];
  shopping_list: ShoppingList;
}

export interface SubstitutionItem {
  substitute: string;
  ratio: string;
  diet: string;
  notes: string;
}

export interface SubstitutionResponse {
  target_ingredient: string;
  recipe_context?: string;
  substitutions: SubstitutionItem[];
  tip: string;
}

export interface UserPreferences {
  user_id: string;
  dietary_restrictions: string[];
  allergies: string[];
  calorie_target: number;
  cuisine_preferences: string[];
}

export interface SearchResponse {
  query: string;
  total_matches: number;
  filters_applied: SearchFilters;
  recipes: Recipe[];
  ai_summary: string;
}

export interface APIResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: string;
}
