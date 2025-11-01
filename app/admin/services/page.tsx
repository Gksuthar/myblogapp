'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPencil, BsTrash2 } from 'react-icons/bs';
import CustomButton from '@/components/ui/customButtom/Button';
import CategoryModal from './categories/CategoryModal';
import ServiceModal from './serviceModel';

interface Service {
  _id: string;
  categoryId?: string;
  heroSection: {
    title: string;
    description: string;
    image?: string;
  };
  cardSections?: Array<{
    sectionTitle: string;
    sectionDescription: string;
    cards: Array<{
      title: string;
      description: string;
    }>;
  }>;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/service');
      setServices(response.data.data || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete service
  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      setError('');
      await axios.delete('/api/service', {
        data: { id: serviceId },
        headers: { 'Content-Type': 'application/json' },
      });
      fetchServices(); // Refresh list after deletion
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete service');
      alert(err.response?.data?.error || 'Failed to delete service');
    }
  };

  // ✅ Edit service
  const handleEdit = (service: Service) => {
    setEditingService(service);
    setOpen(true);
  };

  // ✅ Close modal and reset editing state
  const handleCloseModal = () => {
    setOpen(false);
    setEditingService(null);
  };

  // ✅ Load on mount
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-6">
      {/* Header Buttons */}
      <div className="flex gap-3 mb-6">
        <CustomButton text="Add Category" onClick={() => setIsModalOpen(true)} />
        <CustomButton text="Add Service" onClick={() => setOpen(true)} />
      </div>

      {/* Loading / Error / Empty */}
      {loading && <p className="text-gray-500">Loading services...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {!loading && !error && services.length === 0 && (
        <p className="text-gray-500">No services found.</p>
      )}

      {/* ✅ Services Table */}
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
                        onClick={() => handleEdit(service)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit service"
                      >
                        <BsPencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete service"
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

      {/* ✅ Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          console.log('New category added');
        }}
      />

      {/* ✅ Service Modal */}
      <ServiceModal
        isOpen={open}
        onClose={handleCloseModal}
        editingService={editingService}
        onSuccess={() => {
          console.log(editingService ? 'Service updated' : 'Service added');
          fetchServices(); // 🔄 refresh list after adding/updating
          handleCloseModal();
        }}
      />
    </div>
  );
}
