'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomButton from '@/components/ui/customButtom/Button';

interface CaseData {
  _id?: string;
  title: string;
  content: string;
}

interface Props {
  setIsModalOpen: (val: boolean) => void;
  setEditdata: (val: any) => void
}

const CaseTbl: React.FC<Props> = ({ setIsModalOpen, setEditdata }) => {
  const [data, setData] = useState<CaseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch API Data
  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/caseStudy');
      if (response.status === 200) {
        const result = response.data;
        if (Array.isArray(result)) setData(result);
        else if (Array.isArray(result.data)) setData(result.data);
        else if (result && typeof result === 'object') setData([result]);
        else setData([]);
      } else {
        console.error('Unexpected response:', response);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async (items: any) => {
  if (!confirm("Are you sure you want to delete this case study?")) return;

  try {
    const response = await axios.delete('/api/caseStudy', {
      data: { id: items },
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status === 200) {
      alert("Deleted successfully");
      fetchCaseStudies(); // refresh the list
    }
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete case study");
  }
};

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📚 Case Study List</h1>
        <CustomButton
          text="Add new case"
          onClick={() => { setIsModalOpen(true); setEditdata([]) }}
        />
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-500"></div>
        </div>
      )}

      {/* No Data Found */}
      {!loading && data.length === 0 && (
        <div className="text-center text-gray-600 py-20">
          <img
            src="/no-data.svg"
            alt="No data"
            className="mx-auto w-48 mb-4 opacity-80"
          />
          <p className="text-lg font-medium">No case studies found</p>
        </div>
      )}

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          data.map((item, index) => (
            <div
              key={item._id}
              className="bg-white shadow-lg rounded-xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                {item.title}
              </h2>

              <div
                className="text-gray-600 text-sm mb-4 line-clamp-4 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />

              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  onClick={() => { setEditdata(data[index]); setIsModalOpen(true) }}
                >
                  edit
                </button>
                <button
                  className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                 onClick={() => handleDelete(data[index]?._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CaseTbl;
