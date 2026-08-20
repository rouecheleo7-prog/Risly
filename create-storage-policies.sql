-- Create RLS policies for biens-images bucket

-- Policy 1: Allow public read
CREATE POLICY "Allow public read"
ON storage.objects
FOR SELECT
USING (bucket_id = 'biens-images');

-- Policy 2: Allow authenticated users to upload to their folder
CREATE POLICY "Allow users upload"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'biens-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy 3: Allow users to delete their own files
CREATE POLICY "Allow users delete"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'biens-images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
