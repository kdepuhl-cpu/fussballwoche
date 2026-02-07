import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import JobCard from "@/components/jobs/JobCard";
import {
  jobs,
  getJobById,
  getJobsByCategory,
  JOB_TYP_LABELS,
  JOB_KATEGORIEN,
  formatJobDate,
} from "@/lib/jobs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  const category = JOB_KATEGORIEN.find((k) => k.id === job.kategorie);
  const relatedJobs = getJobsByCategory(job.kategorie)
    .filter((j) => j.id !== job.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href="/jobs"
            className="hover:text-forest-green dark:hover:text-green-400 transition-colors"
          >
            Jobs
          </Link>
          <span>/</span>
          {category && (
            <>
              <Link
                href={`/jobs/kategorie/${category.slug}`}
                className="hover:text-forest-green dark:hover:text-green-400 transition-colors"
              >
                {category.label}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-off-black dark:text-white truncate">
            {job.titel}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          {category && (
            <span className="text-sm font-semibold text-orange uppercase tracking-wide">
              {category.label}
            </span>
          )}
          <h1 className="font-headline text-3xl lg:text-4xl text-off-black dark:text-white mt-2 leading-tight">
            {job.titel}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {job.verein}
            </span>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {job.bezirk}
            </span>
          </div>

          {/* Meta Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-3 py-1.5 bg-mint dark:bg-green-900/30 text-forest-green dark:text-green-400 text-sm font-medium rounded-full">
              {JOB_TYP_LABELS[job.typ]}
            </span>
            {job.liga && (
              <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-full">
                {job.liga}
              </span>
            )}
            {job.verguetung && (
              <span className="px-3 py-1.5 bg-orange/10 text-orange text-sm font-medium rounded-full">
                {job.verguetung}
              </span>
            )}
            <span className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-full">
              Veröffentlicht: {formatJobDate(job.datum)}
            </span>
          </div>
        </div>

        {/* Beschreibung */}
        <section className="mb-8">
          <h2 className="font-headline text-xl text-off-black dark:text-white mb-3">
            Beschreibung
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {job.beschreibung}
          </p>
        </section>

        {/* Aufgaben */}
        <section className="mb-8">
          <h2 className="font-headline text-xl text-off-black dark:text-white mb-3">
            Deine Aufgaben
          </h2>
          <ul className="space-y-2">
            {job.aufgaben.map((aufgabe, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
              >
                <svg
                  className="w-5 h-5 text-forest-green dark:text-green-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                {aufgabe}
              </li>
            ))}
          </ul>
        </section>

        {/* Anforderungen */}
        <section className="mb-8">
          <h2 className="font-headline text-xl text-off-black dark:text-white mb-3">
            Das bringst du mit
          </h2>
          <ul className="space-y-2">
            {job.anforderungen.map((anf, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-gray-700 dark:text-gray-300"
              >
                <svg
                  className="w-5 h-5 text-orange flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                {anf}
              </li>
            ))}
          </ul>
        </section>

        {/* Kontakt / Bewerbung */}
        <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="font-headline text-xl text-off-black dark:text-white mb-4">
            Jetzt bewerben
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">
                {job.kontakt.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                href={`mailto:${job.kontakt.email}`}
                className="text-forest-green dark:text-green-400 hover:underline"
              >
                {job.kontakt.email}
              </a>
            </div>
            {job.kontakt.telefon && (
              <div className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href={`tel:${job.kontakt.telefon.replace(/[\s/]/g, "")}`}
                  className="text-gray-700 dark:text-gray-300 hover:text-forest-green dark:hover:text-green-400 transition-colors"
                >
                  {job.kontakt.telefon}
                </a>
              </div>
            )}
          </div>
          <a
            href={`mailto:${job.kontakt.email}?subject=Bewerbung: ${job.titel}`}
            className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange text-white font-semibold rounded-lg hover:bg-orange/90 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Per E-Mail bewerben
          </a>
        </section>

        {/* Tags */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {job.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 rounded-full border border-gray-200 dark:border-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="border-t-4 border-gray-900 dark:border-gray-100 pt-6 mt-8">
            <h2 className="font-headline text-2xl text-off-black dark:text-white mb-6">
              Ähnliche Stellen
            </h2>
            <div className="space-y-3">
              {relatedJobs.map((relJob) => (
                <JobCard key={relJob.id} job={relJob} />
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 text-sm font-medium text-forest-green dark:text-green-400 hover:underline"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Alle Stellen anzeigen
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return jobs.map((job) => ({
    id: job.id,
  }));
}
