"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/auth";
import { getReaderLevel } from "@/lib/api/profile";
import { getUserStats } from "@/lib/api/votes";

export default function UserMenu() {
  const { user, profile, signOut, refreshProfile } = useUser();
  const [open, setOpen] = useState(false);
  const [voteStats, setVoteStats] = useState({ total_votes: 0, correct_votes: 0, accuracy_pct: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Refresh all data when menu opens
  useEffect(() => {
    if (open && user) {
      refreshProfile();
      getUserStats(user.id).then(setVoteStats);
    }
  }, [open, user, refreshProfile]);

  if (!user) return null;

  const displayName = profile?.display_name ?? "Anonym";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const readerPoints = profile?.reader_points ?? 0;
  const readerLevel = getReaderLevel(readerPoints);
  const levelProgress = Math.min(
    ((readerPoints - readerLevel.min) / (readerLevel.max - readerLevel.min)) * 100,
    100
  );
  const articlesRead = profile?.articles_read?.length ?? 0;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-full bg-forest-green flex items-center justify-center text-white text-xs font-bold hover:bg-forest-green/90 transition-colors"
        aria-label="User Menu"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 overflow-hidden">

          {/* Profile Header */}
          <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-forest-green flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-off-black dark:text-white truncate">
                  {displayName}
                </p>
                {profile?.bezirk && (
                  <span className="text-[10px] text-forest-green font-medium">
                    {profile.bezirk}
                  </span>
                )}
              </div>
            </div>

            {/* Reader Level */}
            {profile && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-off-black dark:text-white">{readerLevel.name}</span>
                  <span className="font-bold text-electric-orange tabular-nums">{readerPoints} Pkt.</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-forest-green to-electric-orange rounded-full transition-all duration-500"
                    style={{ width: `${levelProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {profile && (
            <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 px-3 py-2.5 text-center">
                <p className="text-sm font-bold text-off-black dark:text-white tabular-nums">{articlesRead}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Gelesen</p>
              </div>
              <div className="bg-white dark:bg-gray-800 px-3 py-2.5 text-center">
                <p className="text-sm font-bold text-off-black dark:text-white tabular-nums">{voteStats.total_votes}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Tipps</p>
              </div>
              <div className="bg-white dark:bg-gray-800 px-3 py-2.5 text-center">
                <p className="text-sm font-bold text-off-black dark:text-white tabular-nums">
                  {voteStats.total_votes > 0 ? `${voteStats.accuracy_pct}%` : "—"}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500">Quote</p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="py-1">
            <Link
              href="/profil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Mein Profil
            </Link>
            <Link
              href="/gespeichert"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Gespeichert
            </Link>
            <Link
              href="/tippspiel"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
              </svg>
              Tippspiel
            </Link>
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 dark:border-gray-700 py-1">
            <button
              onClick={async () => {
                setOpen(false);
                await signOut();
              }}
              className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Abmelden
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
