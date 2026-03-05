export interface EPaperIssue {
  id: string;
  title: string;
  date: string;
  coverImage: string;
  pages: string[];
  pageCount: number;
  pdfUrl?: string;
}

export interface ArchivIssue extends EPaperIssue {
  year: number;
  decade: string;
  description?: string;
}

const COVER_IMAGES = {
  current1: "https://placehold.co/800x1100/044110/FAFAFA?text=Fu%C3%9Fball-Woche%0AAusgabe+12",
  current2: "https://placehold.co/800x1100/044110/FAFAFA?text=Fu%C3%9Fball-Woche%0AAusgabe+11",
  current3: "https://placehold.co/800x1100/044110/FAFAFA?text=Fu%C3%9Fball-Woche%0AAusgabe+10",
  current4: "https://placehold.co/800x1100/044110/FAFAFA?text=Fu%C3%9Fball-Woche%0AAusgabe+9",
  archiv1: "https://placehold.co/800x1100/8B7355/FAFAFA?text=Fu%C3%9Fball-Woche%0AArchiv",
  archiv2: "https://placehold.co/800x1100/8B7355/FAFAFA?text=Fu%C3%9Fball-Woche%0AArchiv",
  archiv3: "https://placehold.co/800x1100/8B7355/FAFAFA?text=Fu%C3%9Fball-Woche%0AArchiv",
  archiv4: "https://placehold.co/800x1100/8B7355/FAFAFA?text=Fu%C3%9Fball-Woche%0AArchiv",
};

function generatePages(count: number, color: string): string[] {
  return Array.from({ length: count }, (_, i) =>
    `https://placehold.co/800x1100/${color}/FAFAFA?text=Seite+${i + 1}`
  );
}

function staticPages(folder: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    `/epaper/${folder}/page-${String(i + 1).padStart(2, "0")}.jpg`
  );
}

export const currentIssues: EPaperIssue[] = [
  {
    id: "ausgabe-42",
    title: "Ausgabe 42",
    date: "2026-03-01",
    coverImage: "/epaper/ausgabe-42-cover.jpg",
    pages: staticPages("ausgabe-42", 32),
    pageCount: 32,
  },
  {
    id: "ausgabe-12-2026",
    title: "Ausgabe 12 | März 2026",
    date: "2026-03-01",
    coverImage: COVER_IMAGES.current1,
    pages: generatePages(8, "044110"),
    pageCount: 8,
  },
  {
    id: "ausgabe-11-2026",
    title: "Ausgabe 11 | Februar 2026",
    date: "2026-02-15",
    coverImage: COVER_IMAGES.current2,
    pages: generatePages(8, "044110"),
    pageCount: 8,
  },
  {
    id: "ausgabe-10-2026",
    title: "Ausgabe 10 | Februar 2026",
    date: "2026-02-01",
    coverImage: COVER_IMAGES.current3,
    pages: generatePages(6, "044110"),
    pageCount: 6,
  },
  {
    id: "ausgabe-09-2026",
    title: "Ausgabe 9 | Januar 2026",
    date: "2026-01-15",
    coverImage: COVER_IMAGES.current4,
    pages: generatePages(8, "044110"),
    pageCount: 8,
  },
];

export const archivIssues: ArchivIssue[] = [
  {
    id: "archiv-1968-03",
    title: "Fußball-Woche Nr. 12/1968",
    date: "1968-03-18",
    year: 1968,
    decade: "1960er",
    description: "Tasmania Berlin sorgt für Furore in der Oberliga",
    coverImage: COVER_IMAGES.archiv1,
    pages: generatePages(6, "8B7355"),
    pageCount: 6,
  },
  {
    id: "archiv-1972-05",
    title: "Fußball-Woche Nr. 22/1972",
    date: "1972-05-28",
    year: 1972,
    decade: "1970er",
    description: "Hertha BSC im Europapokal — Berlin fiebert mit",
    coverImage: COVER_IMAGES.archiv2,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
  {
    id: "archiv-1976-09",
    title: "Fußball-Woche Nr. 38/1976",
    date: "1976-09-15",
    year: 1976,
    decade: "1970er",
    description: "Tennis Borussia steigt in die Bundesliga auf",
    coverImage: COVER_IMAGES.archiv3,
    pages: generatePages(6, "8B7355"),
    pageCount: 6,
  },
  {
    id: "archiv-1983-11",
    title: "Fußball-Woche Nr. 45/1983",
    date: "1983-11-07",
    year: 1983,
    decade: "1980er",
    description: "Blau-Weiß 90 in der Bundesliga — Berliner Derbys",
    coverImage: COVER_IMAGES.archiv4,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
  {
    id: "archiv-1989-11",
    title: "Fußball-Woche Nr. 46/1989",
    date: "1989-11-13",
    year: 1989,
    decade: "1980er",
    description: "Mauerfall — Was wird aus dem Ost-Berliner Fußball?",
    coverImage: COVER_IMAGES.archiv1,
    pages: generatePages(10, "8B7355"),
    pageCount: 10,
  },
  {
    id: "archiv-1991-06",
    title: "Fußball-Woche Nr. 24/1991",
    date: "1991-06-10",
    year: 1991,
    decade: "1990er",
    description: "Ost und West vereint — Die ersten gesamtberliner Ligen",
    coverImage: COVER_IMAGES.archiv2,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
  {
    id: "archiv-1999-05",
    title: "Fußball-Woche Nr. 20/1999",
    date: "1999-05-17",
    year: 1999,
    decade: "1990er",
    description: "Union Berlin vor dem Aufstieg in die 2. Liga",
    coverImage: COVER_IMAGES.archiv3,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
  {
    id: "archiv-2005-04",
    title: "Fußball-Woche Nr. 15/2005",
    date: "2005-04-11",
    year: 2005,
    decade: "2000er",
    description: "BFC Dynamo kämpft sich zurück in die Oberliga",
    coverImage: COVER_IMAGES.archiv4,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
  {
    id: "archiv-2014-08",
    title: "Fußball-Woche Nr. 33/2014",
    date: "2014-08-18",
    year: 2014,
    decade: "2010er",
    description: "Berliner AK 07 — Aufstiegsträume in der Regionalliga",
    coverImage: COVER_IMAGES.archiv1,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
  {
    id: "archiv-2019-03",
    title: "Fußball-Woche Nr. 11/2019",
    date: "2019-03-11",
    year: 2019,
    decade: "2010er",
    description: "Viktoria Berlin dominiert die Berlin-Liga",
    coverImage: COVER_IMAGES.archiv2,
    pages: generatePages(8, "8B7355"),
    pageCount: 8,
  },
];

export const allIssues: (EPaperIssue | ArchivIssue)[] = [
  ...currentIssues,
  ...archivIssues,
];

export function getEPaperIssueById(id: string): EPaperIssue | ArchivIssue | undefined {
  return allIssues.find((issue) => issue.id === id);
}

export function getAllIssueIds(): string[] {
  return allIssues.map((issue) => issue.id);
}

export function getArchivByDecade(decade: string): ArchivIssue[] {
  return archivIssues.filter((issue) => issue.decade === decade);
}

export function getAllDecades(): string[] {
  const decades = new Set(archivIssues.map((issue) => issue.decade));
  return Array.from(decades).sort();
}
