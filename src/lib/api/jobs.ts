import { supabase, isSupabaseConfigured } from "../supabase";
import {
  jobs as mockJobs,
  getJobById as mockGetById,
  getJobsByCategory as mockGetByCategory,
  getFeaturedJobs as mockGetFeatured,
  filterJobs as mockFilterJobs,
} from "../jobs";
import type { Job, JobKategorie, JobTyp } from "../jobs";
import type { JobRow } from "./types";
import { jobRowToJob } from "./types";

export async function getJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured()) return mockJobs;

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("active", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return mockJobs;

  return (data as JobRow[]).map(jobRowToJob);
}

export async function getJobById(id: string): Promise<Job | undefined> {
  if (!isSupabaseConfigured()) return mockGetById(id);

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return mockGetById(id);

  return jobRowToJob(data as JobRow);
}

export async function getJobsByCategory(
  kategorie: JobKategorie
): Promise<Job[]> {
  if (!isSupabaseConfigured()) return mockGetByCategory(kategorie);

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("category", kategorie)
    .eq("active", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return mockGetByCategory(kategorie);

  return (data as JobRow[]).map(jobRowToJob);
}

export async function getFeaturedJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured()) return mockGetFeatured();

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("is_featured", true)
    .eq("active", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return mockGetFeatured();

  return (data as JobRow[]).map(jobRowToJob);
}

export async function getFilteredJobs(filters: {
  kategorie?: JobKategorie;
  bezirk?: string;
  typ?: JobTyp;
  query?: string;
}): Promise<Job[]> {
  if (!isSupabaseConfigured()) return mockFilterJobs(filters);

  let query = supabase
    .from("jobs")
    .select("*")
    .eq("active", true);

  if (filters.kategorie) {
    query = query.eq("category", filters.kategorie);
  }
  if (filters.bezirk) {
    query = query.eq("district", filters.bezirk);
  }
  if (filters.typ) {
    query = query.eq("type", filters.typ);
  }
  if (filters.query) {
    query = query.or(
      `title.ilike.%${filters.query}%,club_name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`
    );
  }

  const { data, error } = await query.order("published_at", {
    ascending: false,
  });

  if (error || !data || data.length === 0) return mockFilterJobs(filters);

  return (data as JobRow[]).map(jobRowToJob);
}
