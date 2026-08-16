import React from 'react';
import { useCards } from '../contexts/CardContext';

export const Queue: React.FC = () => {
  const { getCardsByState } = useCards();
  const activeCards = getCardsByState('active');

  return (
    <main className="min-h-screen bg-cream md:ml-48 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeCards.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 bg-teal-100 rounded-card flex items-center justify-center text-teal-700 text-3xl">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-charcoal text-center">You're all caught up</h2>
            <p className="text-taupe text-center max-w-sm">Nothing waiting. Good work clearing your backlog.</p>
            <button className="mt-4 px-6 py-2 bg-teal-600 text-cream rounded-card font-medium hover:bg-teal-700 transition-colors">
              Add screenshots
            </button>
          </div>
        ) : (
          // Active Cards List (placeholder)
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Your queue</h2>
            {/* Cards will be rendered here in Phase 2 */}
          </div>
        )}
      </div>
    </main>
  );
};
