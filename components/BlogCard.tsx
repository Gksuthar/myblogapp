'use client';
import React from "react";
import Link from "next/link";

interface BlogCardProps {
  slug?: string;
  title: string;
  imageUrl: string;
  link?: string;
  category?: string;
  date?: string;
  readingTime?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  imageUrl,
  link,
  category,
  date,
  readingTime,
}) => {
  return (
    <Link
      href={`/blogs/${slug}`}
className="group bg-gradient-to-r bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent block bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      {/* === Image Section === */}
      <div className="relative w-full h-56 sm:h-48 md:h-60 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
className="group bg-[radial-gradient(circle_at_center,rgba(53,154,255,0.25)_0%,rgba(53,154,255,0.15)_40%,rgba(53,154,255,0.08)_70%,transparent_100%),linear-gradient(to_right,rgba(53,154,255,0.08),transparent),linear-gradient(to_left,rgba(53,154,255,0.08),transparent)] block bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1"
        />
        {/* Overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Category badge on image */}
        {category && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
            {category}
          </span>
        )}
      </div>

      {/* === Content Section === */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 line-clamp-2 font-lexend">
          {title}
        </h3>

        {(date || readingTime) && (
          <div className="flex items-center justify-between text-xs text-gray-500">
            {date && <span>{date}</span>}
            {readingTime && (
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {readingTime}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default BlogCard;
