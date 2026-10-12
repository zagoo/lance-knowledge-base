> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/tests/cache_key_allocations.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `920e2174e312928b268ba6ba77eba6b9aad1c44a5697058e2984b598f4bbd220`. Reviewed physical lines: 1-166.

[Module](../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Integration-test executable with a tracking system allocator that asserts warmed typed key preparation makes zero counted allocation/reallocation calls. (rust/lance-core/tests/cache_key_allocations.rs:1-166)

## Complete range analysis

### Lines 1-19

SPDX/imports bind GlobalAlloc/Layout/System,Cow,Cell,black_box,AtomicUsize/Relaxed and public cache key building APIs. Private TrackingAllocator unit type is paired with const-initialized thread_local Cell<bool> false and process-globalAtomicUsize counter0. Flag isperthread; count issharedprocesswide. (rust/lance-core/tests/cache_key_allocations.rs:1-19)

### Lines 20-25

record_allocation reads TLS with try_with; unavailable/destroyed TLS meansfalse. When trackingtrue it Relaxed fetch_adds1. It records allocation API calls, not allocated bytes or verified successful memory requests. Arithmetic counter can wrap. (rust/lance-core/tests/cache_key_allocations.rs:20-25)

### Lines 26-46

Unsafe GlobalAlloc forwards alloc/alloc_zeroed/realloc toSystem in explicit unsafe blocks after recording; dealloc forwards without recording. Realloc counts even if memory can growinplace and allocation failures would already be counted. It introduces no custom alignment/storage policy and relies on caller/System allocator contracts. (rust/lance-core/tests/cache_key_allocations.rs:26-46)

### Lines 47-58

global_allocator attribute installs TrackingAllocator for this integration-test binary. measured_allocations disablescurrentthreadflag, zerosglobalcounter, enablesflag, runs FnOnce, disablesflag and readsRelaxedcount. It has no RAII guard: panic can leave tracking enabled; nested measurements disturb outerflag/count, concurrent measuredthreads race through onecounter. Untrackedthreads normally do not addcounts. No synchronization or byte accounting is implied. (rust/lance-core/tests/cache_key_allocations.rs:47-58)

### Lines 59-64

prepare_key is generic over CacheKey and reproduces public canonicalpipeline: KeyBuilder::new(namespace,stable_type_id,schema),key.write_key,finish16-byte result. It never calls backend/get/insert, adds no codec and does not create namespace. (rust/lance-core/tests/cache_key_allocations.rs:59-64)

### Lines 65-92

PageKey stores staticpath,u32column,u64page; ValueTypeu64. key returns borrowedunused sentinel, stable type/schema both allocation-test-page withv1. write_key hashespathstring thenu32/u64. The measured path exercises framedvariable bytes and fixedwidth fields without constructing a logical string. (rust/lance-core/tests/cache_key_allocations.rs:65-92)

### Lines 93-124

OptionalUuidKey storesgenerationu64 andOption<[u8;16]>. ValueTypeu64,keyunused,stable type/schema allocation-test-optional-uuid/v1. write emitsgeneration then Some marker+fixedbytes16 orNone marker; fixedbytes still uses canonical length framing inKeyBuilder. No dynamicUUIDtextconversion occurs. (rust/lance-core/src/cache/key.rs:241-268) (rust/lance-core/tests/cache_key_allocations.rs:93-124)

### Lines 125-143

Only test builds two long namespace segments outsidemeasurement, one realistic index/page path withcolumn17/page42, UUIDgeneration9 containingASCII0123456789abcdef bytes and no-UUIDgeneration10. Names say production-shaped; these are localfixtures, not actual productionkeyimpls or corpus enumeration. (rust/lance-core/tests/cache_key_allocations.rs:125-143)

### Lines 144-166

Warm prepare_key for allthree shapes underblack_box before counting. Then three separate measuredclosures each prepareonekey and black_box result, asserting count exactly0. There is no repetition matrix, outputdigest assertion, measurement of namespace construction/cold initialization or wholecachebackend. Test ends with trackingfalse on each normalreturn; no runtimepass claim. (rust/lance-core/tests/cache_key_allocations.rs:144-166)

## Interaction and interpretation limits

Source test covers three fixed typed key shapes after warmup on the measuring thread. It does not prove all cache operations, namespace setup, cold BLAKE3 initialization, all targets or production call paths are allocation-free. Global counter/thread-local switch are not nested/concurrent measurement-safe. No test execution was performed. (rust/lance-core/tests/cache_key_allocations.rs:14-57; rust/lance-core/tests/cache_key_allocations.rs:125-166)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::alloc::{GlobalAlloc, Layout, System};
    5 | use std::borrow::Cow;
    6 | use std::cell::Cell;
    7 | use std::hint::black_box;
    8 | use std::sync::atomic::{AtomicUsize, Ordering};
    9 | 
   10 | use lance_core::cache::{CacheKey, CacheKeySchema, CacheNamespace, InternalCacheKey, KeyBuilder};
   11 | 
   12 | struct TrackingAllocator;
   13 | 
   14 | thread_local! {
   15 |     static TRACK_ALLOCATIONS: Cell<bool> = const { Cell::new(false) };
   16 | }
   17 | 
   18 | static ALLOCATION_COUNT: AtomicUsize = AtomicUsize::new(0);
   19 | 
   20 | fn record_allocation() {
   21 |     if TRACK_ALLOCATIONS.try_with(Cell::get).unwrap_or(false) {
   22 |         ALLOCATION_COUNT.fetch_add(1, Ordering::Relaxed);
   23 |     }
   24 | }
   25 | 
   26 | unsafe impl GlobalAlloc for TrackingAllocator {
   27 |     unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
   28 |         record_allocation();
   29 |         unsafe { System.alloc(layout) }
   30 |     }
   31 | 
   32 |     unsafe fn alloc_zeroed(&self, layout: Layout) -> *mut u8 {
   33 |         record_allocation();
   34 |         unsafe { System.alloc_zeroed(layout) }
   35 |     }
   36 | 
   37 |     unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
   38 |         unsafe { System.dealloc(ptr, layout) }
   39 |     }
   40 | 
   41 |     unsafe fn realloc(&self, ptr: *mut u8, layout: Layout, new_size: usize) -> *mut u8 {
   42 |         record_allocation();
   43 |         unsafe { System.realloc(ptr, layout, new_size) }
   44 |     }
   45 | }
   46 | 
   47 | #[global_allocator]
   48 | static ALLOCATOR: TrackingAllocator = TrackingAllocator;
   49 | 
   50 | fn measured_allocations(operation: impl FnOnce()) -> usize {
   51 |     TRACK_ALLOCATIONS.with(|tracking| tracking.set(false));
   52 |     ALLOCATION_COUNT.store(0, Ordering::Relaxed);
   53 |     TRACK_ALLOCATIONS.with(|tracking| tracking.set(true));
   54 |     operation();
   55 |     TRACK_ALLOCATIONS.with(|tracking| tracking.set(false));
   56 |     ALLOCATION_COUNT.load(Ordering::Relaxed)
   57 | }
   58 | 
   59 | fn prepare_key<K: CacheKey>(namespace: CacheNamespace, key: &K) -> InternalCacheKey {
   60 |     let mut builder = KeyBuilder::new(namespace, K::stable_type_id(), K::schema());
   61 |     key.write_key(&mut builder);
   62 |     builder.finish()
   63 | }
   64 | 
   65 | struct PageKey {
   66 |     path: &'static str,
   67 |     column_index: u32,
   68 |     page_index: u64,
   69 | }
   70 | 
   71 | impl CacheKey for PageKey {
   72 |     type ValueType = u64;
   73 | 
   74 |     fn key(&self) -> Cow<'_, str> {
   75 |         Cow::Borrowed("unused")
   76 |     }
   77 | 
   78 |     fn type_name() -> &'static str {
   79 |         "allocation-test-page"
   80 |     }
   81 | 
   82 |     fn schema() -> CacheKeySchema {
   83 |         CacheKeySchema::new("allocation-test-page", 1)
   84 |     }
   85 | 
   86 |     fn write_key(&self, builder: &mut KeyBuilder) {
   87 |         builder.write_str(self.path);
   88 |         builder.write_u32(self.column_index);
   89 |         builder.write_u64(self.page_index);
   90 |     }
   91 | }
   92 | 
   93 | struct OptionalUuidKey {
   94 |     generation: u64,
   95 |     uuid: Option<[u8; 16]>,
   96 | }
   97 | 
   98 | impl CacheKey for OptionalUuidKey {
   99 |     type ValueType = u64;
  100 | 
  101 |     fn key(&self) -> Cow<'_, str> {
  102 |         Cow::Borrowed("unused")
  103 |     }
  104 | 
  105 |     fn type_name() -> &'static str {
  106 |         "allocation-test-optional-uuid"
  107 |     }
  108 | 
  109 |     fn schema() -> CacheKeySchema {
  110 |         CacheKeySchema::new("allocation-test-optional-uuid", 1)
  111 |     }
  112 | 
  113 |     fn write_key(&self, builder: &mut KeyBuilder) {
  114 |         builder.write_u64(self.generation);
  115 |         match self.uuid {
  116 |             Some(uuid) => {
  117 |                 builder.write_some();
  118 |                 builder.write_fixed_bytes(&uuid);
  119 |             }
  120 |             None => builder.write_none(),
  121 |         }
  122 |     }
  123 | }
  124 | 
  125 | #[test]
  126 | fn production_shaped_typed_keys_allocate_nothing_after_warmup() {
  127 |     let namespace = CacheNamespace::root()
  128 |         .child("tenant-with-a-long-stable-identifier")
  129 |         .child("index-with-a-long-stable-identifier");
  130 |     let page = PageKey {
  131 |         path: "indices/01999f62-c3c2-7d6f-820d-22e7db948f31/pages/000000000042.lance",
  132 |         column_index: 17,
  133 |         page_index: 42,
  134 |     };
  135 |     let uuid = OptionalUuidKey {
  136 |         generation: 9,
  137 |         uuid: Some(*b"0123456789abcdef"),
  138 |     };
  139 |     let no_uuid = OptionalUuidKey {
  140 |         generation: 10,
  141 |         uuid: None,
  142 |     };
  143 | 
  144 |     black_box(prepare_key(namespace, &page));
  145 |     black_box(prepare_key(namespace, &uuid));
  146 |     black_box(prepare_key(namespace, &no_uuid));
  147 | 
  148 |     assert_eq!(
  149 |         measured_allocations(|| {
  150 |             black_box(prepare_key(namespace, &page));
  151 |         }),
  152 |         0
  153 |     );
  154 |     assert_eq!(
  155 |         measured_allocations(|| {
  156 |             black_box(prepare_key(namespace, &uuid));
  157 |         }),
  158 |         0
  159 |     );
  160 |     assert_eq!(
  161 |         measured_allocations(|| {
  162 |             black_box(prepare_key(namespace, &no_uuid));
  163 |         }),
  164 |         0
  165 |     );
  166 | }
``````
