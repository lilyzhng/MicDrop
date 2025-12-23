-- Check which problems are missing definitions or detailed hints
-- Run this to see what data is missing in your database

-- Problems missing definitions
SELECT title, leetcode_number, difficulty 
FROM public.blind_problems 
WHERE definition IS NULL 
ORDER BY leetcode_number;

-- Problems missing detailed hints
SELECT title, leetcode_number, difficulty 
FROM public.blind_problems 
WHERE detailed_hint IS NULL 
ORDER BY leetcode_number;

-- Summary count
SELECT 
    COUNT(*) as total_problems,
    COUNT(definition) as has_definition,
    COUNT(detailed_hint) as has_detailed_hint,
    COUNT(*) - COUNT(definition) as missing_definition,
    COUNT(*) - COUNT(detailed_hint) as missing_detailed_hint
FROM public.blind_problems;

-- Check if definition column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blind_problems' 
AND column_name = 'definition';
