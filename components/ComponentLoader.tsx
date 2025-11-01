'use client'
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ComponentLoaderProps {
  height?: string;
  message?: string;
}

const ComponentLoader: React.FC<ComponentLoaderProps> = ({ 
  height = "h-32",
  message = "Loading component..." 
}) => {
  return (
    <div className={`${height} flex items-center justify-center bg-white rounded-lg border border-gray-200`}>
      <div className="text-center">
        <LoadingSpinner size="md" />
        <p className="mt-2 text-sm text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default ComponentLoader;
