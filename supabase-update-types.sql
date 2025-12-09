-- Update the saved_items table to allow new types
-- Run this in Supabase SQL Editor

-- Drop the old constraint
ALTER TABLE public.saved_items 
DROP CONSTRAINT IF EXISTS saved_items_type_check;

-- Add the new constraint with all allowed types
ALTER TABLE public.saved_items 
ADD CONSTRAINT saved_items_type_check 
CHECK (type IN ('script', 'response', 'tip', 'improvement', 'highlight', 'drill'));

