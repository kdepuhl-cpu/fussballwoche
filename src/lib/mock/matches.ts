// Mock-Daten für Ergebnisse und Live-Ticker

export type MatchStatus = "live" | "finished" | "upcoming";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  color: string; // Hauptfarbe für Platzhalter-Logo
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number | null;
  awayScore: number | null;
  status: MatchStatus;
  minute?: number;
  date: string;
  time: string;
  leagueId: string;
  matchday: number;
}

// Berliner Vereine mit ihren Farben
export const BERLIN_TEAMS: Team[] = [
  { id: "bak", name: "Berliner AK 07", shortName: "BAK", color: "#1E3A5F" },
  { id: "tebe", name: "Tennis Borussia Berlin", shortName: "TeBe", color: "#8B5CF6" },
  { id: "tuerkiyemspor", name: "Türkiyemspor Berlin", shortName: "Türkiye", color: "#EF4444" },
  { id: "altglienicke", name: "VSG Altglienicke", shortName: "VSG", color: "#059669" },
  { id: "bfc", name: "BFC Dynamo", shortName: "BFC", color: "#DC2626" },
  { id: "zehlendorf", name: "Hertha Zehlendorf", shortName: "Hertha Z", color: "#3B82F6" },
  { id: "viktoria", name: "FC Viktoria 1889 Berlin", shortName: "Viktoria", color: "#1F2937" },
  { id: "croatia", name: "SD Croatia Berlin", shortName: "Croatia", color: "#EF4444" },
  { id: "staaken", name: "SC Staaken", shortName: "Staaken", color: "#F59E0B" },
  { id: "fuechse", name: "Füchse Berlin Reinickendorf", shortName: "Füchse", color: "#F97316" },
  { id: "sparta", name: "Sparta Lichtenberg", shortName: "Sparta", color: "#10B981" },
  { id: "stern", name: "Stern 1900 Berlin", shortName: "Stern", color: "#6366F1" },
  { id: "wacker", name: "FSV Wacker 90 Nordhausen", shortName: "Wacker", color: "#14B8A6" },
  { id: "union2", name: "1. FC Union Berlin II", shortName: "Union II", color: "#DC2626" },
  { id: "hertha2", name: "Hertha BSC II", shortName: "Hertha II", color: "#3B82F6" },
  { id: "lichtenberg", name: "SV Lichtenberg 47", shortName: "Lichtenb.", color: "#8B5CF6" },
];

// Helper: Team by ID
export function getTeamById(id: string): Team | undefined {
  return BERLIN_TEAMS.find((t) => t.id === id);
}

// Mock-Spiele für Berlin-Liga
export const BERLIN_LIGA_MATCHES: Match[] = [
  {
    id: "bl-1",
    homeTeam: BERLIN_TEAMS[0], // BAK
    awayTeam: BERLIN_TEAMS[4], // BFC
    homeScore: 2,
    awayScore: 1,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "berlin-liga",
    matchday: 19,
  },
  {
    id: "bl-2",
    homeTeam: BERLIN_TEAMS[1], // TeBe
    awayTeam: BERLIN_TEAMS[3], // VSG
    homeScore: 0,
    awayScore: 0,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "berlin-liga",
    matchday: 19,
  },
  {
    id: "bl-3",
    homeTeam: BERLIN_TEAMS[6], // Viktoria
    awayTeam: BERLIN_TEAMS[2], // Türkiyemspor
    homeScore: 3,
    awayScore: 2,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "berlin-liga",
    matchday: 19,
  },
  {
    id: "bl-4",
    homeTeam: BERLIN_TEAMS[8], // Staaken
    awayTeam: BERLIN_TEAMS[5], // Hertha Z
    homeScore: 1,
    awayScore: 1,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "berlin-liga",
    matchday: 19,
  },
  {
    id: "bl-5",
    homeTeam: BERLIN_TEAMS[7], // Croatia
    awayTeam: BERLIN_TEAMS[9], // Füchse
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    date: "2026-02-08",
    time: "15:30",
    leagueId: "berlin-liga",
    matchday: 19,
  },
  {
    id: "bl-6",
    homeTeam: BERLIN_TEAMS[10], // Sparta
    awayTeam: BERLIN_TEAMS[11], // Stern
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    date: "2026-02-09",
    time: "13:00",
    leagueId: "berlin-liga",
    matchday: 19,
  },
];

// Mock-Spiele für Landesliga Staffel 1
export const LANDESLIGA_MATCHES: Match[] = [
  {
    id: "ll-1",
    homeTeam: BERLIN_TEAMS[12], // Wacker
    awayTeam: BERLIN_TEAMS[15], // Lichtenberg
    homeScore: 2,
    awayScore: 0,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "landesliga",
    matchday: 17,
  },
  {
    id: "ll-2",
    homeTeam: { id: "adlershof", name: "VfB Einheit Pankow", shortName: "Pankow", color: "#10B981" },
    awayTeam: { id: "rudow", name: "FSV Fortuna Pankow", shortName: "Fortuna", color: "#3B82F6" },
    homeScore: 1,
    awayScore: 3,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "landesliga",
    matchday: 17,
  },
  {
    id: "ll-3",
    homeTeam: { id: "schoen", name: "SC Borsigwalde", shortName: "Borsig", color: "#F59E0B" },
    awayTeam: { id: "rot", name: "Rot-Weiß Viktoria Mitte", shortName: "RW Mitte", color: "#EF4444" },
    homeScore: 0,
    awayScore: 2,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "landesliga",
    matchday: 17,
  },
];

// Mock-Spiele für Regionalliga
export const REGIONALLIGA_MATCHES: Match[] = [
  {
    id: "rl-1",
    homeTeam: BERLIN_TEAMS[4], // BFC
    awayTeam: { id: "energie", name: "FC Energie Cottbus", shortName: "Energie", color: "#DC2626" },
    homeScore: 1,
    awayScore: 1,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "regionalliga-nordost",
    matchday: 22,
  },
  {
    id: "rl-2",
    homeTeam: BERLIN_TEAMS[3], // VSG
    awayTeam: { id: "chemie", name: "BSG Chemie Leipzig", shortName: "Chemie", color: "#22C55E" },
    homeScore: 2,
    awayScore: 0,
    status: "finished",
    date: "2026-02-08",
    time: "14:00",
    leagueId: "regionalliga-nordost",
    matchday: 22,
  },
  {
    id: "rl-3",
    homeTeam: BERLIN_TEAMS[6], // Viktoria
    awayTeam: { id: "jena", name: "FC Carl Zeiss Jena", shortName: "Jena", color: "#3B82F6" },
    homeScore: null,
    awayScore: null,
    status: "upcoming",
    date: "2026-02-09",
    time: "13:30",
    leagueId: "regionalliga-nordost",
    matchday: 22,
  },
];

// Alle Spiele kombiniert
export const ALL_MATCHES: Match[] = [
  ...BERLIN_LIGA_MATCHES,
  ...LANDESLIGA_MATCHES,
  ...REGIONALLIGA_MATCHES,
];

// Helper: Spiele nach Liga
export function getMatchesByLeague(leagueId: string): Match[] {
  return ALL_MATCHES.filter((m) => m.leagueId === leagueId);
}

// Helper: Spiele nach Spieltag
export function getMatchesByMatchday(leagueId: string, matchday: number): Match[] {
  return ALL_MATCHES.filter((m) => m.leagueId === leagueId && m.matchday === matchday);
}

// Helper: Live-Spiele
export function getLiveMatches(): Match[] {
  return ALL_MATCHES.filter((m) => m.status === "live");
}

// Helper: Heutige Spiele
export function getTodayMatches(): Match[] {
  const today = new Date().toISOString().split("T")[0];
  return ALL_MATCHES.filter((m) => m.date === today);
}

// Helper: Aktueller Spieltag einer Liga
export function getCurrentMatchday(leagueId: string): number {
  const matches = getMatchesByLeague(leagueId);
  if (matches.length === 0) return 1;
  return Math.max(...matches.map((m) => m.matchday));
}
