> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/container/list.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `d80c6a0c137f9b2cd9be0d5844f568457ded90f7ce2ee4a9573198492b5e926b`. Reviewed physical lines: 1-306.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public generic exponentially growing linked blocks, borrowed/owned iterators, equality and memory-estimation implementations; private block state and local tests. (rust/lance-core/src/container/list.rs:1-306)

## Complete range analysis

### Lines 1-6

SPDX metadata and imports bind the implementation to std::collections::LinkedList and the local DeepSizeOf trait. No allocator or concurrency abstraction is introduced. (rust/lance-core/src/container/list.rs:1-6)

### Lines 7-21

ExpLinkedList<T> derives Debug, Clone and Default and privately stores LinkedList<Vec<T>>, an explicit element count, and a u16 capacity limit. Documentation describes a memory-efficient collection for large numbers of elements and says the final block capacity doubles when full. Limit zero means unlimited; its u16 representation is explicitly intended to keep the limit compact. This is a limit on newly chosen block capacities, not a total-element bound. (rust/lance-core/src/container/list.rs:7-21)

### Lines 22-41

`new` starts with no blocks, len=0, limit=0. `with_capacity(capacity)` always pushes one Vec::with_capacity(capacity), even for zero, and starts len=0, limit=0. Consequently preallocated empty and newly constructed empty have different block-presence states; no elements are initialized by reserving. (rust/lance-core/src/container/list.rs:22-41)

### Lines 42-49

The consuming builder with_capacity_limit(mut self, limit:u16)->Self only replaces limit and returns self. It does not shrink existing blocks or reject zero/large existing capacity. Its documentation defines limit as the maximum capacity of one node and zero as no limit; these lines do not give a performance guarantee or measured allocation result. (rust/lance-core/src/container/list.rs:42-49)

### Lines 50-75

push checks the last Vec: if full, it doubles capacity unless a positive limit is reached or exceeded, then appends a Vec with the capped capacity; with no last Vec it appends capacity one. do_push unwraps the now-present last block, pushes the value, then increments len. Doubling and len increment have no overflow guard. A pre-existing zero-capacity block computes another zero capacity and delegates actual growth to Vec::push; the configured limit is not validated against this dependency-selected growth. Setting a smaller limit cannot change an existing larger block. (rust/lance-core/src/container/list.rs:50-75)

### Lines 76-91

pop examines the last block; an empty block is removed and pop recursively retries. A nonempty block decrements len and pops one value; no block means None. Removing a last value does not immediately remove its now-empty block. Ordering is LIFO across blocks and within each Vec. Repeated empty blocks cost recursive retries. (rust/lance-core/src/container/list.rs:76-91)

### Lines 92-108

clear drops all LinkedList blocks and resets len, preserving limit. len returns the stored count. is_empty calls inner.is_empty rather than len==0: with_capacity creates a zero-length list for which is_empty is false, and popping the last element leaves the same discrepancy until an extra pop or clear removes the block. (rust/lance-core/src/container/list.rs:92-108)

### Lines 109-124

size returns (len + spare capacity in the last Vec)*size_of::<T>() + size_of::<Self>() + number_of_blocks*size_of::<Vec<T>>(). The comments describe allocated element capacity and warn that nested heap contents such as String data are absent. The formula counts the complete inline T representation, not a String allocation. It omits LinkedList link-node overhead and allocator overhead; it is an estimate, not exact total retained memory. The formula assumes earlier blocks contribute their live length, not all earlier spare capacity. (rust/lance-core/src/container/list.rs:109-124)

### Lines 125-134

iter returns ExpLinkedListIter::new(self). block_iter maps LinkedList iteration to each Vec slice, preserving block and element insertion order and exposing empty blocks as empty slices. Neither creates copies of T. (rust/lance-core/src/container/list.rs:125-134)

### Lines 135-143

The DeepSizeOf implementation sums each Vec::deep_size_of_children using one mutable context. It includes Vec allocated element capacity and descendant heap estimates, but no explicit Vec-header or LinkedList-node accounting. The default trait method separately adds size_of_val(self). See the Vec rule and trait default in rust/lance-core/src/deepsize.rs:38-44 and rust/lance-core/src/deepsize.rs:166-174. (rust/lance-core/src/container/list.rs:135-143)

### Lines 144-156

FromIterator takes the iterator lower size_hint bound as first block capacity when positive, otherwise one, then pushes each item. It always allocates a block through with_capacity, so even collecting an empty iterator yields len=0 but is_empty=false. The default growth limit remains zero. A misleading upstream lower bound can affect allocation size; no extra cap is applied. (rust/lance-core/src/container/list.rs:144-156)

### Lines 157-167

PartialEq requires T:PartialEq, zips both borrowed iterators, and returns all element comparisons true. It never compares lengths: equal prefixes of different lengths compare equal, and any empty list compares equal to any other list. Eq is nevertheless implemented for T:Eq. Static consequence: [1,2]==[1] and [1]==[1,3], while [1,2]!=[1,3], violating equivalence transitivity. This is current code behavior, not the expected list-equality contract or an executed regression. (rust/lance-core/src/container/list.rs:157-167)

### Lines 168-183

Public ExpLinkedListIter stores private linked-block iterator, optional current slice iterator and the initial total len. Its public new constructor borrows the list, starts without a current block and copies the element count. The borrow enforces source lifetime and forbids ordinary concurrent mutation through that shared reference. (rust/lance-core/src/container/list.rs:168-183)

### Lines 184-204

Iterator Item is &'a T. next first tries the current slice, then installs the next block iterator and recursively retries, skipping exhausted/empty blocks; no more blocks returns None. It never decrements the saved len. size_hint always returns (original_len,Some(original_len)), including after yields and exhaustion, so its positive lower bound becomes inaccurate. No ExactSizeIterator implementation is declared here. (rust/lance-core/src/container/list.rs:184-204)

### Lines 205-221

Public ExpLinkedListIntoIter privately owns linked-list IntoIter<Vec<T>>, an optional Vec IntoIter<T>, and the copied original len. Its public new consumes ExpLinkedList and moves the blocks into the iterator; it does not clone items. (rust/lance-core/src/container/list.rs:205-221)

### Lines 222-242

The owned Iterator yields T. It follows the same current-block/next-block recursive progression as the borrowed version and also never updates len. Its size_hint therefore reports the original element count after consumption. Exhausted blocks are advanced past as owned iterators are replaced. (rust/lance-core/src/container/list.rs:222-242)

### Lines 243-251

IntoIterator for ExpLinkedList<T> declares Item=T and IntoIter=ExpLinkedListIntoIter<T>; into_iter consumes self and delegates to the owned constructor. Borrowed traversal is provided by iter; no IntoIterator for &ExpLinkedList is declared in this file. (rust/lance-core/src/container/list.rs:243-251)

### Lines 252-278

The cfg(test) module imports the list and defines shared helper test_exp_linked_list: require 100 elements/nonempty, pop 50 items from 99 down to 50, verify len=50 and forward iteration over 0..50, clear, then assert len=0/is_empty and pop=None. The helper is not itself marked test. (rust/lance-core/src/container/list.rs:252-278)

### Lines 279-288

test_exp_linked_list_basic creates new, pushes 0..100 while checking length after every push, then invokes the shared helper. It exercises default block growth indirectly, not exact per-block capacities. (rust/lance-core/src/container/list.rs:279-288)

### Lines 289-294

test_exp_linked_list_from collects 0..100 through FromIterator and invokes the helper, covering nonempty preallocation and retained element order. (rust/lance-core/src/container/list.rs:289-294)

### Lines 295-306

test_exp_linked_list_with_capacity_limit sets ten, pushes 100 values with count checks, asserts the last Vec capacity equals ten, then invokes the helper. It does not test existing oversized/zero-capacity blocks, equality with unequal lengths, size_hint after advancement, or len=0 with retained blocks. All tests were read, not executed. (rust/lance-core/src/container/list.rs:295-306)

## Interaction and interpretation limits

Exact local API and calls are retained above and in the symbol index. Whole-repository list consumers remain unreviewed. The equality, emptiness and iterator-hint edge cases are deductions from this file, not confirmed production failures. Memory methods have different accounting formulas. (rust/lance-core/src/container/list.rs:92-167; rust/lance-core/src/container/list.rs:184-251)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::collections::LinkedList;
    5 | 
    6 | use crate::deepsize::DeepSizeOf;
    7 | 
    8 | /// A linked list that grows exponentially. It is used to store a large number of
    9 | /// elements in a memory-efficient way. The list grows by doubling the capacity of
   10 | /// the last element when it's full, the capacity can be limited by the `limit`
   11 | /// parameter. The default value is 0, which means no limit.
   12 | #[derive(Debug, Clone, Default)]
   13 | pub struct ExpLinkedList<T> {
   14 |     inner: LinkedList<Vec<T>>,
   15 |     len: usize,
   16 |     // The maximum capacity of single node in the list.
   17 |     // If the limit is 0, there is no limit.
   18 |     // We use u16 to save memory because ExpLinkedList should not
   19 |     // be used if the limit is that large.
   20 |     limit: u16,
   21 | }
   22 | 
   23 | impl<T> ExpLinkedList<T> {
   24 |     /// Creates a new empty `ExpLinkedList`.
   25 |     pub fn new() -> Self {
   26 |         Self {
   27 |             inner: LinkedList::new(),
   28 |             len: 0,
   29 |             limit: 0,
   30 |         }
   31 |     }
   32 | 
   33 |     pub fn with_capacity(capacity: usize) -> Self {
   34 |         let mut inner = LinkedList::new();
   35 |         inner.push_back(Vec::with_capacity(capacity));
   36 |         Self {
   37 |             inner,
   38 |             len: 0,
   39 |             limit: 0,
   40 |         }
   41 |     }
   42 | 
   43 |     /// Creates a new `ExpLinkedList` with a specified capacity limit.
   44 |     /// The limit is the maximum capacity of a single node in the list.
   45 |     /// If the limit is 0, there is no limit.
   46 |     pub fn with_capacity_limit(mut self, limit: u16) -> Self {
   47 |         self.limit = limit;
   48 |         self
   49 |     }
   50 | 
   51 |     /// Pushes a new element into the list. If the last element in the list
   52 |     /// reaches its capacity, a new node is created with double capacity.
   53 |     pub fn push(&mut self, v: T) {
   54 |         match self.inner.back() {
   55 |             Some(last) => {
   56 |                 if last.len() == last.capacity() {
   57 |                     let new_cap = if self.limit > 0 && last.capacity() * 2 >= self.limit as usize {
   58 |                         self.limit as usize
   59 |                     } else {
   60 |                         last.capacity() * 2
   61 |                     };
   62 |                     self.inner.push_back(Vec::with_capacity(new_cap));
   63 |                 }
   64 |             }
   65 |             None => {
   66 |                 self.inner.push_back(Vec::with_capacity(1));
   67 |             }
   68 |         }
   69 |         self.do_push(v);
   70 |     }
   71 | 
   72 |     fn do_push(&mut self, v: T) {
   73 |         self.inner.back_mut().unwrap().push(v);
   74 |         self.len += 1;
   75 |     }
   76 | 
   77 |     /// Removes the last element from the list.
   78 |     pub fn pop(&mut self) -> Option<T> {
   79 |         match self.inner.back_mut() {
   80 |             Some(last) => {
   81 |                 if last.is_empty() {
   82 |                     self.inner.pop_back();
   83 |                     self.pop()
   84 |                 } else {
   85 |                     self.len -= 1;
   86 |                     last.pop()
   87 |                 }
   88 |             }
   89 |             None => None,
   90 |         }
   91 |     }
   92 | 
   93 |     /// Clears the list, removing all elements.
   94 |     /// This will free the memory used by the list.
   95 |     pub fn clear(&mut self) {
   96 |         self.inner.clear();
   97 |         self.len = 0;
   98 |     }
   99 | 
  100 |     /// Returns the number of elements in the list.
  101 |     pub fn len(&self) -> usize {
  102 |         self.len
  103 |     }
  104 | 
  105 |     /// Returns whether the list is empty.
  106 |     pub fn is_empty(&self) -> bool {
  107 |         self.inner.is_empty()
  108 |     }
  109 | 
  110 |     /// Returns the size of list, including the size of the elements and the
  111 |     /// size of the list itself, and the unused space.
  112 |     /// The element size is calculated using `std::mem::size_of::<T>()`,
  113 |     /// so it is not accurate for all types.
  114 |     /// For example, for `String`, it will return the size of the pointer,
  115 |     /// not the size of the string itself. For that you need to use `DeepSizeOf`.
  116 |     pub fn size(&self) -> usize {
  117 |         let unused_space = match self.inner.back() {
  118 |             Some(last) => last.capacity() - last.len(),
  119 |             None => 0,
  120 |         };
  121 |         (self.len() + unused_space) * std::mem::size_of::<T>()
  122 |             + std::mem::size_of::<Self>()
  123 |             + self.inner.len() * std::mem::size_of::<Vec<T>>()
  124 |     }
  125 | 
  126 |     /// Returns an iterator over the elements in the list.
  127 |     pub fn iter(&self) -> ExpLinkedListIter<'_, T> {
  128 |         ExpLinkedListIter::new(self)
  129 |     }
  130 | 
  131 |     pub fn block_iter(&self) -> impl Iterator<Item = &[T]> {
  132 |         self.inner.iter().map(|v| v.as_slice())
  133 |     }
  134 | }
  135 | 
  136 | impl<T: DeepSizeOf> DeepSizeOf for ExpLinkedList<T> {
  137 |     fn deep_size_of_children(&self, context: &mut crate::deepsize::Context) -> usize {
  138 |         self.inner
  139 |             .iter()
  140 |             .map(|v| v.deep_size_of_children(context))
  141 |             .sum()
  142 |     }
  143 | }
  144 | 
  145 | impl<T> FromIterator<T> for ExpLinkedList<T> {
  146 |     fn from_iter<I: IntoIterator<Item = T>>(iter: I) -> Self {
  147 |         let iter = iter.into_iter();
  148 |         let size_hint = iter.size_hint().0;
  149 |         let cap = if size_hint > 0 { size_hint } else { 1 };
  150 |         let mut list = Self::with_capacity(cap);
  151 |         for item in iter {
  152 |             list.push(item);
  153 |         }
  154 |         list
  155 |     }
  156 | }
  157 | 
  158 | impl<T> PartialEq for ExpLinkedList<T>
  159 | where
  160 |     T: PartialEq,
  161 | {
  162 |     fn eq(&self, other: &Self) -> bool {
  163 |         self.iter().zip(other.iter()).all(|(a, b)| a == b)
  164 |     }
  165 | }
  166 | 
  167 | impl<T> Eq for ExpLinkedList<T> where T: Eq {}
  168 | 
  169 | pub struct ExpLinkedListIter<'a, T> {
  170 |     inner: std::collections::linked_list::Iter<'a, Vec<T>>,
  171 |     inner_iter: Option<std::slice::Iter<'a, T>>,
  172 |     len: usize,
  173 | }
  174 | 
  175 | impl<'a, T> ExpLinkedListIter<'a, T> {
  176 |     pub fn new(inner: &'a ExpLinkedList<T>) -> Self {
  177 |         Self {
  178 |             inner: inner.inner.iter(),
  179 |             inner_iter: None,
  180 |             len: inner.len(),
  181 |         }
  182 |     }
  183 | }
  184 | 
  185 | impl<'a, T> Iterator for ExpLinkedListIter<'a, T> {
  186 |     type Item = &'a T;
  187 | 
  188 |     fn next(&mut self) -> Option<Self::Item> {
  189 |         if let Some(inner_iter) = &mut self.inner_iter
  190 |             && let Some(v) = inner_iter.next()
  191 |         {
  192 |             return Some(v);
  193 |         }
  194 |         if let Some(inner) = self.inner.next() {
  195 |             self.inner_iter = Some(inner.iter());
  196 |             return self.next();
  197 |         }
  198 |         None
  199 |     }
  200 | 
  201 |     fn size_hint(&self) -> (usize, Option<usize>) {
  202 |         (self.len, Some(self.len))
  203 |     }
  204 | }
  205 | 
  206 | pub struct ExpLinkedListIntoIter<T> {
  207 |     inner: std::collections::linked_list::IntoIter<Vec<T>>,
  208 |     inner_iter: Option<std::vec::IntoIter<T>>,
  209 |     len: usize,
  210 | }
  211 | 
  212 | impl<T> ExpLinkedListIntoIter<T> {
  213 |     pub fn new(list: ExpLinkedList<T>) -> Self {
  214 |         let len = list.len();
  215 |         Self {
  216 |             inner: list.inner.into_iter(),
  217 |             inner_iter: None,
  218 |             len,
  219 |         }
  220 |     }
  221 | }
  222 | 
  223 | impl<T> Iterator for ExpLinkedListIntoIter<T> {
  224 |     type Item = T;
  225 | 
  226 |     fn next(&mut self) -> Option<Self::Item> {
  227 |         if let Some(inner_iter) = &mut self.inner_iter
  228 |             && let Some(v) = inner_iter.next()
  229 |         {
  230 |             return Some(v);
  231 |         }
  232 |         if let Some(inner) = self.inner.next() {
  233 |             self.inner_iter = Some(inner.into_iter());
  234 |             return self.next();
  235 |         }
  236 |         None
  237 |     }
  238 | 
  239 |     fn size_hint(&self) -> (usize, Option<usize>) {
  240 |         (self.len, Some(self.len))
  241 |     }
  242 | }
  243 | 
  244 | impl<T> IntoIterator for ExpLinkedList<T> {
  245 |     type Item = T;
  246 |     type IntoIter = ExpLinkedListIntoIter<T>;
  247 | 
  248 |     fn into_iter(self) -> Self::IntoIter {
  249 |         ExpLinkedListIntoIter::new(self)
  250 |     }
  251 | }
  252 | 
  253 | #[cfg(test)]
  254 | mod tests {
  255 |     use super::*;
  256 | 
  257 |     fn test_exp_linked_list(list: &mut ExpLinkedList<usize>) {
  258 |         assert_eq!(list.len(), 100);
  259 |         assert!(!list.is_empty());
  260 | 
  261 |         // removes the last 50 elements
  262 |         for i in 0..50 {
  263 |             assert_eq!(list.pop(), Some(99 - i));
  264 |         }
  265 |         assert_eq!(list.len(), 50);
  266 |         assert!(!list.is_empty());
  267 | 
  268 |         // iterate over the list
  269 |         for (i, v) in list.iter().enumerate() {
  270 |             assert_eq!(*v, i);
  271 |         }
  272 | 
  273 |         // clear the list
  274 |         list.clear();
  275 |         assert_eq!(list.len(), 0);
  276 |         assert!(list.is_empty());
  277 |         assert_eq!(list.pop(), None);
  278 |     }
  279 | 
  280 |     #[test]
  281 |     fn test_exp_linked_list_basic() {
  282 |         let mut list = ExpLinkedList::new();
  283 |         for i in 0..100 {
  284 |             list.push(i);
  285 |             assert_eq!(list.len(), i + 1);
  286 |         }
  287 |         test_exp_linked_list(&mut list);
  288 |     }
  289 | 
  290 |     #[test]
  291 |     fn test_exp_linked_list_from() {
  292 |         let mut list = (0..100).collect();
  293 |         test_exp_linked_list(&mut list);
  294 |     }
  295 | 
  296 |     #[test]
  297 |     fn test_exp_linked_list_with_capacity_limit() {
  298 |         let mut list = ExpLinkedList::new().with_capacity_limit(10);
  299 |         for i in 0..100 {
  300 |             list.push(i);
  301 |             assert_eq!(list.len(), i + 1);
  302 |         }
  303 |         assert_eq!(list.inner.back().unwrap().capacity(), 10);
  304 |         test_exp_linked_list(&mut list);
  305 |     }
  306 | }
``````
