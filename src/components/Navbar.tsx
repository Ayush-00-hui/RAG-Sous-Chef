import React from 'react';
import { UtensilsCrossed, Calendar, Bookmark, Sliders, Repeat, Search } from 'lucide-react';
import { motion } from 'motion/react';

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
    <header className="sticky top-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Left Spacer to perfectly center the nav items */}
        <div className="flex-1" />

        {/* Center Nav Links - Gooey Nav */}
        <nav className="flex items-center justify-center gap-1 bg-white/50 backdrop-blur-md border border-white/60 p-1 rounded-xl shadow-sm">
          {[
            { id: 'search', label: 'Recipes', icon: Search },
            { id: 'planner', label: '7-Day Planner', icon: Calendar },
            { id: 'swaps', label: 'Substitutions', icon: Repeat },
            { id: 'favorites', label: 'Favorites', icon: Bookmark },
          ].map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                id={`nav-tab-${id}`}
                onClick={() => setActiveTab(id as any)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors z-10 ${
                  isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="gooey-nav-pill"
                    className="absolute inset-0 bg-white rounded-md shadow-sm border border-gray-100/50 z-[-1]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{label}</span>
                {id === 'favorites' && favoritesCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-gray-900 text-white rounded">
                    {favoritesCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Section / Preferences Button */}
        <div className="flex-1 flex justify-end">
          <button
            id="btn-open-preferences"
            onClick={onOpenPreferences}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-900/90 backdrop-blur-sm text-white hover:bg-gray-800 transition-colors shadow-sm"
            title="Dietary Preferences"
          >
            <Sliders className="w-4 h-4" />
            <span className="hidden lg:inline">Preferences</span>
          </button>
        </div>
      </div>
    </header>
  );
};
