import { supabase } from "@/lib/supabase";

// === Types ===

export interface VoteStats {
  vote: string;
  count: number;
  percentage: number;
}

export interface ScoreboardEntry {
  user_id: string;
  display_name: string;
  total_votes: number;
  correct_votes: number;
  accuracy_pct: number;
}

// === Voting ===

export async function submitVote(matchId: string, vote: string): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("match_votes")
    .upsert(
      { user_id: user.id, match_id: matchId, vote },
      { onConflict: "user_id,match_id" }
    );

  return !error;
}

export async function getUserVote(matchId: string): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("match_votes")
    .select("vote")
    .eq("user_id", user.id)
    .eq("match_id", matchId)
    .single();

  if (error || !data) return null;
  return data.vote;
}

export async function getUserVotesBatch(matchIds: string[]): Promise<Record<string, string>> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || matchIds.length === 0) return {};

  const { data, error } = await supabase
    .from("match_votes")
    .select("match_id, vote")
    .eq("user_id", user.id)
    .in("match_id", matchIds);

  if (error || !data) return {};
  return Object.fromEntries(data.map((v) => [v.match_id, v.vote]));
}

// === Stats ===

export async function getVoteStats(matchId: string): Promise<VoteStats[]> {
  const { data, error } = await supabase.rpc("get_vote_stats", { p_match_id: matchId });

  if (error || !data) return [];
  return data as VoteStats[];
}

export async function getVoteStatsBatch(matchIds: string[]): Promise<Record<string, VoteStats[]>> {
  if (matchIds.length === 0) return {};

  const results = await Promise.all(
    matchIds.map(async (id) => ({ id, stats: await getVoteStats(id) }))
  );

  return Object.fromEntries(results.map((r) => [r.id, r.stats]));
}

// === Results ===

export async function getMatchResult(matchId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("match_results")
    .select("result")
    .eq("match_id", matchId)
    .single();

  if (error || !data) return null;
  return data.result;
}

export async function getAllResults(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("match_results")
    .select("match_id, result");

  if (error || !data) return {};
  return Object.fromEntries(data.map((r) => [r.match_id, r.result]));
}

// === Admin ===

export async function setMatchResult(matchId: string, result: string): Promise<boolean> {
  const { error } = await supabase
    .from("match_results")
    .upsert(
      { match_id: matchId, result },
      { onConflict: "match_id" }
    );

  return !error;
}

// === Scoreboard ===

export async function getScoreboard(): Promise<ScoreboardEntry[]> {
  // Join votes with results to calculate accuracy
  const [votesRes, resultsRes, profilesRes] = await Promise.all([
    supabase.from("match_votes").select("user_id, match_id, vote"),
    supabase.from("match_results").select("match_id, result"),
    supabase.from("profiles").select("id, display_name"),
  ]);

  if (votesRes.error || resultsRes.error || profilesRes.error) return [];

  const votes = votesRes.data ?? [];
  const results = resultsRes.data ?? [];
  const profiles = profilesRes.data ?? [];

  const resultMap = Object.fromEntries(results.map((r) => [r.match_id, r.result]));
  const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p.display_name ?? "Anonym"]));

  // Group votes by user
  const userStats: Record<string, { total: number; correct: number }> = {};
  for (const v of votes) {
    if (!userStats[v.user_id]) {
      userStats[v.user_id] = { total: 0, correct: 0 };
    }
    userStats[v.user_id].total++;
    if (resultMap[v.match_id] && resultMap[v.match_id] === v.vote) {
      userStats[v.user_id].correct++;
    }
  }

  const scoreboard: ScoreboardEntry[] = Object.entries(userStats).map(([userId, stats]) => ({
    user_id: userId,
    display_name: profileMap[userId] ?? "Anonym",
    total_votes: stats.total,
    correct_votes: stats.correct,
    accuracy_pct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  // Sort by accuracy DESC, then total_votes DESC
  scoreboard.sort((a, b) => b.accuracy_pct - a.accuracy_pct || b.total_votes - a.total_votes);

  return scoreboard;
}
