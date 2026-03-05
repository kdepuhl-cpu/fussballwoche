-- ============================================
-- 007_platform_v2.sql
-- Platform v2 Migration for the FuWo Relaunch
-- ============================================
-- Extends the existing schema with:
--   1. VereinProfil data on clubs (Beschreibung, Sportstaette, Kontakt, etc.)
--   2. Subscription/Abo fields on profiles (Dauerkarte, Ehrentribuene)
--   3. club_authors table (Vereins-Accounts fuer Vereins-News)
--   4. feedback table (Thumbs up/down Feedback-System)
--   5. author_club_id on articles (Vereins-News vs. redaktionelle Artikel)
-- ============================================


-- ============================================
-- 1. EXTEND CLUBS — VereinProfil
-- ============================================

ALTER TABLE clubs ADD COLUMN IF NOT EXISTS beschreibung TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS telefon TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS instagram_url TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_name TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_adresse TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_plz TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_bezirk TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_maps_url TEXT;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_kapazitaet INTEGER;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_kunstrasen BOOLEAN DEFAULT false;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS sportstaette_flutlicht BOOLEAN DEFAULT false;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS ansprechpartner JSONB DEFAULT '[]';
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS trainingszeiten JSONB DEFAULT '[]';
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS mitglieder INTEGER;
ALTER TABLE clubs ADD COLUMN IF NOT EXISTS mannschaften INTEGER;


-- ============================================
-- 2. EXTEND PROFILES — Subscription / Abo
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
  CHECK (subscription_tier IN ('free', 'dauerkarte', 'ehrentribuene'));

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT NOT NULL DEFAULT 'inactive'
  CHECK (subscription_status IN ('inactive', 'active', 'canceled', 'past_due'));

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMPTZ;

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS newsletter_subscribed BOOLEAN NOT NULL DEFAULT false;


-- ============================================
-- 3. CREATE CLUB_AUTHORS — Vereins-Accounts
-- ============================================

CREATE TABLE IF NOT EXISTS club_authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  club_id TEXT NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('editor', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, club_id)
);

CREATE INDEX IF NOT EXISTS idx_club_authors_club_id ON club_authors(club_id);

-- RLS: publicly readable
ALTER TABLE club_authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "club_authors_select"
  ON club_authors FOR SELECT
  USING (true);


-- ============================================
-- 4. CREATE FEEDBACK — Thumbs Up / Down
-- ============================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  page_url TEXT NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('up', 'down')),
  context TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_page_url ON feedback(page_url);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);

-- RLS: anyone can insert, select is public
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_select"
  ON feedback FOR SELECT
  USING (true);

CREATE POLICY "feedback_insert"
  ON feedback FOR INSERT
  WITH CHECK (true);


-- ============================================
-- 5. EXTEND ARTICLES — Vereins-News
-- ============================================

ALTER TABLE articles ADD COLUMN IF NOT EXISTS author_club_id TEXT REFERENCES clubs(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_articles_author_club_id ON articles(author_club_id);
