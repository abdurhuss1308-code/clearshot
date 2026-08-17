import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-card shadow-card p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-20 h-20 bg-taupe/10 rounded-card" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-taupe/10 rounded-card w-3/4" />
          <div className="h-4 bg-taupe/10 rounded-card w-full" />
          <div className="h-3 bg-taupe/10 rounded-card w-1/2" />
        </div>
      </div>
    </div>
  );
};
