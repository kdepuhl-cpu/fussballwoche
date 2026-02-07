-- ============================================
-- DIAGO: User Profiles & Bookmarks Extension
-- ============================================

-- Neue Spalten für Profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS favorite_league_ids TEXT[] DEFAULT '{}';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Fehlende INSERT-Policy (001 hat nur SELECT + UPDATE)
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- BOOKMARKS (ersetzt localStorage für eingeloggte User)
-- ============================================
CREATE TABLE bookmarks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, article_slug)
);

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_select" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "bookmarks_insert" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "bookmarks_delete" ON bookmarks FOR DELETE USING (auth.uid() = user_id);
