> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-core/benches/cache_keys.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `3e97d3cb612953f97d640bd43e3ba29f3d3364b9ec8d810703a0b6fe228f125b`. Reviewed physical lines: 1-365.

[Module](../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion comparison harness for legacy-shaped text/Arc keys and current typed BLAKE3 keys, namespace derivation, warmed strong/weak gets and bounded rotating insertions. (rust/lance-core/benches/cache_keys.rs:1-365)

## Complete range analysis

### Lines 1-17

SPDX and imports include Any/Cow,BuildHasher/RandomState,black_box,Relaxed AtomicU64,Arc/Weak,async_trait,Criterion macros/IDs,FutureExt and public cache key/handle types. Benchmark uses real Moka through local/current wrappers, not a mock wall-clock model. (rust/lance-core/benches/cache_keys.rs:1-17)

### Lines 18-43

Private PageKey holds column_indexu32/page_indexu64 and implements CacheKey<ValueType=Vec<u8>>. Legacy logical key formats decimal column-page into owned Cow. Stable type bench.Page and schema bench.page-key/v1 are literals; typed writer emitsu32 thenu64. Current typed key construction avoids key() formatting but retains required compatibility method. (rust/lance-core/benches/cache_keys.rs:18-43)

### Lines 44-68

Clone/Eq/Hash/PartialEq LegacyPhysicalKey stores Arc<str> namespace/logical_key and static type name. Erased LegacyEntryValue is Arc<dyn Any+Send+Sync>; Clone LegacyEntry stores value/declared bytes. Private async_trait LegacyBackend:Send+Sync has only get/insert; no coalescing/clear/stat methods. LegacyMokaBackend stores Moka future cache keyed by full legacy key. (rust/lance-core/benches/cache_keys.rs:44-68)

### Lines 69-85

Legacy backend capacity castsusize tou64. Weigher saturating-adds size_of LegacyPhysicalKey, logical string length and entry bytes, converts tou32 orMAX. It excludes namespace allocation/Arc headers and enables support_invalidation_closures despite no invalidation API used later. This differs from current Moka key16 and coarse-unit accounting, so operation comparison changes more than hash representation. (rust/lance-core/benches/cache_keys.rs:69-85)

### Lines 86-98

LegacyBackend impl awaits Moka get and extracts Arc value; insert clones the complete legacy key and wraps declared size, then awaits. It performs no serialization, type validation or metric update at this layer. (rust/lance-core/benches/cache_keys.rs:86-98)

### Lines 99-125

Clone LegacyCache owns backendArc,namespaceArc and separateArc<AtomicU64> counters. Constructor uses empty namespace and zero metrics. Prefix clones backend/counters and allocates a string concatenating currentnamespace+segment+slash without framed-segment escaping, unlike current CacheNamespace hierarchy. This is a local benchmark baseline. (rust/lance-core/benches/cache_keys.rs:99-125)

### Lines 126-144

physical_key allocates formatted logical text via PageKey::key and copies into Arc<str>, clones namespace and assigns type name. insert declares sizeofVec+capacity+twoAtomicU64 sizes (not platform AtomicUsize), invokes trait backend insertion and additionally boxes the returned future via FutureExt beforeawait. Values are Arc<Vec<u8>>. These choices are part of the comparison workload, not exact resident memory. (rust/lance-core/benches/cache_keys.rs:126-144)

### Lines 145-166

Legacy sized get adds an async block plus explicit boxed future around backend get. Absent and failedVec downcast incrementmiss Relaxed; successful downcast increments hit. Wrongtype yieldsNone silently; no logging/recovery. Key preparation occurs within that measured path. (rust/lance-core/benches/cache_keys.rs:145-166)

### Lines 167-184

LegacyWeakCache stores Weak backend plus strong namespace/counterArcs. from downgrades backend and clones those others, so it can retain metrics/namespace after backendexpiry, unlike current weak state. No Clone derive or insertion method here. (rust/lance-core/benches/cache_keys.rs:167-184)

### Lines 185-208

Legacy weak get upgrades backend or returnsNone without metrics, formats/copies logical key, then awaits get and updates Relaxed counters according to absence/downcast. It has no extra explicit boxed async wrapper beyond async_trait backend dispatch. Lifetime holds upgraded backend throughawait. (rust/lance-core/benches/cache_keys.rs:185-208)

### Lines 209-223

benchmark_key_preparation fixes column17/page42, creates one process-random RandomState and two Arc prefixes: dataset and1024 p characters. Criterion group cache_key_preparation precomputes root.child(prefix) outside timed iterations for each case. Comparison includes outer HashMap-style hash in both cases, not just inner key generation. (rust/lance-core/benches/cache_keys.rs:209-223)

### Lines 224-247

Legacy short/long iterations formatlogicalkey, allocateArc logical string, cloneprefix and feed derived Hash legacy key to RandomState::hash_one, black_boxing hash result. blake3_typed uses prederived namespace, constructs KeyBuilder, streamsfields, finishes16bytes and applies same outerhash. Namespace derivation/preallocation are excluded here; hash seed is not fixed across runs. No equality/assertion or timing threshold is included. (rust/lance-core/benches/cache_keys.rs:224-247)

### Lines 248-274

benchmark_namespace_derivation group separately times root creation and child derivation for dataset versus160 p characters, with root/longstring prepared outside child loops. black_box blocks some optimization on results/child inputs; exact compiler effects are not proven. This long length differs from1024 used in key-preparation/cache workloads. (rust/lance-core/benches/cache_keys.rs:248-274)

### Lines 275-295

benchmark_cache_operations uses64KiB capacity and512 rotating key slots; creates Tokio Runtime with unwrap,1024-character prefix, local Legacy and current default Moka caches and live weak handles. Both are warmed with column17/page42,ArcVec32 bytes of1 through runtime.block_on before measurement. No warmup-read/admission assertion is made. (rust/lance-core/benches/cache_keys.rs:275-295)

### Lines 296-313

Criterion async group cache_operations has four strong_warmed_hit/weak_warmed_hit × legacy/fixed cases, using sameRuntime and black_box borrowed hitkey. Their returned Options are not assertedSome. Current facade adds its documented downcast/stat logic; baseline boxing/ownership differs, so numbers would measure whole wrapper paths, not isolate key hashing. (rust/lance-core/benches/cache_keys.rs:296-313)

### Lines 314-334

Prepare16 sharedArcVec values of32bytes before timed insertion and aRelaxedAtomicU64 sequence. Legacy bounded_rotating_insert incrementssequence, uses page=sequence%512,column17,clones values[sequence asusize%16] and awaitsinsert. Sequence/value selection/futureconstruction are part of Criterion routine, while payload allocation is excluded. Cache persists across iterations; key42 can replace warmedentry. (rust/lance-core/benches/cache_keys.rs:314-334)

### Lines 335-358

Current bounded_rotating_insert uses separate atomic sequence and identical page/value rotation but calls insert_with_key. Neither variant creates unbounded distinctkeys or payload allocations eachiteration; finite key count alone does not imply allentries fit64KiB or equal eviction/declared weights. No throughput metric, trial duration or explicit sample count is set here. (rust/lance-core/benches/cache_keys.rs:335-358)

### Lines 359-365

criterion_group benches registers key preparation, namespace derivation and cache operations in that order; criterion_main generates executable harness. Cargo manifest disables builtin bench harness for cache_keys. Generated main/CLI implementation belongs to Criterion dependency. No benchmark executed. (rust/lance-core/Cargo.toml:60-62) (rust/lance-core/benches/cache_keys.rs:359-365)

## Interaction and interpretation limits

This is benchmark source, not a performance result or a historical compatibility fixture. Legacy types are local comparison models; they do not establish the exact behavior of any released old writer/cache. Criterion/Tokio/Moka dependency internals and hardware measurements remain outside this analysis. No benchmark was run. (rust/lance-core/benches/cache_keys.rs:44-207; rust/lance-core/benches/cache_keys.rs:209-365)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::any::Any;
    5 | use std::borrow::Cow;
    6 | use std::hash::{BuildHasher, RandomState};
    7 | use std::hint::black_box;
    8 | use std::sync::atomic::{AtomicU64, Ordering};
    9 | use std::sync::{Arc, Weak};
   10 | 
   11 | use async_trait::async_trait;
   12 | use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
   13 | use futures::FutureExt;
   14 | use lance_core::cache::{
   15 |     CacheKey, CacheKeySchema, CacheNamespace, KeyBuilder, LanceCache, WeakLanceCache,
   16 | };
   17 | 
   18 | struct PageKey {
   19 |     column_index: u32,
   20 |     page_index: u64,
   21 | }
   22 | 
   23 | impl CacheKey for PageKey {
   24 |     type ValueType = Vec<u8>;
   25 | 
   26 |     fn key(&self) -> Cow<'_, str> {
   27 |         format!("{}-{}", self.column_index, self.page_index).into()
   28 |     }
   29 | 
   30 |     fn type_name() -> &'static str {
   31 |         "bench.Page"
   32 |     }
   33 | 
   34 |     fn schema() -> CacheKeySchema {
   35 |         CacheKeySchema::new("bench.page-key", 1)
   36 |     }
   37 | 
   38 |     fn write_key(&self, builder: &mut KeyBuilder) {
   39 |         builder.write_u32(self.column_index);
   40 |         builder.write_u64(self.page_index);
   41 |     }
   42 | }
   43 | 
   44 | #[derive(Clone, Eq, Hash, PartialEq)]
   45 | struct LegacyPhysicalKey {
   46 |     namespace: Arc<str>,
   47 |     logical_key: Arc<str>,
   48 |     type_name: &'static str,
   49 | }
   50 | 
   51 | type LegacyEntryValue = Arc<dyn Any + Send + Sync>;
   52 | 
   53 | #[derive(Clone)]
   54 | struct LegacyEntry {
   55 |     value: LegacyEntryValue,
   56 |     size_bytes: usize,
   57 | }
   58 | 
   59 | #[async_trait]
   60 | trait LegacyBackend: Send + Sync {
   61 |     async fn get(&self, key: &LegacyPhysicalKey) -> Option<LegacyEntryValue>;
   62 |     async fn insert(&self, key: &LegacyPhysicalKey, value: LegacyEntryValue, size_bytes: usize);
   63 | }
   64 | 
   65 | struct LegacyMokaBackend {
   66 |     cache: moka::future::Cache<LegacyPhysicalKey, LegacyEntry>,
   67 | }
   68 | 
   69 | impl LegacyMokaBackend {
   70 |     fn with_capacity(capacity: usize) -> Self {
   71 |         let cache = moka::future::Cache::builder()
   72 |             .max_capacity(capacity as u64)
   73 |             .weigher(|key: &LegacyPhysicalKey, entry: &LegacyEntry| {
   74 |                 std::mem::size_of::<LegacyPhysicalKey>()
   75 |                     .saturating_add(key.logical_key.len())
   76 |                     .saturating_add(entry.size_bytes)
   77 |                     .try_into()
   78 |                     .unwrap_or(u32::MAX)
   79 |             })
   80 |             .support_invalidation_closures()
   81 |             .build();
   82 |         Self { cache }
   83 |     }
   84 | }
   85 | 
   86 | #[async_trait]
   87 | impl LegacyBackend for LegacyMokaBackend {
   88 |     async fn get(&self, key: &LegacyPhysicalKey) -> Option<LegacyEntryValue> {
   89 |         self.cache.get(key).await.map(|entry| entry.value)
   90 |     }
   91 | 
   92 |     async fn insert(&self, key: &LegacyPhysicalKey, value: LegacyEntryValue, size_bytes: usize) {
   93 |         self.cache
   94 |             .insert(key.clone(), LegacyEntry { value, size_bytes })
   95 |             .await;
   96 |     }
   97 | }
   98 | 
   99 | #[derive(Clone)]
  100 | struct LegacyCache {
  101 |     backend: Arc<dyn LegacyBackend>,
  102 |     namespace: Arc<str>,
  103 |     hits: Arc<AtomicU64>,
  104 |     misses: Arc<AtomicU64>,
  105 | }
  106 | 
  107 | impl LegacyCache {
  108 |     fn with_capacity(capacity: usize) -> Self {
  109 |         Self {
  110 |             backend: Arc::new(LegacyMokaBackend::with_capacity(capacity)),
  111 |             namespace: Arc::from(""),
  112 |             hits: Arc::new(AtomicU64::new(0)),
  113 |             misses: Arc::new(AtomicU64::new(0)),
  114 |         }
  115 |     }
  116 | 
  117 |     fn with_key_prefix(&self, segment: &str) -> Self {
  118 |         Self {
  119 |             backend: self.backend.clone(),
  120 |             namespace: Arc::from(format!("{}{segment}/", self.namespace)),
  121 |             hits: self.hits.clone(),
  122 |             misses: self.misses.clone(),
  123 |         }
  124 |     }
  125 | 
  126 |     fn physical_key(&self, key: &PageKey) -> LegacyPhysicalKey {
  127 |         let logical_key = key.key();
  128 |         LegacyPhysicalKey {
  129 |             namespace: self.namespace.clone(),
  130 |             logical_key: Arc::from(logical_key.as_ref()),
  131 |             type_name: PageKey::type_name(),
  132 |         }
  133 |     }
  134 | 
  135 |     async fn insert(&self, key: &PageKey, value: Arc<Vec<u8>>) {
  136 |         let size_bytes = std::mem::size_of::<Vec<u8>>()
  137 |             + value.capacity()
  138 |             + std::mem::size_of::<AtomicU64>() * 2;
  139 |         self.backend
  140 |             .insert(&self.physical_key(key), value, size_bytes)
  141 |             .boxed()
  142 |             .await;
  143 |     }
  144 | 
  145 |     async fn get(&self, key: &PageKey) -> Option<Arc<Vec<u8>>> {
  146 |         async {
  147 |             let Some(value) = self.backend.get(&self.physical_key(key)).await else {
  148 |                 self.misses.fetch_add(1, Ordering::Relaxed);
  149 |                 return None;
  150 |             };
  151 |             match value.downcast::<Vec<u8>>() {
  152 |                 Ok(value) => {
  153 |                     self.hits.fetch_add(1, Ordering::Relaxed);
  154 |                     Some(value)
  155 |                 }
  156 |                 Err(_) => {
  157 |                     self.misses.fetch_add(1, Ordering::Relaxed);
  158 |                     None
  159 |                 }
  160 |             }
  161 |         }
  162 |         .boxed()
  163 |         .await
  164 |     }
  165 | }
  166 | 
  167 | struct LegacyWeakCache {
  168 |     backend: Weak<dyn LegacyBackend>,
  169 |     namespace: Arc<str>,
  170 |     hits: Arc<AtomicU64>,
  171 |     misses: Arc<AtomicU64>,
  172 | }
  173 | 
  174 | impl LegacyWeakCache {
  175 |     fn from(cache: &LegacyCache) -> Self {
  176 |         Self {
  177 |             backend: Arc::downgrade(&cache.backend),
  178 |             namespace: cache.namespace.clone(),
  179 |             hits: cache.hits.clone(),
  180 |             misses: cache.misses.clone(),
  181 |         }
  182 |     }
  183 | 
  184 |     async fn get(&self, key: &PageKey) -> Option<Arc<Vec<u8>>> {
  185 |         let backend = self.backend.upgrade()?;
  186 |         let logical_key = key.key();
  187 |         let physical_key = LegacyPhysicalKey {
  188 |             namespace: self.namespace.clone(),
  189 |             logical_key: Arc::from(logical_key.as_ref()),
  190 |             type_name: PageKey::type_name(),
  191 |         };
  192 |         let Some(value) = backend.get(&physical_key).await else {
  193 |             self.misses.fetch_add(1, Ordering::Relaxed);
  194 |             return None;
  195 |         };
  196 |         match value.downcast::<Vec<u8>>() {
  197 |             Ok(value) => {
  198 |                 self.hits.fetch_add(1, Ordering::Relaxed);
  199 |                 Some(value)
  200 |             }
  201 |             Err(_) => {
  202 |                 self.misses.fetch_add(1, Ordering::Relaxed);
  203 |                 None
  204 |             }
  205 |         }
  206 |     }
  207 | }
  208 | 
  209 | fn benchmark_key_preparation(c: &mut Criterion) {
  210 |     let key = PageKey {
  211 |         column_index: 17,
  212 |         page_index: 42,
  213 |     };
  214 |     let outer_hashes = RandomState::new();
  215 |     let prefixes: [(&str, Arc<str>); 2] = [
  216 |         ("short", Arc::from("dataset")),
  217 |         ("long", Arc::from("p".repeat(1024))),
  218 |     ];
  219 |     let mut group = c.benchmark_group("cache_key_preparation");
  220 | 
  221 |     for (case, prefix) in prefixes {
  222 |         let namespace = CacheNamespace::root().child(&prefix);
  223 | 
  224 |         group.bench_with_input(BenchmarkId::new("legacy", case), &prefix, |b, prefix| {
  225 |             b.iter(|| {
  226 |                 let logical_key = key.key();
  227 |                 let physical_key = LegacyPhysicalKey {
  228 |                     namespace: Arc::clone(prefix),
  229 |                     logical_key: Arc::from(logical_key.as_ref()),
  230 |                     type_name: PageKey::type_name(),
  231 |                 };
  232 |                 black_box(outer_hashes.hash_one(physical_key))
  233 |             })
  234 |         });
  235 | 
  236 |         group.bench_function(BenchmarkId::new("blake3_typed", case), |b| {
  237 |             b.iter(|| {
  238 |                 let mut builder =
  239 |                     KeyBuilder::new(namespace, PageKey::stable_type_id(), PageKey::schema());
  240 |                 key.write_key(&mut builder);
  241 |                 black_box(outer_hashes.hash_one(builder.finish()))
  242 |             })
  243 |         });
  244 |     }
  245 | 
  246 |     group.finish();
  247 | }
  248 | 
  249 | fn benchmark_namespace_derivation(c: &mut Criterion) {
  250 |     let root = CacheNamespace::root();
  251 |     let long_segment = "p".repeat(160);
  252 |     let mut group = c.benchmark_group("cache_namespace_derivation");
  253 | 
  254 |     group.bench_function("root", |b| {
  255 |         b.iter(|| black_box(CacheNamespace::root()));
  256 |     });
  257 |     group.bench_with_input(
  258 |         BenchmarkId::new("child", "short"),
  259 |         &"dataset",
  260 |         |b, segment| {
  261 |             b.iter(|| black_box(root.child(black_box(segment))));
  262 |         },
  263 |     );
  264 |     group.bench_with_input(
  265 |         BenchmarkId::new("child", "long"),
  266 |         &long_segment,
  267 |         |b, segment| {
  268 |             b.iter(|| black_box(root.child(black_box(segment))));
  269 |         },
  270 |     );
  271 | 
  272 |     group.finish();
  273 | }
  274 | 
  275 | fn benchmark_cache_operations(c: &mut Criterion) {
  276 |     const CAPACITY: usize = 64 * 1024;
  277 |     const ROTATING_KEYS: u64 = 512;
  278 | 
  279 |     let runtime = tokio::runtime::Runtime::new().unwrap();
  280 |     let prefix = "p".repeat(1024);
  281 |     let legacy = LegacyCache::with_capacity(CAPACITY).with_key_prefix(&prefix);
  282 |     let legacy_weak = LegacyWeakCache::from(&legacy);
  283 |     let fixed = LanceCache::with_capacity(CAPACITY).with_key_prefix(&prefix);
  284 |     let fixed_weak = WeakLanceCache::from(&fixed);
  285 |     let hit_key = PageKey {
  286 |         column_index: 17,
  287 |         page_index: 42,
  288 |     };
  289 |     runtime.block_on(async {
  290 |         legacy.insert(&hit_key, Arc::new(vec![1_u8; 32])).await;
  291 |         fixed
  292 |             .insert_with_key(&hit_key, Arc::new(vec![1_u8; 32]))
  293 |             .await;
  294 |     });
  295 | 
  296 |     let mut group = c.benchmark_group("cache_operations");
  297 |     group.bench_function(BenchmarkId::new("strong_warmed_hit", "legacy"), |b| {
  298 |         b.to_async(&runtime)
  299 |             .iter(|| legacy.get(black_box(&hit_key)));
  300 |     });
  301 |     group.bench_function(BenchmarkId::new("strong_warmed_hit", "fixed"), |b| {
  302 |         b.to_async(&runtime)
  303 |             .iter(|| fixed.get_with_key(black_box(&hit_key)));
  304 |     });
  305 |     group.bench_function(BenchmarkId::new("weak_warmed_hit", "legacy"), |b| {
  306 |         b.to_async(&runtime)
  307 |             .iter(|| legacy_weak.get(black_box(&hit_key)));
  308 |     });
  309 |     group.bench_function(BenchmarkId::new("weak_warmed_hit", "fixed"), |b| {
  310 |         b.to_async(&runtime)
  311 |             .iter(|| fixed_weak.get_with_key(black_box(&hit_key)));
  312 |     });
  313 | 
  314 |     let values: Vec<_> = (0..16).map(|value| Arc::new(vec![value; 32])).collect();
  315 |     let next_legacy_insert = AtomicU64::new(0);
  316 |     group.bench_function(BenchmarkId::new("bounded_rotating_insert", "legacy"), |b| {
  317 |         b.to_async(&runtime).iter(|| {
  318 |             let sequence = next_legacy_insert.fetch_add(1, Ordering::Relaxed);
  319 |             let page_index = sequence % ROTATING_KEYS;
  320 |             let value = Arc::clone(&values[sequence as usize % values.len()]);
  321 |             let legacy = &legacy;
  322 |             async move {
  323 |                 legacy
  324 |                     .insert(
  325 |                         &PageKey {
  326 |                             column_index: 17,
  327 |                             page_index,
  328 |                         },
  329 |                         value,
  330 |                     )
  331 |                     .await;
  332 |             }
  333 |         });
  334 |     });
  335 |     let next_fixed_insert = AtomicU64::new(0);
  336 |     group.bench_function(BenchmarkId::new("bounded_rotating_insert", "fixed"), |b| {
  337 |         b.to_async(&runtime).iter(|| {
  338 |             let sequence = next_fixed_insert.fetch_add(1, Ordering::Relaxed);
  339 |             let page_index = sequence % ROTATING_KEYS;
  340 |             let value = Arc::clone(&values[sequence as usize % values.len()]);
  341 |             let fixed = &fixed;
  342 |             async move {
  343 |                 fixed
  344 |                     .insert_with_key(
  345 |                         &PageKey {
  346 |                             column_index: 17,
  347 |                             page_index,
  348 |                         },
  349 |                         value,
  350 |                     )
  351 |                     .await;
  352 |             }
  353 |         });
  354 |     });
  355 | 
  356 |     group.finish();
  357 | }
  358 | 
  359 | criterion_group!(
  360 |     benches,
  361 |     benchmark_key_preparation,
  362 |     benchmark_namespace_derivation,
  363 |     benchmark_cache_operations
  364 | );
  365 | criterion_main!(benches);
``````
