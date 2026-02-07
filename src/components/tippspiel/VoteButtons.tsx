"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/auth";
import { submitVote, getUserVote, getVoteStats, type VoteStats } from "@/lib/api/votes";

interface VoteButtonsProps {
  matchId: string;
  compact?: boolean;
}

const VOTE_OPTIONS = ["1", "X", "2"] as const;

const VOTE_LABELS: Record<string, string> = {
  "1": "Heimsieg",
  "X": "Unentschieden",
  "2": "Auswärtssieg",
};

function getDisplayStats(stats: VoteStats[], totalVotes: number): Record<string, number> {
  // Bei <3 Votes: realistische Defaults
  if (totalVotes < 3) {
    return { "1": 45, "X": 25, "2": 30 };
  }

  const raw: Record<string, number> = { "1": 0, "X": 0, "2": 0 };
  for (const s of stats) {
    raw[s.vote] = s.percentage;
  }

  // Minimum 15% pro Option
  const MIN = 15;
  const entries = Object.entries(raw);
  const belowMin = entries.filter(([, v]) => v > 0 && v < MIN);

  if (belowMin.length === 0) return raw;

  const result = { ...raw };
  let deficit = 0;
  for (const [key, val] of belowMin) {
    if (val > 0) {
      deficit += MIN - val;
      result[key] = MIN;
    }
  }

  // Deficit proportional von den anderen abziehen
  const aboveMin = entries.filter(([, v]) => v >= MIN);
  const aboveTotal = aboveMin.reduce((sum, [, v]) => sum + v, 0);
  for (const [key, val] of aboveMin) {
    if (aboveTotal > 0) {
      result[key] = Math.round(val - (deficit * val / aboveTotal));
    }
  }

  return result;
}

export default function VoteButtons({ matchId, compact = false }: VoteButtonsProps) {
  const { user } = useUser();
  const [userVote, setUserVote] = useState<string | null>(null);
  const [stats, setStats] = useState<VoteStats[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLoginHint, setShowLoginHint] = useState(false);

  const loadData = useCallback(async () => {
    const [vote, voteStats] = await Promise.all([
      getUserVote(matchId),
      getVoteStats(matchId),
    ]);
    setUserVote(vote);
    setStats(voteStats);
    setTotalVotes(voteStats.reduce((sum, s) => sum + s.count, 0));
  }, [matchId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleVote = async (e: React.MouseEvent, vote: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowLoginHint(true);
      return;
    }

    if (userVote) return; // Bereits getippt

    setLoading(true);
    const success = await submitVote(matchId, vote);
    if (success) {
      setUserVote(vote);
      // Stats neu laden
      const newStats = await getVoteStats(matchId);
      setStats(newStats);
      setTotalVotes(newStats.reduce((sum, s) => sum + s.count, 0));
    }
    setLoading(false);
  };

  const hasVoted = userVote !== null;
  const displayStats = hasVoted ? getDisplayStats(stats, totalVotes) : null;

  // Finde die meistgetippte Option für den Hinweistext
  const topVote = hasVoted && displayStats
    ? Object.entries(displayStats).sort(([, a], [, b]) => b - a)[0]
    : null;

  const sizeClasses = compact
    ? "min-h-[36px] px-3 text-xs"
    : "min-h-[44px] px-4 text-sm";

  return (
    <div
      className="w-full"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      {/* Segmented Pill */}
      <div className="flex rounded-lg border border-gray-300 dark:border-gray-500 overflow-hidden">
        {VOTE_OPTIONS.map((option, i) => {
          const isSelected = userVote === option;
          const isNotSelected = hasVoted && !isSelected;

          let segmentClasses = "";
          if (isSelected) {
            segmentClasses = "bg-forest-green text-white";
          } else if (isNotSelected) {
            segmentClasses = "bg-gray-50 dark:bg-gray-700/50 text-gray-400 dark:text-gray-500";
          } else {
            segmentClasses = "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600";
          }

          return (
            <button
              key={option}
              onClick={(e) => handleVote(e, option)}
              disabled={loading || hasVoted}
              className={`flex-1 ${sizeClasses} font-bold transition-colors ${segmentClasses} ${
                i < 2 ? "border-r border-gray-300 dark:border-gray-500" : ""
              } disabled:cursor-default`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span>{option}</span>
                {hasVoted && displayStats && (
                  <span className={`text-[10px] font-normal tabular-nums ${
                    isSelected ? "text-white/80" : "text-gray-400 dark:text-gray-400"
                  }`}>
                    {displayStats[option]}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Hinweistext nach Vote */}
      {hasVoted && topVote && (
        <p className={`mt-1 text-gray-500 dark:text-gray-300 ${compact ? "text-[10px]" : "text-xs"}`}>
          {topVote[1]}% tippen auf {VOTE_LABELS[topVote[0]]}
        </p>
      )}

      {/* Login-Hinweis */}
      {showLoginHint && !user && (
        <p className={`mt-1 ${compact ? "text-[10px]" : "text-xs"} text-gray-500 dark:text-gray-400`}>
          <Link href="/login" className="text-forest-green hover:underline" onClick={(e) => e.stopPropagation()}>
            Melde dich an
          </Link>
          , um zu tippen
        </p>
      )}
    </div>
  );
}
