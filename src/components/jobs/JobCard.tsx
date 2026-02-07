import Link from "next/link";
import { Job, JOB_TYP_LABELS, JOB_KATEGORIEN, getTimeAgo } from "@/lib/jobs";

interface JobCardProps {
  job: Job;
  featured?: boolean;
}

export default function JobCard({ job, featured }: JobCardProps) {
  const category = JOB_KATEGORIEN.find((k) => k.id === job.kategorie);

  if (featured) {
    return (
      <Link href={`/jobs/${job.id}`} className="block group">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 ring-2 ring-forest-green/20">
          <div className="bg-forest-green text-white px-4 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Featured
          </div>
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {category && (
                    <span className="text-xs font-semibold text-orange uppercase tracking-wide">
                      {category.label}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {getTimeAgo(job.datum)}
                  </span>
                </div>
                <h3 className="font-headline text-xl font-bold text-off-black dark:text-white leading-tight group-hover:text-forest-green dark:group-hover:text-green-400 transition-colors">
                  {job.titel}
                </h3>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-1">
                  {job.verein}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
              {job.beschreibung}
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-mint dark:bg-green-900/30 text-forest-green dark:text-green-400 text-xs font-medium rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.bezirk}
              </span>
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                {JOB_TYP_LABELS[job.typ]}
              </span>
              {job.liga && (
                <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                  {job.liga}
                </span>
              )}
              {job.verguetung && (
                <span className="px-2.5 py-1 bg-orange/10 text-orange text-xs font-medium rounded-full">
                  {job.verguetung}
                </span>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/jobs/${job.id}`} className="block group">
      <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              {category && (
                <span className="text-xs font-semibold text-orange uppercase tracking-wide">
                  {category.label}
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {getTimeAgo(job.datum)}
              </span>
            </div>
            <h3 className="font-headline text-lg font-bold text-off-black dark:text-white leading-snug group-hover:text-forest-green dark:group-hover:text-green-400 transition-colors">
              {job.titel}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              {job.verein}
            </p>
          </div>
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            {category && (
              <svg className="w-5 h-5 text-forest-green dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={category.icon} />
              </svg>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.bezirk}
          </span>
          <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
            {JOB_TYP_LABELS[job.typ]}
          </span>
          {job.liga && (
            <span className="px-2 py-0.5 text-gray-500 dark:text-gray-400 text-xs">
              {job.liga}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
