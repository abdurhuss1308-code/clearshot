import React, { useState, useRef } from 'react';
import { X, Upload, Loader } from 'lucide-react';
import { useCards } from '../contexts/CardContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../types';
import { isImageFile, generateThumbnail, fileToBase64 } from '../utils/imageProcessing';
import { categorizeScreenshotWithFallback } from '../utils/categorization';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { addCard, updateCard } = useCards();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragOverRef = useRef(false);

  const handleFileSelect = (newFiles: FileList) => {
    const imageFiles = Array.from(newFiles).filter((file) => {
      if (!isImageFile(file)) {
        setErrors((prev) => [...prev, `${file.name} is not a valid image file`]);
        return false;
      }
      return true;
    });

    setFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = true;
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = false;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragOverRef.current = false;
    handleFileSelect(e.dataTransfer.files);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            const dt = new DataTransfer();
            dt.items.add(file);
            handleFileSelect(dt.items);
          }
        }
      }
    }
  };

  const processFiles = async () => {
    if (files.length === 0 || !user) return;

    setUploading(true);
    setProgress({ current: 0, total: files.length });
    setErrors([]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Create card in processing state
        const cardId = Math.random().toString(36).substr(2, 9);
        const newCard: Card = {
          id: cardId,
          user_id: user.id,
          status: 'processing',
          title: file.name.replace(/\.[^/.]+$/, ''),
          extracted_data: {},
          is_sensitive: false,
          card_state: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        addCard(newCard);

        // Simulate file upload to storage
        const imagePath = `${user.id}/${cardId}.jpg`;
        const thumbnailPath = `${user.id}/${cardId}_thumb.jpg`;

        // Generate thumbnail
        const generatedThumbnail = await generateThumbnail(file);

        // Convert image to base64 for categorization
        const base64Image = await fileToBase64(file);

        // Call categorization endpoint
        const categorization = await categorizeScreenshotWithFallback(base64Image);

        // Update card with categorization results
        updateCard(cardId, {
          status: categorization.category === 'other' && categorization.confidence < 0.6 ? 'ready' : 'ready',
          category: categorization.category,
          title: categorization.title,
          extracted_data: categorization.extracted_data,
          raw_text: categorization.raw_text,
          confidence: categorization.confidence,
          is_sensitive: categorization.is_sensitive,
          image_path: imagePath,
          thumbnail_path: thumbnailPath,
        });

        setProgress({ current: i + 1, total: files.length });
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        setErrors((prev) => [...prev, `Failed to process ${file.name}`]);
        setProgress({ current: i + 1, total: files.length });
      }
    }

    setUploading(false);
    setTimeout(() => {
      onClose();
      setFiles([]);
    }, 500);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-card w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-taupe/10">
          <h2 className="text-lg font-semibold text-charcoal">Add screenshots</h2>
          <button
            onClick={onClose}
            disabled={uploading}
            className="p-1 hover:bg-taupe/10 rounded-card transition-colors disabled:opacity-50"
          >
            <X size={20} className="text-taupe" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!uploading ? (
            <>
              {/* Upload area */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-card p-8 text-center cursor-pointer transition-colors ${
                  dragOverRef.current
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-taupe/20 hover:border-teal-600 hover:bg-teal-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 mx-auto text-teal-600" />
                  <div>
                    <p className="font-medium text-charcoal">Drag files here or click to browse</p>
                    <p className="text-sm text-taupe mt-1">You can also paste images (Ctrl+V)</p>
                  </div>
                </div>
              </div>
              <div onPaste={handlePaste} />

              {/* Error messages */}
              {errors.length > 0 && (
                <div className="space-y-2">
                  {errors.map((error, idx) => (
                    <div key={idx} className="text-sm text-red-600 bg-red-50 p-2 rounded-card">
                      {error}
                    </div>
                  ))}
                </div>
              )}

              {/* File list */}
              {files.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-charcoal">{files.length} file(s) selected</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-taupe/5 rounded-card">
                        <span className="text-sm text-charcoal truncate">{file.name}</span>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1 hover:bg-taupe/10 rounded-card transition-colors"
                        >
                          <X size={16} className="text-taupe" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Processing state */
            <div className="py-8 text-center space-y-4">
              <Loader className="w-8 h-8 mx-auto text-teal-600 animate-spin" />
              <div>
                <p className="font-medium text-charcoal">Reading your screenshots...</p>
                <p className="text-sm text-taupe mt-1">
                  {progress.current} of {progress.total} done
                </p>
              </div>
              <div className="w-full bg-taupe/10 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-teal-600 transition-all duration-300"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!uploading && (
          <div className="border-t border-taupe/10 p-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-taupe/20 text-charcoal rounded-card font-medium hover:bg-taupe/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={processFiles}
              disabled={files.length === 0}
              className="flex-1 px-4 py-2 bg-teal-600 text-cream rounded-card font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload {files.length > 0 ? `(${files.length})` : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
