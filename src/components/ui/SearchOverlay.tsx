"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Artikel } from "@/lib/types";
import { useArticles } from "@/hooks/useArticles";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Artikel[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { articles: artikel } = useArticles();

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Search logic
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = artikel.filter(
      (a) =>
        a.titel.toLowerCase().includes(searchTerm) ||
        a.teaser.toLowerCase().includes(searchTerm) ||
        a.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    );
    setResults(filtered.slice(0, 8));
  }, [query, artikel]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        {/* Search Input */}
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Artikel suchen..."
            className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-900 rounded-xl text-lg text-off-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-forest-green"
          />
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
              ESC
            </kbd>
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            {results.map((article, index) => (
              <Link
                key={article.slug}
                href={`/artikel/${article.slug}`}
                onClick={onClose}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  index !== results.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""
                }`}
              >
                {article.bild && (
                  <div className="w-16 h-12 relative flex-shrink-0 rounded overflow-hidden bg-gray-200">
                    <Image
                      src={article.bild.url}
                      alt={article.bild.alt}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-off-black dark:text-white truncate">
                    {article.titel}
                  </h4>
                  <p className="text-sm text-gray-500 truncate">{article.teaser}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No results */}
        {query.length >= 2 && results.length === 0 && (
          <div className="mt-4 bg-white dark:bg-gray-900 rounded-xl p-8 text-center">
            <p className="text-gray-500">Keine Artikel gefunden für &quot;{query}&quot;</p>
          </div>
        )}

        {/* Hint */}
        {query.length < 2 && (
          <p className="mt-4 text-center text-gray-500 text-sm">
            Mindestens 2 Zeichen eingeben
          </p>
        )}
      </div>
    </div>
  );
}
