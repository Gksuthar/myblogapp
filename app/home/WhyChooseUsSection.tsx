"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";

const features = [
  { icon: "https://res.cloudinary.com/dsu49fx2b/image/upload/v1762438740/download_15_m4vc8u.svg", title: "Faster Turn Around Time" },
  { icon: "https://res.cloudinary.com/dsu49fx2b/image/upload/v1762449314/download_23_pqznkv.svg", title: "10+ Years Of Experience" },
  { icon: "https://res.cloudinary.com/dsu49fx2b/image/upload/v1762438740/download_17_wfoegu.svg", title: "45+ Dedicated Accountants" },
  { icon: "https://res.cloudinary.com/dsu49fx2b/image/upload/v1762438740/download_18_lhk9gx.svg", title: "Adept At Multiple Accounting Tools" },
  { icon: "https://res.cloudinary.com/dsu49fx2b/image/upload/v1762447337/download_22_db5uyb.svg", title: "Flexible Working Models" },
  { icon: "https://res.cloudinary.com/dsu49fx2b/image/upload/v1762438740/download_20_wpkjsj.svg", title: "Cost-Efficient Services" },
];

interface ServiceItem {
  _id: string;
  heroSection?: { title: string; description: string };
}

interface WhyChooseData {
  title?: string;
  intro?: string[];
  benefits?: { title: string; description: string; image?: string }[];
  mission?: string;
  vision?: string;
  coreValues?: string[];
}

const WhyChooseUsSection: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [why, setWhy] = useState<WhyChooseData | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/service");
        if (response.status === 200) {
          const result = response?.data;
          const data = Array.isArray(result?.data)
            ? result.data
            : Array.isArray(result)
            ? result
            : [];
          setServices(data.slice(0, 4));
        } else {
          setServices([]);
        }
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchWhy = async () => {
      try {
        const res = await axios.get("/api/why-choose");
        const data = res?.data?.data || null;
        setWhy(data);
      } catch {
        setWhy(null);
      }
    };

    fetchServices();
    fetchWhy();
  }, []);

  const title =
    "Why Choose Sbaccounting For Outsourcing Accounting Services";
  const description =
    "Experience the Sbaccounting difference. Choose the perfect combo of expertise combined with adhering to the U.S. standards.";
  const ctaText = "Hire expert today →";

  return (
    <section className="bg-white py-14 px-5 sm:px-8 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-10">
        {/* LEFT SIDE */}
        <div className="w-full lg:w-1/2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 leading-snug mb-4">
            {title}
          </h2>

          <p className="text-gray-600 text-base sm:text-lg mb-6">
            {description}
          </p>

          <Link
            href="/Contactus"
            className="text-base sm:text-lg font-semibold border-b-2 border-indigo-600 pb-1 inline-flex items-center hover:text-indigo-700 transition-colors"
          >
            {ctaText}
          </Link>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 mt-10 pt-6 border-t border-gray-200">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start sm:items-center space-x-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: "#E0E7FF",
                  }}
                >
                  <img
                    src={feature.icon}
                    alt={feature.title}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
                <p className="text-gray-800 text-sm sm:text-base font-medium leading-snug">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end mt-10 lg:mt-0">
          <div className="w-full max-w-[480px] sm:max-w-[540px]">
            <Image
              src="https://res.cloudinary.com/dsu49fx2b/image/upload/v1762371393/ChatGPT_Image_Nov_6_2025_01_06_07_AM_nrmdjs.png"
              alt="Why Choose Us Illustration"
              width={560}
              height={400}
              className="rounded-xl shadow-md object-cover w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
