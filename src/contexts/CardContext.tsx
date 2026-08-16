import React, { createContext, useContext, useState, useEffect } from 'react';
import { Card } from '../types';
import { useAuth } from './AuthContext';

interface CardContextType {
  cards: Card[];
  addCard: (card: Card) => void;
  updateCard: (id: string, updates: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  getActiveCardCount: () => number;
  getCardsByState: (state: 'active' | 'completed' | 'dismissed') => Card[];
}

const CardContext = createContext<CardContextType | null>(null);

export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (user) {
      const storedCards = localStorage.getItem(`clearshot_cards_${user.id}`);
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      }
    }
  }, [user]);

  const addCard = (card: Card) => {
    setCards(prev => {
      const updated = [card, ...prev];
      if (user) {
        localStorage.setItem(`clearshot_cards_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const updateCard = (id: string, updates: Partial<Card>) => {
    setCards(prev => {
      const updated = prev.map(card => card.id === id ? { ...card, ...updates, updated_at: new Date().toISOString() } : card);
      if (user) {
        localStorage.setItem(`clearshot_cards_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const deleteCard = (id: string) => {
    setCards(prev => {
      const updated = prev.filter(card => card.id !== id);
      if (user) {
        localStorage.setItem(`clearshot_cards_${user.id}`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const getActiveCardCount = () => {
    return cards.filter(card => card.card_state === 'active').length;
  };

  const getCardsByState = (state: 'active' | 'completed' | 'dismissed') => {
    return cards.filter(card => card.card_state === state);
  };

  return (
    <CardContext.Provider value={{ cards, addCard, updateCard, deleteCard, getActiveCardCount, getCardsByState }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCards = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCards must be used within CardProvider');
  }
  return context;
};
