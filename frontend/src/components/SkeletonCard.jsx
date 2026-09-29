import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden p-4 animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
}
