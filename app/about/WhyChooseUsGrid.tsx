import React from 'react';
import Image from 'next/image';

// --- Custom SVG Icons/Graphics (Simplified Placeholders) ---

// 1. Clock with Check (Faster Turn Around Time)
const IconClockCheck = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="1.5" />
        <path d="M16 16L12 12M12 12V8" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 9L11 14L8 11" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// 2. Star Badge (10+ Years Of Experience)
const IconStarBadge = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill="#6366F1" stroke="#6366F1" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);

// 3. Gears and Document (Flexible Working Models)
const IconGearsDoc = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7" y="3" width="10" height="18" rx="2" stroke="#4F46E5" strokeWidth="1.5" />
        <path d="M11 7H13M11 11H13M11 15H13" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="19" cy="5" r="3" stroke="#4F46E5" strokeWidth="1.5" />
        <circle cx="5" cy="19" r="3" stroke="#4F46E5" strokeWidth="1.5" />
    </svg>
);

// 4. Bar Chart (Proficient In Accounting Tools) - Placeholder for multiple logos
const IconToolLogos = () => (
    <div className="flex space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-600">Xero</div>
        <div className="w-8 h-8 bg-gray-300 rounded-lg flex items-center justify-center text-xs font-bold text-gray-700">QB</div>
        <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center text-xs font-bold text-gray-800">S</div>
    </div>
);

// 5. User Avatars (45+ Dedicated Accountants)
const IconAccountants = () => (
    <div className="flex -space-x-2 rtl:space-x-reverse">
        <Image src="https://placehold.co/40x40/9CA3AF/ffffff?text=R" alt="Raj Sharma" width={40} height={40} className="rounded-full border-2 border-white" />
        <Image src="https://placehold.co/40x40/6B7280/ffffff?text=J" alt="John Doe" width={40} height={40} className="rounded-full border-2 border-white" />
    </div>
);

// 6. Savings Graph (Cost-Efficient Services)
const IconSavingsGraph = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 18L10 11L14 15L21 7" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 11V7H17" stroke="#34D399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="10" stroke="#34D399" strokeWidth="1.5" />
    </svg>
);


interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    img?: string;
    bgColorClass: string;
    gridArea?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, img, bgColorClass = '#359aff', gridArea }) => (
    <div
        className={`relative flex flex-col p-6 rounded-xl shadow-lg border border-gray-100 ${bgColorClass}`}
        style={{ gridArea }}
    >
        {/* Main Graphic/Icon (Simulating the 3D-lifted card style) */}

        {/* Sub Content / Secondary Graphics (like the "Quality Check" button or avatars) */}
        <div className="">
            <img src={img} alt="" className='max-h-50 min-h-50' />
        </div>

        {/* Title and Description */}
        <div className="mt-auto "> {/* Push content to bottom, compensating for absolute icon */}
            <h3 className="text-xl font-bold mb-2 text-gray-800" style={{ fontFamily: 'var(--font-lexend)' }}>
                {title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
                {description}
            </p>
        </div>
    </div>
);


const WhyChooseUsGrid: React.FC = () => {
    const features: FeatureCardProps[] = [
        {
            icon: <IconClockCheck />,
            title: "Faster Turn Around Time",
            description: "Delivering timely results with accuracy. Stanfox ensures prompt accounting services that meets deadlines & exceeds expectations.",
            img: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673ed4244357102f364e55cd_6324e0bb1a3ea28dbfe17e43_slide-img-03.png.svg",
            bgColorClass: 'bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent border-green-200/50',
        },
        {
            icon: <IconStarBadge />,
            title: "10+ Years Of Experience",
            description: "With over a decade of experience in the accounting industry, we bring seasoned expertise to support your financial needs.",
            img: 'https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673ed4246d7aa5692381b5c1_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-2.svg',
            bgColorClass: 'bg-indigo-50/50 border-indigo-200/50',
        },
        {
            icon: <IconGearsDoc />,
            title: "Flexible Working Models",
            description: "We adapt to your workflow and requirements. Choose from convenient timing models that fit your firm's needs.",
            bgColorClass: 'bg-blue-50/50 border-blue-200/50',
            img: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673ed424a0876d851a06fe42_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-4.svg"
        },
        {
            icon: <IconAccountants />,
            title: "45+ Dedicated Accountants",
            description: "Our team consists of 45+ dedicated accountants, committed to delivering reliable support & expertise tailored to your needs.",
            img: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673da781928a767c7df5b414_6324e0bb1a3ea28dbfe17e43_slide-img-03.png.svg",
            bgColorClass: 'bg-gray-50/50 border-gray-200/50',
        },
        {
            icon: <IconToolLogos />,
            title: "Proficient In Accounting Tools",
            description: "Our accounting maestros are adept at multiple accounting tools. Trust us to get accounting done in the most proficient way.",
            img: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673ed4242b3ce9979a56eea2_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-3.svg",
            bgColorClass: 'bg-gradient-to-r from-[rgba(53,154,255,0.12)] via-[rgba(53,154,255,0.06)] to-transparent border-green-200/50',
        },
        {
            icon: <IconSavingsGraph />,
            title: "Cost-Efficient Services",
            description: "Optimize your budget without sacrificing quality. Empower your firm with cost-effective services without missing a safety beat.",
            bgColorClass: 'bg-gray-50/50 border-gray-200/50',
            img: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673ed424a120863760c602d8_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-5.svg",
        },
    ];

    return (
        <>
            <section className="py-16 px-4 md:px-8 bg-gray-50" style={{ fontFamily: 'var(--font-lexend)' }}>
                <div className="max-w-7xl mx-auto ">

                    {/* Header Block */}
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                            Why Choose Stanfox?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience the Stanfox difference. Choose the perfect combo of expertise combined with adhering to the U.S. standards.
                        </p>
                    </div>

                    {/* Grid Layout (3 columns, 2 rows) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={index}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                img={feature.img}
                                bgColorClass={feature.bgColorClass}
                            />
                        ))}
                    </div>
                    

                </div>
                <section className="py-16 md:py-24 bg-gray-50 process_section mobile-hide  bg-light-gray">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-container bg-light-gray  container">

                        {/* Heading Wrapper */}
                        <div className="text-center heading-wrapper mb-12 md:mb-16 ">
                            <h2 className="text-4xl font-extrabold text-gray-800 heading-h2 width-full">
                                Hire Top Accounting Professionals in 5 Easy Steps
                            </h2>
                            <p className="text-lg text-gray-500 max-w-3xl mx-auto mt-3 heading-support-text width-750px">
                                Our streamlined 5-step process makes it simple for CPAs and businesses to hire top accounting talent effortlessly.
                            </p>
                        </div>

                        {/* Process Wrapper */}
                        <div className="process_wrapper relative">

                            {/* Top Row: Steps 1, 2, 3 in a 3-column layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 lg:gap-x-12 relative mb-16 md:mb-8 lg:mb-0">

                                {/* 1. Preliminary discussion */}
                                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center text-center how-we-work relative div-block-25">
                                    <img
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67456867b1b64daaefc7a5d4_6324e0bb1a3ea28dbfe17e43_slide-img-03.png.svg"
                                        loading="lazy"
                                        alt=""
                                        className="mb-4 "
                                    />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 heading-6">1. Preliminary discussion</h3>
                                    <p className="text-gray-600 text-sm paragraph-8">
                                        We kickstart our working relationship by discussing your business requirements &amp; what you hope to achieve with our help.
                                    </p>

                                    {/* ➡️ CONNECTOR ARROW (SVG) to Step 2 */}
                                    <div className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 hidden md:block w-12 h-4">
                                        <img
                                            src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674568a7947b76c8f794f77b_Group%201000004274.svg"
                                            loading="lazy"
                                            alt="Process step arrow"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>

                                {/* 2. SLAs setup */}
                                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center text-center how-we-work relative div-block-25 mt-8 md:mt-0">
                                    <img
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6745686752e3879cd3fcbdcf_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-1.svg"
                                        loading="lazy"
                                        alt=""
                                        className="mb-4 "
                                    />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 heading-6">2. SLAs setup</h3>
                                    <p className="text-gray-600 text-sm paragraph-8">
                                        After discussing your requirements, our team understands your operating procedures, helping us set the right SLAs.
                                    </p>

                                    {/* ➡️ CONNECTOR ARROW (SVG) to Step 3 */}
                                    <div className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 hidden md:block w-12 h-4">
                                        <img
                                            src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674568a7947b76c8f794f77b_Group%201000004274.svg"
                                            loading="lazy"
                                            alt="Process step arrow"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                </div>

                                {/* 3. Contract agreement */}
                                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center text-center how-we-work relative div-block-25 mt-8 md:mt-0">
                                    <img
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67456867aa5d5c07369f70c9_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-2.svg"
                                        loading="lazy"
                                        alt=""
                                        className="mb-4"
                                    />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 heading-6">3. Contract agreement</h3>
                                    <p className="text-gray-600 text-sm paragraph-8">
                                        Once the SLAs are set up, we officiate things by signing an agreement, outlining– team members, deadlines, clauses, etc.
                                    </p>
                                </div>

                            </div>

                            {/* --- */}

                            {/* Bottom Row: Steps 5, 4 */}
                            <div className="grid grid-cols-1 justify-content-centers items-center md:grid-cols-3 gap-x-8 lg:gap-x-12 pt-16 md:pt-0 relative div-block-63 _2-col">

                                {/* Placeholder/Empty div to push the content to the right (to align step 4) */}
                                <div className="hidden md:block"></div>

                                {/* 5. Weekly review meetings (Visually on the left of the bottom row) */}
                                <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center text-center how-we-work relative div-block-25 mt-10">
                                    <img
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67456886b79c31b9e7728967_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-3.svg"
                                        loading="lazy"
                                        alt=""
                                        className="mb-4"
                                    />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 heading-6">5. Weekly review meetings</h3>
                                    <p className="text-gray-600 text-sm paragraph-8">
                                        We conduct weekly meets, ensuring we address any concern &amp; keep client satisfaction at the heart of our support.
                                    </p>
                                </div>

                                {/* 4. Service commencement (Visually on the right of the bottom row) */}
                                <div className="bg-white  rounded-xl shadow-lg p-6 lg:p-8 flex flex-col items-center text-center how-we-work relative div-block-25 mt-10">
                                    <img
                                        src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/6745686768bf12387047a9a4_6324e0bb1a3ea28dbfe17e43_slide-img-03.png-4.svg"
                                        loading="lazy"
                                        alt=""
                                        className="mb-4"
                                    />
                                    <h3 className="text-xl font-semibold mb-2 text-gray-800 heading-6">4. Service commencement</h3>
                                    <p className="text-gray-600 text-sm paragraph-8">
                                        After finalizing all paperwork, we begin executing the pre-defined tasks and required functions.
                                    </p>
                                </div>

                            </div>

                        </div>
                    </div>
                </section>
            </section>

            <section className="bg-gray-100 py-20 md:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    {/* Heading and Subheading */}
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                            Our Flexible Hiring Models.
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            We have brought in 3 flexible models to help you hire professionals in a super-convenient way.
                        </p>
                    </div>

                    {/* Three-Column Models Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12">

                        {/* 1. Dedicated resource (FTE) */}
                        <div className="flex flex-col items-center text-center">
                            {/* Placeholder for the grey icon (Document/Form icon) */}
                            <div className="mb-6 w-24 h-24 flex items-center justify-center">
                                {/* In a real project, you would put your SVG/Image tag here */}
                                <img
                                    src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67330931399afb43b8e141e3_icons8-form-94%201.svg"
                                    alt="Dedicated resource icon"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Dedicated resource (FTE)
                            </h3>
                            <p className="text-sm text-gray-600 max-w-xs mx-auto">
                                Hire full-time dedicated accounting professionals who integrate with your team, handling all tasks as an extension of your practice.
                            </p>
                        </div>

                        {/* 2. Portfolio management services */}
                        <div className="flex flex-col items-center text-center">
                            {/* Placeholder for the grey icon (Pie Chart icon) */}
                            <div className="mb-6 w-24 h-24 flex items-center justify-center">
                                {/* In a real project, you would put your SVG/Image tag here */}
                                <img
                                    src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/673309315d39d28b20662abd_icons8-investment-portfolio-94%201.svg"
                                    alt="Portfolio management icon"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                Portfolio management services
                            </h3>
                            <p className="text-sm text-gray-600 max-w-xs mx-auto">
                                Access a team of experienced accountants who manage your clients' accounts, ensuring accuracy, compliance &amp; timely delivery on all projects.
                            </p>
                        </div>

                        {/* 3. On-demand pricing model */}
                        <div className="flex flex-col items-center text-center">
                            {/* Placeholder for the grey icon (Price Tag icon) */}
                            <div className="mb-6 w-24 h-24 flex items-center justify-center">
                                {/* In a real project, you would put your SVG/Image tag here */}
                                <img
                                    src="https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/67330931fcc18762b470e711_icons8-price-94%201.svg"
                                    alt="On-demand pricing icon"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <h3 className="text-xl font-bold text-gray-800 mb-3">
                                On-demand pricing model
                            </h3>
                            <p className="text-sm text-gray-600 max-w-xs mx-auto">
                                Opt for flexible, on-demand pricing tailored to your workload, allowing you to scale services up or down based on your clients' needs.
                            </p>
                        </div>

                    </div>
                </div>
            </section>
            

        </>
    );
};

export default WhyChooseUsGrid;