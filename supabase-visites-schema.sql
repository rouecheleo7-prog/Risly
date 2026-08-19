-- Visites table for appointment scheduling

CREATE TABLE IF NOT EXISTS visites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES prospects(id) ON DELETE SET NULL,
  adresse TEXT NOT NULL,
  prospect_nom TEXT NOT NULL,
  date_visite DATE NOT NULL,
  heure_visite TIME NOT NULL,
  notes TEXT,
  statut TEXT DEFAULT 'Planifiée',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_visites_user_id ON visites(user_id);
CREATE INDEX IF NOT EXISTS idx_visites_date ON visites(date_visite);
CREATE INDEX IF NOT EXISTS idx_visites_prospect_id ON visites(prospect_id);

-- Row Level Security
ALTER TABLE visites ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own visites" ON visites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visites" ON visites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visites" ON visites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own visites" ON visites
  FOR DELETE USING (auth.uid() = user_id);
