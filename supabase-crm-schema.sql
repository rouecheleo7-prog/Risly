-- CRM Tables for Risly Dashboard

-- Prospects table
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  budget TEXT,
  status TEXT DEFAULT 'Nouveau',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Prospect notes with history
CREATE TABLE IF NOT EXISTS prospect_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_prospects_user_id ON prospects(user_id);
CREATE INDEX IF NOT EXISTS idx_prospect_notes_prospect_id ON prospect_notes(prospect_id);
CREATE INDEX IF NOT EXISTS idx_prospect_notes_created_at ON prospect_notes(created_at);

-- Row Level Security (optional but recommended)
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_notes ENABLE ROW LEVEL SECURITY;

-- Policies to ensure users can only see their own data
CREATE POLICY "Users can view their own prospects" ON prospects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own prospects" ON prospects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prospects" ON prospects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prospects" ON prospects
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view notes on their prospects" ON prospect_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add notes to their prospects" ON prospect_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
