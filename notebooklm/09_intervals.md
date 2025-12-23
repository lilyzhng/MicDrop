# Intervals

## Category Overview

Interval merging, insertion, and overlap detection problems.

**When to Use:** Always sort intervals first (usually by start time). Merge overlapping intervals greedily. Use min-heap for meeting rooms.

**Typical Complexity:** Usually O(n log n) due to sorting, then O(n) for processing.

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Insert Interval**: What is the key technique and its time complexity?
1. **Merge Intervals**: What is the key technique and its time complexity?
1. **Non-overlapping Intervals**: What is the key technique and its time complexity?
1. **Meeting Rooms (Leetcode Premium)**: What is the key technique and its time complexity?
1. **Meeting Rooms II (Leetcode Premium)**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- Why do you always sort intervals first?
- How do you merge overlapping intervals?
- When do you need a min-heap for interval problems?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Insert Interval | Interval | O(n) | O(n) |
| Merge Intervals | Interval | O(n log n) | O(n) |
| Non-overlapping Intervals | Dynamic Programming | O(n log n) | O(1) |
| Meeting Rooms (Leetcode Premium) | Interval | O(n log n) | O(1) |
| Meeting Rooms II (Leetcode Premium) | Heap/Priority Queue | O(n log n) | O(n) |
