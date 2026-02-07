// Liga-Datenstruktur für DIAGO

export type LeagueCategory = "herren" | "frauen" | "pokal" | "jugend";

export interface Staffel {
  id: string;
  name: string;
  slug: string;
}

export interface League {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: LeagueCategory;
  tier: number; // 1 = höchste Liga, aufsteigend
  region: "national" | "nordost" | "berlin";
  staffeln?: Staffel[];
  parentId?: string; // für Unterligen
}

// Alle Ligen
export const ALL_LEAGUES: League[] = [
  // === HERREN ===
  {
    id: "bundesliga",
    name: "Bundesliga",
    shortName: "Bundesliga",
    slug: "bundesliga",
    category: "herren",
    tier: 1,
    region: "national",
  },
  {
    id: "2-bundesliga",
    name: "2. Bundesliga",
    shortName: "2. Bundesliga",
    slug: "2-bundesliga",
    category: "herren",
    tier: 2,
    region: "national",
  },
  {
    id: "3-liga",
    name: "3. Liga",
    shortName: "3. Liga",
    slug: "3-liga",
    category: "herren",
    tier: 3,
    region: "national",
  },
  {
    id: "regionalliga-nordost",
    name: "Regionalliga Nordost",
    shortName: "Regionalliga NO",
    slug: "regionalliga-nordost",
    category: "herren",
    tier: 4,
    region: "nordost",
  },
  {
    id: "oberliga-nofv-nord",
    name: "Oberliga NOFV Nord",
    shortName: "OL Nord",
    slug: "oberliga-nofv-nord",
    category: "herren",
    tier: 5,
    region: "nordost",
  },
  {
    id: "oberliga-nofv-sued",
    name: "Oberliga NOFV Süd",
    shortName: "OL Süd",
    slug: "oberliga-nofv-sued",
    category: "herren",
    tier: 5,
    region: "nordost",
  },
  {
    id: "berlin-liga",
    name: "Berlin-Liga",
    shortName: "Berlin-Liga",
    slug: "berlin-liga",
    category: "herren",
    tier: 6,
    region: "berlin",
  },
  {
    id: "landesliga",
    name: "Landesliga Berlin",
    shortName: "Landesliga",
    slug: "landesliga",
    category: "herren",
    tier: 7,
    region: "berlin",
    staffeln: [
      { id: "landesliga-1", name: "Staffel 1", slug: "landesliga-staffel-1" },
      { id: "landesliga-2", name: "Staffel 2", slug: "landesliga-staffel-2" },
    ],
  },
  {
    id: "bezirksliga",
    name: "Bezirksliga Berlin",
    shortName: "Bezirksliga",
    slug: "bezirksliga",
    category: "herren",
    tier: 8,
    region: "berlin",
    staffeln: [
      { id: "bezirksliga-1", name: "Staffel 1", slug: "bezirksliga-staffel-1" },
      { id: "bezirksliga-2", name: "Staffel 2", slug: "bezirksliga-staffel-2" },
      { id: "bezirksliga-3", name: "Staffel 3", slug: "bezirksliga-staffel-3" },
      { id: "bezirksliga-4", name: "Staffel 4", slug: "bezirksliga-staffel-4" },
    ],
  },
  {
    id: "kreisliga-a",
    name: "Kreisliga A Berlin",
    shortName: "KL A",
    slug: "kreisliga-a",
    category: "herren",
    tier: 9,
    region: "berlin",
    staffeln: [
      { id: "kreisliga-a-1", name: "Staffel 1", slug: "kreisliga-a-staffel-1" },
      { id: "kreisliga-a-2", name: "Staffel 2", slug: "kreisliga-a-staffel-2" },
      { id: "kreisliga-a-3", name: "Staffel 3", slug: "kreisliga-a-staffel-3" },
      { id: "kreisliga-a-4", name: "Staffel 4", slug: "kreisliga-a-staffel-4" },
      { id: "kreisliga-a-5", name: "Staffel 5", slug: "kreisliga-a-staffel-5" },
      { id: "kreisliga-a-6", name: "Staffel 6", slug: "kreisliga-a-staffel-6" },
    ],
  },
  {
    id: "kreisliga-b",
    name: "Kreisliga B Berlin",
    shortName: "KL B",
    slug: "kreisliga-b",
    category: "herren",
    tier: 10,
    region: "berlin",
    staffeln: [
      { id: "kreisliga-b-1", name: "Staffel 1", slug: "kreisliga-b-staffel-1" },
      { id: "kreisliga-b-2", name: "Staffel 2", slug: "kreisliga-b-staffel-2" },
      { id: "kreisliga-b-3", name: "Staffel 3", slug: "kreisliga-b-staffel-3" },
      { id: "kreisliga-b-4", name: "Staffel 4", slug: "kreisliga-b-staffel-4" },
      { id: "kreisliga-b-5", name: "Staffel 5", slug: "kreisliga-b-staffel-5" },
      { id: "kreisliga-b-6", name: "Staffel 6", slug: "kreisliga-b-staffel-6" },
      { id: "kreisliga-b-7", name: "Staffel 7", slug: "kreisliga-b-staffel-7" },
      { id: "kreisliga-b-8", name: "Staffel 8", slug: "kreisliga-b-staffel-8" },
    ],
  },
  {
    id: "kreisliga-c",
    name: "Kreisliga C Berlin",
    shortName: "KL C",
    slug: "kreisliga-c",
    category: "herren",
    tier: 11,
    region: "berlin",
    staffeln: [
      { id: "kreisliga-c-1", name: "Staffel 1", slug: "kreisliga-c-staffel-1" },
      { id: "kreisliga-c-2", name: "Staffel 2", slug: "kreisliga-c-staffel-2" },
      { id: "kreisliga-c-3", name: "Staffel 3", slug: "kreisliga-c-staffel-3" },
      { id: "kreisliga-c-4", name: "Staffel 4", slug: "kreisliga-c-staffel-4" },
      { id: "kreisliga-c-5", name: "Staffel 5", slug: "kreisliga-c-staffel-5" },
      { id: "kreisliga-c-6", name: "Staffel 6", slug: "kreisliga-c-staffel-6" },
      { id: "kreisliga-c-7", name: "Staffel 7", slug: "kreisliga-c-staffel-7" },
      { id: "kreisliga-c-8", name: "Staffel 8", slug: "kreisliga-c-staffel-8" },
      { id: "kreisliga-c-9", name: "Staffel 9", slug: "kreisliga-c-staffel-9" },
      { id: "kreisliga-c-10", name: "Staffel 10", slug: "kreisliga-c-staffel-10" },
    ],
  },

  // === FRAUEN ===
  {
    id: "frauen-bundesliga",
    name: "Frauen-Bundesliga",
    shortName: "Frauen-BL",
    slug: "frauen-bundesliga",
    category: "frauen",
    tier: 1,
    region: "national",
  },
  {
    id: "2-frauen-bundesliga",
    name: "2. Frauen-Bundesliga",
    shortName: "2. Frauen-BL",
    slug: "2-frauen-bundesliga",
    category: "frauen",
    tier: 2,
    region: "national",
  },
  {
    id: "frauen-regionalliga-nordost",
    name: "Frauen-Regionalliga Nordost",
    shortName: "Frauen-RL NO",
    slug: "frauen-regionalliga-nordost",
    category: "frauen",
    tier: 3,
    region: "nordost",
  },
  {
    id: "frauen-berlin-liga",
    name: "Frauen Berlin-Liga",
    shortName: "Frauen Berlin-Liga",
    slug: "frauen-berlin-liga",
    category: "frauen",
    tier: 4,
    region: "berlin",
  },
  {
    id: "frauen-landesliga",
    name: "Frauen-Landesliga Berlin",
    shortName: "Frauen-LL",
    slug: "frauen-landesliga",
    category: "frauen",
    tier: 5,
    region: "berlin",
    staffeln: [
      { id: "frauen-landesliga-1", name: "Staffel 1", slug: "frauen-landesliga-staffel-1" },
      { id: "frauen-landesliga-2", name: "Staffel 2", slug: "frauen-landesliga-staffel-2" },
    ],
  },
  {
    id: "frauen-bezirksliga",
    name: "Frauen-Bezirksliga Berlin",
    shortName: "Frauen-BZL",
    slug: "frauen-bezirksliga",
    category: "frauen",
    tier: 6,
    region: "berlin",
    staffeln: [
      { id: "frauen-bezirksliga-1", name: "Staffel 1", slug: "frauen-bezirksliga-staffel-1" },
      { id: "frauen-bezirksliga-2", name: "Staffel 2", slug: "frauen-bezirksliga-staffel-2" },
    ],
  },

  // === POKAL ===
  {
    id: "dfb-pokal",
    name: "DFB-Pokal",
    shortName: "DFB",
    slug: "dfb-pokal",
    category: "pokal",
    tier: 1,
    region: "national",
  },
  {
    id: "dfb-pokal-frauen",
    name: "DFB-Pokal Frauen",
    shortName: "DFB-F",
    slug: "dfb-pokal-frauen",
    category: "pokal",
    tier: 1,
    region: "national",
  },
  {
    id: "berliner-pokal",
    name: "Berliner Pilsner-Pokal",
    shortName: "BP",
    slug: "berliner-pokal",
    category: "pokal",
    tier: 2,
    region: "berlin",
  },
  {
    id: "polytan-pokal",
    name: "Polytan-Pokal",
    shortName: "PP",
    slug: "polytan-pokal",
    category: "pokal",
    tier: 3,
    region: "berlin",
  },

  // === JUGEND ===
  {
    id: "a-jugend-verbandsliga",
    name: "A-Jugend Verbandsliga",
    shortName: "A-Jgd VL",
    slug: "a-jugend-verbandsliga",
    category: "jugend",
    tier: 1,
    region: "berlin",
  },
  {
    id: "a-jugend-landesliga",
    name: "A-Jugend Landesliga",
    shortName: "A-Jgd LL",
    slug: "a-jugend-landesliga",
    category: "jugend",
    tier: 2,
    region: "berlin",
    staffeln: [
      { id: "a-jugend-landesliga-1", name: "Staffel 1", slug: "a-jugend-landesliga-staffel-1" },
      { id: "a-jugend-landesliga-2", name: "Staffel 2", slug: "a-jugend-landesliga-staffel-2" },
    ],
  },
  {
    id: "b-jugend-verbandsliga",
    name: "B-Jugend Verbandsliga",
    shortName: "B-Jgd VL",
    slug: "b-jugend-verbandsliga",
    category: "jugend",
    tier: 1,
    region: "berlin",
  },
  {
    id: "b-jugend-landesliga",
    name: "B-Jugend Landesliga",
    shortName: "B-Jgd LL",
    slug: "b-jugend-landesliga",
    category: "jugend",
    tier: 2,
    region: "berlin",
    staffeln: [
      { id: "b-jugend-landesliga-1", name: "Staffel 1", slug: "b-jugend-landesliga-staffel-1" },
      { id: "b-jugend-landesliga-2", name: "Staffel 2", slug: "b-jugend-landesliga-staffel-2" },
    ],
  },
  {
    id: "c-jugend-verbandsliga",
    name: "C-Jugend Verbandsliga",
    shortName: "C-Jgd VL",
    slug: "c-jugend-verbandsliga",
    category: "jugend",
    tier: 1,
    region: "berlin",
  },
  {
    id: "c-jugend-landesliga",
    name: "C-Jugend Landesliga",
    shortName: "C-Jgd LL",
    slug: "c-jugend-landesliga",
    category: "jugend",
    tier: 2,
    region: "berlin",
    staffeln: [
      { id: "c-jugend-landesliga-1", name: "Staffel 1", slug: "c-jugend-landesliga-staffel-1" },
      { id: "c-jugend-landesliga-2", name: "Staffel 2", slug: "c-jugend-landesliga-staffel-2" },
    ],
  },
];

// === HELPER FUNCTIONS ===

/**
 * Get all leagues by category
 */
export function getLeaguesByCategory(category: LeagueCategory): League[] {
  return ALL_LEAGUES.filter((league) => league.category === category).sort(
    (a, b) => a.tier - b.tier
  );
}

/**
 * Get league by slug
 */
export function getLeagueBySlug(slug: string): League | undefined {
  return ALL_LEAGUES.find((league) => league.slug === slug);
}

/**
 * Get league by ID
 */
export function getLeagueById(id: string): League | undefined {
  return ALL_LEAGUES.find((league) => league.id === id);
}

/**
 * Get all leagues with their staffeln flattened for routing
 */
export function getAllLeagueSlugs(): string[] {
  const slugs: string[] = [];

  ALL_LEAGUES.forEach((league) => {
    slugs.push(league.slug);
    if (league.staffeln) {
      league.staffeln.forEach((staffel) => {
        slugs.push(staffel.slug);
      });
    }
  });

  return slugs;
}

/**
 * Find staffel by slug
 */
export function getStaffelBySlug(slug: string): { league: League; staffel: Staffel } | undefined {
  for (const league of ALL_LEAGUES) {
    if (league.staffeln) {
      const staffel = league.staffeln.find((s) => s.slug === slug);
      if (staffel) {
        return { league, staffel };
      }
    }
  }
  return undefined;
}

/**
 * Get tier label
 */
export function getTierLabel(tier: number): string {
  const labels: Record<number, string> = {
    1: "1. Liga",
    2: "2. Liga",
    3: "3. Liga",
    4: "4. Liga",
    5: "5. Liga",
    6: "6. Liga",
    7: "7. Liga",
    8: "8. Liga",
    9: "9. Liga",
    10: "10. Liga",
    11: "11. Liga",
  };
  return labels[tier] || `${tier}. Liga`;
}

/**
 * Get region label
 */
export function getRegionLabel(region: League["region"]): string {
  const labels: Record<League["region"], string> = {
    national: "National",
    nordost: "Nordost",
    berlin: "Berlin",
  };
  return labels[region];
}

/**
 * Get category label
 */
export function getCategoryLabel(category: LeagueCategory): string {
  const labels: Record<LeagueCategory, string> = {
    herren: "Herren",
    frauen: "Frauen",
    pokal: "Pokal",
    jugend: "Jugend",
  };
  return labels[category];
}

/**
 * Check if league has staffeln
 */
export function hasStaffeln(league: League): boolean {
  return Boolean(league.staffeln && league.staffeln.length > 0);
}

/**
 * Get Berlin leagues only (for local focus)
 */
export function getBerlinLeagues(): League[] {
  return ALL_LEAGUES.filter((league) => league.region === "berlin");
}

/**
 * Get professional leagues (Tier 1-4)
 */
export function getProLeagues(): League[] {
  return ALL_LEAGUES.filter((league) => league.tier <= 4 && league.category !== "pokal");
}

/**
 * Get amateur leagues (Tier 5+)
 */
export function getAmateurLeagues(): League[] {
  return ALL_LEAGUES.filter((league) => league.tier >= 5 && league.category !== "pokal");
}
