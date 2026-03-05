"use client";

import Link from "next/link";
import { Artikel } from "@/lib/types";
import { getLigaById, formatDate } from "@/lib/data";
import { useReadArticles } from "@/hooks/useReadArticles";

interface TopStoriesProps {
  articles: Artikel[];
}

export default function TopStories({ articles }: TopStoriesProps) {
  const { isRead } = useReadArticles();

  if (articles.length === 0) return null;

  const hero = articles[0];
  const heroLiga = getLigaById(hero.ligaId);
  const sidebar = articles.slice(1, 5);

  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline text-2xl md:text-3xl text-off-black dark:text-white flex items-center gap-2">
          <span className="w-1 h-6 bg-electric-orange rounded-full" />
          Jetzt lesen
        </h2>
        <span className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
          Aktualisiert {formatDate(hero.datum)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
        {/* Hero Story */}
        <Link href={`/artikel/${hero.slug}`} className="group relative block">
          <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
            {hero.bild ? (
              <img
                src={hero.bild.url}
                alt={hero.bild.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
              {heroLiga && (
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-electric-orange mb-2">
                  {heroLiga.name}
                </span>
              )}
              <h3 className={`font-headline text-xl md:text-2xl lg:text-3xl leading-tight text-white ${
                isRead(hero.slug) ? "opacity-70" : ""
              }`}>
                {hero.titel}
              </h3>
              <p className="text-sm text-gray-300 mt-2 line-clamp-2 hidden md:block">
                {hero.teaser}
              </p>
            </div>
          </div>
        </Link>

        {/* Sidebar Stories */}
        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
          {sidebar.map((article) => {
            const liga = getLigaById(article.ligaId);
            const articleIsRead = isRead(article.slug);

            return (
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                className="group flex gap-4 py-3 first:pt-0 last:pb-0"
              >
                {/* Thumbnail */}
                {article.bild ? (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={article.bild.url}
                      alt={article.bild.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
                )}

                {/* Text */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {liga && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-electric-orange">
                      {liga.name}
                    </span>
                  )}
                  <h3 className={`text-sm md:text-[15px] font-semibold leading-snug mt-0.5 line-clamp-2 transition-colors group-hover:text-forest-green dark:group-hover:text-green-400 ${
                    articleIsRead ? "text-gray-400 dark:text-gray-500" : "text-off-black dark:text-white"
                  }`}>
                    {article.titel}
                  </h3>
                  <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {article.lesedauer && `${article.lesedauer} Min.`}
                    {article.lesedauer && article.autor && " · "}
                    {article.autor?.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
