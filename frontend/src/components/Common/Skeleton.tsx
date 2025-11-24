import React from 'react';

type SkeletonProps = {
  fullPage?: boolean;
  className?: string;
  variant?: 'default' | 'list' | 'card' | 'avatar';
};

const Skeleton: React.FC<SkeletonProps> = ({ fullPage = false, className = '', variant = 'default' }) => {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/5" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-48 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`py-6 ${className}`}>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="w-16 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-40 bg-gray-200 rounded mb-3" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div className={`text-center py-6 ${className}`}>
        <div className="animate-pulse inline-flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="text-left">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center py-12 text-gray-500 ${className}`}>
      <div className="inline-block w-48">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
