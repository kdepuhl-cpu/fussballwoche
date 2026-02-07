// Job-Plattform für Berliner Amateurfußball

export type JobKategorie =
  | "trainer"
  | "spieler"
  | "ehrenamt"
  | "management"
  | "jugend"
  | "schiedsrichter";

export type JobTyp = "vollzeit" | "teilzeit" | "ehrenamtlich" | "minijob";

export interface JobCategory {
  id: JobKategorie;
  label: string;
  slug: string;
  description: string;
  icon: string; // SVG path
}

export interface Job {
  id: string;
  titel: string;
  verein: string;
  vereinLogo?: string;
  bezirk: string;
  liga?: string;
  kategorie: JobKategorie;
  typ: JobTyp;
  beschreibung: string;
  anforderungen: string[];
  aufgaben: string[];
  kontakt: {
    name: string;
    email: string;
    telefon?: string;
  };
  verguetung?: string;
  datum: string;
  featured?: boolean;
  tags?: string[];
}

export const BEZIRKE = [
  "Charlottenburg-Wilmersdorf",
  "Friedrichshain-Kreuzberg",
  "Lichtenberg",
  "Marzahn-Hellersdorf",
  "Mitte",
  "Neukölln",
  "Pankow",
  "Reinickendorf",
  "Spandau",
  "Steglitz-Zehlendorf",
  "Tempelhof-Schöneberg",
  "Treptow-Köpenick",
] as const;

export const JOB_TYP_LABELS: Record<JobTyp, string> = {
  vollzeit: "Vollzeit",
  teilzeit: "Teilzeit",
  ehrenamtlich: "Ehrenamtlich",
  minijob: "Minijob",
};

export const JOB_KATEGORIEN: JobCategory[] = [
  {
    id: "trainer",
    label: "Trainer",
    slug: "trainer",
    description: "Trainerstellen im Herren-, Frauen- und Jugendbereich",
    icon: "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z",
  },
  {
    id: "spieler",
    label: "Spieler gesucht",
    slug: "spieler",
    description: "Vereine suchen Verstärkung für ihre Mannschaften",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    id: "ehrenamt",
    label: "Ehrenamt",
    slug: "ehrenamt",
    description: "Ehrenamtliche Positionen im Vereinsleben",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    id: "management",
    label: "Management",
    slug: "management",
    description: "Geschäftsstelle, Marketing, Organisation",
    icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    id: "jugend",
    label: "Jugend",
    slug: "jugend",
    description: "Jugendtrainer, Betreuer und Koordinatoren",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    id: "schiedsrichter",
    label: "Schiedsrichter",
    slug: "schiedsrichter",
    description: "Schiedsrichter und Assistenten gesucht",
    icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9",
  },
];

export const jobs: Job[] = [
  // === TRAINER ===
  {
    id: "1",
    titel: "Cheftrainer Herren (Berlin-Liga)",
    verein: "Türkiyemspor Berlin",
    bezirk: "Friedrichshain-Kreuzberg",
    liga: "Berlin-Liga",
    kategorie: "trainer",
    typ: "teilzeit",
    beschreibung:
      "Türkiyemspor Berlin sucht einen ambitionierten Cheftrainer für die erste Herrenmannschaft in der Berlin-Liga. Der Verein befindet sich im Aufbruch und möchte mittelfristig den Aufstieg in die Oberliga schaffen. Du übernimmst eine Mannschaft mit großem Potenzial und einem engagierten Umfeld.",
    anforderungen: [
      "Gültige Trainer-B-Lizenz (Trainer-A von Vorteil)",
      "Erfahrung als Trainer ab Landesliga aufwärts",
      "Taktisches Verständnis und moderne Trainingsmethoden",
      "Kommunikationsstärke und Teamfähigkeit",
      "Identifikation mit dem Verein und der Kiez-Kultur",
    ],
    aufgaben: [
      "Leitung des Trainingsbetriebs (3x pro Woche)",
      "Spielvorbereitung und Matchday-Coaching",
      "Kaderentwicklung und Spielerförderung",
      "Enge Zusammenarbeit mit dem Sportlichen Leiter",
      "Scouting im Berliner Amateurfußball",
    ],
    kontakt: {
      name: "Mehmet Yilmaz",
      email: "sportlich@tuerkiyemspor.de",
      telefon: "030 / 123 456 78",
    },
    verguetung: "Aufwandsentschädigung nach Vereinbarung",
    datum: "2026-02-05T10:00:00Z",
    featured: true,
    tags: ["Trainer", "Berlin-Liga", "Kreuzberg"],
  },
  {
    id: "2",
    titel: "Co-Trainer Oberliga-Mannschaft",
    verein: "Hertha 03 Zehlendorf",
    bezirk: "Steglitz-Zehlendorf",
    liga: "Oberliga NOFV Nord",
    kategorie: "trainer",
    typ: "teilzeit",
    beschreibung:
      "Hertha 03 Zehlendorf sucht einen Co-Trainer zur Unterstützung des Cheftrainers der Oberliga-Mannschaft. Du bist Teil eines motivierten Trainerteams und bringst deine Ideen aktiv ein.",
    anforderungen: [
      "Mindestens Trainer-B-Lizenz",
      "Erfahrung im Berliner Amateurfußball",
      "Analytische Fähigkeiten (Spielanalyse)",
      "Zuverlässigkeit und Einsatzbereitschaft",
    ],
    aufgaben: [
      "Unterstützung bei Training und Spieltag",
      "Videoanalyse und Gegnerbeobachtung",
      "Individuelle Spielerentwicklung",
      "Vertretung des Cheftrainers bei Abwesenheit",
    ],
    kontakt: {
      name: "Stefan Bergmann",
      email: "trainer@hertha03.de",
    },
    verguetung: "400 EUR/Monat",
    datum: "2026-02-03T14:00:00Z",
    tags: ["Co-Trainer", "Oberliga", "Zehlendorf"],
  },
  {
    id: "3",
    titel: "Torwarttrainer für alle Mannschaften",
    verein: "SC Staaken",
    bezirk: "Spandau",
    liga: "Landesliga",
    kategorie: "trainer",
    typ: "minijob",
    beschreibung:
      "Der SC Staaken sucht einen erfahrenen Torwarttrainer, der sowohl die Keeper der ersten Mannschaft als auch die Jugend-Torhüter trainiert. Eine einmalige Chance, den gesamten Torwart-Bereich eines Traditionsvereins zu formen.",
    anforderungen: [
      "Torwarttrainer-Lizenz oder vergleichbare Qualifikation",
      "Eigene Torhüter-Erfahrung",
      "Erfahrung in der Torwart-Ausbildung",
      "Geduld und pädagogisches Geschick",
    ],
    aufgaben: [
      "2x wöchentliches Torwarttraining",
      "Individuelle Trainingspläne erstellen",
      "Spieltagsbetreuung der Torhüter",
      "Sichtung von Nachwuchstorhütern",
    ],
    kontakt: {
      name: "Klaus Richter",
      email: "sport@sc-staaken.de",
      telefon: "030 / 333 444 55",
    },
    verguetung: "520 EUR/Monat (Minijob-Basis)",
    datum: "2026-01-28T09:00:00Z",
    tags: ["Torwarttrainer", "Landesliga", "Spandau"],
  },

  // === SPIELER GESUCHT ===
  {
    id: "4",
    titel: "Verstärkung für den Sturm gesucht",
    verein: "SV Tasmania Berlin",
    bezirk: "Neukölln",
    liga: "Bezirksliga",
    kategorie: "spieler",
    typ: "ehrenamtlich",
    beschreibung:
      "Tasmania Berlin sucht dringend Verstärkung für die Offensive. Wir sind ein Traditionsverein mit tollem Zusammenhalt und suchen torgefährliche Spieler, die unseren Kader verstärken wollen. Probetraining jederzeit möglich!",
    anforderungen: [
      "Spielerpass oder Wechselmöglichkeit",
      "Erfahrung ab Kreisliga aufwärts",
      "Torgefahr und Spielintelligenz",
      "Mannschaftsdienliches Verhalten",
      "Regelmäßige Trainingsteilnahme (2x/Woche)",
    ],
    aufgaben: [
      "Regelmäßige Trainingsteilnahme",
      "Spieleinsatz am Wochenende",
      "Integration ins Mannschaftsgefüge",
    ],
    kontakt: {
      name: "Dirk Baumann",
      email: "spieler@tasmania-berlin.de",
    },
    datum: "2026-02-06T12:00:00Z",
    featured: true,
    tags: ["Spielersuche", "Bezirksliga", "Neukölln", "Sturm"],
  },
  {
    id: "5",
    titel: "Torhüter für die 1. Mannschaft",
    verein: "Berliner SC",
    bezirk: "Charlottenburg-Wilmersdorf",
    liga: "Landesliga",
    kategorie: "spieler",
    typ: "ehrenamtlich",
    beschreibung:
      "Der Berliner SC sucht einen erfahrenen Torhüter als Stammkeeper für die 1. Mannschaft in der Landesliga. Unser bisheriger Keeper hat den Verein verlassen und wir brauchen schnell Ersatz.",
    anforderungen: [
      "Erfahrung als Torhüter ab Bezirksliga",
      "Gültige Spielberechtigung für Berlin",
      "Kommunikationsstärke auf dem Platz",
      "Zuverlässigkeit und Trainingseifer",
    ],
    aufgaben: [
      "Stammtorhüter der 1. Mannschaft",
      "Training 3x pro Woche",
      "Punktspiele am Wochenende",
    ],
    kontakt: {
      name: "Martin Scholz",
      email: "team@berliner-sc.de",
    },
    datum: "2026-02-01T15:00:00Z",
    tags: ["Torhüter", "Landesliga", "Charlottenburg"],
  },

  // === EHRENAMT ===
  {
    id: "6",
    titel: "Kassenwart/in gesucht",
    verein: "BFC Preussen",
    bezirk: "Lichtenberg",
    liga: "Regionalliga Nordost",
    kategorie: "ehrenamt",
    typ: "ehrenamtlich",
    beschreibung:
      "Der BFC Preussen sucht eine/n engagierte/n Kassenwart/in für den Vorstand. Du übernimmst die Finanzverwaltung eines traditionsreichen Berliner Vereins und gestaltest aktiv die Vereinszukunft mit.",
    anforderungen: [
      "Kaufmännische Grundkenntnisse",
      "Erfahrung in Buchhaltung von Vorteil",
      "Sorgfältige und zuverlässige Arbeitsweise",
      "Verbundenheit mit dem Vereinsfußball",
    ],
    aufgaben: [
      "Verwaltung der Vereinsfinanzen",
      "Erstellung des Jahresabschlusses",
      "Mitgliedsbeiträge und Fördermittel verwalten",
      "Teilnahme an Vorstandssitzungen",
    ],
    kontakt: {
      name: "Gerd Flemming",
      email: "vorstand@bfc-preussen.de",
    },
    datum: "2026-02-04T10:00:00Z",
    tags: ["Ehrenamt", "Vorstand", "Kassenwart", "Lichtenberg"],
  },
  {
    id: "7",
    titel: "Platzwart für unsere Sportanlage",
    verein: "Stern 1900",
    bezirk: "Neukölln",
    liga: "Berlin-Liga",
    kategorie: "ehrenamt",
    typ: "minijob",
    beschreibung:
      "Wir suchen einen zuverlässigen Platzwart für unsere Sportanlage in Neukölln. Du sorgst dafür, dass unsere Plätze in Top-Zustand sind und der Spielbetrieb reibungslos läuft.",
    anforderungen: [
      "Handwerkliches Geschick",
      "Zuverlässigkeit und Eigeninitiative",
      "Flexibilität bei den Arbeitszeiten",
      "Verbundenheit mit dem Fußball",
    ],
    aufgaben: [
      "Pflege der Spielflächen und Kabinen",
      "Auf- und Abbau am Spieltag",
      "Kleinere Reparaturen und Instandhaltung",
      "Ansprechpartner für Gastvereine",
    ],
    kontakt: {
      name: "Wolfgang Neumann",
      email: "anlage@stern1900.de",
      telefon: "030 / 555 666 77",
    },
    verguetung: "450 EUR/Monat",
    datum: "2026-01-29T11:00:00Z",
    tags: ["Platzwart", "Ehrenamt", "Neukölln"],
  },

  // === MANAGEMENT ===
  {
    id: "8",
    titel: "Social Media Manager/in",
    verein: "VSG Altglienicke",
    bezirk: "Treptow-Köpenick",
    liga: "Regionalliga Nordost",
    kategorie: "management",
    typ: "minijob",
    beschreibung:
      "Die VSG Altglienicke sucht eine/n kreative/n Social Media Manager/in. Du bist verantwortlich für unsere Präsenz auf Instagram, TikTok und Facebook und bringst den Verein digital nach vorne.",
    anforderungen: [
      "Erfahrung im Social Media Management",
      "Gespür für Trends und Content-Erstellung",
      "Foto- und Videografie-Kenntnisse",
      "Begeisterung für Berliner Fußball",
    ],
    aufgaben: [
      "Content-Planung und -Erstellung",
      "Community Management",
      "Spieltags-Coverage (Live-Content)",
      "Auswertung und Reporting",
    ],
    kontakt: {
      name: "Laura Schreiber",
      email: "marketing@altglienicke.de",
    },
    verguetung: "520 EUR/Monat",
    datum: "2026-02-02T09:00:00Z",
    featured: true,
    tags: ["Social Media", "Marketing", "Treptow-Köpenick"],
  },
  {
    id: "9",
    titel: "Geschäftsstellenleiter/in",
    verein: "Tennis Borussia Berlin",
    bezirk: "Charlottenburg-Wilmersdorf",
    liga: "Oberliga NOFV Nord",
    kategorie: "management",
    typ: "teilzeit",
    beschreibung:
      "Tennis Borussia Berlin sucht eine/n erfahrene/n Geschäftsstellenleiter/in. Du koordinierst den administrativen Betrieb des Vereins und bist zentrale Anlaufstelle für Mitglieder, Partner und Behörden.",
    anforderungen: [
      "Kaufmännische Ausbildung oder Studium",
      "Organisationstalent und Eigenverantwortung",
      "Erfahrung in der Vereinsarbeit von Vorteil",
      "Gute Kommunikationsfähigkeiten",
    ],
    aufgaben: [
      "Leitung der Geschäftsstelle",
      "Mitgliederverwaltung",
      "Korrespondenz mit Verbänden und Behörden",
      "Koordination von Vereinsveranstaltungen",
    ],
    kontakt: {
      name: "Frank Seifert",
      email: "info@tebe.de",
      telefon: "030 / 777 888 99",
    },
    verguetung: "1.200 EUR/Monat",
    datum: "2026-01-30T14:00:00Z",
    tags: ["Geschäftsstelle", "Management", "Charlottenburg"],
  },

  // === JUGEND ===
  {
    id: "10",
    titel: "Jugendkoordinator/in (U8-U15)",
    verein: "Füchse Berlin Reinickendorf",
    bezirk: "Reinickendorf",
    liga: "Bezirksliga",
    kategorie: "jugend",
    typ: "teilzeit",
    beschreibung:
      "Die Füchse Berlin Reinickendorf suchen eine/n engagierte/n Jugendkoordinator/in für den Nachwuchsbereich. Du bist verantwortlich für die sportliche Ausrichtung und Organisation der Jugendmannschaften von der U8 bis zur U15.",
    anforderungen: [
      "Trainer-C-Lizenz (Trainer-B wünschenswert)",
      "Erfahrung in der Jugendarbeit",
      "Pädagogisches Geschick",
      "Organisationsstärke",
      "Erweitertes Führungszeugnis",
    ],
    aufgaben: [
      "Koordination der Jugendtrainer",
      "Erstellung von Trainingsplänen und Leitlinien",
      "Organisation von Turnieren und Camps",
      "Elternkommunikation",
      "Sichtung und Talentförderung",
    ],
    kontakt: {
      name: "Birgit Hartmann",
      email: "jugend@fuechse-reinickendorf.de",
    },
    verguetung: "800 EUR/Monat",
    datum: "2026-02-01T10:00:00Z",
    tags: ["Jugend", "Koordinator", "Reinickendorf"],
  },
  {
    id: "11",
    titel: "Betreuer/in für D-Jugend",
    verein: "Croatia Berlin",
    bezirk: "Neukölln",
    liga: "Kreisliga",
    kategorie: "jugend",
    typ: "ehrenamtlich",
    beschreibung:
      "Croatia Berlin sucht eine/n zuverlässige/n Betreuer/in für die D-Jugend. Du unterstützt den Trainer bei Training und Spieltag und bist Ansprechpartner/in für Kinder und Eltern.",
    anforderungen: [
      "Freude am Umgang mit Kindern",
      "Zuverlässigkeit und Pünktlichkeit",
      "Erste-Hilfe-Kenntnisse von Vorteil",
      "Erweitertes Führungszeugnis",
    ],
    aufgaben: [
      "Betreuung bei Training und Spielen",
      "An- und Abwesenheitslisten führen",
      "Elternkommunikation",
      "Unterstützung bei Fahrten zu Auswärtsspielen",
    ],
    kontakt: {
      name: "Ivan Kovac",
      email: "jugend@croatia-berlin.de",
    },
    datum: "2026-01-27T16:00:00Z",
    tags: ["Jugend", "Betreuer", "D-Jugend", "Neukölln"],
  },

  // === SCHIEDSRICHTER ===
  {
    id: "12",
    titel: "Schiedsrichter-Neulinge gesucht",
    verein: "Berliner Fußball-Verband",
    bezirk: "Mitte",
    kategorie: "schiedsrichter",
    typ: "minijob",
    beschreibung:
      "Der Berliner Fußball-Verband sucht neue Schiedsrichter/innen! Du pfeifst Spiele im Berliner Amateurfußball und wirst dafür vergütet. Keine Vorkenntnisse nötig – wir bilden dich aus. Mindestalter 14 Jahre.",
    anforderungen: [
      "Mindestalter 14 Jahre",
      "Interesse am Fußball",
      "Sportliche Fitness",
      "Durchsetzungsvermögen",
      "Bereitschaft zur Wochenend-Tätigkeit",
    ],
    aufgaben: [
      "Leitung von Fußballspielen",
      "Teilnahme an der Schiedsrichter-Ausbildung",
      "Regelmäßige Regelkunde-Abende",
      "Aufstiegsmöglichkeit in höhere Spielklassen",
    ],
    kontakt: {
      name: "Bernd Schulz",
      email: "schiedsrichter@berliner-fv.de",
      telefon: "030 / 896 994 0",
    },
    verguetung: "25-60 EUR pro Spielleitung",
    datum: "2026-02-06T08:00:00Z",
    featured: true,
    tags: ["Schiedsrichter", "BFV", "Ausbildung"],
  },
  {
    id: "13",
    titel: "Schiedsrichter-Assistent/in für Oberliga",
    verein: "Berliner Fußball-Verband",
    bezirk: "Mitte",
    liga: "Oberliga NOFV Nord",
    kategorie: "schiedsrichter",
    typ: "minijob",
    beschreibung:
      "Für die Oberliga-Spiele in Berlin sucht der BFV erfahrene Schiedsrichter-Assistenten. Du unterstützt den Referee bei der Spielleitung und trägst zu fairen Spielen bei.",
    anforderungen: [
      "Aktive Schiedsrichter-Tätigkeit seit mind. 2 Jahren",
      "Einsatz ab Landesliga aufwärts",
      "Gute körperliche Fitness (FIFA-Fitnesstest)",
      "Bereitschaft zu Feedback und Weiterentwicklung",
    ],
    aufgaben: [
      "Assistenz bei Oberliga-Spielen",
      "Abseits- und Seitenlinienentscheidungen",
      "Zusammenarbeit im Schiedsrichter-Team",
      "Regelmäßige Lehrabende",
    ],
    kontakt: {
      name: "Bernd Schulz",
      email: "schiedsrichter@berliner-fv.de",
    },
    verguetung: "40-80 EUR pro Einsatz",
    datum: "2026-01-25T10:00:00Z",
    tags: ["Schiedsrichter", "Assistent", "Oberliga"],
  },

  // === WEITERE ===
  {
    id: "14",
    titel: "Mannschaftsarzt (ehrenamtlich)",
    verein: "BFC Dynamo",
    bezirk: "Lichtenberg",
    liga: "Regionalliga Nordost",
    kategorie: "ehrenamt",
    typ: "ehrenamtlich",
    beschreibung:
      "Der BFC Dynamo sucht einen Mannschaftsarzt zur medizinischen Betreuung der 1. Mannschaft. Du betreust die Spieler bei Heimspielen und bist Ansprechpartner für medizinische Fragen.",
    anforderungen: [
      "Approbation als Arzt/Ärztin",
      "Sportmedizinische Kenntnisse von Vorteil",
      "Erfahrung in der Notfallmedizin",
      "Verfügbarkeit an Spieltagen (Sa/So)",
    ],
    aufgaben: [
      "Medizinische Betreuung am Spieltag",
      "Erstversorgung bei Verletzungen",
      "Beratung zu Prävention und Regeneration",
      "Zusammenarbeit mit dem Physio-Team",
    ],
    kontakt: {
      name: "Dr. Thomas Krüger",
      email: "medizin@bfc-dynamo.de",
    },
    datum: "2026-01-31T12:00:00Z",
    tags: ["Mannschaftsarzt", "Ehrenamt", "Regionalliga"],
  },
  {
    id: "15",
    titel: "Frauen-Mannschaft sucht Spielerinnen",
    verein: "Viktoria Berlin",
    bezirk: "Lichtenberg",
    liga: "Frauen Berlin-Liga",
    kategorie: "spieler",
    typ: "ehrenamtlich",
    beschreibung:
      "Viktoria Berlin baut eine neue Frauen-Mannschaft auf und sucht Spielerinnen aller Positionen. Ob Anfängerin oder erfahrene Kickerin – bei uns bist du willkommen! Training ist zweimal pro Woche auf unserer Sportanlage in Lichtenberg.",
    anforderungen: [
      "Spaß am Fußball",
      "Mindestalter 16 Jahre",
      "Regelmäßige Trainingsteilnahme",
      "Teamgeist und Motivation",
    ],
    aufgaben: [
      "Training 2x pro Woche",
      "Spielbetrieb am Wochenende",
      "Mitgestaltung des Mannschaftslebens",
    ],
    kontakt: {
      name: "Sarah Lindner",
      email: "frauen@viktoria-berlin.de",
    },
    datum: "2026-02-04T16:00:00Z",
    tags: ["Frauen", "Spielerinnen", "Lichtenberg", "Neuaufbau"],
  },
  {
    id: "16",
    titel: "Trainer/in für Mädchen-Mannschaft (U13)",
    verein: "Sparta Lichtenberg",
    bezirk: "Lichtenberg",
    liga: "Kreisliga",
    kategorie: "jugend",
    typ: "ehrenamtlich",
    beschreibung:
      "Sparta Lichtenberg sucht eine/n Trainer/in für die U13-Mädchenmannschaft. Wir sind ein familiärer Verein und freuen uns über motivierte Menschen, die den Mädchenfußball in Berlin voranbringen wollen.",
    anforderungen: [
      "Trainer-C-Lizenz (oder Bereitschaft zum Erwerb)",
      "Begeisterung für Mädchen-/Frauenfußball",
      "Pädagogisches Geschick",
      "Erweitertes Führungszeugnis",
    ],
    aufgaben: [
      "Leitung des Trainings (2x/Woche)",
      "Betreuung am Spieltag",
      "Talentförderung und Spielerentwicklung",
      "Koordination mit der Jugendleitung",
    ],
    kontakt: {
      name: "Katja Mertens",
      email: "maedchen@sparta-lichtenberg.de",
    },
    datum: "2026-01-26T09:00:00Z",
    tags: ["Mädchenfußball", "U13", "Trainer", "Lichtenberg"],
  },
];

// Helper-Funktionen
export function getJobById(id: string): Job | undefined {
  return jobs.find((j) => j.id === id);
}

export function getJobsByCategory(kategorie: JobKategorie): Job[] {
  return jobs.filter((j) => j.kategorie === kategorie);
}

export function getJobsByBezirk(bezirk: string): Job[] {
  return jobs.filter((j) => j.bezirk === bezirk);
}

export function getJobsByTyp(typ: JobTyp): Job[] {
  return jobs.filter((j) => j.typ === typ);
}

export function getFeaturedJobs(): Job[] {
  return jobs.filter((j) => j.featured);
}

export function getLatestJobs(limit: number = 10): Job[] {
  return [...jobs]
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
    .slice(0, limit);
}

export function getAllJobIds(): string[] {
  return jobs.map((j) => j.id);
}

export function getCategoryBySlug(slug: string): JobCategory | undefined {
  return JOB_KATEGORIEN.find((k) => k.slug === slug);
}

export function searchJobs(query: string): Job[] {
  const q = query.toLowerCase();
  return jobs.filter(
    (j) =>
      j.titel.toLowerCase().includes(q) ||
      j.verein.toLowerCase().includes(q) ||
      j.bezirk.toLowerCase().includes(q) ||
      j.beschreibung.toLowerCase().includes(q) ||
      (j.tags && j.tags.some((t) => t.toLowerCase().includes(q)))
  );
}

export function filterJobs(filters: {
  kategorie?: JobKategorie;
  bezirk?: string;
  typ?: JobTyp;
  query?: string;
}): Job[] {
  let result = [...jobs];

  if (filters.kategorie) {
    result = result.filter((j) => j.kategorie === filters.kategorie);
  }
  if (filters.bezirk) {
    result = result.filter((j) => j.bezirk === filters.bezirk);
  }
  if (filters.typ) {
    result = result.filter((j) => j.typ === filters.typ);
  }
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (j) =>
        j.titel.toLowerCase().includes(q) ||
        j.verein.toLowerCase().includes(q) ||
        j.beschreibung.toLowerCase().includes(q)
    );
  }

  return result.sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );
}

export function formatJobDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Heute";
  if (diffDays === 1) return "Gestern";
  if (diffDays < 7) return `Vor ${diffDays} Tagen`;
  if (diffDays < 14) return "Vor 1 Woche";
  if (diffDays < 30) return `Vor ${Math.floor(diffDays / 7)} Wochen`;
  return formatJobDate(dateString);
}
