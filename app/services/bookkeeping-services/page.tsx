'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import ComponentLoader from '@/components/ComponentLoader';

// Lazy load components
const ServiceCard = lazy(() => import('@/components/ServiceCard'));
const BenefitCard = lazy(() => import('@/components/BenefitCard'));

const fadeIn = (delay = 0, y = 40) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
});

// Service data based on the design
const services = [
  {
    id: 1,
    title: "Ledger Management",
    description: "Comprehensive ledger management to maintain accurate financial records and ensure proper categorization of all transactions.",
    icon: "⚙️"
  },
  {
    id: 2,
    title: "Transactions Recording",
    description: "Detailed recording of all financial transactions with proper documentation and systematic organization.",
    icon: "🔍"
  },
  {
    id: 3,
    title: "Bank Reconciliations",
    description: "Regular bank reconciliation services to ensure your books match your bank statements perfectly.",
    icon: "💰"
  },
  {
    id: 4,
    title: "Accounts Payable And Receivable",
    description: "Complete management of accounts payable and receivable to maintain healthy cash flow and vendor relationships.",
    icon: "💳"
  },
  {
    id: 5,
    title: "Expense Tracking & Categorization",
    description: "Systematic expense tracking and categorization to provide clear insights into your business spending patterns.",
    icon: "📊"
  },
  {
    id: 6,
    title: "Financial Reporting",
    description: "Comprehensive financial reporting including P&L statements, balance sheets, and cash flow statements.",
    icon: "📈"
  }
];

// Benefits data
const benefits = [
  {
    id: 1,
    title: "Certified & Experienced Bookkeepers",
    description: "Our team consists of certified professionals with extensive experience in various industries and accounting software.",
    icon: "✅"
  },
  {
    id: 2,
    title: "Prepare Seamless Reports",
    description: "We generate comprehensive financial reports that provide clear insights into your business performance and financial health.",
    icon: "📈"
  },
  {
    id: 3,
    title: "Complete Record Keeping",
    description: "Maintain complete and accurate financial records with proper documentation and systematic organization.",
    icon: "📋"
  },
  {
    id: 4,
    title: "Tech-Savvy Bookkeepers At Hand",
    description: "Our team is proficient in the latest accounting software and technology to provide efficient and modern bookkeeping services.",
    icon: "💻"
  }
];

// Expert profiles for floating cards
const experts = [
  {
    name: "Kajol Shah",
    role: "Bookkeeper",
    image: "/experts/kajol-shah.jpg"
  },
  {
    name: "Soham Mohe", 
    role: "Fractional CFO",
    image: "/experts/soham-mohe.jpg"
  }
];

export default function BookkeepingServices() {
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
                  Complete Bookkeeping Services.
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  Stanfox provides comprehensive bookkeeping services designed to give your business financial clarity and efficiency. Our expert team handles all aspects of your financial record-keeping with precision and professionalism.
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
                {/* Main Document Icon */}
                <div className="relative w-80 h-80 bg-green-50 border-4 border-green-200 rounded-2xl flex items-center justify-center">
                  <div className="text-6xl">📊</div>
                  
                  {/* Security Shield */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
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
                      <p className="font-semibold text-gray-900">{experts[0].name}</p>
                      <p className="text-sm text-gray-600">{experts[0].role}</p>
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
                      <p className="font-semibold text-gray-900">{experts[1].name}</p>
                      <p className="text-sm text-gray-600">{experts[1].role}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Tailored Bookkeeping Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeIn(0.2)}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Tailored Bookkeeping Services
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Stanfox provides customized bookkeeping services tailored to meet the unique needs of your business, ensuring accuracy and compliance with industry standards.
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

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeIn(0.2)}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Benefits Of Outsourcing Bookkeeping To Stanfox
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the advantages of partnering with Stanfox for your bookkeeping needs. We provide accuracy, efficiency, and peace of mind through our professional services.
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

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeIn(0.2)}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Streamline Your Bookkeeping?
              </h2>
              <p className="text-xl text-blue-100">
                Join hundreds of businesses who trust Stanfox with their bookkeeping needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
                >
                  Start Free Trial
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300"
                >
                  Schedule Consultation
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </Suspense>
  );
}
