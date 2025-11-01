'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ServiceItem {
  _id: string;
  slug?: string;
  heroSection?: {
    title: string;
    description: string;
    image?: string;
  };
}
const toSlug = (text: string) => (text || '').toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

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
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load services');
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

      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}

      {!loading && error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-600">No services found.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const href = `/services/${item.slug || toSlug(item.heroSection?.title || 'service')}`;
            return (
              <a key={item._id} href={href} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition block">
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.heroSection?.title || 'Untitled'}</h2>
                <p className="text-gray-600 text-sm line-clamp-4">{item.heroSection?.description || '—'}</p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}


