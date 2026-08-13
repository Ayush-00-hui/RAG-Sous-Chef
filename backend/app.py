"""
app.py - Production FastAPI Web Application for RAG Recipe & Nutrition Assistant.

Provides RESTful endpoints for AI vector search, nutrition analysis, ingredient substitutions,
7-day meal planning, bookmarked favorites, and user dietary preferences.
"""

import os
import logging
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, HTTPException, Query, Header, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from recipe_database import RecipeDatabase
from recipe_rag import RecipeRAG
from nutrition_analyzer import NutritionAnalyzer
from meal_planner import MealPlanner

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("recipe_rag_api")

# Shared Core Service Singletons (Initialized in lifespan)
recipe_db = None
recipe_rag = None
nutrition_analyzer = None
meal_planner = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global recipe_db, recipe_rag, nutrition_analyzer, meal_planner
    logger.info("Initializing ML models and database... This may take a moment.")
    recipe_db = RecipeDatabase()
    recipe_rag = RecipeRAG(recipe_db)
    nutrition_analyzer = NutritionAnalyzer(recipe_db)
    meal_planner = MealPlanner(recipe_db)
    logger.info("Initialization complete!")
    yield
    logger.info("Shutting down...")

# Initialize FastAPI App
app = FastAPI(
    title="Recipe & Nutrition Assistant API",
    description="RAG-powered Recipe Search, Nutrition Analyzer, and Meal Planner API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Vercel frontend and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session store for user preferences and favorites (production database fallback)
USER_PREFERENCES_STORE: Dict[str, Dict[str, Any]] = {
    "default_user": {
        "user_id": "default_user",
        "dietary_restrictions": ["high-protein"],
        "allergies": [],
        "calorie_target": 2000,
        "cuisine_preferences": ["Mediterranean", "Thai", "American"]
    }
}

USER_FAVORITES_STORE: Dict[str, List[str]] = {
    "default_user": ["1", "2"]
}


# --- Pydantic Data Validation Schemas ---

class SearchRequest(BaseModel):
    query: str = Field(..., example="high protein low carb salmon")
    filters: Optional[Dict[str, Any]] = Field(default_factory=dict)
    max_results: Optional[int] = Field(default=10, ge=1, le=50)


class MealPlanRequest(BaseModel):
    days: int = Field(default=7, ge=1, le=30)
    preferences: Optional[Dict[str, Any]] = Field(default_factory=dict)
    calories_target: int = Field(default=2000, ge=1000, le=5000)


class FavoriteRequest(BaseModel):
    recipe_id: str = Field(..., example="1")


class UserPreferencesRequest(BaseModel):
    dietary_restrictions: Optional[List[str]] = Field(default_factory=list)
    allergies: Optional[List[str]] = Field(default_factory=list)
    calorie_target: Optional[int] = Field(default=2000, ge=1000, le=5000)
    cuisine_preferences: Optional[List[str]] = Field(default_factory=list)


# --- REST API Endpoints ---

@app.get("/health", summary="Health Check Endpoint")
def health_check():
    """Verify backend API health status."""
    return {
        "status": "healthy",
        "service": "Recipe & Nutrition Assistant RAG API",
        "total_recipes_indexed": len(recipe_db.recipes_data)
    }


@app.post("/api/search", summary="RAG Semantic Search Recipes")
def search_recipes(payload: SearchRequest):
    """
    Perform semantic RAG vector search across recipes with filter criteria.
    """
    try:
        results = recipe_rag.search(
            query=payload.query,
            filters=payload.filters,
            max_results=payload.max_results
        )
        return results
    except Exception as e:
        logger.error(f"Error executing recipe search: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error executing semantic recipe search: {str(e)}"
        )


@app.get("/api/recipe/{recipe_id}", summary="Get Recipe Details")
def get_recipe_by_id(recipe_id: str):
    """Retrieve complete recipe metadata by unique ID."""
    recipe = recipe_db.get_recipe(recipe_id)
    if not recipe:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipe with ID '{recipe_id}' was not found."
        )
    
    similar = recipe_rag.get_similar_recipes(recipe_id, top_k=3)
    nutrition = nutrition_analyzer.get_nutrition_facts(recipe_id)
    
    return {
        "recipe": recipe,
        "nutrition_facts": nutrition,
        "similar_recipes": similar
    }


@app.post("/api/meal-plan", summary="Generate 7-Day Meal Plan")
def generate_meal_plan(payload: MealPlanRequest):
    """Generate multi-day balanced meal plan and categorized shopping list."""
    try:
        plan = meal_planner.generate_meal_plan(
            days=payload.days,
            preferences=payload.preferences,
            calories_target=payload.calories_target
        )
        return plan
    except Exception as e:
        logger.error(f"Error generating meal plan: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate meal plan: {str(e)}"
        )


@app.get("/api/substitutions/{ingredient}", summary="Get Ingredient Substitutions")
def get_substitutions(ingredient: str, recipe_id: Optional[str] = Query(None)):
    """Find culinary swaps and ratio conversions for specified ingredient."""
    try:
        subs = recipe_rag.find_substitutions(ingredient, recipe_id=recipe_id)
        return subs
    except Exception as e:
        logger.error(f"Error retrieving substitutions: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error finding ingredient substitutions: {str(e)}"
        )


@app.get("/api/nutrition/{recipe_id}", summary="Get Nutrition Breakdown")
def get_nutrition_facts(recipe_id: str):
    """Retrieve detailed macronutrients, micronutrients, and allergen warnings."""
    facts = nutrition_analyzer.get_nutrition_facts(recipe_id)
    if "error" in facts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=facts["error"]
        )
    return facts


@app.get("/api/nutrition/compare/{recipe_id1}/{recipe_id2}", summary="Compare Two Recipes")
def compare_nutrition(recipe_id1: str, recipe_id2: str):
    """Compare macros and calories between two recipe IDs."""
    comparison = nutrition_analyzer.compare_recipes(recipe_id1, recipe_id2)
    if "error" in comparison:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=comparison["error"]
        )
    return comparison


@app.post("/api/favorites", summary="Bookmark / Favorite a Recipe")
def toggle_favorite(payload: FavoriteRequest, authorization: Optional[str] = Header(None)):
    """Add or remove a recipe from user favorites list."""
    user_id = "default_user"  # Authenticated user session
    favorites = USER_FAVORITES_STORE.setdefault(user_id, [])

    if payload.recipe_id in favorites:
        favorites.remove(payload.recipe_id)
        action = "removed"
    else:
        favorites.append(payload.recipe_id)
        action = "added"

    favorite_recipes = [recipe_db.get_recipe(rid) for rid in favorites if recipe_db.get_recipe(rid)]

    return {
        "status": "success",
        "action": action,
        "recipe_id": payload.recipe_id,
        "favorites_count": len(favorites),
        "favorite_recipes": favorite_recipes
    }


@app.get("/api/favorites", summary="Get User Favorite Recipes")
def get_user_favorites():
    """Retrieve list of user favorite recipe cards."""
    user_id = "default_user"
    fav_ids = USER_FAVORITES_STORE.get(user_id, [])
    favorite_recipes = [recipe_db.get_recipe(rid) for rid in fav_ids if recipe_db.get_recipe(rid)]
    return {
        "user_id": user_id,
        "total": len(favorite_recipes),
        "recipes": favorite_recipes
    }


@app.get("/api/user/preferences", summary="Get User Preferences")
def get_user_preferences():
    """Retrieve current dietary settings and target goals."""
    user_id = "default_user"
    prefs = USER_PREFERENCES_STORE.get(user_id, {})
    return prefs


@app.post("/api/user/preferences", summary="Update User Preferences")
def update_user_preferences(payload: UserPreferencesRequest):
    """Save user dietary preferences, target calories, and allergies."""
    user_id = "default_user"
    updated = {
        "user_id": user_id,
        "dietary_restrictions": payload.dietary_restrictions,
        "allergies": payload.allergies,
        "calorie_target": payload.calorie_target,
        "cuisine_preferences": payload.cuisine_preferences
    }
    USER_PREFERENCES_STORE[user_id] = updated
    return {
        "status": "success",
        "preferences": updated
    }


# Root API Endpoint
@app.get("/", summary="API Root")
def api_root():
    return {
        "message": "Welcome to Recipe & Nutrition Assistant RAG API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
