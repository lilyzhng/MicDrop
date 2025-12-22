-- Assign problem_group to all 75 Blind problems
-- Run this AFTER running supabase-add-problem-group.sql
-- Run this SQL in your Supabase SQL Editor

-- ========================================
-- GROUP: arrays_hashing (8 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Two Sum';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Contains Duplicate';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Valid Anagram';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Group Anagrams';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Top K Frequent Elements';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Longest Consecutive Sequence';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Product of Array Except Self';
UPDATE public.blind_problems SET problem_group = 'arrays_hashing' WHERE title = 'Encode and Decode Strings';

-- ========================================
-- GROUP: two_pointers (3 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'two_pointers' WHERE title = 'Valid Palindrome';
UPDATE public.blind_problems SET problem_group = 'two_pointers' WHERE title = '3Sum';
UPDATE public.blind_problems SET problem_group = 'two_pointers' WHERE title = 'Container With Most Water';

-- ========================================
-- GROUP: sliding_window (4 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'sliding_window' WHERE title = 'Best Time to Buy and Sell Stock';
UPDATE public.blind_problems SET problem_group = 'sliding_window' WHERE title = 'Longest Substring Without Repeating Characters';
UPDATE public.blind_problems SET problem_group = 'sliding_window' WHERE title = 'Longest Repeating Character Replacement';
UPDATE public.blind_problems SET problem_group = 'sliding_window' WHERE title = 'Minimum Window Substring';

-- ========================================
-- GROUP: stack (1 problem)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'stack' WHERE title = 'Valid Parentheses';

-- ========================================
-- GROUP: binary_search (2 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'binary_search' WHERE title = 'Find Minimum in Rotated Sorted Array';
UPDATE public.blind_problems SET problem_group = 'binary_search' WHERE title = 'Search in Rotated Sorted Array';

-- ========================================
-- GROUP: linked_list (6 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'linked_list' WHERE title = 'Reverse Linked List';
UPDATE public.blind_problems SET problem_group = 'linked_list' WHERE title = 'Linked List Cycle';
UPDATE public.blind_problems SET problem_group = 'linked_list' WHERE title = 'Merge Two Sorted Lists';
UPDATE public.blind_problems SET problem_group = 'linked_list' WHERE title = 'Remove Nth Node From End of List';
UPDATE public.blind_problems SET problem_group = 'linked_list' WHERE title = 'Reorder List';
UPDATE public.blind_problems SET problem_group = 'linked_list' WHERE title = 'Merge K Sorted Lists';

-- ========================================
-- GROUP: binary_tree (8 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Maximum Depth of Binary Tree';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Same Tree';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Invert Binary Tree';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Subtree of Another Tree';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Binary Tree Level Order Traversal';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Construct Binary Tree from Preorder and Inorder Traversal';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Binary Tree Maximum Path Sum';
UPDATE public.blind_problems SET problem_group = 'binary_tree' WHERE title = 'Serialize and Deserialize Binary Tree';

-- ========================================
-- GROUP: bst (3 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'bst' WHERE title = 'Lowest Common Ancestor of a Binary Search Tree';
UPDATE public.blind_problems SET problem_group = 'bst' WHERE title = 'Validate Binary Search Tree';
UPDATE public.blind_problems SET problem_group = 'bst' WHERE title = 'Kth Smallest Element in a BST';

-- ========================================
-- GROUP: tries (3 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'tries' WHERE title = 'Implement Trie (Prefix Tree)';
UPDATE public.blind_problems SET problem_group = 'tries' WHERE title = 'Design Add and Search Words Data Structure';
UPDATE public.blind_problems SET problem_group = 'tries' WHERE title = 'Word Search II';

-- ========================================
-- GROUP: heap (3 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'heap' WHERE title = 'Top K Frequent Elements';
UPDATE public.blind_problems SET problem_group = 'heap' WHERE title = 'Find Median from Data Stream';
-- Note: Merge K Sorted Lists is in linked_list group as primary

-- ========================================
-- GROUP: backtracking (2 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'backtracking' WHERE title = 'Combination Sum';
UPDATE public.blind_problems SET problem_group = 'backtracking' WHERE title = 'Word Search';

-- ========================================
-- GROUP: graph (7 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Number of Islands';
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Clone Graph';
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Pacific Atlantic Water Flow';
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Course Schedule';
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Graph Valid Tree';
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Number of Connected Components in an Undirected Graph';
UPDATE public.blind_problems SET problem_group = 'graph' WHERE title = 'Alien Dictionary';

-- ========================================
-- GROUP: dp_1d (10 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Climbing Stairs';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'House Robber';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'House Robber II';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Decode Ways';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Coin Change';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Longest Increasing Subsequence';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Word Break';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Maximum Subarray';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Maximum Product Subarray';
UPDATE public.blind_problems SET problem_group = 'dp_1d' WHERE title = 'Jump Game';

-- ========================================
-- GROUP: dp_2d (2 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'dp_2d' WHERE title = 'Unique Paths';
UPDATE public.blind_problems SET problem_group = 'dp_2d' WHERE title = 'Longest Common Subsequence';

-- ========================================
-- GROUP: intervals (5 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'intervals' WHERE title = 'Meeting Rooms';
UPDATE public.blind_problems SET problem_group = 'intervals' WHERE title = 'Insert Interval';
UPDATE public.blind_problems SET problem_group = 'intervals' WHERE title = 'Merge Intervals';
UPDATE public.blind_problems SET problem_group = 'intervals' WHERE title = 'Non-overlapping Intervals';
UPDATE public.blind_problems SET problem_group = 'intervals' WHERE title = 'Meeting Rooms II';

-- ========================================
-- GROUP: matrix (3 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'matrix' WHERE title = 'Set Matrix Zeroes';
UPDATE public.blind_problems SET problem_group = 'matrix' WHERE title = 'Spiral Matrix';
UPDATE public.blind_problems SET problem_group = 'matrix' WHERE title = 'Rotate Image';

-- ========================================
-- GROUP: bit_manipulation (5 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'bit_manipulation' WHERE title = 'Number of 1 Bits';
UPDATE public.blind_problems SET problem_group = 'bit_manipulation' WHERE title = 'Counting Bits';
UPDATE public.blind_problems SET problem_group = 'bit_manipulation' WHERE title = 'Missing Number';
UPDATE public.blind_problems SET problem_group = 'bit_manipulation' WHERE title = 'Reverse Bits';
UPDATE public.blind_problems SET problem_group = 'bit_manipulation' WHERE title = 'Sum of Two Integers';

-- ========================================
-- GROUP: string_palindrome (2 problems)
-- ========================================
UPDATE public.blind_problems SET problem_group = 'string_palindrome' WHERE title = 'Longest Palindromic Substring';
UPDATE public.blind_problems SET problem_group = 'string_palindrome' WHERE title = 'Palindromic Substrings';

-- ========================================
-- Verification query (optional)
-- ========================================
-- SELECT problem_group, COUNT(*) as count 
-- FROM public.blind_problems 
-- GROUP BY problem_group 
-- ORDER BY count DESC;
