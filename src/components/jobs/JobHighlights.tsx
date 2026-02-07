"use client";

import Link from "next/link";
import { jobs, JOB_TYP_LABELS } from "@/lib/jobs";

export default function JobHighlights() {
  const featured = jobs.slice(0, 3);

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-headline text-xl text-off-black dark:text-white">
          Jobs im Berliner Fußball
        </h2>
        <Link
          href="/jobs"
          className="text-sm font-medium text-forest-green hover:underline flex items-center gap-1"
        >
          Alle Jobs
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 snap-x snap-mandatory md:mx-0 md:px-0 md:grid md:grid-cols-3 md:overflow-visible">
        {featured.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="flex-shrink-0 w-[280px] md:w-auto snap-start bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-forest-green/10 text-forest-green dark:bg-forest-green/20 dark:text-green-400 rounded">
                {JOB_TYP_LABELS[job.typ]}
              </span>
            </div>

            <h3 className="text-sm font-semibold text-off-black dark:text-white line-clamp-2 mb-2">
              {job.titel}
            </h3>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="font-medium truncate">{job.verein}</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <span className="truncate">{job.bezirk}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
