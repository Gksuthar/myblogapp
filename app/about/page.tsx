'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';
import HeroSection from '@/components/HeroSection/HeroSection';
import WhyChooseUsGrid from './WhyChooseUsGrid';
import WhyChooseUsSection from '../home/WhyChooseUsSection';
import TestimonialCarousel from './TestimonialCarousel';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

interface Value {
  title: string;
  description: string;
  image?: string;
}

interface AboutData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  team: TeamMember[];
  companyHistory: string;
  values: Value[];
}

interface HeroType {
  title: string;
  disc: string;
  image: string;
}

const AboutPage: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [heroAbout, setHeroAbout] = useState<HeroType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Fetch About Data
  const fetchAboutData = async () => {
    try {
      const res = await fetch('/api/about', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch about data');
      const data = await res.json();
      setAboutData(data);
    } catch (error) {
      console.error('Error loading about data:', error);
    }
  };

  // Fetch Hero Data
  const fetchHero = async () => {
    try {
      const res = await fetch('/api/heroabout', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch hero data');
      const data = await res.json();
      setHeroAbout(data.error ? null : data);
    } catch (error) {
      console.error('Error loading hero section:', error);
    }
  };

  // Load both on mount
  useEffect(() => {
    (async () => {
      await Promise.all([fetchAboutData(), fetchHero()]);
      setLoading(false);
    })();
  }, []);

  // Remove inline images, figures and svg-only buttons from rich HTML like company history
  const sanitizedHistory = useMemo(() => {
    const raw = aboutData?.companyHistory || '';
    if (!raw) return '';
    const html = raw
      .replace(/<img[^>]*>/gi, '')
      .replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '')
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      .replace(/<a[^>]*>\s*(?:<img[^>]*>\s*)+<\/a>/gi, '');
    return html;
  }, [aboutData?.companyHistory]);

  const [companies, setCompanies] = useState<any[]>([
    { _id: 1, name: 'Seven', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432492/seven_itm1wc.png' },
    { _id: 2, name: 'Third', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432491/third_a7rozp.png' },
    { _id: 3, name: 'Four', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432491/four_udda39.png' },
    { _id: 4, name: 'First', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432491/first_j29tcj.png' },
    { _id: 5, name: 'Five', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432491/five_igwygo.png' },
    { _id: 6, name: 'Eight', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432491/eight_eub5iv.png' },
    { _id: 7, name: 'None', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432491/none_trhcky.png' },
    { _id: 8, name: 'Tan', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432490/tan_adqseg.png' },
    { _id: 9, name: 'Tan', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762446913/6720b06e1362c9b92e7b485f_image_376_jfpjzo.png' },
    { _id: 10, name: 'Six', image: 'https://res.cloudinary.com/dsu49fx2b/image/upload/v1762432490/six_dvuxqi.png' },
  ]);
  const [loadingCompanies, setLoadingCompanies] = useState<boolean>(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/tructedCompany', { cache: 'no-store' });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load trusted companies');
        // if (alive) setCompanies(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to fetch trusted companies:', e);
      } finally {
        if (alive) setLoadingCompanies(false);
      }
    })();
    return () => { alive = false };
  }, []);

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!aboutData?.team?.length) return;
    
    const minSwipeDistance = 50;
    const distance = touchStart - touchEnd;
    
    if (distance > minSwipeDistance) {
      setCurrentSlide((prev) => 
        prev === aboutData.team.length - 1 ? 0 : prev + 1
      );
    }
    
    if (distance < -minSwipeDistance) {
      setCurrentSlide((prev) => 
        prev === 0 ? aboutData.team.length - 1 : prev - 1
      );
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    if (!aboutData?.team?.length) return;
    setCurrentSlide((prev) => 
      prev === aboutData.team.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!aboutData?.team?.length) return;
    setCurrentSlide((prev) => 
      prev === 0 ? aboutData.team.length - 1 : prev - 1
    );
  };

  if (loading) return <ComponentLoader height="h-64" message="Loading about page..." />;
  
  const skeletonCount = 18;

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-3/5 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Work With The Top Accounting Talent; Fast, Skilled, And Specialized
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
              Partner with SB Accounting to elevate your practice. From precision in data to streamlined processes, we
              handle the heavy lifting, allowing you to focus on what matters most—your clients. Discover the
              SB Accounting difference today
            </p>
          </div>

          {/* Floating Cards and Images - hidden on mobile/tablet, show only on large+ */}
          <div className="hidden lg:flex relative lg:w-2/5 lg:h-[600px] lg:items-center lg:justify-center">
            {/* Main background gradient circle/blob - to simulate the subtle background effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200 to-purple-100 opacity-30 blur-3xl z-0 animate-pulse-slow"></div>

            {/* Left Side Floating Elements */}
            <div className="absolute top-1/4 left-0 transform -translate-x-1/4 -translate-y-1/2 z-20 ">
              {/* Pinal Mehta Card */}
              {/* <div className="bg-white rounded-lg shadow-xl p-3 flex items-center justify-center min-w-[64px] min-h-[64px]" style={{ transform: 'rotate(-5deg)' }}>
                <Image
                  src="https://res.cloudinary.com/dsu49fx2b/image/upload/v1762434925/download_12_soxysp.svg"
                  alt="Team Member"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </div> */}
          <div className="bg-gradient-to-br  from-white to-indigo-50   rounded-2xl shadow-xl p-6 w-[220px] hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
  {/* Animated background glow */}
  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/20 via-blue-100/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

  {/* Lock icon area */}
  <div className="relative flex flex-col items-center md:ml-[10px]">
    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 shadow-md shadow-indigo-200 mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="white"
        className="w-8 h-8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3M6.75 10.5h10.5A1.75 1.75 0 0119 12.25v7A1.75 1.75 0 0117.25 21h-10.5A1.75 1.75 0 015 19.25v-7A1.75 1.75 0 016.75 10.5z"
        />
      </svg>
    </div>

    {/* Text */}
    <h3 className="text-gray-900 font-bold text-lg mb-1 tracking-wide">
      Security
    </h3>
    <p className="text-sm text-gray-500 text-center leading-snug">
      End-to-end encryption and data protection across all systems.
    </p>

    {/* Animated underline */}
    <div className="w-[50%] h-[3px] bg-gradient-to-r from-indigo-500 to-blue-400 mt-3 rounded-full animate-pulse"></div>
  </div>
</div>

            </div>

            

            <div className="absolute top-2/3 left-1/4 transform -translate-x-1/2 z-20">
              {/* Chart Card */}
              <div className="bg-white rounded-lg shadow-xl p-4 min-w-[220px]" style={{ transform: 'rotate(5deg)' }}>
                <p className="text-xs text-gray-500 mb-1">Weekly Completion Rate</p>
                <div className="flex items-end justify-between h-20">
                  {/* Example Bars */}
                  <div className="w-4 bg-blue-200 h-3/5 rounded-t-sm"></div>
                  <div className="w-4 bg-blue-300 h-4/5 rounded-t-sm"></div>
                  <div className="w-4 bg-blue-400 h-full rounded-t-sm"></div>
                  <div className="w-4 bg-blue-300 h-3/5 rounded-t-sm"></div>
                  <div className="w-4 bg-blue-200 h-2/5 rounded-t-sm"></div>
                  <div className="w-4 bg-blue-100 h-1/5 rounded-t-sm"></div>
                  <div className="w-4 bg-blue-50 h-0.5 rounded-t-sm"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 z-20 mb-20">
              {/* Small Smiley Card */}
              <div className="bg-white rounded-lg shadow-xl p-2 flex items-center space-x-2">
                <span className="text-xl">😊</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">You are doing good!</p>
                  <p className="text-xs text-gray-500">You almost reached your goal</p>
                </div>
              </div>
            </div>

            {/* Right Side Floating Elements */}
            <div className="absolute top-1/4 right-0 transform translate-x-1/4 -translate-y-1/2 z-20">
              {/* Performance Card */}
              <div className="bg-white rounded-lg shadow-xl p-4 min-w-[180px]" style={{ transform: 'rotate(5deg)' }}>
                <div className="flex items-center justify-between mb-2">
                  {/* Dial graphic - simplified */}
                  <div className="relative w-16 h-16 rounded-full border-4 border-gray-200 flex items-center justify-center">
                    <div className="absolute w-2 h-2 rounded-full bg-blue-500"></div>
                    <div className="absolute w-0.5 h-6 bg-blue-500 origin-bottom transform rotate-45 translate-y-[-10px]"></div>
                  </div>
                  <div className="text-gray-400 text-2xl ml-2">⚙️</div> {/* Gear icon */}
                </div>
                <p className="font-semibold text-gray-800 text-lg">Performance</p>
              </div>
            </div>
<div className="absolute bottom-[5%] right-0 transform translate-x-1/4 -translate-y-1/2 z-20">
  {/* Glowing Abstract Card */}
  <div className="absolute bottom-[-18%] right-[37%] transform rotate-2 z-10">
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-6 w-[220px] hover:scale-105 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      {/* Soft glowing background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-300/20 via-blue-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>

      {/* Animated abstract rings */}
      <div className="relative flex items-center justify-center h-24">
        {/* Outer ring */}
        <div className="absolute w-20 h-20 rounded-full border-4 border-indigo-300 animate-ping-slow"></div>

        {/* Middle ring */}
        <div className="absolute w-14 h-14 rounded-full border-2 border-blue-400 animate-spin-slow"></div>

        {/* Inner glowing circle */}
        <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-blue-400 shadow-lg shadow-indigo-200 animate-pulse"></div>
      </div>

      {/* Bottom glowing line */}
      <div className="w-[60%] h-[3px] bg-gradient-to-r from-indigo-500 to-blue-400 mt-6 mx-auto rounded-full animate-pulse"></div>
    </div>
  </div>
</div>


            <div className="absolute inset-0 z-0 opacity-50">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Left Path */}
                <path d="M10 20 C20 5, 40 5, 50 20 S80 50, 60 70 S30 90, 20 80"
                  strokeDasharray="2,2" stroke="#CBD5E0" fill="none" />
                <circle cx="10" cy="20" r="1" fill="#CBD5E0" />
                <circle cx="50" cy="20" r="1" fill="#CBD5E0" />
                <circle cx="60" cy="70" r="1" fill="#CBD5E0" />
                <circle cx="20" cy="80" r="1" fill="#CBD5E0" />

                {/* Right Path */}
                <path d="M90 10 C80 5, 60 5, 50 15 S20 40, 40 60 S70 80, 80 90"
                  strokeDasharray="2,2" stroke="#CBD5E0" fill="none" />
                <circle cx="90" cy="10" r="1" fill="#CBD5E0" />
                <circle cx="50" cy="15" r="1" fill="#CBD5E0" />
                <circle cx="40" cy="60" r="1" fill="#CBD5E0" />
                <circle cx="80" cy="90" r="1" fill="#CBD5E0" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUsGrid />
      <WhyChooseUsSection />

      {/* Team Section with Mobile Slider */}
      {aboutData?.team?.length ? (
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-8">Our Team</h2>
            
            {/* Desktop View - Grid */}
            <div className="hidden md:flex flex-wrap justify-center gap-8">
              {aboutData.team.map((member, idx) => (
                <div key={idx} className="bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent bg-white p-8 rounded-lg shadow-md text-center w-full max-w-sm flex-shrink-0">
                  <div className="mx-auto mb-4 w-32 h-32 rounded-full overflow-hidden">
                    <Image
                      src={member.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold">{member.name}</h3>
                  <p className="text-indigo-600 text-lg font-medium">{member.position}</p>
                  <p className="text-gray-600 text-base mt-3 leading-relaxed">{member.bio}</p>
                </div>
              ))}
            </div>

            {/* Mobile View - Slider */}
            <div className="md:hidden relative">
              <div 
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div 
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {aboutData.team.map((member, idx) => (
                    <div key={idx} className="w-full flex-shrink-0 px-4">
                      <div className="bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent bg-white p-6 rounded-lg shadow-md text-center">
                        <div className="mx-auto mb-4 w-28 h-28 rounded-full overflow-hidden">
                          <Image
                            src={member.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300'}
                            alt={member.name}
                            width={112}
                            height={112}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p className="text-indigo-600 text-base font-medium mb-3">{member.position}</p>
                        <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg z-10 hover:bg-white transition-colors"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg z-10 hover:bg-white transition-colors"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center mt-6 gap-2">
                {aboutData.team.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'bg-indigo-600 w-8' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Values Section */}
      {aboutData?.values?.length ? (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {aboutData.values.map((v, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-8 border border-gray-100 flex flex-col items-center">
                  {v.image && (
                    <img
                      src={v.image}
                      alt={v.title}
                      className="mb-4 w-20 h-20 object-contain"
                      style={{ maxWidth: '80px', maxHeight: '80px' }}
                    />
                  )}
                  <h3 className="text-xl font-semibold text-gray-900">
                    {v.title}
                  </h3>
                  <p className="text-gray-700 mt-2 leading-7">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <TestimonialCarousel />

      <section className="relative md:py-20 overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "url(https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6736f52aa2dea93969a896f8_line_cta.svg)",
          }}
        />
        {/* Center content */}
        <div className="relative flex items-center justify-center py-16">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 transition-all duration-300 hover:-translate-y-1 text-center px-10 py-12 max-w-xl w-full mx-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Let's Connect!
            </h2>
            <p className="text-gray-600 text-base md:text-lg mb-8">
              Connect with our accounting professionals & get started today!
            </p>
            <a href="/Contactus" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all shadow-md">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <section className="min-h-screen bg-gray-100 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#4b4b8a] mb-14">
            We Are Adroit With Multiple Accounting Tools!
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-center">
            {loadingCompanies &&
              Array.from({ length: skeletonCount }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="h-16 w-full rounded-md bg-gray-100 animate-pulse border border-gray-200"
                />
              ))}

            {!loadingCompanies &&
              companies.map((c) => (
                <div
                  key={c._id}
                  className="aspect-square w-full border border-gray-200 rounded-md bg-white p-1 overflow-hidden flex items-center justify-center
                  transition-all duration-300 ease-in-out
                  hover:border-[var(--primary-color)] hover:shadow-lg hover:shadow-[rgba(53,154,255,0.15)] hover:-translate-y-1 hover:scale-105
                  cursor-pointer group"
                >
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="max-h-[92%] max-w-[95%] object-contain transition-transform duration-300 ease-in-out group-hover:scale-110"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : null}
                  {!c.image && (
                    <span className="text-[11px] font-semibold text-gray-600 truncate px-2 text-center transition-colors duration-300 group-hover:text-[var(--primary-color)]">
                      {c.name}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;