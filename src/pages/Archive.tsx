import React, { useState } from 'react';
import { useCards } from '../contexts/CardContext';
import { CardItem } from '../components/CardItem';
import { FilterTabs } from '../components/FilterTabs';
import { CardDetail } from '../components/CardDetail';
import { CardCategory } from '../types';
import { RotateCcw, Search } from 'lucide-react';

export const Archive: React.FC = () => {
  const { getCardsByState, updateCard } = useCards();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CardCategory>('all');
  const [stateFilter, setStateFilter] = useState<'all' | 'completed' | 'dismissed'>('all');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const completedCards = getCardsByState('completed');
  const dismissedCards = getCardsByState('dismissed');
  const allArchived = [...completedCards, ...dismissedCards].sort(
    (a, b) => new Date(b.actioned_at || '').getTime() - new Date(a.actioned_at || '').getTime()
  );

  const selectedCard = allArchived.find(card => card.id === selectedCardId);

  // Filter by search query
  const filteredBySearch = allArchived.filter((card) => {
    const query = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(query) ||
      card.raw_text?.toLowerCase().includes(query) ||
      card.extracted_data.product_name?.toLowerCase().includes(query) ||
      card.extracted_data.event_name?.toLowerCase().includes(query) ||
      card.extracted_data.name?.toLowerCase().includes(query) ||
      card.extracted_data.note_text?.toLowerCase().includes(query) ||
      card.extracted_data.task_description?.toLowerCase().includes(query)
    );
  });

  // Filter by category
  const filteredByCategory = categoryFilter === 'all'
    ? filteredBySearch
    : filteredBySearch.filter(card => card.category === categoryFilter);

  // Filter by state
  const filteredByState = stateFilter === 'all'
    ? filteredByCategory
    : filteredByCategory.filter(card => card.card_state === stateFilter);

  const handleRestore = (cardId: string) => {
    updateCard(cardId, {
      card_state: 'active',
      action_taken: null,
      actioned_at: null,
      updated_at: new Date().toISOString(),
    });
  };

  const handleCardAction = () => {
    setSelectedCardId(null);
  };

  return (
    <main className="min-h-screen bg-cream md:ml-48 pb-20 md:pb-0">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-charcoal mb-6">Archive</h2>

        {allArchived.length === 0 ? (
          <div className="text-center py-12 text-taupe">
            <p>No archived cards yet. Once you complete or dismiss cards, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-taupe" size={20} />
              <input
                type="text"
                placeholder="Search by title, text, product, event, contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-taupe/20 rounded-card text-charcoal placeholder-taupe focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>

            {/* State filter tabs */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setStateFilter('all')}
                className={`px-4 py-2 rounded-card font-medium text-sm transition-colors ${
                  stateFilter === 'all'
                    ? 'bg-teal-600 text-cream'
                    : 'bg-taupe/10 text-charcoal hover:bg-taupe/20'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStateFilter('completed')}
                className={`px-4 py-2 rounded-card font-medium text-sm transition-colors ${
                  stateFilter === 'completed'
                    ? 'bg-teal-600 text-cream'
                    : 'bg-taupe/10 text-charcoal hover:bg-taupe/20'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setStateFilter('dismissed')}
                className={`px-4 py-2 rounded-card font-medium text-sm transition-colors ${
                  stateFilter === 'dismissed'
                    ? 'bg-teal-600 text-cream'
                    : 'bg-taupe/10 text-charcoal hover:bg-taupe/20'
                }`}
              >
                Dismissed
              </button>
            </div>

            {/* Category filter tabs */}
            <FilterTabs activeFilter={categoryFilter} onFilterChange={setCategoryFilter} />

            {/* Results */}
            {filteredByState.length === 0 ? (
              <div className="text-center py-12 text-taupe">
                <p>No cards match your search.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-taupe mb-4">
                  {filteredByState.length} card{filteredByState.length !== 1 ? 's' : ''} in archive
                </p>
                {filteredByState.map((card) => (
                  <div key={card.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <div
                        onClick={() => setSelectedCardId(card.id)}
                        className="cursor-pointer hover:opacity-75 transition-opacity"
                      >
                        <CardItem
                          card={card}
                          onClick={() => setSelectedCardId(card.id)}
                          onAction={handleCardAction}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(card.id)}
                      className="flex-shrink-0 px-4 py-2 mt-4 border border-taupe/20 text-charcoal rounded-card font-medium hover:bg-taupe/5 transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
                      title="Restore to queue"
                    >
                      <RotateCcw size={16} />
                      <span className="hidden sm:inline">Restore</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetail
          card={selectedCard}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCardId(null)}
        />
      )}
    </main>
  );
};
