"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useUser } from "@/lib/user/auth";
import {
  getUserBookmarks,
  addBookmark,
  removeBookmark,
  syncLocalBookmarks,
} from "@/lib/api/profile";

const STORAGE_KEY = "diago-bookmarks";

function getLocalBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function setLocalBookmarks(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

export function useBookmarks() {
  const { user } = useUser();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const syncedRef = useRef(false);

  // Load bookmarks on mount / auth change
  useEffect(() => {
    if (user) {
      // Logged in: load from Supabase
      getUserBookmarks(user.id).then((slugs) => {
        setBookmarks(slugs);
      });

      // Sync localStorage bookmarks on first login
      if (!syncedRef.current) {
        syncedRef.current = true;
        const local = getLocalBookmarks();
        if (local.length > 0) {
          syncLocalBookmarks(user.id, local).then(() => {
            localStorage.removeItem(STORAGE_KEY);
            // Reload to include synced bookmarks
            getUserBookmarks(user.id).then(setBookmarks);
          });
        }
      }
    } else {
      // Not logged in: use localStorage
      syncedRef.current = false;
      setBookmarks(getLocalBookmarks());
    }
  }, [user]);

  const toggleBookmark = useCallback(
    async (slug: string) => {
      const isCurrentlyBookmarked = bookmarks.includes(slug);

      // Optimistic update
      const updated = isCurrentlyBookmarked
        ? bookmarks.filter((s) => s !== slug)
        : [...bookmarks, slug];
      setBookmarks(updated);

      if (user) {
        // Persist to Supabase
        if (isCurrentlyBookmarked) {
          await removeBookmark(user.id, slug);
        } else {
          await addBookmark(user.id, slug);
        }
      } else {
        // Persist to localStorage
        setLocalBookmarks(updated);
      }
    },
    [bookmarks, user]
  );

  const isBookmarked = useCallback(
    (slug: string) => bookmarks.includes(slug),
    [bookmarks]
  );

  return { bookmarks, toggleBookmark, isBookmarked };
}
