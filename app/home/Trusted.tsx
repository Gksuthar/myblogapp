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
      className="relative w-full bg-cover bg-center md:py-20 py-4"
      style={{
        backgroundImage:
          "url('https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67332d1aaa9780c12cdd3d8a_glob-p-1080.png')",
      }}
    >
  {/* Overlay - very light blue gradient so the image stays natural */}
  <div
    className="absolute inset-0 pointer-events-none"
    // style={{
    //   background:
    //     "linear-gradient(180deg, rgba(0, 102, 204, 0.08) 0%, rgba(0, 102, 204, 0.12) 50%, rgba(0, 102, 204, 0.08) 100%)",
    // }}
  />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-black">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          Trusted. Promising. Result-driven.
        </h2>
        <p className="text-base sm:text-lg md:text-xl mb-12 ">
          Backed by the trust of CPAs, validated by our results. See our impact at a glance.
        </p>

        {/* Stats Grid */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="group flex flex-col items-center bg-white shadow-lg p-6 rounded-2xl border border-gray-100 
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent block bg-white rounded-2xl shadow-[0_8px_40px_rgba(53,154,255,0.25)] hover:shadow-[0_12px_50px_rgba(53,154,255,0.35)] overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Icon */}
      <div className="mb-4">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full 
        bg-gradient-to-br from-[#359aff] to-[#5ab0ff] text-white text-3xl shadow-md 
        group-hover:scale-105 transition-transform duration-300">
          {stat.icon}
        </span>
      </div>

      {/* Value */}
      <span className="text-4xl font-extrabold text-gray-900 group-hover:text-[#359aff] transition-colors duration-300">
        {stat.value}
      </span>

      {/* Label */}
      <span className="mt-2 text-lg text-gray-600 font-medium">
        {stat.label}
      </span>

      {/* Accent Line */}
      <div className="mt-4 h-1 w-10 bg-[#359aff] rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
    </div>
  ))}
</div>

      </div>
    </section>
  );
};

export default Trusted;
