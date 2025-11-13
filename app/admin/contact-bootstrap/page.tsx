"use client";

import React, { useEffect, useState } from "react";

interface ContactItem {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName?: string;
  companyWebsite?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
  updatedAt?: string;
}

const statusOptions: ContactItem['status'][] = ['new','contacted','resolved'];

export default function AdminContactsBootstrap() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Using Tailwind — no external CSS injection needed
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', { cache: 'no-store' });
      const data = await res.json();
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error('Failed to load contacts', err);
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: ContactItem['status']) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed');
      await load();
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      const res = await fetch('/api/contact', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed');
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error('Failed to delete contact', err);
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Contacts</h1>
        <div>
          <button
            onClick={load}
            className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300"
          >
            Refresh
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border rounded p-4 text-gray-600">No contacts yet.</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-gray-200 rounded thin-scrollbar">
          <table className="w-full min-w-[900px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">First Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {items.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{c.firstName}</td>
                  <td className="px-4 py-3 text-sm">{c.lastName}</td>
                  <td className="px-4 py-3 text-sm"><a className="text-blue-600 hover:underline" href={`mailto:${c.email}`}>{c.email}</a></td>
                  <td className="px-4 py-3 text-sm">{c.phone}</td>
                
                  <td className="px-4 py-3 text-sm max-w-xs truncate" title={c.message}>{c.message}</td>
                  <td className="px-4 py-3 text-sm">
                    <select className="border rounded px-2 py-1 text-sm" value={c.status} onChange={(e)=>updateStatus(c._id, e.target.value as ContactItem['status'])}>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-sm">{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <button onClick={()=>remove(c._id)} className="inline-flex items-center px-2 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <style jsx>{`
            .thin-scrollbar::-webkit-scrollbar { height: 6px; }
            .thin-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .thin-scrollbar::-webkit-scrollbar-thumb { background: rgba(107,114,128,0.6); border-radius: 9999px; }
            .thin-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(107,114,128,0.6) transparent; }
          `}</style>
        </div>
      )}
    </div>
  );
}
