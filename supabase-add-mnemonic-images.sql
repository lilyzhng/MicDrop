-- Add mnemonic_image_url column to blind_problems table
-- Run this SQL in your Supabase SQL Editor FIRST

-- Add the new column
ALTER TABLE public.blind_problems 
ADD COLUMN IF NOT EXISTS mnemonic_image_url TEXT;

-- Create a storage bucket for mnemonic images (run this in Supabase Dashboard > Storage)
-- Or via SQL:
INSERT INTO storage.buckets (id, name, public)
VALUES ('mnemonic-images', 'mnemonic-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to the bucket
CREATE POLICY "Public read access for mnemonic images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'mnemonic-images');

-- Allow authenticated users to upload (optional, for admin use)
CREATE POLICY "Authenticated users can upload mnemonic images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'mnemonic-images');
