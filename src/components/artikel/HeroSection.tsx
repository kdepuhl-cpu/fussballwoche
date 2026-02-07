"use client";

import Link from "next/link";
import Image from "next/image";
import { Artikel } from "@/lib/types";
import { useReadArticles } from "@/hooks/useReadArticles";
import NewBadge from "@/components/ui/NewBadge";
import FavoritesBadge from "@/components/user/FavoritesBadge";

interface HeroSectionProps {
  hero: Artikel;
  sidebar: Artikel[];
  sectionTitle?: string;
  isLast?: boolean;
}

// Comment bubble icon
function CommentIcon() {
  return (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

// Read indicator - checkmark in circle
function ReadBadge({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-forest-green text-white flex-shrink-0 ${className}`}>
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

export default function HeroSection({ hero, sidebar, sectionTitle, isLast = false }: HeroSectionProps) {
  const { isRead } = useReadArticles();
  const heroIsRead = isRead(hero.slug);

  return (
    <section className={`${!isLast ? "border-b border-gray-200 dark:border-gray-700 pb-8 mb-8" : "pb-8"}`}>
      {/* Section Title - Sticky */}
      {sectionTitle && (
        <h2 className="font-headline text-2xl text-off-black dark:text-white mb-6 sticky top-12 bg-off-white dark:bg-gray-900 py-3 -mx-4 px-4 z-10 border-b border-transparent">
          {sectionTitle}
        </h2>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Hero Article */}
        <article className="group">
          <Link href={`/artikel/${hero.slug}`} className="block">
            {/* Image - 16:9 aspect ratio with shadow lift on hover */}
            <div className="aspect-[16/9] relative overflow-hidden rounded-lg mb-4 bg-gray-200 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
              {hero.bild && (
                <Image
                  src={hero.bild.url}
                  alt={hero.bild.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}
            </div>

            {/* Headline */}
            <div className="flex items-center gap-2 mb-1">
              <NewBadge date={hero.datum} />
              <FavoritesBadge ligaId={hero.ligaId} />
            </div>
            <h3 className={`font-headline text-2xl lg:text-3xl group-hover:text-forest-green transition-colors flex items-center gap-2 ${
              heroIsRead ? "text-gray-500 dark:text-gray-400" : "text-off-black dark:text-white"
            }`}>
              <span>{hero.titel}</span>
              {heroIsRead && <ReadBadge className="w-6 h-6 flex-shrink-0" />}
            </h3>

            {/* Teaser */}
            <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 text-sm">
              {hero.teaser}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
              {hero.autor && <span>{hero.autor.name}</span>}
              <CommentIcon />
            </div>
          </Link>
        </article>

        {/* Sidebar Articles - With Thumbnails, equal height */}
        <div className="lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-6 flex flex-col justify-between h-full">
          {sidebar.map((artikel, index) => {
            const artikelIsRead = isRead(artikel.slug);

            return (
              <article
                key={artikel.slug}
                className={index !== sidebar.length - 1 ? "border-b border-gray-200 dark:border-gray-700 pb-4" : ""}
              >
                <Link href={`/artikel/${artikel.slug}`} className="group flex gap-4">
                  {/* Thumbnail - 3:2 aspect ratio with hover effects */}
                  <div className="w-[150px] aspect-[3/2] relative flex-shrink-0 overflow-hidden rounded bg-gray-200 shadow-sm group-hover:shadow-lg transition-shadow duration-300">
                    {artikel.bild && (
                      <Image
                        src={artikel.bild.url}
                        alt={artikel.bild.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <NewBadge date={artikel.datum} />
                      <FavoritesBadge ligaId={artikel.ligaId} />
                    </div>
                    {/* Headline */}
                    <h4 className={`text-base font-semibold leading-snug group-hover:text-forest-green transition-colors flex items-center gap-1.5 ${
                      artikelIsRead ? "text-gray-500 dark:text-gray-400" : "text-off-black dark:text-white"
                    }`}>
                      <span className="line-clamp-3">{artikel.titel}</span>
                      {artikelIsRead && <ReadBadge className="w-4 h-4 flex-shrink-0" />}
                    </h4>

                    {/* Meta */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {artikel.autor && <span>{artikel.autor.name}</span>}
                      <CommentIcon />
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
