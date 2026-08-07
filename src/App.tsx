import React, { useState } from 'react';
import { RecipeProvider, useRecipeContext } from './hooks/useRecipeContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { MealPlanView } from './components/MealPlanView';
import { SubstitutionsView } from './components/SubstitutionsView';
import { FavoritesView } from './components/FavoritesView';
import { RecipeDetailPage } from './components/RecipeDetailPage';
import { UserPreferencesModal } from './components/UserPreferencesModal';
import { UtensilsCrossed, ShieldCheck, Sparkles } from 'lucide-react';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'planner' | 'swaps' | 'favorites'>('search');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState<boolean>(false);

  const { selectedRecipe, setSelectedRecipe, favorites, isFavorite, toggleFavorite } = useRecipeContext();

  // If a recipe is selected, show full detail page
  if (selectedRecipe) {
    return (
      <RecipeDetailPage
        recipe={selectedRecipe}
        onBack={() => setSelectedRecipe(null)}
        isFavorite={isFavorite(selectedRecipe.id)}
        onToggleFavorite={toggleFavorite}
        onSelectRecipe={setSelectedRecipe}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favorites.length}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
      />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {activeTab === 'search' && (
          <HomePage onNavigateMealPlan={() => setActiveTab('planner')} />
        )}
        {activeTab === 'planner' && <MealPlanView />}
        {activeTab === 'swaps' && <SubstitutionsView />}
        {activeTab === 'favorites' && <FavoritesView />}
      </main>

      {/* User Preferences & Allergies Modal */}
      <UserPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 text-center text-xs text-gray-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-gray-700 font-bold">
          <UtensilsCrossed className="w-4 h-4 text-emerald-600" />
          <span>NutriChef RAG System</span>
        </div>
        <p className="text-gray-400 max-w-md mx-auto">
          Powered by Offline Vector Embeddings for verified macro accuracy and intelligent culinary planning.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Verified Macro Facts
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Offline Vector Search
          </span>
        </div>
      </footer>
    </div>
  );
};

export function App() {
  return (
    <RecipeProvider>
      <MainContent />
    </RecipeProvider>
  );
}

export default App;
