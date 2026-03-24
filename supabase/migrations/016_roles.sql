-- ============================================
-- 016: Rollen-System (Admin + Redakteur)
-- ============================================

-- 1. Role-Spalte in profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'redakteur', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- 2. Initialer Admin setzen (Kilian)
UPDATE profiles SET role = 'admin'
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'kdepuhl@gmail.com'
);

-- 3. is_admin() neu: checkt role statt hardcoded Email
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 4. is_redakteur(): Admin ODER Redakteur
CREATE OR REPLACE FUNCTION is_redakteur()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role IN ('admin', 'redakteur')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 5. Content-Policies: Redakteure duerfen Artikel/Jobs/Clubs bearbeiten
-- (Alte Policies nutzen is_admin(), neue erlauben auch Redakteure)

-- Articles
DROP POLICY IF EXISTS "articles_insert" ON articles;
DROP POLICY IF EXISTS "articles_update" ON articles;
DROP POLICY IF EXISTS "articles_delete" ON articles;

CREATE POLICY "articles_insert" ON articles
  FOR INSERT WITH CHECK (is_redakteur());

CREATE POLICY "articles_update" ON articles
  FOR UPDATE USING (is_redakteur());

CREATE POLICY "articles_delete" ON articles
  FOR DELETE USING (is_admin());

-- Jobs
DROP POLICY IF EXISTS "jobs_insert" ON jobs;
DROP POLICY IF EXISTS "jobs_update" ON jobs;
DROP POLICY IF EXISTS "jobs_delete" ON jobs;

CREATE POLICY "jobs_insert" ON jobs
  FOR INSERT WITH CHECK (is_redakteur());

CREATE POLICY "jobs_update" ON jobs
  FOR UPDATE USING (is_redakteur());

CREATE POLICY "jobs_delete" ON jobs
  FOR DELETE USING (is_admin());

-- Clubs
DROP POLICY IF EXISTS "clubs_insert" ON clubs;
DROP POLICY IF EXISTS "clubs_update" ON clubs;
DROP POLICY IF EXISTS "clubs_delete" ON clubs;

CREATE POLICY "clubs_insert" ON clubs
  FOR INSERT WITH CHECK (is_redakteur());

CREATE POLICY "clubs_update" ON clubs
  FOR UPDATE USING (is_redakteur());

CREATE POLICY "clubs_delete" ON clubs
  FOR DELETE USING (is_admin());

-- 6. Profiles: Admins koennen alle Profile lesen (fuer Team-Verwaltung)
CREATE POLICY "admins_can_read_all_profiles" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR is_admin());

-- 7. Admins koennen Rollen aendern
CREATE POLICY "admins_can_update_roles" ON profiles
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 8. RPC: Rolle aendern (nur Admins)
CREATE OR REPLACE FUNCTION set_user_role(target_user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Nur Admins koennen Rollen aendern';
  END IF;

  IF new_role NOT IN ('user', 'redakteur', 'admin') THEN
    RAISE EXCEPTION 'Ungueltige Rolle: %', new_role;
  END IF;

  UPDATE profiles SET role = new_role WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
