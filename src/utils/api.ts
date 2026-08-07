import {
  Recipe,
  SearchFilters,
  SearchResponse,
  MealPlanResponse,
  SubstitutionResponse,
  NutritionFacts,
  UserPreferences,
} from '../types';
import { API_BASE_URL } from './constants';

const SAMPLE_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Mediterranean Quinoa Bowl with Roasted Chickpeas',
    description:
      'Nutrient-dense Mediterranean quinoa bowl loaded with crispy roasted chickpeas, cucumbers, cherry tomatoes, olives, and zesty tahini dressing.',
    ingredients: [
      '1 cup cooked quinoa',
      '1 cup canned chickpeas',
      '1/2 cup diced cucumber',
      '1/2 cup halved cherry tomatoes',
      '1/4 cup Kalamata olives',
      '2 tbsp tahini',
      '1 tbsp lemon juice',
      '1 tbsp olive oil',
      '1 tsp cumin',
      'Salt and pepper',
    ],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Toss chickpeas with olive oil, cumin, salt, and pepper. Roast for 20 minutes until crispy.',
      'Cook quinoa according to package instructions.',
      'Whisk tahini, lemon juice, and 1 tbsp warm water to create dressing.',
      'Assemble bowl with quinoa base, topped with chickpeas, cucumbers, tomatoes, and olives. Drizzle with tahini dressing.',
    ],
    prep_time: 15,
    cook_time: 20,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'Mediterranean',
    dietary_tags: ['vegan', 'gluten-free', 'high-protein', 'vegetarian'],
    rating: 4.8,
    calories: 450,
    protein_g: 18,
    carbs_g: 62,
    fat_g: 16,
    fiber_g: 12,
    allergens: ['sesame'],
    rag_score: 0.96,
  },
  {
    id: '2',
    name: 'Grilled Salmon with Asparagus & Lemon Herb Butter',
    description:
      'Omega-3 rich wild salmon grilled to perfection, served with crisp tender asparagus and grass-fed herb butter.',
    ingredients: [
      '2 Atlantic salmon fillets (6oz each)',
      '1 bunch fresh asparagus',
      '2 tbsp grass-fed butter',
      '1 tbsp fresh dill chopped',
      '1 tbsp fresh parsley chopped',
      '1 lemon zested and halved',
      '2 tbsp olive oil',
      'Salt and cracked black pepper',
    ],
    instructions: [
      'Preheat grill or grill pan to medium-high heat.',
      'Trim asparagus ends and toss with 1 tbsp olive oil, salt, and pepper.',
      'Season salmon fillets with salt, pepper, and lemon zest.',
      'Grill salmon for 4-5 minutes per side until flaky.',
      'Grill asparagus for 5-6 minutes turning occasionally.',
      'Melt butter with chopped herbs and lemon juice. Drizzle over hot salmon and asparagus.',
    ],
    prep_time: 10,
    cook_time: 12,
    servings: 2,
    difficulty: 'Medium',
    cuisine: 'American',
    dietary_tags: ['keto', 'gluten-free', 'high-protein', 'low-carb'],
    rating: 4.9,
    calories: 520,
    protein_g: 42,
    carbs_g: 6,
    fat_g: 36,
    fiber_g: 3,
    allergens: ['fish', 'dairy'],
    rag_score: 0.94,
  },
  {
    id: '3',
    name: 'Spicy Thai Basil Chicken Stir-Fry (Pad Krapow)',
    description:
      'Authentic Thai street food style minced chicken stir-fried with garlic, chili, holy basil, and savory soy-oyster sauce over jasmine rice.',
    ingredients: [
      '1 lb ground chicken breast',
      '1 cup fresh Thai basil leaves',
      '4 cloves garlic minced',
      '2 Thai red bird’s eye chilies',
      '1 tbsp soy sauce',
      '1 tbsp fish sauce',
      '1 tbsp oyster sauce',
      '1 tsp coconut sugar',
      '1 tbsp coconut oil',
      'Cooked jasmine rice',
    ],
    instructions: [
      'Pound garlic and chilies together in a mortar or chop finely.',
      'Heat coconut oil in a wok or skillet over high heat.',
      'Add garlic-chili mixture and stir-fry for 30 seconds until fragrant.',
      'Add ground chicken, breaking it apart until cooked through (5-6 mins).',
      'Stir in soy sauce, fish sauce, oyster sauce, and coconut sugar.',
      'Remove from heat and fold in Thai basil until wilted. Serve hot over rice.',
    ],
    prep_time: 10,
    cook_time: 10,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Thai',
    dietary_tags: ['high-protein', 'dairy-free'],
    rating: 4.7,
    calories: 410,
    protein_g: 36,
    carbs_g: 28,
    fat_g: 14,
    fiber_g: 2,
    allergens: ['soy', 'crustacean/fish'],
    rag_score: 0.91,
  },
  {
    id: '4',
    name: 'Creamy Avocado & Spinach Vegan Pasta',
    description:
      'Silky garlic avocado pesto sauce tossed with whole grain pasta, cherry tomatoes, and toasted pine nuts.',
    ingredients: [
      '8 oz whole grain fettuccine',
      '2 ripe avocados',
      '2 cups fresh baby spinach',
      '1/2 cup fresh basil leaves',
      '2 cloves garlic',
      '2 tbsp lemon juice',
      '1/4 cup pine nuts toasted',
      '1/4 cup pasta water reserved',
      'Salt and red pepper flakes',
    ],
    instructions: [
      'Boil pasta in salted water according to box instructions until al dente. Reserve 1/4 cup pasta water.',
      'In a food processor, blend avocado flesh, spinach, basil, garlic, lemon juice, salt, and half the pine nuts until smooth.',
      'Drain pasta and return to pot. Toss thoroughly with avocado sauce, adding reserved pasta water as needed.',
      'Garnish with remaining pine nuts, halved cherry tomatoes, and red pepper flakes.',
    ],
    prep_time: 15,
    cook_time: 10,
    servings: 3,
    difficulty: 'Easy',
    cuisine: 'Italian',
    dietary_tags: ['vegan', 'vegetarian', 'dairy-free'],
    rating: 4.6,
    calories: 480,
    protein_g: 14,
    carbs_g: 64,
    fat_g: 22,
    fiber_g: 11,
    allergens: ['tree nuts', 'gluten'],
    rag_score: 0.88,
  },
  {
    id: '5',
    name: 'Keto Avocado & Egg Stuffed Peppers',
    description:
      'Baked bell pepper halves filled with avocado, cage-free eggs, crispy bacon crumble, and melted cheddar cheese.',
    ingredients: [
      '2 large bell peppers halved and seeded',
      '4 large eggs',
      '1 avocado diced',
      '4 slices cooked bacon crumbled',
      '1/2 cup shredded cheddar cheese',
      '1 tbsp chopped chives',
      'Salt, pepper, and paprika',
    ],
    instructions: [
      'Preheat oven to 400°F (200°C). Place pepper halves in baking dish.',
      'Season inside of peppers with salt and pepper. Crack 1 egg into each pepper half.',
      'Top with diced avocado and crumbled bacon.',
      'Bake for 20-25 minutes until egg whites are set.',
      'Sprinkle cheddar cheese and bake for another 2 minutes until melted. Garnish with chives.',
    ],
    prep_time: 10,
    cook_time: 25,
    servings: 2,
    difficulty: 'Easy',
    cuisine: 'American',
    dietary_tags: ['keto', 'gluten-free', 'low-carb', 'high-protein'],
    rating: 4.8,
    calories: 430,
    protein_g: 24,
    carbs_g: 9,
    fat_g: 34,
    fiber_g: 5,
    allergens: ['eggs', 'dairy'],
    rag_score: 0.93,
  },
];

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.warn(`Fetch error for ${endpoint}, returning fallback context:`, error);
      throw error;
    }
  }

  async search(query: string, filters: SearchFilters): Promise<SearchResponse> {
    try {
      return await this.request<SearchResponse>('/search', {
        method: 'POST',
        body: JSON.stringify({
          query: query || 'healthy recipes',
          filters,
          max_results: 10,
        }),
      });
    } catch {
      // Fallback search logic
      let filtered = SAMPLE_RECIPES;
      if (filters.dietary && filters.dietary.length > 0) {
        filtered = filtered.filter((r) =>
          filters.dietary.every((tag) =>
            r.dietary_tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
          )
        );
        if (filtered.length === 0) filtered = SAMPLE_RECIPES;
      }
      if (filters.max_calories) {
        filtered = filtered.filter((r) => r.calories <= filters.max_calories);
        if (filtered.length === 0) filtered = SAMPLE_RECIPES;
      }

      return {
        query: query || 'healthy recipes',
        total_matches: filtered.length,
        filters_applied: filters,
        recipes: filtered,
        ai_summary: `RAG System found ${filtered.length} matching culinary recommendations with high protein & balanced macros.`,
      };
    }
  }

  async getRecipe(recipe_id: string): Promise<{ recipe: Recipe; nutrition_facts: NutritionFacts; similar_recipes: Recipe[] }> {
    try {
      return await this.request<{ recipe: Recipe; nutrition_facts: NutritionFacts; similar_recipes: Recipe[] }>(
        `/recipe/${recipe_id}`
      );
    } catch {
      const rec = SAMPLE_RECIPES.find((r) => r.id === recipe_id) || SAMPLE_RECIPES[0];
      return {
        recipe: rec,
        nutrition_facts: this.buildFallbackNutrition(rec),
        similar_recipes: SAMPLE_RECIPES.filter((r) => r.id !== rec.id).slice(0, 3),
      };
    }
  }

  async generateMealPlan(days: number, preferences: Record<string, any>, calories_target: number): Promise<MealPlanResponse> {
    try {
      return await this.request<MealPlanResponse>('/meal-plan', {
        method: 'POST',
        body: JSON.stringify({ days, preferences, calories_target }),
      });
    } catch {
      const schedule = Array.from({ length: days }, (_, i) => {
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const b = SAMPLE_RECIPES[i % SAMPLE_RECIPES.length];
        const l = SAMPLE_RECIPES[(i + 1) % SAMPLE_RECIPES.length];
        const d = SAMPLE_RECIPES[(i + 2) % SAMPLE_RECIPES.length];
        const totalCals = b.calories + l.calories + d.calories;

        return {
          day_number: i + 1,
          day_name: dayNames[i % 7],
          meals: { breakfast: b, lunch: l, dinner: d },
          total_calories: totalCals,
          total_protein_g: b.protein_g + l.protein_g + d.protein_g,
          total_carbs_g: b.carbs_g + l.carbs_g + d.carbs_g,
          total_fat_g: b.fat_g + l.fat_g + d.fat_g,
          target_delta: totalCals - calories_target,
          nutrition_note: 'Balanced daily macros targeting high protein and whole foods.',
        };
      });

      return {
        plan_days: days,
        target_daily_calories: calories_target,
        preferences,
        schedule,
        shopping_list: {
          Produce: [
            { item: 'Fresh Spinach', frequency: 3 },
            { item: 'Cherry Tomatoes', frequency: 2 },
            { item: 'Avocados', frequency: 4 },
            { item: 'Asparagus', frequency: 2 },
          ],
          Protein: [
            { item: 'Chicken Breast', frequency: 3 },
            { item: 'Atlantic Salmon Fillets', frequency: 2 },
            { item: 'Chickpeas', frequency: 3 },
          ],
          Pantry: [
            { item: 'Extra Virgin Olive Oil', frequency: 1 },
            { item: 'Quinoa', frequency: 2 },
            { item: 'Tahini', frequency: 1 },
          ],
        },
      };
    }
  }

  async getSubstitutions(ingredient: string, recipe_id?: string): Promise<SubstitutionResponse> {
    try {
      const url = `/substitutions/${encodeURIComponent(ingredient)}${recipe_id ? `?recipe_id=${recipe_id}` : ''}`;
      return await this.request<SubstitutionResponse>(url);
    } catch {
      return {
        target_ingredient: ingredient,
        substitutions: [
          {
            substitute: 'Plant-Based / Organic Alternative',
            ratio: '1:1',
            diet: 'Dietary Swap',
            notes: `Ideal healthy substitute for ${ingredient} maintaining texture and culinary profile.`,
          },
          {
            substitute: 'High-Protein Equivalent',
            ratio: '1:1',
            diet: 'High-Protein',
            notes: 'Adds additional protein density without increasing saturated fats.',
          },
        ],
        tip: `When replacing ${ingredient}, balance total cooking moisture and moisture retention.`,
      };
    }
  }

  async getNutrition(recipe_id: string): Promise<NutritionFacts> {
    try {
      return await this.request<NutritionFacts>(`/nutrition/${recipe_id}`);
    } catch {
      const rec = SAMPLE_RECIPES.find((r) => r.id === recipe_id) || SAMPLE_RECIPES[0];
      return this.buildFallbackNutrition(rec);
    }
  }

  async toggleFavorite(recipe_id: string): Promise<{ action: 'added' | 'removed'; favorites_count: number }> {
    try {
      return await this.request<{ action: 'added' | 'removed'; favorites_count: number }>('/favorites', {
        method: 'POST',
        body: JSON.stringify({ recipe_id }),
      });
    } catch {
      return { action: 'added', favorites_count: 1 };
    }
  }

  async getFavorites(): Promise<{ recipes: Recipe[] }> {
    try {
      return await this.request<{ recipes: Recipe[] }>('/favorites');
    } catch {
      return { recipes: SAMPLE_RECIPES.slice(0, 2) };
    }
  }

  async getUserPreferences(): Promise<UserPreferences> {
    try {
      return await this.request<UserPreferences>('/user/preferences');
    } catch {
      return {
        user_id: 'default_user',
        dietary_restrictions: ['high-protein'],
        allergies: [],
        calorie_target: 2000,
        cuisine_preferences: ['Mediterranean', 'Thai', 'American'],
      };
    }
  }

  async updatePreferences(prefs: Partial<UserPreferences>): Promise<{ status: string; preferences: UserPreferences }> {
    try {
      return await this.request<{ status: string; preferences: UserPreferences }>('/user/preferences', {
        method: 'POST',
        body: JSON.stringify(prefs),
      });
    } catch {
      return {
        status: 'success',
        preferences: {
          user_id: 'default_user',
          dietary_restrictions: prefs.dietary_restrictions || ['high-protein'],
          allergies: prefs.allergies || [],
          calorie_target: prefs.calorie_target || 2000,
          cuisine_preferences: prefs.cuisine_preferences || ['Mediterranean'],
        },
      };
    }
  }

  private buildFallbackNutrition(recipe: Recipe): NutritionFacts {
    const pCal = recipe.protein_g * 4;
    const cCal = recipe.carbs_g * 4;
    const fCal = recipe.fat_g * 9;
    const total = pCal + cCal + fCal || 1;

    return {
      recipe_id: recipe.id,
      recipe_name: recipe.name,
      servings: recipe.servings,
      per_serving: {
        calories: recipe.calories,
        protein_g: recipe.protein_g,
        carbs_g: recipe.carbs_g,
        fat_g: recipe.fat_g,
        fiber_g: recipe.fiber_g,
        sugar_g: 4,
        sodium_mg: 420,
        potassium_mg: 580,
      },
      macro_distribution: {
        protein_percentage: Math.round((pCal / total) * 100),
        carbs_percentage: Math.round((cCal / total) * 100),
        fat_percentage: Math.round((fCal / total) * 100),
      },
      allergens: recipe.allergens || [],
      dietary_compliance: recipe.dietary_tags,
    };
  }
}

export const api = new ApiClient();
