-- Add new columns to prospects table for better criteria capture
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS localisation TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS nombre_pieces TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS type_bien TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS surface_min NUMERIC;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS surface_max NUMERIC;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS budget_min NUMERIC;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS budget_max NUMERIC;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS priorites TEXT;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS date_suivi DATE;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS favoris BOOLEAN DEFAULT false;
