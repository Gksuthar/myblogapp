"use client";
import React, { useState } from "react";

const JoinTeamSection: React.FC = () => {
  const videoUrls = [
    "/abrahamkobi.mp4",
    "/agro-endorsement-2.mp4",
    "/carlie-testimonial.mp4",
    "/restaurant.mp4", 
  ];

  // State to manage which video is in the full-screen modal
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const openModal = (videoSrc: string) => {
    setSelectedVideo(videoSrc);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  return (
    <>
      <section className="py-12 px-5 sm:px-8 lg:px-12 bg-white text-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Title & Description (No change) */}
          <div className="text-center md:text-left mb-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--primary-color)] tracking-tight">
              Be Part Of Something Great
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed max-w-3xl mx-auto md:mx-0 text-base sm:text-lg">
              At SB Accounting, our infrastructure speaks the same language as our
              services: refined, reliable, and built for excellence. Surrounded by
              natural elements and smart design, our team finds the clarity and
              calm needed to deliver exceptional results, every day.
            </p>
            <button
              onClick={() => { window.location.href = '/Contactus' }}
              className="mt-6 px-7 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-[var(--primary-color)] transition-all shadow-md hover:shadow-lg"
            >
              Join The Team
            </button>
          </div>

          {/* Improved Video Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {videoUrls.map((src, idx) => (
              <div
                key={idx}
                // Use a button or div with onClick for the modal
                onClick={() => openModal(src)}
                className="relative aspect-video overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                style={{ animationDelay: `${idx * 0.15}s`, animationFillMode: "both" }}
              >
                {/* Thumbnail Video (muted, no controls) */}
                <video
                  src={src}
                  loop
                  muted
                  playsInline
                  className="object-cover w-full h-full rounded-lg transform transition-transform duration-500 ease-in-out"
                />

                {/* --- UI Improvement: Play Icon Overlay --- */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 bg-[var(--primary-color)] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    {/* Play Icon SVG */}
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginLeft: '4px' }} // Center the triangle
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                
                {/* Project Title Overlay */}
                <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/60 to-transparent w-full">
                  <p className="text-white text-lg font-medium">Project Showcase {idx + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Full-Screen Video Modal --- */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal} // Close modal on background click
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-gray-300"
            onClick={closeModal}
            aria-label="Close video player"
          >
            &times;
          </button>

          {/* Video Player Container */}
          <div
            className="relative w-full max-w-4xl p-4"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on video
          >
            <video
              src={selectedVideo}
              controls
              autoPlay // Auto-play the video when modal opens
              loop
              className="w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '85vh' }}
            />
          </div>
        </div>
      )}

      {/* ... (Your existing style jsx tag) ... */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </>
  );
};

export default JoinTeamSection;