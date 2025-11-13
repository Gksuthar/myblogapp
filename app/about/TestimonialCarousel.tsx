import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Type and Data Definitions (Included here for a complete file) ---

interface Testimonial {
    name: string;
    title: string;
    quote: string;
    image: string;
}

const defaultTestimonials: Testimonial[] = [
    {
        name: "Hamish McDonald",
        title: "Health Management Systems",
        quote: "Sbaccounting have provided outstanding service. Quick, attentive and crucially they listen carefully to requirements and what we need to accomplish before taking action. They were also very fast to learn the relevant tax code in a brand new country for them. Highly recommended.",
        image: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674572587cdfc99244c1cc12_Image.png", 
    },
    {
        name: "Sarah Chen",
        title: "Tech Startup Founder",
        quote: "We switched to Sbaccounting for our bookkeeping and payroll, and the efficiency gain has been incredible. Their team is knowledgeable, professional, and always accessible. A truly reliable outsourcing partner!",
        image: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674572b8a2e9667f53cba48b_Image.png", 
    },
    {
        name: "David Lee",
        title: "E-commerce CEO",
        quote: "Navigating international tax compliance was daunting until we partnered with Sbaccounting. Their expertise in multiple accounting tools ensured a smooth transition and flawless financial reporting across all our platforms.",
        image: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674ed9f6d7f1cff9cc28d127_keith.png", 
    },
];

interface TestimonialCarouselProps {
    data?: Testimonial[];
}

// --- TestimonialCarousel Component ---

// Use React.FC<Props> for function component typing
const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({ data = defaultTestimonials }) => {
    // Explicitly typing the state for currentIndex as a number
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [testimonials, setTestimonials] = useState<typeof defaultTestimonials>(data);

    // Load dynamic testimonials from API on mount
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await axios.get('/api/testimonial');
                if (mounted && Array.isArray(res.data) && res.data.length > 0) {
                    setTestimonials(res.data);
                }
            } catch (err) {
                // fallback to default data (already set)
                console.warn('Failed to fetch testimonials, using defaults', err);
            }
        })();
        return () => { mounted = false; };
    }, []);

    // TypeScript ensures currentTestimonial is of type Testimonial (or undefined if the array is empty)
    const currentTestimonial = testimonials[currentIndex];

    // Functions remain the same, relying on the type-safe data
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };
    
    // Type checking the event for the onError handler
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.currentTarget).style.display = 'none';
    };


    if (!currentTestimonial) {
        return <div className="text-center p-10">No testimonials available.</div>;
    }

    return (
        <section className="bg-white py-8 md:py-16 flex items-center justify-center min-h-0">
            {/* Main Carousel Card Container */}
            <div className="w-[90%] md:w-[70%] p-6 bg-gray-50 rounded-2xl shadow-lg flex flex-col items-center relative transition-all duration-500 ease-in-out">
                
                {/* Image Section */}
                <div className="w-40 h-40 overflow-hidden rounded-full bg-gray-200 flex items-center justify-center mb-6">
                    <img 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.name} 
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                </div>

                {/* Testimonial Content Section */}
                <div className="text-center">
                    <p className="text-lg italic text-gray-700 leading-relaxed mb-4">
                        {currentTestimonial.quote}
                    </p>
                    <p className="font-bold text-gray-800 text-xl">
                        {currentTestimonial.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                        {currentTestimonial.title}
                    </p>
                </div>

                {/* Navigation Arrows */}
                <div className="flex space-x-4 mt-6">
                    <button 
                        onClick={prevSlide}
                        className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="w-10 h-10 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center justify-center"
                        aria-label="Next testimonial"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialCarousel;