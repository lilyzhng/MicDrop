# Strings & Two Pointers

## Category Overview

String manipulation, palindromes, anagrams, and sliding window techniques.

**When to Use:** Use sliding window for substring problems. Use two pointers for palindrome checks. Use hash maps for anagram detection.

**Typical Complexity:** Usually O(n) time. Sliding window is O(n) with O(k) space where k is window size or charset.

---

## Problems

### Longest Substring Without Repeating Characters

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(min(m,n))

**Key Pattern:** Sliding Window

**The Insight:** Sliding window, if we see same char twice within curr window, shift start position

**Full Approach:** sliding window, if we see same char twice within curr window, shift start position;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
- [NeetCode Video Solution](https://youtu.be/wiGpQwVHdE0)

---

### Longest Repeating Character Replacement

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(26)

**Key Pattern:** Sliding Window

**The Insight:** PAY ATTENTION: limited to chars A-Z

**Full Approach:** PAY ATTENTION: limited to chars A-Z; for each capital char, check if it could create the longest repeating substr, use sliding window to optimize; check if windowlen=1 works, if yes, increment len, if not, shift window right;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-repeating-character-replacement/)
- [NeetCode Video Solution](https://youtu.be/gqXU1UyA8pk)

---

### Minimum Window Substring

**Difficulty:** Hard | **Time:** O(n+m) | **Space:** O(m)

**Key Pattern:** Sliding Window

**The Insight:** Need is num of unique char in T, HAVE is num of char we have valid count for, sliding window, move right until valid, if valid, increment left until invalid, to check validity keep track if the count of each unique char is satisfied

**Full Approach:** need is num of unique char in T, HAVE is num of char we have valid count for, sliding window, move right until valid, if valid, increment left until invalid, to check validity keep track if the count of each unique char is satisfied;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/minimum-window-substring/)
- [NeetCode Video Solution](https://youtu.be/jSto0O4AJbM)

---

### Valid Anagram

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Hash Map

**The Insight:** Hashmap to count each char in str1, decrement for str2

**Full Approach:** hashmap to count each char in str1, decrement for str2;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/valid-anagram/)
- [NeetCode Video Solution](https://youtu.be/9UtInBqnCgA)

---

### Group Anagrams

**Difficulty:** Medium | **Time:** O(n*k) | **Space:** O(n*k)

**Key Pattern:** String

**The Insight:** For each of 26 chars, use count of each char in each word as tuple for key in dict, value is the list of anagrams

**Full Approach:** for each of 26 chars, use count of each char in each word as tuple for key in dict, value is the list of anagrams;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/group-anagrams/)
- [NeetCode Video Solution](https://youtu.be/vzdNOK2oB2E)

---

### Valid Parentheses

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(n)

**Key Pattern:** Stack

**The Insight:** Push opening brace on stack, pop if matching close brace, at end if stack empty, return true

**Full Approach:** push opening brace on stack, pop if matching close brace, at end if stack empty, return true;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/valid-parentheses/)
- [NeetCode Video Solution](https://youtu.be/WTzjTskDFMg)

---

### Valid Palindrome

**Difficulty:** Easy | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** Two Pointers

**The Insight:** Left, right pointers, update left and right until each points at alphanum, compare left and right, continue until left >= right, don’t distinguish between upper/lowercase

**Full Approach:** left, right pointers, update left and right until each points at alphanum, compare left and right, continue until left >= right, don’t distinguish between upper/lowercase;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/valid-palindrome/)
- [NeetCode Video Solution](https://youtu.be/jJXJ16kPFWg)

---

### Longest Palindromic Substring

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(1)

**Key Pattern:** String

**The Insight:** Foreach char in str, consider it were the middle, consider if pali was odd or even

**Full Approach:** foreach char in str, consider it were the middle, consider if pali was odd or even;

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/longest-palindromic-substring/)
- [NeetCode Video Solution](https://youtu.be/XYQecbcd6_c)

---

### Palindromic Substrings

**Difficulty:** Medium | **Time:** O(n²) | **Space:** O(1)

**Key Pattern:** String

**The Insight:** Same as longest palindromic string, each char in str as middle and expand outwards, do same for pali of even len

**Full Approach:** same as longest palindromic string, each char in str as middle and expand outwards, do same for pali of even len; maybe read up on manachers alg

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/palindromic-substrings/)
- [NeetCode Video Solution](https://youtu.be/4RACzI5-du8)

---

### Encode and Decode Strings (Leetcode Premium)

**Difficulty:** Medium | **Time:** O(n) | **Space:** O(1)

**Key Pattern:** String

**The Insight:** Store length of str before each string and delimiter like '#'

**Full Approach:** store length of str before each string and delimiter like '#';

**Resources:**
- [LeetCode Problem](https://leetcode.com/problems/encode-and-decode-strings/)
- [NeetCode Video Solution](https://youtu.be/B1k_sxOSgv8)

---

## Quick Quiz Prompts

Use these questions to test your understanding:

1. **Longest Substring Without Repeating Characters**: What is the key technique and its time complexity?
1. **Longest Repeating Character Replacement**: What is the key technique and its time complexity?
1. **Minimum Window Substring**: What is the key technique and its time complexity?
1. **Valid Anagram**: What is the key technique and its time complexity?
1. **Group Anagrams**: What is the key technique and its time complexity?

### Pattern Recognition Questions

- When do you use sliding window vs. two pointers?
- How do you detect anagrams efficiently?
- What's the expand-from-center technique for palindromes?


## Pattern Cheat Sheet

| Problem | Key Pattern | Time | Space |
|---------|-------------|------|-------|
| Longest Substring Without Repeating Characters | Sliding Window | O(n) | O(min(m,n)) |
| Longest Repeating Character Replacement | Sliding Window | O(n) | O(26) |
| Minimum Window Substring | Sliding Window | O(n+m) | O(m) |
| Valid Anagram | Hash Map | O(n) | O(1) |
| Group Anagrams | String | O(n*k) | O(n*k) |
| Valid Parentheses | Stack | O(n) | O(n) |
| Valid Palindrome | Two Pointers | O(n) | O(1) |
| Longest Palindromic Substring | String | O(n²) | O(1) |
| Palindromic Substrings | String | O(n²) | O(1) |
| Encode and Decode Strings (Leetcode Premium) | String | O(n) | O(1) |
