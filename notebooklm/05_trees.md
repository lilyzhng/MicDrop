# Trees

## Category Overview

Binary trees, BSTs, traversals, and tree construction problems.

**When to Use:** Use recursion for most tree problems. Use iterative BFS for level-order. Use in-order traversal for BST properties. Use post-order when you need children results first.

**Typical Complexity:** Usually O(n) time and O(h) space where h is tree height (O(log n) balanced, O(n) skewed).

---

## Problems

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

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Maximum Depth of Binary Tree**: What is the key technique and its time complexity?
1. **Same Tree**: What is the key technique and its time complexity?
1. **Invert/Flip Binary Tree**: What is the key technique and its time complexity?
1. **Binary Tree Maximum Path Sum**: What is the key technique and its time complexity?
1. **Binary Tree Level Order Traversal**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- When do you use DFS vs. BFS for trees?
- How does in-order traversal help with BST problems?
- What's the pattern for tree path sum problems?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Maximum Depth of Binary Tree | DFS (Depth-First Search), BFS (Breadth-First Search) | O(n) | O(h) |
| Same Tree | DFS (Depth-First Search), BFS (Breadth-First Search) | O(n) | O(h) |
| Invert/Flip Binary Tree | DFS (Depth-First Search), BFS (Breadth-First Search) | O(n) | O(h) |
| Binary Tree Maximum Path Sum | Tree | O(n) | O(h) |
| Binary Tree Level Order Traversal | BFS (Breadth-First Search) | O(n) | O(n) |
| Serialize and Deserialize Binary Tree | BFS (Breadth-First Search), Queue | O(n) | O(n) |
| Subtree of Another Tree | Tree | O(m*n) | O(h) |
| Construct Binary Tree from Preorder and Inorder Traversal | Recursion | O(n) | O(n) |
| Validate Binary Search Tree | Tree | O(n) | O(h) |
| Kth Smallest Element in a BST | DFS (Depth-First Search), Binary Search | O(h+k) | O(h) |
| Lowest Common Ancestor of BST | Tree | O(h) | O(1) |
| Implement Trie (Prefix Tree) | Tree | O(m) | O(m) |
| Add and Search Word | Tree | O(m) | O(1) |
| Word Search II | DFS (Depth-First Search), Trie | O(m*n*4^L) | O(W*L) |
