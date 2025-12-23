# Arrays & Hashing

## Category Overview

Problems involving array manipulation, hash maps for O(1) lookups, and prefix/suffix computations.

**When to Use:** Use hash maps when you need instant lookup. Use two pointers when array is sorted or you need to find pairs. Use prefix sums for range queries.

**Typical Complexity:** Usually O(n) time with O(n) space for hash-based solutions, O(1) space for two-pointer solutions.

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Two Sum**: What is the key technique and its time complexity?
1. **Best Time to Buy and Sell Stock**: What is the key technique and its time complexity?
1. **Contains Duplicate**: What is the key technique and its time complexity?
1. **Product of Array Except Self**: What is the key technique and its time complexity?
1. **Maximum Subarray**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- When should you use a hash map vs. two pointers?
- How do you handle duplicates in array problems?
- What's the difference between prefix sum and sliding window approaches?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Two Sum | Hash Map | O(n) | O(n) |
| Best Time to Buy and Sell Stock | Sliding Window | O(n) | O(1) |
| Contains Duplicate | Hash Set | O(n) | O(n) |
| Product of Array Except Self | Prefix/Suffix Products | O(n) | O(1)* |
| Maximum Subarray | Dynamic Programming, Prefix Sum/Product | O(n) | O(1) |
| Maximum Product Subarray | Dynamic Programming, Prefix Sum/Product | O(n) | O(1) |
| Find Minimum in Rotated Sorted Array | Binary Search | O(log n) | O(1) |
| Search in Rotated Sorted Array | Binary Search | O(log n) | O(1) |
| 3Sum | Two Pointers, Sorting | O(n²) | O(1) |
| Container With Most Water | Two Pointers | O(n) | O(1) |
