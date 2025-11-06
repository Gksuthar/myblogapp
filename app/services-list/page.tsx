"use client";

import React, { Suspense, lazy, useEffect, useState } from 'react';
import axios from 'axios';
import ComponentLoader from '@/components/ComponentLoader';
import { motion } from 'framer-motion';

// Lazy load BlogServiceCard (same as on home page)
const BlogServiceCard = lazy(() => import('@/components/BlogServiceCard'));

// Small fallback icons array so services without images still show an icon
const INITIAL_SERVICE_ICONS = [
  'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcfeeebafefe65ebd0_icons8-checklist-94%201.svg',
  'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedee4354c083390f315_icons8-resume-94%201.svg',
  'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedd1ecc3b35a9896b53_icons8-talk-94%201.svg',
  'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcdff39f1fc7a90b67_icons8-accounting-94%201.svg',
  'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedd58a2203357e2c49d_icons8-investment-94%201.svg',
  'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedc8d7996c335092337_icons8-bill-94%201.svg'
];
// No global counter needed — we'll use the map index for predictable fallback icons

const fadeIn = (delay = 0, y = 20) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
  viewport: { once: true },
});

interface ServiceItem {
  _id: string;
  slug?: string;
  serviceCardView?: { title?: string; description?: string; image?: string } | Array<{ title?: string; description?: string; image?: string }>;
  heroSection?: {
    title?: string;
    description?: string;
    image?: string;
  };
  content?: string;
}
const toSlug = (text: string) => (text || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

// Convert a slug like "outsource-accounting" to "Outsource Accounting"
const toTitleFromSlug = (slug = '') => {
  return slug
    .toString()
    .replace(/[-_]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ServicesListPage() {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/service');
      if (response.status === 200) {
        const result = response.data;
        const data = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
        setItems(data);
      } else {
        setError('Failed to load services');
        setItems([]);
      }
    } catch (err: unknown) {
      // attempt to extract useful message
      let message = 'Failed to load services';
      if (err && typeof err === 'object') {
        // axios-like error may have response.data.error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const a = err as any;
        message = a?.response?.data?.error || a?.message || message;
      } else if (typeof err === 'string') {
        message = err;
      }
      setError(message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">All Services</h1>
        <p className="mt-3 text-gray-600">Browse all available services.</p>
      </div>

      {loading && <ComponentLoader height="h-24" />}

      {!loading && error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-600">No services found.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            // Prefer heroSection, fallback to serviceCardView (array or object)
            const svcCard = Array.isArray(item.serviceCardView) ? item.serviceCardView[0] : item.serviceCardView;

            // Derive title/description with sensible fallbacks so we don't show "Untitled"
            const rawTitle = (item.heroSection?.title || svcCard?.title || item.slug || '').toString().trim();
            const title = rawTitle || (item.slug ? toTitleFromSlug(item.slug) : 'Service');
            const desc = (item.heroSection?.description || svcCard?.description || item.content || '').toString().trim();

            const slugSource = item.slug || title || svcCard?.title || 'service';
            const href = `/services/${toSlug(slugSource)}`;

            // Use the map index for selecting fallback icons (stable and predictable)
            const img = (item.heroSection?.image || svcCard?.image) || INITIAL_SERVICE_ICONS[idx % INITIAL_SERVICE_ICONS.length];

            const post = { id: idx, title: title, desc: desc || '—', img };

            return (
              <a key={item._id || idx} href={href} className="block w-full h-full">
                <motion.div
                  {...fadeIn(0.05)}
                  className="h-full flex flex-col justify-between bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                >
                  <Suspense fallback={<ComponentLoader height="h-64" message="Loading service card..." />}>
                    <BlogServiceCard post={post} />
                  </Suspense>
                </motion.div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}


