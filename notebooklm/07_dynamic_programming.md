# Dynamic Programming

## Category Overview

Optimization problems with overlapping subproblems and optimal substructure.

**When to Use:** Use DP when problem has optimal substructure and overlapping subproblems. Start with recursion + memoization, then optimize to iterative if needed.

**Typical Complexity:** Time varies by problem. Space can often be optimized from O(n^2) to O(n) or O(1).

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Climbing Stairs**: What is the key technique and its time complexity?
1. **Coin Change**: What is the key technique and its time complexity?
1. **Longest Increasing Subsequence**: What is the key technique and its time complexity?
1. **Longest Common Subsequence**: What is the key technique and its time complexity?
1. **Word Break Problem**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- How do you identify if a problem needs DP?
- What's the difference between top-down and bottom-up DP?
- How do you optimize DP space complexity?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Climbing Stairs | DP with Memoization | O(n) | O(n) |
| Coin Change | DFS (Depth-First Search), Recursion | O(n*m) | O(n) |
| Longest Increasing Subsequence | Dynamic Programming, Recursion | O(n²) | O(n) |
| Longest Common Subsequence | Recursion, Memoization | O(m*n) | O(m*n) |
| Word Break Problem | Prefix Sum/Product, Memoization | O(n²) | O(n) |
| Combination Sum | Dynamic Programming | O(2^n) | O(n) |
| House Robber | Dynamic Programming | O(n) | O(1) |
| House Robber II | Dynamic Programming | O(n) | O(1) |
| Decode Ways | Dynamic Programming, Recursion | O(n) | O(1) |
| Unique Paths | Dynamic Programming | O(m*n) | O(n) |
| Jump Game | Recursion, Memoization | O(n) | O(1) |
