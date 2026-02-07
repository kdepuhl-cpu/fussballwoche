"use client";

import { useState, useMemo } from "react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import JobCard from "@/components/jobs/JobCard";
import JobCategoryGrid from "@/components/jobs/JobCategoryGrid";
import JobFilter from "@/components/jobs/JobFilter";
import JobSearch from "@/components/jobs/JobSearch";
import { filterJobs, getFeaturedJobs, JobKategorie, JobTyp } from "@/lib/jobs";

export default function JobsPage() {
  const [query, setQuery] = useState("");
  const [kategorie, setKategorie] = useState<JobKategorie | "">("");
  const [bezirk, setBezirk] = useState("");
  const [typ, setTyp] = useState<JobTyp | "">("");

  const hasActiveFilters = !!(query || kategorie || bezirk || typ);

  const filteredJobs = useMemo(
    () =>
      filterJobs({
        kategorie: kategorie || undefined,
        bezirk: bezirk || undefined,
        typ: typ || undefined,
        query: query || undefined,
      }),
    [query, kategorie, bezirk, typ]
  );

  const featuredJobs = getFeaturedJobs();

  const resetFilters = () => {
    setQuery("");
    setKategorie("");
    setBezirk("");
    setTyp("");
  };

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 pt-8 pb-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-headline text-4xl lg:text-5xl text-off-black dark:text-white">
            Jobs im Berliner Fußball
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Trainer, Spieler, Ehrenamt &ndash; finde deine Aufgabe im Verein.
          </p>
        </div>

        {/* Category Grid */}
        <section className="mb-10">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Kategorien
          </h2>
          <JobCategoryGrid />
        </section>

        {/* Featured Jobs */}
        {!hasActiveFilters && featuredJobs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Hervorgehobene Stellen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} featured />
              ))}
            </div>
          </section>
        )}

        {/* Search & Filter */}
        <section className="mb-6">
          <div className="space-y-4">
            <JobSearch value={query} onChange={setQuery} />
            <JobFilter
              selectedKategorie={kategorie}
              selectedBezirk={bezirk}
              selectedTyp={typ}
              onKategorieChange={setKategorie}
              onBezirkChange={setBezirk}
              onTypChange={setTyp}
              onReset={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </section>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filteredJobs.length}{" "}
            {filteredJobs.length === 1 ? "Stelle" : "Stellen"} gefunden
          </p>
        </div>

        {/* Job List */}
        {filteredJobs.length > 0 ? (
          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
              Keine Stellen gefunden
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Versuche andere Suchbegriffe oder setze die Filter zurück.
            </p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-forest-green text-white text-sm font-medium rounded-lg hover:bg-forest-green/90 transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
