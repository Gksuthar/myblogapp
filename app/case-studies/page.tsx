'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import ComponentLoader from '@/components/ComponentLoader';

interface CaseStudyItem {
  _id: string;
  title: string;
  content: string;
  slug?: string;
}

export default function CaseStudiesPage() {
  const [items, setItems] = useState<CaseStudyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/caseStudy');

      if (response.status === 200) {
        const result = response.data;
        if (Array.isArray(result)) setItems(result);
        else if (Array.isArray(result?.data)) setItems(result.data);
        else setItems([]);
      } else {
        setError('Failed to load case studies');
        setItems([]);
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load case studies');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Case Studies</h1>
        <p className="mt-3 text-gray-600">
          Real examples of problems solved and outcomes delivered.
        </p>
      </div>

      {/* Loader */}
      {loading && (
        <ComponentLoader height="h-24" />
      )}

      {/* Error */}
      {!loading && error && <p className="text-center text-red-600">{error}</p>}

      {/* Empty State */}
      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-600">No case studies found.</p>
      )}

      {/* Case Study Grid */}
      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            // Use slug if available, otherwise generate from title
            const urlSlug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            return (
              <Link
                key={item._id}
                href={`/case-studies/${urlSlug}`}
                className="group block bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1"
              >
                <article className="p-5">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h2>
                  <div
                    className="prose prose-sm text-gray-700 line-clamp-5 max-w-none"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
