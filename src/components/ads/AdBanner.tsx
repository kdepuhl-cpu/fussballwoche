"use client";

interface AdBannerProps {
  title?: string;
  sponsor?: string;
  className?: string;
}

export default function AdBanner({
  title = "Werbefläche Premium",
  sponsor,
  className = "",
}: AdBannerProps) {
  return (
    <div
      className={`w-full rounded-xl overflow-hidden bg-gradient-to-r from-forest-green to-[#0a6a1f] dark:from-[#032d0b] dark:to-[#064d15] ${className}`}
      role="complementary"
      aria-label="Werbung"
    >
      <div className="flex flex-col items-center justify-center h-[120px] sm:h-[160px] px-6">
        {/* Sponsor label */}
        {sponsor && (
          <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-widest text-white/60 mb-2">
            Präsentiert von {sponsor}
          </p>
        )}

        {/* Ad creative placeholder */}
        <div className="flex items-center justify-center w-full max-w-md h-[60px] sm:h-[80px] border-2 border-dashed border-white/30 rounded-lg">
          <span className="text-xs sm:text-sm font-medium text-white/50 select-none">
            {title}
          </span>
        </div>
      </div>
    </div>
  );
}
