export interface Liga {
  id: string;
  name: string;
  slug: string;
  region: "berlin" | "nordost" | "national";
  level: number;
}

export const LIGEN: Liga[] = [
  { id: "bundesliga-1", name: "Bundesliga", slug: "bundesliga", region: "national", level: 1 },
  { id: "bundesliga-2", name: "2. Liga", slug: "2-liga", region: "national", level: 2 },
  { id: "liga-3", name: "3. Liga", slug: "3-liga", region: "national", level: 3 },
  { id: "regionalliga-nordost", name: "Regionalliga", slug: "regionalliga-nordost", region: "nordost", level: 4 },
  { id: "oberliga-nofv-nord", name: "Oberliga", slug: "oberliga-nofv-nord", region: "nordost", level: 5 },
  { id: "berlin-liga", name: "Berlin-Liga", slug: "berlin-liga", region: "berlin", level: 6 },
  { id: "dfb-pokal", name: "Pokal", slug: "dfb-pokal", region: "national", level: 0 },
];

export interface Verein {
  id: string;
  name: string;
  slug: string;
  ligaId: string;
  logo?: string;
  farben?: {
    primary: string;
    secondary: string;
  };
}

export interface Bild {
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
}

export interface Autor {
  name: string;
  bild?: string;
}

// NOTE: When migrating to Supabase articles table, update the category CHECK constraint to include 'kultur'
export type Kategorie = "spielbericht" | "analyse" | "transfer" | "news" | "interview" | "kultur";

export interface Artikel {
  id: string;
  titel: string;
  slug: string;
  teaser: string;
  inhalt?: string;
  bild?: Bild;
  datum: string;
  kategorie: Kategorie;
  ligaId: string;
  vereinIds?: string[];
  autor?: Autor;
  lesedauer?: number;
  featured?: boolean;
  tags?: string[];
}

export const KATEGORIE_LABELS: Record<Kategorie, string> = {
  spielbericht: "Spielbericht",
  analyse: "Analyse",
  transfer: "Transfer",
  news: "News",
  interview: "Interview",
  kultur: "Kultur",
};

// === Vereinsprofile ===

export interface Sportstaette {
  name: string;
  adresse: string;
  plz: string;
  bezirk: string;
  mapsUrl?: string;
  kapazitaet?: number;
  kunstrasen?: boolean;
  flutlicht?: boolean;
}

export interface Ansprechpartner {
  name: string;
  rolle: string;
  telefon?: string;
  email?: string;
}

export interface Trainingszeit {
  mannschaft: string;
  tag: string;
  zeit: string;
  ort?: string;
}

export interface VereinProfil extends Verein {
  kurzname: string;
  beschreibung: string;
  bezirk: string;
  gruendungsjahr: number;
  sportstaette: Sportstaette;
  kontakt: {
    telefon?: string;
    email?: string;
    website?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
  };
  ansprechpartner: Ansprechpartner[];
  trainingszeiten: Trainingszeit[];
  wappen?: string;
  mitglieder?: number;
  mannschaften?: number;
}
