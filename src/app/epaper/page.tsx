"use client";

import Image from "next/image";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
// Cover images are now pre-generated static files — no client-side PDF rendering needed
import { currentIssues, archivIssues } from "@/lib/mock/epaper";

export default function EPaperPage() {
  const latestIssue = currentIssues[0];
  const otherIssues = currentIssues.slice(1);
  const archivPreview = archivIssues.slice(0, 4);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Page Title */}
        <h1 className="font-headline text-3xl sm:text-4xl text-off-black dark:text-white mb-2">
          E-Paper
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          Die Fußball-Woche — jetzt auch digital lesen.
        </p>

        {/* Latest Issue — Hero */}
        <section className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 mb-16">
          <Link
            href={`/epaper/${latestIssue.id}`}
            className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden group shadow-lg"
          >
            <Image
              src={latestIssue.coverImage}
              alt={latestIssue.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              priority
            />
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-forest-green text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
                Neu
              </span>
            </div>
          </Link>

          <div className="flex flex-col justify-center">
            <p className="text-sm text-forest-green dark:text-green-400 font-semibold uppercase tracking-wide mb-2">
              Aktuelle Ausgabe
            </p>
            <h2 className="font-headline text-2xl sm:text-3xl text-off-black dark:text-white mb-4">
              {latestIssue.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {latestIssue.pageCount} Seiten
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Erschienen am{" "}
              {new Date(latestIssue.date).toLocaleDateString("de-DE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <Link
              href={`/epaper/${latestIssue.id}`}
              className="inline-flex items-center gap-2 bg-forest-green text-white px-6 py-3 rounded-lg font-semibold hover:bg-forest-green/90 transition-colors w-fit"
            >
              Jetzt lesen
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        {/* Other Current Issues */}
        {otherIssues.length > 0 && (
          <section className="mb-16">
            <h2 className="font-headline text-xl sm:text-2xl text-off-black dark:text-white mb-6">
              Weitere Ausgaben
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {otherIssues.map((issue) => (
                <Link
                  key={issue.id}
                  href={`/epaper/${issue.id}`}
                  className="group"
                >
                  <div className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mb-3">
                    <Image
                      src={issue.coverImage}
                      alt={issue.title}
                      fill
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-semibold text-off-black dark:text-white group-hover:text-forest-green dark:group-hover:text-green-400 transition-colors">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {issue.pageCount} Seiten
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Archiv Teaser */}
        <section className="border-t-4 border-off-black dark:border-white pt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-headline text-xl sm:text-2xl text-off-black dark:text-white">
              Aus dem Archiv
            </h2>
            <Link
              href="/archiv"
              className="text-sm font-semibold text-forest-green dark:text-green-400 hover:underline"
            >
              Zum Archiv →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {archivPreview.map((issue) => (
              <Link
                key={issue.id}
                href={`/epaper/${issue.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md mb-3 archiv-sepia">
                  <Image
                    src={issue.coverImage}
                    alt={issue.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-semibold text-off-black dark:text-white group-hover:text-forest-green dark:group-hover:text-green-400 transition-colors">
                  {issue.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {issue.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
