> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/src/levenshtein.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `cc3e4d9668017fccf6902a3e0187a4d88c69e3ebc06688bd79efa3215e392988`. Reviewed physical lines: 1-133.

[Module](../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public edit-distance and borrowed best-suggestion helpers, used by lazy missing-field diagnostics. Algorithms operate on Rust char sequences rather than UTF-8 bytes or user-perceived grapheme clusters. (rust/lance-core/src/levenshtein.rs:1-133)

## Complete range analysis

### Lines 1-16

SPDX and distance documentation define insertion/deletion/substitution count and demonstrate kitten/sitting=3 and identical hello=0. The examples are retained as doctests; no external dependency or imports are needed. (rust/lance-core/src/levenshtein.rs:1-16)

### Lines 17-29

pub fn levenshtein_distance(s1:&str,s2:&str)->usize collects both strings into Vec<char>, counts m/n and returns the other length if either is empty. Both character vectors are constructed before empty checks; empty collection need not allocate heap storage. Comparison is exact, case-sensitive, without normalization or grapheme segmentation. Non-ASCII scalar values count as one element regardless of UTF-8 byte width. Character equality and recurrence are at rust/lance-core/src/levenshtein.rs:34-40. (rust/lance-core/src/levenshtein.rs:17-29)

### Lines 30-46

Initialize prev_row to 0..=n and curr_row to n+1 zeros. For each s1 char set first current cost i+1; each s2 char has substitution cost0 when equal else1; current[j+1] is min(previous[j+1]+1,current[j]+1,previous[j]+cost), then swap row buffers. Return prev_row[n]. Time is O(m*n) after O(m+n) character collection; two DP rows use O(n), but total auxiliary storage includes both character vectors and is O(m+n). Row width follows s2, not min(m,n). No early cutoff, Result, unsafe code, shared state or IO exists; allocation/arithmetic failures are not caught. (rust/lance-core/src/levenshtein.rs:30-46)

### Lines 47-62

Suggestion docs describe maximum distance floor(input length/3) and return None without a qualifying option. Doctests use vacter -> vector and hello -> None. This is thresholded edit distance, not prefix, token or phonetic matching. (rust/lance-core/src/levenshtein.rs:47-62)

### Lines 63-73

pub fn find_best_suggestion<'a,'b>(input:&'a str,options:&'b [impl AsRef<str>])->Option<&'b str> counts Unicode scalar values in input; empty input immediately returns None even if options includes empty string. Nonempty input sets integer threshold input_len/3 and no best candidate. Output borrows the selected option, not input; separate lifetimes are explicit. (rust/lance-core/src/levenshtein.rs:63-73)

### Lines 74-90

For every option compute full levenshtein_distance(input,option.as_ref()), retain only distance<=threshold, and replace an existing best only on strict improvement. Equal-distance ties keep earliest eligible option. There is no early exit for distance0 or length-difference pruning. Inputs of length1/2 can still match identical options because threshold0; no universal too-short rejection exists. Each distance call recollects input and candidate chars, so total time is the sum of full pairwise costs, with transient per-option allocations. Return selected borrowed str by mapping away its distance. (rust/lance-core/src/levenshtein.rs:74-90)

### Lines 91-110

Private test module and test_levenshtein_distance assert both-empty, each one-empty order, equality, kitten/sitting, saturday/sunday, deletion/substitution/insertion around vector, and three substitutions abc/xyz. All fixtures are ASCII; these tests do not exercise Unicode scalar versus grapheme behavior. (rust/lance-core/src/levenshtein.rs:91-110)

### Lines 111-133

test_find_best_suggestion checks three typos, two unrelated inputs, v and empty input without matches in the given list, and vecor choosing vector over vendor. Comment Should return None if input is too short describes these fixtures, not a general length rule: exact one-character option would pass threshold0. No explicit tie-order, Unicode, empty-options or short-exact-match test appears. Tests were read, not executed. The short-input inference follows the threshold and candidate comparison at rust/lance-core/src/levenshtein.rs:63-89. (rust/lance-core/src/levenshtein.rs:111-133)

## Interaction and interpretation limits

Known direct caller: FieldNotFoundError::fmt passes field_name and full candidates only when displaying the error (rust/lance-core/src/error.rs:67-88). find_best_suggestion calls levenshtein_distance for every option (rust/lance-core/src/levenshtein.rs:74-88). Remaining repository callers and performance measurements are pending; changing normalization, length units, threshold rounding or tie policy changes diagnostic suggestions.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | /// Calculate the Levenshtein distance between two strings.
    5 | ///
    6 | /// The Levenshtein distance is a measure of the number of single-character edits
    7 | /// (insertions, deletions, or substitutions) required to change one word into the other.
    8 | ///
    9 | /// # Examples
   10 | ///
   11 | /// ```
   12 | /// use lance_core::levenshtein::levenshtein_distance;
   13 | ///
   14 | /// assert_eq!(levenshtein_distance("kitten", "sitting"), 3);
   15 | /// assert_eq!(levenshtein_distance("hello", "hello"), 0);
   16 | /// ```
   17 | pub fn levenshtein_distance(s1: &str, s2: &str) -> usize {
   18 |     let s1_chars: Vec<char> = s1.chars().collect();
   19 |     let s2_chars: Vec<char> = s2.chars().collect();
   20 |     let m = s1_chars.len();
   21 |     let n = s2_chars.len();
   22 | 
   23 |     if m == 0 {
   24 |         return n;
   25 |     }
   26 |     if n == 0 {
   27 |         return m;
   28 |     }
   29 | 
   30 |     // Use two rows instead of full matrix for space efficiency
   31 |     let mut prev_row: Vec<usize> = (0..=n).collect();
   32 |     let mut curr_row: Vec<usize> = vec![0; n + 1];
   33 | 
   34 |     for (i, s1_char) in s1_chars.iter().enumerate() {
   35 |         curr_row[0] = i + 1;
   36 |         for (j, s2_char) in s2_chars.iter().enumerate() {
   37 |             let cost = if s1_char == s2_char { 0 } else { 1 };
   38 |             curr_row[j + 1] = (prev_row[j + 1] + 1)
   39 |                 .min(curr_row[j] + 1)
   40 |                 .min(prev_row[j] + cost);
   41 |         }
   42 |         std::mem::swap(&mut prev_row, &mut curr_row);
   43 |     }
   44 | 
   45 |     prev_row[n]
   46 | }
   47 | 
   48 | /// Find the best suggestion from a list of options based on Levenshtein distance.
   49 | ///
   50 | /// Returns `Some(suggestion)` if there's an option where the Levenshtein distance
   51 | /// is at most 1/3 of the length of the input string (integer division).
   52 | /// Otherwise returns `None`.
   53 | ///
   54 | /// # Examples
   55 | ///
   56 | /// ```
   57 | /// use lance_core::levenshtein::find_best_suggestion;
   58 | ///
   59 | /// let options = vec!["vector", "id", "name"];
   60 | /// assert_eq!(find_best_suggestion("vacter", &options), Some("vector"));
   61 | /// assert_eq!(find_best_suggestion("hello", &options), None);
   62 | /// ```
   63 | pub fn find_best_suggestion<'a, 'b>(
   64 |     input: &'a str,
   65 |     options: &'b [impl AsRef<str>],
   66 | ) -> Option<&'b str> {
   67 |     let input_len = input.chars().count();
   68 |     if input_len == 0 {
   69 |         return None;
   70 |     }
   71 | 
   72 |     let threshold = input_len / 3;
   73 |     let mut best_option: Option<(&'b str, usize)> = None;
   74 |     for option in options {
   75 |         let distance = levenshtein_distance(input, option.as_ref());
   76 |         if distance <= threshold {
   77 |             match &best_option {
   78 |                 None => best_option = Some((option.as_ref(), distance)),
   79 |                 Some((_, best_distance)) => {
   80 |                     if distance < *best_distance {
   81 |                         best_option = Some((option.as_ref(), distance));
   82 |                     }
   83 |                 }
   84 |             }
   85 |         }
   86 |     }
   87 | 
   88 |     best_option.map(|(option, _)| option)
   89 | }
   90 | 
   91 | #[cfg(test)]
   92 | mod tests {
   93 |     use super::*;
   94 | 
   95 |     #[test]
   96 |     fn test_levenshtein_distance() {
   97 |         assert_eq!(levenshtein_distance("", ""), 0);
   98 |         assert_eq!(levenshtein_distance("a", ""), 1);
   99 |         assert_eq!(levenshtein_distance("", "a"), 1);
  100 |         assert_eq!(levenshtein_distance("abc", "abc"), 0);
  101 |         assert_eq!(levenshtein_distance("abc", ""), 3);
  102 |         assert_eq!(levenshtein_distance("", "abc"), 3);
  103 |         assert_eq!(levenshtein_distance("kitten", "sitting"), 3);
  104 |         assert_eq!(levenshtein_distance("saturday", "sunday"), 3);
  105 |         assert_eq!(levenshtein_distance("vector", "vectr"), 1);
  106 |         assert_eq!(levenshtein_distance("vector", "vextor"), 1);
  107 |         assert_eq!(levenshtein_distance("vector", "vvector"), 1);
  108 |         assert_eq!(levenshtein_distance("abc", "xyz"), 3);
  109 |     }
  110 | 
  111 |     #[test]
  112 |     fn test_find_best_suggestion() {
  113 |         let options = vec!["vector", "id", "name", "column", "table"];
  114 | 
  115 |         assert_eq!(find_best_suggestion("vacter", &options), Some("vector"));
  116 |         assert_eq!(find_best_suggestion("vectr", &options), Some("vector"));
  117 |         assert_eq!(find_best_suggestion("tble", &options), Some("table"));
  118 | 
  119 |         // Should return None if no good match
  120 |         assert_eq!(find_best_suggestion("hello", &options), None);
  121 |         assert_eq!(find_best_suggestion("xyz", &options), None);
  122 | 
  123 |         // Should return None if input is too short
  124 |         assert_eq!(find_best_suggestion("v", &options), None);
  125 |         assert_eq!(find_best_suggestion("", &options), None);
  126 | 
  127 |         // Picks closest when multiple are close
  128 |         assert_eq!(
  129 |             find_best_suggestion("vecor", &["vector", "vendor"]),
  130 |             Some("vector")
  131 |         );
  132 |     }
  133 | }
``````
