"use client";
import { Suspense, lazy, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ComponentLoader from "@/components/ComponentLoader";
import axios from "axios";
import HomeHero from "./HomeHero";
import TrustedComapny from "./TrustedComapny";
import Service from "./Service";

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



export default function Home() {
    const [heroData, setHeroData] = useState<{
        title: string;
        disc: string;
        image?: string;
        buttonText?: string;
    } | null>(null);

    return (
        <>
            <HomeHero />
            {/* Trusted Companies Section */}
            <TrustedComapny fadeIn={fadeIn} />

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
               
                     <Service fadeIn={fadeIn}/>
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
