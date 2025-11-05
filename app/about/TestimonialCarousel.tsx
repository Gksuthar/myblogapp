import React, { useState } from 'react';

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
        quote: "Stanfox have provided outstanding service. Quick, attentive and crucially they listen carefully to requirements and what we need to accomplish before taking action. They were also very fast to learn the relevant tax code in a brand new country for them. Highly recommended.",
        image: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674572587cdfc99244c1cc12_Image.png", 
    },
    {
        name: "Sarah Chen",
        title: "Tech Startup Founder",
        quote: "We switched to Stanfox for our bookkeeping and payroll, and the efficiency gain has been incredible. Their team is knowledgeable, professional, and always accessible. A truly reliable outsourcing partner!",
        image: "https://cdn.prod.website-files.com/6718c309cc349b579872ddbb/674572b8a2e9667f53cba48b_Image.png", 
    },
    {
        name: "David Lee",
        title: "E-commerce CEO",
        quote: "Navigating international tax compliance was daunting until we partnered with Stanfox. Their expertise in multiple accounting tools ensured a smooth transition and flawless financial reporting across all our platforms.",
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

    // TypeScript ensures currentTestimonial is of type Testimonial (or undefined if the array is empty)
    const currentTestimonial = data[currentIndex];

    // Functions remain the same, relying on the type-safe data
    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };
    
    // Type checking the event for the onError handler
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        (e.currentTarget).style.display = 'none';
    };


    if (!currentTestimonial) {
        return <div className="text-center p-10">No testimonials available.</div>;
    }

    return (
        <section className="bg-white py-16 flex items-center justify-center">
            {/* Main Carousel Card Container */}
            <div className="w-[70%]  p-6 bg-gray-100 rounded-2xl shadow-lg flex flex-col md:flex-row items-center md:items-stretch relative transition-all duration-500 ease-in-out">
                
                {/* Image Section */}
                <div className="md:w-1/3 flex-shrink-0 mb-6 md:mb-0 md:mr-6">
                    <div className="w-48 h-48 md:w-full md:h-full overflow-hidden rounded-xl mx-auto md:mx-0">
                        {/* TypeScript allows us to suppress the next/image lint rule using a comment */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={currentTestimonial.image} 
                            alt={currentTestimonial.name} 
                            className="w-full h-full object-cover grayscale transition-opacity duration-500"
                            onError={handleImageError} // Using the typed handler
                        />
                    </div>
                </div>

                {/* Testimonial Content Section */}
                <div className="md:w-2/3 flex max-h-100 min-h-100 flex-col justify-between relative pl-4 pr-16 md:pr-4">
                    <div className="relative">
                        {/* Quote Icon - top left */}
                        <span className="absolute -top-4 -left-0 text-5xl font-serif text-gray-400 opacity-75 transform -translate-x-full">
                            &ldquo;
                        </span>
                        
                        <p className="text-lg italic text-gray-700 leading-relaxed mt-4 md:mt-0 mb-6 transition-opacity duration-500">
                            {currentTestimonial.quote}
                        </p>
                        
                        {/* Quote Icon - bottom right */}
                        <span className="absolute -bottom-6 right-0 text-5xl font-serif text-gray-400 opacity-75 transform translate-x-full">
                            &rdquo;
                        </span>
                    </div>

                    <div className=" transition-opacity duration-500">
                        <p className="font-bold text-gray-800">{currentTestimonial.name}</p>
                        <p className="text-sm text-gray-600">{currentTestimonial.title}</p>
                    </div>
                </div>

                {/* Navigation Arrows (Functional) */}
                <div className="absolute bottom-6 right-6 flex space-x-2  z-10">
                    <button 
                        onClick={prevSlide}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-200 transition"
                        aria-label="Previous testimonial"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-200 transition"
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