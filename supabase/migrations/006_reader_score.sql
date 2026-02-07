-- 006_reader_score.sql
-- Reader Score: Punkte fürs Artikellesen

-- Neue Felder in profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS reader_points INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS articles_read TEXT[] DEFAULT '{}';

-- RPC: Artikel als gelesen markieren + Punkte vergeben (verhindert Duplikate)
CREATE OR REPLACE FUNCTION record_article_read(p_article_slug TEXT)
RETURNS INT AS $$
DECLARE
  current_articles TEXT[];
  new_points INT;
BEGIN
  -- Aktuelle articles_read holen
  SELECT COALESCE(articles_read, '{}') INTO current_articles
  FROM profiles WHERE id = auth.uid();

  -- Wenn Artikel bereits gelesen, keine Punkte
  IF p_article_slug = ANY(current_articles) THEN
    SELECT reader_points INTO new_points FROM profiles WHERE id = auth.uid();
    RETURN new_points;
  END IF;

  -- Artikel hinzufügen + 10 Punkte vergeben
  UPDATE profiles
  SET
    articles_read = array_append(COALESCE(articles_read, '{}'), p_article_slug),
    reader_points = COALESCE(reader_points, 0) + 10
  WHERE id = auth.uid();

  SELECT reader_points INTO new_points FROM profiles WHERE id = auth.uid();
  RETURN new_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
