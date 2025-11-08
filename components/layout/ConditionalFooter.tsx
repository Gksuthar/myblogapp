"use client";

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  if (typeof pathname === 'string' && pathname.startsWith('/admin')) return null;
  return <Footer />;
}
