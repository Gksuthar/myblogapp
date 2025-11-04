'use client';

import Link from 'next/link';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  AiOutlineDashboard,
  AiOutlineRead,
  AiOutlineFileAdd,
  AiOutlineAppstore,
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlineHome
} from 'react-icons/ai';

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
  const router = useRouter();

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
    { title: 'hero sections', href: '/admin/hero', icon: <AiOutlineAppstore size={20} /> },
    { title: 'latest Blogs', href: '/admin/BlogSection', icon: <AiOutlineFileAdd size={20} /> }, 
    { title: 'About Us', href: '/admin/about', icon: <AiOutlineUser size={20} /> },
    { title: 'Team', href: '/admin/team', icon: <AiOutlineUser size={20} /> },
    { title: 'Study Case', href: '/admin/caseStudy', icon: <AiOutlineAppstore size={20} /> },
    { title: 'Tructed company', href: '/admin/trusted', icon: <AiOutlineUser size={20} /> },
    { title: 'Hire', href: '/admin/hire', icon: <AiOutlineSetting size={20} /> },
    { title: 'Settings', href: '/admin/settings', icon: <AiOutlineSetting size={20} /> },
    { title: 'Logout', action: handleLogout, icon: <AiOutlineLogout size={20} /> },
    { title: 'Back to Website', href: '/', icon: <AiOutlineHome size={20} /> },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      {/* <div className="md:hidden bg-indigo-700 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        <button
          id="menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          <AiOutlineDashboard size={24} />
        </button>
      </div> */}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`${isMobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-60 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white md:min-h-screen transition-all duration-300 ease-in-out shadow-xl`}
      >
        <div className="p-6">
          <h1 className="text-1xl font-bold mb-8 hidden md:block text-center">Admin Dashboard</h1>
          <nav>
            <ul className="space-y-3">
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
                      className="flex items-center w-full py-3 px-4 hover:bg-red-600 rounded-lg transition-colors text-white"
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

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden bg-gray-50">
        {children}
      </div>
    </div>
  );
}