'use client'
// File: AccountantCard.jsx
import React from "react";

interface AccountantCardProps {
  title: string;
  description: string;
  image: string;
  tags?: string[];
  buttonText?: string;
}

const AccountantCard: React.FC<AccountantCardProps> = ({
  title,
  description,
  image,
  tags = [],
  buttonText = "Hire Now",
}) => {
  return (
    <div className="w-full ">
      {/* Main Card */}
           <div className="relative bg-white border rounded-[30px] shadow-md flex flex-col md:flex-row items-center md:items-start overflow-hidden w-full mt-4 min-h-[380px] max-h-[300px]">
        {/* Left Section */}
        <div className="p-8 flex-1 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-3">
            {tags.length > 0
              ? tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-800 text-sm px-4 py-1 rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))
              : (
                <>
                  <span className="bg-green-100 text-green-800 text-sm px-4 py-1 rounded-lg font-medium">
                    10+ years of experience
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-sm px-4 py-1 rounded-lg font-medium">
                    Advanced knowledge
                  </span>
                  <span className="bg-red-100 text-red-800 text-sm px-4 py-1 rounded-lg font-medium">
                    Client-focused
                  </span>
                </>
              )}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">{title}</h2>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">{description}
          </p>

          {/* Button */}
          <button className="bg-gray-700 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition">
            {buttonText}
          </button>
        </div>

        {/* Right Section */}
        <div className="relative flex-1 flex justify-center items-center p-6">
          {/* SVG Curve */}
          <svg
            className="absolute right-0 top-0 w-full h-full"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 50C150 50 250 150 250 250"
              stroke="#BFBFBF"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
          </svg>

          {/* Image */}
          <img
          style={{width:"250px"}}
            src={image}
            alt={title}
            className="relative w-full max-w-sm object-contain z-10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default AccountantCard;
