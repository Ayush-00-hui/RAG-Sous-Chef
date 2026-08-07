"""
nutritionist_advisor.py - Rule-based nutrition advice
"""

import logging
from typing import Dict, List, Any

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class NutritionistAdvisor:
    """Rule-based personalized nutrition advisor"""
    
    def __init__(self, api_key: str = None):
        # API key parameter kept for backwards compatibility but not used
        pass
    
    def get_personalized_advice(self, 
                               user_preferences: Dict[str, Any],
                               meal_plan: List[Dict[str, Any]],
                               health_goals: List[str]) -> str:
        """
        Get rule-based personalized nutrition advice
        """
        dietary_restrictions = user_preferences.get('dietary_restrictions', [])
        calorie_target = user_preferences.get('calorie_target', 2000)
        
        advice = []
        
        # 1. Overall assessment
        advice.append(f"Based on your {calorie_target} kcal target, this plan provides a solid foundation.")
        
        # 2. Goal-specific advice
        if "lose weight" in [g.lower() for g in health_goals]:
            advice.append("To support weight loss, ensure you are drinking plenty of water and incorporating high-fiber vegetables to stay full.")
        if "build muscle" in [g.lower() for g in health_goals]:
            advice.append("For muscle building, prioritize protein intake around your workout times and ensure you are getting enough total calories.")
            
        # 3. Dietary specific advice
        if "vegetarian" in [d.lower() for d in dietary_restrictions] or "vegan" in [d.lower() for d in dietary_restrictions]:
            advice.append("As you follow a plant-based diet, pay attention to complete protein sources by combining legumes and grains, or using soy products.")
            
        if "keto" in [d.lower() for d in dietary_restrictions]:
            advice.append("For keto, ensure you are getting enough healthy fats from avocados, nuts, and olive oil to maintain energy levels.")
            
        advice.append("Tip: Feel free to use the Substitution feature if you are missing any specific ingredients!")
        
        logger.info("✅ Generated rule-based nutrition advice")
        return "\n\n".join(advice)

# Test usage
if __name__ == "__main__":
    advisor = NutritionistAdvisor()
    advice = advisor.get_personalized_advice(
        user_preferences={
            "dietary_restrictions": ["vegetarian"],
            "allergies": ["nuts"],
            "calorie_target": 2000
        },
        meal_plan=[],
        health_goals=["lose weight", "build muscle"]
    )
    print(advice)
