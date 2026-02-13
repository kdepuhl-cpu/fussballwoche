"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { getProfile, recordArticleRead, type UserProfile } from "@/lib/api/profile";
import type { User } from "@supabase/supabase-js";

interface UserContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId: string) => {
    const p = await getProfile(userId);
    setProfile(p);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id);
    }
  }, [user, loadProfile]);

  // One-time sync: push localStorage reads to Supabase
  const synced = useRef(false);
  useEffect(() => {
    if (!user || !profile || synced.current) return;
    synced.current = true;

    const supabaseSlugs = new Set(profile.articles_read ?? []);

    // Collect slugs from localStorage (diago-read-articles)
    let localSlugs: string[] = [];
    try {
      const stored = localStorage.getItem("diago-read-articles");
      if (stored) localSlugs = JSON.parse(stored);
    } catch { /* ignore */ }

    // Collect article IDs from gamification localStorage, map to slugs
    try {
      const gamification = localStorage.getItem("diago_user_progress");
      if (gamification) {
        const { readArticles = [] } = JSON.parse(gamification);
        // These are article IDs - we import artikel data dynamically to map them
        import("@/lib/data").then(({ artikel }) => {
          for (const id of readArticles) {
            const art = artikel.find((a: { id: string; slug: string }) => a.id === id);
            if (art && !supabaseSlugs.has(art.slug) && !localSlugs.includes(art.slug)) {
              localSlugs.push(art.slug);
            }
          }
          syncMissing(localSlugs, supabaseSlugs);
        });
        return; // async path handles it
      }
    } catch { /* ignore */ }

    syncMissing(localSlugs, supabaseSlugs);

    async function syncMissing(slugs: string[], existing: Set<string>) {
      const missing = slugs.filter((s) => !existing.has(s));
      if (missing.length === 0) return;
      for (const slug of missing) {
        await recordArticleRead(slug);
      }
      await loadProfile(user!.id);
    }
  }, [user, profile, loadProfile]);

  return (
    <UserContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
}
