-- Add 'teach' as an allowed report type for teaching session reports
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE public.saved_reports 
DROP CONSTRAINT IF EXISTS saved_reports_type_check;

-- Add the new constraint with 'teach' included
ALTER TABLE public.saved_reports 
ADD CONSTRAINT saved_reports_type_check 
CHECK (type IN ('coach', 'walkie', 'hot-take', 'teach'));
