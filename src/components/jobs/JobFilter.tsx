"use client";

import {
  JobKategorie,
  JobTyp,
  JOB_KATEGORIEN,
  JOB_TYP_LABELS,
  BEZIRKE,
} from "@/lib/jobs";

interface JobFilterProps {
  selectedKategorie: JobKategorie | "";
  selectedBezirk: string;
  selectedTyp: JobTyp | "";
  onKategorieChange: (value: JobKategorie | "") => void;
  onBezirkChange: (value: string) => void;
  onTypChange: (value: JobTyp | "") => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function JobFilter({
  selectedKategorie,
  selectedBezirk,
  selectedTyp,
  onKategorieChange,
  onBezirkChange,
  onTypChange,
  onReset,
  hasActiveFilters,
}: JobFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Kategorie */}
      <select
        value={selectedKategorie}
        onChange={(e) => onKategorieChange(e.target.value as JobKategorie | "")}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-off-black dark:text-white focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green"
      >
        <option value="">Alle Kategorien</option>
        {JOB_KATEGORIEN.map((k) => (
          <option key={k.id} value={k.id}>
            {k.label}
          </option>
        ))}
      </select>

      {/* Bezirk */}
      <select
        value={selectedBezirk}
        onChange={(e) => onBezirkChange(e.target.value)}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-off-black dark:text-white focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green"
      >
        <option value="">Alle Bezirke</option>
        {BEZIRKE.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      {/* Typ */}
      <select
        value={selectedTyp}
        onChange={(e) => onTypChange(e.target.value as JobTyp | "")}
        className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-off-black dark:text-white focus:outline-none focus:border-forest-green focus:ring-1 focus:ring-forest-green"
      >
        <option value="">Alle Typen</option>
        {(Object.entries(JOB_TYP_LABELS) as [JobTyp, string][]).map(
          ([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          )
        )}
      </select>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-off-black dark:hover:text-white transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Filter zurücksetzen
        </button>
      )}
    </div>
  );
}
