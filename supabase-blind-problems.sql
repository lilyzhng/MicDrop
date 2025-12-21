-- Blind75 Problems Table
-- Stores pre-generated Blind 75 coding problems for the Walkie-Talkie feature
-- Run this SQL in your Supabase SQL Editor

-- Table: blind_problems
-- This is a public reference table - all authenticated users can read from it
CREATE TABLE IF NOT EXISTS public.blind_problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE,
    prompt TEXT NOT NULL,
    example TEXT,
    constraints JSONB DEFAULT '[]'::jsonb,
    pattern TEXT NOT NULL,
    key_idea TEXT NOT NULL,
    skeleton TEXT NOT NULL,
    time_complexity TEXT NOT NULL,
    space_complexity TEXT NOT NULL,
    steps JSONB DEFAULT '[]'::jsonb,
    expected_edge_cases JSONB DEFAULT '[]'::jsonb,
    topics JSONB DEFAULT '[]'::jsonb,  -- e.g., ["Array", "Two Pointers"]
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    leetcode_number INTEGER,  -- Optional: LeetCode problem number for reference
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blind_problems_pattern ON public.blind_problems(pattern);
CREATE INDEX IF NOT EXISTS idx_blind_problems_difficulty ON public.blind_problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_blind_problems_topics ON public.blind_problems USING GIN (topics);

-- Enable Row Level Security (RLS)
ALTER TABLE public.blind_problems ENABLE ROW LEVEL SECURITY;

-- RLS Policy: All authenticated users can read blind problems (it's reference data)
CREATE POLICY "Authenticated users can view blind problems"
    ON public.blind_problems
    FOR SELECT
    TO authenticated
    USING (true);

-- Optional: Admin-only write access (you can modify this based on your needs)
-- For now, we'll insert data directly via SQL
