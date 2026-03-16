"use client";

import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import ClubHeader from "@/components/verein/ClubHeader";
import ClubInfo from "@/components/verein/ClubInfo";
import ClubTraining from "@/components/verein/ClubTraining";
import ClubKontakte from "@/components/verein/ClubKontakte";
import ClubArticles from "@/components/verein/ClubArticles";
import SocialFeed from "@/components/verein/SocialFeed";
import { useClub } from "@/hooks/useClubs";
import { useArticles } from "@/hooks/useArticles";

export default function VereinContent({ slug }: { slug: string }) {
  const { club, loading } = useClub(slug);
  const { articles: allArticles } = useArticles();

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white dark:bg-gray-900">
        <div className="sticky top-0 z-50"><Header /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mt-8" />
          </div>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-off-white dark:bg-gray-900">
        <div className="sticky top-0 z-50"><Header /></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 text-center">
          <h1 className="font-headline text-3xl text-off-black dark:text-white">Verein nicht gefunden</h1>
          <Link href="/vereine" className="text-forest-green mt-4 inline-block hover:underline">Zur Vereinsübersicht</Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Find related articles
  const relatedArticles = allArticles
    .filter(
      (a) =>
        a.vereinIds?.includes(club.id) ||
        a.tags?.some(
          (tag) =>
            tag.toLowerCase().includes(club.kurzname.toLowerCase()) ||
            tag.toLowerCase().includes(club.name.toLowerCase())
        )
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-forest-green dark:hover:text-green-400 transition-colors">
            Start
          </Link>
          <span>/</span>
          <Link href="/vereine" className="hover:text-forest-green dark:hover:text-green-400 transition-colors">
            Vereine
          </Link>
          <span>/</span>
          <span className="text-off-black dark:text-white font-medium truncate">
            {club.name}
          </span>
        </nav>

        {/* Club Header */}
        <ClubHeader club={club} />

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-8">
          {/* Main Content */}
          <div className="space-y-6">
            <ClubInfo sportstaette={club.sportstaette} />
            <ClubTraining trainingszeiten={club.trainingszeiten} />
            <ClubKontakte ansprechpartner={club.ansprechpartner} />
            <SocialFeed
              instagramUrl={club.socialMedia?.instagram}
              facebookUrl={club.socialMedia?.facebook}
              clubName={club.kurzname}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-headline text-lg text-off-black dark:text-white mb-4">
                Auf einen Blick
              </h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Gründung</dt>
                  <dd className="text-sm font-semibold text-off-black dark:text-white">{club.gruendungsjahr}</dd>
                </div>
                {club.mitglieder && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Mitglieder</dt>
                    <dd className="text-sm font-semibold text-off-black dark:text-white">{club.mitglieder.toLocaleString("de-DE")}</dd>
                  </div>
                )}
                {club.mannschaften && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Mannschaften</dt>
                    <dd className="text-sm font-semibold text-off-black dark:text-white">{club.mannschaften}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Bezirk</dt>
                  <dd className="text-sm font-semibold text-off-black dark:text-white">{club.bezirk}</dd>
                </div>
              </dl>
            </div>

            {/* Contact Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="font-headline text-lg text-off-black dark:text-white mb-4">
                Kontakt
              </h2>
              <div className="space-y-3">
                {club.kontakt.telefon && (
                  <a href={`tel:${club.kontakt.telefon.replace(/\s/g, "")}`}
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {club.kontakt.telefon}
                  </a>
                )}
                {club.kontakt.email && (
                  <a href={`mailto:${club.kontakt.email}`}
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {club.kontakt.email}
                  </a>
                )}
                {club.kontakt.website && (
                  <a href={club.kontakt.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Website
                  </a>
                )}
                {club.socialMedia?.instagram && (
                  <a href={club.socialMedia.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    Instagram
                  </a>
                )}
                {club.socialMedia?.facebook && (
                  <a href={club.socialMedia.facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-forest-green dark:hover:text-green-400 transition-colors">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </a>
                )}
              </div>
            </div>

            {/* Related Articles */}
            <ClubArticles articles={relatedArticles} clubName={club.kurzname} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
