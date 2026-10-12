> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/cache/backend.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f0a11f5cf1e4610c9f9f57717f43dac80bda7b03edaafa743b6ad0da18cfa084`. Reviewed physical lines: 1-145.

[Module](../../../../../L1-modules/rust-lance-core-cache.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public async object-safe-style backend interface and type-erased Arc entry alias. It defines storage, eviction/accounting and optional codec contracts consumed by the higher-level cache. (rust/lance-core/src/cache/backend.rs:1-145)

## Complete range analysis

### Lines 1-32

SPDX/module overview directs most callers to LanceCache. Migration docs require opaque16-byte physical keys plus CACHE_KEY_FORMAT namespace and permit codec type-id routing. Prefix invalidation/key inventory are intentionally absent because digests discard logical strings. Documented migrations use with_backend then with_key_prefix, shared-backend clear or namespace rotation, and removal of prefix/keys/inventory methods; none of these higher-level bodies is defined here. (rust/lance-core/src/cache/backend.rs:1-32)

### Lines 33-47

Imports Any/Pin/Arc, async_trait, futures::Future, crate Result/deepsize Context, sibling codec/key. Public CacheEntry=Arc<dyn Any+Send+Sync> erases type while retaining thread-safe shared ownership. Lifetime is the trait-object default rather than a named borrowed payload lifetime. (rust/lance-core/src/cache/backend.rs:33-47)

### Lines 48-66

Public #[async_trait] CacheBackend requires Send+Sync+Debug. get takes &InternalCacheKey and Option<CacheCodec>, returns Option<CacheEntry> with no Result error channel. Docs permit memory backends to ignore codec; None requires in-memory storage because serialization unsupported. Proposed eventual removal of Option is aspiration only. Key construction and type safety are assigned to LanceCache. (rust/lance-core/src/cache/backend.rs:48-66)

### Lines 67-77

Required async insert takes key, owned CacheEntry, declared size_bytes:usize and optional codec and returns unit. Declared size is for eviction; interface does not itself measure, validate, persist or expose insertion errors. (rust/lance-core/src/cache/backend.rs:67-77)

### Lines 78-94

Required async get_or_insert has loader lifetime a separate from self/key: Pin<Box<dyn Future<Output=Result<(CacheEntry,usize)>>+Send+a>>. Result returns(entry,was_cached). Docs expect deduplication for same key unless cache disabled, and define was_cached as entry already present/loader not invoked. Whether waiting on another load is flagged cached must be checked per backend. Errors originate via Result; no cancellation or retry guarantee is specified here. (rust/lance-core/src/cache/backend.rs:78-94)

### Lines 95-103

clear,num_entries,size_bytes are required async methods. clear removes all entries; counts and weighted bytes may flush pending operations according to docs. No prefix/key-specific deletion or key enumeration methods exist. (rust/lance-core/src/cache/backend.rs:95-103)

### Lines 104-119

Synchronous approx_num_entries and approx_size_bytes default to0, explicitly meaning cannot cheaply report, not proof of an empty backend. Approximate bytes is also the DeepSizeOf fallback and can overcount buffers shared between entries. (rust/lance-core/src/cache/backend.rs:104-119)

### Lines 120-126

capacity_bytes defaults None: no fixed capacity or unavailable report. Some capacity can inform callers to skip values that cannot be retained, but this default method neither rejects nor enforces size limits. (rust/lance-core/src/cache/backend.rs:120-126)

### Lines 127-145

deep_size_of_entries takes a mutable shared Context plus borrowed callback(&CacheEntry,&mut Context)->Option<usize>, defaults None. Contract: traversal-capable backends include physical key footprint; callback tracks shared allocations, returning None for unregistered concrete types, in which case backend should use declared eviction size. Default causes LanceCache to use approx_size_bytes. Interface contains no tests or concrete entry traversal. (rust/lance-core/src/cache/backend.rs:127-145)

## Interaction and interpretation limits

Trait declarations and default methods establish requirements only. Concrete result flags and entry sizing are now documented in Moka/Quick and LanceCache; production persistent error handling remains pending. (rust/lance-core/src/cache/moka.rs:124-155; rust/lance-core/src/cache/quick.rs:173-190; rust/lance-core/src/cache/mod.rs:189-248; rust/lance-core/src/cache/mod.rs:446-471) Removed-symbol migration text is current documentation, not an implementation of legacy methods. (rust/lance-core/src/cache/backend.rs:11-31; rust/lance-core/src/cache/backend.rs:45-145)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Backend interface for cache implementors.
    5 | //!
    6 | //! This module defines the trait that custom cache backends must implement,
    7 | //! along with the entry type they operate on. Most callers should
    8 | //! use [`LanceCache`](super::LanceCache) instead of interacting with
    9 | //! backends directly.
   10 | //!
   11 | //! # Migrating custom backends
   12 | //!
   13 | //! Cache keys are opaque 16-byte values. Store
   14 | //! [`InternalCacheKey::as_bytes`] directly instead of decomposing a logical
   15 | //! prefix, key string, and Rust type name. The physical namespace must also
   16 | //! include [`CACHE_KEY_FORMAT`](super::CACHE_KEY_FORMAT), so a future key
   17 | //! protocol produces cold misses instead of aliases. Persistent or tiered
   18 | //! backends can route serializable values with [`CacheCodec::type_id`].
   19 | //!
   20 | //! Prefix invalidation and key inventory are intentionally not part of this
   21 | //! interface: one-way digests cannot support either operation without
   22 | //! retaining the logical strings that fixed-size keys are designed to remove.
   23 | //! Existing callers should migrate removed symbols as follows:
   24 | //! - replace `with_backend_and_prefix(backend, prefix)` with
   25 | //!   [`LanceCache::with_backend`](super::LanceCache::with_backend) followed by
   26 | //!   [`LanceCache::with_key_prefix`](super::LanceCache::with_key_prefix);
   27 | //! - replace `invalidate_prefix` with [`LanceCache::clear`](super::LanceCache::clear)
   28 | //!   when clearing the shared backend is acceptable, or rotate a versioned
   29 | //!   namespace to leave older entries to age out;
   30 | //! - remove uses of `prefix`, `keys`, and session key-inventory methods; opaque
   31 | //!   keys have no readable or enumerable equivalent.
   32 | 
   33 | use std::any::Any;
   34 | use std::pin::Pin;
   35 | use std::sync::Arc;
   36 | 
   37 | use async_trait::async_trait;
   38 | use futures::Future;
   39 | 
   40 | use crate::Result;
   41 | use crate::deepsize::Context;
   42 | 
   43 | use super::{CacheCodec, InternalCacheKey};
   44 | 
   45 | /// A type-erased cache entry.
   46 | pub type CacheEntry = Arc<dyn Any + Send + Sync>;
   47 | 
   48 | /// Low-level pluggable cache backend.
   49 | ///
   50 | /// Implementations store entries keyed by [`InternalCacheKey`] and return
   51 | /// type-erased [`CacheEntry`] values.
   52 | /// [`LanceCache`](super::LanceCache) handles key construction and type safety;
   53 | /// backend authors only need to implement storage and eviction.
   54 | #[async_trait]
   55 | pub trait CacheBackend: Send + Sync + std::fmt::Debug {
   56 |     /// Look up an entry by its key.
   57 |     ///
   58 |     /// `codec` is provided so that persistent backends can deserialize the
   59 |     /// entry from storage. In-memory backends can ignore it. When `codec`
   60 |     /// is `None`, the entry type does not support serialization yet and
   61 |     /// must be stored in-memory.
   62 |     ///
   63 |     /// The goal is for all cache entry types to eventually have codecs,
   64 |     /// at which point the `Option` will be removed.
   65 |     async fn get(&self, key: &InternalCacheKey, codec: Option<CacheCodec>) -> Option<CacheEntry>;
   66 | 
   67 |     /// Store an entry. `size_bytes` is used for eviction accounting.
   68 |     ///
   69 |     /// See [`get`](Self::get) for codec semantics.
   70 |     async fn insert(
   71 |         &self,
   72 |         key: &InternalCacheKey,
   73 |         entry: CacheEntry,
   74 |         size_bytes: usize,
   75 |         codec: Option<CacheCodec>,
   76 |     );
   77 | 
   78 |     /// Get an existing entry or compute it from `loader`.
   79 |     ///
   80 |     /// Implementations should deduplicate concurrent loads for the same key
   81 |     /// so the loader runs at most once, unless caching is disabled. Disabled
   82 |     /// caches may invoke each caller's loader independently.
   83 |     ///
   84 |     /// Returns `(entry, was_cached)` where `was_cached` is `true` if the entry
   85 |     /// was already present in the cache (the loader was not invoked).
   86 |     ///
   87 |     /// See [`get`](Self::get) for codec semantics.
   88 |     async fn get_or_insert<'a>(
   89 |         &self,
   90 |         key: &InternalCacheKey,
   91 |         loader: Pin<Box<dyn Future<Output = Result<(CacheEntry, usize)>> + Send + 'a>>,
   92 |         codec: Option<CacheCodec>,
   93 |     ) -> Result<(CacheEntry, bool)>;
   94 | 
   95 |     /// Remove all entries.
   96 |     async fn clear(&self);
   97 | 
   98 |     /// Number of entries currently stored (may flush pending operations).
   99 |     async fn num_entries(&self) -> usize;
  100 | 
  101 |     /// Total weighted size in bytes of all stored entries (may flush pending operations).
  102 |     async fn size_bytes(&self) -> usize;
  103 | 
  104 |     /// Approximate number of entries, callable from synchronous contexts.
  105 |     /// Backends that cannot provide this cheaply should return 0.
  106 |     fn approx_num_entries(&self) -> usize {
  107 |         0
  108 |     }
  109 | 
  110 |     /// Approximate weighted size in bytes, callable from synchronous contexts.
  111 |     /// Used as a `DeepSizeOf` fallback when exact entry traversal is unavailable.
  112 |     /// Backends that cannot provide this cheaply should return 0.
  113 |     ///
  114 |     /// Assumes entries do not share underlying buffers; if they do, the
  115 |     /// returned total may overcount.
  116 |     fn approx_size_bytes(&self) -> usize {
  117 |         0
  118 |     }
  119 | 
  120 |     /// Weighted capacity in bytes, or `None` when the backend has no fixed
  121 |     /// capacity or cannot report it. Lets callers skip loading entries that
  122 |     /// could never be retained.
  123 |     fn capacity_bytes(&self) -> Option<usize> {
  124 |         None
  125 |     }
  126 | 
  127 |     /// Computes the size of the entries currently held in memory.
  128 |     ///
  129 |     /// `size_of_entry` threads a shared [`Context`] through each value so
  130 |     /// allocations shared by multiple entries are counted once. It returns
  131 |     /// `None` when the value's concrete type was not registered by
  132 |     /// [`LanceCache`](super::LanceCache); implementations should use the
  133 |     /// entry's declared eviction size as a fallback in that case.
  134 |     ///
  135 |     /// Backends that can enumerate their in-memory entries should include the
  136 |     /// physical key footprint in the returned total. The default returns
  137 |     /// `None`, causing `LanceCache` to use [`approx_size_bytes`](Self::approx_size_bytes).
  138 |     fn deep_size_of_entries(
  139 |         &self,
  140 |         _context: &mut Context,
  141 |         _size_of_entry: &dyn Fn(&CacheEntry, &mut Context) -> Option<usize>,
  142 |     ) -> Option<usize> {
  143 |         None
  144 |     }
  145 | }
``````
