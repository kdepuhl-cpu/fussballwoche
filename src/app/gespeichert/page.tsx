"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import BookmarkButton from "@/components/ui/BookmarkButton";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useArticles } from "@/hooks/useArticles";
import { formatDate, getLigaById } from "@/lib/data";
import { Artikel } from "@/lib/types";

export default function GespeichertPage() {
  const { bookmarks } = useBookmarks();
  const { articles: artikel } = useArticles();
  const [savedArticles, setSavedArticles] = useState<Artikel[]>([]);

  useEffect(() => {
    const articles = bookmarks
      .map((slug) => artikel.find((a) => a.slug === slug))
      .filter((a): a is Artikel => a !== undefined);
    setSavedArticles(articles);
  }, [bookmarks, artikel]);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <svg className="w-8 h-8 text-forest-green" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h1 className="font-headline text-4xl text-off-black dark:text-white">
              Gespeichert
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {savedArticles.length} {savedArticles.length === 1 ? "Artikel" : "Artikel"} gespeichert
          </p>
        </div>

        {/* Empty State */}
        {savedArticles.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-off-black dark:text-white mb-2">
              Noch keine Artikel gespeichert
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Klicke auf das Lesezeichen-Icon bei einem Artikel, um ihn hier zu speichern.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest-green text-white rounded-xl font-semibold hover:bg-forest-green/90 transition-colors"
            >
              Artikel entdecken
            </Link>
          </div>
        )}

        {/* Saved Articles List */}
        {savedArticles.length > 0 && (
          <div className="space-y-6">
            {savedArticles.map((article) => {
              const liga = getLigaById(article.ligaId);

              return (
                <article
                  key={article.slug}
                  className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0"
                >
                  <div className="flex gap-6">
                    <Link href={`/artikel/${article.slug}`} className="group flex-1 flex gap-6">
                      {/* Thumbnail */}
                      {article.bild && (
                        <div className="w-24 h-20 sm:w-40 sm:h-28 relative flex-shrink-0 overflow-hidden rounded-md sm:rounded-lg bg-gray-200 dark:bg-gray-800">
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
                        <h2 className="font-headline text-xl text-off-black dark:text-white group-hover:text-forest-green transition-colors mt-1 line-clamp-2">
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

                    {/* Bookmark Button */}
                    <div className="flex-shrink-0">
                      <BookmarkButton slug={article.slug} className="p-2" />
                    </div>
                  </div>
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
