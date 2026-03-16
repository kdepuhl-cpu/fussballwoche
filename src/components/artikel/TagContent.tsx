"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { formatDate, getLigaById } from "@/lib/data";
import { useArticlesByTag } from "@/hooks/useArticles";

export default function TagContent({ slug }: { slug: string }) {
  const { articles: taggedArticles, loading } = useArticlesByTag(slug);

  // Get the original tag name from the first matching article
  const originalTag = taggedArticles[0]?.tags?.find(
    (tag) =>
      tag.toLowerCase().replace(/\s+/g, "-").replace(/\./g, "") === slug ||
      tag.toLowerCase() === slug
  );

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        {/* Tag Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Tag
          </p>
          <h1 className="font-headline text-4xl text-off-black dark:text-white">
            {originalTag || slug}
          </h1>
          {!loading && (
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {taggedArticles.length} Artikel
            </p>
          )}
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex gap-6">
                <div className="w-48 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : taggedArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">Keine Artikel mit diesem Tag gefunden.</p>
            <Link href="/" className="text-forest-green mt-4 inline-block hover:underline">
              Zur Startseite
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {taggedArticles.map((article) => {
              const liga = getLigaById(article.ligaId);

              return (
                <article
                  key={article.slug}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                >
                  <Link href={`/artikel/${article.slug}`} className="group flex gap-6">
                    {/* Thumbnail */}
                    {article.bild && (
                      <div className="w-48 h-32 relative flex-shrink-0 overflow-hidden rounded-lg bg-gray-200">
                        <Image
                          src={article.bild.url}
                          alt={article.bild.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Liga Badge */}
                      {liga && (
                        <span className="text-xs font-semibold uppercase tracking-wider text-electric-orange">
                          {liga.name}
                        </span>
                      )}

                      {/* Headline */}
                      <h2 className="font-headline text-xl text-off-black dark:text-white group-hover:text-forest-green transition-colors mt-1">
                        {article.titel}
                      </h2>

                      {/* Teaser */}
                      <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2 text-sm">
                        {article.teaser}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-3 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        {article.autor && <span>{article.autor.name}</span>}
                        <span>•</span>
                        <span>{formatDate(article.datum)}</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-forest-green hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück zur Startseite
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
