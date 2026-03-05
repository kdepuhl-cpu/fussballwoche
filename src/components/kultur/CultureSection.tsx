"use client";

import Link from "next/link";
import Image from "next/image";
import { Artikel } from "@/lib/types";

interface CultureSectionProps {
  articles: Artikel[];
}

export default function CultureSection({ articles }: CultureSectionProps) {
  if (articles.length === 0) return null;

  const featured = articles[0];
  const rest = articles.slice(1, 4);

  return (
    <section className="bg-[#1F1F1F] dark:bg-[#161616] -mx-4 sm:-mx-6 px-4 sm:px-6 py-10 mb-10 rounded-lg">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-1 h-8 bg-orange rounded-full" />
          <h2 className="font-headline text-2xl sm:text-3xl text-white">
            Kultur & Trends
          </h2>
        </div>
        <p className="text-gray-400 text-sm ml-[19px] mb-8">
          Fußball trifft Fashion, Musik & Lifestyle
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* Featured Card */}
          <Link href={`/artikel/${featured.slug}`} className="group block">
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-800">
              {featured.bild && (
                <Image
                  src={featured.bild.url}
                  alt={featured.bild.alt}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <span className="inline-block px-2.5 py-1 bg-orange text-white text-[11px] font-semibold uppercase tracking-wider rounded mb-3">
                  Kultur
                </span>
                <h3 className="font-headline text-xl sm:text-2xl lg:text-3xl text-white leading-tight group-hover:text-orange transition-colors">
                  {featured.titel}
                </h3>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2 hidden sm:block">
                  {featured.teaser}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                  {featured.autor && (
                    <span className="font-medium">{featured.autor.name}</span>
                  )}
                  <span>{featured.lesedauer} Min.</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Smaller Cards */}
          <div className="flex flex-col gap-4">
            {rest.map((article, index) => (
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                className={`group flex gap-4 ${
                  index !== rest.length - 1
                    ? "pb-4 border-b border-gray-700"
                    : ""
                }`}
              >
                {/* Thumbnail */}
                {article.bild && (
                  <div className="w-[110px] sm:w-[130px] aspect-[3/2] relative flex-shrink-0 overflow-hidden rounded-md bg-gray-800">
                    <Image
                      src={article.bild.url}
                      alt={article.bild.alt}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-1.5">
                    {article.tags
                      ?.filter((t) => t !== "Kultur")
                      .slice(0, 2)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-semibold uppercase tracking-wider text-orange"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  <h4 className="text-[15px] font-semibold leading-snug text-white group-hover:text-orange transition-colors line-clamp-2">
                    {article.titel}
                  </h4>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                    {article.autor && <span>{article.autor.name}</span>}
                    <span>{article.lesedauer} Min.</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
