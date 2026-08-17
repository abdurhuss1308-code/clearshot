import React, { useState } from 'react';
import { Card as CardType, CardCategory } from '../types';
import { AlertCircle, Trash2, CheckCircle, Phone, Mail } from 'lucide-react';
import { useCards } from '../contexts/CardContext';
import { CardActions } from './CardActions';
import { generateICS, generateVCF, downloadFile } from '../utils/fileGeneration';

const categoryColors: Record<CardCategory, { bg: string; text: string; label: string }> = {
  shopping: { bg: 'bg-shopping', text: 'text-white', label: 'Shopping' },
  travel: { bg: 'bg-travel', text: 'text-white', label: 'Travel' },
  contact: { bg: 'bg-contact', text: 'text-white', label: 'Contact' },
  note: { bg: 'bg-note', text: 'text-white', label: 'Note' },
  task: { bg: 'bg-task', text: 'text-white', label: 'Task' },
  other: { bg: 'bg-other', text: 'text-white', label: 'Other' },
};

interface CardItemProps {
  card: CardType;
  onClick: () => void;
  onAction: () => void;
  isAnimating?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onClick, onAction, isAnimating }) => {
  const categoryColor = card.category ? categoryColors[card.category] : categoryColors.other;
  const isProcessing = card.status === 'processing';
  const isFailed = card.status === 'failed';
  const lowConfidence = card.confidence !== null && card.confidence < 0.6;
  const [showActions, setShowActions] = useState(false);

  const handleActionComplete = () => {
    setShowActions(false);
    onAction();
  };

  return (
    <div
      className={`bg-white rounded-card shadow-card p-4 cursor-pointer hover:shadow-lg transition-all ${
        isAnimating ? 'animate-slide-out' : 'hover:scale-102'
      }`}
    >
      <div onClick={onClick} className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-20 h-20 bg-taupe/10 rounded-card overflow-hidden">
          {card.thumbnail_path ? (
            <img
              src={card.thumbnail_path}
              alt={card.title}
              className={`w-full h-full object-cover ${
                card.is_sensitive ? 'blur-md' : ''
              }`}
            />
          ) : isProcessing ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-taupe/20 to-taupe/5" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-charcoal truncate">{card.title}</h3>
            {card.is_sensitive && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-card flex-shrink-0">
                Sensitive
              </span>
            )}
            {!card.is_sensitive && (
              <span className={`px-2 py-1 ${categoryColor.bg} ${categoryColor.text} text-xs font-medium rounded-card flex-shrink-0`}>
                {isProcessing ? 'Processing...' : categoryColor.label}
              </span>
            )}
          </div>

          {/* Detail text */}
          <p className="text-sm text-taupe truncate mb-2">
            {isProcessing
              ? 'Reading screenshot...'
              : card.extracted_data.product_name
              ? card.extracted_data.product_name
              : card.extracted_data.event_name
              ? card.extracted_data.event_name
              : card.extracted_data.name
              ? card.extracted_data.name
              : card.extracted_data.task_description
              ? card.extracted_data.task_description
              : card.extracted_data.note_text
              ? card.extracted_data.note_text.substring(0, 50)
              : 'No details'}
          </p>

          {/* Low confidence warning */}
          {lowConfidence && !isProcessing && (
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <AlertCircle size={12} />
              <span>Not sure — check this one</span>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {!isProcessing && (
        <div className="mt-4 pt-4 border-t border-taupe/10">
          <CardActions card={card} onActionComplete={handleActionComplete} />
        </div>
      )}
    </div>
  );
};
