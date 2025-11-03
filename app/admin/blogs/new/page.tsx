"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import NewBlogModal from '../NewBlogModal';

export default function NewBlogPage() {
  const router = useRouter();
  return (
    <NewBlogModal
      open={true}
      onClose={() => router.push('/admin/blogs')}
      onCreated={() => router.refresh()}
    />
  );
}
