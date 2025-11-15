"use client";
import React, { useState } from "react";

const JoinTeamSection: React.FC = () => {
  const videoUrls = [
    "/abrahamkobi.mp4",
    "/agro-endorsement-2.mp4",
    "/carlie-testimonial.mp4",
    "/restaurant.mp4", 
  ];

  const videoTitles = [
    "Abraham Kobi - Owner of KB Encore LLC",
    "Basil Agrocostea - Owner of Agroaccounting",
    "Carlie Amore - Owner of Amore Dentistry",
    "Alex - Small Restaurant Owner"
  ];

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
          {/* Title & Description - CENTERED */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[var(--primary-color)] tracking-tight">
              Be Part Of Something Great
            </h2>
            <p className="mt-3 text-gray-600 leading-relaxed max-w-3xl mx-auto text-base sm:text-lg">
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

          {/* Client Testimonials Video Heading */}
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              Client Testimonials Video
            </h3>
          </div>

          {/* Video Gallery - 4 videos in row on desktop, responsive on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {videoUrls.map((src, idx) => (
              <div
                key={idx}
                className="animate-fadeInUp"
                style={{ animationDelay: `${idx * 0.15}s` }}
              >
                <div
                  onClick={() => openModal(src)}
                  onMouseEnter={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) video.play();
                  }}
                  onMouseLeave={(e) => {
                    const video = e.currentTarget.querySelector('video');
                    if (video) {
                      video.pause();
                      video.currentTime = 0;
                    }
                  }}
                  className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                  style={{ width: "100%", height: "320px" }}
                >
                  {/* Thumbnail Video (muted, no controls) */}
                  <video
                    src={src}
                    loop
                    muted
                    playsInline
                    className="object-cover w-full h-full rounded-lg transform transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />

                  {/* Blue Border Animation on Hover */}
                  <div className="absolute inset-0 rounded-lg border-4 border-transparent group-hover:border-[var(--primary-color)] transition-all duration-300"></div>

                  {/* Play Icon Overlay */}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-14 h-14 bg-[var(--primary-color)] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <svg
                        className="w-7 h-7 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ marginLeft: '3px' }}
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Video Title Below */}
                <p className="mt-4 text-center text-gray-700 font-medium text-sm leading-snug">
                  {videoTitles[idx]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Screen Video Modal */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-gray-300 transition-colors"
            onClick={closeModal}
            aria-label="Close video player"
          >
            &times;
          </button>

          <div
            className="relative w-full max-w-4xl p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              loop
              className="w-full h-auto rounded-lg shadow-2xl"
              style={{ maxHeight: '85vh' }}
            />
          </div>
        </div>
      )}

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
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </>
  );
};

export default JoinTeamSection;