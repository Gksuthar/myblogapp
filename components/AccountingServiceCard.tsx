'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AccountingServiceCardProps {
  service: {
    id: number;
    title: string;
    description: string;
    icon: string;
    iconBg: string;
    iconColor: string;
  };
  index: number;
}

const AccountingServiceCard: React.FC<AccountingServiceCardProps> = ({ 
  service, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="bg-gray-50 rounded-xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 group"
    >
      {/* Icon */}
      <div className={`w-16 h-16 ${service.iconBg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <span className={`text-3xl ${service.iconColor}`}>
          {service.icon}
        </span>
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
        {service.title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {service.description}
      </p>
    </motion.div>
  );
};

export default AccountingServiceCard;
