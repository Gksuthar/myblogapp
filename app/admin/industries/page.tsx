'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type Industry = {
  _id?: string;
  title: string;
  description: string;
  image?: string;
  tags?: string[];
};

export default function AdminIndustriesPage() {
  const [items, setItems] = useState<Industry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editing, setEditing] = useState<Industry | null>(null);
  const [form, setForm] = useState<Industry>({ title: '', description: '', image: '', tags: [] });
  const isEditing = useMemo(() => Boolean(editing?._id), [editing]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get('/api/industries');
      const data = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
      setItems(data);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to load industries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', image: '', tags: [] });
    setIsOpen(true);
  };

  const openEdit = (item: Industry) => {
    setEditing(item);
    setForm({ title: item.title || '', description: item.description || '', image: item.image || '', tags: item.tags || [] });
    setIsOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && editing?._id) {
        await axios.put('/api/industries', { id: editing._id, ...form });
      } else {
        await axios.post('/api/industries', form);
      }
      setIsOpen(false);
      await fetchItems();
    } catch (e: any) {
      alert(e?.response?.data?.error || 'Failed to save');
    }
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('Delete this industry?')) return;
    try {
      await axios.delete('/api/industries', { data: { id } });
      await fetchItems();
    } catch (e: unknown) {
      const errorMessage = e && typeof e === 'object' && 'response' in e 
        ? (e as { response?: { data?: { error?: string } } }).response?.data?.error || 'Failed to delete'
        : 'Failed to delete';
      alert(errorMessage);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Industries</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black">Add Industry</button>
      </div>

      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-md">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="px-4 py-2 border-b">#</th>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Description</th>
                <th className="px-4 py-2 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it._id || idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{idx + 1}</td>
                  <td className="px-4 py-2 border-b font-medium">{it.title}</td>
                  <td className="px-4 py-2 border-b text-gray-700 max-w-md truncate">{it.description}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => openEdit(it)} className="px-3 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100">Edit</button>
                      <button onClick={() => onDelete(it._id)} className="px-3 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-gray-500">No industries found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{isEditing ? 'Edit Industry' : 'Add Industry'}</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-900">✕</button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className="w-full border rounded-md px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full border rounded-md px-3 py-2" rows={4} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image (URL or Base64)</label>
                <input value={form.image || ''} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full border rounded-md px-3 py-2 mb-2" placeholder="Paste Base64 or URL" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = typeof reader.result === 'string' ? reader.result : '';
                      setForm((f) => ({ ...f, image: result }));
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="w-full border rounded-md px-3 py-2"
                />
                {!!form.image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={form.image} alt="Preview" className="h-16 w-16 object-cover rounded border" />
                    <button type="button" onClick={() => setForm((f) => ({ ...f, image: '' }))} className="px-3 py-1 rounded border">Clear</button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
                <input
                  value={(form.tags || []).join(', ')}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) }))}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-black">{isEditing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


