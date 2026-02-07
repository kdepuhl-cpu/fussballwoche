"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/lib/user/auth";
import { getReaderLevel } from "@/lib/api/profile";

export default function UserMenu() {
  const { user, profile, signOut } = useUser();
  const [open, setOpen] = useState(false);
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

  if (!user) return null;

  const initials = (profile?.display_name ?? user.email ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

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
        <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50">
          {/* Reader Score */}
          {profile && (
            <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{getReaderLevel(profile.reader_points ?? 0).name}</span>
                <span className="font-semibold text-forest-green tabular-nums">{profile.reader_points ?? 0} Pkt.</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-forest-green rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      ((profile.reader_points ?? 0) - getReaderLevel(profile.reader_points ?? 0).min) /
                      (getReaderLevel(profile.reader_points ?? 0).max - getReaderLevel(profile.reader_points ?? 0).min) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}
          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Mein Profil
          </Link>
          <Link
            href="/profil"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Meine Vereine
          </Link>
          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
          <button
            onClick={async () => {
              setOpen(false);
              await signOut();
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Abmelden
          </button>
        </div>
      )}
    </div>
  );
}
