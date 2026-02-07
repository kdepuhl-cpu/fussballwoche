"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user/auth";
import { updateProfile } from "@/lib/api/profile";
import { getClubs } from "@/lib/api/clubs";
import { BEZIRKE } from "@/lib/jobs";
import { getLeaguesByCategory } from "@/lib/leagues";
import type { Verein } from "@/lib/types";

const STEPS = ["Bezirk", "Vereine", "Ligen"];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-10 w-full max-w-xs mx-auto">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i <= step
                  ? "bg-forest-green text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
              }`}
            >
              {i < step ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <span className={`text-xs mt-1 ${i <= step ? "text-forest-green font-medium" : "text-gray-400"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 mt-[-16px] ${
                i < step ? "bg-forest-green" : "bg-gray-300 dark:bg-gray-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, refreshProfile } = useUser();
  const [step, setStep] = useState(0);
  const [bezirk, setBezirk] = useState<string | null>(null);
  const [favoriteClubs, setFavoriteClubs] = useState<string[]>([]);
  const [favoriteLeagues, setFavoriteLeagues] = useState<string[]>([]);
  const [clubs, setClubs] = useState<Verein[]>([]);
  const [clubSearch, setClubSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getClubs().then(setClubs);
  }, []);

  const toggleClub = (id: string) => {
    setFavoriteClubs((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const toggleLeague = (id: string) => {
    setFavoriteLeagues((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  // When clubs are selected, auto-select their leagues
  useEffect(() => {
    if (step === 2 && favoriteClubs.length > 0) {
      const clubLeagueIds = clubs
        .filter((c) => favoriteClubs.includes(c.id))
        .map((c) => c.ligaId)
        .filter(Boolean);
      setFavoriteLeagues((prev) => {
        const merged = new Set([...prev, ...clubLeagueIds]);
        return Array.from(merged);
      });
    }
  }, [step, favoriteClubs, clubs]);

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    await updateProfile(user.id, {
      bezirk,
      favorite_club_ids: favoriteClubs,
      favorite_league_ids: favoriteLeagues,
      onboarding_completed: true,
    });
    await refreshProfile();
    router.push("/");
  };

  // Filter clubs for step 2
  const searchLower = clubSearch.toLowerCase();
  const filteredClubs = clubs.filter((c) =>
    c.name.toLowerCase().includes(searchLower)
  );
  const displayClubs = filteredClubs;

  // Group leagues for step 3
  const herrenLeagues = getLeaguesByCategory("herren");
  const frauenLeagues = getLeaguesByCategory("frauen");
  const pokalLeagues = getLeaguesByCategory("pokal");

  return (
    <div className="w-full max-w-lg">
      <ProgressBar step={step} />

      {/* Step 1: Bezirk */}
      {step === 0 && (
        <div>
          <h2 className="font-headline text-2xl text-off-black dark:text-white text-center mb-2">
            Wähle deinen Bezirk
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
            Wir zeigen dir relevante News aus deiner Umgebung
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BEZIRKE.map((b) => (
              <button
                key={b}
                onClick={() => setBezirk(bezirk === b ? null : b)}
                className={`px-3 py-3 rounded-lg text-sm font-medium transition-all border ${
                  bezirk === b
                    ? "bg-forest-green text-white border-forest-green"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-forest-green"
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Überspringen
            </button>
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 transition-colors"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Vereine */}
      {step === 1 && (
        <div>
          <h2 className="font-headline text-2xl text-off-black dark:text-white text-center mb-2">
            Wähle deine Vereine
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
            {favoriteClubs.length} von 5 ausgewählt
          </p>

          <input
            type="text"
            value={clubSearch}
            onChange={(e) => setClubSearch(e.target.value)}
            placeholder="Verein suchen..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-off-black dark:text-white mb-4 focus:ring-2 focus:ring-forest-green focus:border-transparent outline-none"
          />

          <div className="max-h-[350px] overflow-y-auto space-y-2">
            {displayClubs.map((club) => {
              const selected = favoriteClubs.includes(club.id);
              return (
                <button
                  key={club.id}
                  onClick={() => toggleClub(club.id)}
                  disabled={!selected && favoriteClubs.length >= 5}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                    selected
                      ? "bg-forest-green/10 border-forest-green text-forest-green dark:text-green-400"
                      : favoriteClubs.length >= 5
                      ? "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-forest-green"
                  }`}
                >
                  <span className="font-medium text-sm">{club.name}</span>
                  <svg
                    className={`w-5 h-5 transition-colors ${selected ? "text-forest-green" : "text-gray-300 dark:text-gray-600"}`}
                    fill={selected ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(0)}
              className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 transition-colors"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Ligen */}
      {step === 2 && (
        <div>
          <h2 className="font-headline text-2xl text-off-black dark:text-white text-center mb-2">
            Wähle deine Ligen
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-6">
            {favoriteLeagues.length} ausgewählt
          </p>

          <div className="max-h-[400px] overflow-y-auto space-y-6">
            {[
              { label: "Herren", leagues: herrenLeagues },
              { label: "Frauen", leagues: frauenLeagues },
              { label: "Pokal", leagues: pokalLeagues },
            ].map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {group.label}
                </h3>
                <div className="space-y-1">
                  {group.leagues.map((league) => {
                    const selected = favoriteLeagues.includes(league.id);
                    return (
                      <button
                        key={league.id}
                        onClick={() => toggleLeague(league.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${
                          selected
                            ? "bg-forest-green/10 text-forest-green dark:text-green-400 font-medium"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <span>{league.name}</span>
                        {selected && (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Zurück
            </button>
            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex-1 py-3 bg-forest-green text-white font-semibold rounded-lg hover:bg-forest-green/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Wird gespeichert..." : "Fertig"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
