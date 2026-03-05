"use client";

import { useState } from "react";

interface Partner {
  name: string;
  shortName?: string;
}

const PARTNERS: Partner[] = [
  { name: "Berliner Pilsner", shortName: "BP" },
  { name: "SPORTULAR", shortName: "SP" },
  { name: "Adidas", shortName: "ADI" },
  { name: "BFV", shortName: "BFV" },
  { name: "Berliner Sparkasse", shortName: "BSK" },
];

interface PartnerSliderProps {
  label?: string;
  className?: string;
}

export default function PartnerSlider({
  label = "Unsere Partner",
  className = "",
}: PartnerSliderProps) {
  const [isPaused, setIsPaused] = useState(false);
  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...PARTNERS, ...PARTNERS];

  return (
    <section
      className={`bg-[#F5F5F5] dark:bg-[#1A1A1A] py-6 rounded-xl overflow-hidden ${className}`}
      aria-label="Partner und Sponsoren"
    >
      {/* Label */}
      <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 text-center mb-4">
        {label}
      </p>

      {/* Marquee Track */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#F5F5F5] dark:from-[#1A1A1A] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#F5F5F5] dark:from-[#1A1A1A] to-transparent z-10 pointer-events-none" />

        <div
          className="flex items-center gap-8 sm:gap-12 w-max animate-marquee"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 group cursor-pointer"
            >
              {/* Placeholder logo box */}
              <div className="flex items-center justify-center w-[120px] h-[48px] sm:w-[140px] sm:h-[56px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:text-off-black dark:group-hover:text-white transition-colors duration-300 select-none">
                  {partner.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
