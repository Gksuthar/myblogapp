'use client'
import Image from "next/image";
import { motion } from "framer-motion";
import ComponentLoader from "@/components/ComponentLoader";
import { useEffect, useState } from "react";
import axios from "axios";
interface Props 
{ 
    fadeIn:any
}
const TrustedComapny:React.FC<Props>=({fadeIn })=> {
        const [trustedCompanies, setTrustedCompanies] = useState<{
            _id: string;
            name: string;
            image: string;
        }[]>([]);
        const [loadingTrusted, setLoadingTrusted] = useState(true);
        useEffect(() => {
        const fetchTrustedCompanies = async () => {
            setLoadingTrusted(true);
            try {
                const res = await axios .get('/api/tructedCompany');
                setTrustedCompanies(res.data); // expects an array from GET
            } catch (error: unknown) {
                console.error('Failed to fetch trusted companies:', error);
            } finally {
                setLoadingTrusted(false);
            }
        };

        fetchTrustedCompanies();
    }, []);

  return (
       <motion.section {...fadeIn(0.2, 50)} className="relative w-full mt-10 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
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
  )
}

export default TrustedComapny
