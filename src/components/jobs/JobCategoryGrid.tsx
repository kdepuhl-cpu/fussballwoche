import Link from "next/link";
import { JOB_KATEGORIEN, getJobsByCategory } from "@/lib/jobs";

export default function JobCategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {JOB_KATEGORIEN.map((category) => {
        const count = getJobsByCategory(category.id).length;
        return (
          <Link
            key={category.id}
            href={`/jobs/kategorie/${category.slug}`}
            className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 text-center hover:border-forest-green dark:hover:border-green-500 hover:shadow-md transition-all duration-200"
          >
            <div className="w-10 h-10 mx-auto mb-2 bg-mint dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:bg-forest-green transition-colors">
              <svg
                className="w-5 h-5 text-forest-green dark:text-green-400 group-hover:text-white transition-colors"
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
            <p className="text-sm font-semibold text-off-black dark:text-white">
              {category.label}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {count} {count === 1 ? "Stelle" : "Stellen"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
