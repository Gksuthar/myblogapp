"use client";

import React from "react";
import HowItWorksSection from "../home/HowItWorksSection";

export default function HirePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Hire Top Accounting Professionals
        </h1>
        <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl">
          Follow our simple 5-step process to hire vetted accounting talent tailored to your business needs.
        </p>
      </section>
      <HowItWorksSection />
    </main>
  );
}
