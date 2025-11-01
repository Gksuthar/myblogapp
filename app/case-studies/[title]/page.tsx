'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ComponentLoader from '@/components/ComponentLoader';

// ✅ Define types
interface CaseStudyCard {
  cardTitle: string;
  cardDescription: string;
  cardImage?: string;
}

interface CaseStudy {
  _id: string;
  title: string;
  headerTitle?: string;
  headerDescription?: string;
  content?: string;
  cards?: CaseStudyCard[];
}

export default function CaseStudyDetails() {
  const { title } = useParams();
  const router = useRouter();

  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchCaseStudy = async () => {
      setLoading(true);
      try {
        // Fetch using title parameter (API will convert it to slug or match by title)
        const res = await fetch(`/api/caseStudy?title=${encodeURIComponent(title as string)}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch case study');
        }
        const data: CaseStudy = await res.json();
        setCaseStudy(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to fetch case study');
      } finally {
        setLoading(false);
      }
    };

    if (title) fetchCaseStudy();
  }, [title]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <ComponentLoader height="h-64" message="Loading case study..." />
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
        <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
        <p className="mb-6 text-gray-600">{error || 'No data found'}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {caseStudy.headerTitle || caseStudy.title}
          </h1>
          {caseStudy.headerDescription && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {caseStudy.headerDescription}
            </p>
          )}
        </div>

        {/* Content Section */}
        {caseStudy.content && (
          <div
            className="prose prose-lg max-w-none bg-white p-6 md:p-10 rounded-xl shadow-md"
            dangerouslySetInnerHTML={{ __html: caseStudy.content }}
          />
        )}

        {/* Cards Section */}
        {caseStudy.cards && caseStudy.cards.length > 0 && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudy.cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                {card.cardImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={card.cardImage}
                      alt={card.cardTitle}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2">
                    {card.cardTitle}
                  </h3>
                  <p className="text-gray-600">{card.cardDescription}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-16 text-center">
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Back to Case Studies
          </button>
        </div>
      </div>
    </main>
  );
}
