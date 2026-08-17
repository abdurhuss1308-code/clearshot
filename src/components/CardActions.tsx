import React, { useState } from 'react';
import { Card as CardType, CardCategory } from '../types';
import { useCards } from '../contexts/CardContext';
import { generateICS, generateVCF, downloadFile } from '../utils/fileGeneration';
import { AlertCircle, Trash2, CheckCircle, Phone, Mail } from 'lucide-react';

interface CardActionsProps {
  card: CardType;
  onActionComplete: () => void;
}

const categoryColors: Record<CardCategory, string> = {
  shopping: 'bg-shopping',
  travel: 'bg-travel',
  contact: 'bg-contact',
  note: 'bg-note',
  task: 'bg-task',
  other: 'bg-other',
};

export const CardActions: React.FC<CardActionsProps> = ({ card, onActionComplete }) => {
  const { updateCard } = useCards();
  const [showCopiedNotice, setShowCopiedNotice] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDiscard = async () => {
    setIsProcessing(true);
    updateCard(card.id, {
      card_state: 'dismissed',
      action_taken: 'discarded',
      actioned_at: new Date().toISOString(),
    });
    setTimeout(onActionComplete, 300);
  };

  const handleCopyText = async () => {
    if (card.extracted_data.note_text) {
      await navigator.clipboard.writeText(card.extracted_data.note_text);
      setShowCopiedNotice(true);
      setTimeout(() => setShowCopiedNotice(false), 2000);

      setTimeout(() => {
        updateCard(card.id, {
          card_state: 'completed',
          action_taken: 'copied_text',
          actioned_at: new Date().toISOString(),
        });
        onActionComplete();
      }, 500);
    }
  };

  const handleMarkComplete = async () => {
    setIsProcessing(true);
    updateCard(card.id, {
      card_state: 'completed',
      action_taken: 'marked_complete',
      actioned_at: new Date().toISOString(),
    });
    setTimeout(onActionComplete, 300);
  };

  const handleViewProduct = async () => {
    setIsProcessing(true);
    let url = card.extracted_data.url;

    if (!url && card.extracted_data.product_name) {
      const searchQuery = [
        card.extracted_data.product_name,
        card.extracted_data.merchant,
      ]
        .filter(Boolean)
        .join(' ');
      url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    }

    if (url) {
      window.open(url, '_blank');
    }

    setTimeout(() => {
      updateCard(card.id, {
        card_state: 'completed',
        action_taken: 'viewed_product',
        actioned_at: new Date().toISOString(),
      });
      onActionComplete();
    }, 300);
  };

  const handleAddToCalendar = async () => {
    setIsProcessing(true);
    const eventName = card.extracted_data.event_name || card.extracted_data.task_description || card.title;
    const date = card.extracted_data.date || new Date().toISOString().split('T')[0];

    const ics = generateICS(
      eventName,
      date,
      card.extracted_data.time,
      card.extracted_data.location
    );

    downloadFile(ics, `${eventName}.ics`, 'text/calendar');

    setTimeout(() => {
      updateCard(card.id, {
        card_state: 'completed',
        action_taken: 'added_to_calendar',
        actioned_at: new Date().toISOString(),
      });
      onActionComplete();
    }, 300);
  };

  const handleGetDirections = async () => {
    setIsProcessing(true);
    if (card.extracted_data.location) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        card.extracted_data.location
      )}`;
      window.open(mapsUrl, '_blank');
    }

    setTimeout(() => {
      updateCard(card.id, {
        card_state: 'completed',
        action_taken: 'got_directions',
        actioned_at: new Date().toISOString(),
      });
      onActionComplete();
    }, 300);
  };

  const handleSaveContact = async () => {
    setIsProcessing(true);
    const name = card.extracted_data.name || 'Contact';
    const vcf = generateVCF(
      name,
      card.extracted_data.phone,
      card.extracted_data.email,
      card.extracted_data.address
    );

    downloadFile(vcf, `${name}.vcf`, 'text/vcard');

    setTimeout(() => {
      updateCard(card.id, {
        card_state: 'completed',
        action_taken: 'saved_contact',
        actioned_at: new Date().toISOString(),
      });
      onActionComplete();
    }, 300);
  };

  const handleCall = async () => {
    setIsProcessing(true);
    if (card.extracted_data.phone) {
      window.location.href = `tel:${card.extracted_data.phone}`;
    }

    setTimeout(() => {
      updateCard(card.id, {
        card_state: 'completed',
        action_taken: 'called',
        actioned_at: new Date().toISOString(),
      });
      onActionComplete();
    }, 300);
  };

  const handleEmail = async () => {
    setIsProcessing(true);
    if (card.extracted_data.email) {
      window.location.href = `mailto:${card.extracted_data.email}`;
    }

    setTimeout(() => {
      updateCard(card.id, {
        card_state: 'completed',
        action_taken: 'emailed',
        actioned_at: new Date().toISOString(),
      });
      onActionComplete();
    }, 300);
  };

  const handleKeepAsReference = async () => {
    setIsProcessing(true);
    updateCard(card.id, {
      card_state: 'completed',
      action_taken: 'kept_as_reference',
      actioned_at: new Date().toISOString(),
    });
    setTimeout(onActionComplete, 300);
  };

  const handleDeleteSensitiveImage = async () => {
    setIsProcessing(true);
    updateCard(card.id, {
      image_path: null,
      thumbnail_path: null,
      updated_at: new Date().toISOString(),
    });
    setTimeout(() => setIsProcessing(false), 300);
  };

  const handleReviewAndCategorize = () => {
    // This will open the CardDetail modal in the parent component
    onActionComplete(); // For now, just close
  };

  return (
    <div className="space-y-3">
      {/* Copied notice */}
      {showCopiedNotice && (
        <div className="text-sm text-green-600 bg-green-50 p-2 rounded-card text-center">
          Copied to clipboard
        </div>
      )}

      {/* Sensitive image warning and delete button */}
      {card.is_sensitive && (
        <button
          onClick={handleDeleteSensitiveImage}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-card font-medium hover:bg-red-100 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete image now
        </button>
      )}

      {/* Category-specific primary actions */}
      {card.category === 'shopping' && (
        <button
          onClick={handleViewProduct}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-shopping text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
        >
          {card.extracted_data.url ? 'View Product' : 'Search for This'}
        </button>
      )}

      {card.category === 'travel' && (
        <>
          <button
            onClick={handleAddToCalendar}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-travel text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            Add to Calendar
          </button>
          {card.extracted_data.location && (
            <button
              onClick={handleGetDirections}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-travel/80 text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
            >
              Get Directions
            </button>
          )}
        </>
      )}

      {card.category === 'contact' && (
        <>
          <button
            onClick={handleSaveContact}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-contact text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            Save Contact
          </button>
          {card.extracted_data.phone && (
            <button
              onClick={handleCall}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-contact/80 text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              Call
            </button>
          )}
          {card.extracted_data.email && (
            <button
              onClick={handleEmail}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-contact/80 text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              Email
            </button>
          )}
        </>
      )}

      {card.category === 'note' && (
        <>
          <button
            onClick={handleCopyText}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-note text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            Copy Text
          </button>
          <button
            onClick={handleKeepAsReference}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-note/80 text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
          >
            Keep as Reference
          </button>
        </>
      )}

      {card.category === 'task' && (
        <>
          <button
            onClick={handleMarkComplete}
            disabled={isProcessing}
            className="w-full px-4 py-2 bg-task text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            Mark Complete
          </button>
          {card.extracted_data.due_date && (
            <button
              onClick={handleAddToCalendar}
              disabled={isProcessing}
              className="w-full px-4 py-2 bg-task/80 text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50"
            >
              Add to Calendar
            </button>
          )}
        </>
      )}

      {card.category === 'other' && (
        <button
          onClick={handleReviewAndCategorize}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-other text-white rounded-card font-medium hover:opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <AlertCircle size={16} />
          Review & Categorize
        </button>
      )}

      {/* Always show discard button */}
      <button
        onClick={handleDiscard}
        disabled={isProcessing}
        className="w-full px-4 py-2 border border-taupe/20 text-charcoal rounded-card font-medium hover:bg-taupe/5 transition-colors disabled:opacity-50"
      >
        Discard
      </button>
    </div>
  );
};
