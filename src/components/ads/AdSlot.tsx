"use client";

interface AdSlotProps {
  variant: "leaderboard" | "mid-article" | "sidebar" | "inline";
  className?: string;
}

const VARIANT_STYLES: Record<AdSlotProps["variant"], { wrapper: string; label: string }> = {
  leaderboard: {
    wrapper: "w-full h-[90px]",
    label: "728x90",
  },
  "mid-article": {
    wrapper: "w-full h-[250px]",
    label: "Werbung",
  },
  sidebar: {
    wrapper: "w-[300px] h-[250px]",
    label: "300x250",
  },
  inline: {
    wrapper: "w-full py-4",
    label: "Anzeige",
  },
};

export default function AdSlot({ variant, className = "" }: AdSlotProps) {
  // TODO: If subscription_tier !== 'free', don't render ads.
  // For now, always render the placeholder.

  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800/50 rounded-lg ${styles.wrapper} ${className}`}
      role="complementary"
      aria-label="Werbung"
    >
      <span className="text-xs text-gray-400 dark:text-gray-500 select-none">
        {styles.label}
      </span>
    </div>
  );
}
