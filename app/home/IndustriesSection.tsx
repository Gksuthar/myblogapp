"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import ComponentLoader from "@/components/ComponentLoader";

const IndustriesSection: React.FC = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch industries data
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get("/api/industries");
        setIndustries(res.data?.data || []);
      } catch (error) {
        console.error("Failed to load industries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-16 overflow-hidden">
      {/* === Header === */}
      <div className="max-w-7xl mx-auto text-center mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
        >
          Accounting & Bookkeeping Expertise Across Industries
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto"
        >
          We support a diverse range of industries with tailored accounting
          solutions designed to meet specific sector needs.
        </motion.p>
      </div>

      {/* === Cards Section === */}
      <div className="relative py-8 max-w-full">
        {loading ? (
          <div className="flex justify-center items-center">
            <ComponentLoader height="h-24" />
          </div>
        ) : industries.length > 0 ? (
          <div className="relative max-w-7xl mx-auto overflow-hidden">
            {/* Seamless marquee wrapper */}
            <div className="industries-marquee-wrapper">
              <div className="industries-marquee">
                {/* First set */}
                {industries.map((item: { id?: string; image?: string; title?: string; description?: string }, i: number) => (
                  <motion.div
                    key={`set1-${item.id || i}`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-[var(--primary-color)] transition-all duration-300 flex-shrink-0 w-72 sm:w-80 md:w-96 p-6 sm:p-8 flex flex-col justify-between will-change-transform mx-3"
                  >
                    <div>
                      {/* === Icon === */}
                      <div className="overflow-hidden mb-6 h-40 rounded-lg">
                        <Image
                          src={item?.image || ''}
                          alt={item?.title || ''}
                          width={600}
                          height={400}
                          className="object-cover w-full h-40 transform transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                      </div>

                      {/* === Title === */}
                      <h3
                        className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[var(--primary-color)] transition-colors duration-300 truncate whitespace-nowrap max-w-full"
                        title={item?.title}
                      >
                        {item?.title}
                      </h3>

                      {/* === Description === */}
                      <p
                        className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3"
                        title={item?.description}
                      >
                        {item?.description}
                      </p>
                    </div>

                    {/* === Decorative Accent === */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}

                {/* Second set - duplicate for seamless loop */}
                {industries.map((item: { id?: string; image?: string; title?: string; description?: string }, i: number) => (
                  <motion.div
                    key={`set2-${item.id || i}`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.25 }}
                    className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-[var(--primary-color)] transition-all duration-300 flex-shrink-0 w-72 sm:w-80 md:w-96 p-6 sm:p-8 flex flex-col justify-between will-change-transform mx-3"
                    aria-hidden="true"
                  >
                    <div>
                      {/* === Icon === */}
                      <div className="overflow-hidden mb-6 h-40 rounded-lg">
                        <Image
                          src={item?.image || ''}
                          alt={item?.title || ''}
                          width={600}
                          height={400}
                          className="object-cover w-full h-40 transform transition-transform duration-300 group-hover:scale-110"
                          unoptimized
                        />
                      </div>

                      {/* === Title === */}
                      <h3
                        className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[var(--primary-color)] transition-colors duration-300 truncate whitespace-nowrap max-w-full"
                        title={item?.title}
                      >
                        {item?.title}
                      </h3>

                      {/* === Description === */}
                      <p
                        className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3"
                        title={item?.description}
                      >
                        {item?.description}
                      </p>
                    </div>

                    {/* === Decorative Accent === */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Gradient overlays - Hidden on mobile */}
            <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-10"></div>
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-10"></div>
          </div>
        ) : (
          <div className="w-full text-center text-gray-500 py-10">
            No industries found.
          </div>
        )}
      </div>
    </section>
  );
};

export default IndustriesSection;