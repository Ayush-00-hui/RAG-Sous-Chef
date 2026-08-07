"""
pricing_analyzer.py - Real ingredient pricing from Open Food Facts API
"""

import requests
import logging
from typing import Dict, List, Optional
from functools import lru_cache

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PricingAnalyzer:
    """Analyze meal costs using Open Food Facts data"""
    
    BASE_URL = "https://world.openfoodfacts.org/cgi/search.pl"
    
    def __init__(self):
        self.price_cache = {}
    
    @lru_cache(maxsize=500)
    def get_ingredient_price(self, ingredient_name: str, quantity: float = 1) -> Dict[str, float]:
        """
        Get ingredient price from Open Food Facts
        Returns: {"price": 2.50, "currency": "USD", "unit": "100g"}
        """
        
        try:
            response = requests.get(self.BASE_URL, params={
                "search_terms": ingredient_name,
                "json": 1,
                "fields": "name,price,price_per_unit,quantity"
            }, timeout=5)
            
            data = response.json()
            
            if data.get("products"):
                product = data["products"][0]
                price = float(product.get("price", 0) or 0)
                
                return {
                    "ingredient": ingredient_name,
                    "price": price,
                    "currency": "USD",
                    "available": True
                }
            
            return {
                "ingredient": ingredient_name,
                "price": 0,
                "currency": "USD",
                "available": False
            }
        
        except Exception as e:
            logger.warning(f"Could not fetch price for {ingredient_name}: {e}")
            return {"ingredient": ingredient_name, "price": 0, "available": False}
    
    def estimate_recipe_cost(self, recipe: Dict) -> Dict:
        """Estimate total cost of a recipe"""
        
        ingredients = recipe.get("ingredients", [])
        total_cost = 0
        ingredient_costs = []
        
        for ingredient in ingredients:
            cost_info = self.get_ingredient_price(ingredient.get("name", ""))
            ingredient_costs.append({
                "name": ingredient.get("name"),
                "cost": cost_info.get("price", 0)
            })
            total_cost += cost_info.get("price", 0)
        
        servings = recipe.get("servings", 1)
        
        return {
            "recipe_name": recipe.get("name", "Unknown"),
            "total_cost": round(total_cost, 2),
            "cost_per_serving": round(total_cost / servings, 2),
            "currency": "USD",
            "ingredient_breakdown": ingredient_costs,
            "estimate_accuracy": "medium"  # Based on Open Food Facts data
        }
