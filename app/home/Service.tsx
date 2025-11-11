'use client'
import BlogServiceCard from '@/components/BlogServiceCard'
import ComponentLoader from '@/components/ComponentLoader'
import axios from 'axios'
import React, { Suspense, useEffect, useState } from 'react'
import { motion } from "framer-motion";
interface Props {
    fadeIn: any
}
// Services fetched for the cards grid
type ServiceCardItem = {
    _id: string;
    slug?: string;
    serviceCardView?: { title: string; description: string; image?: string };
    heroSection?: { title: string; description: string; image?: string };
    createdAt?: string;
    categoryId: any
    content: any

};
// Remove useState from top level. Declare a constant for initial icons.

let countServiceIcons = 0;
const initialServiceIcons: string[] = [
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcfeeebafefe65ebd0_icons8-checklist-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedee4354c083390f315_icons8-resume-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedd1ecc3b35a9896b53_icons8-talk-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcdff39f1fc7a90b67_icons8-accounting-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedd58a2203357e2c49d_icons8-investment-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedc8d7996c335092337_icons8-bill-94%201.svg'
];
const Service: React.FC<Props> = ({ fadeIn }) => {
    const [serviceCards, setServiceCards] = useState<ServiceCardItem[]>([]);
    const [loadingServices, setLoadingServices] = useState<boolean>(false);
    const toSlug = (text: string) =>
        (text || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
            .replace(/\s+/g, '-')          // replace spaces with -
            .replace(/-+/g, '-');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoadingServices(true);
                const res = await axios.get('/api/service');
                if (res.status === 200) {
                    const result = res.data;
                                        const data: ServiceCardItem[] = Array.isArray(result?.data)
                                                ? result.data
                                                : (Array.isArray(result) ? result : []);
                                        // Ensure services are oldest-first (createdAt ascending) so newer items appear later
                                        if (Array.isArray(data)) {
                                            data.sort((a: { createdAt?: string }, b: { createdAt?: string }) => {
                                                const ta = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
                                                const tb = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
                                                return ta - tb;
                                            });
                                        }
                                        setServiceCards(data.slice(0, 6));
                } else {
                    setServiceCards([]);
                }
            } catch {
                setServiceCards([]);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);
    return (
        <motion.div {...fadeIn(0.2)} className="flex flex-col py-16 bg-gradient-to-b px-4 md:px-16">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <motion.h1
                    {...fadeIn(0.1, 30)}
                    className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-4"
                >
                    Your Partner In Professional Accounting Services In Miami
                </motion.h1>
                <motion.p
                    {...fadeIn(0.2, 20)}
                    className="text-gray-600 text-lg md:text-xl leading-relaxed"
                >
                    From bookkeeping to auditing, our dynamism lies in the competitive edge we offer.
                    Outsource to us, and let our offshore team outshine it.
                </motion.p>
            </div>


            <motion.div
                {...fadeIn(0.3, 20)}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center items-stretch ">
                {loadingServices && (
                    <ComponentLoader height="h-64" message="Loading services..." />
                )}

                {!loadingServices &&
                    serviceCards.map((svc, i) => {
                        countServiceIcons++;
                        const slug = svc.slug || toSlug(svc?.categoryId || 'service');

                        const cardView = Array.isArray(svc.serviceCardView)
                            ? svc.serviceCardView[0]
                            : svc.serviceCardView;

                        const post = {
                            id: i + 1,
                            title: cardView?.title || svc.heroSection?.title || '',
                            desc: cardView?.description || svc.heroSection?.description || "",
                            img: initialServiceIcons[countServiceIcons % 6],
                        };

                        const href = `/services/${slug}`;

                        return (
                            <a key={svc._id} href={href} className="block w-full h-full ">
                                <motion.div
                                    className="h-full flex flex-col justify-between bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.05)] 
                       hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 "
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading service card..." />}>
                                        <BlogServiceCard post={post} />
                                    </Suspense>
                                </motion.div>
                            </a>
                        );
                    })}
            </motion.div>


        </motion.div>
    )
}

export default Service
