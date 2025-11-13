'use client';

import Link from 'next/link';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  AiOutlineDashboard,
  AiOutlineRead,
  AiOutlineFileAdd,
  AiOutlineAppstore,
  AiOutlineStar,
  AiOutlineUser,
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineHome,
} from 'react-icons/ai';
import Image from 'next/image';

interface AdminLayoutProps {
  children: ReactNode;
}

interface MenuItem {
  title: string;
  href?: string;
  icon: ReactNode;
  action?: () => void;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
          credentials: 'include',
        });
        
        const data = await response.json();
        
        if (!data.authenticated) {
          router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
          return;
        }
        
        setAuthLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const menuButton = document.getElementById('menu-button');

      if (
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  const menuItems: MenuItem[] = [
    { title: 'Dashboard', href: '/admin', icon: <AiOutlineDashboard size={20} /> },
    { title: 'Blogs', href: '/admin/blogs', icon: <AiOutlineRead size={20} /> },
    { title: 'Services', href: '/admin/services', icon: <AiOutlineAppstore size={20} /> },
    { title: 'Content', href: '/admin/content', icon: <AiOutlineUser size={20} /> },
    { title: 'Industries', href: '/admin/industries', icon: <AiOutlineFileAdd size={20} /> },
    { title: 'Hero Sections', href: '/admin/hero', icon: <AiOutlineAppstore size={20} /> },
    { title: 'Latest Blogs', href: '/admin/BlogSection', icon: <AiOutlineFileAdd size={20} /> },
    { title: 'About Us', href: '/admin/about', icon: <AiOutlineUser size={20} /> },
  { title: 'Reviews', href: '/admin/testimonials', icon: <AiOutlineStar size={20} /> },
    { title: 'Contacts', href: '/admin/contact-bootstrap', icon: <AiOutlineMail size={20} /> },
    { title: 'Team', href: '/admin/team', icon: <AiOutlineUser size={20} /> },
    { title: 'Study Case', href: '/admin/caseStudy', icon: <AiOutlineAppstore size={20} /> },
    { title: 'Trusted Company', href: '/admin/trusted', icon: <AiOutlineUser size={20} /> },
    { title: 'Hire', href: '/admin/hire', icon: <AiOutlineSetting size={20} /> },
    { title: 'Settings', href: '/admin/settings', icon: <AiOutlineSetting size={20} /> },
    { title: 'Logout', action: handleLogout, icon: <AiOutlineLogout size={20} /> },
    { title: 'Back to Website', href: '/', icon: <AiOutlineHome size={20} /> },
  ];

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-50 shadow-xl`}
      >
        <div className="flex flex-col items-center p-6 pt-8">
          {/* Logo at top */}
          <Link href="/admin" className="flex flex-col items-center">
            <Image src="https://res.cloudinary.com/dsu49fx2b/image/upload/v1762306740/logo_big1-1_dyd6xs.png" alt="Logo" width={160} height={48} className="mb-2 object-contain" />
            <span className="text-sm font-bold">Sbaccounting</span>
          </Link>
          <nav className="w-full">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="flex items-center py-3 px-4 hover:bg-indigo-600 text-sm rounded-lg transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </Link>
                  ) : (
                    <button
                      onClick={item.action}
                      className="flex items-center w-full py-3 px-4 hover:bg-red-600 rounded-lg transition-colors text-white text-sm"
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.title}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden bg-gray-50">
        {children}
      </div>
    </div>
  );
}
