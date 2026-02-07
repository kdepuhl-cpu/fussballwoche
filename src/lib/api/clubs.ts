import { supabase, isSupabaseConfigured } from "../supabase";
import { BERLIN_TEAMS } from "../mock/matches";
import type { Verein } from "../types";

interface ClubRow {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  logo_url: string | null;
  league_id: string | null;
  bezirk: string | null;
  founded_year: number | null;
  primary_color: string | null;
  secondary_color: string | null;
}

function clubRowToVerein(row: ClubRow): Verein {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    ligaId: row.league_id ?? "",
    logo: row.logo_url ?? undefined,
    farben:
      row.primary_color
        ? {
            primary: row.primary_color,
            secondary: row.secondary_color ?? row.primary_color,
          }
        : undefined,
  };
}

// Fallback: convert BERLIN_TEAMS to Verein[]
function mockClubs(): Verein[] {
  return BERLIN_TEAMS.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.id,
    ligaId: "berlin-liga",
    farben: { primary: t.color, secondary: t.color },
  }));
}

export async function getClubs(): Promise<Verein[]> {
  if (!isSupabaseConfigured()) return mockClubs();

  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("name");

  if (error || !data || data.length === 0) return mockClubs();

  return (data as ClubRow[]).map(clubRowToVerein);
}
