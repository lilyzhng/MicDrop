-- Add problem_group column to blind_problems table
-- This column stores the learning group/pattern for each problem
-- Run this SQL in your Supabase SQL Editor

ALTER TABLE public.blind_problems 
ADD COLUMN IF NOT EXISTS problem_group TEXT;

-- Create index for efficient group-based queries
CREATE INDEX IF NOT EXISTS idx_blind_problems_group 
ON public.blind_problems(problem_group);

-- Add comment for documentation
COMMENT ON COLUMN public.blind_problems.problem_group IS 'Learning group/pattern for the problem (e.g., arrays_hashing, two_pointers, dp_1d)';
