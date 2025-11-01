'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BenefitCardProps {
  benefit: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ 
  benefit, 
  index 
}) => {
  // Add safety check for benefit prop
  if (!benefit) {
    return (
      <div className="flex items-start space-x-4 p-4 rounded-lg animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-300 group"
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <span className="text-xl text-gray-700">
          {benefit.icon}
        </span>
      </div>
      
      {/* Content */}
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {benefit.title}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm">
          {benefit.description}
        </p>
      </div>
    </motion.div>
  );
};

export default BenefitCard;
