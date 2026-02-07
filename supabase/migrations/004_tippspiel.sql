-- 004_tippspiel.sql
-- Tipp-Voting: match_votes + match_results

-- match_votes: User-Tipps (1, X, 2)
CREATE TABLE match_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  match_id TEXT NOT NULL,
  vote CHAR(1) NOT NULL CHECK (vote IN ('1', 'X', '2')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE match_votes ADD CONSTRAINT match_votes_unique UNIQUE (user_id, match_id);
CREATE INDEX idx_match_votes_match ON match_votes(match_id);
CREATE INDEX idx_match_votes_user ON match_votes(user_id);

-- RLS: eigene Votes lesen + erstellen, kein Update/Delete
ALTER TABLE match_votes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "votes_select_own" ON match_votes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "votes_insert" ON match_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RPC: aggregierte Stats für alle sichtbar (SECURITY DEFINER)
CREATE OR REPLACE FUNCTION get_vote_stats(p_match_id TEXT)
RETURNS TABLE(vote CHAR(1), count BIGINT, percentage NUMERIC) AS $$
  SELECT v.vote, COUNT(*), ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER(), 0), 1)
  FROM match_votes v WHERE v.match_id = p_match_id GROUP BY v.vote
$$ LANGUAGE sql SECURITY DEFINER;

-- match_results: Admin trägt Ergebnisse ein
CREATE TABLE match_results (
  match_id TEXT PRIMARY KEY,
  result CHAR(1) NOT NULL CHECK (result IN ('1', 'X', '2')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE match_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "results_select" ON match_results FOR SELECT USING (true);
CREATE POLICY "results_admin_insert" ON match_results FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'kdepuhl@gmail.com'));
CREATE POLICY "results_admin_update" ON match_results FOR UPDATE
  USING (EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid() AND email = 'kdepuhl@gmail.com'));
