'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ServiceCardProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
  };
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  index 
}) => {
  // Add safety check for service prop
  if (!service) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 animate-pulse">
        <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-white rounded-xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 group"
    >
      {/* Icon */}
      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className="text-2xl text-gray-700">
          {service.icon}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
        {service.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed text-sm">
        {service.description}
      </p>
    </motion.div>
  );
};

export default ServiceCard;