'use client';

import { useState, useEffect } from 'react';

interface AdminSettings {
  username: string;
  email: string;
}

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form states
  const [settings, setSettings] = useState<AdminSettings>({
    username: '',
    email: '',
  });
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('admin');
  const [newPassword, setNewPassword] = useState('admin');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Footer settings state
  const [logoUrl, setLogoUrl] = useState('');
  const [tagline, setTagline] = useState('');
  const [links, setLinks] = useState<{ label: string; href: string }[]>([
    { label: '', href: '' },
    { label: '', href: '' },
    { label: '', href: '' },
    { label: '', href: '' },
    { label: '', href: '' },
    { label: '', href: '' },
  ]);
  const [certifications, setCertifications] = useState<string[]>(['', '', '']);
  const [associatePartner, setAssociatePartner] = useState('');
  const [contactPhoneUSA, setContactPhoneUSA] = useState('');
  const [contactPhoneIND, setContactPhoneIND] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [officeUSA, setOfficeUSA] = useState<string[]>(['']);
  const [officeIND, setOfficeIND] = useState<string[]>(['']);
  const [contactNotes, setContactNotes] = useState<string[]>(['']);
  const [internationalNote, setInternationalNote] = useState('');
  const [copyrightText, setCopyrightText] = useState('');
  
  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.status === 404) {
          // No admin yet - don't treat as an error; allow page to load with defaults
          setSettings({ username: '', email: '' });
        } else if (!response.ok) {
          throw new Error('Failed to fetch admin settings');
        } else {
          const data = await response.json();
          setSettings({
            username: data.username || '',
            email: data.email || '',
          });
        }
      } catch (err) {
        setError('Error loading settings. Please try again.');
        console.error('Error fetching settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
    // load footer settings
    (async () => {
      try {
        const res = await fetch('/api/footer', { cache: 'no-store' });
        const data = await res.json();
        const d = data?.data || {};
        setLogoUrl(d.logoUrl || '');
        setTagline(d.tagline || '');
        setLinks((prev) => (Array.isArray(d.companyLinks) ? d.companyLinks : prev));
        const labels: string[] = Array.isArray(d?.certifications)
          ? d.certifications.map((c: { label?: string }) => c?.label || '')
          : [];
        setCertifications([
          labels[0] || '',
          labels[1] || '',
          labels[2] || '',
        ]);
        setAssociatePartner(d.associatePartner || '');
        setContactPhoneUSA(d.contactPhoneUSA || '');
        setContactPhoneIND(d.contactPhoneIND || '');
        setContactEmail(d.contactEmail || '');
        setOfficeUSA(Array.isArray(d?.officeUSA?.lines) ? d.officeUSA.lines : ['']);
        setOfficeIND(Array.isArray(d?.officeIND?.lines) ? d.officeIND.lines : ['']);
  setContactNotes(Array.isArray(d?.contactNotes) ? d.contactNotes : ['']);
  setInternationalNote(d.internationalNote || '');
        setCopyrightText(d.copyrightText || '');
      } catch {
        // leave defaults
      }
    })();
  }, []);
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: settings.username,
          email: settings.email,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle footer save (all)
  const handleSaveFooter = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      setIsLoading(true);
      const payload = {
        logoUrl,
        tagline,
        companyLinks: links.filter(l => l.label && l.href),
        certifications: certifications.filter(Boolean).map((label) => ({ label })),
        associatePartner,
        contactPhoneUSA,
        contactPhoneIND,
        contactEmail,
        officeUSA: { title: 'USA Office', lines: officeUSA.filter(Boolean) },
        officeIND: { title: 'India Office', lines: officeIND.filter(Boolean) },
        contactNotes: contactNotes.filter(Boolean),
        internationalNote,
        copyrightText,
      };
      const res = await fetch('/api/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err?.error || 'Failed to save footer settings');
      }
      setSuccess('Footer settings updated');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save footer settings');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update password');
      }
      
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !settings.username) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={settings.username}
                onChange={(e) => setSettings({ ...settings, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              {isLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
        
        {/* Password Change */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              {isLoading ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>

        {/* Footer Content */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Footer Content</h2>
          <form onSubmit={handleSaveFooter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Branding */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Logo URL</label>
              <input value={logoUrl} onChange={(e)=>setLogoUrl(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Tagline</label>
              <input value={tagline} onChange={(e)=>setTagline(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            {/* Company Links */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Company Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {links.map((l, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input placeholder={`Label ${idx+1}`} value={l.label} onChange={(e)=>{
                      const next=[...links]; next[idx]={...next[idx], label:e.target.value}; setLinks(next);
                    }} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" />
                    <input placeholder={`Href ${idx+1}`} value={l.href} onChange={(e)=>{
                      const next=[...links]; next[idx]={...next[idx], href:e.target.value}; setLinks(next);
                    }} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Certifications (badges)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {certifications.map((val, idx) => (
                  <input key={idx} value={val} placeholder={`Badge ${idx+1}`} onChange={(e)=>{
                    const next=[...certifications]; next[idx]=e.target.value; setCertifications(next);
                  }} className="px-3 py-2 border border-gray-300 rounded-md" />
                ))}
              </div>
            </div>

            {/* Associate Partner */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Associate Partner</label>
              <input value={associatePartner} onChange={(e)=>setAssociatePartner(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">USA Phone</label>
              <input value={contactPhoneUSA} onChange={(e)=>setContactPhoneUSA(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">IND Phone</label>
              <input value={contactPhoneIND} onChange={(e)=>setContactPhoneIND(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input value={contactEmail} onChange={(e)=>setContactEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            {/* Addresses */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">USA Office Address (one per line)</label>
              <textarea value={officeUSA.join('\n')} onChange={(e)=>setOfficeUSA(e.target.value.split('\n'))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">India Office Address (one per line)</label>
              <textarea value={officeIND.join('\n')} onChange={(e)=>setOfficeIND(e.target.value.split('\n'))} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            {/* Contact Notes */}
            <div className="md:col-span-2">
              <h3 className="font-semibold mb-2">Contact Details (paragraphs)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contactNotes.map((p, idx) => (
                  <textarea key={idx} rows={3} placeholder={`Paragraph ${idx+1}`} value={p} onChange={(e)=>{
                    const next=[...contactNotes]; next[idx]=e.target.value; setContactNotes(next);
                  }} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                ))}
                <button type="button" onClick={()=>setContactNotes(prev=>[...prev, ''])} className="px-3 py-2 border rounded-md text-sm w-full md:w-auto">+ Add paragraph</button>
              </div>
            </div>

            {/* International Note */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">International Calls Note</label>
              <input value={internationalNote} onChange={(e)=>setInternationalNote(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            {/* Copyright */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-2">Copyright Text</label>
              <input value={copyrightText} onChange={(e)=>setCopyrightText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            <div className="md:col-span-2">
              <button type="submit" disabled={isLoading} className="w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                {isLoading ? 'Saving…' : 'Save Footer Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}