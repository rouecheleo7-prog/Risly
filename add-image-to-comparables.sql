-- Add image column to comparables table
ALTER TABLE comparables ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE comparables ADD COLUMN IF NOT EXISTS image_data BYTEA;
