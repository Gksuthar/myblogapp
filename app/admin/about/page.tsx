'use client';

import { useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import AboutFormModal from './AboutFormModal';

interface TeamMember {
    name: string;
    position: string;
    bio: string;
    image: string;
}

interface Value {
    title: string;
    description: string;
}

interface AboutData {
    _id?: string;
    title: string;
    description: string;
    mission: string;
    vision: string;
    companyHistory: string;
    team: TeamMember[];
    values: Value[];
    updatedAt?: string;
}

export default function AboutAdminPage() {
    const [aboutData, setAboutData] = useState<AboutData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);

    // === Fetch About Data ===
    const fetchAbout = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/about');
            if (res.ok) {
                const data = await res.json();
                setAboutData(data);
            } else {
                setAboutData(null);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load About Us data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    // === Delete About Data ===
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete the About Us data?')) return;

        try {
            const res = await fetch('/api/about', { method: 'DELETE' });
            if (res.ok) {
                alert('About Us data deleted successfully.');
                setAboutData(null);
            } else {
                alert('Failed to delete data.');
            }
        } catch (err) {
            console.error(err);
            alert('Error deleting data.');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">About Us Admin Panel</h1>
                <button
                    onClick={() => setOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    {aboutData ? 'Edit Data' : 'Create New'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>
            )}

            {!aboutData ? (
                <div className="text-gray-500 italic">No About Us data available.</div>
            ) : (
                <div className="space-y-6">
                    {/* === Basic Info Card === */}
                    <div className="border rounded-lg shadow p-6 bg-white">
                        <h2 className="text-xl font-semibold mb-2">{aboutData.title}</h2>
                        <p className="text-gray-700 mb-3">{aboutData.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-800">Mission</h3>
                                <p className="text-gray-600">{aboutData.mission}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Vision</h3>
                                <p className="text-gray-600">{aboutData.vision}</p>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-800">Company History</h3>
                            <div
                                className="prose max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: aboutData.companyHistory }}
                            />

                        </div>
                    </div>

                    {/* === Team Members === */}
                    <div className="border rounded-lg shadow p-6 bg-white">
                        <h2 className="text-xl font-semibold mb-4">Team Members</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {aboutData.team.map((member, i) => (
                                <div
                                    key={i}
                                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                                >
                                    <img
                                        src={member.image || '/default-avatar.png'}
                                        alt={member.name}
                                        className="w-full h-40 object-cover rounded-md mb-3"
                                    />
                                    <h3 className="font-semibold">{member.name}</h3>
                                    <p className="text-sm text-gray-600">{member.position}</p>
                                    <p className="text-gray-500 text-sm mt-2">{member.bio}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* === Values === */}
                    <div className="border rounded-lg shadow p-6 bg-white">
                        <h2 className="text-xl font-semibold mb-4">Company Values</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {aboutData.values.map((v, i) => (
                                <div
                                    key={i}
                                    className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100"
                                >
                                    <h3 className="font-semibold text-gray-800">{v.title}</h3>
                                    <p className="text-gray-600">{v.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* === Actions === */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={() => setOpen(true)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )}

            {/* === Modal for Edit/Create === */}
            <AboutFormModal
            />
        </div>
    );
}
