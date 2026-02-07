import { supabase, isSupabaseConfigured } from "../supabase";
import {
  ALL_LEAGUES as mockLeagues,
  getLeagueBySlug as mockGetBySlug,
} from "../leagues";
import type { League } from "../leagues";
import type { LeagueRow } from "./types";
import { leagueRowToLeague } from "./types";

export async function getLeagues(): Promise<League[]> {
  if (!isSupabaseConfigured()) return mockLeagues;

  // Fetch parent leagues (no parent_id)
  const { data: parents, error: parentError } = await supabase
    .from("leagues")
    .select("*")
    .is("parent_id", null)
    .order("tier", { ascending: true });

  if (parentError || !parents || parents.length === 0) return mockLeagues;

  // Fetch all staffeln (have parent_id)
  const { data: staffeln } = await supabase
    .from("leagues")
    .select("*")
    .not("parent_id", "is", null);

  const staffelMap = new Map<string, LeagueRow[]>();
  if (staffeln) {
    for (const s of staffeln as LeagueRow[]) {
      if (s.parent_id) {
        const existing = staffelMap.get(s.parent_id) ?? [];
        existing.push(s);
        staffelMap.set(s.parent_id, existing);
      }
    }
  }

  return (parents as LeagueRow[]).map((row) =>
    leagueRowToLeague(row, staffelMap.get(row.id))
  );
}

export async function getLeagueBySlug(
  slug: string
): Promise<League | undefined> {
  if (!isSupabaseConfigured()) return mockGetBySlug(slug);

  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return mockGetBySlug(slug);

  const row = data as LeagueRow;

  // If this is a parent league, fetch its staffeln
  const { data: staffeln } = await supabase
    .from("leagues")
    .select("*")
    .eq("parent_id", row.id);

  return leagueRowToLeague(
    row,
    (staffeln as LeagueRow[] | null) ?? undefined
  );
}
