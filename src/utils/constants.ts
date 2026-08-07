export class Constants {
  static readonly DIETARY_OPTIONS = [
    'high-protein',
    'vegan',
    'keto',
    'gluten-free',
    'low-carb',
    'dairy-free',
    'vegetarian',
  ];

  static readonly DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

  static readonly CUISINE_OPTIONS = [
    'Mediterranean',
    'Thai',
    'American',
    'Italian',
    'Asian',
    'Mexican',
    'Indian',
    'International',
  ];

  static readonly DEFAULT_CALORIE_TARGET = 2000;

  static readonly API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';
}

export const DIETARY_OPTIONS = Constants.DIETARY_OPTIONS;
export const DIFFICULTY_LEVELS = Constants.DIFFICULTY_LEVELS;
export const CUISINE_OPTIONS = Constants.CUISINE_OPTIONS;
export const DEFAULT_CALORIE_TARGET = Constants.DEFAULT_CALORIE_TARGET;
export const API_BASE_URL = Constants.API_BASE_URL;
