# Visual Mnemonic Prompts for LeetCode Problems

Each prompt is grounded in the **actual algorithm mechanism** from the detailed hints, with a single **punchline** to anchor the memory.

## How to Use

1. Copy a prompt below
2. Paste into Gemini or ChatGPT image generation
3. The image should visually represent HOW the algorithm works
4. The punchline helps you recall the key insight when you see the image

---

## Prompts

### 1. Two Sum

**Mechanism:** Iterate through array. For each number, ask "Does my complement exist in what I've already seen?" Use hash map for O(1) lookup.

**Punchline:** "Have I seen my other half before?"

```
Create a visual mnemonic for Two Sum (Hash Map Complement Search).

The mechanism: A person walks through a line of numbered boxes, one by one. 
At each box, they flip open a small notebook labeled "SEEN" and quickly check 
if the number they need is written there. If not, they jot down the current 
number and move on. One moment shows them finding a match - eyes lighting up, 
finger pointing at the notebook.

Style: Clean, diagrammatic illustration with soft colors. Show the sequential 
left-to-right motion. The notebook should be prominent. Minimal text, 
numbers only where needed.
```

---

### 11. Container With Most Water

**Mechanism:** Start with widest container (pointers at both ends). Always move the pointer at the SHORTER wall inward - because the water level is capped by the shorter wall. Moving the taller wall can only shrink width without any chance of increasing height. Moving the shorter wall might find a taller replacement.

**Punchline:** "Short wall caps the water - only it can unlock more height."

```
Create a visual mnemonic for Container With Most Water (Two Pointer Greedy).

The mechanism: Two walls of different heights with water between them. 
A dotted horizontal line shows the water level is CAPPED at the height 
of the shorter wall - water can't rise above it. An arrow points at the 
short wall with the insight: "Moving me might find a taller wall." 
The tall wall has a thought bubble: "Moving me is pointless - the water 
is already capped below my height."

Style: Clean diagram. The KEY visual is showing WHY the short wall is 
the bottleneck - the water line is limited by it. The tall wall's extra 
height is "wasted" - visually grayed out above the water line.
```

---

### 15. 3Sum

**Mechanism:** Sort first. Then for each number, use two pointers on the remaining elements to find pairs that sum to the negative of that number. Sorting enables the two-pointer dance.

**Punchline:** "Sort, fix one, two-pointer the rest."

```
Create a visual mnemonic for 3Sum (Sort + Two Pointers).

The mechanism: A sorted row of numbered cards. One card in the front is 
"pinned" or highlighted (the fixed element). Behind it, two hands point 
at the leftmost and rightmost remaining cards, with arrows suggesting 
they'll move toward each other. The pinned card "anchors" while the 
other two search.

Style: Clean, diagram-like. Show the sorted order clearly. Emphasize: 
one fixed, two moving inward. Numbers visible but not overwhelming.
```

---

### 70. Climbing Stairs

**Mechanism:** To reach step N, you either came from step N-1 (one step) or N-2 (two steps). So ways(N) = ways(N-1) + ways(N-2). It's Fibonacci!

**Punchline:** "Step N = Step N-1 + Step N-2. It's Fibonacci."

```
Create a visual mnemonic for Climbing Stairs (Fibonacci Dynamic Programming).

The mechanism: A staircase where each step has a number on it. Step 1 shows "1", 
step 2 shows "2", step 3 shows "3" (which equals 1+2). Arrows flow from steps 
N-1 and N-2 into step N, showing how the count combines. A small Fibonacci 
spiral subtly overlays or sits beside the stairs.

Style: Clean educational diagram. The key visual is the "combining arrows" 
showing how each step's count comes from the two before it. 
The Fibonacci connection should click.
```

---

### 121. Best Time to Buy and Sell Stock

**Mechanism:** Track the minimum price BEFORE today. At each day, profit = today's price - min so far. You're always looking backwards for the best buy point.

**Punchline:** "Track min so far, maximize today - min."

```
Create a visual mnemonic for Best Time to Buy and Sell Stock (Track Minimum).

The mechanism: A stock chart line graph. A "flag" or "pin" is planted 
at the lowest point seen so far. A person stands at the current (higher) 
point, looking back at the flag, measuring the distance between them 
(the profit). The flag represents "min price so far."

Style: Clean line graph illustration. The flag at the minimum is key. 
Show the "looking backward" concept - you can only buy in the past. 
The measuring of the gap between flag and current position = profit.
```

---

### 125. Valid Palindrome

**Mechanism:** Two pointers start at opposite ends. Skip non-alphanumeric characters. Compare and move inward. If they meet without mismatches, it's a palindrome.

**Punchline:** "Two pointers, meet in the middle."

```
Create a visual mnemonic for Valid Palindrome (Two Pointers from Ends).

The mechanism: A word stretched horizontally. Two pointers (could be 
fingers, arrows, or cursors) start at the leftmost and rightmost letters. 
They each take a step inward, comparing the letters. Some garbage characters 
between them are "skipped over." The pointers converge toward the center.

Style: Clean diagram. Show the simultaneous inward movement. 
The comparison at each step. The meeting point in the middle represents success.
```

---

### 141. Linked List Cycle

**Mechanism:** Two pointers - slow (1 step) and fast (2 steps). If there's a cycle, fast will lap slow and they'll collide. If no cycle, fast hits null.

**Punchline:** "Fast laps slow if there's a loop."

```
Create a visual mnemonic for Linked List Cycle Detection (Floyd's Tortoise and Hare).

The mechanism: A chain of connected nodes. Two runners on the chain - 
one taking big strides (fast), one taking small strides (slow). 
The chain curves into a loop. The fast runner has gone around and is 
approaching the slow runner from behind - about to "lap" them. 
The collision point is highlighted.

Style: Show the chain/node structure clearly. The loop is visible. 
The key moment: fast catching up to slow from behind. 
The insight: if they meet, there's a cycle.
```

---

### 200. Number of Islands

**Mechanism:** Scan the grid. When you find a '1' (land), increment count and "sink" the entire island by marking all connected land as visited. Each new land cell you discover starts a new island count.

**Punchline:** "Find land, sink the island, count starts."

```
Create a visual mnemonic for Number of Islands (DFS Flood Fill).

The mechanism: A grid/map view with several islands. One island is being 
"flooded" or "painted" - the color spreads from the starting cell to 
all connected land cells, sinking them. A counter shows "1" for this 
island. Another untouched island waits to be discovered and will 
increment the counter to "2".

Style: Top-down map view. Show the "spreading" flood-fill from one 
cell to connected cells. The counter incrementing each time a NEW 
island is discovered and sunk.
```

---

### 206. Reverse Linked List

**Mechanism:** Three pointers - prev, curr, next. At each step: save next, point curr back to prev, advance prev and curr. The chain flips one link at a time.

**Punchline:** "Save next, flip arrow, advance."

```
Create a visual mnemonic for Reverse Linked List (Three Pointer Flip).

The mechanism: A chain of connected nodes with arrows pointing right. 
Three markers labeled "prev", "curr", "next" sit on consecutive nodes. 
The arrow between prev and curr is shown FLIPPING direction - from 
pointing right to pointing left. A "before and after" showing the 
arrow reversal.

Style: Clear node-and-arrow diagram. The three-pointer setup is key. 
Show the moment of the flip - the arrow changing direction. 
Simple, mechanical, step-by-step feel.
```

---

### 226. Invert Binary Tree

**Mechanism:** At each node, swap left and right children. Recursively do this for all nodes. Every left becomes right, every right becomes left.

**Punchline:** "Swap left and right at every node."

```
Create a visual mnemonic for Invert Binary Tree (Recursive Swap).

The mechanism: A binary tree. At the root, two arrows show the left 
child moving to the right position and vice versa - a "swap" motion. 
The same swap arrows appear at every node in the tree. Before/after 
showing the entire tree mirrored.

Style: Clean tree diagram. The SWAP motion at each node is key - 
show the crossing arrows or switching. The recursive nature: 
same action everywhere in the tree.
```

---

### 53. Maximum Subarray (Kadane's Algorithm)

**Mechanism:** At each position, ask: "Is the running sum helping or hurting?" If negative, reset and start fresh. Track the max sum seen.

**Punchline:** "Negative baggage? Drop it, start fresh."

```
Create a visual mnemonic for Maximum Subarray (Kadane's Algorithm).

The mechanism: A person walking along a number line, carrying a bag 
labeled with a running sum. When the bag shows a negative number 
(it's "weighing them down"), they DROP the bag and grab a new empty one. 
They track the "heaviest positive bag" they've ever carried.

Style: Show the decision moment: negative sum = drop the bag. 
The "starting fresh" with a new bag. The max tracker remembering 
the best so far.
```

---

### 102. Binary Tree Level Order Traversal

**Mechanism:** BFS with a queue. Process one level at a time by noting the queue size before processing. All nodes in queue at that moment are from the same level.

**Punchline:** "Snapshot the queue size = one level."

```
Create a visual mnemonic for Binary Tree Level Order Traversal (BFS Queue Snapshot).

The mechanism: A binary tree with levels clearly separated. A queue 
(horizontal line of waiting items) shows nodes from one level. 
A "snapshot" or "photo frame" surrounds the queue, capturing 
"these are all level 2." After processing, the queue refills with 
the next level's nodes.

Style: Show the level-by-level processing. The queue snapshot concept 
is key - the size at that moment = nodes in current level.
```

---

### 33. Search in Rotated Sorted Array

**Mechanism:** Even rotated, at least ONE half is always properly sorted. Find which half is sorted, check if target is in that range, search there. Otherwise search the other half.

**Punchline:** "One half is always sorted - find it."

```
Create a visual mnemonic for Search in Rotated Sorted Array (Binary Search on Sorted Half).

The mechanism: A rotated sorted array shown as a bent or "kinked" line 
(goes up, breaks, goes up again). One segment is highlighted as 
"SORTED" - you can trust it. The other segment has the "kink" 
(rotation point). Binary search decision: is target in the clean 
sorted half, or the kinked half?

Style: The array as a line graph with a visible "rotation kink." 
One half highlighted as trustworthy/sorted. The decision point 
at each step of binary search.
```

---

### 76. Minimum Window Substring

**Mechanism:** Sliding window. Expand right to include characters. When window contains all target chars, shrink from left while still valid. Track the minimum valid window.

**Punchline:** "Expand to satisfy, shrink to minimize."

```
Create a visual mnemonic for Minimum Window Substring (Sliding Window Expand-Shrink).

The mechanism: A string with a "window" (bracket or highlight) around 
a portion. Two phases shown: (1) Window expanding right, collecting 
letters until it has all required characters. (2) Window shrinking 
from left, squeezing down while still containing the required chars. 
The minimum valid window is highlighted.

Style: Show the two motions: expand right, shrink left. The "valid" 
moment when all chars are present. The shrinking to find minimum.
```

---

### 22. House Robber

**Mechanism:** At each house, choose: rob it (skip the previous, add to the one before that) or skip it (take best up to previous). dp[i] = max(dp[i-2] + nums[i], dp[i-1]).

**Punchline:** "Rob and skip one, or skip this one."

```
Create a visual mnemonic for House Robber (Dynamic Programming Skip Pattern).

The mechanism: A row of houses. At the current house, two branching 
arrows: (1) Arrow reaches BACK two houses and adds current house 
(rob it, skipped adjacent). (2) Arrow from previous house carries 
forward (skip this house). The max of these two paths is chosen.

Style: Row of houses with clear spacing. The "skip one, reach back two" 
pattern is key. Show the choice at each house between the two options.
```

---

## Tips for Better Results

1. **Start with "Create a visual mnemonic for [Algorithm Name]"** - gives the AI specific context
2. **Include the technique in parentheses** - e.g., "(Two Pointer Greedy)" or "(DFS Flood Fill)"
3. **Describe the mechanism clearly** - what's actually happening step by step
4. **Request "clean, diagrammatic style"** - avoids cartoonish noise
5. **Emphasize the key moment** - the insight that makes the algorithm click
6. **Avoid requesting text in images** - text renders poorly, use visual metaphors instead
