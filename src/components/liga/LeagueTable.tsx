"use client";

import { useState, useEffect } from "react";
import { getStandings, type Standing } from "@/lib/api/standings";

// Placeholder wenn keine echten Daten vorhanden
const PLACEHOLDER_TABLE: Standing[] = [
  { pos: 1, team: "Hertha BSC II", teamId: null, sp: 18, s: 12, u: 4, n: 2, tore: "42:15", diff: "+27", pkt: 40 },
  { pos: 2, team: "BFC Dynamo", teamId: null, sp: 18, s: 11, u: 3, n: 4, tore: "38:20", diff: "+18", pkt: 36 },
  { pos: 3, team: "VSG Altglienicke", teamId: null, sp: 18, s: 10, u: 5, n: 3, tore: "35:18", diff: "+17", pkt: 35 },
  { pos: 4, team: "Tennis Borussia", teamId: null, sp: 18, s: 9, u: 4, n: 5, tore: "30:22", diff: "+8", pkt: 31 },
  { pos: 5, team: "Berliner AK 07", teamId: null, sp: 18, s: 8, u: 5, n: 5, tore: "28:24", diff: "+4", pkt: 29 },
  { pos: 6, team: "Viktoria 89", teamId: null, sp: 18, s: 7, u: 6, n: 5, tore: "26:23", diff: "+3", pkt: 27 },
  { pos: 7, team: "FC Viktoria 1889", teamId: null, sp: 18, s: 6, u: 6, n: 6, tore: "24:25", diff: "-1", pkt: 24 },
  { pos: 8, team: "SC Staaken", teamId: null, sp: 18, s: 5, u: 5, n: 8, tore: "20:28", diff: "-8", pkt: 20 },
];

interface LeagueTableProps {
  leagueId: string;
}

export default function LeagueTable({ leagueId }: LeagueTableProps) {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [isPlaceholder, setIsPlaceholder] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStandings(leagueId)
      .then((data) => {
        if (data.length > 0) {
          setStandings(data);
          setIsPlaceholder(false);
        } else {
          setStandings(PLACEHOLDER_TABLE);
          setIsPlaceholder(true);
        }
      })
      .catch(() => {
        setStandings(PLACEHOLDER_TABLE);
        setIsPlaceholder(true);
      })
      .finally(() => setLoading(false));
  }, [leagueId]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-headline text-xl text-off-black dark:text-white">Tabelle</h2>
        </div>
        <div className="p-6 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex gap-4">
              <div className="h-4 w-6 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 flex-1 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-8 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-headline text-xl text-off-black dark:text-white">Tabelle</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm tabular-nums">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr className="text-left text-gray-500 dark:text-gray-400">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Verein</th>
              <th className="px-4 py-3 font-medium text-center">Sp</th>
              <th className="px-4 py-3 font-medium text-center hidden sm:table-cell">S</th>
              <th className="px-4 py-3 font-medium text-center hidden sm:table-cell">U</th>
              <th className="px-4 py-3 font-medium text-center hidden sm:table-cell">N</th>
              <th className="px-4 py-3 font-medium text-center hidden md:table-cell">Tore</th>
              <th className="px-4 py-3 font-medium text-center">Diff</th>
              <th className="px-4 py-3 font-medium text-center">Pkt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {standings.map((row) => (
              <tr key={row.pos} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-4 py-3 font-medium text-off-black dark:text-white">{row.pos}</td>
                <td className="px-4 py-3 font-medium text-off-black dark:text-white">{row.team}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{row.sp}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 hidden sm:table-cell">{row.s}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 hidden sm:table-cell">{row.u}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 hidden sm:table-cell">{row.n}</td>
                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300 hidden md:table-cell">{row.tore}</td>
                <td className={`px-4 py-3 text-center font-medium ${
                  row.diff.startsWith("+") ? "text-green-600" : row.diff.startsWith("-") ? "text-red-500" : "text-gray-600"
                }`}>
                  {row.diff}
                </td>
                <td className="px-4 py-3 text-center font-bold text-off-black dark:text-white">{row.pkt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isPlaceholder
            ? "Platzhalter-Daten — echte Tabelle wird bald geladen"
            : `Stand: ${new Date().toLocaleDateString("de-DE")}`
          }
        </p>
      </div>
    </div>
  );
}
