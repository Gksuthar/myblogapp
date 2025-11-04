"use client";
import { Suspense, lazy, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ComponentLoader from "@/components/ComponentLoader";
import axios from "axios";

// Lazy load components
const HeroSection = lazy(() => import("@/components/HeroSection/HeroSection"));
const BlogServiceCard = lazy(() => import("@/components/BlogServiceCard"));
const Trusted = lazy(() => import("./Trusted"));
const Team = lazy(() => import("./Team"));
const WhyChooseUsSection = lazy(() => import("./WhyChooseUsSection"));
const HowItWorksSection = lazy(() => import("./HowItWorksSection"));
const IndustriesSection = lazy(() => import("./IndustriesSection"));
const BlogSection = lazy(() => import("./BlogSection"));
const JoinTeamSection = lazy(() => import("./JoinTeamSection"));
const CaseStudiesAndConnect = lazy(() => import("./CaseStudiesAndConnect"));

const fadeIn = (delay = 0, y = 40) => ({
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay },
    viewport: { once: true },
});


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

export default function Home() {
    const [heroData, setHeroData] = useState<{
        title: string;
        disc: string;
        image?: string;
        buttonText?: string;
    } | null>(null);
    const [trustedCompanies, setTrustedCompanies] = useState<{
        _id: string;
        name: string;
        image: string;
    }[]>([]);
    const [loadingTrusted, setLoadingTrusted] = useState(true);
    const [serviceCards, setServiceCards] = useState<ServiceCardItem[]>([]);
    const [loadingServices, setLoadingServices] = useState<boolean>(false);

    useEffect(() => {
        const fetchHero = async () => {
            try {
                const res = await axios.get("/api/hero", {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`, // Add your token here
                    },
                });
                setHeroData(res.data);
            } catch (error: unknown) {
                console.error("Failed to fetch hero data:", error);
            }
        };

        fetchHero();
    }, []);
    useEffect(() => {
        const fetchTrustedCompanies = async () => {
            setLoadingTrusted(true);
            try {
                const res = await axios.get('/api/tructedCompany');
                setTrustedCompanies(res.data); // expects an array from GET
            } catch (error: unknown) {
                console.error('Failed to fetch trusted companies:', error);
            } finally {
                setLoadingTrusted(false);
            }
        };

        fetchTrustedCompanies();
    }, []);

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

    const toSlug = (text: string) =>
        (text || '')
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')  // remove special chars
            .replace(/\s+/g, '-')          // replace spaces with -
            .replace(/-+/g, '-');
    return (
        <>
            <Suspense fallback={<ComponentLoader height="h-96" message="Loading hero section..." />}>
                {heroData ? (
                    <HeroSection
                        title={heroData.title}
                        disc={heroData.disc}
                        image={heroData.image ?? ''}
                    // buttonText={heroData.buttonText}
                    />
                ) : (
                    <ComponentLoader height="h-96" message="Loading hero section..." />
                )}
            </Suspense>

            {/* Trusted Companies Section */}
            <motion.section
                {...fadeIn(0.2, 50)}
                className="relative w-full py-20 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Trusted by Leading Firms
                        </h2>
                        <p className="text-gray-600">
                            Join hundreds of accounting professionals who trust us
                        </p>
                    </div>

                    {loadingTrusted ? (
                        <div className="flex justify-center items-center h-32">
                            <ComponentLoader height="h-32" message="Loading companies..." />
                        </div>
                    ) : trustedCompanies.length > 0 ? (
                        <div className="relative overflow-hidden py-8">
                            <motion.div
                                className="flex gap-16 items-center"
                                animate={{ x: ["0%", "-50%"] }}
                                transition={{
                                    repeat: Infinity,
                                    repeatType: "loop",
                                    duration: 35,
                                    ease: "linear"
                                }}
                            >
                                {[...trustedCompanies, ...trustedCompanies].map((company, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center justify-center min-w-[200px] h-28 px-6 opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-105"
                                    >
                                        <Image
                                            src={company.image}
                                            alt={company.name}
                                            width={180}
                                            height={70}
                                            className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                                        />
                                    </div>
                                ))}
                            </motion.div>

                            {/* Enhanced gradient overlays */}
                            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-10"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent pointer-events-none z-10"></div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-8">
                            No companies to display
                        </div>
                    )}
                </div>
            </motion.section>


            {/* Team Section */}
            <motion.div {...fadeIn(0.2)} className="w-full px-6 md:px-16">
                <Suspense fallback={<ComponentLoader height="h-64" message="Loading team section..." />}>
                    <Team />
                </Suspense>
            </motion.div>

            {/* Trusted Section */}
            <motion.div {...fadeIn(0.2)} className="w-full">
                <Suspense fallback={<ComponentLoader height="h-64" message="Loading trusted section..." />}>
                    <Trusted />
                </Suspense>
            </motion.div>

            {/* Blog Section */}
            <main className="w-full px-6 md:px-16">
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

                    {/* Services Grid (from /api/service) */}
                    <motion.div
                        {...fadeIn(0.3, 20)}
                        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {loadingServices && (
                            <ComponentLoader height="h-64" message="Loading services..." />
                        )}
                        {!loadingServices &&
                            serviceCards.map((svc, i) => {
                                const slug = svc.slug || toSlug(svc?.categoryId || 'service');

                                // Handle array or object form of serviceCardView
                                const cardView = Array.isArray(svc.serviceCardView)
                                    ? svc.serviceCardView[0]
                                    : svc.serviceCardView;

                                const post = {
                                    id: i + 1,
                                    title: cardView?.title || svc.heroSection?.title ||'',
                                    desc: cardView?.description || svc.heroSection?.description || "",
                                    img:
                                        cardView?.image ||
                                        svc.heroSection?.image ||
                                        'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcfeeebafefe65ebd0_icons8-checklist-94%201.svg',
                                };

                                const href = `/services/${slug}`;

                                return (
                                    <a key={svc._id} href={href} className="block h-full">
                                        <motion.div
                                            className="h-full"
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

                {/* Additional Sections with motion */}
                <motion.div {...fadeIn(0.2)}>
                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading why choose us section..." />}>
                        <WhyChooseUsSection />
                    </Suspense>
                </motion.div>
                <motion.div {...fadeIn(0.2)}>
                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading how it works section..." />}>
                        <HowItWorksSection />
                    </Suspense>
                </motion.div>
                <motion.div {...fadeIn(0.2)}>
                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading industries section..." />}>
                        <IndustriesSection />
                    </Suspense>
                </motion.div>
                <motion.div {...fadeIn(0.2)}>
                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading join team section..." />}>
                        <JoinTeamSection />
                    </Suspense>
                </motion.div>
                <motion.div {...fadeIn(0.2)}>
                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading blog section..." />}>
                        <BlogSection />
                    </Suspense>
                </motion.div>
                <motion.div {...fadeIn(0.2)}>
                    <Suspense fallback={<ComponentLoader height="h-64" message="Loading case studies section..." />}>
                        <CaseStudiesAndConnect />
                    </Suspense>
                </motion.div>
            </main>
        </>
    );
}
