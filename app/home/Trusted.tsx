"use client";
import React from "react";
import { FaBusinessTime, FaBuilding, FaUserTie, FaHandshake } from "react-icons/fa";

const stats = [
  { label: "Years of Experience", value: "12+", icon: <FaBusinessTime /> },
  { label: "Accounts Reconciled", value: "1.5K+", icon: <FaUserTie /> },
  { label: "Accounting Firms", value: "250+", icon: <FaBuilding /> },
  { label: "Trusted Companies", value: "100+", icon: <FaHandshake /> },
];

const Trusted: React.FC = () => {
  return (
    <section
      className="relative w-full bg-cover bg-center py-20"
      style={{
        backgroundImage:
          "url('https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67332d1aaa9780c12cdd3d8a_glob-p-1080.png')",
      }}
    >
  {/* Overlay - very light blue gradient so the image stays natural */}
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "linear-gradient(180deg, rgba(53,154,255,0.08) 0%, rgba(53,154,255,0.12) 50%, rgba(53,154,255,0.08) 100%)",
    }}
  />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Trusted. Promising. Result-driven.
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-12 text-gray-200">
          Backed by the trust of CPAs, validated by our results. See our impact at a glance.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center bg-white/10 backdrop-blur-sm p-6 rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              <div className="mb-3">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary-color)] text-white text-2xl shadow-md">
                  {stat.icon}
                </span>
              </div>
              <span className="text-3xl sm:text-4xl font-extrabold text-white">{stat.value}</span>
              <span className="mt-2 text-lg sm:text-xl text-gray-200">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trusted;
