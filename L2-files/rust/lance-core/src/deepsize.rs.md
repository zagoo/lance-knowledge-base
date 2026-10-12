> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/src/deepsize.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `86f98d70a52e8ef5208a3b1bf66373c2911bef4c9dee3c6433eaab6efd608143`. Reviewed physical lines: 1-467.

[Module](../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public deep-memory-estimation trait and pointer-deduplication context, derive-macro re-export, standard-library/Arrow implementations, private recursive Arrow-buffer accounting, and local tests. (rust/lance-core/src/deepsize.rs:1-467)

## Complete range analysis

### Lines 1-14

SPDX lines, public re-export of lance_derive::DeepSizeOf in the macro namespace, and imports for size_of/size_of_val, collections, atomics, Arc/locks, Arrow arrays/buffers/data. The same DeepSizeOf spelling is also used for the trait below; derive expansion implementation is in another crate and remains pending. (rust/lance-core/src/deepsize.rs:1-14)

### Lines 15-36

Context is a public struct with a private HashSet<usize> of seen identities. Default calls new; new starts empty. mark_seen(ptr) directly returns set insertion success, true only for a newly inserted integer. The caller supplies pointer identity and a mutable context; there is no reset API or synchronization layer. The context tracking set itself is not charged by these formulas. (rust/lance-core/src/deepsize.rs:15-36)

### Lines 37-44

DeepSizeOf is public. Its default deep_size_of adds size_of_val(self) to deep_size_of_children with a fresh Context; the latter is required and receives mutable traversal state. Separate top-level calls cannot deduplicate against each other. Implementations must count descendant heap storage without recounting their own inline footprint and should propagate the same context when deduplication is intended. (rust/lance-core/src/deepsize.rs:37-44)

### Lines 45-76

Private impl_deep_size_primitive macro emits trait implementations returning zero children. The invocation covers u8/u16/u32/u64/u128/usize, i8/i16/i32/i64/i128/isize, f32/f64, bool and (). This list excludes char and other numeric wrappers; their support is not implied by the macro. Their inline size still comes from the default method. (rust/lance-core/src/deepsize.rs:45-76)

### Lines 77-88

str reports zero child storage because its dynamically sized bytes are its own size_of_val; String reports capacity, not current length, as heap children. Thus direct str and owned String accounting use different ownership boundaries. (rust/lance-core/src/deepsize.rs:77-88)

### Lines 89-98

bytes::Bytes uses as_ptr as a usize key. On first sight it charges self.len(), otherwise zero. This is exact start-pointer deduplication, not underlying-allocation identity or capacity accounting: distinct offsets can be counted separately and equal-start views of different lengths are sensitive to visitation order. These limitations follow from the key/formula; external Bytes allocation details are not reviewed here. (rust/lance-core/src/deepsize.rs:89-98)

### Lines 99-110

AtomicU64 and AtomicUsize both return zero children without loading their stored numeric value. The top-level default counts their inline representation. No other atomic type implementation is present in this range. (rust/lance-core/src/deepsize.rs:99-110)

### Lines 111-129

Fixed [T;N] and dynamically sized [T] sum only element child sizes using the same context; inline elements are already counted by the owner or size_of_val. Slice comments explicitly identify Box<[T]> and Arc<[T]> as owners that count slice bytes; adding those bytes again in the slice implementation would double-count them. (rust/lance-core/src/deepsize.rs:111-129)

### Lines 130-145

RwLock<T> obtains a read guard and Mutex<T> an exclusive guard, then delegates to protected T children. A poisoned-lock Err returns zero, silently undercounting children. These are blocking lock acquisitions with no timeout and no Result returned; memory estimation can wait on contention or deadlock under an incompatible already-held lock. The lock wrapper inline footprint comes from its owner/default method. (rust/lance-core/src/deepsize.rs:130-145)

### Lines 146-164

Private impl_deep_size_tuple macro emits generic implementations requiring every tuple component DeepSizeOf, destructures self under allow(non_snake_case), and sums each component children. Invocations cover tuple arities two through six only. The tuple inline layout/padding is counted by its owning object/default method, not by this sum. (rust/lance-core/src/deepsize.rs:146-164)

### Lines 165-174

Vec<T> charges capacity*size_of::<T>() plus children of live elements only. Uninitialized spare capacity contributes bytes but is not traversed. The Vec header is counted at the enclosing inline boundary. Arithmetic is ordinary usize multiplication/addition, with no overflow handling. (rust/lance-core/src/deepsize.rs:165-174)

### Lines 175-190

Box<T:?Sized> always charges pointee size_of_val plus pointee children. Arc<T:?Sized> first casts its data pointer through *const () to usize (discarding metadata), deduplicates it, and only on first sight charges pointee size plus children. Arc control-block/refcount and allocator overhead are not explicitly counted. Marking before recursive descent permits repeated Arc identities to be skipped; this is not general graph-cycle detection for arbitrary custom implementations. (rust/lance-core/src/deepsize.rs:175-190)

### Lines 191-199

Option<T> delegates to Some inner children or returns zero for None. The discriminant and inline T storage are left to the parent/default footprint rather than counted again. (rust/lance-core/src/deepsize.rs:191-199)

### Lines 200-212

HashMap<K,V,S> supports any hasher type parameter and estimates backing storage as capacity*(size_of::<K>()+size_of::<V>()+1), then adds live key/value children. The comment calls the one-byte term approximate control metadata and notes capacity/buckets; the code uses reported capacity directly. Alignment, allocator overhead and exact table layout are not measured, so this is an estimate. (rust/lance-core/src/deepsize.rs:200-212)

### Lines 213-220

HashSet<K> (default hasher form) estimates capacity*(size_of::<K>()+1) plus live key children. It does not define the generic-S HashSet implementation analogous to HashMap. The one-byte overhead is approximate. (rust/lance-core/src/deepsize.rs:213-220)

### Lines 221-242

BTreeMap estimates len*(size_of::<K>()+size_of::<V>()+3*size_of::<usize>()) plus live key/value children. BTreeSet uses len*(size_of::<K>()+3*size_of::<usize>()) plus live key children. Comments motivate roughly three pointer words per entry based on an average B-tree node. These formulas do not inspect actual node count, node occupancy or allocations. (rust/lance-core/src/deepsize.rs:221-242)

### Lines 243-263

Private record_array_data walks every data buffer, adding its capacity if its as_ptr integer is first seen; it similarly accounts for the null bit-buffer obtained through inner().inner(), then recursively visits child_data. The shared Context deduplicates identical start addresses across descendants. No explicit ArrayData metadata or child-vector allocation charge is added. (rust/lance-core/src/deepsize.rs:243-263)

### Lines 264-273

The dyn Array implementation calls to_data and delegates to record_array_data. The comment describes to_data as cloning Arcs rather than data bytes and says this creates a small O(number of buffers) metadata cost; that is the source comment, not an independently verified property of every dependency Array implementation. The returned estimate accounts for the traversed buffers. (rust/lance-core/src/deepsize.rs:264-273)

### Lines 274-282

RecordBatch sums deep_size_of_children for each column Arc with one context. It has no explicit charge here for its column-vector allocation or schema metadata. Default deep_size_of separately counts the inline RecordBatch. Sharing the same Array Arc across columns is deduplicated by Arc accounting before buffer traversal. (rust/lance-core/src/deepsize.rs:274-282)

### Lines 283-299

ScalarBuffer<T> is implemented where T:ArrowNativeType. It obtains the inner Buffer, deduplicates as_ptr, and charges capacity only once. The comment chooses capacity rather than slice length because sliced buffers retain backing storage; the implementation key is still a start pointer, not an owning-allocation identifier. Changed start pointers can therefore defeat same-key deduplication. (rust/lance-core/src/deepsize.rs:283-299)

### Lines 300-318

The cfg(test) module imports Arrow fixtures and the local trait/context. test_basic_record_batch makes one Int32 column [1,2,3] and asserts deep size >=12 bytes. It verifies a lower bound, not exact RecordBatch metadata accounting. (rust/lance-core/src/deepsize.rs:300-318)

### Lines 319-336

test_same_batch_dedup uses one Context for repeated RecordBatch child-size calls; first must be positive, second exactly zero. The test deliberately avoids fresh-context deep_size_of, demonstrating traversal-local deduplication. (rust/lance-core/src/deepsize.rs:319-336)

### Lines 337-355

test_arc_dedup clones an Arc<RecordBatch>, then measures both with the same Context and requires first positive, second zero. This exercises shared batch identity before child traversal. (rust/lance-core/src/deepsize.rs:337-355)

### Lines 356-385

test_multi_column_shared_array places two clones of the same Int32 Array Arc in a two-column batch and compares its child estimate with a one-column batch measured using a separate Context. Equality proves the tested shared-array case is counted once; it does not prove equality of complete allocated batch sizes. (rust/lance-core/src/deepsize.rs:356-385)

### Lines 386-418

test_nested_struct_array constructs Int32 and String children under one StructArray in a RecordBatch. It requires deep size >12, a weak traversal lower bound rather than an exact byte total or proof of every child-buffer contribution. (rust/lance-core/src/deepsize.rs:386-418)

### Lines 419-437

test_std_types checks exact inline u32 size, String >=header+5, Vec<u32> >=header+three u32 element sizes, and Arc<u32> children four then zero in one Context. Lower-bound assertions permit extra capacity/overhead; the Arc test isolates identity deduplication. (rust/lance-core/src/deepsize.rs:419-437)

### Lines 438-467

test_derive_macro imports the derive macro, defines local Outer {count:u64,label:String,inner:Inner} and Inner {values:Vec<u32>} with derives, then requires size >=size_of::<Outer>()+5+12 for the constructed fixture. It tests macro usability/recursive heap accounting at a lower bound, not the macro implementation itself. No local cases validate Bytes aliases, scalar-buffer offset aliases, poisoned locks or collection-estimate accuracy. Tests were read, not executed. (rust/lance-core/src/deepsize.rs:438-467)

## Interaction and interpretation limits

This file defines estimates, not allocator instrumentation. Derive expansion and cache policy consumers remain pending; changing estimates may affect those consumers but their thresholds are not inferred here. Shared context behavior and approximate formulas are established locally. (rust/lance-core/src/deepsize.rs:15-44; rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/deepsize.rs:130-145; rust/lance-core/src/deepsize.rs:200-299)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub use lance_derive::DeepSizeOf;
    5 | 
    6 | use std::collections::{BTreeMap, BTreeSet, HashMap, HashSet};
    7 | use std::mem::{size_of, size_of_val};
    8 | use std::sync::atomic::{AtomicU64, AtomicUsize};
    9 | use std::sync::{Arc, Mutex, RwLock};
   10 | 
   11 | use arrow_array::{Array, RecordBatch};
   12 | use arrow_buffer::ArrowNativeType;
   13 | use arrow_data::ArrayData;
   14 | 
   15 | pub struct Context {
   16 |     seen: HashSet<usize>,
   17 | }
   18 | 
   19 | impl Default for Context {
   20 |     fn default() -> Self {
   21 |         Self::new()
   22 |     }
   23 | }
   24 | 
   25 | impl Context {
   26 |     pub fn new() -> Self {
   27 |         Self {
   28 |             seen: HashSet::new(),
   29 |         }
   30 |     }
   31 | 
   32 |     /// Returns true if this pointer was NOT previously seen (i.e., it's new).
   33 |     pub fn mark_seen(&mut self, ptr: usize) -> bool {
   34 |         self.seen.insert(ptr)
   35 |     }
   36 | }
   37 | 
   38 | pub trait DeepSizeOf {
   39 |     fn deep_size_of(&self) -> usize {
   40 |         size_of_val(self) + self.deep_size_of_children(&mut Context::new())
   41 |     }
   42 | 
   43 |     fn deep_size_of_children(&self, context: &mut Context) -> usize;
   44 | }
   45 | 
   46 | // Primitives — no heap children
   47 | macro_rules! impl_deep_size_primitive {
   48 |     ($($t:ty),*) => {
   49 |         $(
   50 |             impl DeepSizeOf for $t {
   51 |                 fn deep_size_of_children(&self, _context: &mut Context) -> usize {
   52 |                     0
   53 |                 }
   54 |             }
   55 |         )*
   56 |     };
   57 | }
   58 | 
   59 | impl_deep_size_primitive!(
   60 |     u8,
   61 |     u16,
   62 |     u32,
   63 |     u64,
   64 |     u128,
   65 |     usize,
   66 |     i8,
   67 |     i16,
   68 |     i32,
   69 |     i64,
   70 |     i128,
   71 |     isize,
   72 |     f32,
   73 |     f64,
   74 |     bool,
   75 |     ()
   76 | );
   77 | 
   78 | impl DeepSizeOf for str {
   79 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
   80 |         0
   81 |     }
   82 | }
   83 | 
   84 | impl DeepSizeOf for String {
   85 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
   86 |         self.capacity()
   87 |     }
   88 | }
   89 | 
   90 | impl DeepSizeOf for bytes::Bytes {
   91 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
   92 |         if context.mark_seen(self.as_ptr() as usize) {
   93 |             self.len()
   94 |         } else {
   95 |             0
   96 |         }
   97 |     }
   98 | }
   99 | 
  100 | impl DeepSizeOf for AtomicU64 {
  101 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
  102 |         0
  103 |     }
  104 | }
  105 | 
  106 | impl DeepSizeOf for AtomicUsize {
  107 |     fn deep_size_of_children(&self, _context: &mut Context) -> usize {
  108 |         0
  109 |     }
  110 | }
  111 | 
  112 | impl<T: DeepSizeOf, const N: usize> DeepSizeOf for [T; N] {
  113 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  114 |         self.iter()
  115 |             .map(|item| item.deep_size_of_children(context))
  116 |             .sum()
  117 |     }
  118 | }
  119 | 
  120 | impl<T: DeepSizeOf> DeepSizeOf for [T] {
  121 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  122 |         // The slice's own element bytes are accounted for by the owner (e.g. the
  123 |         // `size_of_val` in the `Arc`/`Box` impls); here we only sum the heap
  124 |         // children of each element.
  125 |         self.iter()
  126 |             .map(|item| item.deep_size_of_children(context))
  127 |             .sum()
  128 |     }
  129 | }
  130 | 
  131 | impl<T: DeepSizeOf> DeepSizeOf for RwLock<T> {
  132 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  133 |         self.read()
  134 |             .map(|val| val.deep_size_of_children(context))
  135 |             .unwrap_or(0)
  136 |     }
  137 | }
  138 | 
  139 | impl<T: DeepSizeOf> DeepSizeOf for Mutex<T> {
  140 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  141 |         self.lock()
  142 |             .map(|val| val.deep_size_of_children(context))
  143 |             .unwrap_or(0)
  144 |     }
  145 | }
  146 | 
  147 | // Tuples
  148 | macro_rules! impl_deep_size_tuple {
  149 |     ($($name:ident),+) => {
  150 |         impl<$($name: DeepSizeOf),+> DeepSizeOf for ($($name,)+) {
  151 |             #[allow(non_snake_case)]
  152 |             fn deep_size_of_children(&self, context: &mut Context) -> usize {
  153 |                 let ($($name,)+) = self;
  154 |                 0 $(+ $name.deep_size_of_children(context))+
  155 |             }
  156 |         }
  157 |     };
  158 | }
  159 | 
  160 | impl_deep_size_tuple!(A, B);
  161 | impl_deep_size_tuple!(A, B, C);
  162 | impl_deep_size_tuple!(A, B, C, D);
  163 | impl_deep_size_tuple!(A, B, C, D, E);
  164 | impl_deep_size_tuple!(A, B, C, D, E, F);
  165 | 
  166 | impl<T: DeepSizeOf> DeepSizeOf for Vec<T> {
  167 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  168 |         self.capacity() * size_of::<T>()
  169 |             + self
  170 |                 .iter()
  171 |                 .map(|item| item.deep_size_of_children(context))
  172 |                 .sum::<usize>()
  173 |     }
  174 | }
  175 | 
  176 | impl<T: DeepSizeOf + ?Sized> DeepSizeOf for Box<T> {
  177 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  178 |         size_of_val(&**self) + (**self).deep_size_of_children(context)
  179 |     }
  180 | }
  181 | 
  182 | impl<T: DeepSizeOf + ?Sized> DeepSizeOf for Arc<T> {
  183 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  184 |         if context.mark_seen(Self::as_ptr(self) as *const () as usize) {
  185 |             size_of_val(&**self) + (**self).deep_size_of_children(context)
  186 |         } else {
  187 |             0
  188 |         }
  189 |     }
  190 | }
  191 | 
  192 | impl<T: DeepSizeOf> DeepSizeOf for Option<T> {
  193 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  194 |         match self {
  195 |             Some(val) => val.deep_size_of_children(context),
  196 |             None => 0,
  197 |         }
  198 |     }
  199 | }
  200 | 
  201 | impl<K: DeepSizeOf, V: DeepSizeOf, S> DeepSizeOf for HashMap<K, V, S> {
  202 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  203 |         // Each bucket holds a key-value pair plus hash metadata (~1 byte control per bucket).
  204 |         // Robin hood / Swiss table capacity is always a power of 2.
  205 |         let capacity_bytes = self.capacity() * (size_of::<K>() + size_of::<V>() + 1);
  206 |         let children: usize = self
  207 |             .iter()
  208 |             .map(|(k, v)| k.deep_size_of_children(context) + v.deep_size_of_children(context))
  209 |             .sum();
  210 |         capacity_bytes + children
  211 |     }
  212 | }
  213 | 
  214 | impl<K: DeepSizeOf> DeepSizeOf for HashSet<K> {
  215 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  216 |         let capacity_bytes = self.capacity() * (size_of::<K>() + 1);
  217 |         let children: usize = self.iter().map(|k| k.deep_size_of_children(context)).sum();
  218 |         capacity_bytes + children
  219 |     }
  220 | }
  221 | 
  222 | impl<K: DeepSizeOf, V: DeepSizeOf> DeepSizeOf for BTreeMap<K, V> {
  223 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  224 |         // BTreeMap nodes have ~11 entries each. Rough estimate: per-entry overhead ~3 pointers.
  225 |         let per_entry = size_of::<K>() + size_of::<V>() + 3 * size_of::<usize>();
  226 |         let overhead = self.len() * per_entry;
  227 |         let children: usize = self
  228 |             .iter()
  229 |             .map(|(k, v)| k.deep_size_of_children(context) + v.deep_size_of_children(context))
  230 |             .sum();
  231 |         overhead + children
  232 |     }
  233 | }
  234 | 
  235 | impl<K: DeepSizeOf> DeepSizeOf for BTreeSet<K> {
  236 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  237 |         let per_entry = size_of::<K>() + 3 * size_of::<usize>();
  238 |         let overhead = self.len() * per_entry;
  239 |         let children: usize = self.iter().map(|k| k.deep_size_of_children(context)).sum();
  240 |         overhead + children
  241 |     }
  242 | }
  243 | 
  244 | // Arrow types
  245 | 
  246 | fn record_array_data(context: &mut Context, data: &ArrayData) -> usize {
  247 |     let mut total = 0;
  248 |     for buffer in data.buffers() {
  249 |         if context.mark_seen(buffer.as_ptr() as usize) {
  250 |             total += buffer.capacity();
  251 |         }
  252 |     }
  253 |     if let Some(nulls) = data.nulls() {
  254 |         let null_buf = nulls.inner().inner();
  255 |         if context.mark_seen(null_buf.as_ptr() as usize) {
  256 |             total += null_buf.capacity();
  257 |         }
  258 |     }
  259 |     for child in data.child_data() {
  260 |         total += record_array_data(context, child);
  261 |     }
  262 |     total
  263 | }
  264 | 
  265 | impl DeepSizeOf for dyn Array {
  266 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  267 |         // `to_data()` only clones Arc refs (no data copy) and allocates a small
  268 |         // ArrayData metadata struct. This lets us walk buffer pointers for dedup.
  269 |         // Cost is O(number_of_buffers), not O(data_size).
  270 |         let data = self.to_data();
  271 |         record_array_data(context, &data)
  272 |     }
  273 | }
  274 | 
  275 | impl DeepSizeOf for RecordBatch {
  276 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  277 |         self.columns()
  278 |             .iter()
  279 |             .map(|col| col.deep_size_of_children(context))
  280 |             .sum()
  281 |     }
  282 | }
  283 | 
  284 | impl<T> DeepSizeOf for arrow_buffer::ScalarBuffer<T>
  285 | where
  286 |     T: ArrowNativeType,
  287 | {
  288 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  289 |         // Track the underlying buffer pointer to avoid double-counting shared allocations.
  290 |         // Use capacity() rather than len() * size_of::<T>() because sliced buffers retain
  291 |         // their full original allocation.
  292 |         let buf = self.inner();
  293 |         if context.mark_seen(buf.as_ptr() as usize) {
  294 |             buf.capacity()
  295 |         } else {
  296 |             0
  297 |         }
  298 |     }
  299 | }
  300 | 
  301 | #[cfg(test)]
  302 | mod tests {
  303 |     use super::*;
  304 |     use arrow_array::{Int32Array, StringArray, StructArray};
  305 |     use arrow_schema::{DataType, Field, Fields, Schema};
  306 | 
  307 |     #[test]
  308 |     fn test_basic_record_batch() {
  309 |         let batch = RecordBatch::try_new(
  310 |             Arc::new(Schema::new(vec![Field::new("a", DataType::Int32, false)])),
  311 |             vec![Arc::new(Int32Array::from(vec![1, 2, 3]))],
  312 |         )
  313 |         .unwrap();
  314 | 
  315 |         let size = batch.deep_size_of();
  316 |         // Should at least include the buffer for 3 i32s
  317 |         assert!(size >= 3 * size_of::<i32>());
  318 |     }
  319 | 
  320 |     #[test]
  321 |     fn test_same_batch_dedup() {
  322 |         let batch = RecordBatch::try_new(
  323 |             Arc::new(Schema::new(vec![Field::new("a", DataType::Int32, false)])),
  324 |             vec![Arc::new(Int32Array::from(vec![1, 2, 3, 4, 5]))],
  325 |         )
  326 |         .unwrap();
  327 | 
  328 |         let mut ctx = Context::new();
  329 |         let size_a = batch.deep_size_of_children(&mut ctx);
  330 |         let size_b = batch.deep_size_of_children(&mut ctx);
  331 | 
  332 |         // First measurement should report buffer sizes
  333 |         assert!(size_a > 0);
  334 |         // Second measurement of the same batch should add nothing (buffers already seen)
  335 |         assert_eq!(size_b, 0);
  336 |     }
  337 | 
  338 |     #[test]
  339 |     fn test_arc_dedup() {
  340 |         let batch = Arc::new(
  341 |             RecordBatch::try_new(
  342 |                 Arc::new(Schema::new(vec![Field::new("a", DataType::Int32, false)])),
  343 |                 vec![Arc::new(Int32Array::from(vec![1, 2, 3]))],
  344 |             )
  345 |             .unwrap(),
  346 |         );
  347 |         let clone = Arc::clone(&batch);
  348 | 
  349 |         let mut ctx = Context::new();
  350 |         let size_a = batch.deep_size_of_children(&mut ctx);
  351 |         let size_b = clone.deep_size_of_children(&mut ctx);
  352 | 
  353 |         assert!(size_a > 0);
  354 |         assert_eq!(size_b, 0);
  355 |     }
  356 | 
  357 |     #[test]
  358 |     fn test_multi_column_shared_array() {
  359 |         // Two columns pointing to the same Arc<dyn Array>
  360 |         let array: Arc<dyn Array> = Arc::new(Int32Array::from(vec![10, 20, 30]));
  361 |         let schema = Arc::new(Schema::new(vec![
  362 |             Field::new("a", DataType::Int32, false),
  363 |             Field::new("b", DataType::Int32, false),
  364 |         ]));
  365 | 
  366 |         // Single-column batch for reference
  367 |         let one_col = RecordBatch::try_new(
  368 |             Arc::new(Schema::new(vec![Field::new("a", DataType::Int32, false)])),
  369 |             vec![array.clone()],
  370 |         )
  371 |         .unwrap();
  372 | 
  373 |         // Two-column batch with the same Arc shared
  374 |         let two_col = RecordBatch::try_new(schema, vec![array.clone(), array]).unwrap();
  375 | 
  376 |         let mut ctx1 = Context::new();
  377 |         let size_one = one_col.deep_size_of_children(&mut ctx1);
  378 | 
  379 |         let mut ctx2 = Context::new();
  380 |         let size_two = two_col.deep_size_of_children(&mut ctx2);
  381 | 
  382 |         // Both should report the same size since the second column's Arc is
  383 |         // already seen and contributes nothing
  384 |         assert_eq!(size_one, size_two);
  385 |     }
  386 | 
  387 |     #[test]
  388 |     fn test_nested_struct_array() {
  389 |         let int_array = Int32Array::from(vec![1, 2, 3]);
  390 |         let str_array = StringArray::from(vec!["a", "b", "c"]);
  391 |         let struct_array = StructArray::from(vec![
  392 |             (
  393 |                 Arc::new(Field::new("x", DataType::Int32, false)),
  394 |                 Arc::new(int_array) as Arc<dyn Array>,
  395 |             ),
  396 |             (
  397 |                 Arc::new(Field::new("y", DataType::Utf8, false)),
  398 |                 Arc::new(str_array) as Arc<dyn Array>,
  399 |             ),
  400 |         ]);
  401 | 
  402 |         let batch = RecordBatch::try_new(
  403 |             Arc::new(Schema::new(vec![Field::new(
  404 |                 "s",
  405 |                 DataType::Struct(Fields::from(vec![
  406 |                     Field::new("x", DataType::Int32, false),
  407 |                     Field::new("y", DataType::Utf8, false),
  408 |                 ])),
  409 |                 false,
  410 |             )])),
  411 |             vec![Arc::new(struct_array)],
  412 |         )
  413 |         .unwrap();
  414 | 
  415 |         let size = batch.deep_size_of();
  416 |         // Should include buffers for both child arrays
  417 |         assert!(size > 3 * size_of::<i32>());
  418 |     }
  419 | 
  420 |     #[test]
  421 |     fn test_std_types() {
  422 |         assert_eq!(42u32.deep_size_of(), size_of::<u32>());
  423 | 
  424 |         let s = String::from("hello");
  425 |         assert!(s.deep_size_of() >= size_of::<String>() + 5);
  426 | 
  427 |         let v = vec![1u32, 2, 3];
  428 |         assert!(v.deep_size_of() >= size_of::<Vec<u32>>() + 3 * size_of::<u32>());
  429 | 
  430 |         let a = Arc::new(42u32);
  431 |         let b = Arc::clone(&a);
  432 |         let mut ctx = Context::new();
  433 |         let size_a = a.deep_size_of_children(&mut ctx);
  434 |         let size_b = b.deep_size_of_children(&mut ctx);
  435 |         assert_eq!(size_a, size_of::<u32>());
  436 |         assert_eq!(size_b, 0);
  437 |     }
  438 | 
  439 |     #[test]
  440 |     fn test_derive_macro() {
  441 |         use lance_derive::DeepSizeOf;
  442 | 
  443 |         #[derive(DeepSizeOf)]
  444 |         struct Outer {
  445 |             count: u64,
  446 |             label: String,
  447 |             inner: Inner,
  448 |         }
  449 | 
  450 |         #[derive(DeepSizeOf)]
  451 |         struct Inner {
  452 |             values: Vec<u32>,
  453 |         }
  454 | 
  455 |         let val = Outer {
  456 |             count: 7,
  457 |             label: String::from("hello"),
  458 |             inner: Inner {
  459 |                 values: vec![1, 2, 3],
  460 |             },
  461 |         };
  462 | 
  463 |         let size = val.deep_size_of();
  464 |         // Must be at least the stack size + heap allocations for label + values
  465 |         assert!(size >= std::mem::size_of::<Outer>() + 5 + 3 * std::mem::size_of::<u32>());
  466 |     }
  467 | }
``````
