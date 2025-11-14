'use client';

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ComponentLoader from '@/components/ComponentLoader';
import axios from 'axios';

// Lazy load components
const ServiceCard = lazy(() => import('@/components/ServiceCard'));
const BenefitCard = lazy(() => import('@/components/BenefitCard'));

const fadeIn = (delay = 0, y = 40) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
});

interface ServiceData {
  _id: string;
  heroSection?: {
    title: string;
    description: string;
  };
  cardSections?: Array<{
    sectionTitle: string;
    sectionDescription?: string;
    cards: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
  }>;
  slug?: string;
}

export default function BookkeepingServices() {
  const [serviceData, setServiceData] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const apiToken = process.env.NEXT_PUBLIC_API_TOKEN;
        const response = await axios.get('/api/service', {
          headers: apiToken ? { 'x-api-token': apiToken } : {}
        });

        if (response.status === 200 && response.data) {
          const services = response.data.data || response.data;
          // Find bookkeeping service by slug
          const bookkeepingService = services.find((s: ServiceData) => 
            s.slug === 'bookkeeping-services' || 
            s.heroSection?.title?.toLowerCase().includes('bookkeeping')
          );
          setServiceData(bookkeepingService || null);
        }
      } catch (error) {
        console.error('Failed to fetch service data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, []);

  if (loading) {
    return <ComponentLoader height="h-screen" message="Loading bookkeeping services..." />;
  }

  // Extract card sections from service data
  const servicesSection = serviceData?.cardSections?.find(section => 
    section.sectionTitle?.toLowerCase().includes('tailored') || 
    section.sectionTitle?.toLowerCase().includes('services')
  );
  
  const benefitsSection = serviceData?.cardSections?.find(section => 
    section.sectionTitle?.toLowerCase().includes('benefit')
  );

  const services = servicesSection?.cards?.map((card, index) => ({
    id: index + 1,
    title: card.title,
    description: card.description,
    icon: card.icon || "📊"
  })) || [];

  const benefits = benefitsSection?.cards?.map((card, index) => ({
    id: index + 1,
    title: card.title,
    description: card.description,
    icon: card.icon || "✅"
  })) || [];

  const heroTitle = serviceData?.heroSection?.title || 'Bookkeeping Services';
  const heroDescription = serviceData?.heroSection?.description || 
    "SB Accounting provides comprehensive bookkeeping services designed to give your business financial clarity and efficiency.";
  
  const servicesTitle = servicesSection?.sectionTitle || "Tailored Bookkeeping Services";
  const servicesDescription = servicesSection?.sectionDescription || 
    "SB Accounting provides customized bookkeeping services tailored to meet the unique needs of your business.";
  
  const benefitsTitle = benefitsSection?.sectionTitle || "Benefits Of Outsourcing Bookkeeping To SB Accounting";
  const benefitsDescription = benefitsSection?.sectionDescription || 
    "Experience the advantages of partnering with SB Accounting for your bookkeeping needs.";

  return (
    <Suspense fallback={<ComponentLoader height="h-screen" message="Loading bookkeeping services..." />}>
      <main className="bg-gray-50 min-h-screen">
        {/* Complete Bookkeeping Services Hero Section */}
        <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                {...fadeIn(0.2)}
                className="space-y-8"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  {heroTitle}
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  {heroDescription}
                </p>
                
                <motion.button
                  {...fadeIn(0.4)}
                  className="px-8 py-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </motion.button>
              </motion.div>

              {/* Right Visual Elements */}
              <motion.div
                {...fadeIn(0.3)}
                className="relative lg:flex justify-center hidden"
              >
                {/* Main Document Icon (uses primary color instead of green) */}
                <div className="relative w-80 h-80 bg-[rgba(53,154,255,0.06)] border-4 border-[rgba(53,154,255,0.35)] rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">📊</div>

                  {/* Security Shield */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">✓</span>
                  </div>
                </div>

                {/* Floating Expert Cards */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 2, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute top-8 -left-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">KS</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Kajol Shah</p>
                      <p className="text-sm text-gray-600">Bookkeeper</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ 
                    y: [0, 10, 0],
                    rotate: [0, -2, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                  className="absolute bottom-8 -right-8 bg-white rounded-xl shadow-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">SM</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Soham Mohe</p>
                      <p className="text-sm text-gray-600">Fractional CFO</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tailored Bookkeeping Services Section */}
        {services.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeIn(0.2)}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {servicesTitle}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                {servicesDescription}
              </p>
            </motion.div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Suspense 
                  key={service.id} 
                  fallback={<ComponentLoader height="h-48" message="Loading service card..." />}
                >
                  <ServiceCard 
                    service={service || null} 
                    index={index} 
                  />
                </Suspense>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* Benefits Section */}
        {benefits.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeIn(0.2)}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {benefitsTitle}
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                {benefitsDescription}
              </p>
            </motion.div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <Suspense 
                  key={benefit.id} 
                  fallback={<ComponentLoader height="h-32" message="Loading benefit card..." />}
                >
                  <BenefitCard 
                    benefit={benefit || null} 
                    index={index} 
                  />
                </Suspense>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* CTA Section */}
         <section className="py-20 bg-[var(--primary-color)]">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeIn(0.2)}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Streamline Your Bookkeeping?
              </h2>
              <p className="text-xl text-[rgba(255,255,255,0.9)]">
                Join hundreds of businesses who trust SB Accounting with their bookkeeping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  onClick={() => window.location.href = '/Contactus'}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-[var(--primary-color)] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  Contact Us
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </Suspense>
  );
}
