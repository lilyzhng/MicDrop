# LeetCode 75 Blind Questions - Master Study Guide

This comprehensive guide covers all 75 essential LeetCode problems for coding interviews.

## Table of Contents

- [Arrays & Hashing](#01_arrays_hashing)
- [Strings & Two Pointers](#02_strings_two_pointers)
- [Matrix](#03_matrix)
- [Linked Lists](#04_linked_lists)
- [Trees](#05_trees)
- [Graphs](#06_graphs)
- [Dynamic Programming](#07_dynamic_programming)
- [Heaps & Priority Queues](#08_heaps)
- [Intervals](#09_intervals)
- [Bit Manipulation](#10_bit_manipulation)

---

## Arrays & Hashing {#01_arrays_hashing}

*Problems involving array manipulation, hash maps for O(1) lookups, and prefix/suffix computations.*

**When to Use:** Use hash maps when you need instant lookup. Use two pointers when array is sorted or you need to find pairs. Use prefix sums for range queries.

### Two Sum

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Hash Map

**The Insight:** Use hash map to instantly check for difference value, map will add index of last occurrence of a num, don’t use same element twice

**Full Approach:** use hash map to instantly check for difference value, map will add index of last occurrence of a num, don’t use same element twice;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/two-sum/)
- [NeetCode Video Solution](https://youtu.be/KLlXCFG5TnA)

---

### Best Time to Buy and Sell Stock

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Sliding Window

**The Insight:** Find local min and search for local max, sliding window

**Full Approach:** find local min and search for local max, sliding window;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- [NeetCode Video Solution](https://youtu.be/1pkOgXD63yU)

---

### Contains Duplicate

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Hash Set

**The Insight:** Hashset to get unique values in array, to check for duplicates easily

**Full Approach:** hashset to get unique values in array, to check for duplicates easily

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/contains-duplicate/)
- [NeetCode Video Solution](https://youtu.be/3OamzN90kPg)

---

### Product of Array Except Self

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)*

**Key Pattern:** Prefix/Suffix Products

**The Insight:** Make two passes, first in-order, second in-reverse, to compute products

**Full Approach:** make two passes, first in-order, second in-reverse, to compute products

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/product-of-array-except-self/)
- [NeetCode Video Solution](https://youtu.be/bNvIQI2wAjk)

---

### Maximum Subarray

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Dynamic Programming, Prefix Sum/Product

**The Insight:** Pattern: prev subarray cant be negative, dynamic programming: compute max sum for each prefix

**Full Approach:** pattern: prev subarray cant be negative, dynamic programming: compute max sum for each prefix

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/maximum-subarray/)
- [NeetCode Video Solution](https://youtu.be/5WZl3MMT0Eg)

---

### Maximum Product Subarray

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Dynamic Programming, Prefix Sum/Product

**The Insight:** Dp: compute max and max-abs-val for each prefix subarr

**Full Approach:** dp: compute max and max-abs-val for each prefix subarr;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/maximum-product-subarray/)
- [NeetCode Video Solution](https://youtu.be/lXVy6YWFcRM)

---

### Find Minimum in Rotated Sorted Array

**Difficulty:** Medium | **Time:** O(log n) | **Space:** O(1)

**Key Pattern:** Binary Search

**The Insight:** Check if half of array is sorted in order to find pivot, arr is guaranteed to be in at most two sorted subarrays

**Full Approach:** check if half of array is sorted in order to find pivot, arr is guaranteed to be in at most two sorted subarrays

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/)
- [NeetCode Video Solution](https://youtu.be/nIVW4P8b1VA)

---

### Search in Rotated Sorted Array

**Difficulty:** Medium | **Time:** O(log n) | **Space:** O(1)

**Key Pattern:** Binary Search

**The Insight:** At most two sorted halfs, mid will be apart of left sorted or right sorted, if target is in range of sorted portion then search it, otherwise search other half

**Full Approach:** at most two sorted halfs, mid will be apart of left sorted or right sorted, if target is in range of sorted portion then search it, otherwise search other half

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/search-in-rotated-sorted-array/)
- [NeetCode Video Solution](https://youtu.be/U8XENwh8Oy8)

---

### 3Sum

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(1)

**Key Pattern:** Two Pointers, Sorting

**The Insight:** Sort input, for each first element, find next two where -a = b+c, if a=prevA, skip a, if b=prevB skip b to elim duplicates

**Full Approach:** sort input, for each first element, find next two where -a = b+c, if a=prevA, skip a, if b=prevB skip b to elim duplicates; to find b,c use two pointers, left/right on remaining list;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/3sum/)
- [NeetCode Video Solution](https://youtu.be/jzZsG8n2R9A)

---

### Container With Most Water

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Two Pointers

**The Insight:** Shrinking window, left/right initially at endpoints, shift the pointer with min height

**Full Approach:** shrinking window, left/right initially at endpoints, shift the pointer with min height;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/container-with-most-water/)
- [NeetCode Video Solution](https://youtu.be/UuiTKBwPgAo)

---

## Strings & Two Pointers {#02_strings_two_pointers}

*String manipulation, palindromes, anagrams, and sliding window techniques.*

**When to Use:** Use sliding window for substring problems. Use two pointers for palindrome checks. Use hash maps for anagram detection.

### Longest Substring Without Repeating Characters

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(min(m,n))

**Key Pattern:** Sliding Window

**The Insight:** Sliding window, if we see same char twice within curr window, shift start position

**Full Approach:** sliding window, if we see same char twice within curr window, shift start position;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [NeetCode Video Solution](https://youtu.be/wiGpQwVHdE0)

---

### Longest Repeating Character Replacement

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(26)

**Key Pattern:** Sliding Window

**The Insight:** PAY ATTENTION: limited to chars A-Z

**Full Approach:** PAY ATTENTION: limited to chars A-Z; for each capital char, check if it could create the longest repeating substr, use sliding window to optimize; check if windowlen=1 works, if yes, increment len, if not, shift window right;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-repeating-character-replacement/)
- [NeetCode Video Solution](https://youtu.be/gqXU1UyA8pk)

---

### Minimum Window Substring

**Difficulty:** Hard | **Time:** O(n+m) | **Space:** O(m)

**Key Pattern:** Sliding Window

**The Insight:** Need is num of unique char in T, HAVE is num of char we have valid count for, sliding window, move right until valid, if valid, increment left until invalid, to check validity keep track if the count of each unique char is satisfied

**Full Approach:** need is num of unique char in T, HAVE is num of char we have valid count for, sliding window, move right until valid, if valid, increment left until invalid, to check validity keep track if the count of each unique char is satisfied;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/minimum-window-substring/)
- [NeetCode Video Solution](https://youtu.be/jSto0O4AJbM)

---

### Valid Anagram

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Hash Map

**The Insight:** Hashmap to count each char in str1, decrement for str2

**Full Approach:** hashmap to count each char in str1, decrement for str2;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/valid-anagram/)
- [NeetCode Video Solution](https://youtu.be/9UtInBqnCgA)

---

### Group Anagrams

**Difficulty:** Medium | **Time:** O(n*k) | **Space:** O(n*k)

**Key Pattern:** String

**The Insight:** For each of 26 chars, use count of each char in each word as tuple for key in dict, value is the list of anagrams

**Full Approach:** for each of 26 chars, use count of each char in each word as tuple for key in dict, value is the list of anagrams;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/group-anagrams/)
- [NeetCode Video Solution](https://youtu.be/vzdNOK2oB2E)

---

### Valid Parentheses

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Stack

**The Insight:** Push opening brace on stack, pop if matching close brace, at end if stack empty, return true

**Full Approach:** push opening brace on stack, pop if matching close brace, at end if stack empty, return true;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/valid-parentheses/)
- [NeetCode Video Solution](https://youtu.be/WTzjTskDFMg)

---

### Valid Palindrome

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Two Pointers

**The Insight:** Left, right pointers, update left and right until each points at alphanum, compare left and right, continue until left >= right, don’t distinguish between upper/lowercase

**Full Approach:** left, right pointers, update left and right until each points at alphanum, compare left and right, continue until left >= right, don’t distinguish between upper/lowercase;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/valid-palindrome/)
- [NeetCode Video Solution](https://youtu.be/jJXJ16kPFWg)

---

### Longest Palindromic Substring

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(1)

**Key Pattern:** String

**The Insight:** Foreach char in str, consider it were the middle, consider if pali was odd or even

**Full Approach:** foreach char in str, consider it were the middle, consider if pali was odd or even;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-palindromic-substring/)
- [NeetCode Video Solution](https://youtu.be/XYQecbcd6_c)

---

### Palindromic Substrings

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(1)

**Key Pattern:** String

**The Insight:** Same as longest palindromic string, each char in str as middle and expand outwards, do same for pali of even len

**Full Approach:** same as longest palindromic string, each char in str as middle and expand outwards, do same for pali of even len; maybe read up on manachers alg

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/palindromic-substrings/)
- [NeetCode Video Solution](https://youtu.be/4RACzI5-du8)

---

### Encode and Decode Strings (Leetcode Premium)

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** String

**The Insight:** Store length of str before each string and delimiter like '#'

**Full Approach:** store length of str before each string and delimiter like '#';

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/encode-and-decode-strings/)
- [NeetCode Video Solution](https://youtu.be/B1k_sxOSgv8)

---

## Matrix {#03_matrix}

*2D array traversal, rotation, and search problems.*

**When to Use:** Use layer-by-layer for rotation/spiral. Use DFS/BFS for path finding. Mark visited cells in-place when possible.

### Set Matrix Zeroes

**Difficulty:** Medium | **Time:** O(m*n) | **Space:** O(1)

**Key Pattern:** Matrix

**The Insight:** Use sets to keep track of all rows, cols to zero out, after, for each num if it is in a zero row or col then change it to 0

**Full Approach:** use sets to keep track of all rows, cols to zero out, after, for each num if it is in a zero row or col then change it to 0; flag first cell in row, and col to mark row/col that needs to be zeroed;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/set-matrix-zeroes/)
- [NeetCode Video Solution](https://youtu.be/T41rL0L3Pnw)

---

### Spiral Matrix

**Difficulty:** Medium | **Time:** O(m*n) | **Space:** O(1)

**Key Pattern:** Matrix

**The Insight:** Keep track of visited cells

**Full Approach:** keep track of visited cells; keep track of boundaries, layer-by-layer;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/spiral-matrix/)
- [NeetCode Video Solution](https://youtu.be/BJnMZNwUk1M)

---

### Rotate Image

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(1)

**Key Pattern:** Matrix

**The Insight:** Rotate layer-by-layer, use that it's a square as advantage, rotate positions in reverse order, store a in temp, a = b, b = c, c = d, d = temp

**Full Approach:** rotate layer-by-layer, use that it's a square as advantage, rotate positions in reverse order, store a in temp, a = b, b = c, c = d, d = temp;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/rotate-image/)
- [NeetCode Video Solution](https://youtu.be/fMSJSS7eO1w)

---

### Word Search

**Difficulty:** Medium | **Time:** O(m*n*4^L) | **Space:** O(L)

**Key Pattern:** DFS (Depth-First Search)

**The Insight:** Dfs on each cell, for each search remember visited cells, and remove cur visited cell right before you return from dfs

**Full Approach:** dfs on each cell, for each search remember visited cells, and remove cur visited cell right before you return from dfs;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/word-search/)
- [NeetCode Video Solution](https://youtu.be/pfiQ_PS1g8E)

---

## Linked Lists {#04_linked_lists}

*Pointer manipulation, cycle detection, merging, and reordering.*

**When to Use:** Use slow/fast pointers for cycle detection and finding middle. Use dummy nodes to simplify edge cases. Reverse in-place when needed.

### Reverse a Linked List

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Recursion

**The Insight:** Iterate through maintaining cur and prev

**Full Approach:** iterate through maintaining cur and prev; recursively reverse, return new head of list

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/reverse-linked-list/)
- [NeetCode Video Solution](https://youtu.be/G0_I-ZF0S38)

---

### Detect Cycle in a Linked List

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Two Pointers

**The Insight:** Dict to remember visited nodes

**Full Approach:** dict to remember visited nodes; two pointers at different speeds, if they meet there is loop

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/linked-list-cycle/)
- [NeetCode Video Solution](https://youtu.be/gBTe7lFR3vc)

---

### Merge Two Sorted Lists

**Difficulty:** Easy | **Time:** O(n+m) | **Space:** O(1)

**Key Pattern:** Linked List

**The Insight:** Insert each node from one list into the other

**Full Approach:** insert each node from one list into the other

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/merge-two-sorted-lists/)
- [NeetCode Video Solution](https://youtu.be/XIdigk956u0)

---

### Merge K Sorted Lists

**Difficulty:** Hard | **Time:** O(N log k) | **Space:** O(k)

**Key Pattern:** Heap/Priority Queue

**The Insight:** Divied and conquer, merge lists, N totalnodes, k-lists, O(N*logk). For each list, find min val, insert it into list, use priorityQ to optimize finding min O(N*logk)

**Full Approach:** divied and conquer, merge lists, N totalnodes, k-lists, O(N*logk). For each list, find min val, insert it into list, use priorityQ to optimize finding min O(N*logk)

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/merge-k-sorted-lists/)
- [NeetCode Video Solution](https://youtu.be/q5a5OiGbT6Q)

---

### Remove Nth Node From End Of List

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Two Pointers

**The Insight:** Use dummy node at head of list, compute len of list

**Full Approach:** use dummy node at head of list, compute len of list; two pointers, second has offset of n from first;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)
- [NeetCode Video Solution](https://youtu.be/XVuQxVej6y8)

---

### Reorder List

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Linked List

**The Insight:** Reverse second half of list, then easily reorder it

**Full Approach:** reverse second half of list, then easily reorder it; non-optimal way is to store list in array;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/reorder-list/)
- [NeetCode Video Solution](https://youtu.be/S5bfdUTrKLM)

---

## Trees {#05_trees}

*Binary trees, BSTs, traversals, and tree construction problems.*

**When to Use:** Use recursion for most tree problems. Use iterative BFS for level-order. Use in-order traversal for BST properties. Use post-order when you need children results first.

### Maximum Depth of Binary Tree

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(h)

**Key Pattern:** DFS (Depth-First Search), BFS (Breadth-First Search)

**The Insight:** Recursive dfs to find max-depth of subtrees

**Full Approach:** recursive dfs to find max-depth of subtrees; iterative bfs to count number of levels in tree

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- [NeetCode Video Solution](https://youtu.be/hTM3phVI6YQ)

---

### Same Tree

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(h)

**Key Pattern:** DFS (Depth-First Search), BFS (Breadth-First Search)

**The Insight:** Recursive dfs on both trees at the same time

**Full Approach:** recursive dfs on both trees at the same time; iterative bfs compare each level of both trees

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/same-tree/)
- [NeetCode Video Solution](https://youtu.be/vRbbcKXCxOw)

---

### Invert/Flip Binary Tree

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(h)

**Key Pattern:** DFS (Depth-First Search), BFS (Breadth-First Search)

**The Insight:** Recursive dfs to invert subtrees

**Full Approach:** recursive dfs to invert subtrees; bfs to invert levels, use collections.deque; iterative dfs is easy with stack if doing pre-order traversal

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/invert-binary-tree/)
- [NeetCode Video Solution](https://youtu.be/OnSn2XEQ4MY)

---

### Binary Tree Maximum Path Sum

**Difficulty:** Hard | **Time:** O(n) | **Space:** O(h)

**Key Pattern:** Tree

**The Insight:** Helper returns maxpathsum without splitting branches, inside helper we also update maxSum by computing maxpathsum WITH a split

**Full Approach:** helper returns maxpathsum without splitting branches, inside helper we also update maxSum by computing maxpathsum WITH a split;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/binary-tree-maximum-path-sum/)
- [NeetCode Video Solution](https://youtu.be/Hr5cWUld4vU)

---

### Binary Tree Level Order Traversal

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** BFS (Breadth-First Search)

**The Insight:** Iterative bfs, add prev level which doesn't have any nulls to the result

**Full Approach:** iterative bfs, add prev level which doesn't have any nulls to the result;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [NeetCode Video Solution](https://youtu.be/6ZnyEApgFYg)

---

### Serialize and Deserialize Binary Tree

**Difficulty:** Hard | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** BFS (Breadth-First Search), Queue

**The Insight:** Bfs every single non-null node is added to string, and it's children are added too, even if they're null, deserialize by adding each non-null node to queue, deque node, it's children are next two nodes in string

**Full Approach:** bfs every single non-null node is added to string, and it's children are added too, even if they're null, deserialize by adding each non-null node to queue, deque node, it's children are next two nodes in string;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
- [NeetCode Video Solution](https://youtu.be/u4JAi2JJhI8)

---

### Subtree of Another Tree

**Difficulty:** Easy | **Time:** O(m*n) | **Space:** O(h)

**Key Pattern:** Tree

**The Insight:** Traverse s to check if any subtree in s equals t

**Full Approach:** traverse s to check if any subtree in s equals t; merkle hashing?

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/subtree-of-another-tree/)
- [NeetCode Video Solution](https://youtu.be/E36O5SWp-LE)

---

### Construct Binary Tree from Preorder and Inorder Traversal

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Recursion

**The Insight:** First element in pre-order is root, elements left of root in in-order are left subtree, right of root are right subtree, recursively build subtrees

**Full Approach:** first element in pre-order is root, elements left of root in in-order are left subtree, right of root are right subtree, recursively build subtrees;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)
- [NeetCode Video Solution](https://youtu.be/ihj4IQGZ2zc)

---

### Validate Binary Search Tree

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(h)

**Key Pattern:** Tree

**The Insight:** Trick is use built in python min/max values float("inf"), "-inf", as parameters

**Full Approach:** trick is use built in python min/max values float("inf"), "-inf", as parameters; iterative in-order traversal, check each val is greater than prev;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/validate-binary-search-tree/)
- [NeetCode Video Solution](https://youtu.be/s6ATEkipzow)

---

### Kth Smallest Element in a BST

**Difficulty:** Medium | **Time:** O(h+k) | **Space:** O(h)

**Key Pattern:** DFS (Depth-First Search), Binary Search

**The Insight:** Non-optimal store tree in sorted array

**Full Approach:** non-optimal store tree in sorted array; iterative dfs in-order and return the kth element processed, go left until null, pop, go right once;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)
- [NeetCode Video Solution](https://youtu.be/5LUXSvjmGCw)

---

### Lowest Common Ancestor of BST

**Difficulty:** Medium | **Time:** O(h) | **Space:** O(1)

**Key Pattern:** Tree

**The Insight:** Compare p, q values to curr node, base case: one is in left, other in right subtree, then curr is lca

**Full Approach:** compare p, q values to curr node, base case: one is in left, other in right subtree, then curr is lca;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
- [NeetCode Video Solution](https://youtu.be/gs2LMfuOR9k)

---

### Implement Trie (Prefix Tree)

**Difficulty:** Medium | **Time:** O(m) | **Space:** O(m)

**Key Pattern:** Tree

**The Insight:** Node has children characters, and bool if its an ending character, node DOESN’T have or need char, since root node doesn’t have a char, only children

**Full Approach:** node has children characters, and bool if its an ending character, node DOESN’T have or need char, since root node doesn’t have a char, only children;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/implement-trie-prefix-tree/)
- [NeetCode Video Solution](https://youtu.be/oobqoCJlHA0)

---

### Add and Search Word

**Difficulty:** Medium | **Time:** O(m) | **Space:** O(1)

**Key Pattern:** Tree

**The Insight:** If char = "." run search for remaining portion of word on all of curr nodes children

**Full Approach:** if char = "." run search for remaining portion of word on all of curr nodes children;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/add-and-search-word-data-structure-design/)
- [NeetCode Video Solution](https://youtu.be/BTf05gs_8iU)

---

### Word Search II

**Difficulty:** Hard | **Time:** O(m*n*4^L) | **Space:** O(W*L)

**Key Pattern:** DFS (Depth-First Search), Trie

**The Insight:** Trick: I though use trie to store the grid, reverse thinking, instead store dictionary words, dfs on each cell, check if cell's char exists as child of root node in trie, if it does, update currNode, and check neighbors, a word could exist multiple times in grid, so don’t add duplicates

**Full Approach:** trick: I though use trie to store the grid, reverse thinking, instead store dictionary words, dfs on each cell, check if cell's char exists as child of root node in trie, if it does, update currNode, and check neighbors, a word could exist multiple times in grid, so don’t add duplicates;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/word-search-ii/)
- [NeetCode Video Solution](https://youtu.be/asbcE9mZz_U)

---

## Graphs {#06_graphs}

*Graph traversal, cycle detection, topological sort, and connected components.*

**When to Use:** Use DFS for path finding and cycle detection. Use BFS for shortest path (unweighted). Use Union-Find for connected components. Use topological sort for dependency ordering.

### Clone Graph

**Difficulty:** Medium | **Time:** O(V+E) | **Space:** O(V)

**Key Pattern:** Hash Map, DFS (Depth-First Search)

**The Insight:** Recursive dfs, hashmap for visited nodes

**Full Approach:** recursive dfs, hashmap for visited nodes

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/clone-graph/)
- [NeetCode Video Solution](https://youtu.be/mQeF6bN8hMk)

---

### Course Schedule

**Difficulty:** Medium | **Time:** O(V+E) | **Space:** O(V+E)

**Key Pattern:** DFS (Depth-First Search)

**The Insight:** Build adjacentcy_list with edges, run dfs on each V, if while dfs on V we see V again, then loop exists, otherwise V isnt in a loop, 3 states= not visited, visited, still visiting

**Full Approach:** build adjacentcy_list with edges, run dfs on each V, if while dfs on V we see V again, then loop exists, otherwise V isnt in a loop, 3 states= not visited, visited, still visiting

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/course-schedule/)
- [NeetCode Video Solution](https://youtu.be/EgI5nU9etnU)

---

### Pacific Atlantic Water Flow

**Difficulty:** Medium | **Time:** O(m*n) | **Space:** O(m*n)

**Key Pattern:** DFS (Depth-First Search)

**The Insight:** Dfs each cell, keep track of visited, and track which reach pac, atl

**Full Approach:** dfs each cell, keep track of visited, and track which reach pac, atl; dfs on cells adjacent to pac, atl, find overlap of cells that are visited by both pac and atl cells;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/pacific-atlantic-water-flow/)
- [NeetCode Video Solution](https://youtu.be/s-VkcjHqkGI)

---

### Number of Islands

**Difficulty:** Medium | **Time:** O(m*n) | **Space:** O(m*n)

**Key Pattern:** DFS (Depth-First Search)

**The Insight:** Foreach cell, if cell is 1 and unvisited run dfs, increment cound and marking each contigous 1 as visited

**Full Approach:** foreach cell, if cell is 1 and unvisited run dfs, increment cound and marking each contigous 1 as visited

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/number-of-islands/)
- [NeetCode Video Solution](https://youtu.be/pV2kpPD66nE)

---

### Longest Consecutive Sequence

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Hash Set

**The Insight:** Use bruteforce and try to optimize, consider the max subseq containing each num

**Full Approach:** use bruteforce and try to optimize, consider the max subseq containing each num; add each num to hashset, for each num if num-1 doesn’t exist, count the consecutive nums after num, ie num+1; there is also a union-find solution;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-consecutive-sequence/)
- [NeetCode Video Solution](https://youtu.be/P6RZZMu_maU)

---

### Alien Dictionary (Leetcode Premium)

**Difficulty:** Hard | **Time:** O(C) | **Space:** O(1)

**Key Pattern:** Topological Sort

**The Insight:** Chars of a word not in order, the words are in order, find adjacency list of each unique char by iterating through adjacent words and finding first chars that are different, run topsort on graph and do loop detection

**Full Approach:** chars of a word not in order, the words are in order, find adjacency list of each unique char by iterating through adjacent words and finding first chars that are different, run topsort on graph and do loop detection;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/alien-dictionary/)
- [NeetCode Video Solution](https://youtu.be/6kTZYvNNyps)

---

### Graph Valid Tree (Leetcode Premium)

**Difficulty:** Medium | **Time:** O(V+E) | **Space:** O(V)

**Key Pattern:** DFS (Depth-First Search), Union-Find

**The Insight:** Union find, if union return false, loop exists, at end size must equal n, or its not connected

**Full Approach:** union find, if union return false, loop exists, at end size must equal n, or its not connected; dfs to get size and check for loop, since each edge is double, before dfs on neighbor of N, remove N from neighbor list of neighbor;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/graph-valid-tree/)
- [NeetCode Video Solution](https://youtu.be/bXsUuownnoQ)

---

### Number of Connected Components in an Undirected Graph (Leetcode Premium)

**Difficulty:** Medium | **Time:** O(V+E) | **Space:** O(V)

**Key Pattern:** DFS (Depth-First Search), BFS (Breadth-First Search)

**The Insight:** Dfs on each node that hasn’t been visited, increment component count, adjacency list

**Full Approach:** dfs on each node that hasn’t been visited, increment component count, adjacency list; bfs and union find are possible;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)
- [NeetCode Video Solution](https://youtu.be/8f1XPm4WOUc)

---

## Dynamic Programming {#07_dynamic_programming}

*Optimization problems with overlapping subproblems and optimal substructure.*

**When to Use:** Use DP when problem has optimal substructure and overlapping subproblems. Start with recursion + memoization, then optimize to iterative if needed.

### Climbing Stairs

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Dynamic Programming with Memoization

**The Insight:** To reach step n, compute ways(n-1) + ways(n-2) with memoization to cache results

**Full Approach:** Use recursion with memoization: base cases are 1 step = 1 way, 2 steps = 2 ways. For any step i, check if already cached in memo, otherwise compute dp(i-1) + dp(i-2), store in memo, and return;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/climbing-stairs/)
- [NeetCode Video Solution](https://youtu.be/Y0lT9Fck7qI)

---

### Coin Change

**Difficulty:** Medium | **Time:** O(n*m) | **Space:** O(n)

**Key Pattern:** DFS (Depth-First Search), Recursion

**The Insight:** Top-down: recursive dfs, for amount, branch for each coin, cache to store prev coin_count for each amount

**Full Approach:** top-down: recursive dfs, for amount, branch for each coin, cache to store prev coin_count for each amount; bottom-up: compute coins for amount = 1, up until n, using for each coin (amount - coin), cache prev values

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/coin-change/)
- [NeetCode Video Solution](https://youtu.be/H9bfqozjoqs)

---

### Longest Increasing Subsequence

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(n)

**Key Pattern:** Dynamic Programming, Recursion

**The Insight:** Recursive: foreach num, get subseq with num and without num, only include num if prev was less, cache solution of each

**Full Approach:** recursive: foreach num, get subseq with num and without num, only include num if prev was less, cache solution of each; dp=subseq length which must end with each num, curr num must be after a prev dp or by itself;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-increasing-subsequence/)
- [NeetCode Video Solution](https://youtu.be/cjWnW0hdF1Y)

---

### Longest Common Subsequence

**Difficulty:** Medium | **Time:** O(m*n) | **Space:** O(m*n)

**Key Pattern:** Recursion, Memoization

**The Insight:** Recursive: if first chars are equal find lcs of remaining of each, else max of: lcs of first and remain of 2nd and lcs of 2nd remain of first, cache result

**Full Approach:** recursive: if first chars are equal find lcs of remaining of each, else max of: lcs of first and remain of 2nd and lcs of 2nd remain of first, cache result; nested forloop to compute the cache without recursion;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-common-subsequence/)
- [NeetCode Video Solution](https://youtu.be/Ua0GhsJSlWM)

---

### Word Break Problem

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(n)

**Key Pattern:** Prefix Sum/Product, Memoization

**The Insight:** For each prefix, if prefix is in dict and wordbreak(remaining str)=True, then return True, cache result of wordbreak

**Full Approach:** for each prefix, if prefix is in dict and wordbreak(remaining str)=True, then return True, cache result of wordbreak;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/word-break/)
- [NeetCode Video Solution](https://youtu.be/Sx9NNgInc3A)

---

### Combination Sum

**Difficulty:** Medium | **Time:** O(2^n) | **Space:** O(n)

**Key Pattern:** Dynamic Programming

**The Insight:** Visualize the decision tree, base case is curSum = or > target, each candidate can have children of itself or elements to right of it inorder to elim duplicate solutions

**Full Approach:** visualize the decision tree, base case is curSum = or > target, each candidate can have children of itself or elements to right of it inorder to elim duplicate solutions;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/combination-sum/)
- [NeetCode Video Solution](https://youtu.be/GBKI9VSKdGg)

---

### House Robber

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Dynamic Programming

**The Insight:** For each num, get max of prev subarr, or num + prev subarr not including last element, store results of prev, and prev not including last element

**Full Approach:** for each num, get max of prev subarr, or num + prev subarr not including last element, store results of prev, and prev not including last element

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/house-robber/)
- [NeetCode Video Solution](https://youtu.be/73r3KWiEvyk)

---

### House Robber II

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Dynamic Programming

**The Insight:** Subarr = arr without first & last, get max of subarr, then pick which of first/last should be added to it

**Full Approach:** subarr = arr without first & last, get max of subarr, then pick which of first/last should be added to it

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/house-robber-ii/)
- [NeetCode Video Solution](https://youtu.be/rWAJCfYYOvM)

---

### Decode Ways

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Dynamic Programming, Recursion

**The Insight:** Can cur char be decoded in one or two ways? Recursion -> cache -> iterative dp solution, a lot of edge cases to determine, 52, 31, 29, 10, 20 only decoded one way, 11, 26 decoded two ways

**Full Approach:** can cur char be decoded in one or two ways? Recursion -> cache -> iterative dp solution, a lot of edge cases to determine, 52, 31, 29, 10, 20 only decoded one way, 11, 26 decoded two ways

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/decode-ways/)
- [NeetCode Video Solution](https://youtu.be/6aEyTjOwlJU)

---

### Unique Paths

**Difficulty:** Medium | **Time:** O(m*n) | **Space:** O(n)

**Key Pattern:** Dynamic Programming

**The Insight:** Work backwards from solution, store paths for each position in grid, to further optimize, we don’t store whole grid, only need to store prev row

**Full Approach:** work backwards from solution, store paths for each position in grid, to further optimize, we don’t store whole grid, only need to store prev row;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/unique-paths/)
- [NeetCode Video Solution](https://youtu.be/IlEsdxuD4lY)

---

### Jump Game

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Recursion, Memoization

**The Insight:** Visualize the recursive tree, cache solution for O(n) time/mem complexity, iterative is O(1) mem, just iterate backwards to see if element can reach goal node, if yes, then set it equal to goal node, continue

**Full Approach:** visualize the recursive tree, cache solution for O(n) time/mem complexity, iterative is O(1) mem, just iterate backwards to see if element can reach goal node, if yes, then set it equal to goal node, continue;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/jump-game/)
- [NeetCode Video Solution](https://youtu.be/Yan0cv2cLy8)

---

## Heaps & Priority Queues {#08_heaps}

*Problems requiring efficient min/max operations, k-th element finding, and streaming data.*

**When to Use:** Use min-heap for k largest elements. Use max-heap for k smallest. Use two heaps for median finding.

### Top K Frequent Elements

**Difficulty:** Medium | **Time:** O(n log k) | **Space:** O(n)

**Key Pattern:** Heap/Priority Queue

**The Insight:** Minheap that’s kept at size k, if its bigger than k pop the min, by the end it should be left with k largest

**Full Approach:** minheap that’s kept at size k, if its bigger than k pop the min, by the end it should be left with k largest;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/top-k-frequent-elements/)
- [NeetCode Video Solution](https://youtu.be/YPTqKIgVk-k)

---

### Find Median from Data Stream

**Difficulty:** Hard | **Time:** O(log n) | **Space:** O(n)

**Key Pattern:** Heap/Priority Queue

**The Insight:** Maintain curr median, and all num greater than med in a minHeap, and all num less than med in a maxHeap, after every insertion update median depending on odd/even num of elements

**Full Approach:** maintain curr median, and all num greater than med in a minHeap, and all num less than med in a maxHeap, after every insertion update median depending on odd/even num of elements;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/find-median-from-data-stream/)
- [NeetCode Video Solution](https://youtu.be/itmhHWaHupI)

---

## Intervals {#09_intervals}

*Interval merging, insertion, and overlap detection problems.*

**When to Use:** Always sort intervals first (usually by start time). Merge overlapping intervals greedily. Use min-heap for meeting rooms.

### Insert Interval

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Interval

**The Insight:** Insert new interval in order, then merge intervals

**Full Approach:** insert new interval in order, then merge intervals; newinterval could only merge with one interval that comes before it, then add remaining intervals;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/insert-interval/)
- [NeetCode Video Solution](https://youtu.be/A8NUOmlwOlM)

---

### Merge Intervals

**Difficulty:** Medium | **Time:** O(n log n) | **Space:** O(n)

**Key Pattern:** Interval

**The Insight:** Sort each interval, overlapping intervals should be adjacent, iterate and build solution

**Full Approach:** sort each interval, overlapping intervals should be adjacent, iterate and build solution; also graph method, less efficient, more complicated

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/merge-intervals/)
- [NeetCode Video Solution](https://youtu.be/44H3cEC2fFM)

---

### Non-overlapping Intervals

**Difficulty:** Medium | **Time:** O(n log n) | **Space:** O(1)

**Key Pattern:** Dynamic Programming

**The Insight:** Instead of removing, count how max num of intervals you can include, sort intervals, dp to compute max intervals up until the i-th interval

**Full Approach:** instead of removing, count how max num of intervals you can include, sort intervals, dp to compute max intervals up until the i-th interval;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/non-overlapping-intervals/)
- [NeetCode Video Solution](https://youtu.be/nONCGxWoUfM)

---

### Meeting Rooms (Leetcode Premium)

**Difficulty:** Easy | **Time:** O(n log n) | **Space:** O(1)

**Key Pattern:** Interval

**The Insight:** Sort intervals by start time, if second interval doesn’t overlap with first, then third def wont overlap with first

**Full Approach:** sort intervals by start time, if second interval doesn’t overlap with first, then third def wont overlap with first;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/meeting-rooms/)
- [NeetCode Video Solution](https://youtu.be/PaJxqZVPhbg)

---

### Meeting Rooms II (Leetcode Premium)

**Difficulty:** Medium | **Time:** O(n log n) | **Space:** O(n)

**Key Pattern:** Heap/Priority Queue

**The Insight:** We care about the points in time where we are starting/ending a meeting, we already are given those, just separate start/end and traverse counting num of meetings going at these points in time

**Full Approach:** we care about the points in time where we are starting/ending a meeting, we already are given those, just separate start/end and traverse counting num of meetings going at these points in time; for each meeting check if a prev meeting has finished before curr started, using min heap;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/meeting-rooms-ii/)
- [NeetCode Video Solution](https://youtu.be/FdzJmTCVyJU)

---

## Bit Manipulation {#10_bit_manipulation}

*Binary operations, bit counting, and XOR tricks.*

**When to Use:** Use XOR to find missing/duplicate numbers. Use bit shifts for division/multiplication by 2. Use n & (n-1) to clear lowest set bit.

### Sum of Two Integers

**Difficulty:** Medium | **Time:** O(1) | **Space:** O(1)

**Key Pattern:** Binary

**The Insight:** Add bit by bit, be mindful of carry, after adding, if carry is still 1, then add it as well

**Full Approach:** add bit by bit, be mindful of carry, after adding, if carry is still 1, then add it as well;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/sum-of-two-integers/)
- [NeetCode Video Solution](https://youtu.be/gVUrDV4tZfY)

---

### Number of 1 Bits

**Difficulty:** Easy | **Time:** O(1) | **Space:** O(1)

**Key Pattern:** Bit Manipulation

**The Insight:** Modulo, and dividing n

**Full Approach:** modulo, and dividing n; mod and div are expensive, to divide use bit shift, instead of mod to get 1's place use bitwise & 1;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/number-of-1-bits/)
- [NeetCode Video Solution](https://youtu.be/5Km3utixwZs)

---

### Counting Bits

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Binary

**The Insight:** Write out result for num=16 to figure out pattern

**Full Approach:** write out result for num=16 to figure out pattern; res[i] = res[i - offset], where offset is the biggest power of 2 <= I;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/counting-bits/)
- [NeetCode Video Solution](https://youtu.be/RyBM56RIWrM)

---

### Missing Number

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** XOR/Bit Manipulation

**The Insight:** Compute expected sum - real sum

**Full Approach:** compute expected sum - real sum; xor n with each index and value;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/missing-number/)
- [NeetCode Video Solution](https://youtu.be/WnPLSRLSANE)

---

### Reverse Bits

**Difficulty:** Easy | **Time:** O(1) | **Space:** O(1)

**Key Pattern:** Binary

**The Insight:** Reverse each of 32 bits

**Full Approach:** reverse each of 32 bits;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/reverse-bits/)
- [NeetCode Video Solution](https://youtu.be/UcoN6UjAI64)

---

## Master Quiz - Test Your Knowledge

### Quick Fire Questions

1. What data structure solves Two Sum in O(n)?
2. How do you detect a cycle in a linked list with O(1) space?
3. What's the key insight for the Maximum Subarray problem?
4. When should you use DFS vs BFS for graph problems?
5. How do you find the middle of a linked list in one pass?
6. What's the pattern for interval merging problems?
7. How does XOR help find a missing number?
8. What are the two approaches for House Robber?
9. When do you use a Trie?
10. What's the sliding window pattern for substring problems?

### Category Matching

Match each problem to its primary technique:

| Problem | Technique |
|---------|----------|
| Two Sum | Hash Map |
| Longest Substring Without Repeating | Sliding Window |
| Number of Islands | DFS/BFS |
| Coin Change | Dynamic Programming |
| Merge K Sorted Lists | Heap/Divide & Conquer |
