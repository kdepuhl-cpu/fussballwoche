-- ============================================
-- 013: Clubs erweitern mit Profildaten
-- Beschreibung, Mitglieder, Mannschaften + JSONB Profil
-- ============================================

-- Basisdaten als Spalten
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS members INT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS teams_count INT;

-- Erweiterte Profildaten als JSONB (Sportstätte, Kontakt, Social, Ansprechpartner, Training)
-- Schema:
-- {
--   "sportstaette": { "name": "", "adresse": "", "plz": "", "bezirk": "", "mapsUrl": "", "kapazitaet": 0, "kunstrasen": false, "flutlicht": false },
--   "kontakt": { "telefon": "", "email": "", "website": "" },
--   "socialMedia": { "instagram": "", "facebook": "" },
--   "ansprechpartner": [{ "name": "", "rolle": "", "telefon": "", "email": "" }],
--   "trainingszeiten": [{ "mannschaft": "", "tag": "", "zeit": "", "ort": "" }]
-- }
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS profile JSONB DEFAULT '{}';
