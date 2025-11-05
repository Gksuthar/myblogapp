'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';
import HeroSection from '@/components/HeroSection/HeroSection';

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
        <HeroSection
          title={heroAbout.title || 'About Us'}
          disc={heroAbout.disc || ''}
          image={heroAbout.image || '/fallback-image.jpg'}
        />
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
