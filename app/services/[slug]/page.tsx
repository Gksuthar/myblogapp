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
  heroSection?: { title: string; description: string; image?: string };
  cardSections?: Array<{
    sectionTitle: string;
    sectionDescription?: string;
    cards: Array<{ title: string; description: string }>;
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
          const raw = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
          const match = (raw as ServiceDoc[]).find((s) => {
            if (s.slug) return s.slug === slug;
            const fromTitle = toSlug(s.heroSection?.title || '');
            return fromTitle === slug;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {loading && <ComponentLoader height="h-24" />}

      {!loading && error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && service && (
        <>
          {/* Hero using shared component */}
          <Suspense fallback={<ComponentLoader height="h-64" message="Loading hero..." />}>
            <HeroSection
              title={service.heroSection?.title || pageTitle}
              disc={service.heroSection?.description || ''}
              image={service.heroSection?.image || ''}
            />
          </Suspense>

          {/* Card Sections */}
          {Array.isArray(service.cardSections) && service.cardSections.length > 0 && (
            <section className="space-y-8 mt-10">
              {service.cardSections.map((section, idx) => (
                <div key={`${section.sectionTitle}-${idx}`} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">{section.sectionTitle}</h2>
                  {section.sectionDescription && (
                    <p className="text-gray-600 mb-4">{section.sectionDescription}</p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.cards?.map((card, i) => (
                      <div key={`${card.title}-${i}`} className="border border-gray-200 rounded-lg p-5 hover:shadow transition-shadow">
                        <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
                        <p className="text-gray-600 text-sm">{card.description}</p>
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


