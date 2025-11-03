'use client';

import { useEffect, useState } from 'react';

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
}

const statusOptions: ContactItem['status'][] = ['new', 'contacted', 'resolved'];

export default function AdminContactsPage() {
  const [items, setItems] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', { cache: 'no-store' });
      const data = await res.json();
      setItems(Array.isArray(data?.data) ? data.data : []);
    } catch {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: ContactItem['status']) => {
    try {
      const res = await fetch('/api/contact', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error('Failed');
      await load();
    } catch {
      alert('Failed to update');
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
      setItems(items.filter(i => i._id !== id));
    } catch {
      alert('Failed to delete');
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Contact Submissions</h1>
        <button onClick={load} className="rounded bg-blue-600 text-white px-3 py-2">Refresh</button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded shadow p-6 text-center text-gray-600">No contacts yet.</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((c) => (
                <tr key={c._id}>
                  <td className="px-4 py-2 text-sm">{c.firstName} {c.lastName}</td>
                  <td className="px-4 py-2 text-sm">{c.email}</td>
                  <td className="px-4 py-2 text-sm">{c.phone}</td>
                  <td className="px-4 py-2 text-sm">{c.companyName || '-'}</td>
                  <td className="px-4 py-2 text-sm max-w-xs truncate" title={c.message}>{c.message}</td>
                  <td className="px-4 py-2 text-sm">
                    <select value={c.status} onChange={(e)=>updateStatus(c._id, e.target.value as ContactItem['status'])} className="border rounded px-2 py-1">
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-sm text-right">
                    <button onClick={()=>remove(c._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
