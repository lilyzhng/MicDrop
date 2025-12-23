# Linked Lists

## Category Overview

Pointer manipulation, cycle detection, merging, and reordering.

**When to Use:** Use slow/fast pointers for cycle detection and finding middle. Use dummy nodes to simplify edge cases. Reverse in-place when needed.

**Typical Complexity:** Usually O(n) time with O(1) space for in-place operations.

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Reverse a Linked List**: What is the key technique and its time complexity?
1. **Detect Cycle in a Linked List**: What is the key technique and its time complexity?
1. **Merge Two Sorted Lists**: What is the key technique and its time complexity?
1. **Merge K Sorted Lists**: What is the key technique and its time complexity?
1. **Remove Nth Node From End Of List**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- When do you use slow/fast pointers?
- Why use a dummy node at the head?
- How do you reverse a linked list in-place?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Reverse a Linked List | Recursion | O(n) | O(1) |
| Detect Cycle in a Linked List | Two Pointers | O(n) | O(1) |
| Merge Two Sorted Lists | Linked List | O(n+m) | O(1) |
| Merge K Sorted Lists | Heap/Priority Queue | O(N log k) | O(k) |
| Remove Nth Node From End Of List | Two Pointers | O(n) | O(1) |
| Reorder List | Linked List | O(n) | O(1) |
