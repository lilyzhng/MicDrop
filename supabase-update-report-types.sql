-- Update the saved_reports table to allow walkie and hot-take types
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE public.saved_reports 
DROP CONSTRAINT IF EXISTS saved_reports_type_check;

-- Add the new constraint with all allowed types (rehearsal removed)
ALTER TABLE public.saved_reports 
ADD CONSTRAINT saved_reports_type_check 
CHECK (type IN ('coach', 'walkie', 'hot-take'));
