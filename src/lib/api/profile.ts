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
  role: "user" | "redakteur" | "admin";
  onboarding_completed: boolean;
  reader_points: number;
  articles_read: string[];
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

// === Reader Score ===

export async function recordArticleRead(articleSlug: string): Promise<number> {
  const { data, error } = await supabase.rpc("record_article_read", {
    p_article_slug: articleSlug,
  });

  if (error) return 0;
  return data as number;
}

export function getReaderLevel(points: number): { name: string; min: number; max: number } {
  if (points >= 1000) return { name: "Berlin-Liga-Leser", min: 1000, max: 2000 };
  if (points >= 500) return { name: "Landesliga-Leser", min: 500, max: 1000 };
  if (points >= 100) return { name: "Bezirksliga-Leser", min: 100, max: 500 };
  return { name: "Kreisliga-Leser", min: 0, max: 100 };
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
