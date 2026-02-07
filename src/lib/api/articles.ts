import { supabase, isSupabaseConfigured } from "../supabase";
import {
  artikel as mockArtikel,
  getArtikelBySlug as mockGetBySlug,
  getFeaturedArtikel as mockGetFeatured,
  getArtikelByLiga as mockGetByLiga,
} from "../data";
import type { Artikel } from "../types";
import type { ArticleRow } from "./types";
import { articleRowToArtikel } from "./types";

export async function getArticles(): Promise<Artikel[]> {
  if (!isSupabaseConfigured()) return mockArtikel;

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return mockArtikel;

  return (data as ArticleRow[]).map(articleRowToArtikel);
}

export async function getArticleBySlug(
  slug: string
): Promise<Artikel | undefined> {
  if (!isSupabaseConfigured()) return mockGetBySlug(slug);

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) return mockGetBySlug(slug);

  return articleRowToArtikel(data as ArticleRow);
}

export async function getArticlesByLeague(leagueId: string): Promise<Artikel[]> {
  if (!isSupabaseConfigured()) return mockGetByLiga(leagueId);

  if (leagueId === "all") return getArticles();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("league_id", leagueId)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return mockGetByLiga(leagueId);

  return (data as ArticleRow[]).map(articleRowToArtikel);
}

export async function getFeaturedArticle(): Promise<Artikel | undefined> {
  if (!isSupabaseConfigured()) return mockGetFeatured();

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return mockGetFeatured();

  return articleRowToArtikel(data as ArticleRow);
}

export async function incrementViewCount(articleId: string): Promise<void> {
  if (!isSupabaseConfigured()) return;

  await supabase.rpc("increment_view_count", { article_id: articleId });
}
