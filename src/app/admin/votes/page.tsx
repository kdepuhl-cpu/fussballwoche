"use client";

import { useState, useEffect } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import Sidebar from "@/components/admin/Sidebar";
import { ALL_MATCHES, type Match } from "@/lib/mock/matches";
import { setMatchResult, getAllResults } from "@/lib/api/votes";

const VOTE_OPTIONS = ["1", "X", "2"] as const;

function ResultControl({ match, currentResult, onSave }: {
  match: Match;
  currentResult: string | null;
  onSave: (matchId: string, result: string) => void;
}) {
  const [saving, setSaving] = useState(false);

  const handleClick = async (result: string) => {
    setSaving(true);
    const success = await setMatchResult(match.id, result);
    if (success) {
      onSave(match.id, result);
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-4 py-3 px-4 border-b border-gray-100 last:border-0">
      {/* Teams */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
            style={{ backgroundColor: match.homeTeam.color }}
          >
            {match.homeTeam.shortName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-900 truncate">
            {match.homeTeam.shortName}
          </span>
          <span className="text-xs text-gray-400 mx-1">vs</span>
          <span className="text-sm font-medium text-gray-900 truncate">
            {match.awayTeam.shortName}
          </span>
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
            style={{ backgroundColor: match.awayTeam.color }}
          >
            {match.awayTeam.shortName.slice(0, 2).toUpperCase()}
          </div>
        </div>
        {match.status === "finished" && match.homeScore !== null && match.awayScore !== null && (
          <p className="text-xs text-gray-400 mt-0.5 ml-8">
            Ergebnis: {match.homeScore}:{match.awayScore}
          </p>
        )}
      </div>

      {/* Status Badge */}
      <span className={`text-xs px-2 py-0.5 rounded ${
        match.status === "live"
          ? "bg-red-100 text-red-600"
          : match.status === "finished"
          ? "bg-gray-100 text-gray-500"
          : "bg-green-100 text-green-600"
      }`}>
        {match.status === "live" ? "Live" : match.status === "finished" ? "Beendet" : match.time}
      </span>

      {/* Result Buttons */}
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {VOTE_OPTIONS.map((option, i) => {
          const isSelected = currentResult === option;
          return (
            <button
              key={option}
              onClick={() => handleClick(option)}
              disabled={saving}
              className={`min-w-[40px] py-1.5 text-sm font-bold transition-colors ${
                isSelected
                  ? "bg-forest-green text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              } ${i < 2 ? "border-r border-gray-200" : ""} disabled:opacity-50`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AdminVotesPage() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllResults()
      .then(setResults)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (matchId: string, result: string) => {
    setResults((prev) => ({ ...prev, [matchId]: result }));
  };

  // Sortieren: Beendete Spiele ohne Ergebnis zuerst, dann live, dann upcoming, dann bereits eingetragen
  const sortedMatches = [...ALL_MATCHES].sort((a, b) => {
    const aHasResult = !!results[a.id];
    const bHasResult = !!results[b.id];
    const aIsFinished = a.status === "finished";
    const bIsFinished = b.status === "finished";

    // Beendete ohne Ergebnis ganz oben
    if (aIsFinished && !aHasResult && !(bIsFinished && !bHasResult)) return -1;
    if (bIsFinished && !bHasResult && !(aIsFinished && !aHasResult)) return 1;

    // Dann nach Status
    const order = { live: 0, upcoming: 1, finished: 2 };
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status];

    // Bereits eingetragene nach unten
    if (aHasResult && !bHasResult) return 1;
    if (!aHasResult && bHasResult) return -1;

    return 0;
  });

  const finishedWithoutResult = ALL_MATCHES.filter(
    (m) => m.status === "finished" && !results[m.id]
  ).length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tippspiel — Ergebnisse</h1>
                {finishedWithoutResult > 0 && (
                  <p className="text-sm text-electric-orange mt-1">
                    {finishedWithoutResult} beendete Spiele ohne Ergebnis
                  </p>
                )}
              </div>
            </div>

            {loading ? (
              <div className="text-gray-400 text-sm">Lade Ergebnisse...</div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {sortedMatches.map((match) => (
                  <ResultControl
                    key={match.id}
                    match={match}
                    currentResult={results[match.id] ?? null}
                    onSave={handleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
