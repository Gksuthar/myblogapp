"use client";

import AccountantCard from "@/components/AccountantCard";
import Tabs from "@/components/Tabs/Tabs";
import axios from "axios";
import { useEffect, useState } from "react";

interface TeamCard {
  title: string;
  description: string;
  image: string;
  tags: string[];
  buttonText?: string;
}

interface TeamCategory {
  tabName: string;
  cards: TeamCard[];
}
interface ContentData {
  _id?: string;
  title: string;
  description: string;
  image: string; // Can be base64 or a normal URL
}

export default function Team() {
  const [roles, setRoles] = useState<TeamCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [content, setContent] = useState<ContentData | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('/api/content');
        if (response.data && response.data.length > 0) {
          setContent(response.data[0]); // get first record
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/team"); // your GET API endpoint
        if (response?.data?.success) {
          setRoles(response?.data?.data);
        } else {
          console.error("Failed to fetch team data");
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return (
      <section className="flex justify-center items-center py-20">
        <p className="text-gray-600 text-xl">Loading team data...</p>
      </section>
    );
  }

  // Map API data to Tabs format
const tabsData = roles?.map((role) => ({
  label: role?.tabName, // Tab label from API
  value: role?.tabName.toLowerCase().replace(/\s+/g, "-"), // normalized value for Tabs
  component: (
    <div style={{marginBottom:"20px"}}>
      {role?.cards?.map((card, idx) => (
        <AccountantCard key={idx} {...card} />
      ))}
    </div>
  ),
}));


  return (
    <section className="flex flex-col py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white px-4 sm:px-6 md:px-10 lg:px-16">
      {/* Heading */}
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center md:text-left leading-tight">
        The Outsourcing Team You Can Count On
      </h3>

      {/* Subtext */}
      <p className="text-gray-600 text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mx-auto md:mx-0 text-center md:text-left mb-10">
        Looking for an Accountant to maintain clean-cut records or a Fractional CFO to create
        excellent financial strategy? Our elite professionals are ready to maximize productivity for you.
      </p>

      {/* Tabs Section */}
      <div className="mb-12">
        <Tabs
          tabs={tabsData || []}
          defaultActive={tabsData[0]?.value || ""}
          onChange={(value) => console.log("Selected Tab:", value)}
        />
      </div>

      {/* Services Section */}
     <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
      {/* Text Section */}
      <div className="flex-1 text-center md:text-left justify-center mb-8 md:mb-0">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mb-4 leading-snug">
          {content?.title || 'Outsource Accounting, Bookkeeping & Payroll Services'}
        </h3>

        <p className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
          {content?.description ||
            `Stanfox is a trusted outsource accounting and bookkeeping company that helps businesses
            gain financial clarity and operational efficiency. With a sharp focus on accuracy,
            compliance, and timeliness, we provide tailored solutions to CPAs, accounting firms,
            and startups. From recording daily transactions to managing end-to-end payroll,
            we bring expertise and peace of mind to your finance department.`}
        </p>
      </div>

      {/* Image Section */}
      <div className="flex-1 flex justify-center md:justify-end mb-8 md:mb-0">
        <img
          src={
            content?.image ||
            'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67e687fc26d372e8e15937d1_CFO%20Advisory%20Service.svg'
          }
          alt={content?.title || 'CFO Advisory Service'}
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
        />
      </div>
    </div>
    </section>
  );
}
