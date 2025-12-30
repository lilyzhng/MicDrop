-- Blind75 Problems Seed Data
-- Generated from NeetCode's Blind 75 list
-- Run this AFTER running supabase-blind-problems.sql to create the table
--
-- NOTE: This uses UPSERT (ON CONFLICT DO UPDATE) to preserve existing data in columns
-- like detailed_hint, problem_group, mnemonic_image_url, and definition.

-- ========================================
-- CATEGORY: Arrays (10 problems)
-- ========================================

-- 1. Two Sum
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
    E'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
    '["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9", "Only one valid answer exists"]',
    'Hash Map',
    'Use a hash map to store seen values and their indices. For each number, check if (target - num) exists in the map.',
    'def twoSum(nums: List[int], target: int) -> List[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        # Check if complement exists\n        # Add current num to seen\n        pass',
    'O(n)',
    'O(n)',
    '["Create empty hash map to store {value: index}", "Iterate through array with index", "Calculate complement = target - current number", "If complement in map, return [map[complement], current_index]", "Otherwise, add current number and index to map"]',
    '["Empty array", "Single element array", "Negative numbers", "Target is zero", "Same number used twice (not allowed)", "Numbers at beginning vs end of array"]',
    '["Array", "Hash Table"]',
    'easy',
    1
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 2. Best Time to Buy and Sell Stock
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Best Time to Buy and Sell Stock',
    'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.',
    E'Input: prices = [7,1,5,3,6,4]\nOutput: 5\nExplanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.',
    '["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"]',
    'Two Pointers',
    'Use two pointers: left (buy day) and right (sell day). If profitable, update max_profit. If not profitable, move left to right (found a new minimum). Always advance right.',
    E'def maxProfit(prices: List[int]) -> int:\n    left, right = 0, 1\n    max_profit = 0\n\n    while right < len(prices):\n        # if profitable\n        if prices[left] < prices[right]:\n            # update profit\n            profit = prices[right] - prices[left]\n            # update max_profit\n            max_profit = max(max_profit, profit)\n        else:\n            # update left pointer\n            left = right\n        # update right pointer\n        right += 1\n    \n    return max_profit',
    'O(n)',
    'O(1)',
    '["Initialize left=0 (buy), right=1 (sell), max_profit=0", "While right < len(prices)", "If prices[left] < prices[right]: calculate profit, update max_profit", "Else: move left to right (found new minimum buy price)", "Always increment right pointer"]',
    '["Prices always decreasing (return 0)", "Prices always increasing", "Single day (no transaction possible)", "All same prices", "Minimum at end of array"]',
    '["Array", "Two Pointers"]',
    'easy',
    121
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 3. Contains Duplicate
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Contains Duplicate',
    'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    E'Input: nums = [1,2,3,1]\nOutput: true\nExplanation: The element 1 appears twice.',
    '["1 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"]',
    'Hash Set',
    'Use a hash set to track seen numbers. If we encounter a number already in the set, we have a duplicate.',
    'def containsDuplicate(nums: List[int]) -> bool:\n    seen = set()\n    for num in nums:\n        # Check if duplicate, add to seen\n        pass\n    return False',
    'O(n)',
    'O(n)',
    '["Create empty hash set", "Iterate through array", "If current number in set, return True", "Add current number to set", "Return False after loop completes"]',
    '["Empty array", "Single element", "All duplicates", "No duplicates", "Duplicate at beginning vs end"]',
    '["Array", "Hash Table", "Sorting"]',
    'easy',
    217
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 4. Product of Array Except Self
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Product of Array Except Self',
    'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. The algorithm must run in O(n) time and without using the division operation.',
    E'Input: nums = [1,2,3,4]\nOutput: [24,12,8,6]\nExplanation: For index 0: 2*3*4=24, index 1: 1*3*4=12, etc.',
    '["2 <= nums.length <= 10^5", "-30 <= nums[i] <= 30", "The product of any prefix or suffix is guaranteed to fit in a 32-bit integer"]',
    'Prefix/Suffix Products',
    'Make two passes: first to compute prefix products (left to right), then suffix products (right to left). Result at each index is prefix * suffix.',
    'def productExceptSelf(nums: List[int]) -> List[int]:\n    n = len(nums)\n    result = [1] * n\n    # First pass: prefix products\n    # Second pass: suffix products\n    return result',
    'O(n)',
    'O(1)',
    '["Initialize result array with 1s", "First pass left-to-right: multiply by running prefix product", "Second pass right-to-left: multiply by running suffix product", "Each position gets product of all elements except itself"]',
    '["Array with zeros", "Array with single zero", "Array with multiple zeros", "Negative numbers", "Array of length 2"]',
    '["Array", "Prefix Sum"]',
    'medium',
    238
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 5. Maximum Subarray
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Maximum Subarray',
    'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
    E'Input: nums = [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6\nExplanation: The subarray [4,-1,2,1] has the largest sum 6.',
    '["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"]',
    'Dynamic Programming (Kadane''s Algorithm)',
    'At each position, decide whether to extend the previous subarray or start fresh. The previous subarray is only worth keeping if its sum is positive.',
    'def maxSubArray(nums: List[int]) -> int:\n    max_sum = nums[0]\n    current_sum = 0\n    for num in nums:\n        # Reset if current_sum negative\n        # Update max_sum\n        pass\n    return max_sum',
    'O(n)',
    'O(1)',
    '["Initialize max_sum to first element, current_sum to 0", "For each number in array", "If current_sum is negative, reset to 0", "Add current number to current_sum", "Update max_sum if current_sum is larger"]',
    '["All negative numbers", "Single element", "All positive numbers", "Alternating positive/negative", "Maximum at beginning/middle/end"]',
    '["Array", "Dynamic Programming", "Divide and Conquer"]',
    'medium',
    53
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 6. Maximum Product Subarray
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Maximum Product Subarray',
    'Given an integer array nums, find a subarray that has the largest product, and return the product.',
    E'Input: nums = [2,3,-2,4]\nOutput: 6\nExplanation: [2,3] has the largest product 6.',
    '["1 <= nums.length <= 2 * 10^4", "-10 <= nums[i] <= 10", "The product of any prefix or suffix is guaranteed to fit in a 32-bit integer"]',
    'Dynamic Programming',
    'Track both max and min products at each position because a negative number can flip min to max. The min is important for handling negative numbers.',
    'def maxProduct(nums: List[int]) -> int:\n    result = max(nums)\n    cur_min, cur_max = 1, 1\n    for num in nums:\n        # Track both min and max products\n        pass\n    return result',
    'O(n)',
    'O(1)',
    '["Initialize result to max element in array", "Track current min and max products (both start at 1)", "For each number, compute new min and max considering: num, num*cur_max, num*cur_min", "Update result if cur_max is larger", "Handle zeros by resetting min/max to 1"]',
    '["Array with zeros", "All negative numbers", "Single negative number", "Alternating signs", "Contains zero in middle"]',
    '["Array", "Dynamic Programming"]',
    'medium',
    152
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 7. Find Minimum in Rotated Sorted Array
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Find Minimum in Rotated Sorted Array',
    'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm that runs in O(log n) time.',
    E'Input: nums = [3,4,5,1,2]\nOutput: 1\nExplanation: The original array was [1,2,3,4,5] rotated 3 times.',
    '["n == nums.length", "1 <= n <= 5000", "-5000 <= nums[i] <= 5000", "All integers are unique", "nums is sorted and rotated between 1 and n times"]',
    'Binary Search',
    'Use binary search to find the pivot point. If mid element is greater than right element, minimum is in right half. Otherwise, it''s in left half (including mid).',
    'def findMin(nums: List[int]) -> int:\n    left, right = 0, len(nums) - 1\n    while left < right:\n        mid = (left + right) // 2\n        # Compare mid with right to find pivot\n        pass\n    return nums[left]',
    'O(log n)',
    'O(1)',
    '["Initialize left and right pointers", "While left < right, find mid", "If nums[mid] > nums[right], minimum is in right half (left = mid + 1)", "Otherwise, minimum is in left half including mid (right = mid)", "Return nums[left] when loop ends"]',
    '["Array not rotated (already sorted)", "Array rotated n times (same as original)", "Single element", "Two elements", "Minimum at beginning/end/middle"]',
    '["Array", "Binary Search"]',
    'medium',
    153
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 8. Search in Rotated Sorted Array
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Search in Rotated Sorted Array',
    'Given the array nums after rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums. You must write an algorithm with O(log n) runtime complexity.',
    E'Input: nums = [4,5,6,7,0,1,2], target = 0\nOutput: 4',
    '["1 <= nums.length <= 5000", "-10^4 <= nums[i] <= 10^4", "All values are unique", "nums is an ascending array that is possibly rotated", "-10^4 <= target <= 10^4"]',
    'Binary Search',
    'Determine which half is sorted, then check if target lies within that sorted range. If yes, search there; otherwise, search the other half.',
    'def search(nums: List[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        # Check if found, determine sorted half, narrow search\n        pass\n    return -1',
    'O(log n)',
    'O(1)',
    '["Initialize left and right pointers", "Find mid element", "If mid equals target, return mid", "Determine if left half is sorted (nums[left] <= nums[mid])", "If target in sorted left range, search left; else search right", "If right half is sorted, apply same logic", "Return -1 if not found"]',
    '["Target not in array", "Target at pivot point", "Array not rotated", "Single element array", "Target at beginning/end"]',
    '["Array", "Binary Search"]',
    'medium',
    33
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 9. 3Sum
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    '3Sum',
    'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    E'Input: nums = [-1,0,1,2,-1,-4]\nOutput: [[-1,-1,2],[-1,0,1]]\nExplanation: The distinct triplets that sum to zero.',
    '["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"]',
    'Two Pointers',
    'Sort the array first. For each element, use two pointers to find pairs that sum to its negative. Skip duplicates to avoid duplicate triplets.',
    'def threeSum(nums: List[int]) -> List[List[int]]:\n    nums.sort()\n    result = []\n    for i in range(len(nums) - 2):\n        # Skip duplicates, use two pointers\n        pass\n    return result',
    'O(n²)',
    'O(1)',
    '["Sort the array", "For each element at index i (skip if duplicate of previous)", "Set left = i+1, right = len-1", "While left < right, calculate sum", "If sum == 0, add triplet, move both pointers, skip duplicates", "If sum < 0, move left pointer right", "If sum > 0, move right pointer left"]',
    '["All zeros", "No valid triplets", "All negative or all positive", "Duplicate numbers", "Exactly one triplet"]',
    '["Array", "Two Pointers", "Sorting"]',
    'medium',
    15
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 10. Container With Most Water
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Container With Most Water',
    'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    E'Input: height = [1,8,6,2,5,4,8,3,7]\nOutput: 49\nExplanation: The max area is between index 1 and 8, with height 7 and width 7.',
    '["n == height.length", "2 <= n <= 10^5", "0 <= height[i] <= 10^4"]',
    'Two Pointers',
    'Start with widest container (pointers at both ends). Move the pointer with smaller height inward, as keeping it can only decrease area.',
    'def maxArea(height: List[int]) -> int:\n    left, right = 0, len(height) - 1\n    max_water = 0\n    while left < right:\n        # Calculate area, move shorter pointer\n        pass\n    return max_water',
    'O(n)',
    'O(1)',
    '["Initialize left=0, right=len-1, max_water=0", "While left < right", "Calculate area = min(height[left], height[right]) * (right - left)", "Update max_water if area is larger", "Move the pointer with smaller height inward"]',
    '["All same heights", "Increasing heights", "Decreasing heights", "Maximum at ends vs middle", "Only two elements"]',
    '["Array", "Two Pointers", "Greedy"]',
    'medium',
    11
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Binary (5 problems)
-- ========================================

-- 11. Sum of Two Integers
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Sum of Two Integers',
    'Given two integers a and b, return the sum of the two integers without using the operators + and -.',
    E'Input: a = 1, b = 2\nOutput: 3',
    '["-1000 <= a, b <= 1000"]',
    'Bit Manipulation',
    'XOR gives sum without carry. AND shifted left gives carry. Repeat until no carry remains.',
    'def getSum(a: int, b: int) -> int:\n    while b != 0:\n        # XOR for sum without carry\n        # AND << 1 for carry\n        pass\n    return a',
    'O(1)',
    'O(1)',
    '["Use XOR (^) to add bits without considering carry", "Use AND (&) to find carry bits", "Shift carry left by 1", "Repeat until carry is 0", "Handle negative numbers with masking in some languages"]',
    '["Both positive", "Both negative", "One positive one negative", "Zero and non-zero", "Overflow cases"]',
    '["Math", "Bit Manipulation"]',
    'medium',
    371
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 12. Number of 1 Bits
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Number of 1 Bits',
    'Write a function that takes the binary representation of an unsigned integer and returns the number of ''1'' bits it has (also known as the Hamming weight).',
    E'Input: n = 00000000000000000000000000001011\nOutput: 3\nExplanation: The input has three ''1'' bits.',
    '["The input must be a binary string of length 32"]',
    'Bit Manipulation',
    'Use n & (n-1) to clear the lowest set bit. Count how many times until n becomes 0. Alternative: check each bit with n & 1 and right shift.',
    'def hammingWeight(n: int) -> int:\n    count = 0\n    while n:\n        n &= (n - 1)  # Clear lowest set bit\n        count += 1\n    return count',
    'O(1)',
    'O(1)',
    '["Initialize count to 0", "While n is not 0", "Apply n = n & (n-1) to remove lowest 1 bit", "Increment count", "Return count"]',
    '["All zeros", "All ones", "Single 1 bit", "Alternating bits", "Power of 2"]',
    '["Divide and Conquer", "Bit Manipulation"]',
    'easy',
    191
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 13. Counting Bits
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Counting Bits',
    'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1''s in the binary representation of i.',
    E'Input: n = 5\nOutput: [0,1,1,2,1,2]\nExplanation: 0=0, 1=1, 2=10, 3=11, 4=100, 5=101',
    '["0 <= n <= 10^5"]',
    'Dynamic Programming with Bit Manipulation',
    'Use DP: ans[i] = ans[i >> 1] + (i & 1). The number of 1s in i equals the count in i/2 plus whether i is odd.',
    'def countBits(n: int) -> List[int]:\n    ans = [0] * (n + 1)\n    for i in range(1, n + 1):\n        ans[i] = ans[i >> 1] + (i & 1)\n    return ans',
    'O(n)',
    'O(n)',
    '["Initialize ans array of size n+1 with zeros", "For i from 1 to n", "ans[i] = ans[i >> 1] + (i & 1)", "i >> 1 is i/2, i & 1 checks if odd", "Return ans array"]',
    '["n = 0", "n = 1", "Powers of 2", "Large n"]',
    '["Dynamic Programming", "Bit Manipulation"]',
    'easy',
    338
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 14. Missing Number
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Missing Number',
    'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
    E'Input: nums = [3,0,1]\nOutput: 2\nExplanation: n = 3 since there are 3 numbers, so all numbers are in range [0,3]. 2 is missing.',
    '["n == nums.length", "1 <= n <= 10^4", "0 <= nums[i] <= n", "All the numbers of nums are unique"]',
    'Bit Manipulation / Math',
    'XOR all indices and all values. The result is the missing number since all paired values cancel out. Alternatively: expected_sum - actual_sum.',
    'def missingNumber(nums: List[int]) -> int:\n    n = len(nums)\n    # Method 1: XOR\n    # Method 2: Sum formula n*(n+1)/2 - sum(nums)\n    return n * (n + 1) // 2 - sum(nums)',
    'O(n)',
    'O(1)',
    '["Calculate expected sum: n * (n + 1) / 2", "Calculate actual sum of array", "Return expected - actual", "Alternative: XOR all indices (0 to n) with all values"]',
    '["Missing 0", "Missing n (largest)", "Missing middle number", "Single element array", "Large array"]',
    '["Array", "Hash Table", "Math", "Bit Manipulation", "Sorting"]',
    'easy',
    268
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 15. Reverse Bits
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Reverse Bits',
    'Reverse bits of a given 32 bits unsigned integer.',
    E'Input: n = 00000010100101000001111010011100\nOutput: 964176192 (00111001011110000010100101000000)\nExplanation: The input represents 43261596, reversed it becomes 964176192.',
    '["The input must be a binary string of length 32"]',
    'Bit Manipulation',
    'Extract each bit from right to left, build result from left to right by shifting result left and ORing with extracted bit.',
    'def reverseBits(n: int) -> int:\n    result = 0\n    for i in range(32):\n        result = (result << 1) | (n & 1)\n        n >>= 1\n    return result',
    'O(1)',
    'O(1)',
    '["Initialize result to 0", "Loop 32 times (for each bit)", "Shift result left by 1", "OR result with (n & 1) to add rightmost bit", "Shift n right by 1", "Return result"]',
    '["All zeros", "All ones", "Single 1 bit", "Alternating bits", "Palindromic bit pattern"]',
    '["Divide and Conquer", "Bit Manipulation"]',
    'easy',
    190
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Dynamic Programming (11 problems)
-- ========================================

-- 16. Climbing Stairs
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Climbing Stairs',
    'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    E'Input: n = 3\nOutput: 3\nExplanation: There are three ways: 1+1+1, 1+2, 2+1.',
    '["1 <= n <= 45"]',
    'Dynamic Programming with Memoization',
    'To reach step n, you can come from step n-1 or n-2. So ways(n) = ways(n-1) + ways(n-2). Use memoization to cache results and avoid recomputing. This is the Fibonacci sequence.',
    'def climbStairs(n: int) -> int:\n    memo = {}\n    def dp(i):\n        if i <= 2:\n            return i\n        if i in memo:\n            return memo[i]\n        memo[i] = dp(i - 1) + dp(i - 2)\n        return memo[i]\n    return dp(n)',
    'O(n)',
    'O(n)',
    '["Create a memo dictionary to cache results", "Define recursive dp(i) function", "Base cases: 1 step = 1 way, 2 steps = 2 ways", "If i already in memo, return cached value", "Otherwise compute dp(i-1) + dp(i-2), store in memo, and return"]',
    '["n = 1", "n = 2", "Large n near limit"]',
    '["Math", "Dynamic Programming", "Memoization"]',
    'easy',
    70
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 17. Coin Change
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Coin Change',
    'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed to make up that amount. If that amount cannot be made up by any combination, return -1.',
    E'Input: coins = [1,2,5], amount = 11\nOutput: 3\nExplanation: 11 = 5 + 5 + 1',
    '["1 <= coins.length <= 12", "1 <= coins[i] <= 2^31 - 1", "0 <= amount <= 10^4"]',
    'Dynamic Programming (Bottom-Up)',
    'Build up from amount 0 to target. For each amount, try each coin and take minimum coins needed. dp[i] = min(dp[i], dp[i-coin] + 1) for each coin.',
    'def coinChange(coins: List[int], amount: int) -> int:\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1',
    'O(amount * n)',
    'O(amount)',
    '["Initialize dp array of size amount+1 with infinity", "dp[0] = 0 (0 coins for amount 0)", "For each amount from 1 to target", "For each coin, if coin <= amount, update dp[amount] = min(dp[amount], dp[amount-coin] + 1)", "Return dp[amount] or -1 if still infinity"]',
    '["Amount is 0", "Single coin equals amount", "No valid combination", "Coins larger than amount", "Need to use same coin multiple times"]',
    '["Array", "Dynamic Programming", "Breadth-First Search"]',
    'medium',
    322
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 18. Longest Increasing Subsequence
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Longest Increasing Subsequence',
    'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    E'Input: nums = [10,9,2,5,3,7,101,18]\nOutput: 4\nExplanation: The longest increasing subsequence is [2,3,7,101].',
    '["1 <= nums.length <= 2500", "-10^4 <= nums[i] <= 10^4"]',
    'Dynamic Programming',
    'dp[i] = length of LIS ending at index i. For each i, check all j < i where nums[j] < nums[i] and take max(dp[j]) + 1.',
    'def lengthOfLIS(nums: List[int]) -> int:\n    dp = [1] * len(nums)\n    for i in range(1, len(nums)):\n        for j in range(i):\n            if nums[j] < nums[i]:\n                dp[i] = max(dp[i], dp[j] + 1)\n    return max(dp)',
    'O(n²)',
    'O(n)',
    '["Initialize dp array with all 1s (each element is LIS of length 1)", "For each index i from 1 to n-1", "For each j from 0 to i-1", "If nums[j] < nums[i], dp[i] = max(dp[i], dp[j] + 1)", "Return max value in dp array"]',
    '["Single element", "Already sorted ascending", "Already sorted descending", "All same elements", "LIS at beginning/middle/end"]',
    '["Array", "Binary Search", "Dynamic Programming"]',
    'medium',
    300
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 19. Longest Common Subsequence
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Longest Common Subsequence',
    'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
    E'Input: text1 = "abcde", text2 = "ace"\nOutput: 3\nExplanation: The longest common subsequence is "ace" with length 3.',
    '["1 <= text1.length, text2.length <= 1000", "text1 and text2 consist of only lowercase English characters"]',
    'Dynamic Programming (2D)',
    'If chars match, LCS = 1 + LCS of remaining. If not, LCS = max of LCS excluding one char from either string. Use 2D dp table.',
    'def longestCommonSubsequence(text1: str, text2: str) -> int:\n    dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]\n    for i in range(1, len(text1) + 1):\n        for j in range(1, len(text2) + 1):\n            if text1[i-1] == text2[j-1]:\n                dp[i][j] = dp[i-1][j-1] + 1\n            else:\n                dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[-1][-1]',
    'O(m * n)',
    'O(m * n)',
    '["Create 2D dp table of size (m+1) x (n+1)", "dp[i][j] represents LCS of text1[0:i] and text2[0:j]", "If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1", "Else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])", "Return dp[m][n]"]',
    '["Empty string", "Identical strings", "No common characters", "One string is subsequence of other", "Single character strings"]',
    '["String", "Dynamic Programming"]',
    'medium',
    1143
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 20. Word Break
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Word Break',
    'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.',
    E'Input: s = "leetcode", wordDict = ["leet","code"]\nOutput: true\nExplanation: "leetcode" can be segmented as "leet code".',
    '["1 <= s.length <= 300", "1 <= wordDict.length <= 1000", "1 <= wordDict[i].length <= 20", "s and wordDict[i] consist of only lowercase English letters", "All strings in wordDict are unique"]',
    'Dynamic Programming',
    'dp[i] = True if s[0:i] can be segmented. For each position, check if any word in dict ends at that position and dp[start of word] is True.',
    'def wordBreak(s: str, wordDict: List[str]) -> bool:\n    dp = [False] * (len(s) + 1)\n    dp[0] = True\n    for i in range(1, len(s) + 1):\n        for word in wordDict:\n            if i >= len(word) and dp[i - len(word)] and s[i - len(word):i] == word:\n                dp[i] = True\n                break\n    return dp[-1]',
    'O(n * m * k)',
    'O(n)',
    '["dp[0] = True (empty string can be segmented)", "For each position i from 1 to len(s)", "For each word in dictionary", "If word fits and dp[i - len(word)] is True and substring matches word", "Set dp[i] = True", "Return dp[len(s)]"]',
    '["Single word in dict matches entire string", "No valid segmentation", "Multiple ways to segment", "Repeating words needed", "Word is prefix of another word"]',
    '["Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"]',
    'medium',
    139
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 21. Combination Sum
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Combination Sum',
    'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen an unlimited number of times.',
    E'Input: candidates = [2,3,6,7], target = 7\nOutput: [[2,2,3],[7]]\nExplanation: 2 + 2 + 3 = 7 and 7 = 7.',
    '["1 <= candidates.length <= 30", "2 <= candidates[i] <= 40", "All elements are distinct", "1 <= target <= 40"]',
    'Backtracking',
    'Use DFS/backtracking. At each step, either include current candidate (can reuse) or move to next candidate. Prune when sum exceeds target.',
    'def combinationSum(candidates: List[int], target: int) -> List[List[int]]:\n    result = []\n    def backtrack(start, path, remaining):\n        if remaining == 0:\n            result.append(path[:])\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] <= remaining:\n                path.append(candidates[i])\n                backtrack(i, path, remaining - candidates[i])\n                path.pop()\n    backtrack(0, [], target)\n    return result',
    'O(n^(t/m))',
    'O(t/m)',
    '["Start backtracking with empty path and full target", "If remaining == 0, add current path to result", "For each candidate from start index", "If candidate <= remaining, add to path and recurse (same index for reuse)", "After recursion, remove last element (backtrack)"]',
    '["Single candidate equals target", "No valid combination", "Target smaller than all candidates", "Need multiple of same number", "Large target with small candidates"]',
    '["Array", "Backtracking"]',
    'medium',
    39
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 22. House Robber
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'House Robber',
    'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected - if two adjacent houses are broken into on the same night, the police will be alerted. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob without alerting the police.',
    E'Input: nums = [1,2,3,1]\nOutput: 4\nExplanation: Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4.',
    '["1 <= nums.length <= 100", "0 <= nums[i] <= 400"]',
    'Dynamic Programming',
    'At each house, choose max of: (1) rob this house + max from two houses back, or (2) skip this house and take max from previous house.',
    'def rob(nums: List[int]) -> int:\n    if len(nums) == 1:\n        return nums[0]\n    prev2, prev1 = 0, 0\n    for num in nums:\n        temp = max(prev1, prev2 + num)\n        prev2, prev1 = prev1, temp\n    return prev1',
    'O(n)',
    'O(1)',
    '["Track two values: max including prev house (prev1) and max excluding prev house (prev2)", "For each house, new max = max(prev1, prev2 + current)", "Update prev2 = prev1, prev1 = new max", "Return prev1"]',
    '["Single house", "Two houses", "All same values", "Alternating high/low values", "Increasing values"]',
    '["Array", "Dynamic Programming"]',
    'medium',
    198
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 23. House Robber II
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'House Robber II',
    'You are a professional robber planning to rob houses arranged in a circle. Each house has a certain amount of money. Adjacent houses have security systems that will alert police if both are robbed. Given an integer array nums representing the amount of money in each house, return the maximum amount you can rob without alerting police.',
    E'Input: nums = [2,3,2]\nOutput: 3\nExplanation: You cannot rob house 1 and house 3 (both are adjacent in a circle). Rob house 2 with money = 3.',
    '["1 <= nums.length <= 100", "0 <= nums[i] <= 1000"]',
    'Dynamic Programming',
    'Since first and last houses are adjacent, we cannot rob both. Run House Robber on nums[0:n-1] and nums[1:n], take maximum.',
    'def rob(nums: List[int]) -> int:\n    if len(nums) == 1:\n        return nums[0]\n    def rob_linear(houses):\n        prev2, prev1 = 0, 0\n        for h in houses:\n            prev2, prev1 = prev1, max(prev1, prev2 + h)\n        return prev1\n    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))',
    'O(n)',
    'O(1)',
    '["Handle single house case", "Create helper function for linear house robber", "Run helper on houses[0:n-1] (exclude last)", "Run helper on houses[1:n] (exclude first)", "Return max of both results"]',
    '["Single house", "Two houses", "Three houses", "All same values", "First and last are highest"]',
    '["Array", "Dynamic Programming"]',
    'medium',
    213
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 24. Decode Ways
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Decode Ways',
    'A message containing letters from A-Z can be encoded into numbers using the mapping: A=1, B=2, ..., Z=26. Given a string s containing only digits, return the number of ways to decode it.',
    E'Input: s = "226"\nOutput: 3\nExplanation: "226" can be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).',
    '["1 <= s.length <= 100", "s contains only digits and may contain leading zeros"]',
    'Dynamic Programming',
    'dp[i] = ways to decode s[0:i]. At each position, check if single digit is valid (1-9) and if two digits are valid (10-26).',
    'def numDecodings(s: str) -> int:\n    if not s or s[0] == "0":\n        return 0\n    dp = [0] * (len(s) + 1)\n    dp[0], dp[1] = 1, 1\n    for i in range(2, len(s) + 1):\n        if s[i-1] != "0":\n            dp[i] += dp[i-1]\n        two_digit = int(s[i-2:i])\n        if 10 <= two_digit <= 26:\n            dp[i] += dp[i-2]\n    return dp[-1]',
    'O(n)',
    'O(n)',
    '["dp[0] = 1 (empty string), dp[1] = 1 if first char is not 0", "For each position i from 2 to n", "If current digit is not 0, add dp[i-1] (single digit decode)", "If two-digit number is 10-26, add dp[i-2] (two digit decode)", "Return dp[n]"]',
    '["String starts with 0", "Contains 0 that cannot be decoded", "All single digit valid", "Contains 10 or 20", "Long string with many combinations"]',
    '["String", "Dynamic Programming"]',
    'medium',
    91
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 25. Unique Paths
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Unique Paths',
    'There is a robot on an m x n grid. The robot starts at the top-left corner and tries to move to the bottom-right corner. The robot can only move either down or right at any point. Given the dimensions m and n, return the number of possible unique paths.',
    E'Input: m = 3, n = 7\nOutput: 28',
    '["1 <= m, n <= 100"]',
    'Dynamic Programming',
    'dp[i][j] = number of ways to reach cell (i,j). Each cell can only be reached from above or left, so dp[i][j] = dp[i-1][j] + dp[i][j-1].',
    'def uniquePaths(m: int, n: int) -> int:\n    dp = [1] * n  # First row is all 1s\n    for i in range(1, m):\n        for j in range(1, n):\n            dp[j] += dp[j-1]\n    return dp[-1]',
    'O(m * n)',
    'O(n)',
    '["Initialize first row with all 1s (only one way to reach any cell in first row)", "For each subsequent row", "For each cell (except first column), paths = paths from above + paths from left", "First column stays 1 (only one way from start)", "Return dp[m-1][n-1]"]',
    '["1x1 grid", "1xn grid (single row)", "mx1 grid (single column)", "2x2 grid", "Large m and n"]',
    '["Math", "Dynamic Programming", "Combinatorics"]',
    'medium',
    62
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 26. Jump Game
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Jump Game',
    'You are given an integer array nums. You are initially positioned at the array''s first index, and each element represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
    E'Input: nums = [2,3,1,1,4]\nOutput: true\nExplanation: Jump 1 step from index 0 to 1, then 3 steps to the last index.',
    '["1 <= nums.length <= 10^4", "0 <= nums[i] <= 10^5"]',
    'Greedy',
    'Work backwards: track the leftmost position that can reach the goal. If a position can reach the current goal, it becomes the new goal.',
    'def canJump(nums: List[int]) -> bool:\n    goal = len(nums) - 1\n    for i in range(len(nums) - 2, -1, -1):\n        if i + nums[i] >= goal:\n            goal = i\n    return goal == 0',
    'O(n)',
    'O(1)',
    '["Set goal to last index", "Iterate backwards from second-to-last index", "If current index + jump length >= goal, update goal to current index", "After loop, return True if goal is 0"]',
    '["Single element", "All zeros except first", "Last element is 0", "Can reach end in one jump", "Cannot reach end (stuck at 0)"]',
    '["Array", "Dynamic Programming", "Greedy"]',
    'medium',
    55
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Graph (8 problems)
-- ========================================

-- 27. Clone Graph
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Clone Graph',
    'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors.',
    E'Input: adjList = [[2,4],[1,3],[2,4],[1,3]]\nOutput: [[2,4],[1,3],[2,4],[1,3]]\nExplanation: The graph has 4 nodes connected as shown.',
    '["The number of nodes is in the range [0, 100]", "1 <= Node.val <= 100", "Node.val is unique for each node", "There are no repeated edges or self-loops", "The graph is connected"]',
    'DFS/BFS with Hash Map',
    'Use a hash map to track original->clone mappings. DFS/BFS through graph, creating clones and connecting neighbors.',
    'def cloneGraph(node: Node) -> Node:\n    if not node:\n        return None\n    clones = {}\n    def dfs(n):\n        if n in clones:\n            return clones[n]\n        clone = Node(n.val)\n        clones[n] = clone\n        for neighbor in n.neighbors:\n            clone.neighbors.append(dfs(neighbor))\n        return clone\n    return dfs(node)',
    'O(V + E)',
    'O(V)',
    '["Handle empty graph", "Create hash map for original -> clone mapping", "DFS/BFS: if node already cloned, return clone", "Create new node, add to map immediately (before processing neighbors)", "Recursively clone all neighbors", "Return cloned start node"]',
    '["Empty graph", "Single node with no neighbors", "Single node with self-loop", "Two connected nodes", "Fully connected graph"]',
    '["Hash Table", "Depth-First Search", "Breadth-First Search", "Graph"]',
    'medium',
    133
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 28. Course Schedule
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Course Schedule',
    'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses.',
    E'Input: numCourses = 2, prerequisites = [[1,0]]\nOutput: true\nExplanation: You can take course 0 first, then take course 1.',
    '["1 <= numCourses <= 2000", "0 <= prerequisites.length <= 5000", "prerequisites[i].length == 2", "0 <= ai, bi < numCourses", "All prerequisite pairs are unique"]',
    'Topological Sort / Cycle Detection',
    'Build adjacency list. Use DFS with 3 states: unvisited, visiting, visited. If we reach a "visiting" node during DFS, there is a cycle.',
    'def canFinish(numCourses: int, prerequisites: List[List[int]]) -> bool:\n    graph = [[] for _ in range(numCourses)]\n    for course, prereq in prerequisites:\n        graph[course].append(prereq)\n    # 0=unvisited, 1=visiting, 2=visited\n    state = [0] * numCourses\n    def hasCycle(course):\n        if state[course] == 1: return True  # cycle\n        if state[course] == 2: return False\n        state[course] = 1\n        for prereq in graph[course]:\n            if hasCycle(prereq): return True\n        state[course] = 2\n        return False\n    return not any(hasCycle(i) for i in range(numCourses))',
    'O(V + E)',
    'O(V + E)',
    '["Build adjacency list from prerequisites", "Track 3 states: unvisited, visiting, visited", "DFS from each unvisited node", "If we encounter visiting node, cycle exists (return False)", "Mark node visited after all prereqs processed", "Return True if no cycle found"]',
    '["No prerequisites", "Single course", "Linear chain of prerequisites", "Cycle exists", "Disconnected courses"]',
    '["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"]',
    'medium',
    207
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 29. Pacific Atlantic Water Flow
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Pacific Atlantic Water Flow',
    'Given an m x n matrix of heights, the Pacific ocean touches the left and top edges, and the Atlantic ocean touches the right and bottom edges. Water can flow from a cell to adjacent cells (up, down, left, right) if the adjacent cell''s height is less than or equal to the current cell''s height. Return a list of coordinates where water can flow to both oceans.',
    E'Input: heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]\nOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]',
    '["m == heights.length", "n == heights[i].length", "1 <= m, n <= 200", "0 <= heights[i][j] <= 10^5"]',
    'Multi-source BFS/DFS',
    'Instead of checking from each cell, start from ocean edges and work inward. Track which cells can reach each ocean. Return intersection.',
    'def pacificAtlantic(heights: List[List[int]]) -> List[List[int]]:\n    m, n = len(heights), len(heights[0])\n    pacific, atlantic = set(), set()\n    def dfs(r, c, visited, prev_height):\n        if (r,c) in visited or r<0 or c<0 or r>=m or c>=n or heights[r][c] < prev_height:\n            return\n        visited.add((r, c))\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            dfs(r+dr, c+dc, visited, heights[r][c])\n    # Start from ocean edges\n    for c in range(n):\n        dfs(0, c, pacific, 0)\n        dfs(m-1, c, atlantic, 0)\n    for r in range(m):\n        dfs(r, 0, pacific, 0)\n        dfs(r, n-1, atlantic, 0)\n    return list(pacific & atlantic)',
    'O(m * n)',
    'O(m * n)',
    '["Create sets to track cells reachable from each ocean", "DFS/BFS from Pacific edges (top row, left column) going uphill", "DFS/BFS from Atlantic edges (bottom row, right column) going uphill", "Find intersection of both sets", "Return cells that can reach both oceans"]',
    '["1x1 grid", "Single row or column", "All same heights", "Strictly increasing/decreasing", "No cells reach both"]',
    '["Array", "Depth-First Search", "Breadth-First Search", "Matrix"]',
    'medium',
    417
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 30. Number of Islands
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Number of Islands',
    'Given an m x n 2D binary grid which represents a map of ''1''s (land) and ''0''s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    E'Input: grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]\nOutput: 1',
    '["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300", "grid[i][j] is ''0'' or ''1''"]',
    'DFS/BFS Flood Fill',
    'Iterate through grid. When finding a ''1'', increment count and use DFS/BFS to mark all connected ''1''s as visited (sink the island).',
    'def numIslands(grid: List[List[str]]) -> int:\n    if not grid:\n        return 0\n    m, n = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if r<0 or c<0 or r>=m or c>=n or grid[r][c] != "1":\n            return\n        grid[r][c] = "0"  # Mark visited\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(r, c)\n    return count',
    'O(m * n)',
    'O(m * n)',
    '["Iterate through each cell", "When finding ''1'', increment island count", "DFS/BFS to mark all connected ''1''s as ''0'' (visited)", "Continue iterating", "Return count"]',
    '["Empty grid", "All water", "All land (one island)", "Single cell", "Many small islands", "Island touching all edges"]',
    '["Array", "Depth-First Search", "Breadth-First Search", "Union Find", "Matrix"]',
    'medium',
    200
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 31. Longest Consecutive Sequence
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Longest Consecutive Sequence',
    'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    E'Input: nums = [100,4,200,1,3,2]\nOutput: 4\nExplanation: The longest consecutive sequence is [1, 2, 3, 4]. Its length is 4.',
    '["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"]',
    'Hash Set',
    'Add all numbers to a set. For each number, only start counting if num-1 is not in set (this is the start of a sequence). Count consecutive numbers.',
    'def longestConsecutive(nums: List[int]) -> int:\n    num_set = set(nums)\n    longest = 0\n    for num in num_set:\n        if num - 1 not in num_set:  # Start of sequence\n            length = 1\n            while num + length in num_set:\n                length += 1\n            longest = max(longest, length)\n    return longest',
    'O(n)',
    'O(n)',
    '["Add all numbers to a hash set", "For each number in set", "If num-1 not in set, this is start of a sequence", "Count consecutive numbers (num+1, num+2, ...)", "Update longest if current sequence is longer", "Return longest"]',
    '["Empty array", "Single element", "No consecutive numbers", "All consecutive", "Duplicates in input", "Negative numbers"]',
    '["Array", "Hash Table", "Union Find"]',
    'medium',
    128
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 32. Alien Dictionary (Premium)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Alien Dictionary',
    'There is a new alien language that uses the English alphabet, but the order of letters is unknown. You are given a list of strings words from the alien language''s dictionary, where the strings are sorted lexicographically by the rules of this new language. Return a string of the unique letters in the new language sorted in lexicographically increasing order. If there is no valid order, return empty string.',
    E'Input: words = ["wrt","wrf","er","ett","rftt"]\nOutput: "wertf"',
    '["1 <= words.length <= 100", "1 <= words[i].length <= 100", "words[i] consists of only lowercase English letters"]',
    'Topological Sort',
    'Compare adjacent words to find ordering rules. Build a directed graph of character orderings. Topological sort the graph to find valid ordering.',
    'def alienOrder(words: List[str]) -> str:\n    # Build adjacency list and in-degree count\n    graph = {c: set() for word in words for c in word}\n    in_degree = {c: 0 for c in graph}\n    # Compare adjacent words\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i + 1]\n        min_len = min(len(w1), len(w2))\n        if len(w1) > len(w2) and w1[:min_len] == w2[:min_len]:\n            return ""  # Invalid\n        for j in range(min_len):\n            if w1[j] != w2[j]:\n                if w2[j] not in graph[w1[j]]:\n                    graph[w1[j]].add(w2[j])\n                    in_degree[w2[j]] += 1\n                break\n    # Topological sort (BFS)\n    queue = [c for c in in_degree if in_degree[c] == 0]\n    result = []\n    while queue:\n        c = queue.pop(0)\n        result.append(c)\n        for neighbor in graph[c]:\n            in_degree[neighbor] -= 1\n            if in_degree[neighbor] == 0:\n                queue.append(neighbor)\n    return "".join(result) if len(result) == len(graph) else ""',
    'O(C)',
    'O(1)',
    '["Build graph with all unique characters", "Compare adjacent words to find first differing character", "Add edge from first char to second char", "Detect invalid case: longer word before shorter prefix", "Topological sort (BFS with in-degree)", "Return empty if cycle detected"]',
    '["Single word", "Two words same length", "Prefix comes after full word (invalid)", "Cycle in ordering", "Multiple valid orderings"]',
    '["Array", "String", "Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"]',
    'hard',
    269
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 33. Graph Valid Tree (Premium)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Graph Valid Tree',
    'Given n nodes labeled from 0 to n-1 and a list of undirected edges, write a function to check whether these edges make up a valid tree. A valid tree has exactly n-1 edges, is connected, and has no cycles.',
    E'Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]\nOutput: true',
    '["1 <= n <= 2000", "0 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai, bi < n", "ai != bi", "No duplicate edges"]',
    'Union Find / DFS',
    'A valid tree has exactly n-1 edges and is connected. Use Union Find: if union returns false (cycle), not a tree. Check if exactly one component.',
    'def validTree(n: int, edges: List[List[int]]) -> bool:\n    if len(edges) != n - 1:\n        return False\n    parent = list(range(n))\n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    def union(x, y):\n        px, py = find(x), find(y)\n        if px == py:\n            return False  # Cycle\n        parent[px] = py\n        return True\n    return all(union(a, b) for a, b in edges)',
    'O(n * α(n))',
    'O(n)',
    '["Check if exactly n-1 edges (necessary for tree)", "Use Union Find with path compression", "For each edge, union the two nodes", "If union finds they already have same parent, cycle exists", "Return True if all unions succeed"]',
    '["No edges (n=1)", "Single edge", "Not enough edges to connect", "Too many edges (cycle)", "Disconnected components"]',
    '["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"]',
    'medium',
    261
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 34. Number of Connected Components (Premium)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Number of Connected Components in an Undirected Graph',
    'You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates an undirected edge between nodes ai and bi. Return the number of connected components in the graph.',
    E'Input: n = 5, edges = [[0,1],[1,2],[3,4]]\nOutput: 2\nExplanation: Components are {0,1,2} and {3,4}.',
    '["1 <= n <= 2000", "1 <= edges.length <= 5000", "edges[i].length == 2", "0 <= ai, bi < n", "ai != bi", "No repeated edges"]',
    'Union Find / DFS',
    'Use Union Find: start with n components. Each successful union reduces count by 1. Or use DFS from each unvisited node, counting components.',
    'def countComponents(n: int, edges: List[List[int]]) -> int:\n    parent = list(range(n))\n    def find(x):\n        if parent[x] != x:\n            parent[x] = find(parent[x])\n        return parent[x]\n    def union(x, y):\n        px, py = find(x), find(y)\n        if px != py:\n            parent[px] = py\n            return True\n        return False\n    count = n\n    for a, b in edges:\n        if union(a, b):\n            count -= 1\n    return count',
    'O(n * α(n))',
    'O(n)',
    '["Initialize parent array (each node is its own parent)", "Start with count = n (each node is its own component)", "For each edge, union the nodes", "If union successful (different parents), decrement count", "Return final count"]',
    '["No edges (n components)", "Fully connected (1 component)", "Single node", "Multiple isolated nodes", "Linear chain"]',
    '["Depth-First Search", "Breadth-First Search", "Union Find", "Graph"]',
    'medium',
    323
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Interval (5 problems)
-- ========================================

-- 35. Insert Interval
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Insert Interval',
    'You are given an array of non-overlapping intervals where intervals[i] = [starti, endi] represent the start and end of the ith interval. The intervals are sorted by starti. Insert newInterval into intervals such that intervals is still sorted and non-overlapping. Merge overlapping intervals if necessary.',
    E'Input: intervals = [[1,3],[6,9]], newInterval = [2,5]\nOutput: [[1,5],[6,9]]\nExplanation: [2,5] overlaps with [1,3], merging to [1,5].',
    '["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^5", "intervals is sorted by starti", "newInterval.length == 2"]',
    'Interval Merging',
    'Add all intervals that end before newInterval starts. Merge all overlapping intervals with newInterval. Add remaining intervals.',
    'def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:\n    result = []\n    i = 0\n    # Add all intervals before newInterval\n    while i < len(intervals) and intervals[i][1] < newInterval[0]:\n        result.append(intervals[i])\n        i += 1\n    # Merge overlapping intervals\n    while i < len(intervals) and intervals[i][0] <= newInterval[1]:\n        newInterval = [min(newInterval[0], intervals[i][0]), max(newInterval[1], intervals[i][1])]\n        i += 1\n    result.append(newInterval)\n    # Add remaining intervals\n    result.extend(intervals[i:])\n    return result',
    'O(n)',
    'O(n)',
    '["Add all intervals that end before newInterval starts", "Merge all intervals that overlap with newInterval", "Update newInterval to span min start to max end", "Add merged newInterval to result", "Add all remaining intervals"]',
    '["Empty intervals list", "No overlap (insert at beginning/middle/end)", "newInterval spans all intervals", "Single interval", "newInterval exactly matches an interval"]',
    '["Array", "Interval"]',
    'medium',
    57
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 36. Merge Intervals
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Merge Intervals',
    'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    E'Input: intervals = [[1,3],[2,6],[8,10],[15,18]]\nOutput: [[1,6],[8,10],[15,18]]\nExplanation: [1,3] and [2,6] overlap, merge to [1,6].',
    '["1 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti <= endi <= 10^4"]',
    'Interval Sorting and Merging',
    'Sort intervals by start time. Iterate through: if current overlaps with last result interval, merge them. Otherwise, add current to result.',
    'def merge(intervals: List[List[int]]) -> List[List[int]]:\n    intervals.sort(key=lambda x: x[0])\n    result = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= result[-1][1]:  # Overlap\n            result[-1][1] = max(result[-1][1], end)\n        else:\n            result.append([start, end])\n    return result',
    'O(n log n)',
    'O(n)',
    '["Sort intervals by start time", "Initialize result with first interval", "For each remaining interval", "If it overlaps with last in result (start <= result[-1].end), merge by extending end", "Otherwise, add as new interval", "Return result"]',
    '["Single interval", "No overlapping intervals", "All intervals overlap into one", "Intervals already sorted", "Intervals in reverse order"]',
    '["Array", "Sorting"]',
    'medium',
    56
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 37. Non-overlapping Intervals
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Non-overlapping Intervals',
    'Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
    E'Input: intervals = [[1,2],[2,3],[3,4],[1,3]]\nOutput: 1\nExplanation: [1,3] can be removed and the rest are non-overlapping.',
    '["1 <= intervals.length <= 10^5", "intervals[i].length == 2", "-5 * 10^4 <= starti < endi <= 5 * 10^4"]',
    'Greedy',
    'Sort by end time. Greedily keep intervals that end earliest. When overlap occurs, remove the one with later end time.',
    'def eraseOverlapIntervals(intervals: List[List[int]]) -> int:\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = float("-inf")\n    for start, end in intervals:\n        if start >= prev_end:\n            prev_end = end\n        else:\n            count += 1\n    return count',
    'O(n log n)',
    'O(1)',
    '["Sort intervals by end time", "Track previous interval end", "For each interval", "If no overlap (start >= prev_end), update prev_end", "If overlap, increment removal count (keep the one ending earlier)", "Return count"]',
    '["Single interval", "No overlaps", "All intervals overlap", "Intervals share endpoints", "Same start different ends"]',
    '["Array", "Dynamic Programming", "Greedy", "Sorting"]',
    'medium',
    435
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 38. Meeting Rooms (Premium)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Meeting Rooms',
    'Given an array of meeting time intervals where intervals[i] = [starti, endi], determine if a person could attend all meetings (i.e., no two meetings overlap).',
    E'Input: intervals = [[0,30],[5,10],[15,20]]\nOutput: false\nExplanation: [0,30] overlaps with [5,10] and [15,20].',
    '["0 <= intervals.length <= 10^4", "intervals[i].length == 2", "0 <= starti < endi <= 10^6"]',
    'Sorting',
    'Sort by start time. If any meeting starts before the previous one ends, there is overlap.',
    'def canAttendMeetings(intervals: List[List[int]]) -> bool:\n    intervals.sort(key=lambda x: x[0])\n    for i in range(1, len(intervals)):\n        if intervals[i][0] < intervals[i-1][1]:\n            return False\n    return True',
    'O(n log n)',
    'O(1)',
    '["Sort intervals by start time", "For each consecutive pair", "If current start < previous end, return False", "Return True if no overlaps found"]',
    '["Empty array", "Single meeting", "Back-to-back meetings (no gap)", "Overlapping meetings", "All meetings at same time"]',
    '["Array", "Sorting"]',
    'easy',
    252
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 39. Meeting Rooms II (Premium)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Meeting Rooms II',
    'Given an array of meeting time intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.',
    E'Input: intervals = [[0,30],[5,10],[15,20]]\nOutput: 2\nExplanation: We need 2 rooms: one for [0,30], one for [5,10] and [15,20].',
    '["1 <= intervals.length <= 10^4", "0 <= starti < endi <= 10^6"]',
    'Event Counting / Min Heap',
    'Create separate sorted arrays of start and end times. Walk through events: each start adds a room, each end frees a room. Track max concurrent.',
    'def minMeetingRooms(intervals: List[List[int]]) -> int:\n    starts = sorted([i[0] for i in intervals])\n    ends = sorted([i[1] for i in intervals])\n    rooms = max_rooms = 0\n    s = e = 0\n    while s < len(starts):\n        if starts[s] < ends[e]:\n            rooms += 1\n            s += 1\n        else:\n            rooms -= 1\n            e += 1\n        max_rooms = max(max_rooms, rooms)\n    return max_rooms',
    'O(n log n)',
    'O(n)',
    '["Extract and sort all start times", "Extract and sort all end times", "Two pointers: one for starts, one for ends", "If start < end, need new room (rooms++)", "If start >= end, a room freed (rooms--)", "Track maximum rooms needed"]',
    '["Single meeting", "No overlaps", "All overlap at same time", "Meetings in sequence", "One long meeting with many short overlapping"]',
    '["Array", "Two Pointers", "Greedy", "Sorting", "Heap"]',
    'medium',
    253
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Linked List (6 problems)
-- ========================================

-- 40. Reverse Linked List
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Reverse Linked List',
    'Given the head of a singly linked list, reverse the list and return the reversed list.',
    E'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
    '["The number of nodes is in the range [0, 5000]", "-5000 <= Node.val <= 5000"]',
    'Two Pointers',
    'Iterate through list, reversing each link. Track previous and current nodes. After processing, previous becomes new head.',
    'def reverseList(head: ListNode) -> ListNode:\n    prev, curr = None, head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev',
    'O(n)',
    'O(1)',
    '["Initialize prev = None, curr = head", "While curr is not None", "Save next node (curr.next)", "Reverse link: curr.next = prev", "Move prev and curr forward", "Return prev (new head)"]',
    '["Empty list", "Single node", "Two nodes", "Long list"]',
    '["Linked List", "Recursion"]',
    'easy',
    206
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 41. Linked List Cycle
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Linked List Cycle',
    'Given head, the head of a linked list, determine if the linked list has a cycle in it. Return true if there is a cycle, false otherwise.',
    E'Input: head = [3,2,0,-4], pos = 1\nOutput: true\nExplanation: There is a cycle where the tail connects to the 1st node (0-indexed).',
    '["The number of nodes is in the range [0, 10^4]", "-10^5 <= Node.val <= 10^5", "pos is -1 or a valid index"]',
    'Fast and Slow Pointers',
    'Use two pointers: slow moves one step, fast moves two steps. If there is a cycle, they will eventually meet.',
    'def hasCycle(head: ListNode) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False',
    'O(n)',
    'O(1)',
    '["Initialize slow and fast to head", "While fast and fast.next exist", "Move slow one step, fast two steps", "If they meet, cycle exists", "If fast reaches end, no cycle"]',
    '["Empty list", "Single node no cycle", "Single node with self-loop", "Cycle at beginning", "Cycle at end", "No cycle"]',
    '["Hash Table", "Linked List", "Two Pointers"]',
    'easy',
    141
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 42. Merge Two Sorted Lists
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Merge Two Sorted Lists',
    'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    E'Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
    '["The number of nodes in both lists is in the range [0, 50]", "-100 <= Node.val <= 100", "Both lists are sorted in non-decreasing order"]',
    'Two Pointers / Dummy Node',
    'Use dummy node to simplify edge cases. Compare nodes from both lists, append smaller one to result. Attach remaining nodes at end.',
    'def mergeTwoLists(list1: ListNode, list2: ListNode) -> ListNode:\n    dummy = ListNode(0)\n    curr = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            curr.next = list1\n            list1 = list1.next\n        else:\n            curr.next = list2\n            list2 = list2.next\n        curr = curr.next\n    curr.next = list1 or list2\n    return dummy.next',
    'O(n + m)',
    'O(1)',
    '["Create dummy node, curr points to it", "While both lists have nodes", "Append node with smaller value", "Advance that list pointer", "Advance curr", "Attach remaining nodes", "Return dummy.next"]',
    '["Both lists empty", "One list empty", "Lists of different lengths", "All elements from one list smaller", "Duplicate values"]',
    '["Linked List", "Recursion"]',
    'easy',
    21
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 43. Merge K Sorted Lists
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Merge K Sorted Lists',
    'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    E'Input: lists = [[1,4,5],[1,3,4],[2,6]]\nOutput: [1,1,2,3,4,4,5,6]\nExplanation: Merging all sorted lists into one sorted list.',
    '["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4", "lists[i] is sorted in ascending order", "The sum of lists[i].length <= 10^4"]',
    'Divide and Conquer / Min Heap',
    'Divide and conquer: merge pairs of lists until one remains. Or use min-heap to always pick smallest node from k lists.',
    'def mergeKLists(lists: List[ListNode]) -> ListNode:\n    if not lists:\n        return None\n    while len(lists) > 1:\n        merged = []\n        for i in range(0, len(lists), 2):\n            l1 = lists[i]\n            l2 = lists[i + 1] if i + 1 < len(lists) else None\n            merged.append(mergeTwoLists(l1, l2))\n        lists = merged\n    return lists[0]',
    'O(N log k)',
    'O(1)',
    '["Handle empty lists array", "Use divide and conquer: merge pairs", "Or use min-heap of size k", "Push first node of each list to heap", "Pop min, add to result, push popped node''s next", "Continue until heap empty"]',
    '["Empty array", "Array with empty lists", "Single list", "All lists empty", "Lists of very different sizes"]',
    '["Linked List", "Divide and Conquer", "Heap", "Merge Sort"]',
    'hard',
    23
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 44. Remove Nth Node From End of List
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Remove Nth Node From End of List',
    'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    E'Input: head = [1,2,3,4,5], n = 2\nOutput: [1,2,3,5]\nExplanation: Remove the 2nd node from the end (node with value 4).',
    '["The number of nodes in the list is sz", "1 <= sz <= 30", "0 <= Node.val <= 100", "1 <= n <= sz"]',
    'Two Pointers with Offset',
    'Use two pointers with n nodes between them. When fast reaches end, slow is at node before the one to remove.',
    'def removeNthFromEnd(head: ListNode, n: int) -> ListNode:\n    dummy = ListNode(0, head)\n    slow = fast = dummy\n    # Move fast n+1 ahead\n    for _ in range(n + 1):\n        fast = fast.next\n    # Move both until fast reaches end\n    while fast:\n        slow = slow.next\n        fast = fast.next\n    slow.next = slow.next.next\n    return dummy.next',
    'O(n)',
    'O(1)',
    '["Create dummy node before head", "Move fast pointer n+1 positions ahead", "Move both pointers until fast reaches None", "slow.next is the node to remove", "Skip it: slow.next = slow.next.next", "Return dummy.next"]',
    '["Remove head (n equals length)", "Remove tail (n = 1)", "Single node list", "Remove middle node"]',
    '["Linked List", "Two Pointers"]',
    'medium',
    19
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 45. Reorder List
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Reorder List',
    'You are given the head of a singly linked list: L0 → L1 → ... → Ln-1 → Ln. Reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ... You may not modify the values, only the nodes themselves.',
    E'Input: head = [1,2,3,4]\nOutput: [1,4,2,3]',
    '["The number of nodes is in the range [1, 5 × 10^4]", "1 <= Node.val <= 1000"]',
    'Find Middle + Reverse + Merge',
    'Find middle of list. Reverse second half. Merge two halves by alternating nodes.',
    'def reorderList(head: ListNode) -> None:\n    # Find middle\n    slow = fast = head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    # Reverse second half\n    prev, curr = None, slow.next\n    slow.next = None\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    # Merge two halves\n    first, second = head, prev\n    while second:\n        tmp1, tmp2 = first.next, second.next\n        first.next = second\n        second.next = tmp1\n        first, second = tmp1, tmp2',
    'O(n)',
    'O(1)',
    '["Find middle using slow/fast pointers", "Split list into two halves", "Reverse the second half", "Merge by alternating: first→second→first.next→...", "Continue until second half exhausted"]',
    '["Single node", "Two nodes", "Odd length list", "Even length list"]',
    '["Linked List", "Two Pointers", "Stack", "Recursion"]',
    'medium',
    143
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Matrix (4 problems)
-- ========================================

-- 46. Set Matrix Zeroes
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Set Matrix Zeroes',
    'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. You must do it in place.',
    E'Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]\nOutput: [[1,0,1],[0,0,0],[1,0,1]]',
    '["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200", "-2^31 <= matrix[i][j] <= 2^31 - 1"]',
    'In-place Markers',
    'Use first row and column as markers. First pass: mark rows/cols to zero. Second pass: set zeros based on markers.',
    'def setZeroes(matrix: List[List[int]]) -> None:\n    m, n = len(matrix), len(matrix[0])\n    first_row_zero = any(matrix[0][j] == 0 for j in range(n))\n    first_col_zero = any(matrix[i][0] == 0 for i in range(m))\n    # Mark zeros in first row/col\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][j] == 0:\n                matrix[i][0] = matrix[0][j] = 0\n    # Set zeros based on markers\n    for i in range(1, m):\n        for j in range(1, n):\n            if matrix[i][0] == 0 or matrix[0][j] == 0:\n                matrix[i][j] = 0\n    # Handle first row and column\n    if first_row_zero:\n        for j in range(n): matrix[0][j] = 0\n    if first_col_zero:\n        for i in range(m): matrix[i][0] = 0',
    'O(m * n)',
    'O(1)',
    '["Check if first row/column originally have zeros", "Use first row/column as markers", "For each cell with 0, mark its row start and column start", "Second pass: if marker is 0, set cell to 0", "Handle first row/column separately at end"]',
    '["No zeros", "All zeros", "Single row/column", "Zero in first row or column", "1x1 matrix"]',
    '["Array", "Hash Table", "Matrix"]',
    'medium',
    73
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 47. Spiral Matrix
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Spiral Matrix',
    'Given an m x n matrix, return all elements of the matrix in spiral order.',
    E'Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [1,2,3,6,9,8,7,4,5]',
    '["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10", "-100 <= matrix[i][j] <= 100"]',
    'Boundary Tracking',
    'Track four boundaries (top, bottom, left, right). Move in spiral: right→down→left→up, shrinking boundaries after each direction.',
    'def spiralOrder(matrix: List[List[int]]) -> List[int]:\n    result = []\n    top, bottom = 0, len(matrix) - 1\n    left, right = 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for j in range(left, right + 1): result.append(matrix[top][j])\n        top += 1\n        for i in range(top, bottom + 1): result.append(matrix[i][right])\n        right -= 1\n        if top <= bottom:\n            for j in range(right, left - 1, -1): result.append(matrix[bottom][j])\n            bottom -= 1\n        if left <= right:\n            for i in range(bottom, top - 1, -1): result.append(matrix[i][left])\n            left += 1\n    return result',
    'O(m * n)',
    'O(1)',
    '["Initialize boundaries: top=0, bottom=m-1, left=0, right=n-1", "While boundaries valid", "Traverse right: top row, then top++", "Traverse down: right column, then right--", "Traverse left: bottom row (if valid), then bottom--", "Traverse up: left column (if valid), then left++"]',
    '["1x1 matrix", "Single row", "Single column", "Wide matrix (1xn)", "Tall matrix (mx1)"]',
    '["Array", "Matrix", "Simulation"]',
    'medium',
    54
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 48. Rotate Image
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Rotate Image',
    'You are given an n x n 2D matrix representing an image. Rotate the image by 90 degrees clockwise. You have to rotate the image in-place.',
    E'Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]\nOutput: [[7,4,1],[8,5,2],[9,6,3]]',
    '["n == matrix.length == matrix[i].length", "1 <= n <= 20", "-1000 <= matrix[i][j] <= 1000"]',
    'Transpose + Reverse',
    'Rotate 90° clockwise = Transpose matrix + Reverse each row. Or rotate layer by layer, swapping 4 elements at a time.',
    'def rotate(matrix: List[List[int]]) -> None:\n    n = len(matrix)\n    # Transpose\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    # Reverse each row\n    for row in matrix:\n        row.reverse()',
    'O(n²)',
    'O(1)',
    '["Transpose matrix: swap matrix[i][j] with matrix[j][i]", "Only swap upper triangle to avoid double swap", "Reverse each row", "This achieves 90° clockwise rotation"]',
    '["1x1 matrix", "2x2 matrix", "Odd dimension", "Even dimension"]',
    '["Array", "Math", "Matrix"]',
    'medium',
    48
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 49. Word Search
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Word Search',
    'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically), where the same cell may not be used more than once.',
    E'Input: board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"\nOutput: true',
    '["m == board.length", "n = board[i].length", "1 <= m, n <= 6", "1 <= word.length <= 15", "board and word consist of only lowercase and uppercase English letters"]',
    'Backtracking DFS',
    'DFS from each cell. Track visited cells in current path. If character matches, explore neighbors. Backtrack by unmarking visited.',
    'def exist(board: List[List[str]], word: str) -> bool:\n    m, n = len(board), len(board[0])\n    def dfs(i, j, k):\n        if k == len(word):\n            return True\n        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != word[k]:\n            return False\n        temp, board[i][j] = board[i][j], "#"  # Mark visited\n        found = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1)\n        board[i][j] = temp  # Unmark\n        return found\n    return any(dfs(i, j, 0) for i in range(m) for j in range(n))',
    'O(m * n * 4^L)',
    'O(L)',
    '["Try starting DFS from each cell", "If out of bounds or character doesn''t match, return False", "If all characters matched, return True", "Mark current cell as visited (modify in place)", "Explore all 4 directions", "Backtrack: restore original character"]',
    '["Word not in grid", "Word is entire grid", "Single cell grid", "Word with repeated characters", "Multiple possible paths"]',
    '["Array", "Backtracking", "Matrix"]',
    'medium',
    79
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: String (10 problems)
-- ========================================

-- 50. Longest Substring Without Repeating Characters
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Longest Substring Without Repeating Characters',
    'Given a string s, find the length of the longest substring without repeating characters.',
    E'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with length 3.',
    '["0 <= s.length <= 5 * 10^4", "s consists of English letters, digits, symbols and spaces"]',
    'Sliding Window',
    'Use a set to track characters in current window. Expand right, if duplicate found, shrink left until no duplicate.',
    'def lengthOfLongestSubstring(s: str) -> int:\n    char_set = set()\n    left = max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len',
    'O(n)',
    'O(min(m, n))',
    '["Use set to track characters in window", "Expand window by moving right pointer", "If duplicate found, shrink from left until no duplicate", "Update max length at each step", "Return max length"]',
    '["Empty string", "All same characters", "All unique characters", "Repeating pattern", "Single character"]',
    '["Hash Table", "String", "Sliding Window"]',
    'medium',
    3
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 51. Longest Repeating Character Replacement
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Longest Repeating Character Replacement',
    'You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character. You can perform this operation at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.',
    E'Input: s = "AABABBA", k = 1\nOutput: 4\nExplanation: Replace one ''A'' in the middle to get "AABBBBA" with substring "BBBB" of length 4.\n\nInput: s = "ABBA", k = 1\nOutput: 3\nExplanation: Replace one ''A'' to get substring "BBB" of length 3, or replace one ''B'' to get substring "AAA" of length 3.',
    '["1 <= s.length <= 10^5", "s consists of only uppercase English letters", "0 <= k <= s.length"]',
    'Sliding Window',
    'Window is valid if (window_length - max_freq) <= k, where max_freq tracks the highest frequency seen (doesn''t decrease when shrinking - an optimization that still works). Expand right, shrink left when invalid.',
    'def characterReplacement(s: str, k: int) -> int:\n    count = {}\n    left = max_freq = max_len = 0\n    for right in range(len(s)):\n        count[s[right]] = count.get(s[right], 0) + 1\n        max_freq = max(max_freq, count[s[right]])\n        while (right - left + 1) - max_freq > k:\n            count[s[left]] -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len',
    'O(n)',
    'O(26)',
    '["Track character counts in current window", "Track max frequency of any character", "Window valid if (length - max_freq) <= k", "If invalid, shrink from left", "Update max length", "Note: max_freq doesn''t need to decrease when shrinking"]',
    '["All same characters", "k = 0 (no changes)", "k >= string length", "Alternating characters", "Single character"]',
    '["Hash Table", "String", "Sliding Window"]',
    'medium',
    424
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 52. Minimum Window Substring
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Minimum Window Substring',
    'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string.',
    E'Input: s = "ADOBECODEBANC", t = "ABC"\nOutput: "BANC"\nExplanation: "BANC" is the minimum window containing all chars of t.',
    '["1 <= s.length, t.length <= 10^5", "s and t consist of uppercase and lowercase English letters"]',
    'Sliding Window with Frequency Count',
    'Track needed chars and have count. Expand until all chars found. Then shrink from left while still valid, updating minimum.',
    'def minWindow(s: str, t: str) -> str:\n    from collections import Counter\n    need = Counter(t)\n    have, required = 0, len(need)\n    left = 0\n    min_len, result = float("inf"), ""\n    window = {}\n    for right in range(len(s)):\n        c = s[right]\n        window[c] = window.get(c, 0) + 1\n        if c in need and window[c] == need[c]:\n            have += 1\n        while have == required:\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                result = s[left:right+1]\n            window[s[left]] -= 1\n            if s[left] in need and window[s[left]] < need[s[left]]:\n                have -= 1\n            left += 1\n    return result',
    'O(n + m)',
    'O(n + m)',
    '["Count required characters from t", "Expand window, track when each required char count is satisfied", "When all required chars satisfied, try shrinking from left", "Update minimum window while shrinking", "Stop shrinking when window becomes invalid"]',
    '["t longer than s", "No valid window exists", "t equals s", "Single character strings", "Duplicate characters in t"]',
    '["Hash Table", "String", "Sliding Window"]',
    'hard',
    76
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 53. Valid Anagram
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Valid Anagram',
    'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An anagram is a word formed by rearranging the letters of another word, using all the original letters exactly once.',
    E'Input: s = "anagram", t = "nagaram"\nOutput: true',
    '["1 <= s.length, t.length <= 5 * 10^4", "s and t consist of lowercase English letters"]',
    'Hash Map / Sorting',
    'Count character frequencies in both strings. If counts match, they are anagrams. Or sort both strings and compare.',
    'def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t):\n        return False\n    count = {}\n    for c in s:\n        count[c] = count.get(c, 0) + 1\n    for c in t:\n        count[c] = count.get(c, 0) - 1\n        if count[c] < 0:\n            return False\n    return True',
    'O(n)',
    'O(1)',
    '["If lengths differ, return False", "Count frequency of each character in s", "Decrement counts for each character in t", "If any count goes negative, return False", "Return True if all counts balance"]',
    '["Different lengths", "Empty strings", "Same string", "Same characters different frequencies", "Single character"]',
    '["Hash Table", "String", "Sorting"]',
    'easy',
    242
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 54. Group Anagrams
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Group Anagrams',
    'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    E'Input: strs = ["eat","tea","tan","ate","nat","bat"]\nOutput: [["bat"],["nat","tan"],["ate","eat","tea"]]',
    '["1 <= strs.length <= 10^4", "0 <= strs[i].length <= 100", "strs[i] consists of lowercase English letters"]',
    'Hash Map with Character Count Key',
    'Use character count tuple as key (or sorted string). Words with same key are anagrams.',
    'def groupAnagrams(strs: List[str]) -> List[List[str]]:\n    from collections import defaultdict\n    groups = defaultdict(list)\n    for s in strs:\n        # Create key from character counts\n        count = [0] * 26\n        for c in s:\n            count[ord(c) - ord("a")] += 1\n        groups[tuple(count)].append(s)\n    return list(groups.values())',
    'O(n * k)',
    'O(n * k)',
    '["Create hash map with count-tuple as key", "For each string, count character frequencies", "Convert count array to tuple (hashable)", "Group strings with same key", "Return all groups"]',
    '["Empty strings", "Single string", "No anagrams (all unique)", "All strings are anagrams", "Mixed case (problem says lowercase only)"]',
    '["Array", "Hash Table", "String", "Sorting"]',
    'medium',
    49
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 55. Valid Parentheses
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Valid Parentheses',
    'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['', '']'', determine if the input string is valid. An input string is valid if: Open brackets are closed by the same type of brackets. Open brackets are closed in the correct order. Every close bracket has a corresponding open bracket.',
    E'Input: s = "()[]{}"\nOutput: true',
    '["1 <= s.length <= 10^4", "s consists of parentheses only ''()[]{}''"]',
    'Stack',
    'Push opening brackets onto stack. For closing brackets, pop and check if it matches. Stack should be empty at end.',
    'def isValid(s: str) -> bool:\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in pairs:  # Closing bracket\n            if not stack or stack.pop() != pairs[c]:\n                return False\n        else:  # Opening bracket\n            stack.append(c)\n    return len(stack) == 0',
    'O(n)',
    'O(n)',
    '["Create mapping of closing to opening brackets", "For each character", "If opening bracket, push to stack", "If closing bracket, pop and check match", "If no match or empty stack, return False", "Return True if stack empty at end"]',
    '["Empty string", "Single bracket", "Only opening brackets", "Only closing brackets", "Nested brackets", "Interleaved brackets"]',
    '["String", "Stack"]',
    'easy',
    20
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 56. Valid Palindrome
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Valid Palindrome',
    'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome, or false otherwise.',
    E'Input: s = "A man, a plan, a canal: Panama"\nOutput: true\nExplanation: "amanaplanacanalpanama" is a palindrome.',
    '["1 <= s.length <= 2 * 10^5", "s consists only of printable ASCII characters"]',
    'Two Pointers',
    'Use two pointers from both ends. Skip non-alphanumeric characters. Compare characters (case-insensitive).',
    'def isPalindrome(s: str) -> bool:\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True',
    'O(n)',
    'O(1)',
    '["Initialize left and right pointers", "Skip non-alphanumeric from left", "Skip non-alphanumeric from right", "Compare characters (lowercase)", "If not equal, return False", "Move pointers inward", "Return True if all match"]',
    '["Empty string", "Single character", "Only non-alphanumeric", "All same character", "Spaces and punctuation only"]',
    '["Two Pointers", "String"]',
    'easy',
    125
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 57. Longest Palindromic Substring
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Longest Palindromic Substring',
    'Given a string s, return the longest palindromic substring in s.',
    E'Input: s = "babad"\nOutput: "bab"\nExplanation: "aba" is also a valid answer.',
    '["1 <= s.length <= 1000", "s consist of only digits and English letters"]',
    'Expand Around Center',
    'For each character (and between characters), expand outward while palindrome. Track longest found.',
    'def longestPalindrome(s: str) -> str:\n    result = ""\n    def expand(left, right):\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            left -= 1\n            right += 1\n        return s[left + 1:right]\n    for i in range(len(s)):\n        # Odd length palindrome\n        odd = expand(i, i)\n        if len(odd) > len(result):\n            result = odd\n        # Even length palindrome\n        even = expand(i, i + 1)\n        if len(even) > len(result):\n            result = even\n    return result',
    'O(n²)',
    'O(1)',
    '["For each position i", "Expand around i (odd-length palindrome)", "Expand around i, i+1 (even-length palindrome)", "Track longest palindrome found", "Return longest"]',
    '["Single character", "All same characters", "No palindrome longer than 1", "Entire string is palindrome", "Palindrome at beginning/middle/end"]',
    '["String", "Dynamic Programming"]',
    'medium',
    5
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 58. Palindromic Substrings
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Palindromic Substrings',
    'Given a string s, return the number of palindromic substrings in it. A string is a palindrome when it reads the same backward as forward. A substring is a contiguous sequence of characters within the string.',
    E'Input: s = "abc"\nOutput: 3\nExplanation: Three palindromic strings: "a", "b", "c".',
    '["1 <= s.length <= 1000", "s consists of lowercase English letters"]',
    'Expand Around Center',
    'For each center (character and between characters), expand outward counting palindromes. Each expansion that succeeds is a palindrome.',
    'def countSubstrings(s: str) -> int:\n    count = 0\n    def expand(left, right):\n        nonlocal count\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            count += 1\n            left -= 1\n            right += 1\n    for i in range(len(s)):\n        expand(i, i)      # Odd length\n        expand(i, i + 1)  # Even length\n    return count',
    'O(n²)',
    'O(1)',
    '["For each position i", "Expand around i (odd-length centers)", "Expand around i, i+1 (even-length centers)", "Each successful expansion is a palindrome", "Increment count for each palindrome found"]',
    '["Single character (count = 1)", "All same characters", "No palindromes longer than 1", "Entire string is palindrome"]',
    '["String", "Dynamic Programming"]',
    'medium',
    647
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 59. Encode and Decode Strings (Premium)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Encode and Decode Strings',
    'Design an algorithm to encode a list of strings to a string. The encoded string is then sent over the network and decoded back to the original list of strings.',
    E'Input: ["lint","code","love","you"]\nOutput: ["lint","code","love","you"]\nExplanation: Encode then decode returns original.',
    '["1 <= strs.length <= 200", "0 <= strs[i].length <= 200", "strs[i] contains any possible characters from 0 to 255"]',
    'Length Prefix Encoding',
    'Prefix each string with its length followed by a delimiter. This handles any characters including the delimiter itself.',
    'class Codec:\n    def encode(self, strs: List[str]) -> str:\n        result = ""\n        for s in strs:\n            result += str(len(s)) + "#" + s\n        return result\n    \n    def decode(self, s: str) -> List[str]:\n        result = []\n        i = 0\n        while i < len(s):\n            j = i\n            while s[j] != "#":\n                j += 1\n            length = int(s[i:j])\n            result.append(s[j + 1:j + 1 + length])\n            i = j + 1 + length\n        return result',
    'O(n)',
    'O(n)',
    '["Encode: For each string, write length + # + string", "Decode: Read until #, parse length", "Read next length characters as the string", "Repeat until end of encoded string"]',
    '["Empty list", "List with empty strings", "Strings containing # or digits", "Very long strings", "Unicode characters"]',
    '["Array", "String", "Design"]',
    'medium',
    271
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Tree (14 problems)
-- ========================================

-- 60. Maximum Depth of Binary Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Maximum Depth of Binary Tree',
    'Given the root of a binary tree, return its maximum depth. A binary tree''s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    E'Input: root = [3,9,20,null,null,15,7]\nOutput: 3',
    '["The number of nodes is in the range [0, 10^4]", "-100 <= Node.val <= 100"]',
    'DFS Recursion',
    'Maximum depth = 1 + max(depth of left subtree, depth of right subtree). Base case: empty tree has depth 0.',
    'def maxDepth(root: TreeNode) -> int:\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))',
    'O(n)',
    'O(h)',
    '["Base case: if root is None, return 0", "Recursively get depth of left subtree", "Recursively get depth of right subtree", "Return 1 + max of both depths"]',
    '["Empty tree", "Single node", "Skewed tree (all left or all right)", "Balanced tree", "Complete tree"]',
    '["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]',
    'easy',
    104
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 61. Same Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Same Tree',
    'Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical and the nodes have the same value.',
    E'Input: p = [1,2,3], q = [1,2,3]\nOutput: true',
    '["The number of nodes in both trees is in the range [0, 100]", "-10^4 <= Node.val <= 10^4"]',
    'DFS Recursion',
    'Both trees are same if: both roots are null, or both have same value AND left subtrees are same AND right subtrees are same.',
    'def isSameTree(p: TreeNode, q: TreeNode) -> bool:\n    if not p and not q:\n        return True\n    if not p or not q or p.val != q.val:\n        return False\n    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)',
    'O(n)',
    'O(h)',
    '["If both null, return True", "If one null or values differ, return False", "Recursively check left subtrees", "Recursively check right subtrees", "Return True only if both subtrees match"]',
    '["Both empty", "One empty one not", "Same structure different values", "Different structures", "Single node trees"]',
    '["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]',
    'easy',
    100
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 62. Invert Binary Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Invert Binary Tree',
    'Given the root of a binary tree, invert the tree, and return its root.',
    E'Input: root = [4,2,7,1,3,6,9]\nOutput: [4,7,2,9,6,3,1]\nExplanation: Left and right subtrees are swapped at each level.',
    '["The number of nodes is in the range [0, 100]", "-100 <= Node.val <= 100"]',
    'DFS Recursion',
    'Recursively invert left and right subtrees, then swap them.',
    'def invertTree(root: TreeNode) -> TreeNode:\n    if not root:\n        return None\n    root.left, root.right = root.right, root.left\n    invertTree(root.left)\n    invertTree(root.right)\n    return root',
    'O(n)',
    'O(h)',
    '["Base case: if root is None, return None", "Swap left and right children", "Recursively invert left subtree", "Recursively invert right subtree", "Return root"]',
    '["Empty tree", "Single node", "Skewed tree", "Complete binary tree", "Already symmetric tree"]',
    '["Tree", "Depth-First Search", "Breadth-First Search", "Binary Tree"]',
    'easy',
    226
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 63. Binary Tree Maximum Path Sum
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Binary Tree Maximum Path Sum',
    'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. A path sum is the sum of node values in the path. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    E'Input: root = [-10,9,20,null,null,15,7]\nOutput: 42\nExplanation: The optimal path is 15 → 20 → 7 with sum 42.',
    '["The number of nodes is in the range [1, 3 * 10^4]", "-1000 <= Node.val <= 1000"]',
    'DFS with Global Max',
    'At each node, calculate max path going through it (left + node + right). Track global max. Return max single path (node + one child) for parent.',
    'def maxPathSum(root: TreeNode) -> int:\n    max_sum = float("-inf")\n    def dfs(node):\n        nonlocal max_sum\n        if not node:\n            return 0\n        left = max(0, dfs(node.left))   # Ignore negative paths\n        right = max(0, dfs(node.right))\n        max_sum = max(max_sum, left + node.val + right)  # Path through node\n        return node.val + max(left, right)  # Path to parent\n    dfs(root)\n    return max_sum',
    'O(n)',
    'O(h)',
    '["DFS returns max path sum starting from node going down", "At each node, left_gain = max(0, left_path)", "right_gain = max(0, right_path)", "Update global max with node.val + left_gain + right_gain", "Return node.val + max(left_gain, right_gain) to parent"]',
    '["All negative values", "Single node", "Linear tree (skewed)", "Balanced tree", "Path doesn''t include root"]',
    '["Dynamic Programming", "Tree", "Depth-First Search", "Binary Tree"]',
    'hard',
    124
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 64. Binary Tree Level Order Traversal
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Binary Tree Level Order Traversal',
    'Given the root of a binary tree, return the level order traversal of its nodes'' values. (i.e., from left to right, level by level).',
    E'Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]',
    '["The number of nodes is in the range [0, 2000]", "-1000 <= Node.val <= 1000"]',
    'BFS with Queue',
    'Use a queue. Process nodes level by level: for each level, process all nodes currently in queue, adding their children for next level.',
    'def levelOrder(root: TreeNode) -> List[List[int]]:\n    if not root:\n        return []\n    result = []\n    queue = [root]\n    while queue:\n        level = []\n        level_size = len(queue)\n        for _ in range(level_size):\n            node = queue.pop(0)\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level)\n    return result',
    'O(n)',
    'O(n)',
    '["Handle empty tree", "Initialize queue with root", "While queue not empty", "Process all nodes at current level (use level_size)", "Add children to queue for next level", "Append level values to result"]',
    '["Empty tree", "Single node", "Complete tree", "Skewed tree", "Tree with one child at each level"]',
    '["Tree", "Breadth-First Search", "Binary Tree"]',
    'medium',
    102
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 65. Serialize and Deserialize Binary Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Serialize and Deserialize Binary Tree',
    'Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree structure.',
    E'Input: root = [1,2,3,null,null,4,5]\nOutput: [1,2,3,null,null,4,5]\nExplanation: Serialize then deserialize returns original tree.',
    '["The number of nodes is in the range [0, 10^4]", "-1000 <= Node.val <= 1000"]',
    'Preorder DFS',
    'Serialize: preorder traversal, use marker for null. Deserialize: read values in same order, recursively build tree.',
    'class Codec:\n    def serialize(self, root: TreeNode) -> str:\n        result = []\n        def dfs(node):\n            if not node:\n                result.append("N")\n                return\n            result.append(str(node.val))\n            dfs(node.left)\n            dfs(node.right)\n        dfs(root)\n        return ",".join(result)\n    \n    def deserialize(self, data: str) -> TreeNode:\n        values = data.split(",")\n        self.i = 0\n        def dfs():\n            if values[self.i] == "N":\n                self.i += 1\n                return None\n            node = TreeNode(int(values[self.i]))\n            self.i += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()',
    'O(n)',
    'O(n)',
    '["Serialize: preorder DFS, add value or N for null", "Join with delimiter", "Deserialize: split by delimiter", "Read values in order, build tree recursively", "N means return None, otherwise create node and recurse"]',
    '["Empty tree", "Single node", "Skewed tree", "Complete tree", "Negative values"]',
    '["String", "Tree", "Depth-First Search", "Breadth-First Search", "Design", "Binary Tree"]',
    'hard',
    297
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 66. Subtree of Another Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Subtree of Another Tree',
    'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot.',
    E'Input: root = [3,4,5,1,2], subRoot = [4,1,2]\nOutput: true',
    '["The number of nodes in root is in the range [1, 2000]", "The number of nodes in subRoot is in the range [1, 1000]", "-10^4 <= root.val, subRoot.val <= 10^4"]',
    'DFS with Same Tree Check',
    'For each node in root, check if subtree starting there matches subRoot using isSameTree logic.',
    'def isSubtree(root: TreeNode, subRoot: TreeNode) -> bool:\n    def isSame(p, q):\n        if not p and not q:\n            return True\n        if not p or not q or p.val != q.val:\n            return False\n        return isSame(p.left, q.left) and isSame(p.right, q.right)\n    \n    def dfs(node):\n        if not node:\n            return False\n        if isSame(node, subRoot):\n            return True\n        return dfs(node.left) or dfs(node.right)\n    \n    return dfs(root)',
    'O(m * n)',
    'O(h)',
    '["Create isSameTree helper function", "DFS through main tree", "At each node, check if subtree matches subRoot", "If match found, return True", "Otherwise check left and right subtrees"]',
    '["subRoot equals entire root", "subRoot is leaf", "subRoot not found", "Multiple potential matches", "Single node trees"]',
    '["Tree", "Depth-First Search", "String Matching", "Binary Tree", "Hash Function"]',
    'easy',
    572
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 67. Construct Binary Tree from Preorder and Inorder Traversal
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Construct Binary Tree from Preorder and Inorder Traversal',
    'Given two integer arrays preorder and inorder where preorder is the preorder traversal and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
    E'Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]\nOutput: [3,9,20,null,null,15,7]',
    '["1 <= preorder.length <= 3000", "inorder.length == preorder.length", "-3000 <= preorder[i], inorder[i] <= 3000", "preorder and inorder consist of unique values", "Each value of inorder also appears in preorder", "preorder is guaranteed to be the preorder traversal", "inorder is guaranteed to be the inorder traversal"]',
    'Divide and Conquer',
    'First element of preorder is root. Find it in inorder - left part is left subtree, right part is right subtree. Recurse.',
    'def buildTree(preorder: List[int], inorder: List[int]) -> TreeNode:\n    inorder_map = {val: i for i, val in enumerate(inorder)}\n    pre_idx = [0]\n    def build(left, right):\n        if left > right:\n            return None\n        root_val = preorder[pre_idx[0]]\n        pre_idx[0] += 1\n        root = TreeNode(root_val)\n        mid = inorder_map[root_val]\n        root.left = build(left, mid - 1)\n        root.right = build(mid + 1, right)\n        return root\n    return build(0, len(inorder) - 1)',
    'O(n)',
    'O(n)',
    '["Build hashmap of inorder value -> index", "First preorder element is root", "Find root in inorder to split left/right subtrees", "Recursively build left subtree (elements before root in inorder)", "Recursively build right subtree (elements after root in inorder)"]',
    '["Single node", "Left-skewed tree", "Right-skewed tree", "Balanced tree", "Complete tree"]',
    '["Array", "Hash Table", "Divide and Conquer", "Tree", "Binary Tree"]',
    'medium',
    105
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 68. Validate Binary Search Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Validate Binary Search Tree',
    'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has: left subtree only contains nodes less than root, right subtree only contains nodes greater than root, and both subtrees are also valid BSTs.',
    E'Input: root = [2,1,3]\nOutput: true',
    '["The number of nodes is in the range [1, 10^4]", "-2^31 <= Node.val <= 2^31 - 1"]',
    'DFS with Range Validation',
    'Each node must be within a valid range. Pass min/max bounds down the tree. Left child must be < current, right child must be > current.',
    'def isValidBST(root: TreeNode) -> bool:\n    def validate(node, min_val, max_val):\n        if not node:\n            return True\n        if node.val <= min_val or node.val >= max_val:\n            return False\n        return validate(node.left, min_val, node.val) and validate(node.right, node.val, max_val)\n    return validate(root, float("-inf"), float("inf"))',
    'O(n)',
    'O(h)',
    '["DFS with min and max bounds", "Start with (-inf, +inf) bounds", "Each node must be strictly within bounds", "For left child: new max = current node value", "For right child: new min = current node value"]',
    '["Single node", "All left children", "All right children", "Equal values (invalid)", "Integer overflow values"]',
    '["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]',
    'medium',
    98
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 69. Kth Smallest Element in a BST
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Kth Smallest Element in a BST',
    'Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    E'Input: root = [3,1,4,null,2], k = 1\nOutput: 1',
    '["The number of nodes is in the range [1, 10^4]", "0 <= Node.val <= 10^4", "1 <= k <= number of nodes"]',
    'Inorder Traversal',
    'Inorder traversal of BST gives nodes in sorted order. Perform inorder traversal and return kth element.',
    'def kthSmallest(root: TreeNode, k: int) -> int:\n    stack = []\n    curr = root\n    count = 0\n    while stack or curr:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        count += 1\n        if count == k:\n            return curr.val\n        curr = curr.right\n    return -1',
    'O(H + k)',
    'O(H)',
    '["Use iterative inorder traversal with stack", "Go left as far as possible", "Pop and process node (increment count)", "If count equals k, return value", "Go right and repeat"]',
    '["k = 1 (smallest)", "k = n (largest)", "Single node", "Skewed tree", "Balanced tree"]',
    '["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]',
    'medium',
    230
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 70. Lowest Common Ancestor of a Binary Search Tree
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Lowest Common Ancestor of a Binary Search Tree',
    'Given a binary search tree (BST), find the lowest common ancestor (LCA) of two given nodes p and q. The LCA is the lowest node that has both p and q as descendants (where a node can be a descendant of itself).',
    E'Input: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8\nOutput: 6\nExplanation: LCA of nodes 2 and 8 is 6.',
    '["The number of nodes is in the range [2, 10^5]", "-10^9 <= Node.val <= 10^9", "All Node.val are unique", "p != q", "p and q will exist in the BST"]',
    'BST Property Navigation',
    'Use BST property: if both p and q are smaller, go left. If both larger, go right. Otherwise, current node is LCA.',
    'def lowestCommonAncestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:\n    while root:\n        if p.val < root.val and q.val < root.val:\n            root = root.left\n        elif p.val > root.val and q.val > root.val:\n            root = root.right\n        else:\n            return root\n    return None',
    'O(h)',
    'O(1)',
    '["Start at root", "If both p and q values < root, LCA is in left subtree", "If both p and q values > root, LCA is in right subtree", "Otherwise, current root is LCA (split point)", "Return current node"]',
    '["p or q is root", "p is ancestor of q", "p and q are siblings", "p and q in different subtrees", "Deep tree"]',
    '["Tree", "Depth-First Search", "Binary Search Tree", "Binary Tree"]',
    'medium',
    235
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 71. Implement Trie (Prefix Tree)
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Implement Trie (Prefix Tree)',
    'A trie (prefix tree) is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods.',
    E'Input: ["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]\nOutput: [null, null, true, false, true, null, true]',
    '["1 <= word.length, prefix.length <= 2000", "word and prefix consist only of lowercase English letters", "At most 3 * 10^4 calls to insert, search, and startsWith"]',
    'Trie Data Structure',
    'Each node has children (dict of char->node) and isEnd flag. Insert: add nodes for each char. Search: traverse and check isEnd. StartsWith: traverse without checking isEnd.',
    'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    \n    def insert(self, word: str) -> None:\n        node = self.root\n        for c in word:\n            if c not in node.children:\n                node.children[c] = TrieNode()\n            node = node.children[c]\n        node.is_end = True\n    \n    def search(self, word: str) -> bool:\n        node = self.root\n        for c in word:\n            if c not in node.children:\n                return False\n            node = node.children[c]\n        return node.is_end\n    \n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for c in prefix:\n            if c not in node.children:\n                return False\n            node = node.children[c]\n        return True',
    'O(m)',
    'O(m)',
    '["TrieNode has children dict and is_end flag", "Insert: create nodes for each character, mark end", "Search: traverse nodes, return is_end at last node", "StartsWith: traverse nodes, return True if all chars found"]',
    '["Empty trie", "Single character words", "Words with common prefixes", "Search for prefix only", "Search non-existent word"]',
    '["Hash Table", "String", "Design", "Trie"]',
    'medium',
    208
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 72. Design Add and Search Words Data Structure
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Design Add and Search Words Data Structure',
    'Design a data structure that supports adding new words and finding if a string matches any previously added string. The search word can contain dots ''.'' where dots can match any letter.',
    E'Input: ["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]\nOutput: [null,null,null,null,false,true,true,true]',
    '["1 <= word.length <= 25", "word in addWord consists of lowercase letters", "word in search consists of lowercase letters or ''.''", "At most 10^4 calls to addWord and search"]',
    'Trie with DFS for Wildcards',
    'Use Trie for storage. For search, when encountering ''.'', try all possible children using DFS.',
    'class WordDictionary:\n    def __init__(self):\n        self.root = {}\n    \n    def addWord(self, word: str) -> None:\n        node = self.root\n        for c in word:\n            if c not in node:\n                node[c] = {}\n            node = node[c]\n        node["#"] = True\n    \n    def search(self, word: str) -> bool:\n        def dfs(node, i):\n            if i == len(word):\n                return "#" in node\n            if word[i] == ".":\n                return any(dfs(node[c], i + 1) for c in node if c != "#")\n            if word[i] not in node:\n                return False\n            return dfs(node[word[i]], i + 1)\n        return dfs(self.root, 0)',
    'O(m) for add, O(26^m) worst for search',
    'O(total chars)',
    '["Use Trie structure for word storage", "addWord: standard trie insert", "search: DFS with special handling for ''.''", "For ''.'': recursively try all children", "For regular char: follow that child only"]',
    '["Search with all dots", "Search without dots", "No matching word", "Multiple matching words", "Empty dictionary"]',
    '["String", "Depth-First Search", "Design", "Trie"]',
    'medium',
    211
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 73. Word Search II
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Word Search II',
    'Given an m x n board of characters and a list of strings words, return all words found in the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically), where the same cell may not be used more than once in a word.',
    E'Input: board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]\nOutput: ["eat","oath"]',
    '["m == board.length", "n == board[i].length", "1 <= m, n <= 12", "1 <= words.length <= 3 * 10^4", "1 <= words[i].length <= 10", "board and words[i] consist of lowercase English letters", "All words are unique"]',
    'Trie + Backtracking',
    'Build trie from words. DFS on each cell, following trie paths. When reaching word end in trie, add to result. Prune trie to optimize.',
    'def findWords(board: List[List[str]], words: List[str]) -> List[str]:\n    # Build trie\n    trie = {}\n    for word in words:\n        node = trie\n        for c in word:\n            node = node.setdefault(c, {})\n        node["#"] = word\n    \n    result = []\n    m, n = len(board), len(board[0])\n    \n    def dfs(r, c, node):\n        char = board[r][c]\n        if char not in node:\n            return\n        next_node = node[char]\n        if "#" in next_node:\n            result.append(next_node["#"])\n            del next_node["#"]  # Avoid duplicates\n        board[r][c] = "#"  # Mark visited\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and board[nr][nc] in next_node:\n                dfs(nr, nc, next_node)\n        board[r][c] = char  # Unmark\n    \n    for r in range(m):\n        for c in range(n):\n            dfs(r, c, trie)\n    return result',
    'O(m * n * 4^L)',
    'O(total chars in words)',
    '["Build trie from word list, store word at end node", "DFS from each cell with trie node", "If char matches trie child, continue DFS", "If word end found, add to result", "Mark cells visited during DFS, backtrack after"]',
    '["No words found", "All words found", "Overlapping words", "Same word multiple paths", "Large word list"]',
    '["Array", "String", "Backtracking", "Trie", "Matrix"]',
    'hard',
    212
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- CATEGORY: Heap (2 problems - Merge K Sorted Lists covered in Linked List)
-- ========================================

-- 74. Top K Frequent Elements
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Top K Frequent Elements',
    'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    E'Input: nums = [1,1,1,2,2,3], k = 2\nOutput: [1,2]',
    '["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4", "k is in the range [1, number of unique elements]", "The answer is guaranteed to be unique"]',
    'Bucket Sort / Heap',
    'Count frequencies. Use bucket sort with frequency as index, or min-heap of size k. Bucket sort is O(n).',
    'def topKFrequent(nums: List[int], k: int) -> List[int]:\n    from collections import Counter\n    count = Counter(nums)\n    # Bucket sort approach\n    buckets = [[] for _ in range(len(nums) + 1)]\n    for num, freq in count.items():\n        buckets[freq].append(num)\n    result = []\n    for i in range(len(buckets) - 1, -1, -1):\n        for num in buckets[i]:\n            result.append(num)\n            if len(result) == k:\n                return result\n    return result',
    'O(n)',
    'O(n)',
    '["Count frequency of each element", "Create buckets where index = frequency", "Place each number in its frequency bucket", "Iterate buckets from highest to lowest frequency", "Collect k elements"]',
    '["k = 1", "k equals unique elements", "All same frequency", "Single element repeated", "All unique elements"]',
    '["Array", "Hash Table", "Divide and Conquer", "Sorting", "Heap", "Bucket Sort", "Counting", "Quickselect"]',
    'medium',
    347
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- 75. Find Median from Data Stream
INSERT INTO public.blind_problems (title, prompt, example, constraints, pattern, key_idea, solution, time_complexity, space_complexity, steps, expected_edge_cases, topics, difficulty, leetcode_number)
VALUES (
    'Find Median from Data Stream',
    'The median is the middle value in an ordered list. If the list has an even count, the median is the average of the two middle values. Design a data structure that supports adding integers and finding the median.',
    E'Input: ["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]\n[[], [1], [2], [], [3], []]\nOutput: [null, null, null, 1.5, null, 2.0]',
    '["-10^5 <= num <= 10^5", "There will be at least one element before calling findMedian", "At most 5 * 10^4 calls to addNum and findMedian"]',
    'Two Heaps',
    'Use max-heap for smaller half and min-heap for larger half. Keep heaps balanced. Median is from top of heap(s).',
    'class MedianFinder:\n    def __init__(self):\n        self.small = []  # max-heap (negate values)\n        self.large = []  # min-heap\n    \n    def addNum(self, num: int) -> None:\n        import heapq\n        heapq.heappush(self.small, -num)\n        # Ensure small''s max <= large''s min\n        if self.small and self.large and -self.small[0] > self.large[0]:\n            heapq.heappush(self.large, -heapq.heappop(self.small))\n        # Balance sizes\n        if len(self.small) > len(self.large) + 1:\n            heapq.heappush(self.large, -heapq.heappop(self.small))\n        elif len(self.large) > len(self.small):\n            heapq.heappush(self.small, -heapq.heappop(self.large))\n    \n    def findMedian(self) -> float:\n        if len(self.small) > len(self.large):\n            return -self.small[0]\n        return (-self.small[0] + self.large[0]) / 2',
    'O(log n) add, O(1) find',
    'O(n)',
    '["Use max-heap for smaller half (negate for Python)", "Use min-heap for larger half", "On add: push to small, then rebalance", "Ensure max of small <= min of large", "Keep sizes balanced (differ by at most 1)", "Median from top of larger heap or average of both tops"]',
    '["Single element", "Two elements", "All same values", "Sorted input", "Reverse sorted input"]',
    '["Two Pointers", "Design", "Sorting", "Heap", "Data Stream"]',
    'hard',
    295
)
ON CONFLICT (title) DO UPDATE SET
    prompt = EXCLUDED.prompt,
    example = EXCLUDED.example,
    constraints = EXCLUDED.constraints,
    pattern = EXCLUDED.pattern,
    key_idea = EXCLUDED.key_idea,
    solution = EXCLUDED.solution,
    time_complexity = EXCLUDED.time_complexity,
    space_complexity = EXCLUDED.space_complexity,
    steps = EXCLUDED.steps,
    expected_edge_cases = EXCLUDED.expected_edge_cases,
    topics = EXCLUDED.topics,
    difficulty = EXCLUDED.difficulty,
    leetcode_number = EXCLUDED.leetcode_number;

-- ========================================
-- END OF HEAP CATEGORY (2/2 + 1 shared with Linked List = 3 total)
-- ========================================

-- ========================================
-- BLIND 75 COMPLETE: 75 problems total
-- ========================================
