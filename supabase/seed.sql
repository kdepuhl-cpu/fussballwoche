-- ============================================
-- DIAGO Seed Data
-- Reihenfolge: Leagues → Clubs → Articles → Jobs
-- ============================================

-- ============================================
-- 1. LEAGUES (Parent-Ligen)
-- ============================================

INSERT INTO leagues (id, name, short_name, slug, category, tier, region) VALUES
-- Herren
('bundesliga', 'Bundesliga', 'BL', 'bundesliga', 'herren', 1, 'national'),
('2-bundesliga', '2. Bundesliga', '2. BL', '2-bundesliga', 'herren', 2, 'national'),
('3-liga', '3. Liga', '3. Liga', '3-liga', 'herren', 3, 'national'),
('regionalliga-nordost', 'Regionalliga Nordost', 'RL NO', 'regionalliga-nordost', 'herren', 4, 'nordost'),
('oberliga-nofv-nord', 'Oberliga NOFV Nord', 'OL Nord', 'oberliga-nofv-nord', 'herren', 5, 'nordost'),
('oberliga-nofv-sued', 'Oberliga NOFV Süd', 'OL Süd', 'oberliga-nofv-sued', 'herren', 5, 'nordost'),
('berlin-liga', 'Berlin-Liga', 'BL', 'berlin-liga', 'herren', 6, 'berlin'),
('landesliga', 'Landesliga Berlin', 'LL', 'landesliga', 'herren', 7, 'berlin'),
('bezirksliga', 'Bezirksliga Berlin', 'BZL', 'bezirksliga', 'herren', 8, 'berlin'),
('kreisliga-a', 'Kreisliga A Berlin', 'KL A', 'kreisliga-a', 'herren', 9, 'berlin'),
('kreisliga-b', 'Kreisliga B Berlin', 'KL B', 'kreisliga-b', 'herren', 10, 'berlin'),
('kreisliga-c', 'Kreisliga C Berlin', 'KL C', 'kreisliga-c', 'herren', 11, 'berlin'),
-- Frauen
('frauen-bundesliga', 'Frauen-Bundesliga', 'F-BL', 'frauen-bundesliga', 'frauen', 1, 'national'),
('2-frauen-bundesliga', '2. Frauen-Bundesliga', '2. F-BL', '2-frauen-bundesliga', 'frauen', 2, 'national'),
('frauen-regionalliga-nordost', 'Frauen-Regionalliga Nordost', 'F-RL NO', 'frauen-regionalliga-nordost', 'frauen', 3, 'nordost'),
('frauen-berlin-liga', 'Frauen Berlin-Liga', 'F-BL', 'frauen-berlin-liga', 'frauen', 4, 'berlin'),
('frauen-landesliga', 'Frauen-Landesliga Berlin', 'F-LL', 'frauen-landesliga', 'frauen', 5, 'berlin'),
('frauen-bezirksliga', 'Frauen-Bezirksliga Berlin', 'F-BZL', 'frauen-bezirksliga', 'frauen', 6, 'berlin'),
-- Pokal
('dfb-pokal', 'DFB-Pokal', 'DFB', 'dfb-pokal', 'pokal', 1, 'national'),
('dfb-pokal-frauen', 'DFB-Pokal Frauen', 'DFB-F', 'dfb-pokal-frauen', 'pokal', 1, 'national'),
('berliner-pokal', 'Berliner Pilsner-Pokal', 'BP', 'berliner-pokal', 'pokal', 2, 'berlin'),
('polytan-pokal', 'Polytan-Pokal', 'PP', 'polytan-pokal', 'pokal', 3, 'berlin');

-- ============================================
-- LEAGUES: Staffeln (child leagues)
-- ============================================

-- Landesliga Staffeln
INSERT INTO leagues (id, name, short_name, slug, category, tier, region, parent_id) VALUES
('landesliga-1', 'Staffel 1', 'LL 1', 'landesliga-staffel-1', 'herren', 7, 'berlin', 'landesliga'),
('landesliga-2', 'Staffel 2', 'LL 2', 'landesliga-staffel-2', 'herren', 7, 'berlin', 'landesliga');

-- Bezirksliga Staffeln
INSERT INTO leagues (id, name, short_name, slug, category, tier, region, parent_id) VALUES
('bezirksliga-1', 'Staffel 1', 'BZL 1', 'bezirksliga-staffel-1', 'herren', 8, 'berlin', 'bezirksliga'),
('bezirksliga-2', 'Staffel 2', 'BZL 2', 'bezirksliga-staffel-2', 'herren', 8, 'berlin', 'bezirksliga'),
('bezirksliga-3', 'Staffel 3', 'BZL 3', 'bezirksliga-staffel-3', 'herren', 8, 'berlin', 'bezirksliga'),
('bezirksliga-4', 'Staffel 4', 'BZL 4', 'bezirksliga-staffel-4', 'herren', 8, 'berlin', 'bezirksliga');

-- Kreisliga A Staffeln
INSERT INTO leagues (id, name, short_name, slug, category, tier, region, parent_id) VALUES
('kreisliga-a-1', 'Staffel 1', 'KL A1', 'kreisliga-a-staffel-1', 'herren', 9, 'berlin', 'kreisliga-a'),
('kreisliga-a-2', 'Staffel 2', 'KL A2', 'kreisliga-a-staffel-2', 'herren', 9, 'berlin', 'kreisliga-a'),
('kreisliga-a-3', 'Staffel 3', 'KL A3', 'kreisliga-a-staffel-3', 'herren', 9, 'berlin', 'kreisliga-a'),
('kreisliga-a-4', 'Staffel 4', 'KL A4', 'kreisliga-a-staffel-4', 'herren', 9, 'berlin', 'kreisliga-a'),
('kreisliga-a-5', 'Staffel 5', 'KL A5', 'kreisliga-a-staffel-5', 'herren', 9, 'berlin', 'kreisliga-a'),
('kreisliga-a-6', 'Staffel 6', 'KL A6', 'kreisliga-a-staffel-6', 'herren', 9, 'berlin', 'kreisliga-a');

-- Kreisliga B Staffeln
INSERT INTO leagues (id, name, short_name, slug, category, tier, region, parent_id) VALUES
('kreisliga-b-1', 'Staffel 1', 'KL B1', 'kreisliga-b-staffel-1', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-2', 'Staffel 2', 'KL B2', 'kreisliga-b-staffel-2', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-3', 'Staffel 3', 'KL B3', 'kreisliga-b-staffel-3', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-4', 'Staffel 4', 'KL B4', 'kreisliga-b-staffel-4', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-5', 'Staffel 5', 'KL B5', 'kreisliga-b-staffel-5', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-6', 'Staffel 6', 'KL B6', 'kreisliga-b-staffel-6', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-7', 'Staffel 7', 'KL B7', 'kreisliga-b-staffel-7', 'herren', 10, 'berlin', 'kreisliga-b'),
('kreisliga-b-8', 'Staffel 8', 'KL B8', 'kreisliga-b-staffel-8', 'herren', 10, 'berlin', 'kreisliga-b');

-- Kreisliga C Staffeln
INSERT INTO leagues (id, name, short_name, slug, category, tier, region, parent_id) VALUES
('kreisliga-c-1', 'Staffel 1', 'KL C1', 'kreisliga-c-staffel-1', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-2', 'Staffel 2', 'KL C2', 'kreisliga-c-staffel-2', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-3', 'Staffel 3', 'KL C3', 'kreisliga-c-staffel-3', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-4', 'Staffel 4', 'KL C4', 'kreisliga-c-staffel-4', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-5', 'Staffel 5', 'KL C5', 'kreisliga-c-staffel-5', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-6', 'Staffel 6', 'KL C6', 'kreisliga-c-staffel-6', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-7', 'Staffel 7', 'KL C7', 'kreisliga-c-staffel-7', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-8', 'Staffel 8', 'KL C8', 'kreisliga-c-staffel-8', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-9', 'Staffel 9', 'KL C9', 'kreisliga-c-staffel-9', 'herren', 11, 'berlin', 'kreisliga-c'),
('kreisliga-c-10', 'Staffel 10', 'KL C10', 'kreisliga-c-staffel-10', 'herren', 11, 'berlin', 'kreisliga-c');

-- Frauen Staffeln
INSERT INTO leagues (id, name, short_name, slug, category, tier, region, parent_id) VALUES
('frauen-landesliga-1', 'Staffel 1', 'F-LL 1', 'frauen-landesliga-staffel-1', 'frauen', 5, 'berlin', 'frauen-landesliga'),
('frauen-landesliga-2', 'Staffel 2', 'F-LL 2', 'frauen-landesliga-staffel-2', 'frauen', 5, 'berlin', 'frauen-landesliga'),
('frauen-bezirksliga-1', 'Staffel 1', 'F-BZL 1', 'frauen-bezirksliga-staffel-1', 'frauen', 6, 'berlin', 'frauen-bezirksliga'),
('frauen-bezirksliga-2', 'Staffel 2', 'F-BZL 2', 'frauen-bezirksliga-staffel-2', 'frauen', 6, 'berlin', 'frauen-bezirksliga');

-- ============================================
-- 2. CLUBS (16 Berliner Vereine)
-- ============================================

INSERT INTO clubs (id, name, short_name, slug, league_id, primary_color) VALUES
('bak', 'Berliner AK 07', 'BAK', 'berliner-ak-07', 'berlin-liga', '#1E3A5F'),
('tebe', 'Tennis Borussia Berlin', 'TeBe', 'tennis-borussia-berlin', 'oberliga-nofv-nord', '#8B5CF6'),
('tuerkiyemspor', 'Türkiyemspor Berlin', 'Türkiye', 'tuerkiyemspor-berlin', 'berlin-liga', '#EF4444'),
('altglienicke', 'VSG Altglienicke', 'VSG', 'vsg-altglienicke', 'regionalliga-nordost', '#059669'),
('bfc', 'BFC Dynamo', 'BFC', 'bfc-dynamo', 'regionalliga-nordost', '#DC2626'),
('zehlendorf', 'Hertha Zehlendorf', 'Hertha Z', 'hertha-zehlendorf', 'oberliga-nofv-nord', '#3B82F6'),
('viktoria', 'FC Viktoria 1889 Berlin', 'Viktoria', 'fc-viktoria-berlin', 'regionalliga-nordost', '#1F2937'),
('croatia', 'SD Croatia Berlin', 'Croatia', 'sd-croatia-berlin', 'berlin-liga', '#EF4444'),
('staaken', 'SC Staaken', 'Staaken', 'sc-staaken', 'landesliga', '#F59E0B'),
('fuechse', 'Füchse Berlin Reinickendorf', 'Füchse', 'fuechse-berlin-reinickendorf', 'bezirksliga', '#F97316'),
('sparta', 'Sparta Lichtenberg', 'Sparta', 'sparta-lichtenberg', 'berlin-liga', '#10B981'),
('stern', 'Stern 1900 Berlin', 'Stern', 'stern-1900-berlin', 'berlin-liga', '#6366F1'),
('wacker', 'FSV Wacker 90 Nordhausen', 'Wacker', 'fsv-wacker-nordhausen', 'landesliga', '#14B8A6'),
('union2', '1. FC Union Berlin II', 'Union II', 'union-berlin-ii', 'regionalliga-nordost', '#DC2626'),
('hertha2', 'Hertha BSC II', 'Hertha II', 'hertha-bsc-ii', 'regionalliga-nordost', '#3B82F6'),
('lichtenberg', 'SV Lichtenberg 47', 'Lichtenb.', 'sv-lichtenberg-47', 'landesliga', '#8B5CF6');

-- ============================================
-- 3. ARTICLES (30 Artikel)
-- Liga-ID Mapping: data.ts IDs → leagues.ts IDs
--   bundesliga-1   → bundesliga
--   bundesliga-2   → 2-bundesliga
--   liga-3         → 3-liga
--   regionalliga-nordost → regionalliga-nordost (gleich)
--   oberliga-nofv-nord   → oberliga-nofv-nord (gleich)
--   berlin-liga          → berlin-liga (gleich)
-- ============================================

INSERT INTO articles (id, title, slug, excerpt, category, image_url, image_alt, image_credit, published_at, is_featured, reading_time_minutes, league_id, author_name, tags) VALUES
-- Bundesliga (5)
('00000000-0000-0000-0000-000000000001', 'Stürmer-Spektakel aus dem Lehrbuch', 'stuermer-spektakel-union-frankfurt', 'Der Sieg des 1. FC Union in Frankfurt entspringt einer taktischen Meisterleistung. Ein Triumph in ungeahnter Dimension.', 'spielbericht', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', 'Union Berlin Spielszene', 'Foto: Koch', '2025-02-03T10:00:00Z', true, 6, 'bundesliga', 'Robert Klein', ARRAY['1. FC Union Berlin', 'Eintracht Frankfurt', 'Bundesliga']),
('00000000-0000-0000-0000-000000000002', 'Aufstiegskampf spitzt sich zu', 'aufstiegskampf-bundesliga', 'Drei Punkte trennen die Top 5 der Tabelle. Der Saisonendspurt verspricht Spannung pur.', 'analyse', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 'Bundesliga Flutlicht', 'Foto: Meyer', '2025-02-02T14:00:00Z', false, 4, 'bundesliga', 'Lisa Schmidt', ARRAY['Bundesliga', 'Tabelle', 'Aufstiegskampf']),
('00000000-0000-0000-0000-000000000003', 'Trainer nach Niederlage unter Druck', 'trainer-unter-druck-bundesliga', 'Nach der dritten Pleite in Folge wackelt der Stuhl des Übungsleiters.', 'news', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', 'Spielfeld', 'Foto: Weber', '2025-02-01T18:00:00Z', false, 3, 'bundesliga', 'Thomas Müller', ARRAY['Bundesliga', 'Trainer']),
('00000000-0000-0000-0000-000000000004', 'Neuzugang überzeugt beim Debüt', 'neuzugang-debuet-bundesliga', 'Der Winter-Transfer zeigt sofort, warum der Verein tief in die Tasche gegriffen hat.', 'spielbericht', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 'Fußball', 'Foto: Schulz', '2025-01-31T12:00:00Z', false, 5, 'bundesliga', 'Anna Becker', ARRAY['Bundesliga', 'Transfer', 'Neuzugang']),
('00000000-0000-0000-0000-000000000005', 'Rekordtransfer vor dem Absprung', 'rekordtransfer-bundesliga', 'Gerüchte um einen Wechsel nach England verdichten sich. Ablöse könnte 50 Millionen übersteigen.', 'transfer', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'Stadion', 'Foto: Richter', '2025-01-30T09:00:00Z', false, 4, 'bundesliga', 'Max Hoffmann', ARRAY['Bundesliga', 'Transfer', 'Premier League']),

-- 2. Bundesliga (5)
('00000000-0000-0000-0000-000000000006', 'Der Abstiegszone gefährlich nah', 'hertha-abstiegszone-heimschwaeche', 'Ohne Überwindung der Heimschwäche wird Hertha BSC nicht oben mitspielen können.', 'analyse', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'Olympiastadion Berlin', 'Foto: Winter', '2025-02-02T14:00:00Z', false, 5, '2-bundesliga', 'Karsten Doneck', ARRAY['Hertha BSC', '2. Bundesliga', 'Berlin', 'Olympiastadion']),
('00000000-0000-0000-0000-000000000007', 'Derbysieg befeuert Aufstiegshoffnung', 'derbysieg-zweite-liga', 'Mit dem prestigeträchtigen Erfolg klettert das Team auf Platz drei der Tabelle.', 'spielbericht', 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800', 'Derbysieg Jubel', 'Foto: Koch', '2025-02-01T20:00:00Z', false, 4, '2-bundesliga', 'Michael Braun', ARRAY['2. Bundesliga', 'Derby', 'Aufstieg']),
('00000000-0000-0000-0000-000000000008', 'Kapitän verlängert bis 2028', 'kapitaen-verlaengert-zweite-liga', 'Der Führungsspieler bekennt sich zum Verein und unterschreibt einen neuen Dreijahresvertrag.', 'transfer', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', 'Spielszene', 'Foto: Richter', '2025-01-30T10:00:00Z', false, 3, '2-bundesliga', 'Sandra Klein', ARRAY['2. Bundesliga', 'Vertrag', 'Kapitän']),
('00000000-0000-0000-0000-000000000009', 'Torjäger meldet sich fit zurück', 'torjaeger-fit-zweite-liga', 'Nach wochenlanger Verletzungspause steht der Goalgetter vor dem Comeback.', 'news', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', 'Tornetz', 'Foto: Berger', '2025-01-29T16:00:00Z', false, 2, '2-bundesliga', 'Peter Hoffmann', ARRAY['2. Bundesliga', 'Comeback', 'Verletzung']),
('00000000-0000-0000-0000-000000000010', 'Stadion-Neubau endlich genehmigt', 'stadion-neubau-zweite-liga', 'Nach jahrelangem Ringen gibt die Stadt grünes Licht für die neue Arena.', 'news', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 'Flutlicht', 'Foto: Lang', '2025-01-28T11:00:00Z', false, 4, '2-bundesliga', 'Claudia Weber', ARRAY['2. Bundesliga', 'Stadion', 'Neubau']),

-- 3. Liga (5)
('00000000-0000-0000-0000-000000000011', 'Tabellenführer patzt überraschend', 'tabellenfuehrer-patzt-dritte-liga', 'Der Spitzenreiter verliert erstmals seit zehn Spielen und die Verfolger wittern ihre Chance.', 'spielbericht', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', '3. Liga Action', 'Foto: Schmidt', '2025-02-03T15:00:00Z', false, 4, '3-liga', 'Frank Weber', ARRAY['3. Liga', 'Tabellenführer', 'Überraschung']),
('00000000-0000-0000-0000-000000000012', 'Aufsteiger überrascht die Liga', 'aufsteiger-ueberrascht-dritte-liga', 'Der Neuling mischt die Konkurrenz auf und steht sensationell auf einem Aufstiegsplatz.', 'analyse', 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800', 'Aufsteiger Fans', 'Foto: Lange', '2025-02-02T12:00:00Z', false, 5, '3-liga', 'Julia Hartmann', ARRAY['3. Liga', 'Aufsteiger', 'Aufstieg']),
('00000000-0000-0000-0000-000000000013', 'Nachwuchstalent feiert Profidebüt', 'nachwuchstalent-dritte-liga', 'Mit 17 Jahren steht der Youngster erstmals in der Startelf und liefert sofort ab.', 'news', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 'Fußball Close-up', 'Foto: Krause', '2025-02-01T14:00:00Z', false, 3, '3-liga', 'Markus Fischer', ARRAY['3. Liga', 'Nachwuchs', 'Debüt']),
('00000000-0000-0000-0000-000000000014', 'Stadionausbau wird konkreter', 'stadionausbau-dritte-liga', 'Die Pläne für die Erweiterung der Arena nehmen Form an. Baubeginn soll 2026 sein.', 'news', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'Stadion', 'Foto: Wolf', '2025-01-31T09:00:00Z', false, 4, '3-liga', 'Claudia Neumann', ARRAY['3. Liga', 'Stadion', 'Ausbau']),
('00000000-0000-0000-0000-000000000015', 'Elfmeterkiller hält Sieg fest', 'elfmeterkiller-dritte-liga', 'Der Keeper pariert zwei Strafstöße und sichert seinem Team drei wichtige Punkte.', 'spielbericht', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', 'Torwart', 'Foto: Engel', '2025-01-30T18:00:00Z', false, 3, '3-liga', 'Stefan Roth', ARRAY['3. Liga', 'Torwart', 'Elfmeter']),

-- Regionalliga Nordost (5)
('00000000-0000-0000-0000-000000000016', 'Altglienicke schiebt sich immer weiter vor', 'altglienicke-tabellenspitze-regionalliga', 'Heimlich, still und gar nicht leise pirscht sich die VSG an die Ligaspitze heran.', 'analyse', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', 'VSG Altglienicke', 'Foto: Kellner', '2025-02-01T16:00:00Z', false, 4, 'regionalliga-nordost', 'Harri Ramin', ARRAY['VSG Altglienicke', 'Regionalliga', 'Berlin']),
('00000000-0000-0000-0000-000000000017', 'BFC Preussen sorgt für Furore', 'bfc-preussen-regionalliga', 'Der Aufsteiger gewinnt das dritte Spiel in Folge und etabliert sich im oberen Tabellendrittel.', 'spielbericht', 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800', 'BFC Preussen Fans', 'Foto: Schulze', '2025-01-31T18:00:00Z', false, 3, 'regionalliga-nordost', 'Dirk Baumann', ARRAY['BFC Preussen', 'Regionalliga', 'Berlin']),
('00000000-0000-0000-0000-000000000018', 'Lok Leipzig verteidigt Tabellenführung', 'lok-leipzig-regionalliga', 'Der Titelverteidiger lässt nichts anbrennen und baut den Vorsprung aus.', 'spielbericht', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', 'Lok Leipzig', 'Foto: Friedrich', '2025-01-30T20:00:00Z', false, 4, 'regionalliga-nordost', 'Steffen Krug', ARRAY['1. FC Lok Leipzig', 'Regionalliga', 'Tabellenführer']),
('00000000-0000-0000-0000-000000000019', 'Transfercoup für Berliner Verein', 'transfercoup-regionalliga', 'Ein ehemaliger Zweitligaspieler wechselt in die Regionalliga und sorgt für Aufsehen.', 'transfer', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 'Flutlicht Abend', 'Foto: Engel', '2025-01-29T11:00:00Z', false, 3, 'regionalliga-nordost', 'Nina Vogel', ARRAY['Regionalliga', 'Transfer', 'Berlin']),
('00000000-0000-0000-0000-000000000020', 'Hallescher FC in der Krise', 'halle-krise-regionalliga', 'Nach drei Niederlagen in Serie gerät der Favorit ins Straucheln. Trainer zählt das Team an.', 'analyse', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800', 'Halle Stadion', 'Foto: Meier', '2025-01-28T14:00:00Z', false, 5, 'regionalliga-nordost', 'Jens Lehmann', ARRAY['Hallescher FC', 'Regionalliga', 'Krise']),

-- Oberliga NOFV Nord (5)
('00000000-0000-0000-0000-000000000021', 'Die Sache mit dem glücklichen Händchen', 'hertha-03-zwickau-oberliga', 'Der zur Pause eingewechselte von Baer benötigt nur vier Minuten für den Siegtreffer.', 'spielbericht', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', 'Oberliga Spiel', 'Foto: Koch', '2025-01-31T18:00:00Z', false, 3, 'oberliga-nofv-nord', 'Matthias Schütt', ARRAY['Hertha 03 Zehlendorf', 'Oberliga', 'Berlin']),
('00000000-0000-0000-0000-000000000022', 'Abstiegskampf wird zur Nervenschlacht', 'abstiegskampf-oberliga', 'Im Tabellenkeller trennen nur vier Punkte sechs Mannschaften. Jedes Spiel zählt.', 'analyse', 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800', 'Oberliga Fans', 'Foto: Hartwig', '2025-01-30T14:00:00Z', false, 5, 'oberliga-nofv-nord', 'Oliver Thiel', ARRAY['Oberliga', 'Abstiegskampf']),
('00000000-0000-0000-0000-000000000023', 'Spielertrainer übernimmt Verantwortung', 'spielertrainer-oberliga', 'Nach der Trennung vom Coach springt ein Routinier als Interimslösung ein.', 'news', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 'Fußball', 'Foto: Berger', '2025-01-29T10:00:00Z', false, 3, 'oberliga-nofv-nord', 'Carsten Wolff', ARRAY['Oberliga', 'Trainer', 'Spielertrainer']),
('00000000-0000-0000-0000-000000000024', 'Pokalüberraschung bahnt sich an', 'pokalueberraschung-oberliga', 'Der Underdog steht überraschend im Halbfinale des Landespokals.', 'spielbericht', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', 'Pokaljubel', 'Foto: Seidel', '2025-01-28T17:00:00Z', false, 4, 'oberliga-nofv-nord', 'Ralf Köhler', ARRAY['Oberliga', 'Landespokal', 'Pokal']),
('00000000-0000-0000-0000-000000000025', 'Traditionsverein kämpft ums Überleben', 'traditionsverein-oberliga', 'Finanzielle Probleme zwingen den Klub zu drastischen Maßnahmen. Fans starten Spendenaktion.', 'news', 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800', 'Flutlicht Stadion', 'Foto: Lange', '2025-01-27T12:00:00Z', false, 6, 'oberliga-nofv-nord', 'Bernd Schneider', ARRAY['Oberliga', 'Finanzen', 'Fans']),

-- Berlin-Liga (5)
('00000000-0000-0000-0000-000000000026', 'Stabile Defensive und ein Doppel-Härtel', 'makkabi-neustrelitz-berlin-liga', 'Neustrelitz bringt Makkabi eine Heimniederlage bei – eine Lehrstunde für den Gastgeber.', 'spielbericht', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800', 'Berlin-Liga Spielfeld', 'Foto: dedepress', '2025-01-30T15:00:00Z', false, 3, 'berlin-liga', 'Matthias Schütt', ARRAY['TuS Makkabi Berlin', 'TSV 1860 Neustrelitz', 'Berlin-Liga']),
('00000000-0000-0000-0000-000000000027', 'Türkiyemspor zurück auf Kurs', 'tuerkiyemspor-berlin-liga', 'Nach schwachem Saisonstart findet der Traditionsverein zurück in die Spur.', 'analyse', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800', 'Türkiyemspor', 'Foto: Yilmaz', '2025-01-29T19:00:00Z', false, 4, 'berlin-liga', 'Deniz Özkan', ARRAY['Türkiyemspor Berlin', 'Berlin-Liga', 'Kreuzberg']),
('00000000-0000-0000-0000-000000000028', 'Lokalrivalen liefern packendes Derby', 'derby-berlin-liga', 'Vor ausverkauftem Haus trennen sich die Nachbarn nach einem Spektakel unentschieden.', 'spielbericht', 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800', 'Derby Berlin Fans', 'Foto: Schneider', '2025-01-28T14:00:00Z', false, 5, 'berlin-liga', 'Jan Westphal', ARRAY['Berlin-Liga', 'Derby', 'Berlin']),
('00000000-0000-0000-0000-000000000029', 'Jugendarbeit trägt Früchte', 'jugendarbeit-berlin-liga', 'Gleich drei Eigengewächse schaffen den Sprung in die erste Mannschaft.', 'news', 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800', 'Fußball Nachwuchs', 'Foto: Krüger', '2025-01-27T11:00:00Z', false, 3, 'berlin-liga', 'Lena Hoffmann', ARRAY['Berlin-Liga', 'Nachwuchs', 'Jugend']),
('00000000-0000-0000-0000-000000000030', 'Spitzenreiter mit weißer Weste', 'spitzenreiter-berlin-liga', 'Zehn Siege in zehn Spielen: Der Tabellenführer scheint unaufhaltsam auf dem Weg zum Titel.', 'analyse', 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800', 'Tornetz', 'Foto: Hartmann', '2025-01-26T16:00:00Z', false, 4, 'berlin-liga', 'Sven Müller', ARRAY['Berlin-Liga', 'Tabellenführer', 'Meisterschaft']);

-- ============================================
-- 4. JOBS (16 Stellenanzeigen)
-- ============================================

INSERT INTO jobs (id, title, club_name, district, league, category, type, description, requirements, tasks, contact_name, contact_email, contact_phone, compensation, published_at, is_featured, tags) VALUES
-- Trainer
('00000000-0000-0000-0001-000000000001', 'Cheftrainer Herren (Berlin-Liga)', 'Türkiyemspor Berlin', 'Friedrichshain-Kreuzberg', 'Berlin-Liga', 'trainer', 'teilzeit',
 'Türkiyemspor Berlin sucht einen ambitionierten Cheftrainer für die erste Herrenmannschaft in der Berlin-Liga. Der Verein befindet sich im Aufbruch und möchte mittelfristig den Aufstieg in die Oberliga schaffen. Du übernimmst eine Mannschaft mit großem Potenzial und einem engagierten Umfeld.',
 ARRAY['Gültige Trainer-B-Lizenz (Trainer-A von Vorteil)', 'Erfahrung als Trainer ab Landesliga aufwärts', 'Taktisches Verständnis und moderne Trainingsmethoden', 'Kommunikationsstärke und Teamfähigkeit', 'Identifikation mit dem Verein und der Kiez-Kultur'],
 ARRAY['Leitung des Trainingsbetriebs (3x pro Woche)', 'Spielvorbereitung und Matchday-Coaching', 'Kaderentwicklung und Spielerförderung', 'Enge Zusammenarbeit mit dem Sportlichen Leiter', 'Scouting im Berliner Amateurfußball'],
 'Mehmet Yilmaz', 'sportlich@tuerkiyemspor.de', '030 / 123 456 78', 'Aufwandsentschädigung nach Vereinbarung', '2026-02-05T10:00:00Z', true, ARRAY['Trainer', 'Berlin-Liga', 'Kreuzberg']),

('00000000-0000-0000-0001-000000000002', 'Co-Trainer Oberliga-Mannschaft', 'Hertha 03 Zehlendorf', 'Steglitz-Zehlendorf', 'Oberliga NOFV Nord', 'trainer', 'teilzeit',
 'Hertha 03 Zehlendorf sucht einen Co-Trainer zur Unterstützung des Cheftrainers der Oberliga-Mannschaft. Du bist Teil eines motivierten Trainerteams und bringst deine Ideen aktiv ein.',
 ARRAY['Mindestens Trainer-B-Lizenz', 'Erfahrung im Berliner Amateurfußball', 'Analytische Fähigkeiten (Spielanalyse)', 'Zuverlässigkeit und Einsatzbereitschaft'],
 ARRAY['Unterstützung bei Training und Spieltag', 'Videoanalyse und Gegnerbeobachtung', 'Individuelle Spielerentwicklung', 'Vertretung des Cheftrainers bei Abwesenheit'],
 'Stefan Bergmann', 'trainer@hertha03.de', NULL, '400 EUR/Monat', '2026-02-03T14:00:00Z', false, ARRAY['Co-Trainer', 'Oberliga', 'Zehlendorf']),

('00000000-0000-0000-0001-000000000003', 'Torwarttrainer für alle Mannschaften', 'SC Staaken', 'Spandau', 'Landesliga', 'trainer', 'minijob',
 'Der SC Staaken sucht einen erfahrenen Torwarttrainer, der sowohl die Keeper der ersten Mannschaft als auch die Jugend-Torhüter trainiert. Eine einmalige Chance, den gesamten Torwart-Bereich eines Traditionsvereins zu formen.',
 ARRAY['Torwarttrainer-Lizenz oder vergleichbare Qualifikation', 'Eigene Torhüter-Erfahrung', 'Erfahrung in der Torwart-Ausbildung', 'Geduld und pädagogisches Geschick'],
 ARRAY['2x wöchentliches Torwarttraining', 'Individuelle Trainingspläne erstellen', 'Spieltagsbetreuung der Torhüter', 'Sichtung von Nachwuchstorhütern'],
 'Klaus Richter', 'sport@sc-staaken.de', '030 / 333 444 55', '520 EUR/Monat (Minijob-Basis)', '2026-01-28T09:00:00Z', false, ARRAY['Torwarttrainer', 'Landesliga', 'Spandau']),

-- Spieler gesucht
('00000000-0000-0000-0001-000000000004', 'Verstärkung für den Sturm gesucht', 'SV Tasmania Berlin', 'Neukölln', 'Bezirksliga', 'spieler', 'ehrenamtlich',
 'Tasmania Berlin sucht dringend Verstärkung für die Offensive. Wir sind ein Traditionsverein mit tollem Zusammenhalt und suchen torgefährliche Spieler, die unseren Kader verstärken wollen. Probetraining jederzeit möglich!',
 ARRAY['Spielerpass oder Wechselmöglichkeit', 'Erfahrung ab Kreisliga aufwärts', 'Torgefahr und Spielintelligenz', 'Mannschaftsdienliches Verhalten', 'Regelmäßige Trainingsteilnahme (2x/Woche)'],
 ARRAY['Regelmäßige Trainingsteilnahme', 'Spieleinsatz am Wochenende', 'Integration ins Mannschaftsgefüge'],
 'Dirk Baumann', 'spieler@tasmania-berlin.de', NULL, NULL, '2026-02-06T12:00:00Z', true, ARRAY['Spielersuche', 'Bezirksliga', 'Neukölln', 'Sturm']),

('00000000-0000-0000-0001-000000000005', 'Torhüter für die 1. Mannschaft', 'Berliner SC', 'Charlottenburg-Wilmersdorf', 'Landesliga', 'spieler', 'ehrenamtlich',
 'Der Berliner SC sucht einen erfahrenen Torhüter als Stammkeeper für die 1. Mannschaft in der Landesliga. Unser bisheriger Keeper hat den Verein verlassen und wir brauchen schnell Ersatz.',
 ARRAY['Erfahrung als Torhüter ab Bezirksliga', 'Gültige Spielberechtigung für Berlin', 'Kommunikationsstärke auf dem Platz', 'Zuverlässigkeit und Trainingseifer'],
 ARRAY['Stammtorhüter der 1. Mannschaft', 'Training 3x pro Woche', 'Punktspiele am Wochenende'],
 'Martin Scholz', 'team@berliner-sc.de', NULL, NULL, '2026-02-01T15:00:00Z', false, ARRAY['Torhüter', 'Landesliga', 'Charlottenburg']),

-- Ehrenamt
('00000000-0000-0000-0001-000000000006', 'Kassenwart/in gesucht', 'BFC Preussen', 'Lichtenberg', 'Regionalliga Nordost', 'ehrenamt', 'ehrenamtlich',
 'Der BFC Preussen sucht eine/n engagierte/n Kassenwart/in für den Vorstand. Du übernimmst die Finanzverwaltung eines traditionsreichen Berliner Vereins und gestaltest aktiv die Vereinszukunft mit.',
 ARRAY['Kaufmännische Grundkenntnisse', 'Erfahrung in Buchhaltung von Vorteil', 'Sorgfältige und zuverlässige Arbeitsweise', 'Verbundenheit mit dem Vereinsfußball'],
 ARRAY['Verwaltung der Vereinsfinanzen', 'Erstellung des Jahresabschlusses', 'Mitgliedsbeiträge und Fördermittel verwalten', 'Teilnahme an Vorstandssitzungen'],
 'Gerd Flemming', 'vorstand@bfc-preussen.de', NULL, NULL, '2026-02-04T10:00:00Z', false, ARRAY['Ehrenamt', 'Vorstand', 'Kassenwart', 'Lichtenberg']),

('00000000-0000-0000-0001-000000000007', 'Platzwart für unsere Sportanlage', 'Stern 1900', 'Neukölln', 'Berlin-Liga', 'ehrenamt', 'minijob',
 'Wir suchen einen zuverlässigen Platzwart für unsere Sportanlage in Neukölln. Du sorgst dafür, dass unsere Plätze in Top-Zustand sind und der Spielbetrieb reibungslos läuft.',
 ARRAY['Handwerkliches Geschick', 'Zuverlässigkeit und Eigeninitiative', 'Flexibilität bei den Arbeitszeiten', 'Verbundenheit mit dem Fußball'],
 ARRAY['Pflege der Spielflächen und Kabinen', 'Auf- und Abbau am Spieltag', 'Kleinere Reparaturen und Instandhaltung', 'Ansprechpartner für Gastvereine'],
 'Wolfgang Neumann', 'anlage@stern1900.de', '030 / 555 666 77', '450 EUR/Monat', '2026-01-29T11:00:00Z', false, ARRAY['Platzwart', 'Ehrenamt', 'Neukölln']),

-- Management
('00000000-0000-0000-0001-000000000008', 'Social Media Manager/in', 'VSG Altglienicke', 'Treptow-Köpenick', 'Regionalliga Nordost', 'management', 'minijob',
 'Die VSG Altglienicke sucht eine/n kreative/n Social Media Manager/in. Du bist verantwortlich für unsere Präsenz auf Instagram, TikTok und Facebook und bringst den Verein digital nach vorne.',
 ARRAY['Erfahrung im Social Media Management', 'Gespür für Trends und Content-Erstellung', 'Foto- und Videografie-Kenntnisse', 'Begeisterung für Berliner Fußball'],
 ARRAY['Content-Planung und -Erstellung', 'Community Management', 'Spieltags-Coverage (Live-Content)', 'Auswertung und Reporting'],
 'Laura Schreiber', 'marketing@altglienicke.de', NULL, '520 EUR/Monat', '2026-02-02T09:00:00Z', true, ARRAY['Social Media', 'Marketing', 'Treptow-Köpenick']),

('00000000-0000-0000-0001-000000000009', 'Geschäftsstellenleiter/in', 'Tennis Borussia Berlin', 'Charlottenburg-Wilmersdorf', 'Oberliga NOFV Nord', 'management', 'teilzeit',
 'Tennis Borussia Berlin sucht eine/n erfahrene/n Geschäftsstellenleiter/in. Du koordinierst den administrativen Betrieb des Vereins und bist zentrale Anlaufstelle für Mitglieder, Partner und Behörden.',
 ARRAY['Kaufmännische Ausbildung oder Studium', 'Organisationstalent und Eigenverantwortung', 'Erfahrung in der Vereinsarbeit von Vorteil', 'Gute Kommunikationsfähigkeiten'],
 ARRAY['Leitung der Geschäftsstelle', 'Mitgliederverwaltung', 'Korrespondenz mit Verbänden und Behörden', 'Koordination von Vereinsveranstaltungen'],
 'Frank Seifert', 'info@tebe.de', '030 / 777 888 99', '1.200 EUR/Monat', '2026-01-30T14:00:00Z', false, ARRAY['Geschäftsstelle', 'Management', 'Charlottenburg']),

-- Jugend
('00000000-0000-0000-0001-000000000010', 'Jugendkoordinator/in (U8-U15)', 'Füchse Berlin Reinickendorf', 'Reinickendorf', 'Bezirksliga', 'jugend', 'teilzeit',
 'Die Füchse Berlin Reinickendorf suchen eine/n engagierte/n Jugendkoordinator/in für den Nachwuchsbereich. Du bist verantwortlich für die sportliche Ausrichtung und Organisation der Jugendmannschaften von der U8 bis zur U15.',
 ARRAY['Trainer-C-Lizenz (Trainer-B wünschenswert)', 'Erfahrung in der Jugendarbeit', 'Pädagogisches Geschick', 'Organisationsstärke', 'Erweitertes Führungszeugnis'],
 ARRAY['Koordination der Jugendtrainer', 'Erstellung von Trainingsplänen und Leitlinien', 'Organisation von Turnieren und Camps', 'Elternkommunikation', 'Sichtung und Talentförderung'],
 'Birgit Hartmann', 'jugend@fuechse-reinickendorf.de', NULL, '800 EUR/Monat', '2026-02-01T10:00:00Z', false, ARRAY['Jugend', 'Koordinator', 'Reinickendorf']),

('00000000-0000-0000-0001-000000000011', 'Betreuer/in für D-Jugend', 'Croatia Berlin', 'Neukölln', 'Kreisliga', 'jugend', 'ehrenamtlich',
 'Croatia Berlin sucht eine/n zuverlässige/n Betreuer/in für die D-Jugend. Du unterstützt den Trainer bei Training und Spieltag und bist Ansprechpartner/in für Kinder und Eltern.',
 ARRAY['Freude am Umgang mit Kindern', 'Zuverlässigkeit und Pünktlichkeit', 'Erste-Hilfe-Kenntnisse von Vorteil', 'Erweitertes Führungszeugnis'],
 ARRAY['Betreuung bei Training und Spielen', 'An- und Abwesenheitslisten führen', 'Elternkommunikation', 'Unterstützung bei Fahrten zu Auswärtsspielen'],
 'Ivan Kovac', 'jugend@croatia-berlin.de', NULL, NULL, '2026-01-27T16:00:00Z', false, ARRAY['Jugend', 'Betreuer', 'D-Jugend', 'Neukölln']),

-- Schiedsrichter
('00000000-0000-0000-0001-000000000012', 'Schiedsrichter-Neulinge gesucht', 'Berliner Fußball-Verband', 'Mitte', NULL, 'schiedsrichter', 'minijob',
 'Der Berliner Fußball-Verband sucht neue Schiedsrichter/innen! Du pfeifst Spiele im Berliner Amateurfußball und wirst dafür vergütet. Keine Vorkenntnisse nötig – wir bilden dich aus. Mindestalter 14 Jahre.',
 ARRAY['Mindestalter 14 Jahre', 'Interesse am Fußball', 'Sportliche Fitness', 'Durchsetzungsvermögen', 'Bereitschaft zur Wochenend-Tätigkeit'],
 ARRAY['Leitung von Fußballspielen', 'Teilnahme an der Schiedsrichter-Ausbildung', 'Regelmäßige Regelkunde-Abende', 'Aufstiegsmöglichkeit in höhere Spielklassen'],
 'Bernd Schulz', 'schiedsrichter@berliner-fv.de', '030 / 896 994 0', '25-60 EUR pro Spielleitung', '2026-02-06T08:00:00Z', true, ARRAY['Schiedsrichter', 'BFV', 'Ausbildung']),

('00000000-0000-0000-0001-000000000013', 'Schiedsrichter-Assistent/in für Oberliga', 'Berliner Fußball-Verband', 'Mitte', 'Oberliga NOFV Nord', 'schiedsrichter', 'minijob',
 'Für die Oberliga-Spiele in Berlin sucht der BFV erfahrene Schiedsrichter-Assistenten. Du unterstützt den Referee bei der Spielleitung und trägst zu fairen Spielen bei.',
 ARRAY['Aktive Schiedsrichter-Tätigkeit seit mind. 2 Jahren', 'Einsatz ab Landesliga aufwärts', 'Gute körperliche Fitness (FIFA-Fitnesstest)', 'Bereitschaft zu Feedback und Weiterentwicklung'],
 ARRAY['Assistenz bei Oberliga-Spielen', 'Abseits- und Seitenlinienentscheidungen', 'Zusammenarbeit im Schiedsrichter-Team', 'Regelmäßige Lehrabende'],
 'Bernd Schulz', 'schiedsrichter@berliner-fv.de', NULL, '40-80 EUR pro Einsatz', '2026-01-25T10:00:00Z', false, ARRAY['Schiedsrichter', 'Assistent', 'Oberliga']),

-- Weitere
('00000000-0000-0000-0001-000000000014', 'Mannschaftsarzt (ehrenamtlich)', 'BFC Dynamo', 'Lichtenberg', 'Regionalliga Nordost', 'ehrenamt', 'ehrenamtlich',
 'Der BFC Dynamo sucht einen Mannschaftsarzt zur medizinischen Betreuung der 1. Mannschaft. Du betreust die Spieler bei Heimspielen und bist Ansprechpartner für medizinische Fragen.',
 ARRAY['Approbation als Arzt/Ärztin', 'Sportmedizinische Kenntnisse von Vorteil', 'Erfahrung in der Notfallmedizin', 'Verfügbarkeit an Spieltagen (Sa/So)'],
 ARRAY['Medizinische Betreuung am Spieltag', 'Erstversorgung bei Verletzungen', 'Beratung zu Prävention und Regeneration', 'Zusammenarbeit mit dem Physio-Team'],
 'Dr. Thomas Krüger', 'medizin@bfc-dynamo.de', NULL, NULL, '2026-01-31T12:00:00Z', false, ARRAY['Mannschaftsarzt', 'Ehrenamt', 'Regionalliga']),

('00000000-0000-0000-0001-000000000015', 'Frauen-Mannschaft sucht Spielerinnen', 'Viktoria Berlin', 'Lichtenberg', 'Frauen Berlin-Liga', 'spieler', 'ehrenamtlich',
 'Viktoria Berlin baut eine neue Frauen-Mannschaft auf und sucht Spielerinnen aller Positionen. Ob Anfängerin oder erfahrene Kickerin – bei uns bist du willkommen! Training ist zweimal pro Woche auf unserer Sportanlage in Lichtenberg.',
 ARRAY['Spaß am Fußball', 'Mindestalter 16 Jahre', 'Regelmäßige Trainingsteilnahme', 'Teamgeist und Motivation'],
 ARRAY['Training 2x pro Woche', 'Spielbetrieb am Wochenende', 'Mitgestaltung des Mannschaftslebens'],
 'Sarah Lindner', 'frauen@viktoria-berlin.de', NULL, NULL, '2026-02-04T16:00:00Z', false, ARRAY['Frauen', 'Spielerinnen', 'Lichtenberg', 'Neuaufbau']),

('00000000-0000-0000-0001-000000000016', 'Trainer/in für Mädchen-Mannschaft (U13)', 'Sparta Lichtenberg', 'Lichtenberg', 'Kreisliga', 'jugend', 'ehrenamtlich',
 'Sparta Lichtenberg sucht eine/n Trainer/in für die U13-Mädchenmannschaft. Wir sind ein familiärer Verein und freuen uns über motivierte Menschen, die den Mädchenfußball in Berlin voranbringen wollen.',
 ARRAY['Trainer-C-Lizenz (oder Bereitschaft zum Erwerb)', 'Begeisterung für Mädchen-/Frauenfußball', 'Pädagogisches Geschick', 'Erweitertes Führungszeugnis'],
 ARRAY['Leitung des Trainings (2x/Woche)', 'Betreuung am Spieltag', 'Talentförderung und Spielerentwicklung', 'Koordination mit der Jugendleitung'],
 'Katja Mertens', 'maedchen@sparta-lichtenberg.de', NULL, NULL, '2026-01-26T09:00:00Z', false, ARRAY['Mädchenfußball', 'U13', 'Trainer', 'Lichtenberg']);
