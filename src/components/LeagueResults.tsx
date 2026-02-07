"use client";

import { useState } from "react";
import Link from "next/link";
import { Match, getMatchesByLeague, getCurrentMatchday } from "@/lib/mock/matches";
import VoteButtons from "@/components/tippspiel/VoteButtons";

interface LeagueResultsProps {
  leagueId: string;
  initialMatchday?: number;
}

// Team Logo Placeholder (farbiger Kreis mit Initialen)
function TeamLogo({ name, shortName, color, size = "sm" }: {
  name: string;
  shortName: string;
  color: string;
  size?: "sm" | "md";
}) {
  const initials = shortName.slice(0, 2).toUpperCase();
  const sizeClasses = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";

  return (
    <div
      className={`${sizeClasses} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}

// Status Badge
function MatchStatusBadge({ status, time }: {
  status: Match["status"];
  time: string;
}) {
  if (status === "upcoming") {
    return (
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {time}
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
      Beendet
    </span>
  );
}

// Single Match Row
function MatchRow({ match }: { match: Match }) {
  const isFinished = match.status === "finished";

  return (
    <>
    <Link
      href={`/spiel/${match.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
    >
      {/* Home Team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo
          name={match.homeTeam.name}
          shortName={match.homeTeam.shortName}
          color={match.homeTeam.color}
        />
        <span className={`text-sm truncate ${
          isFinished && match.homeScore !== null && match.awayScore !== null && match.homeScore > match.awayScore
            ? "font-bold text-off-black dark:text-white"
            : "font-medium text-gray-700 dark:text-gray-300"
        }`}>
          {match.homeTeam.shortName}
        </span>
      </div>

      {/* Score */}
      <div className="flex items-center gap-2 px-3">
        <span className="text-lg font-bold min-w-[24px] text-center text-off-black dark:text-white">
          {match.homeScore ?? "-"}
        </span>
        <span className="text-gray-400">:</span>
        <span className="text-lg font-bold min-w-[24px] text-center text-off-black dark:text-white">
          {match.awayScore ?? "-"}
        </span>
      </div>

      {/* Away Team */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={`text-sm truncate text-right ${
          isFinished && match.homeScore !== null && match.awayScore !== null && match.awayScore > match.homeScore
            ? "font-bold text-off-black dark:text-white"
            : "font-medium text-gray-700 dark:text-gray-300"
        }`}>
          {match.awayTeam.shortName}
        </span>
        <TeamLogo
          name={match.awayTeam.name}
          shortName={match.awayTeam.shortName}
          color={match.awayTeam.color}
        />
      </div>

      {/* Status */}
      <div className="w-16 text-right">
        <MatchStatusBadge
          status={match.status}
          time={match.time}
        />
      </div>
    </Link>
    {match.status === "upcoming" && (
      <div className="px-4 pb-3 -mt-1">
        <VoteButtons matchId={match.id} compact />
      </div>
    )}
    </>
  );
}

export default function LeagueResults({ leagueId, initialMatchday }: LeagueResultsProps) {
  const allMatches = getMatchesByLeague(leagueId);
  const maxMatchday = getCurrentMatchday(leagueId);
  const [matchday, setMatchday] = useState(initialMatchday || maxMatchday);

  // Filter matches for current matchday
  const matches = allMatches.filter((m) => m.matchday === matchday);

  // Group by date
  const matchesByDate = matches.reduce((acc, match) => {
    const date = match.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {} as Record<string, Match[]>);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short"
    };
    return date.toLocaleDateString("de-DE", options);
  };

  if (allMatches.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="font-headline text-xl text-off-black dark:text-white">Spieltag</h2>
        </div>
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>Keine Spiele verfügbar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with Matchday Navigation */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <button
          onClick={() => setMatchday((m) => Math.max(1, m - 1))}
          disabled={matchday <= 1}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Vorheriger Spieltag"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-headline text-lg text-off-black dark:text-white">
            Spieltag {matchday}
          </h2>
        </div>

        <button
          onClick={() => setMatchday((m) => Math.min(maxMatchday, m + 1))}
          disabled={matchday >= maxMatchday}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Nächster Spieltag"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Matches */}
      {matches.length === 0 ? (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <p>Keine Spiele an diesem Spieltag</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {Object.entries(matchesByDate).map(([date, dateMatches]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {formatDate(date)}
                </span>
              </div>

              {/* Matches for this date */}
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {dateMatches.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
