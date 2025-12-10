-- Add report_date column to saved_reports table
-- This allows users to edit the date of their reports independently from created_at
-- Run this in Supabase SQL Editor

ALTER TABLE public.saved_reports 
ADD COLUMN IF NOT EXISTS report_date TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Update existing reports to use created_at as initial report_date
UPDATE public.saved_reports 
SET report_date = created_at 
WHERE report_date IS NULL OR report_date = created_at;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_reports_report_date ON public.saved_reports(report_date DESC);
