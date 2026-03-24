-- ============================================
-- 018: Einladungs-System
-- ============================================

CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('redakteur', 'admin')),
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  invited_by UUID REFERENCES auth.users(id),
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Admins können alles
CREATE POLICY "invitations_admin_all" ON invitations
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- Öffentlich lesbar per Token (für Registrierungsseite)
CREATE POLICY "invitations_public_select_by_token" ON invitations
  FOR SELECT USING (true);
