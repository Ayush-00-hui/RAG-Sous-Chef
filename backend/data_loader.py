"""
data_loader.py - Load Spoonacular recipes into PostgreSQL
Usage: python backend/data_loader.py --source spoonacular
"""

import json
import os
import logging
from typing import List, Dict, Any
from recipe_database import RecipeDatabase

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def load_spoonacular_recipes(json_path: str = "data/recipes.json") -> List[Dict[str, Any]]:
    """Transform Spoonacular JSON to our schema"""
    
    if not os.path.exists(json_path):
        logger.error(f"File not found: {json_path}")
        return []
    
    logger.info(f"Loading recipes from {json_path}...")
    
    with open(json_path, 'r', encoding='utf-8') as f:
        spoonacular_data = json.load(f)
    
    transformed = []
    for recipe in spoonacular_data[:5000]:  # First 5000
        try:
            # Extract nutrition data
            nutrition = recipe.get("nutrition", {})
            
            # Extract cuisine (first one or default)
            cuisines = recipe.get("cuisines", [])
            cuisine = cuisines[0] if cuisines else "International"
            
            # Estimate difficulty based on time
            total_time = recipe.get("preparationMinutes", 0) + recipe.get("cookingMinutes", 0)
            if total_time < 20:
                difficulty = "Easy"
            elif total_time < 45:
                difficulty = "Medium"
            else:
                difficulty = "Hard"
            
            # Transform to our schema
            transformed_recipe = {
                "id": str(recipe.get("id", f"sp_{len(transformed)}")),
                "name": recipe.get("title", "Unknown"),
                "description": recipe.get("summary", "").replace("<b>", "").replace("</b>", ""),
                "ingredients": [
                    {
                        "name": ing.get("name", ""),
                        "amount": ing.get("amount", {}).get("us", {}).get("value", 0),
                        "unit": ing.get("amount", {}).get("us", {}).get("unit", "")
                    }
                    for ing in recipe.get("extendedIngredients", [])
                ],
                "instructions": [
                    step.get("step", "") 
                    for step in recipe.get("analyzedInstructions", [{}])[0].get("steps", [])
                ],
                "prep_time": recipe.get("preparationMinutes", 0),
                "cook_time": recipe.get("cookingMinutes", 0),
                "servings": recipe.get("servings", 1),
                "difficulty": difficulty,
                "cuisine": cuisine,
                "dietary_tags": recipe.get("diets", []),
                "rating": recipe.get("rating", 4.0),
                "calories": int(nutrition.get("calories", 0)),
                "protein_g": float(nutrition.get("protein", 0).replace("g", "") if isinstance(nutrition.get("protein", "0"), str) else nutrition.get("protein", 0)),
                "carbs_g": float(nutrition.get("carbohydrates", 0).replace("g", "") if isinstance(nutrition.get("carbohydrates", "0"), str) else nutrition.get("carbohydrates", 0)),
                "fat_g": float(nutrition.get("fat", 0).replace("g", "") if isinstance(nutrition.get("fat", "0"), str) else nutrition.get("fat", 0)),
                "fiber_g": float(nutrition.get("fiber", 0).replace("g", "") if isinstance(nutrition.get("fiber", "0"), str) else nutrition.get("fiber", 0)),
                "allergens": recipe.get("allergens", []),
                "image_url": recipe.get("image", ""),
                "source_url": recipe.get("sourceUrl", "")
            }
            
            transformed.append(transformed_recipe)
        except Exception as e:
            logger.warning(f"Skipping recipe {recipe.get('id')}: {e}")
            continue
    
    logger.info(f"✅ Transformed {len(transformed)} recipes")
    return transformed

def load_into_database(recipes: List[Dict[str, Any]]) -> bool:
    """Load transformed recipes into PostgreSQL"""
    try:
        db = RecipeDatabase()
        db.load_recipes(recipes)
        db.create_embeddings(recipes)
        logger.info(f"✅ Successfully loaded {len(recipes)} recipes into database")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to load recipes: {e}")
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default="spoonacular", help="Data source")
    parser.add_argument("--json-path", default="data/recipes.json", help="Path to JSON file")
    args = parser.parse_args()
    
    recipes = load_spoonacular_recipes(args.json_path)
    success = load_into_database(recipes)
    
    if success:
        print("✅ Data loading complete!")
    else:
        print("❌ Data loading failed - check logs")
