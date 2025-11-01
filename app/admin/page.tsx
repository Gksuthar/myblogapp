'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    services: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch blog count
        const blogsRes = await fetch('/api/blogs');
        const blogsData = await blogsRes.json();
        
        // Fetch services count
        const servicesRes = await fetch('/api/services');
        const servicesData = await servicesRes.json();
        
        setStats({
          blogs: blogsData.blogs?.length || 0,
          services: servicesData.services?.length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-1xl font-bold mb-6">Admin Dashboard</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-80">Total Blogs</p>
                  <h3 className="text-3xl font-bold">{stats.blogs}</h3>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm opacity-80">Total Services</p>
                  <h3 className="text-3xl font-bold">{stats.services}</h3>
                </div>
                <div className="bg-white bg-opacity-30 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blog Management
              </h2>
              <p className="mb-4 text-gray-600">Create, edit, and manage your blog posts.</p>
              <div className="flex space-x-3">
                <Link href="/admin/blogs" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  View All
                </Link>
                <Link href="/admin/blogs/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Add New
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Service Management
              </h2>
              <p className="mb-4 text-gray-600">Create, edit, and manage your services.</p>
              <div className="flex space-x-3">
                <Link href="/admin/services" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                  View All
                </Link>
                <Link href="/admin/services/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                  Add New
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="flex items-center text-blue-500 hover:text-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                View Website
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}