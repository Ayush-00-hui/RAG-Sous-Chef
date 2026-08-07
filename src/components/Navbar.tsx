import React from 'react';
import { UtensilsCrossed, Calendar, Bookmark, Sliders, Repeat, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'search' | 'planner' | 'swaps' | 'favorites';
  setActiveTab: (tab: 'search' | 'planner' | 'swaps' | 'favorites') => void;
  favoritesCount: number;
  onOpenPreferences: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenPreferences,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Brand Title */}
        <div 
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-emerald-200 to-teal-300 bg-clip-text text-transparent">
              NutriChef RAG
            </h1>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              AI Recipe & Nutrition Assistant
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-tab-search"
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline">Recipes</span>
          </button>

          <button
            id="nav-tab-planner"
            onClick={() => setActiveTab('planner')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'planner'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline">7-Day Planner</span>
          </button>

          <button
            id="nav-tab-swaps"
            onClick={() => setActiveTab('swaps')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'swaps'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span className="hidden md:inline">Substitutions</span>
          </button>

          <button
            id="nav-tab-favorites"
            onClick={() => setActiveTab('favorites')}
            className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden md:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-emerald-500 text-slate-950 rounded-full">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Preferences Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-open-preferences"
            onClick={onOpenPreferences}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 border border-slate-700/60 transition-all shadow-sm"
            title="Dietary Preferences & Allergy Settings"
          >
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">Preferences</span>
          </button>
        </div>

      </div>
    </header>
  );
};
