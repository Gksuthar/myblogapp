'use client';

import React from 'react';
// import { motion } from 'framer-motion';
import Image from 'next/image';

interface BlogServiceCardProps {
  post: {
    id: number;
    title: string;
    img: string;
    desc:string
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
    <div className="flex flex-col p-7 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border border-gray-200 hover:border-[var(--primary-color)] h-full min-h-[240px] overflow-hidden">
      <div className="flex items-center justify-start space-x-5 mb-4">
        {/* Icon placeholder/Image */}
        <div className="p-3 bg-[#e6f3ff] rounded-xl border border-[color-mix(in srgb, var(--primary-color) 30%, white)]">
          <Image
            src={post.img}
            alt={`${post.title} icon`}
            width={56}
            height={56}
            className="w-14 h-14 object-contain"
          />
        </div>
        {/* Title and Arrow */}
        <div className="flex-grow flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-[var(--primary-color)] transition-colors">
            {post.title} <span className="text-[var(--primary-color)] group-hover:translate-x-0.5 inline-block transition-transform">→</span>
          </h2>
        </div>
      </div>

      {/* Excerpt */}
      {
        post.desc &&
      <p className="text-gray-600 text-lg leading-relaxed mt-2 flex-grow max-h-24 overflow-hidden"  >
        { post.desc &&   post.desc}
      </p>
      }

    </div>
  );
};

export default BlogServiceCard;
