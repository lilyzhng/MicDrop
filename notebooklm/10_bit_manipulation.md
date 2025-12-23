# Bit Manipulation

## Category Overview

Binary operations, bit counting, and XOR tricks.

**When to Use:** Use XOR to find missing/duplicate numbers. Use bit shifts for division/multiplication by 2. Use n & (n-1) to clear lowest set bit.

**Typical Complexity:** Usually O(1) or O(log n) time with O(1) space.

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Sum of Two Integers**: What is the key technique and its time complexity?
1. **Number of 1 Bits**: What is the key technique and its time complexity?
1. **Counting Bits**: What is the key technique and its time complexity?
1. **Missing Number**: What is the key technique and its time complexity?
1. **Reverse Bits**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- How does XOR help find missing/duplicate numbers?
- What does n & (n-1) do?
- How do you count set bits efficiently?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Sum of Two Integers | Binary | O(1) | O(1) |
| Number of 1 Bits | Bit Manipulation | O(1) | O(1) |
| Counting Bits | Binary | O(n) | O(n) |
| Missing Number | XOR/Bit Manipulation | O(n) | O(1) |
| Reverse Bits | Binary | O(1) | O(1) |
