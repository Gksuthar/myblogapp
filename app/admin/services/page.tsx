'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash2 } from 'react-icons/bs';
import CustomButton from '@/components/ui/customButtom/Button';
import CategoryModal from './categories/CategoryModal';
import ServiceModal from './serviceModel';
import CategoryTable from './categories/CategoryTable';

interface CardSection {
  sectionTitle: string;
  sectionDescription: string;
  cards: Array<{
    title: string;
    description: string;
  }>;
}

interface Service {
  _id: string;
  categoryId?: string;
  heroSection: {
    title: string;
    description: string;
    image?: string;
  };
  cardSections?: CardSection[];
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  createdAt?: string;
}

export default function AdminServices() {
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false); // category modal
  const [open, setOpen] = useState(false); // service modal

  // Service states
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Category states
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [catError, setCatError] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // ✅ Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/service');
      const data = response.data.data || [];
      setServices(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch categories
  const fetchCategories = async () => {
    try {
      setCatLoading(true);
      setCatError('');
      const res = await axios.get('/api/service/categories');
      console.log("res" , res);
      let cats = res.data || [];
      // Keep categories oldest-first so admin lists mirror site behavior
      if (Array.isArray(cats)) {
        cats = cats.slice().sort((a, b) => {
          const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
          return ta - tb;
        });
      }
      setCategories(cats);
    } catch (err: any) {
      setCatError(err.response?.data?.error || 'Failed to load categories');
    } finally {
      setCatLoading(false);
    }
  };

  // ✅ Delete service
  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete('/api/service', {
        data: { id: serviceId },
        headers: { 'Content-Type': 'application/json' },
      });
      fetchServices();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete service');
    }
  };

  // ✅ Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete('/api/service/categories', { data: { ids: [categoryId] } });
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete category');
    }
  };

  // ✅ Edit service
  const handleEditService = (service: Service) => {
    setEditingService(service);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setEditingService(null);
  };

  // ✅ Load data on mount
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  return (
    <div className="p-6">
      {/* ---------- TABS ---------- */}
      <div className="flex gap-4 border-b mb-6">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 font-semibold border-b-4 transition ${
            activeTab === 'services'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-blue-500'
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 font-semibold border-b-4 transition ${
            activeTab === 'categories'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-blue-500'
          }`}
        >
          Categories
        </button>
      </div>

      {/* ---------- SERVICE TAB ---------- */}
      {activeTab === 'services' && (
        <>
          <div className="flex gap-4 mb-6">
            <CustomButton text="Add Service" onClick={() => setOpen(true)} />
          </div>

          {loading && <p className="text-gray-500">Loading services...</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {!loading && !error && services.length === 0 && (
            <p className="text-gray-500">No services found.</p>
          )}

          {!loading && !error && services.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 rounded-md">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="px-4 py-2 border-b">#</th>
                    <th className="px-4 py-2 border-b">Title</th>
                    <th className="px-4 py-2 border-b">Description</th>
                    <th className="px-4 py-2 border-b">Created</th>
                    <th className="px-4 py-2 border-b text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border-b">{index + 1}</td>
                      <td className="px-4 py-2 border-b font-semibold">
                        {service.heroSection?.title || '—'}
                      </td>
                      <td className="px-4 py-2 border-b text-gray-700 max-w-md truncate">
                        {service.heroSection?.description || '—'}
                      </td>
                      <td className="px-4 py-2 border-b text-sm text-gray-500">
                        {service.createdAt
                          ? new Date(service.createdAt).toLocaleDateString()
                          : '—'}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <div className="flex gap-2 justify-center items-center">
                          <button
                            onClick={() => handleEditService(service)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <BsPencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <BsTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ---------- CATEGORY TAB ---------- */}
      {activeTab === 'categories' && (
        <>
          <div className="flex gap-4 mb-6">
            <CustomButton text="Add Category" onClick={() => setIsModalOpen(true)} />
          </div>

          {catLoading && <p className="text-gray-500">Loading categories...</p>}
          {catError && <p className="text-red-500 mb-4">{catError}</p>}

          {!catLoading && !catError && (
            <CategoryTable
              data={categories}
              loading={catLoading}
              handleEdit={(cat) => { setEditingCategory(cat); setIsModalOpen(true); }}
              handleDelete={handleDeleteCategory}
            />
          )}
        </>
      )}

      {/* ---------- MODALS ---------- */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
        onSuccess={() => fetchCategories()}
        editingCategory={editingCategory}
      />

      <ServiceModal
        isOpen={open}
        onClose={handleCloseModal}
        editingService={editingService}
        onSuccess={() => {
          fetchServices();
          handleCloseModal();
        }}
      />
    </div>
  );
}
