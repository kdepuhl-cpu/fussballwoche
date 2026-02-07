import { supabase } from "@/lib/supabase";

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  favorite_club_ids: string[];
  favorite_league_ids: string[];
  bezirk: string | null;
  points: number;
  level: string;
  onboarding_completed: boolean;
}

// === Profile CRUD ===

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<UserProfile, "display_name" | "bezirk" | "favorite_club_ids" | "favorite_league_ids" | "onboarding_completed">>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) return null;
  return data as UserProfile;
}

// === Bookmarks CRUD ===

export async function getUserBookmarks(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("article_slug")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map((b) => b.article_slug);
}

export async function addBookmark(userId: string, slug: string): Promise<boolean> {
  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, article_slug: slug });

  return !error;
}

export async function removeBookmark(userId: string, slug: string): Promise<boolean> {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("article_slug", slug);

  return !error;
}

export async function syncLocalBookmarks(userId: string, localSlugs: string[]): Promise<void> {
  if (localSlugs.length === 0) return;

  const existing = await getUserBookmarks(userId);
  const toAdd = localSlugs.filter((s) => !existing.includes(s));

  if (toAdd.length === 0) return;

  await supabase
    .from("bookmarks")
    .insert(toAdd.map((slug) => ({ user_id: userId, article_slug: slug })));
}
