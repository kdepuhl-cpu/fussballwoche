"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export type UserRole = "user" | "redakteur" | "admin";

interface AdminAuthState {
  user: User | null;
  role: UserRole;
  isAdmin: boolean;
  isRedakteur: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthState | null>(null);

async function fetchRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("[fetchRole] error:", error.message, "code:", error.code, "userId:", userId);
    return "user";
  }
  if (!data?.role) {
    console.error("[fetchRole] no role in data:", data, "userId:", userId);
    return "user";
  }
  console.log("[fetchRole] role:", data.role, "userId:", userId);
  return data.role as UserRole;
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async (authUser: User | null) => {
    setUser(authUser);
    if (authUser) {
      const r = await fetchRole(authUser.id);
      setRole(r);
    } else {
      setRole("user");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [loadUser]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<{ error?: string }> => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) return { error: error.message };

      const userRole = await fetchRole(data.user.id);

      if (userRole === "user") {
        // Debug: direct check to find the issue
        const debugCheck = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();
        await supabase.auth.signOut();
        return {
          error: `Kein Zugang. Debug: uid=${data.user.id.slice(0,8)}, role=${debugCheck.data?.role ?? "null"}, err=${debugCheck.error?.message ?? "none"}`,
        };
      }

      setRole(userRole);
      return {};
    },
    []
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole("user");
  }, []);

  const isAdmin = role === "admin";
  const isRedakteur = role === "admin" || role === "redakteur";

  return (
    <AdminAuthContext.Provider
      value={{ user, role, isAdmin, isRedakteur, loading, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthState {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return ctx;
}
