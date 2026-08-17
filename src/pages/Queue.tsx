import React, { useState } from 'react';
import { useCards } from '../contexts/CardContext';
import { CardItem } from '../components/CardItem';
import { SkeletonCard } from '../components/SkeletonCard';
import { FilterTabs } from '../components/FilterTabs';
import { CardCategory } from '../types';

export const Queue: React.FC = () => {
  const { getCardsByState } = useCards();
  const [filter, setFilter] = useState<'all' | CardCategory>('all');
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);

  const activeCards = getCardsByState('active');
  const filteredCards = filter === 'all'
    ? activeCards
    : activeCards.filter(card => card.category === filter);

  const processingCards = filteredCards.filter(card => card.status === 'processing');
  const readyCards = filteredCards.filter(card => card.status === 'ready');
  const failedCards = filteredCards.filter(card => card.status === 'failed');

  const handleCardClick = (cardId: string) => {
    // In Phase 3, this will open the card detail view
    console.log('Card clicked:', cardId);
  };

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
          </div>
        ) : (
          // Active Cards List
          <div>
            <h2 className="text-2xl font-bold text-charcoal mb-6">Your queue</h2>

            {/* Filter tabs */}
            <FilterTabs activeFilter={filter} onFilterChange={setFilter} />

            {/* Processing cards with skeleton loaders */}
            {processingCards.length > 0 && (
              <div className="space-y-3 mb-6">
                {processingCards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                  />
                ))}
              </div>
            )}

            {/* Add skeleton loaders for visual feedback */}
            {processingCards.length > 0 && processingCards.length < readyCards.length + 2 && (
              <div className="space-y-3 mb-6">
                {[...Array(Math.min(3, 10 - (processingCards.length + readyCards.length)))].map((_, i) => (
                  <SkeletonCard key={`skeleton-${i}`} />
                ))}
              </div>
            )}

            {/* Ready cards */}
            {readyCards.length > 0 && (
              <div className="space-y-3">
                {readyCards.map((card) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    isAnimating={animatingCardId === card.id}
                  />
                ))}
              </div>
            )}

            {/* Failed cards message */}
            {failedCards.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-card text-red-700 text-sm">
                {failedCards.length} card(s) failed to process. Please try uploading them again.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
};
