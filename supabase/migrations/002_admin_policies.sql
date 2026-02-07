-- Admin policies for DIAGO
-- Restricts INSERT/UPDATE/DELETE to admin users

-- Helper function: checks if current user is an admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') IN (
    'kdepuhl@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Articles policies
-- ============================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "articles_select" ON articles
  FOR SELECT USING (true);

-- Only admins can insert
CREATE POLICY "articles_insert" ON articles
  FOR INSERT WITH CHECK (is_admin());

-- Only admins can update
CREATE POLICY "articles_update" ON articles
  FOR UPDATE USING (is_admin());

-- Only admins can delete
CREATE POLICY "articles_delete" ON articles
  FOR DELETE USING (is_admin());

-- ============================================
-- Jobs policies
-- ============================================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "jobs_select" ON jobs
  FOR SELECT USING (true);

CREATE POLICY "jobs_insert" ON jobs
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "jobs_update" ON jobs
  FOR UPDATE USING (is_admin());

CREATE POLICY "jobs_delete" ON jobs
  FOR DELETE USING (is_admin());

-- ============================================
-- Clubs policies
-- ============================================
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clubs_select" ON clubs
  FOR SELECT USING (true);

CREATE POLICY "clubs_insert" ON clubs
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "clubs_update" ON clubs
  FOR UPDATE USING (is_admin());

CREATE POLICY "clubs_delete" ON clubs
  FOR DELETE USING (is_admin());
