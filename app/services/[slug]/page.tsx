'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useParams } from 'next/navigation';
import ComponentLoader from '@/components/ComponentLoader';
const HeroSection = React.lazy(() => import('@/components/HeroSection/HeroSection'));

interface ServiceDoc {
  _id: string;
  slug?: string;
  categoryId?: string;
  heroSection?: {
    title?: string;
    description?: string;
    image?: string;
  };
  serviceCardView?: {
    title?: string;
    description?: string;
  };
  cardSections?: Array<{
    sectionTitle?: string;
    sectionDescription?: string;
    cards?: Array<{
      title?: string;
      description?: string;
    }>;
  }>;
  content?: string;
  createdAt?: string;
}

const toSlug = (text: string) =>
  (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function ServiceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<ServiceDoc | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchService = async () => {
      // ... (fetch logic remains the same)
      try {
        setLoading(true);
        setError('');
        const res = await axios.get('/api/service');
        if (res.status === 200) {
          const rawData = Array.isArray(res.data?.data)
            ? res.data.data
            : Array.isArray(res.data)
            ? res.data
            : [];

          
          // Normalize and match robustly: prefer direct _id match; otherwise compare normalized slugs
          const requested = (slug || '').toString();
          const requestedSlug = toSlug(requested);

          const match = (rawData as ServiceDoc[]).find((s) => {
            const sid = s._id?.toString();
            if (sid && sid === requested) return true;

            // Also match categoryId directly if provided
            const catId = s.categoryId?.toString();
            if (catId && catId === requested) return true;

            // Build a normalized slug from available fields on the DB record
            const candidate = s.slug || s.heroSection?.title || s.serviceCardView?.title || '';
            const dbSlug = toSlug(candidate.toString());

            return dbSlug === requestedSlug;
          });

          if (match) setService(match);
          else setError('Service not found');
        } else {
          setError('Failed to load service');
        }
      } catch (e: unknown) {
        const err = e as { response?: { data?: { error?: string } } };
        setError(err?.response?.data?.error || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchService();
  }, [slug]);


  // Check if hero section has content
  const hasHeroSection =  service?.heroSection?.title?.trim() || service?.heroSection?.description?.trim() || service?.heroSection?.image?.trim();

  // Check if serviceCardView has content
  const serviceCardView = service?.serviceCardView && !Array.isArray(service.serviceCardView) ? service.serviceCardView : null;
  const hasServiceCardView =  serviceCardView?.title?.trim() || serviceCardView?.description?.trim();

  // Check if card sections exist
  const hasCardSections = Array.isArray(service?.cardSections) &&  service.cardSections.length > 0;

  const shouldShowHero = hasHeroSection || (hasServiceCardView && hasCardSections);
  const heroTitle = hasHeroSection && service?.heroSection?.title?.trim()
    ? service.heroSection.title
    : serviceCardView?.title?.trim() || "Default Title";
  const heroDescription = hasHeroSection && service?.heroSection?.description?.trim()
    ? service.heroSection.description
    : serviceCardView?.description?.trim() || "Default Description";
  const heroImage = service?.heroSection?.image?.trim() || "/default-image.jpg";
  return (
    <>
    {/* 🌟 Responsive Container: Centers content, limits max width, and applies responsive horizontal padding (px-4 for small, sm:px-6 for medium, lg:px-8 for large screens) */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {loading && <ComponentLoader height="h-24" />}

      {!loading && error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && service && (
        <>
          {/* HeroSection content */}
          {shouldShowHero && (
            <Suspense fallback={<ComponentLoader height="h-64" message="Loading hero..." />}>
              <HeroSection
                title={heroTitle}
                disc={heroDescription}
                image={heroImage}
              />
            </Suspense>
          )}

          {/* ServiceCardView content */}
          {hasServiceCardView && hasCardSections && serviceCardView && (
            <div className="rounded-2xl p-6 shadow-md mt-8 mb-8 border border-gray-200" style={{ background: 'linear-gradient(135deg, #eaf5ff 0%, #f5faff 50%, #ffffff 100%)' }}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {serviceCardView.title}
              </h2>
              {serviceCardView.description && (
                <p className="text-gray-600">{serviceCardView.description}</p>
              )}
            </div>
          )}

          {/* Card Sections */}
          {Array.isArray(service.cardSections) && service.cardSections.length > 0 && (
            <section className="space-y-8 mt-10">
              {service.cardSections.map((section, idx) => (
                <div
                  key={`${section.sectionTitle || 'section'}-${idx}`}
                  className="rounded-2xl p-6 shadow-md border border-gray-200"
                  style={{ background: 'linear-gradient(135deg, #eaf5ff 0%, #f5faff 50%, #ffffff 100%)' }}
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {section.sectionTitle || 'Section'}
                  </h2>
                  {section.sectionDescription && (
                    <p className="text-gray-600 mb-4">{section.sectionDescription}</p>
                  )}
                  {/* 🌟 Responsive Grid: Stacks cards on small screens, 2 columns on medium (sm), 3 columns on large (lg) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.isArray(section.cards) &&
                      section.cards.map((card, i) => (
                        <div
                          key={`${card.title || 'card'}-${i}`}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow transition-shadow"
                        >
                          <h3 className="font-semibold text-gray-800 mb-1">
                            {card.title || 'Card Title'}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {card.description || 'No description available'}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Content */}
          {service.content && (
            <section className="prose max-w-none mt-10">
              {/* prose class provides responsive typography based on screen size */}
              <div dangerouslySetInnerHTML={{ __html: service.content }} />
            </section>
          )}

          {/* Back to Services Button */}
          <div className="mt-12 mb-8 flex justify-center">
            <a
              href="/services-list"
              className="inline-flex items-center px-5 py-2.5 rounded-full font-medium hover:shadow-md transition-all duration-200"
              style={{ backgroundColor: '#359aff', color: '#ffffff' }}
            >
              ← Back to Services
            </a>
          </div>
        </>
      )}
    </div>

    {/* Full-bleed CTA */}
    <section
      aria-label="site-cta"
      // Full-bleed responsiveness achieved by pushing the component off-screen and expanding it to screen width
      className="bg-[#2A80FF] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen"
    >
      <div className="mx-auto text-center px-6 sm:px-6 lg:px-8 pt-20 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          {/* 🌟 Responsive Heading: text-4xl on small, md:text-5xl on medium screens and up */}
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Streamline Your Business?
          </h2>

          {/* Subheading: max-w-2xl ensures text remains readable even on very large screens */}
          <p className="text-lg text-[rgba(255,255,255,0.9)] max-w-2xl mx-auto">
            Join hundreds of businesses who trust SB Accounting with their accounting needs.
          </p>

          {/* 🌟 Responsive Buttons: Stacks buttons vertically (flex-col) on small screens, and lays them side-by-side (sm:flex-row) on medium screens and up */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => (window.location.href = '/Contactus')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-[#2A80FF] font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>


    </>
  );
}