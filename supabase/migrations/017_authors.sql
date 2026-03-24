-- ============================================
-- 017: Autoren-Tabelle + Storage Bucket
-- ============================================

-- Autoren (fuer Artikel-Zuordnung im Admin)
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  image_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authors_public_read" ON authors
  FOR SELECT USING (true);

CREATE POLICY "authors_redakteur_insert" ON authors
  FOR INSERT WITH CHECK (is_redakteur());

CREATE POLICY "authors_redakteur_update" ON authors
  FOR UPDATE USING (is_redakteur());

-- Storage Bucket fuer Artikel-Bilder
INSERT INTO storage.buckets (id, name, public)
VALUES ('article-images', 'article-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read article images" ON storage.objects
  FOR SELECT USING (bucket_id = 'article-images');

CREATE POLICY "Redakteure upload article images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'article-images'
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'redakteur')
    )
  );
