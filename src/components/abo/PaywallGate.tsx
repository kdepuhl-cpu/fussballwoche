"use client";

import { useUser } from "@/lib/user/auth";
import Link from "next/link";

interface PaywallGateProps {
  children: React.ReactNode;
  previewLines?: number;
}

function LockIcon() {
  return (
    <svg
      className="w-10 h-10 text-forest-green dark:text-green-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
      />
    </svg>
  );
}

export default function PaywallGate({
  children,
  previewLines = 3,
}: PaywallGateProps) {
  const { user, loading } = useUser();

  // While loading auth state, show preview to avoid layout shift
  if (loading) {
    return <PaywallPreview previewLines={previewLines}>{children}</PaywallPreview>;
  }

  // TODO: Check subscription_tier once available in UserProfile
  // Future: const { profile } = useUser();
  // if (profile?.subscription_tier === 'dauerkarte' || profile?.subscription_tier === 'ehrentribuene') → show full
  const hasAccess = !!user;

  if (hasAccess) {
    return <>{children}</>;
  }

  return <PaywallPreview previewLines={previewLines}>{children}</PaywallPreview>;
}

function PaywallPreview({
  children,
  previewLines,
}: {
  children: React.ReactNode;
  previewLines: number;
}) {
  // Calculate max-height based on preview lines (approx 1.75rem line-height for prose-lg)
  const maxHeight = `${previewLines * 2}rem`;

  return (
    <div className="relative">
      {/* Preview content with overflow hidden */}
      <div
        className="overflow-hidden"
        style={{ maxHeight }}
      >
        {children}
      </div>

      {/* Gradient fade overlay */}
      <div
        className="relative -mt-20 h-20 bg-gradient-to-t from-off-white dark:from-gray-900 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Paywall card */}
      <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 sm:p-10 text-center shadow-sm mt-2">
        <div className="flex justify-center mb-5">
          <LockIcon />
        </div>

        <h3 className="font-headline text-2xl sm:text-3xl text-off-black dark:text-white leading-tight">
          Dieser Artikel ist exklusiv f&uuml;r Abonnenten
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mt-3 text-base sm:text-lg max-w-md mx-auto">
          Schalte alle Artikel frei — mit der FuWo Dauerkarte.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link
            href="/abo"
            className="w-full sm:w-auto px-8 py-3 bg-forest-green hover:bg-forest-green/90 text-white font-semibold rounded-full transition-colors text-base"
          >
            Dauerkarte sichern
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-forest-green dark:hover:border-green-400 text-off-black dark:text-white font-semibold rounded-full transition-colors text-base"
          >
            Einloggen
          </Link>
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 mt-6">
          Ab 4,99&euro; / Monat &middot; Jederzeit k&uuml;ndbar
        </p>
      </div>
    </div>
  );
}
