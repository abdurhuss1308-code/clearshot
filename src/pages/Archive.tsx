import React from 'react';
import { useCards } from '../contexts/CardContext';

export const Archive: React.FC = () => {
  const { getCardsByState } = useCards();
  const completedCards = getCardsByState('completed');
  const dismissedCards = getCardsByState('dismissed');
  const allArchived = [...completedCards, ...dismissedCards];

  return (
    <main className="min-h-screen bg-cream md:ml-48 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Archive</h2>

        {allArchived.length === 0 ? (
          <div className="text-center py-12 text-taupe">
            <p>No archived cards yet. Once you complete or dismiss cards, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Archived cards will be rendered here in Phase 4 */}
            <p className="text-taupe">{allArchived.length} card(s) in archive</p>
          </div>
        )}
      </div>
    </main>
  );
};
