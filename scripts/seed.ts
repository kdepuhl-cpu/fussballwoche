/**
 * Seed script: pushes mock data into Supabase.
 *
 * Usage:  npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY
 * (preferred, bypasses RLS) or NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Environment is loaded from .env.local automatically.
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// 0. LOAD .env.local & ENV CHECK
// ---------------------------------------------------------------------------

// Load .env.local if it exists (no dependency on dotenv)
try {
  const envPath = resolve(__dirname, "..", ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = val;
    }
  }
} catch {
  // .env.local not found — rely on existing env vars
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer service-role key (bypasses RLS) over anon key
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "ERROR: Missing environment variables.\n" +
      "  NEXT_PUBLIC_SUPABASE_URL must be set.\n" +
      "  SUPABASE_SERVICE_ROLE_KEY (preferred) or NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.\n" +
      "  Create a .env.local file or export them before running this script."
  );
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    "WARN: SUPABASE_SERVICE_ROLE_KEY not found. Using anon key.\n" +
      "  Upserts will fail if RLS INSERT/UPDATE policies are not configured for anon.\n" +
      "  Set SUPABASE_SERVICE_ROLE_KEY in .env.local for full access.\n"
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------------------------------------------------------------------------
// 1. IMPORT SOURCE DATA
// ---------------------------------------------------------------------------

// We cannot use the @/ path alias with tsx, so use relative imports.
// leagues.ts
import { ALL_LEAGUES } from "../src/lib/leagues";
import type { League } from "../src/lib/leagues";

// clubs
import { vereine } from "../src/lib/mock/clubs";
import { BERLIN_TEAMS } from "../src/lib/mock/matches";

// articles
import { artikel } from "../src/lib/data";

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------

/**
 * Map old data.ts ligaId values to the canonical league IDs used in leagues.ts / DB.
 */
const LIGA_ID_MAP: Record<string, string> = {
  "bundesliga-1": "bundesliga",
  "bundesliga-2": "2-bundesliga",
  "liga-3": "3-liga",
  // These are already identical:
  "regionalliga-nordost": "regionalliga-nordost",
  "oberliga-nofv-nord": "oberliga-nofv-nord",
  "berlin-liga": "berlin-liga",
};

function mapLigaId(id: string): string {
  return LIGA_ID_MAP[id] ?? id;
}

// ---------------------------------------------------------------------------
// 2. SEED LEAGUES
// ---------------------------------------------------------------------------

async function seedLeagues() {
  console.log("\n--- Seeding leagues ---");

  // Separate parent leagues (no parentId, no staffeln children) from staffel rows.
  // Parent leagues must be inserted first due to foreign-key on parent_id.

  const parentRows: {
    id: string;
    name: string;
    short_name: string;
    slug: string;
    category: string;
    tier: number;
    region: string;
    parent_id: string | null;
  }[] = [];

  const staffelRows: typeof parentRows = [];

  for (const league of ALL_LEAGUES) {
    // Skip jugend leagues -- the DB CHECK constraint only allows herren/frauen/pokal
    if (league.category === "jugend") continue;

    // The league itself (parent or standalone)
    parentRows.push({
      id: league.id,
      name: league.name,
      short_name: league.shortName,
      slug: league.slug,
      category: league.category,
      tier: league.tier,
      region: league.region,
      parent_id: league.parentId ?? null,
    });

    // Its staffeln become child league rows
    if (league.staffeln) {
      for (const staffel of league.staffeln) {
        staffelRows.push({
          id: staffel.id,
          name: staffel.name,
          short_name: `${league.shortName} ${staffel.name.replace("Staffel ", "")}`,
          slug: staffel.slug,
          category: league.category,
          tier: league.tier,
          region: league.region,
          parent_id: league.id,
        });
      }
    }
  }

  // Upsert parent leagues first
  console.log(`  Upserting ${parentRows.length} parent leagues...`);
  const { error: parentError } = await supabase
    .from("leagues")
    .upsert(parentRows, { onConflict: "id" });

  if (parentError) {
    console.error("  ERROR seeding parent leagues:", parentError.message);
  } else {
    console.log(`  OK: ${parentRows.length} parent leagues upserted.`);
  }

  // Upsert staffeln (child leagues)
  if (staffelRows.length > 0) {
    console.log(`  Upserting ${staffelRows.length} staffel leagues...`);
    const { error: staffelError } = await supabase
      .from("leagues")
      .upsert(staffelRows, { onConflict: "id" });

    if (staffelError) {
      console.error("  ERROR seeding staffel leagues:", staffelError.message);
    } else {
      console.log(`  OK: ${staffelRows.length} staffel leagues upserted.`);
    }
  }
}

// ---------------------------------------------------------------------------
// 3. SEED CLUBS
// ---------------------------------------------------------------------------

async function seedClubs() {
  console.log("\n--- Seeding clubs ---");

  // Build a set of IDs already covered by the full VereinProfil array
  const vereinIds = new Set(vereine.map((v) => v.id));

  // Full club rows from vereine (rich data)
  const clubRows = vereine.map((v) => ({
    id: v.id,
    name: v.name,
    short_name: v.kurzname,
    slug: v.slug,
    league_id: mapLigaId(v.ligaId),
    bezirk: v.bezirk ?? null,
    founded_year: v.gruendungsjahr ?? null,
    primary_color: v.farben?.primary ?? null,
    secondary_color: v.farben?.secondary ?? null,
    logo_url: v.wappen ?? null,
    // Extended fields (require 007_platform_v2.sql migration)
    description: v.beschreibung ?? null,
    website: v.kontakt?.website ?? null,
    email: v.kontakt?.email ?? null,
    telefon: v.kontakt?.telefon ?? null,
    instagram_url: v.socialMedia?.instagram ?? null,
    facebook_url: v.socialMedia?.facebook ?? null,
    sportstaette_name: v.sportstaette?.name ?? null,
    sportstaette_adresse: v.sportstaette?.adresse ?? null,
    sportstaette_plz: v.sportstaette?.plz ?? null,
    sportstaette_bezirk: v.sportstaette?.bezirk ?? null,
    sportstaette_maps_url: v.sportstaette?.mapsUrl ?? null,
    sportstaette_kapazitaet: v.sportstaette?.kapazitaet ?? null,
    sportstaette_kunstrasen: v.sportstaette?.kunstrasen ?? null,
    sportstaette_flutlicht: v.sportstaette?.flutlicht ?? null,
    ansprechpartner: v.ansprechpartner ?? null,
    trainingszeiten: v.trainingszeiten ?? null,
    mitglieder: v.mitglieder ?? null,
    mannschaften: v.mannschaften ?? null,
  }));

  // Basic club rows from BERLIN_TEAMS that are NOT already in vereine
  const basicClubRows = BERLIN_TEAMS.filter((t) => !vereinIds.has(t.id)).map(
    (t) => ({
      id: t.id,
      name: t.name,
      short_name: t.shortName,
      slug: t.id, // use team id as slug
      league_id: "berlin-liga",
      bezirk: null,
      founded_year: null,
      primary_color: t.color,
      secondary_color: null,
      logo_url: null,
      description: null,
      website: null,
      email: null,
      telefon: null,
      instagram_url: null,
      facebook_url: null,
      sportstaette_name: null,
      sportstaette_adresse: null,
      sportstaette_plz: null,
      sportstaette_bezirk: null,
      sportstaette_maps_url: null,
      sportstaette_kapazitaet: null,
      sportstaette_kunstrasen: null,
      sportstaette_flutlicht: null,
      ansprechpartner: null,
      trainingszeiten: null,
      mitglieder: null,
      mannschaften: null,
    })
  );

  const allClubs = [...clubRows, ...basicClubRows];
  console.log(
    `  Upserting ${allClubs.length} clubs (${clubRows.length} rich + ${basicClubRows.length} basic)...`
  );

  const { error } = await supabase
    .from("clubs")
    .upsert(allClubs, { onConflict: "id" });

  if (error) {
    // If the extended columns don't exist yet, try with basic columns only
    if (
      error.message.includes("column") ||
      error.message.includes("does not exist")
    ) {
      console.warn(
        "  WARN: Extended club columns not found. Falling back to basic columns."
      );
      console.warn(
        "  (Run the 007_platform_v2.sql migration to add extended club fields.)"
      );

      const basicAll = allClubs.map((c) => ({
        id: c.id,
        name: c.name,
        short_name: c.short_name,
        slug: c.slug,
        league_id: c.league_id,
        bezirk: c.bezirk,
        founded_year: c.founded_year,
        primary_color: c.primary_color,
        secondary_color: c.secondary_color,
        logo_url: c.logo_url,
      }));

      const { error: fallbackError } = await supabase
        .from("clubs")
        .upsert(basicAll, { onConflict: "id" });

      if (fallbackError) {
        console.error("  ERROR seeding clubs (fallback):", fallbackError.message);
      } else {
        console.log(`  OK: ${basicAll.length} clubs upserted (basic columns only).`);
      }
    } else {
      console.error("  ERROR seeding clubs:", error.message);
    }
  } else {
    console.log(`  OK: ${allClubs.length} clubs upserted (full columns).`);
  }
}

// ---------------------------------------------------------------------------
// 4. SEED ARTICLES
// ---------------------------------------------------------------------------

async function seedArticles() {
  console.log("\n--- Seeding articles ---");

  const articleRows = artikel.map((a) => ({
    // Use deterministic UUID based on the article id
    id: `00000000-0000-0000-0000-${String(a.id).padStart(12, "0")}`,
    title: a.titel,
    slug: a.slug,
    excerpt: a.teaser ?? null,
    content: a.inhalt ?? null,
    category: a.kategorie,
    image_url: a.bild?.url ?? null,
    image_alt: a.bild?.alt ?? null,
    image_caption: a.bild?.caption ?? null,
    image_credit: a.bild?.credit ?? null,
    author_name: a.autor?.name ?? null,
    author_image: a.autor?.bild ?? null,
    published_at: a.datum,
    is_featured: a.featured ?? false,
    reading_time_minutes: a.lesedauer ?? null,
    league_id: mapLigaId(a.ligaId),
    club_ids: a.vereinIds ?? [],
    tags: a.tags ?? [],
  }));

  console.log(`  Upserting ${articleRows.length} articles...`);

  const { error } = await supabase
    .from("articles")
    .upsert(articleRows, { onConflict: "slug" });

  if (error) {
    console.error("  ERROR seeding articles:", error.message);
  } else {
    console.log(`  OK: ${articleRows.length} articles upserted.`);
  }
}

// ---------------------------------------------------------------------------
// 5. MAIN
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== Fussballwoche Seed Script ===");
  console.log(`Supabase URL: ${supabaseUrl}`);
  console.log(`Auth: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? "service-role key" : "anon key"}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);

  await seedLeagues();
  await seedClubs();
  await seedArticles();

  console.log("\n=== Seed complete ===\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
