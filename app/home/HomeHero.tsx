
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

function HomeHero() {
    const [title, setTitle] = useState<string>('Dedicated Offshore Teams For CPAs And Accounting Firms');
    const [disc, setDisc] = useState<string>("Join other CPA firms, empowering their firm with Sbaccounting's job-ready\n                    outsourcing accounting team.");
    const [buttonText, setButtonText] = useState<string>('Learn More');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await fetch('/api/hero');
                if (!res.ok) return;
                const data = await res.json();
                if (!mounted) return;
                // Debug log to help troubleshoot missing description
                console.debug('Fetched hero data:', data);
                if (data?.title) setTitle(data.title);
                // Accept several possible property names for the description
                const desc = data?.disc ?? data?.description ?? data?.desc ?? data?.text ?? '';
                if (desc) setDisc(desc);
                if (data?.buttonText) setButtonText(data.buttonText || 'Learn More');
            } catch (err) {
                // keep defaults
                console.warn('Failed to load hero data', err);
            }
        })();
        return () => { mounted = false; };
    }, []);

    return (
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
                    {title}
                </motion.h1>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-base sm:text-lg text-gray-600 max-w-2xl mb-8 whitespace-pre-line"
                >
                    {disc}
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
                    {/* <div className="absolute -bottom-12 left-8 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
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
                    </div> */}

                    {/* Top-left (Pinky Mehta) */}
                    {/* <div className="absolute -top-25 left-16 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
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
                    </div> */}
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
                    {/* <div className="absolute -bottom-12 right-8 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
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
                    </div> */}

                    {/* Shiv Panchal Label */}
                    {/* <div className="absolute -top-16 right-20 bg-white rounded-2xl p-3 shadow-lg flex items-center gap-3">
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
                    </div> */}
                </div>
            </div>
        </section>
    )
}

export default HomeHero
