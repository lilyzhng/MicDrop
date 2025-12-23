# Matrix

## Category Overview

2D array traversal, rotation, and search problems.

**When to Use:** Use layer-by-layer for rotation/spiral. Use DFS/BFS for path finding. Mark visited cells in-place when possible.

**Typical Complexity:** Usually O(m*n) time where m and n are matrix dimensions.

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Set Matrix Zeroes**: What is the key technique and its time complexity?
1. **Spiral Matrix**: What is the key technique and its time complexity?
1. **Rotate Image**: What is the key technique and its time complexity?
1. **Word Search**: What is the key technique and its time complexity?

### Pattern Recognition Questions



## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Set Matrix Zeroes | Matrix | O(m*n) | O(1) |
| Spiral Matrix | Matrix | O(m*n) | O(1) |
| Rotate Image | Matrix | O(n²) | O(1) |
| Word Search | DFS (Depth-First Search) | O(m*n*4^L) | O(L) |
