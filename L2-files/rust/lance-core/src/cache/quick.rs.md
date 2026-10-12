> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/quick.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `e2c9bf639dd3a7fc4bd25c2826402e94c4b927f7bf9fb54fdcc2f5f72a6fab51`. Reviewed physical lines: 1-607.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public synchronous quick_cache-backed implementation of the async cache trait, explicit shard policy, capacity-derived shard sizing, weight accounting and behavioral fixtures for fragmentation and loader recovery. (rust/lance-core/src/cache/quick.rs:1-607)

## Complete range analysis

### Lines 1-18

SPDX/module docs claim quick_cache hits use shard read lock, clone value and mark access without read-operation channel or inline eviction. Those internals are delegated, not implemented in this file. Imports Pin,async_trait,Future,backend types,Moka key footprint,codec/key,Result and memory Context; codec arguments are ignored by this memory-only backend. (rust/lance-core/src/cache/quick.rs:1-18)

### Lines 19-34

Private Clone QuickEntry stores erased Arc and declared usize bytes. Private Clone unit EntryWeighter implements quick_cache::Weighter; weight is max(saturating(key16+declared size),1) castu64. With nonzero fixed key cost, lower-bound1 is normally redundant, but explicit. No u32 quantization as in Moka; backend metadata is not independently added. (rust/lance-core/src/cache/quick.rs:19-34)

### Lines 35-60

Public QuickCacheBackend owns private synchronous Cache<key,QuickEntry,EntryWeighter> and requested capacity. Public Clone/Copy/Debug/Default/Eq/PartialEq QuickCacheShardPolicy is Recommended(default) or Single. Single gives one shared weighted budget to reduce fragmentation among unequal large entries; comments still permit concurrent hit read locks. Backend Debug reports entry_count via len. No Default/Clone for backend itself is declared. (rust/lance-core/src/cache/quick.rs:35-60)

### Lines 61-75

MIN_SHARD_SHARE=4<<30 usize (4GiB) expresses desired shard budget; source warns heavy entries may be silently unadmitted because shards cannot borrow capacity. Public recommended_cache_shards queries available_parallelism, falls back2 on error, then delegates pure sizing. No environment variable override is read here. The constant itself assumes usize can represent4GiB; this file does not demonstrate32-bit target support. (rust/lance-core/src/cache/quick.rs:61-75)

### Lines 76-92

Pure sizing computes by_cpu=floor(parallelism/2), n=max(min(floor(capacity/4GiB),by_cpu),1), rounds down to power-of-two via next_power_of_two/2 when needed, then clamps1..1024. For capacity<4GiB it still returns1, so the doc budget>=4GiB claim has that small-capacity exception. ESTIMATED_AVG_ENTRY_BYTES=64<<10=65536 for preallocation estimates, not actual entry measurement. (rust/lance-core/src/cache/quick.rs:76-92)

### Lines 93-125

with_capacity always selects Recommended. with_shard_policy chooses recommended count or1 then delegates with_shards. Docs describe independent shares and default unpinned-entry admission at approximately97% of one share; this percentage is not locally configured. Example chooses Single for8GiB. Capacity is eviction weight, not a strict total-resident-heap limit. (rust/lance-core/src/cache/quick.rs:93-125)

### Lines 126-145

with_shards estimates item capacity=clamp(floor(capacity/65536),shards*32,1000000), preventing too-few items from changing requested shard count while bounding estimate. Builds dependency options with explicit weight capacity asu64/shards, expects success based on required capacities being supplied, then builds sync Cache with EntryWeighter and two Defaults. It is private; public paths supply valid1..1024 shards. Zero capacity still constructs cache with minimum item estimate; no disabled bypass exists here. (rust/lance-core/src/cache/quick.rs:126-145)

### Lines 146-156

cfg(test) private num_shards and shard_index simply expose dependency internals for collision-targeted fixtures; they are absent from normal public API. Closing brace ends backend constructors. (rust/lance-core/src/cache/quick.rs:146-156)

### Lines 157-172

async_trait get and insert call synchronous dependency operations without any internal await; get extracts entry Arc, insert copies key and stores declared weight. Both ignore codec and insertion supplies no admission/error result to caller. The async interface itself does not make these synchronous cache operations nonblocking. (rust/lance-core/src/cache/quick.rs:157-172)

### Lines 173-191

get_or_insert awaits dependency get_value_or_guard_async. Existing/waited value returns(entry,true) without polling supplied loader. Guard ownership branch awaits loader with ?, then attempts guard.insert with cloned entry and declared size, explicitly ignores insert result and returns original entry,false even if not retained. Failure drops guard through ? without caching a value; cancellation drops live guard as future unwinds by drop. Actual waiter-release mechanics live in quick_cache; local tests exercise expected effects. No zero-capacity special case or CloneableError sharing appears. (rust/lance-core/src/cache/quick.rs:173-191)

### Lines 192-215

clear calls sync clear; async num_entries/size_bytes call len/weight directly with no maintenance await. Synchronous approximations call same APIs. capacity_bytes returns Some(requested capacity), not per-shard share or97% threshold. weightu64->usize casts without checked conversion. Concurrent updates can change observations; wrappers do not create a cross-method snapshot. (rust/lance-core/src/cache/quick.rs:192-215)

### Lines 216-232

deep_size_of_entries returns Some sum from iterator: key16 plus same-context callback result, or declared size fallback. Same shared-buffer convention as Moka; ordinary additions can overflow, no maintenance await or allocator/map metadata account is added. Iteration concurrency guarantees depend on quick_cache. (rust/lance-core/src/cache/quick.rs:216-232)

### Lines 233-267

cfg(test) imports PhantomData,Arc,SeqCst AtomicUsize and high-level CacheKey/LanceCache. TEST_CAPACITY=1000. Generic TestKey<T:static> owns String plus PhantomData, new copies text; CacheKey ValueType=T,key returns borrowed Cow,type_name returns std::any::type_name<T>. It does not define a stable explicit key schema or codec here; CacheKey defaults use type_name as stable_type_id, LEGACY_TEXT schema, framed string write_key and no codec. (rust/lance-core/src/cache/mod.rs:119-150) (rust/lance-core/src/cache/quick.rs:233-267)

### Lines 268-288

Weight fixture checks size7 plus fixed key produces23. Capacity fixture checks1MiB requested capacity via trait. Neither measures actual resident allocation. (rust/lance-core/src/cache/quick.rs:268-288)

### Lines 289-306

keys_in_shard scans u128 values from0, converts each to canonical LE16-byte key, tests dependency shard_index and collects until requested count. Caller assumes shard exists and count>0; count0 has no early return and would not satisfy the equality after first push. Final unreachable covers impossible exhaustion by assumption. Only small valid calls appear here. (rust/lance-core/src/cache/quick.rs:289-306)

### Lines 307-328

load_declared_value calls low-level get_or_insert with a loader that increments SeqCst counter and returns Arc<usize> plus arbitrary declared bytes. It checks decoded value then returns entry; it discards cache-hit flag. This allows capacity experiments without allocating actual payload-sized buffers. (rust/lance-core/src/cache/quick.rs:307-328)

### Lines 329-342

Pure sizing tests check8GiB/4threads=>2 versus one byte less=>1,16GiB/8threads=>4 versus one byte less=>2. These exercise capacity boundaries independently of real host CPU count; no low-capacity/error-fallback/1024-clamp case is asserted here. (rust/lance-core/src/cache/quick.rs:329-342)

### Lines 343-373

Fragmentation fixture uses declared sizes168,188,256 plus three16-byte keys=660 under1000 budget, forces all three keys to shard0 of two shards (share500), loops3times and expects loads>3,entries<3,total<=1000. Single policy using same keys loads exactly3,retains3,weight660. It demonstrates a source test for budget fragmentation without a latency benchmark. (rust/lance-core/src/cache/quick.rs:343-373)

### Lines 374-387

Direct insert fixture repeats those sizes in targeted shard0 for2 versus1 shards and expects retained counts2 versus3 while total weight<=1000. It verifies the declared expected admission/eviction result, not which exact keys survive or arbitrary replacement policy. (rust/lance-core/src/cache/quick.rs:374-387)

### Lines 388-412

Single-shard1000 fixture checks size954+key16=970 admitted while955+16=971 rejected under documented97% hot target, clearing between. Then three distinct entries declared384 (weight400 each) overfill1200 and repeated loads must exceed3 while reported bytes<=1000. Single policy does not remove admission cutoff or capacity eviction. (rust/lance-core/src/cache/quick.rs:388-412)

### Lines 413-441

Two-worker async failure test creates one shard4096, key[42;16],counter,Notify and oneshot start. Owner increments count/signals start, waits notification, then returns Timeout error. Test waits owner start before spawning contender. This explicitly establishes owner is loading, not merely task creation. (rust/lance-core/src/cache/quick.rs:413-441)

### Lines 442-467

Contender loader would increment and return value7/declared8. After one yield test asserts count1, releases owner, asserts owner is_err, then contender succeeds with false flag/value7/count2. It tests retry-after-owner-error rather than sharing the error. A yield is not an explicit proof the contender had already entered its wait; test lacks a timeout here and checks no exact owner error variant/text. (rust/lance-core/src/cache/quick.rs:442-467)

### Lines 468-494

Cancellation test creates one shard4096,key[24;16],counter/start signal. Owner increments/signals then awaits permanently pending future before hypothetical success. Waiting start confirms owner holds the active load before contender task creation. (rust/lance-core/src/cache/quick.rs:468-494)

### Lines 495-525

Contender would load value2/declared8. Test yields,asserts only owner started, aborts owner and requires cancelled JoinError; awaits contender under1-second timeout and checks value2,false flag,count2. This is source coverage of expected guard release on cancellation, not an executed liveness guarantee; yield alone does not prove contender wait registration. (rust/lance-core/src/cache/quick.rs:495-525)

### Lines 526-549

High-level roundtrip fixture constructs1MiB backend/LanceCache and TestKey<Vec<u8>> a, inserts[1,2,3],reads equal vector,approx_size1 and positive weighted bytes. The fixture itself does not expose key/sizing mechanics; those are now documented in LanceCache at rust/lance-core/src/cache/mod.rs:230-248 and rust/lance-core/src/cache/mod.rs:362-402. (rust/lance-core/src/cache/quick.rs:526-549)

### Lines 550-563

Same high-level fixture performs two sequential get_or_insert calls for keyb, asserts[7] both times and load counter1. Despite test name singleflight, this part tests sequential memoization; concurrent recovery is covered separately above. (rust/lance-core/src/cache/quick.rs:550-563)

### Lines 564-580

Then256 distinct16KiB Vec payloads overfill roughly4MiB into1MiB capacity; asserts weight<=capacity and entries<258, clears and asserts size0. It does not prove exact eviction order or a process resident-memory bound. (rust/lance-core/src/cache/quick.rs:564-580)

### Lines 581-607

Tiny-capacity fixture uses64KiB capacity, inserts64 four-KiB Vec payloads, requires bounded weight,at least one entry and a hit on either final key63 or62. Comment mentions avoiding metadata overprovision, but assertions do not directly measure metadata allocation. No zero-capacity independent-loader or deep-size-shared-allocation tests exist in this file. No tests were run during extraction. (rust/lance-core/src/cache/quick.rs:581-607)

## Interaction and interpretation limits

Wrapper logic and source tests are analyzed. quick_cache internal shard read-lock/access marking, admission percentage, guard wakeups, cancellation and eviction are dependency semantics referenced by docs/tests, not fully reconstructed here. No runtime tests or external URLs were used. There is no registry constructor or kind registration in this file; the facade publicly re-exports backend,policy and recommended sizing at rust/lance-core/src/cache/mod.rs:65-65. (rust/lance-core/src/cache/quick.rs:4-6; rust/lance-core/src/cache/quick.rs:61-144; rust/lance-core/src/cache/quick.rs:157-231; rust/lance-core/src/cache/quick.rs:233-607)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! [`CacheBackend`] backed by [quick_cache](https://crates.io/crates/quick_cache).
    5 | //! A hit takes a shard read lock, clones the cached value, and marks it as
    6 | //! accessed. There is no read-operation channel or inline eviction work.
    7 | 
    8 | use std::pin::Pin;
    9 | 
   10 | use async_trait::async_trait;
   11 | use futures::Future;
   12 | 
   13 | use super::backend::{CacheBackend, CacheEntry};
   14 | use super::moka::key_footprint;
   15 | use super::{CacheCodec, InternalCacheKey};
   16 | use crate::Result;
   17 | use crate::deepsize::Context;
   18 | 
   19 | #[derive(Clone)]
   20 | struct QuickEntry {
   21 |     entry: CacheEntry,
   22 |     size_bytes: usize,
   23 | }
   24 | 
   25 | #[derive(Clone)]
   26 | struct EntryWeighter;
   27 | 
   28 | impl quick_cache::Weighter<InternalCacheKey, QuickEntry> for EntryWeighter {
   29 |     fn weight(&self, key: &InternalCacheKey, value: &QuickEntry) -> u64 {
   30 |         // Same accounting as the moka backend.
   31 |         key_footprint(key).saturating_add(value.size_bytes).max(1) as u64
   32 |     }
   33 | }
   34 | 
   35 | pub struct QuickCacheBackend {
   36 |     cache: quick_cache::sync::Cache<InternalCacheKey, QuickEntry, EntryWeighter>,
   37 |     capacity: usize,
   38 | }
   39 | 
   40 | /// Controls how a [`QuickCacheBackend`] divides its weight budget.
   41 | #[derive(Clone, Copy, Debug, Default, Eq, PartialEq)]
   42 | pub enum QuickCacheShardPolicy {
   43 |     /// Choose a shard count from the cache capacity and available parallelism.
   44 |     #[default]
   45 |     Recommended,
   46 |     /// Give every entry access to one shared weight budget.
   47 |     ///
   48 |     /// This avoids capacity fragmentation for a small number of large,
   49 |     /// unequal entries. Concurrent hits can still take the shard read lock.
   50 |     Single,
   51 | }
   52 | 
   53 | impl std::fmt::Debug for QuickCacheBackend {
   54 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   55 |         f.debug_struct("QuickCacheBackend")
   56 |             .field("entry_count", &self.cache.len())
   57 |             .finish()
   58 |     }
   59 | }
   60 | 
   61 | /// Minimum weight budget (4 GiB) per shard: shards don't borrow capacity, and
   62 | /// an entry heavier than ~its shard's budget is silently refused admission.
   63 | const MIN_SHARD_SHARE: usize = 4 << 30;
   64 | 
   65 | /// Recommended shard count: `min(cpus / 2, capacity / 4 GiB)`, power of two
   66 | /// in `[1, 1024]`. The cpu term bounds lock contention; the capacity term
   67 | /// keeps each shard's budget >= 4 GiB so large entries stay admissible.
   68 | /// Rounded down because quick_cache rounds requests up.
   69 | pub fn recommended_cache_shards(capacity: usize) -> usize {
   70 |     let available_parallelism = std::thread::available_parallelism()
   71 |         .map(|n| n.get())
   72 |         .unwrap_or(2);
   73 |     recommended_cache_shards_for_parallelism(capacity, available_parallelism)
   74 | }
   75 | 
   76 | fn recommended_cache_shards_for_parallelism(
   77 |     capacity: usize,
   78 |     available_parallelism: usize,
   79 | ) -> usize {
   80 |     let by_cpu = available_parallelism / 2;
   81 |     let shards = (capacity / MIN_SHARD_SHARE).min(by_cpu).max(1);
   82 |     let shards = if shards.is_power_of_two() {
   83 |         shards
   84 |     } else {
   85 |         shards.next_power_of_two() / 2
   86 |     };
   87 |     shards.clamp(1, 1024)
   88 | }
   89 | 
   90 | /// Assumed average entry size for pre-allocation sizing.
   91 | const ESTIMATED_AVG_ENTRY_BYTES: usize = 64 << 10;
   92 | 
   93 | impl QuickCacheBackend {
   94 |     /// Create a backend holding up to `capacity` bytes of weighted entries
   95 |     /// (weight = key footprint + declared size), sharded per
   96 |     /// [`recommended_cache_shards`].
   97 |     pub fn with_capacity(capacity: usize) -> Self {
   98 |         Self::with_shard_policy(capacity, QuickCacheShardPolicy::Recommended)
   99 |     }
  100 | 
  101 |     /// Create a weighted cache with an explicit shard policy.
  102 |     ///
  103 |     /// `capacity` bounds the sum of key footprints and declared entry sizes.
  104 |     /// Each shard has an independent share of that bound. In addition, the
  105 |     /// default Quick admission policy rejects an unpinned entry heavier than
  106 |     /// approximately 97% of one shard's share.
  107 |     ///
  108 |     /// # Example
  109 |     ///
  110 |     /// ```
  111 |     /// use lance_core::cache::{QuickCacheBackend, QuickCacheShardPolicy};
  112 |     ///
  113 |     /// let cache = QuickCacheBackend::with_shard_policy(
  114 |     ///     8 << 30,
  115 |     ///     QuickCacheShardPolicy::Single,
  116 |     /// );
  117 |     /// ```
  118 |     pub fn with_shard_policy(capacity: usize, shard_policy: QuickCacheShardPolicy) -> Self {
  119 |         let shards = match shard_policy {
  120 |             QuickCacheShardPolicy::Recommended => recommended_cache_shards(capacity),
  121 |             QuickCacheShardPolicy::Single => 1,
  122 |         };
  123 |         Self::with_shards(capacity, shards)
  124 |     }
  125 | 
  126 |     fn with_shards(capacity: usize, shards: usize) -> Self {
  127 |         // Floor protects the shard count from quick_cache's items-per-shard
  128 |         // heuristic; ceiling bounds pre-allocation.
  129 |         let estimated_items = (capacity / ESTIMATED_AVG_ENTRY_BYTES).clamp(shards * 32, 1_000_000);
  130 |         let options = quick_cache::OptionsBuilder::new()
  131 |             .estimated_items_capacity(estimated_items)
  132 |             .weight_capacity(capacity as u64)
  133 |             .shards(shards)
  134 |             .build()
  135 |             // Only errors when weight/item capacity is missing; both are set.
  136 |             .expect("quick_cache options");
  137 |         let cache = quick_cache::sync::Cache::with_options(
  138 |             options,
  139 |             EntryWeighter,
  140 |             Default::default(),
  141 |             Default::default(),
  142 |         );
  143 |         Self { cache, capacity }
  144 |     }
  145 | 
  146 |     #[cfg(test)]
  147 |     fn num_shards(&self) -> usize {
  148 |         self.cache.num_shards()
  149 |     }
  150 | 
  151 |     #[cfg(test)]
  152 |     fn shard_index(&self, key: &InternalCacheKey) -> usize {
  153 |         self.cache.shard_index(key)
  154 |     }
  155 | }
  156 | 
  157 | #[async_trait]
  158 | impl CacheBackend for QuickCacheBackend {
  159 |     async fn get(&self, key: &InternalCacheKey, _codec: Option<CacheCodec>) -> Option<CacheEntry> {
  160 |         self.cache.get(key).map(|v| v.entry)
  161 |     }
  162 | 
  163 |     async fn insert(
  164 |         &self,
  165 |         key: &InternalCacheKey,
  166 |         entry: CacheEntry,
  167 |         size_bytes: usize,
  168 |         _codec: Option<CacheCodec>,
  169 |     ) {
  170 |         self.cache.insert(*key, QuickEntry { entry, size_bytes });
  171 |     }
  172 | 
  173 |     async fn get_or_insert<'a>(
  174 |         &self,
  175 |         key: &InternalCacheKey,
  176 |         loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,
  177 |         _codec: Option<CacheCodec>,
  178 |     ) -> Result<(CacheEntry, bool)> {
  179 |         match self.cache.get_value_or_guard_async(key).await {
  180 |             Ok(value) => Ok((value.entry, true)),
  181 |             Err(guard) => {
  182 |                 let (entry, size_bytes) = loader.await?;
  183 |                 let _ = guard.insert(QuickEntry {
  184 |                     entry: entry.clone(),
  185 |                     size_bytes,
  186 |                 });
  187 |                 Ok((entry, false))
  188 |             }
  189 |         }
  190 |     }
  191 | 
  192 |     async fn clear(&self) {
  193 |         self.cache.clear();
  194 |     }
  195 | 
  196 |     async fn num_entries(&self) -> usize {
  197 |         self.cache.len()
  198 |     }
  199 | 
  200 |     async fn size_bytes(&self) -> usize {
  201 |         self.cache.weight() as usize
  202 |     }
  203 | 
  204 |     fn capacity_bytes(&self) -> Option<usize> {
  205 |         Some(self.capacity)
  206 |     }
  207 | 
  208 |     fn approx_num_entries(&self) -> usize {
  209 |         self.cache.len()
  210 |     }
  211 | 
  212 |     fn approx_size_bytes(&self) -> usize {
  213 |         self.cache.weight() as usize
  214 |     }
  215 | 
  216 |     fn deep_size_of_entries(
  217 |         &self,
  218 |         context: &mut Context,
  219 |         size_of_entry: &dyn Fn(&CacheEntry, &mut Context) -> Option<usize>,
  220 |     ) -> Option<usize> {
  221 |         Some(
  222 |             self.cache
  223 |                 .iter()
  224 |                 .map(|(key, record)| {
  225 |                     key_footprint(&key)
  226 |                         + size_of_entry(&record.entry, context).unwrap_or(record.size_bytes)
  227 |                 })
  228 |                 .sum(),
  229 |         )
  230 |     }
  231 | }
  232 | 
  233 | #[cfg(test)]
  234 | mod tests {
  235 |     use std::marker::PhantomData;
  236 |     use std::sync::Arc;
  237 |     use std::sync::atomic::{AtomicUsize, Ordering};
  238 | 
  239 |     use super::*;
  240 |     use crate::cache::{CacheKey, LanceCache};
  241 | 
  242 |     const TEST_CAPACITY: usize = 1_000;
  243 | 
  244 |     struct TestKey<T: 'static> {
  245 |         key: String,
  246 |         _phantom: PhantomData<T>,
  247 |     }
  248 | 
  249 |     impl<T: 'static> TestKey<T> {
  250 |         fn new(key: &str) -> Self {
  251 |             Self {
  252 |                 key: key.to_string(),
  253 |                 _phantom: PhantomData,
  254 |             }
  255 |         }
  256 |     }
  257 | 
  258 |     impl<T: 'static> CacheKey for TestKey<T> {
  259 |         type ValueType = T;
  260 |         fn key(&self) -> std::borrow::Cow<'_, str> {
  261 |             std::borrow::Cow::Borrowed(&self.key)
  262 |         }
  263 |         fn type_name() -> &'static str {
  264 |             std::any::type_name::<T>()
  265 |         }
  266 |     }
  267 | 
  268 |     #[test]
  269 |     fn entry_weight_includes_fixed_key() {
  270 |         let key = InternalCacheKey::from_bytes([0; 16]);
  271 |         let entry = QuickEntry {
  272 |             entry: Arc::new(()),
  273 |             size_bytes: 7,
  274 |         };
  275 |         assert_eq!(
  276 |             quick_cache::Weighter::weight(&EntryWeighter, &key, &entry),
  277 |             23
  278 |         );
  279 |     }
  280 | 
  281 |     #[test]
  282 |     fn capacity_bytes_reports_configured_capacity() {
  283 |         assert_eq!(
  284 |             QuickCacheBackend::with_capacity(1 << 20).capacity_bytes(),
  285 |             Some(1 << 20)
  286 |         );
  287 |     }
  288 | 
  289 |     fn keys_in_shard(
  290 |         cache: &QuickCacheBackend,
  291 |         shard_index: usize,
  292 |         count: usize,
  293 |     ) -> Vec<InternalCacheKey> {
  294 |         let mut keys = Vec::with_capacity(count);
  295 |         for value in 0_u128.. {
  296 |             let key = InternalCacheKey::from_bytes(value.to_le_bytes());
  297 |             if cache.shard_index(&key) == shard_index {
  298 |                 keys.push(key);
  299 |                 if keys.len() == count {
  300 |                     return keys;
  301 |                 }
  302 |             }
  303 |         }
  304 |         unreachable!("the key space must contain enough keys for every shard")
  305 |     }
  306 | 
  307 |     async fn load_declared_value(
  308 |         cache: &QuickCacheBackend,
  309 |         key: &InternalCacheKey,
  310 |         value: usize,
  311 |         size_bytes: usize,
  312 |         loads: &AtomicUsize,
  313 |     ) -> CacheEntry {
  314 |         let (entry, _) = cache
  315 |             .get_or_insert(
  316 |                 key,
  317 |                 Box::pin(async {
  318 |                     loads.fetch_add(1, Ordering::SeqCst);
  319 |                     Ok((Arc::new(value) as CacheEntry, size_bytes))
  320 |                 }),
  321 |                 None,
  322 |             )
  323 |             .await
  324 |             .unwrap();
  325 |         assert_eq!(*entry.downcast_ref::<usize>().unwrap(), value);
  326 |         entry
  327 |     }
  328 | 
  329 |     #[test]
  330 |     fn recommended_shards_cover_large_capacity_boundaries() {
  331 |         assert_eq!(recommended_cache_shards_for_parallelism(8 << 30, 4), 2);
  332 |         assert_eq!(
  333 |             recommended_cache_shards_for_parallelism((8 << 30) - 1, 4),
  334 |             1
  335 |         );
  336 |         assert_eq!(recommended_cache_shards_for_parallelism(16 << 30, 8), 4);
  337 |         assert_eq!(
  338 |             recommended_cache_shards_for_parallelism((16 << 30) - 1, 8),
  339 |             2
  340 |         );
  341 |     }
  342 | 
  343 |     #[tokio::test]
  344 |     async fn single_shard_avoids_fragmentation_for_unequal_entries() {
  345 |         // Declared entry weights, including the 16-byte key, total 660. They
  346 |         // fit the whole cache but not one 500-byte share of a two-shard cache.
  347 |         let sizes = [168, 188, 256];
  348 |         let sharded = QuickCacheBackend::with_shards(TEST_CAPACITY, 2);
  349 |         assert_eq!(sharded.num_shards(), 2);
  350 |         let sharded_keys = keys_in_shard(&sharded, 0, sizes.len());
  351 |         let sharded_loads = AtomicUsize::new(0);
  352 |         for _ in 0..3 {
  353 |             for (value, (key, size_bytes)) in sharded_keys.iter().zip(sizes).enumerate() {
  354 |                 load_declared_value(&sharded, key, value, size_bytes, &sharded_loads).await;
  355 |             }
  356 |         }
  357 |         assert!(sharded_loads.load(Ordering::SeqCst) > sizes.len());
  358 |         assert!(sharded.num_entries().await < sizes.len());
  359 |         assert!(sharded.size_bytes().await <= TEST_CAPACITY);
  360 | 
  361 |         let single =
  362 |             QuickCacheBackend::with_shard_policy(TEST_CAPACITY, QuickCacheShardPolicy::Single);
  363 |         let single_loads = AtomicUsize::new(0);
  364 |         for _ in 0..3 {
  365 |             for (value, (key, size_bytes)) in sharded_keys.iter().zip(sizes).enumerate() {
  366 |                 load_declared_value(&single, key, value, size_bytes, &single_loads).await;
  367 |             }
  368 |         }
  369 |         assert_eq!(single_loads.load(Ordering::SeqCst), sizes.len());
  370 |         assert_eq!(single.num_entries().await, sizes.len());
  371 |         assert_eq!(single.size_bytes().await, 660);
  372 |     }
  373 | 
  374 |     #[tokio::test]
  375 |     async fn direct_insert_obeys_the_same_shard_budget() {
  376 |         let sizes = [168, 188, 256];
  377 |         for (shards, expected_entries) in [(2, 2), (1, 3)] {
  378 |             let cache = QuickCacheBackend::with_shards(TEST_CAPACITY, shards);
  379 |             let keys = keys_in_shard(&cache, 0, sizes.len());
  380 |             for (value, (key, size_bytes)) in keys.iter().zip(sizes).enumerate() {
  381 |                 cache.insert(key, Arc::new(value), size_bytes, None).await;
  382 |             }
  383 |             assert_eq!(cache.num_entries().await, expected_entries);
  384 |             assert!(cache.size_bytes().await <= TEST_CAPACITY);
  385 |         }
  386 |     }
  387 | 
  388 |     #[tokio::test]
  389 |     async fn single_shard_preserves_capacity_and_hot_admission_limits() {
  390 |         let cache = QuickCacheBackend::with_shards(TEST_CAPACITY, 1);
  391 |         let keys = keys_in_shard(&cache, 0, 4);
  392 | 
  393 |         // The default hot target is 97% of capacity. Weight includes the key,
  394 |         // so a declared size of 954 is admitted at weight 970, while 955 is not.
  395 |         cache.insert(&keys[0], Arc::new(0_usize), 954, None).await;
  396 |         assert!(cache.get(&keys[0], None).await.is_some());
  397 |         cache.clear().await;
  398 |         cache.insert(&keys[1], Arc::new(1_usize), 955, None).await;
  399 |         assert!(cache.get(&keys[1], None).await.is_none());
  400 | 
  401 |         // Individually admissible entries whose working set exceeds the total
  402 |         // budget must still reload and remain bounded.
  403 |         let loads = AtomicUsize::new(0);
  404 |         for _ in 0..2 {
  405 |             for (value, key) in keys[1..].iter().enumerate() {
  406 |                 load_declared_value(&cache, key, value, 384, &loads).await;
  407 |             }
  408 |         }
  409 |         assert!(loads.load(Ordering::SeqCst) > 3);
  410 |         assert!(cache.size_bytes().await <= TEST_CAPACITY);
  411 |     }
  412 | 
  413 |     #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
  414 |     async fn concurrent_misses_share_a_load_and_retry_failure() {
  415 |         let cache = Arc::new(QuickCacheBackend::with_shards(4096, 1));
  416 |         let key = InternalCacheKey::from_bytes([42; 16]);
  417 |         let loads = Arc::new(AtomicUsize::new(0));
  418 |         let release = Arc::new(tokio::sync::Notify::new());
  419 |         let (started_tx, started_rx) = tokio::sync::oneshot::channel();
  420 | 
  421 |         let owner = {
  422 |             let cache = cache.clone();
  423 |             let loads = loads.clone();
  424 |             let release = release.clone();
  425 |             tokio::spawn(async move {
  426 |                 cache
  427 |                     .get_or_insert(
  428 |                         &key,
  429 |                         Box::pin(async move {
  430 |                             loads.fetch_add(1, Ordering::SeqCst);
  431 |                             let _ = started_tx.send(());
  432 |                             release.notified().await;
  433 |                             Err(crate::Error::timeout("test loader failed"))
  434 |                         }),
  435 |                         None,
  436 |                     )
  437 |                     .await
  438 |             })
  439 |         };
  440 |         started_rx.await.unwrap();
  441 | 
  442 |         let contender = {
  443 |             let cache = cache.clone();
  444 |             let loads = loads.clone();
  445 |             tokio::spawn(async move {
  446 |                 cache
  447 |                     .get_or_insert(
  448 |                         &key,
  449 |                         Box::pin(async move {
  450 |                             loads.fetch_add(1, Ordering::SeqCst);
  451 |                             Ok((Arc::new(7_usize) as CacheEntry, 8))
  452 |                         }),
  453 |                         None,
  454 |                     )
  455 |                     .await
  456 |             })
  457 |         };
  458 |         tokio::task::yield_now().await;
  459 |         assert_eq!(loads.load(Ordering::SeqCst), 1);
  460 |         release.notify_one();
  461 |         assert!(owner.await.unwrap().is_err());
  462 |         let (value, is_hit) = contender.await.unwrap().unwrap();
  463 |         assert_eq!(*value.downcast_ref::<usize>().unwrap(), 7);
  464 |         assert!(!is_hit);
  465 |         assert_eq!(loads.load(Ordering::SeqCst), 2);
  466 |     }
  467 | 
  468 |     #[tokio::test(flavor = "multi_thread", worker_threads = 2)]
  469 |     async fn cancelled_loader_releases_concurrent_miss() {
  470 |         let cache = Arc::new(QuickCacheBackend::with_shards(4096, 1));
  471 |         let key = InternalCacheKey::from_bytes([24; 16]);
  472 |         let loads = Arc::new(AtomicUsize::new(0));
  473 |         let (started_tx, started_rx) = tokio::sync::oneshot::channel();
  474 | 
  475 |         let owner = {
  476 |             let cache = cache.clone();
  477 |             let loads = loads.clone();
  478 |             tokio::spawn(async move {
  479 |                 cache
  480 |                     .get_or_insert(
  481 |                         &key,
  482 |                         Box::pin(async move {
  483 |                             loads.fetch_add(1, Ordering::SeqCst);
  484 |                             let _ = started_tx.send(());
  485 |                             std::future::pending::<()>().await;
  486 |                             Ok((Arc::new(1_usize) as CacheEntry, 8))
  487 |                         }),
  488 |                         None,
  489 |                     )
  490 |                     .await
  491 |             })
  492 |         };
  493 |         started_rx.await.unwrap();
  494 | 
  495 |         let contender = {
  496 |             let cache = cache.clone();
  497 |             let loads = loads.clone();
  498 |             tokio::spawn(async move {
  499 |                 cache
  500 |                     .get_or_insert(
  501 |                         &key,
  502 |                         Box::pin(async move {
  503 |                             loads.fetch_add(1, Ordering::SeqCst);
  504 |                             Ok((Arc::new(2_usize) as CacheEntry, 8))
  505 |                         }),
  506 |                         None,
  507 |                     )
  508 |                     .await
  509 |             })
  510 |         };
  511 |         tokio::task::yield_now().await;
  512 |         assert_eq!(loads.load(Ordering::SeqCst), 1);
  513 | 
  514 |         owner.abort();
  515 |         assert!(owner.await.unwrap_err().is_cancelled());
  516 |         let (value, is_hit) = tokio::time::timeout(std::time::Duration::from_secs(1), contender)
  517 |             .await
  518 |             .expect("contender remained blocked after loader cancellation")
  519 |             .unwrap()
  520 |             .unwrap();
  521 |         assert_eq!(*value.downcast_ref::<usize>().unwrap(), 2);
  522 |         assert!(!is_hit);
  523 |         assert_eq!(loads.load(Ordering::SeqCst), 2);
  524 |     }
  525 | 
  526 |     #[tokio::test]
  527 |     async fn test_quick_backend_roundtrip_singleflight_and_eviction() {
  528 |         // Capacity must be large relative to one entry: quick_cache shards
  529 |         // its weight budget, and an entry heavier than its shard's share is
  530 |         // not admitted at all.
  531 |         const CAPACITY: usize = 1 << 20;
  532 |         let item = Arc::new(vec![1u8, 2, 3]);
  533 |         let cache = LanceCache::with_backend(Arc::new(QuickCacheBackend::with_capacity(CAPACITY)));
  534 | 
  535 |         // insert + get roundtrip and weighted accounting
  536 |         cache
  537 |             .insert_with_key(&TestKey::<Vec<u8>>::new("a"), item.clone())
  538 |             .await;
  539 |         assert_eq!(
  540 |             cache
  541 |                 .get_with_key(&TestKey::<Vec<u8>>::new("a"))
  542 |                 .await
  543 |                 .as_deref(),
  544 |             Some(&vec![1u8, 2, 3])
  545 |         );
  546 |         assert_eq!(cache.approx_size(), 1);
  547 |         assert!(cache.size_bytes().await > 0);
  548 | 
  549 |         // get_or_insert runs the loader only on a miss
  550 |         let loads = Arc::new(AtomicUsize::new(0));
  551 |         for _ in 0..2 {
  552 |             let loads = loads.clone();
  553 |             let value = cache
  554 |                 .get_or_insert_with_key(TestKey::<Vec<u8>>::new("b"), || async move {
  555 |                     loads.fetch_add(1, Ordering::SeqCst);
  556 |                     Ok(vec![7u8])
  557 |                 })
  558 |                 .await
  559 |                 .unwrap();
  560 |             assert_eq!(value.as_ref(), &vec![7u8]);
  561 |         }
  562 |         assert_eq!(loads.load(Ordering::SeqCst), 1);
  563 | 
  564 |         // capacity is enforced: overfill with 4x capacity of 16KiB entries
  565 |         // and confirm eviction kept the weighted size within budget
  566 |         for i in 0..256 {
  567 |             cache
  568 |                 .insert_with_key(
  569 |                     &TestKey::<Vec<u8>>::new(&format!("fill-{i}")),
  570 |                     Arc::new(vec![0u8; 16 << 10]),
  571 |                 )
  572 |                 .await;
  573 |         }
  574 |         assert!(cache.size_bytes().await <= CAPACITY);
  575 |         assert!(cache.size().await < 258);
  576 | 
  577 |         cache.clear().await;
  578 |         assert_eq!(cache.size().await, 0);
  579 |     }
  580 | 
  581 |     #[tokio::test]
  582 |     async fn test_quick_backend_tiny_capacity() {
  583 |         // A tiny cache must not over-provision item metadata and must still
  584 |         // admit and evict correctly within its weight budget.
  585 |         const CAPACITY: usize = 64 << 10;
  586 |         let cache = LanceCache::with_backend(Arc::new(QuickCacheBackend::with_capacity(CAPACITY)));
  587 |         for i in 0..64 {
  588 |             cache
  589 |                 .insert_with_key(
  590 |                     &TestKey::<Vec<u8>>::new(&format!("k-{i}")),
  591 |                     Arc::new(vec![0u8; 4 << 10]),
  592 |                 )
  593 |                 .await;
  594 |         }
  595 |         assert!(cache.size_bytes().await <= CAPACITY);
  596 |         assert!(cache.size().await >= 1);
  597 |         let hit = cache
  598 |             .get_with_key(&TestKey::<Vec<u8>>::new("k-63"))
  599 |             .await
  600 |             .is_some()
  601 |             || cache
  602 |                 .get_with_key(&TestKey::<Vec<u8>>::new("k-62"))
  603 |                 .await
  604 |                 .is_some();
  605 |         assert!(hit, "recently inserted entries should be resident");
  606 |     }
  607 | }
``````
