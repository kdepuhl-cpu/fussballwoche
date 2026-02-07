import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import JobCard from "@/components/jobs/JobCard";
import {
  JOB_KATEGORIEN,
  getCategoryBySlug,
  getJobsByCategory,
} from "@/lib/jobs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JobKategoriePage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryJobs = getJobsByCategory(category.id).sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link
            href="/jobs"
            className="hover:text-forest-green dark:hover:text-green-400 transition-colors"
          >
            Jobs
          </Link>
          <span>/</span>
          <span className="text-off-black dark:text-white">
            {category.label}
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-8 flex items-start gap-4">
          <div className="w-14 h-14 bg-mint dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg
              className="w-7 h-7 text-forest-green dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={category.icon}
              />
            </svg>
          </div>
          <div>
            <h1 className="font-headline text-3xl lg:text-4xl text-off-black dark:text-white">
              {category.label}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {category.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {categoryJobs.length}{" "}
              {categoryJobs.length === 1 ? "Stelle" : "Stellen"} verfügbar
            </p>
          </div>
        </div>

        {/* Job List */}
        {categoryJobs.length > 0 ? (
          <div className="space-y-3">
            {categoryJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                featured={job.featured}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">
              Aktuell keine Stellen in dieser Kategorie.
            </p>
            <Link
              href="/jobs"
              className="mt-4 inline-block px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 transition-colors"
            >
              Alle Stellen anzeigen
            </Link>
          </div>
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
  return JOB_KATEGORIEN.map((k) => ({
    slug: k.slug,
  }));
}
