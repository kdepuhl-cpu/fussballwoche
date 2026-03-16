import { supabase, isSupabaseConfigured } from "../supabase";
import { BERLIN_TEAMS } from "../mock/matches";
import { vereine as mockVereine } from "../mock/clubs";
import type { Verein, VereinProfil, Sportstaette, Ansprechpartner, Trainingszeit } from "../types";

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
  description: string | null;
  members: number | null;
  teams_count: number | null;
  profile: Record<string, unknown> | null;
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

function clubRowToVereinProfil(row: ClubRow): VereinProfil {
  const profile = (row.profile ?? {}) as Record<string, unknown>;

  return {
    id: row.id,
    name: row.name,
    kurzname: row.short_name,
    slug: row.slug,
    ligaId: row.league_id ?? "",
    logo: row.logo_url ?? undefined,
    wappen: row.logo_url ?? undefined,
    farben:
      row.primary_color
        ? {
            primary: row.primary_color,
            secondary: row.secondary_color ?? row.primary_color,
          }
        : undefined,
    beschreibung: row.description ?? "",
    bezirk: row.bezirk ?? "",
    gruendungsjahr: row.founded_year ?? 0,
    mitglieder: row.members ?? undefined,
    mannschaften: row.teams_count ?? undefined,
    sportstaette: (profile.sportstaette as Sportstaette) ?? {
      name: "",
      adresse: "",
      plz: "",
      bezirk: row.bezirk ?? "",
    },
    kontakt: (profile.kontakt as { telefon?: string; email?: string; website?: string }) ?? {},
    socialMedia: (profile.socialMedia as { instagram?: string; facebook?: string }) ?? undefined,
    ansprechpartner: (profile.ansprechpartner as Ansprechpartner[]) ?? [],
    trainingszeiten: (profile.trainingszeiten as Trainingszeit[]) ?? [],
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

// ============================================
// Public API
// ============================================

export async function getClubs(): Promise<Verein[]> {
  if (!isSupabaseConfigured()) return mockClubs();

  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("name");

  if (error || !data || data.length === 0) return mockClubs();

  return (data as ClubRow[]).map(clubRowToVerein);
}

export async function getClubBySlug(slug: string): Promise<VereinProfil | undefined> {
  // Try mock first (has full profile data)
  const mockClub = mockVereine.find((v) => v.slug === slug);

  if (!isSupabaseConfigured()) return mockClub;

  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return mockClub;

  const row = data as ClubRow;
  // If DB has profile data, use it; otherwise fallback to mock
  if (row.description || (row.profile && Object.keys(row.profile).length > 0)) {
    return clubRowToVereinProfil(row);
  }
  return mockClub;
}

export async function getClubSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) {
    return mockVereine.map((v) => v.slug);
  }

  const { data, error } = await supabase
    .from("clubs")
    .select("slug");

  if (error || !data || data.length === 0) {
    return mockVereine.map((v) => v.slug);
  }

  const dbSlugs = data.map((d: { slug: string }) => d.slug);
  const mockSlugs = mockVereine.map((v) => v.slug);
  return Array.from(new Set([...dbSlugs, ...mockSlugs]));
}
