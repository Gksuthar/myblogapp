"use client";
import Image from "next/image";
import React from "react";

const JoinTeamSection: React.FC = () => {
  return (
    <section className="py-12 px-5 sm:px-8 lg:px-12 bg-white text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Title & Description */}
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

        {/* Grid Image Gallery with Stagger Animation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3 max-w-6xl mx-auto">
          {[
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
            "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
            "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
            "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&q=80",
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80",
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80",
            "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80",
            "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
            "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
            "https://images.unsplash.com/photo-1528901166007-3784c7dd3653?w=800&q=80",
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80"
          ].map((src, idx) => {
            // Mobile pe sirf 6 images show karo
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
            if (isMobile && idx >= 6) return null;
            
            return (
              <div
                key={idx}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer animate-fadeInUp shadow-2xl hover:shadow-2xl transition-shadow transform-gpu"
                style={{
                  animationDelay: `${idx * 0.08}s`,
                  animationFillMode: "both"
                }}
              >
                <Image
                  src={src}
                  alt={`Team ${idx + 1}`}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--primary-color)]/80 via-[var(--primary-color)]/20 to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-500" />
                {/* soft bottom accent shadow to mimic big card depth */}
                <div className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full bg-black/6 blur-xl opacity-60" />
              </div>
            );
          })}
        </div>

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
      </div>
    </section>
  );
};

export default JoinTeamSection;