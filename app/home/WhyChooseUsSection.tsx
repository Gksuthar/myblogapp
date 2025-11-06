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
  { icon: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673353cc7b96883c00d791d3_watch_icon.svg', title: "Faster Turn Around Time" },
  { icon: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6734afc1da67ea2bf3c75fe0_award_icon.svg', title: "10+ Years Of Experience" },
  { icon: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67335458958dace9fee945cd_iconn.svg', title: "45+ Dedicated Accountants" },
  { icon: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6734afe660d081bdda9dd2a0_carbon_icon.svg', title: "Adept At Multiple Accounting Tools" },
  { icon: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673354584e4f6d1d4e5474c3_634d8c995ae78d70b3f7d82e_icon-right__card--why%252001.webp.svg', title: "Flexible Working Models" },
  { icon: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67335458f3f97e32549a38ec_634d8c995ae78d70b3f7d82e_icon-right__card--why%252001.webp-1.svg', title: "Cost-Efficient Services" },
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
    const fetchWhy = async () => {
      try {
        const res = await axios.get('/api/why-choose');
        const data = res?.data?.data || null;
        setWhy(data);
      } catch {
        setWhy(null);
      }
    };
    fetchServices();
    fetchWhy();
  }, []);
  // Static content to match the image
  const title = "Why Choose Stanfox For Outsourcing Accounting Services";
  const description = "Experience the Stanfox difference. Choose the perfect combo of expertise combined with adhering to the U.S. standards.";
  const ctaText = "Hire expert today →";
  const ctaLink = "/contact"; // Example link
  return (
  <section className="bg-white py-16 px-4 md:px-16 ">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-12">
        {/* Left Content - Matches Image Structure */}
        <div className="lg:w-1/2">
          {/* Title */}
          <h2 className="text-3xl lg:text-4xl xl:text-5xl font-extrabold text-gray-900 leading-tight mb-6" style={{ color: '#4A5568' /* Adjusted for a darker, purplish-gray tone from the image */ }}>
            {title}
          </h2>

          {/* Description */}
          <p className="text-gray-700 text-lg mb-6">
            {description}
          </p>
          
          {/* CTA Link */}
          <Link 
            href={ctaLink} 
            className="text-lg font-semibold border-b-2 border-blue-600 pb-1 inline-flex items-center hover:text-blue-800 transition-colors"
            style={{ color: '#4C51BF' /* Blue/Indigo color for link */, borderColor: '#4C51BF' }}
          >
            {ctaText}
          </Link>

          {/* Feature Grid - Matches Image Structure and Style */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-10 mt-12 pt-8 border-t border-gray-200">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-4">
                {/* Icon Container to simulate the circular/rounded style from the image */}
                <div 
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center`}
                  style={{ 
                    borderColor: '#E2E8F0', // Light border
                    backgroundColor: '#EDF2F7', // Light gray background
                    color: '#4C51BF', // Icon color
                    fontSize: '1rem', // Adjust icon size
                  }}
                >
                  <img src={feature.icon} alt="" />
                </div>
                {/* Feature Title */}
                <p className="text-base text-gray-800 font-medium leading-tight">
                  {feature.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Illustration/Graphic Area - Matches Image Structure */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end mt-8 lg:mt-0">
          <div className="md:mr-[20px] sm:p-6 w-full max-w-[560px] flex items-center justify-center" >
            {/* Placeholder for the complex illustration shown in the image */}
            <div className="relative w-full h-[400px] flex items-center justify-center rounded-[12px]">
            <img src="https://res.cloudinary.com/dsu49fx2b/image/upload/v1762371393/ChatGPT_Image_Nov_6_2025_01_06_07_AM_nrmdjs.png" className="!borounded-[12px]" style={{borderRadius: '12px'}} alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
