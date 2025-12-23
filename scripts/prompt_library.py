"""
Visual Mnemonic Prompt Library for LeetCode Problems

APPROACH: Give GPT the full algorithm context (detailed hints) but let IT decide
how to create a memorable visual. We include a meta-instruction that guides toward
visual memory without being too prescriptive.
"""

# Meta instruction added to every prompt
META_INSTRUCTION = """You are creating a VISUAL MNEMONIC to help someone remember this algorithm.

GOAL: Create ONE memorable image that captures the KEY INSIGHT. When someone sees this image, 
they should instantly recall how the algorithm works.

GUIDELINES:
- Don't illustrate every step literally - focus on the CORE insight
- Make it visually memorable and distinctive  
- Use the actual algorithm elements (arrays, pointers, nodes, etc.) but present them vividly
- Think about what made the "tortoise and hare" visual for cycle detection so memorable - 
  it shows the actual mechanism (fast/slow pointers) in a vivid way

PROBLEM: {title}
KEY PUNCHLINE: "{punchline}"

DETAILED ALGORITHM EXPLANATION:
{detailed_hint}

Now create a visual that captures this algorithm's key insight in a memorable way."""


PROMPTS = {
    # ========================================
    # ARRAYS & HASHING
    # ========================================
    1: {
        "title": "Two Sum",
        "filename": "001_two_sum.png",
        "punchline": "Have I seen my complement before? Check the hash map!",
        "detailed_hint": """Think about this problem in terms of what you're really searching for at each step. As you iterate through the array, for each number you see, you're asking: "Does the number I need to complete this sum exist somewhere I've already seen?"

This is a classic complement search problem. Instead of using nested loops to check every pair (O(n²)), you can use a hash map to remember what you've seen. For each number, calculate target - current_number to find what you need. If it's in your map, you're done. If not, add the current number to the map for future lookups.

The key insight: you're trading space for time by storing past values for O(1) lookup."""
    },
    
    217: {
        "title": "Contains Duplicate",
        "filename": "217_contains_duplicate.png",
        "punchline": "Hash set tells you instantly: have I seen this before?",
        "detailed_hint": """This is a fundamental problem about detecting if you've seen something before. As you iterate through the array, you need constant-time lookup to check "have I seen this number already?"

A hash set is perfect for this because it gives you O(1) insertion and O(1) lookup. The moment you try to add a number that already exists in the set, you've found your duplicate.

Alternative approach: Sort the array first, then check adjacent elements. But this is O(n log n) vs O(n) with the hash set approach."""
    },
    
    238: {
        "title": "Product of Array Except Self",
        "filename": "238_product_except_self.png",
        "punchline": "Prefix product × Suffix product = Answer (skip yourself)",
        "detailed_hint": """The trick is to realize that for any position i, the answer is (product of all elements to the left of i) × (product of all elements to the right of i).

You can compute this with two passes:
1. First pass (left to right): Build up a "prefix product" array where each position contains the product of all elements before it.
2. Second pass (right to left): Multiply each position by the "suffix product" (product of all elements after it).

The clever optimization: You don't need separate arrays. Use the result array for prefix products, then multiply in-place during the second pass with a running suffix product."""
    },
    
    53: {
        "title": "Maximum Subarray (Kadane's Algorithm)",
        "filename": "053_maximum_subarray.png",
        "punchline": "Negative sum? Drop it and start fresh!",
        "detailed_hint": """Kadane's Algorithm is elegant once you understand the core decision at each step: "Should I extend the current subarray, or start fresh?"

At each position, you ask: "Is the previous subarray helping me or hurting me?" If the running sum is negative, it's hurting—any future elements would be larger on their own. So you reset and start a new subarray at the current element.

Track two things: the current sum (which might reset) and the maximum sum seen so far. The current sum represents "the best subarray ending here.\""""
    },
    
    152: {
        "title": "Maximum Product Subarray",
        "filename": "152_max_product_subarray.png",
        "punchline": "Track BOTH max AND min - negatives can flip!",
        "detailed_hint": """Unlike max sum, products have a twist: multiplying two negatives makes a positive. So a very negative number could become very positive later!

You need to track BOTH the maximum AND minimum products ending at each position. When you see a negative number, what was your minimum becomes your maximum (after multiplication) and vice versa.

At each step, compute both: max_ending_here = max(num, num*prev_max, num*prev_min) and min_ending_here = min(num, num*prev_max, num*prev_min). Update your global result accordingly.

Don't forget: zeros reset everything because anything times zero is zero."""
    },
    
    153: {
        "title": "Find Minimum in Rotated Sorted Array",
        "filename": "153_find_min_rotated.png",
        "punchline": "Binary search for the rotation point - compare mid to right",
        "detailed_hint": """The rotation creates a "pivot point" where the array is split into two sorted halves. The minimum is at this pivot. Your goal: use binary search to find where the "break" is.

Compare the middle element to the rightmost element:
- If mid > right: The minimum must be in the right half (the break happened there)
- If mid < right: The minimum is in the left half (including mid itself—it might be the minimum!)

Key detail: Use right = mid (not mid - 1) when going left, because mid could be the answer. But use left = mid + 1 when going right, because mid definitely isn't the minimum in that case."""
    },
    
    33: {
        "title": "Search in Rotated Sorted Array",
        "filename": "033_search_rotated.png",
        "punchline": "One half is ALWAYS sorted - find it, check if target is there",
        "detailed_hint": """The key insight: even though the array is rotated, at least ONE half is always properly sorted. You can use this to determine which half to search.

Find the midpoint and figure out which half is sorted:
- If nums[left] <= nums[mid]: Left half is sorted
- Otherwise: Right half is sorted

Once you know which half is sorted, check if the target lies within that sorted range. If yes, search there. If no, search the other half.

This gives you O(log n) because you're still halving the search space each time."""
    },
    
    15: {
        "title": "3Sum",
        "filename": "015_3sum.png",
        "punchline": "Sort first, fix one element, two-pointer the rest",
        "detailed_hint": """The key to making this O(n²) instead of O(n³) is to first sort the array, then use the two-pointer technique.

For each number at index i, you're looking for two numbers to its right that sum to -nums[i]. This becomes a two-sum problem! Use two pointers (left starting at i+1, right starting at end).

If the sum is too small, move left pointer right. Too big, move right pointer left. When you find a match, move BOTH pointers (and skip duplicates!).

The sorting helps with: (1) the two-pointer approach, and (2) skipping duplicate triplets efficiently."""
    },
    
    11: {
        "title": "Container With Most Water",
        "filename": "011_container_with_most_water.png",
        "punchline": "Short wall is the bottleneck - always move the shorter pointer",
        "detailed_hint": """Start with the widest possible container (pointers at both ends). The area = min(height[left], height[right]) × (right - left).

Now the key insight: To possibly find a larger area, you must move the pointer at the SHORTER line inward. Why? The height is limited by the shorter line, and moving the taller line inward would only decrease width while never increasing the height limit.

By always moving the shorter pointer, you guarantee you're exploring all configurations that could potentially be larger. You never need to move the taller pointer because any container formed by doing so would be smaller."""
    },

    # ========================================
    # TWO POINTERS
    # ========================================
    125: {
        "title": "Valid Palindrome",
        "filename": "125_valid_palindrome.png",
        "punchline": "Two pointers from ends, meet in the middle",
        "detailed_hint": """Two pointers from both ends, moving toward the center.

Skip non-alphanumeric characters: while left < right and not isAlphanumeric(s[left]): left++.

Compare characters case-insensitively. If they don't match, return false. If they match, move both pointers inward.

If the pointers meet or cross without mismatches, it's a valid palindrome.

Note: "alphanumeric" means letters AND digits (0-9), not just letters."""
    },

    # ========================================
    # SLIDING WINDOW
    # ========================================
    121: {
        "title": "Best Time to Buy and Sell Stock",
        "filename": "121_best_time_to_buy_sell_stock.png",
        "punchline": "Track minimum price so far, maximize (today - min)",
        "detailed_hint": """The key insight is that for any given day, the maximum profit you can make by selling on that day depends only on the minimum price you've seen BEFORE that day. You can't go back in time to buy.

Visualize it: as you scan left to right through prices, you're maintaining the best "buy" opportunity so far. At each new price, you calculate the potential profit if you sold today (current_price - min_price_so_far), and update your max profit if it's better.

This is a single-pass solution because both values you're tracking (min_price and max_profit) only look backwards."""
    },
    
    3: {
        "title": "Longest Substring Without Repeating Characters",
        "filename": "003_longest_substring.png",
        "punchline": "Sliding window - when you see a repeat, shrink from left",
        "detailed_hint": """Sliding window with a hash map/set. Expand the window by moving the right pointer. When you see a duplicate, shrink from the left until it's valid again.

Optimization: Instead of shrinking one by one, store the INDEX of each character. When you see a duplicate, jump left directly to (last occurrence + 1).

At each step, update maxLength = max(maxLength, right - left + 1).

The window always contains unique characters."""
    },
    
    76: {
        "title": "Minimum Window Substring",
        "filename": "076_min_window_substring.png",
        "punchline": "Expand right to satisfy, shrink left to minimize",
        "detailed_hint": """Sliding window with character counting. Use two maps: one for target characters and counts, one for the current window.

Expand right to include characters. When you have a valid window (contains all target characters with sufficient counts), try to shrink from the left while maintaining validity. Track the minimum length window.

Use a "formed" counter to track how many unique characters match their target count. When formed == required (number of unique chars in target), the window is valid.

This is O(m + n) where m and n are the string lengths."""
    },

    # ========================================
    # LINKED LIST
    # ========================================
    206: {
        "title": "Reverse Linked List",
        "filename": "206_reverse_linked_list.png",
        "punchline": "Three pointers: save next, flip arrow, advance",
        "detailed_hint": """Iterative approach: Use three pointers—prev (starts null), current, and next. At each step:
1. Save next = current.next
2. Reverse the pointer: current.next = prev
3. Move prev and current forward

Recursive approach: Reverse the rest of the list, then fix the current node's connection. The key line is: head.next.next = head (make the next node point back to me).

Both are O(n) time. Iterative is O(1) space, recursive uses O(n) stack space."""
    },
    
    141: {
        "title": "Linked List Cycle",
        "filename": "141_linked_list_cycle.png",
        "punchline": "Fast pointer laps slow pointer if there's a cycle",
        "detailed_hint": """Floyd's Cycle Detection (Tortoise and Hare): Use two pointers—slow moves 1 step, fast moves 2 steps.

If there's a cycle, fast will eventually "lap" slow and they'll meet inside the cycle. If there's no cycle, fast will reach null.

Why does this work? If there's a cycle, once both pointers are in the cycle, the gap between them decreases by 1 each step (fast gains on slow). They must meet.

O(n) time, O(1) space. No need for a hash set!"""
    },
    
    21: {
        "title": "Merge Two Sorted Lists",
        "filename": "021_merge_sorted_lists.png",
        "punchline": "Compare heads, attach smaller, advance that pointer",
        "detailed_hint": """Use a dummy head to simplify the logic (you don't have to special-case the first node). Maintain a tail pointer.

Compare the heads of both lists. Append the smaller one to tail, advance that list's pointer. Repeat until one list is exhausted.

Append the remaining list (it's already sorted) to tail.

Return dummy.next.

Recursive alternative: The merged list is the smaller head connected to the merged result of the rest."""
    },
    
    19: {
        "title": "Remove Nth Node From End",
        "filename": "019_remove_nth_from_end.png",
        "punchline": "Two pointers N apart - when fast hits end, slow is at target",
        "detailed_hint": """Use two pointers spaced n nodes apart. Move the first pointer n steps ahead. Then move both pointers together until the first reaches the end. The second pointer will be at the node BEFORE the one to remove.

The spacing trick: When fast is at the end (null), slow is exactly n+1 nodes from the end, allowing you to skip the nth node.

Use a dummy head to handle edge cases like removing the first node. slow.next = slow.next.next does the removal."""
    },
    
    143: {
        "title": "Reorder List",
        "filename": "143_reorder_list.png",
        "punchline": "Find middle, reverse second half, interleave",
        "detailed_hint": """Break this into three steps:

1. Find the middle: Use slow/fast pointers. When fast reaches the end, slow is at the middle.

2. Reverse the second half: Starting from slow.next, reverse that portion of the list.

3. Merge the two halves: Alternately pick nodes from the first half and the reversed second half.

No extra space needed beyond pointers! Each step is O(n), total is O(n)."""
    },

    # ========================================
    # TREES
    # ========================================
    226: {
        "title": "Invert Binary Tree",
        "filename": "226_invert_binary_tree.png",
        "punchline": "Swap left and right children at every node",
        "detailed_hint": """At each node, swap its left and right children, then recursively invert both subtrees.

The recursive solution is elegant:
if not root: return None
root.left, root.right = root.right, root.left
invert(root.left)
invert(root.right)
return root

Or: first invert children, then swap. Both work!

Iterative: Use a queue/stack. For each node, swap its children, then add the children to the queue."""
    },
    
    104: {
        "title": "Maximum Depth of Binary Tree",
        "filename": "104_max_depth_tree.png",
        "punchline": "Depth = 1 + max(left depth, right depth)",
        "detailed_hint": """Recursive approach (DFS): The depth of a tree is 1 + max(depth of left subtree, depth of right subtree). Base case: null node has depth 0.

Iterative approach (BFS): Level-order traversal. Count the number of levels. Use a queue, process level by level, increment depth after each level.

Both are O(n) time. Recursive uses O(h) stack space (h = height), BFS uses O(w) queue space (w = max width)."""
    },
    
    100: {
        "title": "Same Tree",
        "filename": "100_same_tree.png",
        "punchline": "Same value AND same left AND same right",
        "detailed_hint": """Recursive comparison: Two trees are the same if:
1. Both are null (base case, return true)
2. Both are non-null AND their values are equal AND their left subtrees are the same AND their right subtrees are the same.

If one is null and the other isn't, or values differ, return false.

Iterative: Use two queues/stacks in parallel. At each step, pop from both and compare. Push children in the same order."""
    },
    
    572: {
        "title": "Subtree of Another Tree",
        "filename": "572_subtree.png",
        "punchline": "At each node, check: is this subtree identical to target?",
        "detailed_hint": """For each node in the main tree, check if the subtree rooted there matches the target tree.

Two functions:
1. isSubtree(s, t): Returns true if t is a subtree of s. Check if s matches t, OR if t is a subtree of s.left, OR t is a subtree of s.right.

2. isSameTree(s, t): Returns true if two trees are identical (same structure and values).

For each node in s, try isSameTree with t. Return true if any match.

Time: O(m * n) in worst case, but typically faster due to early termination."""
    },
    
    235: {
        "title": "Lowest Common Ancestor of BST",
        "filename": "235_lca_bst.png",
        "punchline": "Where p and q split - that's the LCA",
        "detailed_hint": """Use the BST property! Starting from root:
- If both p and q are smaller than current, go left
- If both p and q are larger than current, go right
- Otherwise, current node is the LCA (one is on each side, or one IS the current node)

The first node where p and q "split" is their LCA.

This is O(h) time—you traverse a single path from root to the answer. Works iteratively too, no recursion needed."""
    },
    
    102: {
        "title": "Binary Tree Level Order Traversal",
        "filename": "102_level_order.png",
        "punchline": "BFS with queue - snapshot queue size = one level",
        "detailed_hint": """Classic BFS with a queue. The key is tracking level boundaries.

Approach: When processing a level, note the current queue size. Pop exactly that many nodes (they're all from the current level), and add their children for the next level.

while queue not empty:
    level_size = len(queue)
    current_level = []
    for i in range(level_size):
        node = queue.pop()
        current_level.append(node.val)
        if node.left: queue.add(node.left)
        if node.right: queue.add(node.right)
    result.append(current_level)"""
    },
    
    98: {
        "title": "Validate Binary Search Tree",
        "filename": "098_validate_bst.png",
        "punchline": "Every node must stay within its (min, max) range",
        "detailed_hint": """Pass down valid ranges for each node. A node is valid if it's within (min, max) AND both subtrees are valid with updated ranges.

For left child: max becomes current node's value
For right child: min becomes current node's value

Start with (-infinity, +infinity).

Alternative: Inorder traversal of a valid BST produces a sorted sequence. Track the previously visited value and ensure each node is greater.

Careful: It's not enough to check node.left.val < node.val < node.right.val. You must check the entire range!"""
    },

    # ========================================
    # GRAPHS
    # ========================================
    200: {
        "title": "Number of Islands",
        "filename": "200_number_of_islands.png",
        "punchline": "Find land, flood/sink the whole island, count",
        "detailed_hint": """Each island is a connected component of '1's. When you find a '1', you've found a new island—increment your count and then "sink" the entire island by marking all connected '1's as visited.

DFS/BFS from each unvisited '1', marking cells as '0' (or using a visited set) to avoid counting them again.

The key: Each '1' is visited at most once, so despite nested loops, the total time is O(m×n)."""
    },
    
    133: {
        "title": "Clone Graph",
        "filename": "133_clone_graph.png",
        "punchline": "Hash map: original → clone. Visit once, connect clones.",
        "detailed_hint": """Use a hash map to track {original_node: cloned_node}. This serves two purposes:
1. Avoid infinite loops by checking if we've already cloned a node
2. Connect cloned neighbors correctly

DFS approach: For each node, create its clone if not exists. Then recursively clone all neighbors and connect them.

BFS approach: Use a queue. Clone the starting node, then for each node in the queue, clone its neighbors (if not already cloned) and add them to the queue.

The map ensures each node is cloned exactly once."""
    },
    
    207: {
        "title": "Course Schedule",
        "filename": "207_course_schedule.png",
        "punchline": "Cycle in prerequisites = impossible. Detect cycles!",
        "detailed_hint": """This is cycle detection in a directed graph. If there's a cycle, you can't complete all courses (circular dependency).

DFS approach: Use three states for each node—unvisited, visiting (in current path), visited (fully processed). If you encounter a "visiting" node, you've found a cycle.

BFS/Kahn's algorithm: Track in-degrees. Start with nodes that have 0 in-degree (no prerequisites). Remove each from the graph, decreasing neighbors' in-degrees. If you process all nodes, no cycle. If nodes remain with non-zero in-degree, there's a cycle."""
    },
    
    128: {
        "title": "Longest Consecutive Sequence",
        "filename": "128_longest_consecutive.png",
        "punchline": "Only count from sequence STARTS (where num-1 doesn't exist)",
        "detailed_hint": """Use a hash set for O(1) lookups. For each number, check if it could be the START of a sequence (i.e., num-1 is NOT in the set).

If it's a sequence start, count how many consecutive numbers exist: check num+1, num+2, etc.

Why this is O(n): Each number is only counted once—either as a sequence start (and we extend from there) or as part of another sequence (skipped because num-1 exists).

The key insight: Don't start counting from the middle of a sequence."""
    },

    # ========================================
    # DYNAMIC PROGRAMMING
    # ========================================
    70: {
        "title": "Climbing Stairs",
        "filename": "070_climbing_stairs.png",
        "punchline": "ways(n) = ways(n-1) + ways(n-2). It's Fibonacci!",
        "detailed_hint": """This is the Fibonacci sequence in disguise! To reach step n, you could have come from step n-1 (one step) or step n-2 (two steps).

So: ways(n) = ways(n-1) + ways(n-2)

Base cases: ways(1) = 1 (one way to climb 1 stair), ways(2) = 2 (either 1+1 or 2).

You only need the last two values, so you can solve this in O(1) space instead of maintaining a full DP array."""
    },
    
    198: {
        "title": "House Robber",
        "filename": "198_house_robber.png",
        "punchline": "Visit this + skip previous, OR skip this. Take max.",
        "detailed_hint": """At each house, you have two choices: visit it (and skip the previous) or skip it (and take whatever was best up to the previous house).

dp[i] = max(dp[i-2] + nums[i], dp[i-1])

"The best at house i is either: (1) I visited house i-2, skipped i-1, and visit i, OR (2) I take whatever was best up to i-1."

You only need two variables (prev1, prev2) instead of a full array, giving O(1) space."""
    },
    
    213: {
        "title": "House Robber II",
        "filename": "213_house_robber_2.png",
        "punchline": "Circle: either skip first house OR skip last house",
        "detailed_hint": """The houses form a circle, so house 0 and house n-1 are adjacent. You can't visit both.

The trick: Run the House Robber I solution twice:
1. Once on houses [0..n-2] (exclude the last house)
2. Once on houses [1..n-1] (exclude the first house)

Return the maximum of these two results. This covers all valid scenarios because at least one of the first or last house must be excluded."""
    },
    
    322: {
        "title": "Coin Change",
        "filename": "322_coin_change.png",
        "punchline": "dp[amount] = 1 + min(dp[amount - coin]) for each coin",
        "detailed_hint": """Build up from smaller amounts. Define dp[i] = minimum coins needed to make amount i.

For each amount from 1 to target, try each coin. If you can use a coin (coin <= amount), then: dp[amount] = min(dp[amount], dp[amount - coin] + 1)

The intuition: "If I use this coin, I need 1 + (minimum coins to make the remaining amount)."

Initialize dp[0] = 0 (zero coins for zero amount). Initialize all others to infinity or amount+1 (impossible). If dp[target] is still impossible at the end, return -1."""
    },
    
    300: {
        "title": "Longest Increasing Subsequence",
        "filename": "300_longest_increasing.png",
        "punchline": "For each element, find the longest chain ending here",
        "detailed_hint": """Classic DP approach (O(n²)): Let dp[i] = length of longest increasing subsequence ending at index i. For each i, look back at all j < i where nums[j] < nums[i], and take dp[i] = max(dp[j] + 1).

Optimized approach (O(n log n)): Maintain a "tails" array where tails[i] is the smallest ending element for an increasing subsequence of length i+1. For each number, binary search to find where it fits (replace or extend). The final length is len(tails).

The tails array trick works because you're greedily keeping the best (smallest) ending element for each length."""
    },
    
    139: {
        "title": "Word Break",
        "filename": "139_word_break.png",
        "punchline": "Can I split at position j where dp[j]=true AND rest is in dict?",
        "detailed_hint": """Define dp[i] = true if s[0..i-1] can be segmented into dictionary words.

For each position i, check all possible last words: for j from 0 to i-1, if dp[j] is true AND s[j..i-1] is in the dictionary, then dp[i] = true.

The intuition: "Can I find a valid split point where everything before it is breakable, and the rest is a dictionary word?"

Base case: dp[0] = true (empty string is valid). Answer: dp[n].

Optimization: Convert dictionary to a set for O(1) word lookup."""
    },
    
    62: {
        "title": "Unique Paths",
        "filename": "062_unique_paths.png",
        "punchline": "Paths to (i,j) = paths from above + paths from left",
        "detailed_hint": """In a grid, to reach cell (i,j), you must have come from either (i-1,j) or (i,j-1). So: dp[i][j] = dp[i-1][j] + dp[i][j-1].

Initialize the first row and first column to 1 (only one way to reach any cell on the edge—keep going in one direction).

Space optimization: You only need the previous row, so use a 1D array of size n. Update in-place left to right: dp[j] = dp[j] + dp[j-1].

Math approach: This is a combinatorics problem. You need (m-1) downs and (n-1) rights in any order. Answer: C(m+n-2, m-1)."""
    },
    
    55: {
        "title": "Jump Game",
        "filename": "055_jump_game.png",
        "punchline": "Track max reach. Stuck if current position > max reach.",
        "detailed_hint": """Greedy approach: Track the farthest index you can reach. Iterate through the array, and at each position, update the max reach: maxReach = max(maxReach, i + nums[i]).

If at any point your current index exceeds maxReach, you're stuck—return false. If maxReach >= last index, return true.

Alternative DP approach: Work backwards. A position is "good" if you can reach the end from it. Check if any jump from the current position lands on a "good" position.

The greedy approach is O(n) time and O(1) space."""
    },

    # ========================================
    # INTERVALS
    # ========================================
    56: {
        "title": "Merge Intervals",
        "filename": "056_merge_intervals.png",
        "punchline": "Sort by start. If overlap, extend end. Else new interval.",
        "detailed_hint": """First, sort intervals by their start time. This ensures that if two intervals overlap, they'll be adjacent in the sorted order.

Then iterate: Compare the current interval with the last one in your result. If they overlap (current.start <= last.end), merge them by updating last.end = max(last.end, current.end). Otherwise, add the current interval as a new non-overlapping interval.

The key insight: After sorting by start, you only need to compare each interval with the previous one."""
    },
    
    57: {
        "title": "Insert Interval",
        "filename": "057_insert_interval.png",
        "punchline": "Three zones: before (add), overlap (merge), after (add)",
        "detailed_hint": """Process intervals in three phases:
1. Add all intervals that END BEFORE the new interval starts (no overlap, come before)
2. Merge all intervals that OVERLAP with the new interval (start <= newEnd AND end >= newStart)
3. Add all intervals that START AFTER the new interval ends (no overlap, come after)

For merging overlapping intervals, track the merged interval as: [min(starts), max(ends)].

Since intervals are already sorted, you can do this in a single pass through the array."""
    },
    
    435: {
        "title": "Non-overlapping Intervals",
        "filename": "435_non_overlapping.png",
        "punchline": "Sort by END time. Greedily keep earliest-ending intervals.",
        "detailed_hint": """This is an interval scheduling problem. Sort by END time, then greedily keep intervals that end earliest.

Why sort by end time? An interval that ends earlier leaves more room for future intervals. It's the greedy choice that maximizes the number of non-overlapping intervals.

Count kept intervals: if current.start >= prev_end, keep it and update prev_end. The answer is total - kept.

Alternative: Sort by start, and when overlap occurs, remove the interval that ends later (it causes more future conflicts)."""
    },

    # ========================================
    # BIT MANIPULATION
    # ========================================
    191: {
        "title": "Number of 1 Bits",
        "filename": "191_number_of_1_bits.png",
        "punchline": "n & (n-1) clears rightmost 1. Count the clears.",
        "detailed_hint": """The straightforward way: check each of the 32 bits using right shift and AND with 1. But there's a clever trick.

The expression n & (n-1) clears the rightmost set bit. Why? When you subtract 1, you flip all bits from the rightmost 1 to the end. ANDing with the original clears just that bit.

Example: 1100 & 1011 = 1000 (cleared the rightmost 1)

Count how many times you can do this before n becomes 0. That's your answer, and it only iterates once per set bit!"""
    },
    
    268: {
        "title": "Missing Number",
        "filename": "268_missing_number.png",
        "punchline": "XOR all indices and values - pairs cancel, missing remains",
        "detailed_hint": """Three elegant approaches, all O(n) time:

1. Math: The sum of 0 to n is n*(n+1)/2. Calculate expected sum, subtract actual sum of array.

2. XOR: XOR all array indices (0 to n-1) and the number n, then XOR all array values. Since a^a=0, everything pairs off except the missing number.

3. Cyclic sort (in-place): Since values are in range [0,n], place each value at its "correct" index. The index without its matching value is the answer.

The XOR solution is particularly elegant because it uses no extra space and handles overflow gracefully."""
    },

    # ========================================
    # HEAP / PRIORITY QUEUE
    # ========================================
    295: {
        "title": "Find Median from Data Stream",
        "filename": "295_median_stream.png",
        "punchline": "Two heaps: max-heap for small half, min-heap for large half",
        "detailed_hint": """Use two heaps:
- Max-heap for the smaller half of numbers
- Min-heap for the larger half of numbers

The median is either the max of the smaller half (odd count) or the average of both heap tops (even count).

When adding a number:
1. Add to max-heap first (smaller half)
2. Pop from max-heap and push to min-heap (balance)
3. If min-heap has more elements than max-heap, pop and push back to max-heap

This keeps the heaps balanced (sizes differ by at most 1) and the smaller half always in the max-heap.

addNum: O(log n), findMedian: O(1)."""
    },
    
    347: {
        "title": "Top K Frequent Elements",
        "filename": "347_top_k_frequent.png",
        "punchline": "Count frequencies, then bucket sort or min-heap of size K",
        "detailed_hint": """Three main approaches:

1. Min-Heap of size k (O(n log k)): Count frequencies, then maintain a min-heap of the k most frequent. If heap size exceeds k, pop the minimum. The remaining k elements are the answer.

2. Bucket Sort (O(n)): Frequencies range from 1 to n. Create n buckets where bucket[i] contains elements with frequency i. Collect elements from highest buckets until you have k.

3. Quickselect (O(n) average): Use quickselect to partition by frequency, finding the k elements with highest frequencies.

For interviews, heap is most commonly expected. Bucket sort is the optimal solution."""
    },

    # ========================================
    # TRIE
    # ========================================
    208: {
        "title": "Implement Trie",
        "filename": "208_implement_trie.png",
        "punchline": "Tree where each edge is a letter. Path = word.",
        "detailed_hint": """Each node contains: a dictionary of children (char → child_node) and an is_end_of_word flag.

Insert: Traverse/create nodes for each character. Mark the last node as end_of_word.

Search: Traverse nodes for each character. Return true only if you reach the end AND is_end_of_word is true.

StartsWith: Same as search, but return true if you can traverse all characters (don't check is_end_of_word).

Each node can have up to 26 children (for lowercase letters). Using a dictionary is more space-efficient than an array when words are sparse."""
    },

    # ========================================
    # MISSING PROBLEMS - BATCH 2
    # ========================================
    
    # Bit Manipulation
    190: {
        "title": "Reverse Bits",
        "filename": "190_reverse_bits.png",
        "punchline": "Extract from right, build from left. 32 iterations.",
        "detailed_hint": """Process each bit from right to left, build the result from left to right.

For each of the 32 iterations:
1. Extract the last bit of n using (n & 1)
2. Add it to result (shift result left first, then OR with the extracted bit)
3. Right shift n to process the next bit

After 32 iterations, your result is the reversed number.

Optimization: Use a lookup table for 8-bit chunks if you need to reverse many numbers."""
    },
    
    338: {
        "title": "Counting Bits",
        "filename": "338_counting_bits.png",
        "punchline": "dp[i] = dp[i >> 1] + (i & 1). Build on previous answers!",
        "detailed_hint": """You could solve each number independently, but there's a beautiful pattern using dynamic programming.

Key observation: The number of 1s in i equals the number of 1s in i/2 (right shift) plus whether i's last bit is 1.
Formula: dp[i] = dp[i >> 1] + (i & 1)

Alternatively: dp[i] = dp[i & (i-1)] + 1, using the "clear last bit" trick.

Both approaches give O(n) time because you're building on previously computed results."""
    },
    
    371: {
        "title": "Sum of Two Integers",
        "filename": "371_sum_two_integers.png",
        "punchline": "XOR for sum without carry. AND + shift for carry. Repeat!",
        "detailed_hint": """You need to add without + or -. Think about what happens in binary addition:
- XOR (^) gives you the sum without carrying (1+1=0, 1+0=1, 0+0=0)
- AND (&) gives you the positions where carries occur (1+1 produces a carry)
- Left shift (<<1) moves those carries to the correct position

The algorithm: XOR for the partial sum, AND + left shift for the carry. Repeat until there's no carry left.

Watch for negative numbers in languages that don't handle integer overflow the same way. You may need to mask to 32 bits."""
    },
    
    # Strings
    5: {
        "title": "Longest Palindromic Substring",
        "filename": "005_longest_palindrome.png",
        "punchline": "Expand from every center. Try both odd and even lengths.",
        "detailed_hint": """Expand around center approach (O(n²)): For each position, expand outward while characters match. Try both odd-length (single center) and even-length (two centers) palindromes.

For each center, expand while s[left] == s[right], tracking the longest found.

DP approach: dp[i][j] = true if s[i..j] is a palindrome. dp[i][j] = (s[i] == s[j]) AND dp[i+1][j-1]. Fill diagonally or by length.

The expand approach is simpler and often faster in practice due to early termination."""
    },
    
    647: {
        "title": "Palindromic Substrings",
        "filename": "647_palindromic_substrings.png",
        "punchline": "Expand from each center. Count all palindromes found.",
        "detailed_hint": """Same expand-around-center technique as Longest Palindromic Substring, but COUNT instead of tracking the longest.

For each center (both odd and even), expand outward while characters match. Each successful expansion is one more palindrome.

There are 2n-1 centers (n single positions + n-1 gaps between positions).

Alternative: DP where dp[i][j] indicates if s[i..j] is a palindrome. Count all true values. But the expand approach is typically cleaner."""
    },
    
    242: {
        "title": "Valid Anagram",
        "filename": "242_valid_anagram.png",
        "punchline": "Same letters, same counts. Use a frequency map.",
        "detailed_hint": """Two strings are anagrams if they have the same character frequencies.

Approach 1: Sort both strings and compare. O(n log n) time.

Approach 2: Use a hash map or array of size 26 (for lowercase letters). Increment for characters in s, decrement for characters in t. All counts should be zero at the end.

Approach 3: Single pass—same as approach 2 but check that all counts are zero afterward.

Edge case: Different lengths mean they can't be anagrams—check this first."""
    },
    
    49: {
        "title": "Group Anagrams",
        "filename": "049_group_anagrams.png",
        "punchline": "Anagrams share the same sorted form. Group by signature.",
        "detailed_hint": """The key: all anagrams share the same "signature." Group by signature.

Signature option 1: Sort the word. All anagrams have the same sorted form. O(n * k log k) where k is max word length.

Signature option 2: Character count tuple. Count occurrences of each letter and use that as a hashable key. O(n * k).

Use a hash map: {signature: [list of words]}. Iterate through all words, compute each signature, add to the appropriate list. Return all values from the map."""
    },
    
    424: {
        "title": "Longest Repeating Character Replacement",
        "filename": "424_longest_repeating.png",
        "punchline": "Window valid if (length - maxFreq) <= k replacements.",
        "detailed_hint": """Sliding window approach. The key insight: a window is valid if (window_length - count_of_most_frequent_char) <= k.

Expand right, update character frequencies. If the window becomes invalid (too many characters to replace), shrink from left.

Track the max frequency in the current window. Technically, you don't even need to decrease maxFreq when shrinking—an invalid window with old maxFreq still gives correct results because we're looking for the maximum.

Answer: the largest valid window size seen."""
    },
    
    # Stack
    20: {
        "title": "Valid Parentheses",
        "filename": "020_valid_parentheses.png",
        "punchline": "Push opens. Pop for closes. Must match and end empty.",
        "detailed_hint": """Use a stack. Push opening brackets, pop for closing brackets.

When you see a closing bracket, the top of the stack MUST be its matching opening bracket. If not, or if the stack is empty, invalid.

At the end, the stack must be empty (all brackets matched).

Map closing to opening brackets for clean code: {")": "(", "]": "[", "}": "{"}."""
    },
    
    # Matrix
    48: {
        "title": "Rotate Image",
        "filename": "048_rotate_image.png",
        "punchline": "Transpose + reverse rows = 90° clockwise rotation.",
        "detailed_hint": """For 90° clockwise rotation, there's an elegant two-step approach:

1. Transpose the matrix (swap matrix[i][j] with matrix[j][i])
2. Reverse each row

For 90° counter-clockwise: Transpose, then reverse each column (or reverse each row first, then transpose).

Why this works: Transposing flips the matrix along the diagonal. Reversing rows then moves each element to its final position.

Alternative: Rotate in place by moving four cells at a time in a cycle."""
    },
    
    54: {
        "title": "Spiral Matrix",
        "filename": "054_spiral_matrix.png",
        "punchline": "Four boundaries. Go right→down→left→up. Shrink after each.",
        "detailed_hint": """Maintain four boundaries: top, bottom, left, right. Move in order: right across top, down the right side, left across bottom, up the left side.

After each direction:
- After going right: top++
- After going down: right--
- After going left: bottom--
- After going up: left++

Stop when boundaries cross (top > bottom or left > right).

Check the boundary conditions carefully, especially for non-square matrices where you might not need all four directions in the last loop."""
    },
    
    73: {
        "title": "Set Matrix Zeroes",
        "filename": "073_set_matrix_zeroes.png",
        "punchline": "Use first row/col as markers. O(1) space trick!",
        "detailed_hint": """The challenge is O(1) space. Use the first row and first column as markers!

1. First, check if the first row or first column originally contains zeros (save this info in two boolean flags).

2. Iterate through the rest of the matrix. If cell (i,j) is 0, mark matrix[i][0] = 0 and matrix[0][j] = 0.

3. Use these markers to set zeros: For each cell (i,j), if matrix[i][0] == 0 OR matrix[0][j] == 0, set it to 0.

4. Finally, handle the first row and column using the saved flags."""
    },
    
    # Backtracking
    39: {
        "title": "Combination Sum",
        "filename": "039_combination_sum.png",
        "punchline": "Backtrack: include (stay) or skip (move on). Reuse allowed!",
        "detailed_hint": """This is a backtracking problem. At each step, you have choices: include a candidate or skip it. Since you can reuse candidates, when you include one, don't move to the next index—stay and consider including it again.

Build combinations recursively. When the remaining target becomes 0, you've found a valid combination. When it goes negative or you've exhausted candidates, backtrack.

To avoid duplicates like [2,3] and [3,2], always iterate forward from your current index. This ensures you build combinations in sorted order."""
    },
    
    79: {
        "title": "Word Search",
        "filename": "079_word_search.png",
        "punchline": "DFS from each cell. Mark visited, backtrack if stuck.",
        "detailed_hint": """Use backtracking with DFS. From each cell, try to match the word starting there.

At each step:
1. Check bounds, check if current cell matches current character
2. Mark the cell as visited (can modify the cell temporarily)
3. Recursively try all four directions for the next character
4. If any path succeeds, return true. Otherwise, unmark (backtrack) and return false.

The backtracking is crucial: you must restore the cell when returning, as it might be needed for a different path."""
    },
    
    # Dynamic Programming
    91: {
        "title": "Decode Ways",
        "filename": "091_decode_ways.png",
        "punchline": "dp[i] = (valid 1-digit?) dp[i-1] + (valid 2-digit?) dp[i-2]",
        "detailed_hint": """At each position, ask: "How many ways can I decode up to here?"

dp[i] represents the number of ways to decode s[0..i-1].

Single digit: If s[i-1] is '1'-'9' (valid), add dp[i-1] ways.
Two digits: If s[i-2:i] forms a valid number (10-26), add dp[i-2] ways.

Edge cases are tricky: '0' cannot stand alone, so '0' means 0 ways unless it's part of '10' or '20'. Leading zeros in two-digit numbers (like '01') are invalid.

Base: dp[0] = 1 (empty prefix has one way). Answer: dp[n]."""
    },
    
    1143: {
        "title": "Longest Common Subsequence",
        "filename": "1143_longest_common_subseq.png",
        "punchline": "Match? Extend diagonal. No match? Take max of skip either.",
        "detailed_hint": """Use a 2D DP table where dp[i][j] = LCS length for text1[0..i-1] and text2[0..j-1].

The recurrence:
- If text1[i-1] == text2[j-1]: dp[i][j] = dp[i-1][j-1] + 1 (extend the LCS)
- Otherwise: dp[i][j] = max(dp[i-1][j], dp[i][j-1]) (take the best of skipping either character)

Build the table bottom-up, and the answer is dp[m][n].

Space optimization: Since you only need the previous row, you can reduce to O(min(m,n)) space."""
    },
    
    # Linked List
    23: {
        "title": "Merge K Sorted Lists",
        "filename": "023_merge_k_sorted.png",
        "punchline": "Min-heap of k heads. Pop smallest, push its next.",
        "detailed_hint": """Three main approaches:

1. Min-Heap (O(n log k)): Put the head of each list in a min-heap. Pop the smallest, add it to result, push its next node if exists. The heap always has at most k elements.

2. Divide and Conquer (O(n log k)): Pair up lists and merge each pair. Repeat until one list remains. Like merge sort on lists.

3. Merge one by one (O(nk)): Merge list 1 and 2, then merge result with list 3, etc. Simpler but slower.

The heap approach is usually cleanest to implement."""
    },
    
    # Trees
    105: {
        "title": "Construct Binary Tree from Preorder and Inorder Traversal",
        "filename": "105_construct_tree.png",
        "punchline": "Preorder gives root. Inorder gives left/right split.",
        "detailed_hint": """Key insight: In preorder, the first element is always the root. In inorder, elements left of the root are the left subtree, elements right are the right subtree.

Algorithm:
1. Pop from preorder—this is the current root
2. Find this value in inorder (use a hash map for O(1) lookup)
3. Everything left of it in inorder is the left subtree; everything right is the right subtree
4. Recursively build left and right subtrees

Use indices to avoid creating new arrays. Preorder tells you WHAT the root is; inorder tells you the SPLIT."""
    },
    
    124: {
        "title": "Binary Tree Maximum Path Sum",
        "filename": "124_max_path_sum.png",
        "punchline": "At each node: contribute UP or be the APEX of the path.",
        "detailed_hint": """The tricky part: a path can go through a node in two ways:
1. The node is part of a longer path going up to its parent
2. The node is the "apex" of a path (left → node → right)

For each node, calculate the max contribution it can make going UP (itself + max of one child, or just itself if children are negative).

But also check if this node could be the apex: left_gain + node.val + right_gain. Update global max if this is better.

Use a helper function that returns the "max gain going up" but also updates the global maximum for path sums."""
    },
    
    297: {
        "title": "Serialize and Deserialize Binary Tree",
        "filename": "297_serialize_tree.png",
        "punchline": "Preorder with null markers. Nulls define tree shape.",
        "detailed_hint": """Preorder traversal with null markers works well.

Serialize: Visit node, output value (or "null"), recursively serialize left, then right. Result: "1,2,null,null,3,4,null,null,5,null,null"

Deserialize: Split by delimiter into a queue/iterator. Pop the next value:
- If "null", return None
- Otherwise, create node, recursively deserialize left child, then right child

The preorder structure + null markers perfectly capture the tree shape. BFS also works with level-order serialization."""
    },
    
    230: {
        "title": "Kth Smallest Element in a BST",
        "filename": "230_kth_smallest_bst.png",
        "punchline": "Inorder traversal = sorted order. Stop at kth node.",
        "detailed_hint": """Inorder traversal of a BST visits nodes in sorted order. The kth node visited is the kth smallest.

Iterative inorder with a counter: Use a stack, go left as far as possible, pop and count. When count == k, return that node's value.

Recursive: Do inorder traversal but stop early when you've found the kth element.

Follow-up: If the BST is modified often, store subtree sizes at each node. Then you can find the kth smallest in O(h) time using binary search on subtree sizes."""
    },
    
    # Trie
    211: {
        "title": "Design Add and Search Words Data Structure",
        "filename": "211_add_search_words.png",
        "punchline": "Trie + wildcard '.' = try ALL children recursively.",
        "detailed_hint": """A Trie with wildcard support. The add operation is standard Trie insertion.

For search with '.':
- If the current character is a letter, follow the standard Trie path
- If it's '.', try ALL children recursively. If any path matches the rest of the word, return true.

The wildcard makes this potentially O(26^m) in the worst case (all dots), but practically it's much faster because most paths don't exist in the Trie.

Use DFS for the search, backtracking through all possibilities for wildcards."""
    },
    
    212: {
        "title": "Word Search II",
        "filename": "212_word_search_ii.png",
        "punchline": "Build Trie of words. DFS grid following Trie paths.",
        "detailed_hint": """Combine Trie with backtracking. Build a Trie from all words, then search the grid using DFS.

For each cell, start a DFS that follows the Trie. If the current path matches a Trie node, continue exploring. If you reach a word end in the Trie, add it to results.

Optimization: Remove words from the Trie after finding them to avoid duplicates and speed up subsequent searches.

Optimization: Instead of storing just is_word, store the actual word at Trie nodes. This makes it easy to add found words to results.

Time complexity is O(m * n * 4^L) in worst case, but Trie pruning makes it much faster."""
    },
    
    # Graph
    417: {
        "title": "Pacific Atlantic Water Flow",
        "filename": "417_pacific_atlantic.png",
        "punchline": "Reverse: flow UP from oceans. Find intersection.",
        "detailed_hint": """Instead of asking "can water from this cell reach both oceans?", reverse the question: "which cells can be reached FROM each ocean?"

Start BFS/DFS from Pacific borders (top row, left column) and from Atlantic borders (bottom row, right column). Water flows "uphill" in reverse—you can move to a neighbor if it's >= current height.

Find the intersection of cells reachable from both oceans. This is more efficient than checking every cell independently."""
    },
    
    # Premium Problems
    252: {
        "title": "Meeting Rooms",
        "filename": "252_meeting_rooms.png",
        "punchline": "Sort by start. Any overlap means can't attend all.",
        "detailed_hint": """A person can attend all meetings only if no two meetings overlap.

Sort meetings by start time. Then check each consecutive pair: if the next meeting starts before the current one ends, there's a conflict.

Simply: for each i, check if meetings[i].start < meetings[i-1].end.

If any overlap exists, return false. If you get through all meetings, return true."""
    },
    
    253: {
        "title": "Meeting Rooms II",
        "filename": "253_meeting_rooms_ii.png",
        "punchline": "Min-heap of end times. Overlap count = rooms needed.",
        "detailed_hint": """You need to find the maximum number of overlapping meetings at any point in time.

Two approaches:

1. Min-Heap: Sort meetings by start time. Use a min-heap to track end times of ongoing meetings. For each meeting, remove all meetings that have ended (end <= current.start), then add current meeting's end time. Track the max heap size.

2. Sweep Line: Create events for all starts (+1) and ends (-1). Sort by time (end before start if same time). Sweep through, tracking the running count. Max count = min rooms needed."""
    },
    
    261: {
        "title": "Graph Valid Tree",
        "filename": "261_graph_valid_tree.png",
        "punchline": "Tree = n-1 edges + connected + no cycles. Union-Find!",
        "detailed_hint": """A graph is a valid tree if it: (1) has exactly n-1 edges, (2) is fully connected, and (3) has no cycles.

If edges.length != n-1, immediately return false.

Then check connectivity using Union-Find or DFS:
- Union-Find: Process each edge. If both nodes are already in the same set, there's a cycle. After all edges, check if there's exactly one connected component.
- DFS: Start from node 0, visit all reachable nodes. If all n nodes are visited and no back-edge is found, it's a valid tree."""
    },
    
    269: {
        "title": "Alien Dictionary",
        "filename": "269_alien_dictionary.png",
        "punchline": "Compare adjacent words for ordering. Topological sort!",
        "detailed_hint": """This is a topological sort problem. You need to discover the ordering rules between characters, then sort them.

Step 1: Compare adjacent words to find ordering rules. If word1 = "abc" and word2 = "abd", comparing character by character, 'c' comes before 'd'. Add edge c → d.

Step 2: Topological sort the graph. Use Kahn's (BFS with in-degrees) or DFS. If there's a cycle, return "" (no valid ordering).

Edge case: If a longer word comes before its prefix (like ["abc", "ab"]), that's invalid—return ""."""
    },
    
    271: {
        "title": "Encode and Decode Strings",
        "filename": "271_encode_decode.png",
        "punchline": "Length-prefix encoding: '3#abc2#de'. Delimiter-free!",
        "detailed_hint": """The challenge: strings can contain any character, including delimiters. You need a delimiter-free encoding.

Solution: Length-prefix encoding. For each string, store its LENGTH followed by a delimiter, then the string itself.

Example: ["abc", "de"] → "3#abc2#de"

To decode: Read digits until you hit #, parse the length n, then read exactly n characters. Repeat.

This works because you always know exactly how many characters belong to each string, regardless of their content."""
    },
    
    323: {
        "title": "Number of Connected Components",
        "filename": "323_connected_components.png",
        "punchline": "Union-Find: start with n components. Each union decreases by 1.",
        "detailed_hint": """Classic Union-Find (Disjoint Set) problem. Initialize each node as its own component (count = n).

For each edge, union the two nodes. Every successful union (nodes were in different sets) decreases the count by 1.

Alternatively, use DFS: Start DFS from each unvisited node, marking all reachable nodes as visited. The number of times you start a new DFS equals the number of components.

Union-Find with path compression and union by rank gives nearly O(1) per operation."""
    },
}


def build_prompt(problem_number: int) -> str:
    """Build the full prompt with meta instruction and problem details."""
    if problem_number not in PROMPTS:
        return None
    
    problem = PROMPTS[problem_number]
    return META_INSTRUCTION.format(
        title=problem["title"],
        punchline=problem["punchline"],
        detailed_hint=problem["detailed_hint"]
    )


def get_prompt(problem_number: int) -> dict:
    """Get prompt data for a problem number."""
    return PROMPTS.get(problem_number)


def get_all_problem_numbers() -> list:
    """Get all problem numbers in the library."""
    return sorted(PROMPTS.keys())


def get_problems_in_range(start: int, count: int) -> list:
    """Get a batch of problems starting from a given index."""
    all_numbers = get_all_problem_numbers()
    return all_numbers[start:start + count]
