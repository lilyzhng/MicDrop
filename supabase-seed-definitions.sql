-- Definitions Seed Data for Blind 75 Problems
-- Run this AFTER running supabase-add-definition.sql
-- These definitions explain the core data structures and concepts before diving into problem hints

-- ========================================
-- CATEGORY: Arrays (10 problems)
-- ========================================

-- 1. Two Sum
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based). Arrays have O(1) random access but O(n) search for unsorted data.

**Hash Map (Dictionary)**: A data structure that stores key-value pairs and provides O(1) average-time lookups, insertions, and deletions. It uses a hash function to convert keys into array indices.'
WHERE title = 'Two Sum';

-- 2. Best Time to Buy and Sell Stock
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based). In this problem, the array represents stock prices over time, where each index is a day.

**Running Minimum/Maximum**: A technique where you track the smallest (or largest) value seen so far as you iterate through an array. This allows single-pass solutions for problems that depend on past values.'
WHERE title = 'Best Time to Buy and Sell Stock';

-- 3. Contains Duplicate
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based).

**Hash Set**: A collection that stores unique elements and provides O(1) average-time lookups and insertions. Unlike a hash map, it only stores keys (no values). Perfect for tracking "have I seen this before?" questions.'
WHERE title = 'Contains Duplicate';

-- 4. Product of Array Except Self
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based).

**Prefix/Suffix Arrays**: Prefix arrays store cumulative computations from the start (e.g., prefix[i] = operation on elements 0 to i-1). Suffix arrays store computations from the end. Together, they help answer queries about "all elements except one" efficiently.'
WHERE title = 'Product of Array Except Self';

-- 5. Maximum Subarray
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based).

**Subarray**: A contiguous portion of an array. Unlike a subsequence, elements must be adjacent. For array [1,2,3,4], valid subarrays include [2,3] and [1,2,3], but NOT [1,3] (non-contiguous).

**Kadane''s Algorithm**: A dynamic programming technique that finds the maximum sum subarray in O(n) time by deciding at each position: extend the current subarray or start fresh?'
WHERE title = 'Maximum Subarray';

-- 6. Maximum Product Subarray
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based).

**Subarray**: A contiguous portion of an array where elements must be adjacent.

**Key Insight for Products**: Unlike sums, products have special behavior with negative numbers—multiplying two negatives gives a positive. This means the minimum product could become the maximum after one more multiplication.'
WHERE title = 'Maximum Product Subarray';

-- 7. Find Minimum in Rotated Sorted Array
UPDATE public.blind_problems SET definition = 
'**Sorted Array**: An array where elements are arranged in increasing (or decreasing) order. Enables O(log n) binary search.

**Rotated Sorted Array**: A sorted array that has been "rotated" at some pivot point. For example, [1,2,3,4,5] rotated at index 3 becomes [4,5,1,2,3]. It consists of two sorted subarrays.

**Binary Search**: A divide-and-conquer algorithm that repeatedly halves the search space by comparing the target to the middle element. Requires O(log n) time on sorted data.'
WHERE title = 'Find Minimum in Rotated Sorted Array';

-- 8. Search in Rotated Sorted Array
UPDATE public.blind_problems SET definition = 
'**Sorted Array**: An array where elements are arranged in increasing (or decreasing) order. Enables O(log n) binary search.

**Rotated Sorted Array**: A sorted array that has been "rotated" at some pivot point. For example, [1,2,3,4,5] rotated at index 3 becomes [4,5,1,2,3]. The key property: at least one half of the array is always properly sorted.

**Binary Search**: A divide-and-conquer algorithm that repeatedly halves the search space. The challenge here is determining which half to search when the array is rotated.'
WHERE title = 'Search in Rotated Sorted Array';

-- 9. 3Sum
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based).

**Two-Pointer Technique**: A strategy using two pointers that move toward each other (or in the same direction) to solve problems in O(n) time instead of O(n²). Often used on sorted arrays.

**N-Sum Pattern**: A family of problems (2Sum, 3Sum, 4Sum) that can be reduced: solve 3Sum by fixing one element and solving 2Sum on the remainder.'
WHERE title = '3Sum';

-- 10. Container With Most Water
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations. Here, each element represents the height of a vertical line.

**Two-Pointer Technique**: A strategy using two pointers (often at opposite ends) that move toward each other. The key insight is determining which pointer to move based on some condition—here, always move the shorter line inward.'
WHERE title = 'Container With Most Water';

-- ========================================
-- CATEGORY: Binary (5 problems)
-- ========================================

-- 11. Sum of Two Integers
UPDATE public.blind_problems SET definition = 
'**Bit Manipulation**: Operating directly on the binary representation of numbers using bitwise operators: AND (&), OR (|), XOR (^), NOT (~), left shift (<<), right shift (>>).

**Binary Addition**: When adding in binary, XOR gives the sum without carries, AND identifies where carries occur, and left shift positions the carries correctly. Repeat until no carries remain.

**32-bit Integer**: Most languages use 32 bits for integers. When doing bit manipulation, you may need to mask results to handle overflow.'
WHERE title = 'Sum of Two Integers';

-- 12. Number of 1 Bits
UPDATE public.blind_problems SET definition = 
'**Bit Manipulation**: Operating directly on the binary representation of numbers using bitwise operators.

**Binary Representation**: Every integer can be represented as a sequence of 0s and 1s. For example, 5 in binary is 101 (4 + 0 + 1).

**Hamming Weight**: The number of 1 bits in a binary representation. Also called "population count" or "popcount."

**Brian Kernighan''s Algorithm**: The expression n & (n-1) clears the rightmost set bit. Counting how many times you can do this gives the number of 1 bits.'
WHERE title = 'Number of 1 Bits';

-- 13. Counting Bits
UPDATE public.blind_problems SET definition = 
'**Bit Manipulation**: Operating directly on the binary representation of numbers using bitwise operators.

**Dynamic Programming (DP)**: Solving problems by breaking them into overlapping subproblems and storing results. Here, the number of 1s in a number relates to previously computed values.

**Key Relationship**: The count of 1s in number i equals count(i >> 1) + (i & 1). Right-shifting removes the last bit; (i & 1) checks if the last bit was 1.'
WHERE title = 'Counting Bits';

-- 14. Missing Number
UPDATE public.blind_problems SET definition = 
'**Array**: An ordered collection of elements stored at contiguous memory locations, accessed by index (0-based).

**XOR Properties**: XOR (^) has useful properties: a ^ a = 0, a ^ 0 = a, and XOR is commutative/associative. If you XOR all numbers from 0 to n with all array elements, duplicates cancel out, leaving the missing number.

**Gauss''s Formula**: The sum of integers from 0 to n is n*(n+1)/2. Subtracting the actual array sum gives the missing number.'
WHERE title = 'Missing Number';

-- 15. Reverse Bits
UPDATE public.blind_problems SET definition = 
'**Bit Manipulation**: Operating directly on the binary representation of numbers using bitwise operators.

**32-bit Unsigned Integer**: A number represented with exactly 32 binary digits, with no sign bit (all values are non-negative).

**Bit Extraction and Placement**: To reverse bits, extract each bit from the right side of the input and place it on the left side of the output. Use (n & 1) to extract the last bit and (result << 1) to make room in the result.'
WHERE title = 'Reverse Bits';

-- ========================================
-- CATEGORY: Dynamic Programming (11 problems)
-- ========================================

-- 16. Climbing Stairs
UPDATE public.blind_problems SET definition = 
'**Dynamic Programming (DP)**: A technique for solving problems by breaking them into smaller overlapping subproblems, solving each once, and storing the results.

**Fibonacci Sequence**: A sequence where each number is the sum of the two preceding ones: 1, 1, 2, 3, 5, 8, 13... Climbing stairs follows this pattern because you can reach step n from either step n-1 or n-2.

**State Transition**: The core of DP—defining how to compute the current state from previous states. Here: ways(n) = ways(n-1) + ways(n-2).'
WHERE title = 'Climbing Stairs';

-- 17. Coin Change
UPDATE public.blind_problems SET definition = 
'**Dynamic Programming (DP)**: A technique for solving optimization problems by building solutions to larger problems from solutions to smaller subproblems.

**Unbounded Knapsack**: A category of DP problems where you can use each item (coin) unlimited times. Unlike 0/1 knapsack, the same coin can contribute multiple times to the solution.

**State Definition**: dp[amount] = minimum coins needed to make that amount. Build from dp[0] = 0 up to dp[target].'
WHERE title = 'Coin Change';

-- 18. Longest Increasing Subsequence
UPDATE public.blind_problems SET definition = 
'**Subsequence**: A sequence derived from another by deleting some (or no) elements without changing the order. For [1,3,2,4], valid subsequences include [1,3,4] and [1,2,4]. Unlike subarrays, elements need not be contiguous.

**Dynamic Programming (DP)**: Build solutions by computing the LIS ending at each index, using previously computed values.

**Patience Sorting / Binary Search Optimization**: An O(n log n) approach that maintains the smallest possible ending element for each subsequence length.'
WHERE title = 'Longest Increasing Subsequence';

-- 19. Longest Common Subsequence
UPDATE public.blind_problems SET definition = 
'**Subsequence**: A sequence derived from another by deleting some (or no) elements without changing the order. For "abcde", valid subsequences include "ace" and "bde".

**2D Dynamic Programming**: When comparing two sequences, use a 2D table where dp[i][j] represents the solution for the first i characters of string1 and first j characters of string2.

**Optimal Substructure**: The LCS of two strings depends on whether their last characters match. If yes, extend the LCS. If no, take the better of excluding either character.'
WHERE title = 'Longest Common Subsequence';

-- 20. Word Break
UPDATE public.blind_problems SET definition = 
'**Dynamic Programming (DP)**: A technique for solving problems by storing solutions to subproblems. Here, dp[i] indicates whether the first i characters can be segmented into dictionary words.

**String Segmentation**: Breaking a string into valid parts. At each position, check all possible "last words" that end there.

**Hash Set for Dictionary**: Convert the word list to a set for O(1) lookup when checking if a substring is a valid word.'
WHERE title = 'Word Break';

-- 21. Combination Sum
UPDATE public.blind_problems SET definition = 
'**Backtracking**: A systematic way to explore all possibilities by building candidates incrementally and abandoning ("backtracking") paths that cannot lead to valid solutions.

**Combination vs Permutation**: Combinations ignore order ([1,2] = [2,1]), permutations consider order. For combinations, always iterate forward from the current index to avoid duplicates.

**Unbounded Selection**: Each candidate can be used unlimited times. When including a candidate, stay at the same index to allow reuse.'
WHERE title = 'Combination Sum';

-- 22. House Robber
UPDATE public.blind_problems SET definition = 
'**Dynamic Programming (DP)**: A technique for solving optimization problems by making optimal choices at each step based on previous results.

**Linear DP with Constraints**: At each house, you choose to rob it (adding to the loot from two houses back) or skip it (keeping the loot from the previous house). This creates the recurrence: dp[i] = max(dp[i-2] + nums[i], dp[i-1]).

**Space Optimization**: Since you only need the last two values, you can reduce from O(n) space to O(1).'
WHERE title = 'House Robber';

-- 23. House Robber II
UPDATE public.blind_problems SET definition = 
'**Circular Array**: An array where the last element is considered adjacent to the first. This creates a constraint: you cannot select both the first and last elements.

**Problem Reduction**: Solve the circular constraint by breaking it into two linear subproblems: one excluding the first house, one excluding the last house. Take the maximum of both solutions.

**Linear DP**: Same as House Robber I, but applied to the two subproblems.'
WHERE title = 'House Robber II';

-- 24. Decode Ways
UPDATE public.blind_problems SET definition = 
'**Dynamic Programming (DP)**: Building the count of valid decodings by considering how each position can be decoded.

**String to Integer Mapping**: Letters A-Z map to numbers 1-26. A string of digits can be decoded in multiple ways: "12" could be "AB" (1,2) or "L" (12).

**Valid Decoding Rules**: Single digits 1-9 are valid (not 0). Two-digit numbers 10-26 are valid. Leading zeros (like "01") are invalid. The digit 0 can only be part of "10" or "20".'
WHERE title = 'Decode Ways';

-- 25. Unique Paths
UPDATE public.blind_problems SET definition = 
'**2D Grid**: A matrix with rows and columns. Movement is typically restricted to right and down (no diagonal or backward moves in this problem).

**2D Dynamic Programming**: dp[i][j] represents the number of ways to reach cell (i,j). Each cell can only be reached from the cell above or the cell to the left.

**Combinatorics Alternative**: This is equivalent to choosing (m-1) down moves out of (m+n-2) total moves, which equals C(m+n-2, m-1).'
WHERE title = 'Unique Paths';

-- 26. Jump Game
UPDATE public.blind_problems SET definition = 
'**Array**: Each element represents the maximum jump length from that position.

**Greedy Algorithm**: Make the locally optimal choice at each step. Here, always track the farthest index reachable so far.

**Reachability**: A position is reachable if your current maximum reach is >= that position''s index. If you can reach the last index, return true.'
WHERE title = 'Jump Game';

-- ========================================
-- CATEGORY: Graph (6 problems)
-- ========================================

-- 27. Clone Graph
UPDATE public.blind_problems SET definition = 
'**Graph**: A data structure consisting of nodes (vertices) connected by edges. Can be directed or undirected.

**Adjacency List**: A common graph representation where each node stores a list of its neighbors. Node 1 with neighbors [2, 3] means edges exist from node 1 to nodes 2 and 3.

**Deep Copy**: Creating a completely independent copy where no references point to the original. Each node must be newly created with new neighbor lists.

**Hash Map for Visited**: Maps original nodes to their clones. Prevents infinite loops and ensures each node is cloned exactly once.'
WHERE title = 'Clone Graph';

-- 28. Course Schedule
UPDATE public.blind_problems SET definition = 
'**Directed Graph**: A graph where edges have direction (A → B means you can go from A to B, but not necessarily B to A). Prerequisites naturally form directed edges.

**Cycle Detection**: In a dependency graph, a cycle means a circular dependency (A requires B, B requires C, C requires A). If a cycle exists, not all tasks can be completed.

**Topological Sort**: Ordering nodes so that for every directed edge A → B, A comes before B. Only possible in acyclic graphs (DAGs).

**Three-State DFS**: Track nodes as unvisited, visiting (in current path), or visited (fully processed). Finding a "visiting" node means a cycle exists.'
WHERE title = 'Course Schedule';

-- 29. Pacific Atlantic Water Flow
UPDATE public.blind_problems SET definition = 
'**2D Grid/Matrix**: A grid where each cell has a height value. Water flows from higher cells to equal or lower adjacent cells.

**Multi-Source BFS/DFS**: Instead of checking each cell individually, start from the destination (ocean borders) and work backwards. Find all cells that can reach each ocean.

**Reverse Flow**: Water flows downhill, but we search uphill from the oceans—a cell can reach the ocean if we can reach it from the ocean going uphill (to equal or higher cells).'
WHERE title = 'Pacific Atlantic Water Flow';

-- 30. Number of Islands
UPDATE public.blind_problems SET definition = 
'**2D Grid/Matrix**: A grid of characters where ''1'' represents land and ''0'' represents water.

**Connected Components**: In graph terms, an island is a connected component of ''1''s. Two cells are connected if they share an edge (not diagonal).

**Flood Fill Algorithm**: When you find an unvisited land cell, you''ve discovered a new island. Use DFS/BFS to mark all connected land cells as visited ("sink" the island), then continue searching for more islands.'
WHERE title = 'Number of Islands';

-- 31. Longest Consecutive Sequence
UPDATE public.blind_problems SET definition = 
'**Array/Set**: The input is an unsorted array. Convert to a hash set for O(1) lookups.

**Sequence**: A consecutive sequence like [1, 2, 3, 4] where each element differs by 1 from its neighbors. Elements can appear anywhere in the original array.

**Sequence Start Detection**: To avoid counting the same sequence multiple times, only start counting from the beginning of a sequence—a number is a sequence start if (number - 1) is NOT in the set.'
WHERE title = 'Longest Consecutive Sequence';

-- 32. Alien Dictionary
UPDATE public.blind_problems SET definition = 
'**Directed Graph**: Each character is a node. An edge from ''a'' to ''b'' means ''a'' comes before ''b'' in the alien alphabet.

**Topological Sort**: Ordering nodes respecting all directed edges. The alien alphabet is a valid topological ordering of the character graph.

**Lexicographic Ordering**: In a sorted word list, comparing adjacent words reveals ordering rules. The first differing character between two adjacent words tells us which character comes first in the alphabet.'
WHERE title = 'Alien Dictionary';

-- 33. Graph Valid Tree
UPDATE public.blind_problems SET definition = 
'**Tree**: A special type of graph that is connected (all nodes reachable from any node) and acyclic (no cycles). A tree with n nodes has exactly n-1 edges.

**Union-Find (Disjoint Set Union)**: A data structure that tracks which elements belong to the same set. Supports near-O(1) union and find operations. If unioning two nodes that are already in the same set, a cycle exists.

**Connected Components**: Groups of nodes where each node is reachable from every other node in the group. A valid tree has exactly one connected component.'
WHERE title = 'Graph Valid Tree';

-- 34. Number of Connected Components
UPDATE public.blind_problems SET definition = 
'**Undirected Graph**: A graph where edges have no direction—if A connects to B, then B connects to A.

**Connected Components**: Groups of nodes where every node in the group is reachable from every other node in the same group. Nodes in different components have no path between them.

**Union-Find (Disjoint Set Union)**: Initialize each node as its own component. For each edge, union the two nodes. Count remaining distinct sets.'
WHERE title = 'Number of Connected Components in an Undirected Graph';

-- ========================================
-- CATEGORY: Intervals (5 problems)
-- ========================================

-- 35. Insert Interval
UPDATE public.blind_problems SET definition = 
'**Interval**: A pair [start, end] representing a continuous range. Two intervals overlap if one starts before the other ends and vice versa.

**Sorted Intervals**: When intervals are sorted by start time, overlapping intervals are adjacent. This enables single-pass algorithms.

**Interval Merging**: When two intervals overlap, merge them into [min(starts), max(ends)]. Non-overlapping intervals remain separate.'
WHERE title = 'Insert Interval';

-- 36. Merge Intervals
UPDATE public.blind_problems SET definition = 
'**Interval**: A pair [start, end] representing a continuous range from start to end (inclusive).

**Overlapping Intervals**: Two intervals [a, b] and [c, d] overlap if one starts before the other ends: a <= d AND c <= b. Or simpler: they overlap if NOT (b < c OR d < a).

**Merge Operation**: When intervals overlap, combine them into a single interval: [min(a, c), max(b, d)]. Sorting by start time ensures overlapping intervals are adjacent.'
WHERE title = 'Merge Intervals';

-- 37. Non-overlapping Intervals
UPDATE public.blind_problems SET definition = 
'**Interval**: A pair [start, end] representing a continuous range.

**Interval Scheduling**: A classic greedy problem—select the maximum number of non-overlapping intervals, or equivalently, remove the minimum number to make them non-overlapping.

**Greedy Choice**: Sort by END time. Always keep the interval that ends earliest—it leaves the most room for future intervals. When conflicts occur, remove the one that ends later.'
WHERE title = 'Non-overlapping Intervals';

-- 38. Meeting Rooms
UPDATE public.blind_problems SET definition = 
'**Interval**: A pair [start, end] representing a meeting''s time range.

**Overlap Detection**: Two meetings conflict if one starts before the other ends. After sorting by start time, just check if each meeting starts after the previous one ends.

**Sorted Intervals**: Sorting brings potentially overlapping intervals adjacent to each other, simplifying the comparison to just consecutive pairs.'
WHERE title = 'Meeting Rooms';

-- 39. Meeting Rooms II
UPDATE public.blind_problems SET definition = 
'**Interval**: A pair [start, end] representing a meeting''s time range.

**Concurrent Events**: At any point in time, multiple meetings may be happening simultaneously. The maximum number of concurrent meetings equals the minimum rooms needed.

**Min-Heap**: A data structure where the minimum element is always at the top. Use it to track the earliest ending meeting—if a new meeting starts after it ends, reuse that room.

**Sweep Line Algorithm**: Create +1 events for starts and -1 events for ends. Sort by time and scan through, tracking the running count. The maximum count is the answer.'
WHERE title = 'Meeting Rooms II';

-- ========================================
-- CATEGORY: Linked List (6 problems)
-- ========================================

-- 40. Reverse Linked List
UPDATE public.blind_problems SET definition = 
'**Linked List**: A linear data structure where each node contains a value and a pointer to the next node. Unlike arrays, elements are not stored contiguously—they''re connected via pointers.

**Singly Linked List**: Each node only points forward (to next). You can only traverse in one direction.

**In-Place Reversal**: Reversing without creating new nodes. Change each node''s next pointer to point to its previous node instead.'
WHERE title = 'Reverse Linked List';

-- 41. Linked List Cycle
UPDATE public.blind_problems SET definition = 
'**Linked List**: A linear data structure where each node points to the next. The last node typically points to null, but a cycle occurs when it points to an earlier node.

**Cycle**: When following next pointers leads back to a previously visited node, creating an infinite loop.

**Floyd''s Cycle Detection (Tortoise and Hare)**: Use two pointers—slow moves 1 step, fast moves 2 steps. If there''s a cycle, they will eventually meet inside it. If fast reaches null, there''s no cycle.'
WHERE title = 'Linked List Cycle';

-- 42. Merge Two Sorted Lists
UPDATE public.blind_problems SET definition = 
'**Linked List**: A linear data structure where each node contains a value and a pointer to the next node.

**Sorted Linked List**: A linked list where values are in ascending order. Merging two sorted lists produces one sorted list containing all elements.

**Dummy Head Node**: A technique to simplify linked list construction. Create a dummy node at the start, build the list after it, then return dummy.next. This avoids special-casing the first node.'
WHERE title = 'Merge Two Sorted Lists';

-- 43. Merge K Sorted Lists
UPDATE public.blind_problems SET definition = 
'**Linked List**: A linear data structure where each node contains a value and a pointer to the next node.

**Min-Heap (Priority Queue)**: A data structure that always gives you the minimum element in O(log n) time. Perfect for repeatedly finding the smallest among k elements.

**Divide and Conquer**: Pair up lists and merge each pair. Repeat until one list remains. Similar to merge sort—each level halves the number of lists.'
WHERE title = 'Merge K Sorted Lists';

-- 44. Remove Nth Node From End of List
UPDATE public.blind_problems SET definition = 
'**Linked List**: A linear data structure where each node points to the next. You cannot directly access elements by index—you must traverse from the head.

**Two-Pointer Technique (Gap Method)**: Use two pointers spaced n nodes apart. When the lead pointer reaches the end, the trailing pointer is at the right position.

**Dummy Head Node**: Placing a dummy node before the head helps handle edge cases, like removing the first node (when n equals the list length).'
WHERE title = 'Remove Nth Node From End of List';

-- 45. Reorder List
UPDATE public.blind_problems SET definition = 
'**Linked List**: A linear data structure where each node contains a value and a pointer to the next node.

**Finding the Middle**: Use slow/fast pointers—slow moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle.

**In-Place Interleaving**: The problem requires rearranging without extra space: find middle, reverse second half, then interleave the two halves.'
WHERE title = 'Reorder List';

-- ========================================
-- CATEGORY: Matrix (4 problems)
-- ========================================

-- 46. Set Matrix Zeroes
UPDATE public.blind_problems SET definition = 
'**Matrix**: A 2D array with rows and columns. Access elements as matrix[row][col].

**In-Place Algorithm**: Solve the problem using only the existing matrix for storage, achieving O(1) extra space.

**Marker Technique**: Use the first row and first column of the matrix itself to mark which rows/columns should be zeroed. This avoids needing separate arrays to track this information.'
WHERE title = 'Set Matrix Zeroes';

-- 47. Spiral Matrix
UPDATE public.blind_problems SET definition = 
'**Matrix**: A 2D array with m rows and n columns. Elements are accessed as matrix[row][col].

**Boundary Tracking**: Maintain four boundaries (top, bottom, left, right) that shrink as you traverse the matrix. After completing each direction, shrink the corresponding boundary.

**Spiral Order**: Move right along the top row, down the right column, left along the bottom row, and up the left column. Repeat with shrinking boundaries until they cross.'
WHERE title = 'Spiral Matrix';

-- 48. Rotate Image
UPDATE public.blind_problems SET definition = 
'**Matrix**: A 2D array, specifically an n×n square matrix in this problem.

**In-Place Rotation**: Rotate without using additional matrix storage. Each element moves to a new position, and you can chain these moves in groups of 4.

**Transpose**: Swapping matrix[i][j] with matrix[j][i], effectively flipping along the main diagonal.

**90° Clockwise Rotation = Transpose + Reverse Each Row**: This two-step approach is cleaner than rotating elements directly.'
WHERE title = 'Rotate Image';

-- 49. Word Search
UPDATE public.blind_problems SET definition = 
'**Matrix/Grid**: A 2D array of characters where you can move up, down, left, or right to adjacent cells.

**Backtracking**: Explore paths by making choices, and undo them (backtrack) when they don''t lead to a solution. Mark cells as visited while exploring, then unmark when returning.

**DFS (Depth-First Search)**: Explore as far as possible along each path before backtracking. At each cell, try all four directions recursively.'
WHERE title = 'Word Search';

-- ========================================
-- CATEGORY: String (10 problems)
-- ========================================

-- 50. Longest Substring Without Repeating Characters
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters, accessed by index. In most languages, strings are immutable.

**Substring**: A contiguous sequence of characters within a string. Unlike subsequence, characters must be adjacent.

**Sliding Window**: A technique using two pointers to define a "window" that slides through the data. Expand by moving the right pointer, shrink by moving the left pointer when a condition is violated.

**Hash Set/Map**: Track which characters are in the current window for O(1) duplicate detection.'
WHERE title = 'Longest Substring Without Repeating Characters';

-- 51. Longest Repeating Character Replacement
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters, accessed by index.

**Sliding Window**: Maintain a window of characters. The window is valid if (window_length - count_of_most_frequent_char) <= k, meaning you can replace up to k characters to make all characters the same.

**Character Frequency Map**: Track how many times each character appears in the current window. The most frequent character is the one you want to keep.'
WHERE title = 'Longest Repeating Character Replacement';

-- 52. Minimum Window Substring
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters. You''re finding the smallest substring of s that contains all characters in t (with correct frequencies).

**Sliding Window**: Expand right to include more characters, shrink left to minimize the window while maintaining validity.

**Character Frequency Matching**: Use two hash maps—one for target frequencies, one for current window. Track how many characters have met their required count.'
WHERE title = 'Minimum Window Substring';

-- 53. Valid Anagram
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters. Strings in this problem contain only lowercase letters.

**Anagram**: A word formed by rearranging all letters of another word exactly once. "listen" and "silent" are anagrams—same letters, different order.

**Character Frequency**: Count occurrences of each character. Two strings are anagrams if and only if they have identical character frequencies.'
WHERE title = 'Valid Anagram';

-- 54. Group Anagrams
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters. Each string in the input contains only lowercase letters.

**Anagram**: Words with the same characters in different arrangements. All anagrams share the same "signature"—either sorted characters or character counts.

**Hash Map Grouping**: Use the signature as a key in a hash map. All strings mapping to the same key are anagrams of each other.'
WHERE title = 'Group Anagrams';

-- 55. Valid Parentheses
UPDATE public.blind_problems SET definition = 
'**String**: A sequence containing only the characters ''('', '')'', ''{'', ''}'', ''['', '']''.

**Stack**: A Last-In-First-Out (LIFO) data structure. Push adds to the top, pop removes from the top. Perfect for matching pairs where the most recent opening bracket must match the next closing bracket.

**Bracket Matching**: Opening brackets are pushed onto the stack. Closing brackets must match the top of the stack. If they don''t match, or the stack is empty when we need to match, the string is invalid.'
WHERE title = 'Valid Parentheses';

-- 56. Valid Palindrome
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters. This problem considers only alphanumeric characters (letters and digits), ignoring case.

**Palindrome**: A string that reads the same forwards and backwards. "racecar" and "A man a plan a canal Panama" (ignoring spaces/case) are palindromes.

**Two-Pointer Technique**: Use pointers at both ends, moving toward the center. Skip non-alphanumeric characters. Compare characters case-insensitively.'
WHERE title = 'Valid Palindrome';

-- 57. Longest Palindromic Substring
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters, accessed by index.

**Palindrome**: A string that reads the same forwards and backwards.

**Expand Around Center**: Every palindrome has a center (single character for odd length, between two characters for even length). From each possible center, expand outward while characters match. There are 2n-1 possible centers in a string of length n.'
WHERE title = 'Longest Palindromic Substring';

-- 58. Palindromic Substrings
UPDATE public.blind_problems SET definition = 
'**String**: A sequence of characters.

**Palindrome**: A string that reads the same forwards and backwards. Every single character is a palindrome.

**Substring**: A contiguous portion of a string. For "abc", substrings are "a", "b", "c", "ab", "bc", "abc".

**Expand Around Center**: Count palindromes by expanding from each possible center. Each successful expansion (characters match) counts as one palindrome.'
WHERE title = 'Palindromic Substrings';

-- 59. Encode and Decode Strings
UPDATE public.blind_problems SET definition = 
'**String Array**: A list of strings that may contain any characters, including delimiters you might want to use for encoding.

**Serialization**: Converting a data structure (list of strings) into a single string for storage or transmission, then reconstructing the original structure.

**Length-Prefix Encoding**: Prefix each string with its length and a delimiter (e.g., "3#abc"). This unambiguously separates strings regardless of their content.'
WHERE title = 'Encode and Decode Strings';

-- ========================================
-- CATEGORY: Tree (11 problems)
-- ========================================

-- 60. Maximum Depth of Binary Tree
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree where each node has at most two children, called left and right. The tree starts at a root node.

**Depth (Height)**: The number of nodes along the longest path from the root to a leaf. An empty tree has depth 0. A single node has depth 1.

**Recursive Definition**: The depth of a tree is 1 + max(depth of left subtree, depth of right subtree). Base case: null node has depth 0.'
WHERE title = 'Maximum Depth of Binary Tree';

-- 61. Same Tree
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree data structure where each node has at most two children (left and right).

**Structural Equality**: Two trees are the same if they have identical structure AND identical values at each corresponding position.

**Recursive Comparison**: Two trees are the same if: (1) both are null, OR (2) both are non-null, their values match, AND their left and right subtrees are the same.'
WHERE title = 'Same Tree';

-- 62. Invert Binary Tree
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree data structure where each node has a value and pointers to at most two children: left and right.

**Tree Inversion (Mirror)**: Swapping the left and right children of every node in the tree. The result is a mirror image of the original tree.

**Recursive Structure**: Invert a tree by swapping the current node''s children, then recursively inverting both subtrees.'
WHERE title = 'Invert Binary Tree';

-- 63. Binary Tree Maximum Path Sum
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree where each node has a value (can be negative) and at most two children.

**Path**: A sequence of nodes where each pair of adjacent nodes has an edge. A path does NOT need to go through the root. A path can start and end at any nodes.

**Path Sum**: The sum of all node values along a path. The maximum path sum might be a single node (if all neighbors are negative).

**Contribution vs Path**: A node contributes to a path going UP to its parent (itself + one child). But it could also be the "apex" of a path (left + node + right).'
WHERE title = 'Binary Tree Maximum Path Sum';

-- 64. Binary Tree Level Order Traversal
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree where each node has at most two children (left and right).

**Level Order Traversal (BFS)**: Visit all nodes at depth 1, then depth 2, then depth 3, etc. Process the tree level by level, left to right within each level.

**Queue**: A First-In-First-Out (FIFO) data structure. Use it to process nodes in the order they were added. Add children to the queue as you process each node.'
WHERE title = 'Binary Tree Level Order Traversal';

-- 65. Serialize and Deserialize Binary Tree
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree where each node has a value and at most two children (left and right).

**Serialization**: Converting a data structure to a string format that can be stored or transmitted. The format must capture both values AND structure.

**Preorder with Null Markers**: Traverse root-left-right, recording each node''s value (or "null" for missing children). This format uniquely represents the tree structure.'
WHERE title = 'Serialize and Deserialize Binary Tree';

-- 66. Subtree of Another Tree
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree where each node has at most two children (left and right).

**Subtree**: A tree rooted at some node of the original tree. The subtree includes that node and all its descendants. For tree A with subtree B, B''s root must exist in A, and everything under it must match.

**Tree Matching**: To check if B is a subtree of A, for each node in A, check if the tree rooted there is identical to B.'
WHERE title = 'Subtree of Another Tree';

-- 67. Construct Binary Tree from Preorder and Inorder Traversal
UPDATE public.blind_problems SET definition = 
'**Binary Tree**: A tree where each node has at most two children (left and right).

**Preorder Traversal**: Visit order is root → left subtree → right subtree. The first element is always the root.

**Inorder Traversal**: Visit order is left subtree → root → right subtree. For any node, elements to its left in inorder belong to its left subtree.

**Reconstruction**: Preorder tells you WHAT the root is. Inorder tells you HOW to split into left and right subtrees.'
WHERE title = 'Construct Binary Tree from Preorder and Inorder Traversal';

-- 68. Validate Binary Search Tree
UPDATE public.blind_problems SET definition = 
'**Binary Search Tree (BST)**: A binary tree where for every node: all values in its left subtree are LESS than the node''s value, and all values in its right subtree are GREATER than the node''s value.

**Valid Range**: Each node must fall within a valid range. The root can be any value. Left children must be less than their parent and inherit an upper bound. Right children must be greater and inherit a lower bound.

**Inorder Property**: An inorder traversal of a valid BST produces values in strictly increasing order.'
WHERE title = 'Validate Binary Search Tree';

-- 69. Kth Smallest Element in a BST
UPDATE public.blind_problems SET definition = 
'**Binary Search Tree (BST)**: A binary tree where left children are smaller and right children are larger than their parent. This property applies recursively to all subtrees.

**Inorder Traversal**: Visiting nodes in left → root → right order. For a BST, this visits nodes in ascending sorted order.

**Kth Element**: The kth smallest is the kth node visited during an inorder traversal. You can stop early once you''ve counted k nodes.'
WHERE title = 'Kth Smallest Element in a BST';

-- 70. Lowest Common Ancestor of a Binary Search Tree
UPDATE public.blind_problems SET definition = 
'**Binary Search Tree (BST)**: A binary tree where for every node: left subtree values < node value < right subtree values.

**Lowest Common Ancestor (LCA)**: The deepest (lowest) node that is an ancestor of both given nodes. An ancestor of a node is any node on the path from root to that node (including the node itself).

**BST Property for LCA**: The LCA is the first node where the two target values "split"—one goes left, one goes right, or one equals the current node.'
WHERE title = 'Lowest Common Ancestor of a Binary Search Tree';

-- ========================================
-- CATEGORY: Heap (5 problems)
-- ========================================

-- 71. Implement Trie (Prefix Tree)
UPDATE public.blind_problems SET definition = 
'**Trie (Prefix Tree)**: A tree-like data structure for storing strings where each node represents a character. Paths from root to nodes represent prefixes. Efficient for prefix-based operations.

**Node Structure**: Each node contains a map of children (character → child node) and a flag indicating if a complete word ends at this node.

**Time Complexity**: Insert, search, and startsWith operations are all O(m) where m is the word length—independent of how many words are stored.'
WHERE title = 'Implement Trie (Prefix Tree)';

-- 72. Design Add and Search Words Data Structure
UPDATE public.blind_problems SET definition = 
'**Trie (Prefix Tree)**: A tree for storing strings where each path from root represents a prefix or complete word.

**Wildcard Search**: The ''.'' character matches any single letter. When encountered during search, try all possible children and return true if any path matches.

**Backtracking for Wildcards**: Each ''.'' creates branching search paths. Use DFS/recursion to try all possibilities.'
WHERE title = 'Design Add and Search Words Data Structure';

-- 73. Word Search II
UPDATE public.blind_problems SET definition = 
'**Matrix/Grid**: A 2D array of characters where you search for words by moving to adjacent cells (up, down, left, right).

**Trie (Prefix Tree)**: Store all target words in a Trie. When searching the grid, follow Trie paths—if a path doesn''t exist in the Trie, prune that search branch.

**Backtracking**: Explore paths in the grid, marking cells as visited. If a path leads nowhere (not in Trie or already visited), backtrack and try other directions.'
WHERE title = 'Word Search II';

-- 74. Top K Frequent Elements
UPDATE public.blind_problems SET definition = 
'**Array**: An input array of integers where we need to find the k most common elements.

**Frequency Count**: Use a hash map to count occurrences of each element.

**Min-Heap of Size K**: Keep a heap of the k most frequent elements seen so far. If a new element is more frequent than the heap minimum, replace it. The heap maintains O(log k) operations.

**Bucket Sort Alternative**: Create buckets indexed by frequency (1 to n). Place elements in their frequency bucket. Collect from highest buckets until you have k elements—O(n) time.'
WHERE title = 'Top K Frequent Elements';

-- 75. Find Median from Data Stream
UPDATE public.blind_problems SET definition = 
'**Data Stream**: Numbers arrive one at a time, and you need to efficiently find the median after each insertion.

**Median**: The middle value of a sorted list. For odd count, it''s the middle element. For even count, it''s the average of the two middle elements.

**Two Heaps**: Split numbers into two halves—a max-heap for the smaller half and a min-heap for the larger half. The median is at the tops of these heaps.

**Heap Balancing**: Keep heaps balanced (sizes differ by at most 1). The max-heap can have one extra element for odd counts.'
WHERE title = 'Find Median from Data Stream';
