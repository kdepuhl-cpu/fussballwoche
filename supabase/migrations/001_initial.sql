-- ============================================
-- DIAGO: Initial Database Schema
-- ============================================

-- ============================================
-- 1. LEAGUES
-- ============================================
CREATE TABLE leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('herren', 'frauen', 'pokal')),
  tier INTEGER NOT NULL DEFAULT 1,
  region TEXT NOT NULL CHECK (region IN ('national', 'nordost', 'berlin')),
  parent_id TEXT REFERENCES leagues(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_leagues_category ON leagues(category);
CREATE INDEX idx_leagues_region ON leagues(region);
CREATE INDEX idx_leagues_parent_id ON leagues(parent_id);

-- ============================================
-- 2. CLUBS
-- ============================================
CREATE TABLE clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  league_id TEXT REFERENCES leagues(id) ON DELETE SET NULL,
  bezirk TEXT,
  founded_year INTEGER,
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_clubs_league_id ON clubs(league_id);
CREATE INDEX idx_clubs_bezirk ON clubs(bezirk);

-- ============================================
-- 3. ARTICLES
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  category TEXT NOT NULL CHECK (category IN ('spielbericht', 'analyse', 'transfer', 'news', 'interview')),
  image_url TEXT,
  image_alt TEXT,
  image_caption TEXT,
  image_credit TEXT,
  author_name TEXT,
  author_image TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  reading_time_minutes INTEGER,
  league_id TEXT REFERENCES leagues(id) ON DELETE SET NULL,
  club_ids TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_league_id ON articles(league_id);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_is_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_articles_tags ON articles USING GIN (tags);

-- ============================================
-- 4. JOBS
-- ============================================
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  club_name TEXT NOT NULL,
  club_logo_url TEXT,
  district TEXT,
  league TEXT,
  category TEXT NOT NULL CHECK (category IN ('trainer', 'spieler', 'ehrenamt', 'management', 'jugend', 'schiedsrichter')),
  type TEXT NOT NULL CHECK (type IN ('vollzeit', 'teilzeit', 'ehrenamtlich', 'minijob')),
  description TEXT,
  requirements TEXT[] DEFAULT '{}',
  tasks TEXT[] DEFAULT '{}',
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  compensation TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_district ON jobs(district);
CREATE INDEX idx_jobs_is_featured ON jobs(is_featured) WHERE is_featured = true;
CREATE INDEX idx_jobs_active ON jobs(active) WHERE active = true;
CREATE INDEX idx_jobs_tags ON jobs USING GIN (tags);
CREATE INDEX idx_jobs_published_at ON jobs(published_at DESC);

-- ============================================
-- 5. PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  favorite_club_ids TEXT[] DEFAULT '{}',
  bezirk TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'Kreisliga-Fan',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leagues_updated_at
  BEFORE UPDATE ON leagues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_clubs_updated_at
  BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- INCREMENT VIEW COUNT RPC
-- ============================================
CREATE OR REPLACE FUNCTION increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE articles
  SET view_count = view_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Leagues: public read
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leagues are publicly readable"
  ON leagues FOR SELECT
  USING (true);

-- Clubs: public read
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clubs are publicly readable"
  ON clubs FOR SELECT
  USING (true);

-- Articles: public read
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable"
  ON articles FOR SELECT
  USING (true);

-- Jobs: public read
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs are publicly readable"
  ON jobs FOR SELECT
  USING (true);

-- Profiles: own data only
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
