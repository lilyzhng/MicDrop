-- Add definition column to blind_problems table
-- This column stores data structure/concept definitions that are shown before detailed hints
-- For example, for "Invert Binary Tree", it would explain what a binary tree is

ALTER TABLE public.blind_problems 
ADD COLUMN IF NOT EXISTS definition TEXT;

-- Add a comment to describe the column's purpose
COMMENT ON COLUMN public.blind_problems.definition IS 'Data structure or concept definitions to be shown before problem hints (e.g., what is a binary tree)';
