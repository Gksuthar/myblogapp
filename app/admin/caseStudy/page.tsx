'use client';
import { useState } from 'react';
import CaseStudyModal from './CaseStudyModal';
import CaseCard from './caseCard';
interface Card {
  cardTitle: string;
  cardDescription: string;
  cardImage: string; // base64 string
}
interface CaseStudyFormValues {
  title: string;
  content: string;
  headerTitle: string;
  headerDescription: string;
  cards: Card[];
  
}
export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
 const [editdata, setEditdata] = useState<
    (Partial<CaseStudyFormValues> & { _id?: string }) | null
  >(null);
  return (

    <>
      <CaseCard setIsModalOpen={setIsModalOpen} setEditdata={setEditdata} />
      <CaseStudyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editdata={editdata || {}} // ✅ ensures a valid object is always passed
        onSuccess={() => console.log('✅ Case study added successfully!')}
      />
    </>
  );
}
