-- ============================================
-- 020: Security Advisor Fixes
-- Behebt alle Warnings/Errors aus dem Supabase Security Advisor
-- 1. Function Search Path Mutable — SET search_path + public. Prefix
-- 2. RLS Policy Always True — Policies verschaerfen
-- 3. RLS Disabled on landing_signups — Sicherheitsnetz fuer Prod
-- ============================================


-- ============================================
-- 1. FUNCTION SEARCH PATH MUTABLE
-- Alle Funktionen mit SET search_path = '' und public. Prefix
-- ============================================

-- is_admin()
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = '';

-- is_redakteur()
CREATE OR REPLACE FUNCTION is_redakteur()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'redakteur')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = '';

-- set_user_role()
CREATE OR REPLACE FUNCTION set_user_role(target_user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Nur Admins koennen Rollen aendern';
  END IF;

  IF new_role NOT IN ('user', 'redakteur', 'admin') THEN
    RAISE EXCEPTION 'Ungueltige Rolle: %', new_role;
  END IF;

  UPDATE public.profiles SET role = new_role WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- handle_new_user()
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- update_updated_at()
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = '';

-- increment_view_count()
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- get_vote_stats()
CREATE OR REPLACE FUNCTION get_vote_stats(p_match_id TEXT)
RETURNS TABLE(vote CHAR(1), count BIGINT, percentage NUMERIC) AS $$
  SELECT v.vote, COUNT(*), ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER(), 0), 1)
  FROM public.match_votes v WHERE v.match_id = p_match_id GROUP BY v.vote
$$ LANGUAGE sql SECURITY DEFINER
SET search_path = '';

-- record_article_read()
CREATE OR REPLACE FUNCTION record_article_read(p_article_slug TEXT)
RETURNS INT AS $$
DECLARE
  current_articles TEXT[];
  new_points INT;
BEGIN
  SELECT COALESCE(articles_read, '{}') INTO current_articles
  FROM public.profiles WHERE id = auth.uid();

  IF p_article_slug = ANY(current_articles) THEN
    SELECT reader_points INTO new_points FROM public.profiles WHERE id = auth.uid();
    RETURN new_points;
  END IF;

  UPDATE public.profiles
  SET
    articles_read = array_append(COALESCE(articles_read, '{}'), p_article_slug),
    reader_points = COALESCE(reader_points, 0) + 10
  WHERE id = auth.uid();

  SELECT reader_points INTO new_points FROM public.profiles WHERE id = auth.uid();
  RETURN new_points;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = '';

-- ============================================
-- 2. RLS POLICY ALWAYS TRUE
-- Offene Policies verschaerfen
-- Hinweis: feedback, newsletter_subscribers, landing_feature_votes
-- existieren nur auf Staging — Prod-Fixes separat
-- ============================================

-- landing_signups: alte Policies mit true entfernen
DROP POLICY IF EXISTS "Anyone can sign up" ON landing_signups;
DROP POLICY IF EXISTS "Allow inserts" ON landing_signups;
DROP POLICY IF EXISTS "Allow updates" ON landing_signups;

CREATE POLICY "landing_signups_public_insert" ON landing_signups
  FOR INSERT TO anon
  WITH CHECK (email IS NOT NULL AND email <> '');


-- ============================================
-- 3. RLS DISABLED ON LANDING_SIGNUPS (Prod-Fix)
-- Auf Prod existieren Policies, aber RLS ist nicht aktiviert
-- ENABLE ist idempotent — schadet nicht auf Staging
-- ============================================

ALTER TABLE landing_signups ENABLE ROW LEVEL SECURITY;
