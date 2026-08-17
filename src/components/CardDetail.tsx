import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { Card as CardType, CardCategory, ExtractedData } from '../types';
import { useCards } from '../contexts/CardContext';

interface CardDetailProps {
  card: CardType;
  isOpen: boolean;
  onClose: () => void;
}

export const CardDetail: React.FC<CardDetailProps> = ({ card, isOpen, onClose }) => {
  const { updateCard } = useCards();
  const [editedData, setEditedData] = useState<ExtractedData>(card.extracted_data);
  const [selectedCategory, setSelectedCategory] = useState<CardCategory | null>(card.category || 'other');
  const [showFullImage, setShowFullImage] = useState(!card.is_sensitive);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    updateCard(card.id, {
      extracted_data: editedData,
      category: selectedCategory,
      updated_at: new Date().toISOString(),
    });
    setTimeout(() => setIsSaving(false), 300);
  };

  const handleInputChange = (key: keyof ExtractedData, value: string) => {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  };

  if (!isOpen) return null;

  const lowConfidence = card.confidence !== null && card.confidence !== undefined && card.confidence < 0.6;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-4 md:p-8">
      <div className="bg-cream rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-taupe/10 flex-shrink-0">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-lg font-semibold text-charcoal flex-1">Screenshot details</h2>
            {lowConfidence && (
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-card">Not sure</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-taupe/10 rounded-card transition-colors"
          >
            <X size={20} className="text-taupe" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Image Section */}
          <div className="p-6 border-b border-taupe/10">
            {card.thumbnail_path ? (
              <div className="space-y-3">
                <div className="relative bg-taupe/5 rounded-card overflow-hidden">
                  <img
                    src={card.thumbnail_path}
                    alt={card.title}
                    className={`w-full h-auto max-h-96 object-cover ${
                      card.is_sensitive && !showFullImage ? 'blur-xl' : ''
                    }`}
                  />
                  {card.is_sensitive && (
                    <button
                      onClick={() => setShowFullImage(!showFullImage)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-card shadow-lg hover:bg-taupe/5 transition-colors"
                    >
                      {showFullImage ? (
                        <EyeOff size={20} className="text-charcoal" />
                      ) : (
                        <Eye size={20} className="text-charcoal" />
                      )}
                    </button>
                  )}
                </div>
                {card.is_sensitive && !showFullImage && (
                  <p className="text-sm text-amber-600 text-center">This image contains sensitive information</p>
                )}
              </div>
            ) : (
              <div className="bg-taupe/5 rounded-card p-8 text-center text-taupe text-sm">
                No image available
              </div>
            )}
          </div>

          {/* Fields Section */}
          <div className="p-6 space-y-6">
            {/* Category selector */}
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Category</label>
              <select
                value={selectedCategory || 'other'}
                onChange={(e) => setSelectedCategory(e.target.value as CardCategory)}
                className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              >
                <option value="shopping">Shopping</option>
                <option value="travel">Travel</option>
                <option value="contact">Contact</option>
                <option value="note">Note</option>
                <option value="task">Task</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Confidence info */}
            {card.confidence !== null && card.confidence !== undefined && (
              <div className="text-sm text-taupe">
                <span className="font-medium">Confidence:</span> {(card.confidence * 100).toFixed(0)}%
              </div>
            )}

            {/* Category-specific fields */}
            {selectedCategory === 'shopping' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Product name</label>
                  <input
                    type="text"
                    value={editedData.product_name || ''}
                    onChange={(e) => handleInputChange('product_name', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Price</label>
                  <input
                    type="text"
                    value={editedData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Merchant</label>
                  <input
                    type="text"
                    value={editedData.merchant || ''}
                    onChange={(e) => handleInputChange('merchant', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">URL</label>
                  <input
                    type="url"
                    value={editedData.url || ''}
                    onChange={(e) => handleInputChange('url', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
              </>
            )}

            {selectedCategory === 'travel' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Event name</label>
                  <input
                    type="text"
                    value={editedData.event_name || ''}
                    onChange={(e) => handleInputChange('event_name', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={editedData.date || ''}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Time</label>
                  <input
                    type="time"
                    value={editedData.time || ''}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Location</label>
                  <input
                    type="text"
                    value={editedData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Confirmation number</label>
                  <input
                    type="text"
                    value={editedData.confirmation_number || ''}
                    onChange={(e) => handleInputChange('confirmation_number', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
              </>
            )}

            {selectedCategory === 'contact' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
                  <input
                    type="text"
                    value={editedData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editedData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                  <input
                    type="email"
                    value={editedData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Address</label>
                  <input
                    type="text"
                    value={editedData.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
              </>
            )}

            {selectedCategory === 'note' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Note text</label>
                  <textarea
                    value={editedData.note_text || ''}
                    onChange={(e) => handleInputChange('note_text', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600 resize-none h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Source</label>
                  <input
                    type="text"
                    value={editedData.source || ''}
                    onChange={(e) => handleInputChange('source', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
              </>
            )}

            {selectedCategory === 'task' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Task description</label>
                  <textarea
                    value={editedData.task_description || ''}
                    onChange={(e) => handleInputChange('task_description', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600 resize-none h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Due date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={editedData.due_date || ''}
                    onChange={(e) => handleInputChange('due_date', e.target.value)}
                    className="w-full px-4 py-2 border border-taupe/20 rounded-card text-charcoal focus:outline-none focus:border-teal-600"
                  />
                </div>
              </>
            )}

            {/* Raw text display */}
            {card.raw_text && showFullImage && (
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Detected text</label>
                <div className="p-3 bg-taupe/5 rounded-card text-sm text-charcoal break-words max-h-32 overflow-y-auto">
                  {card.raw_text}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="border-t border-taupe/10 p-6 flex-shrink-0 space-y-3">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="w-full px-4 py-2 bg-teal-600 text-cream rounded-card font-medium hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 border border-taupe/20 text-charcoal rounded-card font-medium hover:bg-taupe/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
