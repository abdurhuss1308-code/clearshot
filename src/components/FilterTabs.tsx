import React from 'react';
import { CardCategory } from '../types';

interface FilterTabsProps {
  activeFilter: 'all' | CardCategory;
  onFilterChange: (filter: 'all' | CardCategory) => void;
}

const filters: { id: 'all' | CardCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'travel', label: 'Travel' },
  { id: 'contact', label: 'Contact' },
  { id: 'note', label: 'Notes' },
  { id: 'task', label: 'Tasks' },
  { id: 'other', label: 'Other' },
];

export const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-card font-medium text-sm whitespace-nowrap transition-colors ${
            activeFilter === filter.id
              ? 'bg-teal-600 text-cream'
              : 'bg-taupe/10 text-charcoal hover:bg-taupe/20'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
