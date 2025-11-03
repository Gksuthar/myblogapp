'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ServiceModal from '../serviceModel';

export default function NewServicePage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    // Go back to services list when closed
    router.push('/admin/services');
  };

  return (
    <div className="p-4">
      <ServiceModal
        isOpen={open}
        onClose={handleClose}
        onSuccess={() => {
          handleClose();
        }}
        editingService={null}
      />
    </div>
  );
}
