'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
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

          // Check if slug is a MongoDB ObjectId (24 hex characters)
          const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
          
          const match = (rawData as ServiceDoc[]).find((s) => {
            if (isObjectId) {
              // Match by _id first (most specific), then categoryId
              // Convert _id to string for comparison
              const serviceId = s._id?.toString();
              const serviceCategoryId = s.categoryId?.toString();
              return serviceId === slug || serviceCategoryId === slug;
            } else {
              // Match by slug or generated slug from title
              const dbSlug = s.slug || toSlug(s.heroSection?.title || '');
              return dbSlug === slug;
            }
          });

          if (match) setService(match);
          else setError('Service not found');
        } else {
          setError('Failed to load service');
        }
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Failed to load service');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchService();
  }, [slug]);

  const pageTitle = useMemo(() => service?.heroSection?.title || 'Service', [service]);

  const defaultHero = {
    title: 'Our Services',
    description:
      'We provide reliable, professional, and customizable business solutions designed to fit your goals.',
    image:
      'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcfeeebafefe65ebd0_icons8-checklist-94%201.svg',
  };

  // Check if hero section has content
  const hasHeroSection = 
    service?.heroSection?.title?.trim() || 
    service?.heroSection?.description?.trim() || 
    service?.heroSection?.image?.trim();

  // Check if serviceCardView has content
  const serviceCardView = service?.serviceCardView && !Array.isArray(service.serviceCardView) 
    ? service.serviceCardView 
    : null;
  const hasServiceCardView = 
    serviceCardView?.title?.trim() || 
    serviceCardView?.description?.trim();

  // Check if card sections exist
  const hasCardSections = 
    Array.isArray(service?.cardSections) && 
    service.cardSections.length > 0;

  // Determine what to show
  // If hero section is empty, don't show it
  // If serviceCardView title, description, and card sections exist, show both hero and serviceCardView
  // Use hero section data if available, otherwise use serviceCardView data
  const shouldShowHero = hasHeroSection || (hasServiceCardView && hasCardSections);
  const heroTitle = hasHeroSection && service?.heroSection?.title?.trim()
    ? service.heroSection.title
    : serviceCardView?.title?.trim() || defaultHero.title;
  const heroDescription = hasHeroSection && service?.heroSection?.description?.trim()
    ? service.heroSection.description
    : serviceCardView?.description?.trim() || defaultHero.description;
  const heroImage = service?.heroSection?.image?.trim()
    ? service.heroSection.image
    : defaultHero.image;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {loading && <ComponentLoader height="h-24" />}

      {!loading && error && <p className="text-center text-red-600">{error}</p>}

      {!loading && !error && service && (
        <>
          {/* Show HeroSection only if hero section exists or if serviceCardView + card sections exist */}
          {shouldShowHero && (
            <Suspense fallback={<ComponentLoader height="h-64" message="Loading hero..." />}>
              <HeroSection
                title={heroTitle}
                disc={heroDescription}
                image={heroImage}
              />
            </Suspense>
          )}

          {/* Show ServiceCardView if it exists and card sections exist */}
          {hasServiceCardView && hasCardSections && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-8 mb-8">
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
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                    {section.sectionTitle || 'Section'}
                  </h2>
                  {section.sectionDescription && (
                    <p className="text-gray-600 mb-4">{section.sectionDescription}</p>
                  )}
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
              <div dangerouslySetInnerHTML={{ __html: service.content }} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
