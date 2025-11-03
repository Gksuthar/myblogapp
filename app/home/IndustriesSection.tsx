"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import ComponentLoader from "@/components/ComponentLoader";


const IndustriesSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
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

  // ✅ Optional smooth auto-scroll
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let scrollPos = 0;
    const step = 1;
    const intervalMs = 25;

    const interval = setInterval(() => {
      if (!container) return;
      scrollPos += step;
      if (scrollPos >= container.scrollWidth / 2) scrollPos = 0;
      container.scrollLeft = scrollPos;
    }, intervalMs);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20 px-4 sm:px-6 md:px-10 lg:px-16">
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
      <div
        ref={scrollRef}
        className="max-w-7xl mx-auto flex gap-6 sm:gap-8 overflow-x-hidden py-4"
      >
        {loading ? (
          <ComponentLoader height="h-24" />
        ) : industries.length > 0 ? (
          industries.map((item: { id?: string; image?: string; title?: string; description?: string }, i: number) => (
            <motion.div
              key={item.id || i}
                whileHover={{ y: -8, scale: 1.03 }}
                transition={{ duration: 0.25 }}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 hover:border-[var(--primary-color)] transition-all duration-300 flex-shrink-0 w-72 sm:w-80 md:w-96 p-6 sm:p-8 flex flex-col justify-between"
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
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--primary-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-2xl" />
            </motion.div>
          ))
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
