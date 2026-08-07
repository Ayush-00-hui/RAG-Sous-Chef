-- ====================================================================
-- PostgreSQL Database Schema for Recipe & Nutrition Assistant (RAG Engine)
-- ====================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Custom ENUM for Meal Types
DO $$ BEGIN
    CREATE TYPE meal_type_enum AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------------------
-- 1. Table: recipes
-- Stores culinary metadata, vector search source text, and ingredients
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    prep_time INT DEFAULT 15, -- minutes
    cook_time INT DEFAULT 20, -- minutes
    servings INT DEFAULT 2,
    difficulty VARCHAR(32) DEFAULT 'medium',
    cuisine VARCHAR(64) DEFAULT 'International',
    dietary_tags JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) DEFAULT 4.5,
    reviews_count INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 2. Table: nutrition_facts
-- Relational macro/micro nutrient measurements per recipe serving
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nutrition_facts (
    id SERIAL PRIMARY KEY,
    recipe_id VARCHAR(64) NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    calories INT NOT NULL DEFAULT 450,
    protein NUMERIC(5, 1) NOT NULL DEFAULT 25.0, -- grams
    carbs NUMERIC(5, 1) NOT NULL DEFAULT 40.0,   -- grams
    fat NUMERIC(5, 1) NOT NULL DEFAULT 15.0,     -- grams
    fiber NUMERIC(5, 1) DEFAULT 5.0,             -- grams
    sodium NUMERIC(7, 1) DEFAULT 400.0,          -- mg
    sugar NUMERIC(5, 1) DEFAULT 5.0,             -- grams
    per_serving VARCHAR(64) DEFAULT '1 serving',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_recipe_nutrition UNIQUE (recipe_id)
);

-- --------------------------------------------------------------------
-- 3. Table: users
-- User profiles, authentication data, and dietary restriction defaults
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    dietary_restrictions JSONB DEFAULT '[]'::jsonb,
    allergies JSONB DEFAULT '[]'::jsonb,
    calorie_target INT DEFAULT 2000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- 4. Table: favorites
-- Many-to-many relationship tracking user bookmarked recipes
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id VARCHAR(64) NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_favorite UNIQUE (user_id, recipe_id)
);

-- --------------------------------------------------------------------
-- 5. Table: meal_plans
-- Multi-day generated meal plan schedules for users
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS meal_plans (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    recipe_id VARCHAR(64) NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    meal_type meal_type_enum NOT NULL DEFAULT 'lunch',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------------------
-- Performance Indexes
-- --------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_recipes_created_at ON recipes(created_at);
CREATE INDEX IF NOT EXISTS idx_nutrition_recipe_id ON nutrition_facts(recipe_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON favorites(recipe_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date ON meal_plans(user_id, plan_date);

-- GIN Indexes on JSONB fields for rapid dietary and ingredients querying
CREATE INDEX IF NOT EXISTS idx_recipes_dietary_gin ON recipes USING gin (dietary_tags);
CREATE INDEX IF NOT EXISTS idx_recipes_ingredients_gin ON recipes USING gin (ingredients);
