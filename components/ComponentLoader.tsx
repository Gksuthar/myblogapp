'use client'
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ComponentLoaderProps {
  height?: string;
  message?: string;
  showMessage?: boolean; // default false – render spinner only
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ 
  height = "h-16",
  message = "Loading...",
  showMessage = false,
}) => {
  return (
    <div className={`${height} flex items-center justify-center`}>
      <div className="text-center">
        <LoadingSpinner size="md" />
        {showMessage && (
          <p className="mt-2 text-sm text-gray-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ComponentLoader;
