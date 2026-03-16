-- ============================================
-- 012: Articles erweitern
-- Neue Kategorien + Premium-Flag
-- ============================================

-- Kategorie-CHECK erweitern: 'interview' + 'kultur' hinzufügen
ALTER TABLE articles DROP CONSTRAINT IF EXISTS articles_category_check;
ALTER TABLE articles ADD CONSTRAINT articles_category_check
  CHECK (category IN ('spielbericht', 'analyse', 'transfer', 'news', 'interview', 'kultur'));

-- Premium-Flag
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_premium BOOLEAN NOT NULL DEFAULT false;
