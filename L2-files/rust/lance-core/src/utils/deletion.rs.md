> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/deletion.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8d10932c60bba66c23e5da5f0e8b25e63ff1dce9f294354b956264e9a7290b27`. Reviewed physical lines: 1-522.

[Module](../../../../../L1-modules/rust-lance-core-deletion-mapping.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public single-fragment deletion set, visible-ordinal-to-physical-offset mapper, representation/conversion/iteration traits and parameterized local tests. It defines in-memory representations rather than deletion-file IO. (rust/lance-core/src/utils/deletion.rs:1-522)

## Complete range analysis

### Lines 1-9

SPDX metadata and imports for HashSet<u32>, half-open Range, Arc ownership, core memory sizing, Arrow BooleanArray and RoaringBitmap. These imports establish that offsets are local u32 values, not stable u64 row IDs. (rust/lance-core/src/utils/deletion.rs:1-9)

### Lines 10-21

Private BITMAP_THRESDHOLD (spelling preserved) is usize 5_000; a TODO requests benchmarking rather than claiming the number is optimal. Public DeletionVector derives Debug, Clone and Default, with NoDeletions as default plus public Set(HashSet<u32>) and Bitmap(RoaringBitmap) variants. Direct callers can construct empty/nonempty variants without normalization or threshold enforcement. (rust/lance-core/src/utils/deletion.rs:10-21)

### Lines 22-32

DeepSizeOf children return zero for NoDeletions, delegate Set to its context-aware HashSet estimate, and use bitmap.serialized_size() for Bitmap. The latter is explicitly marked inexact; serialized bytes are not exact heap-allocation measurement. Inline enum size comes from the trait default. HashSet formula/default are at rust/lance-core/src/deepsize.rs:38-44 and rust/lance-core/src/deepsize.rs:213-220. (rust/lance-core/src/utils/deletion.rs:22-32)

### Lines 33-61

len selects zero, HashSet len or bitmap len cast to usize; is_empty uses len==0, independent of representation. contains performs false/set/bitmap membership. contains_range accepts Range<u32>, returning range.is_empty for NoDeletions, all set memberships for Set, or delegated bitmap containment. Set iterates every offset in the requested range, not just stored deletions; empty/reversed ranges are vacuously covered in the explicit range-iteration branches. (rust/lance-core/src/utils/deletion.rs:33-61)

### Lines 62-77

Private range_cardinality returns zero, folds across every requested offset accumulating HashSet membership as u64, or delegates to bitmap cardinality. Set cost therefore grows with the width of the queried offset range even when the set is small. Public iter returns a boxed Send iterator borrowed from self: empty, copied HashSet iterator, or bitmap iterator. Set order is unspecified; this method is not the sorted-iterator API. (rust/lance-core/src/utils/deletion.rs:62-77)

### Lines 78-103

into_sorted_iter consumes self and returns a boxed Send static iterator. Set collects into Vec, sorts, then returns owning iteration; Bitmap uses its already-sorted iterator per source comment. to_sorted_iter borrows self but clones the entire Set variant before calling into_sorted_iter, while Bitmap stays borrowed. Comments assume sets are small, but the public Set variant allows bypassing that assumption. (rust/lance-core/src/utils/deletion.rs:78-103)

### Lines 104-124

build_predicate receives slice::Iter<u64>. Bitmap/Set compute !contains(id as u32) for every address into Vec<bool>, then convert to BooleanArray: true means retain/not deleted, false deleted, and values are non-null. Casting discards the high fragment half, so callers must apply the single-fragment deletion vector to the correct fragment. NoDeletions returns None, but an empty Set/Bitmap returns Some(all true), including Some(empty) on empty input. This is not a fragment-ID validator or a stable-row-ID remapper. (rust/lance-core/src/utils/deletion.rs:104-124)

### Lines 125-153

OffsetMapper maps a zero-based visible-row ordinal to an undeleted local physical offset: deleting [0,1,2] yields 0->3,1->4,2->5. Documentation requires monotonically increasing inputs and says state is reused. Public struct holds private Arc<DeletionVector>, left search bound and last_diff; new initializes both cached u32 numbers to zero. There is no fragment physical-row-count field or total-row bound. (rust/lance-core/src/utils/deletion.rs:125-153)

### Lines 154-183

map_offset starts mid=offset+last_diff and right=offset+deletion count cast to u32. Each loop counts deleted offsets in 0..mid+1 and compares mid with offset+deleted_count. Equality with an undeleted mid stores last_diff=mid-offset and returns. Less asserts left!=mid+1, advances left=mid+1, then bisects [left,right]; greater or equality at a deleted mid moves right=mid and bisects. The comment explains leftward search for an overshooting guess. left persists across calls and is not reset on success; input monotonicity is not checked. Additions, subtraction, mid+1 and cardinality cast have no checked-error path, so near-u32-limit inputs can overflow under checked arithmetic or wrap otherwise. No validation rejects ordinals past actual fragment rows because that length is absent. With Set, every range-cardinality step scans 0..mid+1, a potentially large cost unrelated to set cardinality. (rust/lance-core/src/utils/deletion.rs:154-183)

### Lines 184-193

From<&DeletionVector> for RoaringBitmap clones a Bitmap, constructs from Set references, or creates a new empty bitmap for NoDeletions. It does not mutate the deletion vector or preserve its representation in the returned value. (rust/lance-core/src/utils/deletion.rs:184-193)

### Lines 194-208

PartialEq compares matching variants by contents; Set versus Bitmap collects the Set into a temporary RoaringBitmap and compares. NoDeletions equals only itself, so it differs from an empty Set or empty Bitmap even though all have len zero. Empty Set and empty Bitmap compare equal to each other. No Eq implementation is declared. Cross-representation comparison allocates a temporary bitmap. (rust/lance-core/src/utils/deletion.rs:194-208)

### Lines 209-224

Extend<u32> first converts its argument into an iterator, then mem::take(self) installs default NoDeletions while matching the old variant and iterator size_hint. For old NoDeletions, upper bound Some(0) preserves it without consuming items; lower>=5000 selects Bitmap directly; otherwise a known upper<5000 selects Set. These decisions use item-count bounds, not eventual distinct cardinality, so many duplicate inputs can select a bitmap with few distinct offsets. The comment says mem::replace, while the actual call is mem::take. (rust/lance-core/src/utils/deletion.rs:209-224)

### Lines 225-251

For unknown/ambiguous size when old NoDeletions, collect a Set and promote only if distinct len>5000. Existing Set also extends then promotes strictly above 5000; existing Bitmap never demotes. Hence exactly 5000 unique items with a lower bound of 5000 become Bitmap, but the same unique count with insufficient size-hint information or an existing Set can stay Set. An unknown-size empty iterator can create Set(empty). Panics after mem::take (including iterator/hash/allocation operations) do not restore the previous vector: self remains default until the final assignment succeeds. (rust/lance-core/src/utils/deletion.rs:225-251)

### Lines 252-275

A TODO sketches get and BitAnd APIs as comments only. IntoIterator has Item=u32 and boxed Send IntoIter; it returns empty, or sorts Set values in an owned Vec, or takes bitmap iteration. Thus consuming IntoIterator is sorted, unlike borrowed iter. The comment claims Set is guaranteed small, but direct public construction and the iterator-hint rules do not enforce such a global bound. (rust/lance-core/src/utils/deletion.rs:252-275)

### Lines 276-293

FromIterator<u32> constructs default then delegates to Extend, inheriting representation/size-hint behavior. From<RoaringBitmap> normalizes an empty bitmap to NoDeletions and otherwise preserves Bitmap even when small. This normalization differs from direct Bitmap construction and extending an existing empty Bitmap. (rust/lance-core/src/utils/deletion.rs:276-293)

### Lines 294-318

The cfg(test) module is coverage-excluded as a whole and imports rstest. Helpers set_dv/bitmap_dv deliberately construct exact variants. test_set_bitmap_equality compares 0..100 across representations. test_threshold_promotes_to_bitmap collects exact-size 0..5000 and asserts Bitmap; it does not test the unknown-hint exactly-5000 branch. (rust/lance-core/src/utils/deletion.rs:294-318)

### Lines 319-340

rstest test_map_offsets covers middle deletions [3,5] and leading [0,1,2], mapping ascending ordinals to expected kept rows. test_deep_size_of requires NoDeletions equal inline enum size and nonempty Set/Bitmap estimates greater than inline size. It does not establish exact bitmap allocation accounting. (rust/lance-core/src/utils/deletion.rs:319-340)

### Lines 341-359

Parameterized test_len_is_empty checks NoDeletions zero/true, Set three/false, Bitmap five/false. test_contains checks NoDeletions false plus present/missing offsets for both stored forms. No explicit empty stored variant case appears here. (rust/lance-core/src/utils/deletion.rs:341-359)

### Lines 360-382

test_contains_range covers empty/nonempty NoDeletions and fully covered/partially missing ranges for both Set and Bitmap. test_range_cardinality checks zero for NoDeletions and bitmap counts three over 0..20, one over 6..14. It does not directly test Set range_cardinality or reversed ranges. (rust/lance-core/src/utils/deletion.rs:360-382)

### Lines 383-400

test_iterators parameterizes all three variants. It sorts borrowed iter output before comparison (so does not require Set iteration order), but directly compares to_sorted_iter, cloned into_sorted_iter and consuming into_iter with ascending expected values. (rust/lance-core/src/utils/deletion.rs:383-400)

### Lines 401-422

test_build_predicate uses addresses 0..4. NoDeletions gives None; Set[1,3] gives true/false/true/false/true; Bitmap[0,2,4] gives false/true/false/true/false. Unwrapping each BooleanArray item confirms no nulls for these fixtures. It does not test mixed fragment high bits or empty stored variants. (rust/lance-core/src/utils/deletion.rs:401-422)

### Lines 423-442

test_to_roaring checks output lengths for all three input variants, not every element. test_partial_eq checks same-form content equality, Set/Bitmap symmetry and NoDeletions versus nonempty forms. It omits comparisons between NoDeletions and empty Set/Bitmap. (rust/lance-core/src/utils/deletion.rs:423-442)

### Lines 443-481

test_extend checks exact empty stays NoDeletions, unknown-size ten-item source creates Set, filtered 10_000 creates Bitmap, small existing Set remains Set with six items, larger extension promotes it, and existing Bitmap remains Bitmap with six. It does not cover duplicate-heavy hints, unknown-hint exactly5000 or unwind after taking self. (rust/lance-core/src/utils/deletion.rs:443-481)

### Lines 482-490

test_from_roaring asserts empty normalization to NoDeletions and a three-item bitmap remains Bitmap, consistent with conversion rather than size-threshold minimization. (rust/lance-core/src/utils/deletion.rs:482-490)

### Lines 491-522

test_map_offset_dense_then_sparse deletes four of five rows in 0..500 and one of five in 500..1000, explicitly stores Bitmap, and checks visible offsets 0->0,1->5,99->495,100->501. It covers a density transition with sparse calls, not all visible rows, decreasing input, exhaustion or u32 boundaries. All tests were read, not executed. (rust/lance-core/src/utils/deletion.rs:491-522)

## Interaction and interpretation limits

This file does not read/write .arrow/.bin deletion files, choose a persisted deletion format or validate a fragment length. Legacy/current storage emission cannot be inferred from the Set/Bitmap enum alone. Predicate fragment correctness and monotonic OffsetMapper use are caller responsibilities to trace later. (rust/lance-core/src/utils/deletion.rs:14-21; rust/lance-core/src/utils/deletion.rs:104-183)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{collections::HashSet, ops::Range, sync::Arc};
    5 | 
    6 | use crate::deepsize::{Context, DeepSizeOf};
    7 | use arrow_array::BooleanArray;
    8 | use roaring::RoaringBitmap;
    9 | 
   10 | /// Threshold for when a DeletionVector::Set should be promoted to a DeletionVector::Bitmap.
   11 | const BITMAP_THRESDHOLD: usize = 5_000;
   12 | // TODO: Benchmark to find a better value.
   13 | 
   14 | /// Represents a set of deleted row offsets in a single fragment.
   15 | #[derive(Debug, Clone, Default)]
   16 | pub enum DeletionVector {
   17 |     #[default]
   18 |     NoDeletions,
   19 |     Set(HashSet<u32>),
   20 |     Bitmap(RoaringBitmap),
   21 | }
   22 | 
   23 | impl DeepSizeOf for DeletionVector {
   24 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
   25 |         match self {
   26 |             Self::NoDeletions => 0,
   27 |             Self::Set(set) => set.deep_size_of_children(context),
   28 |             // Inexact but probably close enough
   29 |             Self::Bitmap(bitmap) => bitmap.serialized_size(),
   30 |         }
   31 |     }
   32 | }
   33 | 
   34 | impl DeletionVector {
   35 |     pub fn len(&self) -> usize {
   36 |         match self {
   37 |             Self::NoDeletions => 0,
   38 |             Self::Set(set) => set.len(),
   39 |             Self::Bitmap(bitmap) => bitmap.len() as usize,
   40 |         }
   41 |     }
   42 | 
   43 |     pub fn is_empty(&self) -> bool {
   44 |         self.len() == 0
   45 |     }
   46 | 
   47 |     pub fn contains(&self, i: u32) -> bool {
   48 |         match self {
   49 |             Self::NoDeletions => false,
   50 |             Self::Set(set) => set.contains(&i),
   51 |             Self::Bitmap(bitmap) => bitmap.contains(i),
   52 |         }
   53 |     }
   54 | 
   55 |     pub fn contains_range(&self, mut range: Range<u32>) -> bool {
   56 |         match self {
   57 |             Self::NoDeletions => range.is_empty(),
   58 |             Self::Set(set) => range.all(|i| set.contains(&i)),
   59 |             Self::Bitmap(bitmap) => bitmap.contains_range(range),
   60 |         }
   61 |     }
   62 | 
   63 |     fn range_cardinality(&self, range: Range<u32>) -> u64 {
   64 |         match self {
   65 |             Self::NoDeletions => 0,
   66 |             Self::Set(set) => range.fold(0, |acc, i| acc + set.contains(&i) as u64),
   67 |             Self::Bitmap(bitmap) => bitmap.range_cardinality(range),
   68 |         }
   69 |     }
   70 | 
   71 |     pub fn iter(&self) -> Box<dyn Iterator<Item = u32> + Send + '_> {
   72 |         match self {
   73 |             Self::NoDeletions => Box::new(std::iter::empty()),
   74 |             Self::Set(set) => Box::new(set.iter().copied()),
   75 |             Self::Bitmap(bitmap) => Box::new(bitmap.iter()),
   76 |         }
   77 |     }
   78 | 
   79 |     pub fn into_sorted_iter(self) -> Box<dyn Iterator<Item = u32> + Send + 'static> {
   80 |         match self {
   81 |             Self::NoDeletions => Box::new(std::iter::empty()),
   82 |             Self::Set(set) => {
   83 |                 // If we're using a set we shouldn't have too many values
   84 |                 // and so this conversion should be affordable.
   85 |                 let mut values = Vec::from_iter(set);
   86 |                 values.sort();
   87 |                 Box::new(values.into_iter())
   88 |             }
   89 |             // Bitmaps always iterate in sorted order
   90 |             Self::Bitmap(bitmap) => Box::new(bitmap.into_iter()),
   91 |         }
   92 |     }
   93 | 
   94 |     /// Create an iterator that iterates over the values in the deletion vector in sorted order.
   95 |     pub fn to_sorted_iter<'a>(&'a self) -> Box<dyn Iterator<Item = u32> + Send + 'a> {
   96 |         match self {
   97 |             Self::NoDeletions => Box::new(std::iter::empty()),
   98 |             // We have to make a clone when we're using a set
   99 |             // but sets should be relatively small.
  100 |             Self::Set(_) => self.clone().into_sorted_iter(),
  101 |             Self::Bitmap(bitmap) => Box::new(bitmap.iter()),
  102 |         }
  103 |     }
  104 | 
  105 |     // Note: deletion vectors are based on 32-bit offsets.  However, this function works
  106 |     // even when given 64-bit row addresses.  That is because `id as u32` returns the lower
  107 |     // 32 bits (the row offset) and the upper 32 bits are ignored.
  108 |     pub fn build_predicate(&self, row_addrs: std::slice::Iter<u64>) -> Option<BooleanArray> {
  109 |         match self {
  110 |             Self::Bitmap(bitmap) => Some(
  111 |                 row_addrs
  112 |                     .map(|&id| !bitmap.contains(id as u32))
  113 |                     .collect::<Vec<_>>(),
  114 |             ),
  115 |             Self::Set(set) => Some(
  116 |                 row_addrs
  117 |                     .map(|&id| !set.contains(&(id as u32)))
  118 |                     .collect::<Vec<_>>(),
  119 |             ),
  120 |             Self::NoDeletions => None,
  121 |         }
  122 |         .map(BooleanArray::from)
  123 |     }
  124 | }
  125 | 
  126 | /// Maps a naive offset into a fragment to the local row offset that is
  127 | /// not deleted.
  128 | ///
  129 | /// For example, if the deletion vector is [0, 1, 2], then the mapping
  130 | /// would be:
  131 | ///
  132 | /// - 0 -> 3
  133 | /// - 1 -> 4
  134 | /// - 2 -> 5
  135 | ///
  136 | /// and so on.
  137 | ///
  138 | /// This expects a monotonically increasing sequence of input offsets. State
  139 | /// is re-used between calls to `map_offset` to make the mapping more efficient.
  140 | pub struct OffsetMapper {
  141 |     dv: Arc<DeletionVector>,
  142 |     left: u32,
  143 |     last_diff: u32,
  144 | }
  145 | 
  146 | impl OffsetMapper {
  147 |     pub fn new(dv: Arc<DeletionVector>) -> Self {
  148 |         Self {
  149 |             dv,
  150 |             left: 0,
  151 |             last_diff: 0,
  152 |         }
  153 |     }
  154 | 
  155 |     pub fn map_offset(&mut self, offset: u32) -> u32 {
  156 |         // The best initial guess is the offset + last diff. That's the right
  157 |         // answer if there are no deletions in the range between the last
  158 |         // offset and the current one.
  159 |         let mut mid = offset + self.last_diff;
  160 |         let mut right = offset + self.dv.len() as u32;
  161 |         loop {
  162 |             let deleted_in_range = self.dv.range_cardinality(0..(mid + 1)) as u32;
  163 |             match mid.cmp(&(offset + deleted_in_range)) {
  164 |                 std::cmp::Ordering::Equal if !self.dv.contains(mid) => {
  165 |                     self.last_diff = mid - offset;
  166 |                     return mid;
  167 |                 }
  168 |                 std::cmp::Ordering::Less => {
  169 |                     assert_ne!(self.left, mid + 1);
  170 |                     self.left = mid + 1;
  171 |                     mid = self.left + (right - self.left) / 2;
  172 |                 }
  173 |                 // Binary search left when the guess overshoots. This can happen when:
  174 |                 // - Greater: last_diff was calibrated for a denser deletion region
  175 |                 // - Equal with deleted mid: the guess lands exactly on a deleted row
  176 |                 std::cmp::Ordering::Greater | std::cmp::Ordering::Equal => {
  177 |                     right = mid;
  178 |                     mid = self.left + (right - self.left) / 2;
  179 |                 }
  180 |             }
  181 |         }
  182 |     }
  183 | }
  184 | 
  185 | impl From<&DeletionVector> for RoaringBitmap {
  186 |     fn from(value: &DeletionVector) -> Self {
  187 |         match value {
  188 |             DeletionVector::Bitmap(bitmap) => bitmap.clone(),
  189 |             DeletionVector::Set(set) => Self::from_iter(set.iter()),
  190 |             DeletionVector::NoDeletions => Self::new(),
  191 |         }
  192 |     }
  193 | }
  194 | 
  195 | impl PartialEq for DeletionVector {
  196 |     fn eq(&self, other: &Self) -> bool {
  197 |         match (self, other) {
  198 |             (Self::NoDeletions, Self::NoDeletions) => true,
  199 |             (Self::Set(set1), Self::Set(set2)) => set1 == set2,
  200 |             (Self::Bitmap(bitmap1), Self::Bitmap(bitmap2)) => bitmap1 == bitmap2,
  201 |             (Self::Set(set), Self::Bitmap(bitmap)) | (Self::Bitmap(bitmap), Self::Set(set)) => {
  202 |                 let set = set.iter().copied().collect::<RoaringBitmap>();
  203 |                 set == *bitmap
  204 |             }
  205 |             _ => false,
  206 |         }
  207 |     }
  208 | }
  209 | 
  210 | impl Extend<u32> for DeletionVector {
  211 |     fn extend<T: IntoIterator<Item = u32>>(&mut self, iter: T) {
  212 |         let iter = iter.into_iter();
  213 |         // The mem::replace allows changing the variant of Self when we only
  214 |         // have &mut Self.
  215 |         *self = match (std::mem::take(self), iter.size_hint()) {
  216 |             (Self::NoDeletions, (_, Some(0))) => Self::NoDeletions,
  217 |             (Self::NoDeletions, (lower, _)) if lower >= BITMAP_THRESDHOLD => {
  218 |                 let bitmap = iter.collect::<RoaringBitmap>();
  219 |                 Self::Bitmap(bitmap)
  220 |             }
  221 |             (Self::NoDeletions, (_, Some(upper))) if upper < BITMAP_THRESDHOLD => {
  222 |                 let set = iter.collect::<HashSet<_>>();
  223 |                 Self::Set(set)
  224 |             }
  225 |             (Self::NoDeletions, _) => {
  226 |                 // We don't know the size, so just try as a set and move to bitmap
  227 |                 // if it ends up being big.
  228 |                 let set = iter.collect::<HashSet<_>>();
  229 |                 if set.len() > BITMAP_THRESDHOLD {
  230 |                     let bitmap = set.into_iter().collect::<RoaringBitmap>();
  231 |                     Self::Bitmap(bitmap)
  232 |                 } else {
  233 |                     Self::Set(set)
  234 |                 }
  235 |             }
  236 |             (Self::Set(mut set), _) => {
  237 |                 set.extend(iter);
  238 |                 if set.len() > BITMAP_THRESDHOLD {
  239 |                     let bitmap = set.drain().collect::<RoaringBitmap>();
  240 |                     Self::Bitmap(bitmap)
  241 |                 } else {
  242 |                     Self::Set(set)
  243 |                 }
  244 |             }
  245 |             (Self::Bitmap(mut bitmap), _) => {
  246 |                 bitmap.extend(iter);
  247 |                 Self::Bitmap(bitmap)
  248 |             }
  249 |         };
  250 |     }
  251 | }
  252 | 
  253 | // TODO: impl methods for DeletionVector
  254 | /// impl DeletionVector {
  255 | ///     pub fn get(i: u32) -> bool { ... }
  256 | /// }
  257 | /// impl BitAnd for DeletionVector { ... }
  258 | impl IntoIterator for DeletionVector {
  259 |     type IntoIter = Box<dyn Iterator<Item = Self::Item> + Send>;
  260 |     type Item = u32;
  261 | 
  262 |     fn into_iter(self) -> Self::IntoIter {
  263 |         match self {
  264 |             Self::NoDeletions => Box::new(std::iter::empty()),
  265 |             Self::Set(set) => {
  266 |                 // In many cases, it's much better if this is sorted. It's
  267 |                 // guaranteed to be small, so the cost is low.
  268 |                 let mut sorted = set.into_iter().collect::<Vec<_>>();
  269 |                 sorted.sort();
  270 |                 Box::new(sorted.into_iter())
  271 |             }
  272 |             Self::Bitmap(bitmap) => Box::new(bitmap.into_iter()),
  273 |         }
  274 |     }
  275 | }
  276 | 
  277 | impl FromIterator<u32> for DeletionVector {
  278 |     fn from_iter<T: IntoIterator<Item = u32>>(iter: T) -> Self {
  279 |         let mut deletion_vector = Self::default();
  280 |         deletion_vector.extend(iter);
  281 |         deletion_vector
  282 |     }
  283 | }
  284 | 
  285 | impl From<RoaringBitmap> for DeletionVector {
  286 |     fn from(bitmap: RoaringBitmap) -> Self {
  287 |         if bitmap.is_empty() {
  288 |             Self::NoDeletions
  289 |         } else {
  290 |             Self::Bitmap(bitmap)
  291 |         }
  292 |     }
  293 | }
  294 | 
  295 | #[cfg(test)]
  296 | #[cfg_attr(coverage, coverage(off))]
  297 | mod test {
  298 |     use super::*;
  299 |     use crate::deepsize::DeepSizeOf;
  300 |     use rstest::rstest;
  301 | 
  302 |     fn set_dv(vals: impl IntoIterator<Item = u32>) -> DeletionVector {
  303 |         DeletionVector::Set(HashSet::from_iter(vals))
  304 |     }
  305 |     fn bitmap_dv(vals: impl IntoIterator<Item = u32>) -> DeletionVector {
  306 |         DeletionVector::Bitmap(RoaringBitmap::from_iter(vals))
  307 |     }
  308 | 
  309 |     #[test]
  310 |     fn test_set_bitmap_equality() {
  311 |         assert_eq!(set_dv(0..100), bitmap_dv(0..100));
  312 |     }
  313 | 
  314 |     #[test]
  315 |     fn test_threshold_promotes_to_bitmap() {
  316 |         let dv = DeletionVector::from_iter(0..(BITMAP_THRESDHOLD as u32));
  317 |         assert!(matches!(dv, DeletionVector::Bitmap(_)));
  318 |     }
  319 | 
  320 |     #[rstest]
  321 |     #[case::middle_deletions(&[3, 5], &[0, 1, 2, 4, 6, 7, 8])]
  322 |     #[case::start_deletions(&[0, 1, 2], &[3, 4, 5, 6, 7, 8, 9])]
  323 |     fn test_map_offsets(#[case] deleted: &[u32], #[case] expected: &[u32]) {
  324 |         let dv = DeletionVector::from_iter(deleted.iter().copied());
  325 |         let mut mapper = OffsetMapper::new(Arc::new(dv));
  326 |         let output: Vec<_> = (0..expected.len() as u32)
  327 |             .map(|o| mapper.map_offset(o))
  328 |             .collect();
  329 |         assert_eq!(output, expected);
  330 |     }
  331 | 
  332 |     #[test]
  333 |     fn test_deep_size_of() {
  334 |         assert_eq!(
  335 |             DeletionVector::NoDeletions.deep_size_of(),
  336 |             std::mem::size_of::<DeletionVector>()
  337 |         );
  338 |         assert!(set_dv([1, 2, 3]).deep_size_of() > std::mem::size_of::<DeletionVector>());
  339 |         assert!(bitmap_dv([1, 2, 3]).deep_size_of() > std::mem::size_of::<DeletionVector>());
  340 |     }
  341 | 
  342 |     #[rstest]
  343 |     #[case::no_deletions(DeletionVector::NoDeletions, 0, true)]
  344 |     #[case::set(set_dv([1, 2, 3]), 3, false)]
  345 |     #[case::bitmap(bitmap_dv([1, 2, 3, 4, 5]), 5, false)]
  346 |     fn test_len_is_empty(#[case] dv: DeletionVector, #[case] len: usize, #[case] empty: bool) {
  347 |         assert_eq!(dv.len(), len);
  348 |         assert_eq!(dv.is_empty(), empty);
  349 |     }
  350 | 
  351 |     #[rstest]
  352 |     #[case::no_deletions(DeletionVector::NoDeletions, 1, false)]
  353 |     #[case::set_contains(set_dv([1, 2, 3]), 1, true)]
  354 |     #[case::set_missing(set_dv([1, 2, 3]), 0, false)]
  355 |     #[case::bitmap_contains(bitmap_dv([10, 20, 30]), 10, true)]
  356 |     #[case::bitmap_missing(bitmap_dv([10, 20, 30]), 5, false)]
  357 |     fn test_contains(#[case] dv: DeletionVector, #[case] val: u32, #[case] expected: bool) {
  358 |         assert_eq!(dv.contains(val), expected);
  359 |     }
  360 | 
  361 |     #[rstest]
  362 |     #[case::no_del_empty_range(DeletionVector::NoDeletions, 0..0, true)]
  363 |     #[case::no_del_non_empty(DeletionVector::NoDeletions, 0..1, false)]
  364 |     #[case::set_full_range(set_dv([1, 2, 3]), 1..4, true)]
  365 |     #[case::set_partial(set_dv([1, 2, 3]), 0..2, false)]
  366 |     #[case::bitmap_full(bitmap_dv([10, 11, 12]), 10..13, true)]
  367 |     #[case::bitmap_partial(bitmap_dv([10, 11, 12]), 9..11, false)]
  368 |     fn test_contains_range(
  369 |         #[case] dv: DeletionVector,
  370 |         #[case] range: std::ops::Range<u32>,
  371 |         #[case] expected: bool,
  372 |     ) {
  373 |         assert_eq!(dv.contains_range(range), expected);
  374 |     }
  375 | 
  376 |     #[test]
  377 |     fn test_range_cardinality() {
  378 |         assert_eq!(DeletionVector::NoDeletions.range_cardinality(0..100), 0);
  379 |         let bm = bitmap_dv([5, 10, 15]);
  380 |         assert_eq!(bm.range_cardinality(0..20), 3);
  381 |         assert_eq!(bm.range_cardinality(6..14), 1);
  382 |     }
  383 | 
  384 |     #[rstest]
  385 |     #[case::no_deletions(DeletionVector::NoDeletions, vec![])]
  386 |     #[case::set(set_dv([3, 1, 2]), vec![1, 2, 3])]
  387 |     #[case::bitmap(bitmap_dv([30, 10, 20]), vec![10, 20, 30])]
  388 |     fn test_iterators(#[case] dv: DeletionVector, #[case] expected: Vec<u32>) {
  389 |         // Test iter()
  390 |         let mut items: Vec<_> = dv.iter().collect();
  391 |         items.sort();
  392 |         assert_eq!(items, expected);
  393 | 
  394 |         // Test to_sorted_iter()
  395 |         assert_eq!(dv.to_sorted_iter().collect::<Vec<_>>(), expected);
  396 | 
  397 |         // Test into_sorted_iter() and into_iter() (both consume, so clone first)
  398 |         assert_eq!(dv.clone().into_sorted_iter().collect::<Vec<_>>(), expected);
  399 |         assert_eq!(dv.into_iter().collect::<Vec<_>>(), expected);
  400 |     }
  401 | 
  402 |     #[test]
  403 |     fn test_build_predicate() {
  404 |         let addrs = [0u64, 1, 2, 3, 4];
  405 |         assert!(
  406 |             DeletionVector::NoDeletions
  407 |                 .build_predicate(addrs.iter())
  408 |                 .is_none()
  409 |         );
  410 | 
  411 |         let pred = set_dv([1, 3]).build_predicate(addrs.iter()).unwrap();
  412 |         assert_eq!(
  413 |             pred.iter().map(|v| v.unwrap()).collect::<Vec<_>>(),
  414 |             [true, false, true, false, true]
  415 |         );
  416 | 
  417 |         let pred = bitmap_dv([0, 2, 4]).build_predicate(addrs.iter()).unwrap();
  418 |         assert_eq!(
  419 |             pred.iter().map(|v| v.unwrap()).collect::<Vec<_>>(),
  420 |             [false, true, false, true, false]
  421 |         );
  422 |     }
  423 | 
  424 |     #[rstest]
  425 |     #[case::no_deletions(DeletionVector::NoDeletions, 0)]
  426 |     #[case::set(set_dv([1, 2, 3]), 3)]
  427 |     #[case::bitmap(bitmap_dv([10, 20]), 2)]
  428 |     fn test_to_roaring(#[case] dv: DeletionVector, #[case] len: u64) {
  429 |         let bitmap: RoaringBitmap = (&dv).into();
  430 |         assert_eq!(bitmap.len(), len);
  431 |     }
  432 | 
  433 |     #[test]
  434 |     fn test_partial_eq() {
  435 |         assert_eq!(DeletionVector::NoDeletions, DeletionVector::NoDeletions);
  436 |         assert_eq!(set_dv([1, 2, 3]), set_dv([1, 2, 3]));
  437 |         assert_eq!(bitmap_dv([1, 2, 3]), bitmap_dv([1, 2, 3]));
  438 |         assert_eq!(set_dv([5, 6, 7]), bitmap_dv([5, 6, 7])); // cross-type
  439 |         assert_eq!(bitmap_dv([5, 6, 7]), set_dv([5, 6, 7])); // reverse
  440 |         assert_ne!(DeletionVector::NoDeletions, set_dv([1]));
  441 |         assert_ne!(DeletionVector::NoDeletions, bitmap_dv([1]));
  442 |     }
  443 | 
  444 |     #[test]
  445 |     fn test_extend() {
  446 |         // Empty iter -> stays NoDeletions
  447 |         let mut dv = DeletionVector::NoDeletions;
  448 |         dv.extend(std::iter::empty::<u32>());
  449 |         assert!(matches!(dv, DeletionVector::NoDeletions));
  450 | 
  451 |         // Unknown size small -> Set
  452 |         let mut dv = DeletionVector::NoDeletions;
  453 |         dv.extend(std::iter::from_fn({
  454 |             let mut i = 0u32;
  455 |             move || {
  456 |                 i += 1;
  457 |                 (i <= 10).then_some(i - 1)
  458 |             }
  459 |         }));
  460 |         assert!(matches!(dv, DeletionVector::Set(_)));
  461 | 
  462 |         // Unknown size large -> Bitmap
  463 |         let mut dv = DeletionVector::NoDeletions;
  464 |         dv.extend((0u32..10_000).filter(|_| true));
  465 |         assert!(matches!(dv, DeletionVector::Bitmap(_)));
  466 | 
  467 |         // Set stays Set when small
  468 |         let mut dv = set_dv([1, 2, 3]);
  469 |         dv.extend([4, 5, 6]);
  470 |         assert!(matches!(dv, DeletionVector::Set(_)) && dv.len() == 6);
  471 | 
  472 |         // Set promotes to Bitmap when large
  473 |         let mut dv = set_dv([1, 2, 3]);
  474 |         dv.extend(100..(BITMAP_THRESDHOLD as u32 + 100));
  475 |         assert!(matches!(dv, DeletionVector::Bitmap(_)));
  476 | 
  477 |         // Bitmap stays Bitmap
  478 |         let mut dv = bitmap_dv([1, 2, 3]);
  479 |         dv.extend([4, 5, 6]);
  480 |         assert!(matches!(dv, DeletionVector::Bitmap(_)) && dv.len() == 6);
  481 |     }
  482 | 
  483 |     #[test]
  484 |     fn test_from_roaring() {
  485 |         let dv: DeletionVector = RoaringBitmap::new().into();
  486 |         assert!(matches!(dv, DeletionVector::NoDeletions));
  487 | 
  488 |         let dv: DeletionVector = RoaringBitmap::from_iter([1, 2, 3]).into();
  489 |         assert!(matches!(dv, DeletionVector::Bitmap(_)) && dv.len() == 3);
  490 |     }
  491 | 
  492 |     #[test]
  493 |     fn test_map_offset_dense_then_sparse() {
  494 |         // First half densely deleted (80% deleted), second half sparse (20% deleted)
  495 |         // This creates varying deletion density that might trip up the algorithm
  496 |         let mut deleted = Vec::new();
  497 |         // Dense region: delete 4 out of every 5 rows (keep every 5th)
  498 |         for i in 0..500u32 {
  499 |             if i % 5 != 0 {
  500 |                 deleted.push(i);
  501 |             }
  502 |         }
  503 |         // Sparse region: delete 1 out of every 5 rows
  504 |         for i in 500..1000u32 {
  505 |             if i % 5 == 0 {
  506 |                 deleted.push(i);
  507 |             }
  508 |         }
  509 |         let dv = DeletionVector::Bitmap(RoaringBitmap::from_iter(deleted));
  510 |         let mut mapper = OffsetMapper::new(Arc::new(dv));
  511 | 
  512 |         // In dense region: offset 0 -> row 0 (kept), offset 1 -> row 5 (kept), etc.
  513 |         assert_eq!(mapper.map_offset(0), 0);
  514 |         assert_eq!(mapper.map_offset(1), 5);
  515 |         assert_eq!(mapper.map_offset(99), 495);
  516 | 
  517 |         // Transition to sparse region
  518 |         // At row 500, we've had 400 deletions in dense region, plus row 500 is deleted
  519 |         // offset 100 should get row 501
  520 |         assert_eq!(mapper.map_offset(100), 501);
  521 |     }
  522 | }
``````
