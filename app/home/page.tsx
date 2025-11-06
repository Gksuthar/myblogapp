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
// Remove useState from top level. Declare a constant for initial icons.
const initialServiceIcons: string[] = [
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcfeeebafefe65ebd0_icons8-checklist-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedee4354c083390f315_icons8-resume-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedd1ecc3b35a9896b53_icons8-talk-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcdff39f1fc7a90b67_icons8-accounting-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedd58a2203357e2c49d_icons8-investment-94%201.svg',
    'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedc8d7996c335092337_icons8-bill-94%201.svg'
];
let countServiceIcons = 0;

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
                    // <HeroSection
                    //     title={heroData.title}
                    //     disc={heroData.disc}
                    //     image={heroData.image ?? ''}
                    // // buttonText={heroData.buttonText}
                    // />
                    <section className="relative overflow-hidden bg-gray-50 py-24 ">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-blue-50"></div>

                        {/* Center Content */}
                        <div className="relative z-10 mx-auto flex flex-col items-center text-center px-4">
                            {/* Heading */}
                            <motion.h1
                                style={{ width: "100%", maxWidth: "720px" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
                            >
                                Dedicated Offshore Teams For CPAs And Accounting Firms
                            </motion.h1>

                            {/* Description */}
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.6 }}
                                className="text-base sm:text-lg text-gray-600 max-w-2xl mb-8"
                            >
                                Join other CPA firms, empowering their firm with Stanfox's job-ready
                                outsourcing accounting team.
                            </motion.p>
                        </div>

                        {/* Profile Layout */}
                        <div className="relative z-10 w-full mx-auto mt-16">
                            {/* Left Main Person - hidden on mobile */}
                            <div className="hidden md:block absolute bottom-0 left-6 ">
                                <div className="relative w-[330px] h-[330px] rounded-2xl overflow-hidden bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent">
                                    <Image
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6731b5ddfd1bbd33089db299_hero_left-image.webp"
                                        alt="Raj Sharma"
                                        fill
                                        className="object-cover"
                                        priority
                                        style={{ filter: 'hue-rotate(120deg) saturate(1.2)' }}
                                    />
                                </div>

                                {/* Raj Sharma Label */}
                                <div className="absolute -bottom-12 left-8 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
                                    <Image
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6734b1ea315c6e40db84bfbe_Rectangle%204599.png"
                                        alt="Raj Sharma"
                                        width={45}
                                        height={45}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Raj Sharma</p>
                                        <p className="text-gray-500 text-xs">Senior Accountant</p>
                                    </div>
                                </div>

                                {/* Top-left (Pinky Mehta) */}
                                <div className="absolute -top-25 left-16 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
                                    <Image
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6734b1d56763687c6bfcc49d_Rectangle%204599.webp"
                                        alt="Pinky Mehta"
                                        width={45}
                                        height={45}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Pinky Mehta</p>
                                        <p className="text-gray-500 text-xs">Fractional CFO</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Main Person - hidden on mobile */}
                            <div className="hidden md:block absolute right-1 bottom-0">
                                <div className="relative w-[280px] h-[280px] rounded-2xl overflow-hidden bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent">
                                    <Image
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673ddddc7484f43263a13818_Group%201000004220.png"
                                        alt="Kajol Shah"
                                        fill
                                        className="object-cover"
                                        priority
                                        style={{ filter: 'hue-rotate(120deg) saturate(1.2)' }}
                                    />
                                </div>

                                {/* Kajol Shah Label */}
                                <div className="absolute -bottom-12 right-8 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
                                    <Image
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6734b1d96f7b89e3708a8fc4_Rectangle%204599-1.png"
                                        alt="Kajol Shah"
                                        width={45}
                                        height={45}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Kajol Shah</p>
                                        <p className="text-gray-500 text-xs">Bookkeeper</p>
                                    </div>
                                </div>

                                {/* Shiv Panchal Label */}
                                <div className="absolute -top-16 right-20 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
                                    <Image
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6734b1d9251109d62e7b32e9_Rectangle%204599-2.png"
                                        alt="Shiv Panchal"
                                        width={45}
                                        height={45}
                                        className="rounded-md"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Shiv Panchal</p>
                                        <p className="text-gray-500 text-xs">Auditee</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                ) : (
                    <ComponentLoader height="h-96" message="Loading hero section..." />
                )}
            </Suspense>

            {/* Trusted Companies Section */}
            <motion.section
                {...fadeIn(0.2, 50)}
                className="relative w-full mt-10 bg-gradient-to-b from-white to-gray-50 overflow-hidden"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-3">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Trusted by Leading Firms
                        </h2>
                        <p className="text-gray-600">
                            Join hundreds of accounting professionals who trust us
                        </p>
                    </div>

                    {loadingTrusted ? (
                        <div className="flex justify-center items-center">
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
                                countServiceIcons=countServiceIcons+1;
                                const slug = svc.slug || toSlug(svc?.categoryId || 'service');

                                // Handle array or object form of serviceCardView
                                const cardView = Array.isArray(svc.serviceCardView)
                                    ? svc.serviceCardView[0]
                                    : svc.serviceCardView;

                                const post = {
                                    id: i + 1,
                                    title: cardView?.title || svc.heroSection?.title || '',
                                    desc: cardView?.description || svc.heroSection?.description || "",
                                    img: initialServiceIcons[countServiceIcons % 6]

                                        // cardView?.image ||
                                        // svc.heroSection?.image ||
                                        // 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6732eedcfeeebafefe65ebd0_icons8-checklist-94%201.svg',
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
