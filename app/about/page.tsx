'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';
import HeroSection from '@/components/HeroSection/HeroSection';
import { Link } from 'ckeditor5';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
}

interface Value {
  title: string;
  description: string;
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
      // remove <img /> tags
      .replace(/<img[^>]*>/gi, '')
      // remove <picture>..</picture>
      .replace(/<picture[^>]*>[\s\S]*?<\/picture>/gi, '')
      // remove <figure>..</figure>
      .replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '')
      // remove inline svgs
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
      // remove anchors that only wrap images
      .replace(/<a[^>]*>\s*(?:<img[^>]*>\s*)+<\/a>/gi, '');
    return html;
  }, [aboutData?.companyHistory]);

  if (loading) return <ComponentLoader height="h-64" message="Loading about page..." />;

  return (
    <div>
      {/* Hero Section */}
      {heroAbout && (
        <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-16 md:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Main Content */}
            <div className="w-full lg:w-3/5 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                Work With The Top Accounting Talent; Fast, Skilled, And Specialized
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto lg:mx-0">
                Partner with Stanfox to elevate your practice. From precision in data to streamlined processes, we
                handle the heavy lifting, allowing you to focus on what matters most—your clients. Discover the
                Stanfox difference today
              </p>
              {/* <Link href="/contact-us" className="inline-block bg-gray-800 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-900 transition-colors duration-300 shadow-lg">
            Get Started
          </Link> */}
            </div>

            {/* Floating Cards and Images - Positioned Absolutely to mimic the image */}
            <div className="relative w-full lg:w-2/5 h-[500px] lg:h-[600px] flex items-center justify-center -mt-16 lg:mt-0">
              {/* Main background gradient circle/blob - to simulate the subtle background effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-200 to-purple-100 opacity-30 blur-3xl z-0 animate-pulse-slow"></div>

              {/* Left Side Floating Elements */}
              <div className="absolute top-1/4 left-0 transform -translate-x-1/4 -translate-y-1/2 z-20">
                {/* Pinal Mehta Card */}
                <div className="bg-white rounded-lg shadow-xl p-3 flex items-center space-x-3 min-w-[200px]" style={{ transform: 'rotate(-5deg)' }}>
                  <Image src="https://via.placeholder.com/40" alt="Pinal Mehta" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Pinal Mehta</p>
                    <p className="text-gray-500 text-xs">Fractional CFO</p>
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

              <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 z-20">
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

              <div className="absolute bottom-1/4 right-0 transform translate-x-1/4 -translate-y-1/2 z-20">
                {/* Shiv Panchal Card */}
                <div className="bg-white rounded-lg shadow-xl p-3 flex items-center space-x-3 min-w-[200px]" style={{ transform: 'rotate(-5deg)' }}>
                  <Image src="https://via.placeholder.com/40" alt="Shiv Panchal" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Shiv Panchal</p>
                    <p className="text-gray-500 text-xs">Auditee</p>
                  </div>
                </div>
              </div>

              {/* Dotted Lines (Simplified visual representation) */}
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
      )}

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
            <p>{aboutData?.mission || 'Our mission is to deliver excellence.'}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold mb-3">Our Vision</h2>
            <p>{aboutData?.vision || 'We envision a future built on innovation and trust.'}</p>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Our History</h2>
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{
              __html: sanitizedHistory || '<p>Our story began with a passion for innovation.</p>',
            }}
          />
        </div>
      </section>

      {/* Team Section */}
      {aboutData?.team?.length ? (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-8">Our Team</h2>
            <div className="flex flex-wrap justify-center gap-8">
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
                <div key={idx} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
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
    </div>
  );
};

export default AboutPage;
