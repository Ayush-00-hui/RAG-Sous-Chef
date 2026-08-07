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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo & Brand */}
        <div
          onClick={() => setActiveTab('search')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-200 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="font-black text-base text-gray-900 tracking-tight leading-tight">NutriChef RAG</div>
            <div className="text-[10px] text-gray-400 font-medium hidden sm:block">AI Recipe & Nutrition Assistant</div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="flex items-center gap-1">
          {[
            { id: 'search', label: 'Recipes', icon: Search },
            { id: 'planner', label: '7-Day Planner', icon: Calendar },
            { id: 'swaps', label: 'Substitutions', icon: Repeat },
            { id: 'favorites', label: 'Favorites', icon: Bookmark },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`nav-tab-${id}`}
              onClick={() => setActiveTab(id as any)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === id
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden md:inline">{label}</span>
              {id === 'favorites' && favoritesCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Preferences Button */}
        <button
          id="btn-open-preferences"
          onClick={onOpenPreferences}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 transition-all"
          title="Dietary Preferences & Allergy Settings"
        >
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span className="hidden lg:inline">Preferences</span>
        </button>
      </div>
    </header>
  );
};
