import { supabase } from "../supabase";
import type { ArticleRow, JobRow } from "./types";

// ============================================
// Admin Stats
// ============================================

export interface AdminStats {
  articles: number;
  jobs: number;
  clubs: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const [articles, jobs, clubs] = await Promise.all([
    supabase.from("articles").select("id", { count: "exact", head: true }),
    supabase.from("jobs").select("id", { count: "exact", head: true }),
    supabase.from("clubs").select("id", { count: "exact", head: true }),
  ]);

  return {
    articles: articles.count ?? 0,
    jobs: jobs.count ?? 0,
    clubs: clubs.count ?? 0,
  };
}

// ============================================
// Articles CRUD
// ============================================

export type ArticleInput = Omit<ArticleRow, "id" | "created_at" | "updated_at" | "view_count">;

export async function createArticle(input: ArticleInput) {
  const { data, error } = await supabase
    .from("articles")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ArticleRow;
}

export async function updateArticle(id: string, input: Partial<ArticleInput>) {
  const { data, error } = await supabase
    .from("articles")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ArticleRow;
}

export async function deleteArticle(id: string) {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as ArticleRow;
}

export async function getAllArticlesAdmin() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ArticleRow[];
}

// ============================================
// Jobs CRUD
// ============================================

export type JobInput = Omit<JobRow, "id" | "created_at" | "updated_at">;

export async function createJob(input: JobInput) {
  const { data, error } = await supabase
    .from("jobs")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as JobRow;
}

export async function updateJob(id: string, input: Partial<JobInput>) {
  const { data, error } = await supabase
    .from("jobs")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as JobRow;
}

export async function deleteJob(id: string) {
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getJobByIdAdmin(id: string) {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as JobRow;
}

export async function getAllJobsAdmin() {
  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as JobRow[];
}

// ============================================
// Clubs CRUD
// ============================================

export interface ClubProfile {
  kontakt?: { email?: string; telefon?: string; website?: string };
  socialMedia?: { instagram?: string; facebook?: string };
}

export interface ClubRow {
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
  profile: ClubProfile;
  created_at: string;
  updated_at: string;
}

export type ClubInput = Omit<ClubRow, "id" | "created_at" | "updated_at">;

export async function createClub(input: ClubInput) {
  const { data, error } = await supabase
    .from("clubs")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ClubRow;
}

export async function updateClub(id: string, input: Partial<ClubInput>) {
  const { data, error } = await supabase
    .from("clubs")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as ClubRow;
}

export async function deleteClub(id: string) {
  const { error } = await supabase.from("clubs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getClubByIdAdmin(id: string) {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data as ClubRow;
}

export async function getAllClubsAdmin() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []) as ClubRow[];
}
