"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaClock,
  FaStar,
  FaUsers,
  FaTools,
  FaPuzzlePiece,
  FaDollarSign,
} from "react-icons/fa";

const features = [
  { icon: <FaClock />, title: "Faster Turn Around Time" },
  { icon: <FaStar />, title: "10+ Years Of Experience" },
  { icon: <FaUsers />, title: "45+ Dedicated Accountants" },
  { icon: <FaTools />, title: "Adept At Multiple Accounting Tools" },
  { icon: <FaPuzzlePiece />, title: "Flexible Working Models" },
  { icon: <FaDollarSign />, title: "Cost-Efficient Services" },
];

interface ServiceItem {
  _id: string;
  heroSection?: { title: string; description: string };
}

const WhyChooseUsSection: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/service');
        if (response.status === 200) {
          const result = response?.data;
          const data = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
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
    fetchServices();
  }, []);
  return (
    <section className="bg-white py-16 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Why Choose Stanfox For <br /> Outsourcing Accounting Services
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Experience the Stanfox difference. Choose the perfect combo of expertise combined with adherence to U.S. standards.
          </p>

          <Link
            href="/hire-expert"
            className="text-[var(--primary-color)] font-semibold text-lg hover:underline flex items-center mb-4"
          >
            Hire expert today <span className="ml-2">→</span>
          </Link>

          <Link
            href="/services-list"
            className="text-[var(--primary-color)] font-semibold text-lg hover:underline flex items-center mb-12 lg:mb-0"
          >
            View all services <span className="ml-2">→</span>
          </Link>

          {/* Preview a few services */}
          <div className="mt-6">
            {loading ? (
              <p className="text-gray-500 text-sm">Loading services…</p>
            ) : (
              <ul className="space-y-2">
                {services?.map((svc) => (
                  <li key={svc._id}>
                    <Link
                      href={`/services/${(svc.heroSection?.title || 'service').toLowerCase().replace(/\s+/g, '-')}`}
                      className="text-gray-800 hover:text-[var(--primary-color)] text-base"
                    >
                      {svc.heroSection?.title || 'Untitled'}
                    </Link>
                  </li>
                ))}
                {!loading && services?.length === 0 && (
                  <li className="text-gray-500 text-sm">No services available.</li>
                )}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 hover:translate-x-1 transition-transform duration-300"
              >
                <div className="text-[var(--primary-color)] text-2xl">{feature.icon}</div>
                <p className="text-lg text-gray-800 font-medium">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Illustration with brand-colored highlight */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative group rounded-3xl p-4 sm:p-6 w-full max-w-[560px] border border-gray-200 bg-white shadow-sm">
            <div className="relative">
              <Image
                src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67348d71d96b43d96eea23f1_why_choose.svg"
                alt="Why choose illustration"
                width={560}
                height={420}
                className="w-full h-auto rounded-2xl"
              />
              {/* Tint overlay inside the image area to shift accents to primary */}
              <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--primary-color)] mix-blend-multiply opacity-15 group-hover:opacity-25 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
