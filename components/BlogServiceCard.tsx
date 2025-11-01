'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BlogServiceCardProps {
  post: {
    id: number;
    title: string;
    img: string;
    excerpt: string;
    date: string;
  };
}

const BlogServiceCard: React.FC<BlogServiceCardProps> = ({ post }) => {
  // Add safety check for post prop
  if (!post) {
    return (
      <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg border border-gray-200 animate-pulse">
        <div className="flex items-center justify-start space-x-4 mb-4">
          <div className="p-2 bg-gray-200 rounded-lg w-12 h-12"></div>
          <div className="flex-grow">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex items-center justify-start space-x-4 mb-4">
        {/* Icon placeholder/Image */}
        <div className="p-2 bg-gray-100 rounded-lg">
          <Image
            src={post.img}
            alt={`${post.title} icon`}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
        </div>
        {/* Title and Arrow */}
        <div className="flex-grow flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">
            {post.title} →
          </h2>
        </div>
      </div>

      {/* Excerpt */}
      <p className="text-gray-600 text-base leading-relaxed mt-2 flex-grow">
        {post.excerpt}
      </p>

      {/* Date */}
      <div className="mt-4 text-sm text-gray-500">
        {post.date}
      </div>
    </div>
  );
};

export default BlogServiceCard;
