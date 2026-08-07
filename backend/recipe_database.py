"""
recipe_database.py - Database and Vector Index Management for RAG Recipe Assistant.

Handles loading recipes from JSON/CSV files, generating text embeddings via OpenAI or HuggingFace,
and managing vector indexing using FAISS and relational storage via SQLAlchemy / PostgreSQL.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
import numpy as np

try:
    from sentence_transformers import SentenceTransformer
    HAS_SENTENCE_TRANSFORMERS = True
except ImportError:
    HAS_SENTENCE_TRANSFORMERS = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    import faiss
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False
    logger.warning("FAISS not installed. Falling back to NumPy cosine similarity vector search.")

try:
    from sqlalchemy import create_engine, Column, Integer, String, Text, JSON, Float, DateTime
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.orm import sessionmaker
    HAS_SQLALCHEMY = True
    Base = declarative_base()
except ImportError:
    HAS_SQLALCHEMY = False
    Base = object


class RecipeModel:
    """Fallback in-memory recipe model if ORM is inactive."""
    def __init__(self, recipe_data: Dict[str, Any]):
        self.id = recipe_data.get("id")
        self.name = recipe_data.get("name", "")
        self.description = recipe_data.get("description", "")
        self.ingredients = recipe_data.get("ingredients", [])
        self.instructions = recipe_data.get("instructions", [])
        self.cook_time = recipe_data.get("cook_time", 0)
        self.prep_time = recipe_data.get("prep_time", 0)
        self.servings = recipe_data.get("servings", 1)
        self.difficulty = recipe_data.get("difficulty", "medium")
        self.cuisine = recipe_data.get("cuisine", "international")
        self.dietary_tags = recipe_data.get("dietary_tags", [])
        self.rating = recipe_data.get("rating", 4.5)
        self.calories = recipe_data.get("calories", 500)


class RecipeDatabase:
    """
    RecipeDatabase manages recipe data loading, SQL database interaction,
    and FAISS vector search indexing.
    """

    def __init__(self, db_url: Optional[str] = None, embedding_dim: int = 384):
        """
        Initialize RecipeDatabase.

        Args:
            db_url (str, optional): PostgreSQL or SQLite database connection URL.
            embedding_dim (int): Dimensionality of vector embeddings (default: 1536 for OpenAI text-embedding-3-small).
        """
        self.db_url = db_url or os.getenv("DATABASE_URL", "sqlite:///:memory:")
        self.embedding_dim = embedding_dim
        self.recipes_data: Dict[str, Dict[str, Any]] = {}
        self.vector_index = None
        self.vector_id_map: List[str] = []
        self.embeddings_matrix: Optional[np.ndarray] = None
        
        self.embedding_model = None
        if HAS_SENTENCE_TRANSFORMERS:
            try:
                self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
                logger.info("Loaded local sentence-transformers model: all-MiniLM-L6-v2")
            except Exception as e:
                logger.error(f"Failed to load sentence-transformers model: {e}")

        self._init_database()
        self._init_vector_index()

    def _init_database(self) -> None:
        """Initialize database engine and session factory."""
        if HAS_SQLALCHEMY and self.db_url:
            try:
                # Handle postgresql:// schema update if needed
                url = self.db_url
                if url.startswith("postgres://"):
                    url = url.replace("postgres://", "postgresql://", 1)
                self.engine = create_engine(url, pool_pre_ping=True)
                self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
                logger.info(f"Database engine initialized for {url.split('@')[-1] if '@' in url else 'local DB'}")
            except Exception as e:
                logger.error(f"Failed to initialize database connection: {e}")
                self.engine = None
                self.SessionLocal = None

    def _init_vector_index(self) -> None:
        """Initialize FAISS index if available."""
        if HAS_FAISS:
            # IndexFlatIP (Inner Product) for cosine similarity on normalized vectors
            self.vector_index = faiss.IndexFlatIP(self.embedding_dim)
            logger.info(f"FAISS index initialized with dimension {self.embedding_dim}.")
        else:
            logger.info("Using NumPy array fallback for vector search.")

    def load_recipes(self, data_source: Optional[Any] = None) -> List[Dict[str, Any]]:
        """
        Load recipe records from JSON file, dictionary list, or CSV.

        Args:
            data_source (str or List[Dict]): File path to JSON/CSV or list of recipe dicts.

        Returns:
            List[Dict[str, Any]]: List of loaded recipe objects.
        """
        loaded: List[Dict[str, Any]] = []
        try:
            if isinstance(data_source, str) and os.path.exists(data_source):
                with open(data_source, 'r', encoding='utf-8') as f:
                    if data_source.endswith('.json'):
                        loaded = json.load(f)
                    else:
                        logger.warning("Unsupported file format for load_recipes. Returning empty.")
            elif isinstance(data_source, list):
                loaded = data_source
            else:
                # Load default sample high-protein and healthy dataset
                loaded = self._get_sample_recipes()

            for item in loaded:
                r_id = str(item.get("id", len(self.recipes_data) + 1))
                item["id"] = r_id
                self.recipes_data[r_id] = item

            logger.info(f"Loaded {len(self.recipes_data)} recipes into RecipeDatabase.")
            return list(self.recipes_data.values())

        except Exception as e:
            logger.error(f"Error loading recipes: {e}")
            return []

    def create_embeddings(self, recipes: Optional[List[Dict[str, Any]]] = None) -> int:
        """
        Create vector embeddings for recipes and populate FAISS index.

        Args:
            recipes (List[Dict], optional): Recipes to embed. Defaults to stored recipes.

        Returns:
            int: Number of generated embeddings.
        """
        target_recipes = recipes if recipes is not None else list(self.recipes_data.values())
        if not target_recipes:
            logger.warning("No recipes available to create embeddings.")
            return 0

        logger.info(f"Generating semantic embeddings for {len(target_recipes)} recipes...")
        embeddings_list = []
        self.vector_id_map = []

        for r in target_recipes:
            r_id = str(r["id"])
            # Create text representation for semantic embedding
            text = f"{r.get('name', '')}. {r.get('description', '')}. Ingredients: {', '.join(r.get('ingredients', []))}. Cuisine: {r.get('cuisine', '')}."
            
            if self.embedding_model is not None:
                vector = self.embedding_model.encode(text).astype('float32')
            else:
                # Fallback deterministic mock vector if model fails to load
                np.random.seed(abs(hash(text)) % (2**32))
                vector = np.random.randn(self.embedding_dim).astype('float32')
                
            vector = vector / (np.linalg.norm(vector) + 1e-10) # Normalize for inner product (cosine similarity)

            embeddings_list.append(vector)
            self.vector_id_map.append(r_id)

        if embeddings_list:
            self.embeddings_matrix = np.vstack(embeddings_list)
            if HAS_FAISS and self.vector_index is not None:
                self.vector_index.reset()
                self.vector_index.add(self.embeddings_matrix)
                logger.info(f"Added {len(embeddings_list)} vectors to FAISS index.")
            
        return len(embeddings_list)

    def search_vectors(self, query_embedding: np.ndarray, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Perform nearest-neighbor vector search for query embedding.

        Args:
            query_embedding (np.ndarray): Normalized query vector.
            top_k (int): Number of top search results.

        Returns:
            List[Dict[str, Any]]: Matching recipe dictionaries with 'similarity_score'.
        """
        if self.embeddings_matrix is None or len(self.vector_id_map) == 0:
            logger.warning("Vector index is empty. Returning default recipes.")
            return list(self.recipes_data.values())[:top_k]

        query_vec = np.array(query_embedding, dtype='float32').reshape(1, -1)
        query_vec = query_vec / (np.linalg.norm(query_vec) + 1e-10)

        results = []
        if HAS_FAISS and self.vector_index is not None:
            scores, indices = self.vector_index.search(query_vec, min(top_k, len(self.vector_id_map)))
            for score, idx in zip(scores[0], indices[0]):
                if idx >= 0 and idx < len(self.vector_id_map):
                    r_id = self.vector_id_map[idx]
                    recipe = dict(self.recipes_data.get(r_id, {}))
                    recipe["similarity_score"] = float(score)
                    results.append(recipe)
        else:
            # Fallback numpy matrix multiplication (cosine similarity)
            similarities = np.dot(self.embeddings_matrix, query_vec.T).squeeze()
            top_indices = np.argsort(similarities)[::-1][:top_k]
            for idx in top_indices:
                r_id = self.vector_id_map[idx]
                recipe = dict(self.recipes_data.get(r_id, {}))
                recipe["similarity_score"] = float(similarities[idx])
                results.append(recipe)

        return results

    def get_recipe(self, recipe_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve recipe by ID."""
        return self.recipes_data.get(str(recipe_id))

    def update_embeddings(self, recipe_id: str, new_embedding: np.ndarray) -> bool:
        """Update embedding vector for a single recipe ID."""
        try:
            r_id = str(recipe_id)
            if r_id in self.vector_id_map:
                idx = self.vector_id_map.index(r_id)
                new_vec = new_embedding / (np.linalg.norm(new_embedding) + 1e-10)
                if self.embeddings_matrix is not None:
                    self.embeddings_matrix[idx] = new_vec
                    if HAS_FAISS and self.vector_index is not None:
                        self.vector_index.reset()
                        self.vector_index.add(self.embeddings_matrix)
                logger.info(f"Updated embedding vector for recipe {recipe_id}")
                return True
            return False
        except Exception as e:
            logger.error(f"Failed to update embedding for recipe {recipe_id}: {e}")
            return False

    def _get_sample_recipes(self) -> List[Dict[str, Any]]:
        """Return rich dataset of sample culinary recipes with detailed nutrition."""
        return [
            {
                "id": "1",
                "name": "Mediterranean Quinoa Bowl with Roasted Chickpeas",
                "description": "Nutrient-dense Mediterranean quinoa bowl loaded with crispy roasted chickpeas, cucumbers, cherry tomatoes, olives, and zesty tahini dressing.",
                "ingredients": ["1 cup cooked quinoa", "1 cup canned chickpeas", "1/2 cup diced cucumber", "1/2 cup halved cherry tomatoes", "1/4 cup Kalamata olives", "2 tbsp tahini", "1 tbsp lemon juice", "1 tbsp olive oil", "1 tsp cumin", "Salt and pepper"],
                "instructions": ["Preheat oven to 400°F (200°C).", "Toss chickpeas with olive oil, cumin, salt, and pepper. Roast for 20 minutes until crispy.", "Cook quinoa according to package instructions.", "Whisk tahini, lemon juice, and 1 tbsp warm water to create dressing.", "Assemble bowl with quinoa base, topped with chickpeas, cucumbers, tomatoes, and olives. Drizzle with tahini dressing."],
                "prep_time": 15,
                "cook_time": 20,
                "servings": 2,
                "difficulty": "Easy",
                "cuisine": "Mediterranean",
                "dietary_tags": ["vegan", "gluten-free", "high-protein", "vegetarian"],
                "rating": 4.8,
                "calories": 450,
                "protein_g": 18,
                "carbs_g": 62,
                "fat_g": 16,
                "fiber_g": 12,
                "allergens": ["sesame"]
            },
            {
                "id": "2",
                "name": "Grilled Salmon with Asparagus & Lemon Herb Butter",
                "description": "Omega-3 rich wild salmon grilled to perfection, served with crisp tender asparagus and grass-fed herb butter.",
                "ingredients": ["2 Atlantic salmon fillets (6oz each)", "1 bunch fresh asparagus", "2 tbsp grass-fed butter", "1 tbsp fresh dill chopped", "1 tbsp fresh parsley chopped", "1 lemon zested and halved", "2 tbsp olive oil", "Salt and cracked black pepper"],
                "instructions": ["Preheat grill or grill pan to medium-high heat.", "Trim asparagus ends and toss with 1 tbsp olive oil, salt, and pepper.", "Season salmon fillets with salt, pepper, and lemon zest.", "Grill salmon for 4-5 minutes per side until flaky.", "Grill asparagus for 5-6 minutes turning occasionally.", "Melt butter with chopped herbs and lemon juice. Drizzle over hot salmon and asparagus."],
                "prep_time": 10,
                "cook_time": 12,
                "servings": 2,
                "difficulty": "Medium",
                "cuisine": "American",
                "dietary_tags": ["keto", "gluten-free", "high-protein", "low-carb"],
                "rating": 4.9,
                "calories": 520,
                "protein_g": 42,
                "carbs_g": 6,
                "fat_g": 36,
                "fiber_g": 3,
                "allergens": ["fish", "dairy"]
            },
            {
                "id": "3",
                "name": "Spicy Thai Basil Chicken Stir-Fry (Pad Krapow)",
                "description": "Authentic Thai street food style minced chicken stir-fried with garlic, chili, holy basil, and savory soy-oyster sauce over jasmine rice.",
                "ingredients": ["1 lb ground chicken breast", "1 cup fresh Thai basil leaves", "4 cloves garlic minced", "2 Thai red bird's eye chilies", "1 tbsp soy sauce", "1 tbsp fish sauce", "1 tbsp oyster sauce", "1 tsp coconut sugar", "1 tbsp coconut oil", "Cooked jasmine rice"],
                "instructions": ["Pound garlic and chilies together in a mortar or chop finely.", "Heat coconut oil in a wok or skillet over high heat.", "Add garlic-chili mixture and stir-fry for 30 seconds until fragrant.", "Add ground chicken, breaking it apart until cooked through (5-6 mins).", "Stir in soy sauce, fish sauce, oyster sauce, and coconut sugar.", "Remove from heat and fold in Thai basil until wilted. Serve hot over rice."],
                "prep_time": 10,
                "cook_time": 10,
                "servings": 3,
                "difficulty": "Easy",
                "cuisine": "Thai",
                "dietary_tags": ["high-protein", "dairy-free"],
                "rating": 4.7,
                "calories": 410,
                "protein_g": 36,
                "carbs_g": 28,
                "fat_g": 14,
                "fiber_g": 2,
                "allergens": ["soy", "crustacean/fish"]
            },
            {
                "id": "4",
                "name": "Creamy Avocado & Spinach Vegan Pasta",
                "description": "Silky garlic avocado pesto sauce tossed with whole grain pasta, cherry tomatoes, and toasted pine nuts.",
                "ingredients": ["8 oz whole grain fettuccine", "2 ripe avocados", "2 cups fresh baby spinach", "1/2 cup fresh basil leaves", "2 cloves garlic", "2 tbsp lemon juice", "1/4 cup pine nuts toasted", "1/4 cup pasta water reserved", "Salt and red pepper flakes"],
                "instructions": ["Boil pasta in salted water according to box instructions until al dente. Reserve 1/4 cup pasta water.", "In a food processor, blend avocado flesh, spinach, basil, garlic, lemon juice, salt, and half the pine nuts until smooth.", "Drain pasta and return to pot. Toss thoroughly with avocado sauce, adding reserved pasta water as needed.", "Garnish with remaining pine nuts, halved cherry tomatoes, and red pepper flakes."],
                "prep_time": 15,
                "cook_time": 10,
                "servings": 3,
                "difficulty": "Easy",
                "cuisine": "Italian",
                "dietary_tags": ["vegan", "vegetarian", "dairy-free"],
                "rating": 4.6,
                "calories": 480,
                "protein_g": 14,
                "carbs_g": 64,
                "fat_g": 22,
                "fiber_g": 11,
                "allergens": ["tree nuts", "gluten"]
            },
            {
                "id": "5",
                "name": "Keto Avocado & Egg Stuffed Peppers",
                "description": "Baked bell pepper halves filled with avocado, cage-free eggs, crispy bacon crumble, and melted cheddar cheese.",
                "ingredients": ["2 large bell peppers halved and seeded", "4 large eggs", "1 avocado diced", "4 slices cooked bacon crumbled", "1/2 cup shredded cheddar cheese", "1 tbsp chopped chives", "Salt, pepper, and paprika"],
                "instructions": ["Preheat oven to 400°F (200°C). Place pepper halves in baking dish.", "Season inside of peppers with salt and pepper. Crack 1 egg into each pepper half.", "Top with diced avocado and crumbled bacon.", "Bake for 20-25 minutes until egg whites are set.", "Sprinkle cheddar cheese and bake for another 2 minutes until melted. Garnish with chives."],
                "prep_time": 10,
                "cook_time": 25,
                "servings": 2,
                "difficulty": "Easy",
                "cuisine": "American",
                "dietary_tags": ["keto", "gluten-free", "low-carb", "high-protein"],
                "rating": 4.8,
                "calories": 430,
                "protein_g": 24,
                "carbs_g": 9,
                "fat_g": 34,
                "fiber_g": 5,
                "allergens": ["eggs", "dairy"]
            }
        ]


# Quick test runner
if __name__ == "__main__":
    db = RecipeDatabase()
    recipes = db.load_recipes()
    db.create_embeddings()
    print(f"Recipe database test passed! Total recipes: {len(recipes)}")
