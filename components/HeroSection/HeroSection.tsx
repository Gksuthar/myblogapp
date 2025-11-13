"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import CustomButton from "../ui/customButtom/Button"; // Assuming this is the correct path

// --- New Props Interface ---
// We now accept dynamic text and links for the buttons
interface Props {
  title: string;
  disc: string;
  image?: string;
  showCtas?: boolean; // optional, default true
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

const HeroSection: React.FC<Props> = ({
  title,
  disc,
  image,
  showCtas = true,
  primaryCtaText = "Get Started", // Default product-focused text
  primaryCtaLink = "/signup",
  secondaryCtaText = "Book a Demo",
  secondaryCtaLink = "/demo",
}) => {
  return (
    // Increased vertical padding for more breathing room (py-24 md:py-32)
    <section className="relative w-full  md:py-32 bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent overflow-hidden">
      
      {/* Constrains content width on large screens */}
      <div className="container mx-auto max-w-7xl">
        <div className="relative flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16">

          {/* === Left Content === */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            // Added z-10 to ensure text is above background glows
            className="flex-1 text-center md:text-left z-10"
          >
            {/* Improved Badge: Now a clickable link */}
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-[var(--primary-color)] text-sm font-medium px-4 py-1.5 rounded-full mb-5 shadow-sm transition-colors hover:shadow-md"
              style={{ backgroundColor: "rgba(53,154,255,0.15)" }}
            >
              ✨ New Features Available <span aria-hidden="true">→</span>
            </Link>

            {/* Improved Title: Larger and bolder for more impact */}
            <h1 className="text-5xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight tracking-tighter mb-6">
              {title}
            </h1>

            {/* Improved Description: Larger text for readability */}
            <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0 mb-8 leading-relaxed">
              {disc}
            </p>

            {/* Improved CTAs: Dynamic primary and secondary buttons */}
            {showCtas && (
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-10">
                <Link href={primaryCtaLink}>
                  {/* Assuming default variant is solid/primary */}
                  <CustomButton
                    text={primaryCtaText}
                    className="w-full sm:w-auto"
                  />
                </Link>
                <Link href={secondaryCtaLink}>
                  <CustomButton
                    text={secondaryCtaText}
                    variant="transparent"
                    className="w-full sm:w-auto"
                  />
                </Link>
              </div>
            )}
          </motion.div>

          {/* === Right Image === */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex justify-center md:justify-end relative w-full"
            >
              {/* Decorative glow */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[rgba(53,154,255,0.18)] blur-3xl rounded-full" aria-hidden="true" />
              
              <div className="relative w-full max-w-[640px] lg:max-w-[720px]">
                <Image
                  src={image}
                  alt={title || "Product screenshot"}
                  width={820}
                  height={560}
                  priority
                  // Upgraded shadow for more "pop"
                  className="rounded-2xl shadow-2xl object-cover w-full h-auto border border-gray-100/50"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;