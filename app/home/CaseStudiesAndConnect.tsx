"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ComponentLoader from "@/components/ComponentLoader";

interface CaseStudyItem {
  _id: string;
  title: string;
  content?: string; // made optional for safety
  slug?: string;
}

const CaseStudiesAndConnect: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/caseStudy");

        if (response?.status === 200) {
          const result = response?.data;
          let studies: CaseStudyItem[] = [];

          if (Array.isArray(result)) {
            studies = result;
          } else if (Array.isArray(result?.data)) {
            studies = result.data;
          }

          // Limit to first 4 safely
          setCaseStudies(studies.slice(0, 4));
        } else {
          setCaseStudies([]);
        }
      } catch (error) {
        console.error("Error fetching case studies:", error);
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  return (
    <section className="bg-white text-gray-800 mt-10">
      {/* ======================= Case Studies Section ======================= */}
      <div className="max-w-6xl mx-auto ">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--primary-color)] mb-8 text-center sm:text-left">
          Case Studies
        </h2>

        {loading ? (
          <ComponentLoader height="h-20" />
        ) : caseStudies?.length === 0 ? (
          <p className="text-center text-gray-600 py-8">
            No case studies available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {caseStudies?.map((study) => {
              // Use slug if available, otherwise generate from title
              const urlSlug = study?.slug || study?.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
              return (
                <div
                  key={study?._id}
                  className="border rounded-md p-4 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Title in black */}
                  <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-2 line-clamp-2">
                    {study?.title || "Untitled Case Study"}
                  </h3>
                  <a
                    href={`/case-studies/${urlSlug}`}
                    className="text-xs sm:text-sm text-gray-900 font-semibold hover:text-[var(--primary-color)] hover:underline"
                  >
                    View Case Study →
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ======================= Let's Connect Section ======================= */}
  <section className="relative py-20 overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url(https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6736f52aa2dea93969a896f8_line_cta.svg)",
            // backgroundSize: "100px 100px",
          }}
        />

        {/* Center content */}
        <div className="relative flex items-center justify-center ">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 bg-white rounded-2xl shadow-lg border border-gray-200 transition-all duration-300 text-center px-10 py-12 max-w-xl w-full mx-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Let’s Connect!
            </h2>
            <p className="text-gray-700 text-base md:text-lg mb-8">
              Connect with our accounting professionals & get started today!
            </p>

            <a href="/Contactus" className="inline-block px-6 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[var(--primary-color)] transition-all shadow-md">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </section>
  );
};

export default CaseStudiesAndConnect;
