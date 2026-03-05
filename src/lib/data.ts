import { Artikel, Liga, LIGEN } from "./types";

// Unsplash Fußball-Bilder
const IMAGES = {
  stadion: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600",
  action: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1600",
  fans: "https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1600",
  rasen: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600",
  tor: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1600",
  ball: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1600",
  flutlicht: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1600",
  derby: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600",
  training: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1600",
};

export const artikel: Artikel[] = [
  // === BUNDESLIGA (5 Artikel) ===
  {
    id: "1",
    titel: "Stürmer-Spektakel aus dem Lehrbuch",
    slug: "stuermer-spektakel-union-frankfurt",
    teaser: "Der Sieg des 1. FC Union in Frankfurt entspringt einer taktischen Meisterleistung. Ein Triumph in ungeahnter Dimension.",
    bild: { url: IMAGES.action, alt: "Union Berlin Spielszene", credit: "Foto: Koch" },
    datum: "2025-02-03T10:00:00Z",
    kategorie: "spielbericht",
    ligaId: "bundesliga-1",
    autor: { name: "Robert Klein" },
    lesedauer: 6,
    featured: true,
    tags: ["1. FC Union Berlin", "Eintracht Frankfurt", "Bundesliga"],
  },
  {
    id: "2",
    titel: "Aufstiegskampf spitzt sich zu",
    slug: "aufstiegskampf-bundesliga",
    teaser: "Drei Punkte trennen die Top 5 der Tabelle. Der Saisonendspurt verspricht Spannung pur.",
    bild: { url: IMAGES.flutlicht, alt: "Bundesliga Flutlicht", credit: "Foto: Meyer" },
    datum: "2025-02-02T14:00:00Z",
    kategorie: "analyse",
    ligaId: "bundesliga-1",
    autor: { name: "Lisa Schmidt" },
    lesedauer: 4,
    tags: ["Bundesliga", "Tabelle", "Aufstiegskampf"],
  },
  {
    id: "3",
    titel: "Trainer nach Niederlage unter Druck",
    slug: "trainer-unter-druck-bundesliga",
    teaser: "Nach der dritten Pleite in Folge wackelt der Stuhl des Übungsleiters.",
    bild: { url: IMAGES.rasen, alt: "Spielfeld", credit: "Foto: Weber" },
    datum: "2025-02-01T18:00:00Z",
    kategorie: "news",
    ligaId: "bundesliga-1",
    autor: { name: "Thomas Müller" },
    lesedauer: 3,
    tags: ["Bundesliga", "Trainer"],
  },
  {
    id: "4",
    titel: "Neuzugang überzeugt beim Debüt",
    slug: "neuzugang-debuet-bundesliga",
    teaser: "Der Winter-Transfer zeigt sofort, warum der Verein tief in die Tasche gegriffen hat.",
    bild: { url: IMAGES.ball, alt: "Fußball", credit: "Foto: Schulz" },
    datum: "2025-01-31T12:00:00Z",
    kategorie: "spielbericht",
    ligaId: "bundesliga-1",
    autor: { name: "Anna Becker" },
    lesedauer: 5,
    tags: ["Bundesliga", "Transfer", "Neuzugang"],
  },
  {
    id: "5",
    titel: "Rekordtransfer vor dem Absprung",
    slug: "rekordtransfer-bundesliga",
    teaser: "Gerüchte um einen Wechsel nach England verdichten sich. Ablöse könnte 50 Millionen übersteigen.",
    bild: { url: IMAGES.stadion, alt: "Stadion", credit: "Foto: Richter" },
    datum: "2025-01-30T09:00:00Z",
    kategorie: "transfer",
    ligaId: "bundesliga-1",
    autor: { name: "Max Hoffmann" },
    lesedauer: 4,
    tags: ["Bundesliga", "Transfer", "Premier League"],
  },

  // === 2. BUNDESLIGA (5 Artikel) ===
  {
    id: "6",
    titel: "Der Abstiegszone gefährlich nah",
    slug: "hertha-abstiegszone-heimschwaeche",
    teaser: "Ohne Überwindung der Heimschwäche wird Hertha BSC nicht oben mitspielen können.",
    bild: { url: IMAGES.stadion, alt: "Olympiastadion Berlin", credit: "Foto: Winter" },
    datum: "2025-02-02T14:00:00Z",
    kategorie: "analyse",
    ligaId: "bundesliga-2",
    autor: { name: "Karsten Doneck" },
    lesedauer: 5,
    tags: ["Hertha BSC", "2. Bundesliga", "Berlin", "Olympiastadion"],
  },
  {
    id: "7",
    titel: "Derbysieg befeuert Aufstiegshoffnung",
    slug: "derbysieg-zweite-liga",
    teaser: "Mit dem prestigeträchtigen Erfolg klettert das Team auf Platz drei der Tabelle.",
    bild: { url: IMAGES.fans, alt: "Derbysieg Jubel", credit: "Foto: Koch" },
    datum: "2025-02-01T20:00:00Z",
    kategorie: "spielbericht",
    ligaId: "bundesliga-2",
    autor: { name: "Michael Braun" },
    lesedauer: 4,
    tags: ["2. Bundesliga", "Derby", "Aufstieg"],
  },
  {
    id: "8",
    titel: "Kapitän verlängert bis 2028",
    slug: "kapitaen-verlaengert-zweite-liga",
    teaser: "Der Führungsspieler bekennt sich zum Verein und unterschreibt einen neuen Dreijahresvertrag.",
    bild: { url: IMAGES.action, alt: "Spielszene", credit: "Foto: Richter" },
    datum: "2025-01-30T10:00:00Z",
    kategorie: "transfer",
    ligaId: "bundesliga-2",
    autor: { name: "Sandra Klein" },
    lesedauer: 3,
    tags: ["2. Bundesliga", "Vertrag", "Kapitän"],
  },
  {
    id: "9",
    titel: "Torjäger meldet sich fit zurück",
    slug: "torjaeger-fit-zweite-liga",
    teaser: "Nach wochenlanger Verletzungspause steht der Goalgetter vor dem Comeback.",
    bild: { url: IMAGES.tor, alt: "Tornetz", credit: "Foto: Berger" },
    datum: "2025-01-29T16:00:00Z",
    kategorie: "news",
    ligaId: "bundesliga-2",
    autor: { name: "Peter Hoffmann" },
    lesedauer: 2,
    tags: ["2. Bundesliga", "Comeback", "Verletzung"],
  },
  {
    id: "10",
    titel: "Stadion-Neubau endlich genehmigt",
    slug: "stadion-neubau-zweite-liga",
    teaser: "Nach jahrelangem Ringen gibt die Stadt grünes Licht für die neue Arena.",
    bild: { url: IMAGES.flutlicht, alt: "Flutlicht", credit: "Foto: Lang" },
    datum: "2025-01-28T11:00:00Z",
    kategorie: "news",
    ligaId: "bundesliga-2",
    autor: { name: "Claudia Weber" },
    lesedauer: 4,
    tags: ["2. Bundesliga", "Stadion", "Neubau"],
  },

  // === 3. LIGA (5 Artikel) ===
  {
    id: "11",
    titel: "Tabellenführer patzt überraschend",
    slug: "tabellenfuehrer-patzt-dritte-liga",
    teaser: "Der Spitzenreiter verliert erstmals seit zehn Spielen und die Verfolger wittern ihre Chance.",
    bild: { url: IMAGES.action, alt: "3. Liga Action", credit: "Foto: Schmidt" },
    datum: "2025-02-03T15:00:00Z",
    kategorie: "spielbericht",
    ligaId: "liga-3",
    autor: { name: "Frank Weber" },
    lesedauer: 4,
    tags: ["3. Liga", "Tabellenführer", "Überraschung"],
  },
  {
    id: "12",
    titel: "Aufsteiger überrascht die Liga",
    slug: "aufsteiger-ueberrascht-dritte-liga",
    teaser: "Der Neuling mischt die Konkurrenz auf und steht sensationell auf einem Aufstiegsplatz.",
    bild: { url: IMAGES.fans, alt: "Aufsteiger Fans", credit: "Foto: Lange" },
    datum: "2025-02-02T12:00:00Z",
    kategorie: "analyse",
    ligaId: "liga-3",
    autor: { name: "Julia Hartmann" },
    lesedauer: 5,
    tags: ["3. Liga", "Aufsteiger", "Aufstieg"],
  },
  {
    id: "13",
    titel: "Nachwuchstalent feiert Profidebüt",
    slug: "nachwuchstalent-dritte-liga",
    teaser: "Mit 17 Jahren steht der Youngster erstmals in der Startelf und liefert sofort ab.",
    bild: { url: IMAGES.ball, alt: "Fußball Close-up", credit: "Foto: Krause" },
    datum: "2025-02-01T14:00:00Z",
    kategorie: "news",
    ligaId: "liga-3",
    autor: { name: "Markus Fischer" },
    lesedauer: 3,
    tags: ["3. Liga", "Nachwuchs", "Debüt"],
  },
  {
    id: "14",
    titel: "Stadionausbau wird konkreter",
    slug: "stadionausbau-dritte-liga",
    teaser: "Die Pläne für die Erweiterung der Arena nehmen Form an. Baubeginn soll 2026 sein.",
    bild: { url: IMAGES.stadion, alt: "Stadion", credit: "Foto: Wolf" },
    datum: "2025-01-31T09:00:00Z",
    kategorie: "news",
    ligaId: "liga-3",
    autor: { name: "Claudia Neumann" },
    lesedauer: 4,
    tags: ["3. Liga", "Stadion", "Ausbau"],
  },
  {
    id: "15",
    titel: "Elfmeterkiller hält Sieg fest",
    slug: "elfmeterkiller-dritte-liga",
    teaser: "Der Keeper pariert zwei Strafstöße und sichert seinem Team drei wichtige Punkte.",
    bild: { url: IMAGES.tor, alt: "Torwart", credit: "Foto: Engel" },
    datum: "2025-01-30T18:00:00Z",
    kategorie: "spielbericht",
    ligaId: "liga-3",
    autor: { name: "Stefan Roth" },
    lesedauer: 3,
    tags: ["3. Liga", "Torwart", "Elfmeter"],
  },

  // === REGIONALLIGA NORDOST (5 Artikel) ===
  {
    id: "16",
    titel: "Altglienicke schiebt sich immer weiter vor",
    slug: "altglienicke-tabellenspitze-regionalliga",
    teaser: "Heimlich, still und gar nicht leise pirscht sich die VSG an die Ligaspitze heran.",
    bild: { url: IMAGES.rasen, alt: "VSG Altglienicke", credit: "Foto: Kellner" },
    datum: "2025-02-01T16:00:00Z",
    kategorie: "analyse",
    ligaId: "regionalliga-nordost",
    autor: { name: "Harri Ramin" },
    lesedauer: 4,
    tags: ["VSG Altglienicke", "Regionalliga", "Berlin"],
  },
  {
    id: "17",
    titel: "BFC Preussen sorgt für Furore",
    slug: "bfc-preussen-regionalliga",
    teaser: "Der Aufsteiger gewinnt das dritte Spiel in Folge und etabliert sich im oberen Tabellendrittel.",
    bild: { url: IMAGES.fans, alt: "BFC Preussen Fans", credit: "Foto: Schulze" },
    datum: "2025-01-31T18:00:00Z",
    kategorie: "spielbericht",
    ligaId: "regionalliga-nordost",
    autor: { name: "Dirk Baumann" },
    lesedauer: 3,
    tags: ["BFC Preussen", "Regionalliga", "Berlin"],
  },
  {
    id: "18",
    titel: "Lok Leipzig verteidigt Tabellenführung",
    slug: "lok-leipzig-regionalliga",
    teaser: "Der Titelverteidiger lässt nichts anbrennen und baut den Vorsprung aus.",
    bild: { url: IMAGES.action, alt: "Lok Leipzig", credit: "Foto: Friedrich" },
    datum: "2025-01-30T20:00:00Z",
    kategorie: "spielbericht",
    ligaId: "regionalliga-nordost",
    autor: { name: "Steffen Krug" },
    lesedauer: 4,
    tags: ["1. FC Lok Leipzig", "Regionalliga", "Tabellenführer"],
  },
  {
    id: "19",
    titel: "Transfercoup für Berliner Verein",
    slug: "transfercoup-regionalliga",
    teaser: "Ein ehemaliger Zweitligaspieler wechselt in die Regionalliga und sorgt für Aufsehen.",
    bild: { url: IMAGES.flutlicht, alt: "Flutlicht Abend", credit: "Foto: Engel" },
    datum: "2025-01-29T11:00:00Z",
    kategorie: "transfer",
    ligaId: "regionalliga-nordost",
    autor: { name: "Nina Vogel" },
    lesedauer: 3,
    tags: ["Regionalliga", "Transfer", "Berlin"],
  },
  {
    id: "20",
    titel: "Hallescher FC in der Krise",
    slug: "halle-krise-regionalliga",
    teaser: "Nach drei Niederlagen in Serie gerät der Favorit ins Straucheln. Trainer zählt das Team an.",
    bild: { url: IMAGES.stadion, alt: "Halle Stadion", credit: "Foto: Meier" },
    datum: "2025-01-28T14:00:00Z",
    kategorie: "analyse",
    ligaId: "regionalliga-nordost",
    autor: { name: "Jens Lehmann" },
    lesedauer: 5,
    tags: ["Hallescher FC", "Regionalliga", "Krise"],
  },

  // === OBERLIGA NOFV NORD (5 Artikel) ===
  {
    id: "21",
    titel: "Die Sache mit dem glücklichen Händchen",
    slug: "hertha-03-zwickau-oberliga",
    teaser: "Der zur Pause eingewechselte von Baer benötigt nur vier Minuten für den Siegtreffer.",
    bild: { url: IMAGES.tor, alt: "Oberliga Spiel", credit: "Foto: Koch" },
    datum: "2025-01-31T18:00:00Z",
    kategorie: "spielbericht",
    ligaId: "oberliga-nofv-nord",
    autor: { name: "Matthias Schütt" },
    lesedauer: 3,
    tags: ["Hertha 03 Zehlendorf", "Oberliga", "Berlin"],
  },
  {
    id: "22",
    titel: "Abstiegskampf wird zur Nervenschlacht",
    slug: "abstiegskampf-oberliga",
    teaser: "Im Tabellenkeller trennen nur vier Punkte sechs Mannschaften. Jedes Spiel zählt.",
    bild: { url: IMAGES.fans, alt: "Oberliga Fans", credit: "Foto: Hartwig" },
    datum: "2025-01-30T14:00:00Z",
    kategorie: "analyse",
    ligaId: "oberliga-nofv-nord",
    autor: { name: "Oliver Thiel" },
    lesedauer: 5,
    tags: ["Oberliga", "Abstiegskampf"],
  },
  {
    id: "23",
    titel: "Spielertrainer übernimmt Verantwortung",
    slug: "spielertrainer-oberliga",
    teaser: "Nach der Trennung vom Coach springt ein Routinier als Interimslösung ein.",
    bild: { url: IMAGES.ball, alt: "Fußball", credit: "Foto: Berger" },
    datum: "2025-01-29T10:00:00Z",
    kategorie: "news",
    ligaId: "oberliga-nofv-nord",
    autor: { name: "Carsten Wolff" },
    lesedauer: 3,
    tags: ["Oberliga", "Trainer", "Spielertrainer"],
  },
  {
    id: "24",
    titel: "Pokalüberraschung bahnt sich an",
    slug: "pokalueberraschung-oberliga",
    teaser: "Der Underdog steht überraschend im Halbfinale des Landespokals.",
    bild: { url: IMAGES.action, alt: "Pokaljubel", credit: "Foto: Seidel" },
    datum: "2025-01-28T17:00:00Z",
    kategorie: "spielbericht",
    ligaId: "oberliga-nofv-nord",
    autor: { name: "Ralf Köhler" },
    lesedauer: 4,
    tags: ["Oberliga", "Landespokal", "Pokal"],
  },
  {
    id: "25",
    titel: "Traditionsverein kämpft ums Überleben",
    slug: "traditionsverein-oberliga",
    teaser: "Finanzielle Probleme zwingen den Klub zu drastischen Maßnahmen. Fans starten Spendenaktion.",
    bild: { url: IMAGES.flutlicht, alt: "Flutlicht Stadion", credit: "Foto: Lange" },
    datum: "2025-01-27T12:00:00Z",
    kategorie: "news",
    ligaId: "oberliga-nofv-nord",
    autor: { name: "Bernd Schneider" },
    lesedauer: 6,
    tags: ["Oberliga", "Finanzen", "Fans"],
  },

  // === BERLIN-LIGA (5 Artikel) ===
  {
    id: "26",
    titel: "Stabile Defensive und ein Doppel-Härtel",
    slug: "makkabi-neustrelitz-berlin-liga",
    teaser: "Neustrelitz bringt Makkabi eine Heimniederlage bei – eine Lehrstunde für den Gastgeber.",
    bild: { url: IMAGES.rasen, alt: "Berlin-Liga Spielfeld", credit: "Foto: dedepress" },
    datum: "2025-01-30T15:00:00Z",
    kategorie: "spielbericht",
    ligaId: "berlin-liga",
    autor: { name: "Matthias Schütt" },
    lesedauer: 3,
    tags: ["TuS Makkabi Berlin", "TSV 1860 Neustrelitz", "Berlin-Liga"],
  },
  {
    id: "27",
    titel: "Türkiyemspor zurück auf Kurs",
    slug: "tuerkiyemspor-berlin-liga",
    teaser: "Nach schwachem Saisonstart findet der Traditionsverein zurück in die Spur.",
    bild: { url: IMAGES.action, alt: "Türkiyemspor", credit: "Foto: Yilmaz" },
    datum: "2025-01-29T19:00:00Z",
    kategorie: "analyse",
    ligaId: "berlin-liga",
    autor: { name: "Deniz Özkan" },
    lesedauer: 4,
    tags: ["Türkiyemspor Berlin", "Berlin-Liga", "Kreuzberg"],
  },
  {
    id: "28",
    titel: "Lokalrivalen liefern packendes Derby",
    slug: "derby-berlin-liga",
    teaser: "Vor ausverkauftem Haus trennen sich die Nachbarn nach einem Spektakel unentschieden.",
    bild: { url: IMAGES.fans, alt: "Derby Berlin Fans", credit: "Foto: Schneider" },
    datum: "2025-01-28T14:00:00Z",
    kategorie: "spielbericht",
    ligaId: "berlin-liga",
    autor: { name: "Jan Westphal" },
    lesedauer: 5,
    tags: ["Berlin-Liga", "Derby", "Berlin"],
  },
  {
    id: "29",
    titel: "Jugendarbeit trägt Früchte",
    slug: "jugendarbeit-berlin-liga",
    teaser: "Gleich drei Eigengewächse schaffen den Sprung in die erste Mannschaft.",
    bild: { url: IMAGES.ball, alt: "Fußball Nachwuchs", credit: "Foto: Krüger" },
    datum: "2025-01-27T11:00:00Z",
    kategorie: "news",
    ligaId: "berlin-liga",
    autor: { name: "Lena Hoffmann" },
    lesedauer: 3,
    tags: ["Berlin-Liga", "Nachwuchs", "Jugend"],
  },
  {
    id: "30",
    titel: "Spitzenreiter mit weißer Weste",
    slug: "spitzenreiter-berlin-liga",
    teaser: "Zehn Siege in zehn Spielen: Der Tabellenführer scheint unaufhaltsam auf dem Weg zum Titel.",
    bild: { url: IMAGES.tor, alt: "Tornetz", credit: "Foto: Hartmann" },
    datum: "2025-01-26T16:00:00Z",
    kategorie: "analyse",
    ligaId: "berlin-liga",
    autor: { name: "Sven Müller" },
    lesedauer: 4,
    tags: ["Berlin-Liga", "Tabellenführer", "Meisterschaft"],
  },

  // === NEUE ARTIKEL MIT VOLLEM INHALT (31-36) ===
  {
    id: "31",
    titel: "BFC Dynamo feiert Derbysieg gegen den BAK",
    slug: "bfc-dynamo-derbysieg-bak",
    teaser: "Vor über 2.000 Zuschauern im Sportforum setzt sich der BFC Dynamo mit 3:1 gegen den Berliner AK durch. Ein emotionales Derby, das erst in der zweiten Halbzeit entschieden wird. Die Weinroten klettern damit auf Platz drei der Berlin-Liga.",
    inhalt: `Das Sportforum in Hohenschönhausen bebte. Schon eine Stunde vor dem Anpfiff strömten die Fans durch die Tore, die Bratwurststände waren umlagert, und aus den Lautsprechern dröhnte der Vereinssong. Es war Derby-Tag — BFC Dynamo gegen den Berliner AK — und die Vorfreude war mit Händen zu greifen.

Die erste Halbzeit gehörte zunächst den Gästen. Der BAK spielte mutig nach vorne und belohnte sich in der 23. Minute: Nach einer Ecke von der rechten Seite stieg Innenverteidiger Krause am höchsten und köpfte zum 0:1 ein. Die BFC-Fans verstummten für einen Moment, doch die Mannschaft reagierte stark. Kurz vor der Pause erzielte Stürmer Weiß nach einem sehenswerten Doppelpass den verdienten Ausgleich.

In der Kabine schwor Trainer Voigt seine Mannschaft ein: „Wir spielen zu Hause, das hier ist unser Wohnzimmer. Zeigt das auf dem Platz!" Die Ansprache wirkte. Ab der 55. Minute dominierte der BFC das Geschehen. Das 2:1 fiel durch einen direkt verwandelten Freistoß von Kapitän Reinhardt — ein Kunstwerk aus 22 Metern in den linken Winkel. Der Torschrei hallte durch ganz Lichtenberg.

Als der eingewechselte Nachwuchsspieler Petrov in der 82. Minute das 3:1 erzielte, brachen alle Dämme. Der 18-Jährige rutschte auf Knien über den Rasen, seine Mitspieler warfen sich auf ihn. Es war sein erstes Tor für die erste Mannschaft und was für eines — ein Solo über 30 Meter, vorbei an zwei Gegenspielern, trocken ins kurze Eck.

„Das war Berlin-Liga pur", sagte BFC-Trainer Voigt sichtlich bewegt nach dem Spiel. „Die Atmosphäre, die Emotionen, der Kampfgeist — dafür lieben wir diesen Sport." Mit dem Dreier klettert der BFC auf Rang drei. Der BAK hingegen muss die vierte Niederlage in Folge verdauen und rutscht im Klassement weiter ab.`,
    bild: { url: IMAGES.derby, alt: "Derby im Sportforum", credit: "Foto: Langhammer" },
    datum: "2026-02-28T18:00:00Z",
    kategorie: "spielbericht",
    ligaId: "berlin-liga",
    autor: { name: "Matthias Schütt", bild: "https://placehold.co/80x80/1F1F1F/white?text=MS" },
    lesedauer: 5,
    tags: ["BFC Dynamo", "Berliner AK", "Berlin-Liga", "Derby"],
    vereinIds: ["bfc-dynamo"],
  },
  {
    id: "32",
    titel: "Rückrunden-Analyse: Wer steigt in die Oberliga auf?",
    slug: "rueckrunden-analyse-berlin-liga-aufstieg",
    teaser: "Die Berlin-Liga bietet in dieser Saison einen packenden Aufstiegskampf. Altglienicke, BFC Dynamo und Tennis Borussia liefern sich ein Kopf-an-Kopf-Rennen. Wir analysieren die Stärken und Schwächen der drei Top-Teams und wagen eine Prognose.",
    inhalt: `Die Winterpause ist vorbei und die Berlin-Liga startet in eine entscheidende Rückrunde. Drei Teams haben sich an der Tabellenspitze abgesetzt und machen den Aufstieg in die Oberliga unter sich aus. Wir nehmen die Favoriten unter die Lupe.

VSG Altglienicke führt die Tabelle mit drei Punkten Vorsprung an. Der Trumpf der Mannschaft aus Treptow-Köpenick: die beste Defensive der Liga mit nur 14 Gegentoren. Trainer Claus Dieter Wollitz hat ein System installiert, das auf Stabilität und schnelles Umschalten setzt. Die Schwäche? Gegen tiefstehende Gegner fehlt oft die kreative Lösung im letzten Drittel.

Der BFC Dynamo hat in der Hinrunde die meisten Tore aller Teams erzielt — 48 Treffer in 17 Spielen sprechen eine deutliche Sprache. Angeführt von Torjäger Reinhardt, der bereits 16 Mal getroffen hat, ist die Offensive des BFC eine Wucht. Die Achillesferse bleibt die Auswärtsschwäche: Nur drei Siege in neun Partien auf fremdem Platz.

Tennis Borussia überrascht diese Saison auf ganzer Linie. Die Veilchen aus Charlottenburg haben die längste Serie der Liga — acht Spiele ungeschlagen. Coach Berkhan hat aus einer jungen Truppe ein eingespieltes Team geformt, das vor allem durch Leidenschaft besticht. Ob die schmale Kaderbreite bis zum Saisonende reicht, bleibt die große Frage.

Unsere Prognose: Altglienicke hat die besten Karten, doch der BFC könnte im direkten Duell am 15. März alles auf den Kopf stellen. TeBe bleibt der Joker, der für eine Überraschung gut ist. Eines ist sicher — diese Rückrunde wird nichts für schwache Nerven.`,
    bild: { url: IMAGES.rasen, alt: "Berlin-Liga Spielfeld", credit: "Foto: Kellner" },
    datum: "2026-02-25T10:00:00Z",
    kategorie: "analyse",
    ligaId: "berlin-liga",
    autor: { name: "Harri Ramin", bild: "https://placehold.co/80x80/044110/white?text=HR" },
    lesedauer: 6,
    tags: ["Berlin-Liga", "Aufstieg", "VSG Altglienicke", "BFC Dynamo", "Tennis Borussia"],
    vereinIds: ["altglienicke", "bfc-dynamo", "tebe"],
  },
  {
    id: "33",
    titel: "Türkiyemspor verpflichtet Ex-Herthaner Selke",
    slug: "tuerkiyemspor-transfer-selke",
    teaser: "Transferhammer in der Berlin-Liga: Türkiyemspor Berlin gibt die Verpflichtung von Davit Selke bekannt. Der ehemalige Bundesligaspieler unterschreibt bis Saisonende in Kreuzberg. Ein Signal an die gesamte Liga.",
    inhalt: `Es ist der Transfer-Knaller des Winters in der Berlin-Liga. Türkiyemspor Berlin hat die Verpflichtung von Davit Selke bekannt gegeben. Der 31-jährige Stürmer, der in der Bundesliga für Werder Bremen, Hertha BSC und den 1. FC Köln auflief, schließt sich dem Kreuzberger Traditionsverein bis zum Saisonende an.

„Davit kennt Berlin, er kennt den Berliner Fußball", sagte Türkiyemspor-Vorsitzender Erkan Yilmaz bei der Vorstellung im Katzbachstadion. „Er bringt nicht nur Qualität, sondern auch Erfahrung und Mentalität mit, die unserer jungen Mannschaft extrem helfen werden." Selke selbst zeigte sich emotional: „Ich habe die schönsten Jahre meiner Karriere in Berlin verbracht. Jetzt will ich etwas zurückgeben."

Der Angreifer, der insgesamt 164 Bundesligaspiele absolvierte und dabei 29 Tore erzielte, war zuletzt vereinslos. Nach seinem Abschied aus der 2. Bundesliga im Sommer hatte er sich fit gehalten und die Angebote geprüft. Dass es am Ende Türkiyemspor wurde, hat auch persönliche Gründe: „Ich wohne in Kreuzberg. Meine Kinder gehen hier zur Schule. Dieser Verein steht für etwas — für Zusammenhalt, für Integration, für den Kiez."

Für Türkiyemspor ist die Verpflichtung ein enormer Imagegewinn. Die Nachricht verbreitete sich wie ein Lauffeuer in den sozialen Medien, der Instagram-Post erreichte innerhalb von Stunden über 10.000 Likes. Sportlich soll Selke die Offensive beleben — mit nur 22 Toren in 17 Spielen hat Türkiyemspor Nachholbedarf. Der Debüt-Einsatz ist für kommendes Wochenende gegen Croatia Berlin geplant.`,
    bild: { url: IMAGES.training, alt: "Training bei Türkiyemspor", credit: "Foto: Yilmaz" },
    datum: "2026-02-22T14:00:00Z",
    kategorie: "transfer",
    ligaId: "berlin-liga",
    autor: { name: "Deniz Özkan", bild: "https://placehold.co/80x80/E30A17/white?text=DÖ" },
    lesedauer: 5,
    tags: ["Türkiyemspor Berlin", "Transfer", "Berlin-Liga", "Kreuzberg"],
    vereinIds: ["tuerkiyemspor"],
  },
  {
    id: "34",
    titel: "Wir wollen in die Regionalliga - Interview mit Trainer K\u00F6nig",
    slug: "interview-trainer-koenig-zehlendorf",
    teaser: "Hertha Zehlendorf dominiert die Oberliga NOFV Nord. Im exklusiven Interview spricht Cheftrainer Alexander König über seine Philosophie, die Aufstiegsambitionen und warum der Verein mehr ist als nur Fußball.",
    inhalt: `Hertha Zehlendorf steht an der Spitze der Oberliga NOFV Nord. Trainer Alexander König hat den Verein aus dem Berliner Südwesten innerhalb von zwei Jahren transformiert. Wir treffen ihn zum Gespräch im Vereinsheim am Dahlemer Weg.

Fußball-Woche: Herr König, Sie sind seit zwei Jahren Trainer bei Hertha Zehlendorf. Was hat sich seitdem verändert?

Alexander König: Als ich kam, war die Mannschaft im unteren Tabellendrittel. Wir haben zunächst an der Mentalität gearbeitet. Die Jungs mussten lernen, an sich zu glauben. Dazu kamen taktische Anpassungen — wir spielen jetzt ein aggressives Pressing, das viele Gegner überfordert.

FW: Wie definieren Sie Ihre Spielphilosophie?

König: Wir wollen den Ball haben und nach vorne spielen. Aber nicht blind, sondern mit Struktur. Jeder Spieler kennt seine Laufwege, seine Optionen. Wir trainieren Spielsituationen bis ins Detail. Und wenn wir den Ball verlieren, attackieren wir sofort — fünf Sekunden Gegenpressing ist bei uns Gesetz.

FW: Die Oberliga dominieren Sie souverän. Was ist das Ziel?

König: Wir wollen aufsteigen. Punkt. Die Regionalliga ist unser erklärtes Ziel. Aber wir wollen das nachhaltig tun. Wir haben in den Nachwuchs investiert, die Trainingsplätze verbessert. Der Aufstieg soll kein Strohfeuer sein.

FW: Was macht Hertha Zehlendorf als Verein besonders?

König: Die Gemeinschaft. Wir haben Fans, die bei jedem Auswärtsspiel dabei sind — ob in Rostock oder Erfurt. Dazu kommt eine Nachwuchsabteilung, die hervorragende Arbeit leistet. Drei Spieler aus unserer aktuellen Startelf sind Eigengewächse. Das macht mich besonders stolz.

FW: Welche Partie war das bisherige Highlight?

König: Das 4:0 gegen Cottbus II im Pokal. Da hat alles gepasst — die Leistung, die Atmosphäre, das Ergebnis. An solchen Abenden merkt man, was möglich ist, wenn alle an einem Strang ziehen.`,
    bild: { url: IMAGES.flutlicht, alt: "Hertha Zehlendorf Flutlichtspiel", credit: "Foto: Schütt" },
    datum: "2026-02-20T09:00:00Z",
    kategorie: "interview",
    ligaId: "oberliga-nofv-nord",
    autor: { name: "Robert Klein", bild: "https://placehold.co/80x80/333333/white?text=RK" },
    lesedauer: 7,
    tags: ["Hertha Zehlendorf", "Oberliga", "Interview", "Aufstieg"],
  },
  {
    id: "35",
    titel: "Wintereinbruch: Kompletter Spieltag in der Berlin-Liga abgesagt",
    slug: "wintereinbruch-spieltag-abgesagt",
    teaser: "Der heftige Schneefall hat Berlin fest im Griff. Der Berliner Fußball-Verband sagt sämtliche Spiele der Berlin-Liga am Wochenende ab. Auch die Oberliga und die Landesligen sind betroffen. Die Nachholtermine werden zur Herausforderung.",
    inhalt: `Berlin versinkt im Schnee — und mit der weißen Pracht ruht auch der Ball. Der Berliner Fußball-Verband (BFV) hat am Freitagmittag entschieden: Alle Pflichtspiele der Berlin-Liga, Oberliga sowie der Landes- und Bezirksligen am kommenden Wochenende fallen aus. Betroffen sind insgesamt 87 Partien.

„Die Sicherheit der Spieler und Zuschauer geht vor", erklärte BFV-Spielausschuss-Vorsitzender Wolfgang Riedel. „Die Platzverhältnisse lassen auf keiner Anlage in Berlin einen ordnungsgemäßen Spielbetrieb zu. Auch die Anreise wäre für viele Mannschaften problematisch." Bis zu 25 Zentimeter Neuschnee wurden in der Nacht zu Freitag gemessen, dazu Temperaturen von minus acht Grad.

Für die Vereine bedeutet die Absage eine enorme logistische Herausforderung. Der ohnehin enge Terminkalender wird noch voller. „Wir müssen in den kommenden Wochen Englische Wochen einplanen", sagt BFC-Dynamo-Geschäftsführerin Katrin Lehmann. „Das ist für Amateurvereine, deren Spieler berufstätig sind, eine echte Belastung."

Besonders bitter trifft es den Tabellenführer VSG Altglienicke, der mit drei Punkten Vorsprung ins Wochenende gegangen wäre. „Wir hatten gerade einen Lauf", sagte Trainer Wollitz. „Natürlich ist es ärgerlich, aber die Gesundheit geht vor." Tennis Borussia hingegen kann die Pause nutzen: Zwei angeschlagene Leistungsträger könnten durch die zusätzliche Erholungszeit rechtzeitig fit werden.

Die Kunstrasenplätze in Berlin wären theoretisch bespielbar, doch auch hier verhindert die Schneelast einen regulären Betrieb. Der BFV plant, die Nachholtermine bis Mitte nächster Woche zu kommunizieren. Eine Option wären zusätzliche Spieltage unter der Woche im März.`,
    bild: { url: IMAGES.stadion, alt: "Verschneites Stadion", credit: "Foto: dpa" },
    datum: "2026-02-18T12:00:00Z",
    kategorie: "news",
    ligaId: "berlin-liga",
    autor: { name: "Jan Westphal", bild: "https://placehold.co/80x80/4A90D9/white?text=JW" },
    lesedauer: 4,
    tags: ["Berlin-Liga", "Spielausfall", "Winter", "BFV"],
  },
  {
    id: "36",
    titel: "Viktoria schlägt Croatia im Topspiel der Berlin-Liga",
    slug: "viktoria-croatia-topspiel-berlin-liga",
    teaser: "Ein packendes Topspiel in der Berlin-Liga endet 2:1 für den FC Viktoria Berlin. Vor stimmungsvoller Kulisse im Friedrich-Ebert-Stadion dreht Viktoria einen Rückstand und festigt Platz vier. Croatia verpasst den Sprung aufs Podest.",
    inhalt: `Was für ein Fußball-Abend in Britz! Vor 1.800 begeisterten Zuschauern — die beste Kulisse der laufenden Berlin-Liga-Saison — lieferten sich der FC Viktoria Berlin und SV Croatia Berlin ein Spiel, das den Amateurfußball in seiner schönsten Form zeigte.

Croatia begann furios. Nur acht Minuten waren gespielt, als Spielmacher Hrvoje Matic mit einem Traumtor die Gästeführung erzielte. Aus 25 Metern zirkelte er den Ball unhaltbar in den rechten Winkel — ein Tor, das auch in der Bundesliga für Aufsehen gesorgt hätte. Das Friedrich-Ebert-Stadion verstummte kurz, doch die Viktoria-Fans peitschten ihr Team sofort wieder nach vorne.

Und die Antwort kam noch vor der Pause. In der 38. Minute erzielte Viktorias Mittelstürmer Kowalski den Ausgleich. Nach einem schnell ausgeführten Einwurf kam der Ball über drei Stationen zu ihm, und er verwertete trocken per Flachschuss ins linke Eck. Der Jubel war ohrenbetäubend, die Stimmung im Stadion elektrisierend.

Die zweite Halbzeit war ein offener Schlagabtausch. Beide Teams spielten mutigen Offensivfußball, ließen dabei aber auch Räume. Die bessere Chancenverwertung hatte Viktoria: In der 67. Minute schlug Rechtsaußen Nguyen eine perfekte Flanke auf den langen Pfosten, wo der eingewechselte Bergmann zum 2:1 einköpfte.

Croatia warf in der Schlussphase alles nach vorne. Trainer Babic brachte zwei frische Stürmer und stellte auf Dreierkette um. Es ergaben sich Chancen — ein Kopfball von Petrovic in der 84. Minute strich knapp über die Latte, ein Freistoß in der 89. Minute wurde gerade noch von der Mauer geblockt. Doch Viktoria überstand die Drangphase und rettete den Sieg über die Zeit.

„Das war Werbung für die Berlin-Liga", sagte Viktoria-Coach Brehme strahlend. „Solche Spiele zeigen, warum dieser Wettbewerb so besonders ist." Viktoria festigt mit dem Sieg Platz vier, während Croatia trotz der Niederlage eine starke Leistung zeigte und weiter auf Rang fünf steht.`,
    bild: { url: IMAGES.fans, alt: "Fans im Friedrich-Ebert-Stadion", credit: "Foto: Schneider" },
    datum: "2026-02-15T20:00:00Z",
    kategorie: "spielbericht",
    ligaId: "berlin-liga",
    autor: { name: "Lena Hoffmann", bild: "https://placehold.co/80x80/FC401D/white?text=LH" },
    lesedauer: 6,
    tags: ["FC Viktoria Berlin", "SV Croatia Berlin", "Berlin-Liga", "Topspiel"],
  },
  // === KULTUR (3 Artikel) ===
  {
    id: "37",
    titel: "Trikot-Kultur: Warum Berliner Amateurvereine zu Streetwear-Ikonen werden",
    slug: "trikot-kultur-berliner-amateurvereine-streetwear",
    teaser: "Von Türkiyemspor über TeBe bis zum BAK — Berliner Amateurtrikots sind längst mehr als Sportbekleidung. Ein Blick auf den Trend, der die Grenzen zwischen Fankurve und Laufsteg verwischt.",
    bild: { url: IMAGES.fans, alt: "Berliner Fans im Trikot", credit: "Foto: Richter" },
    datum: "2026-03-01T10:00:00Z",
    kategorie: "kultur",
    ligaId: "berlin-liga",
    autor: { name: "Mia Richter" },
    lesedauer: 5,
    tags: ["Kultur", "Fashion", "Streetwear", "Trikots", "Berlin"],
  },
  {
    id: "38",
    titel: "Playlist der Kabine: Was Berlins Kicker vor dem Anpfiff hören",
    slug: "playlist-kabine-berlin-fussball-musik",
    teaser: "Deutschrap, Afrobeats oder doch Techno? Wir haben in die Kabinen der Berlin-Liga geschaut und die Pre-Game-Playlists der Spieler gesammelt.",
    bild: { url: IMAGES.action, alt: "Spieler in der Kabine", credit: "Foto: Özkan" },
    datum: "2026-02-26T14:00:00Z",
    kategorie: "kultur",
    ligaId: "berlin-liga",
    autor: { name: "Deniz Özkan" },
    lesedauer: 4,
    tags: ["Kultur", "Musik", "Berlin-Liga", "Playlist", "Lifestyle"],
  },
  {
    id: "39",
    titel: "Gaming meets Grassroots: Wie EA FC die Berliner Kreisliga entdeckt",
    slug: "gaming-ea-fc-berliner-kreisliga",
    teaser: "Electronic Arts hat erstmals Spieler aus der Berliner Kreisliga in EA FC aufgenommen. Ein PR-Stunt oder der Beginn einer Revolution? Wir haben mit den Machern gesprochen.",
    bild: { url: IMAGES.ball, alt: "Fußball und Gaming", credit: "Foto: Westphal" },
    datum: "2026-02-20T09:00:00Z",
    kategorie: "kultur",
    ligaId: "berlin-liga",
    autor: { name: "Jan Westphal" },
    lesedauer: 6,
    tags: ["Kultur", "Gaming", "EA FC", "Kreisliga", "Berlin"],
  },
];

// Helper Funktionen
export function getArtikelByLiga(ligaId: string): Artikel[] {
  if (ligaId === "all") return artikel;
  return artikel.filter((a) => a.ligaId === ligaId);
}

export function getArtikelBySlug(slug: string): Artikel | undefined {
  return artikel.find((a) => a.slug === slug);
}

export function getFeaturedArtikel(): Artikel | undefined {
  return artikel.find((a) => a.featured);
}

export function getLatestArtikel(limit: number = 5): Artikel[] {
  return [...artikel]
    .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
    .slice(0, limit);
}

export function getLigaById(id: string): Liga | undefined {
  return LIGEN.find((l) => l.id === id);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("de-DE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
