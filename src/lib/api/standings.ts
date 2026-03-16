import { supabase, isSupabaseConfigured } from "../supabase";

// ============================================
// Standings (Tabelle) aus Supabase
// ============================================

export interface StandingRow {
  id: string;
  league_id: string;
  season: string;
  matchday: number | null;
  position: number;
  team_name: string;
  team_id: string | null;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
  updated_at: string;
}

export interface Standing {
  pos: number;
  team: string;
  teamId: string | null;
  sp: number;
  s: number;
  u: number;
  n: number;
  tore: string;
  diff: string;
  pkt: number;
}

function standingRowToStanding(row: StandingRow): Standing {
  const diff = row.goal_diff;
  return {
    pos: row.position,
    team: row.team_name,
    teamId: row.team_id,
    sp: row.played,
    s: row.wins,
    u: row.draws,
    n: row.losses,
    tore: `${row.goals_for}:${row.goals_against}`,
    diff: diff > 0 ? `+${diff}` : `${diff}`,
    pkt: row.points,
  };
}

export async function getStandings(leagueId: string, season: string = "2526"): Promise<Standing[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("standings")
    .select("*")
    .eq("league_id", leagueId)
    .eq("season", season)
    .order("position", { ascending: true });

  if (error || !data || data.length === 0) return [];

  return (data as StandingRow[]).map(standingRowToStanding);
}

// ============================================
// Matches (Spiele) aus Supabase
// ============================================

export interface MatchRow {
  id: string;
  league_id: string;
  season: string;
  matchday: number | null;
  match_date: string | null;
  home_team: string;
  away_team: string;
  home_score: number | null;
  away_score: number | null;
  status: string;
  fussball_de_url: string | null;
  updated_at: string;
}

export interface LeagueMatch {
  id: string;
  matchday: number | null;
  date: string | null;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "scheduled" | "live" | "finished" | "cancelled";
  fussballDeUrl: string | null;
}

function matchRowToLeagueMatch(row: MatchRow): LeagueMatch {
  return {
    id: row.id,
    matchday: row.matchday,
    date: row.match_date,
    homeTeam: row.home_team,
    awayTeam: row.away_team,
    homeScore: row.home_score,
    awayScore: row.away_score,
    status: row.status as LeagueMatch["status"],
    fussballDeUrl: row.fussball_de_url,
  };
}

export async function getMatches(
  leagueId: string,
  season: string = "2526",
  options?: { matchday?: number; status?: string; limit?: number }
): Promise<LeagueMatch[]> {
  if (!isSupabaseConfigured()) return [];

  let query = supabase
    .from("matches")
    .select("*")
    .eq("league_id", leagueId)
    .eq("season", season);

  if (options?.matchday) {
    query = query.eq("matchday", options.matchday);
  }
  if (options?.status) {
    query = query.eq("status", options.status);
  }

  query = query.order("match_date", { ascending: true });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error || !data) return [];

  return (data as MatchRow[]).map(matchRowToLeagueMatch);
}

export async function getUpcomingMatches(
  leagueId: string,
  limit: number = 10
): Promise<LeagueMatch[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("league_id", leagueId)
    .eq("status", "scheduled")
    .gte("match_date", new Date().toISOString())
    .order("match_date", { ascending: true })
    .limit(limit);

  if (error || !data) return [];

  return (data as MatchRow[]).map(matchRowToLeagueMatch);
}

export async function getRecentResults(
  leagueId: string,
  limit: number = 10
): Promise<LeagueMatch[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase
    .from("matches")
    .select("*")
    .eq("league_id", leagueId)
    .eq("status", "finished")
    .order("match_date", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as MatchRow[]).map(matchRowToLeagueMatch);
}
