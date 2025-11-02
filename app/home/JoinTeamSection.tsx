"use client";
import Image from "next/image";
import React from "react";

const JoinTeamSection: React.FC = () => {
  return (
    <section className="py-12 px-5 sm:px-8 lg:px-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Title & Description */}
  <div className="text-center md:text-left mb-8">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--primary-color)] tracking-tight">
            Be Part Of Something Great
            
          </h2>

          <p className="mt-3 text-gray-600 leading-relaxed max-w-3xl mx-auto md:mx-0 text-base sm:text-lg">
            At Stanfox, our infrastructure speaks the same language as our
            services: refined, reliable, and built for excellence. Surrounded by
            natural elements and smart design, our team finds the clarity and
            calm needed to deliver exceptional results, every day.
          </p>

          <button className="mt-6 px-7 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)] transition-all shadow-md hover:shadow-lg">
            Join The Team
          </button>
        </div>

        {/* Single Image Section with brand hover tint */}
        <div className="relative w-full max-w-5xl mx-auto aspect-[16/9] overflow-hidden rounded-xl group shadow-sm">
          <Image
            src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/686b71ddbf8b5d7ad363c0f4_Stanfox%20-%20Office%20Image%20(1)-p-1080.webp"
            alt="Stanfox Office"
            fill
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700 ease-in-out"
          />
          <span className="pointer-events-none absolute inset-0 bg-[var(--primary-color)] mix-blend-multiply opacity-0 group-hover:opacity-20 transition-opacity" />
        </div>
      </div>
    </section>
  );
};

export default JoinTeamSection;
