'use client';

import React from 'react';
import { BsPencil, BsTrash2 } from 'react-icons/bs';

interface Props {
  loading: boolean;
  data: any[];
  handleEdit: (val: any) => void;
  handleDelete: (val: any) => void;
}

const CategoryTable: React.FC<Props> = ({ loading, data, handleEdit, handleDelete }) => {
    console.log("data" , data)
  if (loading) return <p className="text-center py-4 text-gray-500">Loading categories...</p>;
  if (!data.length) return <p className="text-center py-4 text-gray-500">No categories found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-4 py-2 border-b">#</th>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">Description</th>
            <th className="px-4 py-2 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat, index) => (
            <tr key={cat._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b font-semibold">{cat.name}</td>
              <td className="px-4 py-2 border-b text-gray-700">{cat.description}</td>
              <td className="px-4 py-2 border-b">
                <div className="flex gap-2 justify-center items-center">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    title="Edit"
                  >
                    <BsPencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete"
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
  );
};

export default CategoryTable;
