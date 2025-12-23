# Graphs

## Category Overview

Graph traversal, cycle detection, topological sort, and connected components.

**When to Use:** Use DFS for path finding and cycle detection. Use BFS for shortest path (unweighted). Use Union-Find for connected components. Use topological sort for dependency ordering.

**Typical Complexity:** Usually O(V + E) time where V is vertices and E is edges.

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Clone Graph**: What is the key technique and its time complexity?
1. **Course Schedule**: What is the key technique and its time complexity?
1. **Pacific Atlantic Water Flow**: What is the key technique and its time complexity?
1. **Number of Islands**: What is the key technique and its time complexity?
1. **Longest Consecutive Sequence**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- How do you detect cycles in directed vs. undirected graphs?
- When do you use Union-Find vs. DFS?
- What problems require topological sort?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Clone Graph | Hash Map, DFS (Depth-First Search) | O(V+E) | O(V) |
| Course Schedule | DFS (Depth-First Search) | O(V+E) | O(V+E) |
| Pacific Atlantic Water Flow | DFS (Depth-First Search) | O(m*n) | O(m*n) |
| Number of Islands | DFS (Depth-First Search) | O(m*n) | O(m*n) |
| Longest Consecutive Sequence | Hash Set | O(n) | O(n) |
| Alien Dictionary (Leetcode Premium) | Topological Sort | O(C) | O(1) |
| Graph Valid Tree (Leetcode Premium) | DFS (Depth-First Search), Union-Find | O(V+E) | O(V) |
| Number of Connected Components in an Undirected Graph (Leetcode Premium) | DFS (Depth-First Search), BFS (Breadth-First Search) | O(V+E) | O(V) |
