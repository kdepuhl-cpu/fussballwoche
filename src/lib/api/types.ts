// Database row types and converters

import type { Artikel, Bild, Autor, Kategorie } from "../types";
import type { Job, JobKategorie, JobTyp } from "../jobs";
import type { League, LeagueCategory, Staffel } from "../leagues";

// ============================================
// DB Row Types
// ============================================

export interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string;
  image_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  image_credit: string | null;
  author_name: string | null;
  author_image: string | null;
  published_at: string;
  is_featured: boolean;
  reading_time_minutes: number | null;
  league_id: string | null;
  club_ids: string[];
  tags: string[];
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface JobRow {
  id: string;
  title: string;
  club_name: string;
  club_logo_url: string | null;
  district: string | null;
  league: string | null;
  category: string;
  type: string;
  description: string | null;
  requirements: string[];
  tasks: string[];
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  compensation: string | null;
  published_at: string;
  is_featured: boolean;
  tags: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeagueRow {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  category: string;
  tier: number;
  region: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// Converters: DB Row → Frontend Type
// ============================================

export function articleRowToArtikel(row: ArticleRow): Artikel {
  const bild: Bild | undefined =
    row.image_url
      ? {
          url: row.image_url,
          alt: row.image_alt ?? "",
          caption: row.image_caption ?? undefined,
          credit: row.image_credit ?? undefined,
        }
      : undefined;

  const autor: Autor | undefined = row.author_name
    ? { name: row.author_name, bild: row.author_image ?? undefined }
    : undefined;

  return {
    id: row.id,
    titel: row.title,
    slug: row.slug,
    teaser: row.excerpt ?? "",
    inhalt: row.content ?? undefined,
    bild,
    datum: row.published_at,
    kategorie: row.category as Kategorie,
    ligaId: row.league_id ?? "",
    vereinIds: row.club_ids.length > 0 ? row.club_ids : undefined,
    autor,
    lesedauer: row.reading_time_minutes ?? undefined,
    featured: row.is_featured || undefined,
    tags: row.tags.length > 0 ? row.tags : undefined,
  };
}

export function jobRowToJob(row: JobRow): Job {
  return {
    id: row.id,
    titel: row.title,
    verein: row.club_name,
    vereinLogo: row.club_logo_url ?? undefined,
    bezirk: row.district ?? "",
    liga: row.league ?? undefined,
    kategorie: row.category as JobKategorie,
    typ: row.type as JobTyp,
    beschreibung: row.description ?? "",
    anforderungen: row.requirements,
    aufgaben: row.tasks,
    kontakt: {
      name: row.contact_name ?? "",
      email: row.contact_email ?? "",
      telefon: row.contact_phone ?? undefined,
    },
    verguetung: row.compensation ?? undefined,
    datum: row.published_at,
    featured: row.is_featured || undefined,
    tags: row.tags.length > 0 ? row.tags : undefined,
  };
}

export function leagueRowToLeague(
  row: LeagueRow,
  staffelRows?: LeagueRow[]
): League {
  const staffeln: Staffel[] | undefined = staffelRows?.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
  }));

  return {
    id: row.id,
    name: row.name,
    shortName: row.short_name,
    slug: row.slug,
    category: row.category as LeagueCategory,
    tier: row.tier,
    region: row.region as League["region"],
    staffeln: staffeln && staffeln.length > 0 ? staffeln : undefined,
    parentId: row.parent_id ?? undefined,
  };
}
