> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/moka.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9029e13a735db60851e81c0f2cc2e65eff2cf2b48e43fd36ebc49a2e58232812`. Reviewed physical lines: 1-431.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public in-memory async Moka cache backend with weighted eviction, loader deduplication integration, shared-context memory traversal and built-in configuration constructor. (rust/lance-core/src/cache/moka.rs:1-431)

## Complete range analysis

### Lines 1-17

SPDX and imports bring Pin/Arc,Relaxed AtomicBool,async_trait,Future,core Result/deepsize Context/CloneableError and sibling CacheBackend/CacheEntry/codec/key. Codec type is accepted for interface compatibility but unused in all operation bodies. (rust/lance-core/src/cache/moka.rs:1-17)

### Lines 18-33

Private Clone/Debug MokaCacheEntry stores erased Arc entry and caller-declared usize size_bytes. Parent-visible key_footprint returns size_of<InternalCacheKey>(), independent of key value (16 bytes established by key.rs). physical_size saturating-adds that footprint to declared payload size. It omits backend map/record/Arc bookkeeping unless caller declaration includes it; saturation prevents addition wrap at usize maximum. (rust/lance-core/src/cache/moka.rs:18-33)

### Lines 34-48

weight_unit(capacity)=max(ceil(capacity/u32::MAX),1) bytes per unit. entry_weight=ceil(saturating(key16+size)/unit), converting to u32 or clamping to u32::MAX. Through capacity<=u32::MAX,unit1 gives exact declared byte granularity; larger capacities use rounded weights. Oversized values can hit the u32 cap, so this is not an unconditional exact physical-byte upper-bound proof. (rust/lance-core/src/cache/moka.rs:34-48)

### Lines 49-66

Public MokaCacheBackend owns private moka::future::Cache<InternalCacheKey,MokaCacheEntry>,requested capacity and unit. Docs promise weighted eviction and concurrent-load dedup for nonzero capacity, independent loads for zero. Debug reports only entry_count without awaiting maintenance, not configured capacity/bytes. There is no Clone/Default derive here. (rust/lance-core/src/cache/moka.rs:49-66)

### Lines 67-83

with_capacity computes unit then capacity_weight=ceil(capacity/unit) as u64, constructs Moka builder max_capacity and capturing weigher, and stores requested capacity. Under coarse units, represented budget capacity_weight*unit may round above requested bytes by less than a unit, while each unsaturated entry also rounds up. No option validation or actual memory allocation limit is imposed by this wrapper. (rust/lance-core/src/cache/moka.rs:67-83)

### Lines 84-105

no_cache builds Moka Cache::new(0) and stores capacity0/unit1. It differs in construction from weighted with_capacity(0), but both take disabled get_or_insert branch. capacity returns configured byte count. weighted_size_bytes multiplies Moka weighted_size by unit with u64 saturation then converts to usize or usize::MAX; it does not traverse values or flush pending operations. (rust/lance-core/src/cache/moka.rs:84-105)

### Lines 106-123

async_trait implementation get awaits cache.get and extracts erased Arc. insert copies16-byte key and wraps entry/declared weight, awaiting cache.insert. Both ignore codec. Insert has no local zero-capacity short circuit or admission result/error return; Moka handles storage policy. These bodies perform no serialization or disk IO. (rust/lance-core/src/cache/moka.rs:106-123)

### Lines 124-134

get_or_insert takes pinned boxed Send loader future with caller lifetime. capacity==0 directly awaits each caller loader, discards returned size, returns(entry,false), preserving original error and bypassing Moka shared initialization. Thus a disabled pending load cannot force another caller to wait through this wrapper path. (rust/lance-core/src/cache/moka.rs:124-134)

### Lines 135-156

Nonzero path allocates per-call Arc<AtomicBool(false)> and clone; initializer sets true Relaxed when actually polled, then awaits loader, wraps success record or CloneableError. Moka try_get_with deduplicates through dependency. Success flag is inverse of this caller's initializer execution, so a waiter using another caller's value can report cached even if absent at its arrival. Error uses Arc::unwrap_or_clone: sole-owned error preserves original; shared error invokes selective CloneableError semantics. Cancellation/wakeup guarantees require Moka implementation, not this wrapper alone. (rust/lance-core/src/cache/moka.rs:135-156)

### Lines 157-175

clear invalidates all then awaits run_pending_tasks; num_entries and size_bytes also await maintenance before reporting count or rounded weight. num_entries casts u64 count to usize. capacity_bytes returns Some(requested capacity), including0, not internal rounded capacity weight. No prefix-specific clearing exists. (rust/lance-core/src/cache/moka.rs:157-175)

### Lines 176-185

Synchronous approximations return entry_count as usize and weighted_size_bytes without maintenance; comments explicitly warn weighted_size can be stale. These report declared/rounded eviction accounting, not shared-buffer-aware deep allocation totals. (rust/lance-core/src/cache/moka.rs:176-185)

### Lines 186-202

deep_size_of_entries always returns Some(sum) over Moka iter snapshots, adding key footprint and callback(entry,same mutable Context), falling back to record.size_bytes for None. Shared allocation dedup is callback/Context responsibility. Ordinary +/sum are not saturating here. Iteration does not await pending maintenance, take an explicit whole-cache snapshot lock or count map/record allocator metadata. Dependency iteration consistency remains pending. (rust/lance-core/src/cache/moka.rs:186-202)

### Lines 203-235

cfg(test) imports pin!,FutureExt/poll and oneshot. Four rstest cases combine with_capacity(0)/no_cache and second-loader success/failure. First same-key loader waits for release after being polled Pending, setting up a direct independence test rather than merely checking eventual results. (rust/lance-core/src/cache/moka.rs:203-235)

### Lines 236-270

Second disabled loader must resolve under now_or_never while first remains blocked; error case checks InvalidInput and text, success checks Arc pointer identity and false flag. Release first, assert its Arc identity/false flag, then absent lookup/count0/size0. This tests both zero-capacity constructors and avoids asserting external dedup behavior. (rust/lance-core/src/cache/moka.rs:236-270)

### Lines 271-286

Weight test asserts unit1 at4096 and declared7+key16=>weight23. Capacity test asserts4096 and no_cache0 via trait capacity_bytes. It does not exercise u32 saturation or coarse-unit boundary rounding. (rust/lance-core/src/cache/moka.rs:271-286)

### Lines 287-300

Async accounting test inserts unit payload declared7, computes physical_size and expects both maintained size_bytes and subsequent approx_size_bytes equal. Name says constant-time accounting; the test checks values, not timing/asymptotic runtime. (rust/lance-core/src/cache/moka.rs:287-300)

### Lines 301-316

64-bit-only test uses capacity6GiB=>unit2 and payload u32::MAX+1024, asserting ceil physical/unit and non-saturated u32 result. No large payload allocation occurs (only arithmetic). It does not test actual large-entry retention. First test module ends before later production constructor code, despite guide preference for one trailing test block. (rust/lance-core/src/cache/moka.rs:301-316)

### Lines 317-331

MOKA_BACKEND_KIND is pub inside private moka and is not re-exported by the facade; it is literal moka, resolving registry's imported identity. Parent-visible build_moka_backend returns concrete MokaCacheBackend from BackendConfig and documents only required nonempty capacity as usize, rejecting all unknown options. It does not inspect config.kind itself; normal registry dispatch validates kind separately. Public facade selection: rust/lance-core/src/cache/mod.rs:48-66. (rust/lance-core/src/cache/moka.rs:317-331)

### Lines 332-355

Constructor iterates unordered option map: capacity empty gives distinct InvalidInput; otherwise parse::<usize> with no trimming/unit suffix processing, wrapping parser error with original value. Any other key including path returns unknown-option InvalidInput. With multiple invalid entries, HashMap iteration can determine which diagnostic appears first. (rust/lance-core/src/cache/moka.rs:332-355)

### Lines 356-367

Missing capacity returns explicit capacity-required URI-example error; valid capacity0 is allowed and builds weighted disabled cache. Parent-visible build_moka wraps concrete constructor result in Arc<dyn CacheBackend>. No default capacity is supplied, so moka:// alone fails. Constructor Result propagates through registry/URI layers. (rust/lance-core/src/cache/moka.rs:356-367)

### Lines 368-393

Separate cfg(test) registry module imports config/URI APIs and serialization lock. Config and URI success tests check concrete backend capacity1048576 then also invoke registry route for successful construction. They hold registry_test_lock to coordinate other mutation tests. (rust/lance-core/src/cache/moka.rs:368-393)

### Lines 394-421

Registry tests reject unknown mystery option, nonnumeric capacity and missing capacity, checking message substrings under serialization lock. These do not assert error variants or exact whole messages. (rust/lance-core/src/cache/moka.rs:394-421)

### Lines 422-431

Final test rejects empty capacity with expected diagnostic substring. Tests omit whitespace/suffix/overflow/negative values, unknown path option, mismatching config.kind direct helper use, nonzero dedup failures and cancellation at this file level. No tests executed during analysis. (rust/lance-core/src/cache/moka.rs:422-431)

## Interaction and interpretation limits

Local wrapper formulas and branching are analyzed. Moka synchronization/admission/eviction internals and cancellation implementation are external dependency behavior; local tests are source assertions, not executed runtime evidence. Declared weights are not actual total heap occupancy. LanceCache dispatch/downcasts are now documented at rust/lance-core/src/cache/mod.rs:362-563; whole-repository consumers remain pending. (rust/lance-core/src/cache/moka.rs:49-201; rust/lance-core/src/cache/moka.rs:203-315; rust/lance-core/src/cache/moka.rs:317-431)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::pin::Pin;
    5 | use std::sync::Arc;
    6 | use std::sync::atomic::{AtomicBool, Ordering};
    7 | 
    8 | use async_trait::async_trait;
    9 | use futures::Future;
   10 | 
   11 | use crate::Result;
   12 | use crate::deepsize::Context;
   13 | use crate::error::CloneableError;
   14 | 
   15 | use super::backend::{CacheBackend, CacheEntry};
   16 | use super::{CacheCodec, InternalCacheKey};
   17 | 
   18 | /// Internal record stored in the moka cache.
   19 | #[derive(Clone, Debug)]
   20 | struct MokaCacheEntry {
   21 |     entry: CacheEntry,
   22 |     size_bytes: usize,
   23 | }
   24 | 
   25 | /// Per-entry key cost for eviction.
   26 | pub(super) fn key_footprint(_key: &InternalCacheKey) -> usize {
   27 |     std::mem::size_of::<InternalCacheKey>()
   28 | }
   29 | 
   30 | fn physical_size(key: &InternalCacheKey, size_bytes: usize) -> usize {
   31 |     key_footprint(key).saturating_add(size_bytes)
   32 | }
   33 | 
   34 | /// Number of physical bytes represented by one Moka weight unit.
   35 | ///
   36 | /// Moka limits each entry's weight to `u32`, so capacities above 4 GiB need
   37 | /// coarser units to account for a single large entry without undercharging it.
   38 | fn weight_unit(capacity: usize) -> usize {
   39 |     capacity.div_ceil(u32::MAX as usize).max(1)
   40 | }
   41 | 
   42 | fn entry_weight(key: &InternalCacheKey, size_bytes: usize, weight_unit: usize) -> u32 {
   43 |     physical_size(key, size_bytes)
   44 |         .div_ceil(weight_unit)
   45 |         .try_into()
   46 |         .unwrap_or(u32::MAX)
   47 | }
   48 | 
   49 | /// Default [`CacheBackend`] backed by a [moka](https://crates.io/crates/moka) cache.
   50 | ///
   51 | /// Nonzero capacities provide weighted eviction and concurrent-load deduplication.
   52 | /// A zero capacity invokes each loader independently without caching.
   53 | pub struct MokaCacheBackend {
   54 |     cache: moka::future::Cache<InternalCacheKey, MokaCacheEntry>,
   55 |     capacity: usize,
   56 |     weight_unit: usize,
   57 | }
   58 | 
   59 | impl std::fmt::Debug for MokaCacheBackend {
   60 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   61 |         f.debug_struct("MokaCacheBackend")
   62 |             .field("entry_count", &self.cache.entry_count())
   63 |             .finish()
   64 |     }
   65 | }
   66 | 
   67 | impl MokaCacheBackend {
   68 |     pub fn with_capacity(capacity: usize) -> Self {
   69 |         let weight_unit = weight_unit(capacity);
   70 |         let capacity_weight = capacity.div_ceil(weight_unit) as u64;
   71 |         let cache = moka::future::Cache::builder()
   72 |             .max_capacity(capacity_weight)
   73 |             .weigher(move |key: &InternalCacheKey, entry: &MokaCacheEntry| {
   74 |                 entry_weight(key, entry.size_bytes, weight_unit)
   75 |             })
   76 |             .build();
   77 |         Self {
   78 |             cache,
   79 |             capacity,
   80 |             weight_unit,
   81 |         }
   82 |     }
   83 | 
   84 |     pub fn no_cache() -> Self {
   85 |         Self {
   86 |             cache: moka::future::Cache::new(0),
   87 |             capacity: 0,
   88 |             weight_unit: 1,
   89 |         }
   90 |     }
   91 | 
   92 |     /// Configured weighted capacity in bytes.
   93 |     pub fn capacity(&self) -> usize {
   94 |         self.capacity
   95 |     }
   96 | 
   97 |     fn weighted_size_bytes(&self) -> usize {
   98 |         self.cache
   99 |             .weighted_size()
  100 |             .saturating_mul(self.weight_unit as u64)
  101 |             .try_into()
  102 |             .unwrap_or(usize::MAX)
  103 |     }
  104 | }
  105 | 
  106 | #[async_trait]
  107 | impl CacheBackend for MokaCacheBackend {
  108 |     async fn get(&self, key: &InternalCacheKey, _codec: Option<CacheCodec>) -> Option<CacheEntry> {
  109 |         self.cache.get(key).await.map(|r| r.entry)
  110 |     }
  111 | 
  112 |     async fn insert(
  113 |         &self,
  114 |         key: &InternalCacheKey,
  115 |         entry: CacheEntry,
  116 |         size_bytes: usize,
  117 |         _codec: Option<CacheCodec>,
  118 |     ) {
  119 |         self.cache
  120 |             .insert(*key, MokaCacheEntry { entry, size_bytes })
  121 |             .await;
  122 |     }
  123 | 
  124 |     async fn get_or_insert<'a>(
  125 |         &self,
  126 |         key: &InternalCacheKey,
  127 |         loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,
  128 |         _codec: Option<CacheCodec>,
  129 |     ) -> Result<(CacheEntry, bool)> {
  130 |         // Avoid Moka's single-flight waiters when nothing can be cached.
  131 |         if self.capacity == 0 {
  132 |             return loader.await.map(|(entry, _)| (entry, false));
  133 |         }
  134 | 
  135 |         // Track whether the loader actually ran (= cache miss).
  136 |         let was_miss = Arc::new(AtomicBool::new(false));
  137 |         let was_miss_clone = was_miss.clone();
  138 | 
  139 |         let init = async move {
  140 |             was_miss_clone.store(true, Ordering::Relaxed);
  141 |             loader
  142 |                 .await
  143 |                 .map(|(entry, size_bytes)| MokaCacheEntry { entry, size_bytes })
  144 |                 .map_err(CloneableError)
  145 |         };
  146 | 
  147 |         let owned_key = *key;
  148 |         match self.cache.try_get_with(owned_key, init).await {
  149 |             Ok(record) => {
  150 |                 let was_cached = !was_miss.load(Ordering::Relaxed);
  151 |                 Ok((record.entry, was_cached))
  152 |             }
  153 |             Err(error) => Err(Arc::unwrap_or_clone(error).0),
  154 |         }
  155 |     }
  156 | 
  157 |     async fn clear(&self) {
  158 |         self.cache.invalidate_all();
  159 |         self.cache.run_pending_tasks().await;
  160 |     }
  161 | 
  162 |     async fn num_entries(&self) -> usize {
  163 |         self.cache.run_pending_tasks().await;
  164 |         self.cache.entry_count() as usize
  165 |     }
  166 | 
  167 |     async fn size_bytes(&self) -> usize {
  168 |         self.cache.run_pending_tasks().await;
  169 |         self.weighted_size_bytes()
  170 |     }
  171 | 
  172 |     fn capacity_bytes(&self) -> Option<usize> {
  173 |         Some(self.capacity)
  174 |     }
  175 | 
  176 |     fn approx_num_entries(&self) -> usize {
  177 |         self.cache.entry_count() as usize
  178 |     }
  179 | 
  180 |     fn approx_size_bytes(&self) -> usize {
  181 |         // `weighted_size()` can be stale without `run_pending_tasks()`, which
  182 |         // is async and can't be called from this synchronous context.
  183 |         self.weighted_size_bytes()
  184 |     }
  185 | 
  186 |     fn deep_size_of_entries(
  187 |         &self,
  188 |         context: &mut Context,
  189 |         size_of_entry: &dyn Fn(&CacheEntry, &mut Context) -> Option<usize>,
  190 |     ) -> Option<usize> {
  191 |         Some(
  192 |             self.cache
  193 |                 .iter()
  194 |                 .map(|(key, record)| {
  195 |                     key_footprint(key.as_ref())
  196 |                         + size_of_entry(&record.entry, context).unwrap_or(record.size_bytes)
  197 |                 })
  198 |                 .sum(),
  199 |         )
  200 |     }
  201 | }
  202 | 
  203 | #[cfg(test)]
  204 | mod tests {
  205 |     use std::pin::pin;
  206 | 
  207 |     use futures::{FutureExt, poll};
  208 |     use tokio::sync::oneshot;
  209 | 
  210 |     use super::*;
  211 | 
  212 |     #[rstest::rstest]
  213 |     #[case::zero_capacity_success(MokaCacheBackend::with_capacity(0), false)]
  214 |     #[case::zero_capacity_error(MokaCacheBackend::with_capacity(0), true)]
  215 |     #[case::no_cache_success(MokaCacheBackend::no_cache(), false)]
  216 |     #[case::no_cache_error(MokaCacheBackend::no_cache(), true)]
  217 |     #[tokio::test]
  218 |     async fn zero_capacity_loaders_run_independently(
  219 |         #[case] backend: MokaCacheBackend,
  220 |         #[case] loader_fails: bool,
  221 |     ) {
  222 |         let key = InternalCacheKey::from_bytes([0; 16]);
  223 |         let first_entry: CacheEntry = Arc::new(1_u64);
  224 |         let second_entry: CacheEntry = Arc::new(2_u64);
  225 |         let (release_tx, release_rx) = oneshot::channel();
  226 |         let entry = first_entry.clone();
  227 |         let mut first = pin!(backend.get_or_insert(
  228 |             &key,
  229 |             Box::pin(async move {
  230 |                 release_rx.await.unwrap();
  231 |                 Ok((entry, 8))
  232 |             }),
  233 |             None,
  234 |         ));
  235 |         assert!(poll!(first.as_mut()).is_pending());
  236 | 
  237 |         let entry = second_entry.clone();
  238 |         let second = backend
  239 |             .get_or_insert(
  240 |                 &key,
  241 |                 Box::pin(async move {
  242 |                     if loader_fails {
  243 |                         Err(crate::Error::invalid_input("independent loader failed"))
  244 |                     } else {
  245 |                         Ok((entry, 8))
  246 |                     }
  247 |                 }),
  248 |                 None,
  249 |             )
  250 |             .now_or_never()
  251 |             .expect("a disabled cache must not wait for another loader on the same key");
  252 |         if loader_fails {
  253 |             let error = second.unwrap_err();
  254 |             assert!(matches!(&error, crate::Error::InvalidInput { .. }));
  255 |             assert!(error.to_string().contains("independent loader failed"));
  256 |         } else {
  257 |             let (entry, was_cached) = second.unwrap();
  258 |             assert!(Arc::ptr_eq(&entry, &second_entry));
  259 |             assert!(!was_cached);
  260 |         }
  261 | 
  262 |         release_tx.send(()).unwrap();
  263 |         let (entry, was_cached) = first.await.unwrap();
  264 |         assert!(Arc::ptr_eq(&entry, &first_entry));
  265 |         assert!(!was_cached);
  266 |         assert!(backend.get(&key, None).await.is_none());
  267 |         assert_eq!(backend.num_entries().await, 0);
  268 |         assert_eq!(backend.size_bytes().await, 0);
  269 |     }
  270 | 
  271 |     #[test]
  272 |     fn entry_weights_are_exact_at_byte_granularity() {
  273 |         let key = InternalCacheKey::from_bytes([0; 16]);
  274 |         assert_eq!(weight_unit(4096), 1);
  275 |         assert_eq!(entry_weight(&key, 7, 1), 23);
  276 |     }
  277 | 
  278 |     #[test]
  279 |     fn capacity_bytes_reports_configured_capacity() {
  280 |         assert_eq!(
  281 |             MokaCacheBackend::with_capacity(4096).capacity_bytes(),
  282 |             Some(4096)
  283 |         );
  284 |         assert_eq!(MokaCacheBackend::no_cache().capacity_bytes(), Some(0));
  285 |     }
  286 | 
  287 |     #[tokio::test]
  288 |     async fn size_methods_use_constant_time_weighted_accounting() {
  289 |         let backend = MokaCacheBackend::with_capacity(4096);
  290 |         let key = InternalCacheKey::from_bytes([0; 16]);
  291 |         let entry: CacheEntry = Arc::new(());
  292 |         let value_size = 7;
  293 |         let expected = physical_size(&key, value_size);
  294 | 
  295 |         backend.insert(&key, entry, value_size, None).await;
  296 | 
  297 |         assert_eq!(backend.size_bytes().await, expected);
  298 |         assert_eq!(backend.approx_size_bytes(), expected);
  299 |     }
  300 | 
  301 |     #[cfg(target_pointer_width = "64")]
  302 |     #[test]
  303 |     fn entry_weights_scale_for_capacities_above_four_gibibytes() {
  304 |         let key = InternalCacheKey::from_bytes([0; 16]);
  305 |         let capacity = 6 * 1024 * 1024 * 1024;
  306 |         let weight_unit = weight_unit(capacity);
  307 |         assert_eq!(weight_unit, 2);
  308 | 
  309 |         let size_bytes = u32::MAX as usize + 1024;
  310 |         let expected = physical_size(&key, size_bytes).div_ceil(weight_unit);
  311 |         let weight = entry_weight(&key, size_bytes, weight_unit);
  312 |         assert_eq!(weight as usize, expected);
  313 |         assert_ne!(weight, u32::MAX);
  314 |     }
  315 | }
  316 | 
  317 | /// Registry identifier for the built-in Moka backend.
  318 | pub const MOKA_BACKEND_KIND: &str = "moka";
  319 | 
  320 | /// [`BackendBuildFn`](super::registry::BackendBuildFn) for [`MokaCacheBackend`].
  321 | ///
  322 | /// Recognized options:
  323 | ///   * `capacity` — total weighted capacity in bytes (`usize`).
  324 | ///     This must be present and non-empty.
  325 | ///
  326 | /// Unknown options are rejected so typos surface immediately instead of
  327 | /// silently falling through to the default capacity.
  328 | pub(super) fn build_moka_backend(
  329 |     config: &super::registry::BackendConfig,
  330 | ) -> Result<MokaCacheBackend> {
  331 |     let mut capacity: Option<usize> = None;
  332 |     for (key, value) in &config.options {
  333 |         match key.as_str() {
  334 |             "capacity" => {
  335 |                 if value.is_empty() {
  336 |                     return Err(crate::Error::invalid_input(
  337 |                         "moka cache backend: capacity must not be empty",
  338 |                     ));
  339 |                 } else {
  340 |                     capacity = Some(value.parse::<usize>().map_err(|err| {
  341 |                         crate::Error::invalid_input(format!(
  342 |                             "moka cache backend: cannot parse capacity {:?}: {}",
  343 |                             value, err
  344 |                         ))
  345 |                     })?);
  346 |                 }
  347 |             }
  348 |             other => {
  349 |                 return Err(crate::Error::invalid_input(format!(
  350 |                     "moka cache backend: unknown option {:?}",
  351 |                     other
  352 |                 )));
  353 |             }
  354 |         }
  355 |     }
  356 |     let capacity = capacity.ok_or_else(|| {
  357 |         crate::Error::invalid_input(
  358 |             "moka cache backend: capacity is required; use moka://?capacity=<bytes>",
  359 |         )
  360 |     })?;
  361 |     Ok(MokaCacheBackend::with_capacity(capacity))
  362 | }
  363 | 
  364 | pub(super) fn build_moka(config: &super::registry::BackendConfig) -> Result<Arc<dyn CacheBackend>> {
  365 |     Ok(Arc::new(build_moka_backend(config)?))
  366 | }
  367 | 
  368 | #[cfg(test)]
  369 | mod moka_registry_tests {
  370 |     use super::super::backend_uri::{build_from_uri, parse_backend_uri};
  371 |     use super::super::registry::{BackendConfig, build_from_config, registry_test_lock};
  372 |     use super::*;
  373 | 
  374 |     #[test]
  375 |     fn test_moka_builds_from_config() {
  376 |         let _lock = registry_test_lock();
  377 |         let cfg = BackendConfig::new("moka")
  378 |             .unwrap()
  379 |             .with_option("capacity", "1048576");
  380 |         let backend = build_moka_backend(&cfg).unwrap();
  381 |         assert_eq!(backend.capacity(), 1048576);
  382 |         let _backend = build_from_config(&cfg).unwrap();
  383 |     }
  384 | 
  385 |     #[test]
  386 |     fn test_moka_builds_from_uri() {
  387 |         let _lock = registry_test_lock();
  388 |         let cfg = parse_backend_uri("moka://?capacity=1048576").unwrap();
  389 |         let backend = build_moka_backend(&cfg).unwrap();
  390 |         assert_eq!(backend.capacity(), 1048576);
  391 |         let _backend = build_from_uri("moka://?capacity=1048576").unwrap();
  392 |     }
  393 | 
  394 |     #[test]
  395 |     fn test_moka_rejects_unknown_option() {
  396 |         let _lock = registry_test_lock();
  397 |         let cfg = BackendConfig::new("moka")
  398 |             .unwrap()
  399 |             .with_option("mystery", "1");
  400 |         let err = build_from_config(&cfg).unwrap_err();
  401 |         assert!(err.to_string().contains("unknown option"));
  402 |     }
  403 | 
  404 |     #[test]
  405 |     fn test_moka_rejects_bad_capacity() {
  406 |         let _lock = registry_test_lock();
  407 |         let cfg = BackendConfig::new("moka")
  408 |             .unwrap()
  409 |             .with_option("capacity", "not-a-number");
  410 |         let err = build_from_config(&cfg).unwrap_err();
  411 |         assert!(err.to_string().contains("cannot parse capacity"));
  412 |     }
  413 | 
  414 |     #[test]
  415 |     fn test_moka_rejects_missing_capacity() {
  416 |         let _lock = registry_test_lock();
  417 |         let cfg = BackendConfig::new("moka").unwrap();
  418 |         let err = build_from_config(&cfg).unwrap_err();
  419 |         assert!(err.to_string().contains("capacity is required"));
  420 |     }
  421 | 
  422 |     #[test]
  423 |     fn test_moka_rejects_empty_capacity() {
  424 |         let _lock = registry_test_lock();
  425 |         let cfg = BackendConfig::new("moka")
  426 |             .unwrap()
  427 |             .with_option("capacity", "");
  428 |         let err = build_from_config(&cfg).unwrap_err();
  429 |         assert!(err.to_string().contains("capacity must not be empty"));
  430 |     }
  431 | }
``````
