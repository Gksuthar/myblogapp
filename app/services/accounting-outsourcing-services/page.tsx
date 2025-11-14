'use client';

import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import ComponentLoader from '@/components/ComponentLoader';

// Lazy load components
const AccountingServiceCard = lazy(() => import('@/components/AccountingServiceCard'));

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
    title: "Accurate Record-Keeping",
    description: "Clear, organized records for financial health & simplified reporting - our team documents every transaction precisely.",
    icon: "📊",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    id: 2,
    title: "Expense Tracking & Management",
    description: "Track expenses precisely to manage costs, stay on budget, & reveal savings opportunities.",
    icon: "💰",
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    id: 3,
    title: "Bank Reconciliations",
    description: "Keep your client's bank & books aligned with regular reconciliations to spot & fix discrepancies, ensuring financial clarity.",
    icon: "📋",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    id: 4,
    title: "Payroll Processing",
    description: "We manage payroll, certifying accurate, on-time payments with full compliance & deductions for your client's team.",
    icon: "👥",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  },
  {
    id: 5,
    title: "Audit Preparation",
    description: "We streamline audit preparation, organizing records & verifying compliance, so your clients are audit-ready without the stress.",
    icon: "🔍",
    iconBg: "bg-red-100",
    iconColor: "text-red-600"
  },
  {
    id: 6,
    title: "Compliance With Tax Regulations",
    description: "We handle tax compliance, keeping your clients' records up to date & ensuring adherence to regulations.",
    icon: "📅",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600"
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
    name: "Shiv Panchal", 
    role: "Auditor",
    image: "/experts/shiv-panchal.jpg"
  }
];

export default function AccountingOutsourcingServices() {
  return (
    <Suspense fallback={<ComponentLoader height="h-screen" message="Loading accounting services..." />}>
      <main className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-gray-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              {...fadeIn(0.2)}
              className="space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Hire Top-Tier Offshore Bookkeeping Experts!
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Looking for certified bookkeepers from India for your CPA? Add SB Accounting&apos;s skilled Indian bookkeepers to your USA team & readily manage bookkeeping, reconciliations & more.
              </p>
              
              <motion.button
                {...fadeIn(0.4)}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                    <span className="text-gray-600 font-semibold">SP</span>
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

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn(0.2)}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How Our Bookkeepers Can Help You?
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Our skilled bookkeepers provide essential support to keep your business finances organized and accurate. Discover our way.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Suspense 
                key={service.id} 
                fallback={<ComponentLoader height="h-64" message="Loading service card..." />}
              >
                <AccountingServiceCard 
                  service={service} 
                  index={index} 
                />
              </Suspense>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
  <section className="py-20 bg-[var(--primary-color)]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeIn(0.2)}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Ready to Scale Your Accounting Practice?
            </h2>
            <p className="text-xl text-[rgba(255,255,255,0.9)]">
              Join hundreds of CPA firms who trust us with their bookkeeping needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[var(--primary-color)] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Contact Us
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[var(--primary-color)] transition-all duration-300"
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
