import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Settings, Plus } from 'lucide-react';
import { useCards } from '../contexts/CardContext';

interface NavigationProps {
  onAddScreenshots: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onAddScreenshots }) => {
  const location = useLocation();
  const { getActiveCardCount } = useCards();
  const activeCount = getActiveCardCount();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-cream border-b border-taupe/10 shadow-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-card flex items-center justify-center text-cream font-bold text-sm">
              C
            </div>
            <h1 className="text-lg font-semibold text-charcoal">Clearshot</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Active card count badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-taupe">Active:</span>
              <span className="inline-flex items-center justify-center w-6 h-6 bg-teal-600 text-cream text-xs font-semibold rounded-full">
                {activeCount}
              </span>
            </div>

            {/* Add screenshots button */}
            <button
              onClick={onAddScreenshots}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-cream rounded-card font-medium hover:bg-teal-700 transition-colors"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add screenshots</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Settings icon */}
            <Link
              to="/settings"
              className={`p-2 rounded-card transition-colors ${
                isActive('/settings')
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-taupe hover:bg-taupe/10'
              }`}
              title="Settings"
            >
              <Settings size={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Bottom Tab Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-cream border-t border-taupe/10 shadow-card md:hidden">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-around">
          <Link
            to="/queue"
            className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
              isActive('/queue')
                ? 'border-t-2 border-teal-600 text-teal-600'
                : 'text-taupe'
            }`}
          >
            Queue
          </Link>
          <Link
            to="/archive"
            className={`flex-1 text-center py-3 text-sm font-medium transition-colors ${
              isActive('/archive')
                ? 'border-t-2 border-teal-600 text-teal-600'
                : 'text-taupe'
            }`}
          >
            Archive
          </Link>
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex fixed left-0 top-20 bottom-0 w-48 border-r border-taupe/10 flex-col gap-2 p-4">
        <Link
          to="/queue"
          className={`px-4 py-3 rounded-card text-sm font-medium transition-colors ${
            isActive('/queue')
              ? 'bg-teal-100 text-teal-700'
              : 'text-charcoal hover:bg-taupe/5'
          }`}
        >
          Queue
        </Link>
        <Link
          to="/archive"
          className={`px-4 py-3 rounded-card text-sm font-medium transition-colors ${
            isActive('/archive')
              ? 'bg-teal-100 text-teal-700'
              : 'text-charcoal hover:bg-taupe/5'
          }`}
        >
          Archive
        </Link>
      </aside>
    </>
  );
};
