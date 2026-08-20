-- Comparables table for property comparison

CREATE TABLE IF NOT EXISTS comparables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  adresse TEXT NOT NULL,
  prix NUMERIC NOT NULL,
  surface NUMERIC NOT NULL,
  localite TEXT NOT NULL,
  type TEXT NOT NULL,
  statut TEXT DEFAULT 'À vendre',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_comparables_user_id ON comparables(user_id);
CREATE INDEX IF NOT EXISTS idx_comparables_localite ON comparables(localite);

-- Row Level Security
ALTER TABLE comparables ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own comparables" ON comparables
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own comparables" ON comparables
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comparables" ON comparables
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comparables" ON comparables
  FOR DELETE USING (auth.uid() = user_id);
