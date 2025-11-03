"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import CustomButton from "../ui/customButtom/Button";

interface Props {
  title: string;
  disc: string;
  image: string;
}

const HeroSection: React.FC<Props> = ({ title, disc, image }) => {
  return (
    <section className="relative flex flex-col-reverse md:flex-row items-center justify-between gap-10 px-6 md:px-16 py-10 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
      
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 text-center md:text-left "
      >
        <span
          className="inline-block text-[var(--primary-color)] text-sm font-medium px-3 py-1 rounded-full mb-4 shadow-sm"
          style={{ backgroundColor: "rgba(53,154,255,0.12)" }}
        >
          ✨ Learn. Build. Share.
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          {title}
        </h1>

        <p className="text-gray-600 max-w-lg mx-auto md:mx-0 mb-6 leading-relaxed">
          {disc}
        </p>

        <div className="flex items-center justify-center md:justify-start gap-4">
          <Link href="/blogs">
            <CustomButton
              text={
                <span className="flex items-center gap-2">
                  Explore Blogs <FaArrowRight className="text-sm" />
                </span>
              }
              variant="primary"
              className="shadow-md"
            />
          </Link>

          <Link href="/about">
            <CustomButton text="About Us" variant="transparent" />
          </Link>
        </div>
      </motion.div>

      {/* Right image */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex justify-center md:justify-center"
      >
        <div className="relative w-full max-w-[520px] lg:max-w-[580px] xl:max-w-[640px]">
          <Image
            src={image}
            alt="Accounting & bookkeeping illustration"
            width={640}
            height={480}
            priority
            className="rounded-2xl shadow-lg object-cover w-full h-auto"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
