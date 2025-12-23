# Heaps & Priority Queues

## Category Overview

Problems requiring efficient min/max operations, k-th element finding, and streaming data.

**When to Use:** Use min-heap for k largest elements. Use max-heap for k smallest. Use two heaps for median finding.

**Typical Complexity:** O(log k) per operation where k is heap size. Building heap is O(n).

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Top K Frequent Elements**: What is the key technique and its time complexity?
1. **Find Median from Data Stream**: What is the key technique and its time complexity?

### Pattern Recognition Questions



## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Top K Frequent Elements | Heap/Priority Queue | O(n log k) | O(n) |
| Find Median from Data Stream | Heap/Priority Queue | O(log n) | O(n) |
