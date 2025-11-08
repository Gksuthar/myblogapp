"use client";

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (typeof pathname === 'string' && pathname.startsWith('/admin')) return null;
  return <Header />;
}
