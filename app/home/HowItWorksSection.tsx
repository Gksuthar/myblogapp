"use client";

import Image from "next/image";
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ComponentLoader from "@/components/ComponentLoader";

interface StepData {
  _id?: string;
  image?: string; // base64, local path, or URL
  title?: string;
  disc?: string;
}

const AUTO_SLIDE_INTERVAL = 4000;

const HowItWorksSection: React.FC = () => {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  // Responsive visible items logic
  const getVisibleItems = (): number => {
    if (typeof window === "undefined") return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  // Fetch data from API
  const fetchSteps = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/hire");
      const data = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      // ✅ Only use valid entries
      setSteps(
        data.filter(
          (item: unknown): item is StepData => {
            const step = item as Partial<StepData>;
            return !!step?.title && !!step?.disc;
          }
        )
      );
    } catch (error) {
      console.error("❌ Failed to fetch steps:", error);
      // Fallback data for production reliability
      setSteps([
        {
          title: "1. Preliminary Discussion",
          disc: "We discuss your business requirements and what you hope to achieve.",
          image: "/images/step1-discussion.svg",
        },
        {
          title: "2. SLAs Setup",
          disc: "We understand your operating procedures and set the right SLAs.",
          image: "/images/step2-slas.svg",
        },
        {
          title: "3. Contract Agreement",
          disc: "We finalize SLAs by signing a contract outlining deliverables.",
          image: "/images/step3-contract.svg",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => setVisibleItems(getVisibleItems());
    setVisibleItems(getVisibleItems());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSlides = steps?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalSlides / visibleItems));

  // Auto-slide logic
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  }, [totalPages]);

  useEffect(() => {
    const interval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const trackShiftPercentage = currentSlide * (100 / totalPages);

  return (
    <section className="bg-gray-50 py-12 px-4 sm:px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto text-center md:text-left">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Hire Top Accounting Professionals In 5 Easy Steps
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-2xl mx-auto md:mx-0">
          Our streamlined 5-step process makes it simple for CPAs and businesses
          to hire top accounting talent effortlessly.
        </p>

        {/* Loading Spinner */}
        {loading ? (
          <ComponentLoader height="h-64" />
        ) : steps?.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No steps found. Please add new entries.
          </p>
        ) : (
          <>
            {/* Slider Container */}
            <div className="relative overflow-hidden">
              <div
                className="process_wrapper flex transition-transform duration-700 ease-in-out justify-center"
                style={{ transform: `translateX(-${trackShiftPercentage}%)` }}
              >
                {steps?.map((step, index) => (
                  <div
                    key={step?._id || index}
                    className="flex-shrink-0 p-3"
                    style={{ width: `calc(100% / ${visibleItems})`, maxWidth: '400px', margin: '0 auto' }}
                  >
                    {/* Step Card */}
                    <div className="relative rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 sm:p-8 flex flex-col items-center text-center h-full overflow-hidden mx-auto" style={{ background: 'linear-gradient(135deg, #eaf5ff 0%, #f5faff 50%, #ffffff 100%)' }}>
                      <div className="relative h-40 w-full mb-6 flex items-center justify-center bg-white rounded-md overflow-hidden shadow-sm">
                        {step?.image ? (
                          <Image
                            src={
                              step.image.startsWith("data:image")
                                ? step.image
                                : step.image.startsWith("/")
                                ? step.image
                                : `data:image/png;base64,${step.image}`
                            }
                            alt={step?.title ?? "Step Image"}
                            width={200}
                            height={100}
                            className="object-contain"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm">No image</div>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                        {step?.title ?? "Untitled Step"}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        {step?.disc ?? "No description provided."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-blue-600 scale-110"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default HowItWorksSection;
