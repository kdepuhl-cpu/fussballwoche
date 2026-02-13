"use client";

import { useState, useEffect } from "react";
import Header from "@/components/navigation/Header";
import Footer from "@/components/navigation/Footer";
import { useUser } from "@/lib/user/auth";
import { getScoreboard, type ScoreboardEntry } from "@/lib/api/votes";

export default function TippspielPage() {
  const { user } = useUser();
  const [scoreboard, setScoreboard] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScoreboard()
      .then(setScoreboard)
      .finally(() => setLoading(false));
  }, []);

  const myEntry = user ? scoreboard.find((e) => e.user_id === user.id) : null;
  const myRank = myEntry ? scoreboard.indexOf(myEntry) + 1 : null;

  return (
    <div className="min-h-screen bg-off-white dark:bg-gray-900">
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-headline text-off-black dark:text-white mb-6">
          Tippspiel
        </h1>

        {/* Eigene Stats Card */}
        {myEntry && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-off-black dark:text-white">Deine Stats</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Platz {myRank}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-off-black dark:text-white tabular-nums">
                  {myEntry.total_votes}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tipps</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-forest-green tabular-nums">
                  {myEntry.correct_votes}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Treffer</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-electric-orange tabular-nums">
                  {myEntry.accuracy_pct}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Quote</p>
              </div>
            </div>
          </div>
        )}

        {/* Rangliste */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-headline text-lg text-off-black dark:text-white">Rangliste</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Lade Rangliste...
            </div>
          ) : scoreboard.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p>Noch keine Tipps abgegeben.</p>
              <p className="text-sm mt-1">Tippe bei den Spielen, um auf der Rangliste zu erscheinen!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left px-4 py-3 w-12">#</th>
                    <th className="text-left px-4 py-3">Name</th>
                    <th className="text-center px-4 py-3 w-20">Tipps</th>
                    <th className="text-center px-4 py-3 w-20">Treffer</th>
                    <th className="text-right px-4 py-3 w-20">Quote</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {scoreboard.map((entry, i) => {
                    const isMe = user && entry.user_id === user.id;
                    return (
                      <tr
                        key={entry.user_id}
                        className={isMe ? "bg-forest-green/10" : ""}
                      >
                        <td className="px-4 py-3 text-sm font-bold text-gray-400 dark:text-gray-500 tabular-nums">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-off-black dark:text-white">
                              {entry.display_name}
                            </span>
                            {isMe && (
                              <span className="text-xs text-forest-green font-normal">(Du)</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {entry.reader_level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300 tabular-nums">
                          {entry.total_votes}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-gray-600 dark:text-gray-300 tabular-nums">
                          {entry.correct_votes}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-off-black dark:text-white tabular-nums">
                          {entry.accuracy_pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
