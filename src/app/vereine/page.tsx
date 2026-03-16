"use client";

import { useState, useEffect } from "react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import ClubCard from "@/components/verein/ClubCard";
import { vereine as mockVereine } from "@/lib/mock/clubs";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getClubBySlug } from "@/lib/api/clubs";
import type { VereinProfil } from "@/lib/types";

export default function VereinePage() {
  const [clubs, setClubs] = useState<VereinProfil[]>(mockVereine);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Versuche Vereine aus Supabase zu laden, falle auf Mock zurück
    Promise.all(mockVereine.map((v) => getClubBySlug(v.slug)))
      .then((results) => {
        const loaded = results.filter((c): c is VereinProfil => c !== undefined);
        if (loaded.length > 0) setClubs(loaded);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <h1 className="font-headline text-3xl sm:text-4xl text-off-black dark:text-white mb-2">
          Vereine
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-2xl">
          Die Vereinsprofile des Berliner Amateurfußballs — Kontakt, Trainingszeiten und Sportstätten auf einen Blick.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="h-2 bg-gray-200 dark:bg-gray-700" />
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
