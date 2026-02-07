"use client";

import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900 flex flex-col">
      <div className="py-6 flex justify-center">
        <Link href="/">
          <Image
            src="/icons/diago_logo_rgb_forest-green.svg"
            alt="DIAGO"
            width={120}
            height={34}
            className="h-8 w-auto dark:hidden"
          />
          <Image
            src="/icons/diago_logo_rgb_white.svg"
            alt="DIAGO"
            width={120}
            height={34}
            className="h-8 w-auto hidden dark:block"
          />
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center px-4 pb-12">
        {children}
      </div>
    </div>
  );
}
